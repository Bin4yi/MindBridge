#!/usr/bin/env python3
"""Minimal test to check agent creation"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("Testing minimal agent creation...")
print(f"OPENAI_API_KEY loaded: {'OPENAI_API_KEY' in os.environ}")

try:
    from crewai import Agent
    from langchain_openai import ChatOpenAI
    
    print("✓ Imports successful")
    
    # Create LLM explicitly
    llm = ChatOpenAI(
        model="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=os.environ.get('OPENAI_API_KEY')
    )
    print("✓ LLM created")
    
    # Create a simple agent
    agent = Agent(
        role="Test Agent",
        goal="Test goal",
        backstory="Test backstory",
        verbose=False,
        llm=llm
    )
    print("✓ Agent created successfully!")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("Test completed.")
