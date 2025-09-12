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
          <ProductConfigIcon :product="product" @open_config_product="handler_open_config_product" />
            
          <!-- Imagen del producto -->
          <div class="flex-shrink-0">
            <router-link
              :to="{
                  name: 'product-detail',
                  params: {
                      categorySlug: product.category.slug,
                      productSlug: product.slug,
                  },
              }"
          >
            <img
              :src="getMainImage(product)"
              :alt="product.name"
              class="w-16 h-16 object-cover rounded-md"
              @error="handleImageError"
            />
            </router-link>
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

                <!-- Badge de conteo de plantillas con enlace -->
                <a
                  v-if="getTemplateCount(product.id) > 0"
                  :href="getLandingUrl(product)"
                  target="_blank"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors cursor-pointer"
                  :title="`${getTemplateCount(product.id)} plantilla(s) de landing - Click para ver`"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ getTemplateCount(product.id) }} Landing{{ getTemplateCount(product.id) !== 1 ? 's' : '' }}
                </a>
              </div>
            </div>

            <p class="text-sm text-gray-600 mt-1">{{ product.specific_name }}</p>
            
            <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span class="font-medium text-green-600">${{ product.price }}</span>
              <span>Categoría: {{ product.category.name }}</span>
              <span>ID: {{ product.id }}</span>
            </div>

            <!-- Acciones -->
            <div class="mt-3 flex flex-wrap gap-2">
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

              <!-- Botón para configurar landings -->
              <button
                @click="openLandingConfig(product)"
                class="inline-flex items-center px-3 py-1 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Configurar Landings
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

    <!-- Modal para configuración de landings -->
    <TransitionRoot as="template" :show="showLandingConfigModal">
      <Dialog as="div" class="relative z-50" @close="closeLandingConfig">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-20 transition-opacity backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div class="flex items-center justify-between mb-4">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      Configuración de Landings - {{ selectedProduct?.name }}
                    </DialogTitle>
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      @click="closeLandingConfig"
                    >
                      <span class="sr-only">Cerrar</span>
                      <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  
                  <!-- Componente ProductLandingConfig reutilizado -->
                  <ProductLandingConfig
                    v-if="selectedProduct"
                    :product="selectedProduct"
                    @landing-added="handleLandingAdded"
                    @landing-removed="handleLandingRemoved"
                    @primary-landing-updated="handlePrimaryLandingUpdated"
                    @template-created="handleTemplateCreated"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>
import ProductConfigIcon from "@/components/Products/ProductConfigIcon.vue";
import ProductLandingConfig from "@/components/Products/ProductLandingConfig.vue";
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

export default {
  name: 'ProductListAdmin',
  components: {
    ProductConfigIcon,
    ProductLandingConfig,
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XMarkIcon
  },
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
      isSearching: false,
      // Estados para el modal de configuración de landings
      showLandingConfigModal: false,
      selectedProduct: null,
      // Estado para almacenar conteos de plantillas por producto
      templateCounts: {},
      // Estado para almacenar las plantillas de cada producto
      productLandings: {}
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
    handler_open_config_product(product) {
      this.$emit("open_config_product", product);
    },

    // Métodos para el modal de configuración de landings
    openLandingConfig(product) {
      this.selectedProduct = product;
      this.showLandingConfigModal = true;
    },

    closeLandingConfig() {
      this.showLandingConfigModal = false;
      this.selectedProduct = null;
    },

    // Método para obtener el conteo de plantillas de un producto
    getTemplateCount(productId) {
      return this.templateCounts[productId] || 0;
    },

    // Método para obtener la URL de landing de un producto (similar a ProductLandingsList)
    getLandingUrl(product) {
      const landings = this.productLandings[product.id] || [];
      if (landings.length === 0) return '#';
      
      // Usar la primera landing disponible
      const productLanding = landings[0];
      const baseUrl = productLanding.template.base_url;
      const productSlug = product.slug || product.id;
      const categorySlug = product.category?.slug || 'default';
      return `/${baseUrl}?product=${productSlug}&category=${categorySlug}`;
    },

    // Método para cargar las plantillas de un producto específico
    async loadProductLandings(productId) {
      try {
        const response = await this.$axios.get(`landings/product-landings/by_product/?product_id=${productId}`);
        this.productLandings[productId] = response.data;
        this.templateCounts[productId] = response.data.length;
      } catch (error) {
        console.error(`Error cargando plantillas para producto ${productId}:`, error);
        this.productLandings[productId] = [];
        this.templateCounts[productId] = 0;
      }
    },

    // Método para cargar plantillas para todos los productos
    async loadAllProductLandings() {
      const promises = this.products.map(product => this.loadProductLandings(product.id));
      await Promise.all(promises);
    },

    // Manejadores de eventos del componente ProductLandingConfig
    handleLandingAdded(productLanding) {
      // Actualizar el conteo local
      const productId = productLanding.product_id;
      this.templateCounts[productId] = (this.templateCounts[productId] || 0) + 1;
      
      // Recargar las plantillas del producto
      this.loadProductLandings(productId);
      
      this.$emit('success', 'Plantilla de landing agregada exitosamente');
    },

    handleLandingRemoved(productLanding) {
      // Actualizar el conteo local
      const productId = productLanding.product_id;
      this.templateCounts[productId] = Math.max(0, (this.templateCounts[productId] || 0) - 1);
      
      // Recargar las plantillas del producto
      this.loadProductLandings(productId);
      
      this.$emit('success', 'Plantilla de landing eliminada exitosamente');
    },

    handlePrimaryLandingUpdated(productLanding) {
      // Recargar las plantillas del producto para actualizar el orden
      this.loadProductLandings(productLanding.product_id);
      this.$emit('success', 'Landing principal actualizada exitosamente');
    },

    handleTemplateCreated(template) {
      this.$emit('success', 'Nueva plantilla creada exitosamente');
    },

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
        
        // Cargar plantillas después de cargar productos
        await this.loadAllProductLandings();
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
        
        // Cargar plantillas para los resultados de búsqueda
        await this.loadAllProductLandings();
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
