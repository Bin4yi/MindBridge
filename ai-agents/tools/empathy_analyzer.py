# ai-agents/tools/empathy_analyzer.py
class EmpathyAnalyzerTool(BaseTool):
    name: str = "Empathy Analyzer Tool"
    description: str = "Generates empathetic responses and emotional validation"
    
    def _run(self, message: str, emotional_state: str) -> Dict:
        """Generate empathetic understanding"""
        
        empathy_templates = {
            "sad": [
                "I can hear the sadness in your words, and I want you to know that what you're feeling is completely valid.",
                "It sounds like you're carrying a heavy emotional burden right now.",
                "The pain you're describing sounds really difficult to bear."
            ],
            "anxious": [
                "I can sense the anxiety you're experiencing, and that must feel overwhelming.",
                "It sounds like your mind is racing with worries right now.",
                "Anxiety can make everything feel so much more intense and scary."
            ],
            "angry": [
                "I can hear the frustration and anger in what you're sharing.",
                "It sounds like something has really upset you, and those feelings are valid.",
                "Anger often tells us that something important to us has been threatened or hurt."
            ],
            "hopeless": [
                "I hear how hopeless things feel right now, and that must be incredibly painful.",
                "When we're in that dark place, it can feel like there's no way forward.",
                "Hopelessness can make it hard to see any light, but you're not alone in this darkness."
            ]
        }
        
        # Select appropriate empathy response
        templates = empathy_templates.get(emotional_state, empathy_templates["sad"])
        empathy_response = templates[0]  # Could randomize or select based on context
        
        # Generate validation statements
        validation_phrases = [
            "Your feelings are completely valid and understandable.",
            "It makes sense that you would feel this way given what you're going through.",
            "You're not alone in experiencing these emotions.",
            "Thank you for trusting me with these difficult feelings."
        ]
        
        return {
            "empathy_response": empathy_response,
            "validation_statements": validation_phrases,
            "emotional_reflection": f"It sounds like you're feeling {emotional_state} and that's weighing heavily on you.",
            "connection_building": "I'm here with you in this moment, and I want to understand your experience better."
        }
