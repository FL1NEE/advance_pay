from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal

from app.models.user import UserRole


class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    role: UserRole = UserRole.TRADER


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: str
    team_id: Optional[str] = None
    team_name: Optional[str] = None
    is_active: bool
    working_balance: Decimal
    security_deposit: Decimal
    security_deposit_required: Decimal
    pending_balance: Decimal
    created_at: datetime

    class Config:
        from_attributes = True


class UserBalanceResponse(BaseModel):
    available: Decimal
    security_deposit: Decimal
    security_deposit_required: Decimal
    pending: Decimal
    total_processed: Decimal


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None
    username: Optional[str] = None
    role: Optional[UserRole] = None
