# ai-agents/agents/therapist_agent.py
from .base_agent import BaseAgent
from typing import Dict, List, Any
import re

class TherapistAgent(BaseAgent):
    """Primary therapeutic agent with CBT, DBT, and humanistic approaches"""

    def __init__(self):
        super().__init__(
            name="Dr. Sarah Chen",
            role="Primary Therapist",
            expertise=["CBT", "DBT", "Humanistic Therapy", "Trauma-Informed Care"]
        )
        self.therapeutic_approaches = {
            "cbt": self._cognitive_behavioral_response,
            "dbt": self._dialectical_behavioral_response,
            "humanistic": self._humanistic_response,
            "trauma_informed": self._trauma_informed_response
        }

    async def process(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process message using appropriate therapeutic approach"""

        # Determine best therapeutic approach
        approach = self._select_approach(message, context)

        # Generate therapeutic response
        response_func = self.therapeutic_approaches[approach]
        response_data = await response_func(message, context)

        # Update metrics
        self.update_metrics(True, response_data.get("confidence", 0.8))

        return {
            "agent_type": "primary_therapist",
            "approach_used": approach,
            "response": response_data["response"],
            "therapeutic_techniques": response_data["techniques"],
            "follow_up_questions": response_data["follow_ups"],
            "confidence": response_data["confidence"]
        }

    def _select_approach(self, message: str, context: Dict[str, Any]) -> str:
        """Select appropriate therapeutic approach"""
        message_lower = message.lower()

        # Check for trauma indicators
        trauma_keywords = ["trauma", "abuse", "ptsd", "flashback", "triggered"]
        if any(keyword in message_lower for keyword in trauma_keywords):
            return "trauma_informed"

        # Check for thought patterns (CBT)
        thought_patterns = ["think", "believe", "thoughts", "mind racing", "can't stop thinking"]
        if any(pattern in message_lower for pattern in thought_patterns):
            return "cbt"

        # Check for emotional regulation (DBT)
        emotion_regulation = ["overwhelmed", "intense emotions", "can't control", "emotional"]
        if any(keyword in message_lower for keyword in emotion_regulation):
            return "dbt"

        # Default to humanistic
        return "humanistic"

    async def _cognitive_behavioral_response(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate CBT-based response"""
        return {
            "response": """I hear you sharing some challenging thoughts. In CBT, we often explore the connection between our thoughts, feelings, and behaviors. 

Let's take a moment to examine these thoughts. What evidence do you have that supports this thought? And what evidence might challenge it?

Sometimes our minds can play tricks on us, especially when we're feeling overwhelmed. Would you be open to exploring this thought pattern together?""",
            "techniques": ["Thought challenging", "Cognitive restructuring", "Evidence examination"],
            "follow_ups": [
                "What thoughts are going through your mind right now?",
                "How would you rate the intensity of this thought on a scale of 1-10?",
                "What would you tell a friend who had this same thought?"
            ],
            "confidence": 0.85
        }

    async def _dialectical_behavioral_response(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate DBT-based response"""
        return {
            "response": """I can hear how intense these emotions are for you right now. That sounds really difficult to experience.

Let's try a DBT skill called TIPP - Temperature, Intense exercise, Paced breathing, Paired muscle relaxation. Right now, let's focus on paced breathing.

Can you breathe in slowly for 4 counts, hold for 6, and exhale for 8? This can help activate your body's natural calming response.""",
            "techniques": ["TIPP skills", "Distress tolerance", "Emotion regulation", "Mindfulness"],
            "follow_ups": [
                "What emotions are you experiencing most intensely right now?",
                "On a scale of 1-10, how intense are these emotions?",
                "What usually helps you feel more grounded?"
            ],
            "confidence": 0.88
        }

    async def _humanistic_response(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate person-centered humanistic response"""
        return {
            "response": """Thank you for sharing that with me. I can sense the importance of what you're experiencing, and I want you to know that I'm here to listen and understand.

Your feelings and experiences are valid, and it takes courage to open up about what's happening in your life. I'm curious to learn more about your perspective.

What feels most important for you to explore right now? I'm here to support you in whatever way feels most helpful.""",
            "techniques": ["Active listening", "Unconditional positive regard", "Empathetic reflection"],
            "follow_ups": [
                "How does it feel to put these experiences into words?",
                "What would it mean to you to feel truly understood?",
                "What else would you like me to know about your experience?"
            ],
            "confidence": 0.82
        }

    async def _trauma_informed_response(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate trauma-informed response"""
        return {
            "response": """I want to acknowledge your strength in sharing something so difficult. Trauma can have profound effects on how we experience the world, and your reactions make complete sense.

Right now, let's focus on helping you feel safe and grounded. You're in control here, and we can go at whatever pace feels right for you.

Can you tell me about your surroundings right now? Sometimes noticing our physical environment can help us feel more present and safe.""",
            "techniques": ["Safety establishment", "Grounding techniques", "Trauma-informed care principles"],
            "follow_ups": [
                "Do you feel safe in your current environment?",
                "What helps you feel most grounded and present?",
                "Would you like to try a grounding exercise together?"
            ],
            "confidence": 0.90
        }

    def get_capabilities(self) -> List[str]:
        return [
            "Cognitive Behavioral Therapy",
            "Dialectical Behavioral Therapy", 
            "Humanistic Counseling",
            "Trauma-Informed Care",
            "Active Listening",
            "Therapeutic Rapport Building"
        ]
