#!/usr/bin/env python3
"""Simple test script to check crewai functionality"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("Testing environment variables...")
print(f"OPENAI_API_KEY exists: {'OPENAI_API_KEY' in os.environ}")
print(f"API key starts with: {os.environ.get('OPENAI_API_KEY', '')[:10]}...")

print("\nTesting crewai imports...")
try:
    from crewai import Agent
    print("✓ Agent imported successfully")
    
    # Try creating a simple agent
    print("Creating simple agent...")
    agent = Agent(
        role="Test Agent",
        goal="Test goal",
        backstory="Test backstory",
        verbose=False
    )
    print("✓ Agent created successfully")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\nTesting completed.")
