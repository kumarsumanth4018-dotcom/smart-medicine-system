from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


VerificationStatus = Literal[
    "verified",
    "distributor",
    "unverified",
]


class BatchResponse(BaseModel):
    batch_number: str
    expiry_date: datetime
    quantity: int
    manufacturer: str
    selling_price: Optional[float] = None
    verification_status: VerificationStatus = "unverified"


class StockItemResponse(BaseModel):
    pmbi_code: str
    total_qty: int
    status: str

    batches: List[BatchResponse] = Field(
        default_factory=list,
    )


class KendraResponse(BaseModel):
    id: str
    name: str
    address: str
    phone: Optional[str] = None
    rating: Optional[float] = None
    owner_email: Optional[str] = None
    latitude: float
    longitude: float
    distance_km: Optional[float] = None

    stock: List[StockItemResponse] = Field(
        default_factory=list,
    )


class KendraListResponse(BaseModel):
    total: int
    results: List[KendraResponse]


class ScoreBreakdown(BaseModel):
    distance_score: float
    price_score: float
    quantity_score: float
    freshness_score: float
    trust_score: float


class RankingWeightsResponse(BaseModel):
    distance: float
    price: float
    quantity: float
    freshness: float
    trust: float


class MedicineAvailabilityResponse(BaseModel):
    rank: int
    kendra_id: str
    kendra_name: str
    address: str
    phone: Optional[str] = None
    latitude: float
    longitude: float

    distance_km: float
    price: float
    total_qty: int
    status: str

    nearest_expiry: Optional[datetime] = None
    days_to_expiry: int = 0

    verification_status: VerificationStatus
    wsm_score: float

    score_breakdown: ScoreBreakdown
    weights_used: RankingWeightsResponse

    batches: List[BatchResponse] = Field(
        default_factory=list,
    )


class RestockRequest(BaseModel):
    pmbi_code: str = Field(
        ...,
        min_length=2,
        max_length=30,
    )

    batch_number: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    expiry_date: datetime

    quantity: int = Field(
        ...,
        gt=0,
    )

    manufacturer: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    selling_price: Optional[float] = Field(
        default=None,
        gt=0,
        description=(
            "Actual selling price at this Kendra. "
            "Catalogue price is used when omitted."
        ),
    )

    verification_status: VerificationStatus = Field(
        default="unverified",
    )


class BillItemRequest(BaseModel):
    pmbi_code: str = Field(
        ...,
        min_length=2,
        max_length=30,
    )

    quantity: int = Field(
        ...,
        gt=0,
    )


class BillRequest(BaseModel):
    items: List[BillItemRequest] = Field(
        ...,
        min_length=1,
    )


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