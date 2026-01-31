from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import uuid

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.wallet import WalletTransaction, WalletTransactionType, WalletTransactionStatus
from app.schemas.wallet import (
    WalletTransactionCreate,
    WalletTransactionResponse,
    WalletTransactionListResponse,
    DepositAddressResponse,
)

router = APIRouter(prefix="/wallet", tags=["wallet"])

# Mock deposit address - in production this would be generated per user
MOCK_DEPOSIT_ADDRESS = "TJYxNdv3T1QQHrWYPTQJYNqPJqGJLQxnVZ"


@router.get("/deposit-address", response_model=DepositAddressResponse)
async def get_deposit_address(current_user: User = Depends(get_current_user)):
    # In production, this would fetch/generate unique address per user
    return DepositAddressResponse(address=MOCK_DEPOSIT_ADDRESS)


@router.get("/transactions", response_model=WalletTransactionListResponse)
async def get_wallet_transactions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(WalletTransaction)
        .where(WalletTransaction.user_id == current_user.id)
        .order_by(WalletTransaction.created_at.desc())
    )
    transactions = result.scalars().all()

    return WalletTransactionListResponse(
        items=transactions,
        total=len(transactions)
    )


@router.post("/withdraw", response_model=WalletTransactionResponse, status_code=201)
async def request_withdraw(
    withdraw_data: WalletTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if withdraw_data.type != WalletTransactionType.WITHDRAW:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    if not withdraw_data.address:
        raise HTTPException(status_code=400, detail="Withdrawal address is required")

    # Check balance
    if current_user.working_balance < withdraw_data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Create withdrawal request
    transaction = WalletTransaction(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        type=WalletTransactionType.WITHDRAW,
        amount=withdraw_data.amount,
        address=withdraw_data.address,
        status=WalletTransactionStatus.PENDING,
    )

    # Deduct from working balance
    current_user.working_balance -= withdraw_data.amount
    current_user.pending_balance += withdraw_data.amount

    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)

    return transaction
