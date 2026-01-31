from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class DisputeStatus(str, enum.Enum):
    OPEN = "open"
    PENDING = "pending"
    RESOLVED = "resolved"
    WON = "won"
    LOST = "lost"


class DisputeReason(str, enum.Enum):
    PAYMENT_NOT_RECEIVED = "payment_not_received"
    AMOUNT_MISMATCH = "amount_mismatch"
    DUPLICATE_PAYMENT = "duplicate_payment"
    WRONG_DETAILS = "wrong_details"
    TIMEOUT = "timeout"
    OTHER = "other"


class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(String, primary_key=True)
    transaction_id = Column(String, ForeignKey("transactions.id"), nullable=False, unique=True)
    trader_id = Column(String, ForeignKey("users.id"), nullable=False)

    amount = Column(Numeric(18, 2), nullable=False)
    amount_usdt = Column(Numeric(18, 6), nullable=False)
    status = Column(Enum(DisputeStatus), default=DisputeStatus.OPEN)
    reason = Column(Enum(DisputeReason), nullable=False)

    description = Column(Text, nullable=True)
    client_message = Column(Text, nullable=True)
    trader_response = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deadline_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    # Relations
    transaction = relationship("Transaction", back_populates="dispute")
    trader = relationship("User", back_populates="disputes")
