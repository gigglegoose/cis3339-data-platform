// F2: One Axios client, one error handler, and one consistent API surface.
import axios from 'axios'
import router from '../router'
import { useLoggedInUserStore } from '../store/loggedInUser'

const apiClient = axios.create({ baseURL: import.meta.env.VITE_ROOT_API, headers: { 'Content-Type': 'application/json' } })
export function setAuthHeader(token) { apiClient.defaults.headers.common.Authorization = `Bearer ${token}` }
export function removeAuthHeader() { delete apiClient.defaults.headers.common.Authorization }
export function logoutUser() { localStorage.removeItem('authToken'); removeAuthHeader() }

function serverMessage(error) {
  if (!error.response) return 'Unable to reach the server'
  const payload = error.response.data
  if (typeof payload === 'string') {
    try { const parsed = JSON.parse(payload); return parsed.message || parsed.error || parsed.errors?.[0]?.msg || payload }
    catch (_) { return payload }
  }
  if (typeof payload?.message === 'string') {
    try { const parsed = JSON.parse(payload.message); return parsed.errors?.[0]?.msg || parsed.message || payload.message }
    catch (_) { return payload.message }
  }
  return payload?.error || payload?.errors?.[0]?.msg || `Request failed (${error.response.status})`
}
apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = serverMessage(error)
    if (error.response?.status === 401) {
      // Lazy call avoids trying to read Pinia before application startup.
      logoutUser()
      try { useLoggedInUserStore().$patch({ name: '', role: '', isLoggedIn: false }) } catch (_) { /* startup before Pinia */ }
      if (router.currentRoute.value.path !== '/login') router.replace({ name: 'login' })
    }
    return Promise.reject(new Error(message))
  }
)

const body = async promise => (await promise).data
export async function loginUser(username, password) {
  const result = await body(apiClient.post('/users/login', { username, password }))
  const token = result.token
  if (!token) throw new Error('Login response did not include a token')
  localStorage.setItem('authToken', token)
  setAuthHeader(token)
  return token
}
export const getOrgName = () => body(apiClient.get('/org'))
export const getEvents = () => body(apiClient.get('/events/'))
export const getEventById = id => body(apiClient.get(`/events/id/${id}`))
export const searchEvents = query => body(apiClient.get('/events/search', {
  params: query.searchBy === 'name' ? { searchBy: 'name', name: query.name || '' } : { searchBy: 'date', eventDate: query.eventDate || '' }
}))
export const getClientEvents = id => body(apiClient.get(`/events/client/${id}`))
export const getNonClientEvents = id => body(apiClient.get(`/events/client/${id}/not-registered`))
export const getEventAttendees = id => body(apiClient.get(`/events/attendees/${id}`))
export const getEventsByServiceId = id => body(apiClient.get(`/events/service/${id}`))
export const createEvent = eventData => body(apiClient.post('/events/', eventData))
export const updateEvent = (id, eventData) => body(apiClient.put(`/events/update/${id}`, eventData))
export const registerAttendee = (eventId, clientId) => body(apiClient.put('/events/register', {}, { params: { event: eventId, client: clientId } }))
export const deregisterAttendee = (eventId, clientId) => body(apiClient.put('/events/deregister', {}, { params: { event: eventId, client: clientId } }))
export const deleteEvent = id => body(apiClient.delete(`/events/${id}`))
export const getAttendance = () => body(apiClient.get('/events/attendance'))
export const getClients = () => body(apiClient.get('/clients'))
export const getClientById = id => body(apiClient.get(`/clients/id/${id}`))
export const searchClients = query => body(apiClient.get('/clients/search', {
  params: query.searchBy === 'name' ? { searchBy: 'name', firstName: query.firstName || '', lastName: query.lastName || '' } : { searchBy: 'number', phoneNumber: query.phoneNumber || '' }
}))
export const createClient = newClient => body(apiClient.post('/clients', newClient))
export const updateClient = (id, updatedClient) => body(apiClient.put(`/clients/update/${id}`, updatedClient))
export const deleteClientbyId = id => body(apiClient.delete(`/clients/${id}`))
export const getClientsByZipCode = () => body(apiClient.get('/clients/byzip'))
export const getServices = () => body(apiClient.get('/services/'))
export const getServiceById = id => body(apiClient.get(`/services/id/${id}`))
export const searchServices = query => body(apiClient.get('/services/search', { params: query.searchBy === 'name' ? { searchBy: 'name', name: query.name || '' } : { searchBy: 'description', description: query.description || '' } }))
export const createService = newService => body(apiClient.post('/services', newService))
export const updateService = (id, updatedService) => body(apiClient.put(`/services/update/${id}`, updatedService))
export const deleteService = id => body(apiClient.delete(`/services/${id}`))
