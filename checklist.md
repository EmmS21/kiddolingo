# MVP Checklist - 24 Hour Build

## Core Features Priority
- [ ] Basic user onboarding (no auth required for MVP)
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
- [ ] Build basic dashboard
  - [ ] Display user profile
  - [ ] Show 3-4 conversation topics
  - [ ] Simple chat interface

### Nice to Have
- [x] Basic styling/UI polish
- [x] Mobile responsiveness
- [x] Progress indicators

## Backend (FastAPI) Tasks
### High Priority
- [ ] Setup FastAPI project
- [ ] Create basic API endpoints
  - [ ] Save user profile
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
- [ ] Setup SQLite database
- [ ] Basic schema
  - [ ] Users table
  - [ ] Conversations table
  - [ ] Topics table

## Integration Points
- [ ] Frontend-Backend communication
- [ ] OpenAI API integration
- [ ] Database connections

## Demo Preparation
- [ ] Prepare 2-3 example scenarios
- [ ] Test with different age groups/interests
- [ ] Prepare backup responses in case of API issues

## Out of Scope for MVP
- Voice integration (text-based chat for MVP)
- Authentication
- Multiple language support (focus on one language pair)
- Progress tracking
- Advanced error handling
- Complex database relations
- Parent dashboard
- Advanced topic generation




## Dashboard Requirements
### User Profile Section
- [ ] Profile picture component
  - [ ] Default avatar if no upload
  - [ ] Upload/change functionality
  - [ ] Store image in SQLite as BLOB
  - [ ] Circular frame with purple border
- [ ] User name display
  - [ ] Greeting message
  - [ ] Match onboarding typography

### Topics Section
- [ ] High-level topics grid
  - [ ] Card for each interest from onboarding
  - [ ] Visual indicator of progress/mastery
  - [ ] Expandable/collapsible subtopics
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
- Primary: Purple-600 (#9333EA)
- Secondary: Black for text
- Background: White
- Accents:
  - Light Purple for hover states
  - Gray-200 for inactive states
  - White text on purple backgrounds

### Layout
- [ ] Responsive grid system
- [ ] Sidebar for profile/navigation
- [ ] Main content area for topics
- [ ] Right panel for vocabulary practice
- [ ] Consistent padding/spacing with onboarding

### Navigation
- [ ] Profile settings access
- [ ] Topic filtering/search
- [ ] Easy access to start new conversations
- [ ] Vocabulary practice shortcuts

### Performance Considerations
- [ ] Lazy loading for profile images
- [ ] Pagination for topics/subtopics
- [ ] Caching for AI-generated content
- [ ] Optimistic UI updates

### MVP Limitations
- Limited to 3-4 main topics initially
- Basic AI topic generation
- Simple scoring system (1-5)
- Local image storage only
- Basic vocabulary tracking


