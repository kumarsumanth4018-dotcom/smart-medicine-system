"""
Admin Service

Aggregates real data across ALL Kendras for the Admin module — no mock
data. Backed entirely by the existing `kendras` (with embedded stock/
batches) and `medicines` collections; no new collections needed.

Covers two of the four SRS-defined Admin capabilities:
  - Inventory Monitoring (current stock, low/out-of-stock, batch info)
  - Expiry Monitoring (amber <=60 days / red <=30 days / expired)

Demand Analytics and system-wide Sales History are a separate pass —
they read from the `bills` collection instead.
"""

from datetime import datetime, timezone, timedelta

from app.database.connection import get_database
from app.core.constants import KENDRAS_COLLECTION, MEDICINES_COLLECTION, BILLS_COLLECTION

AMBER_THRESHOLD_DAYS = 60
RED_THRESHOLD_DAYS = 30


async def _load_medicine_lookup(db) -> dict:
    """One bulk fetch of all medicines, keyed by pmbi_code, so per-batch
    joins below don't hit the DB once per stock item."""
    lookup = {}
    async for doc in db[MEDICINES_COLLECTION].find({}):
        lookup[doc["pmbi_code"]] = {
            "name": doc.get("brand_name", doc["pmbi_code"]),
            "generic_name": doc.get("generic_name", ""),
            "category": doc.get("category", ""),
        }
    return lookup


async def get_inventory_overview() -> dict:
    """System-wide stock snapshot across every active Kendra."""
    db = get_database()
    medicine_lookup = await _load_medicine_lookup(db)

    totals = {"in_stock": 0, "low_stock": 0, "out_of_stock": 0}
    low_stock_items = []
    out_of_stock_items = []
    per_kendra = []

    async for kendra in db[KENDRAS_COLLECTION].find({"is_active": {"$ne": False}}):
        stock = kendra.get("stock", [])
        kendra_counts = {"in_stock": 0, "low_stock": 0, "out_of_stock": 0}

        for item in stock:
            status = item.get("status", "out_of_stock")
            totals[status] = totals.get(status, 0) + 1
            kendra_counts[status] = kendra_counts.get(status, 0) + 1

            med = medicine_lookup.get(item["pmbi_code"], {})
            row = {
                "kendra_id": str(kendra["_id"]),
                "kendra_name": kendra.get("name", ""),
                "pmbi_code": item["pmbi_code"],
                "medicine_name": med.get("name", item["pmbi_code"]),
                "quantity": item.get("total_qty", 0),
                "status": status,
            }
            if status == "low_stock":
                low_stock_items.append(row)
            elif status == "out_of_stock":
                out_of_stock_items.append(row)

        per_kendra.append({
            "kendra_id": str(kendra["_id"]),
            "kendra_name": kendra.get("name", ""),
            "total_medicines": len(stock),
            **kendra_counts,
        })

    return {
        "totals": {
            "total_medicines": sum(totals.values()),
            **totals,
        },
        "low_stock_items": low_stock_items,
        "out_of_stock_items": out_of_stock_items,
        "per_kendra": per_kendra,
    }


async def get_expiry_overview() -> dict:
    """System-wide batch expiry snapshot, bucketed per the SRS thresholds:
    amber <=60 days, red <=30 days, expired = already past expiry."""
    db = get_database()
    medicine_lookup = await _load_medicine_lookup(db)

    now = datetime.now(timezone.utc)
    buckets = {"expired": [], "red": [], "amber": [], "ok": []}

    async for kendra in db[KENDRAS_COLLECTION].find({"is_active": {"$ne": False}}):
        for item in kendra.get("stock", []):
            med = medicine_lookup.get(item["pmbi_code"], {})
            for batch in item.get("batches", []):
                expiry_date = batch.get("expiry_date")
                if not expiry_date:
                    continue
                if expiry_date.tzinfo is None:
                    expiry_date = expiry_date.replace(tzinfo=timezone.utc)
                days_left = (expiry_date - now).days

                entry = {
                    "kendra_id": str(kendra["_id"]),
                    "kendra_name": kendra.get("name", ""),
                    "pmbi_code": item["pmbi_code"],
                    "medicine_name": med.get("name", item["pmbi_code"]),
                    "batch_number": batch.get("batch_number", ""),
                    "quantity": batch.get("quantity", 0),
                    "expiry_date": expiry_date,
                    "days_left": days_left,
                }

                if days_left < 0:
                    buckets["expired"].append(entry)
                elif days_left <= RED_THRESHOLD_DAYS:
                    buckets["red"].append(entry)
                elif days_left <= AMBER_THRESHOLD_DAYS:
                    buckets["amber"].append(entry)
                else:
                    buckets["ok"].append(entry)

    for key in ("expired", "red", "amber"):
        buckets[key].sort(key=lambda e: e["days_left"])

    return {
        "summary": {
            "expired_count": len(buckets["expired"]),
            "red_count": len(buckets["red"]),
            "amber_count": len(buckets["amber"]),
        },
        "expired": buckets["expired"],
        "red": buckets["red"],
        "amber": buckets["amber"],
    }


async def get_demand_analytics(trend_days: int = 14) -> dict:
    """System-wide sales analytics from the real `bills` collection —
    revenue summary, top-selling medicines, and a daily sales trend.

    Note: this covers the sales-derived half of the SRS's "Demand
    Analytics" spec (top-selling, sales trends, revenue summary).
    "Most searched medicines" and "users waiting for a medicine" aren't
    included — the backend doesn't track search queries or stock-alert
    subscriptions yet, so there's no real data to aggregate for those.
    """
    db = get_database()

    now = datetime.now(timezone.utc)
    start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    # Sunday-based week start, matching the Pharmacy dashboard's convention.
    days_since_sunday = (start_of_today.weekday() + 1) % 7
    start_of_week = start_of_today - timedelta(days=days_since_sunday)
    start_of_month = start_of_today.replace(day=1)
    trend_start = start_of_today - timedelta(days=trend_days - 1)

    revenue = {"today": 0.0, "week": 0.0, "month": 0.0, "all_time": 0.0}
    orders = {"today": 0, "week": 0, "month": 0, "all_time": 0}
    medicine_sales = {}  # pmbi_code -> {name, quantity, revenue}
    daily_trend = {}     # 'YYYY-MM-DD' -> revenue

    async for bill in db[BILLS_COLLECTION].find({}):
        billed_at = bill["billed_at"]
        if billed_at.tzinfo is None:
            billed_at = billed_at.replace(tzinfo=timezone.utc)
        amount = bill.get("total_amount", 0.0)

        revenue["all_time"] += amount
        orders["all_time"] += 1
        if billed_at >= start_of_today:
            revenue["today"] += amount
            orders["today"] += 1
        if billed_at >= start_of_week:
            revenue["week"] += amount
            orders["week"] += 1
        if billed_at >= start_of_month:
            revenue["month"] += amount
            orders["month"] += 1

        if billed_at >= trend_start:
            day_key = billed_at.strftime("%Y-%m-%d")
            daily_trend[day_key] = daily_trend.get(day_key, 0.0) + amount

        for item in bill.get("items", []):
            code = item["pmbi_code"]
            entry = medicine_sales.setdefault(code, {
                "pmbi_code": code,
                "medicine_name": item.get("medicine_name", code),
                "quantity": 0,
                "revenue": 0.0,
            })
            entry["quantity"] += item.get("quantity", 0)
            entry["revenue"] += item.get("line_total", 0.0)

    top_selling = sorted(medicine_sales.values(), key=lambda m: m["quantity"], reverse=True)[:10]
    for m in top_selling:
        m["revenue"] = round(m["revenue"], 2)

    trend = []
    for i in range(trend_days):
        day = (trend_start + timedelta(days=i)).strftime("%Y-%m-%d")
        trend.append({"date": day, "revenue": round(daily_trend.get(day, 0.0), 2)})

    return {
        "revenue": {k: round(v, 2) for k, v in revenue.items()},
        "orders": orders,
        "top_selling": top_selling,
        "daily_trend": trend,
    }


async def list_all_bills(page: int = 1, page_size: int = 20) -> dict:
    """System-wide sales history across every Kendra, most recent first —
    same idea as the Pharmacy Owner's sales history, but unscoped."""
    db = get_database()

    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)

    total = await db[BILLS_COLLECTION].count_documents({})

    kendra_names = {}
    async for k in db[KENDRAS_COLLECTION].find({}, {"name": 1}):
        kendra_names[str(k["_id"])] = k.get("name", "")

    cursor = (
        db[BILLS_COLLECTION]
        .find({})
        .sort("billed_at", -1)
        .skip((page - 1) * page_size)
        .limit(page_size)
    )

    results = []
    async for doc in cursor:
        doc["bill_id"] = str(doc.pop("_id"))
        doc["kendra_name"] = kendra_names.get(doc["kendra_id"], doc["kendra_id"])
        results.append(doc)

    return {"total": total, "page": page, "page_size": page_size, "results": results}