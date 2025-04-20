from fastapi import APIRouter, HTTPException
from httpx import request
from app.models.query import QueryRequest, QueryResponse
from app.services.llm import query_llm
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api", tags=[["Query"]])

# In-memory storage for query history
query_history: List[QueryResponse] = []

@router.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process the user's query and return the LLM's response.
    
    Args:
        request (QueryRequest): The user's query.
        
    Returns:
        QueryResponse: The LLM's response.
        
    Raises:
        HTTPException: If the LLM API call fails.
    """
    try:
        # Query the LLM
        answer = await query_llm(request.question)
        
        # Create a response object
        response = QueryResponse(
            question=request.question,
            answer=answer,
            timestamp=datetime.utcnow()
        )
        
        # Store the query in history
        query_history.append(response)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/history", response_model=List[QueryResponse])
async def get_history():
    """
    Mock LLM endpoint for testing.
    
    Args:
        request (dict): Contains 'prompt' key.
        
    Returns:
        dict: Mock response.
    """
    prompt = request.get("prompt", "")
    return {"answer": f"Mock response to {prompt[:50]}..."}