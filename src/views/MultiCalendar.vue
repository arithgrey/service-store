<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Calendario de Disponibilidad</h1>
        <p class="mt-2 text-sm text-gray-600">Selecciona las fechas de tu preferencia</p>
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

      <!-- Calendar Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              class="relative h-12 flex items-center justify-center text-sm rounded-lg transition-all"
            >
              <span>{{ day.day }}</span>
              <span v-if="day.price" class="absolute bottom-1 text-xs text-gray-500">
                ${{ day.price }}
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
              class="relative h-12 flex items-center justify-center text-sm rounded-lg transition-all"
            >
              <span>{{ day.day }}</span>
              <span v-if="day.price" class="absolute bottom-1 text-xs text-gray-500">
                ${{ day.price }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Selected Dates Info -->
      <div v-if="selectedDates.length > 0" class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Fechas Seleccionadas</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="(date, index) in selectedDates"
            :key="index"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
          >
            {{ formatDate(date) }}
            <button
              @click="removeDate(date)"
              class="ml-2 hover:text-pink-600"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import moment from 'moment';

// Configurar moment.js en español
moment.locale('es');

// Estado
const currentMonth = ref(moment());
const selectedDates = ref([]);

// Días de la semana
const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Computed
const nextMonthDate = computed(() => {
  return moment(currentMonth.value).add(1, 'month');
});

// Métodos
const formatMonthYear = (date) => {
  return moment(date).format('MMMM YYYY');
};

const formatDate = (date) => {
  return moment(date).format('DD MMM YYYY');
};

const getMonthDays = (monthDate) => {
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
    
    // Simular precios aleatorios para algunas fechas
    const price = isCurrentMonth && !isPast && Math.random() > 0.7 
      ? Math.floor(Math.random() * 2000) + 1000 
      : null;

    days.push({
      date: moment(day),
      day: day.date(),
      isCurrentMonth,
      isPast,
      isToday,
      price,
    });

    day.add(1, 'day');
  }

  return days;
};

const getDayClasses = (day) => {
  const classes = [];

  if (!day.isCurrentMonth) {
    classes.push('text-gray-300 cursor-not-allowed');
  } else if (day.isPast) {
    classes.push('text-gray-400 line-through cursor-not-allowed');
  } else {
    classes.push('text-gray-900 hover:bg-gray-100 cursor-pointer');
  }

  if (day.isToday) {
    classes.push('ring-2 ring-pink-500');
  }

  if (isDateSelected(day.date)) {
    classes.push('bg-pink-500 text-white hover:bg-pink-600');
  }

  return classes.join(' ');
};

const isDateSelected = (date) => {
  return selectedDates.value.some(d => 
    moment(d).isSame(date, 'day')
  );
};

const selectDate = (day) => {
  if (!day.isCurrentMonth || day.isPast) return;

  const dateIndex = selectedDates.value.findIndex(d => 
    moment(d).isSame(day.date, 'day')
  );

  if (dateIndex > -1) {
    selectedDates.value.splice(dateIndex, 1);
  } else {
    selectedDates.value.push(moment(day.date).toDate());
  }
};

const removeDate = (date) => {
  const index = selectedDates.value.findIndex(d => 
    moment(d).isSame(date, 'day')
  );
  if (index > -1) {
    selectedDates.value.splice(index, 1);
  }
};

const previousMonth = () => {
  currentMonth.value = moment(currentMonth.value).subtract(1, 'month');
};

const nextMonth = () => {
  currentMonth.value = moment(currentMonth.value).add(1, 'month');
};

const goToToday = () => {
  currentMonth.value = moment();
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 