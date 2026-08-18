# 04. Folder Structure

The repository is structured as a monorepo workspace split into two main applications: `soldbay-web` (the Next.js website and backend API) and `soldbay-app` (the Expo React Native mobile application).

```
soldbay/
├── Project Bible/               # System architecture and documentation folder
│   ├── README.md                # Bible Index
│   ├── 01_vision.md             # Vision and targets
│   ├── 02_features.md           # Specifications
│   ├── 03_tech_stack.md         # Dependencies and libraries
│   ├── 04_folder_structure.md   # [You are here] Directory mapping
│   ├── 05_database.md           # Schema details
│   ├── 06_api_design.md         # Route endpoints
│   ├── 07_ui_design_system.md   # Design tokens & CSS
│   ├── 08_coding_standards.md   # Linting and coding rules
│   ├── 09_roadmap.md            # Versions & phases
│   ├── 10_ai_instructions.md    # Instructions for AI agents
│   └── 11_progress_log.md       # Development history log
├── design/                      # Global design scripts and brand graphics
├── soldbay-web/                 # Next.js Web App & API
│   ├── prisma/                  # Database management
│   │   ├── migrations/          # SQL database migration history
│   │   ├── schema.prisma        # Database schema definitions
│   │   ├── seed.ts              # Database seeding scripts (Categories/Universities)
│   │   └── seed-admin.ts        # Database seeding script for admin users
│   ├── src/                     # Source directory
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── api/             # API Route Handlers
│   │   │   │   ├── auth/        # Auth endpoints (signup, mobile log in)
│   │   │   │   ├── categories/  # Category list
│   │   │   │   ├── listings/    # Product listing creation/retrieval/deletion
│   │   │   │   ├── questions/   # Ask question submissions
│   │   │   │   ├── sellers/     # Seller registration & verification
│   │   │   │   ├── universities/# University list
│   │   │   │   ├── upload/      # Image uploads to Vercel Blob
│   │   │   │   ├── users/       # User self endpoints
│   │   │   │   └── waitlist/    # Waitlist submissions & count
│   │   │   ├── join/            # Waitlist registration views
│   │   │   ├── login/           # Web portal login screen
│   │   │   ├── signup/          # Web portal registration screen
│   │   │   ├── success/         # Signup success confirmation
│   │   │   ├── globals.css      # Tailwind v4 globals, variables, theme overrides
│   │   │   ├── layout.tsx       # Next.js root layout
│   │   │   └── page.tsx         # Next.js marketing landing page
│   │   ├── components/          # React components
│   │   │   ├── landing/         # Marketing landing components (Hero, FAQ, etc.)
│   │   │   ├── ui/              # shadcn/ui components (radix primitives)
│   │   │   ├── join-form.tsx    # Waitlist signup multi-step form
│   │   │   └── site-nav.tsx     # Navigation header component
│   │   ├── generated/           # Prisma client output target
│   │   ├── lib/                 # Helper utilities (prisma, auth, motion, error)
│   │   ├── types/               # Custom types definitions
│   │   └── middleware.ts        # Route guard and JWT verification middleware
│   ├── components.json          # shadcn/ui configuration file
│   ├── next.config.ts           # Next.js configuration
│   ├── package.json             # Web package configuration
│   └── tsconfig.json            # TypeScript configuration
└── soldbay-app/                 # Expo Mobile Application
    ├── assets/                  # Fonts, local image files, and app icon assets
    ├── src/                     # React Native source directory
    │   ├── app/                 # Expo Router file system routing
    │   │   ├── buyer/           # Buyer application view layouts
    │   │   │   ├── home.tsx     # Buyer home feed
    │   │   │   └── listing-detail.tsx # Listing detail card
    │   │   ├── seller/          # Seller application view layouts
    │   │   │   ├── create-listing.tsx # Posting creations
    │   │   │   ├── dashboard.tsx# Seller store dashboard
    │   │   │   └── verify.tsx   # Seller matric and ID upload
    │   │   ├── forgot-password/ # Password retrieval layout
    │   │   │   └── index.tsx    # Forgot password view
    │   │   ├── login.tsx        # Authentication login screen
    │   │   ├── signup.tsx       # Authentication registration screen
    │   │   ├── select-role.tsx  # User type selector screen
    │   │   ├── select-university.tsx # University campus assignment
    │   │   ├── index.tsx        # App initialization & routing gatekeeper
    │   │   ├── global.css       # NativeWind entry stylesheet
    │   │   └── _layout.tsx      # Root stack navigation layout
    │   ├── components/          # Reusable React Native UI elements
    │   └── lib/                 # Utilities and API clients
    ├── app.json                 # Expo system configurations
    ├── eas.json                 # Expo Application Services compilation settings
    ├── metro.config.js          # Metro packager bundler overrides
    ├── package.json             # Mobile package configuration
    └── tsconfig.json            # TypeScript configuration
```
