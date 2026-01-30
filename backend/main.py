from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend/ or current dir
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Support running from project root (import as package) or from inside backend/ (direct run)
try:
    from backend.utils.database import mongo_db
    from backend.utils.vector_db import vector_db
    from backend.services.rag_service import rag_service
except ModuleNotFoundError:
    from utils.database import mongo_db
    from utils.vector_db import vector_db
    from services.rag_service import rag_service

app = FastAPI(title="Mini RAG API")

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngestRequest(BaseModel):
    text: str
    source: Optional[str] = "paste"
    title: Optional[str] = None

class QueryRequest(BaseModel):
    query: str

@app.on_event("startup")
async def startup_db_client():
    await mongo_db.connect()
    vector_db.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await mongo_db.disconnect()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/ingest")
async def ingest_text(request: IngestRequest):
    try:
        # Generate title if not provided
        doc_title = request.title
        if not doc_title:
            doc_title = request.text[:50] + "..." if len(request.text) > 50 else request.text

        doc_id = await rag_service.ingest_text(request.text, {
            "source": request.source,
            "title": doc_title
        })
        return {"status": "success", "doc_id": doc_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query") 
async def query_rag(request: QueryRequest):
    try:
        result = await rag_service.query(request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # If running `python main.py` from inside backend/, use local module path
    try:
        uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
    except ModuleNotFoundError:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
