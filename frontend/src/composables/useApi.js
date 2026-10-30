import { ref } from 'vue'

// Shared Composition API async-state helper: one state contract for every screen.
export function useApi(apiCall) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  let requestId = 0

  async function execute() {
    const current = ++requestId
    loading.value = true
    error.value = null
    try {
      const result = await apiCall()
      if (current === requestId) data.value = result
      return result
    } catch (reason) {
      if (current === requestId) {
        data.value = null
        // The shared Axios interceptor is responsible for creating the message.
        error.value = reason.message || 'Request failed'
      }
      return null
    } finally {
      if (current === requestId) loading.value = false
    }
  }
  return { data, loading, error, execute }
}
