from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import model
from src.entities.user import User
from src.exceptions import UserNotFoundError, InvalidPasswordError, PasswordMismatchError
from src.auth.service import verify_password, get_hashed_password
import logging

def get_user_by_id(db: Session, user_id: UUID) -> model.UserResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logging.warning(f"User with id {user_id} not found")
        raise UserNotFoundError()
    logging.info(f"User with id {user_id} retrieved successfully")
    return user

def change_user_password(db: Session, user_id: UUID, password_change: model.PasswordChange) -> None:
    try:
        user = get_user_by_id(db, user_id)
        # verify current password
        if not verify_password(password_change.current_password, user.hashed_password):
            logging.warning(f"Invalid current password for user ID: {user_id}")
            raise InvalidPasswordError()
        # verify new passwords match
        if password_change.new_password != password_change.new_password_confirm:
            logging.warning(f"New passwords do not match for user ID: {user_id}")
            raise PasswordMismatchError()
        # validate new password
        from .validators import validate_password
        validate_password(password_change.new_password)
        # update password
        user.hashed_password = get_hashed_password(password_change.new_password)
        db.commit()
        logging.info(f"Password changed successfully for user ID: {user_id}")
    except Exception as e:
        logging.error(f"Error changing password for user ID: {user_id} - {str(e)}")
        raise