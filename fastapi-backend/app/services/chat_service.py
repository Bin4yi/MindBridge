from sqlalchemy.orm import Session
from app.models.chat import Chat
from typing import List, Optional
import logging
import uuid

logger = logging.getLogger(__name__)

def save_user_message(db: Session, user_id: int, message: str, session_id: str) -> Chat:
    """Save user message"""
    db_message = Chat(
        user_id=user_id,
        message=message,
        session_id=session_id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    logger.info(f"User message saved with ID: {db_message.message_id}")
    return db_message

def save_agent_response(db: Session, message_id: int, response: str) -> bool:
    """Save agent response"""
    db_message = db.query(Chat).filter(Chat.message_id == message_id).first()
    if not db_message:
        logger.error(f"Failed to save agent response - message not found: {message_id}")
        return False
        
    db_message.response = response
    db.commit()
    logger.info(f"Agent response saved for message ID: {message_id}")
    return True

def get_chat_history(db: Session, user_id: int, limit: int = 50) -> List[Chat]:
    """Get chat history for user"""
    return db.query(Chat).filter(
        Chat.user_id == user_id
    ).order_by(Chat.created_at.desc()).limit(limit).all()

def get_chats_by_session(db: Session, session_id: str) -> List[Chat]:
    """Get chats by session ID"""
    return db.query(Chat).filter(
        Chat.session_id == session_id
    ).order_by(Chat.created_at.asc()).all()