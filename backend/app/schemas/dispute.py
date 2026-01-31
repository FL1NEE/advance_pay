from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.dispute import DisputeStatus, DisputeReason
from app.models.transaction import PaymentMethod


class DisputeBase(BaseModel):
    reason: DisputeReason
    description: Optional[str] = None
    client_message: Optional[str] = None


class DisputeCreate(DisputeBase):
    transaction_id: str


class DisputeUpdate(BaseModel):
    status: Optional[DisputeStatus] = None
    trader_response: Optional[str] = None


class DisputeResponse(DisputeBase):
    id: str
    transaction_id: str
    trader_id: str
    order_id: str
    amount: Decimal
    amount_usdt: Decimal
    status: DisputeStatus
    trader_response: Optional[str] = None
    method: PaymentMethod
    bank_name: Optional[str] = None
    card_last4: Optional[str] = None
    direction: Optional[str] = None
    created_at: datetime
    deadline_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DisputeListResponse(BaseModel):
    items: List[DisputeResponse]
    total: int
