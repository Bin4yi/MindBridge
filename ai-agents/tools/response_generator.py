# ai-agents/tools/response_generator.py  
class ResponseGeneratorTool(BaseTool):
    name: str = "Therapeutic Response Generator"
    description: str = "Generates evidence-based therapeutic responses using various modalities"
    
    def _run(self, message: str, emotional_state: str, crisis_level: int, therapy_approach: str = "integrative") -> Dict:
        """Generate therapeutic response based on multiple factors"""
        
        # Select therapeutic approach based on emotional state and context
        if crisis_level >= 8:
            approach = "crisis_intervention"
        elif emotional_state in ["anxious", "panic"]:
            approach = "cognitive_behavioral"
        elif emotional_state in ["depressed", "hopeless"]:
            approach = "person_centered"
        else:
            approach = therapy_approach
        
        # Generate response based on approach
        response_data = self._generate_by_approach(message, emotional_state, approach)
        
        return {
            "therapeutic_response": response_data["response"],
            "approach_used": approach,
            "therapeutic_techniques": response_data["techniques"],
            "follow_up_questions": response_data["follow_ups"],
            "tone": response_data["tone"]
        }
    
    def _generate_by_approach(self, message: str, emotional_state: str, approach: str) -> Dict:
        """Generate response based on specific therapeutic approach"""
        
        approaches = {
            "crisis_intervention": {
                "response": self._crisis_response(),
                "techniques": ["Safety planning", "Resource connection", "Active listening"],
                "follow_ups": [
                    "Can you tell me if you're in a safe place right now?",
                    "Do you have someone you can call for support?",
                    "Would you be willing to contact one of these crisis resources?"
                ],
                "tone": "urgent_caring"
            },
            
            "cognitive_behavioral": {
                "response": f"I notice you're experiencing {emotional_state} feelings. Sometimes our thoughts can intensify these emotions. Let's explore what thoughts might be contributing to how you're feeling right now.",
                "techniques": ["Thought challenging", "Cognitive restructuring", "Behavioral activation"],
                "follow_ups": [
                    "What thoughts are going through your mind right now?",
                    "How would you rate the intensity of this feeling on a scale of 1-10?",
                    "What evidence do you have for and against this thought?"
                ],
                "tone": "collaborative_questioning"
            },
            
            "person_centered": {
                "response": f"I can really hear the {emotional_state} in what you're sharing with me. It sounds like this is a difficult experience for you, and I want you to know that I'm here to listen without judgment.",
                "techniques": ["Unconditional positive regard", "Empathetic reflection", "Active listening"],
                "follow_ups": [
                    "How does it feel to put these feelings into words?",
                    "What would it mean to you to feel understood right now?",
                    "What else would you like me to know about your experience?"
                ],
                "tone": "warm_accepting"
            },
            
            "mindfulness_based": {
                "response": f"I notice you're experiencing {emotional_state}. Right now, let's take a moment to simply acknowledge these feelings without trying to change them. Can we explore what this feels like in your body?",
                "techniques": ["Mindful awareness", "Present moment focus", "Body scan"],
                "follow_ups": [
                    "What do you notice happening in your body right now?",
                    "Can you describe this feeling without judging it as good or bad?",
                    "What happens when you just observe this emotion with curiosity?"
                ],
                "tone": "gentle_present"
            }
        }
        
        return approaches.get(approach, approaches["person_centered"])
    
    def _crisis_response(self) -> str:
        """Generate crisis intervention response"""
        return """I'm very concerned about your safety right now. Your life has value, and you don't have to face this alone.

**Immediate Support Available:**
• 988 Suicide & Crisis Lifeline - Call or text 988 (24/7)
• Crisis Text Line - Text HOME to 741741
• Emergency Services - Call 911 if in immediate danger

Can you tell me if you're in a safe place right now? I want to help you connect with immediate support."""