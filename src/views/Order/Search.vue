<template>
  <div class="container mx-auto px-4 flex flex-col items-center min-h-screen mb-10">
    <div class="mb-5">
      <SearchForm ref="searchForm" :api="api" @list_orders="handlerOrders" />
    </div>
    <div class="border-t w-full mb-5 flex">
      <div class="search-orders w-1/4 mr-4 mt-5 overflow-y-auto max-h-90">
        <ItemListOrder :orders="orders"  @selected_order="handleSelectedOrder"/>
      </div>

      <div class="description-order w-3/4 mt-5 border p-5" ref="descriptionOrder">
        <!-- Loading State para orden específica -->
        <div v-if="loadingOrder" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p class="mt-2 text-gray-600">Cargando orden...</p>
        </div>
        
        <!-- Detalle de orden -->
        <DetailOrder v-else :order="selectedOrder"/>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from "@/components/Order/SearchForm.vue";
import DetailOrder from  "@/components/Order/DetailOrder.vue";
import ItemListOrder from "@/components/Order/ItemListOrder.vue";
import {timePassed}  from "@/helpers/time.js";

export default {
  components: {
    SearchForm,
    DetailOrder,
    ItemListOrder
  },
  data() {
    return {
      orders: null,
      selectedOrder: null,
      api:'enid/order-search/',
      loadingOrder: false,
    };
  },
  methods: {
    timePassed,
    handlerOrders(orders) {      
            
      this.orders = orders;
    },   
    handleSelectedOrder(order) {      
      this.selectedOrder = order;
      this.$refs.descriptionOrder.scrollIntoView({ behavior: 'smooth' });

    },    
    callSubmitForm() {
      
      this.$refs.searchForm.submitForm();
    },

    async loadOrderById(orderId) {
      this.loadingOrder = true;
      try {
        console.log('🔍 Cargando orden por ID:', orderId);
        
        // Buscar la orden específica usando la API de order-search
        const response = await this.$axios.get(`${this.api}?q=${orderId}`);
        console.log('📦 Respuesta de orden por ID:', response.data);
        
        if (response.data && response.data.length > 0) {
          // Si encontramos la orden, la seleccionamos automáticamente
          this.selectedOrder = response.data[0];
          this.orders = response.data;
          console.log('✅ Orden cargada y seleccionada:', this.selectedOrder);
          
          // Scroll al detalle
          this.$nextTick(() => {
            if (this.$refs.descriptionOrder) {
              this.$refs.descriptionOrder.scrollIntoView({ behavior: 'smooth' });
            }
          });
        } else {
          console.log('❌ No se encontró la orden con ID:', orderId);
          this.selectedOrder = null;
          this.orders = [];
        }
      } catch (error) {
        console.error('❌ Error cargando orden por ID:', error);
        this.selectedOrder = null;
        this.orders = [];
      } finally {
        this.loadingOrder = false;
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          console.log('🔄 ID de orden cambió en la ruta:', newId);
          this.loadOrderById(newId);
        } else if (!newId && oldId) {
          // Si se removió el ID, volver a la búsqueda normal
          console.log('🔄 Volviendo a búsqueda normal');
          this.selectedOrder = null;
          this.callSubmitForm();
        }
      },
      immediate: false
    }
  },
  
  mounted() {
    // Verificar si hay un ID en la ruta
    const orderId = this.$route.params.id;
    if (orderId) {
      console.log('🎯 ID de orden detectado en la ruta:', orderId);
      this.loadOrderById(orderId);
    } else {
      // Cargar todas las órdenes como antes
      this.callSubmitForm();
    }
  },
  
};
</script>
