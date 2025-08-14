"""
Session management for mental health AI system
"""
import uuid
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import asyncio
from dataclasses import dataclass, asdict
from enum import Enum

class SessionStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    EMERGENCY = "emergency"

@dataclass
class UserProfile:
    """User profile information"""
    name: str = "User"
    age: Optional[int] = None
    preferred_name: Optional[str] = None
    communication_style: str = "standard"  # standard, formal, casual
    trigger_warnings: List[str] = None
    therapeutic_goals: List[str] = None
    preferred_voice: str = "alloy"
    voice_enabled: bool = True
    
    def __post_init__(self):
        if self.trigger_warnings is None:
            self.trigger_warnings = []
        if self.therapeutic_goals is None:
            self.therapeutic_goals = []

@dataclass
class MessageData:
    """Individual message data structure"""
    id: str
    session_id: str
    message: str
    sender: str  # 'user' or 'agent'
    agent_type: Optional[str] = None
    timestamp: datetime = None
    emotional_state: Optional[str] = None
    confidence_score: Optional[int] = None
    requires_immediate_attention: bool = False
    audio_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()
        if self.id is None:
            self.id = str(uuid.uuid4())

@dataclass
class SessionData:
    """Complete session data structure"""
    session_id: str
    user_profile: UserProfile
    messages: List[MessageData]
    status: SessionStatus
    created_at: datetime
    updated_at: datetime
    crisis_level: int = 0
    progress_score: int = 5
    recurring_themes: List[str] = None
    therapeutic_goals: List[str] = None
    session_notes: List[str] = None
    
    def __post_init__(self):
        if self.recurring_themes is None:
            self.recurring_themes = []
        if self.therapeutic_goals is None:
            self.therapeutic_goals = []
        if self.session_notes is None:
            self.session_notes = []

class SessionManager:
    """Manages therapy sessions and user data"""
    
    def __init__(self):
        self.sessions: Dict[str, SessionData] = {}
        self.user_sessions: Dict[str, List[str]] = {}  # user_id -> session_ids
        
    async def create_session(
        self, 
        user_profile: Optional[Dict[str, Any]] = None,
        initial_assessment: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a new therapy session"""
        
        session_id = str(uuid.uuid4())
        
        # Create user profile
        if user_profile:
            profile = UserProfile(**user_profile)
        else:
            profile = UserProfile()
        
        # Create session
        session = SessionData(
            session_id=session_id,
            user_profile=profile,
            messages=[],
            status=SessionStatus.ACTIVE,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # Process initial assessment if provided
        if initial_assessment:
            session.therapeutic_goals = initial_assessment.get('goals', [])
            session.recurring_themes = initial_assessment.get('concerns', [])
        
        # Store session
        self.sessions[session_id] = session
        
        # Track user sessions (simplified - would use proper user management in production)
        user_id = profile.name
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = []
        self.user_sessions[user_id].append(session_id)
        
        return {
            "sessionId": session_id,
            "status": "created",
            "userProfile": asdict(profile),
            "created_at": session.created_at.isoformat()
        }
    
    async def get_session(self, session_id: str) -> Optional[SessionData]:
        """Retrieve session data"""
        return self.sessions.get(session_id)
    
    async def update_session(
        self,
        session_id: str,
        message: str,
        response: str,
        analysis: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Update session with new message exchange"""
        
        session = self.sessions.get(session_id)
        if not session:
            return False
        
        # Create user message
        user_message = MessageData(
            id=str(uuid.uuid4()),
            session_id=session_id,
            message=message,
            sender="user",
            timestamp=datetime.now()
        )
        
        # Create agent response message
        agent_message = MessageData(
            id=str(uuid.uuid4()),
            session_id=session_id,
            message=response,
            sender="agent",
            timestamp=datetime.now()
        )
        
        # Add analysis data if available
        if analysis:
            agent_message.agent_type = analysis.get('agent_type', 'therapist')
            agent_message.emotional_state = analysis.get('emotional_state', 'neutral')
            agent_message.confidence_score = analysis.get('confidence_score', 80)
            agent_message.requires_immediate_attention = analysis.get('requires_immediate_attention', False)
            agent_message.metadata = analysis
            
            # Update session-level data
            session.crisis_level = analysis.get('crisis_level', session.crisis_level)
            session.progress_score = analysis.get('progress_score', session.progress_score)
            
            # Update status if crisis detected
            if analysis.get('requires_immediate_attention', False):
                session.status = SessionStatus.EMERGENCY
        
        # Add messages to session
        session.messages.append(user_message)
        session.messages.append(agent_message)
        session.updated_at = datetime.now()
        
        return True
    
    async def update_emotion(self, session_id: str, emotion_data: Dict[str, Any]) -> bool:
        """Update session with real-time emotion data"""
        session = self.sessions.get(session_id)
        if not session:
            return False
        
        # Add emotion update as metadata to last message if exists
        if session.messages:
            last_message = session.messages[-1]
            if not last_message.metadata:
                last_message.metadata = {}
            last_message.metadata['emotion_update'] = emotion_data
        
        session.updated_at = datetime.now()
        return True
    
    def get_active_session_count(self) -> int:
        """Get count of active sessions"""
        return sum(1 for session in self.sessions.values() 
                  if session.status == SessionStatus.ACTIVE)
    
    async def get_session_history(self, session_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent message history for a session"""
        session = self.sessions.get(session_id)
        if not session:
            return []
        
        recent_messages = session.messages[-limit:] if session.messages else []
        return [asdict(msg) for msg in recent_messages]
    
    async def analyze_session_patterns(self, session_id: str) -> Dict[str, Any]:
        """Analyze patterns in the session"""
        session = self.sessions.get(session_id)
        if not session:
            return {}
        
        if not session.messages:
            return {"status": "insufficient_data"}
        
        # Analyze emotional patterns
        emotions = []
        crisis_events = 0
        user_messages = 0
        agent_messages = 0
        
        for msg in session.messages:
            if msg.sender == "user":
                user_messages += 1
            else:
                agent_messages += 1
                if msg.emotional_state:
                    emotions.append(msg.emotional_state)
                if msg.requires_immediate_attention:
                    crisis_events += 1
        
        # Calculate session duration
        duration = (session.updated_at - session.created_at).total_seconds() / 60
        
        # Identify most common emotional state
        emotion_frequency = {}
        for emotion in emotions:
            emotion_frequency[emotion] = emotion_frequency.get(emotion, 0) + 1
        
        dominant_emotion = max(emotion_frequency, key=emotion_frequency.get) if emotion_frequency else "neutral"
        
        return {
            "session_duration_minutes": round(duration, 1),
            "total_messages": len(session.messages),
            "user_messages": user_messages,
            "agent_messages": agent_messages,
            "crisis_events": crisis_events,
            "dominant_emotion": dominant_emotion,
            "emotion_distribution": emotion_frequency,
            "engagement_level": self._calculate_engagement(session),
            "progress_indicators": self._assess_progress(session),
            "recurring_themes": session.recurring_themes,
            "current_crisis_level": session.crisis_level,
            "progress_score": session.progress_score
        }
    
    def _calculate_engagement(self, session: SessionData) -> str:
        """Calculate user engagement level"""
        message_count = len([msg for msg in session.messages if msg.sender == "user"])
        duration = (session.updated_at - session.created_at).total_seconds() / 60
        
        if message_count >= 10 and duration >= 20:
            return "High"
        elif message_count >= 5 and duration >= 10:
            return "Medium"
        else:
            return "Low"
    
    def _assess_progress(self, session: SessionData) -> Dict[str, Any]:
        """Assess therapeutic progress indicators"""
        if len(session.messages) < 4:
            return {"status": "initial_assessment"}
        
        # Look for improvement indicators in recent messages
        recent_messages = session.messages[-6:]
        improvement_indicators = []
        concern_indicators = []
        
        improvement_words = ["better", "improving", "hope", "positive", "progress", "helpful"]
        concern_words = ["worse", "hopeless", "giving up", "can't cope", "overwhelming"]
        
        for msg in recent_messages:
            if msg.sender == "user":
                message_lower = msg.message.lower()
                for word in improvement_words:
                    if word in message_lower:
                        improvement_indicators.append(word)
                for word in concern_words:
                    if word in message_lower:
                        concern_indicators.append(word)
        
        # Determine overall progress trend
        if len(improvement_indicators) > len(concern_indicators):
            trend = "improving"
        elif len(concern_indicators) > len(improvement_indicators):
            trend = "concerning"
        else:
            trend = "stable"
        
        return {
            "trend": trend,
            "improvement_indicators": improvement_indicators,
            "concern_indicators": concern_indicators,
            "sessions_completed": 1,  # This session
            "goals_addressed": len(session.therapeutic_goals)
        }
    
    async def cleanup_old_sessions(self, hours: int = 24) -> int:
        """Clean up sessions older than specified hours"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        sessions_to_remove = []
        
        for session_id, session in self.sessions.items():
            if session.updated_at < cutoff_time and session.status != SessionStatus.EMERGENCY:
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.sessions[session_id]
        
        return len(sessions_to_remove)