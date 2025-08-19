import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API settings
    PROJECT_NAME: str = "MindBridge FastAPI Backend"
    API_V1_STR: str = ""
    
    # Database settings
    POSTGRES_SERVER: str = os.getenv("DB_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("DB_PORT", "5432")
    POSTGRES_DB: str = os.getenv("DB_NAME", "mindbridge_db")
    POSTGRES_USER: str = os.getenv("DB_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("DB_PASSWORD", "yomal")
    DATABASE_URI: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    
    # External service URLs
    AI_AGENTS_URL: str = os.getenv("AI_AGENTS_URL", "http://localhost:8001")
    WHISPER_SERVICE_URL: str = os.getenv("WHISPER_SERVICE_URL", "http://localhost:9000")

settings = Settings()