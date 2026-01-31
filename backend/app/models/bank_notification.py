from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class BankNotification(Base):
    __tablename__ = "bank_notifications"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Notification metadata
    app_package = Column(String(200), nullable=False)  # com.sberbank.android
    app_name = Column(String(100), nullable=True)  # Сбербанк
    notification_title = Column(String(500), nullable=False)
    notification_text = Column(Text, nullable=False)
    posted_time = Column(DateTime(timezone=True), nullable=False)

    # Parsed data
    amount = Column(Numeric(18, 2), nullable=True)
    card_last4 = Column(String(4), nullable=True)
    operation_type = Column(String(50), nullable=True)  # debit/credit

    # Raw JSON data from Android
    raw_data = Column(Text, nullable=True)

    # Processing status
    is_processed = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relations
    user = relationship("User")
