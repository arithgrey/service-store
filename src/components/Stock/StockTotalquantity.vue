<template>
    <div class="inline-block">
      <div class="inline-flex items-center w-full justify-between">
        <p class="text-gray-900 text-xl flex items-center gap-2"> 
          <span>Stock total: {{ quantity }}</span>
          <span v-if="isStockBelowMinimum" class="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm">
            Bajo stock
          </span>
        </p>
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
        },
        minStock: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            quantity: 0
        }
    },
    computed: {
        isStockBelowMinimum() {
            return this.quantity <= this.minStock;
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