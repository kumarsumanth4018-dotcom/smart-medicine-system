import re
from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.database.connection import get_database
from app.models.medicine_model import MedicineModel
from app.schemas.medicine_schemas import (
    MedicineCreateRequest,
    MedicineUpdateRequest,
)
from app.core.constants import MEDICINES_COLLECTION, MEDICINE_NOT_FOUND
from app.utils.constants import DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE
from app.utils.logger import logger


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc["_id"])
    doc.pop("_id", None)
    return doc


def _to_object_id(medicine_id: str) -> ObjectId:
    try:
        return ObjectId(medicine_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid medicine id."
        )


async def create_medicine(data: MedicineCreateRequest) -> dict:
    """Add a new medicine to the catalog (Admin only)."""
    db = get_database()

    existing = await db[MEDICINES_COLLECTION].find_one({"pmbi_code": data.pmbi_code})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A medicine with pmbi_code '{data.pmbi_code}' already exists.",
        )

    new_medicine = MedicineModel(**data.dict())
    result = await db[MEDICINES_COLLECTION].insert_one(new_medicine.dict())

    logger.info(f"Medicine created: {data.brand_name} ({result.inserted_id})")

    return {
        "message": "Medicine created successfully.",
        "id": str(result.inserted_id),
    }


async def search_medicines(
    query: Optional[str] = None,
    category: Optional[str] = None,
    page: int = DEFAULT_PAGE,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> dict:
    """
    Search medicines by brand name, generic name, composition, or pmbi_code
    (case-insensitive partial match). Only active medicines are returned.
    """
    db = get_database()

    page = max(page, 1)
    page_size = min(max(page_size, 1), MAX_PAGE_SIZE)

    mongo_filter: dict = {"is_active": {"$ne": False}}

    if query:
        safe_query = re.escape(query.strip())
        mongo_filter["$or"] = [
            {"brand_name": {"$regex": safe_query, "$options": "i"}},
            {"generic_name": {"$regex": safe_query, "$options": "i"}},
            {"composition": {"$regex": safe_query, "$options": "i"}},
            {"pmbi_code": {"$regex": safe_query, "$options": "i"}},
        ]

    if category:
        mongo_filter["category"] = category

    total = await db[MEDICINES_COLLECTION].count_documents(mongo_filter)

    cursor = (
        db[MEDICINES_COLLECTION]
        .find(mongo_filter)
        .skip((page - 1) * page_size)
        .limit(page_size)
        .sort("brand_name", 1)
    )

    results = [_serialize(doc) async for doc in cursor]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "results": results,
    }


async def get_medicine_by_id(medicine_id: str) -> dict:
    db = get_database()
    object_id = _to_object_id(medicine_id)

    medicine = await db[MEDICINES_COLLECTION].find_one({"_id": object_id})
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MEDICINE_NOT_FOUND,
        )

    return _serialize(medicine)


async def get_medicine_by_pmbi_code(pmbi_code: str) -> dict:
    db = get_database()

    medicine = await db[MEDICINES_COLLECTION].find_one({"pmbi_code": pmbi_code})
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MEDICINE_NOT_FOUND,
        )

    return _serialize(medicine)


async def update_medicine(medicine_id: str, data: MedicineUpdateRequest) -> dict:
    db = get_database()
    object_id = _to_object_id(medicine_id)

    update_fields = {k: v for k, v in data.dict(exclude_unset=True).items()}
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update.",
        )

    result = await db[MEDICINES_COLLECTION].update_one(
        {"_id": object_id},
        {"$set": update_fields},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MEDICINE_NOT_FOUND,
        )

    logger.info(f"Medicine updated: {medicine_id}")
    return {"message": "Medicine updated successfully."}


async def delete_medicine(medicine_id: str) -> dict:
    """Soft-delete a medicine (sets is_active=False)."""
    db = get_database()
    object_id = _to_object_id(medicine_id)

    result = await db[MEDICINES_COLLECTION].update_one(
        {"_id": object_id},
        {"$set": {"is_active": False}},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=MEDICINE_NOT_FOUND,
        )

    logger.info(f"Medicine deactivated: {medicine_id}")
    return {"message": "Medicine deleted successfully."}