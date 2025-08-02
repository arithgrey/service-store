<template>
  <div class="trends-chart">
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 7" :key="i" class="animate-pulse">
        <div class="bg-gray-200 h-8 rounded"></div>
      </div>
    </div>
    
    <div v-else-if="data.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500">No hay datos disponibles</p>
    </div>
    
    <div v-else class="space-y-2">
      <div 
        v-for="item in data" 
        :key="item.date"
        class="flex items-center justify-between p-3 bg-white rounded-lg border"
      >
        <div class="flex items-center space-x-3">
          <div class="text-sm font-medium text-gray-900">
            {{ formatDate(item.date) }}
          </div>
        </div>
        <div class="flex space-x-4">
          <div class="text-center">
            <p class="text-xs text-gray-500">Nuevos</p>
            <p class="text-lg font-bold text-green-600">{{ item.new_leads }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500">Convertidos</p>
            <p class="text-lg font-bold text-blue-600">{{ item.converted_leads }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TrendsChart',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (date.toDateString() === today.toDateString()) {
        return 'Hoy'
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ayer'
      } else {
        return date.toLocaleDateString('es-ES', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      }
    }
  }
}
</script> 