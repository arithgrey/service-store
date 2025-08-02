<template>
  <div class="product-card bg-white shadow-lg hover:shadow-xl transition-all duration-300">
    <div class="relative">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-48 object-cover"
        @click="trackProductView"
      />
      <div class="absolute top-2 right-2">
        <button 
          @click="addToCart"
          class="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
      
      <div class="flex justify-between items-center">
        <span class="text-xl font-bold text-blue-600">${{ product.price }}</span>
        <button 
          @click="trackButtonClick('view_details')"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Ver detalles
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    trackProductView() {
      // Trackear vista de producto
      this.trackProductView(
        this.product.id,
        this.product.name,
        this.product.category
      )
    },
    
    addToCart() {
      // Trackear agregar al carrito
      this.trackAddToCart(
        this.product.id,
        this.product.name,
        1,
        this.product.price
      )
      
      // Aquí iría la lógica real de agregar al carrito
      this.$emit('add-to-cart', this.product)
    },
    
    trackButtonClick(buttonName) {
      this.trackButtonClick(buttonName)
    }
  }
}
</script>

<style scoped>
.product-card {
  border-radius: 8px;
  overflow: hidden;
}
</style> 