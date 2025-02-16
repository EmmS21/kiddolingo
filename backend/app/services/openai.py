from openai import AsyncOpenAI
from typing import List
import json
from ..api.schemas import SubtopicResponse, PracticeWord
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Now client will automatically use OPENAI_API_KEY from environment
client = AsyncOpenAI()

GENERATE_SUBTOPICS_PROMPT = """Generate 3 age-appropriate subtopics for teaching a {age} year old about {topic}.
The practice words should be in {language}.
For each subtopic, include a title, difficulty (EASY/MEDIUM/HARD), and 2 practice words with translations.
These topics have to be fun based on the age of the user. Think of topics that can lead to open ended long conversations that keep the user engaged and 
are culturally relevant to current events and trends. Return this as a JSON object in this format:

Return ONLY a JSON response with an array of 'subtopics'. Each subtopic should have:
- A 'title' field (string)
- A 'difficulty' field (must be exactly: EASY, MEDIUM, or HARD)
- A 'practice_words' array containing objects with 'original' and 'translation' fields
Do not include any other fields or explanations.
"""

async def generate_subtopics(topic: str, user_age: int, target_language: str) -> List[SubtopicResponse]:
    prompt = GENERATE_SUBTOPICS_PROMPT.format(
        age=user_age,
        topic=topic,
        language=target_language
    )

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful language teaching assistant. You need to create conversations that are fun, open ended, current, culturally relevant and can lead to long organic conversations."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    # Get the content and strip markdown code blocks
    content = response.choices[0].message.content.strip()
    if content.startswith('```'):
        content = content[content.find('{'):]
        content = content[:content.rfind('}') + 1]

    data = json.loads(content)
    
    subtopics = []
    for idx, item in enumerate(data["subtopics"]):
        subtopics.append(
            SubtopicResponse(
                id=f"{topic}-{idx+1}",
                title=item["title"],
                difficulty=item["difficulty"],
                practice_words=[
                    PracticeWord(**word) for word in item["practice_words"]
                ]
            )
        )
    
    return subtopics
