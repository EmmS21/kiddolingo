# Database Design (SQLite)

## Overview
Simple SQLite database design for the MVP of The Talking Rabbit language learning app. This design focuses on storing user profiles, conversations, and learning progress.

## Tables

### Users
Primary table for storing user profile information
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `age` (INTEGER NOT NULL)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### UserInterests
Junction table for user interests (many-to-many)
- `user_id` (INTEGER, FOREIGN KEY -> Users.id)
- `interest` (TEXT NOT NULL)
- PRIMARY KEY (user_id, interest)

### UserLanguages
Junction table for user target languages (many-to-many)
- `user_id` (INTEGER, FOREIGN KEY -> Users.id)
- `language` (TEXT NOT NULL)
- PRIMARY KEY (user_id, language)

### Conversations
Stores individual conversation sessions
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY -> Users.id)
- `topic` (TEXT NOT NULL)
- `language` (TEXT NOT NULL)
- `started_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `ended_at` (TIMESTAMP)
- `rating` (INTEGER) # User's rating of the conversation (1-5)

### ConversationFeedback
Stores detailed feedback and learning points from conversations
- `id` (INTEGER PRIMARY KEY)
- `conversation_id` (INTEGER, FOREIGN KEY -> Conversations.id)
- `feedback_type` (TEXT NOT NULL) # e.g., 'grammar', 'vocabulary', 'pronunciation'
- `feedback` (TEXT NOT NULL)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### VocabularyItems
Tracks vocabulary words identified for practice
- `id` (INTEGER PRIMARY KEY)
- `conversation_id` (INTEGER, FOREIGN KEY -> Conversations.id)
- `user_id` (INTEGER, FOREIGN KEY -> Users.id)
- `word` (TEXT NOT NULL)
- `context` (TEXT) # The sentence or context where the word appeared
- `mastery_level` (INTEGER DEFAULT 0) # 0-5 scale of user's mastery
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

## Relationships
- One User can have many Interests (UserInterests)
- One User can have many Languages (UserLanguages)
- One User can have many Conversations
- One Conversation can have many Feedback items
- One Conversation can have many VocabularyItems
- One User can have many VocabularyItems (through Conversations)

## Notes
1. Using separate junction tables for interests and languages allows for flexible addition of new options without schema changes
2. Timestamps are included for future analytics and progress tracking
3. VocabularyItems are linked to both conversations and users for efficient querying
4. Feedback is stored in a separate table to allow for multiple types of feedback per conversation
5. SQLite's JSON support could be used to store additional unstructured data if needed

## MVP Scope Limitations
- No user authentication/authorization
- No session management
- No conversation message history storage (handled in-memory)
- No complex relationship tracking
- No user preferences or settings
