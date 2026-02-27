# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite)
- **Mock API:** `npm run mock` (json-server on port 3001, serves `db.json`)
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint` (ESLint, flat config)
- **Preview production build:** `npm run preview`

## Architecture

React 19 + TypeScript app built with Vite. Styling via Tailwind CSS v4 (using the `@tailwindcss/vite` plugin, not PostCSS).

**State management:** Redux Toolkit (`@reduxjs/toolkit` + `react-redux`). Store is in `src/store/store.ts` with typed `RootState` and `AppDispatch` exports.

**Forms:** react-hook-form with zod validation (via `@hookform/resolvers`).

**Tables:** TanStack React Table v8.

**Mock backend:** json-server serving `db.json` at `http://localhost:3001`. Two resources: `employees` (id, firstName, lastName, email, position, department, startDate, status) and `departments` (id, name).

## TypeScript

Strict mode enabled with `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. Target ES2022, bundler module resolution.

## apsys Architecture Rules

- All features go inside `src/features/<feature-name>/`
- Each feature must have the following structure:
  - `data/` — RTK Query API slice
  - `domain/` — TypeScript interfaces and types
  - `presentation/` — React components and pages
- Never mix feature concerns — keep each feature self-contained
- Use RTK Query for ALL server state (no useEffect + fetch)
- Use React Hook Form + Zod for ALL forms
- Shared components go in `src/shared/components/`

## Code Style

- Use comments sparingly. Only comment complex, non-obvious code.
- When creating a new RTK Query endpoint, always add proper TypeScript types for the response.

## Mock API

- JSON Server running on `http://localhost:3001`
- Endpoints: `/employees`, `/departments`
- Use this base URL in all RTK Query API slices during development