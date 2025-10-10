<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <!-- Month Header -->
    <div class="text-center mb-6">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ formatMonthYear(monthDate) }}
      </h2>
    </div>
    
    <!-- Days Header -->
    <CalendarDaysHeader />

    <!-- Days Grid -->
    <div class="grid grid-cols-7 gap-1">
      <CalendarDay
        v-for="(day, index) in monthDays"
        :key="index"
        :day="day"
        :is-selected="isDateSelected(day)"
        @click="$emit('date-selected', day)"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { getDeliveriesForDate } from '@/helpers/DeliveryStatsHelper';
import CalendarDaysHeader from './CalendarDaysHeader.vue';
import CalendarDay from './CalendarDay.vue';

export default {
  name: 'CalendarMonth',
  
  components: {
    CalendarDaysHeader,
    CalendarDay
  },
  
  props: {
    monthDate: {
      type: Object,
      required: true
    },
    deliveryStats: {
      type: Object,
      required: true,
      default: () => ({})
    },
    selectedDate: {
      type: Object,
      required: false,
      default: null
    }
  },
  
  emits: ['date-selected'],
  
  computed: {
    monthDays() {
      return this.getMonthDays(this.monthDate);
    }
  },
  
  methods: {
    formatMonthYear(date) {
      return moment(date).format('MMMM YYYY');
    },

    getMonthDays(monthDate) {
      const days = [];
      const startOfMonth = moment(monthDate).startOf('month');
      const endOfMonth = moment(monthDate).endOf('month');
      const startDate = moment(startOfMonth).startOf('week');
      const endDate = moment(endOfMonth).endOf('week');

      let day = moment(startDate);

      while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
        const isCurrentMonth = day.isSame(monthDate, 'month');
        const isPast = day.isBefore(moment(), 'day');
        const isToday = day.isSame(moment(), 'day');
        const dateKey = day.format('YYYY-MM-DD');
        const deliveryCount = getDeliveriesForDate(this.deliveryStats, dateKey);

        days.push({
          date: moment(day),
          day: day.date(),
          isCurrentMonth,
          isPast,
          isToday,
          deliveryCount
        });

        day.add(1, 'day');
      }

      return days;
    },

    isDateSelected(day) {
      return this.selectedDate && this.selectedDate.date.isSame(day.date, 'day');
    }
  }
};
</script>
