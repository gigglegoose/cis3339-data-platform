<template>
  <div class="w-1/2">
    <canvas class="p-10" ref="zipChart"></canvas>
  </div>
</template>

<script setup>
// MIGRATION NOTE: Converted from the Options API (props + mounted) to <script setup>.
// Same pattern as barChart.vue: create in onMounted, update in watch, destroy in onBeforeUnmount.
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// MIGRATION NOTE: `props: {}` became defineProps() with the same names (label and chartData)
const props = defineProps({
  label: {
    type: Array
  },
  chartData: {
    type: Array
  }
})

// MIGRATION NOTE: this.$refs.zipChart became a template ref matching ref="zipChart" on the <canvas>
const zipChart = ref(null)

// Plain variable, not reactive, so Vue does not wrap the Chart.js instance in a proxy
let chart = null

// Builds the Chart.js config from the current props
function buildConfig() {
  return {
    type: 'doughnut',
    data: {
      labels: props.label,
      datasets: [
        {
          borderWidth: 1,
          data: props.chartData
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Clients by Zip Code'
        }
      },
      responsive: true,
      maintainAspectRatio: true
    }
  }
}

// MIGRATION NOTE: mounted() became onMounted(). The pointless `await new Chart(...)` was removed.
onMounted(() => {
  chart = new Chart(zipChart.value, buildConfig())
})

// MIGRATION NOTE: new behavior. Redraw when the parent passes new zip labels or counts.
watch(
  () => [props.label, props.chartData],
  () => {
    if (!chart) return
    chart.data.labels = props.label
    chart.data.datasets[0].data = props.chartData
    chart.update()
  },
  { deep: true }
)

// MIGRATION NOTE: new behavior. Clean up the Chart.js instance when leaving the dashboard.
onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>
