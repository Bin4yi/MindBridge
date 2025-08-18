import ballerina/http;
import ballerina/log;
import mindbridge.backend.speech;

# Voice chat request
public type VoiceChatRequest record {
    byte[] audioData;
    string format;
    string sessionId;
    string userId;
    string agentType?; // "therapist", "crisis_detector", etc.
};

# Voice chat response
public type VoiceChatResponse record {
    byte[] responseAudio;
    string responseText;
    boolean success;
    string? error;
    string contentType;
    json? agentMetadata;
};

# Voice Chat Handler
public class VoiceChatHandler {
    private speech:SpeechService speechService;
    private http:Client pythonAgentClient;

    public function init(speech:SpeechConfig speechConfig, string pythonAgentUrl) returns error? {
        self.speechService = check new(speechConfig);
        self.pythonAgentClient = check new(pythonAgentUrl);
    }

    # Process voice chat - STT -> Agent -> TTS
    public function processVoiceChat(VoiceChatRequest request) returns VoiceChatResponse {
        log:printInfo("Processing voice chat for session: " + request.sessionId);

        // Step 1: Convert speech to text
        speech:STTResponse sttResponse = self.speechService.speechToText({
            audioData: request.audioData,
            format: request.format,
            language: "en"
        });

        if !sttResponse.success {
            return {
                responseAudio: [],
                responseText: "",
                success: false,
                error: "Speech-to-text failed: " + (sttResponse.error ?: "Unknown error"),
                contentType: "",
                agentMetadata: ()
            };
        }

        log:printInfo("Transcribed text: " + sttResponse.text);

        // Step 2: Send text to AI agent
        json agentRequest = {
            "message": sttResponse.text,
            "session_id": request.sessionId,
            "user_id": request.userId,
            "agent_type": request.agentType ?: "therapist"
        };

        do {
            http:Response agentResponse = check self.pythonAgentClient->post("/chat", agentRequest);
            
            if agentResponse.statusCode != 200 {
                return {
                    responseAudio: [],
                    responseText: "",
                    success: false,
                    error: "Agent request failed with status: " + agentResponse.statusCode.toString(),
                    contentType: "",
                    agentMetadata: ()
                };
            }

            json agentResponseJson = check agentResponse.getJsonPayload();
            string agentText = check agentResponseJson.response;
            
            log:printInfo("Agent response: " + agentText);
            log:printInfo("Agent metadata: " + agentResponseJson.toString());

            // Step 3: Convert agent response to speech
            speech:TTSResponse ttsResponse = self.speechService.textToSpeech({
                text: agentText,
                voice: "alloy",
                speed: 1.0
            });

            if !ttsResponse.success {
                return {
                    responseAudio: [],
                    responseText: agentText,
                    success: false,
                    error: "Text-to-speech failed: " + (ttsResponse.error ?: "Unknown error"),
                    contentType: "",
                    agentMetadata: agentResponseJson
                };
            }

            log:printInfo("Voice chat processing completed successfully");

            return {
                responseAudio: ttsResponse.audioData,
                responseText: agentText,
                success: true,
                error: (),
                contentType: ttsResponse.contentType,
                agentMetadata: agentResponseJson
            };

        } on fail error e {
            log:printError("Agent communication error: " + e.message());
            return {
                responseAudio: [],
                responseText: "",
                success: false,
                error: "Agent communication failed: " + e.message(),
                contentType: "",
                agentMetadata: ()
            };
        }
    }
}