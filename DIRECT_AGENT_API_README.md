# MindBridge - Direct Agent Implementation

This implementation provides direct access to agent functionality via a RESTful API and command-line interfaces. It bypasses the CrewAI framework and directly uses the agent implementations with real LLM integration.

## Available Scripts

### Server Implementation
- **run_direct_agent_server.bat**: Starts a FastAPI server that provides a `/chat` endpoint
- **test_chat_api.bat**: Runs a test client that connects to the server's `/chat` endpoint

### Direct Testing
- **test_chat_endpoint.bat**: Tests the chat endpoint functionality directly (no server)
- **pure_agent_workflow.bat**: Runs a direct agent chat workflow in the console

## Direct Agent Server

The direct agent server provides a RESTful API with the following endpoints:

- **GET /health**: Check server health status
- **POST /chat**: Process a message through the direct agent implementations

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
  "approach_used": "cbt",
  "therapeutic_techniques": ["Cognitive restructuring", "Evidence examination"],
  "follow_up_questions": ["How does that make you feel?"],
  "timestamp": "2023-08-19T15:30:45.123456"
}
```

## Testing the Implementation

1. Start the direct agent server:
   ```
   run_direct_agent_server.bat
   ```

2. In a different terminal, run the test client:
   ```
   test_chat_api.bat
   ```

3. Enter messages to chat with the AI and see the responses

## Technical Details

- **Agent Processing**: Each message is first processed by the CrisisDetector to assess risk level
- **Risk-Based Routing**: Messages are routed to the appropriate agent based on risk level
- **LLM Integration**: Uses OpenAI API to generate dynamic, contextual responses
- **Session Management**: Maintains conversation history for context-aware responses

## Dependencies

- FastAPI
- Uvicorn
- Aiohttp
- OpenAI Python SDK
- Python-dotenv
