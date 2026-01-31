from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
import uuid

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.transaction import Transaction, TransactionType, TransactionStatus
from app.schemas.transaction import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionListResponse,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


def generate_order_id() -> str:
    import random
    return f"ORD-{random.randint(10000, 99999)}"


@router.get("", response_model=TransactionListResponse)
async def get_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    type: Optional[TransactionType] = None,
    status: Optional[TransactionStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Transaction).where(Transaction.trader_id == current_user.id)
    count_query = select(func.count()).select_from(Transaction).where(Transaction.trader_id == current_user.id)

    if type:
        query = query.where(Transaction.type == type)
        count_query = count_query.where(Transaction.type == type)

    if status:
        query = query.where(Transaction.status == status)
        count_query = count_query.where(Transaction.status == status)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Get paginated results
    query = query.order_by(Transaction.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    transactions = result.scalars().all()

    return TransactionListResponse(
        items=transactions,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=TransactionResponse, status_code=201)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    transaction = Transaction(
        id=str(uuid.uuid4()),
        order_id=generate_order_id(),
        trader_id=current_user.id,
        type=transaction_data.type,
        amount=transaction_data.amount,
        amount_usdt=transaction_data.amount_usdt,
        method=transaction_data.method,
        requisite_id=transaction_data.requisite_id,
        client_id=transaction_data.client_id,
        direction=transaction_data.direction,
    )

    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)

    return transaction


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Transaction)
        .where(Transaction.id == transaction_id)
        .where(Transaction.trader_id == current_user.id)
    )
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction


@router.patch("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    update_data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Transaction)
        .where(Transaction.id == transaction_id)
        .where(Transaction.trader_id == current_user.id)
    )
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if update_data.status:
        transaction.status = update_data.status
        if update_data.status == TransactionStatus.COMPLETED:
            from datetime import datetime
            transaction.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(transaction)

    return transaction
