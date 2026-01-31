from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class BankNotificationCreate(BaseModel):
    """Data received from Android app"""
    app_package: str
    app_name: Optional[str] = None
    notification_title: str
    notification_text: str
    posted_time: datetime
    raw_data: Optional[str] = None


class BankNotificationResponse(BaseModel):
    id: str
    user_id: str
    app_package: str
    app_name: Optional[str]
    notification_title: str
    notification_text: str
    posted_time: datetime
    amount: Optional[Decimal]
    card_last4: Optional[str]
    operation_type: Optional[str]
    is_processed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class BankNotificationListResponse(BaseModel):
    items: List[BankNotificationResponse]
    total: int
    page: int
    page_size: int


class DeviceStatusUpdate(BaseModel):
    """Status update from Android device"""
    battery_level: int
    is_charging: bool
    has_internet: bool
    is_working: bool
    last_notification_time: Optional[datetime] = None
