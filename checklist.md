# MVP Checklist - 24 Hour Build

## Core Features Priority
- [x] Basic user onboarding (no auth required for MVP)
- [ ] Simple conversation interface
- [ ] OpenAI integration for conversations
- [x] Basic topic generation based on interests

## Frontend (NextJS) Tasks
### High Priority
- [x] Setup Next.js project
- [x] Create onboarding wizard (3-4 screens max)
  - [x] Name input
  - [x] Age selection
  - [x] Interest selection (predefined list)
  - [x] Target language selection (limit to 1-2 languages for MVP)
- [x] Build basic dashboard
  - [x] Display user profile
  - [x] Show interests as conversation topics
  - [x] Language selection/switching UI
  - [ ] Simple chat interface

### Nice to Have
- [x] Basic styling/UI polish
- [x] Mobile responsiveness
- [x] Progress indicators

## Backend (FastAPI) Tasks
### High Priority
- [x] Setup FastAPI project
- [ ] Create basic API endpoints
  - [x] Save user profile
  - [x] Update user languages
  - [x] Generate topics
  - [x] Generate subtopics with practice words
  - [ ] Handle chat messages
- [x] OpenAI integration
  - [x] Basic prompt engineering for subtopics generation
  - [x] Language-specific practice words
  - [ ] Chat conversation handling

### Nice to Have
- [x] Response caching
- [x] Error handling
- [ ] Rate limiting

## Database (SQLite for MVP)
### High Priority
- [x] Setup SQLite database
- [x] Basic schema
  - [x] Users table
  - [x] UserLanguages table
  - [x] UserInterests table
  - [ ] Conversations table
  - [x] Topics table

## Integration Points
- [x] Frontend-Backend communication
- [x] Language management system
- [ ] OpenAI API integration
- [x] Database connections

## Demo Preparation
- [ ] Prepare 2-3 example scenarios
- [ ] Test with different age groups/interests
- [ ] Prepare backup responses in case of API issues

## Dashboard Requirements
### User Profile Section
- [x] Profile picture component
  - [x] Default avatar if no upload
  - [x] Upload/change functionality
  - [x] Store image in SQLite as BLOB
  - [x] Circular frame with purple border
- [x] User name display
  - [x] Display name
  - [x] Match onboarding typography
- [x] Language management
  - [x] Display current language
  - [x] Add new languages
  - [x] Language switcher UI

### Topics Section
- [x] High-level topics grid
  - [x] Card for each interest from onboarding
  - [x] Interest icons from constants
  - [x] Visual indicator of progress/mastery
  - [x] Expandable/collapsible UI
- [x] Subtopics (AI Generated)
  - [x] 3-4 subtopics per main topic
  - [x] Difficulty level indicator
  - [ ] Previous conversation scores
  - [x] "Start Chat" button with hover mic icon

### Vocabulary Practice
- [ ] Vocabulary cards per conversation
  - [ ] Word in target language
  - [ ] Context from conversation
  - [ ] Mastery level indicator (0-5)
  - [ ] Practice button
- [ ] Practice interface
  - [ ] Word pronunciation
  - [ ] Example usage
  - [ ] Mark as mastered option

### Database Schema Updates
- [x] Add ProfilePictures table
  - [x] user_id (FOREIGN KEY)
  - [x] image_data (BLOB)
  - [x] updated_at (TIMESTAMP)
- [x] Add Topics table
  - [x] main_topic (from interests)
  - [x] subtopic
  - [x] difficulty_level
  - [x] generated_by_ai (BOOLEAN)
- [ ] Add TopicScores table
  - [ ] topic_id (FOREIGN KEY)
  - [ ] user_id (FOREIGN KEY)
  - [ ] score
  - [ ] conversation_date

### Color Scheme (Matching Onboarding)
- [x] Primary: Purple-600 (#9333EA)
- [x] Secondary: Black for text
- [x] Background: White
- [x] Accents:
  - [x] Light Purple for hover states
  - [x] Gray-200 for inactive states
  - [x] White text on purple backgrounds

### Layout
- [x] Responsive grid system
- [x] Main content area for topics
- [ ] Right panel for vocabulary practice
- [x] Consistent padding/spacing with onboarding

### Navigation
- [x] Profile settings access
- [ ] Topic filtering/search
- [ ] Easy access to start new conversations
- [ ] Vocabulary practice shortcuts

### Performance Considerations
- [x] Lazy loading for profile images
- [ ] Pagination for topics/subtopics
- [x] Caching for AI-generated content
- [ ] Optimistic UI updates

### MVP Limitations
- [x] Limited to 3-4 main topics initially
- [x] Basic AI topic generation
- [ ] Simple scoring system (1-5)
- [x] Local image storage only
- [ ] Basic vocabulary tracking

## Subtopics Implementation Plan
### Frontend Tasks
- [x] Create SubtopicsList component
  - [x] Expandable interface when topic is clicked
  - [x] Loading state while fetching subtopics
  - [x] Display 3-4 subtopics per main topic
  - [x] Simple difficulty indicator (Easy/Medium/Hard)
  - [x] "Start Chat" button for each subtopic

### Backend Tasks
- [x] Create subtopics API endpoints
  - [x] POST /api/topics/{topic_id}/subtopics/generate
  - [ ] GET /api/topics/{topic_id}/subtopics (cached)
  - [ ] POST /api/topics/{topic_id}/subtopics/complete

### Database Updates
- [x] Add Subtopics table
  - [x] id (TEXT PRIMARY KEY)
  - [x] topic_id (TEXT)
  - [x] title (TEXT)
  - [x] difficulty (TEXT)
  - [x] is_completed (BOOLEAN)
  - [x] practice_words (TEXT JSON)

### MVP Limitations
- [x] Limit to 3-4 subtopics per main topic
- [x] Store AI-generated subtopics locally to minimize API calls
- [x] Simple completion tracking (completed/not completed)
- [x] Basic difficulty levels only (no dynamic adjustment)
- [x] Single language pair support per request
- [ ] No progress/mastery scoring for MVP


