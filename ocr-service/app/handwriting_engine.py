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

# cv2 ships in transitively via paddleocr's own dependencies, so this
# does not add a new requirement. It's only used for adaptive
# thresholding (binarize_image below); if it's ever unavailable for
# some reason, that function falls back to a pure-PIL global Otsu
# threshold instead of failing outright.
try:
    import cv2
    import numpy as np

    _CV2_AVAILABLE = True
except ImportError:
    _CV2_AVAILABLE = False

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


def binarize_image(
    grayscale_image: Image.Image,
) -> Image.Image:
    """
    Separate ink from paper more aggressively than plain contrast
    enhancement — specifically aimed at joined/cursive strokes that
    are faint, and at photographs with uneven lighting (a shadow, a
    fold crease, a slightly yellowed page).

    Uses adaptive (locally-varying) thresholding via cv2 when
    available, which handles uneven lighting far better than a single
    global cutoff — a crease or shadow on one part of the page won't
    wash out ink on another part. Falls back to a pure-PIL global
    Otsu threshold if cv2 isn't importable for some reason.
    """

    if _CV2_AVAILABLE:
        array = np.array(grayscale_image)

        binary = cv2.adaptiveThreshold(
            array,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY,
            blockSize=25,
            C=15,
        )

        return Image.fromarray(binary)

    # Pure-PIL fallback: global Otsu threshold from the histogram.
    histogram = grayscale_image.histogram()
    total = sum(histogram)

    if total == 0:
        return grayscale_image

    sum_all = sum(i * h for i, h in enumerate(histogram))

    sum_background = 0.0
    weight_background = 0
    best_threshold = 0
    best_variance = 0.0

    for t in range(256):
        weight_background += histogram[t]

        if weight_background == 0:
            continue

        weight_foreground = total - weight_background

        if weight_foreground == 0:
            break

        sum_background += t * histogram[t]

        mean_background = sum_background / weight_background
        mean_foreground = (
            (sum_all - sum_background) / weight_foreground
        )

        between_class_variance = (
            weight_background
            * weight_foreground
            * (mean_background - mean_foreground) ** 2
        )

        if between_class_variance > best_variance:
            best_variance = between_class_variance
            best_threshold = t

    return grayscale_image.point(
        lambda p: 255 if p > best_threshold else 0
    )


def prepare_handwriting_image_binarized(
    image: Image.Image,
) -> Image.Image:
    """
    A second preprocessing variant of prepare_handwriting_image, that
    binarizes instead of just enhancing contrast/sharpness. Some
    words read better from a clean binary image (ink vs. no ink);
    others read better from the softer, greyscale version — rather
    than guess which, both variants get tried and the medicine
    catalog re-ranking (pick_best_candidate) decides which result to
    keep.
    """

    image = image.convert("RGB")
    grayscale = ImageOps.grayscale(image)

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

    grayscale = binarize_image(grayscale)

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
    sequence_index: int = 0,
) -> float:
    """
    Convert one candidate sequence's score into an approximate
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

    if len(sequence_scores) <= sequence_index:
        return 0.0

    score = float(
        sequence_scores[sequence_index].detach().cpu().item()
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

def _recognize_prepared_image_candidates(
    prepared_image: Image.Image,
    num_candidates: int = 3,
) -> list[dict[str, Any]]:
    """
    Shared core: run the model on an ALREADY-preprocessed image and
    decode multiple candidate sequences. Both
    recognize_handwritten_line_candidates (plain preprocessing) and
    recognize_handwritten_line_multi_preprocessing (plain +
    binarized) call this so the actual generate()/decode logic exists
    in exactly one place.
    """

    processor, model = get_handwriting_engine()

    pixel_values = processor(
        images=prepared_image,
        return_tensors="pt",
    ).pixel_values

    pixel_values = pixel_values.to("cpu")

    # num_return_sequences cannot exceed num_beams in beam search —
    # cap it so a low HANDWRITING_NUM_BEAMS doesn't error out.
    return_count = max(
        1,
        min(num_candidates, HANDWRITING_NUM_BEAMS),
    )

    with torch.inference_mode():
        generation_output = model.generate(
            pixel_values,
            max_new_tokens=MAX_GENERATED_TOKENS,
            num_beams=HANDWRITING_NUM_BEAMS,
            num_return_sequences=return_count,
            early_stopping=True,
            return_dict_in_generate=True,
            output_scores=True,
        )

    decoded_texts = processor.batch_decode(
        generation_output.sequences,
        skip_special_tokens=True,
    )

    candidates: list[dict[str, Any]] = []

    for index, text in enumerate(decoded_texts):
        cleaned_text = text.strip()

        if not cleaned_text:
            continue

        candidates.append(
            {
                "text": cleaned_text,
                "confidence": calculate_generation_confidence(
                    generation_output,
                    sequence_index=index,
                ),
                "engine": "TrOCR",
                "model": HANDWRITING_MODEL_NAME,
                "requires_confirmation": True,
            }
        )

    return candidates


def recognize_handwritten_line_candidates(
    line_image: Image.Image,
    num_candidates: int = 3,
) -> list[dict[str, Any]]:
    """
    Recognize text from one cropped handwritten line, returning
    MULTIPLE candidate transcriptions rather than just the single
    best one.

    Beam search already explores several plausible readings
    internally before picking a winner — this exposes those
    alternatives instead of discarding them, so a caller that knows
    the valid universe of answers (e.g. a real medicine catalog) can
    pick whichever candidate actually matches a real medicine, rather
    than being stuck with the model's single top guess even when a
    lower-ranked candidate would have been correct.

    Candidates are returned sorted by the model's own confidence,
    most confident first. Do not pass a complete multi-line
    prescription — pass a cropped image containing one text line.
    """

    prepared_image = prepare_handwriting_image(
        line_image
    )

    candidates = _recognize_prepared_image_candidates(
        prepared_image,
        num_candidates=num_candidates,
    )

    candidates.sort(
        key=lambda item: item["confidence"],
        reverse=True,
    )

    return candidates


def recognize_handwritten_line_multi_preprocessing(
    line_image: Image.Image,
    num_candidates_per_variant: int = 3,
) -> list[dict[str, Any]]:
    """
    Like recognize_handwritten_line_candidates, but tries recognition
    on TWO different preprocessing variants of the same crop (plain
    contrast-enhanced, and adaptively binarized) and pools all
    resulting candidates together.

    Some words — especially joined/cursive ones, or crops from a
    photograph with a shadow or fold crease — read better after
    binarization; others read better from the softer grayscale
    version. Rather than commit to one preprocessing choice, both are
    tried and every candidate from both is returned so the medicine
    catalog re-ranking (handwriting_fallback.pick_best_candidate) can
    pick whichever one actually matches a real medicine, regardless
    of which preprocessing path produced it.
    """

    plain_prepared = prepare_handwriting_image(
        line_image
    )
    plain_candidates = _recognize_prepared_image_candidates(
        plain_prepared,
        num_candidates=num_candidates_per_variant,
    )

    for candidate in plain_candidates:
        candidate["preprocessing"] = "contrast_enhanced"

    binarized_prepared = (
        prepare_handwriting_image_binarized(
            line_image
        )
    )
    binarized_candidates = (
        _recognize_prepared_image_candidates(
            binarized_prepared,
            num_candidates=num_candidates_per_variant,
        )
    )

    for candidate in binarized_candidates:
        candidate["preprocessing"] = "binarized"

    all_candidates = plain_candidates + binarized_candidates

    all_candidates.sort(
        key=lambda item: item["confidence"],
        reverse=True,
    )

    return all_candidates


def recognize_handwritten_line(
    line_image: Image.Image,
) -> dict[str, Any]:
    """
    Recognize text from one cropped handwritten line, returning
    only the single best (highest-confidence) candidate.

    Kept for backward compatibility with callers that only need one
    result (e.g. recognize_handwritten_file below). New code that can
    make use of the medicine catalog to pick the best match should
    prefer recognize_handwritten_line_candidates() instead.

    Important:
        Do not pass a complete multi-line prescription.
        Pass a cropped image containing one text line.
    """

    candidates = recognize_handwritten_line_candidates(
        line_image,
        num_candidates=1,
    )

    if candidates:
        return candidates[0]

    return {
        "text": "",
        "confidence": 0.0,
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