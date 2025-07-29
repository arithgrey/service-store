<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="flex justify-between items-start p-6 border-b">
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h2 class="text-xl font-bold text-gray-900">Comparte este producto</h2>
        <div class="w-6"></div> <!-- Spacer para centrar el título -->
      </div>

      <!-- Product Info -->
      <div class="p-6 border-b">
        <div class="flex items-start space-x-4">
          <img
            :src="getMainImage(product)"
            :alt="product.name"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
            <p class="text-sm text-gray-600">{{ product.category?.name || 'Producto' }}</p>
            <p class="text-lg font-bold text-gray-900">{{ formattedPrice(product.price) }}</p>
            <div class="flex items-center mt-1">
              <div class="flex text-yellow-400">
                <svg v-for="star in 5" :key="star" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="text-sm text-gray-600 ml-2">4.8 (120 reseñas)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Options -->
      <div class="p-6">
        <div class="grid grid-cols-2 gap-4">
          <!-- Copy Link -->
          <button
            @click="copyLink"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm font-medium">Copiar enlace</span>
          </button>

          <!-- WhatsApp -->
          <button
            @click="shareWhatsApp"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span class="text-sm font-medium">WhatsApp</span>
          </button>

          <!-- Facebook -->
          <button
            @click="shareFacebook"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="text-sm font-medium">Facebook</span>
          </button>

          <!-- Twitter -->
          <button
            @click="shareTwitter"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span class="text-sm font-medium">Twitter</span>
          </button>

          <!-- Email -->
          <button
            @click="shareEmail"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="text-sm font-medium">Email</span>
          </button>

          <!-- Messenger -->
          <button
            @click="shareMessenger"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 4.925 0 11c0 3.314 1.688 6.25 4.313 8.125L3.5 24l6.5-3.5c1.5.5 3.125.75 4.875.75 6.627 0 12-4.925 12-11S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10c-1.75 0-3.375-.25-4.875-.75L6 22l1.5-5.875C4.875 14.25 2 12.75 2 11c0-5.514 4.486-10 10-10z"/>
            </svg>
            <span class="text-sm font-medium">Messenger</span>
          </button>

          <!-- Embed -->
          <button
            @click="shareEmbed"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
            </svg>
            <span class="text-sm font-medium">Insertar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductShareModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    
    getMainImage(product) {
      if (!product.images || !Array.isArray(product.images)) {
        return "https://enidservice.com/public/images/04.jpg";
      }
      const mainImage = product.images.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : "https://enidservice.com/public/images/04.jpg";
    },
    
    formattedPrice(price) {
      if (!price || isNaN(price)) return "$0.00";
      return price.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      });
    },
    
    getShareUrl() {
      const baseUrl = window.location.origin;
      const productPath = `/product/${this.product.category?.slug || 'default'}/${this.product.slug || this.product.id}`;
      return `${baseUrl}${productPath}`;
    },
    
    getShareText() {
      return `¡Mira este increíble producto en Enid Store! ${this.product.name} - ${this.formattedPrice(this.product.price)}`;
    },
    
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.getShareUrl());
        this.showNotification('¡Enlace copiado al portapapeles!', 'success');
        this.trackShareEvent('copy_link');
      } catch (error) {
        console.error('Error copying link:', error);
        this.showNotification('Error al copiar el enlace', 'error');
      }
    },
    
    shareWhatsApp() {
      const text = encodeURIComponent(this.getShareText());
      const url = encodeURIComponent(this.getShareUrl());
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
      this.trackShareEvent('whatsapp');
    },
    
    shareFacebook() {
      const url = encodeURIComponent(this.getShareUrl());
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      this.trackShareEvent('facebook');
    },
    
    shareTwitter() {
      const text = encodeURIComponent(this.getShareText());
      const url = encodeURIComponent(this.getShareUrl());
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      this.trackShareEvent('twitter');
    },
    
    shareEmail() {
      const subject = encodeURIComponent(`Producto recomendado: ${this.product.name}`);
      const body = encodeURIComponent(`${this.getShareText()}\n\n${this.getShareUrl()}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      this.trackShareEvent('email');
    },
    
    shareMessenger() {
      const url = encodeURIComponent(this.getShareUrl());
      window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_FB_APP_ID`, '_blank');
      this.trackShareEvent('messenger');
    },
    
    shareEmbed() {
      const embedCode = `<iframe src="${this.getShareUrl()}" width="300" height="400" frameborder="0"></iframe>`;
      navigator.clipboard.writeText(embedCode);
      this.showNotification('Código de inserción copiado', 'success');
      this.trackShareEvent('embed');
    },
    
    showNotification(message, type = 'info') {
      // Usar el sistema de notificaciones global si está disponible
      if (this.$notify) {
        this.$notify({
          type: type,
          title: 'Compartir',
          text: message
        });
      } else {
        console.log(message);
      }
    },
    
    trackShareEvent(platform) {
      // Trackear con Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: platform,
          content_type: 'product',
          item_id: this.product.id
        });
      }
      
      // Trackear con Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Share', {
          content_name: this.product.name,
          content_type: 'product',
          content_ids: [this.product.id],
          value: this.product.price,
          currency: 'MXN'
        });
      }
    }
  }
};
</script> 