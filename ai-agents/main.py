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
    sessionHistory: List[Dict[str, Any]] = []
    userProfile: Dict[str, Any] = {}
    context: Dict[str, Any] = {}

class ProcessResponse(BaseModel):
    status: str
    result: Dict[str, Any]
    sessionId: str
    timestamp: datetime

class HealthCheck(BaseModel):
    status: str
    service: str
    timestamp: datetime

@app.get("/health", response_model=HealthCheck)
async def health_check():
    return HealthCheck(
        status="healthy",
        service="Mental Health AI Agents",
        timestamp=datetime.now()
    )

@app.post("/process", response_model=ProcessResponse)
async def process_message(request: ProcessRequest):
    """Process a message through the mental health agent crew"""
    try:
        logger.info(f"Processing message for session: {request.sessionId}")
        
        result = await mental_health_crew.process_message(
            message=request.message,
            session_id=request.sessionId,
            session_history=request.sessionHistory,
            user_profile=request.userProfile,
            context=request.context
        )
        
        return ProcessResponse(
            status="success",
            result=result,
            sessionId=request.sessionId,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
    uvicorn.run(app, host="0.0.0.0", port=8001)