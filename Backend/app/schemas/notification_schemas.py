from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: str
    title: str
    description: str
    type: str
    isRead: bool
    createdAt: datetime
    pmbiCode: Optional[str] = None


class NotificationListResponse(BaseModel):
    total: int
    unread: int
    results: List[NotificationResponse]


class StockAlertSubscribeRequest(BaseModel):
    pmbi_code: str