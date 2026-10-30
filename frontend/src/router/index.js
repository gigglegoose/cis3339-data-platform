import { createRouter, createWebHistory } from 'vue-router'
import { useLoggedInUserStore } from '../store/loggedInUser'

// F4: The editor-only routes are guarded in the router, not only hidden in App.vue.
const routes = [
  { path: '/', component: () => import('../views/home.vue') },
  { path: '/login', name: 'login', component: () => import('../views/login.vue') },
  { path: '/clientform', name: 'clientform', meta: { requiresAuth: true, requiresEditor: true }, component: () => import('../views/clientform.vue') },
  { path: '/findclient', name: 'findclient', meta: { requiresAuth: true }, component: () => import('../views/findclient.vue') },
  { path: '/clientdetails/:id', name: 'clientdetails', meta: { requiresAuth: true }, component: () => import('../views/clientdetails.vue') },
  { path: '/eventform', name: 'eventform', meta: { requiresAuth: true, requiresEditor: true }, component: () => import('../views/eventform.vue') },
  { path: '/findevents', name: 'findevents', meta: { requiresAuth: true }, component: () => import('../views/findevents.vue') },
  { path: '/eventdetails/:id', name: 'eventdetails', meta: { requiresAuth: true }, component: () => import('../views/eventDetails.vue') },
  { path: '/serviceform', name: 'serviceform', meta: { requiresAuth: true, requiresEditor: true }, component: () => import('../views/serviceform.vue') },
  { path: '/findservice', name: 'findservice', meta: { requiresAuth: true }, component: () => import('../views/findservice.vue') },
  { path: '/servicedetails/:id', name: 'servicedetails', meta: { requiresAuth: true }, component: () => import('../views/servicedetails.vue') }
]
const router = createRouter({ history: createWebHistory(), routes })
router.beforeEach(to => {
  const session = useLoggedInUserStore()
  if ((to.meta.requiresAuth || to.meta.requiresEditor) && !session.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresEditor && session.role !== 'editor') return { path: '/' }
})
export default router
