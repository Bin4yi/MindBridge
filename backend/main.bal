import ballerina/http;
import ballerina/log;
import ballerina/mime;
import mindbridge.backend.speech;
import mindbridge.backend.agents;

configurable string OPENAI_API_KEY = ?;
configurable string PYTHON_AGENT_URL = "http://localhost:8000";
configurable string DEFAULT_VOICE = "alloy";
configurable float SPEECH_RATE = 1.0;

# Global voice chat handler
agents:VoiceChatHandler voiceChatHandler = check new(
    {
        openaiApiKey: OPENAI_API_KEY,
        defaultVoice: DEFAULT_VOICE,
        speechRate: SPEECH_RATE
    },
    PYTHON_AGENT_URL
);

service / on new http:Listener(8001) {

    # Voice chat endpoint
    resource function post voiceChat(http:Caller caller, http:Request request) returns error? {
        do {
            // Extract multipart form data
            mime:Entity[] bodyParts = check request.getBodyParts();
            
            byte[] audioData = [];
            string format = "mp3";
            string sessionId = "";
            string userId = "";
            string agentType = "therapist";

            // Process form parts
            foreach mime:Entity part in bodyParts {
                mime:ContentDisposition? contentDisposition = part.getContentDisposition();
                if contentDisposition is mime:ContentDisposition {
                    string fieldName = contentDisposition.name;
                    
                    if fieldName == "audio" {
                        audioData = check part.getByteArray();
                    } else if fieldName == "format" {
                        format = check part.getText();
                    } else if fieldName == "sessionId" {
                        sessionId = check part.getText();
                    } else if fieldName == "userId" {
                        userId = check part.getText();
                    } else if fieldName == "agentType" {
                        agentType = check part.getText();
                    }
                }
            }

            // Validate required fields
            if audioData.length() == 0 || sessionId == "" || userId == "" {
                http:Response errorResponse = new;
                errorResponse.statusCode = 400;
                errorResponse.setJsonPayload({
                    "error": "Missing required fields: audio, sessionId, or userId"
                });
                check caller->respond(errorResponse);
                return;
            }

            // Process voice chat
            agents:VoiceChatResponse response = voiceChatHandler.processVoiceChat({
                audioData: audioData,
                format: format,
                sessionId: sessionId,
                userId: userId,
                agentType: agentType
            });

            if response.success {
                http:Response httpResponse = new;
                httpResponse.setBinaryPayload(response.responseAudio, response.contentType);
                httpResponse.setHeader("X-Response-Text", response.responseText);
                httpResponse.setHeader("X-Agent-Metadata", response.agentMetadata.toString());
                check caller->respond(httpResponse);
            } else {
                http:Response errorResponse = new;
                errorResponse.statusCode = 500;
                errorResponse.setJsonPayload({
                    "error": response.error,
                    "responseText": response.responseText
                });
                check caller->respond(errorResponse);
            }

        } on fail error e {
            log:printError("Voice chat error: " + e.message());
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Internal server error: " + e.message()});
            check caller->respond(errorResponse);
        }
    }

    # Text-to-speech endpoint
    resource function post tts(http:Caller caller, http:Request request) returns error? {
        do {
            json payload = check request.getJsonPayload();
            string text = check payload.text;
            string? voice = payload.voice is string ? <string>payload.voice : ();
            float? speed = payload.speed is float ? <float>payload.speed : ();

            speech:TTSResponse response = voiceChatHandler.speechService.textToSpeech({
                text: text,
                voice: voice,
                speed: speed
            });

            if response.success {
                http:Response httpResponse = new;
                httpResponse.setBinaryPayload(response.audioData, response.contentType);
                check caller->respond(httpResponse);
            } else {
                http:Response errorResponse = new;
                errorResponse.statusCode = 500;
                errorResponse.setJsonPayload({"error": response.error});
                check caller->respond(errorResponse);
            }

        } on fail error e {
            log:printError("TTS error: " + e.message());
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Internal server error: " + e.message()});
            check caller->respond(errorResponse);
        }
    }

    # Speech-to-text endpoint
    resource function post stt(http:Caller caller, http:Request request) returns error? {
        do {
            mime:Entity[] bodyParts = check request.getBodyParts();
            
            byte[] audioData = [];
            string format = "mp3";

            foreach mime:Entity part in bodyParts {
                mime:ContentDisposition? contentDisposition = part.getContentDisposition();
                if contentDisposition is mime:ContentDisposition {
                    string fieldName = contentDisposition.name;
                    
                    if fieldName == "audio" {
                        audioData = check part.getByteArray();
                    } else if fieldName == "format" {
                        format = check part.getText();
                    }
                }
            }

            speech:STTResponse response = voiceChatHandler.speechService.speechToText({
                audioData: audioData,
                format: format
            });

            http:Response httpResponse = new;
            httpResponse.setJsonPayload({
                "text": response.text,
                "success": response.success,
                "error": response.error
            });
            check caller->respond(httpResponse);

        } on fail error e {
            log:printError("STT error: " + e.message());
            http:Response errorResponse = new;
            errorResponse.statusCode = 500;
            errorResponse.setJsonPayload({"error": "Internal server error: " + e.message()});
            check caller->respond(errorResponse);
        }
    }

    # Health check endpoint
    resource function get health() returns json {
        return {"status": "healthy", "service": "MindBridge Voice Chat Backend"};
    }
}