from typing import List

from pydantic import Field

from app.models.base_model import BaseDocument


class MedicineModel(BaseDocument):
    """
    Medicine record containing the Jan Aushadhi generic,
    composition, pricing and verified branded aliases.
    """

    pmbi_code: str = Field(
        ...,
        min_length=2,
        max_length=30,
    )

    generic_name: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    brand_name: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    aliases: List[str] = Field(
        default_factory=list,
    )

    composition: str = Field(
        ...,
        min_length=2,
        max_length=300,
    )

    category: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    jan_aushadhi_mrp: float = Field(
        ...,
        ge=0,
    )

    branded_avg_mrp: float = Field(
        ...,
        ge=0,
    )

    saving_pct: float = Field(
        ...,
        ge=0,
        le=100,
    )

    pack_size: str = Field(
        ...,
        max_length=50,
    )

    manufacturer: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    is_active: bool = Field(default=True)