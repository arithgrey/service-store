<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <CalendarHeader 
        title="Calendario de Entregas"
        subtitle="Visualiza las entregas programadas por día"
      />

      <!-- Navigation Controls -->
      <CalendarNavigation 
        :current-month="currentMonth"
        @previous-month="previousMonth"
        @next-month="nextMonth"
        @go-to-today="goToToday"
      />

      <!-- Loading State -->
      <CalendarLoading v-if="loading" />

      <!-- Calendar Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- First Month -->
        <CalendarMonth 
          :month-date="currentMonth"
          :delivery-stats="deliveryStats"
          :selected-date="selectedDate"
          @date-selected="selectDate"
        />

        <!-- Second Month -->
        <CalendarMonth 
          :month-date="nextMonthDate"
          :delivery-stats="deliveryStats"
          :selected-date="selectedDate"
          @date-selected="selectDate"
        />
      </div>

      <!-- Selected Date Info -->
      <CalendarDateInfo 
        v-if="selectedDate"
        :selected-date="selectedDate"
        @order-clicked="handleOrderClick"
        @navigate-to-detail="handleNavigateToDetail"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { 
  fetchDeliveryStats, 
  getDateRangeForMonth,
  mergeStats 
} from '@/helpers/DeliveryStatsHelper';

import CalendarHeader from './CalendarHeader.vue';
import CalendarNavigation from './CalendarNavigation.vue';
import CalendarLoading from './CalendarLoading.vue';
import CalendarMonth from './CalendarMonth.vue';
import CalendarDateInfo from './CalendarDateInfo.vue';

export default {
  name: 'CalendarContainer',
  
  components: {
    CalendarHeader,
    CalendarNavigation,
    CalendarLoading,
    CalendarMonth,
    CalendarDateInfo
  },
  
  data() {
    return {
      currentMonth: moment(),
      selectedDate: null,
      deliveryStats: {},
      loading: false
    };
  },

  computed: {
    nextMonthDate() {
      return moment(this.currentMonth).add(1, 'month');
    }
  },

  watch: {
    currentMonth() {
      this.loadDeliveryStats();
    }
  },

  mounted() {
    moment.locale('es');
    this.loadDeliveryStats();
  },

  methods: {
    async loadDeliveryStats() {
      this.loading = true;
      try {
        // Obtener estadísticas para ambos meses visibles
        const currentMonthRange = getDateRangeForMonth(this.currentMonth, 0);
        const nextMonthRange = getDateRangeForMonth(this.currentMonth, 1);

        const [currentStats, nextStats] = await Promise.all([
          fetchDeliveryStats(this.$axios, currentMonthRange),
          fetchDeliveryStats(this.$axios, nextMonthRange)
        ]);

        this.deliveryStats = mergeStats(currentStats, nextStats);
      } catch (error) {
        console.error('Error cargando estadísticas de entregas:', error);
        this.deliveryStats = {};
      } finally {
        this.loading = false;
      }
    },

    selectDate(day) {
      if (!day.isCurrentMonth) return;
      this.selectedDate = day;
    },

    previousMonth() {
      this.currentMonth = moment(this.currentMonth).subtract(1, 'month');
    },

    nextMonth() {
      this.currentMonth = moment(this.currentMonth).add(1, 'month');
    },

    goToToday() {
      this.currentMonth = moment();
    },

    handleOrderClick(order) {
      // Navegar al search-orders con ID específico
      this.$router.push({
        name: 'search-orders-with-id',
        params: { id: order.id }
      });
    },

    handleNavigateToDetail(order) {
      // Navegar al detalle completo de la orden
      this.$router.push({
        name: 'search-orders-with-id',
        params: { id: order.id }
      });
    }
  }
};
</script>
