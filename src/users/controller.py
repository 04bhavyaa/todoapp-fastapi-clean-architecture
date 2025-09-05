from fastapi import APIRouter, status
from uuid import UUID

from ..database.core import DBSession
from . import service, model
from ..auth.service import CurrentUser

import logging

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=model.UserResponse)
def get_current_user(current_user: CurrentUser, db: DBSession):
    return service.get_user_by_id(db, current_user.get_uuid())

@router.put("/change-password", status_code=status.HTTP_200_OK)
def change_password(password_change: model.PasswordChange, current_user: CurrentUser, db: DBSession):
    service.change_user_password(db, current_user.get_uuid(), password_change)
    logging.info(f"Password changed successfully for user ID: {current_user.get_uuid()}")