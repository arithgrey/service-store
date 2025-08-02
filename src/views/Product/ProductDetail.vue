<template>
  <div>
    <ProductDetail @open_shopping_cart_product="handle_open_shoping_cart" @open_config_product="handler_open_config_product"/>    
  </div>
  <div>
    <component :is="current_product_video" />
  </div>
  
  <!-- Productos Recientemente Vistos -->
  <RecentProductsSliderGrid
    :max-display="6"
    :show-clear-button="true"
    @product-clicked="handleProductClick"
    @clear-recent="handleClearRecent"
    @add-to-cart="handleAddToCart"
    @open_shopping_cart_product="handleOpenShoppingCart"
  />
</template>

<script>
import { getSeasonalContent } from "@/helpers/SeasonalHelper.js";
import ProductDetail from "@/components/Products/ProductDetail.vue";
import ProductHalloween from  "@/components/Video/ProductHalloween.vue";
import ProductChristmas from  "@/components/Video/ProductChristmas.vue";
import ProductRunning from  "@/components/Video/ProductRunning.vue";
import RecentProductsSliderGrid from "@/components/Products/RecentProductsSliderGrid.vue";

export default {
  components: {
    ProductDetail,    
    ProductHalloween,
    ProductChristmas,
    ProductRunning,
    RecentProductsSliderGrid
  },
  data() {
    return {
      current_product_video: "ProductRunning",
    };
  },
  mounted() {
    this.updateSeasonalContent();
  },
  methods: {        
    handle_open_shoping_cart(){
      this.$emit("open_shopping_cart_product_list");
    },
    handler_open_config_product(product){
      
      this.$emit("open_open_config_product", product);   
    },
    updateSeasonalContent() {
      const seasonalContent = getSeasonalContent();
      this.current_product_video = seasonalContent.product_offert;
    },
    
    // Métodos para productos recientes
    handleProductClick(product) {
      console.log('Producto clickeado:', product);
      // Aquí puedes agregar analytics
    },
    
    handleClearRecent() {
      console.log('Historial de productos recientes limpiado');
      // Aquí puedes agregar notificaciones
    },
    
    handleAddToCart(product) {
      console.log('Producto agregado al carrito:', product);
      // Integrar con el store de Vuex
      this.$store.commit('addToCart', product);
    },
    
    handleOpenShoppingCart() {
      console.log('Abriendo carrito de compras desde productos recientes');
      this.$emit("open_shopping_cart_product_list");
    }
  },
};
</script>
