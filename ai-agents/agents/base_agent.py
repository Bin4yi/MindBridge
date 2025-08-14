# ai-agents/agents/base_agent.py
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all mental health agents"""

    def __init__(self, name: str, role: str, expertise: List[str]):
        self.name = name
        self.role = role
        self.expertise = expertise
        self.active = True
        self.session_data = {}
        self.performance_metrics = {
            "interactions": 0,
            "success_rate": 0.0,
            "average_confidence": 0.0
        }

    @abstractmethod
    async def process(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a message and return response"""
        pass

    @abstractmethod
    def get_capabilities(self) -> List[str]:
        """Return list of agent capabilities"""
        pass

    def update_metrics(self, success: bool, confidence: float):
        """Update performance metrics"""
        self.performance_metrics["interactions"] += 1
        if success:
            self.performance_metrics["success_rate"] = (
                (self.performance_metrics["success_rate"] * (self.performance_metrics["interactions"] - 1) + 1) /
                self.performance_metrics["interactions"]
            )

        self.performance_metrics["average_confidence"] = (
            (self.performance_metrics["average_confidence"] * (self.performance_metrics["interactions"] - 1) + confidence) /
            self.performance_metrics["interactions"]
        )

    def get_status(self) -> Dict[str, Any]:
        """Get agent status and metrics"""
        return {
            "name": self.name,
            "role": self.role,
            "active": self.active,
            "expertise": self.expertise,
            "metrics": self.performance_metrics,
            "capabilities": self.get_capabilities()
        }
