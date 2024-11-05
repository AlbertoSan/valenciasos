import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    error: null,
    isLoading: false
  }),

  actions: {
    async login({ username, password }) {
      this.isLoading = true
      this.error = null
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
        
        if (username === 'admin' && password === 'admin123') {
          this.isAuthenticated = true
          this.user = { username }
          localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, user: { username } }))
          return true
        }
        
        this.error = 'Credenciales inválidas'
        return false
      } catch (error) {
        console.error('Login error:', error)
        this.error = 'Error al iniciar sesión. Por favor, intenta de nuevo.'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        this.isAuthenticated = false
        this.user = null
        this.error = null
        localStorage.removeItem('auth')
        return true
      } catch (error) {
        console.error('Logout error:', error)
        return false
      }
    },

    async initializeAuth() {
      try {
        const auth = localStorage.getItem('auth')
        if (auth) {
          const { isAuthenticated, user } = JSON.parse(auth)
          this.isAuthenticated = isAuthenticated
          this.user = user
        }
        return true
      } catch (error) {
        console.error('Error initializing auth:', error)
        this.logout() // Clear any corrupted state
        return false
      }
    }
  }
})
