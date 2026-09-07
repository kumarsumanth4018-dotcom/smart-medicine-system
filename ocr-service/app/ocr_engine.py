import os

os.environ["PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT"] = "0"

import re
import tempfile
from pathlib import Path
from threading import Lock
from typing import Any

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from paddleocr import PaddleOCR


_ocr_instance = None
_ocr_lock = Lock()


# =====================================================
# Load PaddleOCR
# =====================================================

def get_ocr_engine() -> PaddleOCR:
    """Create PaddleOCR once and reuse it."""

    global _ocr_instance

    if _ocr_instance is None:
        with _ocr_lock:
            if _ocr_instance is None:
                _ocr_instance = PaddleOCR(
                    lang="en",
                    device="cpu",
                    use_doc_orientation_classify=False,
                    use_doc_unwarping=False,
                    use_textline_orientation=False,
                )

    return _ocr_instance


# =====================================================
# Image enhancement
# =====================================================

def create_enhanced_image(
    image_path: str,
) -> tuple[str, float]:
    """
    Create a larger, grayscale and contrast-enhanced image.

    The returned scale is used to convert OCR boxes back to
    coordinates in the original uploaded image.
    """

    scale = 2.0

    with Image.open(image_path) as source:
        image = ImageOps.exif_transpose(source)
        image = image.convert("RGB")

        new_size = (
            max(1, round(image.width * scale)),
            max(1, round(image.height * scale)),
        )

        image = image.resize(
            new_size,
            Image.Resampling.LANCZOS,
        )

        grayscale = ImageOps.grayscale(image)

        # Stretch faint handwriting without turning the paper
        # background completely black or white.
        grayscale = ImageOps.autocontrast(
            grayscale,
            cutoff=1,
        )

        # Reduce small camera noise while keeping pen strokes.
        grayscale = grayscale.filter(
            ImageFilter.MedianFilter(size=3)
        )

        grayscale = ImageEnhance.Contrast(
            grayscale
        ).enhance(1.35)

        grayscale = grayscale.filter(
            ImageFilter.UnsharpMask(
                radius=1.4,
                percent=150,
                threshold=3,
            )
        )

        temporary_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".png",
        )
        temporary_path = temporary_file.name
        temporary_file.close()

        grayscale.save(
            temporary_path,
            format="PNG",
            optimize=True,
        )

    return temporary_path, scale


# =====================================================
# Bounding-box helpers
# =====================================================

def normalize_rectangle_box(
    box: Any,
    scale: float = 1.0,
) -> list[int] | None:
    if box is None:
        return None

    try:
        values = list(box)

        if len(values) < 4:
            return None

        left = round(float(values[0]) / scale)
        top = round(float(values[1]) / scale)
        right = round(float(values[2]) / scale)
        bottom = round(float(values[3]) / scale)

        if right <= left or bottom <= top:
            return None

        return [left, top, right, bottom]

    except (TypeError, ValueError):
        return None


def normalize_polygon_box(
    polygon: Any,
    scale: float = 1.0,
) -> list[int] | None:
    if polygon is None:
        return None

    try:
        points = list(polygon)
        x_values: list[float] = []
        y_values: list[float] = []

        for point in points:
            point_values = list(point)

            if len(point_values) < 2:
                continue

            x_values.append(
                float(point_values[0]) / scale
            )
            y_values.append(
                float(point_values[1]) / scale
            )

        if not x_values or not y_values:
            return None

        left = round(min(x_values))
        top = round(min(y_values))
        right = round(max(x_values))
        bottom = round(max(y_values))

        if right <= left or bottom <= top:
            return None

        return [left, top, right, bottom]

    except (TypeError, ValueError):
        return None


def get_line_box(
    index: int,
    rectangle_boxes: Any,
    polygon_boxes: Any,
    scale: float = 1.0,
) -> list[int] | None:
    if rectangle_boxes is not None:
        try:
            if index < len(rectangle_boxes):
                result = normalize_rectangle_box(
                    rectangle_boxes[index],
                    scale,
                )

                if result is not None:
                    return result
        except TypeError:
            pass

    if polygon_boxes is not None:
        try:
            if index < len(polygon_boxes):
                result = normalize_polygon_box(
                    polygon_boxes[index],
                    scale,
                )

                if result is not None:
                    return result
        except TypeError:
            pass

    return None


# =====================================================
# PaddleOCR result conversion
# =====================================================

def extract_prediction_lines(
    predictions: Any,
    scale: float,
    source_name: str,
) -> list[dict[str, Any]]:
    detected_lines: list[dict[str, Any]] = []

    for prediction in predictions:
        result_json = prediction.json
        result_data = result_json.get(
            "res",
            result_json,
        )

        texts = result_data.get("rec_texts", [])
        scores = result_data.get("rec_scores", [])
        rectangle_boxes = result_data.get("rec_boxes", [])
        polygon_boxes = result_data.get("rec_polys", [])

        for index, text in enumerate(texts):
            cleaned_text = str(text).strip()

            if not cleaned_text:
                continue

            confidence = 0.0

            if index < len(scores):
                confidence = round(
                    float(scores[index]),
                    4,
                )

            line_box = get_line_box(
                index=index,
                rectangle_boxes=rectangle_boxes,
                polygon_boxes=polygon_boxes,
                scale=scale,
            )

            detected_lines.append(
                {
                    "text": cleaned_text,
                    "confidence": confidence,
                    "box": line_box,
                    "image_variant": source_name,
                }
            )

    return detected_lines


# =====================================================
# Merge original and enhanced detections
# =====================================================

def normalize_for_comparison(value: str) -> str:
    value = str(value).lower()
    value = re.sub(r"[^a-z0-9]+", "", value)
    return value


def box_overlap_ratio(
    first: list[int] | None,
    second: list[int] | None,
) -> float:
    """Intersection divided by the smaller box area."""

    if not first or not second:
        return 0.0

    left = max(first[0], second[0])
    top = max(first[1], second[1])
    right = min(first[2], second[2])
    bottom = min(first[3], second[3])

    if right <= left or bottom <= top:
        return 0.0

    intersection = (right - left) * (bottom - top)
    first_area = (
        (first[2] - first[0]) *
        (first[3] - first[1])
    )
    second_area = (
        (second[2] - second[0]) *
        (second[3] - second[1])
    )

    smaller_area = min(first_area, second_area)

    if smaller_area <= 0:
        return 0.0

    return intersection / smaller_area


def same_detection(
    first: dict[str, Any],
    second: dict[str, Any],
) -> bool:
    first_text = normalize_for_comparison(
        first.get("text", "")
    )
    second_text = normalize_for_comparison(
        second.get("text", "")
    )

    if first_text and first_text == second_text:
        return True

    return box_overlap_ratio(
        first.get("box"),
        second.get("box"),
    ) >= 0.60


def reading_quality(item: dict[str, Any]) -> float:
    """
    Rank competing readings of the same spatial line.

    Confidence remains the main signal. A small enhancement
    bonus breaks near-ties in favour of the clearer image.
    """

    confidence = float(item.get("confidence", 0))
    enhancement_bonus = (
        0.01
        if item.get("image_variant") == "enhanced"
        else 0.0
    )
    text_length_bonus = min(
        len(normalize_for_comparison(item.get("text", ""))),
        50,
    ) * 0.0001

    return confidence + enhancement_bonus + text_length_bonus


def merge_detected_lines(
    original_lines: list[dict[str, Any]],
    enhanced_lines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    merged = [dict(item) for item in original_lines]

    for candidate in enhanced_lines:
        matching_index = None

        for index, existing in enumerate(merged):
            if same_detection(existing, candidate):
                matching_index = index
                break

        if matching_index is None:
            merged.append(dict(candidate))
            continue

        existing = merged[matching_index]

        if reading_quality(candidate) > reading_quality(existing):
            merged[matching_index] = dict(candidate)

    merged.sort(
        key=lambda item: (
            item.get("box", [0, 10**9, 0, 0])[1]
            if item.get("box")
            else 10**9,
            item.get("box", [10**9, 0, 0, 0])[0]
            if item.get("box")
            else 10**9,
        )
    )

    return merged


# =====================================================
# Extract prescription text
# =====================================================

def extract_text_from_image(
    image_path: str,
) -> dict[str, Any]:
    """
    Run PaddleOCR on the original and enhanced prescription.

    The enhanced pass improves faint or small handwriting.
    Results are merged spatially and remain suggestions only.
    """

    file_path = Path(image_path)

    if not file_path.is_file():
        raise FileNotFoundError(
            "Prescription image was not found."
        )

    ocr = get_ocr_engine()
    enhanced_path: str | None = None

    try:
        original_predictions = ocr.predict(
            str(file_path)
        )
        original_lines = extract_prediction_lines(
            predictions=original_predictions,
            scale=1.0,
            source_name="original",
        )

        enhanced_path, enhanced_scale = (
            create_enhanced_image(str(file_path))
        )

        enhanced_predictions = ocr.predict(
            enhanced_path
        )
        enhanced_lines = extract_prediction_lines(
            predictions=enhanced_predictions,
            scale=enhanced_scale,
            source_name="enhanced",
        )

        detected_lines = merge_detected_lines(
            original_lines,
            enhanced_lines,
        )

    finally:
        if (
            enhanced_path
            and os.path.exists(enhanced_path)
        ):
            os.remove(enhanced_path)

    full_text = "\n".join(
        line["text"]
        for line in detected_lines
    )

    average_confidence = 0.0

    if detected_lines:
        average_confidence = round(
            sum(
                line["confidence"]
                for line in detected_lines
            ) / len(detected_lines),
            4,
        )

    lines_with_boxes = sum(
        1
        for line in detected_lines
        if line.get("box") is not None
    )

    enhanced_line_count = sum(
        1
        for line in detected_lines
        if line.get("image_variant") == "enhanced"
    )

    return {
        "full_text": full_text,
        "lines": detected_lines,
        "line_count": len(detected_lines),
        "lines_with_boxes": lines_with_boxes,
        "enhanced_line_count": enhanced_line_count,
        "average_confidence": average_confidence,
    }
