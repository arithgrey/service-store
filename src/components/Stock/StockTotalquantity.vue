<template>
    <div class="inline-block">
      <!-- Cantidad disponible -->
      <div class="inline-flex items-center">
        <p class="text-gray-900 text-xl"> Stock total: {{ quantity }}</p>
      </div>
    </div>
</template>

<script>
export default {
    name: 'StockTotalquantity',
    props: {
        productId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            quantity: 0
        }
    },
    watch: {
        productId: {
            immediate: true,
            handler() {
                this.fetchStock();
            },
        },
    },
    methods: {
        async fetchStock() {
            try {
                const params = { 
                    product_id: this.productId
                };
                const response = await this.$axios.get(`/stock/movements/stock-movements/quantity/`, { params });
                this.quantity = response.data.quantity;
            } catch (error) {
                console.error("Error stock products:", error);
            }
        },
    },
};
</script>