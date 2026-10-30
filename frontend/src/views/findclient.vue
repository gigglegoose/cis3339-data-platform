<template>
  <main class="p-10">
    <h1 class="font-bold text-4xl text-red-700 text-center mb-10">Find Client</h1>
    <div class="flex flex-wrap gap-4 items-end mb-8">
      <label>Search Client By
        <select v-model="searchBy" class="block rounded border-gray-300">
          <option value="Client Name">Client Name</option>
          <option value="Client Number">Client Number</option>
        </select>
      </label>
      <template v-if="searchBy === 'Client Name'">
        <input v-model="firstName" aria-label="First name" placeholder="First name" @keyup.enter="search" />
        <input v-model="lastName" aria-label="Last name" placeholder="Last name" @keyup.enter="search" />
      </template>
      <input v-else v-model="phoneNumber" aria-label="Phone number" placeholder="Phone number" @keyup.enter="search" />
      <button class="border rounded p-2" @click="clear">Clear Search</button>
      <button class="bg-red-700 text-white rounded p-2" @click="search">Search Client</button>
    </div>
    <h2 class="text-2xl font-bold">List of Clients</h2>
    <p class="italic mb-3">Click a row to view client details</p>
    <p v-if="loading" role="status">Loading clients...</p>
    <div v-else-if="error" role="alert" class="text-red-800">
      {{ error }} <button class="underline ml-2" @click="execute">Retry</button>
    </div>
    <p v-else-if="!clients?.length">No clients found.</p>
    <DataTable v-else :columns="columns" :rows="clients" @select="row => router.push({ name: 'clientdetails', params: { id: row._id } })" />
  </main>
</template>
<script setup>
// F1/F2/F3: Composition API refs plus shared async-state and data table replace old Options API methods.
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getClients, searchClients } from '../api/api'
import { useApi } from '../composables/useApi'
import DataTable from '../components/DataTable.vue'
// MIGRATION NOTE: this.$router became useRouter(); the template now calls router.push(...)
const router = useRouter()
// MIGRATION NOTE: each property in the old data option (searchBy, firstName, lastName, phoneNumber) became a ref
const searchBy = ref('Client Name')
const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const query = ref(null)
// MIGRATION NOTE: the hand-rolled clients/try-catch/toast pattern became the shared useApi composable (F2)
const { data: clients, loading, error, execute } = useApi(() => query.value ? searchClients(query.value) : getClients())
// MIGRATION NOTE: the hand-written <table> markup was replaced by these DataTable column definitions (F3)
const columns = [
  { label: 'Name', field: 'firstName', render: r => `${r.firstName || ''} ${r.lastName || ''}`.trim() },
  { label: 'Phone number', field: 'phoneNumber.primary' },
  { label: 'City', field: 'address.city' }
]
// MIGRATION NOTE: methods.loadData became clear(). It resets the search fields and reloads through useApi
function clear() { firstName.value = ''; lastName.value = ''; phoneNumber.value = ''; query.value = null; execute() }
// MIGRATION NOTE: methods.handleSubmitForm became search(). It builds the query and reruns the same useApi call
function search() {
  query.value = searchBy.value === 'Client Name'
    ? { searchBy: 'name', firstName: firstName.value, lastName: lastName.value }
    : { searchBy: 'number', phoneNumber: phoneNumber.value }
  execute()
}
// MIGRATION NOTE: mounted() became onMounted(); execute() from useApi loads the list on page load
onMounted(execute)
</script>
