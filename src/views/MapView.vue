<template>
  <div class="map-container">
    <div class="search-panel">
      <input
        type="text"
        class="form-control mb-3"
        placeholder="Buscar ubicaciones..."
        v-model="searchQuery"
      >
      <div class="form-check mb-2">
        <input
          class="form-check-input"
          type="checkbox"
          id="show-associations"
          v-model="showAssociations"
        >
        <label class="form-check-label" for="show-associations">
          Mostrar Asociaciones
        </label>
      </div>
      <div class="form-check mb-3">
        <input
          class="form-check-input"
          type="checkbox"
          id="show-aid-points"
          v-model="showAidPoints"
        >
        <label class="form-check-label" for="show-aid-points">
          Mostrar Puntos de Ayuda
        </label>
      </div>
      <button class="btn btn-secondary" @click="locateUser">
        <i class="fas fa-location-dot"></i> Encontrar Mi Ubicación
      </button>
    </div>
    <div id="map"></div>

    <!-- Location Details Modal -->
    <div class="modal fade" id="locationDetailsModal" tabindex="-1" ref="detailsModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedLocation?.name || 'Detalles de la Ubicación' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedLocation">
            <p><strong>Dirección:</strong> {{ selectedLocation.address }}</p>
            <p><strong>Horario:</strong> {{ selectedLocation.hours || 'No especificado' }}</p>
            <p><strong>Contacto:</strong> {{ selectedLocation.contact || 'No especificado' }}</p>
            <p><strong>Servicios:</strong> {{ selectedLocation.services || 'No especificado' }}</p>
            <p><strong>Descripción:</strong> {{ selectedLocation.description || 'Sin descripción disponible' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useLocationStore } from '../stores/locations'
import L from 'leaflet'
import markerAssociation from '../assets/marker-association.svg'
import markerAidPoint from '../assets/marker-aid_point.svg'

export default {
  name: 'MapView',
  setup() {
    const map = ref(null)
    const markers = ref([])
    const userMarker = ref(null)
    const searchQuery = ref('')
    const showAssociations = ref(true)
    const showAidPoints = ref(true)
    const locationStore = useLocationStore()
    const selectedLocation = ref(null)
    const detailsModal = ref(null)

    const initMap = () => {
      map.value = L.map('map').setView([39.4699, -0.3763], 11)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contribuidores'
      }).addTo(map.value)
    }

    const showLocationDetails = (location) => {
      selectedLocation.value = location
      const modal = new bootstrap.Modal(detailsModal.value)
      modal.show()
    }

    const updateMarkers = () => {
      markers.value.forEach(marker => marker.remove())
      markers.value = []

      locationStore.locations
        .filter(location => {
          const matchesSearch = location.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                             location.address.toLowerCase().includes(searchQuery.value.toLowerCase())
          const matchesType = (location.type === 'association' && showAssociations.value) ||
                           (location.type === 'aid_point' && showAidPoints.value)
          return matchesSearch && matchesType
        })
        .forEach(location => {
          const marker = L.marker([location.lat, location.lng], {
            icon: L.icon({
              iconUrl: location.type === 'association' ? markerAssociation : markerAidPoint,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          })
          
          marker.bindPopup(`
            <div class="location-popup">
              <h5>${location.name}</h5>
              <p><strong>Dirección:</strong> ${location.address}</p>
              <p><strong>Tipo:</strong> ${location.type === 'association' ? 'Asociación' : 'Punto de Ayuda'}</p>
              <button class="btn btn-sm btn-secondary" onclick="window.showLocationDetails(${location.id})">
                Ver Detalles
              </button>
            </div>
          `)
          
          markers.value.push(marker)
          marker.addTo(map.value)
        })
    }

    const locateUser = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords
            if (userMarker.value) {
              userMarker.value.remove()
            }
            userMarker.value = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'user-location',
                html: '📍',
                iconSize: [25, 25]
              })
            }).addTo(map.value)
            map.value.setView([latitude, longitude], 15)
          },
          error => {
            console.error('Error al obtener ubicación:', error)
            alert('No se puede obtener tu ubicación. Por favor, verifica la configuración de tu navegador.')
          }
        )
      } else {
        alert('La geolocalización no está soportada en tu navegador.')
      }
    }

    window.showLocationDetails = (locationId) => {
      const location = locationStore.locations.find(l => l.id === locationId)
      if (location) {
        showLocationDetails(location)
      }
    }

    onMounted(async () => {
      await locationStore.fetchLocations()
      initMap()
      updateMarkers()
    })

    watch([searchQuery, showAssociations, showAidPoints], updateMarkers)

    return {
      searchQuery,
      showAssociations,
      showAidPoints,
      locateUser,
      selectedLocation,
      detailsModal
    }
  }
}
</script>

<style>
.map-container {
  height: calc(100vh - 56px);
  position: relative;
}

#map {
  height: 100%;
  width: 100%;
}

.search-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: var(--bs-dark);
  padding: 15px;
  border-radius: 8px;
  max-width: 300px;
}

.location-popup {
  max-width: 300px;
}

.location-popup h5 {
  margin-bottom: 10px;
}

.location-popup p {
  margin-bottom: 5px;
}
</style>
