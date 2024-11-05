<template>
  <div id="app">
    <nav v-if="isReady" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Mapa de Ayuda Comunitaria</router-link>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Mapa</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Registrar Organización</router-link>
            </li>
            <li class="nav-item" v-if="authStore.isAuthenticated">
              <router-link class="nav-link" to="/admin">Administración</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!authStore.isAuthenticated">
              <router-link class="nav-link" to="/login">Iniciar Sesión</router-link>
            </li>
            <li class="nav-item" v-else>
              <a class="nav-link" href="#" @click.prevent="handleLogout">Cerrar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <router-view v-if="isReady"></router-view>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const isReady = ref(false)

    const handleLogout = () => {
      authStore.logout()
      router.push('/login')
    }

    onMounted(() => {
      authStore.initializeAuth()
      isReady.value = true
    })

    return {
      authStore,
      handleLogout,
      isReady
    }
  }
}
</script>

<style>
@import 'https://cdn.replit.com/agent/bootstrap-agent-dark-theme.min.css';
</style>
