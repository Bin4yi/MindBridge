import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

import asyncio
from crew.mental_health_crew import MentalHealthCrew

async def chat():
    crew = MentalHealthCrew()
    session_id = "test_chat_session"
    session_history = []
    print("Start chatting with the AI therapist. Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break
        # Add user message to history
        session_history.append({"role": "user", "content": user_input})
        # Get agent response
        result = await crew.process_message(
            user_input,
            session_id=session_id,
            session_history=session_history
        )
        print(f"AI: {result['response']}\n")
        # Add agent response to history
        session_history.append({"role": "ai", "content": result['response']})

if __name__ == "__main__":
    asyncio.run(chat())