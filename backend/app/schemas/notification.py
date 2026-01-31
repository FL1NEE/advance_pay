from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.notification import NotificationType


class NotificationBase(BaseModel):
    type: NotificationType
    title: str
    message: str
    amount: Optional[Decimal] = None
    amount_usdt: Optional[Decimal] = None
    order_id: Optional[str] = None


class NotificationResponse(NotificationBase):
    id: str
    user_id: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    items: List[NotificationResponse]
    unread_count: int
