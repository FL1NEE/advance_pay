from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from decimal import Decimal

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.transaction import Transaction, TransactionStatus
from app.schemas.user import UserResponse, UserBalanceResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/balance", response_model=UserBalanceResponse)
async def get_my_balance(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Calculate total processed
    result = await db.execute(
        select(func.sum(Transaction.amount_usdt))
        .where(Transaction.trader_id == current_user.id)
        .where(Transaction.status == TransactionStatus.COMPLETED)
    )
    total_processed = result.scalar() or Decimal("0")

    return UserBalanceResponse(
        available=current_user.working_balance,
        security_deposit=current_user.security_deposit,
        security_deposit_required=current_user.security_deposit_required,
        pending=current_user.pending_balance,
        total_processed=total_processed,
    )
