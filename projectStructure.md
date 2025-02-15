# Project Structure

📦 kiddolingo
 ┣ 📂 frontend
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api            # API Route Handlers
 ┃ ┃ ┃ ┣ 📂 users
 ┃ ┃ ┃   ┣ 📂 profile-picture
 ┃ ┃ ┃   ┃ ┗ 📜 route.ts    # Handle profile picture uploads
 ┃ ┃ ┃   ┗ 📜 route.ts      # GET/POST /api/users endpoint
 ┃ ┃ ┣ 📂 dashboard       # New dashboard page
 ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┃ ┣ 📂 components      # Shared components
 ┃ ┃ ┃ ┗ 📜 ProfilePicture.tsx
 ┃ ┃ ┣ 📂 lib            # Shared utilities
 ┃ ┃ ┃ ┣ 📜 db.ts        # Database operations
 ┃ ┃ ┃ ┗ 📜 types.ts     # Shared TypeScript types
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

# File Purposes:
- `lib/db.ts`: Database operations
- `lib/types.ts`: Shared TypeScript types
- `api/users/route.ts`: GET/POST endpoints for user data
- `api/users/profile-picture/route.ts`: Handle profile picture uploads
