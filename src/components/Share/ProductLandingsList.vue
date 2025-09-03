<template>
  <div v-if="productLandings.length > 0" class="w-full col-span-2">
    <div
      v-for="productLanding in productLandings"
      :key="productLanding.id"
      class="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-bold transition-colors"
    >
    <a
            :href="getLandingUrl(productLanding)"
            >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-900">
            {{ productLanding.template.name }}
          </h4>
          
        </div>
      </div>
    </a>
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
      return `/${baseUrl}?product=${productSlug}&category=${categorySlug}`;
    }
  }
}
</script> 