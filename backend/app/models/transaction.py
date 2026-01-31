from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class TransactionType(str, enum.Enum):
    PAYIN = "payin"
    PAYOUT = "payout"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    DISPUTED = "disputed"
    CANCELLED = "cancelled"


class PaymentMethod(str, enum.Enum):
    SBP = "sbp"
    CARD = "card"
    ACCOUNT = "account"
    QR = "qr"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True)
    order_id = Column(String(50), unique=True, nullable=False, index=True)
    trader_id = Column(String, ForeignKey("users.id"), nullable=False)
    requisite_id = Column(String, ForeignKey("requisites.id"), nullable=True)

    type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    amount_usdt = Column(Numeric(18, 6), nullable=False)
    method = Column(Enum(PaymentMethod), nullable=False)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)

    # Card/Bank info
    card_last4 = Column(String(4), nullable=True)
    bank_name = Column(String(100), nullable=True)

    # Client info
    client_id = Column(String(100), nullable=True)
    direction = Column(String(100), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relations
    trader = relationship("User", back_populates="transactions")
    requisite = relationship("Requisite", back_populates="transactions")
    dispute = relationship("Dispute", back_populates="transaction", uselist=False)
