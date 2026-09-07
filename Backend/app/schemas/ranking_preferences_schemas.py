from pydantic import BaseModel, Field, model_validator


class RankingPreferences(BaseModel):
    distance: float = Field(
        default=0.35,
        ge=0,
        le=1,
    )

    price: float = Field(
        default=0.25,
        ge=0,
        le=1,
    )

    quantity: float = Field(
        default=0.20,
        ge=0,
        le=1,
    )

    freshness: float = Field(
        default=0.10,
        ge=0,
        le=1,
    )

    trust: float = Field(
        default=0.10,
        ge=0,
        le=1,
    )

    @model_validator(mode="after")
    def validate_total(self):
        total = (
            self.distance
            + self.price
            + self.quantity
            + self.freshness
            + self.trust
        )

        if abs(total - 1.0) > 0.001:
            raise ValueError(
                "Ranking preference weights must add up to 1.0. "
                f"Current total: {round(total, 4)}"
            )

        return self


class RankingPreferencesResponse(BaseModel):
    preferences: RankingPreferences
    source: str
    message: str