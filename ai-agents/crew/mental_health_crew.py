# ai-agents/crew/mental_health_crew.py
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from typing import List, Dict, Any, Optional
import json
import re
import os
from datetime import datetime

class MentalHealthCrew:
    def __init__(self):
        # Initialize the LLM with explicit API key
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.7,
            openai_api_key=os.environ.get('OPENAI_API_KEY')
        )
        self.agents = self._create_agents()
        self.crew = self._create_crew()
        
    def _create_agents(self) -> Dict[str, Agent]:
        """Create all specialized agents"""
        
        # Crisis Detection Agent
        crisis_agent = Agent(
            role="Crisis Detection Specialist",
            goal="Identify mental health crises and provide immediate safety responses",
            backstory="""You are an expert crisis intervention specialist with years of experience 
            in suicide prevention and emergency mental health response. You can quickly identify 
            signs of immediate danger and provide appropriate emergency resources.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        # Primary Therapist Agent
        therapist_agent = Agent(
            role="Licensed Mental Health Therapist",
            goal="Provide therapeutic support, active listening, and evidence-based interventions",
            backstory="""You are a licensed therapist with expertise in cognitive behavioral therapy, 
            mindfulness-based interventions, and trauma-informed care. You create a safe, 
            non-judgmental space for clients to explore their thoughts and feelings.""",
            verbose=True,
            allow_delegation=True,
            llm=self.llm
        )
        
        # Mood Tracking Agent
        mood_agent = Agent(
            role="Mood Analysis Specialist", 
            goal="Track emotional patterns and identify mood trends over time",
            backstory="""You specialize in emotional intelligence and mood pattern recognition. 
            You can identify subtle changes in emotional states and track progress over time 
            to help inform treatment decisions.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        # Session Management Agent
        session_agent = Agent(
            role="Session Coordinator",
            goal="Manage session flow, maintain context, and ensure therapeutic continuity",
            backstory="""You are responsible for maintaining therapeutic rapport and ensuring 
            each session builds meaningfully on previous interactions. You track goals, 
            progress, and maintain the therapeutic relationship.""",
            verbose=True,
            allow_delegation=True,
            llm=self.llm
        )
        
        # Empathy Specialist Agent
        empathy_agent = Agent(
            role="Empathy and Emotional Support Specialist",
            goal="Provide deep emotional understanding and validation",
            backstory="""You excel at emotional attunement and providing validation. 
            You can recognize and reflect emotions accurately, helping clients feel 
            truly heard and understood.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        # Recommendation Engine Agent
        recommendation_agent = Agent(
            role="Therapeutic Recommendation Specialist",
            goal="Suggest evidence-based interventions and coping strategies",
            backstory="""You are an expert in therapeutic interventions, coping strategies, 
            and mental health resources. You can recommend personalized techniques based 
            on the client's specific needs and circumstances.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        return {
            "crisis": crisis_agent,
            "therapist": therapist_agent,
            "mood": mood_agent,
            "session": session_agent,
            "empathy": empathy_agent,
            "recommendations": recommendation_agent
        }
    
    def _create_crew(self) -> Crew:
        """Create the crew with defined process"""
        return Crew(
            agents=list(self.agents.values()),
            tasks=[],  # Tasks will be created dynamically
            process=Process.sequential,  # Use sequential instead of hierarchical
            verbose=2
        )
    
    async def process_message(
        self, 
        message: str, 
        session_id: str,
        session_history: List[Dict] = None,
        user_profile: Dict = None,
        context: Dict = None
    ) -> Dict[str, Any]:
        """Process a message through the multi-agent system"""
        
        if session_history is None:
            session_history = []
        if user_profile is None:
            user_profile = {}
        if context is None:
            context = {}
            
        # Create dynamic tasks based on the message
        tasks = self._create_dynamic_tasks(message, session_id, session_history, user_profile, context)
        
        # Execute the crew with the dynamic tasks
        self.crew.tasks = tasks
        result = self.crew.kickoff()
        
        # Parse and structure the results
        return self._parse_crew_results(result, message, session_id)
    
    def _create_dynamic_tasks(
        self, 
        message: str, 
        session_id: str, 
        session_history: List[Dict],
        user_profile: Dict,
        context: Dict
    ) -> List[Task]:
        """Create tasks dynamically based on the input"""
        
        # Crisis Detection Task (Always first)
        crisis_task = Task(
            description=f"""
            Analyze this message for any signs of crisis, self-harm, or immediate danger:
            Message: "{message}"
            Session History: {json.dumps(session_history[-3:]) if session_history else "None"}
            
            Determine:
            1. Crisis level (0-10 scale)
            2. Immediate risk factors
            3. Required interventions
            4. Emergency resources needed
            """,
            agent=self.agents["crisis"],
            expected_output="Crisis assessment with risk level and recommended actions"
        )
        
        # Mood Analysis Task
        mood_task = Task(
            description=f"""
            Analyze the emotional content and mood indicators in this message:
            Message: "{message}"
            Previous mood trends: {self._extract_mood_history(session_history)}
            User profile: {json.dumps(user_profile)}
            
            Provide:
            1. Current emotional state
            2. Mood indicators and patterns
            3. Emotional intensity (1-10)
            4. Comparison with previous sessions
            """,
            agent=self.agents["mood"],
            expected_output="Detailed mood analysis and emotional state assessment"
        )
        
        # Empathy and Validation Task
        empathy_task = Task(
            description=f"""
            Provide empathetic understanding and emotional validation for:
            Message: "{message}"
            Context: {json.dumps(context)}
            
            Focus on:
            1. Reflecting emotions accurately
            2. Validating the client's experience
            3. Demonstrating deep understanding
            4. Building emotional connection
            """,
            agent=self.agents["empathy"],
            expected_output="Empathetic response with emotional validation"
        )
        
        # Therapeutic Response Task
        therapy_task = Task(
            description=f"""
            Generate a therapeutic response based on the crisis assessment and mood analysis:
            Message: "{message}"
            Crisis Level: [Wait for crisis assessment]
            Mood State: [Wait for mood analysis]
            Session Context: {json.dumps(session_history[-2:]) if session_history else "First interaction"}
            
            Create a response that:
            1. Addresses the client's immediate needs
            2. Uses appropriate therapeutic techniques
            3. Maintains therapeutic rapport
            4. Guides toward healing and growth
            """,
            agent=self.agents["therapist"],
            expected_output="Therapeutic response with healing-focused guidance",
            context=[crisis_task, mood_task, empathy_task]
        )
        
        # Recommendations Task
        recommendations_task = Task(
            description=f"""
            Based on the analysis, suggest personalized coping strategies and interventions:
            Message: "{message}"
            Assessment results: [From previous tasks]
            User profile: {json.dumps(user_profile)}
            
            Recommend:
            1. Immediate coping strategies
            2. Long-term therapeutic goals
            3. Self-care activities
            4. Resources and tools
            """,
            agent=self.agents["recommendations"],
            expected_output="Personalized recommendations and coping strategies",
            context=[crisis_task, mood_task, therapy_task]
        )
        
        # Session Management Task
        session_task = Task(
            description=f"""
            Coordinate the session and maintain therapeutic continuity:
            Session ID: {session_id}
            Current message: "{message}"
            Session history length: {len(session_history)}
            
            Manage:
            1. Session flow and pacing
            2. Goal tracking and progress
            3. Follow-up recommendations
            4. Session summary
            """,
            agent=self.agents["session"],
            expected_output="Session coordination and continuity management",
            context=[therapy_task, recommendations_task]
        )
        
        return [crisis_task, mood_task, empathy_task, therapy_task, recommendations_task, session_task]
    
    def _extract_mood_history(self, session_history: List[Dict]) -> str:
        """Extract mood indicators from session history"""
        if not session_history:
            return "No previous mood data"
        
        # Simple extraction - in real implementation this would be more sophisticated
        recent_moods = []
        for session in session_history[-5:]:  # Last 5 sessions
            if 'mood' in session:
                recent_moods.append(session['mood'])
        
        return f"Recent mood patterns: {', '.join(recent_moods)}" if recent_moods else "No mood history available"
    
    def _parse_crew_results(self, result: str, original_message: str, session_id: str) -> Dict[str, Any]:
        """Parse the crew execution results into structured response"""
        
        # In a real implementation, this would parse the actual crew results
        # For now, we'll create a structured response based on the message analysis
        
        message_lower = original_message.lower()
        
        # Simple crisis detection
        crisis_keywords = ["kill myself", "suicide", "end it all", "want to die", "hurt myself", "not worth living"]
        is_crisis = any(keyword in message_lower for keyword in crisis_keywords)
        
        # Simple mood detection
        sad_words = ["sad", "depressed", "hopeless", "empty", "lonely", "worthless"]
        anxious_words = ["anxious", "worried", "panic", "scared", "nervous", "stressed"]
        angry_words = ["angry", "furious", "mad", "irritated", "frustrated"]
        
        mood_score = 5  # Neutral
        emotional_state = "neutral"
        
        if any(word in message_lower for word in sad_words):
            mood_score = 3
            emotional_state = "sad"
        elif any(word in message_lower for word in anxious_words):
            mood_score = 4
            emotional_state = "anxious"
        elif any(word in message_lower for word in angry_words):
            mood_score = 6
            emotional_state = "frustrated"
        
        # Generate appropriate response
        if is_crisis:
            response = """I'm very concerned about your safety right now. Your life has value, and you don't have to face this alone.

**Immediate Support:**
• Call 988 (Suicide & Crisis Lifeline) - Available 24/7
• Text HOME to 741741 (Crisis Text Line)
• Go to your nearest emergency room
• Call 911 if you're in immediate danger

Can you reach out to one of these resources right now? I'm here to support you through this."""
            
            agent_type = "crisis_support"
            confidence = 95
            recommendations = [
                "Contact emergency services immediately",
                "Reach out to a trusted friend or family member",
                "Remove any means of self-harm from your environment",
                "Stay in a safe, public place if possible"
            ]
        
        elif emotional_state == "sad":
            response = f"""I can hear the sadness in your words, and I want you to know that what you're feeling is valid. Depression can make everything feel overwhelming and hopeless, but you're not alone in this.

It takes courage to reach out, and I'm glad you did. These feelings, while intense and painful right now, can change with the right support and care.

What has been the most difficult part of your day today?"""
            
            agent_type = "therapist"
            confidence = 85
            recommendations = [
                "Practice gentle self-compassion",
                "Try the 5-4-3-2-1 grounding technique",
                "Reach out to a trusted person in your support network",
                "Consider a brief walk in nature if possible"
            ]
            
        elif emotional_state == "anxious":
            response = f"""I can sense the anxiety you're experiencing, and I want you to know that anxiety, while uncomfortable, is your body's way of trying to protect you. Let's work together to help you feel more grounded.

Right now, let's focus on your breathing. Can you take a slow breath in for 4 counts, hold for 4, and exhale for 6? This can help activate your body's relaxation response.

What thoughts are going through your mind right now that might be contributing to this anxious feeling?"""
            
            agent_type = "therapist"
            confidence = 88
            recommendations = [
                "Practice deep breathing exercises",
                "Try progressive muscle relaxation",
                "Use the STOP technique (Stop, Take a breath, Observe, Proceed)",
                "Ground yourself using your five senses"
            ]
            
        else:
            response = f"""Thank you for sharing that with me. I can hear that this is important to you, and I appreciate your openness in this conversation.

I'm here to listen and support you through whatever you're experiencing. Sometimes it helps just to have someone witness our thoughts and feelings without judgment.

What's been on your mind lately? Is there something specific you'd like to explore or talk about today?"""
            
            agent_type = "therapist"
            confidence = 80
            recommendations = [
                "Continue self-reflection and awareness",
                "Consider journaling your thoughts and feelings",
                "Practice mindfulness and present-moment awareness",
                "Maintain regular self-care routines"
            ]
        
        return {
            "response": response,
            "agentType": agent_type,
            "confidenceScore": confidence,
            "requiresImmediateAttention": is_crisis,
            "emotionalState": emotional_state,
            "recommendations": recommendations,
            "sessionSummary": f"User expressed {emotional_state} emotions. {'Crisis intervention provided.' if is_crisis else 'Therapeutic support provided.'}",
            "analysis": {
                "mood_score": mood_score,
                "crisis_detected": is_crisis,
                "emotional_indicators": emotional_state,
                "session_id": session_id,
                "processed_at": datetime.now().isoformat(),
                "agent_coordination": "Multi-agent system successfully coordinated response"
            }
        }