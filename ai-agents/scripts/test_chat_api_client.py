"""
Client script to test the /chat endpoint provided by the direct_agent_server.py
"""
import sys
import os
import asyncio
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Make sure we can import from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import aiohttp, which is needed for making async HTTP requests
try:
    import aiohttp
except ImportError:
    logger.error("aiohttp is not installed. Please install it with 'pip install aiohttp'")
    sys.exit(1)

async def test_chat_api():
    """Test the /chat endpoint of the direct_agent_server.py"""
    # Server URL - adjust port if needed
    SERVER_URL = "http://localhost:8001"
    CHAT_ENDPOINT = f"{SERVER_URL}/chat"
    
    # Session information
    session_id = f"test-api-session-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    session_history = []
    
    print("=" * 60)
    print("MindBridge /chat API Test Client")
    print("=" * 60)
    print(f"Testing /chat endpoint at {CHAT_ENDPOINT}")
    print(f"Session ID: {session_id}")
    print("Type 'exit' to quit.\n")
    
    # Check if server is running
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{SERVER_URL}/health") as response:
                if response.status == 200:
                    health_data = await response.json()
                    print(f"Server is running: {health_data['service']} - {health_data['status']}\n")
                else:
                    print(f"Server returned status {response.status}. Is the server running?")
                    return
    except Exception as e:
        print(f"Error connecting to server: {str(e)}")
        print("Please make sure the server is running with 'python scripts/direct_agent_server.py'")
        return
    
    # Start chat loop
    async with aiohttp.ClientSession() as session:
        while True:
            # Get user input
            user_input = input("You: ")
            if user_input.lower() == "exit":
                print("Goodbye!")
                break
            
            # Prepare request payload
            payload = {
                "session_id": session_id,
                "message": user_input,
                "session_history": session_history,
                "user_profile": {"user_id": "test-user"},
                "context": {"test": True}
            }
            
            # Make the request to the /chat endpoint
            try:
                print("\nSending request to /chat endpoint...")
                start_time = datetime.now()
                
                async with session.post(CHAT_ENDPOINT, json=payload) as response:
                    end_time = datetime.now()
                    request_time = (end_time - start_time).total_seconds()
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        # Update session history with the user message and response
                        session_history.append({"role": "user", "content": user_input})
                        session_history.append({"role": "assistant", "content": result["response"]})
                        
                        # Display the response
                        print(f"\nAI: {result['response']}\n")
                        
                        # Display processing information
                        print(f"Agent Type: {result['agent_type']}")
                        print(f"Risk Level: {result['risk_level']}/10")
                        print(f"API Response Time: {request_time:.2f}s")
                        print(f"Processing Time: {result['response_time']:.2f}s")
                        
                        # Display agent-specific information
                        if result['agent_type'] == "crisis_support" and result.get("immediate_actions"):
                            print("\nImmediate Actions:")
                            for action in result.get("immediate_actions", [])[:3]:
                                print(f"- {action}")
                            
                            if result.get("resources"):
                                print("\nResources:")
                                for resource in result.get("resources", [])[:2]:
                                    if isinstance(resource, dict):
                                        print(f"- {resource.get('name')}: {resource.get('contact')}")
                                    else:
                                        print(f"- {resource}")
                        
                        elif result['agent_type'] == "therapist":
                            print(f"\nTherapeutic Approach: {result.get('approach_used', 'general')}")
                            
                            if result.get("therapeutic_techniques"):
                                print("Techniques:")
                                for technique in result.get("therapeutic_techniques", [])[:3]:
                                    print(f"- {technique}")
                            
                            if result.get("follow_up_questions"):
                                print("\nFollow-up Questions:")
                                for question in result.get("follow_up_questions", [])[:2]:
                                    print(f"- {question}")
                        
                        print("\n" + "=" * 60)
                    else:
                        print(f"Error: Server returned status code {response.status}")
                        error_text = await response.text()
                        print(f"Error details: {error_text}")
                
            except Exception as e:
                print(f"Error making request: {str(e)}")
                print("Please make sure the server is running with 'python scripts/direct_agent_server.py'")

if __name__ == "__main__":
    asyncio.run(test_chat_api())
