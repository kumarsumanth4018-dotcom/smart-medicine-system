from fastapi import APIRouter, Depends, Query

from app.schemas.kendra_schemas import RestockRequest, BillRequest
from app.schemas.token_schema import TokenPayload
from app.utils.jwt_helper import require_role
from app.utils.constants import UserRole
from app.services.kendra_service import (
    DEFAULT_RADIUS_KM,
    find_nearby_kendras,
    get_kendra_by_id,
    find_medicine_availability,
    restock_medicine,
    generate_bill,
)


router = APIRouter(
    prefix="/api/v1/kendras",
    tags=["Kendras"],
)


@router.get("/nearby")
async def nearby(
    lat: float = Query(
        ...,
        ge=-90,
        le=90,
        description="User latitude",
    ),
    lng: float = Query(
        ...,
        ge=-180,
        le=180,
        description="User longitude",
    ),
    radius_km: float = Query(
        default=DEFAULT_RADIUS_KM,
        gt=0,
        le=50,
    ),
):
    """
    Find active Jan Aushadhi Kendras near a location.

    This endpoint returns location results sorted by distance.
    Use the medicine-specific endpoint for WSM ranking.
    """
    return await find_nearby_kendras(
        lat=lat,
        lng=lng,
        radius_km=radius_km,
    )


@router.get("/medicine/{pmbi_code}/nearby")
async def medicine_nearby(
    pmbi_code: str,
    lat: float = Query(
        ...,
        ge=-90,
        le=90,
        description="User latitude",
    ),
    lng: float = Query(
        ...,
        ge=-180,
        le=180,
        description="User longitude",
    ),
    radius_km: float = Query(
        default=DEFAULT_RADIUS_KM,
        gt=0,
        le=50,
    ),
    only_in_stock: bool = Query(default=True),
    distance_weight: float = Query(
        default=0.35,
        ge=0,
        le=1,
        description="WSM weight for shorter distance",
    ),
    price_weight: float = Query(
        default=0.25,
        ge=0,
        le=1,
        description="WSM weight for lower price",
    ),
    quantity_weight: float = Query(
        default=0.20,
        ge=0,
        le=1,
        description="WSM weight for stock quantity",
    ),
    freshness_weight: float = Query(
        default=0.10,
        ge=0,
        le=1,
        description="WSM weight for longer remaining shelf life",
    ),
    trust_weight: float = Query(
        default=0.10,
        ge=0,
        le=1,
        description="WSM weight for batch verification",
    ),
):
    """
    Find Kendras stocking the requested medicine and rank them
    with the Weighted Sum Model.

    Normalized criteria:

    - distance: `1 - distance / maximum_distance`
    - price: `1 - price / maximum_price`
    - quantity: `min(quantity / 50, 1)`
    - freshness: `min(days_to_expiry / 365, 1)`
    - trust: verified=1.0, distributor=0.7, unverified=0.4

    The five supplied weights must add up to 1.0.
    """
    weights = {
        "distance": distance_weight,
        "price": price_weight,
        "quantity": quantity_weight,
        "freshness": freshness_weight,
        "trust": trust_weight,
    }

    return await find_medicine_availability(
        pmbi_code=pmbi_code,
        lat=lat,
        lng=lng,
        radius_km=radius_km,
        only_in_stock=only_in_stock,
        weights=weights,
    )


@router.get("/{kendra_id}")
async def detail(kendra_id: str):
    """
    Get a Kendra's complete details, stock and batches.
    """
    return await get_kendra_by_id(kendra_id)


@router.post("/{kendra_id}/restock")
async def restock(
    kendra_id: str,
    data: RestockRequest,
    current_user: TokenPayload = Depends(
        require_role(
            [UserRole.PHARMACY, UserRole.ADMIN]
        )
    ),
):
    """
    Add a stock batch. Pharmacy owner or administrator only.
    """
    return await restock_medicine(
        kendra_id,
        data,
        current_user,
    )


@router.post("/{kendra_id}/bill")
async def bill(
    kendra_id: str,
    data: BillRequest,
    current_user: TokenPayload = Depends(
        require_role(
            [UserRole.PHARMACY, UserRole.ADMIN]
        )
    ),
):
    """
    Generate a bill and deduct stock using FIFO/FEFO order.
    Pharmacy owner or administrator only.
    """
    return await generate_bill(
        kendra_id,
        data,
        current_user,
    )
