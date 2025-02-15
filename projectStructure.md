# Project Structure

📦 kiddolingo
 ┣ 📂 frontend
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📂 api            # API Route Handlers
 ┃ ┃ ┃ ┗ 📂 users
 ┃ ┃ ┃   ┗ 📜 route.ts   # POST /api/users endpoint
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
1. Added `/api/users/route.ts` for handling user data submission
2. Kept existing lib structure with db.ts and types.ts

# File Purposes:
- `lib/db.ts`: Database operations
- `lib/types.ts`: Shared TypeScript types
- `api/users/route.ts`: User-related API endpoints
