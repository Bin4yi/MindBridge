from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class ChatRequest(BaseModel):
    message: str
    sessionId: Optional[str] = None
    userId: Optional[int] = None

class ChatResponse(BaseModel):
    messageId: int
    response: str
    agentType: str
    confidenceScore: int
    requiresImmediateAttention: bool
    emotionalState: str
    recommendations: List[str]
    success: bool
    error: Optional[str] = None

class ChatInfo(BaseModel):
    message_id: Optional[int] = None
    user_id: int
    message: str
    response: Optional[str] = None
    session_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    chats: List[ChatInfo]
    totalCount: int
    success: bool
    error: Optional[str] = None

class MessageSaveRequest(BaseModel):
    userId: int
    message: str
    sessionId: Optional[str] = None

class MessageResponseUpdate(BaseModel):
    response: str