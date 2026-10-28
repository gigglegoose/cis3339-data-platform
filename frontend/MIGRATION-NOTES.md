# Sprint 2: Options API to Composition API migration

Every `.vue` file under `frontend/src` now uses `<script setup>`. No component has `data()`,
`methods`, `created`, `mounted`, or an Options API `export default` anymore. Each file has
`// MIGRATION NOTE:` comments explaining what changed and why.

## Pattern used in every file

| Options API | Composition API |
| --- | --- |
| `data() { return { x } }` | `const x = ref(...)` |
| `this.x` | `x.value` (templates unwrap refs automatically) |
| `methods: { fn() {} }` | `function fn() {}` |
| `mounted()` / `created()` | `onMounted(() => {})` |
| `props: {}` | `defineProps({})` |
| `this.$route` / `this.$router` | `useRoute()` / `useRouter()` |
| `this.$refs.canvas` | `const canvas = ref(null)` matching `ref="canvas"` |
| `components: {}` | importing the component is enough |
| `validations()` + `useVuelidate()` | `useVuelidate(rules, { state })` |

## Files changed

- `App.vue`, `views/login.vue`
- `views/findclient.vue`, `views/findevents.vue`, `views/findservice.vue`
- `views/clientform.vue`, `views/eventform.vue`, `views/serviceform.vue`
- `views/clientdetails.vue`, `views/eventDetails.vue`, `views/servicedetails.vue`
- `views/home.vue`
- `components/barChart.vue`, `components/donutZipChart.vue`
- `router/index.js` (one line, see below)

## Bugs fixed because they broke the "no console errors" rule

1. `App.vue`: the `catch` block threw an undeclared `error` variable. It now logs and shows a toast.
2. `App.vue`: removed the dead Vuex `logout()` method (`this.$store` doesn't exist with Pinia).
3. `App.vue`: logo path used Windows backslashes (`@\assets\...`), which break on Mac/Linux. Now `@/assets/...` with alt text.
4. `home.vue`: clicking a dashboard row called `editEvent()`, which was never defined. It now opens the event details page.
5. Detail views: the "Go back" buttons used `this.$router.back()` inside the template, which doesn't work in `<script setup>`. Now `router.back()`.
6. `router/index.js`: imported `eventdetails.vue` but the file is `eventDetails.vue`. That works on Windows and fails on Mac/Linux builds.
7. Chart components: removed the meaningless `await new Chart(...)`, added `watch` so charts redraw when data changes, and `chart.destroy()` on unmount so they don't leak.

## Not changed on purpose (belongs to other Sprint 2 tasks)

- `toast.error('message', error)` calls still exist. Fixing those is part of F2 (the Axios interceptor and `useApi`).
- Table markup is still duplicated in the three find views. That is F3 (`DataTable`).
- Session restore on refresh and the editor route guard are F4.

## How it was checked

- `npm run build` succeeds.
- The production build was clicked through in a browser against a mocked backend: login, dashboard charts,
  all three find views (search + clear), all three detail views (load, validate, update, delete rules),
  all three forms (validation messages), the client-to-event multiselect, go back, and logout.
  No Vue warnings or JavaScript errors in the console.
