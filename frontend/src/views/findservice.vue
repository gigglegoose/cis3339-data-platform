<template>
  <main class="p-10">
    <h1 class="font-bold text-4xl text-red-700 text-center mb-10">Find Services</h1>
    <div class="flex flex-wrap items-end gap-4 mb-8">
      <label>Search Service By
        <select v-model="searchBy" class="block rounded border-gray-300">
          <option value="Service Name">Service Name</option>
          <option value="Service Description">Service Description</option>
        </select>
      </label>
      <input v-if="searchBy === 'Service Name'" v-model="name" aria-label="Service name" placeholder="Service name" @keyup.enter="search" />
      <input v-else v-model="description" aria-label="Service description" placeholder="Service description" @keyup.enter="search" />
      <button class="border rounded p-2" @click="clear">Clear Search</button>
      <button class="bg-red-700 text-white rounded p-2" @click="search">Search Service</button>
    </div>
    <h2 class="font-bold text-2xl">List of Services</h2>
    <p class="italic mb-3">Click a row to view service details</p>
    <p v-if="loading" role="status">Loading services...</p>
    <div v-else-if="error" role="alert" class="text-red-800">{{ error }} <button class="underline" @click="execute">Retry</button></div>
    <p v-else-if="!services?.length">No services found.</p>
    <DataTable v-else :columns="columns" :rows="services" @select="row => router.push({ name: 'servicedetails', params: { id: row._id } })" />
  </main>
</template>
<script setup>
// F1/F2/F3: Composition API list and search use shared async-state and one sortable, paginated table.
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getServices, searchServices } from '../api/api'
import { useApi } from '../composables/useApi'
import DataTable from '../components/DataTable.vue'
// MIGRATION NOTE: this.$router became useRouter(); the template now calls router.push(...)
const router = useRouter()
// MIGRATION NOTE: each property in the old data option (searchBy, name, description) became a ref
const searchBy = ref('Service Name')
const name = ref('')
const description = ref('')
const query = ref(null)
// MIGRATION NOTE: the hand-rolled services/try-catch/toast pattern became the shared useApi composable (F2)
const { data: services, loading, error, execute } = useApi(() => query.value ? searchServices(query.value) : getServices())
// MIGRATION NOTE: the hand-written <table> markup was replaced by these DataTable column definitions (F3)
const columns = [{ label: 'Service Name', field: 'name' }, { label: 'Service Description', field: 'description' }]
// MIGRATION NOTE: methods.loadData became clear(). It resets the search fields and reloads through useApi
function clear() { name.value = ''; description.value = ''; query.value = null; execute() }
// MIGRATION NOTE: methods.handleSubmitForm became search(). It builds the query and reruns the same useApi call
function search() {
  query.value = searchBy.value === 'Service Name' ? { searchBy: 'name', name: name.value } : { searchBy: 'description', description: description.value }
  execute()
}
// MIGRATION NOTE: mounted() became onMounted(); execute() from useApi loads the list on page load
onMounted(execute)
</script>
