# Project Structure

📦 kiddolingo
 ┣ 📂 frontend
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api            # API Route Handlers
 ┃ ┃ ┃ ┣ 📂 users
 ┃ ┃ ┃   ┣ 📂 languages        # NEW: Languages endpoint
 ┃ ┃ ┃   ┃ ┗ 📜 route.ts      # Handle language updates
 ┃ ┃ ┃   ┣ 📂 profile-picture
 ┃ ┃ ┃   ┃ ┗ 📜 route.ts    # Handle profile picture uploads
 ┃ ┃ ┃   ┗ 📜 route.ts      # GET/POST /api/users endpoint
 ┃ ┃ ┃ ┣ 📂 topics                  # NEW: Topics API routes
 ┃ ┃ ┃ ┃ ┣ 📂 [topicId]
 ┃ ┃ ┃ ┃ ┃ ┗ 📂 subtopics
 ┃ ┃ ┃ ┃ ┃   ┗ 📜 route.ts         # Handle subtopic generation
 ┃ ┃ ┃ ┃ ┗ 📜 route.ts             # Topics operations
 ┃ ┃ ┣ 📂 dashboard       # New dashboard page
 ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┃ ┣ 📂 components      # Shared components
 ┃ ┃ ┃ ┣ 📂 topics
 ┃ ┃ ┃ ┃ ┣ 📜 TopicCard.tsx        # Individual topic card with expand/collapse
 ┃ ┃ ┃ ┃ ┣ 📜 SubtopicsList.tsx    # List of subtopics that appears when expanded
 ┃ ┃ ┃ ┃ ┣ 📜 SubtopicItem.tsx     # Individual subtopic with difficulty and progress
 ┃ ┃ ┃ ┃ ┣ 📜 ProgressBar.tsx      # Reusable progress bar component
 ┃ ┃ ┃ ┃ ┗ 📜 PracticeWords.tsx    # Component for displaying practice words
 ┃ ┃ ┃ ┣ 📂 chat                    # NEW: Chat components
 ┃ ┃ ┃ ┃ ┣ 📜 VoiceChat.tsx         # Main chat interface
 ┃ ┃ ┃ ┃ ┣ 📜 AudioRecorder.tsx     # Recording controls
 ┃ ┃ ┃ ┃ ┣ 📜 ChatFeedback.tsx      # Visual feedback
 ┃ ┃ ┃ ┃ ┗ 📜 ChatTranscript.tsx    # Show text transcript
 ┃ ┃ ┃ ┗ 📜 LoadingSpinner.tsx     # Shared loading spinner component
 ┃ ┃ ┣ 📂 lib            # Shared utilities
 ┃ ┃ ┃ ┣ 📜 db.ts        # Database operations
 ┃ ┃ ┃ ┣ 📜 types.ts     # Shared TypeScript types
 ┃ ┃ ┃ ┣ 📂 audio                   # NEW: Audio utilities
 ┃ ┃ ┃ ┃ ┗ 📜 recorder.ts           # Audio recording helpers
 ┃ ┃ ┃ ┣ 📂 websocket              # NEW: WebSocket utilities
 ┃ ┃ ┃ ┃ ┗ 📜 voiceChat.ts         # WebSocket connection manager
 ┃ ┃ ┃ ┗ 📜 constants.ts    # UPDATED: Added languages list
 ┃ ┃ ┃ ┗ 📜 topics.ts              # Topic-related utilities
 ┃ ┃ ┣ 📜 globals.css
 ┃ ┃ ┣ 📜 layout.tsx
 ┃ ┃ ┗ 📜 page.tsx
 ┃ ┣ 📂 public
 ┃ ┣ 📜 .gitignore
 ┃ ┣ 📜 next.config.ts
 ┃ ┣ 📜 package.json
 ┃ ┣ 📜 postcss.config.mjs
 ┃ ┣ 📜 README.md
 ┃ ┣ 📜 tailwind.config.ts
 ┃ ┗ 📜 tsconfig.json
 ┣ 📜 .gitignore
 ┣ 📜 README.md
 ┣ 📜 checklist.md
 ┣ 📜 databasedesign.md
 ┗ 📜 projectdescription.md

# New Additions:
1. Added `/api/users/[id]/route.ts` for fetching individual user data
2. Updated folder structure to support dynamic API routes
3. Added `lib/constants.ts` for app-wide constants including interest icons
4. Added `/api/topics/[topicId]/subtopics/route.ts` for subtopic generation
5. Added new types in `types.ts` for subtopics
6. Added new database tables and functions for subtopics caching
7. Added chat components for voice conversation interface
8. Added audio utilities for recording management
9. Added WebSocket utilities for connection handling

# File Updates:
1. Added `/api/users/languages/route.ts` for handling language updates
2. Updated `lib/constants.ts` to include AVAILABLE_LANGUAGES
3. Updated `lib/db.ts` to include addUserLanguage function and subtopics caching
4. Modified `lib/types.ts` to include Subtopic interfaces
5. Modified `components/topics/TopicCard.tsx` to fetch real data
6. Modified `components/topics/SubtopicsList.tsx` to use real data
7. Added new chat-related components and utilities

# Modified Files:
- `lib/constants.ts`: Added shared language options
- `dashboard/page.tsx`: Now uses languages from constants
- `page.tsx`: Now uses languages from constants

# File Purposes:
- `lib/db.ts`: Database operations
- `lib/types.ts`: Shared TypeScript types
- `lib/constants.ts`: App-wide constants and mappings
- `api/users/route.ts`: GET/POST endpoints for user data
- `api/users/profile-picture/route.ts`: Handle profile picture uploads
- `api/topics/[topicId]/subtopics/route.ts`: Handles subtopic generation and caching

# API Changes:
- Added `/api/topics/[topicId]/subtopics/route.ts` for fetching subtopics
- Added `/api/topics/route.ts` for topic operations
