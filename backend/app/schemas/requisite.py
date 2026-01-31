from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.requisite import RequisiteType
from app.models.transaction import PaymentMethod


class RequisiteBase(BaseModel):
    type: RequisiteType
    bank_name: str
    card_number: Optional[str] = None
    account_number: Optional[str] = None
    phone: Optional[str] = None
    holder_name: str
    methods: List[PaymentMethod] = []


class RequisiteCreate(RequisiteBase):
    daily_limit: Decimal = Decimal("300000")
    monthly_limit: Decimal = Decimal("5000000")


class RequisiteUpdate(BaseModel):
    is_active: Optional[bool] = None
    daily_limit: Optional[Decimal] = None
    monthly_limit: Optional[Decimal] = None


class RequisiteResponse(RequisiteBase):
    id: str
    owner_id: str
    is_active: bool
    daily_limit: Decimal
    daily_used: Decimal
    monthly_limit: Decimal
    monthly_used: Decimal
    total_processed: Decimal
    transactions_count: int
    created_at: datetime
    last_used_at: Optional[datetime] = None

    class Config:
        from_attributes = True
