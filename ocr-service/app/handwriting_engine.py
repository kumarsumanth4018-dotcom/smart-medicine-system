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

# Pillow moved resampling constants to Image.Resampling in 9.1+ but
# kept the old top-level names as aliases for now; this works across
# both old and new Pillow versions without relying on either alone.
_LANCZOS = getattr(
    getattr(Image, "Resampling", Image),
    "LANCZOS",
)


# =====================================================
# Configuration
# =====================================================

HANDWRITING_MODEL_NAME = os.getenv(
    "HANDWRITING_MODEL_NAME",
    # "base" is ~334M params vs "small"'s ~62M — meaningfully more
    # accurate on messy handwriting at the cost of being slower on CPU.
    # For single cropped prescription lines this is still fast enough
    # (a few seconds per line). Override via env var to go back to
    # "microsoft/trocr-small-handwritten" if speed matters more than
    # accuracy on your machine.
    "microsoft/trocr-base-handwritten",
)

HANDWRITING_ENABLED = (
    os.getenv(
        "HANDWRITING_ENABLED",
        "true",
    ).lower()
    == "true"
)

# Medicine names + dosage (e.g. "Amoxicillin 500mg TDS x 5 days")
# can run longer than typical IAM-dataset training lines — give the
# model more room rather than truncating mid-word.
MAX_GENERATED_TOKENS = 96

# Wider beams read messier handwriting more accurately but cost more
# CPU time per line — tune this to trade accuracy for speed on your
# hardware. 5 can be noticeably slow on a typical dev laptop with the
# base model; 3 is a more balanced default. Override via env var.
HANDWRITING_NUM_BEAMS = int(
    os.getenv(
        "HANDWRITING_NUM_BEAMS",
        "3",
    )
)


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
    handwritten line rather than a complete prescription,
    AND when that line is reasonably tall (it was trained on
    IAM-dataset lines with a decent amount of vertical detail).
    Crops taken directly from small PaddleOCR bounding boxes are
    often only 20-40px tall, which starves the model of detail —
    upscaling before recognition measurably helps here.
    """

    image = image.convert("RGB")

    # Convert temporarily to grayscale.
    grayscale = ImageOps.grayscale(image)

    # Upscale short crops so the model has enough pixel detail to
    # work with. Only scales UP, never down (downscaling a already-
    # large crop would throw away detail for no benefit).
    target_height = 64
    width, height = grayscale.size

    if height > 0 and height < target_height:
        scale = target_height / height
        new_size = (
            max(1, round(width * scale)),
            target_height,
        )
        grayscale = grayscale.resize(
            new_size,
            resample=_LANCZOS,
        )

    # Improve contrast between handwriting and background.
    grayscale = ImageOps.autocontrast(
        grayscale,
        cutoff=1,
    )

    contrast = ImageEnhance.Contrast(grayscale)
    grayscale = contrast.enhance(1.5)

    # A mild sharpen pass helps thin pen strokes stay legible after
    # upscaling/contrast changes, without introducing the harsh
    # artifacts a stronger sharpen filter would.
    sharpness = ImageEnhance.Sharpness(grayscale)
    grayscale = sharpness.enhance(1.6)

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
            # Wider beam search considers more candidate readings
            # before picking one — better accuracy on messy
            # handwriting than a narrow beam, at a CPU cost that
            # scales with the width (tune via HANDWRITING_NUM_BEAMS).
            num_beams=HANDWRITING_NUM_BEAMS,
            early_stopping=True,
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