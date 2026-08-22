import asyncio
import os
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.medicine_matcher import match_ocr_medicines
from app.ocr_engine import extract_text_from_image


app = FastAPI(
    title="Smart Medicine OCR Service",
    description="OCR service for printed and handwritten prescriptions",
    version="1.0.0",
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


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


@app.get("/")
async def root():
    return {
        "service": "Smart Medicine OCR Service",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "OCR service is running successfully",
    }


@app.post("/api/v1/ocr/prescription")
async def scan_prescription(
    file: UploadFile = File(...),
):
    """
    Upload a prescription image, extract its text,
    and match possible medicines from the main backend.
    """

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed.",
        )

    image_bytes = await file.read()
    await file.close()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image size must not exceed 10 MB.",
        )

    original_suffix = Path(file.filename or "").suffix.lower()

    if original_suffix not in {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }:
        original_suffix = ".jpg"

    temporary_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=original_suffix,
        ) as temporary_file:
            temporary_file.write(image_bytes)
            temporary_path = temporary_file.name

        # OCR processing is CPU-intensive.
        result = await asyncio.to_thread(
            extract_text_from_image,
            temporary_path,
        )

        # Match the extracted lines with medicines from the main backend.
        medicine_matching = await match_ocr_medicines(
            result["lines"]
        )

        return {
            "success": True,
            "filename": file.filename,
            "ocr_engine": "PaddleOCR",
            "requires_confirmation": True,
            "result": result,
            "medicine_matching": medicine_matching,
        }

    except Exception as error:
        print(f"OCR processing error: {error}")

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process prescription: "
                f"{str(error)}"
            ),
        )

    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.remove(temporary_path)