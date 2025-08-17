import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/mime;

# Configuration for speech services
public type SpeechConfig record {
    string openaiApiKey;
    string googleApiKey?;
    string defaultVoice;
    float speechRate;
};

# Speech-to-Text request
public type STTRequest record {
    byte[] audioData;
    string format; // "mp3", "wav", "ogg", etc.
    string language?;
};

# Text-to-Speech request
public type TTSRequest record {
    string text;
    string voice?;
    float speed?;
    string format?;
};

# Speech service responses
public type STTResponse record {
    string text;
    boolean success;
    string? error;
};

public type TTSResponse record {
    byte[] audioData;
    boolean success;
    string? error;
    string contentType;
};

# Speech Service Class
public class SpeechService {
    private SpeechConfig config;
    private http:Client openaiClient;

    public function init(SpeechConfig config) returns error? {
        self.config = config;
        
        // Initialize OpenAI client for speech services
        self.openaiClient = check new("https://api.openai.com/v1", {
            auth: {
                token: config.openaiApiKey
            }
        });
    }

    # Convert speech to text using OpenAI Whisper
    public function speechToText(STTRequest request) returns STTResponse {
    do {
        http:Client whisperClient = check new("http://localhost:9000");

        mime:Entity fileEntity = new;
        fileEntity.setByteArray(request.audioData);
        fileEntity.setContentType("audio/" + request.format);
        fileEntity.setContentDisposition(mime:getContentDispositionObject("audio", filename = "audio." + request.format));

        mime:Entity langEntity = new;
        langEntity.setText(request.language ?: "si");
        langEntity.setContentDisposition(mime:getContentDispositionObject("language"));

        mime:Entity[] bodyParts = [fileEntity, langEntity];

        http:Request httpRequest = new;
        httpRequest.setBodyParts(bodyParts, contentType = mime:MULTIPART_FORM_DATA);

        http:Response response = check whisperClient->post("/stt", httpRequest);

        if response.statusCode == 200 {
            json responseJson = check response.getJsonPayload();
            string transcribedText = check responseJson.text;

            return {
                text: transcribedText,
                success: true,
                error: ()
            };
        } else {
            return {text: "", success: false, error: "Whisper service error"};
        }
    } on fail error e {
        return {text: "", success: false, error: e.message()};
    }
}

    # Convert text to speech using OpenAI TTS
    public function textToSpeech(TTSRequest request) returns TTSResponse {
        do {
            json requestBody = {
                "model": "tts-1",
                "input": request.text,
                "voice": request.voice ?: self.config.defaultVoice,
                "speed": request.speed ?: self.config.speechRate
            };

            http:Response response = check self.openaiClient->post("/audio/speech", requestBody);
            
            if response.statusCode == 200 {
                byte[] audioData = check response.getBinaryPayload();
                
                log:printInfo("Text-to-speech successful, audio size: " + audioData.length().toString() + " bytes");
                
                return {
                    audioData: audioData,
                    success: true,
                    error: (),
                    contentType: "audio/mpeg"
                };
            } else {
                string errorMsg = "Text-to-speech failed with status: " + response.statusCode.toString();
                log:printError(errorMsg);
                return {
                    audioData: [],
                    success: false,
                    error: errorMsg,
                    contentType: ""
                };
            }
        } on fail error e {
            log:printError("Text-to-speech error: " + e.message());
            return {
                audioData: [],
                success: false,
                error: e.message(),
                contentType: ""
            };
        }
    }
}