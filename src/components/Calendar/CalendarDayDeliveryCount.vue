<template>
  <span class="text-xs font-semibold text-pink-600 mt-1">
    {{ count }} {{ deliveryText }}
  </span>
</template>

<script>
export default {
  name: 'CalendarDayDeliveryCount',
  
  props: {
    count: {
      type: Number,
      required: true
    }
  },
  
  computed: {
    deliveryText() {
      return this.count === 1 ? 'entrega' : 'entregas';
    }
  }
};
</script>
