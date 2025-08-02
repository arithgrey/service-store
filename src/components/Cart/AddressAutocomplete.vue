<template>
  <div class="relative">
    <div class="relative z-0 w-full group">
      <input
        ref="addressInput"
        v-model="addressValue"
        type="text"
        :name="name"
        :id="id"
        :class="inputClass"
        :placeholder="placeholder"
        :required="required"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- Indicador de carga -->
      <div v-if="loading" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <!-- Lista de sugerencias -->
    <div v-if="suggestions.length > 0 && showSuggestions" 
         class="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
      <div v-for="suggestion in suggestions" 
           :key="suggestion.place_id"
           @click="handleSuggestionSelection(suggestion)"
           class="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0">
        <div class="flex items-center">
          <svg class="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ suggestion.description }}</span>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Información de la dirección seleccionada -->
    <div v-if="selectedAddress" class="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <div>
          <p class="text-sm font-medium text-green-800">Dirección confirmada</p>
          <p class="text-sm text-green-700">{{ selectedAddress.formattedAddress }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OpenStreetMapHelper from "@/helpers/OpenStreetMapHelper.js";

export default {
  name: 'AddressAutocomplete',
  mixins: [OpenStreetMapHelper],
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'address'
    },
    id: {
      type: String,
      default: 'address'
    },
    placeholder: {
      type: String,
      default: 'Escribe tu dirección completa'
    },
    required: {
      type: Boolean,
      default: true
    },
    inputClass: {
      type: String,
      default: 'peer input-cart'
    },
    country: {
      type: String,
      default: 'mx'
    }
  },

  data() {
    return {
      addressValue: this.modelValue,
      suggestions: [],
      showSuggestions: false,
      loading: false,
      error: null,
      selectedAddress: null,
      searchTimeout: null,
      isInitialized: false
    };
  },

  watch: {
    modelValue(newValue) {
      this.addressValue = newValue;
    },
    addressValue(newValue) {
      this.$emit('update:modelValue', newValue);
    }
  },

  methods: {
    async handleFocus() {
      // OpenStreetMap no requiere inicialización especial
      this.isInitialized = true;
    },

    async handleInput(event) {
      const query = event.target.value;
      this.addressValue = query;
      
      // Limpiar timeout anterior
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Resetear estado
      this.error = null;
      this.selectedAddress = null;

      // Esperar 300ms antes de buscar
      this.searchTimeout = setTimeout(async () => {
        if (query.length > 2) {
          await this.searchAddresses(query);
        } else {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      }, 300);
    },

    async handleBlur() {
      // Cerrar sugerencias después de un pequeño delay
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },



    async searchAddresses(query) {
      try {
        this.loading = true;
        const suggestions = await this.searchAddressesNominatim(query);
        this.suggestions = suggestions;
        this.showSuggestions = true;
      } catch (error) {
        console.error('Error buscando direcciones:', error);
        this.error = 'Error al buscar direcciones';
        this.suggestions = [];
      } finally {
        this.loading = false;
      }
    },



    async getPlaceDetails(placeId) {
      try {
        return await this.getPlaceDetailsNominatim(placeId);
      } catch (error) {
        console.error('Error obteniendo detalles del lugar:', error);
        throw error;
      }
    },

    // Método para manejar la selección de sugerencia
    async handleSuggestionSelection(suggestion) {
      try {
        this.loading = true;
        
        // Usar directamente los datos de la sugerencia
        this.addressValue = suggestion.formattedAddress;
        this.selectedAddress = suggestion;
        this.suggestions = [];
        this.showSuggestions = false;
        
        // Emitir eventos
        this.$emit('address-selected', suggestion);
        this.$emit('update:modelValue', suggestion.formattedAddress);
        
      } catch (error) {
        console.error('Error seleccionando dirección:', error);
        this.error = 'Error al seleccionar la dirección';
      } finally {
        this.loading = false;
      }
    }
  },

  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.clearSearch();
  }
};
</script> 