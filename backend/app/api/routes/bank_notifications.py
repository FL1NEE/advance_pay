from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
import uuid
import re

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, UserRole
from app.models.bank_notification import BankNotification
from app.schemas.bank_notification import (
    BankNotificationCreate,
    BankNotificationResponse,
    BankNotificationListResponse,
    DeviceStatusUpdate,
)

router = APIRouter(prefix="/bank-notifications", tags=["bank-notifications"])


def parse_bank_notification(title: str, text: str, app_package: str):
    """Parse amount and card from bank notification"""
    amount = None
    card_last4 = None
    operation_type = None

    full_text = title + ' ' + text

    amount_patterns = [
        r'(\d{1,3}(?:[\s\u00a0]?\d{3})*(?:[.,]\d{2})?)\s*[₽руб\u20bd]',
        r'(\d{1,3}(?:[\s\u00a0]?\d{3})*(?:[.,]\d{2})?)\s*(?:RUB|rub)',
        r'[Сс]умма[:\s]+(\d{1,3}(?:[\s\u00a0]?\d{3})*(?:[.,]\d{2})?)',
        r'на сумму\s+(\d{1,3}(?:[\s\u00a0]?\d{3})*(?:[.,]\d{2})?)',
        r'[Пп]еревод[:\s]+(\d{1,3}(?:[\s\u00a0]?\d{3})*(?:[.,]\d{2})?)',
        r'[Зз]ачисление[:\s]+(\d{1,3}(?:[\s\u00a0]?\d{3})*(?:[.,]\d{2})?)',
        r'(\d+(?:[.,]\d{2})?)\s*р\.?(?:\s|$)',
        r'(\d+(?:[.,]\d{2})?)\s*рублей'
    ]

    for pattern in amount_patterns:
        match = re.search(pattern, full_text, re.IGNORECASE)
        if match:
            amount_str = match.group(1).replace(' ', '').replace('\u00a0', '').replace(',', '.')
            try:
                amount = float(amount_str)
                if amount > 0:
                    break
            except ValueError:
                pass

    card_patterns = [
        r'\*{1,4}(\d{4})',
        r'карт[аы]?\s*\*?(\d{4})',
        r'(\d{4})\s*\*{4}',
        r'[Кк]арта[:\s]+\S*(\d{4})'
    ]

    for pattern in card_patterns:
        match = re.search(pattern, full_text, re.IGNORECASE)
        if match:
            card_last4 = match.group(1)
            break

    credit_keywords = ['зачисление', 'пополнение', 'получен', 'входящий', 'поступление', 'перевод от', 'вам перевели']
    debit_keywords = ['списание', 'покупка', 'оплата', 'перевод', 'снятие', 'оплачен', 'платеж']

    text_lower = full_text.lower()

    if any(keyword in text_lower for keyword in credit_keywords):
        operation_type = 'credit'
    elif any(keyword in text_lower for keyword in debit_keywords):
        operation_type = 'debit'

    return amount, card_last4, operation_type


@router.post("", response_model=BankNotificationResponse, status_code=201)
async def create_bank_notification(
    notification_data: BankNotificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    if current_user.role != UserRole.TRADER:
        raise HTTPException(status_code=403, detail="Only traders can send notifications")

    amount, card_last4, operation_type = parse_bank_notification(
        notification_data.notification_title,
        notification_data.notification_text,
        notification_data.app_package
    )

    notification = BankNotification(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        app_package=notification_data.app_package,
        app_name=notification_data.app_name,
        notification_title=notification_data.notification_title,
        notification_text=notification_data.notification_text,
        posted_time=notification_data.posted_time,
        amount=amount,
        card_last4=card_last4,
        operation_type=operation_type,
        raw_data=notification_data.raw_data,
        is_processed=False,
    )

    db.add(notification)
    await db.commit()
    await db.refresh(notification)

    return notification


@router.get("", response_model=BankNotificationListResponse)
async def get_bank_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    if current_user.role == UserRole.TRADER:
        query = select(BankNotification).where(BankNotification.user_id == current_user.id)
        count_query = select(func.count()).select_from(BankNotification).where(
            BankNotification.user_id == current_user.id
        )
    else:
        query = select(BankNotification)
        count_query = select(func.count()).select_from(BankNotification)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(BankNotification.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    notifications = result.scalars().all()

    return BankNotificationListResponse(
        items=notifications,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("/device-status")
async def update_device_status(
    status_data: DeviceStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update device working status"""

    return {
        "status": "ok",
        "user_id": current_user.id,
        "is_working": status_data.is_working
    }
