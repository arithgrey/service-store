<template>
    <ul role="list" class="-my-6 divide-y divide-gray-200 border-b px-4">
        <li v-for="product in primaryProducts" :key="product.id" class="flex py-6">
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
                    <div class="flex justify-between text-base font-medium text-gray-900">
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
        </li>
    </ul>
</template>

<script>

export default {
    data() {
        return {
            primaryProducts: [],
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
    },
    mounted() {
        this.fetchPrimaryProducts();
    },
};
</script>