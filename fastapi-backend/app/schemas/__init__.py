# Import schemas for easier access
from app.schemas.user import UserCreate, UserResponse
from app.schemas.chat import (
    ChatRequest, ChatResponse, ChatHistoryResponse, 
    MessageSaveRequest, MessageResponseUpdate
)
from app.schemas.voice import (
    VoiceTranscribeResponse, VoiceChatResponse, VoiceHistoryResponse
)