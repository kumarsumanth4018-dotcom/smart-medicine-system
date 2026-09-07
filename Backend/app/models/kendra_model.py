from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

from app.models.base_model import BaseDocument


VerificationStatus = Literal[
    "verified",
    "distributor",
    "unverified",
]


class BatchModel(BaseModel):
    batch_number: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    expiry_date: datetime

    quantity: int = Field(
        ...,
        ge=0,
    )

    manufacturer: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    # Actual price at this Kendra.
    # Optional keeps existing database records compatible.
    selling_price: Optional[float] = Field(
        default=None,
        gt=0,
    )

    verification_status: VerificationStatus = Field(
        default="unverified",
    )


class StockItemModel(BaseModel):
    pmbi_code: str = Field(
        ...,
        max_length=30,
    )

    total_qty: int = Field(
        ...,
        ge=0,
    )

    status: str = Field(
        default="out_of_stock",
    )

    batches: List[BatchModel] = Field(
        default_factory=list,
    )


class GeoLocation(BaseModel):
    type: str = Field(default="Point")

    # MongoDB GeoJSON order: [longitude, latitude]
    coordinates: List[float]


class KendraModel(BaseDocument):
    """
    Jan Aushadhi Kendra with location and live stock.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    address: str = Field(
        ...,
        min_length=2,
        max_length=300,
    )

    phone: Optional[str] = Field(
        default=None,
        max_length=20,
    )

    owner_email: Optional[str] = Field(
        default=None,
        description=(
            "Email of the pharmacy owner managing this Kendra"
        ),
    )

    rating: Optional[float] = Field(
        default=None,
        ge=0,
        le=5,
    )

    location: GeoLocation

    stock: List[StockItemModel] = Field(
        default_factory=list,
    )

    is_active: bool = Field(default=True)