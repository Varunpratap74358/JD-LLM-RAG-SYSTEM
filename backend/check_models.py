import os
import google.generativeai as genai
from dotenv import load_dotenv
from pathlib import Path

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
print(f"Using API Key: {api_key[:10]}...")

genai.configure(api_key=api_key)

try:
    with open("available_models.txt", "w") as f:
        f.write("Available Models for this API Key:\n")
        models = genai.list_models()
        for m in models:
            f.write(f"- {m.name} (Methods: {m.supported_generation_methods})\n")
    print("Successfully wrote available_models.txt")
except Exception as e:
    with open("available_models.txt", "w") as f:
        f.write(f"ERROR: {str(e)}")
    print(f"Failed to list models: {e}")
