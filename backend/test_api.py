import os
import google.generativeai as genai

# Manually set the key for the test
os.environ["GOOGLE_API_KEY"] = "AIzaSyA6WTHdWlytbJ_FLNhRFMmpotG5iGn38Ok"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

print("--- Testing API Connection ---")
try:
    models = genai.list_models()
    for m in models:
        print(f"Model ID: {m.name}")
except Exception as e:
    print(f"FAILED: {e}")
