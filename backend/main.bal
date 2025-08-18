import ballerina/http;
import ballerina/log;
import ballerina/uuid;

// Configuration for AI agents URL
configurable string AI_AGENTS_URL = "http://localhost:8001";

// Create HTTP client for AI agents
http:Client aiAgentsClient = check new(AI_AGENTS_URL);

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
            "service": "MindBridge Ballerina Backend with Database",
            "ai_agents_url": AI_AGENTS_URL,
            "timestamp": "2025-08-19"
        };
    }
    
    // Test connection to AI agents
    resource function get test\-connection() returns json|error {
        do {
            http:Response response = check aiAgentsClient->get("/health");
            json healthData = check response.getJsonPayload();
            
            return {
                "backend_status": "healthy",
                "ai_agents_connection": "successful",
                "ai_agents_health": healthData
            };
        } on fail error e {
            return {
                "backend_status": "healthy",
                "ai_agents_connection": "failed",
                "error": e.message()
            };
        }
    }
    
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