from sqlalchemy import Column, Integer, DateTime, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.exc import SQLAlchemyError
import logging

from app.database import engine, SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create base for migrations
MigrationBase = declarative_base()

class SchemaMigration(MigrationBase):
    __tablename__ = "schema_migrations"
    
    version = Column(Integer, primary_key=True)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

# Create migrations table if it doesn't exist
def create_migrations_table():
    MigrationBase.metadata.create_all(bind=engine)

def get_current_schema_version():
    # Create migrations table if needed
    create_migrations_table()
    
    db = SessionLocal()
    try:
        # Get current version
        result = db.execute(text("SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1")).first()
        return result[0] if result else 0
    except SQLAlchemyError as e:
        logger.error(f"Error checking schema version: {e}")
        return 0
    finally:
        db.close()

def apply_migrations():
    current_version = get_current_schema_version()
    logger.info(f"Current schema version: {current_version}")
    
    db = SessionLocal()
    try:
        # Apply migrations in order
        if current_version < 1:
            apply_migration_1(db)
        if current_version < 2:
            apply_migration_2(db)
        # Add more migrations as needed
        
        db.commit()
        logger.info("All migrations applied successfully")
        
    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"Migration error: {e}")
        raise
    finally:
        db.close()

def apply_migration_1(db):
    logger.info("Applying migration 1: Initial schema")
    
    # Create users table
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    
    # Create chats table
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS chats (
            message_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            message TEXT NOT NULL,
            response TEXT,
            session_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    
    # Mark migration as applied
    db.execute(text("INSERT INTO schema_migrations (version) VALUES (1)"))
    logger.info("Migration 1 applied successfully")

def apply_migration_2(db):
    logger.info("Applying migration 2: Add voice table")
    
    # Create voice table
    db.execute(text("""
        CREATE TABLE IF NOT EXISTS voice (
            voice_id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(user_id),
            user_text TEXT NOT NULL,
            agent_response TEXT,
            session_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """))
    
    # Add indexes for better performance
    db.execute(text("CREATE INDEX IF NOT EXISTS idx_voice_user_id ON voice(user_id)"))
    db.execute(text("CREATE INDEX IF NOT EXISTS idx_voice_session_id ON voice(session_id)"))
    
    # Mark migration as applied
    db.execute(text("INSERT INTO schema_migrations (version) VALUES (2)"))
    logger.info("Migration 2 applied successfully")