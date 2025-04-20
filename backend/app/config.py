from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    LLM_API_URL = os.getenv("LLM_API_URL", "http://localhost:8000/mock-llm")
    LLM_API_KEY = os.getenv("LLM_API_KEY", "mock-api-key")
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")