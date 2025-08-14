#!/usr/bin/env python3
"""Test script to check available crewai imports"""

print("Testing crewai imports...")

try:
    from crewai.tools import BaseTool
    print("✓ BaseTool available")
except ImportError as e:
    print(f"✗ BaseTool not available: {e}")

try:
    from crewai import tool
    print("✓ @tool decorator available")
except ImportError as e:
    print(f"✗ @tool decorator not available: {e}")

try:
    from langchain.tools import BaseTool as LangChainBaseTool
    print("✓ LangChain BaseTool available")
except ImportError as e:
    print(f"✗ LangChain BaseTool not available: {e}")

try:
    from pydantic import BaseModel
    print("✓ BaseModel available")
except ImportError as e:
    print(f"✗ BaseModel not available: {e}")

try:
    import crewai
    print(f"✓ CrewAI version: {getattr(crewai, '__version__', 'unknown')}")
    print(f"✓ CrewAI attributes: {[attr for attr in dir(crewai) if not attr.startswith('_')]}")
except Exception as e:
    print(f"✗ Error checking crewai: {e}")

try:
    import crewai.tools
    print(f"✓ crewai.tools attributes: {[attr for attr in dir(crewai.tools) if not attr.startswith('_')]}")
except Exception as e:
    print(f"✗ Error checking crewai.tools: {e}")
