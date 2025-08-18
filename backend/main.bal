import ballerina/http;
import ballerina/log;

// Configuration for AI agents URL
configurable string AI_AGENTS_URL = "http://localhost:8001";

// Create HTTP client for AI agents
http:Client aiAgentsClient = check new(AI_AGENTS_URL);

// Request and Response types
public type ChatRequest record {
    string message;
    string? sessionId;
    string? userId;
};

public type ChatResponse record {
    string response;
    string agentType;
    int confidenceScore;
    boolean requiresImmediateAttention;
    string emotionalState;
    string[] recommendations;
    boolean success;
    string? error;
};

// Main HTTP service
service / on new http:Listener(8080) {
    
    // Health check endpoint
    resource function get health() returns json {
        return {
            "status": "healthy",
            "service": "MindBridge Ballerina Backend",
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
    
    // Chat endpoint - send text to AI agents and get response
    resource function post chat(http:Caller caller, http:Request request) returns error? {
        do {
            // Parse the incoming JSON request
            json payload = check request.getJsonPayload();
            
            string message = check payload.message;
            string sessionId = payload.sessionId is string ? <string>payload.sessionId : "default-session";
            string userId = payload.userId is string ? <string>payload.userId : "default-user";
            
            log:printInfo("Received chat message: " + message);
            log:printInfo("Session ID: " + sessionId);
            
            // Prepare request for AI agents (matching their expected format)
            json agentRequest = {
                "sessionId": sessionId,
                "message": message,
                "sessionHistory": [],
                "userProfile": {"name": "User", "userId": userId},
                "context": {"source": "ballerina_backend"}
            };
            
            log:printInfo("Sending request to AI agents...");
            
            // Send request to AI agents
            http:Response agentResponse = check aiAgentsClient->post("/process", agentRequest);
            
            if agentResponse.statusCode == 200 {
                json agentResponseJson = check agentResponse.getJsonPayload();
                log:printInfo("Received response from AI agents");
                
                // Create successful response
                ChatResponse chatResponse = {
                    response: check agentResponseJson.response,
                    agentType: check agentResponseJson.agentType,
                    confidenceScore: check agentResponseJson.confidenceScore,
                    requiresImmediateAttention: check agentResponseJson.requiresImmediateAttention,
                    emotionalState: check agentResponseJson.emotionalState,
                    recommendations: check agentResponseJson.recommendations,
                    success: true,
                    error: ()
                };
                
                http:Response httpResponse = new;
                httpResponse.setJsonPayload(chatResponse);
                check caller->respond(httpResponse);
                
                log:printInfo("Response sent successfully");
                
            } else {
                // Handle error from AI agents
                string errorMsg = "AI agents returned status: " + agentResponse.statusCode.toString();
                log:printError(errorMsg);
                
                ChatResponse errorResponse = {
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
}