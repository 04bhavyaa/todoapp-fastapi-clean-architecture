from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import model
from src.entities.todo import Todo
from src.auth.model import TokenData
from src.exceptions import TodoNotFoundError, TodoCreationError
import logging

def create_todo(current_user: TokenData, db: Session, todo_create: model.TodoCreate) -> Todo:
    try:
        new_todo = Todo(**todo_create.model_dump())
        new_todo.user_id = current_user.get_uuid()
        db.add(new_todo)
        db.commit()
        db.refresh(new_todo)
        logging.info(f"Todo created successfully with ID: {new_todo.id} for user ID: {current_user.get_uuid()}")
        return new_todo
    except Exception as e:
        logging.error(f"Error creating todo for user ID: {current_user.get_uuid()} - {str(e)}")
        raise TodoCreationError(str(e))
    
def get_todos(current_user: TokenData, db: Session) -> list[model.TodoResponse]:
    todos = db.query(Todo).filter(Todo.user_id == current_user.get_uuid()).all()
    logging.info(f"Retrieved {len(todos)} todos for user ID: {current_user.get_uuid()}")
    return todos

def get_todo_by_id(current_user: TokenData, db: Session, todo_id: UUID) -> Todo:
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user.get_uuid()).first()
    if not todo:
        logging.warning(f"Todo with id {todo_id} not found for user ID: {current_user.get_uuid()}")
        raise TodoNotFoundError()
    logging.info(f"Todo with id {todo_id} retrieved successfully for user ID: {current_user.get_uuid()}")
    return todo

def update_todo(current_user: TokenData, db: Session, todo_id: UUID, todo_update: model.TodoCreate) -> Todo:
    todo_data = todo_update.model_dump(exclude_unset=True)
    db.query(Todo).filter(Todo.id == todo_id, Todo.user_id == current_user.get_uuid()).update(todo_data)
    db.commit()
    logging.info(f"Todo with id {todo_id} updated successfully for user ID: {current_user.get_uuid()}")
    return get_todo_by_id(current_user, db, todo_id)

def complete_todo(current_user: TokenData, db: Session, todo_id: UUID) -> Todo:
    todo = get_todo_by_id(current_user, db, todo_id)
    if todo.is_completed:
        logging.debug(f"Todo with id {todo_id} is already completed for user ID: {current_user.get_uuid()}")
        return todo
    todo.is_completed = True
    todo.completed_at = datetime.now(timezone.utc)
    db.commit()
    logging.info(f"Todo with id {todo_id} marked as completed for user ID: {current_user.get_uuid()}")
    return todo

def delete_todo(current_user: TokenData, db: Session, todo_id: UUID) -> None:
    todo = get_todo_by_id(current_user, db, todo_id)
    db.delete(todo)
    db.commit()
    logging.info(f"Todo with id {todo_id} deleted successfully for user ID: {current_user.get_uuid()}")