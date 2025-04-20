import httpx
from fastapi import HTTPException
from app.config import Config
import logging

logger = logging.getLogger(__name__)

async def query_llm(question: str) -> str:
    """
    Query the LLM API with the given question.
    
    Args:
        question (str): User's question.
        
    Returns:
        str: LLM's response.
        
    Raises:
        HTTPException: If the LLM API call fails.
    """
    try:
        async with httpx.AsyncClient() as client:
            prompt = (
                f"Answer the question based on the context provided.\n\n"
                f"Context: {question}\n\n"
                "Answer:"
            )
            response = await client.post(
                Config.LLM_API_URL,
                json={"prompt": prompt},
                headers={"Authorization": f"Bearer {Config.LLM_API_KEY}"},
                timeout=10.0
            )
            response.raise_for_status()
            return response.json().get("answer", "No answer found.")
    except httpx.HTTPError as e:
        logger.error(f"LLM API error: {str(e)}")
        raise HTTPException(status_code=503, detail="Failed to connect to LLM service.")