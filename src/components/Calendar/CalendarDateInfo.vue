<template>
  <div class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Entregas para {{ formatDate(selectedDate.date) }}
    </h3>
    
    <!-- Resumen de cantidad -->
    <div class="bg-pink-50 rounded-lg p-4 mb-6">
      <p class="text-2xl font-bold text-pink-600">
        {{ selectedDate.deliveryCount }} {{ deliveryText }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      <p class="mt-2 text-gray-600">Cargando órdenes...</p>
    </div>

    <!-- Lista de Órdenes -->
    <div v-else-if="orders.length > 0" class="space-y-4">
      <h4 class="text-md font-semibold text-gray-800 mb-3">
        Detalles de Órdenes:
      </h4>
      
      <!-- Reutilizar componente ItemListOrder -->
      <ItemListOrder
        v-for="order in orders"
        :key="order.id"
        :orders="[order]"
        @selected_order="handleOrderClick"
      />
    </div>

    <!-- Sin órdenes -->
    <div v-else class="text-center py-8">
      <p class="text-gray-500">No hay órdenes programadas para esta fecha</p>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import ItemListOrder from '@/components/Order/ItemListOrder.vue';

export default {
  name: 'CalendarDateInfo',
  
  components: {
    ItemListOrder
  },
  
  props: {
    selectedDate: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      orders: [],
      loading: false
    };
  },
  
  computed: {
    deliveryText() {
      return this.selectedDate.deliveryCount === 1 
        ? 'entrega programada' 
        : 'entregas programadas';
    }
  },
  
  watch: {
    selectedDate: {
      immediate: true,
      handler(newDate) {
        if (newDate) {
          this.loadOrdersForDate();
        }
      }
    }
  },
  
  methods: {
    formatDate(date) {
      return moment(date).format('DD [de] MMMM YYYY');
    },

    async loadOrdersForDate() {
      if (!this.selectedDate || !this.selectedDate.date) return;
      
      this.loading = true;
      try {
        const dateString = moment(this.selectedDate.date).format('YYYY-MM-DD');
        console.log('🔍 Cargando órdenes para fecha:', dateString);
        const response = await this.$axios.get(`enid/orden/orders-by-date/?delivery_date=${dateString}`);
        console.log('📦 Respuesta de órdenes:', response.data);
        this.orders = response.data || [];
        console.log('📋 Órdenes asignadas:', this.orders);
        
        // Debug: verificar si las órdenes tienen items
        this.orders.forEach((order, index) => {
          console.log(`🔍 Orden ${index + 1} (ID: ${order.id}):`, {
            hasItems: !!order.items,
            itemsLength: order.items ? order.items.length : 0,
            items: order.items
          });
        });
      } catch (error) {
        console.error('❌ Error cargando órdenes por fecha:', error);
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },

    handleOrderClick(order) {
      // Emitir evento para que el componente padre maneje la navegación
      this.$emit('order-clicked', order);
    }
  }
};
</script>
