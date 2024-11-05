<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h2 class="text-center mb-4">Iniciar Sesión</h2>
            
            <div v-if="authStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ authStore.error }}
              <button type="button" class="btn-close" @click="authStore.clearError"></button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="username" class="form-label">Usuario</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  required
                  :disabled="authStore.isLoading"
                  autocomplete="username"
                >
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  required
                  :disabled="authStore.isLoading"
                  autocomplete="current-password"
                >
              </div>

              <button 
                type="submit" 
                class="btn btn-primary w-100" 
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()
    const username = ref('')
    const password = ref('')

    const handleSubmit = async () => {
      const success = await authStore.login({
        username: username.value,
        password: password.value
      })

      if (success) {
        const redirectPath = route.query.redirect || '/admin'
        router.push(redirectPath)
      }
    }

    return {
      username,
      password,
      handleSubmit,
      authStore
    }
  }
}
</script>
