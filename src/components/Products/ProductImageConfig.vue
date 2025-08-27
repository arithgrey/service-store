<!-- ProductImageConfig.vue -->
<template>
  <div class="mt-6">
    <h3 class="text-sm font-medium text-gray-900">Imágenes del producto</h3>
    
    <!-- Lista de imágenes actuales -->
    <div v-if="product.images && product.images.length > 0" class="mt-4 grid grid-cols-2 gap-4">
      <div v-for="(image, index) in product.images" :key="image.id" class="relative group">
        <img 
          :src="getImageUrl(image)" 
          :alt="'Imagen ' + (index + 1)"
          class="h-24 w-24 object-cover rounded-lg"
          :class="{'border-2 border-blue-500': image.is_main}"
        />
        
        <!-- Overlay con acciones -->
        <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <button 
            @click="setMainImage(image.id)"
            class="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100"
            :title="image.is_main ? 'Imagen principal' : 'Establecer como principal'"
          >
            <svg class="w-4 h-4" :class="{'text-blue-500': image.is_main}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button 
            @click="removeImage(image.id)"
            class="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100"
            title="Eliminar imagen"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Indicador de imagen principal -->
        <div v-if="image.is_main" class="absolute top-0 left-0 m-1">
          <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Principal</span>
        </div>
      </div>
    </div>

    <!-- Uploader de nuevas imágenes -->
    <div class="mt-4">
      <ImageUploader
        ref="imageUploader"
        @images-changed="handleImagesChanged"
      />
    </div>

    <!-- Botón para guardar cambios -->
    <div v-if="newImages.length > 0" class="mt-4">
      <button
        @click="uploadNewImages"
        class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :disabled="isUploading"
      >
        <span v-if="isUploading">Subiendo...</span>
        <span v-else>Subir imágenes</span>
      </button>
    </div>
  </div>
</template>

<script>
import ImageUploader from '@/components/Products/ImageUploader.vue';

export default {
  name: 'ProductImageConfig',
  components: {
    ImageUploader
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      newImages: [],
      isUploading: false
    };
  },
  methods: {
    getImageUrl(image) {
      return image.get_image_url || image.url || image.image || '';
    },

    handleImagesChanged(formData) {
      this.newImages = [];
      for (let pair of formData.entries()) {
        const [key, value] = pair;
        if (key.startsWith('image_')) {
          this.newImages.push(value);
        }
      }
    },

    async uploadNewImages() {
      this.isUploading = true;
      try {
        const formData = new FormData();
        this.newImages.forEach((file, index) => {
          formData.append(`image`, file);
        });
        
        formData.append('object_id', this.product.id);
        formData.append('content_type', '12');

        const response = await this.$axios.post(
          'enid/image/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data && !Array.isArray(response.data)) {
          this.product.images.push(response.data);
        } else if (Array.isArray(response.data)) {
          this.product.images = [...this.product.images, ...response.data];
        }

        this.$emit('images-updated', this.product.images);
        this.$refs.imageUploader?.reset();
        this.newImages = [];

      } catch (error) {
        console.error('Error subiendo imágenes:', error);
      } finally {
        this.isUploading = false;
      }
    },

    async setMainImage(imageId) {
      try {
        const response = await this.$axios.patch(
          `enid/image/${imageId}/`,
          { is_main: true }
        );
        
        this.product.images = response.data.images;
        this.$emit('images-updated', response.data.images);

      } catch (error) {
        console.error('Error estableciendo imagen principal:', error);
      }
    },

    async removeImage(imageId) {
      try {
        await this.$axios.delete(
          `enid/image/${imageId}/`
        );
        
        this.product.images = this.product.images.filter(img => img.id !== imageId);
        this.$emit('images-updated', this.product.images);

      } catch (error) {
        console.error('Error eliminando imagen:', error);
      }
    }
  }
};
</script> 