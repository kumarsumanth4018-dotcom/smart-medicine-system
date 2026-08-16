from typing import List, Optional
from pydantic import BaseModel, Field


class MedicineCreateRequest(BaseModel):
    pmbi_code: str = Field(..., min_length=2, max_length=30)
    generic_name: str = Field(..., min_length=2, max_length=200)
    brand_name: str = Field(..., min_length=2, max_length=200)
    composition: str = Field(..., min_length=2, max_length=300)
    category: str = Field(..., min_length=2, max_length=100)
    jan_aushadhi_mrp: float = Field(..., ge=0)
    branded_avg_mrp: float = Field(..., ge=0)
    saving_pct: float = Field(..., ge=0, le=100)
    pack_size: str = Field(..., max_length=50)
    manufacturer: str = Field(..., min_length=2, max_length=150)


class MedicineUpdateRequest(BaseModel):
    generic_name: Optional[str] = None
    brand_name: Optional[str] = None
    composition: Optional[str] = None
    category: Optional[str] = None
    jan_aushadhi_mrp: Optional[float] = Field(default=None, ge=0)
    branded_avg_mrp: Optional[float] = Field(default=None, ge=0)
    saving_pct: Optional[float] = Field(default=None, ge=0, le=100)
    pack_size: Optional[str] = None
    manufacturer: Optional[str] = None
    is_active: Optional[bool] = None


class MedicineResponse(BaseModel):
    id: str
    pmbi_code: str
    generic_name: str
    brand_name: str
    composition: str
    category: str
    jan_aushadhi_mrp: float
    branded_avg_mrp: float
    saving_pct: float
    pack_size: str
    manufacturer: str
    is_active: bool


class MedicineSearchResponse(BaseModel):
    total: int
    page: int
    page_size: int
    results: List[MedicineResponse]