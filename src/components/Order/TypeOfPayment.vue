<template>
  <div class="flex justify-end items-center space-x-2">
    <div>
      <Truck v-if="paymentOnDelivery" />
      <Check v-else />
    </div>
    <div>
      <p class="font-bold text-sm">
        {{ paymentText }}
      </p>
    </div>
  </div>
</template>

<script>
import Check from "@/components/Icons/Check.vue";
import Truck from "@/components/Icons/Truck.vue";
import { type_of_payment } from "@/helpers/OrderHelper.js";

export default {
  name: "PaymentStatus",
  components: {
    Check,
    Truck,
  },
  props: {
    paymentOnDelivery: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    paymentText() {
      return type_of_payment(this.paymentOnDelivery);
    },
  },
};
</script>
