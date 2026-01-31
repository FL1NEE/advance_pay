from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class WalletTransactionType(str, enum.Enum):
    DEPOSIT = "deposit"
    WITHDRAW = "withdraw"


class WalletTransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    type = Column(Enum(WalletTransactionType), nullable=False)
    amount = Column(Numeric(18, 6), nullable=False)
    status = Column(Enum(WalletTransactionStatus), default=WalletTransactionStatus.PENDING)

    tx_hash = Column(String(100), nullable=True)
    address = Column(String(100), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relations
    user = relationship("User", back_populates="wallet_transactions")
