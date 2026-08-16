from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class BatchResponse(BaseModel):
    batch_number: str
    expiry_date: datetime
    quantity: int
    manufacturer: str


class StockItemResponse(BaseModel):
    pmbi_code: str
    total_qty: int
    status: str
    batches: List[BatchResponse] = []


class KendraResponse(BaseModel):
    id: str
    name: str
    address: str
    phone: Optional[str] = None
    rating: Optional[float] = None
    latitude: float
    longitude: float
    distance_km: Optional[float] = None
    stock: List[StockItemResponse] = []


class KendraListResponse(BaseModel):
    total: int
    results: List[KendraResponse]


class MedicineAvailabilityResponse(BaseModel):
    """A Kendra that stocks a specific medicine, with distance + that item's stock info."""
    kendra_id: str
    kendra_name: str
    address: str
    phone: Optional[str] = None
    latitude: float
    longitude: float
    distance_km: float
    total_qty: int
    status: str


class RestockRequest(BaseModel):
    """Pharmacy owner adds a new batch of stock arriving from the supplier."""
    pmbi_code: str = Field(..., min_length=2, max_length=30)
    batch_number: str = Field(..., min_length=1, max_length=100)
    expiry_date: datetime
    quantity: int = Field(..., gt=0)
    manufacturer: str = Field(..., min_length=2, max_length=150)


class BillItemRequest(BaseModel):
    pmbi_code: str = Field(..., min_length=2, max_length=30)
    quantity: int = Field(..., gt=0)


class BillRequest(BaseModel):
    """Pharmacy owner generates a bill for one or more medicines sold."""
    items: List[BillItemRequest] = Field(..., min_length=1)


class BillLineItemResponse(BaseModel):
    pmbi_code: str
    medicine_name: str
    quantity: int
    unit_price: float
    line_total: float
    batches_used: List[dict]


class BillResponse(BaseModel):
    bill_id: str
    kendra_id: str
    items: List[BillLineItemResponse]
    total_amount: float
    billed_at: datetime