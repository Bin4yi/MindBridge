@echo off
echo ================================
echo Starting MindBridge Backend Server
echo ================================
cd backend
echo Starting Ballerina backend server on port 8080...
echo Press Ctrl+C to stop the server.
bal run main.bal
pause
