<template>
  <div>
    <ProductDetail @open_shopping_cart_product="handle_open_shoping_cart" @open_config_product="handler_open_config_product"/>    
  </div>
  <div>
    <ProductHalloween/>
  </div>
</template>

<script >
import ProductDetail from "@/components/Products/ProductDetail.vue";
import ProductHalloween from  "@/components/Video/ProductHalloween.vue";

export default {
  components: {
    ProductDetail,    
    ProductHalloween
  },
  methods: {        
    handle_open_shoping_cart(){
      
      this.$emit("open_shopping_cart_product_list");
    },
    handler_open_config_product(product){
      
      this.$emit("open_open_config_product", product);   
    }
  },
};
</script>
