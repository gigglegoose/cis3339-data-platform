// F4: Restore valid stored JWT sessions; use Pinia state as the single session source.
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import jwt_decode from 'jwt-decode'
import { loginUser, logoutUser, setAuthHeader } from '../api/api'

function decodeValidToken(token) {
  if (!token) return null
  try {
    const data = jwt_decode(token)
    if (!data || typeof data !== 'object' || !data.exp || data.exp * 1000 <= Date.now()) return null
    return data
  } catch (_) { return null }
}
export const useLoggedInUserStore = defineStore('loggedInUser', {
  state: () => ({ name: '', role: '', isLoggedIn: false }),
  actions: {
    clearSession() {
      logoutUser()
      this.$patch({ name: '', role: '', isLoggedIn: false })
    },
    restoreSession() {
      const token = localStorage.getItem('authToken')
      const details = decodeValidToken(token)
      if (!details) { this.clearSession(); return false }
      setAuthHeader(token)
      this.$patch({ name: details.name || '', role: details.role || '', isLoggedIn: true })
      return true
    },
    async login(username, password) {
      const toast = useToast()
      try {
        const token = await loginUser(username, password)
        const details = decodeValidToken(token)
        if (!details) throw new Error('The login token is invalid or expired')
        this.$patch({ name: details.name || '', role: details.role || '', isLoggedIn: true })
        await this.$router.push(this.$router.currentRoute.value.query.redirect || '/')
        toast.success('Login successful!')
      } catch (error) { this.clearSession(); toast.error(error.message || 'Login failed') }
    },
    logout() {
      this.clearSession()
      this.$router.push('/login')
      useToast().info('You have been logged out!')
    }
  }
})
