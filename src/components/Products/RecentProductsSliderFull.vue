<template>
  <div v-if="hasRecentProducts" class="recent-products-slider-full">
    <!-- Header compacto -->
    <div class="slider-header-full mb-6">
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

    <!-- Slider horizontal con ancho completo -->
    <div class="slider-container-full relative">
      <!-- Botón anterior -->
      <button
        v-if="canScrollLeft"
        @click="scrollLeft"
        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow duration-200"
        title="Anterior"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <!-- Contenedor del slider con ancho completo -->
      <div
        ref="sliderRef"
        class="slider-track-full overflow-x-auto scrollbar-hide"
        @scroll="handleScroll"
      >
        <div class="slider-content">
          <div
            v-for="(product, index) in displayProducts"
            :key="`${product.id}-${index}`"
            class="slider-item-full"
          >
            <div class="product-card-full group">
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
                  class="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                <!-- Badge de reciente -->
                <div class="absolute top-2 left-2">
                  <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Reciente
                  </span>
                </div>
              </router-link>

              <!-- Información del producto -->
              <div class="product-info-full mt-3">
                <h4 class="product-title-full text-sm font-medium text-gray-900 line-clamp-2">
                  {{ product.name }}
                </h4>
                
                <div class="price-full mt-2">
                  <span class="text-lg font-bold text-gray-900">
                    {{ product.formatted_price }}
                  </span>
                </div>

                <!-- Botones de acción -->
                <div class="product-actions-full mt-3 flex space-x-2">
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

      <!-- Botón siguiente -->
      <button
        v-if="canScrollRight"
        @click="scrollRight"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow duration-200"
        title="Siguiente"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Indicadores de scroll -->
    <div v-if="showScrollIndicators" class="scroll-indicators-full mt-6">
      <div class="container mx-auto px-4">
        <div class="flex justify-center space-x-2">
          <div
            v-for="(indicator, index) in scrollIndicators"
            :key="index"
            :class="[
              'w-3 h-3 rounded-full transition-colors duration-200',
              indicator.active ? 'bg-gray-800' : 'bg-gray-300'
            ]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRecentProducts } from '@/components/RecentProductsHelper';

export default {
  name: 'RecentProductsSliderFull',
  
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
      default: 280
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
      console.log('Agregando producto al carrito y abriendo barra lateral:', product.name);
      emit('add-to-cart', product);
      emit('open_shopping_cart_product');
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
.recent-products-slider-full {
  @apply w-full bg-gray-50 py-8;
  margin: 0;
  padding-left: 0;
  padding-right: 0;
}

.slider-header-full {
  @apply border-b border-gray-200 pb-4;
}

.slider-container-full {
  @apply relative;
  width: 100%;
  max-width: none;
}

.slider-track-full {
  @apply pb-4;
  scroll-behavior: smooth;
  width: 100%;
  overflow-x: auto;
}

.slider-content {
  @apply flex space-x-6 px-4 md:px-8 lg:px-12 xl:px-16;
  min-width: max-content;
}

.slider-item-full {
  @apply flex-shrink-0 w-72 md:w-80 lg:w-96;
}

.product-card-full {
  @apply bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200;
}

.product-title-full {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-actions-full {
  @apply flex space-x-2;
}

.scroll-indicators-full {
  @apply border-t border-gray-200 pt-4;
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
@media (max-width: 768px) {
  .slider-content {
    @apply px-2;
  }
  
  .slider-item-full {
    @apply w-64;
  }
}

@media (max-width: 640px) {
  .slider-content {
    @apply px-1;
  }
  
  .slider-item-full {
    @apply w-56;
  }
}

@media (max-width: 480px) {
  .slider-content {
    @apply px-0;
  }
  
  .slider-item-full {
    @apply w-48;
  }
}

/* Asegurar que el slider use todo el ancho disponible */
@media (min-width: 1024px) {
  .slider-content {
    @apply px-8;
  }
}

@media (min-width: 1280px) {
  .slider-content {
    @apply px-12;
  }
}

@media (min-width: 1536px) {
  .slider-content {
    @apply px-16;
  }
}
</style> 