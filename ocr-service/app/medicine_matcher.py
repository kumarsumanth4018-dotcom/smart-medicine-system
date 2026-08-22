import os
import re
from typing import Any

import httpx
from rapidfuzz import fuzz


# =====================================================
# Configuration
# =====================================================

BACKEND_API_URL = os.getenv(
    "BACKEND_API_URL",
    "http://127.0.0.1:8000/api/v1",
)

MINIMUM_MATCH_SCORE = 82
MAX_CATALOG_PAGES = 20
PAGE_SIZE = 100


# Common prescription headings that should not be
# treated as possible medicine names.
IGNORED_LINES = {
    "prescription",
    "medical facility",
    "medical prescription",
    "patient name",
    "doctor name",
    "full name",
    "address",
    "signature",
    "date",
    "age",
    "male",
    "female",
    "phone",
    "phone number",
    "diagnosis",
    "expiry date",
    "batch number",
    "lot number",
    "filled by",
    "form",
}


# =====================================================
# Text normalization
# =====================================================

def normalize_text(value: str) -> str:
    """
    Prepare general OCR text for validation.
    """

    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9.+\-\s]", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


def normalize_medicine_name(value: str) -> str:
    """
    Remove strength, dosage units, punctuation and numbers.

    Example:
        Paracetamol 500mg -> paracetamol
        Doxycycline 100mg -> doxycycline
        Crocin 500 -> crocin
    """

    value = value.lower().strip()

    # Remove dosage values such as:
    # 500mg, 5 ml, 100 mcg, 2g, 10%, 20 units
    value = re.sub(
        r"\b\d+(?:\.\d+)?\s*"
        r"(?:mg|mcg|g|ml|iu|units?|%)\b",
        " ",
        value,
    )

    # Remove any remaining numbers.
    value = re.sub(r"\d+", " ", value)

    # Retain only alphabetic characters and spaces.
    value = re.sub(r"[^a-z\s]", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


# =====================================================
# OCR line filtering
# =====================================================

def should_check_line(value: str) -> bool:
    """
    Decide whether an OCR line might contain a medicine name.
    """

    normalized = normalize_text(value)

    if not normalized:
        return False

    if len(normalized) < 3:
        return False

    if len(normalized) > 100:
        return False

    if normalized in IGNORED_LINES:
        return False

    if normalized.isdigit():
        return False

    # Ignore lines without alphabetic characters.
    if not re.search(r"[a-zA-Z]", normalized):
        return False

    return True


# =====================================================
# Backend medicine catalogue
# =====================================================

async def load_medicine_catalog() -> list[dict[str, Any]]:
    """
    Load all available medicines from the main FastAPI backend.
    """

    medicines: list[dict[str, Any]] = []
    page = 1

    async with httpx.AsyncClient(timeout=20.0) as client:
        while page <= MAX_CATALOG_PAGES:
            response = await client.get(
                f"{BACKEND_API_URL}/medicines",
                params={
                    "page": page,
                    "page_size": PAGE_SIZE,
                },
            )

            response.raise_for_status()
            data = response.json()

            page_results = data.get("results", [])

            if not isinstance(page_results, list):
                break

            if not page_results:
                break

            medicines.extend(page_results)

            total = int(
                data.get(
                    "total",
                    len(medicines),
                )
            )

            if len(medicines) >= total:
                break

            page += 1

    return medicines


# =====================================================
# Medicine searchable values
# =====================================================

def medicine_search_values(
    medicine: dict[str, Any],
) -> list[str]:
    """
    Return medicine names that are safe for fuzzy comparison.

    Searchable fields:
        - Brand name
        - Generic name
        - Composition
        - Verified aliases

    PMBI codes are not used for fuzzy name matching because
    short codes and numbers can create false matches.
    """

    fields = [
        medicine.get("brand_name"),
        medicine.get("generic_name"),
        medicine.get("composition"),
    ]

    aliases = medicine.get("aliases", [])

    if isinstance(aliases, list):
        fields.extend(aliases)

    normalized_values: list[str] = []

    for field in fields:
        if not field:
            continue

        normalized = normalize_medicine_name(
            str(field)
        )

        if not normalized:
            continue

        if normalized not in normalized_values:
            normalized_values.append(normalized)

    return normalized_values


# =====================================================
# Matching score
# =====================================================

def calculate_match_score(
    ocr_line: str,
    medicine: dict[str, Any],
) -> float:
    """
    Safely compare an OCR line with a medicine.

    Safety rules:
        1. Very short OCR fragments cannot use fuzzy matching.
        2. Exact medicine phrases receive score 100.
        3. Short medicine names must occur as complete words.
        4. Partial matching is allowed only when text lengths
           are reasonably similar.
    """

    normalized_line = normalize_medicine_name(
        ocr_line
    )

    if not normalized_line:
        return 0.0

    searchable_values = medicine_search_values(
        medicine
    )

    if not searchable_values:
        return 0.0

    line_words = normalized_line.split()
    line_compact = normalized_line.replace(" ", "")

    # Very short OCR fragments such as "me", "ml" and "gm"
    # must never use fuzzy matching.
    if len(line_compact) < 4:
        for medicine_name in searchable_values:
            medicine_words = medicine_name.split()

            if normalized_line == medicine_name:
                return 100.0

            if normalized_line in medicine_words:
                return 100.0

        return 0.0

    scores: list[float] = []

    for medicine_name in searchable_values:
        if not medicine_name:
            continue

        medicine_words = medicine_name.split()
        medicine_compact = medicine_name.replace(
            " ",
            "",
        )

        if not medicine_compact:
            continue

        # Exact medicine phrase inside the OCR line.
        if medicine_name in normalized_line:
            scores.append(100.0)
            continue

        # Short medicine names, such as ORS, must occur
        # as complete words.
        if len(medicine_compact) < 5:
            if medicine_name in line_words:
                scores.append(100.0)

            continue

        # Compare the complete normalized values.
        direct_score = fuzz.ratio(
            normalized_line,
            medicine_name,
        )

        scores.append(float(direct_score))

        shortest_length = min(
            len(line_compact),
            len(medicine_compact),
        )

        longest_length = max(
            len(line_compact),
            len(medicine_compact),
        )

        length_ratio = (
            shortest_length / longest_length
            if longest_length
            else 0
        )

        # Only use partial matching when both values have
        # reasonably similar lengths. This prevents "me"
        # from matching Metformin or Omeprazole.
        if length_ratio >= 0.60:
            partial_score = fuzz.partial_ratio(
                medicine_name,
                normalized_line,
            )

            scores.append(float(partial_score))

    if not scores:
        return 0.0

    return round(max(scores), 2)


# =====================================================
# Find candidate medicines
# =====================================================

def find_matches(
    ocr_lines: list[dict[str, Any]],
    medicines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Find up to three possible medicine candidates
    for every relevant OCR line.
    """

    matched_lines: list[dict[str, Any]] = []

    for ocr_item in ocr_lines:
        original_text = str(
            ocr_item.get("text", "")
        ).strip()

        if not should_check_line(original_text):
            continue

        candidates: list[dict[str, Any]] = []

        for medicine in medicines:
            score = calculate_match_score(
                original_text,
                medicine,
            )

            if score < MINIMUM_MATCH_SCORE:
                continue

            candidates.append(
                {
                    "medicine_id": medicine.get("id"),
                    "pmbi_code": medicine.get(
                        "pmbi_code"
                    ),
                    "brand_name": medicine.get(
                        "brand_name"
                    ),
                    "generic_name": medicine.get(
                        "generic_name"
                    ),
                    "composition": medicine.get(
                        "composition"
                    ),
                    "jan_aushadhi_mrp": medicine.get(
                        "jan_aushadhi_mrp"
                    ),
                    "branded_avg_mrp": medicine.get(
                        "branded_avg_mrp"
                    ),
                    "saving_pct": medicine.get(
                        "saving_pct"
                    ),
                    "match_score": score,
                }
            )

        # Highest matching score first.
        candidates.sort(
            key=lambda item: item["match_score"],
            reverse=True,
        )

        # Remove duplicate medicines.
        unique_candidates = []
        seen_medicines = set()

        for candidate in candidates:
            unique_identifier = (
                candidate.get("medicine_id")
                or candidate.get("pmbi_code")
                or candidate.get("generic_name")
            )

            if unique_identifier in seen_medicines:
                continue

            seen_medicines.add(unique_identifier)
            unique_candidates.append(candidate)

            if len(unique_candidates) == 3:
                break

        if unique_candidates:
            matched_lines.append(
                {
                    "ocr_text": original_text,
                    "ocr_confidence": ocr_item.get(
                        "confidence",
                        0,
                    ),
                    "requires_confirmation": True,
                    "candidates": unique_candidates,
                }
            )

    return matched_lines


# =====================================================
# Main medicine-matching function
# =====================================================

async def match_ocr_medicines(
    ocr_lines: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Load medicines and match them against OCR lines.

    OCR will still succeed when the main backend is unavailable.
    """

    try:
        medicines = await load_medicine_catalog()

        matches = find_matches(
            ocr_lines=ocr_lines,
            medicines=medicines,
        )

        return {
            "catalog_available": True,
            "catalog_count": len(medicines),
            "matched_line_count": len(matches),
            "matches": matches,
            "warning": (
                "Candidates are suggestions only. "
                "The customer or pharmacist must confirm them."
            ),
        }

    except httpx.HTTPError as error:
        return {
            "catalog_available": False,
            "catalog_count": 0,
            "matched_line_count": 0,
            "matches": [],
            "warning": (
                "OCR completed, but the medicine backend "
                f"could not be reached: {str(error)}"
            ),
        }

    except Exception as error:
        return {
            "catalog_available": False,
            "catalog_count": 0,
            "matched_line_count": 0,
            "matches": [],
            "warning": (
                "Medicine matching failed: "
                f"{str(error)}"
            ),
        }