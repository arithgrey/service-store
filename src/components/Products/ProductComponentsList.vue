<template>
  <div v-if="components.length > 0" class="mb-4">
    <h4 class="text-sm text-gray-700 mb-2">Componentes actuales:</h4>
    <ul class="space-y-2">
      <li v-for="component in processedComponents" :key="component.id" 
          class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
        <div class="flex items-center">
          <img :src="getMainImage(component)" class="h-8 w-8 object-cover rounded-sm mr-2" />
          <span class="text-sm text-gray-900">
            {{ component.name }} 
          </span>
        </div>
        <button 
          @click="$emit('remove', component.id)"
          class="text-red-500 hover:text-red-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProductComponentsList',
  props: {
    components: {
      type: Array,
      required: true,
    },
    
  },
  data() {
    return {
      processedComponents: []
    }
  },
  methods: {
    getMainImage(product) {
      const mainImage = product.images?.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : "";
    },
    async fetchComponentDetails() {
      try {
        const promises = this.components.map(async (component) => {
          const componentId = typeof component === 'object' ? component.id : component;
          const response = await this.$axios.get(`enid/productos/${componentId}/`);
          return {
            ...response.data,
            id: componentId
          };
        });
        this.processedComponents = await Promise.all(promises);
      } catch (error) {
        console.error('Error al cargar los detalles de los componentes:', error);
      }
    },
   
  },
  watch: {
    components: {
      immediate: true,
      deep: true,
      handler(newComponents) {
        if (newComponents && newComponents.length > 0) {
          this.fetchComponentDetails();
        } else {
          this.processedComponents = [];
        }
      }
    }
  }
};
</script> 