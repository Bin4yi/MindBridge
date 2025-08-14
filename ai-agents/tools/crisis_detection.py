# ai-agents/tools/crisis_detection.py
from crewai import tool
import re
from typing import Dict, List

def _get_recommended_action(risk_level: int) -> str:
    if risk_level >= 8:
        return "IMMEDIATE_CRISIS_INTERVENTION"
    elif risk_level >= 5:
        return "ENHANCED_SUPPORT"
    elif risk_level >= 3:
        return "STANDARD_THERAPEUTIC_SUPPORT"
    else:
        return "GENERAL_SUPPORT"

@tool("Crisis Detection Tool")
def crisis_detection_tool(text: str) -> Dict:
    """Analyzes text for signs of mental health crisis, suicide ideation, and self-harm indicators"""
    
    # Comprehensive crisis keywords with severity levels
    high_risk_keywords = [
        "kill myself", "suicide", "end it all", "want to die", 
        "better off dead", "can't go on", "no point living",
        "hurt myself", "self harm", "cut myself", "overdose"
    ]
    
    medium_risk_keywords = [
        "hopeless", "worthless", "burden", "give up",
        "can't take it", "overwhelmed", "trapped", "desperate"
    ]
    
    low_risk_keywords = [
        "sad", "depressed", "anxious", "stressed", "tired"
    ]
    
    text_lower = text.lower()
    
    # Check for high-risk indicators
    high_risk_matches = [keyword for keyword in high_risk_keywords if keyword in text_lower]
    medium_risk_matches = [keyword for keyword in medium_risk_keywords if keyword in text_lower]
    low_risk_matches = [keyword for keyword in low_risk_keywords if keyword in text_lower]
    
    # Calculate risk level
    risk_level = 0
    if high_risk_matches:
        risk_level = 8 + min(len(high_risk_matches), 2)  # 8-10
    elif medium_risk_matches:
        risk_level = 4 + min(len(medium_risk_matches), 4)  # 4-8
    elif low_risk_matches:
        risk_level = 1 + min(len(low_risk_matches), 3)  # 1-4
    
    return {
        "risk_level": risk_level,
        "high_risk_indicators": high_risk_matches,
        "medium_risk_indicators": medium_risk_matches,
        "requires_immediate_intervention": risk_level >= 8,
        "recommended_action": _get_recommended_action(risk_level)
    }