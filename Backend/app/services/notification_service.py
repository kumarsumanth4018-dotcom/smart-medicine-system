from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.database.connection import get_database
from app.core.constants import NOTIFICATIONS_COLLECTION, STOCK_ALERTS_COLLECTION
from app.models.notification_model import NotificationModel, StockAlertSubscriptionModel
from app.utils.logger import logger


def _to_object_id(notification_id: str) -> ObjectId:
    try:
        return ObjectId(notification_id)
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid notification id.",
        )


def _serialize(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc["description"],
        "type": doc.get("type", "info"),
        "isRead": doc.get("is_read", False),
        "createdAt": doc["created_at"],
        "pmbiCode": doc.get("pmbi_code"),
    }


async def create_notification(
    user_email: str,
    title: str,
    description: str,
    type: str = "info",
    pmbi_code: str | None = None,
) -> dict:
    """Create a new notification for a user. Used internally by other services
    (e.g. stock alerts firing on restock) as well as directly."""
    db = get_database()

    notification = NotificationModel(
        user_email=user_email,
        title=title,
        description=description,
        type=type,
        pmbi_code=pmbi_code,
    )
    result = await db[NOTIFICATIONS_COLLECTION].insert_one(notification.dict())
    logger.info(f"Notification created for {user_email}: {title}")

    return {"id": str(result.inserted_id)}


async def get_user_notifications(user_email: str) -> dict:
    """Fetch all notifications for a user, newest first."""
    db = get_database()

    cursor = (
        db[NOTIFICATIONS_COLLECTION]
        .find({"user_email": user_email})
        .sort("created_at", -1)
    )
    docs = [doc async for doc in cursor]

    results = [_serialize(doc) for doc in docs]
    unread = sum(1 for r in results if not r["isRead"])

    return {
        "total": len(results),
        "unread": unread,
        "results": results,
    }


async def mark_notification_read(notification_id: str, user_email: str) -> dict:
    db = get_database()
    object_id = _to_object_id(notification_id)

    result = await db[NOTIFICATIONS_COLLECTION].update_one(
        {"_id": object_id, "user_email": user_email},
        {"$set": {"is_read": True}},
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )

    return {"message": "Notification marked as read."}


async def mark_all_notifications_read(user_email: str) -> dict:
    db = get_database()

    result = await db[NOTIFICATIONS_COLLECTION].update_many(
        {"user_email": user_email, "is_read": False},
        {"$set": {"is_read": True}},
    )

    return {"message": f"Marked {result.modified_count} notifications as read."}


async def delete_notification(notification_id: str, user_email: str) -> dict:
    db = get_database()
    object_id = _to_object_id(notification_id)

    result = await db[NOTIFICATIONS_COLLECTION].delete_one(
        {"_id": object_id, "user_email": user_email},
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )

    return {"message": "Notification deleted."}


# ============================================================
# Stock alerts — SRS "Customer Stock Alert" feature:
# Medicine Out of Stock -> user clicks "Notify Me" -> subscription
# saved -> medicine becomes available -> notification fires.
# ============================================================

async def subscribe_to_stock_alert(user_email: str, pmbi_code: str) -> dict:
    """Subscribe a user to be notified when a medicine is back in stock."""
    db = get_database()

    existing = await db[STOCK_ALERTS_COLLECTION].find_one({
        "user_email": user_email,
        "pmbi_code": pmbi_code,
        "is_active": True,
    })
    if existing:
        return {"message": "You're already subscribed to this alert."}

    subscription = StockAlertSubscriptionModel(
        user_email=user_email,
        pmbi_code=pmbi_code,
    )
    await db[STOCK_ALERTS_COLLECTION].insert_one(subscription.dict())
    logger.info(f"Stock alert subscription created: {user_email} -> {pmbi_code}")

    return {"message": "You'll be notified when this medicine is back in stock."}


async def notify_stock_alert_subscribers(pmbi_code: str, medicine_name: str, kendra_name: str) -> int:
    """
    Fire notifications for everyone subscribed to this medicine's stock
    alert, then deactivate those subscriptions (one-shot).
    Called by kendra_service when a restock brings a medicine from
    0 back to a positive quantity. Returns the number notified.
    """
    db = get_database()

    cursor = db[STOCK_ALERTS_COLLECTION].find({
        "pmbi_code": pmbi_code,
        "is_active": True,
    })
    subscribers = [doc async for doc in cursor]

    for sub in subscribers:
        await create_notification(
            user_email=sub["user_email"],
            title="Medicine Available",
            description=f"{medicine_name} is back in stock at {kendra_name}.",
            type="success",
            pmbi_code=pmbi_code,
        )

    if subscribers:
        await db[STOCK_ALERTS_COLLECTION].update_many(
            {"pmbi_code": pmbi_code, "is_active": True},
            {"$set": {"is_active": False}},
        )
        logger.info(f"Fired {len(subscribers)} stock alert(s) for {pmbi_code}")

    return len(subscribers)