from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import whisper
import uvicorn
import tempfile
import os
import logging
from typing import Optional
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Whisper Speech-to-Text Service", version="1.0.0")

# Load Whisper small model (optimized for speed)
logger.info("Loading Whisper small model...")
model = whisper.load_model("small")
logger.info("Whisper model loaded successfully!")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Whisper Speech-to-Text",
        "model": "small",
        "timestamp": time.time()
    }

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio to text using Whisper AI
    
    - **audio**: Audio file (wav, mp3, m4a, etc.)
    
    Returns: JSON with transcribed text
    """
    start_time = time.time()
    
    try:
        # Validate file
        if not audio.filename:
            raise HTTPException(status_code=400, detail="No audio file provided")
        
        logger.info(f"Processing audio file: {audio.filename}")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            audio_content = await audio.read()
            tmp_file.write(audio_content)
            tmp_file_path = tmp_file.name
        
        try:
            # Transcribe using Whisper (small model for speed)
            logger.info("Starting transcription...")
            result = model.transcribe(
                tmp_file_path,
                language="en",  # Force English for speed
                task="transcribe",  # Don't translate, just transcribe
                fp16=False,  # Use fp32 for better compatibility
                verbose=False  # Reduce logging
            )
            
            transcription_time = time.time() - start_time
            logger.info(f"Transcription completed in {transcription_time:.2f} seconds")
            
            return JSONResponse(content={
                "status": "success",
                "text": result["text"].strip(),
                "language": result.get("language", "en"),
                "duration": transcription_time,
                "confidence": "high",  # Whisper doesn't provide confidence scores
                "model": "whisper-small"
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
                
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "text": "",
                "error": str(e),
                "duration": time.time() - start_time
            }
        )

@app.post("/transcribe-realtime")
async def transcribe_realtime(audio: UploadFile = File(...)):
    """
    Real-time transcription optimized for speed
    """
    start_time = time.time()
    
    try:
        logger.info("Processing real-time audio chunk")
        
        # Save uploaded chunk temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            audio_content = await audio.read()
            tmp_file.write(audio_content)
            tmp_file_path = tmp_file.name
        
        try:
            # Fast transcription settings
            result = model.transcribe(
                tmp_file_path,
                language="en",
                task="transcribe",
                fp16=False,
                verbose=False,
                condition_on_previous_text=False,  # Faster processing
                temperature=0,  # Deterministic output
                best_of=1,  # Don't sample multiple times
                beam_size=1  # Fastest beam search
            )
            
            transcription_time = time.time() - start_time
            
            return JSONResponse(content={
                "status": "success",
                "text": result["text"].strip(),
                "duration": transcription_time,
                "realtime": True
            })
            
        finally:
            if os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
                
    except Exception as e:
        logger.error(f"Real-time transcription error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "text": "",
                "error": str(e),
                "realtime": True
            }
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)