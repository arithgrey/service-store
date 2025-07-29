<template>
  <button
    @click="toggleWishlist"
    :class="[
      'wishlist-button',
      'p-2 rounded-full transition-all duration-200',
      isInWishlist 
        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    ]"
    :title="isInWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'"
  >
    <svg
      v-if="isInWishlist"
      class="w-5 h-5 fill-current"
      viewBox="0 0 20 20"
    >
      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
    </svg>
    <svg
      v-else
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'WishlistButton',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isInWishlist: false
    };
  },
  mounted() {
    this.checkWishlistStatus();
  },
  methods: {
    checkWishlistStatus() {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      this.isInWishlist = wishlist.some(item => item.id === this.product.id);
    },
    
    toggleWishlist() {
      let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (this.isInWishlist) {
        // Remover de wishlist
        wishlist = wishlist.filter(item => item.id !== this.product.id);
        this.showNotification('Producto removido de favoritos', 'info');
      } else {
        // Agregar a wishlist
        wishlist.push({
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.getMainImage(this.product),
          addedAt: new Date().toISOString()
        });
        this.showNotification('Producto agregado a favoritos', 'success');
        
        // Trackear evento
        this.trackWishlistEvent('add_to_wishlist');
      }
      
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      this.isInWishlist = !this.isInWishlist;
      
      // Emitir evento para el padre
      this.$emit('wishlist-changed', {
        product: this.product,
        action: this.isInWishlist ? 'added' : 'removed'
      });
    },
    
    getMainImage(product) {
      if (!product.images || !Array.isArray(product.images)) {
        return "https://enidservice.com/public/images/04.jpg";
      }
      const mainImage = product.images.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : "https://enidservice.com/public/images/04.jpg";
    },
    
    showNotification(message, type = 'info') {
      // Usar el sistema de notificaciones global si está disponible
      if (this.$notify) {
        this.$notify({
          type: type,
          title: 'Favoritos',
          text: message
        });
      } else {
        // Fallback simple
        console.log(message);
      }
    },
    
    trackWishlistEvent(action) {
      // Trackear con Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          product_id: this.product.id,
          product_name: this.product.name,
          product_price: this.product.price
        });
      }
      
      // Trackear con Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', action, {
          content_name: this.product.name,
          content_ids: [this.product.id],
          content_type: 'product',
          value: this.product.price,
          currency: 'MXN'
        });
      }
    }
  },
  
  watch: {
    product: {
      handler() {
        this.checkWishlistStatus();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.wishlist-button {
  position: relative;
  overflow: hidden;
}

.wishlist-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.wishlist-button:active::before {
  width: 100%;
  height: 100%;
}
</style> 