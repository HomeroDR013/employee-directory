---
description: Review all current changes, commit them to the current branch, push, and create a pull request
argument-hint: <jira-story-key> <brief summary of changes>
---

## Input

Parse the following from `$ARGUMENTS`:
- **story-key**: The Jira issue key (e.g., `PROJ-123`) used to prefix the PR title.
- **summary**: Brief summary of the changes made.

## Steps

### 1. Review changes

Run `git diff` and `git status` to see all changes. Then perform a structured code review:

- **Correctness**: Do the changes implement what was intended? Are there logic errors?
- **TypeScript**: Are types properly defined? Any `any` types that should be specific?
- **Architecture**: Do changes follow the apsys feature structure (`data/`, `domain/`, `presentation/`)?
- **Code style**: Consistent with the existing codebase? Follows CLAUDE.md rules?
- **Security**: Any obvious vulnerabilities (XSS, injection, exposed secrets)?
- **Missing pieces**: Are there files that should have been modified but weren't?

Present the review as a brief summary with any issues found. If there are critical issues, fix them before proceeding.

### 2. Build & Lint Verification

Run the following checks and ensure they pass before committing:

```
npm run build
npm run lint
```

If either fails, fix the issues and re-run until both pass cleanly.

### 3. Commit changes

- Stage all relevant files (be specific, avoid `.env` or secrets).
- Create a commit with a conventional commit message format:
  ```
  feat({scope}): {concise description}

  Implements {story-key}: {story summary}
  Jira: https://apsys-dev.atlassian.net/browse/{story-key}

  - bullet points of key changes

  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
  ```

### 4. Push the branch

Push the current branch to origin with the `-u` flag:
```
git push -u origin {branch-name}
```

### 5. Create a pull request

Create a PR using `gh pr create` with:
- **Title**: `[{story-key}] {concise description}`
- **Body**:
  ```
  ## Jira Story
  [{story-key}](https://apsys-dev.atlassian.net/browse/{story-key}) — {story summary}

  ## Summary
  - bullet points of what was implemented

  ## Changes
  - list of files changed and why

  ## Test Plan
  - [ ] Verify {acceptance criteria items}
  - [ ] Run `npm run build` — no TypeScript errors
  - [ ] Run `npm run lint` — no lint errors
  - [ ] Manual testing with `npm run dev` + `npm run mock`

  ---
  Generated with [Claude Code](https://claude.com/claude-code)
  ```

### 6. Post Jira Comment

After the PR is created, post a comment on the Jira story using the Jira MCP API:

```
POST /rest/api/3/issue/{story-key}/comment
```

Comment body (in Atlassian Document Format):
```json
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Pull Request created: " },
          {
            "type": "text",
            "text": "{PR title}",
            "marks": [{ "type": "link", "attrs": { "href": "{PR URL}" } }]
          }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Summary of changes:" }
        ]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "{change 1}" }] }]
          }
        ]
      }
    ]
  }
}
```

Replace the bullet list items with the actual changes made.

### 7. Output

Return:
- The PR URL
- Confirmation that the Jira comment was posted
- A summary of everything done
