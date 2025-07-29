<template>
  <div class="product-review">
    <!-- Resumen de calificaciones -->
    <div class="review-summary mb-6">
      <div class="flex items-center">
        <div class="flex items-center">
          <div class="flex text-yellow-400">
            <svg
              v-for="star in 5"
              :key="star"
              :class="[
                'w-5 h-5',
                star <= averageRating ? 'text-yellow-400' : 'text-gray-300'
              ]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>
          <span class="ml-2 text-sm text-gray-600">
            {{ averageRating.toFixed(1) }} ({{ totalReviews }} reseñas)
          </span>
        </div>
      </div>
      
      <!-- Distribución de calificaciones -->
      <div class="mt-4 space-y-2">
        <div
          v-for="rating in 5"
          :key="rating"
          class="flex items-center"
        >
          <span class="text-sm text-gray-600 w-8">{{ rating }}</span>
          <div class="flex-1 mx-2 bg-gray-200 rounded-full h-2">
            <div
              class="bg-yellow-400 h-2 rounded-full"
              :style="{ width: getRatingPercentage(rating) + '%' }"
            ></div>
          </div>
          <span class="text-sm text-gray-600 w-12">
            {{ getRatingCount(rating) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Lista de reviews -->
    <div class="reviews-list">
      <h3 class="text-lg font-semibold mb-4">Reseñas de clientes</h3>
      
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-2 text-gray-600">Cargando reseñas...</p>
      </div>
      
      <div v-else-if="reviews.length === 0" class="text-center py-8">
        <p class="text-gray-600">No hay reseñas aún. ¡Sé el primero en opinar!</p>
      </div>
      
      <div v-else class="space-y-6">
        <div
          v-for="review in paginatedReviews"
          :key="review.id"
          class="border-b border-gray-200 pb-6"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-gray-700">
                  {{ review.user_name ? review.user_name.charAt(0).toUpperCase() : 'A' }}
                </span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  {{ review.user_name || 'Cliente' }}
                </p>
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <svg
                      v-for="star in 5"
                      :key="star"
                      :class="[
                        'w-4 h-4',
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      ]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-500">
                    {{ formatDate(review.created_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="ml-11">
            <h4 class="text-sm font-medium text-gray-900 mb-1">
              {{ review.title }}
            </h4>
            <p class="text-sm text-gray-600">{{ review.comment }}</p>
            
            <!-- Imágenes del review si las hay -->
            <div v-if="review.images && review.images.length > 0" class="mt-3 flex space-x-2">
              <img
                v-for="image in review.images"
                :key="image.id"
                :src="image.url"
                :alt="review.title"
                class="w-16 h-16 object-cover rounded"
                @click="openImageModal(image.url)"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Paginación -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-center">
        <nav class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-md',
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </nav>
      </div>
    </div>

    <!-- Modal para imágenes -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeImageModal"
    >
      <div class="max-w-2xl max-h-full p-4">
        <img
          :src="selectedImage"
          alt="Review image"
          class="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'ProductReview',
  props: {
    productId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      reviews: [],
      loading: true,
      currentPage: 1,
      itemsPerPage: 5,
      showImageModal: false,
      selectedImage: null
    };
  },
  computed: {
    averageRating() {
      if (this.reviews.length === 0) return 0;
      const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      return total / this.reviews.length;
    },
    
    totalReviews() {
      return this.reviews.length;
    },
    
    totalPages() {
      return Math.ceil(this.reviews.length / this.itemsPerPage);
    },
    
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.reviews.slice(start, end);
    },
    
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  
  async mounted() {
    await this.fetchReviews();
  },
  
  methods: {
    async fetchReviews() {
      try {
        this.loading = true;
        const response = await this.$axios.get(`/api/products/${this.productId}/reviews/`);
        this.reviews = response.data.results || [];
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Usar datos de ejemplo si la API no está disponible
        this.reviews = this.getMockReviews();
      } finally {
        this.loading = false;
      }
    },
    
    getMockReviews() {
      return [
        {
          id: 1,
          user_name: 'Carlos M.',
          rating: 5,
          title: 'Excelente producto',
          comment: 'Muy buena calidad, llegó en perfectas condiciones. Recomendado 100%.',
          created_at: '2024-01-15T10:30:00Z',
          images: []
        },
        {
          id: 2,
          user_name: 'Ana L.',
          rating: 4,
          title: 'Buen producto',
          comment: 'Cumple con lo esperado, el envío fue rápido. Lo recomiendo.',
          created_at: '2024-01-10T14:20:00Z',
          images: []
        },
        {
          id: 3,
          user_name: 'Miguel R.',
          rating: 5,
          title: 'Super recomendado',
          comment: 'Excelente calidad y precio. Definitivamente volveré a comprar.',
          created_at: '2024-01-08T09:15:00Z',
          images: []
        }
      ];
    },
    
    getRatingPercentage(rating) {
      const count = this.getRatingCount(rating);
      return this.totalReviews > 0 ? (count / this.totalReviews) * 100 : 0;
    },
    
    getRatingCount(rating) {
      return this.reviews.filter(review => review.rating === rating).length;
    },
    
    formatDate(dateString) {
      return moment(dateString).format('DD/MM/YYYY');
    },
    
    openImageModal(imageUrl) {
      this.selectedImage = imageUrl;
      this.showImageModal = true;
    },
    
    closeImageModal() {
      this.showImageModal = false;
      this.selectedImage = null;
    }
  }
};
</script>

<style scoped>
.product-review {
  max-width: 800px;
  margin: 0 auto;
}

.review-summary {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
}
</style> 