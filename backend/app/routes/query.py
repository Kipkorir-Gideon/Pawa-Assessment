import aiosqlite
from fastapi import APIRouter, HTTPException
from app.models.query import QueryRequest, QueryResponse
from app.services.llm import query_llm
from datetime import datetime
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Query"])

async def init_db():
    async with aiosqlite.connect("history.db") as db:
        await db.execute("""
                CREATE TABLE IF NOT EXISTS queries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT NOT NULL,
                    answer TEXT NOT NULL,
                    timestamp TEXT NOT NULL
                )
        """)
        await db.commit()
        
@router.on_event("startup")
async def startup():
    await init_db()

@router.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process a user query and return an LLm response.
    
    Args:
        request: QueryRequest object containing the user's question.
        
    Returns: 
        QueryResponse: Object containing the question,answer, and timestamp.
        
    Raises:
        HTTPException: If the query fails or  the LLM API is unavailable.
    """
    logger.info(f"Received query: {request.question}")
    try:
        answer = await query_llm(request.question)
        response = QueryResponse(
            question=request.question,
            answer=answer,
            timestamp=datetime.utcnow()
        )
        async with aiosqlite.connect("history.db") as db:
            await db.execute(
                "INSERT INTO queries (question, answer, timestamp) VALUES (?, ?, ?)",
                (response.question, response.answer, response.timestamp.isoformat())
            )
            await db.commit()
        return response
    except HTTPException as e:
        logger.error(f"HTTP error in process_query: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in process_query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error in process_query: {str(e)}")

@router.get("/history", response_model=List[QueryResponse])
async def get_history():
    try:
        async with aiosqlite.connect("history.db") as db:
            cursor = await db.execute("SELECT question, answer, timestamp FROM queries")
            rows = await cursor.fetchall()
            return [
                QueryResponse(
                    question=row[0],
                    answer=row[1],
                    timestamp=datetime.fromisoformat(row[2])
                )
                for row in rows
            ]
    except Exception as e:
        logger.error(f"Error in get_history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in get_history: {str(e)}")
    
@router.delete("/history")
async def clear_history():
    try:
        async with aiosqlite.connect("history.db") as db:
            await db.execute("DELETE FROM queries")
            await db.commit()
        return {"message": "History cleared"}
    except Exception as e:
        logger.error(f"Error in clear_history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in clear_history: {str(e)}")