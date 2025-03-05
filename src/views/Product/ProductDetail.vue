<template>
  <div>
    <ProductDetail @open_shopping_cart_product="handle_open_shoping_cart" @open_config_product="handler_open_config_product"/>    
  </div>
  <div>
    <component :is="current_product_video" />
  </div>
</template>

<script>
import { getSeasonalContent } from "@/helpers/SeasonalHelper.js";
import ProductDetail from "@/components/Products/ProductDetail.vue";
import ProductHalloween from  "@/components/Video/ProductHalloween.vue";
import ProductChristmas from  "@/components/Video/ProductChristmas.vue";
import ProductRunning from  "@/components/Video/ProductRunning.vue";

export default {
  components: {
    ProductDetail,    
    ProductHalloween,
    ProductChristmas,
    ProductRunning
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
  },
};
</script>
