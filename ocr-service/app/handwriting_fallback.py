from pathlib import Path
from typing import Any

from PIL import Image

from app.handwriting_engine import (
    HANDWRITING_MODEL_NAME,
    recognize_handwritten_line,
)


# Maximum number of lines processed by TrOCR in one request.
# This prevents very slow processing on CPU.
MAX_FALLBACK_LINES = 6

# Padding around each PaddleOCR box is proportional to the box's own
# size rather than a fixed pixel amount. A fixed padding either clips
# tall ascenders/descenders (g, y, h, l — common in medicine names) on
# small crops, or wastes context on large ones. These are minimums;
# actual padding scales with box height/width up to a sensible cap.
CROP_PADDING_X_RATIO = 0.15
CROP_PADDING_Y_RATIO = 0.35
MIN_CROP_PADDING_X = 12
MIN_CROP_PADDING_Y = 10
MAX_CROP_PADDING_Y = 40


def normalize_text(value: str) -> str:
    """
    Normalize text for comparing PaddleOCR lines with
    unmatched catalogue lines.
    """

    return " ".join(
        str(value).lower().strip().split()
    )


def expand_box(
    box: list[int],
    image_width: int,
    image_height: int,
) -> tuple[int, int, int, int] | None:
    """
    Add padding around a PaddleOCR bounding box while
    keeping it inside the prescription image.
    """

    if not isinstance(box, list) or len(box) != 4:
        return None

    try:
        left = int(box[0])
        top = int(box[1])
        right = int(box[2])
        bottom = int(box[3])
    except (TypeError, ValueError):
        return None

    box_width = right - left
    box_height = bottom - top

    padding_x = max(
        MIN_CROP_PADDING_X,
        round(box_width * CROP_PADDING_X_RATIO),
    )
    padding_y = min(
        MAX_CROP_PADDING_Y,
        max(
            MIN_CROP_PADDING_Y,
            round(box_height * CROP_PADDING_Y_RATIO),
        ),
    )

    left = max(
        0,
        left - padding_x,
    )

    top = max(
        0,
        top - padding_y,
    )

    right = min(
        image_width,
        right + padding_x,
    )

    bottom = min(
        image_height,
        bottom + padding_y,
    )

    if right <= left or bottom <= top:
        return None

    return (
        left,
        top,
        right,
        bottom,
    )


def get_unmatched_texts(
    unmatched_lines: list[dict[str, Any]],
) -> set[str]:
    """
    Return normalized OCR text that was recognized as
    medicine-like but was unavailable in the catalogue.
    """

    unmatched_texts = set()

    for item in unmatched_lines:
        text = normalize_text(
            item.get("ocr_text", "")
        )

        if text:
            unmatched_texts.add(text)

    return unmatched_texts


def find_fallback_candidates(
    ocr_lines: list[dict[str, Any]],
    unmatched_lines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Find PaddleOCR lines that should be read again using
    the TrOCR handwriting model.
    """

    unmatched_texts = get_unmatched_texts(
        unmatched_lines
    )

    candidates = []

    for line in ocr_lines:
        original_text = str(
            line.get("text", "")
        ).strip()

        normalized = normalize_text(
            original_text
        )

        if normalized not in unmatched_texts:
            continue

        box = line.get("box")

        if not isinstance(box, list):
            continue

        if len(box) != 4:
            continue

        candidates.append(
            {
                "original_text": original_text,
                "original_confidence": line.get(
                    "confidence",
                    0,
                ),
                "box": box,
            }
        )

        if len(candidates) >= MAX_FALLBACK_LINES:
            break

    return candidates


def run_handwriting_fallback(
    image_path: str,
    ocr_lines: list[dict[str, Any]],
    unmatched_lines: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Crop unmatched medicine-like PaddleOCR lines and read
    them again using Microsoft TrOCR.

    This function is synchronous and CPU-intensive.
    FastAPI must execute it using asyncio.to_thread().
    """

    file_path = Path(image_path)

    if not file_path.exists():
        raise FileNotFoundError(
            "Prescription image was not found."
        )

    fallback_candidates = find_fallback_candidates(
        ocr_lines=ocr_lines,
        unmatched_lines=unmatched_lines,
    )

    if not fallback_candidates:
        return {
            "attempted": False,
            "engine": "TrOCR",
            "line_count": 0,
            "lines": [],
            "warning": (
                "No suitable handwritten line boxes "
                "were available for fallback."
            ),
        }

    recognized_lines = []

    with Image.open(file_path) as prescription_image:
        prescription_image = (
            prescription_image.convert("RGB")
        )

        image_width, image_height = (
            prescription_image.size
        )

        for candidate in fallback_candidates:
            crop_box = expand_box(
                box=candidate["box"],
                image_width=image_width,
                image_height=image_height,
            )

            if crop_box is None:
                continue

            cropped_line = prescription_image.crop(
                crop_box
            )

            try:
                trocr_result = (
                    recognize_handwritten_line(
                        cropped_line
                    )
                )

                recognized_text = str(
                    trocr_result.get("text", "")
                ).strip()

                if not recognized_text:
                    continue

                recognized_lines.append(
                    {
                        "text": recognized_text,
                        "confidence": trocr_result.get(
                            "confidence",
                            0,
                        ),
                        "box": candidate["box"],
                        "original_ocr_text": (
                            candidate["original_text"]
                        ),
                        "original_ocr_confidence": (
                            candidate[
                                "original_confidence"
                            ]
                        ),
                        "engine": "TrOCR",
                        "requires_confirmation": True,
                    }
                )

            except Exception as error:
                recognized_lines.append(
                    {
                        "text": "",
                        "confidence": 0,
                        "box": candidate["box"],
                        "original_ocr_text": (
                            candidate["original_text"]
                        ),
                        "original_ocr_confidence": (
                            candidate[
                                "original_confidence"
                            ]
                        ),
                        "engine": "TrOCR",
                        "requires_confirmation": True,
                        "error": str(error),
                    }
                )

    successful_lines = [
        line
        for line in recognized_lines
        if line.get("text")
    ]

    return {
        "attempted": True,
        "engine": "TrOCR",
        "model": HANDWRITING_MODEL_NAME,
        "line_count": len(successful_lines),
        "lines": successful_lines,
        "requires_confirmation": True,
        "warning": (
            "Handwriting recognition is experimental. "
            "A doctor or pharmacist must confirm every "
            "recognized medicine."
        ),
    }