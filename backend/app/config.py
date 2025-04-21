from pydantic_settings import BaseSettings
from pydantic import HttpUrl, ValidationError
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

load_dotenv()

class Config(BaseSettings):
    """Configuration settings for the application"""
    LLM_API_URL: HttpUrl
    LLM_API_KEY: str
    ENVIRONMENT: str = "development"

    class ConfigDict:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "forbid"

    def __init__(self, **kwargs):
        try:
            super().__init__(**kwargs)
        except ValidationError as e:
            logger.error(f"Configuration validation error: {e}")
            raise

try:
    config = Config()
except ValidationError as e:
    logger.error(f"Failed to initialize Config: {e}")
    raise