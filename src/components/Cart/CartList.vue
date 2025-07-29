<template>
  <div>
    <div v-if="displayedCartProducts.length === 0" class="text-center py-8">
      <p class="text-gray-500">Tu carrito está vacío</p>
    </div>
    
    <div v-else>
      <!-- Botón para vaciar carrito -->
      <div class="flex justify-end mb-4">
        <button
          @click="clearCart"
          type="button"
          class="text-sm text-grey-600 hover:text-red-800 font-medium flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Vaciar carrito
        </button>
      </div>
      
      <ul role="list" class="-my-6 divide-y divide-gray-200 border-b">
        <li
          v-for="product in displayedCartProducts"
          :key="product.id"
          class="flex py-6"
        >
          <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
            <img
              :src="getMainImage(product)"
              :alt="product.name || 'Producto'"
              class="h-full w-full object-cover object-center"
            />
          </div>

          <div class="ml-4 flex flex-1 flex-col">
            <div>
              <div class="flex justify-between text-base font-medium text-gray-900">
                <h3>
                  <span>{{ product.name || 'Producto sin nombre' }}</span>
                </h3>
                <p class="ml-4">
                  {{ formattedPrice(product.price || 0) }}
                </p>
              </div>
            </div>
            <div class="flex flex-1 items-end justify-between text-sm">
              <p class="text-gray-500">Cant {{ product.quantity || 1 }}</p>
              <div class="flex">
                <button
                  @click="removeFromCart(product)"
                  type="button"
                  class="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quitar
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    getMainImage(product) {
      if (!product.images || !Array.isArray(product.images)) {
        return "https://enidservice.com/public/images/04.jpg"; // Imagen por defecto
      }
      const mainImage = product.images.find((img) => img.is_main);
      return mainImage ? mainImage.get_image_url : "https://enidservice.com/public/images/04.jpg";
    },
    removeFromCart(product) {
      this.$store.commit("removeFromCart", product);
    },
    formattedPrice(price) {
      if (!price || isNaN(price)) return "$0.00";
      return price.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      });
    },
    clearCart() {
      this.$store.commit("clearCart");
    },
  },
  computed: {
    displayedCartProducts() {
      return this.$store.getters.getProductsFromCart;
    },
    totalPriceQuantity() {
      const total = this.displayedCartProducts.reduce((acc, product) => {
        let total_quantity = (product.price || 0) * (product.quantity || 1);
        return acc + total_quantity;
      }, 0);

      return this.formattedPrice(total);
    },
  },
};
</script>
