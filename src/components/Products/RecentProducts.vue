<template>
  <div v-if="hasRecentProducts" class="recent-products-container">
    <!-- Header del componente -->
    <div class="recent-products-header">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Productos Recientemente Vistos
            </h2>
            <p class="text-sm text-gray-500">
              {{ stats.total }} productos vistos recientemente
            </p>
          </div>
        </div>
        
        <!-- Botones de acción -->
        <div class="flex items-center space-x-2">
          <button
            v-if="showClearButton"
            @click="handleClearRecent"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title="Limpiar historial"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Grid de productos -->
    <div class="recent-products-grid">
      <div
        v-for="(product, index) in displayProducts"
        :key="`${product.id}-${index}`"
        class="recent-product-card group"
      >
        <!-- Imagen del producto -->
        <div class="product-image-container">
          <router-link
            :to="{
              name: 'product-detail',
              params: {
                categorySlug: product.category?.slug || 'default',
                productSlug: product.slug,
              },
            }"
            class="block relative overflow-hidden rounded-lg"
            @click="handleProductClick(product)"
          >
            <div class="relative w-full aspect-square overflow-hidden">
              <img
                :src="getProductImage(product)"
                :alt="product.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <!-- Badge de "Reciente" -->
            <div class="absolute top-2 left-2">
              <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Reciente
              </span>
            </div>
            
            <!-- Overlay con información adicional -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Información del producto -->
        <div class="product-info p-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="product-title">
              {{ product.name }}
            </h3>
            
            <!-- Botón para remover de recientes -->
            <button
              @click="handleRemoveProduct(product.id)"
              class="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Remover de recientes"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Precio -->
          <div class="price-container mb-3">
            <span class="text-lg font-bold text-gray-900">
              {{ product.formatted_price }}
            </span>
          </div>

          <!-- Información adicional -->
          <div class="product-meta text-xs text-gray-500 space-y-1">
            <div class="flex items-center space-x-2">
              <span>Visto {{ formatViewCount(product.viewCount) }} veces</span>
            </div>
            <div class="flex items-center space-x-2">
              <span>{{ formatDate(product.viewedAt) }}</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="product-actions mt-4 space-y-2">
            <router-link
              :to="{
                name: 'product-detail',
                params: {
                  categorySlug: product.category?.slug || 'default',
                  productSlug: product.slug,
                },
              }"
              @click="handleProductClick(product)"
              class="block w-full text-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
            >
              Ver Producto
            </router-link>
            
            <button
              @click="handleAddToCart(product)"
              class="w-full bg-white border border-gray-800 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
            >
              Agregar al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con estadísticas -->
    <div v-if="showStats" class="recent-products-footer mt-8 pt-6 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
        <div class="text-center">
          <span class="font-semibold">{{ stats.total }}</span> productos vistos
        </div>
        <div class="text-center">
          <span class="font-semibold">{{ stats.uniqueCategories }}</span> categorías
        </div>
        <div class="text-center">
          <span class="font-semibold">{{ getMostViewedProduct?.name || 'N/A' }}</span> más visto
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRecentProducts } from '@/components/RecentProductsHelper';

export default {
  name: 'RecentProducts',
  
  props: {
    // Número máximo de productos a mostrar
    maxDisplay: {
      type: Number,
      default: 8
    },
    // Mostrar botón de limpiar
    showClearButton: {
      type: Boolean,
      default: true
    },
    // Mostrar estadísticas
    showStats: {
      type: Boolean,
      default: true
    },
    // Layout del grid
    gridCols: {
      type: String,
      default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    }
  },

  emits: [
    'product-clicked',
    'product-removed',
    'clear-recent',
    'add-to-cart',
    'open_shopping_cart_product'
  ],

  setup(props, { emit }) {
    const {
      recentProducts,
      stats,
      initialize,
      getRecentProducts,
      removeProduct,
      clearRecentProducts,
      updateViewCount
    } = useRecentProducts();

    // Inicializar al montar el componente
    onMounted(() => {
      initialize();
    });

    // Computed properties
    const hasRecentProducts = computed(() => {
      return recentProducts.value.length > 0;
    });

    const displayProducts = computed(() => {
      return getRecentProducts(props.maxDisplay);
    });

    const getMostViewedProduct = computed(() => {
      return stats.value.mostViewed[0];
    });

    // Métodos
    const getProductImage = (product) => {
      if (product.images && product.images.length > 0) {
        const mainImage = product.images.find(img => img.is_main);
        return mainImage ? mainImage.get_image_url : product.images[0].get_image_url;
      }
      return 'https://enidservice.com/public/images/04.jpg'; // Imagen por defecto
    };

    const formatViewCount = (count) => {
      if (!count || count === 1) return '1 vez';
      return `${count} veces`;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Hoy';
      if (diffDays === 2) return 'Ayer';
      if (diffDays <= 7) return `Hace ${diffDays - 1} días`;
      
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    };

    const handleProductClick = (product) => {
      updateViewCount(product.id);
      emit('product-clicked', product);
    };

    const handleRemoveProduct = (productId) => {
      removeProduct(productId);
      emit('product-removed', productId);
    };

    const handleClearRecent = () => {
      clearRecentProducts();
      emit('clear-recent');
    };

    const handleAddToCart = (product) => {
      emit('add-to-cart', product);
      emit('open_shopping_cart_product');
    };

    return {
      // Estado reactivo
      recentProducts,
      stats,
      
      // Computed properties
      hasRecentProducts,
      displayProducts,
      getMostViewedProduct,
      
      // Métodos
      getProductImage,
      formatViewCount,
      formatDate,
      handleProductClick,
      handleRemoveProduct,
      handleClearRecent,
      handleAddToCart
    };
  }
};
</script>

<style scoped>
.recent-products-container {
  @apply w-full;
}

.recent-products-grid {
  @apply grid gap-4 md:gap-6;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.recent-product-card {
  @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200;
}

.product-image-container {
  @apply relative;
}

.product-title {
  @apply text-sm font-medium text-gray-900;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price-container {
  @apply flex items-center space-x-2;
}

.product-meta {
  @apply text-xs text-gray-500;
}

.product-actions {
  @apply space-y-2;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .recent-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .recent-products-grid {
    grid-template-columns: 1fr;
  }
}
</style> 