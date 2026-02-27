---
description: Creates a complete feature following the apsys react-clean-architecture pattern
argument-hint: <feature-name> / <brief description of what the feature does>
---

## Context

Use the following arguments to determine what to build:
[feature-name]: The name of the feature from $arguments
[description]: The description of the feature from $arguments

## Task

Create a complete feature called **[feature-name]** inside `src/features/[feature-name]/` with the following structure:

### domain/
- `[feature-name].types.ts` — TypeScript interfaces based on [description]

### data/
- `[feature-name]Api.ts` — RTK Query API slice with endpoints for:
  - GET all records
  - GET by ID
  - POST (create)
  - PUT (update)
  - DELETE

Use `http://localhost:3001` as the base URL.
Use the resource name `[feature-name]` as the endpoint path.
Use `tagTypes` with `providesTags` and `invalidatesTags` for automatic cache invalidation after mutations.

### presentation/
- `pages/[FeatureName]Page.tsx` — Main listing page using the table component
- `pages/[FeatureName]DetailPage.tsx` — Detail/edit page with a form
- `components/[FeatureName]Table.tsx` — Table showing the list
- `components/[FeatureName]Form.tsx` — Form using React Hook Form + Zod validation

## Rules

- Follow the architecture in @CLAUDE.md strictly
- Use RTK Query for ALL data fetching — no useEffect + fetch
- Use React Hook Form + Zod for ALL forms
- Add proper TypeScript types everywhere — no `any`
- Keep each file focused on a single responsibility
- Do NOT add the feature to any routes or navigation yet