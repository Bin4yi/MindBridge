# ai-agents/tools/simple_tools.py
from crewai import tool
from typing import Dict, List

@tool("Response Generator Tool")
def response_generator_tool(text: str, context: str = "") -> Dict:
    """Generates therapeutic responses based on input text and context"""
    return {
        "response": f"Thank you for sharing that with me. I hear that you're experiencing {text}. {context}",
        "tone": "empathetic",
        "therapeutic_approach": "person-centered"
    }

@tool("Session Tracker Tool") 
def session_tracker_tool(session_id: str, message: str, response: str) -> Dict:
    """Tracks session information and maintains continuity"""
    return {
        "session_id": session_id,
        "interaction_logged": True,
        "session_length": 1,
        "goals_identified": ["emotional_support", "active_listening"]
    }

@tool("Empathy Analyzer Tool")
def empathy_analyzer_tool(text: str) -> Dict:
    """Analyzes text for emotional content and provides empathetic understanding"""
    emotion_words = ["sad", "happy", "angry", "worried", "excited", "frustrated", "hopeful"]
    detected_emotions = [word for word in emotion_words if word in text.lower()]
    
    return {
        "detected_emotions": detected_emotions,
        "empathy_level": "high" if detected_emotions else "moderate",
        "validation_needed": len(detected_emotions) > 0
    }

@tool("Recommendation Tool")
def recommendation_tool(mood: str, crisis_level: int = 0) -> Dict:
    """Provides therapeutic recommendations based on mood and crisis level"""
    if crisis_level >= 8:
        recommendations = ["Contact crisis hotline", "Reach out to trusted person", "Consider emergency services"]
    elif mood in ["depressed", "sad"]:
        recommendations = ["Practice self-compassion", "Gentle movement or walk", "Connect with support system"]
    elif mood in ["anxious", "worried"]:
        recommendations = ["Deep breathing exercises", "Grounding techniques", "Mindfulness practice"]
    else:
        recommendations = ["Continue self-care", "Maintain routine", "Practice gratitude"]
    
    return {
        "recommendations": recommendations,
        "coping_strategies": recommendations,
        "resources": ["Mental health hotlines", "Online therapy platforms", "Support groups"]
    }
