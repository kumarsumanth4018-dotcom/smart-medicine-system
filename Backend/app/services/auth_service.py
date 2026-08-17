from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.database.connection import get_database
from app.models.user_model import UserModel
from app.utils.constants import UserRole, UserStatus
from app.schemas.auth_schemas import (
    RegisterRequest,
    LoginRequest,
)
from app.utils.password import (
    hash_password,
    verify_password,
)
from app.utils.jwt_helper import create_access_token
from app.utils.logger import logger
async def register_user(
    user_data: RegisterRequest
):
    """Register a new user."""
    db=get_database()
    existing_user = await db.users.find_one(
    {"email": user_data.email}
)   
    if existing_user:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email is already registered."
    )
        
    hashed_password = hash_password(user_data.password)
    new_user = UserModel(
        full_name=user_data.full_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        hashed_password=hashed_password,
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=False,
        last_login=None
)
    result = await db.users.insert_one(
    new_user.dict()
)
    logger.info(
    f"New user registered: {user_data.email}"
)
    return {
    "message": "User registered successfully."
}
async def login_user(user_data: LoginRequest):
    """Authenticate a user and generate an access token."""

    db = get_database()

    # Find user by email
    user = await db.users.find_one(
        {"email": user_data.email}
    )

    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    # Verify password
    if not verify_password(
        user_data.password,
        user["hashed_password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    # Check account status
    if user["status"] != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive."
        )
    # Generate JWT access token
    access_token = create_access_token(
        {
            "sub": user["email"],
            "role": user["role"]
        }
    )

    # Update last login time
    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "last_login": datetime.now(timezone.utc)
            }
        }
    )

    logger.info(
        f"User logged in successfully: {user['email']}"
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


async def get_current_user_profile(email: str) -> dict:
    """Fetch the full profile of the currently authenticated user (from JWT sub)."""
    db = get_database()

    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
        "email": user["email"],
        "phone_number": user["phone_number"],
        "role": user["role"],
        "status": user["status"],
        "is_email_verified": user["is_email_verified"],
        "assigned_kendra_id": user.get("assigned_kendra_id"),
    }