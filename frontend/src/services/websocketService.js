// frontend/src/services/websocketService.js

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.sessionId = null;
    this.messageHandlers = new Map();
    this.connectionHandlers = [];
    this.errorHandlers = [];
  }

  connect(sessionId) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    this.sessionId = sessionId;
    
    try {
      this.ws = new WebSocket(WS_URL);
      this.setupEventHandlers();
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleError(error);
    }
  }

  setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      // Register session immediately
      if (this.sessionId) {
        this.registerSession(this.sessionId);
      }
      
      this.notifyConnectionHandlers('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.isConnected = false;
      this.notifyConnectionHandlers('disconnected');
      
      // Attempt to reconnect if not closed intentionally
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.attemptReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.handleError(error);
    };
  }

  handleMessage(data) {
    const { type } = data;
    
    // Call specific handlers based on message type
    const handlers = this.messageHandlers.get(type) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in message handler for type ${type}:`, error);
      }
    });

    // Default message handling
    switch (type) {
      case 'session_registered':
        console.log('Session registered with WebSocket:', data.sessionId);
        break;
      case 'new_message':
        console.log('Received new message via WebSocket:', data.data);
        break;
      case 'typing_status':
        console.log('Typing status update:', data);
        break;
      case 'error':
        console.error('WebSocket error message:', data.error);
        break;
      default:
        console.log('Unhandled WebSocket message type:', type, data);
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      if (this.sessionId) {
        this.connect(this.sessionId);
      }
    }, this.reconnectDelay);

    // Exponential backoff
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
  }

  registerSession(sessionId) {
    if (this.isConnected && this.ws) {
      const message = {
        type: 'register_session',
        sessionId: sessionId
      };
      this.send(message);
    }
  }

  sendTypingIndicator(sessionId, isTyping) {
    if (this.isConnected && this.ws) {
      const message = {
        type: 'typing_indicator',
        sessionId: sessionId,
        isTyping: isTyping
      };
      this.send(message);
    }
  }

  sendVoiceStream(sessionId, audioChunk) {
    if (this.isConnected && this.ws) {
      const message = {
        type: 'voice_stream',
        sessionId: sessionId,
        audioChunk: audioChunk
      };
      this.send(message);
    }
  }

  sendEmotionUpdate(sessionId, emotionData) {
    if (this.isConnected && this.ws) {
      const message = {
        type: 'emotion_update',
        sessionId: sessionId,
        emotion_data: emotionData
      };
      this.send(message);
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
        this.handleError(error);
      }
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    this.isConnected = false;
    this.sessionId = null;
  }

  // Event handler management
  onMessage(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  onConnection(handler) {
    this.connectionHandlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.connectionHandlers.indexOf(handler);
      if (index > -1) {
        this.connectionHandlers.splice(index, 1);
      }
    };
  }

  onError(handler) {
    this.errorHandlers.push(handler);

    // Return unsubscribe function
    return () => {
      const index = this.errorHandlers.indexOf(handler);
      if (index > -1) {
        this.errorHandlers.splice(index, 1);
      }
    };
  }

  notifyConnectionHandlers(status) {
    this.connectionHandlers.forEach(handler => {
      try {
        handler(status, this.isConnected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }

  handleError(error) {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
  }

  // Getters
  get connected() {
    return this.isConnected;
  }

  get readyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;