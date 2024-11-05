import { defineStore } from 'pinia'

// Initial sample data
const sampleLocations = [
  // {
  //   id: 1,
  //   name: 'Community Support Center',
  //   address: 'Av. dels Tarongers, Valencia, Spain',
  //   lat: 39.4781,
  //   lng: -0.3419,
  //   type: 'association',
  //   description: 'Main community support center providing various services',
  //   contact: '(34) 555-0123',
  //   hours: 'Mon-Fri: 9AM-5PM',
  //   services: 'Food distribution, counseling, job search assistance'
  // },
  // {
  //   id: 2,
  //   name: 'Food Bank Distribution',
  //   address: 'Carrer de Colón, Valencia, Spain',
  //   lat: 39.4702,
  //   lng: -0.3768,
  //   type: 'aid_point',
  //   description: 'Weekly food distribution center',
  //   contact: '(34) 555-0124',
  //   hours: 'Wed-Sat: 10AM-4PM',
  //   services: 'Food distribution, emergency supplies'
  // },
  // {
  //   id: 3,
  //   name: 'Homeless Support Association',
  //   address: 'Plaça de l\'Ajuntament, Valencia, Spain',
  //   lat: 39.4699,
  //   lng: -0.3763,
  //   type: 'association',
  //   description: 'Supporting homeless individuals',
  //   contact: '(34) 555-0125',
  //   hours: 'Mon-Sun: 8AM-8PM',
  //   services: 'Shelter information, meals, clothing'
  // }
]

// Load data from localStorage or use sample data
const loadStoredLocations = () => {
  const stored = localStorage.getItem('locations')
  return stored ? JSON.parse(stored) : sampleLocations
}

export const useLocationStore = defineStore('locations', {
  state: () => ({
    locations: loadStoredLocations(),
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchLocations() {
      this.loading = true
      try {
        // Load from localStorage
        this.locations = loadStoredLocations()
        this.error = null
      } catch (error) {
        this.error = error.message
        console.error('Error loading locations:', error)
      } finally {
        this.loading = false
      }
    },
    
    async addLocation(location) {
      try {
        const newLocation = {
          ...location,
          id: Math.max(...this.locations.map(l => l.id), 0) + 1
        }
        this.locations.push(newLocation)
        localStorage.setItem('locations', JSON.stringify(this.locations))
        return { status: 'success', data: newLocation }
      } catch (error) {
        console.error('Error adding location:', error)
        throw error
      }
    },

    async updateLocation(id, location) {
      const index = this.locations.findIndex(l => l.id === id)
      if (index !== -1) {
        this.locations[index] = { ...location, id }
        localStorage.setItem('locations', JSON.stringify(this.locations))
        return { status: 'success' }
      }
      throw new Error('Location not found')
    },

    async deleteLocation(id) {
      const index = this.locations.findIndex(l => l.id === id)
      if (index !== -1) {
        this.locations.splice(index, 1)
        localStorage.setItem('locations', JSON.stringify(this.locations))
        return { status: 'success' }
      }
      throw new Error('Location not found')
    }
  }
})
