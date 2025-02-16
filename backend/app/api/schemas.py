from pydantic import BaseModel
from typing import List
from enum import Enum

class Difficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class PracticeWord(BaseModel):
    original: str
    translation: str

class SubtopicResponse(BaseModel):
    id: str
    title: str
    difficulty: Difficulty
    is_completed: bool = False
    practice_words: List[PracticeWord]

class GenerateSubtopicsRequest(BaseModel):
    user_age: int
    target_language: str
