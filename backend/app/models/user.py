from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.database import Base


class UserRole(str, enum.Enum):
    OWNER = "owner"
    INVESTOR = "investor"
    SUPPORT = "support"
    TEAMLEAD = "teamlead"
    TRADER = "trader"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.TRADER, nullable=False)
    team_id = Column(String, ForeignKey("teams.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Balances
    working_balance = Column(Numeric(18, 2), default=0)
    security_deposit = Column(Numeric(18, 2), default=0)
    security_deposit_required = Column(Numeric(18, 2), default=500)
    pending_balance = Column(Numeric(18, 2), default=0)

    # Relations
    team = relationship("Team", back_populates="members")
    requisites = relationship("Requisite", back_populates="owner")
    transactions = relationship("Transaction", back_populates="trader")
    disputes = relationship("Dispute", back_populates="trader")
    wallet_transactions = relationship("WalletTransaction", back_populates="user")


class Team(Base):
    __tablename__ = "teams"

    id = Column(String, primary_key=True)
    name = Column(String(100), nullable=False)
    teamlead_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("User", back_populates="team")
