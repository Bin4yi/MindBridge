# ai-agents/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging
import uvicorn
from crew.mental_health_crew import MentalHealthCrew

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mental Health AI Agents", version="2.0.0")

# Initialize the crew
mental_health_crew = MentalHealthCrew()

# Request/Response models
class ProcessRequest(BaseModel):
    sessionId: str
    message: str
    sessionHistory: List[Dict] = []
    userProfile: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None

# Chat request model (for backward compatibility with Ballerina backend)
class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: str
    agent_type: Optional[str] = "therapist"

class ProcessResponse(BaseModel):
    response: str
    agentType: str
    confidenceScore: int
    requiresImmediateAttention: bool
    emotionalState: str
    recommendations: List[str]
    sessionSummary: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    agents_active: int
    crew_status: str

@app.get("/health")
async def health_check():
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now(),
        agents_active=6,
        crew_status="active"
    )

@app.post("/process", response_model=ProcessResponse)
async def process_message(request: ProcessRequest):
    try:
        logger.info(f"Processing message for session {request.sessionId}")
        
        # Process through CrewAI multi-agent system
        result = await mental_health_crew.process_message(
            message=request.message,
            session_id=request.sessionId,
            session_history=request.sessionHistory,
            user_profile=request.userProfile,
            context=request.context
        )
        
        return ProcessResponse(**result)
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint for compatibility with Ballerina backend"""
    try:
        logger.info(f"Received chat request for session {request.session_id} from user {request.user_id}")
        
        # Process through CrewAI multi-agent system
        result = await mental_health_crew.process_message(
            message=request.message,
            session_id=request.session_id,
            session_history=[],  # No history from this simplified endpoint
            user_profile={"user_id": request.user_id},
            context={"agent_type": request.agent_type}
        )
        
        # Return simplified response for backward compatibility
        return {
            "response": result["response"],
            "agent_type": result["agentType"],
            "session_id": request.session_id,
            "requires_attention": result.get("requiresImmediateAttention", False)
        }
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/test-standalone")
async def test_standalone(message: str):
    """Test endpoint for standalone agent testing without backend"""
    try:
        test_request = ProcessRequest(
            sessionId="test-session",
            message=message,
            sessionHistory=[],
            userProfile={"name": "Test User", "age": 25},
            context={"test_mode": True}
        )
        
        result = await mental_health_crew.process_message(
            message=test_request.message,
            session_id=test_request.sessionId,
            session_history=test_request.sessionHistory,
            user_profile=test_request.userProfile,
            context=test_request.context
        )
        
        return {"status": "success", "result": result}
        
    except Exception as e:
        logger.error(f"Test error: {str(e)}")
        return {"status": "error", "error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)