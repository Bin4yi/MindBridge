# ai-agents/agents/crisis_detector.py
from .base_agent import BaseAgent
from typing import Dict, List, Any
import re
from datetime import datetime

class CrisisDetector(BaseAgent):
    """Specialized agent for crisis detection and intervention"""


    def __init__(self):
        super().__init__(
            name="Crisis Intervention Specialist",
            role="Crisis Detection ^& Safety",
            expertise=["Suicide Prevention", "Crisis Intervention", "Safety Planning", "Risk Assessment"]
        )

        # Enhanced crisis detection patterns
        self.crisis_patterns = {
            "high_risk": {
                "keywords": [
                    "kill myself", "suicide", "end it all", "want to die",
                    "better off dead", "can't go on", "no point living",
                    "hurt myself", "self harm", "cut myself", "overdose",
                    "jump off", "hang myself", "shoot myself"
                ],
                "risk_level": 9
            },
            "medium_risk": {
                "keywords": [
                    "hopeless", "worthless", "burden", "give up",
                    "can't take it", "overwhelmed", "trapped", "desperate",
                    "no way out", "end the pain", "can't cope", "breaking point"
                ],
                "risk_level": 6
            },
            "concerning": {
                "keywords": [
                    "depressed", "sad all the time", "empty", "numb",
                    "lonely", "isolated", "no energy", "can't sleep",
                    "lost interest", "nothing matters"
                ],
                "risk_level": 3
            }
        }

        # Crisis resources
        self.crisis_resources = {
            "immediate": [
                {"name": "988 Suicide ^& Crisis Lifeline", "contact": "988", "availability": "24/7"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741", "availability": "24/7"},
                {"name": "Emergency Services", "contact": "911", "availability": "24/7"}
            ],
            "ongoing": [
                {"name": "NAMI Helpline", "contact": "1-800-950-NAMI", "availability": "M-F 10am-10pm ET"},
                {"name": "Mental Health America", "contact": "mhanational.org", "availability": "Online"},
                {"name": "Crisis Text Line", "contact": "Text HOME to 741741", "availability": "24/7"}
            ]
        }

    async def process(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze message for crisis indicators"""

        # Perform crisis assessment
        assessment = self._assess_crisis_level(message)

        # Generate appropriate response
        response_data = await self._generate_crisis_response(assessment, context)

        # Update metrics
        self.update_metrics(True, assessment["confidence"])

        # Log high-risk assessments
        if assessment["risk_level"] >= 8:
            self._log_high_risk_event(message, assessment, context)

        return {
            "agent_type": "crisis_detector",
            "risk_assessment": assessment,
            "response": response_data["response"],
            "immediate_actions": response_data["immediate_actions"],
            "resources": response_data["resources"],
            "requires_immediate_attention": assessment["risk_level"] >= 8,
            "confidence": assessment["confidence"]
        }

    def _assess_crisis_level(self, message: str) -> Dict[str, Any]:
        """Assess crisis level based on message content"""
        message_lower = message.lower()

        highest_risk = 0
        matched_patterns = []
        confidence = 0.0

        # Check each risk category
        for category, data in self.crisis_patterns.items():
            matches = [kw for kw in data["keywords"] if kw in message_lower]
            if matches:
                matched_patterns.extend(matches)
                if data["risk_level"] > highest_risk:
                    highest_risk = data["risk_level"]

        # Calculate confidence based on pattern matches
        if matched_patterns:
            confidence = min(len(matched_patterns) * 0.2 + 0.6, 1.0)

        # Additional contextual analysis
        contextual_risk = self._analyze_context(message_lower)
        final_risk = min(highest_risk + contextual_risk, 10)

        return {
            "risk_level": final_risk,
            "matched_patterns": matched_patterns,
            "confidence": confidence,
            "assessment_timestamp": datetime.now().isoformat(),
            "requires_intervention": final_risk >= 8
        }

    def _analyze_context(self, message: str) -> int:
        """Analyze contextual factors that might increase risk"""
        risk_modifiers = 0

        # Time-related urgency
        urgency_words = ["right now", "today", "tonight", "soon", "planning"]
        if any(word in message for word in urgency_words):
            risk_modifiers += 2

        # Method specificity
        method_words = ["pills", "bridge", "gun", "rope", "knife"]
        if any(word in message for word in method_words):
            risk_modifiers += 3

        # Social isolation
        isolation_words = ["alone", "nobody", "no one cares", "abandoned"]
        if any(word in message for word in isolation_words):
            risk_modifiers += 1

        return risk_modifiers

    async def _generate_crisis_response(self, assessment: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate appropriate crisis response based on assessment"""

        if assessment["risk_level"] >= 8:
            return await self._generate_high_risk_response(assessment)
        elif assessment["risk_level"] >= 5:
            return await self._generate_medium_risk_response(assessment)
        else:
            return await self._generate_supportive_response(assessment)

    async def _generate_high_risk_response(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate immediate crisis intervention response"""
        return {
            "response": """🚨 **IMMEDIATE SAFETY CONCERN** 🚨

I'm very concerned about your safety right now. Your life has value, and you don't have to face this alone.

**Please reach out to one of these resources IMMEDIATELY:**

🆘 **Call 988** (Suicide & Crisis Lifeline) - Available 24/7
📱 **Text HOME to 741741** (Crisis Text Line)
🚑 **Call 911** if you're in immediate danger
🏥 **Go to your nearest emergency room**

Can you tell me if you're in a safe place right now? I want to help you connect with immediate professional support.""",

            "immediate_actions": [
                "Contact emergency services if in immediate danger",
                "Remove any means of self-harm from environment",
                "Stay with trusted person or in public place",
                "Call crisis hotline immediately"
            ],

            "resources": self.crisis_resources["immediate"]
        }

    async def _generate_medium_risk_response(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate enhanced support response"""
        return {
            "response": """I'm hearing some concerning thoughts in what you've shared, and I want you to know that I'm taking this seriously. These feelings can be overwhelming, but you don't have to navigate them alone.

**Support Resources Available:**
• **988 Suicide & Crisis Lifeline** - Call or text 988
• **Crisis Text Line** - Text HOME to 741741
• **Your local emergency room** - Available 24/7

Right now, can you tell me: Are you having thoughts of hurting yourself? Do you feel safe where you are?

Please know that reaching out shows strength, and there are people who want to help you through this difficult time.""",

            "immediate_actions": [
                "Assess immediate safety",
                "Connect with crisis support services",
                "Reach out to trusted support person",
                "Consider professional mental health support"
            ],

            "resources": self.crisis_resources["immediate"] + self.crisis_resources["ongoing"][:2]
        }

    async def _generate_supportive_response(self, assessment: Dict[str, Any]) -> Dict[str, Any]:
        """Generate supportive response for lower risk situations"""
        return {
            "response": """I can hear that you're going through a difficult time, and I want you to know that your feelings are valid. It's important that you reached out.

While these feelings are challenging, there are people and resources available to support you:

**If you need to talk to someone:**
• **988 Suicide & Crisis Lifeline** - Available 24/7
• **Crisis Text Line** - Text HOME to 741741

How are you feeling right now? Is there anything specific that's been weighing on your mind lately?""",

            "immediate_actions": [
                "Continue therapeutic conversation",
                "Monitor for escalation",
                "Provide emotional support",
                "Encourage professional support if needed"
            ],

            "resources": self.crisis_resources["ongoing"]
        }

    def _log_high_risk_event(self, message: str, assessment: Dict[str, Any], context: Dict[str, Any]):
        """Log high-risk events for review and follow-up"""
        # In production, this would log to secure monitoring system
        print(f"HIGH RISK EVENT LOGGED: {datetime.now()} - Risk Level: {assessment['risk_level']}")

    def get_capabilities(self) -> List[str]:
        return [
            "Suicide Risk Assessment",
            "Crisis Intervention",
            "Safety Planning",
            "Resource Connection",
            "Emergency Response Coordination",
            "Risk Level Monitoring"
        ]
