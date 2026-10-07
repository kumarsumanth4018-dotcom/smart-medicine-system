from fastapi import APIRouter, Depends, status

from app.schemas.ranking_preferences_schemas import (
    RankingPreferences,
    RankingPreferencesResponse,
)
from app.schemas.token_schema import TokenPayload
from app.services.user_preference_service import (
    get_user_ranking_preferences,
    reset_user_ranking_preferences,
    save_user_ranking_preferences,
)
from app.utils.jwt_helper import get_current_user


# =====================================================
# User Router
# =====================================================

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


# =====================================================
# Health check
# =====================================================

@router.get("/health")
async def user_module_health():
    """
    Check whether the user module is running.
    """

    return {
        "success": True,
        "module": "Users",
        "message": "User router is working successfully.",
    }


# =====================================================
# Get ranking preferences
# =====================================================

@router.get(
    "/me/ranking-preferences",
    response_model=RankingPreferencesResponse,
)
async def get_my_ranking_preferences(
    current_user: TokenPayload = Depends(get_current_user),
):
    """
    Return the logged-in user's saved WSM preferences.

    Default preferences are returned if the user has not
    saved custom preferences.
    """

    return await get_user_ranking_preferences(
        user_id=current_user.sub,
    )


# =====================================================
# Save ranking preferences
# =====================================================

@router.put(
    "/me/ranking-preferences",
    response_model=RankingPreferencesResponse,
)
async def update_my_ranking_preferences(
    preferences: RankingPreferences,
    current_user: TokenPayload = Depends(get_current_user),
):
    """
    Save or update the logged-in user's WSM preferences.

    All five weights must be between 0 and 1 and their
    total must equal 1.0.
    """

    return await save_user_ranking_preferences(
        user_id=current_user.sub,
        preferences=preferences,
    )


# =====================================================
# Reset ranking preferences
# =====================================================

@router.delete(
    "/me/ranking-preferences",
    response_model=RankingPreferencesResponse,
    status_code=status.HTTP_200_OK,
)
async def reset_my_ranking_preferences(
    current_user: TokenPayload = Depends(get_current_user),
):
    """
    Delete the logged-in user's custom preferences and
    return the default WSM preferences.
    """

    return await reset_user_ranking_preferences(
        user_id=current_user.sub,
    )