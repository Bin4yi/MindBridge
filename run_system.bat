@echo off
echo Starting MindBridge System...

echo Setting OpenAI API Key (replace with your actual key)
set OPENAI_API_KEY=your_openai_api_key_here

echo Starting Python Agent Service (Port 8000)...
start cmd /k "cd ai-agents && python -m main"

echo Waiting for Python agent to initialize...
timeout /t 5 /nobreak > nul

echo Starting Ballerina Backend (Port 8001)...
start cmd /k "cd backend && bal run"

echo MindBridge System Started
echo Python Agent: http://localhost:8000/health
echo Ballerina Backend: http://localhost:8001/health
