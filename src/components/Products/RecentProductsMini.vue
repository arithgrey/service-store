<template>
  <div v-if="hasRecentProducts" class="recent-products-mini">
    <!-- Header compacto -->
    <div class="mini-header mb-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900">
          Vistos Recientemente
        </h3>
        <button
          v-if="showClearButton"
          @click="handleClearRecent"
          class="text-xs text-gray-500 hover:text-gray-700"
          title="Limpiar"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Lista compacta -->
    <div class="mini-list space-y-2">
      <div
        v-for="(product, index) in displayProducts"
        :key="`${product.id}-${index}`"
        class="mini-item group"
      >
        <div class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <!-- Imagen pequeña -->
          <router-link
            :to="{
              name: 'product-detail',
              params: {
                categorySlug: product.category?.slug || 'default',
                productSlug: product.slug,
              },
            }"
            class="flex-shrink-0"
            @click="handleProductClick(product)"
          >
            <img
              :src="getProductImage(product)"
              :alt="product.name"
              class="w-12 h-12 object-cover rounded-md"
              loading="lazy"
            />
          </router-link>

          <!-- Información del producto -->
          <div class="flex-1 min-w-0">
            <router-link
              :to="{
                name: 'product-detail',
                params: {
                  categorySlug: product.category?.slug || 'default',
                  productSlug: product.slug,
                },
              }"
              class="block"
              @click="handleProductClick(product)"
            >
              <h4 class="text-sm font-medium text-gray-900 truncate">
                {{ product.name }}
              </h4>
              <p class="text-xs text-gray-500">
                {{ product.formatted_price }}
              </p>
            </router-link>
          </div>

          <!-- Botones de acción -->
          <div class="flex items-center space-x-1">
            <button
              @click="handleAddToCart(product)"
              class="text-gray-400 hover:text-blue-600 transition-colors duration-200"
              title="Agregar al carrito"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
              </svg>
            </button>
            
            <button
              @click="handleRemoveProduct(product.id)"
              class="text-gray-400 hover:text-red-600 transition-colors duration-200"
              title="Remover"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ver más -->
    <div v-if="showViewMore && hasMoreProducts" class="mt-3">
      <button
        @click="handleViewMore"
        class="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        Ver más productos recientes
      </button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRecentProducts } from '@/components/RecentProductsHelper';

export default {
  name: 'RecentProductsMini',
  
  props: {
    // Número máximo de productos a mostrar
    maxDisplay: {
      type: Number,
      default: 5
    },
    // Mostrar botón de limpiar
    showClearButton: {
      type: Boolean,
      default: true
    },
    // Mostrar botón "ver más"
    showViewMore: {
      type: Boolean,
      default: true
    }
  },

  emits: [
    'product-clicked',
    'product-removed',
    'clear-recent',
    'add-to-cart',
    'view-more'
  ],

  setup(props, { emit }) {
    const {
      recentProducts,
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

    const hasMoreProducts = computed(() => {
      return recentProducts.value.length > props.maxDisplay;
    });

    // Métodos
    const getProductImage = (product) => {
      if (product.images && product.images.length > 0) {
        const mainImage = product.images.find(img => img.is_main);
        return mainImage ? mainImage.get_image_url : product.images[0].get_image_url;
      }
      return 'https://enidservice.com/public/images/04.jpg';
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
    };

    const handleViewMore = () => {
      emit('view-more');
    };

    return {
      // Computed properties
      hasRecentProducts,
      displayProducts,
      hasMoreProducts,
      
      // Métodos
      getProductImage,
      handleProductClick,
      handleRemoveProduct,
      handleClearRecent,
      handleAddToCart,
      handleViewMore
    };
  }
};
</script>

<style scoped>
.recent-products-mini {
  @apply w-full;
}

.mini-header {
  @apply border-b border-gray-200 pb-2;
}

.mini-list {
  @apply max-h-64 overflow-y-auto;
}

.mini-item {
  @apply border-b border-gray-100 last:border-b-0;
}

/* Scrollbar personalizado */
.mini-list::-webkit-scrollbar {
  width: 4px;
}

.mini-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.mini-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.mini-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 