import { createRouter, createWebHashHistory } from 'vue-router'
import MapView from '../views/MapView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Map',
    component: MapView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegistrationView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if needed
  if (!authStore.isAuthenticated) {
    await authStore.initializeAuth()
  }

  // Handle authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ 
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next(to.query.redirect || '/admin')
  } else {
    next()
  }
})

export default router
