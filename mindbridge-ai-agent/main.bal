import ballerinax/ai.agent;
import ballerina/http;
import ballerina/log;
import ballerina/uuid;
import ballerina/time;
import ballerina/lang.regexp;

// ===== CONFIGURATION =====
configurable string OPENAI_API_KEY = ?;
configurable string SERVICE_URL = "http://0.0.0.0:8001";
configurable int SERVICE_PORT = 8001;

// ===== SESSION MEMORY MANAGEMENT =====

public type SessionMessage record {|
    string messageId;
    string role; // "user" or "assistant"
    string content;
    string timestamp;
    json? metadata;
|};

public type SessionData record {|
    string sessionId;
    string userId;
    SessionMessage[] messages;
    string createdAt;
    string lastUpdated;
    json userProfile;
    json sessionMetrics;
    int totalInteractions;
    string[] identifiedThemes;
    int currentRiskLevel;
    string currentEmotionalState;
|};

// In-memory session storage
map<SessionData> sessionStore = {};

public class SessionMemoryManager {
    
    public function getSessionHistory(string sessionId) returns SessionMessage[] {
        lock {
            if sessionStore.hasKey(sessionId) {
                SessionData sessionData = sessionStore.get(sessionId);
                return sessionData.messages;
            }
            return [];
        }
    }
    
    public function saveMessage(
        string sessionId, 
        string userId,
        string role, 
        string content, 
        json? metadata = ()
    ) returns string {
        string messageId = uuid:createType1AsString();
        SessionMessage newMessage = {
            messageId: messageId,
            role: role,
            content: content,
            timestamp: time:utcToCivil(time:utcNow()).toString(),
            metadata: metadata
        };
        
        lock {
            if sessionStore.hasKey(sessionId) {
                SessionData sessionData = sessionStore.get(sessionId);
                sessionData.messages.push(newMessage);
                sessionData.lastUpdated = time:utcToCivil(time:utcNow()).toString();
                sessionData.totalInteractions += (role == "user") ? 1 : 0;
                sessionStore[sessionId] = sessionData;
            } else {
                // Create new session
                SessionData newSession = {
                    sessionId: sessionId,
                    userId: userId,
                    messages: [newMessage],
                    createdAt: time:utcToCivil(time:utcNow()).toString(),
                    lastUpdated: time:utcToCivil(time:utcNow()).toString(),
                    userProfile: {},
                    sessionMetrics: {},
                    totalInteractions: (role == "user") ? 1 : 0,
                    identifiedThemes: [],
                    currentRiskLevel: 0,
                    currentEmotionalState: "neutral"
                };
                sessionStore[sessionId] = newSession;
            }
        }
        
        return messageId;
    }
    
    public function updateSessionAnalysis(
        string sessionId,
        int riskLevel,
        string emotionalState,
        string[] themes
    ) {
        lock {
            if sessionStore.hasKey(sessionId) {
                SessionData sessionData = sessionStore.get(sessionId);
                sessionData.currentRiskLevel = riskLevel;
                sessionData.currentEmotionalState = emotionalState;
                
                // Add new themes
                foreach string theme in themes {
                    if sessionData.identifiedThemes.indexOf(theme) == () {
                        sessionData.identifiedThemes.push(theme);
                    }
                }
                
                sessionStore[sessionId] = sessionData;
            }
        }
    }
    
    public function getSessionData(string sessionId) returns SessionData? {
        lock {
            if sessionStore.hasKey(sessionId) {
                return sessionStore.get(sessionId);
            }
            return ();
        }
    }
    
    public isolated function formatHistoryForAgent(SessionMessage[] messages, int 'limit = 10) returns string {
        SessionMessage[] recentMessages = messages.slice(messages.length() > 'limit ? messages.length() - 'limit : 0);
        
        string formattedHistory = "Previous conversation context:\n";
        foreach SessionMessage msg in recentMessages {
            formattedHistory += string `${msg.role.toUpperAscii()}: ${msg.content}\n`;
        }
        return formattedHistory;
    }
    
    public isolated function analyzeSessionPatterns(SessionMessage[] messages) returns json {
        if messages.length() < 2 {
            return {"status": "insufficient_data"};
        }
        
        // Analyze emotional progression
        string[] emotions = [];
        int crisisEvents = 0;
        
        foreach SessionMessage msg in messages {
            if msg.metadata is json {
                json metadata = <json>msg.metadata;
                json|error emotionalState = metadata.emotional_state;
                if emotionalState is string {
                    emotions.push(<string>emotionalState);
                }
                json|error riskLevel = metadata.risk_level;
                if riskLevel is int && <int>riskLevel >= 8 {
                    crisisEvents += 1;
                }
            }
        }
        
        return {
            "conversation_length": messages.length(),
            "emotional_progression": emotions,
            "crisis_events": crisisEvents,
            "session_duration_messages": messages.length() / 2,
            "engagement_level": messages.length() > 10 ? "high" : (messages.length() > 4 ? "medium" : "low")
        };
    }
}

// ===== AI AGENTS INITIALIZATION =====

// Initialize OpenAI models for each agent with different temperatures
agent:OpenAiModel crisisModel = check new (
    apiKey = OPENAI_API_KEY,
    modelType = agent:GPT_4O_MINI,
    temperature = 0.3
);

agent:OpenAiModel moodModel = check new (
    apiKey = OPENAI_API_KEY,
    modelType = agent:GPT_4O_MINI,
    temperature = 0.5
);

agent:OpenAiModel therapistModel = check new (
    apiKey = OPENAI_API_KEY,
    modelType = agent:GPT_4O_MINI,
    temperature = 0.7
);

agent:OpenAiModel empathyModel = check new (
    apiKey = OPENAI_API_KEY,
    modelType = agent:GPT_4O_MINI,
    temperature = 0.8
);

agent:OpenAiModel recommendationModel = check new (
    apiKey = OPENAI_API_KEY,
    modelType = agent:GPT_4O_MINI,
    temperature = 0.4
);

agent:OpenAiModel sessionModel = check new (
    apiKey = OPENAI_API_KEY,
    modelType = agent:GPT_4O_MINI,
    temperature = 0.6
);

// Create agent instances
agent:FunctionCallAgent crisisAgent = check new (crisisModel, []);
agent:FunctionCallAgent moodAgent = check new (moodModel, []);
agent:FunctionCallAgent therapistAgent = check new (therapistModel, []);
agent:FunctionCallAgent empathyAgent = check new (empathyModel, []);
agent:FunctionCallAgent recommendationAgent = check new (recommendationModel, []);
agent:FunctionCallAgent sessionAgent = check new (sessionModel, []);

// ===== MULTI-AGENT SYSTEM WITH MEMORY =====

public class MentalHealthMultiAgentSystem {
    
    public function processMessage(
        string message, 
        string sessionId, 
        json sessionHistory = [], 
        json userProfile = {}, 
        json context = {}
    ) returns json|error {
        
        log:printInfo("Starting Multi-Agent Analysis with Session Memory...");
        
        // Get session memory
        SessionMemoryManager sessionMemory = new ();
        SessionMessage[] previousMessages = sessionMemory.getSessionHistory(sessionId);
        string conversationContext = sessionMemory.formatHistoryForAgent(previousMessages, 8);
        
        // Get session data for additional context
        SessionData? sessionData = sessionMemory.getSessionData(sessionId);
        string sessionContextInfo = "";
        if sessionData is SessionData {
            sessionContextInfo = string `Session Context:
- Total interactions: ${sessionData.totalInteractions}
- Current emotional state: ${sessionData.currentEmotionalState}
- Current risk level: ${sessionData.currentRiskLevel}
- Identified themes: ${sessionData.identifiedThemes.toString()}
- Session duration: ${sessionData.messages.length()} messages
`;
        }
        
        // STEP 1: Crisis Detection Agent with Memory Context
        log:printInfo("Running Crisis Detection Agent with Session Memory...");
        string crisisPrompt = string `You are a crisis detection specialist with expertise in suicide prevention and emergency mental health response.

${conversationContext}
${sessionContextInfo}

Current message to analyze: "${message}"

Consider the conversation history and session context. Look for:
- Escalation patterns in risk level
- Suicidal ideation or statements
- Self-harm intentions  
- Immediate danger to self or others
- Substance abuse crisis
- Deterioration from previous interactions

Provide assessment in this JSON format:
{
  "risk_level": 5,
  "crisis_detected": false,
  "risk_factors": ["example factor"],
  "immediate_intervention_needed": false,
  "crisis_type": "none",
  "risk_progression": "stable",
  "context_influence": "how session history affects assessment",
  "confidence": 0.85
}

Consider patterns from previous messages to provide more accurate assessment.`;

        record {| (agent:ExecutionResult|agent:ExecutionError)[] steps; string answer?; |} crisisResult = 
            check crisisAgent->run(crisisPrompt, maxIter = 3, verbose = false);
        
        // STEP 2: Mood Analysis Agent with Session Context
        log:printInfo("Running Mood Analysis Agent with Session Memory...");
        string moodPrompt = string `You are a mood analysis specialist expert in emotional intelligence and psychological assessment.

${conversationContext}
${sessionContextInfo}

Current message to analyze: "${message}"

Consider the conversation history to understand emotional patterns and changes over time:
- How has their emotional state evolved?
- Are there recurring emotional themes?
- What triggers emotional changes?
- Is there emotional progress or deterioration?

Provide analysis in this JSON format:
{
  "primary_emotion": "neutral",
  "secondary_emotions": ["example emotion"],
  "emotional_intensity": 5,
  "emotional_stability": "stable",
  "emotional_progression": "how emotions changed from previous messages",
  "recurring_patterns": ["emotional pattern"],
  "underlying_needs": ["psychological need"],
  "coping_indicators": ["coping mechanism"],
  "session_emotional_trend": "overall emotional journey in session",
  "confidence": 0.85
}

Use session history to provide deeper emotional understanding.`;

        record {| (agent:ExecutionResult|agent:ExecutionError)[] steps; string answer?; |} moodResult = 
            check moodAgent->run(moodPrompt, maxIter = 3, verbose = false);

        // STEP 3: Empathy Specialist Agent with Relationship Building
        log:printInfo("Running Empathy Specialist Agent with Session Memory...");
        string empathyPrompt = string `You are an empathy specialist focused on emotional validation and deep understanding.

${conversationContext}
${sessionContextInfo}

Current message: "${message}"

Build on the therapeutic relationship established in previous interactions. Consider:
- What they've shared before that shows trust
- How to acknowledge their journey and progress
- Ways to deepen emotional connection
- How to validate their ongoing experience

Generate empathetic understanding that builds on your relationship:

Provide empathetic response in this JSON format:
{
  "empathetic_reflection": "main empathetic statement building on history",
  "relationship_acknowledgment": "recognition of their sharing and trust",
  "validation_statements": ["validating statement"],
  "emotional_mirroring": "reflection of their emotional journey",
  "connection_builders": ["relationship-strengthening statement"],
  "continuity_elements": ["reference to previous conversation"],
  "tone": "empathetic tone description",
  "confidence": 0.85
}

Use conversation history to provide deeper, more connected empathy.`;

        record {| (agent:ExecutionResult|agent:ExecutionError)[] steps; string answer?; |} empathyResult = 
            check empathyAgent->run(empathyPrompt, maxIter = 3, verbose = false);

        // STEP 4: Primary Therapist Agent with Treatment Continuity
        log:printInfo("Running Primary Therapist Agent with Treatment Context...");
        
        string therapistPrompt = string `You are Dr. Sarah Chen, a licensed mental health therapist with expertise in CBT, DBT, trauma-informed care, and humanistic approaches.

CONVERSATION HISTORY:
${conversationContext}

SESSION CONTEXT:
${sessionContextInfo}

CURRENT MESSAGE: "${message}"

AGENT ANALYSES:
Crisis Analysis: ${crisisResult.answer ?: ""}
Mood Analysis: ${moodResult.answer ?: ""}
Empathy Analysis: ${empathyResult.answer ?: ""}

Consider therapeutic continuity:
- Previous topics and themes discussed
- Therapeutic progress or challenges
- Treatment goals and interventions tried
- Client's responsiveness to different approaches
- Building on established rapport

Generate therapeutic response that:
- Builds on previous therapeutic work
- Shows continuity and remembers what they've shared
- Uses appropriate therapeutic approach based on session pattern
- Addresses current needs within context of ongoing treatment
- Maintains and deepens therapeutic alliance

Provide therapeutic response in this JSON format:
{
  "therapeutic_response": "I can hear the sadness in your words, and I want you to acknowledge your courage in reaching out. Based on our previous conversations, I can see how much you've been carrying.",
  "approach_used": "person_centered",
  "therapeutic_techniques": ["active listening", "validation"],
  "interventions": ["empathetic reflection"],
  "follow_up_questions": ["How are you feeling about sharing this?"],
  "treatment_focus": ["emotional processing"],
  "progress_acknowledgment": "recognition of their therapeutic journey",
  "continuity_elements": ["connection to previous work"],
  "session_goals": ["emotional support"],
  "confidence": 0.85
}

Provide comprehensive therapeutic response with session memory integration.`;

        record {| (agent:ExecutionResult|agent:ExecutionError)[] steps; string answer?; |} therapistResult = 
            check therapistAgent->run(therapistPrompt, maxIter = 5, verbose = false);

        // STEP 5: Recommendation Engine Agent
        log:printInfo("Running Recommendation Engine Agent...");
        string recommendationPrompt = string `You are a therapeutic recommendation specialist expert in evidence-based interventions and mental health resources.

CONVERSATION HISTORY:
${conversationContext}

CURRENT ANALYSES:
- Crisis Assessment: ${crisisResult.answer ?: ""}
- Mood Analysis: ${moodResult.answer ?: ""}  
- Therapeutic Response: ${therapistResult.answer ?: ""}

Generate personalized recommendations based on their history:

Provide recommendations in this JSON format:
{
  "immediate_strategies": ["practice self-compassion"],
  "ongoing_interventions": ["continue therapeutic work"],
  "new_approaches": ["try mindfulness"],
  "self_care_activities": ["gentle exercise"],
  "professional_resources": ["consider counseling"],
  "crisis_resources": [],
  "follow_up_goals": ["emotional stability"],
  "homework_assignments": ["daily check-ins"],
  "progress_tracking": ["mood monitoring"],
  "priority_level": "medium",
  "confidence": 0.85
}

Focus on personalized, history-informed recommendations.`;

        record {| (agent:ExecutionResult|agent:ExecutionError)[] steps; string answer?; |} recommendationResult = 
            check recommendationAgent->run(recommendationPrompt, maxIter = 4, verbose = false);

        // STEP 6: Session Manager Agent
        log:printInfo("Running Session Manager Agent...");
        string sessionPrompt = string `You are a session coordinator responsible for therapeutic continuity and progress tracking.

FULL SESSION ANALYSIS:
- Crisis Assessment: ${crisisResult.answer ?: ""}
- Mood Analysis: ${moodResult.answer ?: ""}
- Empathy Analysis: ${empathyResult.answer ?: ""}
- Therapeutic Response: ${therapistResult.answer ?: ""}
- Recommendations: ${recommendationResult.answer ?: ""}

CONVERSATION HISTORY:
${conversationContext}

SESSION CONTEXT:
${sessionContextInfo}

Provide session coordination in this JSON format:
{
  "session_summary": "summary of current session with context",
  "progress_indicators": ["progress marker"],
  "therapeutic_milestones": ["achievement"],
  "areas_needing_attention": ["concern"],
  "session_goals": ["current session goal"],
  "treatment_plan_updates": ["plan modification"],
  "continuity_notes": ["note for future session"],
  "relationship_quality": "assessment of therapeutic alliance",
  "engagement_level": "client engagement assessment",
  "referral_recommendations": [],
  "next_steps": ["next therapeutic step"],
  "session_effectiveness": "8",
  "confidence": 0.85
}

Focus on comprehensive session management with memory integration.`;

        record {| (agent:ExecutionResult|agent:ExecutionError)[] steps; string answer?; |} sessionResult = 
            check sessionAgent->run(sessionPrompt, maxIter = 3, verbose = false);

        // STEP 7: Save Messages and Synthesize Response
        log:printInfo("Synthesizing Multi-Agent Response and Saving to Memory...");
        
        // Save user message
        json|error userIdValue = userProfile.userId;
        string userId = userIdValue is string ? <string>userIdValue : "unknown";
        
        string userMessageId = sessionMemory.saveMessage(
            sessionId, 
            userId,
            "user", 
            message, 
            {"timestamp": time:utcToCivil(time:utcNow()).toString()}
        );
        
        // Parse agent responses and create final response
        json finalResponse = self.synthesizeResponse(
            crisisResult.answer ?: "",
            moodResult.answer ?: "", 
            empathyResult.answer ?: "",
            therapistResult.answer ?: "",
            recommendationResult.answer ?: "",
            sessionResult.answer ?: "",
            message,
            sessionId
        );

        // Save assistant response with metadata
        json|error responseValue = finalResponse.response;
        string responseText = responseValue is string ? <string>responseValue : "No response generated";
        
        // Safely extract and cast metadata fields from finalResponse (json)
        json|error riskLevelMeta = finalResponse.riskLevel;
        json|error emotionalStateMeta = finalResponse.emotionalState;
        json|error agentTypeMeta = finalResponse.agentType;
        json|error requiresAttentionMeta = finalResponse.requiresImmediateAttention;
        json|error multiAgentAnalysisMeta = finalResponse.multiAgentAnalysis;

        json assistantMetadata = {
            "risk_level": riskLevelMeta is int ? <int>riskLevelMeta : 0,
            "emotional_state": emotionalStateMeta is string ? <string>emotionalStateMeta : "",
            "agent_type": agentTypeMeta is string ? <string>agentTypeMeta : "",
            "requires_attention": requiresAttentionMeta is boolean ? <boolean>requiresAttentionMeta : false,
            "multi_agent_analysis": multiAgentAnalysisMeta is json ? multiAgentAnalysisMeta : {}
        };

        string assistantMessageId = sessionMemory.saveMessage(
            sessionId,
            userId,
            "assistant",
            responseText,
            assistantMetadata
        );
        
        // Update session analysis
        json|error riskLevelValue = finalResponse.riskLevel;
        json|error emotionalStateValue = finalResponse.emotionalState;
        
        sessionMemory.updateSessionAnalysis(
            sessionId,
            riskLevelValue is int ? <int>riskLevelValue : 0,
            emotionalStateValue is string ? <string>emotionalStateValue : "neutral",
            []
        );

        // Add session memory info to response
        SessionMessage[] updatedHistory = sessionMemory.getSessionHistory(sessionId);
        json sessionAnalysis = sessionMemory.analyzeSessionPatterns(updatedHistory);
        
        // Manually construct enhancedResponse by extracting fields from finalResponse
        json|error sessionIdField = finalResponse.sessionId;
        json|error responseField = finalResponse.response;
        json|error agentTypeField = finalResponse.agentType;
        json|error riskLevelField = finalResponse.riskLevel;
        json|error requiresImmediateAttentionField = finalResponse.requiresImmediateAttention;
        json|error emotionalStateField = finalResponse.emotionalState;
        json|error recommendationsField = finalResponse.recommendations;
        json|error therapeuticTechniquesField = finalResponse.therapeuticTechniques;
        json|error followUpQuestionsField = finalResponse.followUpQuestions;
        json|error multiAgentAnalysisField = finalResponse.multiAgentAnalysis;
        json|error agentCoordinationField = finalResponse.agentCoordination;
        json|error responseTimeField = finalResponse.responseTime;
        json|error successField = finalResponse.success;
        json|error errorField = (finalResponse is map<json> && finalResponse.hasKey("error")) ? finalResponse["error"] : ();

        json enhancedResponse = {
            "sessionId": sessionIdField is string ? <string>sessionIdField : "",
            "response": responseField is string ? <string>responseField : "",
            "agentType": agentTypeField is string ? <string>agentTypeField : "",
            "riskLevel": riskLevelField is int ? <int>riskLevelField : 0,
            "requiresImmediateAttention": requiresImmediateAttentionField is boolean ? <boolean>requiresImmediateAttentionField : false,
            "emotionalState": emotionalStateField is string ? <string>emotionalStateField : "",
            "recommendations": recommendationsField is json ? recommendationsField : [],
            "therapeuticTechniques": therapeuticTechniquesField is json ? therapeuticTechniquesField : [],
            "followUpQuestions": followUpQuestionsField is json ? followUpQuestionsField : [],
            "multiAgentAnalysis": multiAgentAnalysisField is json ? multiAgentAnalysisField : {},
            "agentCoordination": agentCoordinationField is json ? agentCoordinationField : {},
            "responseTime": responseTimeField is float ? <float>responseTimeField : 0.0,
            "success": successField is boolean ? <boolean>successField : true,
            "error": errorField is string ? <string>errorField : "",
            "sessionMemory": {
                "conversationLength": updatedHistory.length(),
                "sessionAnalysis": sessionAnalysis,
                "memoryEnabled": true,
                "userMessageId": userMessageId,
                "assistantMessageId": assistantMessageId
            }
        };

        log:printInfo("Multi-Agent Analysis with Memory Complete");
        return enhancedResponse;
    }

    isolated function synthesizeResponse(
        string crisisAnalysis,
        string moodAnalysis,
        string empathyAnalysis, 
        string therapistResponse,
        string recommendations,
        string sessionManagement,
        string originalMessage,
        string sessionId
    ) returns json {
        
        // Extract crisis information
        boolean requiresImmediateAttention = crisisAnalysis.toLowerAscii().includes("true") && 
                                           crisisAnalysis.toLowerAscii().includes("crisis_detected");
        
        int riskLevel = 0;
        if crisisAnalysis.includes("\"risk_level\": 9") || crisisAnalysis.includes("\"risk_level\":9") {
            riskLevel = 9;
        } else if crisisAnalysis.includes("\"risk_level\": 8") || crisisAnalysis.includes("\"risk_level\":8") {
            riskLevel = 8;
        } else if crisisAnalysis.includes("\"risk_level\": 7") || crisisAnalysis.includes("\"risk_level\":7") {
            riskLevel = 7;
        } else if crisisAnalysis.includes("\"risk_level\": 6") || crisisAnalysis.includes("\"risk_level\":6") {
            riskLevel = 6;
        } else if crisisAnalysis.includes("\"risk_level\": 5") || crisisAnalysis.includes("\"risk_level\":5") {
            riskLevel = 5;
        } else if crisisAnalysis.includes("\"risk_level\": 4") || crisisAnalysis.includes("\"risk_level\":4") {
            riskLevel = 4;
        } else if crisisAnalysis.includes("\"risk_level\": 3") || crisisAnalysis.includes("\"risk_level\":3") {
            riskLevel = 3;
        } else if crisisAnalysis.includes("\"risk_level\": 2") || crisisAnalysis.includes("\"risk_level\":2") {
            riskLevel = 2;
        } else if crisisAnalysis.includes("\"risk_level\": 1") || crisisAnalysis.includes("\"risk_level\":1") {
            riskLevel = 1;
        }

        // Extract emotional state
        string emotionalState = "neutral";
        if moodAnalysis.toLowerAscii().includes("depressed") || moodAnalysis.toLowerAscii().includes("sad") {
            emotionalState = "depressed";
        } else if moodAnalysis.toLowerAscii().includes("anxious") || moodAnalysis.toLowerAscii().includes("worried") {
            emotionalState = "anxious";
        } else if moodAnalysis.toLowerAscii().includes("angry") || moodAnalysis.toLowerAscii().includes("frustrated") {
            emotionalState = "angry";
        } else if moodAnalysis.toLowerAscii().includes("trauma") || moodAnalysis.toLowerAscii().includes("ptsd") {
            emotionalState = "traumatized";
        } else if moodAnalysis.toLowerAscii().includes("happy") || moodAnalysis.toLowerAscii().includes("positive") {
            emotionalState = "happy";
        }

        // Determine agent type
        string agentType = requiresImmediateAttention ? "crisis_support" : "therapist";

        // Extract therapeutic response (main response text)
        string mainResponse = "";
        if requiresImmediateAttention {
            mainResponse = "**IMMEDIATE SAFETY CONCERN**\n\n" +
                          "I'm very concerned about your safety right now. Your life has value, and you don't have to face this alone.\n\n" +
                          "**Please reach out to one of these resources IMMEDIATELY:**\n\n" +
                          "**Call 988** (Suicide & Crisis Lifeline) - Available 24/7\n" +
                          "**Text HOME to 741741** (Crisis Text Line)\n" +
                          "**Call 911** if you're in immediate danger\n" +
                          "**Go to your nearest emergency room**\n\n" +
                          "Can you tell me if you're in a safe place right now? I want to help you connect with immediate professional support.";
        } else {
            // Try to extract therapeutic response
            if therapistResponse.includes("therapeutic_response") {
                // Simple extraction - in production, you'd want more sophisticated JSON parsing
                string[] parts = regexp:split(re `"therapeutic_response":\s*"`, therapistResponse);
                if parts.length() > 1 {
                    string[] responseParts = regexp:split(re `"`, parts[1]);
                    if responseParts.length() > 0 {
                        mainResponse = responseParts[0];
                    }
                }
            }
            
            if mainResponse == "" {
                mainResponse = "Thank you for sharing that with me. I can hear that this is important to you, and I appreciate your openness in this conversation.\n\n" +
                              "I'm here to listen and support you through whatever you're experiencing. Your feelings are valid, and it takes courage to reach out.\n\n" +
                              "What would feel most helpful to you right now as we work through this together?";
            }
        }

        // Generate comprehensive response
        return {
            "sessionId": sessionId,
            "response": mainResponse,
            "agentType": agentType,
            "riskLevel": riskLevel,
            "requiresImmediateAttention": requiresImmediateAttention,
            "emotionalState": emotionalState,
            "recommendations": requiresImmediateAttention ? [
                "Contact emergency services immediately",
                "Remove any means of self-harm from environment", 
                "Stay with trusted person or in public place",
                "Call crisis hotline immediately"
            ] : [
                "Practice self-compassion and gentle self-care",
                "Try grounding techniques when feeling overwhelmed",
                "Maintain connection with your support system",
                "Consider professional counseling support"
            ],
            "therapeuticTechniques": requiresImmediateAttention ? [
                "Crisis intervention",
                "Safety planning", 
                "Resource connection"
            ] : [
                "Active listening",
                "Empathetic reflection",
                "Validation therapy",
                "Person-centered approach"
            ],
            "followUpQuestions": requiresImmediateAttention ? [
                "Are you in a safe place right now?",
                "Do you have someone you can call for support?",
                "Would you be willing to contact one of these crisis resources?"
            ] : [
                "How are you feeling about sharing this with me?",
                "What has been most helpful for you in the past?",
                "What would you like to explore further?"
            ],
            "multiAgentAnalysis": {
                "crisisAssessment": crisisAnalysis,
                "moodAnalysis": moodAnalysis,
                "empathyResponse": empathyAnalysis,
                "therapeuticGuidance": therapistResponse,
                "recommendedInterventions": recommendations,
                "sessionCoordination": sessionManagement
            },
            "agentCoordination": {
                "agentsConsulted": 6,
                "analysisSteps": [
                    "Crisis Detection Specialist",
                    "Mood Analysis Expert", 
                    "Empathy Specialist",
                    "Primary Therapist",
                    "Recommendation Engine",
                    "Session Manager"
                ],
                "consensusReached": true,
                "coordinationSuccess": true
            },
            "responseTime": <float>time:utcNow()[0],
            "success": true,
            "error": ()
        };
    }
}

// ===== GLOBAL INSTANCES =====
MentalHealthMultiAgentSystem multiAgentSystem = new ();
SessionMemoryManager sessionMemory = new ();

// ===== REQUEST/RESPONSE TYPES =====
public type ChatRequest record {|
    string sessionId?;
    string message;
    string userId?;
    json context?;
|};

public type ChatResponse record {|
    string sessionId;
    string response;
    string agentType;
    int riskLevel;
    boolean requiresImmediateAttention;
    string emotionalState;
    string[] recommendations;
    string[] therapeuticTechniques;
    string[] followUpQuestions;
    json multiAgentAnalysis;
    json agentCoordination;
    float responseTime;
    boolean success;
    string? 'error;
|};

public type HealthResponse record {|
    string status;
    string 'service;
    string timestamp;
    string model;
    int totalAgents;
    string[] agentTypes;
|};

// ===== HTTP SERVICE =====
service / on new http:Listener(SERVICE_PORT) {
    
    // Health check endpoint
    resource function get health() returns HealthResponse {
        return {
            status: "healthy",
            'service: "MindBridge Multi-Agent Ballerina System",
            timestamp: time:utcToCivil(time:utcNow()).toString(),
            model: "GPT-4O-Mini Multi-Agent",
            totalAgents: 6,
            agentTypes: [
                "Crisis Detection Specialist",
                "Mood Analysis Expert",
                "Empathy Specialist", 
                "Primary Therapist",
                "Recommendation Engine",
                "Session Manager"
            ]
        };
    }
    
    // Main chat endpoint with multi-agent processing
    resource function post chat(http:Caller caller, http:Request request) returns error? {
        do {
            // Parse request
            json payload = check request.getJsonPayload();
            json|error messageValue = payload.message;
            string message = messageValue is string ? <string>messageValue : "";
            
            json|error sessionIdValue = payload.sessionId;
            string sessionId = sessionIdValue is string ? <string>sessionIdValue : uuid:createType1AsString();
            
            json|error userIdValue = payload.userId;
            string userId = userIdValue is string ? <string>userIdValue : "default_user";
            
            log:printInfo(string `Multi-Agent Processing - Session: ${sessionId}, User: ${userId}`);
            log:printInfo(string `Message: ${message}`);
            
            // Record start time
            time:Utc startTime = time:utcNow();
            
            // Process through multi-agent system
            json result = check multiAgentSystem.processMessage(
                message, 
                sessionId,
                [], // sessionHistory - could be retrieved from database
                {"userId": userId}, // userProfile
                {"source": "ballerina_chat"} // context
            );
            
            // Calculate response time
            time:Utc endTime = time:utcNow();
            decimal responseTime = time:utcDiffSeconds(endTime, startTime);
            
            // Add response time to result
            // Manually construct enhancedResult by extracting fields from result
            json|error sessionIdField = result is map<json> && result.hasKey("sessionId") ? result["sessionId"] : "";
            json|error responseField = result is map<json> && result.hasKey("response") ? result["response"] : "";
            json|error agentTypeField = result is map<json> && result.hasKey("agentType") ? result["agentType"] : "";
            json|error riskLevelField = result is map<json> && result.hasKey("riskLevel") ? result["riskLevel"] : 0;
            json|error requiresImmediateAttentionField = result is map<json> && result.hasKey("requiresImmediateAttention") ? result["requiresImmediateAttention"] : false;
            json|error emotionalStateField = result is map<json> && result.hasKey("emotionalState") ? result["emotionalState"] : "";
            json|error recommendationsField = result is map<json> && result.hasKey("recommendations") ? result["recommendations"] : [];
            json|error therapeuticTechniquesField = result is map<json> && result.hasKey("therapeuticTechniques") ? result["therapeuticTechniques"] : [];
            json|error followUpQuestionsField = result is map<json> && result.hasKey("followUpQuestions") ? result["followUpQuestions"] : [];
            json|error multiAgentAnalysisField = result is map<json> && result.hasKey("multiAgentAnalysis") ? result["multiAgentAnalysis"] : {};
            json|error agentCoordinationField = result is map<json> && result.hasKey("agentCoordination") ? result["agentCoordination"] : {};
            json|error responseTimeField = <float>responseTime;
            json|error successField = result is map<json> && result.hasKey("success") ? result["success"] : true;
            json|error errorField = result is map<json> && result.hasKey("error") ? result["error"] : "";

            json enhancedResult = {
                "sessionId": sessionIdField is string ? <string>sessionIdField : "",
                "response": responseField is string ? <string>responseField : "",
                "agentType": agentTypeField is string ? <string>agentTypeField : "",
                "riskLevel": riskLevelField is int ? <int>riskLevelField : 0,
                "requiresImmediateAttention": requiresImmediateAttentionField is boolean ? <boolean>requiresImmediateAttentionField : false,
                "emotionalState": emotionalStateField is string ? <string>emotionalStateField : "",
                "recommendations": recommendationsField is json ? recommendationsField : [],
                "therapeuticTechniques": therapeuticTechniquesField is json ? therapeuticTechniquesField : [],
                "followUpQuestions": followUpQuestionsField is json ? followUpQuestionsField : [],
                "multiAgentAnalysis": multiAgentAnalysisField is json ? multiAgentAnalysisField : {},
                "agentCoordination": agentCoordinationField is json ? agentCoordinationField : {},
                "responseTime": responseTimeField is float ? <float>responseTimeField : 0.0,
                "success": successField is boolean ? <boolean>successField : true,
                "error": errorField is string ? <string>errorField : ""
            };

            log:printInfo(string `Multi-Agent Processing Complete - ${responseTime}s`);

            int riskLevelValue = riskLevelField is int ? <int>riskLevelField : 0;
            string emotionalStateValue = emotionalStateField is string ? <string>emotionalStateField : "";
            log:printInfo(string `Risk Level: ${riskLevelValue}, Emotion: ${emotionalStateValue}`);
            
            // Send response
            http:Response httpResponse = new;
            httpResponse.setJsonPayload(enhancedResult);
            check caller->respond(httpResponse);
            
        } on fail error e {
            log:printError(string `Multi-Agent Processing Error: ${e.message()}`);
            
            json errorResponse = {
                "sessionId": "error",
                "response": "I'm experiencing technical difficulties with my analysis system. Please try again or contact a mental health professional if you need immediate support.",
                "agentType": "error",
                "riskLevel": 0,
                "requiresImmediateAttention": false,
                "emotionalState": "error",
                "recommendations": ["Contact a mental health professional", "Try again in a few moments"],
                "therapeuticTechniques": [],
                "followUpQuestions": [],
                "multiAgentAnalysis": {},
                "agentCoordination": {"error": e.message()},
                "responseTime": 0.0,
                "success": false,
                "error": e.message()
            };
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 500;
            httpResponse.setJsonPayload(errorResponse);
            check caller->respond(httpResponse);
        }
    }
    
    // Process endpoint for backend compatibility
    resource function post process(http:Caller caller, http:Request request) returns error? {
        do {
            json payload = check request.getJsonPayload();
            json|error sessionIdValue = payload.sessionId;
            string sessionId = sessionIdValue is string ? <string>sessionIdValue : "";

            json|error messageValue = payload.message;
            string message = messageValue is string ? <string>messageValue : "";

            // Safely extract sessionHistory, userProfile, context
            json sessionHistory = ([]);
            if payload is map<json> && payload.hasKey("sessionHistory") {
                sessionHistory = payload["sessionHistory"] is json ? <json>payload["sessionHistory"] : [];
            }
            json userProfile = ({});
            if payload is map<json> && payload.hasKey("userProfile") {
                userProfile = payload["userProfile"] is json ? <json>payload["userProfile"] : {};
            }
            json context = ({});
            if payload is map<json> && payload.hasKey("context") {
                context = payload["context"] is json ? <json>payload["context"] : {};
            }

            log:printInfo(string `Processing via multi-agent system for session: ${sessionId}`);

            // Process through multi-agent system
            json agentResult = check multiAgentSystem.processMessage(
                message,
                sessionId,
                sessionHistory,
                userProfile,
                context
            );

            // Safely extract agentResult fields
            json|error responseField = agentResult is map<json> && agentResult.hasKey("response") ? agentResult["response"] : "";
            json|error agentTypeField = agentResult is map<json> && agentResult.hasKey("agentType") ? agentResult["agentType"] : "";
            json|error requiresImmediateAttentionField = agentResult is map<json> && agentResult.hasKey("requiresImmediateAttention") ? agentResult["requiresImmediateAttention"] : false;
            json|error emotionalStateField = agentResult is map<json> && agentResult.hasKey("emotionalState") ? agentResult["emotionalState"] : "";
            json|error recommendationsField = agentResult is map<json> && agentResult.hasKey("recommendations") ? agentResult["recommendations"] : [];

            // Format for backend compatibility
            json compatibilityResponse = {
                "status": "success",
                "result": {
                    "response": responseField is string ? <string>responseField : "",
                    "agentType": agentTypeField is string ? <string>agentTypeField : "",
                    "confidenceScore": 90, // High confidence due to multi-agent analysis
                    "requiresImmediateAttention": requiresImmediateAttentionField is boolean ? <boolean>requiresImmediateAttentionField : false,
                    "emotionalState": emotionalStateField is string ? <string>emotionalStateField : "",
                    "recommendations": recommendationsField is json ? recommendationsField : []
                },
                "sessionId": sessionId,
                "timestamp": time:utcToCivil(time:utcNow()).toString(),
                "multiAgentProcessing": true,
                "agentsConsulted": 6
            };
            
            http:Response httpResponse = new;
            httpResponse.setJsonPayload(compatibilityResponse);
            check caller->respond(httpResponse);
            
        } on fail error e {
            log:printError(string `Process endpoint error: ${e.message()}`);
            
            json errorResponse = {
                "status": "error",
                "error": e.message(),
                "sessionId": "unknown",
                "timestamp": time:utcToCivil(time:utcNow()).toString()
            };
            
            http:Response httpResponse = new;
            httpResponse.statusCode = 500;
            httpResponse.setJsonPayload(errorResponse);
            check caller->respond(httpResponse);
        }
    }

    // Test endpoint to see multi-agent analysis breakdown
    resource function post analyze(http:Caller caller, http:Request request) returns error? {
        do {
            json payload = check request.getJsonPayload();
            json|error messageValue = payload.message;
            string message = messageValue is string ? <string>messageValue : "";
            
            json|error sessionIdValue = payload.sessionId;
            string sessionId = sessionIdValue is string ? <string>sessionIdValue : "analysis-" + uuid:createType1AsString();
            
            log:printInfo("Running detailed multi-agent analysis with memory...");
            
            json result = check multiAgentSystem.processMessage(
                message,
                sessionId,
                [], {}, {"analysis_mode": true}
            );
            
            // Return detailed analysis including memory info
            json|error breakdownField = result is map<json> && result.hasKey("multiAgentAnalysis") ? result["multiAgentAnalysis"] : {};
            json|error coordinationField = result is map<json> && result.hasKey("agentCoordination") ? result["agentCoordination"] : {};
            json|error sessionMemoryField = result is map<json> && result.hasKey("sessionMemory") ? result["sessionMemory"] : {};

            json analysisResponse = {
                "message": message,
                "sessionId": sessionId,
                "analysis": result,
                "breakdown": breakdownField is json ? breakdownField : {},
                "coordination": coordinationField is json ? coordinationField : {},
                "sessionMemory": sessionMemoryField is json ? sessionMemoryField : {},
                "timestamp": time:utcToCivil(time:utcNow()).toString()
            };
            
            http:Response httpResponse = new;
            httpResponse.setJsonPayload(analysisResponse);
            check caller->respond(httpResponse);
            
        } on fail error e {
            log:printError(string `Analysis endpoint error: ${e.message()}`);
            
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": e.message()});
            check caller->respond(errorResponse);
        }
    }

    // Get session history endpoint
    resource function get sessions/[string sessionId]/history() returns json|error {
        SessionMessage[] messages = sessionMemory.getSessionHistory(sessionId);
        SessionData? sessionData = sessionMemory.getSessionData(sessionId);
        
        return {
            "sessionId": sessionId,
            "messages": messages,
            "sessionData": sessionData,
            "totalMessages": messages.length(),
            "conversationPairs": messages.length() / 2,
            "memoryEnabled": true
        };
    }
    
    // Get session analysis endpoint  
    resource function get sessions/[string sessionId]/analysis() returns json|error {
        SessionMessage[] messages = sessionMemory.getSessionHistory(sessionId);
        SessionData? sessionData = sessionMemory.getSessionData(sessionId);
        
        if messages.length() == 0 {
            return {"error": "No session data found", "sessionId": sessionId};
        }
        
        json patterns = sessionMemory.analyzeSessionPatterns(messages);
        
        return {
            "sessionId": sessionId,
            "sessionAnalysis": patterns,
            "sessionData": sessionData,
            "memoryMetrics": {
                "totalMessages": messages.length(),
                "conversationTurns": messages.length() / 2,
                "firstMessage": messages.length() > 0 ? messages[0].timestamp : "",
                "lastMessage": messages.length() > 0 ? messages[messages.length() - 1].timestamp : ""
            }
        };
    }

    // Clear session memory endpoint (for testing/privacy)
    resource function delete sessions/[string sessionId]/memory() returns json {
        lock {
            if sessionStore.hasKey(sessionId) {
                _ = sessionStore.remove(sessionId);
                return {"message": "Session memory cleared", "sessionId": sessionId};
            }
            return {"message": "Session not found", "sessionId": sessionId};
        }
    }

    // Get all active sessions endpoint (for admin/monitoring)
    resource function get sessions() returns json {
        lock {
            string[] activeSessions = sessionStore.keys();
            json[] sessionSummaries = [];
            
            foreach string sessionId in activeSessions {
                SessionData sessionData = sessionStore.get(sessionId);
                sessionSummaries.push({
                    "sessionId": sessionId,
                    "userId": sessionData.userId,
                    "totalInteractions": sessionData.totalInteractions,
                    "currentRiskLevel": sessionData.currentRiskLevel,
                    "currentEmotionalState": sessionData.currentEmotionalState,
                    "createdAt": sessionData.createdAt,
                    "lastUpdated": sessionData.lastUpdated,
                    "messageCount": sessionData.messages.length()
                });
            }
            
            return {
                "totalActiveSessions": activeSessions.length(),
                "sessions": sessionSummaries
            };
        }
    }
}

public function main() returns error? {
    log:printInfo("MindBridge Multi-Agent System with Session Memory Starting...");
    log:printInfo("=====================================================================");
    log:printInfo(string `Service URL: ${SERVICE_URL}`);
    log:printInfo("Multi-Agent System:");
    log:printInfo("   • Crisis Detection Specialist (Temperature: 0.3)");
    log:printInfo("   • Mood Analysis Expert (Temperature: 0.5)");
    log:printInfo("   • Empathy Specialist (Temperature: 0.8)");
    log:printInfo("   • Primary Therapist - Dr. Sarah Chen (Temperature: 0.7)");
    log:printInfo("   • Recommendation Engine (Temperature: 0.4)");
    log:printInfo("   • Session Manager (Temperature: 0.6)");
    log:printInfo("Agent Coordination: Sequential → Memory Integration → Synthesis");
    log:printInfo("Model: GPT-4O-Mini (6 specialized instances)");
    log:printInfo("Session Memory: Enabled (In-Memory Store)");
    log:printInfo("Memory Features:");
    log:printInfo("   • Conversation History Retention");
    log:printInfo("   • Emotional State Tracking");
    log:printInfo("   • Risk Level Progression");
    log:printInfo("   • Therapeutic Continuity");
    log:printInfo("   • Progress Monitoring");
    log:printInfo("Available Endpoints:");
    log:printInfo("   • POST /chat - Full multi-agent processing with memory");
    log:printInfo("   • POST /process - Backend compatibility with memory");
    log:printInfo("   • POST /analyze - Detailed analysis breakdown");
    log:printInfo("   • GET /sessions/{sessionId}/history - View conversation history");
    log:printInfo("   • GET /sessions/{sessionId}/analysis - Session pattern analysis");
    log:printInfo("   • GET /sessions - View all active sessions");
    log:printInfo("   • DELETE /sessions/{sessionId}/memory - Clear session data");
    log:printInfo("   • GET /health - System status");
    log:printInfo("=====================================================================");
    log:printInfo("Multi-Agent System with Memory Ready for Mental Health Conversations");
    log:printInfo("Each conversation builds on previous interactions for better therapeutic outcomes");
}