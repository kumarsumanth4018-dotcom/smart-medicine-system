from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.schemas.medicine_schemas import (
    MedicineCreateRequest,
    MedicineUpdateRequest,
)
from app.schemas.token_schema import TokenPayload
from app.utils.jwt_helper import require_role
from app.utils.constants import UserRole, DEFAULT_PAGE, DEFAULT_PAGE_SIZE
from app.services.medicine_service import (
    create_medicine,
    search_medicines,
    get_medicine_by_id,
    get_medicine_by_pmbi_code,
    update_medicine,
    delete_medicine,
)

router = APIRouter(
    prefix="/api/v1/medicines",
    tags=["Medicines"],
)


@router.get("/search")
async def search(
    q: Optional[str] = Query(default=None, description="Search by brand, generic name, composition, or PMBI code"),
    category: Optional[str] = Query(default=None),
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1),
):
    """Search medicines. Public — no auth required."""
    return await search_medicines(query=q, category=category, page=page, page_size=page_size)


@router.get("")
async def list_medicines(
    page: int = Query(default=DEFAULT_PAGE, ge=1),
    page_size: int = Query(default=DEFAULT_PAGE_SIZE, ge=1),
):
    """List all medicines (no search filter). Public."""
    return await search_medicines(query=None, category=None, page=page, page_size=page_size)


@router.get("/code/{pmbi_code}")
async def get_by_code(pmbi_code: str):
    """Get a medicine by its PMBI code."""
    return await get_medicine_by_pmbi_code(pmbi_code)


@router.get("/{medicine_id}")
async def get_detail(medicine_id: str):
    """Get a medicine's detail (brand + generic + savings already included)."""
    return await get_medicine_by_id(medicine_id)


@router.post("", status_code=201)
async def create(
    data: MedicineCreateRequest,
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """Add a new medicine to the catalog. Admin only."""
    return await create_medicine(data)


@router.put("/{medicine_id}")
async def update(
    medicine_id: str,
    data: MedicineUpdateRequest,
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """Update a medicine's details. Admin only."""
    return await update_medicine(medicine_id, data)


@router.delete("/{medicine_id}")
async def delete(
    medicine_id: str,
    current_user: TokenPayload = Depends(require_role([UserRole.ADMIN])),
):
    """Deactivate a medicine (soft delete). Admin only."""
    return await delete_medicine(medicine_id)