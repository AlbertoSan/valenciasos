<template>
  <div class="container py-4">
    <h2 class="mb-4">Registrar Tu Organización</h2>
    
    <!-- Success/Error Notifications -->
    <div class="alert alert-success alert-dismissible fade show" v-if="showSuccess" role="alert">
      ¡Registro exitoso! Tu organización ha sido añadida a nuestra base de datos.
      <button type="button" class="btn-close" @click="showSuccess = false"></button>
    </div>
    
    <div class="alert alert-danger alert-dismissible fade show" v-if="error" role="alert">
      {{ error }}
      <button type="button" class="btn-close" @click="error = null"></button>
    </div>

    <!-- Registration Form -->
    <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
      <div class="row g-3">
        <!-- Organization Name -->
        <div class="col-12">
          <label for="orgName" class="form-label">Nombre de la Organización *</label>
          <input
            type="text"
            class="form-control"
            id="orgName"
            v-model="formData.name"
            required
            :class="{ 'is-invalid': validationErrors.name }"
          >
          <div class="invalid-feedback">{{ validationErrors.name }}</div>
        </div>

        <!-- Organization Type -->
        <div class="col-md-6">
          <label for="orgType" class="form-label">Tipo de Organización *</label>
          <select
            class="form-select"
            id="orgType"
            v-model="formData.type"
            required
            :class="{ 'is-invalid': validationErrors.type }"
          >
            <option value="">Seleccionar tipo...</option>
            <option value="shelter">Refugio de Animales</option>
            <option value="association">Asociación de Animales</option>
          </select>
          <div class="invalid-feedback">{{ validationErrors.type }}</div>
        </div>

        <!-- Capacity -->
        <div class="col-md-6">
          <label for="capacity" class="form-label">Capacidad (número de animales) *</label>
          <input
            type="number"
            class="form-control"
            id="capacity"
            v-model="formData.capacity"
            min="1"
            required
            :class="{ 'is-invalid': validationErrors.capacity }"
          >
          <div class="invalid-feedback">{{ validationErrors.capacity }}</div>
        </div>

        <!-- Address -->
        <div class="col-12">
          <label for="address" class="form-label">Dirección *</label>
          <input
            type="text"
            class="form-control"
            id="address"
            v-model="formData.address"
            required
            :class="{ 'is-invalid': validationErrors.address }"
          >
          <div class="invalid-feedback">{{ validationErrors.address }}</div>
        </div>

        <!-- Latitude -->
        <div class="col-12">
          <label for="latitude" class="form-label">Latitud *</label>
          <input
            type="text"
            class="form-control"
            id="address"
            v-model="formData.latitude"
            required
            :class="{ 'is-invalid': validationErrors.latitude }"
          >
          <div class="invalid-feedback">{{ validationErrors.latitude }}</div>
        </div>

        <!-- Longitude -->
        <div class="col-12">
          <label for="longitude" class="form-label">Longitude *</label>
          <input
            type="text"
            class="form-control"
            id="address"
            v-model="formData.longitude"
            required
            :class="{ 'is-invalid': validationErrors.longitude }"
          >
          <div class="invalid-feedback">{{ validationErrors.longitude }}</div>
        </div>

        <!-- Contact Information -->
        <div class="col-md-6">
          <label for="phone" class="form-label">Número de Teléfono *</label>
          <input
            type="tel"
            class="form-control"
            id="phone"
            v-model="formData.phone"
            required
            :class="{ 'is-invalid': validationErrors.phone }"
          >
          <div class="invalid-feedback">{{ validationErrors.phone }}</div>
        </div>

        <div class="col-md-6">
          <label for="email" class="form-label">Correo Electrónico *</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="formData.email"
            required
            :class="{ 'is-invalid': validationErrors.email }"
          >
          <div class="invalid-feedback">{{ validationErrors.email }}</div>
        </div>

        <!-- Services Description -->
        <div class="col-12">
          <label for="services" class="form-label">Descripción de Servicios *</label>
          <textarea
            class="form-control"
            id="services"
            v-model="formData.services"
            rows="3"
            required
            :class="{ 'is-invalid': validationErrors.services }"
          ></textarea>
          <div class="invalid-feedback">{{ validationErrors.services }}</div>
        </div>

        <!-- Specific Needs -->
        <div class="col-12">
          <label for="needs" class="form-label">Necesidades Específicas</label>
          <textarea
            class="form-control"
            id="needs"
            v-model="formData.needs"
            rows="3"
            placeholder="Lista cualquier necesidad o requerimiento específico que tenga tu organización..."
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="col-12">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ isSubmitting ? 'Registrando...' : 'Registrar Organización' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useLocationStore } from '../stores/locations'
import { useRouter } from 'vue-router'

export default {
  name: 'RegistrationView',
  setup() {
    const locationStore = useLocationStore()
    const router = useRouter()
    const showSuccess = ref(false)
    const error = ref(null)
    const isSubmitting = ref(false)
    const validationErrors = reactive({})

    const formData = reactive({
      name: '',
      type: '',
      capacity: '',
      address: '',
      latitude: '',
      longitude: '',
      phone: '',
      email: '',
      services: '',
      needs: ''
    })

    const validateForm = () => {
      const errors = {}
      
      if (!formData.name.trim()) {
        errors.name = 'El nombre de la organización es obligatorio'
      }
      
      if (!formData.type) {
        errors.type = 'Por favor selecciona un tipo de organización'
      }
      
      if (!formData.capacity || formData.capacity < 1) {
        errors.capacity = 'Por favor ingresa una capacidad válida'
      }
      
      if (!formData.address.trim()) {
        errors.address = 'La dirección es obligatoria'
      }

      if (!formData.longitude.trim()) {
        errors.address = 'La Longitud es obligatoria'
      }

      if (!formData.latitude.trim()) {
        errors.address = 'La Latitud es obligatoria'
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'El número de teléfono es obligatorio'
      }
      
      if (!formData.email.trim()) {
        errors.email = 'El correo electrónico es obligatorio'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Por favor ingresa un correo electrónico válido'
      }
      
      if (!formData.services.trim()) {
        errors.services = 'La descripción de servicios es obligatoria'
      }

      Object.assign(validationErrors, errors)
      return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
      Object.keys(validationErrors).forEach(key => delete validationErrors[key])
      error.value = null
      
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true

      try {
        const locationData = {
          name: formData.name,
          type: formData.type === 'shelter' ? 'aid_point' : 'association',
          address: formData.address,
          lat: formData.latitude,
          lng: formData.longitude,
          description: `Capacidad: ${formData.capacity} animales\nContacto: ${formData.phone}, ${formData.email}\nNecesidades: ${formData.needs || 'Ninguna especificada'}`,
          contact: `${formData.phone} | ${formData.email}`,
          services: formData.services
        }

        // Realizar la solicitud al servidor
        const response = await fetch('http://localhost:3001/api/locations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(locationData)
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          const errorData = await response.json(); // Obtener detalles del error del cuerpo de la respuesta
          throw new Error(errorData.message || 'Error en la solicitud');
        }

        showSuccess.value = true
        
        Object.keys(formData).forEach(key => formData[key] = '')
        
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } catch (err) {
        error.value = 'Error al registrar la organización. Por favor intenta de nuevo.'
        console.error('Error de registro:', err)
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      formData,
      validationErrors,
      showSuccess,
      error,
      isSubmitting,
      handleSubmit
    }
  }
}
</script>
