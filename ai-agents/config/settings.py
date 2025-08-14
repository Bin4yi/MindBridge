"""
Configuration settings for the Mental Health AI Agents system
"""
import os
from typing import Dict, Any
from pydantic import BaseSettings

class Settings(BaseSettings):
    """Application settings"""
    
    # API Keys
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
    
    # Application Settings
    app_name: str = "Mental Health AI Agents"
    app_version: str = "2.0.0"
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    log_level: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8001
    reload: bool = debug
    
    # Database Configuration
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    postgres_url: str = os.getenv("POSTGRES_URL", "")
    
    # Session Management
    session_timeout: int = 3600  # 1 hour
    max_sessions_per_user: int = 5
    
    # Crisis Detection Settings
    crisis_escalation_threshold: int = 8
    enable_crisis_logging: bool = True
    crisis_alert_email: str = os.getenv("CRISIS_ALERT_EMAIL", "")
    
    # Voice Settings
    default_voice: str = "alloy"
    speech_rate: float = 1.0
    enable_voice_by_default: bool = True
    
    # Agent Settings
    agent_configs: Dict[str, Any] = {
        "therapist": {
            "model": "gpt-3.5-turbo",
            "temperature": 0.7,
            "max_tokens": 500
        },
        "crisis_detector": {
            "model": "gpt-3.5-turbo",
            "temperature": 0.3,
            "max_tokens": 300
        },
        "mood_tracker": {
            "model": "gpt-3.5-turbo",
            "temperature": 0.5,
            "max_tokens": 200
        }
    }
    
    # Security Settings
    jwt_secret: str = os.getenv("JWT_SECRET", "your-secret-key")
    encryption_key: str = os.getenv("ENCRYPTION_KEY", "")
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Therapeutic approaches configuration
THERAPEUTIC_APPROACHES = {
    "cbt": {
        "name": "Cognitive Behavioral Therapy",
        "description": "Focus on identifying and changing negative thought patterns",
        "techniques": ["Thought challenging", "Behavioral experiments", "Cognitive restructuring"]
    },
    "dbt": {
        "name": "Dialectical Behavior Therapy", 
        "description": "Skills for emotional regulation and distress tolerance",
        "techniques": ["Mindfulness", "Distress tolerance", "Emotion regulation", "Interpersonal effectiveness"]
    },
    "humanistic": {
        "name": "Person-Centered Therapy",
        "description": "Client-focused approach emphasizing empathy and unconditional positive regard",
        "techniques": ["Active listening", "Reflection", "Unconditional positive regard"]
    },
    "trauma_informed": {
        "name": "Trauma-Informed Care",
        "description": "Approach that recognizes and responds to trauma impact",
        "techniques": ["Safety establishment", "Choice and control", "Trustworthiness"]
    }
}

# Crisis resources configuration
CRISIS_RESOURCES = {
    "immediate": [
        {
            "name": "988 Suicide & Crisis Lifeline",
            "contact": "988",
            "availability": "24/7",
            "description": "Free, confidential support for people in distress"
        },
        {
            "name": "Crisis Text Line",
            "contact": "Text HOME to 741741",
            "availability": "24/7", 
            "description": "Free, 24/7 support via text message"
        },
        {
            "name": "Emergency Services",
            "contact": "911",
            "availability": "24/7",
            "description": "Immediate emergency response"
        }
    ],
    "ongoing": [
        {
            "name": "NAMI Helpline",
            "contact": "1-800-950-NAMI (6264)",
            "availability": "M-F 10am-10pm ET",
            "description": "Information, support, and referrals"
        },
        {
            "name": "Mental Health America",
            "contact": "mhanational.org",
            "availability": "Online",
            "description": "Mental health resources and screening tools"
        },
        {
            "name": "SAMHSA Helpline",
            "contact": "1-800-662-4357",
            "availability": "24/7",
            "description": "Treatment referral and information service"
        }
    ]
}

# Agent role definitions
AGENT_ROLES = {
    "primary_therapist": {
        "name": "Dr. Sarah Chen",
        "role": "Licensed Mental Health Therapist",
        "expertise": ["CBT", "DBT", "Humanistic Therapy", "Trauma-Informed Care"],
        "personality": "Warm, empathetic, and professionally supportive"
    },
    "crisis_detector": {
        "name": "Crisis Intervention Specialist",
        "role": "Crisis Detection & Safety Coordinator",
        "expertise": ["Suicide Prevention", "Crisis Intervention", "Safety Planning", "Risk Assessment"],
        "personality": "Alert, caring, and action-oriented"
    },
    "mood_tracker": {
        "name": "Dr. Alex Rivera",
        "role": "Mood Analysis Specialist",
        "expertise": ["Emotional Intelligence", "Mood Pattern Recognition", "Psychological Assessment"],
        "personality": "Observant, analytical, and understanding"
    },
    "session_manager": {
        "name": "Session Coordinator",
        "role": "Therapeutic Continuity Manager",
        "expertise": ["Treatment Planning", "Progress Tracking", "Goal Setting"],
        "personality": "Organized, supportive, and goal-focused"
    },
    "empathy_specialist": {
        "name": "Dr. Morgan Kim",
        "role": "Empathy & Emotional Support Specialist",
        "expertise": ["Emotional Attunement", "Validation Techniques", "Rapport Building"],
        "personality": "Deeply empathetic, validating, and emotionally intelligent"
    },
    "recommendation_engine": {
        "name": "Wellness Advisor",
        "role": "Therapeutic Recommendation Specialist",
        "expertise": ["Evidence-Based Interventions", "Coping Strategies", "Resource Coordination"],
        "personality": "Knowledgeable, practical, and solution-focused"
    }
}