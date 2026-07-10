# E-Learning Platform (Cerios Hackathon 2026 — Team D)

A small full-stack E-Learning platform: students browse and apply to courses, track lesson progress, and admins manage course content.

## Stack

- **Frontend**: React + TypeScript + Vite (`apps/elearning-portal`)
- **Backend**: NestJS (`apps/api-elearning`)
- **Database**: PostgreSQL + Prisma (`packages/database`)
- **Shared contracts**: plain TypeScript DTOs (`packages/shared-types`)
- **Monorepo**: npm workspaces (no Turborepo/Nx — kept simple on purpose)

See [agent.md](agent.md) for the full architecture/decision log, and `.github/instructions/*.instructions.md` for per-area conventions.

## Prerequisites

- Node.js 20+ and npm
- Docker Desktop (for local Postgres)

## Quick start

```bash
npm install
npm run dev
```

That's it — `npm run dev` automatically:

1. Copies `.env.example` → `.env` for the database package and portal if missing.
2. Starts local Postgres via Docker Compose (host port **5433**, to avoid clashing with other local Postgres instances on 5432).
3. Builds the `database` and `shared-types` packages.
4. Applies any pending Prisma migrations (`prisma migrate deploy`).
5. Frees port 3000 if something is already using it.
6. Starts the NestJS API (`http://localhost:3000`) and the Vite frontend (`http://localhost:5173`) together.

To seed demo data (an admin account, two students, two courses with lessons, and a sample enrollment):

```bash
npm run seed
```

## Other useful commands

```bash
npm run compile      # type-check every workspace
npm run lint          # oxlint (type-aware) across the whole repo
npm run dev:api        # just the backend
npm run dev:portal     # just the frontend
npm run free-port      # kill whatever is holding port 3000
npm run db:stop        # stop the local Postgres container
```

## Project structure

```
apps/
  api-elearning/     NestJS backend (courses, accounts, enrollments)
  elearning-portal/  React + Vite frontend
packages/
  database/          Prisma schema, migrations, seed script
  shared-types/       Shared DTOs used by both frontend and backend
```

## Current features

- Course & lesson browsing (public)
- Account creation (student or admin)
- Course enrollment ("Apply") + per-lesson progress tracking
- Homepage dashboard showing a student's applied courses and progress
- Admin screen to create/edit courses (title, description, level, assignments, published status)

### Known limitations / next steps

- Sign-in is a lightweight "sign in as" account picker (localStorage-based), not real session/password authentication.
- No PowerPoint-to-course upload yet (tracked separately, larger scope).
- No automated tests yet.

## Windows notes

All npm scripts are cross-platform. The only OS-specific step some contributors used manually was copying `.env.example` files — that's now automated by `npm run dev`, so no action needed on any OS.
