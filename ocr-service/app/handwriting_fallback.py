import time
from pathlib import Path
from typing import Any

from PIL import Image
from app.medicine_matcher import (
    calculate_match_score,
    extract_strengths,
    get_medication_region,
    should_check_line,
    strip_rx_prefix,
)

from app.handwriting_engine import (
    HANDWRITING_MODEL_NAME,
    recognize_handwritten_line_multi_preprocessing,
)

# How many alternate TrOCR readings to consider per line when
# re-ranking against the real medicine catalog. Higher finds more
# correct-but-not-top-ranked readings, at a small extra CPU cost per
# line (candidates share one generate() call, so this is cheap).
NUM_CANDIDATES_PER_LINE = 3

# A re-ranked candidate only replaces the model's own top choice if
# it scores at least this well against the catalog — otherwise a
# fuzzy match on unrelated text (a signature, a clinic name) could
# get silently swapped in for a poor reason. This mirrors
# medicine_matcher's own MINIMUM_MATCH_SCORE, since a candidate that
# wouldn't pass that bar wouldn't be usable downstream anyway.
MIN_RERANK_SCORE = 82.0


# Maximum number of lines processed by TrOCR in one request.
# This prevents very slow processing on CPU.
MAX_FALLBACK_LINES = 3

# Padding around each PaddleOCR box is proportional to the box's own
# size rather than a fixed pixel amount. A fixed padding either clips
# tall ascenders/descenders (g, y, h, l — common in medicine names) on
# small crops, or wastes context on large ones. These are minimums;
# actual padding scales with box height/width up to a sensible cap.
CROP_PADDING_X_RATIO = 0.03
CROP_PADDING_Y_RATIO = 0.08
MIN_CROP_PADDING_X = 12
MIN_CROP_PADDING_Y = 4
MAX_CROP_PADDING_Y = 12


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
            strip_rx_prefix(item.get("ocr_text", ""))
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

    for line in get_medication_region(ocr_lines):
        original_text = str(
            line.get("text", "")
        ).strip()

        normalized = normalize_text(
            strip_rx_prefix(original_text)
        )

        if not should_check_line(original_text):
            continue

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

    # Prefer lines containing a number before isolated possible brand names.
    candidates.sort(key=lambda item: not any(c.isdigit() for c in item["original_text"]))
    return candidates[:MAX_FALLBACK_LINES]


def pick_best_candidate(
    candidates: list[dict[str, Any]],
    catalog: list[dict[str, Any]] | None,
) -> dict[str, Any]:
    """
    Given several alternate TrOCR readings of the same handwritten
    line (already sorted by the model's own confidence), pick
    whichever one best matches a real medicine in the catalog —
    rather than always trusting the model's single top guess.

    Falls back to the model's top candidate (candidates[0]) if no
    catalog is available, or if nothing scores well enough to be a
    confident correction — this preserves the original behavior for
    lines that genuinely aren't a medicine (a signature, a clinic
    name), instead of forcing a bad catalog match onto them.
    """

    if not candidates:
        return {
            "text": "",
            "confidence": 0.0,
        }

    top_candidate = candidates[0]

    if not catalog:
        return top_candidate

    best_candidate = top_candidate
    best_score = -1.0

    for candidate in candidates:
        text = candidate.get("text", "")

        if not text:
            continue

        # A candidate can only be a genuinely useful correction if it
        # will actually survive medicine_matcher.find_matches' own
        # gate downstream — which requires a cleanly parseable
        # strength (e.g. "500mg"). A candidate that fuzzy-matches
        # well on the name but still garbles the strength (like
        # "s0ong" or "s00mg") would be filtered out later anyway, so
        # don't let it win the re-rank here either.
        if not extract_strengths(text):
            continue

        candidate_score = max(
            (
                calculate_match_score(text, medicine)
                for medicine in catalog
            ),
            default=0.0,
        )

        if candidate_score > best_score:
            best_score = candidate_score
            best_candidate = candidate

    if best_score >= MIN_RERANK_SCORE:
        return best_candidate

    return top_candidate


def run_handwriting_fallback(
    image_path: str,
    ocr_lines: list[dict[str, Any]],
    unmatched_lines: list[dict[str, Any]],
    catalog: list[dict[str, Any]] | None = None,
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
    fallback_started = time.perf_counter()

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

            line_started = time.perf_counter()
            print(f"[OCR] TrOCR line {len(recognized_lines) + 1}/{len(fallback_candidates)}", flush=True)
            try:
                candidates = (
                    recognize_handwritten_line_multi_preprocessing(
                        cropped_line,
                        num_candidates_per_variant=NUM_CANDIDATES_PER_LINE,
                    )
                )

                for candidate_index, candidate_item in enumerate(candidates):
                    print(
                        f"[OCR]   candidate {candidate_index + 1}/{len(candidates)} "
                        f"[{candidate_item.get('preprocessing', '?')}]: "
                        f"{candidate_item.get('text', '')!r} "
                        f"(model confidence: {candidate_item.get('confidence', 0)})",
                        flush=True,
                    )

                trocr_result = pick_best_candidate(
                    candidates,
                    catalog,
                )

                chosen_index = next(
                    (
                        i for i, c in enumerate(candidates)
                        if c is trocr_result
                    ),
                    0,
                )
                print(
                    f"[OCR]   -> picked candidate {chosen_index + 1} "
                    f"(catalog re-ranking {'changed the result' if chosen_index != 0 else 'kept the model top choice'})",
                    flush=True,
                )

                recognized_text = str(
                    trocr_result.get("text", "")
                ).strip()

                if not recognized_text:
                    continue

                recognized_lines.append(
                    {
                        "text": recognized_text,
                        "processing_seconds": round(time.perf_counter() - line_started, 3),
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
                        # Other readings the model considered, in
                        # case the confirming pharmacist wants to see
                        # what else was plausible for a messy word.
                        "alternate_readings": [
                            item["text"]
                            for item in candidates
                            if item is not trocr_result
                        ],
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
        "processing_seconds": round(time.perf_counter() - fallback_started, 3),
        "candidate_count": len(fallback_candidates),
        "line_count": len(successful_lines),
        "lines": successful_lines,
        "requires_confirmation": True,
        "warning": (
            "Handwriting recognition is experimental. "
            "A doctor or pharmacist must confirm every "
            "recognized medicine."
        ),
    }