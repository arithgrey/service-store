<template>
  <div class="mt-4 space-y-3">
    <h3 class="text-sm font-bold text-gray-900 border-b">Componentes del Producto</h3>

    <!-- Lista de componentes actuales -->
    <div v-if="product.primary_components && product.primary_components.length > 0" class="mb-4">
      <h4 class="text-sm text-gray-700 mb-2">Componentes actuales:</h4>
      <ul class="space-y-2">
        <li v-for="component in product.primary_components" :key="component.id" 
            class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <div class="flex items-center">
            <img :src="getMainImage(component)" class="h-8 w-8 object-cover rounded-sm mr-2" />
            <span class="text-sm text-gray-900">{{ component.name }}</span>
          </div>
          <button 
            @click="removeComponent(component.id)"
            class="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </li>
      </ul>
    </div>

    <!-- Buscador de productos -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar productos primarios..."
        class="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        @input="searchProducts"
      />

      <!-- Resultados de búsqueda -->
      <div v-if="searchResults.length > 0" 
           class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
        <ul class="py-1">
          <li v-for="product in searchResults" 
              :key="product.id"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              @click="selectProduct(product)"
          >
            <div class="flex items-center">
              <img :src="getMainImage(product)" class="h-8 w-8 object-cover rounded-sm mr-2" />
              <span class="text-sm text-gray-900">{{ product.specific_name }}</span>
            </div>
            <span v-if="isProductSelected(product.id)" 
                  class="text-xs text-green-600">
              Agregado
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Cantidad para el producto seleccionado -->
    <div v-if="selectedProduct" class="mt-4">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700">
            Cantidad para {{ selectedProduct.specific_name }}
          </label>
          <input
            v-model="quantity"
            type="number"
            min="1"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          @click="addComponent"
          class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Agregar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductComponentsConfig',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedProduct: null,
      quantity: 1,
    };
  },
  methods: {
    getMainImage(product) {
      const mainImage = product.images?.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : "";
    },

    async searchProducts() {
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }

      try {
        const response = await this.$axios.get(`enid/search/product/${this.searchQuery}`);
        this.searchResults = response.data.results.filter(p => p.id !== this.product.id);
      } catch (error) {
        console.error('Error buscando productos:', error);
      }
    },

    selectProduct(product) {
      this.selectedProduct = product;
      this.searchQuery = product.specific_name;
      this.searchResults = [];
    },

    async addComponent() {
      if (!this.selectedProduct || !this.quantity || this.quantity < 1) return;

      try {
        const params = {
          component_id: this.selectedProduct.id,
          quantity: this.quantity
        };
        
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        
        // Actualizar el producto con la respuesta del servidor
        this.product.primary_components.push({
          ...this.selectedProduct,
          quantity: this.quantity
        });

        // Limpiar el formulario
        this.selectedProduct = null;
        this.searchQuery = '';
        this.quantity = 1;
      } catch (error) {
        console.error('Error agregando componente:', error);
      }
    },

    async removeComponent(componentId) {
      try {
        await this.$axios.delete(`enid/productos/${this.product.id}/components/${componentId}/`);
        
        // Actualizar el producto removiendo el componente
        this.product.primary_components = this.product.primary_components.filter(
          comp => comp.id !== componentId
        );
      } catch (error) {
        console.error('Error eliminando componente:', error);
      }
    },

    isProductSelected(productId) {
      return this.product.primary_components.some(comp => comp.id === productId);
    }
  }
};
</script>