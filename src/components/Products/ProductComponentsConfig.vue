<template>
  <div class="mt-4 space-y-3">
    <h3 class="text-sm font-bold text-gray-900 border-b">Componentes del Producto</h3>

    <!-- Lista de componentes actuales -->
    <ProductComponentsList 
      v-if="product.primary_components"
      :components="product.primary_components"
      @remove="removeComponent"
    />

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
      <div v-if="searchResults && searchResults.length > 0" 
           class="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
        <ul class="py-1">
          <li v-for="result in searchResults" 
              :key="result.id"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              @click="selectProduct(result)"
          >
            <div class="flex items-center">
              <img :src="getMainImage(result)" class="h-8 w-8 object-cover rounded-sm mr-2" />
              <span class="text-sm text-gray-900">{{ result.specific_name }}</span>
            </div>
            <span v-if="isProductSelected(result.id)" 
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
import ProductComponentsList from '@/components/Products/ProductComponentsList.vue';

export default {
  name: 'ProductComponentsConfig',
  components: {
    ProductComponentsList
  },
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
    async searchProducts() {
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }

      try {
        const response = await this.$axios.get(`enid/search/product/${this.searchQuery}`);
        console.log('Resultados de búsqueda:', response.data.results);
        this.searchResults = response.data.results.filter(p => p.id !== this.product.id);
      } catch (error) {
        console.error('Error buscando productos:', error);
        this.searchResults = [];
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
          kit: this.product.id,
          component: this.selectedProduct.id,
          quantity: this.quantity
        };
        
        const response = await this.$axios.post(`enid/primary-components/components/`, params);
        
        // Actualizar la lista de componentes
        if (response.data) {
          if (!this.product.primary_components) {
            this.product.primary_components = [];
          }
          this.product.primary_components.push({
            ...this.selectedProduct,
            quantity: this.quantity
          });
          
          // Limpiar el formulario
          this.selectedProduct = null;
          this.quantity = 1;
          this.searchQuery = '';
        }
      } catch (error) {
        console.error('Error agregando componente:', error);
      }
    },

    async removeComponent(primaryComponentId) {
      try {
        await this.$axios.delete(`enid/primary-components/components/delete_component/`, {
          data: {
            kit: this.product.id,
            component: primaryComponentId
          }
        });
        
        // Actualizar la lista eliminando el componente
        this.product.primary_components = this.product.primary_components.filter(
          comp => comp.id !== primaryComponentId
        );
      } catch (error) {
        console.error('Error al eliminar el componente:', error);
      }
    },

    isProductSelected(productId) {
      return this.product.primary_components.some(comp => comp.id === productId);
    },

    getMainImage(product) {
      if (!product || !product.images) return '';
      const mainImage = product.images.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : '';
    }
  }
};
</script>