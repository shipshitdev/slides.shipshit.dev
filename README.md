# Pitch Deck Platform

A full-stack application for creating and managing pitch decks for different audiences (cold leads, customers, investors) across multiple projects/startups.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), Tailwind CSS, Clerk Auth
- **Backend**: NestJS, Mongoose, MongoDB
- **Presentation**: Reveal.js
- **Features**:
  - Auto-branding extraction from websites
  - Public shareable links with OG meta cards
  - PDF export
  - Claude skill for generating pitch content

## Project Structure

```
slides/
├── apps/
│   ├── api/          # NestJS backend
│   │   └── src/
│   │       ├── projects/   # Projects module
│   │       ├── decks/      # Decks module
│   │       └── branding/   # Branding extraction
│   └── web/          # Next.js frontend
│       └── src/
│           ├── app/        # App router pages
│           ├── components/ # React components
│           └── lib/        # Utilities
├── .claude/
│   └── skills/
│       └── pitch.md  # Claude skill for generating pitches
└── package.json      # Monorepo root
```

## Getting Started

### Prerequisites

- Bun runtime
- MongoDB (local or EC2 instance)
- Clerk account for authentication

### Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Configure environment variables:**

   Copy `.env.example` files and fill in your values:

   ```bash
   # apps/web/.env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_API_URL=http://localhost:4000/api

   # apps/api/.env
   DATABASE_URL=mongodb://localhost:27017/pitchdecks
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the development servers:**
   ```bash
   # Run both API and Web
   bun run dev

   # Or run separately
   bun run dev:api   # API on http://localhost:4000
   bun run dev:web   # Web on http://localhost:3000
   ```

4. **Open the app:**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:4000/docs

## Features

### Project Management
- Create multiple projects (startups/products)
- Auto-extract branding from website URLs (logo, colors, fonts)
- Customize colors and branding

### Deck Types
- **Cold Leads**: Quick hook, value prop, CTA
- **Customers**: Problem, solution, features, pricing
- **Investors**: Market, traction, team, financials
- **Custom**: Build from scratch

### Slide Templates
- Title slides
- Content with bullets
- Stats/metrics
- Team members
- Quotes
- Call to action
- Images

### Sharing
- Public shareable links
- Dynamic OG images for social previews
- Copy link functionality

## Claude Skill: `/pitch`

Generate tailored pitch content using the `/pitch` skill:

```
/pitch
```

This will interactively generate slide content based on your startup and target audience.

## API Endpoints

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

- `GET /api/decks?projectId=...` - List decks for project
- `POST /api/decks` - Create deck
- `GET /api/decks/:id` - Get deck
- `GET /api/decks/public/:slug` - Get public deck
- `PATCH /api/decks/:id` - Update deck
- `DELETE /api/decks/:id` - Delete deck

- `POST /api/branding/extract` - Extract branding from URL

## Deployment

### Vercel (Frontend)
```bash
cd apps/web
vercel
```

### Backend
Deploy the NestJS API to your EC2 instance or any Node.js hosting provider.

## License

MIT
