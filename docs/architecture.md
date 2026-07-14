# Atlas MVP — Architecture

## Product Philosophy

- Atlas MVP is an AI-assisted reflective journaling platform.
- The application is valuable even without AI.
- AI enhances journaling by encouraging self-reflection.
- It is not a therapy or mental-health diagnosis application.

## Core Features

- Authentication
- Journal CRUD
- AI-generated reflection
- Dashboard
- Search
- Basic Profile

## High-Level Architecture

```
User
   │
   ▼
React (Frontend)
   │
HTTP / REST API
   │
   ▼
Express Backend
   ├────────────► MongoDB
   └────────────► AI Service
```

## Data Flow — Create

1. User writes a journal entry.
2. Frontend sends it to the backend.
3. Backend saves the journal with `reflection.status = "pending"`.
4. Backend responds immediately — the user is never blocked waiting on AI.
5. Backend (async) requests an AI reflection.
6. AI returns:
   - Summary
   - Reflection Questions
   - Positive Observation
   - Actionable Suggestion
7. Backend updates the same document: `reflection.status = "ready"`, fields populated.
8. Frontend polls or re-fetches and displays both journal and reflection.

**Why async, not synchronous:** AI generation can take several seconds. Blocking the save on that would make the app feel broken under any AI latency or outage. Save is a fast, guaranteed operation; reflection is a slower, best-effort enhancement layered on top. This is also why AI failure must never fail the journal write (see Design Decisions).

## Data Flow — Edit

1. User edits journal content.
2. Backend updates `content`, sets `reflection.status = "pending"`, clears prior reflection fields (`summary`, `emotions`, `questions`, `positiveObservation`, `suggestion` → reset to empty/null; `generatedAt` cleared).
3. Frontend immediately shows the journal as updated, with the reflection area in a "regenerating" state — not the old (now stale) reflection, since a stale reflection could reference content that no longer exists.
4. Backend (async) re-triggers the AI service, same as create flow.
5. On success: `status = "ready"`, new fields populated. On failure: `status = "failed"`, retry available.

**Why clear instead of keep-but-stale:** Showing an old reflection next to edited content risks the AI's summary/questions referencing thoughts the user has since removed or changed — misleading, not just outdated. Clearing signals honestly "this hasn't been reflected on yet."

## Data Flow — Delete

1. User deletes a journal entry.
2. Backend deletes the JournalEntry document.
3. Because reflection is embedded (see Design Decisions), the reflection is removed automatically in the same operation — no separate delete step, no orphan risk.

## Design Decisions

- Journals are the primary data; the app has value with zero AI involvement.
- AI reflections are derived from journals, never the source of truth.
- The frontend never accesses the database directly — all access goes through the backend API.
- The backend owns all business logic, including when and how AI is invoked.
- If AI is unavailable, the journal is still saved (`status: "failed"`, retryable).
- Reflection generation can be retried later via a dedicated endpoint.
- Editing a journal regenerates its reflection (old reflection is cleared, not shown stale).
- Deleting a journal removes its reflection as a side effect of document deletion, not a separate manual step.

### Reflection storage: embedded, not a separate collection

**Decision: Reflection is embedded inside JournalEntry, not a separate collection.**

```js
JournalEntry: {
  userId,          // ObjectId, ref → User, indexed
  content,
  createdAt,
  updatedAt,
  reflection: {
    status: "pending" | "ready" | "failed",
    summary: String,
    emotions: [String],
    reflectionQuestions: [String],
    positiveObservation: String,
    suggestion: String,
    generatedAt: Date
  }
}
```

**Why embedded over referenced:**
- Reflection is *always* fetched and displayed together with its journal — there is no feature that needs one without the other. Embedding matches actual access patterns.
- Cascade delete is free: deleting the JournalEntry document deletes the reflection with it. A referenced design would require a manual `pre('findOneAndDelete')` hook to avoid orphaned Reflection documents — extra code, extra failure mode, for a rule embedding satisfies automatically.
- One query renders the whole UI card (journal + its reflection), instead of a query + `.populate()` or a second round trip.
- The trade-off I'm accepting: no independent reflection history (e.g. keeping every past AI regeneration) — out of scope for MVP, and can be revisited later as a versioned sub-array if ever needed.

`userId` remains a **reference** (not embedded) because a user has many entries, entries are queried independently of the full user object, and embedding would duplicate/balloon user data across every journal document.

## Entities

**User** — represents an authenticated user.
**JournalEntry** — stores the user's daily journal and its embedded reflection state.

*(Reflection is not a separate entity — see Design Decisions above. It exists only as a sub-document of JournalEntry.)*

## Relationships

```
User (1)
   │
   │ has many
   ▼
JournalEntry (*)
   (each entry embeds its own reflection sub-document)
```

## Relationship Rules

- One user can have many journal entries.
- Every journal entry belongs to exactly one user.
- A journal entry cannot exist without a user.
- Every journal entry has exactly one reflection sub-document, present from creation (initially `status: "pending"`).
- Deleting a journal entry deletes its reflection as part of the same operation (embedded document).
- Editing a journal entry resets its reflection to `"pending"` and triggers regeneration.

## Indexes

- `JournalEntry.userId` — indexed. Every dashboard query, history fetch, and search is filtered by the owning user; this is the single most-hit filter in the app.
- `JournalEntry.content` — text index, to support the Search feature (`GET /api/journals/search?q=`) without a full collection scan.

## Dashboard Computation Strategy

Recent Entries, Writing Streak, and Total Entries are **computed on the fly** from `createdAt` timestamps at request time in Phase 4 — not stored/cached on the User document.

**Why not cache a streak field on User:** At this project's scale, computing streak from a sorted query of a user's own entries is cheap and always correct. A cached/stored streak field introduces a second source of truth that must be kept in sync on every create/delete/backdated edit — real complexity for a problem that doesn't exist yet at this scale. This is a deliberate "don't over-engineer" call I should be able to defend the same way I'd defend not using Redux.

## APIs

```
Auth:        POST /api/auth/register
             POST /api/auth/login

Journal:     POST   /api/journals
             GET    /api/journals
             GET    /api/journals/:id
             PUT    /api/journals/:id
             DELETE /api/journals/:id

Reflection:  POST   /api/journals/:id/reflect   (generate or retry)

Dashboard:   GET /api/dashboard/summary

Search:      GET /api/journals/search?q=
```