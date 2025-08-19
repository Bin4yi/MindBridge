"""
FastAPI server that provides a /chat endpoint using the CrewAI framework
as in chat_with_agent.py
"""
import os
import sys
import asyncio
import re
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ensure we can import from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import dotenv for loading environment variables
from dotenv import load_dotenv
load_dotenv()

# FastAPI imports
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Import the mental health crew from CrewAI framework
from crew.mental_health_crew import MentalHealthCrew

# Request/Response models
class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str
    session_history: List[Dict[str, Any]] = []
    user_profile: Dict[str, Any] = {}
    context: Dict[str, Any] = {}

class ChatResponse(BaseModel):
    status: str
    session_id: str
    agent_type: str
    risk_level: float
    response: str
    response_time: float
    approach_used: Optional[str] = None
    therapeutic_techniques: Optional[List[str]] = None
    follow_up_questions: Optional[List[str]] = None
    requires_immediate_attention: Optional[bool] = None
    immediate_actions: Optional[List[str]] = None
    resources: Optional[List[Any]] = None
    timestamp: str

# Create FastAPI app
app = FastAPI(title="MindBridge Direct Agent API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create mental health crew instance
mental_health_crew = MentalHealthCrew()

# In-memory session storage (would use a database in production)
session_data = {}

@app.get("/")
async def root():
    return {"message": "MindBridge Direct Agent API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MindBridge Direct Agent API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Process a chat message through the CrewAI mental health crew
    
    This endpoint uses the CrewAI framework with multiple agents analyzing the message simultaneously,
    just like in the chat_with_agent.py example.
    """
    try:
        # Use provided session ID or generate a new one
        session_id = request.session_id or f"session-{uuid.uuid4()}"
        
        # Get or create session history
        if session_id not in session_data:
            session_data[session_id] = []
        
        # If session history is provided in the request, use it
        # Otherwise use the stored session history
        session_history = request.session_history if request.session_history else session_data[session_id]
        
        # Prepare start time for timing the process
        start_time = datetime.now()
        
        # Process the message through the mental health crew
        logger.info(f"Processing message via CrewAI for session: {session_id}")
        
        # Call the crew process_message method which will use all agents
        result = await mental_health_crew.process_message(
            message=request.message,
            session_id=session_id,
            session_history=session_history,
            user_profile=request.user_profile,
            context=request.context
        )
        
        # Calculate response time
        end_time = datetime.now()
        response_time = (end_time - start_time).total_seconds()
        logger.info(f"Response generated in {response_time:.2f}s")
        
        # Add response to session history
        session_history.append({"role": "assistant", "content": result["response"]})
        
        # Save updated session history
        session_data[session_id] = session_history
        
        # Extract agent type and risk level from result
        agent_type = result.get("agentType", "therapist")
        risk_level = 0.0  # Default risk level
        
        # Try to extract risk level from raw data
        if "raw" in result and isinstance(result["raw"], dict) and "crisis" in result["raw"]:
            crisis_output = result["raw"]["crisis"].get("output", "")
            if isinstance(crisis_output, str):
                # Try to extract crisis level from output
                risk_match = re.search(r"Crisis Level: (\d+(?:\.\d+)?)", crisis_output)
                if risk_match:
                    try:
                        risk_level = float(risk_match.group(1))
                    except ValueError:
                        pass
        
        # Prepare response data
        response_data = {
            "status": "success",
            "session_id": session_id,
            "agent_type": agent_type,
            "risk_level": risk_level,
            "response": result["response"],
            "response_time": response_time,
            "timestamp": datetime.now().isoformat()
        }
        
        # Extract additional agent-specific data if available
        if "raw" in result and isinstance(result["raw"], dict):
            raw_data = result["raw"]
            
            # For therapeutic techniques from therapist agent
            if "therapist" in raw_data and isinstance(raw_data["therapist"], dict):
                therapy_output = raw_data["therapist"].get("output", "")
                if isinstance(therapy_output, str):
                    techniques = []
                    # Extract techniques from output (simplified)
                    if "CBT" in therapy_output:
                        techniques.append("Cognitive Behavioral Therapy")
                    if "mindfulness" in therapy_output.lower():
                        techniques.append("Mindfulness")
                    if "validation" in therapy_output.lower():
                        techniques.append("Emotional Validation")
                    
                    if techniques:
                        response_data["therapeutic_techniques"] = techniques
            
            # For recommendations from recommendation agent
            if "recommendations" in raw_data and isinstance(raw_data["recommendations"], dict):
                recommendations_output = raw_data["recommendations"].get("output", "")
                if isinstance(recommendations_output, str):
                    # Extract follow-up questions (simplified)
                    follow_ups = []
                    question_lines = [line for line in recommendations_output.split("\n") if "?" in line]
                    if question_lines:
                        follow_ups = question_lines[:2]  # Take up to 2 questions
                        response_data["follow_up_questions"] = follow_ups
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process")
async def process_message(request: ChatRequest):
    """
    Legacy endpoint for backward compatibility - uses the same CrewAI process as /chat
    """
    return await chat_endpoint(request)

if __name__ == "__main__":
    # Run the server with a specified port (8001 to avoid conflicts)
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
