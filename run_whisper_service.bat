@echo off
echo ================================
echo Starting MindBridge Whisper Service
echo ================================
cd whisper-service
echo Starting whisper service on port 9000...
echo Press Ctrl+C to stop the server.
python app.py
pause
