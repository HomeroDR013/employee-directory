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

## Implementation Rules

- Follow the architecture in CLAUDE.md strictly
- Use context7 to check up-to-date docs for RTK Query, React Hook Form, Zod, TanStack Table before using them
- Use the **react-dev** skill when building components to ensure proper TypeScript typing, hook usage, event handling, and React 19 best practices
- Apply **frontend-design** principles: use intentional typography and spacing with Tailwind CSS, match the existing app aesthetic, avoid generic layouts. Do not over-design — match the style and complexity of the existing codebase.
- Use RTK Query for ALL data fetching — no useEffect + fetch
- Use React Hook Form + Zod for ALL forms
- Add proper TypeScript types everywhere — no `any`
- Keep each file focused on a single responsibility
- Do NOT add the feature to any routes or navigation yet

## Build Verification

After creating all files, run:
```
npm run build
npm run lint
```
Fix any errors before proceeding to reviews.

## Write Tests

Write tests for the new feature:

1. **Component tests** for the table and form components — verify they render correctly and handle user interactions.
2. **Behavior tests** for key user flows — loading states, form submission, validation errors.
3. Run all tests and ensure they pass.

If the project does not yet have a testing setup, ask the user whether to add one before writing tests.

## Code Quality Review

Invoke the **code-quality-review** skill on all newly created files. Check for:
- Proper adherence to the apsys architecture pattern
- Type safety and no `any` usage
- Correct RTK Query patterns (tags, cache invalidation)
- Correct React Hook Form + Zod integration

Fix any issues found.

## Visual UI/UX Review

1. Start the dev server (`npm run dev`) and mock API (`npm run mock`) if not already running.
2. Use Playwright to navigate to the feature's page.
3. Take a snapshot of the accessibility tree to verify semantic HTML.
4. Take screenshots at desktop (1280x720) and mobile (375x667) viewports.
5. Exercise the main interactions (open form, fill fields, submit) via Playwright to verify they work.
6. Invoke the **ui-ux-reviewer** agent to review the screenshots.
7. Implement any feedback that relates to accessibility or critical UX issues before considering the feature complete.
