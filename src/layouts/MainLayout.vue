<template>
  <div>
    <div class="fixed top-0 left-0 right-0 z-50 bg-white">
      <ShippingAndReturns
        v-if="!isAuthenticated"
        @open_shopping_cart="handleOpenCart"
        @open_seccion_login="handleOpenLogin"
        @open_search_products="handleOpenSearchProducts"
      />
      <AccountMenu
        v-if="isAuthenticated"
        @open_shopping_cart="handleOpenCart"
        @open_seccion_login="handleOpenLogin"
        @open_search_products="handleOpenSearchProducts"
      />
    </div>
    <div class="relative mt-32 mb-8">
      <!-- Contenido de la página aquí -->
      <div class="relative">
        <router-view
          @open_shopping_cart_product_list="handleOpenCartOnViews"
          @open_seccion_login="handleOpenLogin"
          @open_open_config_product="handlerOpenConfigProduct"
        />
      </div>
      <ShoppingCartList ref="shoppingCartList" />
      <LoginForm ref="loginForm" />
      <ProductConfig ref="productConfig" :product="selectedProduct" />
      <SearchFormProduct ref="searchFormProduct" />
      <div class="flex-shrink-0">
        <Footer v-if="display_footer" @open_seccion_login="handleOpenLogin" />
      </div>
    </div>
    <!-- Componente invisible para tracking de analytics -->
    <PageAnalyticsTracker ref="pageAnalyticsTracker" />
  </div>
</template>

<script>
import ShippingAndReturns from "@/components/Banner/ShippingAndReturns.vue";
import AccountMenu from "@/components/Banner/AccountMenu.vue";
import ShoppingCartList from "@/components/Cart/ShoppingCartList.vue";
import LoginForm from "@/components/Login/LoginForm.vue";
import ProductConfig from "@/components/Products/ProductConfig.vue";
import SearchFormProduct from "@/components/Search/ProductsForm.vue";
import Footer from "@/layouts/Footer.vue";
import PageAnalyticsTracker from "@/components/Analytics/PageAnalyticsTracker.vue";

export default {
  components: {
    ShippingAndReturns,
    ShoppingCartList,
    LoginForm,
    Footer,
    SearchFormProduct,
    AccountMenu,
    ProductConfig,
    PageAnalyticsTracker,
  },
  data() {
    return {
      display_footer: true,
      selectedProduct: null,
    };
  },
  methods: {
    handleOpenSearchProducts() {
      this.$refs.searchFormProduct.openSearch();
    },
    handleOpenCart() {
      this.$refs.shoppingCartList.openCart();
    },
    handleOpenCartOnViews() {
      this.$refs.shoppingCartList.openCart();
    },
    handleOpenLogin() {
      this.$refs.loginForm.openForm();
    },
    handlerOpenConfigProduct(product){
      
      this.selectedProduct = product;
      this.$refs.productConfig.openCart();

    },
    redirectToLoginPageIfNecessary(to, from, next) {
      const requiresAuth = to.meta && to.meta.requiresAuth;
      const isAuthenticated = this.$store.getters.isAuthenticated;

      if (requiresAuth && !isAuthenticated) {
        this.$router.push("/");
      } else {
        next();
      }
    },
    trackUserInteraction() {
      // Marcar que el usuario ha interactuado con la página
      sessionStorage.setItem('user_interacted', 'true');
      
      // Trackear eventos importantes para conversión
      document.addEventListener('click', (event) => {
        if (event.target.matches('button, a, [role="button"]')) {
          // Trackear clics en botones
          this.trackEvent('button_click', {
            element: event.target.textContent || event.target.className,
            page: this.$route.name
          });
        }
      });
      
      // Trackear scroll para engagement
      let scrollDepth = 0;
      window.addEventListener('scroll', () => {
        const newScrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (newScrollDepth > scrollDepth && newScrollDepth % 25 === 0) {
          scrollDepth = newScrollDepth;
          this.trackEvent('scroll_depth', { depth: scrollDepth });
        }
      });
    },
    trackEvent(eventName, data = {}) {
      // Enviar evento a analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
      }
      
      // Enviar evento a Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', eventName, data);
      }
      
      console.log('Event tracked:', eventName, data);
    }
  },
  mounted() {
    this.trackUserInteraction();
    
    // Registrar el analytics tracker globalmente
    this.$nextTick(() => {
      const tracker = this.$refs.pageAnalyticsTracker;
      if (tracker) {
        this.$analyticsTracker = tracker;
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.redirectToLoginPageIfNecessary(to, from, next);
    });
  },
  beforeRouteUpdate(to, from, next) {
    next((vm) => {
      vm.redirectToLoginPageIfNecessary(to, from, next);
    });
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  watch: {
    "$store.getters.isAuthenticated"(newValue, oldValue) {
      if (!newValue) {
        this.$router.push("/");
      }
    },
  },
};
</script>
