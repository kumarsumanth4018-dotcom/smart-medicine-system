from fastapi import APIRouter, Depends
from app.schemas.token_schema import TokenPayload
from app.utils.jwt_helper import get_current_user
from app.schemas.notification_schemas import StockAlertSubscribeRequest
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_read,
    mark_all_notifications_read,
    delete_notification,
    subscribe_to_stock_alert,
)

router = APIRouter(
    prefix="/api/v1",
    tags=["Notifications"],
)


@router.get("/users/me/notifications")
async def list_my_notifications(
    current_user: TokenPayload = Depends(get_current_user),
):
    """Get all notifications for the current user, newest first."""
    return await get_user_notifications(current_user.sub)


@router.patch("/notifications/{notification_id}/read")
async def mark_read(
    notification_id: str,
    current_user: TokenPayload = Depends(get_current_user),
):
    """Mark a single notification as read."""
    return await mark_notification_read(notification_id, current_user.sub)


@router.patch("/users/me/notifications/read-all")
async def mark_all_read(
    current_user: TokenPayload = Depends(get_current_user),
):
    """Mark all of the current user's notifications as read."""
    return await mark_all_notifications_read(current_user.sub)


@router.delete("/notifications/{notification_id}")
async def remove_notification(
    notification_id: str,
    current_user: TokenPayload = Depends(get_current_user),
):
    """Delete a single notification."""
    return await delete_notification(notification_id, current_user.sub)


@router.post("/medicines/{pmbi_code}/notify-me")
async def notify_me_when_available(
    pmbi_code: str,
    current_user: TokenPayload = Depends(get_current_user),
):
    """Subscribe to be notified when this medicine is back in stock."""
    return await subscribe_to_stock_alert(current_user.sub, pmbi_code)