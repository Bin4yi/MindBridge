from fastapi import FastAPI, File, UploadFile
import whisper
import uvicorn
import tempfile
import os

app = FastAPI()

# Load the medium model (better accuracy for Sinhala + English)
# It will auto-download on first run (~1.4GB)
model = whisper.load_model("medium")  

@app.post("/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        audio_bytes = await audio.read()
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        # Auto-detect language, always output English
        result = model.transcribe(tmp_path, task="translate")
        return {"text": result["text"], "success": True, "detected_language": result["language"]}
    finally:
        os.remove(tmp_path)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
