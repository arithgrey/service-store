<template>
  <div class="status-distribution">
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="bg-gray-200 h-16 rounded-lg"></div>
      </div>
    </div>
    
    <div v-else-if="data.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
      <p class="text-sm text-gray-500">Los leads aparecerán aquí cuando se registren</p>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="item in data" 
        :key="item.status"
        class="status-item bg-gray-50 p-4 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
        @click="handleStatusClick(item)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <div class="w-4 h-4 rounded-full shadow-sm" :class="getStatusColor(item.status)"></div>
              <div>
                <p class="font-semibold text-gray-900">{{ getStatusLabel(item.status) }}</p>
                <p class="text-sm text-gray-500">{{ item.count }} leads</p>
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-2xl font-bold text-gray-900">{{ item.percentage }}%</p>
            <div class="flex items-center space-x-2 mt-1">
                      <div class="w-20 h-3 bg-gray-200 overflow-hidden">
          <div 
            class="h-3 transition-all duration-500" 
                  :class="getStatusColor(item.status)"
                  :style="{ width: `${item.percentage}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-500">{{ item.count }}</span>
            </div>
          </div>
        </div>
        
        <!-- Información adicional -->
        <div class="mt-3 pt-3 border-t border-gray-200">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ getStatusDescription(item.status) }}</span>
            <span class="flex items-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Ver detalles</span>
            </span>
          </div>
        </div>
      </div>
      
      <!-- Resumen total -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-900">Total de leads</p>
            <p class="text-2xl font-bold text-blue-900">{{ getTotalLeads() }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-blue-600">Distribución</p>
            <p class="text-lg font-semibold text-blue-900">{{ getActiveStatuses() }} estados</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusDistributionChart',
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
    getStatusLabel(status) {
      const labels = {
        'pending': 'Pendiente',
        'contacted': 'Contactado',
        'process': 'En Proceso',
        'converted': 'Convertido',
        'discarded': 'Descartado'
      }
      return labels[status] || status
    },
    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-500',
        'contacted': 'bg-blue-500',
        'process': 'bg-purple-500',
        'converted': 'bg-green-500',
        'discarded': 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    },
    getStatusDescription(status) {
      const descriptions = {
        'pending': 'Leads que esperan contacto inicial',
        'contacted': 'Leads que han sido contactados',
        'process': 'Leads en proceso de conversión',
        'converted': 'Leads convertidos exitosamente',
        'discarded': 'Leads descartados o no viables'
      }
      return descriptions[status] || 'Sin descripción'
    },
    getTotalLeads() {
      return this.data.reduce((total, item) => total + item.count, 0)
    },
    getActiveStatuses() {
      return this.data.filter(item => item.count > 0).length
    },
    handleStatusClick(item) {
      this.$emit('status-click', item)
    }
  }
}
</script>

<style scoped>
.status-item {
  transition: all 0.3s ease;
}

.status-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-item:active {
  transform: translateX(2px);
}
</style> 