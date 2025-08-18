import ballerina/sql;
import ballerina/log;

// Migration version tracking
public function getCurrentSchemaVersion() returns int|error {
    // Create migrations table if it doesn't exist
    sql:ExecutionResult _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Get current version
    stream<record {int version;}, sql:Error?> resultStream = dbClient->query(`
        SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1
    `);
    
    record {|record {int version;} value;|}? result = check resultStream.next();
    check resultStream.close();
    
    if result is record {|record {int version;} value;|} {
        return result.value.version;
    } else {
        return 0; // No migrations applied yet
    }
}

public function applyMigrations() returns error? {
    int currentVersion = check getCurrentSchemaVersion();
    log:printInfo("Current schema version: " + currentVersion.toString());
    
    // Apply migrations in order
    if currentVersion < 1 {
        check applyMigration1();
    }
    if currentVersion < 2 {
        check applyMigration2();
    }
    // Add more migrations as needed
}

// Migration 1: Initial schema
function applyMigration1() returns error? {
    log:printInfo("Applying migration 1: Initial schema");
    
    sql:ExecutionResult _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    sql:ExecutionResult _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS chats (
            message_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            message TEXT NOT NULL,
            response TEXT,
            session_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Mark migration as applied
    sql:ExecutionResult _ = check dbClient->execute(`
        INSERT INTO schema_migrations (version) VALUES (1)
    `);
    
    log:printInfo("Migration 1 applied successfully");
}

// Migration 2: Add voice table
function applyMigration2() returns error? {
    log:printInfo("Applying migration 2: Add voice table");
    
    sql:ExecutionResult _ = check dbClient->execute(`
        CREATE TABLE IF NOT EXISTS voice (
            voice_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            user_text TEXT NOT NULL,
            agent_response TEXT,
            session_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Add index for better performance
    sql:ExecutionResult _ = check dbClient->execute(`
        CREATE INDEX IF NOT EXISTS idx_voice_user_id ON voice(user_id)
    `);
    
    sql:ExecutionResult _ = check dbClient->execute(`
        CREATE INDEX IF NOT EXISTS idx_voice_session_id ON voice(session_id)
    `);
    
    // Mark migration as applied
    sql:ExecutionResult _ = check dbClient->execute(`
        INSERT INTO schema_migrations (version) VALUES (2)
    `);
    
    log:printInfo("Migration 2 applied successfully");
}