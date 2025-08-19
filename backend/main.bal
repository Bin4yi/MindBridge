import ballerina/http;
import ballerina/log;
import ballerina/uuid;
import ballerina/mime;

// ===== ALL CONFIGURATION VARIABLES =====
// AI Agents Configuration
configurable string AI_AGENTS_URL = "http://localhost:8001";

// Whisper Service Configuration
configurable string WHISPER_SERVICE_URL = "http://localhost:9000";

// Database Configuration
configurable string DB_HOST = "localhost";
configurable int DB_PORT = 5432;
configurable string DB_NAME = "mindbridge_db";
configurable string DB_USER = "postgres";
configurable string DB_PASSWORD = "password";

// ===== HTTP CLIENTS =====
// Create HTTP client for AI agents
http:Client aiAgentsClient = check new(AI_AGENTS_URL);

// Create HTTP client for Whisper service
http:Client whisperClient = check new(WHISPER_SERVICE_URL);

// Request and Response types
public type ChatRequest record {
    string message;
    string? sessionId;
    int? userId;
};

public type ChatResponse record {
    int messageId;
    string response;
    string agentType;
    int confidenceScore;
    boolean requiresImmediateAttention;
    string emotionalState;
    string[] recommendations;
    boolean success;
    string? error;
};

// Voice-specific types
public type VoiceTranscribeRequest record {
    byte[] audioData;
    string? sessionId;
    int? userId;
    string format?; // "wav", "mp3", etc.
};

public type VoiceTranscribeResponse record {
    int voiceId;
    string transcribedText;
    string sessionId;
    float duration;
    boolean success;
    string? error;
};

public type VoiceChatRequest record {
    byte[] audioData;
    string? sessionId;
    int? userId;
    string format?;
};

public type VoiceChatResponse record {
    int voiceId;
    string transcribedText;
    string agentResponse;
    string agentType;
    int confidenceScore;
    boolean requiresImmediateAttention;
    string emotionalState;
    string[] recommendations;
    float transcriptionDuration;
    boolean success;
    string? error;
};

public type UserCreateRequest record {
    string name;
};

public type UserResponse record {
    int userId;
    string name;
    string? createdAt;
};

public type ChatHistoryResponse record {
    Chat[] chats;
    int totalCount;
    boolean success;
    string? error;
};

public type VoiceHistoryResponse record {
    Voice[] voices;
    int totalCount;
    boolean success;
    string? error;
};

// Initialize database on startup
function init() {
    initializeDatabase() is error ? log:printError("Failed to initialize database") : log:printInfo("Database initialized successfully");
}

// Main HTTP service
service / on new http:Listener(8080) {
    
    // Health check endpoint
    resource function get health() returns json {
        return {
            "status": "healthy",
            "service": "MindBridge Ballerina Backend with Voice",
            "ai_agents_url": AI_AGENTS_URL,
            "whisper_service_url": WHISPER_SERVICE_URL,
            "database_host": DB_HOST,
            "database_name": DB_NAME,
            "timestamp": "2025-08-19"
        };
    }
    
    // Test connection to all services
    resource function get test\-connection() returns json|error {
        json result = {
            "backend_status": "healthy",
            "database_connected": true
        };
        
        // Test AI agents
        do {
            http:Response response = check aiAgentsClient->get("/health");
            json healthData = check response.getJsonPayload();
            result = {
                ...result,
                "ai_agents_connection": "successful",
                "ai_agents_health": healthData
            };
        } on fail error e {
            result = {
                ...result,
                "ai_agents_connection": "failed",
                "ai_agents_error": e.message()
            };
        }
        
        // Test Whisper service
        do {
            http:Response response = check whisperClient->get("/health");
            json healthData = check response.getJsonPayload();
            result = {
                ...result,
                "whisper_connection": "successful",
                "whisper_health": healthData
            };
        } on fail error e {
            result = {
                ...result,
                "whisper_connection": "failed",
                "whisper_error": e.message()
            };
        }
        
        return result;
    }
    
    // ===== VOICE ENDPOINTS =====
    
    // Transcribe audio to text only (save to voice table)
    resource function post voice/transcribe(http:Caller caller, http:Request request) returns error? {
        do {
            // Extract multipart form data
            mime:Entity[] bodyParts = check request.getBodyParts();
            
            byte[] audioData = [];
            string sessionId = uuid:createType1AsString();
            int userId = 1; // Default user
            string format = "wav";
            
            // Process form parts
            foreach mime:Entity part in bodyParts {
                mime:ContentDisposition? contentDisposition = part.getContentDisposition();
                if contentDisposition is mime:ContentDisposition {
                    string fieldName = contentDisposition.name;
                    
                    if fieldName == "audio" {
                        audioData = check part.getByteArray();
                    } else if fieldName == "sessionId" {
                        sessionId = check part.getText();
                    } else if fieldName == "userId" {
                        userId = check int:fromString(check part.getText());
                    } else if fieldName == "format" {
                        format = check part.getText();
                    }
                }
            }
            
            // Validate required data
            if audioData.length() == 0 {
                http:Response errorResponse = new;
                errorResponse.statusCode = 400;
                errorResponse.setJsonPayload({"error": "No audio data provided"});
                check caller->respond(errorResponse);
                return;
            }
            
            log:printInfo("Processing voice transcription for session: " + sessionId);
            
            // Create multipart request for Whisper service
            mime:Entity audioEntity = new;
            audioEntity.setByteArray(audioData);
            audioEntity.setContentType("audio/" + format);
            audioEntity.setContentDisposition(mime:getContentDispositionObject("audio", filename = "audio." + format));
            
            http:Request whisperRequest = new;
            whisperRequest.setBodyParts([audioEntity], contentType = mime:MULTIPART_FORM_DATA);
            
            // Send to Whisper service
            http:Response whisperResponse = check whisperClient->post("/transcribe-realtime", whisperRequest);
            
            if whisperResponse.statusCode == 200 {
                json whisperResult = check whisperResponse.getJsonPayload();
                string transcribedText = check whisperResult.text;
                float duration = check whisperResult.duration;
                
                log:printInfo("Transcription successful: " + transcribedText);
                
                // Save to voice table
                int voiceId = check saveVoiceTranscription(userId, transcribedText, sessionId);
                
                VoiceTranscribeResponse response = {
                    voiceId: voiceId,
                    transcribedText: transcribedText,
                    sessionId: sessionId,
                    duration: duration,
                    success: true,
                    error: ()
                };
                
                http:Response httpResponse = new;
                httpResponse.setJsonPayload(response);
                check caller->respond(httpResponse);
                
            } else {
                string errorMsg = "Whisper service failed with status: " + whisperResponse.statusCode.toString();
                log:printError(errorMsg);
                
                VoiceTranscribeResponse errorResponse = {
                    voiceId: 0,
                    transcribedText: "",
                    sessionId: sessionId,
                    duration: 0.0,
                    success: false,
                    error: errorMsg
                };
                
                http:Response httpResponse = new;
                httpResponse.statusCode = 500;
                httpResponse.setJsonPayload(errorResponse);
                check caller->respond(httpResponse);
            }
            
        } on fail error e {
            log:printError("Voice transcription error: " + e.message());
            
            VoiceTranscribeResponse errorResponse = {
                voiceId: 0,
                transcribedText: "",
                sessionId: "error",
                duration: 0.0,
                success: false,
                error: e.message()
            };
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 500;
            httpResponse.setJsonPayload(errorResponse);
            check caller->respond(httpResponse);
        }
    }
    
    // Complete voice chat: Speech → Text → AI Agent → Save Response
    resource function post voice/chat(http:Caller caller, http:Request request) returns error? {
        do {
            // Extract multipart form data
            mime:Entity[] bodyParts = check request.getBodyParts();
            
            byte[] audioData = [];
            string sessionId = uuid:createType1AsString();
            int userId = 1; // Default user
            string format = "wav";
            
            // Process form parts
            foreach mime:Entity part in bodyParts {
                mime:ContentDisposition? contentDisposition = part.getContentDisposition();
                if contentDisposition is mime:ContentDisposition {
                    string fieldName = contentDisposition.name;
                    
                    if fieldName == "audio" {
                        audioData = check part.getByteArray();
                    } else if fieldName == "sessionId" {
                        sessionId = check part.getText();
                    } else if fieldName == "userId" {
                        userId = check int:fromString(check part.getText());
                    } else if fieldName == "format" {
                        format = check part.getText();
                    }
                }
            }
            
            // Validate required data
            if audioData.length() == 0 {
                http:Response errorResponse = new;
                errorResponse.statusCode = 400;
                errorResponse.setJsonPayload({"error": "No audio data provided"});
                check caller->respond(errorResponse);
                return;
            }
            
            log:printInfo("Processing complete voice chat for session: " + sessionId);
            
            // Step 1: Transcribe audio
            mime:Entity audioEntity = new;
            audioEntity.setByteArray(audioData);
            audioEntity.setContentType("audio/" + format);
            audioEntity.setContentDisposition(mime:getContentDispositionObject("audio", filename = "audio." + format));
            
            http:Request whisperRequest = new;
            whisperRequest.setBodyParts([audioEntity], contentType = mime:MULTIPART_FORM_DATA);
            
            http:Response whisperResponse = check whisperClient->post("/transcribe-realtime", whisperRequest);
            
            if whisperResponse.statusCode != 200 {
                string errorMsg = "Whisper service failed with status: " + whisperResponse.statusCode.toString();
                log:printError(errorMsg);
                
                http:Response errorResponse = new;
                errorResponse.statusCode = 500;
                errorResponse.setJsonPayload({"error": errorMsg});
                check caller->respond(errorResponse);
                return;
            }
            
            json whisperResult = check whisperResponse.getJsonPayload();
            string transcribedText = check whisperResult.text;
            float transcriptionDuration = check whisperResult.duration;
            
            log:printInfo("Voice transcription: " + transcribedText);
            
            // Step 2: Save voice transcription
            int voiceId = check saveVoiceTranscription(userId, transcribedText, sessionId);
            
            // Step 3: Send to AI agents
            json agentRequest = {
                "sessionId": sessionId,
                "message": transcribedText,
                "sessionHistory": [],
                "userProfile": {"name": "Voice User", "userId": userId.toString()},
                "context": {"source": "voice_chat", "voice_id": voiceId}
            };
            
            http:Response agentResponse = check aiAgentsClient->post("/process", agentRequest);
            
            if agentResponse.statusCode == 200 {
                json agentResponseJson = check agentResponse.getJsonPayload();
                json resultJson = check agentResponseJson.result;
                string agentResponseText = check resultJson.response;
                
                log:printInfo("AI Agent response: " + agentResponseText);
                
                // Step 4: Save agent response to voice table
                check saveVoiceAgentResponse(voiceId, agentResponseText);
                
                // Step 5: Create successful response
                VoiceChatResponse response = {
                    voiceId: voiceId,
                    transcribedText: transcribedText,
                    agentResponse: agentResponseText,
                    agentType: check resultJson.agentType,
                    confidenceScore: check resultJson.confidenceScore,
                    requiresImmediateAttention: check resultJson.requiresImmediateAttention,
                    emotionalState: check resultJson.emotionalState,
                    recommendations: check resultJson.recommendations,
                    transcriptionDuration: transcriptionDuration,
                    success: true,
                    error: ()
                };
                
                http:Response httpResponse = new;
                httpResponse.setJsonPayload(response);
                check caller->respond(httpResponse);
                
            } else {
                string errorMsg = "AI agents failed with status: " + agentResponse.statusCode.toString();
                log:printError(errorMsg);
                
                // Save error response
                check saveVoiceAgentResponse(voiceId, "Error: Unable to process request");
                
                VoiceChatResponse errorResponse = {
                    voiceId: voiceId,
                    transcribedText: transcribedText,
                    agentResponse: "Sorry, I'm having trouble processing your message right now.",
                    agentType: "error",
                    confidenceScore: 0,
                    requiresImmediateAttention: false,
                    emotionalState: "error",
                    recommendations: [],
                    transcriptionDuration: transcriptionDuration,
                    success: false,
                    error: errorMsg
                };
                
                http:Response httpResponse = new;
                httpResponse.statusCode = 500;
                httpResponse.setJsonPayload(errorResponse);
                check caller->respond(httpResponse);
            }
            
        } on fail error e {
            log:printError("Voice chat error: " + e.message());
            
            VoiceChatResponse errorResponse = {
                voiceId: 0,
                transcribedText: "",
                agentResponse: "Sorry, there was an internal error processing your voice message.",
                agentType: "error",
                confidenceScore: 0,
                requiresImmediateAttention: false,
                emotionalState: "error",
                recommendations: [],
                transcriptionDuration: 0.0,
                success: false,
                error: e.message()
            };
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 500;
            httpResponse.setJsonPayload(errorResponse);
            check caller->respond(httpResponse);
        }
    }
    
    // Get voice history for a user
    resource function get users/[int userId]/voice(int? 'limit = 50) returns VoiceHistoryResponse {
        do {
            Voice[] voices = check getVoiceHistory(userId, 'limit);
            
            return {
                voices: voices,
                totalCount: voices.length(),
                success: true,
                error: ()
            };
            
        } on fail error e {
            log:printError("Get voice history error: " + e.message());
            return {
                voices: [],
                totalCount: 0,
                success: false,
                error: e.message()
            };
        }
    }
    
    // Get voice conversation by session
    resource function get sessions/[string sessionId]/voice() returns VoiceHistoryResponse {
        do {
            Voice[] voices = check getVoiceBySession(sessionId);
            
            return {
                voices: voices,
                totalCount: voices.length(),
                success: true,
                error: ()
            };
            
        } on fail error e {
            log:printError("Get session voice error: " + e.message());
            return {
                voices: [],
                totalCount: 0,
                success: false,
                error: e.message()
            };
        }
    }
    
    // ===== EXISTING ENDPOINTS (USER & CHAT) =====
    // === USER ENDPOINTS ===
    
    // Create a new user
    resource function post users(http:Caller caller, http:Request request) returns error? {
        do {
            json payload = check request.getJsonPayload();
            string name = check payload.name;
            
            int userId = check createUser(name);
            User user = check getUserById(userId);
            
            UserResponse userResponse = {
                userId: userId,
                name: user.name,
                createdAt: user.created_at.toString()
            };
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 201;
            httpResponse.setJsonPayload(userResponse);
            check caller->respond(httpResponse);
            
        } on fail error e {
            log:printError("Create user error: " + e.message());
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Failed to create user: " + e.message()});
            check caller->respond(errorResponse);
        }
    }
    
    // Get all users
    resource function get users() returns User[]|error {
        return getAllUsers();
    }
    
    // Get user by ID
    resource function get users/[int userId]() returns User|error {
        return getUserById(userId);
    }
    
    // === CHAT ENDPOINTS ===
    
    // Chat endpoint with database integration
    resource function post chat(http:Caller caller, http:Request request) returns error? {
        do {
            // Parse the incoming JSON request
            json payload = check request.getJsonPayload();
            
            string message = check payload.message;
            string sessionId = payload.sessionId is string ? <string>payload.sessionId : uuid:createType1AsString();
            int userId = payload.userId is int ? <int>payload.userId : 1; // Default to user 1 for now
            
            log:printInfo("Received chat message: " + message);
            log:printInfo("Session ID: " + sessionId);
            log:printInfo("User ID: " + userId.toString());
            
            // Save user message to database
            int messageId = check saveUserMessage(userId, message, sessionId);
            
            // Prepare request for AI agents
            json agentRequest = {
                "sessionId": sessionId,
                "message": message,
                "sessionHistory": [],
                "userProfile": {"name": "User", "userId": userId.toString()},
                "context": {"source": "ballerina_backend"}
            };
            
            log:printInfo("Sending request to AI agents...");
            
            // Send request to AI agents
            http:Response agentResponse = check aiAgentsClient->post("/process", agentRequest);
            
            if agentResponse.statusCode == 200 {
                json agentResponseJson = check agentResponse.getJsonPayload();
                log:printInfo("Received response from AI agents");
                
                // Extract response from the result field
                json resultJson = check agentResponseJson.result;
                string agentResponseText = check resultJson.response;
                
                // Save agent response to database
                check saveAgentResponse(messageId, agentResponseText);
                
                // Create successful response
                ChatResponse chatResponse = {
                    messageId: messageId,
                    response: agentResponseText,
                    agentType: check resultJson.agentType,
                    confidenceScore: check resultJson.confidenceScore,
                    requiresImmediateAttention: check resultJson.requiresImmediateAttention,
                    emotionalState: check resultJson.emotionalState,
                    recommendations: check resultJson.recommendations,
                    success: true,
                    error: ()
                };
                
                http:Response httpResponse = new;
                httpResponse.setJsonPayload(chatResponse);
                check caller->respond(httpResponse);
                
                log:printInfo("Response sent successfully");
                
            } else {
                // Handle error from AI agents but still save the attempt
                string errorMsg = "AI agents returned status: " + agentResponse.statusCode.toString();
                log:printError(errorMsg);
                
                check saveAgentResponse(messageId, "Error: Unable to process request");
                
                ChatResponse errorResponse = {
                    messageId: messageId,
                    response: "Sorry, I'm having trouble processing your message right now.",
                    agentType: "error",
                    confidenceScore: 0,
                    requiresImmediateAttention: false,
                    emotionalState: "error",
                    recommendations: [],
                    success: false,
                    error: errorMsg
                };
                
                http:Response httpResponse = new;
                httpResponse.statusCode = 500;
                httpResponse.setJsonPayload(errorResponse);
                check caller->respond(httpResponse);
            }
            
        } on fail error e {
            log:printError("Chat endpoint error: " + e.message());
            
            ChatResponse errorResponse = {
                messageId: 0,
                response: "Sorry, there was an internal error processing your message.",
                agentType: "error", 
                confidenceScore: 0,
                requiresImmediateAttention: false,
                emotionalState: "error",
                recommendations: [],
                success: false,
                error: e.message()
            };
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 500;
            httpResponse.setJsonPayload(errorResponse);
            check caller->respond(httpResponse);
        }
    }
    
    // Get chat history for a user
    resource function get users/[int userId]/chats(int? 'limit = 50) returns ChatHistoryResponse {
        do {
            Chat[] chats = check getChatHistory(userId, 'limit);
            
            return {
                chats: chats,
                totalCount: chats.length(),
                success: true,
                error: ()
            };
            
        } on fail error e {
            log:printError("Get chat history error: " + e.message());
            return {
                chats: [],
                totalCount: 0,
                success: false,
                error: e.message()
            };
        }
    }
    
    // Get chats by session ID
    resource function get sessions/[string sessionId]/chats() returns ChatHistoryResponse {
        do {
            Chat[] chats = check getChatsBySession(sessionId);
            
            return {
                chats: chats,
                totalCount: chats.length(),
                success: true,
                error: ()
            };
            
        } on fail error e {
            log:printError("Get session chats error: " + e.message());
            return {
                chats: [],
                totalCount: 0,
                success: false,
                error: e.message()
            };
        }
    }
    
    // Save user message endpoint (separate)
    resource function post messages(http:Caller caller, http:Request request) returns error? {
        do {
            json payload = check request.getJsonPayload();
            
            int userId = check payload.userId;
            string message = check payload.message;
            string sessionId = payload.sessionId is string ? <string>payload.sessionId : uuid:createType1AsString();
            
            int messageId = check saveUserMessage(userId, message, sessionId);
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 201;
            httpResponse.setJsonPayload({
                "messageId": messageId,
                "success": true,
                "message": "User message saved successfully"
            });
            check caller->respond(httpResponse);
            
        } on fail error e {
            log:printError("Save message error: " + e.message());
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Failed to save message: " + e.message()});
            check caller->respond(errorResponse);
        }
    }
    
    // Save agent response endpoint (separate)
    resource function put messages/[int messageId]/response(http:Caller caller, http:Request request) returns error? {
        do {
            json payload = check request.getJsonPayload();
            string response = check payload.response;
            
            check saveAgentResponse(messageId, response);
            
            http:Response httpResponse = new;
            httpResponse.setJsonPayload({
                "success": true,
                "message": "Agent response saved successfully"
            });
            check caller->respond(httpResponse);
            
        } on fail error e {
            log:printError("Save response error: " + e.message());
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Failed to save response: " + e.message()});
            check caller->respond(errorResponse);
        }
    }
    
}