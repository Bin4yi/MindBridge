// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for analytics
    config.headers['X-Request-Timestamp'] = new Date().toISOString();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Session management
  async createSession(userProfile = {}) {
    try {
      const response = await api.post('/sessions', {
        userProfile,
        initialAssessment: {}
      });
      return response.data;
    } catch (error) {
      console.error('Session creation failed:', error);
      throw error;
    }
  },

  async getSession(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Get session failed:', error);
      throw error;
    }
  },

  async getSessionAnalytics(sessionId) {
    try {
      const response = await api.get(`/sessions/${sessionId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Get session analytics failed:', error);
      throw error;
    }
  },

  // Chat functionality
  async sendMessage(sessionId, message, options = {}) {
    try {
      const payload = {
        sessionId,
        message,
        includeAudio: options.includeAudio || false,
        preferredVoice: options.preferredVoice || 'alloy',
        context: options.context || {},
        voiceSettings: options.voiceSettings || {}
      };

      const response = await api.post('/chat', payload);
      return response.data;
    } catch (error) {
      console.error('Send message failed:', error);
      throw error;
    }
  },

  // Speech services
  async transcribeAudio(sessionId, audioData, audioFormat = 'wav') {
    try {
      const response = await api.post('/speech/transcribe', {
        sessionId,
        audioData,
        audioFormat
      });
      return response.data;
    } catch (error) {
      console.error('Audio transcription failed:', error);
      throw error;
    }
  },

  async synthesizeSpeech(text, voice = 'alloy', speed = '1.0') {
    try {
      const response = await api.post('/speech/synthesize', {
        text,
        voice,
        speed
      });
      return response.data;
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      throw error;
    }
  },

  // Testing
  async testAgents(message, agentType = 'all') {
    try {
      const response = await api.post('/test/agents', {
        message,
        agent_type: agentType
      });
      return response.data;
    } catch (error) {
      console.error('Agent testing failed:', error);
      throw error;
    }
  }
};

export default api;