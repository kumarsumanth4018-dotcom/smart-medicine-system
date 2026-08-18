from fastapi import APIRouter, Depends, Query

from app.schemas.kendra_schemas import RestockRequest, BillRequest
from app.schemas.token_schema import TokenPayload
from app.utils.jwt_helper import require_role
from app.utils.constants import UserRole
from app.services.kendra_service import (
    find_nearby_kendras,
    get_kendra_by_id,
    find_medicine_availability,
    restock_medicine,
    generate_bill,
    DEFAULT_RADIUS_KM,
)

router = APIRouter(
    prefix="/api/v1/kendras",
    tags=["Kendras"],
)


@router.get("/nearby")
async def nearby(
    lat: float = Query(..., description="User's latitude"),
    lng: float = Query(..., description="User's longitude"),
    radius_km: float = Query(default=DEFAULT_RADIUS_KM, gt=0, le=50),
):
    """Find Jan Aushadhi Kendras within radius_km of a location. Public."""
    return await find_nearby_kendras(lat=lat, lng=lng, radius_km=radius_km)


@router.get("/medicine/{pmbi_code}/nearby")
async def medicine_nearby(
    pmbi_code: str,
    lat: float = Query(..., description="User's latitude"),
    lng: float = Query(..., description="User's longitude"),
    radius_km: float = Query(default=DEFAULT_RADIUS_KM, gt=0, le=50),
    only_in_stock: bool = Query(default=True),
):
    """Find nearby Kendras that stock a specific medicine, sorted by distance. Public."""
    return await find_medicine_availability(
        pmbi_code=pmbi_code, lat=lat, lng=lng, radius_km=radius_km,
        only_in_stock=only_in_stock,
    )


@router.get("/{kendra_id}")
async def detail(kendra_id: str):
    """Get a single Kendra's full detail, including all stock/batches."""
    return await get_kendra_by_id(kendra_id)


@router.post("/{kendra_id}/restock")
async def restock(
    kendra_id: str,
    data: RestockRequest,
    current_user: TokenPayload = Depends(require_role([UserRole.PHARMACY, UserRole.ADMIN])),
):
    """Add a new batch of stock arriving from the supplier. Pharmacy owner / Admin only."""
    return await restock_medicine(kendra_id, data, current_user)


@router.post("/{kendra_id}/bill")
async def bill(
    kendra_id: str,
    data: BillRequest,
    current_user: TokenPayload = Depends(require_role([UserRole.PHARMACY, UserRole.ADMIN])),
):
    """
    Generate a bill for one or more medicines sold. Deducts stock FIFO
    (oldest expiry first) and updates stock status automatically.
    Pharmacy owner / Admin only.
    """
    return await generate_bill(kendra_id, data, current_user)