from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import topics, voice  

app = FastAPI(title="KiddoLingo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(topics.router, prefix="/api/topics", tags=["topics"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
