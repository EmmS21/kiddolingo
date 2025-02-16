# MVP Checklist - 24 Hour Build

## Core Features Priority
- [x] Basic user onboarding (no auth required for MVP)
- [ ] Simple conversation interface
- [ ] OpenAI integration for conversations
- [ ] Basic topic generation based on interests

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
- [ ] Setup FastAPI project
- [ ] Create basic API endpoints
  - [x] Save user profile
  - [x] Update user languages
  - [ ] Generate topics
  - [ ] Handle chat messages
- [ ] OpenAI integration
  - [ ] Basic prompt engineering for child-friendly responses
  - [ ] Language translation

### Nice to Have
- [ ] Response caching
- [ ] Error handling
- [ ] Rate limiting

## Database (SQLite for MVP)
### High Priority
- [x] Setup SQLite database
- [x] Basic schema
  - [x] Users table
  - [x] UserLanguages table
  - [x] UserInterests table
  - [ ] Conversations table
  - [ ] Topics table

## Integration Points
- [x] Frontend-Backend communication (partially - user data only)
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
  - [ ] Visual indicator of progress/mastery
  - [x] Expandable/collapsible UI (needs functionality)
- [ ] Subtopics (AI Generated)
  - [ ] 3-4 subtopics per main topic
  - [ ] Difficulty level indicator
  - [ ] Previous conversation scores
  - [ ] "Start Conversation" button

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
- [ ] Add ProfilePictures table
  - [ ] user_id (FOREIGN KEY)
  - [ ] image_data (BLOB)
  - [ ] updated_at (TIMESTAMP)
- [ ] Add Topics table
  - [ ] main_topic (from interests)
  - [ ] subtopic
  - [ ] difficulty_level
  - [ ] generated_by_ai (BOOLEAN)
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
- [ ] Profile settings access
- [ ] Topic filtering/search
- [ ] Easy access to start new conversations
- [ ] Vocabulary practice shortcuts

### Performance Considerations
- [x] Lazy loading for profile images
- [ ] Pagination for topics/subtopics
- [ ] Caching for AI-generated content
- [ ] Optimistic UI updates

### MVP Limitations
- [x] Limited to 3-4 main topics initially
- [ ] Basic AI topic generation
- [ ] Simple scoring system (1-5)
- [x] Local image storage only
- [ ] Basic vocabulary tracking

## Subtopics Implementation Plan
### Frontend Tasks
- [ ] Create SubtopicsList component
  - [ ] Expandable interface when topic is clicked
  - [ ] Loading state while fetching subtopics
  - [ ] Display 3-4 subtopics per main topic
  - [ ] Simple difficulty indicator (Easy/Medium/Hard)
  - [ ] "Start Conversation" button for each subtopic

### Backend Tasks
- [ ] Create subtopics API endpoints
  - [ ] GET /api/topics/{topic_id}/subtopics
  - [ ] POST /api/topics/{topic_id}/subtopics/complete
  - [ ] POST /api/topics/{topic_id}/generate (for AI generation)

### Database Updates
- [ ] Add Subtopics table
  - [ ] id (PRIMARY KEY)
  - [ ] topic_id (FOREIGN KEY -> Topics.id)
  - [ ] title (TEXT NOT NULL)
  - [ ] difficulty (TEXT NOT NULL) # Easy/Medium/Hard
  - [ ] is_completed (BOOLEAN DEFAULT FALSE)
  - [ ] created_at (TIMESTAMP)
  - [ ] completed_at (TIMESTAMP NULL)

### MVP Limitations
- [ ] Limit to 3-4 subtopics per main topic
- [ ] Store AI-generated subtopics locally to minimize API calls
- [ ] Simple completion tracking (completed/not completed)
- [ ] Basic difficulty levels only (no dynamic adjustment)
- [ ] No progress/mastery scoring for MVP


