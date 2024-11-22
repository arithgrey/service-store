<template>
  <div class="flex flex-col">
    <!-- Sección de pasos de compra -->
    <div class="">  
      <StepsShop :show_buy="true" />
    </div>

    <div v-if="showAddToCart"
      class="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8 flex-grow">
      <OrderSummary :totalPriceQuantity="totalPriceQuantity" :totalItemsCart="totalItemsCart"
        @open_seccion_login="openSeccionLogin" />

      <div>
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:tc mb-8">
          Pago
        </h2>
        <FormPaymentOnDelivery v-if="!isAuthenticated" />
      </div>
    </div>
  </div>
</template>

<script>
import OrderSummary from "@/components/Order/OrderSummary.vue";
import FormPaymentOnDelivery from "@/components/Cart/FormPaymentOnDelivery.vue";
import StepsShop from "@/components/Trusth/StepsShop.vue";
import CartHelper from "@/components/Products/js/CartOrderHelper.js";
import OAuthHelper from "@/helpers/OAuth.js";

export default {
  components: {
    StepsShop,
    FormPaymentOnDelivery,
    OrderSummary
  },
  data() {
    return {
      oauthHelper: new OAuthHelper(this.$store),
      CartHelper: new CartHelper(this.$store)
    };
  },
  mounted() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout');
    }
  },
  methods: {
    openSeccionLogin() {

      this.$emit("open_seccion_login");
    },
  },
  computed: {
    totalPriceQuantity() {
      return this.CartHelper.getTotalPriceQuantity();
    },
    totalItemsCart() {
      return this.$store.getters.totalItemsInCart;
    },
    showAddToCart() {
      return this.$store.getters.totalItemsInCart > 0;
    },
    isAuthenticated() {
      return this.oauthHelper.isAuthenticated()
    },
  },
};
</script>
