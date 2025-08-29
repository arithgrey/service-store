<template>
  <div class="space-y-4">
    <!-- Área de drop y selección de imágenes -->
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
      @dragover.prevent
      @drop.prevent="handleDrop"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <div v-if="!images.length" class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="text-sm text-gray-600">
          <span class="font-medium text-blue-600 hover:text-blue-500">
            Sube imágenes
          </span>
          o arrastra y suelta
        </div>
        <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
      </div>

      <!-- Preview de imágenes -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(image, index) in images" :key="index" class="relative group">
          <img 
            :src="image.preview" 
            class="h-24 w-24 object-cover rounded-lg"
            :class="{'border-2 border-blue-500': image.isMain}"
          />
          
          <!-- Overlay con acciones -->
          <div class="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
            <button 
              @click.stop="setMainImage(index)"
              class="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100"
              :title="image.isMain ? 'Imagen principal' : 'Establecer como principal'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button 
              @click.stop="removeImage(index)"
              class="p-1 rounded-full bg-white text-gray-700 hover:bg-gray-100"
              title="Eliminar imagen"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensajes de error -->
    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'ImageUploader',
  data() {
    return {
      images: [],
      error: null
    };
  },
  methods: {
    handleDrop(e) {
      const files = [...e.dataTransfer.files];
      this.processFiles(files);
    },

    handleFileSelect(e) {
      const files = [...e.target.files];
      this.processFiles(files);
    },

    processFiles(files) {
      // Validar archivos
      const validFiles = files.filter(file => {
        const isValid = file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024;
        if (!isValid) {
          this.error = 'Solo se permiten imágenes de hasta 10MB';
        }
        return isValid;
      });

      // Crear previews y preparar para subida
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push({
            file,
            preview: e.target.result,
            isMain: this.images.length === 0 // Primera imagen es la principal
          });
          this.$emit('images-changed', this.getFormData());
        };
        reader.readAsDataURL(file);
      });
    },

    setMainImage(index) {
      this.images = this.images.map((img, i) => ({
        ...img,
        isMain: i === index
      }));
      this.$emit('images-changed', this.getFormData());
    },

    removeImage(index) {
      this.images.splice(index, 1);
      // Si eliminamos la imagen principal, establecer la primera como principal
      if (this.images.length && !this.images.some(img => img.isMain)) {
        this.images[0].isMain = true;
      }
      this.$emit('images-changed', this.getFormData());
    },

    getFormData() {
      const formData = new FormData();
      this.images.forEach((img, index) => {
        formData.append(`image_${index}`, img.file);
        formData.append(`is_main_${index}`, img.isMain);
      });
      return formData;
    },

    reset() {
      this.images = [];
      this.error = null;
    }
  }
};
</script> 