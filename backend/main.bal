import ballerina/http;
import ballerina/websocket;
import ballerina/log;
import ballerina/uuid;
import ballerina/time;
import ballerina/io;
import ballerina/mime;

// Configuration
configurable string aiAgentsUrl = "http://localhost:8001";
configurable string googleApiKey = "YOUR_GOOGLE_API_KEY";
configurable string openaiApiKey = "YOUR_OPENAI_API_KEY";
configurable int serverPort = 8080;

// Enhanced Types
type ChatMessage record {
    string id;
    string sessionId;
    string message;
    string sender;
    string agentType?;
    decimal timestamp;
    string audioUrl?;
    json metadata?;
    string emotionalState?;
    int confidenceScore?;
    boolean requiresImmediateAttention?;
    string[] recommendations?;
};

type SessionData record {
    string sessionId;
    ChatMessage[] messages;
    int crisisLevel;
    decimal startTime;
    boolean isActive;
    json userProfile?;
    string[] recurringThemes?;
    int progressScore?;
    string status?;
};

type VoiceRequest record {
    string sessionId;
    string audioData; // Base64 encoded audio
    string audioFormat?; // "wav", "mp3", etc.
};

type SpeechResponse record {
    string text;
    decimal confidence;
    string language?;
};

type TTSRequest record {
    string text;
    string voice?; // "alloy", "echo", "fable", "onyx", "nova", "shimmer"
    string speed?; // 0.25 to 4.0
};

type TTSResponse record {
    string audioUrl;
    string audioFormat;
    int durationMs;
};

type SessionCreateRequest record {
    json userProfile?;
    json initialAssessment?;
};

type ProcessRequest record {
    string sessionId;
    string message;
    json[] sessionHistory?;
    json userProfile?;
    json context?;
    boolean includeAudio?;
    json voiceSettings?;
};

// Global storage
map<SessionData> sessions = {};
map<websocket:Caller> connections = {};

// HTTP clients
final http:Client aiAgentClient = check new (aiAgentsUrl);
final http:Client googleSpeechClient = check new ("https://speech.googleapis.com");
final http:Client openaiClient = check new ("https://api.openai.com");

// CORS interceptor
public isolated service class CorsInterceptor {
    *http:RequestInterceptor;

    isolated resource function 'default [string... path](http:RequestContext ctx, http:Request req) 
            returns http:NextService|error? {
        // Add CORS headers
        http:Response response = new;
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        response.setHeader("Access-Control-Max-Age", "86400");
        
        if req.method == "OPTIONS" {
            ctx.set(http:RESPONSE, response);
            return;
        }
        
        return ctx.next();
    }
}

// Main HTTP service
service / on new http:Listener(serverPort) {
    public function createInterceptors() returns CorsInterceptor {
        return new CorsInterceptor();
    }

    // Health check endpoint
    resource function get health() returns json|error {
        json healthData = {
            status: "healthy",
            timestamp: time:utcNow(),
            services: {
                backend: "running",
                aiAgents: "connected",
                speechServices: "available"
            },
            activeSessions: sessions.length(),
            version: "2.0.0"
        };
        return healthData;
    }

    // Create session with enhanced profile
    resource function post sessions(SessionCreateRequest request) returns json|http:InternalServerError {
        string sessionId = uuid:createType4AsString();
        
        SessionData session = {
            sessionId: sessionId,
            messages: [],
            crisisLevel: 0,
            startTime: time:utcNow(),
            isActive: true,
            userProfile: request.userProfile ?: {},
            recurringThemes: [],
            progressScore: 5,
            status: "active"
        };
        
        sessions[sessionId] = session;
        
        log:printInfo("New session created: " + sessionId);
        
        return {
            sessionId: sessionId,
            status: "created",
            timestamp: time:utcNow(),
            agentsInitialized: ["therapist", "crisis_detector", "mood_tracker", "session_manager"]
        };
    }

    // Enhanced chat endpoint
    resource function post chat(ProcessRequest request) returns json|http:InternalServerError {
        string sessionId = request.sessionId;
        string message = request.message;
        boolean includeAudio = request.includeAudio ?: false;
        
        // Create user message
        ChatMessage userMessage = {
            id: uuid:createType4AsString(),
            sessionId: sessionId,
            message: message,
            sender: "user",
            timestamp: time:utcNow()
        };

        // Get session context
        SessionData? session = sessions[sessionId];
        json sessionHistory = [];
        json userProfile = {};
        
        if session is SessionData {
            // Convert last 5 messages to JSON for context
            ChatMessage[] recentMessages = session.messages.length() > 5 ? 
                session.messages.slice(session.messages.length() - 5) : session.messages;
            sessionHistory = recentMessages.toJson();
            userProfile = session.userProfile ?: {};
        }

        // Process through AI agents
        json agentRequest = {
            sessionId: sessionId,
            message: message,
            sessionHistory: sessionHistory,
            userProfile: userProfile,
            context: request.context ?: {},
            includeAudio: includeAudio,
            voiceSettings: request.voiceSettings ?: {}
        };

        http:Response|error aiResponse = aiAgentClient->post("/process", agentRequest);
        
        if aiResponse is error {
            log:printError("AI Agent communication failed", aiResponse);
            return http:INTERNAL_SERVER_ERROR;
        }
        
        json|error aiResult = aiResponse.getJsonPayload();
        if aiResult is error {
            log:printError("Failed to parse AI response", aiResult);
            return http:INTERNAL_SERVER_ERROR;
        }

        // Create enhanced agent message
        ChatMessage agentMessage = {
            id: uuid:createType4AsString(),
            sessionId: sessionId,
            message: check aiResult.response,
            sender: "agent",
            agentType: check aiResult.agentType,
            timestamp: time:utcNow(),
            emotionalState: aiResult.emotionalState is string ? check aiResult.emotionalState : "neutral",
            confidenceScore: aiResult.confidenceScore is int ? check aiResult.confidenceScore : 80,
            requiresImmediateAttention: aiResult.requiresImmediateAttention is boolean ? 
                check aiResult.requiresImmediateAttention : false,
            recommendations: aiResult.recommendations is string[] ? check aiResult.recommendations : []
        };

        // Generate audio if requested
        if includeAudio {
            TTSResponse|error audioResult = generateSpeech(agentMessage.message, "alloy");
            if audioResult is TTSResponse {
                agentMessage.audioUrl = audioResult.audioUrl;
                agentMessage.metadata = {
                    audioFormat: audioResult.audioFormat,
                    duration: audioResult.durationMs
                };
            }
        }

        // Update session
        if session is SessionData {
            session.messages.push(userMessage);
            session.messages.push(agentMessage);
            
            // Update session metadata from AI analysis
            if aiResult.analysis is json {
                json analysis = check aiResult.analysis;
                session.crisisLevel = analysis.crisis_level is int ? check analysis.crisis_level : 0;
                session.progressScore = analysis.mood_score is int ? check analysis.mood_score : 5;
                
                // Update status if crisis detected
                if agentMessage.requiresImmediateAttention {
                    session.status = "emergency";
                }
            }
            
            sessions[sessionId] = session;
        }

        // Send real-time update via WebSocket
        websocket:Caller? wsConnection = connections[sessionId];
        if wsConnection is websocket:Caller {
            json wsMessage = {
                'type: "new_message",
                data: agentMessage.toJson()
            };
            var result = wsConnection->writeMessage(wsMessage);
            if result is error {
                log:printError("WebSocket send failed", result);
            }
        }

        return agentMessage.toJson();
    }

    // Speech-to-Text endpoint
    resource function post speech/transcribe(VoiceRequest request) returns json|http:InternalServerError {
        string sessionId = request.sessionId;
        string audioData = request.audioData;
        string audioFormat = request.audioFormat ?: "wav";

        SpeechResponse|error transcriptionResult = transcribeAudio(audioData, audioFormat);
        
        if transcriptionResult is SpeechResponse {
            return {
                sessionId: sessionId,
                transcription: transcriptionResult.toJson(),
                status: "success"
            };
        } else {
            log:printError("Transcription failed", transcriptionResult);
            return {
                sessionId: sessionId,
                error: "Transcription failed",
                status: "error"
            };
        }
    }

    // Text-to-Speech endpoint
    resource function post speech/synthesize(TTSRequest request) returns json|http:InternalServerError {
        string text = request.text;
        string voice = request.voice ?: "alloy";
        string speed = request.speed ?: "1.0";

        TTSResponse|error speechResult = generateSpeech(text, voice, speed);
        
        if speechResult is TTSResponse {
            return speechResult.toJson();
        } else {
            log:printError("Speech synthesis failed", speechResult);
            return {
                error: "Speech synthesis failed",
                status: "error"
            };
        }
    }

    // Get session analytics
    resource function get sessions/[string sessionId]/analytics() returns json|http:NotFound {
        SessionData? session = sessions[sessionId];
        
        if session is SessionData {
            json analytics = generateSessionAnalytics(session);
            return {
                session: session.toJson(),
                analytics: analytics
            };
        } else {
            return http:NOT_FOUND;
        }
    }

    // Get session history
    resource function get sessions/[string sessionId]() returns json|http:NotFound {
        SessionData? session = sessions[sessionId];
        
        if session is SessionData {
            return {
                sessionId: sessionId,
                session: session.toJson(),
                analytics: generateSessionAnalytics(session)
            };
        } else {
            return http:NOT_FOUND;
        }
    }

    // WebSocket endpoint for real-time communication
    resource function get ws() returns websocket:Service|websocket:UpgradeError {
        return new EnhancedChatWebSocketService();
    }

    // Test endpoint for standalone agent testing
    resource function post test/agents(json request) returns json {
        // Forward test request to AI agents
        http:Response|error testResponse = aiAgentClient->post("/test-standalone", request);
        
        if testResponse is http:Response {
            json|error result = testResponse.getJsonPayload();
            if result is json {
                return result;
            }
        }
        
        return {
            status: "error",
            message: "Test request failed"
        };
    }
}

// Enhanced WebSocket service
service class EnhancedChatWebSocketService {
    *websocket:Service;

    remote function onOpen(websocket:Caller caller) returns websocket:Error? {
        log:printInfo("Enhanced WebSocket connection opened");
    }

    remote function onMessage(websocket:Caller caller, websocket:Message message) returns websocket:Error? {
        json|error payload = message.readMessage();
        
        if payload is json {
            string messageType = payload.'type is string ? <string>payload.'type : "";
            
            if messageType == "register_session" {
                string? sessionId = payload.sessionId is string ? <string>payload.sessionId : ();
                if sessionId is string {
                    connections[sessionId] = caller;
                    log:printInfo("WebSocket registered for session: " + sessionId);
                    
                    // Send confirmation
                    json confirmation = {
                        'type: "session_registered",
                        sessionId: sessionId,
                        timestamp: time:utcNow()
                    };
                    var result = caller->writeMessage(confirmation);
                }
            } else if messageType == "typing_indicator" {
                string? sessionId = payload.sessionId is string ? <string>payload.sessionId : ();
                if sessionId is string {
                    json typingUpdate = {
                        'type: "typing_status",
                        sessionId: sessionId,
                        isTyping: payload.isTyping ?: false,
                        timestamp: time:utcNow()
                    };
                    var result = caller->writeMessage(typingUpdate);
                }
            }
        }
    }

    remote function onClose(websocket:Caller caller, int statusCode, string reason) returns websocket:Error? {
        log:printInfo("Enhanced WebSocket connection closed: " + reason);
        
        // Remove from connections - in production, maintain a reverse mapping
        string[] sessionsToRemove = [];
        foreach var [sessionId, conn] in connections.entries() {
            if conn === caller {
                sessionsToRemove.push(sessionId);
            }
        }
        
        foreach string sessionId in sessionsToRemove {
            _ = connections.remove(sessionId);
        }
    }
}

// Speech-to-Text function using Google Speech API
function transcribeAudio(string audioData, string format) returns SpeechResponse|error {
    json speechRequest = {
        config: {
            encoding: format.toUpperAscii(),
            sampleRateHertz: 16000,
            languageCode: "en-US",
            enableAutomaticPunctuation: true,
            model: "latest_long"
        },
        audio: {
            content: audioData
        }
    };

    http:Request request = new;
    request.setJsonPayload(speechRequest);
    request.setHeader("Authorization", "Bearer " + googleApiKey);
    request.setHeader("Content-Type", "application/json");

    http:Response|error response = googleSpeechClient->post("/v1/speech:recognize", request);
    
    if response is http:Response {
        json|error result = response.getJsonPayload();
        if result is json && result.results is json[] {
            json[] results = <json[]>result.results;
            if results.length() > 0 {
                json firstResult = results[0];
                if firstResult.alternatives is json[] {
                    json[] alternatives = <json[]>firstResult.alternatives;
                    if alternatives.length() > 0 {
                        json alternative = alternatives[0];
                        string? transcript = alternative.transcript is string ? 
                            <string>alternative.transcript : ();
                        decimal? confidence = alternative.confidence is decimal ? 
                            <decimal>alternative.confidence : 0.0;
                        
                        if transcript is string {
                            return {
                                text: transcript,
                                confidence: confidence,
                                language: "en-US"
                            };
                        }
                    }
                }
            }
        }
    }
    
    return error("Failed to transcribe audio");
}

// Text-to-Speech function using OpenAI
function generateSpeech(string text, string voice = "alloy", string speed = "1.0") returns TTSResponse|error {
    decimal speedDecimal = check decimal:fromString(speed);
    
    json ttsRequest = {
        model: "tts-1",
        input: text,
        voice: voice,
        speed: speedDecimal
    };

    http:Request request = new;
    request.setJsonPayload(ttsRequest);
    request.setHeader("Authorization", "Bearer " + openaiApiKey);
    request.setHeader("Content-Type", "application/json");

    http:Response|error response = openaiClient->post("/v1/audio/speech", request);
    
    if response is http:Response {
        // In a real implementation, save the audio file and return URL
        // For demo, return a placeholder
        return {
            audioUrl: "data:audio/mp3;base64,placeholder_audio_data",
            audioFormat: "mp3",
            durationMs: text.length() * 50 // Rough estimate
        };
    }
    
    return error("Failed to generate speech");
}

// Generate comprehensive session analytics
function generateSessionAnalytics(SessionData session) returns json {
    int totalMessages = session.messages.length();
    int userMessages = 0;
    int agentMessages = 0;
    string[] emotionalStates = [];
    string[] agentTypes = [];
    int crisisEvents = 0;
    
    foreach ChatMessage msg in session.messages {
        if msg.sender == "user" {
            userMessages += 1;
        } else {
            agentMessages += 1;
            if msg.emotionalState is string {
                emotionalStates.push(msg.emotionalState);
            }
            if msg.agentType is string {
                agentTypes.push(msg.agentType);
            }
            if msg.requiresImmediateAttention == true {
                crisisEvents += 1;
            }
        }
    }
    
    decimal sessionDuration = (time:utcNow() - session.startTime) / 60000.0; // Convert to minutes
    
    // Calculate engagement level
    string engagementLevel = "Low";
    if totalMessages >= 10 && sessionDuration >= 20 {
        engagementLevel = "High";
    } else if totalMessages >= 5 && sessionDuration >= 10 {
        engagementLevel = "Medium";
    }
    
    // Determine dominant emotion
    map<int> emotionCounts = {};
    foreach string emotion in emotionalStates {
        emotionCounts[emotion] = (emotionCounts[emotion] ?: 0) + 1;
    }
    
    string dominantEmotion = "neutral";
    int maxCount = 0;
    foreach var [emotion, count] in emotionCounts.entries() {
        if count > maxCount {
            maxCount = count;
            dominantEmotion = emotion;
        }
    }
    
    return {
        totalMessages: totalMessages,
        userMessages: userMessages,
        agentMessages: agentMessages,
        sessionDurationMinutes: math:round(sessionDuration * 100.0) / 100.0,
        averageResponseTime: "2.3s", // Would calculate from actual data
        emotionalJourney: emotionalStates,
        dominantEmotion: dominantEmotion,
        agentInteractions: agentTypes,
        crisisLevel: session.crisisLevel,
        crisisEvents: crisisEvents,
        progressScore: session.progressScore,
        engagementLevel: engagementLevel,
        recurringThemes: session.recurringThemes ?: [],
        sessionStatus: session.status ?: "active",
        recommendationsProvided: true,
        safetyMonitoring: crisisEvents > 0 ? "Active" : "Standard"
    };


    
}