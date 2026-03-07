---
description: End-to-end implementation of a Jira story — fetches context, plans, branches, implements, tests, validates, reviews, commits, and creates a PR
argument-hint: <story-name-or-key> [project:<PROJECT-KEY>]
---

## Input

The user provides a Jira story identifier and optionally a project key:
- `$ARGUMENTS` — passed directly to sub-commands

## Workflow

Execute the following phases in order. Each phase must complete before the next begins.

---

### Phase 1: Fetch Story Context

Use the `/fetch-jira-story` command with the provided arguments to retrieve the full story context from Jira.

Extract and retain from the output:
- **Story key** (e.g., `PROJ-123`)
- **Summary**
- **Description**
- **Acceptance criteria**
- **Subtasks** (if any)
- **Priority and status**

---

### Phase 2: Generate Implementation Plan

**Enter planning mode** (use the `EnterPlanMode` tool) before generating the plan. This ensures the plan is structured and reviewed properly before any code is written.

Based on the story context and the project's architecture (see CLAUDE.md), generate a detailed implementation plan.

The plan must include:

1. **Scope analysis**: What needs to be built or changed? Map acceptance criteria to concrete code changes.
2. **Files to create or modify**: List each file with what will be done.
3. **Data layer changes**: New RTK Query endpoints, types, or API slices needed.
4. **Domain layer changes**: New TypeScript interfaces or types.
5. **Presentation layer changes**: New or modified components, pages, forms, tables.
6. **Shared/infrastructure changes**: Routes, store configuration, shared components.
7. **Test plan**: Which components/functions need tests? What behaviors should be verified?
8. **Dependencies**: Any new npm packages needed (check context7 for docs if so).
9. **Commands to run**: `npm install`, build checks, etc.

Present the plan to the user and ask for confirmation before proceeding. If the user requests changes to the plan, adjust accordingly.

Once the plan is approved, **exit planning mode** (use the `ExitPlanMode` tool) before moving to Phase 3.

---

### Phase 3: Create Branch

Create a new git branch from `main`:
```
git checkout main
git pull origin main
git checkout -b feature/{story-key-lowercase}-{short-description}
```

Use the story key and a kebab-case slug of the summary for the branch name. Example: `feature/proj-123-add-employee-search`.

---

### Phase 4: Implement the Plan

Execute the implementation plan step by step:

1. Install any new dependencies first.
2. Create domain types.
3. Create or update the data layer (RTK Query API slices).
4. Create or update presentation components.
5. Update shared infrastructure (routes, store) if needed.
6. After all files are created, run:
   - `npm run build` — to catch TypeScript errors
   - `npm run lint` — to catch lint issues
   - Fix any errors before proceeding.

**Rules during implementation:**
- Follow CLAUDE.md architecture rules strictly — all features go in `src/features/<feature-name>/` with `data/`, `domain/`, `presentation/` subdirectories.
- Use context7 to check up-to-date docs for RTK Query, React Hook Form, Zod, TanStack Table, or any third-party library before using them.
- Use the **react-dev** skill when building or modifying React components to ensure proper TypeScript typing, hook usage, event handling, and React 19 best practices.
- Use the **frontend-design** principles when building UI: avoid generic layouts, use intentional typography and spacing, ensure the design matches the existing app aesthetic and Tailwind CSS conventions. Do not over-design — match the style and complexity of the existing codebase.
- Use RTK Query for ALL server state — no `useEffect` + `fetch`.
- Use React Hook Form + Zod for ALL forms.
- Add proper TypeScript types — no `any`.
- Keep each file focused on a single responsibility.

---

### Phase 5: Write Tests

Write tests for the implemented functionality following a test-driven verification approach:

1. **Identify testable behaviors** from the acceptance criteria — focus on user-visible behaviors, not implementation details.
2. **Write component/integration tests** using the project's testing setup (Vitest + React Testing Library if available, otherwise set them up).
3. **For each test**:
   - Write the test first, run it to confirm it targets the right behavior.
   - Verify it passes against the implementation.
   - If a test fails, fix the implementation (not the test) unless the test itself is wrong.
4. **Test coverage should include**:
   - Key component rendering and user interactions.
   - RTK Query hook behavior (loading, success, error states) where relevant.
   - Form validation rules if forms were added/modified.
   - Edge cases from acceptance criteria (e.g., empty states, boundary inputs).
5. Run the full test suite and ensure all tests pass before proceeding.

If the project does not yet have a testing setup, ask the user whether to add one before writing tests.

---

### Phase 6: Acceptance Criteria Verification

Before any review, explicitly verify coverage of every acceptance criterion:

1. List each acceptance criterion from the story.
2. For each criterion, identify the specific code (file + function/component) that fulfills it.
3. For each criterion, identify the test(s) that verify it.
4. If any criterion is **not covered** in code or tests, go back and implement/test it now.
5. If any criterion is **partially covered**, note what's missing and fix it.

Only proceed once all criteria are fully mapped to both code and tests.

---

### Phase 7: Code Quality Review

Invoke the **code-quality-review** skill on the changed files. This checks for:
- Deprecated patterns and anti-patterns
- Proper adherence to project coding standards (CLAUDE.md)
- Type safety and correct TypeScript usage
- Architecture violations (feature boundaries, layer separation)

Fix any critical or moderate issues found before proceeding.

---

### Phase 8: Visual UI/UX Review

If the story involves UI changes (new components, modified pages, layout changes):

1. Start the dev server (`npm run dev`) and mock API (`npm run mock`) if not already running.
2. Use Playwright to navigate to the relevant page and take a snapshot of the accessibility tree to verify semantic HTML structure and ARIA attributes.
3. Take screenshots at multiple viewports:
   - Desktop (1280x720)
   - Mobile (375x667)
4. Invoke the **ui-ux-reviewer** agent to review the screenshots for:
   - Accessibility issues (contrast, focus states, ARIA)
   - Layout and responsive design problems
   - UX concerns (affordances, feedback, consistency)
   - Design quality: does it look intentional and cohesive, not generic?
5. Use Playwright to test key interactive flows:
   - Navigate to the page, wait for `networkidle`.
   - Exercise the main user interaction from the story (e.g., type in a search field, click a button, submit a form).
   - Take a screenshot of the result state.
   - Verify the interaction works as expected.
6. Fix any critical accessibility, UX, or interaction issues before proceeding.

If the story is purely backend/data-layer with no visible UI changes, skip this phase.

---

### Phase 9: Review, Commit & Create PR

Use the `/review-and-pr` command with `{story-key} {brief summary}` as arguments to:
1. Perform a final review of all changes.
2. Fix any remaining issues.
3. Commit all changes with a proper conventional commit message.
4. Push the branch and create a pull request that references the Jira story.
5. Post a comment on the Jira story with the PR link.

---

### Phase 10: Final Summary

After the PR is created, provide a final summary:

- **Story**: [{key}] {summary} — [Jira link](https://apsys-dev.atlassian.net/browse/{key})
- **Branch**: `feature/{branch-name}`
- **PR**: {PR URL}
- **Files changed**: List of all files created or modified
- **Tests**: List of test files and what they cover
- **Acceptance criteria coverage**: Map each acceptance criterion to code + test
- **Quality checks passed**: Build, lint, tests, code review, UI/UX review (if applicable)
- **Notes**: Anything the reviewer should pay attention to
