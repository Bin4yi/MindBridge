import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, VolumeX, MessageCircle, Activity, Brain, Heart } from 'lucide-react';

// Voice Recognition Hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, transcript, error, startListening, stopListening };
};

// Audio Player Component
const AudioPlayer = ({ audioUrl, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoPlay && audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl, autoPlay]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
      <button
        onClick={togglePlayPause}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
      
      <div className="flex-1 bg-blue-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>
      
      <span className="text-xs text-blue-700">
        {Math.floor(currentTime)}s / {Math.floor(duration)}s
      </span>
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};

// Crisis Alert Component
const CrisisAlert = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <Heart className="text-red-600 mr-2" size={24} />
          <h3 className="text-lg font-bold text-red-800">Immediate Support Available</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="bg-white p-3 rounded border border-red-200">
            <p className="font-semibold text-red-800">988 Suicide & Crisis Lifeline</p>
            <p className="text-sm text-red-600">Call or text 988 - Available 24/7</p>
          </div>
          
          <div className="bg-white p-3 rounded border border-red-200">
            <p className="font-semibold text-red-800">Crisis Text Line</p>
            <p className="text-sm text-red-600">Text HOME to 741741</p>
          </div>
          
          <div className="bg-white p-3 rounded border border-red-200">
            <p className="font-semibold text-red-800">Emergency Services</p>
            <p className="text-sm text-red-600">Call 911 if in immediate danger</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <a 
            href="tel:988" 
            className="flex-1 bg-red-600 text-white text-center py-2 rounded font-semibold hover:bg-red-700"
          >
            Call 988 Now
          </a>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300"
          >
            Continue Chat
          </button>
        </div>
      </div>
    </div>
  );
};

// Mood Indicator Component
const MoodIndicator = ({ emotionalState, confidenceScore }) => {
  const moodColors = {
    sad: 'bg-blue-100 text-blue-800 border-blue-200',
    anxious: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    angry: 'bg-red-100 text-red-800 border-red-200',
    happy: 'bg-green-100 text-green-800 border-green-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const moodEmoji = {
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    happy: '😊',
    neutral: '😐'
  };

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs ${moodColors[emotionalState] || moodColors.neutral}`}>
      <span>{moodEmoji[emotionalState] || moodEmoji.neutral}</span>
      <span className="capitalize">{emotionalState || 'neutral'}</span>
      <span className="opacity-75">({confidenceScore}%)</span>
    </div>
  );
};

// Voice Controls Component
const VoiceControls = ({ onTranscript, isEnabled = true }) => {
  const { isListening, transcript, error, startListening, stopListening } = useSpeechRecognition();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={!isEnabled}
        className={`p-3 rounded-full transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`p-2 rounded-full ${
          isMuted 
            ? 'bg-gray-400 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      
      {isListening && (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <span className="text-sm text-gray-600">Listening...</span>
        </div>
      )}
      
      {error && (
        <span className="text-xs text-red-600">Voice error: {error}</span>
      )}
    </div>
  );
};

// Main App Component
function EnhancedMentalHealthApp() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [sessionAnalytics, setSessionAnalytics] = useState(null);
  const [wsConnection, setWsConnection] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session and WebSocket
  useEffect(() => {
    initializeSession();
    connectWebSocket();
    
    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeSession = async () => {
    try {
      const response = await fetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            name: 'User',
            preferences: {
              voiceEnabled: true,
              preferredVoice: 'alloy'
            }
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(`ws://localhost:8080/ws`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setWsConnection(ws);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message') {
          setMessages(prev => [...prev, data.data]);
        } else if (data.type === 'session_registered') {
          console.log('Session registered with WebSocket');
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnection(null);
      };
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  };

  const sendMessage = async (messageText = currentMessage) => {
    if (!messageText.trim() || !sessionId) return;
    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      message: messageText,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    // Register WebSocket session if connected
    if (wsConnection && wsConnection.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'register_session',
        sessionId: sessionId
      }));
    }

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          message: messageText,
          includeAudio: voiceEnabled,
          preferredVoice: 'alloy'
        })
      });

      if (response.ok) {
        const agentMessage = await response.json();
        
        // Only add message if not received via WebSocket
        if (!wsConnection || wsConnection.readyState !== WebSocket.OPEN) {
          setMessages(prev => [...prev, agentMessage]);
        }
        
        // Show crisis alert if needed
        if (agentMessage.requiresImmediateAttention) {
          setShowCrisisAlert(true);
        }
        
        // Fetch session analytics
        fetchSessionAnalytics();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessionAnalytics = async () => {
    if (!sessionId) return;
    
    try {
      const response = await fetch(`/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setCurrentMessage(transcript);
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing secure therapeutic session...</p>
          <p className="mt-2 text-sm text-gray-500">Setting up AI agents and voice capabilities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Brain className="mr-2 text-indigo-600" />
              Mental Health Support AI
            </h1>
            <p className="text-gray-600">Advanced multi-agent therapeutic system</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                voiceEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Mic size={16} />
              <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
            </button>
            
            {/* Connection Status */}
            <div className={`flex items-center space-x-1 text-xs ${
              wsConnection ? 'text-green-600' : 'text-gray-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                wsConnection ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <span>{wsConnection ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Session Analytics */}
        {sessionAnalytics && (
          <div className="bg-white m-4 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Activity size={16} className="text-blue-600" />
                  <span className="text-sm font-medium">Session Progress</span>
                </div>
                <div className="text-sm text-gray-600">
                  {sessionAnalytics.totalMessages} messages • {Math.round(sessionAnalytics.sessionDurationMinutes)}min
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Engagement: <span className="font-medium">{sessionAnalytics.engagementLevel}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Brain className="mx-auto text-indigo-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Welcome to Advanced Mental Health Support
              </h3>
              <p className="text-gray-500 mb-4">
                Our AI agents are here to provide personalized therapeutic support.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800">Crisis Detection</h4>
                  <p className="text-blue-600">24/7 safety monitoring</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800">Mood Tracking</h4>
                  <p className="text-green-600">Emotional pattern analysis</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800">Voice Support</h4>
                  <p className="text-purple-600">Speech-enabled therapy</p>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-l-lg rounded-tr-lg' 
                  : msg.agentType === 'crisis_support'
                    ? 'bg-red-50 text-red-900 border border-red-200 rounded-r-lg rounded-tl-lg'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-r-lg rounded-tl-lg shadow-sm'
              } px-4 py-3`}>
                {/* Agent Type Indicator */}
                {msg.sender === 'agent' && msg.agentType && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium opacity-75 capitalize">
                      {msg.agentType.replace('_', ' ')}
                    </span>
                    {msg.emotionalState && (
                      <MoodIndicator 
                        emotionalState={msg.emotionalState} 
                        confidenceScore={msg.confidenceScore} 
                      />
                    )}
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{msg.message}</p>
                
                {/* Audio Player */}
                {msg.audioUrl && (
                  <div className="mt-3">
                    <AudioPlayer audioUrl={msg.audioUrl} autoPlay={autoPlayAudio} />
                  </div>
                )}
                
                <p className="text-xs mt-2 opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          {/* Voice Controls */}
          {voiceEnabled && (
            <div className="mb-4 flex justify-center">
              <VoiceControls 
                onTranscript={handleVoiceTranscript}
                isEnabled={!isLoading}
              />
            </div>
          )}
          
          <div className="flex space-x-2">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder={voiceEnabled ? "Type or speak your message..." : "Type your message here..."}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="2"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                currentMessage.trim() && !isLoading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <MessageCircle size={20} />
              <span>Send</span>
            </button>
          </div>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Emergency? Call <a href="tel:988" className="text-red-600 hover:text-red-700 font-medium">988</a> or <a href="tel:911" className="text-red-600 hover:text-red-700 font-medium">911</a>
            </p>
          </div>
        </div>
      </div>

      {/* Crisis Alert Modal */}
      <CrisisAlert 
        isVisible={showCrisisAlert} 
        onClose={() => setShowCrisisAlert(false)} 
      />
    </div>
  );
}

export default EnhancedMentalHealthApp;