# ai-agents/tools/mood_analysis.py
from crewai import tool
import re
from typing import Dict, List

def _extract_emotional_phrases(text: str) -> List[str]:
    """Extract emotionally charged phrases"""
    # Simple implementation - could be enhanced with NLP
    emotional_patterns = [
        r"i feel? (?:so |really |very )?(\w+)",
        r"i am (?:so |really |very )?(\w+)",
        r"(?:feeling|been) (?:so |really |very )?(\w+)",
    ]
    
    phrases = []
    for pattern in emotional_patterns:
        matches = re.findall(pattern, text.lower())
        phrases.extend(matches)
    
    return phrases

def _analyze_trend(previous_moods: List[str]) -> str:
    """Analyze mood trend over time"""
    if len(previous_moods) < 2:
        return "insufficient_data"
    
    recent_moods = previous_moods[-3:]  # Last 3 sessions
    
    if all(mood in ["depressed", "anxious"] for mood in recent_moods):
        return "concerning_decline"
    elif all(mood in ["happy", "neutral"] for mood in recent_moods):
        return "positive_trend"
    else:
        return "variable"

@tool("Mood Analysis Tool")
def mood_analysis_tool(text: str, previous_moods: List[str] = None) -> Dict:
    """Analyzes emotional content and mood patterns in text"""
    
    mood_indicators = {
        "depressed": ["sad", "hopeless", "empty", "numb", "worthless", "despair"],
        "anxious": ["worried", "nervous", "panic", "scared", "overwhelmed", "restless"],
        "angry": ["mad", "furious", "irritated", "frustrated", "rage", "annoyed"],
        "happy": ["joy", "excited", "content", "pleased", "cheerful", "optimistic"],
        "neutral": ["okay", "fine", "alright", "normal", "stable"]
    }
    
    text_lower = text.lower()
    mood_scores = {}
    
    # Calculate mood scores
    for mood, keywords in mood_indicators.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        mood_scores[mood] = score
    
    # Determine primary mood
    primary_mood = max(mood_scores, key=mood_scores.get) if any(mood_scores.values()) else "neutral"
    intensity = min(mood_scores[primary_mood] * 2, 10)  # Scale to 1-10
    
    return {
        "primary_mood": primary_mood,
        "mood_intensity": intensity,
        "mood_scores": mood_scores,
        "emotional_indicators": _extract_emotional_phrases(text),
        "mood_trend": _analyze_trend(previous_moods) if previous_moods else "new_session"
    }