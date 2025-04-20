from fastapi import APIRouter, HTTPException
from app.models.query import QueryRequest, QueryResponse
from app.services.llm import query_llm
from datetime import datetime
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Query"])

query_history: List[QueryResponse] = []

@router.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    logger.info(f"Received query: {request.question}")
    try:
        answer = await query_llm(request.question)
        response = QueryResponse(
            question=request.question,
            answer=answer,
            timestamp=datetime.utcnow()
        )
        query_history.append(response)
        return response
    except Exception as e:
        logger.error(f"Error in process_query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[QueryResponse])
async def get_history():
    try:
        return query_history
    except Exception as e:
        logger.error(f"Error in get_history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))