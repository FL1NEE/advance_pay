from fastapi import APIRouter

from app.api.routes import auth, users, requisites, transactions, disputes, wallet, notifications, bank_notifications

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(requisites.router)
api_router.include_router(transactions.router)
api_router.include_router(disputes.router)
api_router.include_router(wallet.router)
api_router.include_router(notifications.router)
api_router.include_router(bank_notifications.router)
