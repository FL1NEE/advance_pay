from sqlalchemy import Column, String, Boolean, ForeignKey, Numeric, DateTime, Enum, Integer, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class RequisiteType(str, enum.Enum):
    CARD = "card"
    ACCOUNT = "account"
    SBP = "sbp"


class PaymentMethod(str, enum.Enum):
    SBP = "sbp"
    CARD = "card"
    ACCOUNT = "account"
    QR = "qr"


class Requisite(Base):
    __tablename__ = "requisites"

    id = Column(String, primary_key=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(RequisiteType), nullable=False)
    bank_name = Column(String(100), nullable=False)
    card_number = Column(String(30), nullable=True)
    account_number = Column(String(30), nullable=True)
    phone = Column(String(20), nullable=True)
    holder_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)

    # Limits
    daily_limit = Column(Numeric(18, 2), default=300000)
    daily_used = Column(Numeric(18, 2), default=0)
    monthly_limit = Column(Numeric(18, 2), default=5000000)
    monthly_used = Column(Numeric(18, 2), default=0)

    # Stats
    total_processed = Column(Numeric(18, 2), default=0)
    transactions_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True)

    # Payment methods supported by this requisite (stored as JSON array)
    methods = Column(JSON, default=[])

    # Relations
    owner = relationship("User", back_populates="requisites")
    transactions = relationship("Transaction", back_populates="requisite")
