// frontend/src/hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';
import webSocketService from '../services/websocketService';

export const useChat = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionAnalytics, setSessionAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const messageHandlerRef = useRef(null);
  const connectionHandlerRef = useRef(null);

  // Initialize session
  const initializeSession = useCallback(async (userProfile = {}) => {
    try {
      setIsInitializing(true);
      setError(null);
      
      const sessionData = await apiService.createSession(userProfile);
      setSessionId(sessionData.sessionId);
      
      // Connect WebSocket
      webSocketService.connect(sessionData.sessionId);
      
      return sessionData;
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setError('Failed to initialize session. Please try again.');
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (messageText, options = {}) => {
    if (!messageText.trim() || !sessionId || isLoading) return null;

    try {
      setIsLoading(true);
      setError(null);

      // Create user message
      const userMessage = {
        id: Date.now(),
        message: messageText,
        sender: 'user',
        timestamp: Date.now()
      };

      // Optimistically add user message
      setMessages(prev => [...prev, userMessage]);

      // Send to backend
      const response = await apiService.sendMessage(sessionId, messageText, options);
      
      // Add agent response if not received via WebSocket
      if (!isConnected) {
        setMessages(prev => [...prev, response]);
      }

      // Fetch updated analytics
      fetchSessionAnalytics();

      return response;
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the optimistically added user message on error
      setMessages(prev => prev.slice(0, -1));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, isConnected]);

  // Fetch session analytics
  const fetchSessionAnalytics = useCallback(async () => {
    if (!sessionId) return;

    try {
      const analytics = await apiService.getSessionAnalytics(sessionId);
      setSessionAnalytics(analytics);
    } catch (err) {
      console.error('Failed to fetch session analytics:', err);
    }
  }, [sessionId]);

  // Setup WebSocket handlers
  useEffect(() => {
    // Handle new messages from WebSocket
    messageHandlerRef.current = webSocketService.onMessage('new_message', (data) => {
      setMessages(prev => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some(msg => msg.id === data.data.id);
        if (exists) return prev;
        
        return [...prev, data.data];
      });
    });

    // Handle connection status
    connectionHandlerRef.current = webSocketService.onConnection((status, connected) => {
      setIsConnected(connected);
    });

    // Cleanup on unmount
    return () => {
      if (messageHandlerRef.current) {
        messageHandlerRef.current();
      }
      if (connectionHandlerRef.current) {
        connectionHandlerRef.current();
      }
    };
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback((isTyping) => {
    if (sessionId && isConnected) {
      webSocketService.sendTypingIndicator(sessionId, isTyping);
    }
  }, [sessionId, isConnected]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Reset session
  const resetSession = useCallback(async (userProfile = {}) => {
    // Disconnect current WebSocket
    webSocketService.disconnect();
    
    // Clear current state
    setSessionId(null);
    setMessages([]);
    setSessionAnalytics(null);
    setError(null);
    setIsConnected(false);
    
    // Initialize new session
    return initializeSession(userProfile);
  }, [initializeSession]);

  // Get session history
  const getSessionHistory = useCallback(async () => {
    if (!sessionId) return null;

    try {
      const response = await apiService.getSession(sessionId);
      return response;
    } catch (err) {
      console.error('Failed to get session history:', err);
      setError('Failed to load session history.');
      return null;
    }
  }, [sessionId]);

  return {
    // State
    sessionId,
    messages,
    isLoading,
    isConnected,
    sessionAnalytics,
    error,
    isInitializing,
    
    // Actions
    initializeSession,
    sendMessage,
    sendTypingIndicator,
    fetchSessionAnalytics,
    clearMessages,
    resetSession,
    getSessionHistory,
    
    // Utilities
    setError,
    messageCount: messages.length,
    userMessageCount: messages.filter(m => m.sender === 'user').length,
    agentMessageCount: messages.filter(m => m.sender === 'agent').length
  };
};

// Hook for managing multiple chat sessions
export const useMultipleChats = () => {
  const [sessions, setSessions] = useState({});
  const [activeSessionId, setActiveSessionId] = useState(null);

  const createSession = useCallback(async (userProfile = {}) => {
    try {
      const sessionData = await apiService.createSession(userProfile);
      const sessionId = sessionData.sessionId;
      
      setSessions(prev => ({
        ...prev,
        [sessionId]: {
          sessionId,
          messages: [],
          analytics: null,
          created: new Date(),
          ...sessionData
        }
      }));
      
      setActiveSessionId(sessionId);
      return sessionData;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }, []);

  const switchSession = useCallback((sessionId) => {
    if (sessions[sessionId]) {
      setActiveSessionId(sessionId);
    }
  }, [sessions]);

  const removeSession = useCallback((sessionId) => {
    setSessions(prev => {
      const newSessions = { ...prev };
      delete newSessions[sessionId];
      return newSessions;
    });
    
    if (activeSessionId === sessionId) {
      const remainingSessions = Object.keys(sessions).filter(id => id !== sessionId);
      setActiveSessionId(remainingSessions[0] || null);
    }
  }, [sessions, activeSessionId]);

  const getActiveSession = useCallback(() => {
    return activeSessionId ? sessions[activeSessionId] : null;
  }, [sessions, activeSessionId]);

  return {
    sessions,
    activeSessionId,
    activeSession: getActiveSession(),
    createSession,
    switchSession,
    removeSession,
    sessionCount: Object.keys(sessions).length
  };
};