export default {
  data() {
    return {
      searchTimeout: null,
      suggestions: [],
      loading: false,
      error: null
    }
  },

  methods: {
    // Buscar direcciones usando OpenStreetMap Nominatim
    async searchAddressesNominatim(query) {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}` +
          `&countrycodes=mx` +
          `&format=json` +
          `&limit=5` +
          `&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error('Error en la búsqueda de direcciones');
        }

        const data = await response.json();
        
        // Transformar datos al formato esperado
        const suggestions = data.map(item => ({
          place_id: item.place_id,
          description: item.display_name,
          formattedAddress: item.display_name,
          components: this.extractAddressComponents(item.address),
          geometry: {
            location: {
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }
          }
        }));

        return suggestions;
      } catch (error) {
        console.error('Error buscando direcciones:', error);
        this.error = 'Error al buscar direcciones';
        return [];
      } finally {
        this.loading = false;
      }
    },

    // Extraer componentes de dirección de OpenStreetMap
    extractAddressComponents(address) {
      return {
        street: address.road || address.street || '',
        streetNumber: address.house_number || '',
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        postalCode: address.postcode || '',
        country: address.country || 'México'
      };
    },

    // Obtener detalles completos de una dirección
    async getPlaceDetailsNominatim(placeId) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/lookup?` +
          `place_id=${placeId}` +
          `&format=json` +
          `&addressdetails=1`
        );

        if (!response.ok) {
          throw new Error('Error obteniendo detalles del lugar');
        }

        const data = await response.json();
        
        if (data.length > 0) {
          const place = data[0];
          return {
            formattedAddress: place.display_name,
            placeId: place.place_id,
            geometry: {
              location: {
                lat: parseFloat(place.lat),
                lng: parseFloat(place.lon)
              }
            },
            components: this.extractAddressComponents(place.address)
          };
        }

        return null;
      } catch (error) {
        console.error('Error obteniendo detalles del lugar:', error);
        throw error;
      }
    },

    // Limpiar recursos
    clearSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.suggestions = [];
      this.loading = false;
      this.error = null;
    }
  },

  beforeUnmount() {
    this.clearSearch();
  }
}; 