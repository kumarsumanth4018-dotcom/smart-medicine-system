from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.utils.constants import UserRole, UserStatus
from app.models.base_model import BaseDocument
class UserModel(BaseDocument):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    phone_number: str = Field(..., min_length=10, max_length=15)
    hashed_password: str
    role: UserRole = UserRole.USER
    status: UserStatus = UserStatus.ACTIVE
    is_email_verified: bool = False
    last_login: Optional[datetime] = None