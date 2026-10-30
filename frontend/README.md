# Data Platform Frontend

This project uses [VueJS 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) and [TailwindCSS](https://tailwindcss.com/).
For form validation [Vuelidate](https://vuelidate-next.netlify.app/) is used.

State management is done via [Pinia](https://pinia.vuejs.org/).

## Project setup

    npm install

### Before startup
You need to either have a local backend running and or use a cloud deployed backend.

Setup a .env file with following variables, e.g.:

    VITE_ROOT_API=http://localhost:3000

VITE_ROOT_API is the URL for the backend API, either on localhost or in the cloud.
### Compiles and hot-reloads for development

    npm run dev

## Sprint 2 implementation

The Vue frontend uses Composition API `<script setup>` components, the shared `src/composables/useApi.js` helper for loading/error/retry state, a reusable sortable/paginated `src/components/DataTable.vue`, and centralized Axios error handling in `src/api/api.js`. The login store restores an unexpired token on refresh; router guards check the `editor` role on protected create forms.

## Production build and verification (D2)

1. Copy `.env.example` to `.env`, and configure `VITE_ROOT_API` to the reachable backend URL. Vite embeds this value at **build time**, so rebuild when the API URL changes.
2. Run `npm install` and then `npm run build` in `frontend/`.
3. Run `npm run serve` (Vite preview) and open the local URL printed by Vite. Use this preview for the production-build demonstration, not `npm run dev`.
4. Confirm logging in as a viewer and editor, refreshing while logged in, navigating to clients/events/services, searching, sorting, paging through 15+ rows, retrying after temporarily stopping the backend, and checking the browser console.
5. If hosted under a subdirectory, configure Vite `base` appropriately. For `createWebHistory()` routes, configure hosting to serve `index.html` for unrecognized frontend paths (SPA rewrite/fallback), while keeping actual static assets accessible. Refresh a nested route to verify.
6. Configure backend CORS to allow the deployed frontend origin before checking deployed requests. Do not commit real credentials or production secrets.

**Verification status:** This package's source files were statically checked. A full `npm run build`, live backend/MongoDB and browser flow test still need to be run on a machine with npm registry access. See `SPRINT2-CHANGELOG.md` at repository root. Do not claim successful runtime verification without those checks.
