from fastapi import APIRouter, HTTPException
from typing import List
import json
from .schemas import SubtopicResponse, GenerateSubtopicsRequest
from ..services.openai import generate_subtopics

router = APIRouter(prefix="/api/topics", tags=["topics"])

@router.post("/{topic_id}/subtopics/generate", response_model=List[SubtopicResponse])
async def generate_topic_subtopics(
    topic_id: str,
    request: GenerateSubtopicsRequest
) -> List[SubtopicResponse]:
    try:
        print(f"Received request for topic: {topic_id}, age: {request.user_age}")  # Debug log
        subtopics = await generate_subtopics(
            topic_id, 
            request.user_age,
            request.target_language
        )
        return subtopics
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {str(e)}")  # Debug log
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=str(e))
