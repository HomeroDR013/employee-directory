---
description: Fetch a Jira story's full context (summary, description, acceptance criteria, priority, status, subtasks, comments)
argument-hint: <story-name-or-key> [project:<PROJECT-KEY>]
---

## Input

Parse the following from `$ARGUMENTS`:
- **story-identifier**: The Jira issue key (e.g., `PROJ-123`) OR a story name/summary to search for.
- **project** (optional): If the user provides `project:<KEY>`, use it to scope the search. If a full issue key is provided (contains `-`), extract the project from the key prefix.

## Steps

### 1. Resolve the story

- If the identifier looks like a Jira key (e.g., `PROJ-123`), fetch it directly:
  - `GET /rest/api/3/issue/{key}`
- If it's a story name/summary text, search for it using JQL:
  - `GET /rest/api/3/search/jql` with JQL: `summary ~ "story name" ORDER BY updated DESC`
  - If a project was provided, prepend `project = <KEY> AND` to the JQL.
  - Use `maxResults: "5"` and let the user pick if multiple matches are found.

### 2. Fetch full story details

Once you have the issue key, fetch comprehensive details:

```
GET /rest/api/3/issue/{key}
```

Use this jq filter to extract relevant fields:
```
{key: key, summary: fields.summary, status: fields.status.name, priority: fields.priority.name, issuetype: fields.issuetype.name, assignee: fields.assignee.displayName, reporter: fields.reporter.displayName, labels: fields.labels, description: fields.description, created: fields.created, updated: fields.updated}
```

### 3. Fetch subtasks (if any)

Search for subtasks:
```
GET /rest/api/3/search/jql
JQL: parent = {key}
jq: issues[*].{key: key, summary: fields.summary, status: fields.status.name}
```

### 4. Fetch comments (for additional context)

```
GET /rest/api/3/issue/{key}/comment
jq: comments[*].{author: author.displayName, body: body, created: created}
maxResults: "10"
```

### 5. Output structured context

Present the story context in this format:

---
**Story: [{KEY}] {Summary}**
- **Type**: {issuetype} | **Status**: {status} | **Priority**: {priority}
- **Assignee**: {assignee} | **Reporter**: {reporter}
- **Labels**: {labels}
- **Created**: {created} | **Updated**: {updated}

**Description:**
{Render the description content as readable text}

**Acceptance Criteria:**
{Extract acceptance criteria from the description — typically found under a heading like "Acceptance Criteria", "AC", or in a checklist format. If not explicitly separated, note that criteria are embedded in the description.}

**Subtasks:**
{List subtasks with key, summary, and status — or "None"}

**Recent Comments:**
{List last few comments with author and content — or "None"}

---

Do NOT proceed to any implementation. Only output the story context.
