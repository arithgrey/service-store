<template>
  <div>
    <StockComponent @open_config_product="handler_open_config_product"/>
  </div>
</template>

<script>
import StockComponent from '@/components/Stock/StockComponent.vue'

export default {
  name: 'StockView',
  components: {
    StockComponent
  },
  methods: {
    handler_open_config_product(product) {

      this.$emit("open_open_config_product", product);   


    },
  },
}
</script> 