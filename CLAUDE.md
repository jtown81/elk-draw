# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**South Dakota Elk Draw Analyzer** — Interactive tool for analyzing elk hunting draw odds with 11 preference points. Two distinct implementations:

- **CLI** (`analyzer.mcp.js`) — Standalone Node.js terminal app (zero dependencies, no build)
- **Web App** (`src/`) — React + TypeScript web interface (Vite dev server + production build)

## Quick Start

### CLI (Standalone Node.js)

```bash
node analyzer.mcp.js
```

Runs immediately, no setup needed. Data saves to `elk-draw-data.json`.

### Web App (Vite + React)

```bash
pnpm install                # install dependencies (first time only)
pnpm dev                    # dev server at http://localhost:3333
pnpm build                  # production build to dist/
pnpm preview                # preview production build
pnpm test                   # run tests
pnpm test:watch             # run tests in watch mode
pnpm typecheck              # TypeScript type check (no emit)
```

## Architecture

### Two Separate Implementations

**CLI (`analyzer.mcp.js`)**
- Pure Node.js, no dependencies, no build step
- Runs from terminal with `node analyzer.mcp.js`
- Uses readline for interactive prompts, fs for file I/O
- ANSI color codes for terminal output
- Saves/loads data to `elk-draw-data.json` in current directory

**Web App (`src/`)**
- React 19 + TypeScript 5
- Vite 5 for dev server and build
- Path aliases configured: `@components`, `@modules`, `@models`, `@utils`, `@hooks`, `@data`, `@config`
- Tailwind CSS 4 for styling
- Vitest 1 for unit tests
- Builds to `dist/` for production
- Dev server runs on `http://localhost:3333`

### Why Two Implementations?

- **CLI** — For quick offline analysis without any setup (useful for hunting trips)
- **Web** — For enhanced UI, cross-platform access, offline persistence via localStorage

## Key Features

- Interactive menu-driven interface
- Cubed preference points calculation: (11+1)³ = 1,728 entries
- Odds calculation: (1,728 ÷ Total Applicants) × 100
- Data persistence to JSON
- Export/import functionality
- Top 5 recommendations
- Color-coded terminal output (CLI)
- Responsive web interface

## Data Files

- `elk-draw-data.json` - Stores unit data and statistics
- Format: JSON array of unit entries

## Directory Structure

```
hunting/
  src/
    components/         — React UI components
    modules/            — Business logic (calculations, data handling)
    models/             — TypeScript types and interfaces
    utils/              — Helper functions and utilities
    hooks/              — Custom React hooks
    data/               — Static data (elk units, constants)
    config/             — Configuration (colors, constants)
    App.tsx             — Main React component
    main.tsx            — Vite entry point
    index.css           — Global styles
  tests/                — Vitest unit tests
  analyzer.mcp.js       — CLI tool (standalone, no build needed)
  elk-draw-data.json    — CLI data persistence
  index.html            — Web app HTML shell
  vite.config.ts        — Vite build config
  vitest.config.ts      — Vitest config
  tsconfig.json         — TypeScript config
  tailwind.config.js    — Tailwind CSS config
  postcss.config.js     — PostCSS config
  package.json          — Dependencies and scripts
```

## Menu System (CLI)

```
[1] Add Unit Data - Interactive data entry
[2] View All Data - Display all entries
[3] Calculate & Results - Ranked analysis
[4] Show Recommendations - Top 5 units
[5] Delete Unit - Remove entry
[6] Export Data - Save to JSON
[7] Import Data - Load from JSON
[8] Clear All Data - Reset everything
[9] Help - Help menu
[0] Exit - Close application
```

## Draw System Knowledge

- **User**: 11 South Dakota elk preference points
- **Pool**: 10+ Preference Point Pool (33% of tags)
- **Entries**: 1,728 lottery entries
- **Competitiveness**: Only competes with other 10+ point holders
- **Formula**: User Odds % = 1,728 ÷ [10+ Applicants] × 100

## Elk Units (Supported)

**Black Hills**: H1A, H1B, H2A, H2B, H2E, H3A, H3B, H3C, H3D, H3E, H4A, H4B, H5, H6A, H6B, H11A, H11B, H11C, H11D, H11E

**Prairie**: 9A, 11A, 11B, 15A, 15B, 27A, 27B

**CSP**: CSP

## Core Concepts

### Preference Points & Odds

- **Your Points**: 11 preference points in the 10+ Preference Point Pool
- **Pool Share**: 33% of available tags
- **Lottery Entries**: (11+1)³ = 1,728 entries per unit
- **Odds Formula**: `(1,728 ÷ Total 10+ Applicants) × 100`
- **Example**: If 4,320 applicants compete for 10+ tags: `1,728 ÷ 4,320 × 100 = 40%` odds

### Data Persistence

**CLI**:
- Stores entries in `elk-draw-data.json` (git-ignored)
- Each entry includes: id, unitName, year, tags, apps10Plus, lowestPoint, odds, addedDate
- Can export/import JSON files

**Web**:
- Uses browser localStorage under `hunting:` namespace
- Syncs with same JSON structure as CLI for compatibility

## Data Format

```json
{
  "id": 1234567890,
  "unitName": "H1A",
  "year": 2026,
  "tags": 30,
  "apps10Plus": 4320,
  "lowestPoint": 11,
  "odds": 40.00,
  "addedDate": "2026-01-15T10:20:00.000Z"
}
```

## Testing

Run tests locally:

```bash
pnpm test              # Run all tests once
pnpm test:watch        # Run tests in watch mode
pnpm typecheck         # Check TypeScript types
```

## External Resources

- **GFP Draw Statistics**: https://license.gooutdoorssouthdakota.com/License/DrawStatistics
- **Preference Points Info**: https://gfp.sd.gov/preference-points/
- **Elk Information**: https://gfp.sd.gov/elk/
- **GFP Support**: 605-223-7660

## Workspace Context

This project is part of the `/home/jpl/app-dev/` workspace. Other projects:
- `retire-app/` - Retirement planning simulator
- `leave-app/` - Federal leave tracker
- `fishing/` - Tournament PWA
- `3peaks/` - Production templates
- `cabin/` - Expense tracker
- `brand/` - Brand assets

**Important**: Work only in this directory. Never cross project boundaries.

## Git

- Git repo: `hunting/.git` (separate from workspace root)
- Remote: (configure as needed)
- Run git commands from `hunting/` directory

## Common Tasks

### Start CLI

```bash
node analyzer.mcp.js
```

### Start Web Dev Server

```bash
pnpm dev
```

Then open `http://localhost:3333` in your browser.

### Build for Production

```bash
pnpm build
```

Output goes to `dist/` directory. Deploy statically to any web server.

### Quick Manual Testing

**CLI**: Add a unit, calculate odds, verify results save to `elk-draw-data.json`

**Web**: Add a unit, refresh page, verify data persists (check browser DevTools → Application → LocalStorage)
