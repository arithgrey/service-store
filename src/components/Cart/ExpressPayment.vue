<template>
    <div>
      <div v-if="hasSingleProduct">
        <a v-if="singleProduct.express_payment_link" @click.prevent="handleExpressCheckout"
          class="inline-flex w-full items-center mt-3 cursor-pointer justify-center rounded-md border-2 border-transparent bg-blue-600 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-blue-500">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
          Compra Express
        </a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      displayedCartProducts() {
        return this.$store.getters.getProductsFromCart;
      },
      
      hasSingleProduct() {
        return this.displayedCartProducts.length === 1 && this.displayedCartProducts[0].quantity === 1;
      },
  
      singleProduct() {
        return this.displayedCartProducts[0];
      },
    },
  
    methods: {
      handleExpressCheckout() {
        const expressLink = this.singleProduct.express_payment_link;
        if (typeof fbq === 'function') {
          fbq('track', 'InitiateCheckout');
        }
        if (expressLink) {
          window.location.href = expressLink;
        }
      },
    },
  };
  </script>
  