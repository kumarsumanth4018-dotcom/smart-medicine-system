import math
import os
from pathlib import Path
from threading import Lock
from typing import Any

import torch
from PIL import Image, ImageEnhance, ImageOps
from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel,
)


# =====================================================
# Configuration
# =====================================================

HANDWRITING_MODEL_NAME = os.getenv(
    "HANDWRITING_MODEL_NAME",
    "microsoft/trocr-small-handwritten",
)

HANDWRITING_ENABLED = (
    os.getenv(
        "HANDWRITING_ENABLED",
        "true",
    ).lower()
    == "true"
)

MAX_GENERATED_TOKENS = 64


# =====================================================
# Lazy-loaded model
# =====================================================

_processor: TrOCRProcessor | None = None
_model: VisionEncoderDecoderModel | None = None
_model_lock = Lock()


def get_handwriting_engine() -> tuple[
    TrOCRProcessor,
    VisionEncoderDecoderModel,
]:
    """
    Load the TrOCR handwriting model only once.

    The first call downloads the model from Hugging Face.
    Later calls reuse the same model.
    """

    global _processor
    global _model

    if not HANDWRITING_ENABLED:
        raise RuntimeError(
            "Handwriting fallback is disabled."
        )

    if _processor is None or _model is None:
        with _model_lock:
            if _processor is None or _model is None:
                print(
                    "Loading handwriting model: "
                    f"{HANDWRITING_MODEL_NAME}"
                )

                _processor = (
                    TrOCRProcessor.from_pretrained(
                        HANDWRITING_MODEL_NAME,
                    )
                )

                _model = (
                    VisionEncoderDecoderModel.from_pretrained(
                        HANDWRITING_MODEL_NAME,
                    )
                )

                # This project currently runs on CPU.
                _model.to("cpu")
                _model.eval()

                print(
                    "Handwriting model loaded successfully."
                )

    return _processor, _model


# =====================================================
# Image preparation
# =====================================================

def prepare_handwriting_image(
    image: Image.Image,
) -> Image.Image:
    """
    Prepare one cropped handwritten text line for TrOCR.

    TrOCR performs best when the image contains a single
    handwritten line rather than a complete prescription.
    """

    image = image.convert("RGB")

    # Convert temporarily to grayscale.
    grayscale = ImageOps.grayscale(image)

    # Improve contrast between handwriting and background.
    grayscale = ImageOps.autocontrast(
        grayscale,
        cutoff=1,
    )

    contrast = ImageEnhance.Contrast(grayscale)
    grayscale = contrast.enhance(1.5)

    # Add white padding around the text line.
    padding = 16

    grayscale = ImageOps.expand(
        grayscale,
        border=padding,
        fill="white",
    )

    return grayscale.convert("RGB")


# =====================================================
# Confidence calculation
# =====================================================

def calculate_generation_confidence(
    generation_output: Any,
) -> float:
    """
    Convert the model sequence score into an approximate
    confidence value between zero and one.

    This confidence is only an indication. It is not a
    medical validation score.
    """

    sequence_scores = getattr(
        generation_output,
        "sequences_scores",
        None,
    )

    if sequence_scores is None:
        return 0.0

    if len(sequence_scores) == 0:
        return 0.0

    score = float(
        sequence_scores[0].detach().cpu().item()
    )

    confidence = math.exp(score)

    confidence = max(
        0.0,
        min(confidence, 1.0),
    )

    return round(confidence, 4)


# =====================================================
# Recognize one handwriting line
# =====================================================

def recognize_handwritten_line(
    line_image: Image.Image,
) -> dict[str, Any]:
    """
    Recognize text from one cropped handwritten line.

    Important:
        Do not pass a complete multi-line prescription.
        Pass a cropped image containing one text line.
    """

    processor, model = get_handwriting_engine()

    prepared_image = prepare_handwriting_image(
        line_image
    )

    pixel_values = processor(
        images=prepared_image,
        return_tensors="pt",
    ).pixel_values

    pixel_values = pixel_values.to("cpu")

    with torch.inference_mode():
        generation_output = model.generate(
            pixel_values,
            max_new_tokens=MAX_GENERATED_TOKENS,
            num_beams=2,
            return_dict_in_generate=True,
            output_scores=True,
        )

    generated_text = processor.batch_decode(
        generation_output.sequences,
        skip_special_tokens=True,
    )[0].strip()

    confidence = calculate_generation_confidence(
        generation_output
    )

    return {
        "text": generated_text,
        "confidence": confidence,
        "engine": "TrOCR",
        "model": HANDWRITING_MODEL_NAME,
        "requires_confirmation": True,
    }


# =====================================================
# Test using a cropped image file
# =====================================================

def recognize_handwritten_file(
    image_path: str,
) -> dict[str, Any]:
    """
    Recognize a cropped handwritten line stored as an image.

    This function is mainly provided for independent testing
    before connecting TrOCR with PaddleOCR.
    """

    file_path = Path(image_path)

    if not file_path.exists():
        raise FileNotFoundError(
            "Handwritten line image was not found."
        )

    with Image.open(file_path) as image:
        return recognize_handwritten_line(
            image.copy()
        )