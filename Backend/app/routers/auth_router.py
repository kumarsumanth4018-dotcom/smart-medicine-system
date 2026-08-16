from fastapi import APIRouter, Depends
from app.schemas.token_schema import TokenPayload
from app.utils.jwt_helper import get_current_user
from app.schemas.auth_schemas import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import register_user, login_user, get_current_user_profile
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)
@router.get("/health")
async def authentication_health():
    """Health check endpoint for the Authentication module."""
    return {
        "success": True,
        "module": "Authentication",
        "message": "Authentication Router is Working Successfully"
    }


@router.get("/me")
async def get_me(
    current_user: TokenPayload = Depends(get_current_user)
):
    """Get the full profile of the currently authenticated user."""
    return await get_current_user_profile(current_user.sub)

@router.post("/register")
async def register(
    user_data: RegisterRequest
):
    """Register a new user."""
    return await register_user(user_data)

@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest
):
    """Authenticate a user and return an access token."""
    return await login_user(credentials)