<template>
  <div>
    <table class="min-w-full shadow-md rounded">
      <thead class="bg-gray-50 text-xl">
        <tr>
          <th v-for="column in columns" :key="column.field" scope="col" class="p-4 text-left">
            <button type="button" class="font-bold" @click="sort(column.field)">
              {{ column.label }}
              <span v-if="sortField === column.field">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-300">
        <tr v-if="!sortedRows.length"><td :colspan="columns.length" class="p-4">No results</td></tr>
        <tr v-for="(row, index) in pageRows" :key="row._id || index" class="cursor-pointer hover:bg-red-50" tabindex="0"
          @click="$emit('select', row)" @keydown.enter="$emit('select', row)">
          <td v-for="column in columns" :key="column.field" class="p-3 text-left">{{ displayCell(row, column) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center gap-3 mt-4" v-if="sortedRows.length">
      <span>Showing {{ start + 1 }}-{{ Math.min(start + pageSize, sortedRows.length) }} of {{ sortedRows.length }}</span>
      <button type="button" class="border rounded px-3 py-1" :disabled="page === 1" @click="page--">Previous</button>
      <span>Page {{ page }} of {{ maxPage }}</span>
      <button type="button" class="border rounded px-3 py-1" :disabled="page === maxPage" @click="page++">Next</button>
    </div>
  </div>
</template>
<script setup>
// F3: Replaces the three Options-era duplicated tables with one Composition API component.
import { ref, computed, watch } from 'vue'
const props = defineProps({ columns: { type: Array, required: true }, rows: { type: Array, required: true } })
defineEmits(['select'])
const pageSize = 10
const page = ref(1)
const sortField = ref(null)
const sortDirection = ref(null)
const getField = (row, path) => path.split('.').reduce((v, key) => v?.[key], row)
const displayCell = (row, column) => column.render ? column.render(row) : (getField(row, column.field) ?? '')
const sortedRows = computed(() => {
  const result = [...props.rows]
  if (!sortField.value || !sortDirection.value) return result
  const col = props.columns.find(c => c.field === sortField.value)
  return result.sort((a, b) => {
    const left = String(displayCell(a, col)).toLocaleLowerCase()
    const right = String(displayCell(b, col)).toLocaleLowerCase()
    const comparison = left.localeCompare(right, undefined, { numeric: true })
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})
const maxPage = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize)))
const start = computed(() => (page.value - 1) * pageSize)
const pageRows = computed(() => sortedRows.value.slice(start.value, start.value + pageSize))
function sort(field) {
  if (sortField.value !== field) { sortField.value = field; sortDirection.value = 'asc' }
  else if (sortDirection.value === 'asc') sortDirection.value = 'desc'
  else { sortField.value = null; sortDirection.value = null }
  page.value = 1
}
// When a search or refresh replaces the result set, never display a stale page.
watch(() => props.rows, () => { page.value = 1 }, { deep: true })
</script>
