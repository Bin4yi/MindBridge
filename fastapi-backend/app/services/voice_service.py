from sqlalchemy.orm import Session
from app.models.voice import Voice
from typing import List, Optional, Dict, Any, Tuple
import logging
import httpx
import uuid
from app.config import settings

logger = logging.getLogger(__name__)

def save_voice_transcription(db: Session, user_id: int, user_text: str, session_id: str) -> Voice:
    """Save user voice transcription"""
    db_voice = Voice(
        user_id=user_id,
        user_text=user_text,
        session_id=session_id
    )
    db.add(db_voice)
    db.commit()
    db.refresh(db_voice)
    logger.info(f"Voice transcription saved with ID: {db_voice.voice_id}")
    return db_voice

def save_voice_agent_response(db: Session, voice_id: int, agent_response: str) -> bool:
    """Save agent voice response"""
    db_voice = db.query(Voice).filter(Voice.voice_id == voice_id).first()
    if not db_voice:
        logger.error(f"Failed to save voice agent response - voice record not found: {voice_id}")
        return False
        
    db_voice.agent_response = agent_response
    db.commit()
    logger.info(f"Voice agent response saved for voice ID: {voice_id}")
    return True

def get_voice_history(db: Session, user_id: int, limit: int = 50) -> List[Voice]:
    """Get voice history for user"""
    return db.query(Voice).filter(
        Voice.user_id == user_id
    ).order_by(Voice.created_at.desc()).limit(limit).all()

def get_voice_by_session(db: Session, session_id: str) -> List[Voice]:
    """Get voice conversation by session"""
    return db.query(Voice).filter(
        Voice.session_id == session_id
    ).order_by(Voice.created_at.asc()).all()

async def transcribe_audio(audio_data: bytes, format: str = "wav") -> Tuple[bool, Dict[str, Any]]:
    """Send audio to Whisper service for transcription"""
    try:
        files = {"audio": (f"audio.{format}", audio_data, f"audio/{format}")}
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.WHISPER_SERVICE_URL}/transcribe-realtime",
                files=files
            )
            
        if response.status_code != 200:
            logger.error(f"Whisper service failed with status: {response.status_code}")
            return False, {"error": f"Whisper service failed with status: {response.status_code}"}
            
        result = response.json()
        return True, result
            
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        return False, {"error": str(e)}

async def process_with_ai_agent(message: str, session_id: str, user_id: int, context: Dict = None) -> Tuple[bool, Dict[str, Any]]:
    """Send text to AI agent for processing"""
    if context is None:
        context = {"source": "fastapi_backend"}
        
    request_data = {
        "sessionId": session_id,
        "message": message,
        "sessionHistory": [],
        "userProfile": {"name": "User", "userId": str(user_id)},
        "context": context
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.AI_AGENTS_URL}/process",
                json=request_data
            )
            
        if response.status_code != 200:
            logger.error(f"AI agents failed with status: {response.status_code}")
            return False, {"error": f"AI agents failed with status: {response.status_code}"}
            
        result = response.json()
        return True, result
            
    except Exception as e:
        logger.error(f"Error processing with AI agent: {str(e)}")
        return False, {"error": str(e)}