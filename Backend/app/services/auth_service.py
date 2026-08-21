from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

from app.core.config import settings
from app.database.connection import get_database
from app.models.user_model import UserModel
from app.schemas.auth_schemas import LoginRequest, RegisterRequest
from app.utils.constants import UserRole, UserStatus
from app.utils.email_otp import (
    generate_otp,
    hash_otp,
    send_registration_otp,
    verify_otp_hash,
)
from app.utils.jwt_helper import create_access_token
from app.utils.logger import logger
from app.utils.password import hash_password, verify_password


def normalize_email(email: str) -> str:
    return email.strip().lower()


async def register_user(user_data: RegisterRequest) -> dict:
    """Register a user and send an email verification OTP."""

    db = get_database()
    email = normalize_email(user_data.email)

    existing_user = await db.users.find_one({"email": email})

    if existing_user:
        if existing_user.get("is_email_verified"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered.",
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "This email is registered but not verified. "
                "Use Resend OTP on the verification page."
            ),
        )

    otp = generate_otp()
    otp_hash = hash_otp(otp)
    otp_expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.OTP_EXPIRE_MINUTES
    )

    new_user = UserModel(
        full_name=user_data.full_name.strip(),
        email=email,
        phone_number=user_data.phone_number.strip(),
        hashed_password=hash_password(user_data.password),
        role=UserRole.USER,
        status=UserStatus.ACTIVE,
        is_email_verified=False,
        last_login=None,
    )

    user_document = new_user.model_dump()

    user_document.update(
        {
            "otp_hash": otp_hash,
            "otp_expires_at": otp_expires_at,
            "otp_created_at": datetime.now(timezone.utc),
        }
    )

    result = await db.users.insert_one(user_document)

    try:
        await send_registration_otp(
            recipient_email=email,
            recipient_name=user_data.full_name,
            otp=otp,
        )
    except Exception as error:
        # Remove the incomplete account so registration can be tried again.
        await db.users.delete_one({"_id": result.inserted_id})

        logger.error(f"OTP email delivery failed for {email}: {error}")

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Account could not be created because the verification "
                "email could not be sent. Please try again."
            ),
        )

    logger.info(f"Registration OTP sent to: {email}")

    return {
        "message": "Registration successful. Check your email for the OTP.",
        "email": email,
    }


async def verify_registration_otp(email: str, otp: str) -> dict:
    """Verify the registration OTP and activate the user's email."""

    db = get_database()
    normalized_email = normalize_email(email)

    user = await db.users.find_one({"email": normalized_email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found.",
        )

    if user.get("is_email_verified"):
        return {
            "message": "Email is already verified. You can sign in.",
        }

    saved_hash = user.get("otp_hash")
    expires_at = user.get("otp_expires_at")

    if not saved_hash or not expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP was found. Request a new OTP.",
        )

    current_time = datetime.now(timezone.utc)

    # MongoDB can sometimes return a naive UTC datetime.
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if current_time > expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Request a new OTP.",
        )

    if not verify_otp_hash(otp, saved_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect OTP. Please try again.",
        )

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "is_email_verified": True,
                "email_verified_at": current_time,
            },
            "$unset": {
                "otp_hash": "",
                "otp_expires_at": "",
                "otp_created_at": "",
            },
        },
    )

    logger.info(f"Email verified successfully: {normalized_email}")

    return {
        "message": "Account verified successfully. You can now sign in.",
    }


async def resend_registration_otp(email: str) -> dict:
    """Generate and email a new registration OTP."""

    db = get_database()
    normalized_email = normalize_email(email)

    user = await db.users.find_one({"email": normalized_email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found.",
        )

    if user.get("is_email_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified. You can sign in.",
        )

    otp = generate_otp()
    current_time = datetime.now(timezone.utc)
    expires_at = current_time + timedelta(
        minutes=settings.OTP_EXPIRE_MINUTES
    )

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "otp_hash": hash_otp(otp),
                "otp_expires_at": expires_at,
                "otp_created_at": current_time,
            }
        },
    )

    try:
        await send_registration_otp(
            recipient_email=normalized_email,
            recipient_name=user["full_name"],
            otp=otp,
        )
    except Exception as error:
        logger.error(
            f"OTP resend failed for {normalized_email}: {error}"
        )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The OTP email could not be sent. Please try again.",
        )

    return {
        "message": "A new OTP has been sent to your email.",
    }


async def login_user(user_data: LoginRequest) -> dict:
    """Authenticate a verified user and generate an access token."""

    db = get_database()
    email = normalize_email(user_data.email)

    user = await db.users.find_one({"email": email})

    if not user or not verify_password(
        user_data.password,
        user.get("hashed_password", ""),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.get("is_email_verified", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Verify your email before signing in.",
        )

    if user["status"] != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is inactive.",
        )

    access_token = create_access_token(
        {
            "sub": user["email"],
            "role": user["role"],
        }
    )

    await db.users.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "last_login": datetime.now(timezone.utc),
            }
        },
    )

    logger.info(f"User logged in successfully: {email}")

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


async def get_current_user_profile(email: str) -> dict:
    """Return the authenticated user's profile."""

    db = get_database()
    user = await db.users.find_one(
        {"email": normalize_email(email)}
    )

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