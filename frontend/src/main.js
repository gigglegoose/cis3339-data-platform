import { createApp, markRaw } from 'vue'
import router from './router'
import App from './App.vue'
import './index.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createPinia } from 'pinia'
import { useLoggedInUserStore } from './store/loggedInUser'

const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => { store.$router = markRaw(router) })
app.use(pinia)
// Restore the token/header and Pinia state before initial route navigation.
useLoggedInUserStore(pinia).restoreSession()
app.use(router)
app.use(Toast, { position: 'bottom-right' })
app.mount('#app')
