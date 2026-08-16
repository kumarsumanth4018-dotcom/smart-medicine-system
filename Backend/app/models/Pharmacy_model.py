from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.utils.constants import PharmacyStatus
from app.models.base_model import BaseDocument
class PharmacyModel(BaseDocument):
    owner_name: str = Field(..., min_length=3, max_length=100)
    pharmacy_name: str = Field(..., min_length=3, max_length=150)
    email: EmailStr
    phone_number: str = Field(..., min_length=10, max_length=15)
    hashed_password: str

    drug_license_number: str
    gst_number: str

    address: str
    city: str
    state: str
    pin_code: str = Field(..., min_length=6, max_length=6)

    status: PharmacyStatus = PharmacyStatus.PENDING
    is_email_verified: bool = False
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    last_login: Optional[datetime] = None