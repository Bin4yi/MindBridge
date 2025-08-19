from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import whisper
import uvicorn
import tempfile
import os
import logging
from typing import Optional
import time
import gc

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Whisper Speech-to-Text Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load Whisper model based on environment variable or default to "small"
model_name = os.environ.get("WHISPER_MODEL_SIZE", "small")
logger.info(f"Loading Whisper {model_name} model...")
model = whisper.load_model(model_name)
logger.info("Whisper model loaded successfully!")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Whisper Speech-to-Text",
        "model": model_name,
        "timestamp": time.time()
    }

@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None)
):
    """
    Transcribe audio to text using Whisper AI
    
    - **audio**: Audio file (wav, mp3, m4a, etc.)
    - **language**: Optional language code (e.g., "en", "es")
    
    Returns: JSON with transcribed text
    """
    start_time = time.time()
    audio_content = None
    tmp_file_path = None
    
    try:
        # Validate file
        if not audio.filename:
            raise HTTPException(status_code=400, detail="No audio file provided")
        
        logger.info(f"Processing audio file: {audio.filename}")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            audio_content = await audio.read()
            if not audio_content or len(audio_content) == 0:
                raise HTTPException(status_code=400, detail="Empty audio file")
            tmp_file.write(audio_content)
            tmp_file_path = tmp_file.name
        
        try:
            # Transcribe using Whisper
            logger.info("Starting transcription...")
            result = model.transcribe(
                tmp_file_path,
                language=language,  # Use provided language or auto-detect
                task="transcribe",
                fp16=False,  # Use fp32 for better compatibility
                verbose=False
            )
            
            transcription_time = time.time() - start_time
            logger.info(f"Transcription completed in {transcription_time:.2f} seconds")
            
            return JSONResponse(content={
                "status": "success",
                "text": result["text"].strip(),
                "language": result.get("language", "en"),
                "duration": transcription_time,
                "confidence": "high",
                "model": f"whisper-{model_name}"
            })
            
        finally:
            # Clean up temporary file
            if tmp_file_path and os.path.exists(tmp_file_path):
                os.remove(tmp_file_path)
                logger.debug(f"Temporary file removed: {tmp_file_path}")
                
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
    finally:
        # Clear memory
        del audio_content
        gc.collect()

@app.post("/transcribe-realtime")
async def transcribe_realtime(
    audio: UploadFile = File(...),
    language: Optional[str] = Form("en")
):
    """
    Real-time transcription optimized for speed
    """
    start_time = time.time()
    audio_content = None
    tmp_file_path = None
    
    try:
        logger.info("Processing real-time audio chunk")
        
        # Save uploaded chunk temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            audio_content = await audio.read()
            if not audio_content or len(audio_content) == 0:
                raise HTTPException(status_code=400, detail="Empty audio file")
            tmp_file.write(audio_content)
            tmp_file_path = tmp_file.name
        
        try:
            # Fast transcription settings
            result = model.transcribe(
                tmp_file_path,
                language=language,
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
            if tmp_file_path and os.path.exists(tmp_file_path):
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
    finally:
        # Clear memory
        del audio_content
        gc.collect()

if __name__ == "__main__":
    print(f"Starting Whisper Service with {model_name} model")
    print("Service will be available at http://localhost:9000")
    print("Endpoints:")
    print("  - GET  /health: Check service health")
    print("  - POST /transcribe: Transcribe audio file to text")
    print("  - POST /transcribe-realtime: Optimized for real-time audio chunks")
    uvicorn.run(app, host="0.0.0.0", port=9000)