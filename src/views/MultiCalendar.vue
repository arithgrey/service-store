<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Calendario de Entregas</h1>
        <p class="mt-2 text-sm text-gray-600">Visualiza las entregas programadas por día</p>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="previousMonth"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div class="flex items-center space-x-4">
          <button
            @click="goToToday"
            class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
          >
            Hoy
          </button>
        </div>

        <button
          @click="nextMonth"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
        >
          Siguiente
          <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p class="mt-4 text-gray-600">Cargando estadísticas...</p>
      </div>

      <!-- Calendar Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- First Month -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ formatMonthYear(currentMonth) }}
            </h2>
          </div>
          
          <!-- Days Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in daysOfWeek"
              :key="day"
              class="text-center text-xs font-medium text-gray-500 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(day, index) in getMonthDays(currentMonth)"
              :key="index"
              @click="selectDate(day)"
              :disabled="!day.isCurrentMonth"
              :class="getDayClasses(day)"
              class="relative h-16 flex flex-col items-center justify-center text-sm rounded-lg transition-all"
            >
              <span class="font-medium">{{ day.day }}</span>
              <span v-if="day.deliveryCount > 0" class="text-xs font-semibold text-pink-600 mt-1">
                {{ day.deliveryCount }} entregas
              </span>
            </button>
          </div>
        </div>

        <!-- Second Month -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div class="text-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ formatMonthYear(nextMonthDate) }}
            </h2>
          </div>
          
          <!-- Days Header -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in daysOfWeek"
              :key="day"
              class="text-center text-xs font-medium text-gray-500 py-2"
            >
              {{ day }}
            </div>
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(day, index) in getMonthDays(nextMonthDate)"
              :key="index"
              @click="selectDate(day)"
              :disabled="!day.isCurrentMonth"
              :class="getDayClasses(day)"
              class="relative h-16 flex flex-col items-center justify-center text-sm rounded-lg transition-all"
            >
              <span class="font-medium">{{ day.day }}</span>
              <span v-if="day.deliveryCount > 0" class="text-xs font-semibold text-pink-600 mt-1">
                {{ day.deliveryCount }} entregas
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Selected Date Info -->
      <div v-if="selectedDate" class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Entregas para {{ formatDate(selectedDate.date) }}
        </h3>
        <div class="bg-pink-50 rounded-lg p-4">
          <p class="text-2xl font-bold text-pink-600">
            {{ selectedDate.deliveryCount }} entregas programadas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { 
  fetchDeliveryStats, 
  getDeliveriesForDate, 
  getDateRangeForMonth,
  mergeStats 
} from '@/helpers/DeliveryStatsHelper';

export default {
  name: 'MultiCalendar',
  
  data() {
    return {
      currentMonth: moment(),
      selectedDate: null,
      deliveryStats: {},
      loading: false,
      daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
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

    formatMonthYear(date) {
      return moment(date).format('MMMM YYYY');
    },

    formatDate(date) {
      return moment(date).format('DD [de] MMMM YYYY');
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

    getDayClasses(day) {
      const classes = [];

      if (!day.isCurrentMonth) {
        classes.push('text-gray-300 cursor-not-allowed');
      } else {
        classes.push('text-gray-900 hover:bg-gray-100 cursor-pointer');
      }

      if (day.isToday) {
        classes.push('ring-2 ring-pink-500');
      }

      if (day.deliveryCount > 0) {
        classes.push('bg-pink-50 hover:bg-pink-100');
      }

      if (this.selectedDate && this.selectedDate.date.isSame(day.date, 'day')) {
        classes.push('bg-pink-500 text-white hover:bg-pink-600');
      }

      return classes.join(' ');
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
    }
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 