from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.topics import router as topics_router

app = FastAPI(title="KiddoLingo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(topics_router)
