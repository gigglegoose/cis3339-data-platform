<template>
  <main class="p-10">
    <h1 class="font-bold text-4xl text-red-700 text-center mb-10">List of Events</h1>
    <div class="flex gap-4 flex-wrap items-end mb-8">
      <label>Search Event By
        <select v-model="searchBy" class="block rounded border-gray-300">
          <option value="Event Name">Event Name</option>
          <option value="Event Date">Event Date</option>
        </select>
      </label>
      <input v-if="searchBy === 'Event Name'" v-model="name" aria-label="Event name" placeholder="Event name" @keyup.enter="search" />
      <input v-else type="date" v-model="eventDate" aria-label="Event date" />
      <button class="border rounded p-2" @click="clear">Clear Search</button>
      <button class="bg-red-700 text-white rounded p-2" @click="search">Search Event</button>
    </div>
    <h2 class="font-bold text-2xl">List of Events</h2>
    <p class="italic mb-3">Click a row to view event details</p>
    <p v-if="loading" role="status">Loading events...</p>
    <div v-else-if="error" role="alert" class="text-red-800">{{ error }} <button class="underline" @click="execute">Retry</button></div>
    <p v-else-if="!events?.length">No events found.</p>
    <DataTable v-else :columns="columns" :rows="events" @select="row => router.push({ name: 'eventdetails', params: { id: row._id } })" />
  </main>
</template>
<script setup>
// F1/F2/F3: Migrated async list loading and filtering into one useApi composable and shared DataTable.
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getEvents, searchEvents } from '../api/api'
import { useApi } from '../composables/useApi'
import DataTable from '../components/DataTable.vue'
// MIGRATION NOTE: this.$router became useRouter(); the template now calls router.push(...)
const router = useRouter()
// MIGRATION NOTE: each property in the old data option (searchBy, name, eventDate) became a ref
const searchBy = ref('Event Name')
const name = ref('')
const eventDate = ref('')
const query = ref(null)
// MIGRATION NOTE: the hand-rolled events/try-catch/toast pattern became the shared useApi composable (F2)
const { data: events, loading, error, execute } = useApi(() => query.value ? searchEvents(query.value) : getEvents())
// MIGRATION NOTE: methods.formatDate became a plain function used by the Event Date column
function formatDate(value) { if (!value) return ''; const d = new Date(value); return Number.isNaN(d.getTime()) ? '' : `${String(d.getUTCMonth()+1).padStart(2,'0')}/${String(d.getUTCDate()).padStart(2,'0')}/${d.getUTCFullYear()}` }
// MIGRATION NOTE: the hand-written <table> markup was replaced by these DataTable column definitions (F3)
const columns = [
  { label: 'Event Name', field: 'name' },
  { label: 'Event Date', field: 'date', render: r => formatDate(r.date) },
  { label: 'Event Address', field: 'address.line1' }
]
// MIGRATION NOTE: methods.loadData became clear(). It resets the search fields and reloads through useApi
function clear() { name.value = ''; eventDate.value = ''; query.value = null; execute() }
// MIGRATION NOTE: methods.handleSubmitForm became search(). It builds the query and reruns the same useApi call
function search() {
  if (searchBy.value === 'Event Date' && !eventDate.value) return
  query.value = searchBy.value === 'Event Name' ? { searchBy: 'name', name: name.value } : { searchBy: 'date', eventDate: eventDate.value }
  execute()
}
// MIGRATION NOTE: mounted() became onMounted(); execute() from useApi loads the list on page load
onMounted(execute)
</script>
