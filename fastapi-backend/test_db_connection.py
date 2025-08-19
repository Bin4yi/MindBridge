import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Test different password combinations
passwords_to_try = [
    os.getenv("DB_PASSWORD", "password"),
    "password",
    "postgres", 
    "",  # Empty password
    "admin",
    "123456"
]

host = os.getenv("DB_HOST", "localhost")
port = os.getenv("DB_PORT", "5432")
database = os.getenv("DB_NAME", "mindbridge_db")
user = os.getenv("DB_USER", "postgres")

print(f"Testing connection to {host}:{port}")
print(f"Database: {database}")
print(f"User: {user}")

for password in passwords_to_try:
    try:
        print(f"\nTrying password: '{password}'")
        connection = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        print("✅ SUCCESS! Connection established")
        print(f"✅ Correct password is: '{password}'")
        connection.close()
        break
    except psycopg2.OperationalError as e:
        print(f"❌ Failed with password '{password}': {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
else:
    print("\n❌ None of the passwords worked. Please check your PostgreSQL setup.")