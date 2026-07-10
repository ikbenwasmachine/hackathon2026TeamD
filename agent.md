# Agent.md — E-Learning Platform

This file is the working contract between contributors (human or AI) and this repository. Read it before making changes. It captures context, guardrails, workflows, and agreements reached while planning this project.

## Context

- **Project**: A small E-Learning platform. Students browse courses and lessons; instructors will manage content in later slices.
- **Stack**:
  - `apps/api-elearning` — NestJS backend API (module/controller/service/DTO structure).
  - `apps/elearning-portal` — React + TypeScript + Vite frontend.
  - `packages/database` — Prisma schema, generated client, and seed script (PostgreSQL).
  - `packages/shared-types` — Plain TypeScript DTOs shared between frontend and backend API contracts.
- **Monorepo tooling**: npm workspaces (`apps/*`, `packages/*`). No Turborepo/Nx — kept intentionally simple for hackathon speed.
- **Current vertical slice**: Course & lesson browsing (public, read-only). This is the only slice implemented so far.

## Guardrails

- Stay within the chosen stack: TypeScript, NestJS, React, Vite, Prisma, PostgreSQL. Do not introduce a new framework, ORM, or state-management library without an explicit request.
- Respect layer boundaries:
  - Frontend never imports Prisma or backend code directly — only calls the API and uses `shared-types` for contracts.
  - Backend controllers stay thin; business logic lives in services; Prisma access happens through `packages/database`'s exported `prisma` client.
  - Shared DTOs live in `packages/shared-types`; don't duplicate response/request shapes across apps.
- Keep TypeScript strictness intact (no `any` without a documented reason) — enforced by `.oxlintrc.json` (`typescript/no-explicit-any`, `explicit-function-return-type`, etc.).
- Packages (`packages/database`, `packages/shared-types`) are consumed via their built `dist/` output. Run each package's `build` script after changing its source before the API/frontend will see the update.
- Prefer additive Prisma migrations during hackathon work; avoid destructive schema changes unless necessary.

## Workflows

1. Treat every feature as one vertical slice: UI → API endpoint → service → Prisma → database, and back.
2. Start from the smallest useful change; extend existing modules/components before creating new ones.
3. After each meaningful checkpoint, run:
   - `npm run compile` (fans out to every workspace via `--workspaces --if-present`)
   - `npm run lint` (oxlint, type-aware, repo-wide)
4. If either command fails, fix it before continuing or widening scope.
5. Local Postgres: `docker compose up -d`, then from `packages/database`: `npm run prisma:migrate` and `npm run seed`.
6. Summaries of work should state what changed and which validation commands were run and whether they passed.

## Agreements (decision log)

- Backend framework: **NestJS** (not Next.js — an earlier draft considered Next.js API routes, superseded).
- Frontend and backend are **separate apps**, not a combined Next.js app.
- Auth (not yet implemented): session-based (cookie), roles = `STUDENT` and `INSTRUCTOR`. `User.role` exists in the schema now so `Course.instructorId` has a valid relation target; login/session endpoints are a future slice.
- First vertical slice = courses & lessons browsing only. Explicitly deferred to future slices:
  - Auth (login/signup, sessions)
  - Enrollment & progress tracking
  - Quizzes/assessments
  - Instructor/admin content management (create/edit courses & lessons)
- Naming convention: `apps/api-*` for backend apps, `apps/*-portal` for frontend apps — matches existing `.github/instructions/*.instructions.md`.
- Local Postgres is provided via root `docker-compose.yml` (assumption, not explicitly requested — flagged when proposed).
