# Subtopics Generation Endpoint

## Endpoint Details
```
POST /api/topics/{topic_id}/subtopics/generate
```

## Request Parameters

### URL Parameters
- `topic_id`: string
  - The main topic to generate subtopics for (e.g., "anime", "sports", "dinosaurs")

### Request Body (JSON)
```json
{
    "user_age": number,       // Age of the user (e.g., 10)
    "target_language": string // Language for practice words (e.g., "Japanese", "isiNdebele")
}
```

## Response Format
```typescript
interface PracticeWord {
    original: string;    // Word in target language
    translation: string; // English translation
}

interface Subtopic {
    id: string;         // Format: "{topic}-{number}" (e.g., "anime-1")
    title: string;      // Title of the subtopic
    difficulty: "EASY" | "MEDIUM" | "HARD";
    is_completed: boolean;
    practice_words: PracticeWord[];
}

// Response is an array of Subtopic objects
type Response = Subtopic[];
```

## Example Response
```json
[
    {
        "id": "anime-1",
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
```

## Notes
- Response is cached in SQLite to minimize API calls
- Each subtopic contains 2-3 practice words
- All content is age-appropriate based on the user_age parameter
- Content is generated in the requested target_language
