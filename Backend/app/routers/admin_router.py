from fastapi import APIRouter, Depends, Query

from app.schemas.token_schema import TokenPayload
from app.utils.jwt_helper import require_role
from app.utils.constants import UserRole, DEFAULT_PAGE, DEFAULT_PAGE_SIZE
from app.services.admin_service import (
    get_inventory_overview,
    get_expiry_overview,
    get_demand_analytics,
    list_all_bills,
)

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"],
)


@router.get("/inventory")
async def inventory_overview(
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """System-wide stock snapshot across every Kendra — totals, and
    low/out-of-stock line items. Admin only."""
    return await get_inventory_overview()


@router.get("/expiry")
async def expiry_overview(
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """System-wide batch expiry snapshot across every Kendra, bucketed
    into expired / red (<=30 days) / amber (<=60 days). Admin only."""
    return await get_expiry_overview()


@router.get("/analytics")
async def demand_analytics(
    trend_days: int = Query(default=14, ge=1, le=90),
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """System-wide demand analytics from real bill data — revenue
    summary, top-selling medicines, daily sales trend. Admin only."""
    return await get_demand_analytics(trend_days=trend_days)


@router.get("/bills")
async def bills(
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1),
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """System-wide sales history across every Kendra, most recent first. Admin only."""
    return await list_all_bills(page=page, page_size=page_size)