from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks, Request, Body
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import logging
import uuid
import json
import httpx  # Add this missing import
from typing import Optional, List, Dict, Any

from app.database import get_db
from app.migrations import apply_migrations
from app.config import settings

# Import models
from app.models import User, Chat, Voice

# Import schemas
from app.schemas import (
    UserCreate, UserResponse,
    ChatRequest, ChatResponse, ChatHistoryResponse, 
    MessageSaveRequest, MessageResponseUpdate,
    VoiceTranscribeResponse, VoiceChatResponse, VoiceHistoryResponse
)

# Import services
from app.services import user_service, chat_service, voice_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="MindBridge FastAPI Backend")

# Apply database migrations on startup
@app.on_event("startup")
async def startup_event():
    logger.info("Starting MindBridge FastAPI Backend...")
    
    # Test database connection first
    logger.info("Testing database connection...")
    from app.database import wait_for_db
    
    if not wait_for_db():
        logger.error("Failed to connect to database. Exiting...")
        import sys
        sys.exit(1)
    
    # Apply database migrations
    logger.info("Applying database migrations...")
    try:
        apply_migrations()
        logger.info("Database migrations completed successfully")
    except Exception as e:
        logger.error(f"Error applying migrations: {e}")
        logger.error("Migration failed. Exiting...")
        import sys
        sys.exit(1)
    
    logger.info("FastAPI backend startup completed successfully")


# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MindBridge FastAPI Backend with Voice",
        "ai_agents_url": settings.AI_AGENTS_URL,
        "whisper_service_url": settings.WHISPER_SERVICE_URL,
        "database_host": settings.POSTGRES_SERVER,
        "database_name": settings.POSTGRES_DB,
        "timestamp": "2025-08-19"
    }


# Test connection to all services
@app.get("/test-connection")
async def test_connection():
    result = {
        "backend_status": "healthy",
        "database_connected": True
    }
    
    # Test AI agents
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.AI_AGENTS_URL}/health")
            result.update({
                "ai_agents_connection": "successful",
                "ai_agents_health": response.json()
            })
    except Exception as e:
        result.update({
            "ai_agents_connection": "failed",
            "ai_agents_error": str(e)
        })
    
    # Test Whisper service
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.WHISPER_SERVICE_URL}/health")
            result.update({
                "whisper_connection": "successful",
                "whisper_health": response.json()
            })
    except Exception as e:
        result.update({
            "whisper_connection": "failed",
            "whisper_error": str(e)
        })
    
    return result


# ===== VOICE ENDPOINTS =====

# Transcribe audio to text only (save to voice table)
@app.post("/voice/transcribe")
async def transcribe_voice(
    audio: UploadFile = File(...),
    sessionId: str = Form(None),
    userId: int = Form(1),
    format: str = Form("wav"),
    db: Session = Depends(get_db)
):
    try:
        # Generate session ID if not provided
        if not sessionId:
            sessionId = str(uuid.uuid4())
        
        # Read audio data
        audio_data = await audio.read()
        
        if len(audio_data) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "No audio data provided"}
            )
        
        logger.info(f"Processing voice transcription for session: {sessionId}")
        
        # Send to Whisper service
        success, result = await voice_service.transcribe_audio(audio_data, format)
        
        if not success:
            return JSONResponse(
                status_code=500,
                content=VoiceTranscribeResponse(
                    voiceId=0,
                    transcribedText="",
                    sessionId=sessionId,
                    duration=0.0,
                    success=False,
                    error=result.get("error", "Unknown error")
                ).dict()
            )
        
        transcribed_text = result.get("text", "")
        duration = result.get("duration", 0.0)
        
        logger.info(f"Transcription successful: {transcribed_text}")
        
        # Save to voice table
        voice_record = voice_service.save_voice_transcription(db, userId, transcribed_text, sessionId)
        
        return VoiceTranscribeResponse(
            voiceId=voice_record.voice_id,
            transcribedText=transcribed_text,
            sessionId=sessionId,
            duration=duration,
            success=True,
            error=None
        )
        
    except Exception as e:
        logger.error(f"Voice transcription error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content=VoiceTranscribeResponse(
                voiceId=0,
                transcribedText="",
                sessionId="error",
                duration=0.0,
                success=False,
                error=str(e)
            ).dict()
        )


# Complete voice chat: Speech → Text → AI Agent → Save Response
@app.post("/voice/chat")
async def voice_chat(
    audio: UploadFile = File(...),
    sessionId: str = Form(None),
    userId: int = Form(1),
    format: str = Form("wav"),
    db: Session = Depends(get_db)
):
    try:
        # Generate session ID if not provided
        if not sessionId:
            sessionId = str(uuid.uuid4())
        
        # Read audio data
        audio_data = await audio.read()
        
        if len(audio_data) == 0:
            return JSONResponse(
                status_code=400,
                content={"error": "No audio data provided"}
            )
        
        logger.info(f"Processing complete voice chat for session: {sessionId}")
        
        # Step 1: Transcribe audio
        success, whisper_result = await voice_service.transcribe_audio(audio_data, format)
        
        if not success:
            return JSONResponse(
                status_code=500,
                content={"error": whisper_result.get("error", "Failed to transcribe audio")}
            )
        
        transcribed_text = whisper_result.get("text", "")
        transcription_duration = whisper_result.get("duration", 0.0)
        
        logger.info(f"Voice transcription: {transcribed_text}")
        
        # Step 2: Save voice transcription
        voice_record = voice_service.save_voice_transcription(db, userId, transcribed_text, sessionId)
        
        # Step 3: Send to AI agents
        agent_success, agent_result = await voice_service.process_with_ai_agent(
            message=transcribed_text,
            session_id=sessionId,
            user_id=userId,
            context={"source": "voice_chat", "voice_id": voice_record.voice_id}
        )
        
        if not agent_success:
            error_msg = agent_result.get("error", "AI agents failed")
            logger.error(error_msg)
            
            # Save error response
            voice_service.save_voice_agent_response(db, voice_record.voice_id, "Error: Unable to process request")
            
            return JSONResponse(
                status_code=500,
                content=VoiceChatResponse(
                    voiceId=voice_record.voice_id,
                    transcribedText=transcribed_text,
                    agentResponse="Sorry, I'm having trouble processing your message right now.",
                    agentType="error",
                    confidenceScore=0,
                    requiresImmediateAttention=False,
                    emotionalState="error",
                    recommendations=[],
                    transcriptionDuration=transcription_duration,
                    success=False,
                    error=error_msg
                ).dict()
            )
        
        # Extract AI agent response
        result_json = agent_result.get("result", {})
        agent_response_text = result_json.get("response", "")
        
        logger.info(f"AI Agent response: {agent_response_text}")
        
        # Step 4: Save agent response to voice table
        voice_service.save_voice_agent_response(db, voice_record.voice_id, agent_response_text)
        
        # Step 5: Create successful response
        return VoiceChatResponse(
            voiceId=voice_record.voice_id,
            transcribedText=transcribed_text,
            agentResponse=agent_response_text,
            agentType=result_json.get("agentType", "assistant"),
            confidenceScore=result_json.get("confidenceScore", 0),
            requiresImmediateAttention=result_json.get("requiresImmediateAttention", False),
            emotionalState=result_json.get("emotionalState", "neutral"),
            recommendations=result_json.get("recommendations", []),
            transcriptionDuration=transcription_duration,
            success=True,
            error=None
        )
        
    except Exception as e:
        logger.error(f"Voice chat error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content=VoiceChatResponse(
                voiceId=0,
                transcribedText="",
                agentResponse="Sorry, there was an internal error processing your voice message.",
                agentType="error",
                confidenceScore=0,
                requiresImmediateAttention=False,
                emotionalState="error",
                recommendations=[],
                transcriptionDuration=0.0,
                success=False,
                error=str(e)
            ).dict()
        )


# Get voice history for a user
@app.get("/users/{userId}/voice")
async def get_user_voice_history(
    userId: int,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    try:
        voices = voice_service.get_voice_history(db, userId, limit)
        
        return VoiceHistoryResponse(
            voices=voices,
            totalCount=len(voices),
            success=True,
            error=None
        )
    except Exception as e:
        logger.error(f"Get voice history error: {str(e)}")
        return VoiceHistoryResponse(
            voices=[],
            totalCount=0,
            success=False,
            error=str(e)
        )


# Get voice conversation by session
@app.get("/sessions/{sessionId}/voice")
async def get_session_voice_history(
    sessionId: str,
    db: Session = Depends(get_db)
):
    try:
        voices = voice_service.get_voice_by_session(db, sessionId)
        
        return VoiceHistoryResponse(
            voices=voices,
            totalCount=len(voices),
            success=True,
            error=None
        )
    except Exception as e:
        logger.error(f"Get session voice error: {str(e)}")
        return VoiceHistoryResponse(
            voices=[],
            totalCount=0,
            success=False,
            error=str(e)
        )


# ===== USER ENDPOINTS =====

# Create a new user
@app.post("/users", status_code=201)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    try:
        db_user = user_service.create_user(db, user.name)
        
        return UserResponse(
            userId=db_user.user_id,
            name=db_user.name,
            createdAt=str(db_user.created_at) if db_user.created_at else None
        )
    except Exception as e:
        logger.error(f"Create user error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to create user: {str(e)}"}
        )


# Get all users
@app.get("/users")
async def get_all_users(db: Session = Depends(get_db)):
    try:
        users = user_service.get_all_users(db)
        return users
    except Exception as e:
        logger.error(f"Get all users error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get user by ID
@app.get("/users/{userId}")
async def get_user(userId: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ===== CHAT ENDPOINTS =====

# Chat endpoint with database integration
@app.post("/chat")
async def chat(
    chat_request: ChatRequest,
    db: Session = Depends(get_db)
):
    try:
        message = chat_request.message
        session_id = chat_request.sessionId or str(uuid.uuid4())
        user_id = chat_request.userId or 1  # Default to user 1
        
        logger.info(f"Received chat message: {message}")
        logger.info(f"Session ID: {session_id}")
        logger.info(f"User ID: {user_id}")
        
        # Save user message to database
        message_record = chat_service.save_user_message(db, user_id, message, session_id)
        
        # Send to AI agents
        success, agent_result = await voice_service.process_with_ai_agent(
            message=message,
            session_id=session_id,
            user_id=user_id,
            context={"source": "fastapi_backend"}
        )
        
        if not success:
            error_msg = agent_result.get("error", "AI agents failed")
            logger.error(error_msg)
            
            # Save error response
            chat_service.save_agent_response(db, message_record.message_id, "Error: Unable to process request")
            
            return JSONResponse(
                status_code=500,
                content=ChatResponse(
                    messageId=message_record.message_id,
                    response="Sorry, I'm having trouble processing your message right now.",
                    agentType="error",
                    confidenceScore=0,
                    requiresImmediateAttention=False,
                    emotionalState="error",
                    recommendations=[],
                    success=False,
                    error=error_msg
                ).dict()
            )
        
        # Extract AI agent response
        result_json = agent_result.get("result", {})
        agent_response_text = result_json.get("response", "")
        
        # Save agent response to database
        chat_service.save_agent_response(db, message_record.message_id, agent_response_text)
        
        return ChatResponse(
            messageId=message_record.message_id,
            response=agent_response_text,
            agentType=result_json.get("agentType", "assistant"),
            confidenceScore=result_json.get("confidenceScore", 0),
            requiresImmediateAttention=result_json.get("requiresImmediateAttention", False),
            emotionalState=result_json.get("emotionalState", "neutral"),
            recommendations=result_json.get("recommendations", []),
            success=True,
            error=None
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content=ChatResponse(
                messageId=0,
                response="Sorry, there was an internal error processing your message.",
                agentType="error",
                confidenceScore=0,
                requiresImmediateAttention=False,
                emotionalState="error",
                recommendations=[],
                success=False,
                error=str(e)
            ).dict()
        )


# Get chat history for a user
@app.get("/users/{userId}/chats")
async def get_user_chat_history(
    userId: int,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    try:
        chats = chat_service.get_chat_history(db, userId, limit)
        
        return ChatHistoryResponse(
            chats=chats,
            totalCount=len(chats),
            success=True,
            error=None
        )
    except Exception as e:
        logger.error(f"Get chat history error: {str(e)}")
        return ChatHistoryResponse(
            chats=[],
            totalCount=0,
            success=False,
            error=str(e)
        )


# Get chats by session ID
@app.get("/sessions/{sessionId}/chats")
async def get_session_chats(
    sessionId: str,
    db: Session = Depends(get_db)
):
    try:
        chats = chat_service.get_chats_by_session(db, sessionId)
        
        return ChatHistoryResponse(
            chats=chats,
            totalCount=len(chats),
            success=True,
            error=None
        )
    except Exception as e:
        logger.error(f"Get session chats error: {str(e)}")
        return ChatHistoryResponse(
            chats=[],
            totalCount=0,
            success=False,
            error=str(e)
        )


# Save user message endpoint (separate)
@app.post("/messages", status_code=201)
async def save_message(
    request: MessageSaveRequest,
    db: Session = Depends(get_db)
):
    try:
        session_id = request.sessionId or str(uuid.uuid4())
        message_record = chat_service.save_user_message(db, request.userId, request.message, session_id)
        
        return {
            "messageId": message_record.message_id,
            "success": True,
            "message": "User message saved successfully"
        }
    except Exception as e:
        logger.error(f"Save message error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to save message: {str(e)}"}
        )


# Save agent response endpoint (separate)
@app.put("/messages/{messageId}/response")
async def save_response(
    messageId: int,
    request: MessageResponseUpdate,
    db: Session = Depends(get_db)
):
    try:
        success = chat_service.save_agent_response(db, messageId, request.response)
        
        if not success:
            return JSONResponse(
                status_code=404,
                content={"error": "Message not found"}
            )
            
        return {
            "success": True,
            "message": "Agent response saved successfully"
        }
    except Exception as e:
        logger.error(f"Save response error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to save response: {str(e)}"}
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8080, reload=True)