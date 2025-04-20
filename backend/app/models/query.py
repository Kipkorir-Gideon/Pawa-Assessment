from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class QueryRequest(BaseModel):
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User's question for the LLM"
    )
    

class QueryResponse(BaseModel):
    question: str
    answer: str
    timestamp: datetime