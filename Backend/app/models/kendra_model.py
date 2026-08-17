from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.models.base_model import BaseDocument


class BatchModel(BaseModel):
    batch_number: str = Field(..., max_length=100)
    expiry_date: datetime
    quantity: int = Field(..., ge=0)
    manufacturer: str = Field(..., max_length=150)


class StockItemModel(BaseModel):
    pmbi_code: str = Field(..., max_length=30)
    total_qty: int = Field(..., ge=0)
    status: str = Field(default="out_of_stock")  # in_stock | low_stock | out_of_stock
    batches: List[BatchModel] = []


class GeoLocation(BaseModel):
    type: str = Field(default="Point")
    coordinates: List[float]  # [longitude, latitude]


class KendraModel(BaseDocument):
    """A Jan Aushadhi Kendra / pharmacy, with GPS location and live stock."""

    name: str = Field(..., min_length=2, max_length=200)
    address: str = Field(..., min_length=2, max_length=300)
    phone: Optional[str] = Field(default=None, max_length=20)
    owner_email: Optional[str] = Field(default=None, description="Email (JWT sub) of the pharmacy owner managing this Kendra")
    rating: Optional[float] = Field(default=None, ge=0, le=5)
    location: GeoLocation
    stock: List[StockItemModel] = []
    is_active: bool = Field(default=True)