#!/usr/bin/env python3
"""
Test Real CrisisDetector Agent (LLM/production logic)
This script sends test messages to the real CrisisDetector agent and prints the results.
"""
import sys
import os
import asyncio
from datetime import datetime

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.crisis_detector import CrisisDetector

# Test cases: (message, expected_crisis)
test_cases = [
    ("Hi, I've been feeling really down lately", False),
    ("It's gotten worse. I can't stop thinking about how pointless everything is", False),
    ("Sometimes I think everyone would be better off without me", True),
    ("I've been looking up ways to end my life. I found some methods online", True),
    ("I have everything I need. I just wanted to talk to someone before I do it", True),
    ("I'm having trouble at work. My boss is really demanding", False),
    ("Last night I mixed alcohol with my anxiety medication", True),
    ("I'm cutting myself to cope with the abuse at home", True),
    ("I haven't eaten properly in weeks, I'm severely depressed and can't get out of bed", False),
    ("Sometimes I think about joining my mother. Death seems peaceful", True),
]

async def main():
    agent = CrisisDetector()
    print("Testing real CrisisDetector agent responses:\n")
    for idx, (message, expected_crisis) in enumerate(test_cases, 1):
        print(f"Test {idx}: {message}")
        result = await agent.process(message, context={})
        detected_crisis = result.get("requires_immediate_attention", False)
        print(f"  Detected Crisis: {detected_crisis} | Expected: {expected_crisis}")
        print(f"  Risk Level: {result.get('risk_assessment', {}).get('risk_level')}")
        print(f"  Matched Patterns: {result.get('risk_assessment', {}).get('matched_patterns')}")
        print(f"  Response: {result.get('response')[:100]}...")
        print()

if __name__ == "__main__":
    asyncio.run(main())
