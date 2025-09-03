<template>
  <div v-if="productLandings.length > 0" class="w-full col-span-2">
    <div
      v-for="productLanding in productLandings"
      :key="productLanding.id"
      class="border border-gray-200 rounded-lg p-4 mb-4"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-900">
            {{ productLanding.template.name }}
          </h4>
          
        </div>
        <div class="flex items-center space-x-2">
          <a
            :href="getLandingUrl(productLanding)"
            target="_blank"
            class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver Landing
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductLandingsList',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      productLandings: []
    };
  },
  watch: {
    'product.id': {
      handler(newId) {
        if (newId) {
          this.loadProductLandings();
        }
      },
      immediate: true
    }
  },
  methods: {
    async loadProductLandings() {
      try {
        const response = await this.$axios.get(`landings/product-landings/by_product/?product_id=${this.product.id}`);
        this.productLandings = response.data;
      } catch (error) {
        console.error("Error cargando plantillas del producto:", error);
      }
    },
    getLandingUrl(productLanding) {
      const baseUrl = productLanding.template.base_url;
      const productSlug = this.product.slug || this.product.id;
      const categorySlug = this.product.category?.slug || 'default';
      
      // Construir la URL completa con los parámetros del producto
      return `${baseUrl}?product=${productSlug}&category=${categorySlug}`;
    }
  }
}
</script> 