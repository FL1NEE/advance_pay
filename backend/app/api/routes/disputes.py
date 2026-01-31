from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload
from typing import Optional
from datetime import datetime, timedelta
import uuid

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.dispute import Dispute, DisputeStatus
from app.models.transaction import Transaction, TransactionStatus
from app.schemas.dispute import (
    DisputeCreate,
    DisputeUpdate,
    DisputeResponse,
    DisputeListResponse,
)

router = APIRouter(prefix="/disputes", tags=["disputes"])


@router.get("", response_model=DisputeListResponse)
async def get_disputes(
    status: Optional[DisputeStatus] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Dispute)
        .options(joinedload(Dispute.transaction))
        .where(Dispute.trader_id == current_user.id)
    )
    count_query = (
        select(func.count())
        .select_from(Dispute)
        .where(Dispute.trader_id == current_user.id)
    )

    if status:
        query = query.where(Dispute.status == status)
        count_query = count_query.where(Dispute.status == status)

    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(Dispute.created_at.desc())
    result = await db.execute(query)
    disputes = result.scalars().unique().all()

    # Map disputes with transaction info
    dispute_responses = []
    for dispute in disputes:
        tx = dispute.transaction
        dispute_responses.append(DisputeResponse(
            id=dispute.id,
            transaction_id=dispute.transaction_id,
            trader_id=dispute.trader_id,
            order_id=tx.order_id if tx else "",
            amount=dispute.amount,
            amount_usdt=dispute.amount_usdt,
            status=dispute.status,
            reason=dispute.reason,
            description=dispute.description,
            client_message=dispute.client_message,
            trader_response=dispute.trader_response,
            method=tx.method if tx else None,
            bank_name=tx.bank_name if tx else None,
            card_last4=tx.card_last4 if tx else None,
            direction=tx.direction if tx else None,
            created_at=dispute.created_at,
            deadline_at=dispute.deadline_at,
            resolved_at=dispute.resolved_at,
        ))

    return DisputeListResponse(items=dispute_responses, total=total)


@router.post("", response_model=DisputeResponse, status_code=201)
async def create_dispute(
    dispute_data: DisputeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Check transaction exists
    result = await db.execute(
        select(Transaction)
        .where(Transaction.id == dispute_data.transaction_id)
        .where(Transaction.trader_id == current_user.id)
    )
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Check if dispute already exists
    result = await db.execute(
        select(Dispute).where(Dispute.transaction_id == dispute_data.transaction_id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Dispute already exists for this transaction")

    dispute = Dispute(
        id=str(uuid.uuid4()),
        transaction_id=dispute_data.transaction_id,
        trader_id=current_user.id,
        amount=transaction.amount,
        amount_usdt=transaction.amount_usdt,
        reason=dispute_data.reason,
        description=dispute_data.description,
        client_message=dispute_data.client_message,
        deadline_at=datetime.utcnow() + timedelta(hours=1),
    )

    # Update transaction status
    transaction.status = TransactionStatus.DISPUTED

    db.add(dispute)
    await db.commit()
    await db.refresh(dispute)

    return DisputeResponse(
        id=dispute.id,
        transaction_id=dispute.transaction_id,
        trader_id=dispute.trader_id,
        order_id=transaction.order_id,
        amount=dispute.amount,
        amount_usdt=dispute.amount_usdt,
        status=dispute.status,
        reason=dispute.reason,
        description=dispute.description,
        client_message=dispute.client_message,
        trader_response=dispute.trader_response,
        method=transaction.method,
        bank_name=transaction.bank_name,
        card_last4=transaction.card_last4,
        direction=transaction.direction,
        created_at=dispute.created_at,
        deadline_at=dispute.deadline_at,
        resolved_at=dispute.resolved_at,
    )


@router.patch("/{dispute_id}", response_model=DisputeResponse)
async def update_dispute(
    dispute_id: str,
    update_data: DisputeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Dispute)
        .options(joinedload(Dispute.transaction))
        .where(Dispute.id == dispute_id)
        .where(Dispute.trader_id == current_user.id)
    )
    dispute = result.scalar_one_or_none()

    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    if update_data.trader_response:
        dispute.trader_response = update_data.trader_response

    if update_data.status:
        dispute.status = update_data.status
        if update_data.status in [DisputeStatus.RESOLVED, DisputeStatus.WON, DisputeStatus.LOST]:
            dispute.resolved_at = datetime.utcnow()

    await db.commit()
    await db.refresh(dispute)

    tx = dispute.transaction
    return DisputeResponse(
        id=dispute.id,
        transaction_id=dispute.transaction_id,
        trader_id=dispute.trader_id,
        order_id=tx.order_id if tx else "",
        amount=dispute.amount,
        amount_usdt=dispute.amount_usdt,
        status=dispute.status,
        reason=dispute.reason,
        description=dispute.description,
        client_message=dispute.client_message,
        trader_response=dispute.trader_response,
        method=tx.method if tx else None,
        bank_name=tx.bank_name if tx else None,
        card_last4=tx.card_last4 if tx else None,
        direction=tx.direction if tx else None,
        created_at=dispute.created_at,
        deadline_at=dispute.deadline_at,
        resolved_at=dispute.resolved_at,
    )
