<template>
  <div class="recent-products-usage">
    <h1 class="text-2xl font-bold mb-6">Ejemplos de Uso - Productos Recientes</h1>
    
    <!-- Ejemplo 1: Slider en página de producto -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">1. Slider en Página de Producto</h2>
      <div class="bg-gray-50 p-4 rounded-lg">
        <RecentProductsSlider
          :max-display="6"
          :show-clear-button="true"
          @product-clicked="handleProductClick"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>

    <!-- Ejemplo 2: Grid en página principal -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">2. Grid en Página Principal</h2>
      <div class="bg-gray-50 p-4 rounded-lg">
        <RecentProducts
          :max-display="4"
          :show-stats="true"
          @product-clicked="handleProductClick"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </section>

    <!-- Ejemplo 3: Mini en sidebar -->
    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4">3. Mini en Sidebar</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <h3 class="font-medium mb-2">Contenido Principal</h3>
          <p class="text-sm text-gray-600">
            Aquí iría el contenido principal de la página.
          </p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <RecentProductsMini
            :max-display="5"
            :show-clear-button="true"
            @product-clicked="handleProductClick"
            @add-to-cart="handleAddToCart"
          />
        </div>
      </div>
    </section>

    <!-- Información del sistema -->
    <section class="mt-12 p-6 bg-blue-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-4 text-blue-900">Información del Sistema</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h3 class="font-medium text-blue-800 mb-2">Componentes Disponibles:</h3>
          <ul class="space-y-1 text-blue-700">
            <li>• <code>RecentProducts</code> - Grid principal</li>
            <li>• <code>RecentProductsSlider</code> - Slider horizontal</li>
            <li>• <code>RecentProductsMini</code> - Lista compacta</li>
          </ul>
        </div>
        <div>
          <h3 class="font-medium text-blue-800 mb-2">Características:</h3>
          <ul class="space-y-1 text-blue-700">
            <li>• Persistencia en localStorage</li>
            <li>• Tracking automático de vistas</li>
            <li>• Diseño responsive</li>
            <li>• Integración con carrito</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import RecentProducts from './RecentProducts.vue';
import RecentProductsSlider from './RecentProductsSlider.vue';
import RecentProductsMini from './RecentProductsMini.vue';

export default {
  name: 'RecentProductsUsage',
  
  components: {
    RecentProducts,
    RecentProductsSlider,
    RecentProductsMini
  },
  
  methods: {
    handleProductClick(product) {
      console.log('Producto clickeado:', product);
      // Aquí puedes agregar analytics
    },
    
    handleAddToCart(product) {
      console.log('Producto agregado al carrito:', product);
      // Integrar con el store de Vuex
      this.$store.commit('addToCart', product);
    }
  }
};
</script>

<style scoped>
.recent-products-usage {
  @apply max-w-6xl mx-auto px-4 py-8;
}
</style> 