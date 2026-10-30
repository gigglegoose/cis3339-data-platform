# CIS 3339 — Sprint 2 Frontend Corrections

This is a working copy of Getzy's project. The original application structure, backend, and other Vue views were retained.

## Implementation

- F1: Confirmed every tracked Vue component/view has `<script setup>`, and existing migration notes are retained. New files are also Composition API components.
- F2: Introduced `useApi` with `data`, `loading`, `error`, and `execute`; wired it to client/event/service search and dashboard. An Axios response interceptor normalizes API errors and clears session on 401.
- F3: Replaced duplicated client/event/service list tables with reusable `DataTable` supporting ascending/descending/unsorted, 10-per-page pagination, results count, empty state, and page reset on result changes.
- F4: Validates and restores stored JWT, restores Axios header, and guards editor-only form routes.
- D2: Added frontend `.env.example`, build and preview instructions, and SPA history-fallback deployment notes.
- Secured frontend/backend `.gitignore` against accidental `.env` uploads; use only dedicated grading credentials when an instructor expressly requires configuration files.

## Required pre-submission verification

Run `cd frontend && npm install && npm run build && npm run serve`. Verify editor and viewer accounts, token refresh/logout, API errors and retry, 15+ row sorting/pagination, charts, client/event/service create and detail flows, and absence of browser console errors. The backend needs its own MongoDB connection and setup. Frontend-only static changes do not implement the later Sprint 3 backend security and database tasks.

**Verification (Oct 30, run by Getzy's Claude):** `npm install` and `npm run build` succeed. The production build was served with `vite preview` and tested in a browser against a mocked backend (no real MongoDB). Passed: login, 10-per-page pagination with 15+ rows and "Showing X-Y of Z", 3-state column sorting, row click to details, refresh keeps login, viewer redirected from /clientform, garbage token gives clean logged-out state, backend down shows "Unable to reach the server" with a working Retry, no `[object Object]`, dashboard charts, client form validation, nested route refresh. Console showed only expected network errors. Not yet tested: a real backend and database, and a real viewer account login.

Also restored `// MIGRATION NOTE:` comments in findclient, findevents, findservice, and home.vue, which were dropped when those files were rewritten (the Canvas rubric grades migration comments).

## Contribution history

These corrections are a separate proposed integration of Getzy's project. The group should review and commit changes honestly under the people who actually contribute, rather than presenting someone else's commits as individual work.
