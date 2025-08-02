export default {
  data() {
    return {
      googleMapsLoaded: false,
      autocomplete: null,
      placesService: null
    }
  },

  methods: {
    // Cargar Google Maps API
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          this.googleMapsLoaded = true;
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          this.googleMapsLoaded = true;
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error('Error cargando Google Maps API'));
        };

        document.head.appendChild(script);
      });
    },

    // Inicializar autocompletado
    async initAutocomplete(inputElement, options = {}) {
      try {
        await this.loadGoogleMapsAPI();
        
        const defaultOptions = {
          componentRestrictions: { country: 'mx' }, // Restringir a México
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry', 'place_id']
        };

        this.autocomplete = new google.maps.places.Autocomplete(
          inputElement, 
          { ...defaultOptions, ...options }
        );

        // Configurar listeners
        this.autocomplete.addListener('place_changed', () => {
          this.handlePlaceChanged();
        });

        return this.autocomplete;
      } catch (error) {
        console.error('Error inicializando autocompletado:', error);
        throw error;
      }
    },

    // Manejar cuando se selecciona una dirección
    handlePlaceChanged() {
      if (!this.autocomplete) return;

      const place = this.autocomplete.getPlace();
      
      if (!place.geometry) {
        console.warn('No se encontró geometría para el lugar seleccionado');
        return;
      }

      // Extraer componentes de la dirección
      const addressComponents = this.extractAddressComponents(place);
      
      // Emitir evento con los datos de la dirección
      this.$emit('address-selected', {
        formattedAddress: place.formatted_address,
        placeId: place.place_id,
        geometry: place.geometry,
        components: addressComponents
      });

      return {
        formattedAddress: place.formatted_address,
        placeId: place.place_id,
        geometry: place.geometry,
        components: addressComponents
      };
    },

    // Extraer componentes de la dirección
    extractAddressComponents(place) {
      const components = {};
      
      if (place.address_components) {
        place.address_components.forEach(component => {
          const types = component.types;
          
          if (types.includes('street_number')) {
            components.streetNumber = component.long_name;
          } else if (types.includes('route')) {
            components.street = component.long_name;
          } else if (types.includes('locality')) {
            components.city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            components.state = component.long_name;
          } else if (types.includes('postal_code')) {
            components.postalCode = component.long_name;
          } else if (types.includes('country')) {
            components.country = component.long_name;
          }
        });
      }

      return components;
    },

    // Limpiar autocompletado
    clearAutocomplete() {
      if (this.autocomplete) {
        google.maps.event.clearInstanceListeners(this.autocomplete);
        this.autocomplete = null;
      }
    },

    // Obtener sugerencias de direcciones
    async getAddressSuggestions(query) {
      try {
        await this.loadGoogleMapsAPI();
        
        const service = new google.maps.places.AutocompleteService();
        
        return new Promise((resolve, reject) => {
          service.getPlacePredictions({
            input: query,
            componentRestrictions: { country: 'mx' },
            types: ['address']
          }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(predictions);
            } else {
              reject(new Error(`Error obteniendo sugerencias: ${status}`));
            }
          });
        });
      } catch (error) {
        console.error('Error obteniendo sugerencias:', error);
        throw error;
      }
    }
  },

  beforeUnmount() {
    this.clearAutocomplete();
  }
}; 