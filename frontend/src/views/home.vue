<template>
  <main class="p-10">
    <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mb-10">Dashboard</h1>
    <section class="mb-12">
      <h2 class="text-3xl text-center text-red-700 font-bold mb-6">Events Attendance</h2>
      <p v-if="attendanceLoading" role="status">Loading event attendance...</p>
      <div v-else-if="attendanceError" role="alert" class="p-4 bg-red-50 text-red-800">
        {{ attendanceError }} <button class="underline" @click="reloadAttendance">Retry</button>
      </div>
      <p v-else-if="!attendance?.length">No events found.</p>
      <template v-else>
        <table class="min-w-full shadow-md rounded"><thead><tr><th class="p-3 text-left">Event Name</th><th class="p-3 text-left">Event Date</th><th class="p-3 text-left">Number of Attendees</th></tr></thead>
          <tbody><tr v-for="event in attendance" :key="event._id" @click="router.push({ name: 'eventdetails', params: { id: event._id } })" class="cursor-pointer hover:bg-red-50">
            <td class="p-2">{{ event.name }}</td><td class="p-2">{{ formatDate(event.date) }}</td><td class="p-2">{{ event.attendees?.length || 0 }}</td>
          </tr></tbody></table>
        <AttendanceChart :label="attendanceLabels" :chart-data="attendanceCounts" />
      </template>
    </section>
    <section>
      <h2 class="text-3xl text-center text-red-700 font-bold mb-6">Clients by Zip Code</h2>
      <p v-if="zipLoading" role="status">Loading ZIP code data...</p>
      <div v-else-if="zipError" role="alert" class="p-4 bg-red-50 text-red-800">
        {{ zipError }} <button class="underline" @click="reloadZips">Retry</button>
      </div>
      <p v-else-if="!zips?.length">No clients found.</p>
      <template v-else>
        <table class="min-w-full shadow-md rounded"><thead><tr><th class="p-3 text-left">Zip Number</th><th class="p-3 text-left">Client Count</th></tr></thead>
          <tbody><tr v-for="zip in zips" :key="zip._id"><td class="p-2">{{ zip._id }}</td><td class="p-2">{{ zip.count }}</td></tr></tbody></table>
        <ZipChart :label="zipLabels" :chart-data="zipCounts" />
      </template>
    </section>
  </main>
</template>
<script setup>
// F1/F2: Replaces duplicated Options-era request state with the shared useApi composable.
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AttendanceChart from '../components/barChart.vue'
import ZipChart from '../components/donutZipChart.vue'
import { getAttendance, getClientsByZipCode } from '../api/api'
import { useApi } from '../composables/useApi'
// MIGRATION NOTE: the components option is gone; imported chart components are usable directly in <script setup>
// MIGRATION NOTE: this.$router became useRouter()
const router = useRouter()
// MIGRATION NOTE: the old data option (recentEvents, loading, error, zips, zipLoading, zipError) and the two copy-pasted
// try/catch methods became two useApi calls with their own data/loading/error/execute (F2)
const { data: attendance, loading: attendanceLoading, error: attendanceError, execute: reloadAttendance } = useApi(getAttendance)
const { data: zips, loading: zipLoading, error: zipError, execute: reloadZips } = useApi(getClientsByZipCode)
// MIGRATION NOTE: methods.formatDate became a plain function
function formatDate(value) { const d = new Date(value); return Number.isNaN(d.getTime()) ? '' : `${String(d.getUTCMonth()+1).padStart(2,'0')}/${String(d.getUTCDate()).padStart(2,'0')}/${d.getUTCFullYear()}` }
// MIGRATION NOTE: labels and chart data were assigned by hand in methods; they are now computed() values that update automatically
const attendanceLabels = computed(() => (attendance.value || []).map(x => `${x.name} (${formatDate(x.date)})`))
const attendanceCounts = computed(() => (attendance.value || []).map(x => x.attendees?.length || 0))
const zipLabels = computed(() => (zips.value || []).map(x => x._id))
const zipCounts = computed(() => (zips.value || []).map(x => x.count))
// MIGRATION NOTE: mounted() became onMounted()
onMounted(() => { reloadAttendance(); reloadZips() })
</script>
