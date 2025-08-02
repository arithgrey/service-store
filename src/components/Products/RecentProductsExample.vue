<template>
  <div class="recent-products-example">
    <!-- Ejemplo de uso del componente principal -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Productos Recientemente Vistos
      </h2>
      
      <RecentProducts
        :max-display="8"
        :show-clear-button="true"
        :show-stats="true"
        @product-clicked="handleProductClick"
        @clear-recent="handleClearRecent"
        @add-to-cart="handleAddToCart"
      />
    </section>

    <!-- Ejemplo de uso del slider -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Slider de Productos Recientes
      </h2>
      
      <RecentProductsSlider
        :max-display="10"
        :show-clear-button="true"
        :show-scroll-indicators="true"
        @product-clicked="handleProductClick"
        @clear-recent="handleClearRecent"
        @add-to-cart="handleAddToCart"
      />
    </section>

    <!-- Ejemplo de uso en sidebar -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Sidebar de Productos Recientes
      </h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Contenido principal -->
        <div class="lg:col-span-3">
          <div class="bg-gray-100 p-8 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Contenido Principal</h3>
            <p class="text-gray-600">
              Aquí iría el contenido principal de la página. Los productos recientes
              se mostrarían en el sidebar de la derecha.
            </p>
          </div>
        </div>
        
        <!-- Sidebar con productos recientes -->
        <div class="lg:col-span-1">
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Productos Recientes</h3>
            
            <RecentProductsSlider
              :max-display="5"
              :show-clear-button="false"
              :show-scroll-indicators="false"
              @product-clicked="handleProductClick"
              @add-to-cart="handleAddToCart"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Ejemplo de uso en modal -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Modal de Productos Recientes
      </h2>
      
      <button
        @click="showModal = true"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Abrir Modal de Productos Recientes
      </button>
      
      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showModal = false"
      >
        <div
          class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold">Productos Recientemente Vistos</h3>
            <button
              @click="showModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <RecentProducts
            :max-display="12"
            :show-clear-button="true"
            :show-stats="true"
            @product-clicked="handleProductClick"
            @clear-recent="handleClearRecent"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </section>

    <!-- Ejemplo de uso en página de inicio -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Página de Inicio con Productos Recientes
      </h2>
      
      <div class="space-y-8">
        <!-- Banner principal -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
          <h1 class="text-3xl font-bold mb-4">Bienvenido a Nuestra Tienda</h1>
          <p class="text-lg">Descubre nuestros productos más populares y recientemente vistos.</p>
        </div>
        
        <!-- Productos recientes -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <RecentProducts
            :max-display="6"
            :show-clear-button="true"
            :show-stats="false"
            @product-clicked="handleProductClick"
            @clear-recent="handleClearRecent"
            @add-to-cart="handleAddToCart"
          />
        </div>
        
        <!-- Categorías populares -->
        <div class="bg-gray-50 p-6 rounded-lg">
          <h3 class="text-xl font-semibold mb-4">Categorías Populares</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <span class="text-sm font-medium">Electrónicos</span>
            </div>
            <div class="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium">Ropa</span>
            </div>
            <div class="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <span class="text-sm font-medium">Libros</span>
            </div>
            <div class="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-200">
              <div class="w-12 h-12 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <span class="text-sm font-medium">Hogar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import RecentProducts from '@/components/Products/RecentProducts.vue';
import RecentProductsSlider from '@/components/Products/RecentProductsSlider.vue';

export default {
  name: 'RecentProductsExample',
  
  components: {
    RecentProducts,
    RecentProductsSlider
  },
  
  data() {
    return {
      showModal: false
    };
  },
  
  methods: {
    handleProductClick(product) {
      console.log('Producto clickeado:', product);
      // Aquí puedes agregar lógica adicional como analytics
    },
    
    handleClearRecent() {
      console.log('Historial de productos recientes limpiado');
      // Aquí puedes agregar lógica adicional como notificaciones
    },
    
    handleAddToCart(product) {
      console.log('Producto agregado al carrito:', product);
      // Aquí puedes integrar con el store de Vuex
      this.$store.commit('addToCart', product);
    }
  }
};
</script>

<style scoped>
.recent-products-example {
  @apply max-w-7xl mx-auto px-4 py-8;
}
</style> 