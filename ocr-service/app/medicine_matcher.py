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
    "http://127.0.0.1:8002/api/v1",
)

MINIMUM_MATCH_SCORE = 82
MAX_CATALOG_PAGES = 30
PAGE_SIZE = 100


# =====================================================
# Ignored prescription text
# =====================================================

IGNORED_LINES = {
    "prescription",
    "medical prescription",
    "medical facility",
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
    "rx",
    "r",
}


IGNORED_PHRASES = {
    "prescription",
    "patient",
    "doctor",
    "signature",
    "medical facility",
    "medical practice",
    "medical centre",
    "medical center",
    "hospital",
    "full name",
    "address",
    "street",
    "phone number",
    "date",
    "expiry",
    "exp date",
    "lot no",
    "batch number",
    "filled by",
    "rank and degree",
    "edition of",
    "serial number",
    "manufacturer",
    "mfgr",
    "subscription",
    "superscription",
    "inscription",
    "signa",
    "take one",
    "take two",
    "after food",
    "before food",
    "twice daily",
    "once daily",
    "three times daily",
    "tid",
    "bid",
    "qid",
    "prn",
    "capsule daily",
    "tablet daily",
    "days",
    "cap po",
}


# =====================================================
# Text normalization
# =====================================================

def normalize_text(value: str) -> str:
    """
    Normalize general OCR text.
    """

    value = value.lower().strip()

    value = re.sub(
        r"[^a-z0-9.+\-\s]",
        " ",
        value,
    )

    value = re.sub(r"\s+", " ", value)

    return value.strip()


def normalize_medicine_name(value: str) -> str:
    """
    Remove strength, dosage units, numbers and punctuation.

    Examples:
        Paracetamol 500mg -> paracetamol
        Doxycycline 100mg -> doxycycline
        Crocin 500 -> crocin
    """

    value = value.lower().strip()

    value = re.sub(
        r"\b\d+(?:\.\d+)?\s*"
        r"(?:mg|mcg|g|ml|iu|units?|%)\b",
        " ",
        value,
    )

    value = re.sub(r"\d+", " ", value)
    value = re.sub(r"[^a-z\s]", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


def extract_strengths(value: str) -> set[str]:
    """
    Extract normalized medicine strengths.

    Examples:
        Amoxicillin 500mg -> {"500mg"}
        Paracetamol 650 mg -> {"650mg"}
        Vitamin D3 60,000 IU -> {"60000iu"}
    """

    normalized = value.lower().replace(",", "")

    matches = re.findall(
        r"\b(\d+(?:\.\d+)?)\s*"
        r"(mcg|mg|g|ml|iu|units?|%)\b",
        normalized,
    )

    strengths: set[str] = set()

    for amount, unit in matches:
        normalized_unit = unit.lower()

        if normalized_unit in {"unit", "units"}:
            normalized_unit = "iu"

        strengths.add(
            f"{amount}{normalized_unit}"
        )

    return strengths


# =====================================================
# OCR filtering
# =====================================================

def should_check_line(value: str) -> bool:
    """
    Decide whether an OCR line should be compared
    against the medicine catalogue.
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

    if not re.search(r"[a-zA-Z]", normalized):
        return False

    return True


def should_show_as_unmatched(value: str) -> bool:
    """
    Decide whether an unmatched OCR line should be shown
    for manual review.
    """

    if not should_check_line(value):
        return False

    normalized = normalize_text(value)

    for phrase in IGNORED_PHRASES:
        if phrase in normalized:
            return False

    medicine_text = normalize_medicine_name(value)
    compact_text = medicine_text.replace(" ", "")

    if len(compact_text) < 4:
        return False

    if not re.search(r"[a-zA-Z]{4,}", medicine_text):
        return False

    return True


# =====================================================
# Prescription medicine region
# =====================================================

def get_medication_region(
    ocr_lines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Extract the likely medication section.

    Supports medicine appearing on the same line as Rx:

        Rx: Amoxicillin 500mg caps
    """

    medication_lines: list[dict[str, Any]] = []
    inside_section = False
    marker_found = False

    for ocr_item in ocr_lines:
        original_text = str(
            ocr_item.get("text", "")
        ).strip()

        normalized = normalize_text(original_text)

        # Match only Rx or R as a complete word.
        # This prevents "Riverside" from being treated as Rx.
        rx_match = re.match(
            r"^\s*(?:rx|r)\b\s*[:.\-]?\s*(.+)$",
            original_text,
            flags=re.IGNORECASE,
        )

        if rx_match:
            medicine_after_rx = rx_match.group(1).strip()

            inside_section = True
            marker_found = True

            if medicine_after_rx:
                medication_lines.append(
                    {
                        **ocr_item,
                        "text": medicine_after_rx,
                    }
                )

            continue

        start_marker = normalized in {
            "rx",
            "r",
            "r x",
            "inscription",
        }

        end_marker = (
            normalized == "subscription"
            or normalized == "signa"
            or "doctor signature" in normalized
            or normalized == "signature"
            or normalized.startswith("dr ")
            or normalized.startswith("doctor ")
            or "medical practice" in normalized
            or "medical centre" in normalized
            or "medical center" in normalized
            or "hospital address" in normalized
        )

        if start_marker:
            inside_section = True
            marker_found = True
            continue

        if inside_section and end_marker:
            break

        if inside_section:
            medication_lines.append(ocr_item)

    # Some prescriptions may not contain an Rx marker.
    if not marker_found:
        return ocr_lines

    return medication_lines


# =====================================================
# Load medicine catalogue
# =====================================================

async def load_medicine_catalog() -> list[dict[str, Any]]:
    """
    Load the complete medicine catalogue from the backend.
    """

    medicines: list[dict[str, Any]] = []
    page = 1

    async with httpx.AsyncClient(
        timeout=30.0,
    ) as client:
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
    Return medicine names used for matching.

    Searchable fields:
        Brand name
        Generic name
        Composition
        Verified aliases
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
# Fuzzy matching
# =====================================================
DOSAGE_FORM_WORDS = {
    "tablet",
    "tablets",
    "tab",
    "capsule",
    "capsules",
    "caps",
    "cap",
    "injection",
    "syrup",
    "suspension",
    "cream",
    "ointment",
    "gel",
    "drops",
    "solution",
    "powder",
    "ip",
    "bp",
    "usp",
    "prn",
    "tid",
    "bid",
    "qid",
    "po",
}


def extract_ingredient_name(value: str) -> str:
    """
    Extract the medicine ingredient name without strength,
    dosage form or prescription instructions.
    """

    normalized = normalize_medicine_name(value)

    remaining_words = [
        word
        for word in normalized.split()
        if word not in DOSAGE_FORM_WORDS
    ]

    return " ".join(remaining_words).strip()


def split_composition_ingredients(
    composition: str,
) -> list[str]:
    """
    Split a medicine composition into active ingredients.

    Examples:
        Paracetamol 500mg
            -> ["paracetamol"]

        Paracetamol 500mg and Caffeine 25mg
            -> ["paracetamol", "caffeine"]
    """

    if not composition:
        return []

    parts = re.split(
        r"\s*(?:\+|&|/|\band\b|\bwith\b)\s*",
        composition,
        flags=re.IGNORECASE,
    )

    ingredients: list[str] = []

    for part in parts:
        ingredient = extract_ingredient_name(part)

        if ingredient and ingredient not in ingredients:
            ingredients.append(ingredient)

    return ingredients


def composition_matches_ocr(
    ocr_line: str,
    medicine: dict[str, Any],
) -> bool:
    """
    Ensure every active ingredient in the catalogue medicine
    is also present in the OCR line.

    This prevents:
        Amoxicillin -> Ampicillin
        Paracetamol -> Paracetamol + Caffeine
    """

    ocr_name = extract_ingredient_name(ocr_line)

    if not ocr_name:
        return False

    composition = str(
        medicine.get("composition", "")
    ).strip()

    if not composition:
        composition = str(
            medicine.get("generic_name", "")
        ).strip()

    ingredients = split_composition_ingredients(
        composition
    )

    if not ingredients:
        return True

    for ingredient in ingredients:
        ingredient_score = fuzz.ratio(
            ocr_name,
            ingredient,
        )

        partial_score = fuzz.partial_ratio(
            ingredient,
            ocr_name,
        )

        best_score = max(
            ingredient_score,
            partial_score,
        )

        # Allows small OCR/spelling differences such as:
        # Amoxicillin <-> Amoxycillin
        if best_score < 88:
            return False

    return True


def calculate_match_score(
    ocr_line: str,
    medicine: dict[str, Any],
) -> float:
    """
    Compare OCR text with a catalogue medicine.

    Medicine name and strength are evaluated separately.
    A correct strength receives a bonus.
    An incorrect strength receives a strong penalty.
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

    scores: list[float] = []

    for medicine_name in searchable_values:
        medicine_compact = medicine_name.replace(
            " ",
            "",
        )

        if not medicine_compact:
            continue

        # Handle short medicine names such as ORS.
        if len(medicine_compact) < 5:
            if medicine_name in line_words:
                scores.append(100.0)

            continue

        # Exact medicine-name phrase.
        if medicine_name in normalized_line:
            scores.append(100.0)
            continue

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

        if length_ratio >= 0.60:
            partial_score = fuzz.partial_ratio(
                medicine_name,
                normalized_line,
            )

            scores.append(float(partial_score))

    if not scores:
        return 0.0

    final_score = max(scores)

    ocr_strengths = extract_strengths(ocr_line)

    medicine_strengths: set[str] = set()

    for field_name in (
        "brand_name",
        "generic_name",
        "composition",
    ):
        field_value = medicine.get(field_name)

        if field_value:
            medicine_strengths.update(
                extract_strengths(str(field_value))
            )

    if ocr_strengths and medicine_strengths:
        if ocr_strengths.intersection(
            medicine_strengths
        ):
            final_score += 5
        else:
            final_score -= 35

    return round(
        max(0.0, min(100.0, final_score)),
        2,
    )


# =====================================================
# Find matching medicines
# =====================================================

def find_matches(
    ocr_lines: list[dict[str, Any]],
    medicines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Return up to three medicine candidates
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
            # Reject medicines with different or additional active ingredients.
            if not composition_matches_ocr(
                original_text,
                medicine,
            ):
                continue

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

        candidates.sort(
            key=lambda item: item["match_score"],
            reverse=True,
        )

        unique_candidates: list[dict[str, Any]] = []
        seen_medicines: set[str] = set()

        for candidate in candidates:
            identifier = str(
                candidate.get("medicine_id")
                or candidate.get("pmbi_code")
                or candidate.get("generic_name")
                or ""
            )

            if not identifier:
                continue

            if identifier in seen_medicines:
                continue

            seen_medicines.add(identifier)
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
# Main matching function
# =====================================================

async def match_ocr_medicines(
    ocr_lines: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Match OCR lines against catalogue medicines and
    return unmatched medicine-like text for review.
    """

    try:
        medicines = await load_medicine_catalog()

        medication_region = get_medication_region(
            ocr_lines
        )

        matches = find_matches(
            ocr_lines=medication_region,
            medicines=medicines,
        )

        matched_texts = {
            normalize_text(
                match.get("ocr_text", "")
            )
            for match in matches
        }

        unmatched_lines: list[dict[str, Any]] = []

        for ocr_item in medication_region:
            original_text = str(
                ocr_item.get("text", "")
            ).strip()

            normalized_text = normalize_text(
                original_text
            )

            if normalized_text in matched_texts:
                continue

            if not should_show_as_unmatched(
                original_text
            ):
                continue

            unmatched_lines.append(
                {
                    "ocr_text": original_text,
                    "ocr_confidence": ocr_item.get(
                        "confidence",
                        0,
                    ),
                    "status": "not_in_catalogue",
                    "requires_manual_review": True,
                }
            )

        return {
            "catalog_available": True,
            "catalog_count": len(medicines),
            "matched_line_count": len(matches),
            "matches": matches,
            "unmatched_line_count": len(
                unmatched_lines
            ),
            "unmatched_lines": unmatched_lines,
            "warning": (
                "OCR candidates are suggestions only. "
                "The customer, doctor or pharmacist "
                "must confirm every medicine."
            ),
        }

    except httpx.HTTPError as error:
        return {
            "catalog_available": False,
            "catalog_count": 0,
            "matched_line_count": 0,
            "matches": [],
            "unmatched_line_count": 0,
            "unmatched_lines": [],
            "warning": (
                "OCR completed, but the medicine "
                "backend could not be reached: "
                f"{str(error)}"
            ),
        }

    except Exception as error:
        return {
            "catalog_available": False,
            "catalog_count": 0,
            "matched_line_count": 0,
            "matches": [],
            "unmatched_line_count": 0,
            "unmatched_lines": [],
            "warning": (
                "Medicine matching failed: "
                f"{str(error)}"
            ),
        }
