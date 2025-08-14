#!/usr/bin/env python3
"""
Test Real MentalHealthCrew Multi-Agent System (LLM/production logic)
This script sends test messages to the real MentalHealthCrew and prints which agent responds for each scenario.
"""
import sys
import os
import asyncio
from datetime import datetime
from dotenv import load_dotenv

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


load_dotenv()

from crew.mental_health_crew import MentalHealthCrew

# Test cases: (message, expected_agent_type)
test_cases = [
    ("Hi, I've been feeling really down lately", "therapist")
]

async def main():
    crew = MentalHealthCrew()
    print("Testing real MentalHealthCrew agent selection and response:\n")
    for idx, (message, expected_agent) in enumerate(test_cases, 1):
        print(f"Test {idx}: {message}")
        result = await crew.process_message(message, session_id=f"test_{idx}")
        agent_type = result.get("agentType", "unknown")
        print(f"  Agent Responded: {agent_type} | Expected: {expected_agent}")
        print(f"  Crisis: {result.get('requiresImmediateAttention', False)}")
        print(f"  Emotion: {result.get('emotionalState', '')}")
        print(f"  Response: {result.get('response')[:100]}...")
        print()

if __name__ == "__main__":
    asyncio.run(main())
