<template>
  <div class="flex items-center justify-between mb-6">
    <!-- Previous Button -->
    <button
      @click="$emit('previous-month')"
      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
    >
      <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Anterior
    </button>

    <!-- Center Controls -->
    <div class="flex items-center space-x-4">
      <button
        @click="$emit('go-to-today')"
        class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
      >
        Hoy
      </button>
    </div>

    <!-- Next Button -->
    <button
      @click="$emit('next-month')"
      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
    >
      Siguiente
      <svg class="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CalendarNavigation',
  
  props: {
    currentMonth: {
      type: Object,
      required: true
    }
  },
  
  emits: ['previous-month', 'next-month', 'go-to-today']
};
</script>
