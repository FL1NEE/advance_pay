from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.requisite import Requisite
from app.schemas.requisite import RequisiteCreate, RequisiteUpdate, RequisiteResponse

router = APIRouter(prefix="/requisites", tags=["requisites"])


@router.get("", response_model=List[RequisiteResponse])
async def get_requisites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Requisite)
        .where(Requisite.owner_id == current_user.id)
        .order_by(Requisite.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=RequisiteResponse, status_code=status.HTTP_201_CREATED)
async def create_requisite(
    requisite_data: RequisiteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    requisite = Requisite(
        id=str(uuid.uuid4()),
        owner_id=current_user.id,
        type=requisite_data.type,
        bank_name=requisite_data.bank_name,
        card_number=requisite_data.card_number,
        account_number=requisite_data.account_number,
        phone=requisite_data.phone,
        holder_name=requisite_data.holder_name,
        methods=[m.value for m in requisite_data.methods],
        daily_limit=requisite_data.daily_limit,
        monthly_limit=requisite_data.monthly_limit,
    )

    db.add(requisite)
    await db.commit()
    await db.refresh(requisite)

    return requisite


@router.get("/{requisite_id}", response_model=RequisiteResponse)
async def get_requisite(
    requisite_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Requisite)
        .where(Requisite.id == requisite_id)
        .where(Requisite.owner_id == current_user.id)
    )
    requisite = result.scalar_one_or_none()

    if not requisite:
        raise HTTPException(status_code=404, detail="Requisite not found")

    return requisite


@router.patch("/{requisite_id}", response_model=RequisiteResponse)
async def update_requisite(
    requisite_id: str,
    update_data: RequisiteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Requisite)
        .where(Requisite.id == requisite_id)
        .where(Requisite.owner_id == current_user.id)
    )
    requisite = result.scalar_one_or_none()

    if not requisite:
        raise HTTPException(status_code=404, detail="Requisite not found")

    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(requisite, field, value)

    await db.commit()
    await db.refresh(requisite)

    return requisite


@router.delete("/{requisite_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_requisite(
    requisite_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Requisite)
        .where(Requisite.id == requisite_id)
        .where(Requisite.owner_id == current_user.id)
    )
    requisite = result.scalar_one_or_none()

    if not requisite:
        raise HTTPException(status_code=404, detail="Requisite not found")

    await db.delete(requisite)
    await db.commit()
