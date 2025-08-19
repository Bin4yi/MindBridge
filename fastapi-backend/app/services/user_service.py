from sqlalchemy.orm import Session
from app.models.user import User
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

def create_user(db: Session, name: str) -> User:
    """Create a new user"""
    db_user = User(name=name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    logger.info(f"User created with ID: {db_user.user_id}")
    return db_user

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.user_id == user_id).first()

def get_all_users(db: Session) -> List[User]:
    """Get all users"""
    return db.query(User).order_by(User.created_at.desc()).all()