# MindBridge System Architecture

## Overview

MindBridge consists of four separate services that work together:

1. **AI Agent Server** - CrewAI-based mental health agents (Port 8001)
2. **Backend Server** - Ballerina backend service with API endpoints (Port 8080)
3. **Frontend Server** - React.js user interface (Port 3000)
4. **Whisper Service** - Speech-to-text transcription service (Port 9000)

## Running the Services

### Option 1: Run All Services at Once

```
run_all_services.bat
```

This will start all four services in separate command windows.

### Option 2: Run Services Separately

Start each server in a separate command window:

```
run_crewai_server.bat    # Start the AI Agent Server
run_backend.bat          # Start the Backend Server 
run_frontend.bat         # Start the Frontend Server
run_whisper_service.bat  # Start the Whisper Service
```

## System Architecture

### 1. AI Agent Server (Port 8001)
- **Technology**: Python with FastAPI and CrewAI
- **Purpose**: Processes messages through multiple AI agents 
- **Key Endpoints**:
  - `/chat` - Process messages through CrewAI agents
  - `/health` - Service health check

### 2. Backend Server (Port 8080)
- **Technology**: Ballerina
- **Purpose**: Core API server, handles business logic, database operations
- **Key Endpoints**:
  - `/chat` - Text chat endpoint (forwards to AI agent server)
  - `/voice/chat` - Voice chat endpoint (uses Whisper service + AI agents)
  - `/health` - Service health check

### 3. Frontend Server (Port 3000)
- **Technology**: React.js
- **Purpose**: User interface for the application
- **Features**:
  - Text chat interface
  - Voice chat capability
  - Session management
  - User dashboard

### 4. Whisper Service (Port 9000)
- **Technology**: Python with FastAPI
- **Purpose**: Speech-to-text transcription
- **Key Endpoints**:
  - `/transcribe-realtime` - Transcribe audio to text
  - `/health` - Service health check

## Communication Flow

1. Frontend makes API calls to Backend (port 8080)
2. Backend processes requests and:
   - Forwards chat messages to AI Agent Server (port 8001)
   - Sends voice data to Whisper Service (port 9000)
   - Stores data in database
   - Returns responses to Frontend

## Environment Requirements

- Python 3.9+ with pip
- Node.js and npm
- Ballerina runtime
- PostgreSQL database

## Configuration

Each service has its own configuration:

- AI Agent Server: Uses environment variables for API keys
- Backend Server: Config in `backend/Config.toml`
- Frontend: Uses `.env` file in frontend directory
- Whisper Service: Configuration in `whisper-service/app.py`
