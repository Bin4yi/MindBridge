# ai-agents/tools/recommendation_tool.py
class RecommendationTool(BaseTool):
    name: str = "Therapeutic Recommendation Tool"
    description: str = "Suggests evidence-based coping strategies and interventions"
    
    def _run(self, emotional_state: str, risk_level: int, user_profile: Dict = None) -> Dict:
        """Generate personalized recommendations"""
        
        if user_profile is None:
            user_profile = {}
        
        # Evidence-based interventions by emotional state
        interventions = {
            "depressed": {
                "immediate": [
                    "Practice gentle self-compassion and speak to yourself as you would a good friend",
                    "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
                    "Take a brief walk outside if possible, even 5 minutes can help",
                    "Reach out to one trusted person in your support network"
                ],
                "ongoing": [
                    "Consider cognitive behavioral therapy techniques to challenge negative thought patterns",
                    "Establish a daily routine with small, achievable goals",
                    "Practice mindfulness meditation for 10 minutes daily",
                    "Engage in pleasurable activities, even if they don't feel enjoyable right now"
                ]
            },
            "anxious": {
                "immediate": [
                    "Practice box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4",
                    "Use progressive muscle relaxation: tense and release each muscle group",
                    "Try the STOP technique: Stop, Take a breath, Observe your thoughts and feelings, Proceed mindfully",
                    "Ground yourself by focusing on your physical senses"
                ],
                "ongoing": [
                    "Challenge anxious thoughts with evidence-based questioning",
                    "Limit caffeine and practice good sleep hygiene",
                    "Regular exercise, especially yoga or tai chi",
                    "Practice exposure therapy gradually for specific fears"
                ]
            },
            "angry": {
                "immediate": [
                    "Take slow, deep breaths to activate your parasympathetic nervous system",
                    "Step away from the trigger situation if possible",
                    "Try progressive muscle relaxation to release physical tension",
                    "Use 'I' statements to express your feelings constructively"
                ],
                "ongoing": [
                    "Practice anger management techniques like time-outs",
                    "Identify underlying emotions beneath the anger",
                    "Regular physical exercise to release built-up tension",
                    "Learn assertiveness skills to communicate needs effectively"
                ]
            }
        }
        
        # Crisis-specific recommendations
        crisis_recommendations = [
            "Remove any means of self-harm from your environment",
            "Stay in a safe, populated area",
            "Contact emergency services: 988 (Suicide & Crisis Lifeline)",
            "Reach out to a trusted friend, family member, or mental health professional immediately"
        ]
        
        # Get recommendations for the emotional state
        state_interventions = interventions.get(emotional_state, interventions["depressed"])
        
        # Customize based on risk level
        if risk_level >= 8:
            recommendations = crisis_recommendations
            resources = [
                "988 Suicide & Crisis Lifeline (call or text)",
                "Crisis Text Line: Text HOME to 741741",
                "National Domestic Violence Hotline: 1-800-799-7233",
                "Emergency Services: 911"
            ]
        else:
            recommendations = state_interventions["immediate"] + state_interventions["ongoing"][:2]
            resources = [
                "Psychology Today therapist finder",
                "Headspace or Calm apps for meditation",
                "Crisis Text Line for ongoing support",
                "NAMI (National Alliance on Mental Illness) resources"
            ]
        
        return {
            "immediate_strategies": recommendations[:4],
            "ongoing_interventions": state_interventions.get("ongoing", [])[:3],
            "recommended_resources": resources,
            "self_care_activities": [
                "Maintain regular sleep schedule",
                "Practice daily gratitude journaling",
                "Engage in creative expression",
                "Connect with nature when possible"
            ],
            "follow_up_goals": self._generate_goals(emotional_state, user_profile)
        }
    
    def _generate_goals(self, emotional_state: str, user_profile: Dict) -> List[str]:
        """Generate personalized therapeutic goals"""
        base_goals = {
            "depressed": [
                "Increase daily pleasant activities",
                "Challenge negative thought patterns",
                "Build social connections"
            ],
            "anxious": [
                "Develop anxiety management skills",
                "Practice exposure exercises gradually",
                "Build confidence in coping abilities"
            ],
            "angry": [
                "Learn healthy anger expression",
                "Identify anger triggers",
                "Practice stress management"
            ]
        }
        
        return base_goals.get(emotional_state, base_goals["depressed"])
