# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚀 Quick Reference: Where to Work

**Always check where you are before running commands:**

```bash
pwd  # Should show: /home/jpl/app-dev/hunting
```

**Never run commands in `/home/jpl/app-dev/` directly.** Always `cd` into `hunting/` first.

---

## ⚠️ SCOPE RESTRICTION — STRICTLY ENFORCED

This project directory is completely independent. Never cross project boundaries.

When working in this directory:
- **Work ONLY in `hunting/`** — never navigate to parent directories
- **Never modify files in sibling project directories** (e.g., `retire-app/`, `fishing/`, `cabin/`, `3peaks/`, `brand/`, `leave-app/`, `bhss/`)
- **Run all commands from `hunting/`** — never run commands in workspace root `/home/jpl/app-dev/`
- **Make all git commits in this project's repo** — `hunting/.git` (independent from workspace root)
- **Never cross-import between projects** — each project has its own dependencies and version constraints

---

## Project Overview

**South Dakota Elk Draw Analyzer** — Interactive tool for analyzing elk hunting draw odds with 11 preference points. Two distinct implementations:

- **CLI** (`analyzer.mcp.js`) — Standalone Node.js terminal app (zero dependencies, no build)
- **Web App** (`src/`) — React + TypeScript web interface (Vite dev server + production build)
- **Docker** — Containerized production deployment (port 3456)

## Quick Start

### Using build.sh (Recommended)

```bash
./build.sh
```

Interactive menu with 13 build scenarios.

### CLI (Standalone Node.js)

```bash
node analyzer.mcp.js
```

Runs immediately, no setup needed. Data saves to `elk-draw-data.json`.

### Web App (Vite + React)

```bash
pnpm install                # install dependencies (first time only)
pnpm dev                    # dev server at http://localhost:3456
pnpm build                  # production build to dist/
pnpm preview                # preview production build
pnpm test                   # run tests
pnpm test:watch             # run tests in watch mode
pnpm typecheck              # TypeScript type check (no emit)
```

### Docker (Production)

```bash
docker compose up -d        # Start container
docker compose logs -f      # View logs
docker compose down         # Stop container
```

App available at: http://localhost:3456

## Build Scenarios (build.sh)

```
1. Development Server (with hot reload)
2. Production Build Only
3. Production Build + Preview
4. Run All Tests
5. Run Tests (watch mode)
6. Type Check
7. Clean Build (delete dist/ and rebuild)
8. Full Build Pipeline (test + typecheck + build)
9. Full Build Pipeline + Start Server
10. Docker: Build Image
11. Docker: Start Container (docker compose up)
12. Docker: Stop Container (docker compose down)
13. Docker: View Logs
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
- Dev server runs on `http://localhost:3456`

### Why Two Implementations?

- **CLI** — For quick offline analysis without any setup (useful for hunting trips)
- **Web** — For enhanced UI, cross-platform access, offline persistence via localStorage
- **Docker** — For production deployment, consistent environment, health checks

## Key Features

- Interactive menu-driven interface (CLI) and React UI (Web)
- Cubed preference points calculation: (11+1)³ = 1,728 entries
- Odds calculation: (1,728 ÷ Total Applicants) × 100
- Multi-user account management with localStorage isolation
- Data persistence to JSON (CLI) and localStorage (Web)
- Export/import functionality
- Top 5 recommendations
- Color-coded terminal output (CLI)
- Responsive web interface (desktop, tablet, mobile)
- Docker containerization with health checks

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
  tests/                — Vitest unit tests (30 tests)
  analyzer.mcp.js       — CLI tool (standalone, no build needed)
  elk-draw-data.json    — CLI data persistence (git-ignored)
  index.html            — Web app HTML shell
  vite.config.ts        — Vite build config
  vitest.config.ts      — Vitest config
  tsconfig.json         — TypeScript config
  tailwind.config.js    — Tailwind CSS config
  postcss.config.js     — PostCSS config
  package.json          — Dependencies and scripts
  docker-compose.yml    — Docker Compose configuration
  Dockerfile            — Multi-stage production build
  .dockerignore         — Build context optimization
  build.sh              — Interactive build script
  DOCKER.md             — Deployment guide
  DOCKER-REGISTRY.md    — Registry setup (ghcr.io)
```

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
- Uses browser localStorage under `sd-elk:` namespace
- Multi-user support with per-user data isolation
- Per-user keys: `sd-elk:accounts`, `sd-elk:draw-records:{userId}`, `sd-elk:user-config:{userId}`

## Elk Units (Supported)

**Black Hills**: H1A, H1B, H2A, H2B, H2E, H3A, H3B, H3C, H3D, H3E, H4A, H4B, H5, H6A, H6B, H11A, H11B, H11C, H11D, H11E

**Prairie**: 9A, 11A, 11B, 15A, 15B, 27A, 27B

**CSP**: CSP

## Testing

Run tests locally:

```bash
pnpm test              # Run all tests once (30 tests)
pnpm test:watch        # Run tests in watch mode
pnpm typecheck         # Check TypeScript types
```

Test Coverage:
- **Unit Tests** (14): odds-calculator functions, edge cases
- **Hook Tests** (10): localStorage persistence, account isolation
- **Integration Tests** (6): end-to-end workflows, tag filtering

## Docker Deployment

### Quick Start
```bash
docker compose up -d
# App available at http://localhost:3456
```

### Configuration
- **Port**: 3456 (configurable in docker-compose.yml)
- **Health Check**: Automatic, every 30 seconds
- **Restart Policy**: Auto-restart unless stopped

### Image Details
- **Base**: Node 20 Alpine
- **Build**: Multi-stage (builder + runtime)
- **Size**: ~100-150 MB
- **Registry**: `ghcr.io/jtown81/elk-draw`
- **Tags**: `latest`, `v1.0.0`

See `DOCKER.md` and `DOCKER-REGISTRY.md` for detailed deployment instructions.

## External Resources

- **GFP Draw Statistics**: https://license.gooutdoorssouthdakota.com/License/DrawStatistics
- **Preference Points Info**: https://gfp.sd.gov/preference-points/
- **Elk Information**: https://gfp.sd.gov/elk/
- **GFP Support**: 605-223-7660
- **GitHub Repository**: https://github.com/jtown81/elk-draw
- **GitHub Container Registry**: ghcr.io/jtown81/elk-draw

## Workspace Context

This project is part of the `/home/jpl/app-dev/` workspace. Other independent projects:
- `retire-app/` - Retirement planning simulator (workspace root git owner)
- `leave-app/` - Federal leave tracker
- `fishing/` - Tournament PWA
- `3peaks/` - Production templates
- `cabin/` - Expense tracker
- `bhss/` - BHSS app
- `brand/` - Brand assets

**IMPORTANT**: Work only in this directory. Never cross project boundaries or modify sibling projects.

## Git

- Git repo: `hunting/.git` (completely separate from workspace root)
- Remote: `https://github.com/jtown81/elk-draw`
- Run all git commands from `hunting/` directory only
- Commits are independent from workspace root

## Common Tasks

### Development
```bash
./build.sh                  # Interactive menu (recommended)
pnpm dev                    # Start dev server (http://localhost:3456)
pnpm test:watch             # Run tests in watch mode
```

### Production Build
```bash
pnpm build                  # Build for production
pnpm preview                # Preview production build locally
```

### Docker Deployment
```bash
docker compose up -d        # Start container
docker compose logs -f      # View live logs
docker compose down         # Stop container
```

### Testing & Quality
```bash
pnpm test                   # Run all 30 tests
pnpm typecheck              # Type check
pnpm build                  # Full production build
```

## Design Principles

- **Multi-user support**: Each user's data isolated in localStorage
- **Pure functional calculations**: Deterministic, testable odds engine
- **Real-time reactivity**: User preference changes trigger instant recalculation
- **Component memoization**: Performance optimization for large tables
- **Stateless architecture**: No backend required, perfect for offline use
- **Container portability**: Docker multi-stage build for minimal image
- **Responsive design**: Mobile-first UI for all devices
