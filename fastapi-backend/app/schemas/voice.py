from pydantic import BaseModel
from typing import List, Optional, Any, Union, ByteArray
from datetime import datetime

class VoiceTranscribeResponse(BaseModel):
    voiceId: int
    transcribedText: str
    sessionId: str
    duration: float
    success: bool
    error: Optional[str] = None

class VoiceChatResponse(BaseModel):
    voiceId: int
    transcribedText: str
    agentResponse: str
    agentType: str
    confidenceScore: int
    requiresImmediateAttention: bool
    emotionalState: str
    recommendations: List[str]
    transcriptionDuration: float
    success: bool
    error: Optional[str] = None

class VoiceInfo(BaseModel):
    voice_id: Optional[int] = None
    user_id: int
    user_text: str
    agent_response: Optional[str] = None
    session_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class VoiceHistoryResponse(BaseModel):
    voices: List[VoiceInfo]
    totalCount: int
    success: bool
    error: Optional[str] = None