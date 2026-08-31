import asyncio
import os
import time
import tempfile
from pathlib import Path
from typing import Any

from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware

from app.handwriting_fallback import (
    run_handwriting_fallback,
)
from app.medicine_matcher import (
    match_ocr_medicines,
)
from app.ocr_engine import (
    extract_text_from_image,
)


# =====================================================
# FastAPI application
# =====================================================

app = FastAPI(
    title="Smart Medicine OCR Service",
    description=(
        "OCR service for printed and handwritten "
        "prescriptions"
    ),
    version="1.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# Upload configuration
# =====================================================

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_FILE_SIZE = 10 * 1024 * 1024


# =====================================================
# Helper functions
# =====================================================

def normalize_text(value: str) -> str:
    """
    Normalize text for comparing fallback results.
    """

    return " ".join(
        str(value).lower().strip().split()
    )


def empty_handwriting_result() -> dict[str, Any]:
    """
    Return the default handwriting fallback response.
    """

    return {
        "attempted": False,
        "engine": "TrOCR",
        "line_count": 0,
        "lines": [],
        "requires_confirmation": True,
        "warning": (
            "Handwriting fallback was not required."
        ),
    }


def add_handwriting_information(
    handwriting_matching: dict[str, Any],
    handwriting_result: dict[str, Any],
) -> set[str]:
    """
    Mark TrOCR matches and return the original PaddleOCR
    text that was successfully resolved by TrOCR.
    """

    resolved_original_texts: set[str] = set()

    fallback_lines = (
        handwriting_result.get("lines", [])
    )

    fallback_line_lookup = {}

    for line in fallback_lines:
        recognized_text = normalize_text(
            line.get("text", "")
        )

        if recognized_text:
            fallback_line_lookup[
                recognized_text
            ] = line

    for match in handwriting_matching.get(
        "matches",
        [],
    ):
        recognized_text = normalize_text(
            match.get("ocr_text", "")
        )

        fallback_line = fallback_line_lookup.get(
            recognized_text
        )

        match["ocr_engine"] = "TrOCR"
        match["requires_confirmation"] = True

        if not fallback_line:
            continue

        original_text = str(
            fallback_line.get(
                "original_ocr_text",
                "",
            )
        ).strip()

        match["paddle_ocr_text"] = original_text

        match["paddle_ocr_confidence"] = (
            fallback_line.get(
                "original_ocr_confidence",
                0,
            )
        )

        if original_text:
            resolved_original_texts.add(
                normalize_text(original_text)
            )

    return resolved_original_texts


def merge_medicine_matching(
    paddle_matching: dict[str, Any],
    handwriting_matching: dict[str, Any],
    resolved_original_texts: set[str],
) -> dict[str, Any]:
    """
    Merge PaddleOCR catalogue matches with TrOCR catalogue
    matches.

    Original unmatched lines are removed only when TrOCR
    successfully finds a catalogue medicine for them.
    """

    paddle_matches = list(
        paddle_matching.get("matches", [])
    )

    handwriting_matches = list(
        handwriting_matching.get("matches", [])
    )

    combined_matches = (
        paddle_matches + handwriting_matches
    )

    original_unmatched_lines = list(
        paddle_matching.get(
            "unmatched_lines",
            [],
        )
    )

    remaining_unmatched_lines = []

    for item in original_unmatched_lines:
        original_text = normalize_text(
            item.get("ocr_text", "")
        )

        if original_text in resolved_original_texts:
            continue

        remaining_unmatched_lines.append(item)

    catalog_count = max(
        int(
            paddle_matching.get(
                "catalog_count",
                0,
            )
        ),
        int(
            handwriting_matching.get(
                "catalog_count",
                0,
            )
        ),
    )

    return {
        "catalog_available": (
            paddle_matching.get(
                "catalog_available",
                False,
            )
            or handwriting_matching.get(
                "catalog_available",
                False,
            )
        ),
        "catalog_count": catalog_count,
        "matched_line_count": len(
            combined_matches
        ),
        "matches": combined_matches,
        "unmatched_line_count": len(
            remaining_unmatched_lines
        ),
        "unmatched_lines": (
            remaining_unmatched_lines
        ),
        "handwriting_match_count": len(
            handwriting_matches
        ),
        "warning": (
            "OCR candidates are suggestions only. "
            "The customer, doctor or pharmacist must "
            "confirm every medicine."
        ),
    }


# =====================================================
# Basic routes
# =====================================================

@app.get("/")
async def root():
    return {
        "service": "Smart Medicine OCR Service",
        "status": "running",
        "primary_ocr": "PaddleOCR",
        "handwriting_fallback": "TrOCR",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": (
            "OCR service is running successfully"
        ),
        "primary_ocr": "PaddleOCR",
        "handwriting_fallback": "TrOCR",
    }


# =====================================================
# Prescription OCR route
# =====================================================

@app.post("/api/v1/ocr/prescription")
async def scan_prescription(
    file: UploadFile = File(...),
):
    """
    Processing workflow:

    1. Validate the uploaded image.
    2. Run PaddleOCR.
    3. Match PaddleOCR text with the medicine catalogue.
    4. Find medicine-like text unavailable in the catalogue.
    5. Crop those lines using PaddleOCR bounding boxes.
    6. Run TrOCR handwriting recognition on the crops.
    7. Match TrOCR text with the medicine catalogue.
    8. Merge the results for manual confirmation.
    """

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG, PNG and WEBP "
                "images are allowed."
            ),
        )

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=(
                "Image size must not exceed 10 MB."
            ),
        )

    original_suffix = Path(
        file.filename or ""
    ).suffix.lower()

    if original_suffix not in {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }:
        original_suffix = ".jpg"

    temporary_path = None
    timings = {}
    request_started = time.perf_counter()

    try:
        # Save the uploaded image temporarily.
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=original_suffix,
        ) as temporary_file:
            temporary_file.write(image_bytes)
            temporary_path = temporary_file.name

        # =================================================
        # Step 1: PaddleOCR
        # =================================================

        stage_started = time.perf_counter()
        print("[OCR] Reading image with PaddleOCR", flush=True)
        paddle_result = await asyncio.to_thread(
            extract_text_from_image,
            temporary_path,
        )

        # =================================================
        # Step 2: Match PaddleOCR result
        # =================================================

        timings["paddle_ocr_seconds"] = round(time.perf_counter() - stage_started, 3)
        stage_started = time.perf_counter()
        print("[OCR] Loading catalogue and matching", flush=True)
        medicine_matching = (
            await match_ocr_medicines(
                paddle_result["lines"]
            )
        )

        timings["catalogue_and_matching_seconds"] = round(time.perf_counter() - stage_started, 3)
        handwriting_result = (
            empty_handwriting_result()
        )

        handwriting_matching = {
            "catalog_available": False,
            "catalog_count": 0,
            "matched_line_count": 0,
            "matches": [],
            "unmatched_line_count": 0,
            "unmatched_lines": [],
        }

        unmatched_lines = (
            medicine_matching.get(
                "unmatched_lines",
                [],
            )
        )

        # =================================================
        # Step 3: Optional TrOCR fallback
        # =================================================

        stage_started = time.perf_counter()
        if unmatched_lines:
            try:
                handwriting_result = (
                    await asyncio.to_thread(
                        run_handwriting_fallback,
                        temporary_path,
                        paddle_result["lines"],
                        unmatched_lines,
                    )
                )

                handwriting_lines = (
                    handwriting_result.get(
                        "lines",
                        [],
                    )
                )

                if handwriting_lines:
                    handwriting_matching = (
                        await match_ocr_medicines(
                            handwriting_lines
                        )
                    )

                    resolved_original_texts = (
                        add_handwriting_information(
                            handwriting_matching,
                            handwriting_result,
                        )
                    )

                    medicine_matching = (
                        merge_medicine_matching(
                            medicine_matching,
                            handwriting_matching,
                            resolved_original_texts,
                        )
                    )

            except Exception as handwriting_error:
                # PaddleOCR results must still be returned
                # if the optional handwriting model fails.
                print(
                    "Handwriting fallback error: "
                    f"{handwriting_error}"
                )

                handwriting_result = {
                    "attempted": True,
                    "engine": "TrOCR",
                    "line_count": 0,
                    "lines": [],
                    "requires_confirmation": True,
                    "error": str(
                        handwriting_error
                    ),
                    "warning": (
                        "The handwriting fallback failed. "
                        "PaddleOCR results are still "
                        "available."
                    ),
                }

        timings["fallback_and_matching_seconds"] = round(time.perf_counter() - stage_started, 3)
        timings["total_seconds"] = round(time.perf_counter() - request_started, 3)
        print(f"[OCR] Finished: {timings}", flush=True)
        fallback_used = bool(
            handwriting_result.get(
                "attempted",
                False,
            )
        )

        ocr_engine_name = (
            "PaddleOCR + TrOCR"
            if fallback_used
            else "PaddleOCR"
        )

        return {
            "success": True,
            "filename": file.filename,
            "timings": timings,
            "ocr_engine": ocr_engine_name,
            "requires_confirmation": True,
            "result": paddle_result,
            "medicine_matching": (
                medicine_matching
            ),
            "handwriting_fallback": (
                handwriting_result
            ),
            "safety_warning": (
                "OCR can misread prescription text. "
                "Do not purchase or consume medicine "
                "without confirmation from a doctor "
                "or pharmacist."
            ),
        }

    except HTTPException:
        raise

    except Exception as error:
        print(
            f"OCR processing error: {error}"
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process prescription: "
                f"{str(error)}"
            ),
        )

    finally:
        if (
            temporary_path
            and os.path.exists(temporary_path)
        ):
            os.remove(temporary_path)
