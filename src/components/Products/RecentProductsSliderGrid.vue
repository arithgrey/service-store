<template>
  <div v-if="hasRecentProducts" class="recent-products-slider-grid">
    <!-- Header -->
    <div class="grid-header">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 class="text-xl font-semibold text-gray-900">
              Productos Recientemente Vistos
            </h2>
          </div>
          
          <button
            v-if="showClearButton"
            @click="handleClearRecent"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            title="Limpiar historial"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Grid de productos -->
    <div class="grid-container">
      <div class="grid-content">
        <div
          v-for="(product, index) in displayProducts"
          :key="`${product.id}-${index}`"
          class="grid-item"
        >
          <div class="product-card-grid group">
            <!-- Imagen -->
            <router-link
              :to="{
                name: 'product-detail',
                params: {
                  categorySlug: product.category?.slug || 'default',
                  productSlug: product.slug,
                },
              }"
              class="block relative"
              @click="handleProductClick(product)"
            >
              <div class="relative w-full aspect-square overflow-hidden rounded-lg">
                <img
                  :src="getProductImage(product)"
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <!-- Badge de reciente -->
              <div class="absolute top-2 left-2">
                <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Reciente
                </span>
              </div>
            </router-link>

            <!-- Información del producto -->
            <div class="product-info-grid mt-3">
              <h4 class="product-title-grid">
                {{ product.name }}
              </h4>
              
              <div class="price-grid mt-2">
                <span class="text-lg font-bold text-gray-900">
                  {{ product.formatted_price }}
                </span>
              </div>

              <!-- Botones de acción -->
              <div class="product-actions-grid mt-3 flex space-x-2">
                <router-link
                  :to="{
                    name: 'product-detail',
                    params: {
                      categorySlug: product.category?.slug || 'default',
                      productSlug: product.slug,
                    },
                  }"
                  @click="handleProductClick(product)"
                  class="flex-1 bg-gray-800 text-white text-sm py-2 px-3 rounded hover:bg-gray-700 transition-colors duration-200 text-center"
                >
                  Ver
                </router-link>
                
                <button
                  @click="handleAddToCart(product)"
                  class="flex-1 bg-white border border-gray-800 text-gray-800 text-sm py-2 px-3 rounded hover:bg-gray-100 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRecentProducts } from '@/components/RecentProductsHelper';

export default {
  name: 'RecentProductsSliderGrid',
  
  props: {
    // Número máximo de productos a mostrar
    maxDisplay: {
      type: Number,
      default: 10
    },
    // Mostrar botón de limpiar
    showClearButton: {
      type: Boolean,
      default: true
    }
  },

  emits: [
    'product-clicked',
    'clear-recent',
    'add-to-cart',
    'open_shopping_cart_product'
  ],

  setup(props, { emit }) {
    const {
      recentProducts,
      initialize,
      getRecentProducts,
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

    const handleClearRecent = () => {
      clearRecentProducts();
      emit('clear-recent');
    };

    const handleAddToCart = (product) => {
      console.log('Agregando producto al carrito y abriendo barra lateral:', product.name);
      emit('add-to-cart', product);
      emit('open_shopping_cart_product');
    };

    return {
      // Computed properties
      hasRecentProducts,
      displayProducts,
      
      // Métodos
      getProductImage,
      handleProductClick,
      handleClearRecent,
      handleAddToCart
    };
  }
};
</script>

<style scoped>
.recent-products-slider-grid {
  @apply w-full bg-gray-50 py-8;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
}

.grid-header {
  @apply border-b border-gray-200 pb-4 mb-6;
}

.grid-container {
  @apply w-full;
  padding-left: 0;
  padding-right: 0;
}

.grid-content {
  @apply grid gap-4 md:gap-6 px-4 md:px-6 lg:px-8 xl:px-12;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@media (max-width: 640px) {
  .grid-content {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .grid-content {
    grid-template-columns: 1fr;
  }
}



.grid-item {
  @apply flex-shrink-0;
}

.product-card-grid {
  @apply bg-white rounded-lg p-3 md:p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200;
}

.product-title-grid {
  @apply text-sm font-medium text-gray-900 line-clamp-2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-actions-grid {
  @apply flex space-x-2 mt-3;
}


</style> 