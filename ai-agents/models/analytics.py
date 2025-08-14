"""
Analytics engine for mental health AI system
"""
import json
import psutil
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict, deque
from dataclasses import dataclass
import asyncio

@dataclass
class InteractionMetrics:
    """Metrics for a single interaction"""
    timestamp: datetime
    session_id: str
    user_message_length: int
    agent_response_length: int
    response_time_ms: float
    emotional_state: str
    confidence_score: int
    crisis_level: int
    agent_type: str

class AnalyticsEngine:
    """Comprehensive analytics for the mental health AI system"""
    
    def __init__(self):
        self.interaction_history: deque = deque(maxlen=10000)  # Keep last 10k interactions
        self.session_analytics: Dict[str, Dict] = {}
        self.system_metrics: Dict[str, Any] = {
            "total_interactions": 0,
            "crisis_interventions": 0,
            "average_session_duration": 0,
            "emotional_state_distribution": defaultdict(int),
            "agent_usage_stats": defaultdict(int)
        }
        
    def track_interaction(
        self,
        session_id: str,
        user_message: str,
        agent_response: str,
        analysis: Dict[str, Any],
        response_time_ms: float = 0
    ):
        """Track a single user-agent interaction"""
        
        # Create interaction metrics
        interaction = InteractionMetrics(
            timestamp=datetime.now(),
            session_id=session_id,
            user_message_length=len(user_message),
            agent_response_length=len(agent_response),
            response_time_ms=response_time_ms,
            emotional_state=analysis.get('emotional_state', 'neutral'),
            confidence_score=analysis.get('confidence_score', 80),
            crisis_level=analysis.get('crisis_level', 0),
            agent_type=analysis.get('agent_type', 'therapist')
        )
        
        # Add to history
        self.interaction_history.append(interaction)
        
        # Update system metrics
        self._update_system_metrics(interaction)
        
        # Update session-specific analytics
        self._update_session_analytics(session_id, interaction, user_message, agent_response)
    
    def _update_system_metrics(self, interaction: InteractionMetrics):
        """Update global system metrics"""
        self.system_metrics["total_interactions"] += 1
        
        if interaction.crisis_level >= 8:
            self.system_metrics["crisis_interventions"] += 1
        
        self.system_metrics["emotional_state_distribution"][interaction.emotional_state] += 1
        self.system_metrics["agent_usage_stats"][interaction.agent_type] += 1
    
    def _update_session_analytics(
        self, 
        session_id: str, 
        interaction: InteractionMetrics,
        user_message: str,
        agent_response: str
    ):
        """Update session-specific analytics"""
        
        if session_id not in self.session_analytics:
            self.session_analytics[session_id] = {
                "start_time": interaction.timestamp,
                "last_interaction": interaction.timestamp,
                "interaction_count": 0,
                "emotional_journey": [],
                "crisis_events": [],
                "agent_interactions": defaultdict(int),
                "average_confidence": 0,
                "total_response_time": 0,
                "user_engagement_score": 0,
                "therapeutic_themes": [],
                "progress_indicators": []
            }
        
        session_data = self.session_analytics[session_id]
        
        # Update basic metrics
        session_data["last_interaction"] = interaction.timestamp
        session_data["interaction_count"] += 1
        session_data["agent_interactions"][interaction.agent_type] += 1
        session_data["total_response_time"] += interaction.response_time_ms
        
        # Track emotional journey
        session_data["emotional_journey"].append({
            "timestamp": interaction.timestamp.isoformat(),
            "emotion": interaction.emotional_state,
            "confidence": interaction.confidence_score
        })
        
        # Track crisis events
        if interaction.crisis_level >= 8:
            session_data["crisis_events"].append({
                "timestamp": interaction.timestamp.isoformat(),
                "crisis_level": interaction.crisis_level,
                "message_excerpt": user_message[:100] + "..." if len(user_message) > 100 else user_message
            })
        
        # Update average confidence
        session_data["average_confidence"] = (
            (session_data["average_confidence"] * (session_data["interaction_count"] - 1) + 
             interaction.confidence_score) / session_data["interaction_count"]
        )
        
        # Analyze therapeutic themes
        self._analyze_therapeutic_themes(session_id, user_message)
        
        # Update engagement score
        self._update_engagement_score(session_id, interaction, user_message)
    
    def _analyze_therapeutic_themes(self, session_id: str, user_message: str):
        """Analyze and track therapeutic themes in the conversation"""
        
        theme_keywords = {
            "anxiety": ["anxious", "worry", "nervous", "panic", "scared", "overwhelmed"],
            "depression": ["sad", "depressed", "hopeless", "empty", "worthless", "numb"],
            "relationships": ["relationship", "partner", "family", "friends", "marriage", "divorce"],
            "work_stress": ["work", "job", "boss", "career", "workplace", "stress"],
            "trauma": ["trauma", "abuse", "ptsd", "flashback", "triggered"],
            "self_esteem": ["confidence", "self-worth", "self-doubt", "insecure"],
            "grief": ["loss", "death", "grieving", "mourning", "passed away"],
            "addiction": ["drinking", "drugs", "alcohol", "addiction", "substance"],
            "sleep": ["sleep", "insomnia", "nightmares", "tired", "exhausted"],
            "eating": ["eating", "food", "weight", "body image", "appetite"]
        }
        
        message_lower = user_message.lower()
        session_data = self.session_analytics[session_id]
        
        for theme, keywords in theme_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                if theme not in session_data["therapeutic_themes"]:
                    session_data["therapeutic_themes"].append(theme)
    
    def _update_engagement_score(self, session_id: str, interaction: InteractionMetrics, user_message: str):
        """Calculate and update user engagement score"""
        
        session_data = self.session_analytics[session_id]
        
        # Factors that increase engagement score
        engagement_factors = 0
        
        # Message length (longer messages often indicate more engagement)
        if interaction.user_message_length > 50:
            engagement_factors += 1
        if interaction.user_message_length > 150:
            engagement_factors += 1
        
        # Emotional expression
        emotional_words = ["feel", "feeling", "emotions", "heart", "pain", "joy", "love", "fear"]
        if any(word in user_message.lower() for word in emotional_words):
            engagement_factors += 1
        
        # Questions or seeking help
        help_seeking = ["help", "what should", "how can", "advice", "suggest", "?"]
        if any(phrase in user_message.lower() for phrase in help_seeking):
            engagement_factors += 1
        
        # Personal disclosure
        personal_indicators = ["i am", "i feel", "i think", "my", "me", "myself"]
        personal_count = sum(1 for indicator in personal_indicators if indicator in user_message.lower())
        if personal_count >= 3:
            engagement_factors += 1
        
        # Update engagement score (0-100 scale)
        current_score = session_data["user_engagement_score"]
        new_score = min(100, current_score + (engagement_factors * 5))
        session_data["user_engagement_score"] = new_score
    
    async def get_session_analytics(self, session_id: str) -> Dict[str, Any]:
        """Get comprehensive analytics for a specific session"""
        
        if session_id not in self.session_analytics:
            return {"error": "Session not found"}
        
        session_data = self.session_analytics[session_id]
        
        # Calculate session duration
        duration = (session_data["last_interaction"] - session_data["start_time"]).total_seconds() / 60
        
        # Calculate average response time
        avg_response_time = (
            session_data["total_response_time"] / session_data["interaction_count"]
            if session_data["interaction_count"] > 0 else 0
        )
        
        # Determine engagement level
        engagement_score = session_data["user_engagement_score"]
        if engagement_score >= 70:
            engagement_level = "High"
        elif engagement_score >= 40:
            engagement_level = "Medium"
        else:
            engagement_level = "Low"
        
        # Analyze emotional progression
        emotional_progression = self._analyze_emotional_progression(session_data["emotional_journey"])
        
        return {
            "session_id": session_id,
            "duration_minutes": round(duration, 1),
            "total_interactions": session_data["interaction_count"],
            "engagement_level": engagement_level,
            "engagement_score": engagement_score,
            "average_confidence": round(session_data["average_confidence"], 1),
            "average_response_time_ms": round(avg_response_time, 1),
            "emotional_journey": session_data["emotional_journey"],
            "emotional_progression": emotional_progression,
            "therapeutic_themes": session_data["therapeutic_themes"],
            "crisis_events": session_data["crisis_events"],
            "agent_usage": dict(session_data["agent_interactions"]),
            "progress_indicators": self._generate_progress_indicators(session_data),
            "recommendations": self._generate_session_recommendations(session_data)
        }
    
    def _analyze_emotional_progression(self, emotional_journey: List[Dict]) -> Dict[str, Any]:
        """Analyze how emotions have changed throughout the session"""
        
        if len(emotional_journey) < 2:
            return {"status": "insufficient_data"}
        
        emotions = [entry["emotion"] for entry in emotional_journey]
        
        # Categorize emotions as positive, negative, or neutral
        emotion_valence = {
            "happy": 1, "content": 1, "hopeful": 1, "calm": 1, "excited": 1,
            "sad": -1, "anxious": -1, "angry": -1, "depressed": -1, "hopeless": -1,
            "neutral": 0, "confused": 0, "tired": 0
        }
        
        valence_scores = [emotion_valence.get(emotion, 0) for emotion in emotions]
        
        # Calculate trend
        if len(valence_scores) >= 3:
            early_avg = sum(valence_scores[:len(valence_scores)//2]) / (len(valence_scores)//2)
            late_avg = sum(valence_scores[len(valence_scores)//2:]) / (len(valence_scores) - len(valence_scores)//2)
            
            if late_avg > early_avg + 0.2:
                trend = "improving"
            elif late_avg < early_avg - 0.2:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "insufficient_data"
        
        return {
            "trend": trend,
            "emotional_variety": len(set(emotions)),
            "dominant_emotion": max(set(emotions), key=emotions.count),
            "emotional_stability": self._calculate_emotional_stability(emotions),
            "valence_progression": valence_scores
        }
    
    def _calculate_emotional_stability(self, emotions: List[str]) -> str:
        """Calculate emotional stability based on emotion changes"""
        if len(emotions) < 3:
            return "unknown"
        
        # Count emotion changes
        changes = sum(1 for i in range(1, len(emotions)) if emotions[i] != emotions[i-1])
        change_rate = changes / (len(emotions) - 1)
        
        if change_rate < 0.3:
            return "stable"
        elif change_rate < 0.6:
            return "moderate"
        else:
            return "volatile"
    
    def _generate_progress_indicators(self, session_data: Dict) -> List[str]:
        """Generate progress indicators for the session"""
        indicators = []
        
        # Engagement indicators
        if session_data["user_engagement_score"] > 70:
            indicators.append("High user engagement demonstrated")
        
        # Emotional indicators
        if len(session_data["emotional_journey"]) > 0:
            latest_emotion = session_data["emotional_journey"][-1]["emotion"]
            if latest_emotion in ["happy", "content", "hopeful", "calm"]:
                indicators.append("Positive emotional state achieved")
        
        # Interaction quality
        if session_data["average_confidence"] > 85:
            indicators.append("High-quality therapeutic responses")
        
        # Crisis management
        if len(session_data["crisis_events"]) == 0:
            indicators.append("Session completed without crisis events")
        elif len(session_data["crisis_events"]) > 0:
            indicators.append("Crisis events identified and addressed")
        
        # Theme exploration
        if len(session_data["therapeutic_themes"]) >= 2:
            indicators.append("Multiple therapeutic themes explored")
        
        return indicators
    
    def _generate_session_recommendations(self, session_data: Dict) -> List[str]:
        """Generate recommendations based on session analysis"""
        recommendations = []
        
        # Based on engagement
        if session_data["user_engagement_score"] < 40:
            recommendations.append("Consider adjusting communication style to increase engagement")
        
        # Based on themes
        themes = session_data["therapeutic_themes"]
        if "anxiety" in themes:
            recommendations.append("Focus on anxiety management techniques in future sessions")
        if "depression" in themes:
            recommendations.append("Incorporate mood-lifting activities and cognitive restructuring")
        if "relationships" in themes:
            recommendations.append("Explore interpersonal dynamics and communication skills")
        
        # Based on crisis events
        if len(session_data["crisis_events"]) > 0:
            recommendations.append("Schedule follow-up check-in within 24 hours")
            recommendations.append("Consider additional safety planning resources")
        
        # Based on emotional journey
        emotional_journey = session_data["emotional_journey"]
        if len(emotional_journey) > 0:
            latest_emotion = emotional_journey[-1]["emotion"]
            if latest_emotion in ["sad", "anxious", "depressed"]:
                recommendations.append("Provide additional coping strategies and support resources")
        
        return recommendations if recommendations else ["Continue current therapeutic approach"]
    
    def get_system_load(self) -> Dict[str, Any]:
        """Get current system performance metrics"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                "cpu_usage_percent": cpu_percent,
                "memory_usage_percent": memory.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "disk_usage_percent": disk.percent,
                "disk_free_gb": round(disk.free / (1024**3), 2),
                "active_sessions": len(self.session_analytics),
                "total_interactions": self.system_metrics["total_interactions"],
                "status": "healthy" if cpu_percent < 80 and memory.percent < 80 else "high_load"
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "active_sessions": len(self.session_analytics),
                "total_interactions": self.system_metrics["total_interactions"]
            }
    
    def get_global_analytics(self, days: int = 7) -> Dict[str, Any]:
        """Get system-wide analytics for the specified period"""
        
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_interactions = [
            interaction for interaction in self.interaction_history
            if interaction.timestamp >= cutoff_date
        ]
        
        if not recent_interactions:
            return {"status": "no_data", "period_days": days}
        
        # Calculate metrics
        total_interactions = len(recent_interactions)
        crisis_interventions = sum(1 for i in recent_interactions if i.crisis_level >= 8)
        
        # Emotional state distribution
        emotion_dist = defaultdict(int)
        agent_usage = defaultdict(int)
        
        for interaction in recent_interactions:
            emotion_dist[interaction.emotional_state] += 1
            agent_usage[interaction.agent_type] += 1
        
        # Calculate averages
        avg_confidence = sum(i.confidence_score for i in recent_interactions) / total_interactions
        avg_response_time = sum(i.response_time_ms for i in recent_interactions) / total_interactions
        
        # Session metrics
        unique_sessions = len(set(i.session_id for i in recent_interactions))
        avg_interactions_per_session = total_interactions / unique_sessions if unique_sessions > 0 else 0
        
        return {
            "period_days": days,
            "total_interactions": total_interactions,
            "unique_sessions": unique_sessions,
            "crisis_interventions": crisis_interventions,
            "crisis_rate_percent": round((crisis_interventions / total_interactions) * 100, 2),
            "average_confidence_score": round(avg_confidence, 1),
            "average_response_time_ms": round(avg_response_time, 1),
            "average_interactions_per_session": round(avg_interactions_per_session, 1),
            "emotional_state_distribution": dict(emotion_dist),
            "agent_usage_distribution": dict(agent_usage),
            "system_performance": self.get_system_load(),
            "generated_at": datetime.now().isoformat()
        }
    
    def export_session_data(self, session_id: str, format: str = "json") -> str:
        """Export session data in specified format"""
        
        if session_id not in self.session_analytics:
            return json.dumps({"error": "Session not found"})
        
        session_data = self.session_analytics[session_id]
        
        # Create exportable data structure
        export_data = {
            "session_id": session_id,
            "export_timestamp": datetime.now().isoformat(),
            "session_summary": {
                "start_time": session_data["start_time"].isoformat(),
                "last_interaction": session_data["last_interaction"].isoformat(),
                "total_interactions": session_data["interaction_count"],
                "average_confidence": session_data["average_confidence"],
                "engagement_score": session_data["user_engagement_score"]
            },
            "emotional_journey": session_data["emotional_journey"],
            "therapeutic_themes": session_data["therapeutic_themes"],
            "crisis_events": session_data["crisis_events"],
            "agent_interactions": dict(session_data["agent_interactions"]),
            "progress_indicators": self._generate_progress_indicators(session_data),
            "recommendations": self._generate_session_recommendations(session_data)
        }
        
        if format.lower() == "json":
            return json.dumps(export_data, indent=2, default=str)
        else:
            return json.dumps({"error": "Unsupported format"})
    
    async def cleanup_old_analytics(self, days: int = 30) -> int:
        """Clean up analytics data older than specified days"""
        cutoff_date = datetime.now() - timedelta(days=days)
        
        # Clean interaction history
        original_count = len(self.interaction_history)
        self.interaction_history = deque(
            [i for i in self.interaction_history if i.timestamp >= cutoff_date],
            maxlen=10000
        )
        
        # Clean session analytics for old sessions
        sessions_to_remove = []
        for session_id, session_data in self.session_analytics.items():
            if session_data["last_interaction"] < cutoff_date:
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.session_analytics[session_id]
        
        cleaned_interactions = original_count - len(self.interaction_history)
        cleaned_sessions = len(sessions_to_remove)
        
        return cleaned_interactions + cleaned_sessions