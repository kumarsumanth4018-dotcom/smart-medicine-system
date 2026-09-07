from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.database.connection import get_database
from app.core.constants import (
    KENDRAS_COLLECTION,
    MEDICINES_COLLECTION,
    BILLS_COLLECTION,
)
from app.schemas.kendra_schemas import RestockRequest, BillRequest
from app.utils.geo import haversine_km
from app.utils.logger import logger


DEFAULT_RADIUS_KM = 5.0

DEFAULT_RANKING_WEIGHTS = {
    "distance": 0.35,
    "price": 0.25,
    "quantity": 0.20,
    "freshness": 0.10,
    "trust": 0.10,
}

TRUST_SCORES = {
    "verified": 1.0,
    "distributor": 0.7,
    "unverified": 0.4,
}


def validate_ranking_weights(
    weights: Optional[dict[str, float]],
) -> dict[str, float]:
    if weights is None:
        return DEFAULT_RANKING_WEIGHTS.copy()

    if set(weights) != set(DEFAULT_RANKING_WEIGHTS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Weights must contain distance, price, quantity, "
                "freshness and trust."
            ),
        )

    validated: dict[str, float] = {}

    for name, value in weights.items():
        try:
            numeric_value = float(value)
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Weight '{name}' must be numeric.",
            )

        if not 0 <= numeric_value <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Weight '{name}' must be between 0 and 1.",
            )

        validated[name] = numeric_value

    total = sum(validated.values())

    if abs(total - 1.0) > 0.001:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Ranking weights must add up to 1.0. "
                f"Received {round(total, 4)}."
            ),
        )

    return validated


def parse_expiry_date(value) -> Optional[datetime]:
    if isinstance(value, datetime):
        expiry = value
    elif isinstance(value, str):
        try:
            expiry = datetime.fromisoformat(
                value.replace("Z", "+00:00")
            )
        except ValueError:
            return None
    else:
        return None

    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    return expiry.astimezone(timezone.utc)


def days_until_expiry(value) -> int:
    expiry = parse_expiry_date(value)

    if expiry is None:
        return 0

    remaining = expiry - datetime.now(timezone.utc)
    return max(0, remaining.days)


def calculate_wsm_scores(
    results: list[dict],
    weights: dict[str, float],
) -> list[dict]:
    if not results:
        return []

    maximum_distance = max(
        float(item.get("distance_km", 0) or 0)
        for item in results
    )
    maximum_price = max(
        float(item.get("price", 0) or 0)
        for item in results
    )

    for item in results:
        distance = float(item.get("distance_km", 0) or 0)
        price = float(item.get("price", 0) or 0)
        quantity = int(item.get("total_qty", 0) or 0)
        expiry_days = int(item.get("days_to_expiry", 0) or 0)
        verification = item.get(
            "verification_status",
            "unverified",
        )

        distance_score = (
            1 - distance / maximum_distance
            if maximum_distance > 0
            else 1.0
        )
        price_score = (
            1 - price / maximum_price
            if maximum_price > 0
            else 1.0
        )
        quantity_score = min(max(quantity, 0) / 50, 1.0)
        freshness_score = min(max(expiry_days, 0) / 365, 1.0)
        trust_score = TRUST_SCORES.get(
            verification,
            TRUST_SCORES["unverified"],
        )

        distance_score = max(0.0, min(1.0, distance_score))
        price_score = max(0.0, min(1.0, price_score))
        quantity_score = max(0.0, min(1.0, quantity_score))
        freshness_score = max(0.0, min(1.0, freshness_score))
        trust_score = max(0.0, min(1.0, trust_score))

        final_score = (
            distance_score * weights["distance"]
            + price_score * weights["price"]
            + quantity_score * weights["quantity"]
            + freshness_score * weights["freshness"]
            + trust_score * weights["trust"]
        )

        item["wsm_score"] = round(final_score, 4)
        item["score_breakdown"] = {
            "distance_score": round(distance_score, 4),
            "price_score": round(price_score, 4),
            "quantity_score": round(quantity_score, 4),
            "freshness_score": round(freshness_score, 4),
            "trust_score": round(trust_score, 4),
        }
        item["weights_used"] = {
            name: round(value, 4)
            for name, value in weights.items()
        }

    results.sort(
        key=lambda item: (
            -item["wsm_score"],
            item["distance_km"],
            item["price"],
        )
    )

    for rank, item in enumerate(results, start=1):
        item["rank"] = rank

    return results


async def _verify_kendra_ownership(
    kendra_id: str,
    current_user,
) -> None:
    if current_user.role == "ADMIN":
        return

    db = get_database()
    user = await db.users.find_one(
        {"email": current_user.sub}
    )

    if (
        not user
        or user.get("assigned_kendra_id") != kendra_id
    ):
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
            detail="Invalid kendra id.",
        )


def _serialize_kendra(
    doc: dict,
    distance_km: Optional[float] = None,
) -> dict:
    coordinates = doc["location"]["coordinates"]

    return {
        "id": str(doc["_id"]),
        "name": doc["name"],
        "address": doc["address"],
        "phone": doc.get("phone"),
        "rating": doc.get("rating"),
        "longitude": coordinates[0],
        "latitude": coordinates[1],
        "distance_km": distance_km,
        "stock": doc.get("stock", []),
    }


async def find_nearby_kendras(
    lat: float,
    lng: float,
    radius_km: float = DEFAULT_RADIUS_KM,
) -> dict:
    db = get_database()
    cursor = db[KENDRAS_COLLECTION].find(
        {"is_active": {"$ne": False}}
    )

    results = []

    async for doc in cursor:
        coordinates = doc["location"]["coordinates"]
        distance = haversine_km(
            lat,
            lng,
            coordinates[1],
            coordinates[0],
        )

        if distance <= radius_km:
            results.append(
                _serialize_kendra(
                    doc,
                    distance_km=round(distance, 2),
                )
            )

    results.sort(key=lambda item: item["distance_km"])

    return {
        "total": len(results),
        "results": results,
    }


async def get_kendra_by_id(kendra_id: str) -> dict:
    db = get_database()
    object_id = _to_object_id(kendra_id)

    doc = await db[KENDRAS_COLLECTION].find_one(
        {"_id": object_id}
    )

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
    weights: Optional[dict[str, float]] = None,
) -> list:
    db = get_database()
    ranking_weights = validate_ranking_weights(weights)

    medicine = await db[MEDICINES_COLLECTION].find_one(
        {"pmbi_code": pmbi_code}
    )

    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found in catalogue.",
        )

    catalogue_price = float(
        medicine.get("jan_aushadhi_mrp", 0) or 0
    )

    cursor = db[KENDRAS_COLLECTION].find(
        {
            "is_active": {"$ne": False},
            "stock.pmbi_code": pmbi_code,
        }
    )

    results: list[dict] = []
    current_time = datetime.now(timezone.utc)

    async for doc in cursor:
        coordinates = doc["location"]["coordinates"]
        distance = haversine_km(
            lat,
            lng,
            coordinates[1],
            coordinates[0],
        )

        if distance > radius_km:
            continue

        stock_item = next(
            (
                item
                for item in doc.get("stock", [])
                if item.get("pmbi_code") == pmbi_code
            ),
            None,
        )

        if not stock_item:
            continue

        active_batches: list[dict] = []

        for batch in stock_item.get("batches", []):
            quantity = int(batch.get("quantity", 0) or 0)
            expiry = parse_expiry_date(
                batch.get("expiry_date")
            )

            if quantity <= 0:
                continue

            if expiry is not None and expiry <= current_time:
                continue

            active_batches.append(
                {
                    **batch,
                    "_parsed_expiry": expiry,
                }
            )

        active_batches.sort(
            key=lambda batch: (
                batch["_parsed_expiry"]
                if batch["_parsed_expiry"] is not None
                else datetime.max.replace(
                    tzinfo=timezone.utc
                )
            )
        )

        total_quantity = sum(
            int(batch.get("quantity", 0) or 0)
            for batch in active_batches
        )

        if only_in_stock and total_quantity <= 0:
            continue

        selected_batch = (
            active_batches[0]
            if active_batches
            else None
        )

        if selected_batch:
            selling_price = selected_batch.get(
                "selling_price"
            )

            if selling_price is None:
                selling_price = catalogue_price

            verification_status = selected_batch.get(
                "verification_status",
                "unverified",
            )
            nearest_expiry = selected_batch.get(
                "_parsed_expiry"
            )
        else:
            selling_price = catalogue_price
            verification_status = "unverified"
            nearest_expiry = None

        batch_information = []

        for batch in active_batches:
            batch_information.append(
                {
                    "batch_number": batch.get("batch_number"),
                    "manufacturer": batch.get("manufacturer"),
                    "expiry_date": batch.get("_parsed_expiry"),
                    "quantity": int(
                        batch.get("quantity", 0) or 0
                    ),
                    "selling_price": float(
                        batch.get("selling_price")
                        or catalogue_price
                    ),
                    "verification_status": batch.get(
                        "verification_status",
                        "unverified",
                    ),
                }
            )

        expiry_days = (
            days_until_expiry(nearest_expiry)
            if nearest_expiry
            else 0
        )

        results.append(
            {
                "rank": 0,
                "kendra_id": str(doc["_id"]),
                "kendra_name": doc["name"],
                "address": doc["address"],
                "phone": doc.get("phone"),
                "latitude": coordinates[1],
                "longitude": coordinates[0],
                "distance_km": round(distance, 2),
                "price": round(float(selling_price), 2),
                "total_qty": total_quantity,
                "status": compute_stock_status(total_quantity),
                "nearest_expiry": nearest_expiry,
                "days_to_expiry": expiry_days,
                "verification_status": verification_status,
                "batches": batch_information,
            }
        )

    return calculate_wsm_scores(
        results,
        ranking_weights,
    )


def compute_stock_status(quantity: int) -> str:
    if quantity <= 0:
        return "out_of_stock"
    if quantity <= 5:
        return "low_stock"
    return "in_stock"


async def restock_medicine(
    kendra_id: str,
    data: RestockRequest,
    current_user=None,
) -> dict:
    db = get_database()
    object_id = _to_object_id(kendra_id)

    if current_user is not None:
        await _verify_kendra_ownership(
            kendra_id,
            current_user,
        )

    kendra = await db[KENDRAS_COLLECTION].find_one(
        {"_id": object_id}
    )

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
        "selling_price": data.selling_price,
        "verification_status": data.verification_status,
    }

    stock_item = next(
        (
            item
            for item in stock
            if item["pmbi_code"] == data.pmbi_code
        ),
        None,
    )

    if stock_item is None:
        stock.append(
            {
                "pmbi_code": data.pmbi_code,
                "total_qty": data.quantity,
                "status": compute_stock_status(
                    data.quantity
                ),
                "batches": [new_batch],
            }
        )
    else:
        stock_item.setdefault("batches", []).append(new_batch)
        stock_item["total_qty"] = sum(
            int(batch.get("quantity", 0) or 0)
            for batch in stock_item["batches"]
        )
        stock_item["status"] = compute_stock_status(
            stock_item["total_qty"]
        )

    await db[KENDRAS_COLLECTION].update_one(
        {"_id": object_id},
        {"$set": {"stock": stock}},
    )

    logger.info(
        "Restocked %s at kendra %s: +%s",
        data.pmbi_code,
        kendra_id,
        data.quantity,
    )

    return {
        "message": "Stock added successfully.",
        "pmbi_code": data.pmbi_code,
        "batch_number": data.batch_number,
    }


def _deduct_fifo(
    batches: list,
    quantity_needed: int,
) -> tuple[list, list]:
    available = sum(
        int(batch.get("quantity", 0) or 0)
        for batch in batches
    )

    if available < quantity_needed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Insufficient stock. Requested {quantity_needed}, "
                f"available {available}."
            ),
        )

    sorted_batches = sorted(
        batches,
        key=lambda batch: (
            parse_expiry_date(batch.get("expiry_date"))
            or datetime.max.replace(tzinfo=timezone.utc)
        ),
    )

    remaining_to_deduct = quantity_needed
    deduction_log = []
    result_batches = []

    for batch in sorted_batches:
        if remaining_to_deduct <= 0:
            result_batches.append(batch)
            continue

        batch_quantity = int(
            batch.get("quantity", 0) or 0
        )
        take = min(batch_quantity, remaining_to_deduct)
        remaining_to_deduct -= take

        deduction_log.append(
            {
                "batch_number": batch["batch_number"],
                "expiry_date": batch["expiry_date"],
                "quantity_deducted": take,
            }
        )

        new_quantity = batch_quantity - take

        if new_quantity > 0:
            result_batches.append(
                {
                    **batch,
                    "quantity": new_quantity,
                }
            )

    return result_batches, deduction_log


async def generate_bill(
    kendra_id: str,
    data: BillRequest,
    current_user=None,
) -> dict:
    db = get_database()
    object_id = _to_object_id(kendra_id)

    if current_user is not None:
        await _verify_kendra_ownership(
            kendra_id,
            current_user,
        )

    kendra = await db[KENDRAS_COLLECTION].find_one(
        {"_id": object_id}
    )

    if not kendra:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kendra not found.",
        )

    stock = kendra.get("stock", [])
    line_items = []
    total_amount = 0.0

    for item in data.items:
        stock_item = next(
            (
                stock_entry
                for stock_entry in stock
                if stock_entry["pmbi_code"] == item.pmbi_code
            ),
            None,
        )

        if stock_item is None or not stock_item.get("batches"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Medicine '{item.pmbi_code}' is not "
                    "stocked at this Kendra."
                ),
            )

        medicine = await db[MEDICINES_COLLECTION].find_one(
            {"pmbi_code": item.pmbi_code}
        )

        if not medicine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Medicine '{item.pmbi_code}' not found "
                    "in catalogue."
                ),
            )

        remaining_batches, deduction_log = _deduct_fifo(
            stock_item["batches"],
            item.quantity,
        )

        stock_item["batches"] = remaining_batches
        stock_item["total_qty"] = sum(
            int(batch.get("quantity", 0) or 0)
            for batch in remaining_batches
        )
        stock_item["status"] = compute_stock_status(
            stock_item["total_qty"]
        )

        unit_price = float(
            medicine.get("jan_aushadhi_mrp", 0) or 0
        )
        line_total = round(unit_price * item.quantity, 2)
        total_amount += line_total

        line_items.append(
            {
                "pmbi_code": item.pmbi_code,
                "medicine_name": medicine["brand_name"],
                "quantity": item.quantity,
                "unit_price": unit_price,
                "line_total": line_total,
                "batches_used": deduction_log,
            }
        )

    await db[KENDRAS_COLLECTION].update_one(
        {"_id": object_id},
        {"$set": {"stock": stock}},
    )

    billed_at = datetime.now(timezone.utc)
    bill_document = {
        "kendra_id": str(object_id),
        "items": line_items,
        "total_amount": round(total_amount, 2),
        "billed_at": billed_at,
    }

    insert_result = await db[BILLS_COLLECTION].insert_one(
        bill_document
    )

    logger.info(
        "Bill generated at kendra %s: %s, total %s",
        kendra_id,
        insert_result.inserted_id,
        total_amount,
    )

    return {
        "bill_id": str(insert_result.inserted_id),
        "kendra_id": str(object_id),
        "items": line_items,
        "total_amount": round(total_amount, 2),
        "billed_at": billed_at,
    }
