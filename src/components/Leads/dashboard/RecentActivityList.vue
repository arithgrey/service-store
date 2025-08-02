<template>
  <div class="recent-activity">
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="bg-gray-200 h-16 rounded"></div>
      </div>
    </div>
    
    <div v-else-if="activities.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500">No hay actividad reciente</p>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="flex items-center space-x-3 p-3 bg-white border hover:shadow-md transition-shadow"
      >
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ activity.name }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ activity.email }}
          </p>
          <div class="flex items-center space-x-2 mt-1">
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium" :class="getStatusClass(activity.status)">
              {{ getStatusLabel(activity.status) }}
            </span>
            <span class="text-xs text-gray-400">
              {{ formatTimeAgo(activity.created_at) }}
            </span>
          </div>
        </div>
        <div class="flex-shrink-0 text-right">
          <p class="text-xs text-gray-500">{{ activity.lead_type }}</p>
          <p class="text-xs text-gray-400">Intento {{ activity.tryet }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentActivityList',
  props: {
    activities: {
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
    getStatusClass(status) {
      const classes = {
        'pending': 'bg-yellow-100 text-yellow-800',
        'contacted': 'bg-blue-100 text-blue-800',
        'process': 'bg-purple-100 text-purple-800',
        'converted': 'bg-green-100 text-green-800',
        'discarded': 'bg-red-100 text-red-800'
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    formatTimeAgo(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      
      if (diffInMinutes < 1) {
        return 'Ahora mismo'
      } else if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} min`
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60)
        return `Hace ${hours} h`
      } else {
        const days = Math.floor(diffInMinutes / 1440)
        return `Hace ${days} días`
      }
    }
  }
}
</script> 