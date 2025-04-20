from fastapi import FastAPI
from app.routes import query

app = FastAPI(
    title="Query Assistant API",
    description="API for processing user queries",
    version="1.0.0"
)

app.include_router(query.router)

@app.get("/")
async def root():
    return {"message": "Query Assistant API is running!"}