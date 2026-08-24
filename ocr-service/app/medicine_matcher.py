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
    "full name",
    "address",
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

    # Remove dosage values such as:
    # 500mg, 5 ml, 100mcg, 2g, 10%, 20 units.
    value = re.sub(
        r"\b\d+(?:\.\d+)?\s*"
        r"(?:mg|mcg|g|ml|iu|units?|%)\b",
        " ",
        value,
    )

    # Remove remaining numbers.
    value = re.sub(r"\d+", " ", value)

    # Retain alphabetic characters and spaces.
    value = re.sub(r"[^a-z\s]", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


# =====================================================
# OCR filtering
# =====================================================

def should_check_line(value: str) -> bool:
    """
    Decide whether an OCR line can be checked
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
    for manual customer or pharmacist review.
    """

    if not should_check_line(value):
        return False

    normalized = normalize_text(value)

    for phrase in IGNORED_PHRASES:
        if phrase in normalized:
            return False

    medicine_text = normalize_medicine_name(value)
    compact_text = medicine_text.replace(" ", "")

    # Ignore short fragments such as:
    # me, ml, gm, dd and rx.
    if len(compact_text) < 4:
        return False

    # Require at least one word containing four letters.
    if not re.search(r"[a-zA-Z]{4,}", medicine_text):
        return False

    return True


# =====================================================
# Prescription medication region
# =====================================================

def get_medication_region(
    ocr_lines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Extract the likely medication section.

    Starting markers:
        Rx
        R
        Inscription

    Ending markers:
        Subscription
        Signa
        Doctor Signature

    If no markers are detected, all OCR lines are returned.
    """

    medication_lines: list[dict[str, Any]] = []

    inside_section = False
    marker_found = False

    for ocr_item in ocr_lines:
        original_text = str(
            ocr_item.get("text", "")
        ).strip()

        normalized = normalize_text(original_text)

        start_marker = (
            normalized in {
                "rx",
                "r",
                "r x",
                "inscription",
            }
            or normalized.startswith("rx ")
        )

        end_marker = (
            normalized == "subscription"
            or normalized == "signa"
            or "doctor signature" in normalized
            or normalized == "signature"
        )

        if start_marker:
            inside_section = True
            marker_found = True
            continue

        if inside_section and end_marker:
            break

        if inside_section:
            medication_lines.append(ocr_item)

    if not marker_found:
        return ocr_lines

    return medication_lines


# =====================================================
# Load medicine catalogue
# =====================================================

async def load_medicine_catalog() -> list[dict[str, Any]]:
    """
    Load medicines from the main FastAPI backend.
    """

    medicines: list[dict[str, Any]] = []
    page = 1

    async with httpx.AsyncClient(
        timeout=20.0,
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
# Medicine searchable names
# =====================================================

def medicine_search_values(
    medicine: dict[str, Any],
) -> list[str]:
    """
    Return medicine names used for matching.

    Fields:
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
# Calculate fuzzy match score
# =====================================================

def calculate_match_score(
    ocr_line: str,
    medicine: dict[str, Any],
) -> float:
    """
    Safely compare an OCR line with one medicine.
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

    # Short OCR fragments cannot use fuzzy matching.
    if len(line_compact) < 4:
        for medicine_name in searchable_values:
            if normalized_line == medicine_name:
                return 100.0

            if normalized_line in medicine_name.split():
                return 100.0

        return 0.0

    scores: list[float] = []

    for medicine_name in searchable_values:
        medicine_compact = medicine_name.replace(
            " ",
            "",
        )

        if not medicine_compact:
            continue

        # Short medicine names such as ORS must occur
        # as complete words.
        if len(medicine_compact) < 5:
            if medicine_name in line_words:
                scores.append(100.0)

            continue

        # Exact phrase match.
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

        # Prevent very short fragments from matching
        # part of a much longer medicine name.
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
# Find matching medicines
# =====================================================

def find_matches(
    ocr_lines: list[dict[str, Any]],
    medicines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Return up to three medicine candidates
    for each relevant OCR line.
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

        candidates.sort(
            key=lambda item: item["match_score"],
            reverse=True,
        )

        unique_candidates = []
        seen_medicines = set()

        for candidate in candidates:
            identifier = (
                candidate.get("medicine_id")
                or candidate.get("pmbi_code")
                or candidate.get("generic_name")
            )

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
    return unmatched medication text for manual review.
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

        unmatched_lines = []

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
                "Candidates are suggestions only. "
                "The customer or pharmacist must "
                "confirm them."
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