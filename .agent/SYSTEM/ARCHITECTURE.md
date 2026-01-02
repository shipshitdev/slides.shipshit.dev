# Architecture - deckflow

**Purpose:** Document what IS implemented (not what WILL BE).
**Last Updated:** 2025-01-27

---

## Overview

deckflow is a full-stack pitch deck platform built as a Next.js + NestJS monorepo. It enables users to create and manage pitch decks for different audiences (cold leads, customers, investors) across multiple projects/startups. The platform features auto-branding extraction from websites, public shareable links with OG meta cards, PDF export, and integration with Reveal.js for presentations.

---

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend:** NestJS, Mongoose, MongoDB
- **Presentation:** Reveal.js
- **Authentication:** Clerk
- **Package Manager:** Bun
- **Linting/Formatting:** Biome

---

## Project Structure

```
deckflowcom/
├── apps/
│   ├── api/                     # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts          # Bootstrap
│   │   │   ├── app.module.ts    # Root module
│   │   │   ├── projects/        # Projects module
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── projects.module.ts
│   │   │   │   ├── schemas/     # Mongoose schemas
│   │   │   │   └── dto/         # Data transfer objects
│   │   │   ├── decks/           # Decks module
│   │   │   │   ├── decks.controller.ts
│   │   │   │   ├── decks.service.ts
│   │   │   │   ├── decks.module.ts
│   │   │   │   ├── schemas/
│   │   │   │   └── dto/
│   │   │   └── branding/        # Branding extraction
│   │   │       ├── branding.controller.ts
│   │   │       ├── branding.service.ts
│   │   │       └── branding.module.ts
│   │   └── package.json
│   └── web/                      # Next.js frontend
│       ├── src/
│       │   ├── app/              # App Router pages
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── dashboard/
│       │   │   ├── projects/
│       │   │   ├── p/[slug]/    # Public deck view
│       │   │   └── api/og/       # OG image generation
│       │   ├── components/      # React components
│       │   │   ├── navbar.tsx
│       │   │   ├── slides/       # Slide components
│       │   │   └── ui/           # UI components
│       │   ├── lib/              # Utilities
│       │   │   ├── api.ts        # API client
│       │   │   ├── useReveal.ts  # Reveal.js hook
│       │   │   └── utils.ts
│       │   └── types/            # TypeScript types
│       └── package.json
├── .claude/
│   └── skills/
│       └── pitch.md              # Claude skill for pitch generation
└── package.json                  # Monorepo root
```

---

## Key Components

### Backend API (`apps/api/`)

**Purpose:** REST API for projects, decks, and branding extraction
**Location:** `apps/api/src/`
**Dependencies:** NestJS, Mongoose, MongoDB

**Modules:**

#### Projects Module
- **Controller:** `projects.controller.ts` - REST endpoints
- **Service:** `projects.service.ts` - Business logic
- **Schema:** `project.schema.ts` - Mongoose model
- **DTOs:** Create/Update project DTOs

**Endpoints:**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Decks Module
- **Controller:** `decks.controller.ts` - REST endpoints
- **Service:** `decks.service.ts` - Business logic
- **Schema:** `deck.schema.ts` - Mongoose model
- **DTOs:** Create/Update deck DTOs

**Endpoints:**
- `GET /api/decks?projectId=...` - List decks for project
- `POST /api/decks` - Create deck
- `GET /api/decks/:id` - Get deck
- `GET /api/decks/public/:slug` - Get public deck
- `PATCH /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck

#### Branding Module
- **Controller:** `branding.controller.ts` - Branding extraction endpoint
- **Service:** `branding.service.ts` - Website scraping and extraction
- **Features:** Logo, colors, fonts extraction from URLs

**Endpoints:**
- `POST /api/branding/extract` - Extract branding from URL

### Frontend Web App (`apps/web/`)

**Purpose:** Next.js web application for deck creation and management
**Location:** `apps/web/src/`
**Dependencies:** Next.js, React, Tailwind CSS, Clerk

**Key Pages:**
- `/` - Landing/home page
- `/dashboard` - User dashboard
- `/projects` - Projects list
- `/projects/[projectId]` - Project detail
- `/projects/[projectId]/decks/[deckId]` - Deck editor
- `/projects/[projectId]/decks/[deckId]/present` - Presentation view (Reveal.js)
- `/p/[slug]` - Public deck view
- `/sign-in`, `/sign-up` - Clerk authentication

**Components:**
- `navbar.tsx` - Navigation bar
- `slides/` - Slide editing components
  - `slide-templates.tsx` - Slide templates
  - `sortable-slide-list.tsx` - Drag-and-drop slide list
  - `sortable-bullet-list.tsx` - Bullet point editor
  - `sortable-stats-list.tsx` - Stats editor
  - `google-font-loader.tsx` - Font loading
- `ui/` - Reusable UI components (Button, Card, Input, etc.)

**Libraries:**
- `lib/api.ts` - API client for backend
- `lib/useReveal.ts` - Reveal.js React hook
- `lib/utils.ts` - Utility functions

**Features:**
- Reveal.js integration for presentations
- Drag-and-drop slide editing
- Real-time preview
- Public shareable links
- OG image generation (`/api/og` route)

---

## Data Flow

### Deck Creation Flow

```
1. User creates project
   ↓
2. POST /api/projects → ProjectsService.create()
   ↓
3. Save to MongoDB
   ↓
4. User creates deck for project
   ↓
5. POST /api/decks → DecksService.create()
   ↓
6. Save deck with project reference
   ↓
7. User edits slides in Next.js app
   ↓
8. PATCH /api/decks/:id → Update deck
   ↓
9. User views presentation
   ↓
10. Reveal.js renders slides from deck data
```

### Branding Extraction Flow

```
1. User provides website URL
   ↓
2. POST /api/branding/extract → BrandingService.extract()
   ↓
3. Scrape website HTML
   ↓
4. Extract:
   - Logo (from <img> tags, Open Graph, etc.)
   - Colors (from CSS, theme-color meta, etc.)
   - Fonts (from @font-face, Google Fonts, etc.)
   ↓
5. Return branding data
   ↓
6. Apply to project/deck
```

### Public Deck View Flow

```
1. User shares deck (generates slug)
   ↓
2. Public URL: /p/[slug]
   ↓
3. GET /api/decks/public/:slug → DecksService.findBySlug()
   ↓
4. Return deck data (public, no auth required)
   ↓
5. Reveal.js renders presentation
   ↓
6. OG image generated via /api/og route
```

---

## External Services

| Service | Purpose | Documentation | Authentication |
|---------|---------|---------------|----------------|
| Clerk | Authentication | https://clerk.com/docs | API keys |
| MongoDB | Database | https://www.mongodb.com/docs | Connection string |
| Reveal.js | Presentation framework | https://revealjs.com | None (client-side) |

---

## Configuration

### Environment Variables

**Backend (`apps/api/.env`):**
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | MongoDB connection string | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |
| `PORT` | API server port | ❌ (default: 4000) |

**Frontend (`apps/web/.env.local`):**
| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |

---

## Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel
```

### Backend

Deploy NestJS API to:
- EC2 instance
- Railway
- Render
- Any Node.js hosting provider

**Requirements:**
- Node.js 18+ or Bun
- MongoDB instance (Atlas or self-hosted)

---

## Security

See `quality/SECURITY-CHECKLIST.md` for security considerations.

**Key Security Features:**
- Clerk authentication (JWT tokens)
- CORS configuration
- Public deck access via slugs (no auth required)
- OG image generation (server-side)

---

## Related Documentation

- `RULES.md` - Coding standards
- `architecture/DECISIONS.md` - Architectural decisions
- `architecture/PROJECT-MAP.md` - Project map
- `README.md` - User-facing documentation
