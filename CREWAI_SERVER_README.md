# MindBridge - CrewAI Server API

This implementation provides a FastAPI server that uses the CrewAI framework to process messages through multiple mental health agents, just like in the `chat_with_agent.py` example.

## How It Works

The server creates a `/chat` endpoint that:

1. Takes in a user message and session context
2. Processes the message through the MentalHealthCrew which uses **ALL** available agents:
   - Crisis Detection Specialist
   - Licensed Mental Health Therapist
   - Mood Analysis Specialist
   - Empathy and Emotional Support Specialist
   - Therapeutic Recommendation Specialist
   - Session Coordinator

3. Each agent analyzes the same message simultaneously, exactly as in `chat_with_agent.py`
4. The response is combined from all agent outputs

## Available Endpoints

- **GET /health**: Check server health status
- **POST /chat**: Process a message through the CrewAI mental health crew
- **POST /process**: Legacy endpoint (same as /chat)

### /chat Endpoint

**Request format:**
```json
{
  "session_id": "optional-session-id",
  "message": "User's message here",
  "session_history": [],
  "user_profile": {},
  "context": {}
}
```

**Response format:**
```json
{
  "status": "success",
  "session_id": "session-123",
  "agent_type": "therapist",
  "risk_level": 2.0,
  "response": "AI response text here",
  "response_time": 1.25,
  "therapeutic_techniques": ["Cognitive Behavioral Therapy", "Mindfulness"],
  "follow_up_questions": ["How does that make you feel?"],
  "timestamp": "2023-08-19T15:30:45.123456"
}
```

## Running the Server

1. Start the CrewAI agent server:
   ```
   run_crewai_server.bat
   ```

2. In a different terminal, use the test client:
   ```
   test_chat_api.bat
   ```

## Key Differences from Direct Agent Implementation

This implementation:
- Uses the CrewAI framework instead of direct agent implementations
- Processes each message through ALL available agents simultaneously
- Uses the same agent workflow as `chat_with_agent.py`
- Combines insights from multiple specialists into a cohesive response

## Technical Details

- **MentalHealthCrew**: The main crew that orchestrates all agent interactions
- **Multiple Agents**: Uses 6 specialized agents for comprehensive analysis
- **Sequential Processing**: Each agent performs their specialized analysis
- **Response Generation**: Final response combines insights from all agents

## Dependencies

- CrewAI framework
- FastAPI
- Uvicorn
- Python-dotenv
- LangChain with OpenAI integration
