<template>
  <div class="space-y-3">
    <!-- Fecha actual -->
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <p class="text-sm font-medium text-gray-700">Fecha actual de entrega:</p>
        <p class="text-lg font-semibold text-gray-900">
          {{ formatDeliveryDate(order.delivery_date) }}
        </p>
      </div>
      
      <!-- Botón para editar -->
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors shadow-sm"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Cambiar Fecha
      </button>
    </div>

    <!-- Formulario de edición -->
    <div v-if="isEditing" class="p-4 border border-gray-200 rounded-lg bg-white">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Nueva fecha de entrega:</h3>
      
      <div class="space-y-4">
        <!-- Selector de fecha -->
        <div>
          <label for="delivery-date" class="block text-sm font-medium text-gray-700 mb-2">
            Fecha de entrega
          </label>
          <input
            id="delivery-date"
            v-model="newDeliveryDate"
            type="date"
            :min="minDate"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
            :class="{ 'border-red-300': hasDateError }"
          />
          <p v-if="hasDateError" class="mt-1 text-sm text-red-600">
            {{ dateErrorMessage }}
          </p>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelEditing"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            @click="saveDeliveryDate"
            :disabled="isSaving || hasDateError"
            class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <div v-if="isSaving" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isSaving ? 'Guardando...' : 'Guardar Fecha' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccessMessage" class="p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-sm font-medium text-green-800">
          Fecha de entrega actualizada exitosamente
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DeliveryDateEditor',
  
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      isEditing: false,
      newDeliveryDate: '',
      isSaving: false,
      showSuccessMessage: false,
      dateErrorMessage: ''
    };
  },
  
  computed: {
    minDate() {
      // No permitir fechas anteriores a hoy
      return moment().format('YYYY-MM-DD');
    },
    
    hasDateError() {
      if (!this.newDeliveryDate) return false;
      
      const selectedDate = moment(this.newDeliveryDate);
      const today = moment().startOf('day');
      
      if (selectedDate.isBefore(today)) {
        this.dateErrorMessage = 'La fecha no puede ser anterior a hoy';
        return true;
      }
      
      if (selectedDate.isAfter(moment().add(1, 'year'))) {
        this.dateErrorMessage = 'La fecha no puede ser más de un año en el futuro';
        return true;
      }
      
      return false;
    }
  },
  
  methods: {
    formatDeliveryDate(date) {
      if (!date) return 'No especificada';
      return moment(date).format('DD [de] MMMM YYYY');
    },
    
    startEditing() {
      this.isEditing = true;
      this.showSuccessMessage = false;
      // Pre-cargar la fecha actual o la fecha de hoy
      this.newDeliveryDate = this.order.delivery_date 
        ? moment(this.order.delivery_date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD');
    },
    
    cancelEditing() {
      this.isEditing = false;
      this.newDeliveryDate = '';
      this.dateErrorMessage = '';
    },
    
    async saveDeliveryDate() {
      if (this.hasDateError) return;
      
      this.isSaving = true;
      
      try {
        console.log('💾 Guardando nueva fecha de entrega:', this.newDeliveryDate);
        
        // Llamar al endpoint para actualizar la fecha
        const response = await this.$axios.patch(`enid/orden/${this.order.id}/update-delivery-date/`, {
          delivery_date: this.newDeliveryDate + 'T12:00:00Z' // Agregar hora por defecto
        });
        
        console.log('✅ Fecha actualizada exitosamente:', response.data);
        
        // Emitir evento con la nueva fecha
        this.$emit('delivery-date-updated', response.data.order.delivery_date);
        
        // Mostrar mensaje de éxito
        this.showSuccessMessage = true;
        this.isEditing = false;
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
        
      } catch (error) {
        console.error('❌ Error actualizando fecha de entrega:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
        alert('Error al actualizar la fecha de entrega. Por favor, intenta de nuevo.');
      } finally {
        this.isSaving = false;
      }
    }
  }
};
</script>
