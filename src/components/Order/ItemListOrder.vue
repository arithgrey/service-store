<template>
  <div>
    <div v-if="orders && orders.length === 0">
      <p>No se encontraron resultados.</p>
    </div>
    <div v-else>
      <div
        v-for="item in orders"
        :key="item.id"
        @click="selectOrder(item)"
        :class="[
          'shadow-md',
          'w-full',
          'border',
          'cursor-pointer',
          get_order_bg_class(item),
          { 'border-cyan-700': selectedOrder && selectedOrder.id === item.id }
        ]"
      >
        <div class="p-6">
          <h5
            class="block mb-2 text-sm font-semibold leading-snug tracking-normal text-blue-gray-900 text-cyan-700"
          >
            Orden: #{{ item.id }}
          </h5>
          <CartTotal :productsFromCart="item" />

          <div class="flex mt-2 items-end justify-end">
            <p class="block text-sm font-bold">
              {{ get_status_label(item) }}
            </p>
            <span class="mx-2 text-sm text-gray-700">|</span>
            <p class="block text-sm">
              {{ timePassed(item.created_at) }}
            </p>
          </div>
          <div class="flex justify-between items-center mt-3">
            <TypeOfPayment :paymentOnDelivery="item.payment_on_delivery" />
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timePassed } from "@/helpers/time.js";
import CartTotal from "@/components/Order/CartTotal.vue";
import TypeOfPayment from "@/components/Order/TypeOfPayment.vue";
import { get_status_label, get_order_bg_class } from "@/helpers/OrderHelper.js";

export default {
  components: {
    CartTotal,
    TypeOfPayment
  },
  props: {
    orders: {
      type: Array,
      required: true,
    },
    showDetailButton: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    reactiveOrders() {
      return this.orders.slice();
    },
  },
  data() {
    return {
      selectedOrder: null,
    };
  },
  methods: {
    get_status_label,
    get_order_bg_class,
    timePassed,
    selectOrder(order) {
      this.selectedOrder = order;
      this.$emit("selected_order", order);
    },

    navigateToDetail(order) {
      console.log('🔗 Navegando al detalle de la orden:', order.id);
      // Emitir evento para que el componente padre maneje la navegación
      this.$emit("navigate-to-detail", order);
    },
 
  },
};
</script>
