# ai-agents/test_backend_connection.py
import requests
import json
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Configuration
BACKEND_URL = "http://localhost:8001"
AGENT_URL = "http://localhost:8000"
TEST_MESSAGE = "I've been feeling very sad lately and I don't know what to do."

def check_agent_health():
    """Check if the agent service is running"""
    try:
        response = requests.get(f"{AGENT_URL}/health")
        if response.status_code == 200:
            logging.info(f"Agent health check passed: {response.json()}")
            return True
        else:
            logging.error(f"Agent health check failed: {response.status_code}")
            return False
    except Exception as e:
        logging.error(f"Agent health check error: {str(e)}")
        return False

def check_backend_health():
    """Check if the backend service is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        if response.status_code == 200:
            logging.info(f"Backend health check passed: {response.json()}")
            return True
        else:
            logging.error(f"Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        logging.error(f"Backend health check error: {str(e)}")
        return False

def test_agent_directly():
    """Test the agent service directly"""
    try:
        data = {
            "session_id": "test-session",
            "message": TEST_MESSAGE,
            "user_id": "test-user",
            "agent_type": "therapist"
        }
        
        response = requests.post(f"{AGENT_URL}/chat", json=data)
        if response.status_code == 200:
            result = response.json()
            logging.info("Agent direct test passed")
            logging.info(f"Response: {json.dumps(result, indent=2)}")
            return True
        else:
            logging.error(f"Agent direct test failed: {response.status_code}")
            logging.error(f"Error: {response.text}")
            return False
    except Exception as e:
        logging.error(f"Agent direct test error: {str(e)}")
        return False

def main():
    """Run connection tests"""
    logging.info("Starting backend connection tests...")
    
    # Check if OpenAI API key is set
    if not os.environ.get("OPENAI_API_KEY"):
        logging.warning("OPENAI_API_KEY not set in environment")
        
    # Check both services
    agent_ok = check_agent_health()
    backend_ok = check_backend_health()
    
    if agent_ok and backend_ok:
        logging.info("Both services are running. Testing direct agent communication...")
        agent_test = test_agent_directly()
        
        if agent_test:
            logging.info("All tests passed! The backend should be able to communicate with the agent.")
        else:
            logging.error("Agent direct test failed.")
    else:
        logging.error("One or more services are not running.")

if __name__ == "__main__":
    main()
