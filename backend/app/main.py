from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import query

app = FastAPI(
    title="Query Assistant API",
    description="API for processing user queries with Mixtral-8x7B-Instruct",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router)

@app.get("/")
async def root():
    return {"message": "Query Assistant API is running"}
