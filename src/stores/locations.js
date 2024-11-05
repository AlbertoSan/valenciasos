import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useLocationStore = defineStore('locations', {
  state: () => ({
    locations: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchLocations() {
      this.loading = true
      try {
        const response = await fetch('/api/locations')
        if (!response.ok) throw new Error('Error al cargar las ubicaciones')
        const data = await response.json()
        this.locations = data
        this.error = null
      } catch (error) {
        console.error('Error loading locations:', error)
        this.error = 'Error al cargar las ubicaciones'
      } finally {
        this.loading = false
      }
    },

    async addLocation(location) {
      const authStore = useAuthStore()
      try {
        const response = await fetch('/api/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify(location)
        })
        
        if (!response.ok) throw new Error('Error al añadir la ubicación')
        const data = await response.json()
        this.locations.push(data)
        return { status: 'success', data }
      } catch (error) {
        console.error('Error adding location:', error)
        throw new Error('Error al añadir la ubicación')
      }
    },

    async updateLocation(id, location) {
      const authStore = useAuthStore()
      try {
        const response = await fetch(`/api/locations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
          },
          body: JSON.stringify(location)
        })

        if (!response.ok) throw new Error('Error al actualizar la ubicación')
        const data = await response.json()
        
        const index = this.locations.findIndex(l => l.id === id)
        if (index !== -1) {
          this.locations[index] = data
        }
        return { status: 'success' }
      } catch (error) {
        console.error('Error updating location:', error)
        throw new Error('Error al actualizar la ubicación')
      }
    },

    async deleteLocation(id) {
      const authStore = useAuthStore()
      try {
        const response = await fetch(`/api/locations/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (!response.ok) throw new Error('Error al eliminar la ubicación')
        
        const index = this.locations.findIndex(l => l.id === id)
        if (index !== -1) {
          this.locations.splice(index, 1)
        }
        return { status: 'success' }
      } catch (error) {
        console.error('Error deleting location:', error)
        throw new Error('Error al eliminar la ubicación')
      }
    }
  }
})
