// frontend/src/hooks/useSpeech.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../services/api';

// Speech Recognition Hook
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef(null);
  const isInitialized = useRef(false);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        
        // Configure recognition
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          let maxConfidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence || 0;

            if (result.isFinal) {
              finalTranscript += transcript;
              maxConfidence = Math.max(maxConfidence, confidence);
            } else {
              interimTranscript += transcript;
            }
          }

          setInterimTranscript(interimTranscript);
          
          if (finalTranscript) {
            setTranscript(prev => prev + finalTranscript);
            setConfidence(maxConfidence);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setError(event.error);
          setIsListening(false);
          
          // Handle specific errors
          switch (event.error) {
            case 'no-speech':
              setError('No speech detected. Try speaking louder.');
              break;
            case 'audio-capture':
              setError('No microphone found. Please check your microphone.');
              break;
            case 'not-allowed':
              setError('Microphone access denied. Please allow microphone access.');
              break;
            case 'network':
              setError('Network error. Please check your internet connection.');
              break;
            default:
              setError(`Speech recognition error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          console.log('Speech recognition ended');
        };

        recognitionRef.current = recognition;
        isInitialized.current = true;
      } else {
        setIsSupported(false);
        setError('Speech recognition is not supported in this browser.');
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        setInterimTranscript('');
        setError(null);
        setConfidence(0);
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setError('Failed to start speech recognition.');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Failed to stop speech recognition:', err);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setConfidence(0);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    confidence,
    startListening,
    stopListening,
    resetTranscript
  };
};

// Speech Synthesis Hook
export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [error, setError] = useState(null);
  
  const utteranceRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Select a default voice (prefer English voices)
        const englishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en') && voice.localService
        ) || availableVoices[0];
        
        if (englishVoice) {
          setSelectedVoice(englishVoice);
        }
      };

      // Load voices immediately and on voiceschanged event
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
      setError('Speech synthesis is not supported in this browser.');
    }
  }, []);

  const speak = useCallback((text, options = {}) => {
    if (!isSupported || !text) return;

    // Stop any current speech
    speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure utterance
      utterance.voice = options.voice || selectedVoice;
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setError(null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utterance.onpause = () => {
        setIsPaused(true);
      };

      utterance.onresume = () => {
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setError(`Speech error: ${event.error}`);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to speak text:', err);
      setError('Failed to speak text.');
    }
  }, [isSupported, selectedVoice]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume();
    }
  }, [isSupported, isPaused]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  return {
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    selectedVoice,
    error,
    speak,
    pause,
    resume,
    stop,
    setSelectedVoice
  };
};

// Combined Speech Hook with API integration
export const useAdvancedSpeech = (sessionId) => {
  const speechRecognition = useSpeechRecognition();
  const speechSynthesis = useSpeechSynthesis();
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioHistory, setAudioHistory] = useState([]);

  // Transcribe audio using backend API
  const transcribeAudio = useCallback(async (audioBlob) => {
    if (!sessionId || !audioBlob) return null;

    try {
      setIsProcessing(true);
      
      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      const result = await apiService.transcribeAudio(
        sessionId,
        base64Audio,
        audioBlob.type.includes('wav') ? 'wav' : 'mp3'
      );
      
      if (result.status === 'success') {
        return result.transcription;
      } else {
        throw new Error(result.error || 'Transcription failed');
      }
    } catch (error) {
      console.error('Audio transcription failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId]);

  // Synthesize speech using backend API
  const synthesizeSpeech = useCallback(async (text, voice = 'alloy', speed = '1.0') => {
    if (!text) return null;

    try {
      setIsProcessing(true);
      
      const result = await apiService.synthesizeSpeech(text, voice, speed);
      
      // Add to audio history
      setAudioHistory(prev => [...prev, {
        id: Date.now(),
        text,
        audioUrl: result.audioUrl,
        timestamp: new Date(),
        voice,
        speed
      }]);
      
      return result;
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Play synthesized audio
  const playAudio = useCallback((audioUrl, onEnd = null) => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      if (onEnd) onEnd();
    };
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
    };
    
    audio.play().catch(error => {
      console.error('Failed to play audio:', error);
    });
    
    return audio;
  }, []);

  // Record audio for transcription
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        setRecordedChunks(chunks);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedChunks([]);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder, isRecording]);

  const getRecordedAudio = useCallback(() => {
    if (recordedChunks.length > 0) {
      return new Blob(recordedChunks, { type: 'audio/webm;codecs=opus' });
    }
    return null;
  }, [recordedChunks]);

  // Auto-transcribe when recording stops
  useEffect(() => {
    if (!isRecording && recordedChunks.length > 0) {
      const audioBlob = getRecordedAudio();
      if (audioBlob) {
        transcribeAudio(audioBlob).then(transcription => {
          if (transcription) {
            console.log('Auto-transcription result:', transcription);
          }
        }).catch(error => {
          console.error('Auto-transcription failed:', error);
        });
      }
    }
  }, [isRecording, recordedChunks, getRecordedAudio, transcribeAudio]);

  return {
    // Speech Recognition
    recognition: speechRecognition,
    
    // Speech Synthesis  
    synthesis: speechSynthesis,
    
    // API Integration
    transcribeAudio,
    synthesizeSpeech,
    playAudio,
    
    // Recording
    isRecording,
    startRecording,
    stopRecording,
    getRecordedAudio,
    
    // State
    isProcessing,
    audioHistory,
    
    // Combined capabilities
    isSupported: speechRecognition.isSupported || speechSynthesis.isSupported,
    hasRecordingSupport: typeof navigator !== 'undefined' && 
                        'mediaDevices' in navigator && 
                        'getUserMedia' in navigator.mediaDevices
  };
};

// Audio Processing Utilities
export const audioUtils = {
  // Convert audio file to base64
  async audioToBase64(audioFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:audio/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioFile);
    });
  },

  // Create audio blob from base64
  base64ToAudioBlob(base64Data, mimeType = 'audio/wav') {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  },

  // Get audio duration
  async getAudioDuration(audioFile) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = reject;
      audio.src = URL.createObjectURL(audioFile);
    });
  },

  // Validate audio file
  isValidAudioFile(file) {
    const validTypes = [
      'audio/wav', 'audio/wave', 'audio/x-wav',
      'audio/mp3', 'audio/mpeg', 'audio/mp4',
      'audio/webm', 'audio/ogg'
    ];
    
    return file && validTypes.includes(file.type);
  },

  // Format audio duration for display
  formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};