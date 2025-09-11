<template>
  <div class="bg-white py-6 px-4">
    <!-- Header con título y buscador -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Lista de Productos</h2>
      
      <!-- Buscador -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar productos..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        @click="filterByVisibility('all')"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
          visibilityFilter === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        Todos ({{ totalProducts }})
      </button>
      <button
        @click="filterByVisibility('public')"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
          visibilityFilter === 'public' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        Públicos ({{ publicProductsCount }})
      </button>
      <button
        @click="filterByVisibility('private')"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition-colors',
          visibilityFilter === 'private' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        Privados ({{ privateProductsCount }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Cargando productos...</p>
    </div>

    <!-- Lista de productos -->
    <div v-else-if="filteredProducts.length > 0" class="space-y-4">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start space-x-4">
          <!-- Imagen del producto -->
          <div class="flex-shrink-0">
            <img
              :src="getMainImage(product)"
              :alt="product.name"
              class="w-16 h-16 object-cover rounded-md"
              @error="handleImageError"
            />
          </div>

          <!-- Información del producto -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 truncate">
                {{ product.name }}
              </h3>
              <div class="flex items-center space-x-2">
                <!-- Badge de visibilidad -->
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    product.es_publico 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.es_publico ? 'Público' : 'Privado' }}
                </span>
                
                <!-- Badge de top seller -->
                <span
                  v-if="product.top_seller"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  Top Seller
                </span>
              </div>
            </div>

            <p class="text-sm text-gray-600 mt-1">{{ product.specific_name }}</p>
            
            <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span class="font-medium text-green-600">${{ product.price }}</span>
              <span>Categoría: {{ product.category.name }}</span>
              <span>ID: {{ product.id }}</span>
            </div>

            <!-- Acciones -->
            <div class="mt-3 flex space-x-2">
              <router-link
                :to="{
                  name: 'product-detail',
                  params: {
                    categorySlug: product.category.slug,
                    productSlug: product.slug,
                  },
                }"
                class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Ver Detalles
              </router-link>
              
              <button
                @click="toggleVisibility(product)"
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium',
                  product.es_publico
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                ]"
              >
                {{ product.es_publico ? 'Hacer Privado' : 'Hacer Público' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 mt-6">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        <span class="text-sm text-gray-700">
          Página {{ currentPage }} de {{ totalPages }}
        </span>
        
        <button
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.709"/>
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay productos disponibles' }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductListAdmin',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: true,
      searchQuery: '',
      visibilityFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      searchTimeout: null,
      isSearching: false
    };
  },
  computed: {
    totalProducts() {
      return this.products.length;
    },
    publicProductsCount() {
      return this.products.filter(p => p.es_publico).length;
    },
    privateProductsCount() {
      return this.products.filter(p => !p.es_publico).length;
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    }
  },
  mounted() {
    this.fetchAllProducts();
  },
  methods: {
    async fetchAllProducts() {
      try {
        this.loading = true;
        const response = await this.$axios.get('enid/productos/');
        
        // Obtener todos los productos paginados
        let allProducts = response.data.results || [];
        
        // Si hay más páginas, obtenerlas
        let nextUrl = response.data.next;
        while (nextUrl) {
          // Extraer solo la parte de la query de la URL
          const url = new URL(nextUrl);
          const queryString = url.search;
          const nextResponse = await this.$axios.get('enid/productos/' + queryString);
          allProducts = [...allProducts, ...nextResponse.data.results];
          nextUrl = nextResponse.data.next;
        }
        
        this.products = allProducts;
        this.applyFilters();
      } catch (error) {
        console.error('Error fetching products:', error);
        this.$emit('error', 'Error al cargar los productos');
      } finally {
        this.loading = false;
      }
    },
    
    async searchProducts(query) {
      try {
        this.loading = true;
        this.isSearching = true;
        
        // Usar el endpoint de búsqueda
        const response = await this.$axios.get(`enid/search/product/${encodeURIComponent(query)}/`);
        
        let searchResults = response.data.results || [];
        
        // Obtener todas las páginas de resultados de búsqueda
        let nextUrl = response.data.next;
        while (nextUrl) {
          const url = new URL(nextUrl);
          const path = url.pathname + url.search;
          const nextResponse = await this.$axios.get(path);
          searchResults = [...searchResults, ...nextResponse.data.results];
          nextUrl = nextResponse.data.next;
        }
        
        this.products = searchResults;
        this.applyFilters();
      } catch (error) {
        console.error('Error searching products:', error);
        // Si falla la búsqueda, hacer búsqueda local
        this.searchLocalProducts(query);
      } finally {
        this.loading = false;
        this.isSearching = false;
      }
    },
    
    searchLocalProducts(query) {
      // Búsqueda local como fallback
      if (!query.trim()) {
        this.fetchAllProducts();
        return;
      }
      
      const lowerQuery = query.toLowerCase();
      this.filteredProducts = this.products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.specific_name.toLowerCase().includes(lowerQuery) ||
        p.category.name.toLowerCase().includes(lowerQuery)
      );
      this.currentPage = 1;
    },
    
    handleSearch() {
      // Debounce para evitar muchas llamadas
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.trim()) {
          // Usar el endpoint de búsqueda
          this.searchProducts(this.searchQuery.trim());
        } else {
          // Si no hay término de búsqueda, cargar todos los productos
          this.fetchAllProducts();
        }
      }, 300);
    },
    
    filterByVisibility(filter) {
      this.visibilityFilter = filter;
      this.applyFilters();
      this.currentPage = 1;
    },
    
    applyFilters() {
      let filtered = [...this.products];
      
      // Filtro por visibilidad
      if (this.visibilityFilter === 'public') {
        filtered = filtered.filter(p => p.es_publico);
      } else if (this.visibilityFilter === 'private') {
        filtered = filtered.filter(p => !p.es_publico);
      }
      
      this.filteredProducts = filtered;
    },
    
    async toggleVisibility(product) {
      try {
        const newVisibility = !product.es_publico;
        await this.$axios.patch(`enid/productos/${product.id}/`, {
          es_publico: newVisibility
        });
        
        // Actualizar el producto localmente
        product.es_publico = newVisibility;
        
        this.$emit('success', `Producto ${newVisibility ? 'público' : 'privado'} actualizado`);
      } catch (error) {
        console.error('Error updating product visibility:', error);
        this.$emit('error', 'Error al actualizar la visibilidad del producto');
      }
    },
    
    getMainImage(product) {
      if (!product.images || product.images.length === 0) {
        return '/images/placeholder-product.jpg';
      }
      
      const mainImage = product.images.find(img => img.is_main);
      return mainImage ? mainImage.get_image_url : product.images[0].get_image_url;
    },
    
    handleImageError(event) {
      event.target.src = '/images/placeholder-product.jpg';
    }
  }
};
</script>
