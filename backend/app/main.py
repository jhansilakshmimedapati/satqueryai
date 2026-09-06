"""
SatQuery AI - FastAPI Backend Server
Interactive Vision-Language Assistant for Remote-Sensing Image Analysis
"""

import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.database.db import init_db

app = FastAPI(
    title="SatQuery AI Backend",
    description="Agentic Vision-Language Assistant for multimodal remote-sensing satellite image analysis",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Mount API routes
app.include_router(api_router, prefix="/api")

# Serve uploaded static files if directory exists
os.makedirs("data/uploads", exist_ok=True)
app.mount("/data/uploads", StaticFiles(directory="data/uploads"), name="uploads")


@app.get("/")
def read_root():
    return {
        "name": "SatQuery AI",
        "description": "Interactive Vision-Language Assistant for Remote-Sensing Image Analysis",
        "status": "Online",
        "api_docs": "/docs",
    }


if __name__ == "__main__":
    port = int(os.environ.get("BACKEND_PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
