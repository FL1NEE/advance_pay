from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum, Boolean
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class NotificationType(str, enum.Enum):
    PAYIN = "payin"
    PAYOUT = "payout"
    DISPUTE = "dispute"
    SYSTEM = "system"
    BALANCE = "balance"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(String(500), nullable=False)

    amount = Column(Numeric(18, 2), nullable=True)
    amount_usdt = Column(Numeric(18, 6), nullable=True)
    order_id = Column(String(50), nullable=True)

    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
