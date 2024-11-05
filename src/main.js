import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'leaflet/dist/leaflet.css'
import './assets/main.css'

// Create Vue application and Pinia store
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Initialize auth state before mounting
const authStore = useAuthStore(pinia)
authStore.initializeAuth()

// Use Vue Router
app.use(router)

// Mount the app
app.mount('#app')
