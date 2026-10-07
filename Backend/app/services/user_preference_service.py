from datetime import datetime, timezone
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.connection import get_database
from app.schemas.ranking_preferences_schemas import (
    RankingPreferences,
    RankingPreferencesResponse,
)


# =====================================================
# Collection name
# =====================================================

PREFERENCES_COLLECTION = "user_ranking_preferences"


# =====================================================
# Default WSM preferences
# =====================================================

DEFAULT_RANKING_PREFERENCES = RankingPreferences(
    distance=0.35,
    price=0.25,
    quantity=0.20,
    freshness=0.10,
    trust=0.10,
)


# =====================================================
# Database helper
# =====================================================

def _get_database() -> AsyncIOMotorDatabase:
    """
    Return the connected MongoDB database.

    Raises an error when MongoDB has not been connected.
    """

    database = get_database()

    if database is None:
        raise RuntimeError(
            "MongoDB is not connected. "
            "Start the application before accessing preferences."
        )

    return database


# =====================================================
# Document conversion helper
# =====================================================

def _document_to_preferences(
    document: dict[str, Any],
) -> RankingPreferences:
    """
    Convert a MongoDB preference document into the
    RankingPreferences Pydantic model.
    """

    return RankingPreferences(
        distance=float(
            document.get(
                "distance",
                DEFAULT_RANKING_PREFERENCES.distance,
            )
        ),
        price=float(
            document.get(
                "price",
                DEFAULT_RANKING_PREFERENCES.price,
            )
        ),
        quantity=float(
            document.get(
                "quantity",
                DEFAULT_RANKING_PREFERENCES.quantity,
            )
        ),
        freshness=float(
            document.get(
                "freshness",
                DEFAULT_RANKING_PREFERENCES.freshness,
            )
        ),
        trust=float(
            document.get(
                "trust",
                DEFAULT_RANKING_PREFERENCES.trust,
            )
        ),
    )


# =====================================================
# Get preferences
# =====================================================

async def get_user_ranking_preferences(
    user_id: str,
) -> RankingPreferencesResponse:
    """
    Return the user's saved WSM ranking preferences.

    When the user has not saved preferences yet,
    return the default weights.
    """

    if not user_id or not user_id.strip():
        raise ValueError("A valid user ID is required.")

    database = _get_database()

    document = await database[
        PREFERENCES_COLLECTION
    ].find_one(
        {
            "user_id": user_id.strip(),
        }
    )

    if document is None:
        return RankingPreferencesResponse(
            preferences=DEFAULT_RANKING_PREFERENCES.model_copy(),
            source="default",
            message=(
                "No saved ranking preferences were found. "
                "Default WSM weights are being used."
            ),
        )

    preferences = _document_to_preferences(document)

    return RankingPreferencesResponse(
        preferences=preferences,
        source="saved",
        message="Saved ranking preferences loaded successfully.",
    )


# =====================================================
# Save preferences
# =====================================================

async def save_user_ranking_preferences(
    user_id: str,
    preferences: RankingPreferences,
) -> RankingPreferencesResponse:
    """
    Create or update the user's WSM ranking preferences.
    """

    if not user_id or not user_id.strip():
        raise ValueError("A valid user ID is required.")

    database = _get_database()
    normalized_user_id = user_id.strip()
    current_time = datetime.now(timezone.utc)

    preference_data = preferences.model_dump()

    await database[PREFERENCES_COLLECTION].update_one(
        {
            "user_id": normalized_user_id,
        },
        {
            "$set": {
                **preference_data,
                "updated_at": current_time,
            },
            "$setOnInsert": {
                "user_id": normalized_user_id,
                "created_at": current_time,
            },
        },
        upsert=True,
    )

    return RankingPreferencesResponse(
        preferences=preferences,
        source="saved",
        message="Ranking preferences saved successfully.",
    )


# =====================================================
# Reset preferences
# =====================================================

async def reset_user_ranking_preferences(
    user_id: str,
) -> RankingPreferencesResponse:
    """
    Delete the user's saved preferences and return
    the default WSM weights.
    """

    if not user_id or not user_id.strip():
        raise ValueError("A valid user ID is required.")

    database = _get_database()

    await database[PREFERENCES_COLLECTION].delete_one(
        {
            "user_id": user_id.strip(),
        }
    )

    return RankingPreferencesResponse(
        preferences=DEFAULT_RANKING_PREFERENCES.model_copy(),
        source="default",
        message=(
            "Ranking preferences reset successfully. "
            "Default WSM weights are now being used."
        ),
    )