import ballerina/sql;
import ballerinax/postgresql;
import ballerina/log;
import ballerina/time;

// Database client
postgresql:Client dbClient = check new(host = DB_HOST, port = DB_PORT, database = DB_NAME, 
                                     user = DB_USER, password = DB_PASSWORD);

// User model
public type User record {|
    int user_id?;
    string name;
    time:Civil created_at?;
|};

// Chat model
public type Chat record {|
    int message_id?;
    int user_id;
    string message;
    string? response;
    string session_id;
    time:Civil created_at?;
    time:Civil? updated_at;
|};

// Voice model - NEW
public type Voice record {|
    int voice_id?;
    int user_id;
    string user_text;
    string? agent_response;
    string session_id;
    time:Civil created_at?;
    time:Civil? updated_at;
|};

// Database initialization
public function initializeDatabase() returns error? {
    log:printInfo("Initializing database with migrations...");
    
    // Apply all pending migrations
    check applyMigrations();
    
    log:printInfo("Database initialized successfully");
}

// User operations
public function createUser(string name) returns int|error {
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO users (name) VALUES (${name})
    `);
    
    if result.lastInsertId is int {
        log:printInfo("User created with ID: " + result.lastInsertId.toString());
        return <int>result.lastInsertId;
    } else {
        return error("Failed to create user");
    }
}

public function getUserById(int userId) returns User|error {
    stream<User, sql:Error?> resultStream = dbClient->query(`
        SELECT user_id, name, created_at FROM users WHERE user_id = ${userId}
    `);
    
    record {|User value;|}? user = check resultStream.next();
    check resultStream.close();
    
    if user is record {|User value;|} {
        return user.value;
    } else {
        return error("User not found");
    }
}

public function getAllUsers() returns User[]|error {
    stream<User, sql:Error?> resultStream = dbClient->query(`
        SELECT user_id, name, created_at FROM users ORDER BY created_at DESC
    `);
    
    User[] users = [];
    check from User user in resultStream
        do {
            users.push(user);
        };
    
    check resultStream.close();
    return users;
}

// Chat operations
public function saveUserMessage(int userId, string message, string sessionId) returns int|error {
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO chats (user_id, message, session_id) 
        VALUES (${userId}, ${message}, ${sessionId})
    `);
    
    if result.lastInsertId is int {
        log:printInfo("User message saved with ID: " + result.lastInsertId.toString());
        return <int>result.lastInsertId;
    } else {
        return error("Failed to save user message");
    }
}

public function saveAgentResponse(int messageId, string response) returns error? {
    sql:ExecutionResult result = check dbClient->execute(`
        UPDATE chats 
        SET response = ${response}, updated_at = CURRENT_TIMESTAMP 
        WHERE message_id = ${messageId}
    `);
    
    if result.affectedRowCount > 0 {
        log:printInfo("Agent response saved for message ID: " + messageId.toString());
    } else {
        return error("Failed to save agent response - message not found");
    }
}

public function getChatHistory(int userId, int? 'limit = 50) returns Chat[]|error {
    stream<Chat, sql:Error?> resultStream = dbClient->query(`
        SELECT message_id, user_id, message, response, session_id, created_at, updated_at 
        FROM chats 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT ${'limit}
    `);
    
    Chat[] chats = [];
    check from Chat chat in resultStream
        do {
            chats.push(chat);
        };
    
    check resultStream.close();
    return chats;
}

public function getChatsBySession(string sessionId) returns Chat[]|error {
    stream<Chat, sql:Error?> resultStream = dbClient->query(`
        SELECT message_id, user_id, message, response, session_id, created_at, updated_at 
        FROM chats 
        WHERE session_id = ${sessionId} 
        ORDER BY created_at ASC
    `);
    
    Chat[] chats = [];
    check from Chat chat in resultStream
        do {
            chats.push(chat);
        };
    
    check resultStream.close();
    return chats;
}

// ===== NEW VOICE OPERATIONS =====

// Save user voice transcription
public function saveVoiceTranscription(int userId, string userText, string sessionId) returns int|error {
    sql:ExecutionResult result = check dbClient->execute(`
        INSERT INTO voice (user_id, user_text, session_id) 
        VALUES (${userId}, ${userText}, ${sessionId})
    `);
    
    if result.lastInsertId is int {
        log:printInfo("Voice transcription saved with ID: " + result.lastInsertId.toString());
        return <int>result.lastInsertId;
    } else {
        return error("Failed to save voice transcription");
    }
}

// Save agent voice response
public function saveVoiceAgentResponse(int voiceId, string agentResponse) returns error? {
    sql:ExecutionResult result = check dbClient->execute(`
        UPDATE voice 
        SET agent_response = ${agentResponse}, updated_at = CURRENT_TIMESTAMP 
        WHERE voice_id = ${voiceId}
    `);
    
    if result.affectedRowCount > 0 {
        log:printInfo("Voice agent response saved for voice ID: " + voiceId.toString());
    } else {
        return error("Failed to save voice agent response - voice record not found");
    }
}

// Get voice history for a user
public function getVoiceHistory(int userId, int? 'limit = 50) returns Voice[]|error {
    stream<Voice, sql:Error?> resultStream = dbClient->query(`
        SELECT voice_id, user_id, user_text, agent_response, session_id, created_at, updated_at 
        FROM voice 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT ${'limit}
    `);
    
    Voice[] voices = [];
    check from Voice voice in resultStream
        do {
            voices.push(voice);
        };
    
    check resultStream.close();
    return voices;
}

// Get voice conversation by session
public function getVoiceBySession(string sessionId) returns Voice[]|error {
    stream<Voice, sql:Error?> resultStream = dbClient->query(`
        SELECT voice_id, user_id, user_text, agent_response, session_id, created_at, updated_at 
        FROM voice 
        WHERE session_id = ${sessionId} 
        ORDER BY created_at ASC
    `);
    
    Voice[] voices = [];
    check from Voice voice in resultStream
        do {
            voices.push(voice);
        };
    
    check resultStream.close();
    return voices;
}