# DeckFlow - Pitch Deck Platform

## Project Overview

Full-stack application for creating and managing pitch decks for different audiences (cold leads, customers, investors) across multiple startups.

## Tech Stack

- **Runtime**: Bun
- **API**: NestJS + MongoDB + Mongoose
- **Web**: Next.js 14+ (App Router) + Tailwind CSS
- **Auth**: Clerk
- **Presentation**: Reveal.js
- **Linting**: Biome

## Project Structure

```
deckflowcom/
├── apps/
│   ├── api/          # NestJS backend
│   │   └── src/
│   │       ├── projects/   # Projects module
│   │       ├── decks/      # Decks module
│   │       └── branding/   # Branding extraction
│   └── web/          # Next.js frontend
└── .claude/skills/   # Claude skill for generating pitches
```

## Commands

```bash
bun run dev        # Start both API and web
bun run build      # Build all apps
bun run check:fix  # Fix linting issues
```

## Key Features

- Auto-branding extraction from websites
- Public shareable links with OG meta cards
- PDF export
- Multi-audience deck variants

## Documentation

- Session logs: `.agent/SESSIONS/YYYY-MM-DD.md`
