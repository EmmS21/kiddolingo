# Backend Structure (FastAPI)

📦 backend
 ┣ 📂 app
 ┃ ┣ 📂 api
 ┃ ┃ ┣ 📜 topics.py        # Topic/subtopic endpoints
 ┃ ┃ ┣ 📜 voice.py         # NEW: Voice WebSocket endpoint
 ┃ ┃ ┗ 📜 schemas.py       # Pydantic models
 ┃ ┣ 📂 core
 ┃ ┃ ┣ 📜 config.py        # Environment and app settings
 ┃ ┃ ┗ 📜 database.py      # SQLite setup
 ┃ ┣ 📂 services
 ┃ ┃ ┣ 📜 openai.py        # OpenAI integration & prompts
 ┃ ┃ ┗ 📜 voice_processor.py  # NEW: Voice processing service
 ┃ ┗ 📜 main.py            # FastAPI app initialization
 ┣ 📜 requirements.txt
 ┗ 📜 .env

# Key API Endpoints

## Topics
POST /api/topics/{topic_id}/subtopics/generate
- Input: 
  - topic_id: str
  - user_age: int
- Output: List of subtopics with practice words
- Stores results in SQLite for caching

GET /api/topics/{topic_id}/subtopics
- Returns cached subtopics if available

# Database Models (SQLite)

## Subtopic
- id: TEXT PRIMARY KEY
- topic_id: TEXT
- title: TEXT
- difficulty: TEXT
- is_completed: BOOLEAN
- practice_words: TEXT (JSON string)

# Example Response
```json
{
  "subtopics": [
    {
      "id": "1",
      "title": "Basic Anime Greetings",
      "difficulty": "EASY",
      "is_completed": false,
      "practice_words": [
        {
          "original": "こんにちは",
          "translation": "Hello"
        },
        {
          "original": "さようなら",
          "translation": "Goodbye"
        }
      ]
    }
  ]
}
```

# Implementation Notes
1. Simple SQLite for caching generated content
2. Basic OpenAI integration for topic generation
3. No authentication
4. Minimal error handling
5. Single language pair support
6. Store practice words as JSON string in SQLite
