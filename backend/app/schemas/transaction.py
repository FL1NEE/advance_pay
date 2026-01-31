from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.transaction import TransactionType, TransactionStatus, PaymentMethod


class TransactionBase(BaseModel):
    type: TransactionType
    amount: Decimal
    amount_usdt: Decimal
    method: PaymentMethod


class TransactionCreate(TransactionBase):
    requisite_id: Optional[str] = None
    client_id: Optional[str] = None
    direction: Optional[str] = None


class TransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None


class TransactionResponse(TransactionBase):
    id: str
    order_id: str
    trader_id: str
    requisite_id: Optional[str] = None
    status: TransactionStatus
    card_last4: Optional[str] = None
    bank_name: Optional[str] = None
    client_id: Optional[str] = None
    direction: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    items: List[TransactionResponse]
    total: int
    page: int
    page_size: int
