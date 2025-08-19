@echo off
echo ================================
echo Starting MindBridge Frontend Server
echo ================================
cd frontend
echo Installing dependencies if needed...
call npm install
echo Starting frontend development server on port 3000...
echo Press Ctrl+C to stop the server.
call npm start
pause
