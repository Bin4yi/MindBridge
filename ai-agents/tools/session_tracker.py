# ai-agents/tools/session_tracker.py
class SessionTrackerTool(BaseTool):
    name: str = "Session Tracking Tool"
    description: str = "Tracks session progress, goals, and therapeutic continuity"
    
    def _run(self, session_id: str, current_message: str, session_history: List[Dict]) -> Dict:
        """Track session progress and maintain continuity"""
        
        # Analyze session patterns
        session_count = len(session_history)
        
        # Extract themes from session history
        recurring_themes = self._identify_themes(session_history)
        
        # Track progress indicators
        progress_indicators = self._assess_progress(session_history)
        
        # Generate session summary
        session_summary = self._create_session_summary(current_message, session_history)
        
        return {
            "session_number": session_count + 1,
            "recurring_themes": recurring_themes,
            "progress_indicators": progress_indicators,
            "session_summary": session_summary,
            "recommended_follow_up": self._suggest_follow_up(session_history),
            "therapeutic_goals": self._track_goals(session_history)
        }
    
    def _identify_themes(self, session_history: List[Dict]) -> List[str]:
        """Identify recurring themes across sessions"""
        if not session_history:
            return ["First session - establishing rapport"]
        
        # Simple theme detection based on keywords
        theme_keywords = {
            "relationship_issues": ["relationship", "partner", "marriage", "boyfriend", "girlfriend"],
            "work_stress": ["work", "job", "boss", "career", "workplace"],
            "family_problems": ["family", "parents", "mother", "father", "siblings"],
            "self_esteem": ["worthless", "self-worth", "confidence", "self-doubt"],
            "trauma": ["trauma", "abuse", "ptsd", "flashbacks", "memories"]
        }
        
        themes = []
        for theme, keywords in theme_keywords.items():
            if any(any(keyword in msg.get("message", "").lower() for keyword in keywords) 
                   for msg in session_history):
                themes.append(theme.replace("_", " ").title())
        
        return themes if themes else ["General mental health support"]
    
    def _assess_progress(self, session_history: List[Dict]) -> Dict:
        """Assess therapeutic progress over time"""
        if len(session_history) < 2:
            return {"status": "Initial assessment phase"}
        
        # Simple progress tracking
        recent_sessions = session_history[-3:]
        earlier_sessions = session_history[:3] if len(session_history) > 3 else []
        
        progress_score = 5  # Neutral progress
        
        # Look for improvement indicators
        improvement_words = ["better", "improving", "hope", "positive", "progress"]
        decline_words = ["worse", "hopeless", "giving up", "can't cope"]
        
        recent_improvement = sum(1 for session in recent_sessions 
                               for word in improvement_words 
                               if word in session.get("message", "").lower())
        
        recent_decline = sum(1 for session in recent_sessions 
                           for word in decline_words 
                           if word in session.get("message", "").lower())
        
        if recent_improvement > recent_decline:
            progress_score = 7
            status = "Showing improvement"
        elif recent_decline > recent_improvement:
            progress_score = 3
            status = "May need additional support"
        else:
            status = "Stable, continuing work"
        
        return {
            "status": status,
            "progress_score": progress_score,
            "sessions_completed": len(session_history),
            "engagement_level": "High" if len(session_history) > 5 else "Building"
        }
    
    def _create_session_summary(self, current_message: str, session_history: List[Dict]) -> str:
        """Create a summary of the current session"""
        if not session_history:
            return f"Initial session. Client shared: {current_message[:100]}..."
        
        return f"Session {len(session_history) + 1}. Client continues to explore themes of mental health support. Current focus: {current_message[:100]}..."
    
    def _suggest_follow_up(self, session_history: List[Dict]) -> List[str]:
        """Suggest follow-up actions for next session"""
        suggestions = [
            "Continue building therapeutic rapport",
            "Explore coping strategies effectiveness",
            "Check in on homework assignments",
            "Review progress toward goals"
        ]
        
        if len(session_history) > 5:
            suggestions.append("Consider goal reassessment and treatment planning")
        
        return suggestions
    
    def _track_goals(self, session_history: List[Dict]) -> List[str]:
        """Track therapeutic goals across sessions"""
        if len(session_history) < 3:
            return [
                "Establish therapeutic relationship",
                "Complete comprehensive assessment",
                "Identify primary concerns and goals"
            ]
        
        return [
            "Develop effective coping strategies",
            "Improve emotional regulation",
            "Build resilience and self-efficacy",
            "Enhance support system utilization"
        ]
