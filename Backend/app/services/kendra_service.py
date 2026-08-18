from datetime import datetime, timezone
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.database.connection import get_database
from app.core.constants import KENDRAS_COLLECTION, MEDICINES_COLLECTION, BILLS_COLLECTION
from app.schemas.kendra_schemas import RestockRequest, BillRequest
from app.utils.geo import haversine_km
from app.utils.logger import logger

DEFAULT_RADIUS_KM = 5.0


async def _verify_kendra_ownership(kendra_id: str, current_user) -> None:
    """
    ADMIN can manage any Kendra. PHARMACY users can only manage the
    single Kendra they're assigned to (assigned_kendra_id on their
    user document). Looked up fresh from the DB rather than trusting
    the JWT, since the token doesn't carry assigned_kendra_id.
    """
    if current_user.role == "ADMIN":
        return

    db = get_database()
    user = await db.users.find_one({"email": current_user.sub})
    if not user or user.get("assigned_kendra_id") != kendra_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not manage this Kendra.",
        )


def _to_object_id(kendra_id: str) -> ObjectId:
    try:
        return ObjectId(kendra_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid kendra id."
        )


def _serialize_kendra(doc: dict, distance_km: float | None = None) -> dict:
    coords = doc["location"]["coordinates"]  # [lng, lat]
    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "address": doc["address"],
        "phone": doc.get("phone"),
        "rating": doc.get("rating"),
        "longitude": coords[0],
        "latitude": coords[1],
        "distance_km": distance_km,
        "stock": doc.get("stock", []),
    }


async def find_nearby_kendras(
    lat: float,
    lng: float,
    radius_km: float = DEFAULT_RADIUS_KM,
) -> dict:
    """
    Find active Kendras within radius_km of the given point.
    Distance computed in Python (haversine) rather than relying on a
    Mongo geospatial index, so this works the same in any environment.
    """
    db = get_database()

    cursor = db[KENDRAS_COLLECTION].find({"is_active": {"$ne": False}})

    results = []
    async for doc in cursor:
        coords = doc["location"]["coordinates"]
        dist = haversine_km(lat, lng, coords[1], coords[0])
        if dist <= radius_km:
            results.append(_serialize_kendra(doc, distance_km=dist))

    results.sort(key=lambda k: k["distance_km"])

    return {"total": len(results), "results": results}


async def get_kendra_by_id(kendra_id: str) -> dict:
    db = get_database()
    object_id = _to_object_id(kendra_id)

    doc = await db[KENDRAS_COLLECTION].find_one({"_id": object_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kendra not found.",
        )

    return _serialize_kendra(doc)


async def find_medicine_availability(
    pmbi_code: str,
    lat: float,
    lng: float,
    radius_km: float = DEFAULT_RADIUS_KM,
    only_in_stock: bool = True,
) -> list:
    """
    Find Kendras near the given point that stock a specific medicine
    (by pmbi_code), sorted by distance. This is the core
    location-based pharmacy finding feature from the SRS.
    """
    db = get_database()

    cursor = db[KENDRAS_COLLECTION].find({
        "is_active": {"$ne": False},
        "stock.pmbi_code": pmbi_code,
    })

    results = []
    async for doc in cursor:
        coords = doc["location"]["coordinates"]
        dist = haversine_km(lat, lng, coords[1], coords[0])
        if dist > radius_km:
            continue

        stock_item = next(
            (s for s in doc.get("stock", []) if s["pmbi_code"] == pmbi_code),
            None,
        )
        if not stock_item:
            continue
        if only_in_stock and stock_item["total_qty"] <= 0:
            continue

        results.append({
            "kendra_id": str(doc["_id"]),
            "kendra_name": doc["name"],
            "address": doc["address"],
            "phone": doc.get("phone"),
            "latitude": coords[1],
            "longitude": coords[0],
            "distance_km": dist,
            "total_qty": stock_item["total_qty"],
            "status": stock_item["status"],
        })

    results.sort(key=lambda r: r["distance_km"])
    return results


def compute_stock_status(quantity: int) -> str:
    """SRS-defined stock status transitions."""
    if quantity <= 0:
        return "out_of_stock"
    if quantity <= 5:
        return "low_stock"
    return "in_stock"


async def restock_medicine(kendra_id: str, data: RestockRequest, current_user=None) -> dict:
    """
    Add a new batch of stock arriving from the supplier (Pharmacy Owner).
    This is separate from billing — it only ever ADDS stock.
    """
    db = get_database()
    object_id = _to_object_id(kendra_id)

    if current_user is not None:
        await _verify_kendra_ownership(kendra_id, current_user)

    kendra = await db[KENDRAS_COLLECTION].find_one({"_id": object_id})
    if not kendra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kendra not found.",
        )

    stock = kendra.get("stock", [])
    new_batch = {
        "batch_number": data.batch_number,
        "expiry_date": data.expiry_date,
        "quantity": data.quantity,
        "manufacturer": data.manufacturer,
    }

    stock_item = next((s for s in stock if s["pmbi_code"] == data.pmbi_code), None)

    if stock_item is None:
        # First time this medicine is stocked at this Kendra
        stock.append({
            "pmbi_code": data.pmbi_code,
            "total_qty": data.quantity,
            "status": compute_stock_status(data.quantity),
            "batches": [new_batch],
        })
    else:
        stock_item["batches"].append(new_batch)
        stock_item["total_qty"] = sum(b["quantity"] for b in stock_item["batches"])
        stock_item["status"] = compute_stock_status(stock_item["total_qty"])

    await db[KENDRAS_COLLECTION].update_one(
        {"_id": object_id},
        {"$set": {"stock": stock}},
    )

    logger.info(f"Restocked {data.pmbi_code} at kendra {kendra_id}: +{data.quantity}")

    return {
        "message": "Stock added successfully.",
        "pmbi_code": data.pmbi_code,
        "batch_number": data.batch_number,
    }


def _deduct_fifo(batches: list, quantity_needed: int) -> tuple[list, list]:
    """
    Deduct quantity_needed from batches, oldest-expiry-first.
    Returns (remaining_batches, deduction_log).
    Raises HTTPException if total stock is insufficient.
    """
    available = sum(b["quantity"] for b in batches)
    if available < quantity_needed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Requested {quantity_needed}, available {available}.",
        )

    sorted_batches = sorted(batches, key=lambda b: b["expiry_date"])
    remaining_to_deduct = quantity_needed
    deduction_log = []
    result_batches = []

    for batch in sorted_batches:
        if remaining_to_deduct <= 0:
            result_batches.append(batch)
            continue

        take = min(batch["quantity"], remaining_to_deduct)
        remaining_to_deduct -= take

        deduction_log.append({
            "batch_number": batch["batch_number"],
            "expiry_date": batch["expiry_date"],
            "quantity_deducted": take,
        })

        new_qty = batch["quantity"] - take
        if new_qty > 0:
            result_batches.append({**batch, "quantity": new_qty})
        # else: batch fully consumed, dropped from result_batches

    return result_batches, deduction_log


async def generate_bill(kendra_id: str, data: BillRequest, current_user=None) -> dict:
    """
    Generate a bill for one or more medicines sold.
    For each line item: deducts stock FIFO (oldest expiry first),
    recomputes total_qty + status, and records the sale.
    """
    db = get_database()
    object_id = _to_object_id(kendra_id)

    if current_user is not None:
        await _verify_kendra_ownership(kendra_id, current_user)

    kendra = await db[KENDRAS_COLLECTION].find_one({"_id": object_id})
    if not kendra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kendra not found.",
        )

    stock = kendra.get("stock", [])
    line_items = []
    total_amount = 0.0

    for item in data.items:
        stock_item = next((s for s in stock if s["pmbi_code"] == item.pmbi_code), None)
        if stock_item is None or not stock_item.get("batches"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Medicine '{item.pmbi_code}' is not stocked at this Kendra.",
            )

        medicine = await db[MEDICINES_COLLECTION].find_one({"pmbi_code": item.pmbi_code})
        if not medicine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Medicine '{item.pmbi_code}' not found in catalog.",
            )

        remaining_batches, deduction_log = _deduct_fifo(stock_item["batches"], item.quantity)

        stock_item["batches"] = remaining_batches
        stock_item["total_qty"] = sum(b["quantity"] for b in remaining_batches)
        stock_item["status"] = compute_stock_status(stock_item["total_qty"])

        unit_price = medicine["jan_aushadhi_mrp"]
        line_total = round(unit_price * item.quantity, 2)
        total_amount += line_total

        line_items.append({
            "pmbi_code": item.pmbi_code,
            "medicine_name": medicine["brand_name"],
            "quantity": item.quantity,
            "unit_price": unit_price,
            "line_total": line_total,
            "batches_used": deduction_log,
        })

    # Persist updated stock (FIFO deduction applied)
    await db[KENDRAS_COLLECTION].update_one(
        {"_id": object_id},
        {"$set": {"stock": stock}},
    )

    billed_at = datetime.now(timezone.utc)
    bill_doc = {
        "kendra_id": str(object_id),
        "items": line_items,
        "total_amount": round(total_amount, 2),
        "billed_at": billed_at,
    }
    result = await db[BILLS_COLLECTION].insert_one(bill_doc)

    logger.info(f"Bill generated at kendra {kendra_id}: {result.inserted_id}, total ₹{total_amount}")

    return {
        "bill_id": str(result.inserted_id),
        "kendra_id": str(object_id),
        "items": line_items,
        "total_amount": round(total_amount, 2),
        "billed_at": billed_at,
    }