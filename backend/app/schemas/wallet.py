from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

from app.models.wallet import WalletTransactionType, WalletTransactionStatus


class WalletTransactionBase(BaseModel):
    type: WalletTransactionType
    amount: Decimal


class WalletTransactionCreate(WalletTransactionBase):
    address: Optional[str] = None


class WalletTransactionResponse(WalletTransactionBase):
    id: str
    user_id: str
    status: WalletTransactionStatus
    tx_hash: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WalletTransactionListResponse(BaseModel):
    items: List[WalletTransactionResponse]
    total: int


class DepositAddressResponse(BaseModel):
    address: str
    network: str = "TRC20"
