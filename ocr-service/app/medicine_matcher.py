import asyncio
import os
import re
import time
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
CATALOG_CACHE_SECONDS = 300


# =====================================================
# Prescription text filtering
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

HEADER_RE = re.compile(
    r"^\s*(?:name|patient(?:\s+name)?|address|age|sex|gender|date|"
    r"physician(?:['’]s)?|lic(?:ense)?|ptr\s*no|ptrno|s2\s*no|"
    r"phone|tel|dr\b|doctor\b|hospital|clinic)\b",
    re.IGNORECASE,
)

INSTRUCTION_RE = re.compile(
    r"^\s*(?:(?:sig|sg|signa)\s*[:.]|"
    r"(?:take\s+)?(?:\d+|one|two|i)\s*"
    r"(?:cap(?:sule)?s?|tab(?:let)?s?)\b|"
    r"(?:for\s+)?(?:\d+|one|two|three|five|seven|suen)"
    r"\s+days?\b)",
    re.IGNORECASE,
)

END_RE = re.compile(
    r"^\s*(?:physician|dr\b|doctor\b|signature\b|"
    r"lic(?:ense)?\.?\s*no|ptr\s*no|ptrno|s2\s*no)",
    re.IGNORECASE,
)

RX_RE = re.compile(
    r"^\s*(?:r\s*x|℞|r)\b\s*[:.\-]?\s*(.*)$",
    re.IGNORECASE,
)


# =====================================================
# Text normalization
# =====================================================

def normalize_text(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9.+\-\s]", " ", value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def normalize_medicine_name(value: str) -> str:
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
    Extract explicitly recognized strengths.

    Unreadable text such as 's0ong' is NOT converted to 500mg.
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

        strengths.add(f"{amount}{normalized_unit}")

    return strengths


def is_non_medicine_line(value: str) -> bool:
    text = str(value).strip()

    return bool(
        HEADER_RE.search(text)
        or INSTRUCTION_RE.search(text)
    )


def strip_rx_prefix(value: str) -> str:
    return RX_RE.sub(
        r"\1",
        str(value).strip(),
    ).strip()


def strength_review_reason(value: str) -> str:
    if not extract_strengths(value):
        return (
            "Strength could not be read reliably; "
            "confirm it from the original prescription."
        )

    return (
        "No reliable catalogue match; "
        "the text may be misread or absent from the catalogue."
    )


def should_check_line(value: str) -> bool:
    if is_non_medicine_line(value):
        return False

    normalized = normalize_text(value)

    if not normalized:
        return False

    if len(normalized) < 3 or len(normalized) > 100:
        return False

    if normalized in IGNORED_LINES:
        return False

    if normalized.isdigit():
        return False

    if not re.search(r"[a-zA-Z]", normalized):
        return False

    return True


def should_show_as_unmatched(value: str) -> bool:
    if not should_check_line(value):
        return False

    normalized = normalize_text(value)

    for phrase in IGNORED_PHRASES:
        if re.search(
            r"\b" + re.escape(phrase) + r"\b",
            normalized,
        ):
            # Do not hide an unresolved medicine just because
            # the same line ends with PRN, TID or similar text.
            if phrase not in {
                "prn",
                "tid",
                "bid",
                "qid",
                "days",
            }:
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
    Locate the medicine section.

    A standalone 'Px' is considered a possible misread Rx
    only with patient-header and spatial medicine context.
    """
    start_index = None
    first_line = None

    for index, item in enumerate(ocr_lines):
        text = str(item.get("text", "")).strip()
        rx = RX_RE.match(text)

        marker = bool(rx) or normalize_text(text) in {
            "rx",
            "r x",
            "r",
            "℞",
        }

        if normalize_text(text) == "px":
            before = ocr_lines[:index]
            after = ocr_lines[index + 1:index + 4]

            header_seen = any(
                HEADER_RE.search(
                    str(previous.get("text", ""))
                )
                for previous in before
            )

            box = item.get("box")
            marker = False

            if (
                header_seen
                and isinstance(box, list)
                and len(box) == 4
            ):
                for following in after:
                    following_text = str(
                        following.get("text", "")
                    )
                    following_box = following.get("box")

                    medicine_hint = bool(
                        re.search(
                            r"\d|caps?\b|tabs?\b|mg\b",
                            following_text,
                            re.IGNORECASE,
                        )
                    )

                    if (
                        medicine_hint
                        and not is_non_medicine_line(
                            following_text
                        )
                        and isinstance(following_box, list)
                        and len(following_box) == 4
                        and following_box[1] >= box[1]
                        and following_box[0] > box[0]
                    ):
                        marker = True
                        break

        if marker:
            start_index = index + 1
            remainder = rx.group(1).strip() if rx else ""

            if remainder:
                first_line = {
                    **item,
                    "text": remainder,
                    "source_ocr_text": text,
                }

            break

    items = (
        ocr_lines[start_index:]
        if start_index is not None
        else ocr_lines
    )

    result = (
        [first_line]
        if first_line
        and should_check_line(first_line["text"])
        else []
    )

    for item in items:
        text = str(item.get("text", "")).strip()

        if start_index is not None and END_RE.search(text):
            break

        if normalize_text(text) in {
            "px",
            "rx",
            "r",
            "r x",
        }:
            continue

        if should_check_line(text):
            result.append(item)

    return result


# =====================================================
# Catalogue loading and caching
# =====================================================

_catalog_cache: list[dict[str, Any]] = []
_catalog_loaded_at = 0.0
_catalog_lock = asyncio.Lock()


async def _fetch_medicine_catalog() -> list[dict[str, Any]]:
    medicines: list[dict[str, Any]] = []
    page = 1
    total = 0

    async with httpx.AsyncClient(timeout=30.0) as client:
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
                data.get("total", len(medicines))
            )

            if len(medicines) >= total:
                break

            page += 1

    if not medicines:
        raise ValueError(
            "The medicine catalogue is empty."
        )

    if len(medicines) < total:
        raise ValueError(
            "Catalogue pagination limit reached; "
            "not all records were loaded."
        )

    return medicines


async def load_medicine_catalog() -> list[dict[str, Any]]:
    global _catalog_cache
    global _catalog_loaded_at

    async with _catalog_lock:
        if (
            _catalog_cache
            and time.monotonic() - _catalog_loaded_at
            < CATALOG_CACHE_SECONDS
        ):
            return _catalog_cache

        catalogue = await _fetch_medicine_catalog()

        _catalog_cache = catalogue
        _catalog_loaded_at = time.monotonic()

        return catalogue


# =====================================================
# Searchable medicine names
# =====================================================

def medicine_search_values(
    medicine: dict[str, Any],
) -> list[str]:
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
# Ingredient normalization and comparison
# =====================================================

def extract_ingredient_name(value: str) -> str:
    """
    Normalize known spelling variants before comparison.

    This does not hard-code OCR mistakes as valid names.
    The original OCR text remains unchanged in the response.
    """
    normalized = normalize_medicine_name(value)

    remaining_words = [
        word
        for word in normalized.split()
        if word not in DOSAGE_FORM_WORDS
    ]

    spelling_variants = {
        "amoxycillin": "amoxicillin",
    }

    return " ".join(
        spelling_variants.get(word, word)
        for word in remaining_words
    ).strip()


def split_composition_ingredients(
    composition: str,
) -> list[str]:
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
    Heuristic ingredient filter for candidate retrieval.
    This is not clinical verification of equivalence.
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

        if best_score < 88:
            return False

    return True


# =====================================================
# Candidate scoring
# =====================================================

def calculate_match_score(
    ocr_line: str,
    medicine: dict[str, Any],
) -> float:
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

        if len(medicine_compact) < 5:
            if medicine_name in line_words:
                scores.append(100.0)
            continue

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
# Find medicine candidates
# =====================================================

def find_matches(
    ocr_lines: list[dict[str, Any]],
    medicines: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    matched_lines: list[dict[str, Any]] = []

    for ocr_item in ocr_lines:
        original_text = str(
            ocr_item.get("text", "")
        ).strip()

        if not should_check_line(original_text):
            continue

        # Missing/unreadable strengths remain under manual review.
        if not extract_strengths(original_text):
            continue

        candidates: list[dict[str, Any]] = []

        for medicine in medicines:
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
                    "pmbi_code": medicine.get("pmbi_code"),
                    "brand_name": medicine.get("brand_name"),
                    "generic_name": medicine.get("generic_name"),
                    "composition": medicine.get("composition"),
                    "jan_aushadhi_mrp": medicine.get(
                        "jan_aushadhi_mrp"
                    ),
                    "branded_avg_mrp": medicine.get(
                        "branded_avg_mrp"
                    ),
                    "saving_pct": medicine.get("saving_pct"),
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
# Main OCR matching entry point
# =====================================================

async def match_ocr_medicines(
    ocr_lines: list[dict[str, Any]],
) -> dict[str, Any]:
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
            normalize_text(match.get("ocr_text", ""))
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
                    "source_ocr_text": ocr_item.get(
                        "source_ocr_text",
                        original_text,
                    ),
                    "box": ocr_item.get("box"),
                    "status": (
                        "strength_unclear"
                        if not extract_strengths(original_text)
                        else "no_reliable_match"
                    ),
                    "reason": strength_review_reason(
                        original_text
                    ),
                    "requires_manual_review": True,
                }
            )

        return {
            "catalog_available": True,
            "catalog_count": len(medicines),
            "matched_line_count": len(matches),
            "matches": matches,
            "unmatched_line_count": len(unmatched_lines),
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