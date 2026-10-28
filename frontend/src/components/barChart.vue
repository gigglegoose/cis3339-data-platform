<template>
  <div>
    <canvas class="p-10" ref="attendanceChart"></canvas>
  </div>
</template>

<script setup>
// MIGRATION NOTE: Converted from the Options API (props + mounted) to <script setup>.
// Chart.js is a third-party library, so the Composition API lifecycle hooks now handle
// creating, updating, and destroying the chart.
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Chart, registerables, Colors } from 'chart.js'

Chart.register(...registerables)
Chart.register(Colors)

// MIGRATION NOTE: the `props: {}` option became defineProps(). Same prop names and types,
// so home.vue still passes :label and :chart-data with no changes.
const props = defineProps({
  label: {
    type: Array
  },
  chartData: {
    type: Array
  }
})

// MIGRATION NOTE: this.$refs.attendanceChart became a template ref. The ref name matches
// the ref="attendanceChart" attribute on the <canvas>, so Vue fills it in after mounting.
const attendanceChart = ref(null)

// The Chart.js instance is kept in a plain variable (not a ref) on purpose.
// Making it reactive would wrap Chart.js internals in a Vue proxy, which Chart.js does not expect.
let chart = null

// Builds the Chart.js config from the current props
function buildConfig() {
  return {
    type: 'bar',
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
      scales: {
        y: {
          ticks: {
            stepSize: 1
          }
        },
        x: {
          // `gridLines` was Chart.js v2 syntax and was ignored by Chart.js v4; v4 calls it `grid`
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Attendance Chart'
        }
      },
      responsive: true,
      maintainAspectRatio: true
    }
  }
}

// MIGRATION NOTE: mounted() became onMounted(). The old code used `await new Chart(...)`,
// but a constructor is not a promise, so the await did nothing and was removed.
onMounted(() => {
  chart = new Chart(attendanceChart.value, buildConfig())
})

// MIGRATION NOTE: new behavior. The Options API version drew the chart once and ignored later
// prop changes. This watch updates the chart whenever the parent passes new labels or data.
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

// MIGRATION NOTE: new behavior. Destroy the chart when the component leaves the page so the
// canvas and its event listeners are not leaked every time the user navigates away and back.
onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

