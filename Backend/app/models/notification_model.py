from typing import Optional, Literal
from pydantic import Field
from app.models.base_model import BaseDocument

NotificationType = Literal["success", "info", "warning", "alert"]


class NotificationModel(BaseDocument):
    """An in-app notification for a single user."""

    user_email: str
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=500)
    type: NotificationType = "info"
    is_read: bool = False
    # Optional link to what this notification is about, e.g. a
    # medicine's pmbi_code — lets the frontend navigate on click.
    pmbi_code: Optional[str] = None


class StockAlertSubscriptionModel(BaseDocument):
    """
    A user's request to be notified when a specific medicine comes
    back in stock (SRS: "Customer Stock Alert" feature).
    One-shot — consumed (deactivated) once the notification fires.
    """

    user_email: str
    pmbi_code: str
    is_active: bool = True