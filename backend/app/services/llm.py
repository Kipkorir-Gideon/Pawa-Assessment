import httpx
from fastapi import HTTPException
from app.config import Config
import logging

logger = logging.getLogger(__name__)

async def query_llm(question: str) -> str:
    """
    Query the Hugging Face Inference API with Mixtral-8x7B-Instruct-v0.1.
    
    Args:
        question (str): User's question.
    
    Returns:
        str: Mixtral's response.
    
    Raises:
        HTTPException: If the API call fails.
    """
    try:
        async with httpx.AsyncClient() as client:
            prompt = (
                "[INST] You are a helpful AI assistant. Provide a clear, concise, and accurate answer to the user's question. "
                f"Question: {question} [/INST]"
            )
            response = await client.post(
                Config.LLM_API_URL,
                json={
                    "inputs": prompt,
                    "parameters": {
                        "max_length": 500,
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "return_full_text": False
                    }
                },
                headers={
                    "Authorization": f"Bearer {Config.LLM_API_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                answer = data[0]["generated_text"].strip()
            else:
                answer = "No answer provided"
            return answer
    except httpx.HTTPStatusError as e:
        logger.error(f"Hugging Face API error: {str(e)}")
        raise HTTPException(status_code=503, detail=f"Failed to connect to Hugging Face API: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")