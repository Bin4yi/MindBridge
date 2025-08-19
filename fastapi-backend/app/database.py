from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
import logging
import time
import psycopg2
import sys

from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Base class for SQLAlchemy models
Base = declarative_base()

# Function to ensure database exists
def ensure_database_exists():
    """Create the database if it doesn't exist"""
    logger.info(f"Ensuring database {settings.POSTGRES_DB} exists...")
    
    # Connect to default 'postgres' database first
    try:
        # Connect to the default database
        conn = psycopg2.connect(
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            database="postgres"  # Connect to default postgres DB first
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Check if our target database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (settings.POSTGRES_DB,))
        if cursor.fetchone():
            logger.info(f"Database {settings.POSTGRES_DB} already exists")
        else:
            logger.info(f"Creating database {settings.POSTGRES_DB}...")
            # Create the database
            cursor.execute(f'CREATE DATABASE "{settings.POSTGRES_DB}"')
            logger.info(f"Database {settings.POSTGRES_DB} created successfully")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        logger.error(f"Failed to ensure database exists: {e}")
        return False

# Create SQLAlchemy engine with connection pool settings
engine = create_engine(
    settings.DATABASE_URI,
    pool_pre_ping=True,  # Enable connection health checks
    pool_recycle=3600,   # Recycle connections after 1 hour
    pool_size=5,         # Connection pool size
    max_overflow=10,     # Maximum overflow connections
    echo=False           # Set to True for SQL query logging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def test_db_connection():
    """Test database connection with retry logic"""
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            # First ensure the database exists
            if not ensure_database_exists():
                logger.error("Failed to ensure database exists")
                return False
                
            # Then test connecting to it
            with engine.connect() as connection:
                # Test the connection with a simple query
                result = connection.execute(text("SELECT 1"))
                result.fetchone()
                logger.info("✅ Database connection successful")
                return True
        except Exception as e:
            logger.error(f"❌ Database connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                logger.info(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                logger.error("❌ All database connection attempts failed")
                return False
    
    return False

def wait_for_db(timeout_seconds=60):
    """Wait for database to become available"""
    logger.info("Waiting for database to become available...")
    
    start_time = time.time()
    while time.time() - start_time < timeout_seconds:
        if test_db_connection():
            return True
        
        elapsed = int(time.time() - start_time)
        remaining = timeout_seconds - elapsed
        logger.info(f"Database not ready, waiting... ({elapsed}s elapsed, {remaining}s timeout remaining)")
        time.sleep(2)
    
    logger.error(f"❌ Database did not become available within {timeout_seconds} seconds")
    return False