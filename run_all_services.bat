@echo off
echo ================================
echo Starting All MindBridge Services
echo ================================

:: Start the AI Agent Server
start cmd /k "title MindBridge AI Agent Server && cd c:\Users\Dell\Desktop\MindBridge\MindBridge && run_crewai_server.bat"

:: Wait for agent server to start
echo Waiting for AI Agent Server to initialize...
timeout /t 5 /nobreak > nul

:: Start the Whisper Service
start cmd /k "title MindBridge Whisper Service && cd c:\Users\Dell\Desktop\MindBridge\MindBridge && run_whisper_service.bat"

:: Wait for whisper service to start
echo Waiting for Whisper Service to initialize...
timeout /t 5 /nobreak > nul

:: Start the Backend Server
start cmd /k "title MindBridge Backend Server && cd c:\Users\Dell\Desktop\MindBridge\MindBridge && run_backend.bat"

:: Wait for backend to start
echo Waiting for Backend Server to initialize...
timeout /t 5 /nobreak > nul

:: Start the Frontend Server
start cmd /k "title MindBridge Frontend Server && cd c:\Users\Dell\Desktop\MindBridge\MindBridge && run_frontend.bat"

echo.
echo All MindBridge services are starting in separate windows.
echo.
echo Server Information:
echo - AI Agent Server: http://localhost:8001
echo - Backend Server: http://localhost:8080
echo - Whisper Service: http://localhost:9000 
echo - Frontend Server: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
