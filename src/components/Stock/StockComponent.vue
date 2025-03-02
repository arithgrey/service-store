<template>
    <div class="px-4">
        <ListSelect @warehouse-selected="handleWarehouseChange" />
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="product in primaryProducts" :key="product.id" class="border p-2 border-gray-200 pb-6">
                <div class="flex">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <router-link :to="{
                            name: 'product-detail',
                            params: {
                                categorySlug: product.category.slug,
                                productSlug: product.slug,
                            },
                        }">
                            <img :src="getMainImage(product)" class="h-full w-full object-cover object-center" />
                        </router-link>
                    </div>

                    <div class="ml-4 flex flex-1 flex-col">
                        <div>
                            <div class="flex flex-col text-base font-medium text-gray-900">
                                <h3>
                                    <router-link :to="{
                                        name: 'product-detail',
                                        params: {
                                            categorySlug: product.category.slug,
                                            productSlug: product.slug,
                                        },
                                    }">
                                        {{ product.short_name }}
                                    </router-link>
                                </h3>
                                <StockTotalquantity 
                                    :product-id="product.id" 
                                    class="mt-2"
                                    ref="stockTotal"
                                />
                                <StockManager 
                                    :product-id="product.id" 
                                    :warehouse-id="selectedWarehouse"
                                    @stock-updated="handleStockUpdate"
                                />
                            </div>
                        </div>
                        <div class="mt-2">
                            <p class="text-gray-900">Precio: {{ product.formatted_price }}</p>
                            <p class="text-sm text-gray-600">Costo: {{ product.formatted_cost }}</p>
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                            <p class="text-gray-500">Peso: {{ product.formatted_weight }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StockManager from '@/components/Stock/StockManager.vue';
import StockTotalquantity from '@/components/Stock/StockTotalquantity.vue';
import ListSelect from '@/components/Warehouses/ListSelect.vue';

export default {
    components: {
        StockManager,
        StockTotalquantity,
        ListSelect,
    },
    data() {
        return {
            primaryProducts: [],
            selectedWarehouse: null,
        };
    },
    methods: {
        getMainImage(product) {
            const mainImage = product.images.find((img) => img.is_main);
            return mainImage ? mainImage.get_image_url : "";
        },
        async fetchPrimaryProducts() {
            try {
                const response = await this.$axios.get('enid/productos/primary-products/');
                this.primaryProducts = response.data;
            } catch (error) {
                console.error('Error al obtener productos primarios:', error);
            }
        },
        handleWarehouseChange(newWarehouse) {
            this.selectedWarehouse = newWarehouse;
        },
        handleStockUpdate() {
            const stockTotalRefs = this.$refs.stockTotal;
            if (Array.isArray(stockTotalRefs)) {
                stockTotalRefs.forEach(component => {
                    component.fetchStock();
                });
            }
        },
    },
    mounted() {
        this.fetchPrimaryProducts();
    },
};
</script>