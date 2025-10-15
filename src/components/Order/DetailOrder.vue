<template>
  <div>
    <div class="border-b p-4 border-cyan-700 flex flex-col" v-if="order && order.items">
      <h5 class="block mb-2 text-xl font-bold text-blue-gray-900">
        Orden: #{{ order.id }}
      </h5>
      
      <!-- Información del Cliente -->
      <div class="mb-3">
        <CustomerInfo :userInfo="order.user_info" />
      </div>
      
      <div class="flex items-center justify-between">
        <!-- Componente Steps -->
        <Steps v-if="visibleStatuses.length" :stages="visibleStatuses" :currentStage="currentStage" />

        <!-- Botón para cambiar estado -->
        <OrderStatusButton
          :orderId="order.id"
          :currentStatus="order.status"
          :statusChoices="statusChoices"
          @status-updated="handleStatusUpdated"
        />
      </div>

      <p class="block text-sm text-right">
        {{ timePassed(order.created_at) }}
        <TypeOfPayment :paymentOnDelivery="order.payment_on_delivery" />

      </p>
     
      <p class="text-3xl tracking-tight text-gray-900">
        Total {{ totalPriceQuantity }}
      </p>
      <div class="flex mt-5">
        <ul role="list" class="-my-6 divide-y divide-gray-200 flex-3">
          <div v-for="item_order in order.items" :key="item_order.id" class="flex py-6">
            <ProductItem :item_order="item_order" />
          </div>
        </ul>

        <div class="flex-1 border-l ml-4 p-5">
          <div class="lg:row-span-3 lg:mt-0 space-y-6">
            <!-- Fecha de Entrega -->
            <div>
              <h1 class="font-semibold text-gray-900 mb-3">Fecha de Entrega</h1>
              <DeliveryDateEditor 
                :order="order"
                @delivery-date-updated="handleDeliveryDateUpdated"
              />
            </div>
            
            <!-- Dirección de envío -->
            <div>
              <h1 class="font-semibold text-gray-900">Dirección de envío</h1>
              <AddressDetail :order="order" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timePassed } from "@/helpers/time.js";
import ProductItem from "@/components/Products/ProductItemOrder.vue";
import AddressDetail from "@/components/Address/AddressDetail.vue";
import OrderHelper from "@/components/Products/js/OrderHelper.js";
import TypeOfPayment from "@/components/Order/TypeOfPayment.vue";
import Steps from "@/components/Delivery/Steps.vue";
import OrderStatusButton from "@/components/Order/OrderStatusButton.vue";
import DeliveryDateEditor from "@/components/Order/DeliveryDateEditor.vue";
import CustomerInfo from "@/components/Order/CustomerInfo.vue";

export default {
  components: {
    ProductItem,
    AddressDetail,
    TypeOfPayment,
    Steps,
    OrderStatusButton,
    DeliveryDateEditor,
    CustomerInfo,
  },
  props: {
    order: {
      type: Object,
      required: true,
      default: () => ({ items: [] }),
    },
  },
  data() {
    return {
      visibleStatuses: [],
      currentStage: 0,
      selectedStatus: "",
      statusChoices: [],
    };
  },
  methods: {
    timePassed,
    updateVisibleStatusesAndStage() {
      if (this.order && this.order.visible_statuses_admin) {
        this.visibleStatuses = this.order.visible_statuses_admin;
        this.currentStage = this.visibleStatuses.findIndex(
          (status) => status.key === this.order.status
        );
      }
      if (this.order && this.order.status_choices) {
        this.statusChoices = this.order.status_choices;
      }
      this.selectedStatus = this.order.status;
    },
    handleStatusUpdated(newStatus) {
      this.order.status = newStatus;
      this.updateVisibleStatusesAndStage();
    },
    
    handleDeliveryDateUpdated(newDeliveryDate) {
      console.log('📅 Fecha de entrega actualizada:', newDeliveryDate);
      this.order.delivery_date = newDeliveryDate;
      // Emitir evento para que el componente padre sepa que la orden fue actualizada
      this.$emit('order-updated', this.order);
    },
  },
  computed: {
    totalPriceQuantity() {
      let orderHelper = new OrderHelper(this.order);
      return orderHelper.totalPriceQuantity();
    },
  },
  watch: {
    order: {
      immediate: true,
      handler(newOrder) {
        if (newOrder) {
          this.updateVisibleStatusesAndStage();
        }
      },
    },
  },
};
</script>
