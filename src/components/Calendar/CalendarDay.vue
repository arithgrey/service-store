<template>
  <button
    @click="handleClick"
    :disabled="!day.isCurrentMonth"
    :class="dayClasses"
    class="relative h-16 flex flex-col items-center justify-center text-sm rounded-lg transition-all"
  >
    <span class="font-medium">{{ day.day }}</span>
    <CalendarDayDeliveryCount 
      v-if="day.deliveryCount > 0"
      :count="day.deliveryCount"
    />
  </button>
</template>

<script>
import CalendarDayDeliveryCount from './CalendarDayDeliveryCount.vue';

export default {
  name: 'CalendarDay',
  
  components: {
    CalendarDayDeliveryCount
  },
  
  props: {
    day: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  
  emits: ['click'],
  
  computed: {
    dayClasses() {
      const classes = [];

      if (!this.day.isCurrentMonth) {
        classes.push('text-gray-300 cursor-not-allowed');
      } else {
        classes.push('text-gray-900 hover:bg-gray-100 cursor-pointer');
      }

      if (this.day.isToday) {
        classes.push('ring-2 ring-pink-500');
      }

      if (this.day.deliveryCount > 0) {
        classes.push('bg-pink-50 hover:bg-pink-100');
      }

      if (this.isSelected) {
        classes.push('bg-pink-500 text-white hover:bg-pink-600');
      }

      return classes.join(' ');
    }
  },
  
  methods: {
    handleClick() {
      if (!this.day.isCurrentMonth) return;
      this.$emit('click', this.day);
    }
  }
};
</script>
