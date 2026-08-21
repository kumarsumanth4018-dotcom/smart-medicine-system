from fastapi import APIRouter, Depends

from app.schemas.auth_schemas import (
    LoginRequest,
    RegisterRequest,
    ResendOTPRequest,
    TokenResponse,
    VerifyOTPRequest,
)
from app.schemas.token_schema import TokenPayload
from app.services.auth_service import (
    get_current_user_profile,
    login_user,
    register_user,
    resend_registration_otp,
    verify_registration_otp,
)
from app.utils.jwt_helper import get_current_user


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.get("/health")
async def authentication_health():
    """Check whether the authentication module is running."""

    return {
        "success": True,
        "module": "Authentication",
        "message": "Authentication Router is Working Successfully",
    }


@router.post("/register")
async def register(user_data: RegisterRequest):
    """Register a new user and send an email OTP."""

    return await register_user(user_data)


@router.post("/verify-otp")
async def verify_otp(data: VerifyOTPRequest):
    """Verify the six-digit registration OTP."""

    return await verify_registration_otp(
        email=data.email,
        otp=data.otp,
    )


@router.post("/resend-otp")
async def resend_otp(data: ResendOTPRequest):
    """Generate and email a new OTP."""

    return await resend_registration_otp(
        email=data.email,
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """Authenticate a verified user."""

    return await login_user(credentials)


@router.get("/me")
async def get_me(
    current_user: TokenPayload = Depends(get_current_user),
):
    """Return the currently authenticated user's profile."""

    return await get_current_user_profile(
        current_user.sub,
    )