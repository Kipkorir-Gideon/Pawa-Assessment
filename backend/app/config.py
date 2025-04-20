from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Config(BaseSettings):
    LLM_API_URL = str
    LLM_API_KEY = str
    ENVIRONMENT = str = "development"
    
config = Config()