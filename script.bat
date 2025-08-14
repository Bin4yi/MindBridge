@echo off
REM ================================================================
REM Enhanced Mental Health Support System - Complete File Creator
REM Windows Batch Script with Advanced Multi-Agent System
REM ================================================================

echo.
echo 🧠 Enhanced Mental Health AI System - File Creator
echo =====================================================
echo.

REM Create main project directory
set PROJECT_NAME=enhanced-mental-health-ai
if exist "%PROJECT_NAME%" (
    echo ⚠️  Directory %PROJECT_NAME% already exists!
    set /p OVERWRITE="Do you want to overwrite? (y/n): "
    if /i "%OVERWRITE%" NEQ "y" (
        echo ❌ Setup cancelled.
        pause
        exit /b
    )
    rmdir /s /q "%PROJECT_NAME%"
)

mkdir "%PROJECT_NAME%"
cd "%PROJECT_NAME%"

echo 📁 Creating enhanced directory structure...

REM ================================================================
REM CREATE DIRECTORY STRUCTURE
REM ================================================================

REM Backend directories
mkdir backend\modules\agents
mkdir backend\modules\speech  
mkdir backend\modules\database
mkdir backend\modules\utils
mkdir backend\tests
mkdir backend\config

REM AI Agents directories
mkdir ai-agents\agents
mkdir ai-agents\tools
mkdir ai-agents\crew
mkdir ai-agents\config
mkdir ai-agents\tests
mkdir ai-agents\models
mkdir ai-agents\data
mkdir ai-agents\scripts

REM Frontend directories
mkdir frontend\public
mkdir frontend\src\components\Chat
mkdir frontend\src\components\Dashboard
mkdir frontend\src\components\Emergency
mkdir frontend\src\components\Common
mkdir frontend\src\components\Voice
mkdir frontend\src\hooks
mkdir frontend\src\services
mkdir frontend\src\utils
mkdir frontend\src\styles
mkdir frontend\src\context
mkdir frontend\src\tests

REM Docker and deployment
mkdir docker
mkdir scripts
mkdir docs
mkdir tests\integration
mkdir tests\unit
mkdir config

echo ✅ Enhanced directory structure created!

REM ================================================================
REM CREATE AI AGENTS FILES
REM ================================================================

echo 🤖 Creating advanced AI agents system...

REM Create requirements.txt with enhanced dependencies
(
echo # Core CrewAI and FastAPI
echo crewai==0.28.8
echo fastapi==0.104.1
echo uvicorn[standard]==0.24.0
echo pydantic==2.5.2
echo python-multipart==0.0.6
echo.
echo # AI and Language Models
echo openai==1.6.1
echo langchain==0.0.350
echo langchain-openai==0.0.2
echo langchain-community==0.0.10
echo transformers==4.36.0
echo torch==2.1.0
echo.
echo # Speech Processing
echo speechrecognition==3.10.0
echo gtts==2.4.0
echo pydub==0.25.1
echo.
echo # Data Processing
echo numpy==1.24.3
echo pandas==2.0.3
echo scikit-learn==1.3.0
echo nltk==3.8.1
echo textblob==0.17.1
echo.
echo # Web and API
echo requests==2.31.0
echo httpx==0.25.2
echo websockets==12.0
echo aiofiles==23.2.1
echo.
echo # Development and Testing
echo pytest==7.4.3
echo pytest-asyncio==0.21.1
echo python-dotenv==1.0.0
echo.
echo # Database and Storage
echo sqlalchemy==2.0.23
echo alembic==1.13.1
echo redis==5.0.1
) > ai-agents\requirements.txt

REM Create enhanced main.py
(
echo from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
echo from fastapi.middleware.cors import CORSMiddleware
echo from pydantic import BaseModel
echo from typing import List, Optional, Dict, Any
echo from datetime import datetime
echo import logging
echo import uvicorn
echo import asyncio
echo import json
echo.
echo from crew.mental_health_crew import MentalHealthCrew
echo from config.settings import Settings
echo from models.session import SessionManager
echo from models.analytics import AnalyticsEngine
echo.
echo # Configure logging
echo logging.basicConfig^(level=logging.INFO^)
echo logger = logging.getLogger^(__name__^)
echo.
echo # Initialize FastAPI app
echo app = FastAPI^(
echo     title="Enhanced Mental Health AI System",
echo     description="Advanced multi-agent therapeutic support system",
echo     version="2.0.0"
echo ^)
echo.
echo # Add CORS middleware
echo app.add_middleware^(
echo     CORSMiddleware,
echo     allow_origins=["*"],
echo     allow_credentials=True,
echo     allow_methods=["*"],
echo     allow_headers=["*"],
echo ^)
echo.
echo # Initialize components
echo settings = Settings^(^)
echo mental_health_crew = MentalHealthCrew^(^)
echo session_manager = SessionManager^(^)
echo analytics_engine = AnalyticsEngine^(^)
echo.
echo # WebSocket connections manager
echo class ConnectionManager:
echo     def __init__^(self^):
echo         self.active_connections: Dict[str, WebSocket] = {}
echo.
echo     async def connect^(self, websocket: WebSocket, session_id: str^):
echo         await websocket.accept^(^)
echo         self.active_connections[session_id] = websocket
echo         logger.info^(f"WebSocket connected for session {session_id}"^)
echo.
echo     def disconnect^(self, session_id: str^):
echo         if session_id in self.active_connections:
echo             del self.active_connections[session_id]
echo         logger.info^(f"WebSocket disconnected for session {session_id}"^)
echo.
echo     async def send_personal_message^(self, message: dict, session_id: str^):
echo         if session_id in self.active_connections:
echo             websocket = self.active_connections[session_id]
echo             await websocket.send_text^(json.dumps^(message^)^)
echo.
echo manager = ConnectionManager^(^)
echo.
echo # Enhanced Request/Response models
echo class ProcessRequest^(BaseModel^):
echo     sessionId: str
echo     message: str
echo     sessionHistory: List[Dict] = []
echo     userProfile: Optional[Dict[str, Any]] = None
echo     context: Optional[Dict[str, Any]] = None
echo     includeAudio: bool = False
echo     voiceSettings: Optional[Dict[str, Any]] = None
echo.
echo class ProcessResponse^(BaseModel^):
echo     response: str
echo     agentType: str
echo     confidenceScore: int
echo     requiresImmediateAttention: bool
echo     emotionalState: str
echo     recommendations: List[str]
echo     sessionSummary: Optional[str] = None
echo     analysis: Optional[Dict[str, Any]] = None
echo     audioUrl: Optional[str] = None
echo     metadata: Optional[Dict[str, Any]] = None
echo.
echo class SessionCreate^(BaseModel^):
echo     userProfile: Optional[Dict[str, Any]] = None
echo     initialAssessment: Optional[Dict[str, Any]] = None
echo.
echo class SessionResponse^(BaseModel^):
echo     sessionId: str
echo     status: str
echo     timestamp: datetime
echo     agentsInitialized: List[str]
echo.
echo @app.get^("/health"^)
echo async def health_check^(^):
echo     """Enhanced health check with system status"""
echo     return {
echo         "status": "healthy",
echo         "timestamp": datetime.now^(^),
echo         "components": {
echo             "crew_ai": "active",
echo             "agents": mental_health_crew.get_agent_status^(^),
echo             "session_manager": "active",
echo             "analytics": "active"
echo         },
echo         "active_sessions": session_manager.get_active_session_count^(^),
echo         "system_load": analytics_engine.get_system_load^(^)
echo     }
echo.
echo @app.post^("/sessions", response_model=SessionResponse^)
echo async def create_session^(request: SessionCreate^):
echo     """Create a new therapeutic session with enhanced initialization"""
echo     try:
echo         session_data = await session_manager.create_session^(
echo             user_profile=request.userProfile,
echo             initial_assessment=request.initialAssessment
echo         ^)
echo         
echo         # Initialize crew for this session
echo         await mental_health_crew.initialize_session^(session_data["sessionId"]^)
echo         
echo         return SessionResponse^(
echo             sessionId=session_data["sessionId"],
echo             status="created",
echo             timestamp=datetime.now^(^),
echo             agentsInitialized=mental_health_crew.get_active_agents^(^)
echo         ^)
echo     except Exception as e:
echo         logger.error^(f"Session creation failed: {str^(e^)}"^)
echo         raise HTTPException^(status_code=500, detail=f"Session creation failed: {str^(e^)}"^)
echo.
echo @app.post^("/process", response_model=ProcessResponse^)
echo async def process_message^(request: ProcessRequest^):
echo     """Process message through enhanced multi-agent system"""
echo     try:
echo         logger.info^(f"Processing message for session {request.sessionId}"^)
echo         
echo         # Process through CrewAI multi-agent system
echo         result = await mental_health_crew.process_message^(
echo             message=request.message,
echo             session_id=request.sessionId,
echo             session_history=request.sessionHistory,
echo             user_profile=request.userProfile,
echo             context=request.context,
echo             include_audio=request.includeAudio,
echo             voice_settings=request.voiceSettings
echo         ^)
echo         
echo         # Update session data
echo         await session_manager.update_session^(
echo             request.sessionId,
echo             message=request.message,
echo             response=result["response"],
echo             analysis=result.get^("analysis"^)
echo         ^)
echo         
echo         # Send real-time update via WebSocket
echo         await manager.send_personal_message^(
echo             {"type": "agent_response", "data": result},
echo             request.sessionId
echo         ^)
echo         
echo         # Track analytics
echo         analytics_engine.track_interaction^(
echo             session_id=request.sessionId,
echo             user_message=request.message,
echo             agent_response=result["response"],
echo             analysis=result.get^("analysis"^)
echo         ^)
echo         
echo         return ProcessResponse^(**result^)
echo         
echo     except Exception as e:
echo         logger.error^(f"Error processing message: {str^(e^)}"^)
echo         raise HTTPException^(status_code=500, detail=f"Processing error: {str^(e^)}"^)
echo.
echo @app.post^("/test-standalone"^)
echo async def test_standalone^(message: str, agent_type: str = "all"^):
echo     """Test endpoint for standalone agent testing without backend"""
echo     try:
echo         test_request = ProcessRequest^(
echo             sessionId="test-session-" + str^(int^(datetime.now^(^).timestamp^(^)^)^),
echo             message=message,
echo             sessionHistory=[],
echo             userProfile={"name": "Test User", "age": 25, "test_mode": True},
echo             context={"test_mode": True, "agent_type": agent_type}
echo         ^)
echo         
echo         result = await mental_health_crew.process_message^(
echo             message=test_request.message,
echo             session_id=test_request.sessionId,
echo             session_history=test_request.sessionHistory,
echo             user_profile=test_request.userProfile,
echo             context=test_request.context
echo         ^)
echo         
echo         return {
echo             "status": "success", 
echo             "test_mode": True,
echo             "agent_type_tested": agent_type,
echo             "result": result,
echo             "timestamp": datetime.now^(^).isoformat^(^)
echo         }
echo         
echo     except Exception as e:
echo         logger.error^(f"Test error: {str^(e^)}"^)
echo         return {
echo             "status": "error", 
echo             "error": str^(e^),
echo             "timestamp": datetime.now^(^).isoformat^(^)
echo         }
echo.
echo @app.websocket^("/ws/{session_id}"^)
echo async def websocket_endpoint^(websocket: WebSocket, session_id: str^):
echo     """Enhanced WebSocket endpoint for real-time communication"""
echo     await manager.connect^(websocket, session_id^)
echo     try:
echo         while True:
echo             data = await websocket.receive_text^(^)
echo             message = json.loads^(data^)
echo             
echo             if message["type"] == "voice_stream":
echo                 # Handle streaming voice data
echo                 await handle_voice_stream^(message, session_id^)
echo             elif message["type"] == "typing":
echo                 # Broadcast typing indicator
echo                 await manager.send_personal_message^(
echo                     {"type": "typing_indicator", "isTyping": message["isTyping"]},
echo                     session_id
echo                 ^)
echo             elif message["type"] == "emotion_update":
echo                 # Handle real-time emotion updates
echo                 await handle_emotion_update^(message, session_id^)
echo                 
echo     except WebSocketDisconnect:
echo         manager.disconnect^(session_id^)
echo.
echo async def handle_voice_stream^(message: dict, session_id: str^):
echo     """Handle streaming voice data for real-time processing"""
echo     # Implement real-time speech processing
echo     pass
echo.
echo async def handle_emotion_update^(message: dict, session_id: str^):
echo     """Handle real-time emotion updates"""
echo     # Update session with emotion data
echo     await session_manager.update_emotion^(session_id, message["emotion_data"]^)
echo.
echo @app.get^("/sessions/{session_id}/analytics"^)
echo async def get_session_analytics^(session_id: str^):
echo     """Get detailed session analytics"""
echo     try:
echo         analytics = await analytics_engine.get_session_analytics^(session_id^)
echo         return analytics
echo     except Exception as e:
echo         raise HTTPException^(status_code=404, detail=f"Analytics not found: {str^(e^)}"^)
echo.
echo @app.get^("/agents/status"^)
echo async def get_agents_status^(^):
echo     """Get status of all AI agents"""
echo     return mental_health_crew.get_detailed_agent_status^(^)
echo.
echo if __name__ == "__main__":
echo     uvicorn.run^(
echo         "main:app", 
echo         host="0.0.0.0", 
echo         port=8001, 
echo         reload=True,
echo         log_level="info"
echo     ^)
) > ai-agents\main.py

REM Create agent base classes
(
echo # ai-agents/agents/base_agent.py
echo from abc import ABC, abstractmethod
echo from typing import Dict, List, Any, Optional
echo from datetime import datetime
echo import logging
echo.
echo logger = logging.getLogger^(__name__^)
echo.
echo class BaseAgent^(ABC^):
echo     """Base class for all mental health agents"""
echo     
echo     def __init__^(self, name: str, role: str, expertise: List[str]^):
echo         self.name = name
echo         self.role = role
echo         self.expertise = expertise
echo         self.active = True
echo         self.session_data = {}
echo         self.performance_metrics = {
echo             "interactions": 0,
echo             "success_rate": 0.0,
echo             "average_confidence": 0.0
echo         }
echo     
echo     @abstractmethod
echo     async def process^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Process a message and return response"""
echo         pass
echo     
echo     @abstractmethod
echo     def get_capabilities^(self^) -^> List[str]:
echo         """Return list of agent capabilities"""
echo         pass
echo     
echo     def update_metrics^(self, success: bool, confidence: float^):
echo         """Update performance metrics"""
echo         self.performance_metrics["interactions"] += 1
echo         if success:
echo             self.performance_metrics["success_rate"] = ^(
echo                 ^(self.performance_metrics["success_rate"] * ^(self.performance_metrics["interactions"] - 1^) + 1^) /
echo                 self.performance_metrics["interactions"]
echo             ^)
echo         
echo         self.performance_metrics["average_confidence"] = ^(
echo             ^(self.performance_metrics["average_confidence"] * ^(self.performance_metrics["interactions"] - 1^) + confidence^) /
echo             self.performance_metrics["interactions"]
echo         ^)
echo     
echo     def get_status^(self^) -^> Dict[str, Any]:
echo         """Get agent status and metrics"""
echo         return {
echo             "name": self.name,
echo             "role": self.role,
echo             "active": self.active,
echo             "expertise": self.expertise,
echo             "metrics": self.performance_metrics,
echo             "capabilities": self.get_capabilities^(^)
echo         }
) > ai-agents\agents\base_agent.py

REM Create specialized agents
(
echo # ai-agents/agents/therapist_agent.py
echo from .base_agent import BaseAgent
echo from typing import Dict, List, Any
echo import re
echo.
echo class TherapistAgent^(BaseAgent^):
echo     """Primary therapeutic agent with CBT, DBT, and humanistic approaches"""
echo     
echo     def __init__^(self^):
echo         super^(^).__init__^(
echo             name="Dr. Sarah Chen",
echo             role="Primary Therapist",
echo             expertise=["CBT", "DBT", "Humanistic Therapy", "Trauma-Informed Care"]
echo         ^)
echo         self.therapeutic_approaches = {
echo             "cbt": self._cognitive_behavioral_response,
echo             "dbt": self._dialectical_behavioral_response,
echo             "humanistic": self._humanistic_response,
echo             "trauma_informed": self._trauma_informed_response
echo         }
echo     
echo     async def process^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Process message using appropriate therapeutic approach"""
echo         
echo         # Determine best therapeutic approach
echo         approach = self._select_approach^(message, context^)
echo         
echo         # Generate therapeutic response
echo         response_func = self.therapeutic_approaches[approach]
echo         response_data = await response_func^(message, context^)
echo         
echo         # Update metrics
echo         self.update_metrics^(True, response_data.get^("confidence", 0.8^)^)
echo         
echo         return {
echo             "agent_type": "primary_therapist",
echo             "approach_used": approach,
echo             "response": response_data["response"],
echo             "therapeutic_techniques": response_data["techniques"],
echo             "follow_up_questions": response_data["follow_ups"],
echo             "confidence": response_data["confidence"]
echo         }
echo     
echo     def _select_approach^(self, message: str, context: Dict[str, Any]^) -^> str:
echo         """Select appropriate therapeutic approach"""
echo         message_lower = message.lower^(^)
echo         
echo         # Check for trauma indicators
echo         trauma_keywords = ["trauma", "abuse", "ptsd", "flashback", "triggered"]
echo         if any^(keyword in message_lower for keyword in trauma_keywords^):
echo             return "trauma_informed"
echo         
echo         # Check for thought patterns ^(CBT^)
echo         thought_patterns = ["think", "believe", "thoughts", "mind racing", "can't stop thinking"]
echo         if any^(pattern in message_lower for pattern in thought_patterns^):
echo             return "cbt"
echo         
echo         # Check for emotional regulation ^(DBT^)
echo         emotion_regulation = ["overwhelmed", "intense emotions", "can't control", "emotional"]
echo         if any^(keyword in message_lower for keyword in emotion_regulation^):
echo             return "dbt"
echo         
echo         # Default to humanistic
echo         return "humanistic"
echo     
echo     async def _cognitive_behavioral_response^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate CBT-based response"""
echo         return {
echo             "response": """I hear you sharing some challenging thoughts. In CBT, we often explore the connection between our thoughts, feelings, and behaviors. 
echo.
echo Let's take a moment to examine these thoughts. What evidence do you have that supports this thought? And what evidence might challenge it?
echo.
echo Sometimes our minds can play tricks on us, especially when we're feeling overwhelmed. Would you be open to exploring this thought pattern together?""",
echo             "techniques": ["Thought challenging", "Cognitive restructuring", "Evidence examination"],
echo             "follow_ups": [
echo                 "What thoughts are going through your mind right now?",
echo                 "How would you rate the intensity of this thought on a scale of 1-10?",
echo                 "What would you tell a friend who had this same thought?"
echo             ],
echo             "confidence": 0.85
echo         }
echo     
echo     async def _dialectical_behavioral_response^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate DBT-based response"""
echo         return {
echo             "response": """I can hear how intense these emotions are for you right now. That sounds really difficult to experience.
echo.
echo Let's try a DBT skill called TIPP - Temperature, Intense exercise, Paced breathing, Paired muscle relaxation. Right now, let's focus on paced breathing.
echo.
echo Can you breathe in slowly for 4 counts, hold for 6, and exhale for 8? This can help activate your body's natural calming response.""",
echo             "techniques": ["TIPP skills", "Distress tolerance", "Emotion regulation", "Mindfulness"],
echo             "follow_ups": [
echo                 "What emotions are you experiencing most intensely right now?",
echo                 "On a scale of 1-10, how intense are these emotions?",
echo                 "What usually helps you feel more grounded?"
echo             ],
echo             "confidence": 0.88
echo         }
echo     
echo     async def _humanistic_response^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate person-centered humanistic response"""
echo         return {
echo             "response": """Thank you for sharing that with me. I can sense the importance of what you're experiencing, and I want you to know that I'm here to listen and understand.
echo.
echo Your feelings and experiences are valid, and it takes courage to open up about what's happening in your life. I'm curious to learn more about your perspective.
echo.
echo What feels most important for you to explore right now? I'm here to support you in whatever way feels most helpful.""",
echo             "techniques": ["Active listening", "Unconditional positive regard", "Empathetic reflection"],
echo             "follow_ups": [
echo                 "How does it feel to put these experiences into words?",
echo                 "What would it mean to you to feel truly understood?",
echo                 "What else would you like me to know about your experience?"
echo             ],
echo             "confidence": 0.82
echo         }
echo     
echo     async def _trauma_informed_response^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate trauma-informed response"""
echo         return {
echo             "response": """I want to acknowledge your strength in sharing something so difficult. Trauma can have profound effects on how we experience the world, and your reactions make complete sense.
echo.
echo Right now, let's focus on helping you feel safe and grounded. You're in control here, and we can go at whatever pace feels right for you.
echo.
echo Can you tell me about your surroundings right now? Sometimes noticing our physical environment can help us feel more present and safe.""",
echo             "techniques": ["Safety establishment", "Grounding techniques", "Trauma-informed care principles"],
echo             "follow_ups": [
echo                 "Do you feel safe in your current environment?",
echo                 "What helps you feel most grounded and present?",
echo                 "Would you like to try a grounding exercise together?"
echo             ],
echo             "confidence": 0.90
echo         }
echo     
echo     def get_capabilities^(self^) -^> List[str]:
echo         return [
echo             "Cognitive Behavioral Therapy",
echo             "Dialectical Behavioral Therapy", 
echo             "Humanistic Counseling",
echo             "Trauma-Informed Care",
echo             "Active Listening",
echo             "Therapeutic Rapport Building"
echo         ]
) > ai-agents\agents\therapist_agent.py

REM Create crisis detector agent
(
echo # ai-agents/agents/crisis_detector.py
echo from .base_agent import BaseAgent
echo from typing import Dict, List, Any
echo import re
echo from datetime import datetime
echo.
echo class CrisisDetector^(BaseAgent^):
echo     """Specialized agent for crisis detection and intervention"""
echo     
echo     def __init__^(self^):
echo         super^(^).__init__^(
echo             name="Crisis Intervention Specialist",
echo             role="Crisis Detection ^& Safety",
echo             expertise=["Suicide Prevention", "Crisis Intervention", "Safety Planning", "Risk Assessment"]
echo         ^)
echo         
echo         # Enhanced crisis detection patterns
echo         self.crisis_patterns = {
echo             "high_risk": {
echo                 "keywords": [
echo                     "kill myself", "suicide", "end it all", "want to die",
echo                     "better off dead", "can't go on", "no point living",
echo                     "hurt myself", "self harm", "cut myself", "overdose",
echo                     "jump off", "hang myself", "shoot myself"
echo                 ],
echo                 "risk_level": 9
echo             },
echo             "medium_risk": {
echo                 "keywords": [
echo                     "hopeless", "worthless", "burden", "give up",
echo                     "can't take it", "overwhelmed", "trapped", "desperate",
echo                     "no way out", "end the pain", "can't cope", "breaking point"
echo                 ],
echo                 "risk_level": 6
echo             },
echo             "concerning": {
echo                 "keywords": [
echo                     "depressed", "sad all the time", "empty", "numb",
echo                     "lonely", "isolated", "no energy", "can't sleep",
echo                     "lost interest", "nothing matters"
echo                 ],
echo                 "risk_level": 3
echo             }
echo         }
echo         
echo         # Crisis resources
echo         self.crisis_resources = {
echo             "immediate": [
echo                 {"name": "988 Suicide ^& Crisis Lifeline", "contact": "988", "availability": "24/7"},
echo                 {"name": "Crisis Text Line", "contact": "Text HOME to 741741", "availability": "24/7"},
echo                 {"name": "Emergency Services", "contact": "911", "availability": "24/7"}
echo             ],
echo             "ongoing": [
echo                 {"name": "NAMI Helpline", "contact": "1-800-950-NAMI", "availability": "M-F 10am-10pm ET"},
echo                 {"name": "Mental Health America", "contact": "mhanational.org", "availability": "Online"},
echo                 {"name": "Crisis Text Line", "contact": "Text HOME to 741741", "availability": "24/7"}
echo             ]
echo         }
echo     
echo     async def process^(self, message: str, context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Analyze message for crisis indicators"""
echo         
echo         # Perform crisis assessment
echo         assessment = self._assess_crisis_level^(message^)
echo         
echo         # Generate appropriate response
echo         response_data = await self._generate_crisis_response^(assessment, context^)
echo         
echo         # Update metrics
echo         self.update_metrics^(True, assessment["confidence"]^)
echo         
echo         # Log high-risk assessments
echo         if assessment["risk_level"] ^>= 8:
echo             self._log_high_risk_event^(message, assessment, context^)
echo         
echo         return {
echo             "agent_type": "crisis_detector",
echo             "risk_assessment": assessment,
echo             "response": response_data["response"],
echo             "immediate_actions": response_data["immediate_actions"],
echo             "resources": response_data["resources"],
echo             "requires_immediate_attention": assessment["risk_level"] ^>= 8,
echo             "confidence": assessment["confidence"]
echo         }
echo     
echo     def _assess_crisis_level^(self, message: str^) -^> Dict[str, Any]:
echo         """Assess crisis level based on message content"""
echo         message_lower = message.lower^(^)
echo         
echo         highest_risk = 0
echo         matched_patterns = []
echo         confidence = 0.0
echo         
echo         # Check each risk category
echo         for category, data in self.crisis_patterns.items^(^):
echo             matches = [kw for kw in data["keywords"] if kw in message_lower]
echo             if matches:
echo                 matched_patterns.extend^(matches^)
echo                 if data["risk_level"] ^> highest_risk:
echo                     highest_risk = data["risk_level"]
echo         
echo         # Calculate confidence based on pattern matches
echo         if matched_patterns:
echo             confidence = min^(len^(matched_patterns^) * 0.2 + 0.6, 1.0^)
echo         
echo         # Additional contextual analysis
echo         contextual_risk = self._analyze_context^(message_lower^)
echo         final_risk = min^(highest_risk + contextual_risk, 10^)
echo         
echo         return {
echo             "risk_level": final_risk,
echo             "matched_patterns": matched_patterns,
echo             "confidence": confidence,
echo             "assessment_timestamp": datetime.now^(^).isoformat^(^),
echo             "requires_intervention": final_risk ^>= 8
echo         }
echo     
echo     def _analyze_context^(self, message: str^) -^> int:
echo         """Analyze contextual factors that might increase risk"""
echo         risk_modifiers = 0
echo         
echo         # Time-related urgency
echo         urgency_words = ["right now", "today", "tonight", "soon", "planning"]
echo         if any^(word in message for word in urgency_words^):
echo             risk_modifiers += 2
echo         
echo         # Method specificity
echo         method_words = ["pills", "bridge", "gun", "rope", "knife"]
echo         if any^(word in message for word in method_words^):
echo             risk_modifiers += 3
echo         
echo         # Social isolation
echo         isolation_words = ["alone", "nobody", "no one cares", "abandoned"]
echo         if any^(word in message for word in isolation_words^):
echo             risk_modifiers += 1
echo         
echo         return risk_modifiers
echo     
echo     async def _generate_crisis_response^(self, assessment: Dict[str, Any], context: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate appropriate crisis response based on assessment"""
echo         
echo         if assessment["risk_level"] ^>= 8:
echo             return await self._generate_high_risk_response^(assessment^)
echo         elif assessment["risk_level"] ^>= 5:
echo             return await self._generate_medium_risk_response^(assessment^)
echo         else:
echo             return await self._generate_supportive_response^(assessment^)
echo     
echo     async def _generate_high_risk_response^(self, assessment: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate immediate crisis intervention response"""
echo         return {
echo             "response": """🚨 **IMMEDIATE SAFETY CONCERN** 🚨
echo.
echo I'm very concerned about your safety right now. Your life has value, and you don't have to face this alone.
echo.
echo **Please reach out to one of these resources IMMEDIATELY:**
echo.
echo 🆘 **Call 988** ^(Suicide ^& Crisis Lifeline^) - Available 24/7
echo 📱 **Text HOME to 741741** ^(Crisis Text Line^)
echo 🚑 **Call 911** if you're in immediate danger
echo 🏥 **Go to your nearest emergency room**
echo.
echo Can you tell me if you're in a safe place right now? I want to help you connect with immediate professional support.""",
echo             
echo             "immediate_actions": [
echo                 "Contact emergency services if in immediate danger",
echo                 "Remove any means of self-harm from environment",
echo                 "Stay with trusted person or in public place",
echo                 "Call crisis hotline immediately"
echo             ],
echo             
echo             "resources": self.crisis_resources["immediate"]
echo         }
echo     
echo     async def _generate_medium_risk_response^(self, assessment: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate enhanced support response"""
echo         return {
echo             "response": """I'm hearing some concerning thoughts in what you've shared, and I want you to know that I'm taking this seriously. These feelings can be overwhelming, but you don't have to navigate them alone.
echo.
echo **Support Resources Available:**
echo • **988 Suicide ^& Crisis Lifeline** - Call or text 988
echo • **Crisis Text Line** - Text HOME to 741741
echo • **Your local emergency room** - Available 24/7
echo.
echo Right now, can you tell me: Are you having thoughts of hurting yourself? Do you feel safe where you are?
echo.
echo Please know that reaching out shows strength, and there are people who want to help you through this difficult time.""",
echo             
echo             "immediate_actions": [
echo                 "Assess immediate safety",
echo                 "Connect with crisis support services",
echo                 "Reach out to trusted support person",
echo                 "Consider professional mental health support"
echo             ],
echo             
echo             "resources": self.crisis_resources["immediate"] + self.crisis_resources["ongoing"][:2]
echo         }
echo     
echo     async def _generate_supportive_response^(self, assessment: Dict[str, Any]^) -^> Dict[str, Any]:
echo         """Generate supportive response for lower risk situations"""
echo         return {
echo             "response": """I can hear that you're going through a difficult time, and I want you to know that your feelings are valid. It's important that you reached out.
echo.
echo While these feelings are challenging, there are people and resources available to support you:
echo.
echo **If you need to talk to someone:**
echo • **988 Suicide ^& Crisis Lifeline** - Available 24/7
echo • **Crisis Text Line** - Text HOME to 741741
echo.
echo How are you feeling right now? Is there anything specific that's been weighing on your mind lately?""",
echo             
echo             "immediate_actions": [
echo                 "Continue therapeutic conversation",
echo                 "Monitor for escalation",
echo                 "Provide emotional support",
echo                 "Encourage professional support if needed"
echo             ],
echo             
echo             "resources": self.crisis_resources["ongoing"]
echo         }
echo     
echo     def _log_high_risk_event^(self, message: str, assessment: Dict[str, Any], context: Dict[str, Any]^):
echo         """Log high-risk events for review and follow-up"""
echo         # In production, this would log to secure monitoring system
echo         print^(f"HIGH RISK EVENT LOGGED: {datetime.now^(^)} - Risk Level: {assessment['risk_level']}"^)
echo     
echo     def get_capabilities^(self^) -^> List[str]:
echo         return [
echo             "Suicide Risk Assessment",
echo             "Crisis Intervention",
echo             "Safety Planning",
echo             "Resource Connection",
echo             "Emergency Response Coordination",
echo             "Risk Level Monitoring"
echo         ]
) > ai-agents\agents\crisis_detector.py

REM Create standalone test script
(
echo # ai-agents/scripts/test_agents.py
echo """
echo Standalone testing script for AI agents without backend dependency
echo Run this to test individual agents and the crew system
echo """
echo.
echo import asyncio
echo import sys
echo import os
echo sys.path.append^(os.path.dirname^(os.path.dirname^(os.path.abspath^(__file__^)^)^)^)
echo.
echo from crew.mental_health_crew import MentalHealthCrew
echo from agents.therapist_agent import TherapistAgent
echo from agents.crisis_detector import CrisisDetector
echo from datetime import datetime
echo import json
echo.
echo class AgentTester:
echo     def __init__^(self^):
echo         self.crew = MentalHealthCrew^(^)
echo         self.test_cases = [
echo             {
echo                 "name": "Normal conversation",
echo                 "message": "I've been feeling a bit stressed lately with work",
echo                 "expected_agent": "therapist"
echo             },
echo             {
echo                 "name": "Crisis situation",
echo                 "message": "I can't take it anymore, I want to end it all",
echo                 "expected_agent": "crisis_support"
echo             },
echo             {
echo                 "name": "Anxiety symptoms", 
echo                 "message": "I'm having panic attacks and can't stop worrying",
echo                 "expected_agent": "therapist"
echo             },
echo             {
echo                 "name": "Depression indicators",
echo                 "message": "Everything feels hopeless and I don't see the point",
echo                 "expected_agent": "crisis_support"
echo             },
echo             {
echo                 "name": "General support",
echo                 "message": "Hi, I'm not sure where to start but I need someone to talk to",
echo                 "expected_agent": "therapist"
echo             }
echo         ]
echo     
echo     async def run_all_tests^(self^):
echo         """Run all test cases"""
echo         print^("🧪 Starting AI Agent Testing Suite"^)
echo         print^("=" * 50^)
echo         
echo         results = []
echo         
echo         for i, test_case in enumerate^(self.test_cases, 1^):
echo             print^(f"\n📝 Test {i}: {test_case['name']}"^)
echo             print^(f"Message: '{test_case['message']}'"^)
echo             print^("-" * 30^)
echo             
echo             try:
echo                 result = await self.crew.process_message^(
echo                     message=test_case["message"],
echo                     session_id=f"test-{i}",
echo                     session_history=[],
echo                     user_profile={"test_mode": True},
echo