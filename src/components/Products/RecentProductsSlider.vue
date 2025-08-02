<template>
  <div v-if="hasRecentProducts" class="recent-products-slider">
    <!-- Header compacto -->
    <div class="slider-header mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">
            Vistos Recientemente
          </h3>
        </div>
        
        <button
          v-if="showClearButton"
          @click="handleClearRecent"
          class="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
          title="Limpiar historial"
        >
          Limpiar
        </button>
      </div>
    </div>

    <!-- Slider horizontal -->
    <div class="slider-container relative">
      <!-- Botón anterior -->
      <button
        v-if="canScrollLeft"
        @click="scrollLeft"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:shadow-lg transition-shadow duration-200"
        title="Anterior"
      >
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <!-- Contenedor del slider -->
      <div
        ref="sliderRef"
        class="slider-track flex space-x-4 overflow-x-auto scrollbar-hide"
        @scroll="handleScroll"
      >
        <div
          v-for="(product, index) in displayProducts"
          :key="`${product.id}-${index}`"
          class="slider-item flex-shrink-0"
        >
          <div class="product-card-compact group">
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
              <img
                :src="getProductImage(product)"
                :alt="product.name"
                class="w-32 h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              <!-- Badge de reciente -->
              <div class="absolute top-1 left-1">
                <span class="bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                  Reciente
                </span>
              </div>
            </router-link>

            <!-- Información del producto -->
            <div class="product-info-compact mt-2">
              <h4 class="product-title-compact text-sm font-medium text-gray-900 line-clamp-2">
                {{ product.name }}
              </h4>
              
              <div class="price-compact mt-1">
                <span class="text-sm font-bold text-gray-900">
                  {{ product.formatted_price }}
                </span>
              </div>

              <!-- Botones de acción compactos -->
              <div class="product-actions-compact mt-2 flex space-x-1">
                <router-link
                  :to="{
                    name: 'product-detail',
                    params: {
                      categorySlug: product.category?.slug || 'default',
                      productSlug: product.slug,
                    },
                  }"
                  @click="handleProductClick(product)"
                  class="flex-1 bg-gray-800 text-white text-xs py-1 px-2 rounded hover:bg-gray-700 transition-colors duration-200 text-center"
                >
                  Ver
                </router-link>
                
                <button
                  @click="handleAddToCart(product)"
                  class="flex-1 bg-white border border-gray-800 text-gray-800 text-xs py-1 px-2 rounded hover:bg-gray-100 transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón siguiente -->
      <button
        v-if="canScrollRight"
        @click="scrollRight"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:shadow-lg transition-shadow duration-200"
        title="Siguiente"
      >
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Indicadores de scroll -->
    <div v-if="showScrollIndicators" class="scroll-indicators mt-3 flex justify-center space-x-1">
      <div
        v-for="(indicator, index) in scrollIndicators"
        :key="index"
        :class="[
          'w-2 h-2 rounded-full transition-colors duration-200',
          indicator.active ? 'bg-gray-800' : 'bg-gray-300'
        ]"
      ></div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRecentProducts } from '@/components/RecentProductsHelper';

export default {
  name: 'RecentProductsSlider',
  
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
    },
    // Mostrar indicadores de scroll
    showScrollIndicators: {
      type: Boolean,
      default: true
    },
    // Ancho de cada item
    itemWidth: {
      type: Number,
      default: 160
    }
  },

  emits: [
    'product-clicked',
    'clear-recent',
    'add-to-cart'
  ],

  setup(props, { emit }) {
    const {
      recentProducts,
      initialize,
      getRecentProducts,
      clearRecentProducts,
      updateViewCount
    } = useRecentProducts();

    const sliderRef = ref(null);
    const canScrollLeft = ref(false);
    const canScrollRight = ref(false);
    const scrollIndicators = ref([]);

    // Inicializar al montar el componente
    onMounted(() => {
      initialize();
      nextTick(() => {
        updateScrollButtons();
        createScrollIndicators();
      });
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
      emit('add-to-cart', product);
    };

    const scrollLeft = () => {
      if (sliderRef.value) {
        sliderRef.value.scrollBy({
          left: -props.itemWidth * 2,
          behavior: 'smooth'
        });
      }
    };

    const scrollRight = () => {
      if (sliderRef.value) {
        sliderRef.value.scrollBy({
          left: props.itemWidth * 2,
          behavior: 'smooth'
        });
      }
    };

    const handleScroll = () => {
      updateScrollButtons();
      updateScrollIndicators();
    };

    const updateScrollButtons = () => {
      if (!sliderRef.value) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.value;
      canScrollLeft.value = scrollLeft > 0;
      canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
    };

    const createScrollIndicators = () => {
      if (!sliderRef.value || !props.showScrollIndicators) return;
      
      const { scrollWidth, clientWidth } = sliderRef.value;
      const totalPages = Math.ceil(scrollWidth / clientWidth);
      
      scrollIndicators.value = Array.from({ length: totalPages }, (_, index) => ({
        index,
        active: index === 0
      }));
    };

    const updateScrollIndicators = () => {
      if (!sliderRef.value || !props.showScrollIndicators) return;
      
      const { scrollLeft, clientWidth } = sliderRef.value;
      const currentPage = Math.round(scrollLeft / clientWidth);
      
      scrollIndicators.value.forEach((indicator, index) => {
        indicator.active = index === currentPage;
      });
    };

    return {
      // Refs
      sliderRef,
      canScrollLeft,
      canScrollRight,
      scrollIndicators,
      
      // Computed properties
      hasRecentProducts,
      displayProducts,
      
      // Métodos
      getProductImage,
      handleProductClick,
      handleClearRecent,
      handleAddToCart,
      scrollLeft,
      scrollRight,
      handleScroll
    };
  }
};
</script>

<style scoped>
.recent-products-slider {
  @apply w-full;
}

.slider-container {
  @apply relative px-8;
}

.slider-track {
  @apply pb-4;
  scroll-behavior: smooth;
}

.slider-item {
  @apply w-40;
}

.product-card-compact {
  @apply bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200;
}

.product-title-compact {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-actions-compact {
  @apply flex space-x-1;
}

/* Ocultar scrollbar pero mantener funcionalidad */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .slider-container {
    @apply px-4;
  }
  
  .slider-item {
    @apply w-32;
  }
}

@media (max-width: 480px) {
  .slider-item {
    @apply w-28;
  }
}
</style> 