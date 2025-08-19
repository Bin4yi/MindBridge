"""
Test script for the /chat endpoint using the pure agent implementations directly
"""
import sys
import os
import asyncio
import json
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ensure we can import from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import dotenv for loading environment variables
from dotenv import load_dotenv
load_dotenv()

# Import the actual agent implementations directly
from agents.crisis_detector import CrisisDetector
from agents.therapist_agent import TherapistAgent

class ChatEndpoint:
    """Class that simulates a /chat endpoint using direct agent implementations"""
    
    def __init__(self):
        # Initialize the agents
        self.crisis_agent = CrisisDetector()
        self.therapist_agent = TherapistAgent()
        self.session_data = {}
    
    async def chat(self, session_id: str, message: str, user_profile: dict = None):
        """Process a chat message through the pure agent implementations"""
        if not user_profile:
            user_profile = {}
            
        # Get or create session history
        if session_id not in self.session_data:
            self.session_data[session_id] = []
        
        session_history = self.session_data[session_id]
        
        # Add user message to history
        session_history.append({"role": "user", "content": message})
        
        # Prepare context
        context = {
            "session_id": session_id,
            "user_id": user_profile.get("user_id", "unknown"),
            "session_history": session_history,
            "timestamp": datetime.now().isoformat()
        }
        
        # Process with crisis detector first for risk assessment
        risk_assessment = self.crisis_agent._assess_crisis_level(message)
        risk_level = risk_assessment["risk_level"]
        requires_attention = risk_level >= 7
        
        # Add assessment to context
        context["assessment"] = risk_assessment
        context["requires_attention"] = requires_attention
        
        # Process with appropriate agent based on risk level
        start_time = datetime.now()
        
        if requires_attention:
            logger.info(f"Risk level: {risk_level}/10 - Processing with Crisis Intervention Specialist")
            result = await self.crisis_agent.process(message, context)
            agent_type = "crisis_support"
        else:
            logger.info(f"Risk level: {risk_level}/10 - Processing with Therapist")
            result = await self.therapist_agent.process(message, context)
            agent_type = "therapist"
        
        # Calculate response time
        end_time = datetime.now()
        response_time = (end_time - start_time).total_seconds()
        logger.info(f"Response generated in {response_time:.2f}s")
        
        # Add response to session history
        session_history.append({"role": "assistant", "content": result["response"]})
        
        # Prepare response payload
        response_data = {
            "status": "success",
            "session_id": session_id,
            "agent_type": agent_type,
            "risk_level": risk_level,
            "response": result["response"],
            "response_time": response_time,
            "timestamp": datetime.now().isoformat()
        }
        
        # Add additional data based on agent type
        if agent_type == "crisis_support":
            response_data["requires_immediate_attention"] = result.get("requires_immediate_attention", False)
            response_data["immediate_actions"] = result.get("immediate_actions", [])
            response_data["resources"] = result.get("resources", [])
        elif agent_type == "therapist":
            response_data["approach_used"] = result.get("approach_used", "general")
            response_data["therapeutic_techniques"] = result.get("therapeutic_techniques", [])
            response_data["follow_up_questions"] = result.get("follow_up_questions", [])
        
        return response_data

async def test_chat_endpoint():
    """Test the chat endpoint with direct agent implementation"""
    chat_endpoint = ChatEndpoint()
    session_id = "test-direct-endpoint"
    
    print("=" * 60)
    print("MindBridge /chat Endpoint Test")
    print("=" * 60)
    print("This simulates the /chat endpoint with ACTUAL AGENT IMPLEMENTATIONS")
    print(f"Session ID: {session_id}")
    print("Type 'exit' to quit.\n")
    
    while True:
        # Get user input
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        
        # Process with chat endpoint
        try:
            print("\nProcessing message with /chat endpoint...")
            response = await chat_endpoint.chat(session_id, user_input)
            
            # Display response
            print(f"\nAI: {response['response']}\n")
            
            # Display additional information
            print(f"Agent Type: {response['agent_type']}")
            print(f"Risk Level: {response['risk_level']}/10")
            print(f"Response Time: {response['response_time']:.2f}s")
            
            # Display agent-specific information
            if response['agent_type'] == "crisis_support" and response.get("immediate_actions"):
                print("\nImmediate Actions:")
                for action in response.get("immediate_actions", [])[:3]:
                    print(f"- {action}")
                
                if response.get("resources"):
                    print("\nResources:")
                    for resource in response.get("resources", [])[:2]:
                        if isinstance(resource, dict):
                            print(f"- {resource.get('name')}: {resource.get('contact')}")
                        else:
                            print(f"- {resource}")
            
            elif response['agent_type'] == "therapist":
                print(f"\nTherapeutic Approach: {response.get('approach_used', 'general')}")
                
                if response.get("therapeutic_techniques"):
                    print("Techniques:")
                    for technique in response.get("therapeutic_techniques", [])[:3]:
                        print(f"- {technique}")
                
                if response.get("follow_up_questions"):
                    print("\nFollow-up Questions:")
                    for question in response.get("follow_up_questions", [])[:2]:
                        print(f"- {question}")
            
            print("\n" + "=" * 60)
            
        except Exception as e:
            print(f"Error processing message: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_chat_endpoint())
