import os

os.environ["PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT"] = "0"

from pathlib import Path
from threading import Lock
from typing import Any

from paddleocr import PaddleOCR


_ocr_instance = None
_ocr_lock = Lock()


# =====================================================
# Load PaddleOCR
# =====================================================

def get_ocr_engine() -> PaddleOCR:
    """
    Create the PaddleOCR model only once.

    The first call downloads and loads the required models.
    Later calls reuse the same model.
    """

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
# Bounding-box helpers
# =====================================================

def normalize_rectangle_box(
    box: Any,
) -> list[int] | None:
    """
    Convert a rectangular PaddleOCR box into:

        [left, top, right, bottom]
    """

    if box is None:
        return None

    try:
        values = list(box)

        if len(values) < 4:
            return None

        left = int(float(values[0]))
        top = int(float(values[1]))
        right = int(float(values[2]))
        bottom = int(float(values[3]))

        if right <= left or bottom <= top:
            return None

        return [
            left,
            top,
            right,
            bottom,
        ]

    except (TypeError, ValueError):
        return None


def normalize_polygon_box(
    polygon: Any,
) -> list[int] | None:
    """
    Convert a polygon containing several points into:

        [left, top, right, bottom]
    """

    if polygon is None:
        return None

    try:
        points = list(polygon)

        x_values = []
        y_values = []

        for point in points:
            point_values = list(point)

            if len(point_values) < 2:
                continue

            x_values.append(
                float(point_values[0])
            )

            y_values.append(
                float(point_values[1])
            )

        if not x_values or not y_values:
            return None

        left = int(min(x_values))
        top = int(min(y_values))
        right = int(max(x_values))
        bottom = int(max(y_values))

        if right <= left or bottom <= top:
            return None

        return [
            left,
            top,
            right,
            bottom,
        ]

    except (TypeError, ValueError):
        return None


def get_line_box(
    index: int,
    rectangle_boxes: Any,
    polygon_boxes: Any,
) -> list[int] | None:
    """
    Return a rectangular box for one recognized text line.

    PaddleOCR versions may return either:
        rec_boxes
        rec_polys
    """

    if rectangle_boxes is not None:
        try:
            if index < len(rectangle_boxes):
                normalized_box = normalize_rectangle_box(
                    rectangle_boxes[index]
                )

                if normalized_box is not None:
                    return normalized_box

        except TypeError:
            pass

    if polygon_boxes is not None:
        try:
            if index < len(polygon_boxes):
                normalized_box = normalize_polygon_box(
                    polygon_boxes[index]
                )

                if normalized_box is not None:
                    return normalized_box

        except TypeError:
            pass

    return None


# =====================================================
# Extract prescription text
# =====================================================

def extract_text_from_image(
    image_path: str,
) -> dict[str, Any]:
    """
    Extract text, confidence scores and bounding boxes
    from a prescription image.
    """

    file_path = Path(image_path)

    if not file_path.exists():
        raise FileNotFoundError(
            "Prescription image was not found."
        )

    ocr = get_ocr_engine()

    predictions = ocr.predict(
        str(file_path)
    )

    detected_lines = []

    for prediction in predictions:
        result_json = prediction.json

        # Depending on the PaddleOCR version,
        # results may be stored inside "res".
        result_data = result_json.get(
            "res",
            result_json,
        )

        texts = result_data.get(
            "rec_texts",
            [],
        )

        scores = result_data.get(
            "rec_scores",
            [],
        )

        rectangle_boxes = result_data.get(
            "rec_boxes",
            [],
        )

        polygon_boxes = result_data.get(
            "rec_polys",
            [],
        )

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
            )

            detected_lines.append(
                {
                    "text": cleaned_text,
                    "confidence": confidence,
                    "box": line_box,
                }
            )

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
            )
            / len(detected_lines),
            4,
        )

    lines_with_boxes = sum(
        1
        for line in detected_lines
        if line.get("box") is not None
    )

    return {
        "full_text": full_text,
        "lines": detected_lines,
        "line_count": len(detected_lines),
        "lines_with_boxes": lines_with_boxes,
        "average_confidence": average_confidence,
    }