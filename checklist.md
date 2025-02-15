

# MVP Checklist - 24 Hour Build

## Core Features Priority
- [ ] Basic user onboarding (no auth required for MVP)
- [ ] Simple conversation interface
- [ ] OpenAI integration for conversations
- [ ] Basic topic generation based on interests

## Frontend (NextJS) Tasks
### High Priority
- [ ] Setup Next.js project
- [ ] Create onboarding wizard (3-4 screens max)
  - [ ] Name input
  - [ ] Age selection
  - [ ] Interest selection (predefined list)
  - [ ] Target language selection (limit to 1-2 languages for MVP)
- [ ] Build basic dashboard
  - [ ] Display user profile
  - [ ] Show 3-4 conversation topics
  - [ ] Simple chat interface

### Nice to Have
- [ ] Basic styling/UI polish
- [ ] Mobile responsiveness
- [ ] Progress indicators

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


