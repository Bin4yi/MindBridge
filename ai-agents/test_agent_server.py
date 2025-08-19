"""
Simple test agent server that mocks the AI agent functionality
for testing the connection between the backend and agents
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Test Agent Server", version="1.0.0")

class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_id: str
    agent_type: str = "therapist"

class HealthCheck(BaseModel):
    status: str
    service: str
    timestamp: datetime

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    logger.info("Health check requested")
    return HealthCheck(
        status="healthy",
        service="Mock Mental Health Agent",
        timestamp=datetime.now()
    )

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint for testing"""
    logger.info(f"Chat request received: {request}")
    
    # Create a mock response based on the incoming message
    response_text = f"This is a mock response to: '{request.message}'. I'm your {request.agent_type} agent."
    
    # Check for crisis keywords
    crisis_keywords = ["suicide", "kill myself", "want to die", "end my life"]
    requires_attention = any(keyword in request.message.lower() for keyword in crisis_keywords)
    
    if requires_attention:
        response_text = "I notice you mentioned something concerning. I'm here for you and want to help. Can you tell me more about how you're feeling?"
    
    return {
        "response": response_text,
        "agent_type": request.agent_type,
        "session_id": request.session_id,
        "requires_attention": requires_attention
    }

if __name__ == "__main__":
    logger.info("Starting test agent server on port 8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)
