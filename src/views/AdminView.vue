<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestión de Ubicaciones</h2>
      <button class="btn btn-success" @click="showAddModal">
        <i class="fas fa-plus"></i> Añadir Nueva Ubicación
      </button>
    </div>

    <!-- Notifications -->
    <div id="notifications" class="position-fixed top-0 end-0 p-3" style="z-index: 1100"></div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Tipo</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in locationStore.locations" :key="location.id">
            <td>{{ location.name }}</td>
            <td>{{ location.address }}</td>
            <td>{{ location.type === 'association' ? 'Asociación' : 'Punto de Ayuda' }}</td>
            <td>{{ location.contact || 'N/A' }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="editLocation(location)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(location)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Location Modal -->
    <div class="modal fade" id="locationModal" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar Ubicación' : 'Añadir Nueva Ubicación' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveLocation" class="needs-validation" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="name" class="form-label">Nombre *</label>
                  <input type="text" class="form-control" id="name" v-model="formData.name" required>
                </div>
                <div class="col-md-6">
                  <label for="type" class="form-label">Tipo *</label>
                  <select class="form-select" id="type" v-model="formData.type" required>
                    <option value="association">Asociación</option>
                    <option value="aid_point">Punto de Ayuda</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="address" class="form-label">Dirección *</label>
                  <input type="text" class="form-control" id="address" v-model="formData.address" required>
                </div>
                <div class="col-md-6">
                  <label for="latitude" class="form-label">Latitud *</label>
                  <input type="number" step="any" class="form-control" id="latitude" v-model="formData.lat" required>
                </div>
                <div class="col-md-6">
                  <label for="longitude" class="form-label">Longitud *</label>
                  <input type="number" step="any" class="form-control" id="longitude" v-model="formData.lng" required>
                </div>
                <div class="col-md-6">
                  <label for="contact" class="form-label">Contacto</label>
                  <input type="text" class="form-control" id="contact" v-model="formData.contact">
                </div>
                <div class="col-md-6">
                  <label for="hours" class="form-label">Horario</label>
                  <input type="text" class="form-control" id="hours" v-model="formData.hours">
                </div>
                <div class="col-12">
                  <label for="services" class="form-label">Servicios</label>
                  <textarea class="form-control" id="services" v-model="formData.services" rows="2"></textarea>
                </div>
                <div class="col-12">
                  <label for="description" class="form-label">Descripción</label>
                  <textarea class="form-control" id="description" v-model="formData.description" rows="3"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveLocation">Guardar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que quieres eliminar esta ubicación? Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="deleteLocation">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useLocationStore } from '../stores/locations'

export default {
  name: 'AdminView',
  setup() {
    const locationStore = useLocationStore()
    const isEditing = ref(false)
    const selectedLocation = ref(null)
    const modal = ref(null)
    const deleteModal = ref(null)
    const formData = ref({
      name: '',
      address: '',
      lat: null,
      lng: null,
      type: 'association',
      description: '',
      contact: '',
      hours: '',
      services: ''
    })

    const showNotification = (message, type = 'success') => {
      const notification = document.createElement('div')
      notification.className = `alert alert-${type} alert-dismissible fade show`
      notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.getElementById('notifications').appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 5000)
    }

    const resetForm = () => {
      formData.value = {
        name: '',
        address: '',
        lat: null,
        lng: null,
        type: 'association',
        description: '',
        contact: '',
        hours: '',
        services: ''
      }
      isEditing.value = false
      selectedLocation.value = null
    }

    const showAddModal = () => {
      resetForm()
      new bootstrap.Modal(modal.value).show()
    }

    const editLocation = (location) => {
      isEditing.value = true
      selectedLocation.value = location
      formData.value = { ...location }
      new bootstrap.Modal(modal.value).show()
    }

    const confirmDelete = (location) => {
      selectedLocation.value = location
      new bootstrap.Modal(deleteModal.value).show()
    }

    const saveLocation = async () => {
      try {
        if (isEditing.value) {
          await locationStore.updateLocation(selectedLocation.value.id, formData.value)
          showNotification('¡Ubicación actualizada exitosamente!')
        } else {
          await locationStore.addLocation(formData.value)
          showNotification('¡Ubicación añadida exitosamente!')
        }
        bootstrap.Modal.getInstance(modal.value).hide()
        resetForm()
      } catch (error) {
        console.error('Error al guardar ubicación:', error)
        showNotification(error.message, 'danger')
      }
    }

    const deleteLocation = async () => {
      try {
        await locationStore.deleteLocation(selectedLocation.value.id)
        bootstrap.Modal.getInstance(deleteModal.value).hide()
        showNotification('¡Ubicación eliminada exitosamente!')
      } catch (error) {
        console.error('Error al eliminar ubicación:', error)
        showNotification(error.message, 'danger')
      }
    }

    onMounted(async () => {
      await locationStore.fetchLocations()
    })

    return {
      locationStore,
      isEditing,
      formData,
      modal,
      deleteModal,
      showAddModal,
      editLocation,
      confirmDelete,
      saveLocation,
      deleteLocation
    }
  }
}
</script>
