import os

os.environ["PADDLE_PDX_ENABLE_MKLDNN_BYDEFAULT"] = "0"
from pathlib import Path
from threading import Lock

from paddleocr import PaddleOCR


_ocr_instance = None
_ocr_lock = Lock()


def get_ocr_engine() -> PaddleOCR:
    """
    Create the PaddleOCR model only once.

    The first call downloads and loads the required OCR models.
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


def extract_text_from_image(image_path: str) -> dict:
    """
    Extract text and confidence scores from a prescription image.
    """

    file_path = Path(image_path)

    if not file_path.exists():
        raise FileNotFoundError("Prescription image was not found.")

    ocr = get_ocr_engine()
    predictions = ocr.predict(str(file_path))

    detected_lines = []

    for prediction in predictions:
        result_json = prediction.json

        # Depending on the PaddleOCR version, results may be inside "res".
        result_data = result_json.get("res", result_json)

        texts = result_data.get("rec_texts", [])
        scores = result_data.get("rec_scores", [])

        for index, text in enumerate(texts):
            cleaned_text = str(text).strip()

            if not cleaned_text:
                continue

            confidence = 0.0

            if index < len(scores):
                confidence = round(float(scores[index]), 4)

            detected_lines.append(
                {
                    "text": cleaned_text,
                    "confidence": confidence,
                }
            )

    full_text = "\n".join(
        line["text"] for line in detected_lines
    )

    average_confidence = 0.0

    if detected_lines:
        average_confidence = round(
            sum(line["confidence"] for line in detected_lines)
            / len(detected_lines),
            4,
        )

    return {
        "full_text": full_text,
        "lines": detected_lines,
        "line_count": len(detected_lines),
        "average_confidence": average_confidence,
    }