<template>
  <div class="type-distribution">
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-200 h-4 rounded"></div>
      </div>
    </div>
    
    <div v-else-if="data.length === 0" class="text-center py-8">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
      </svg>
      <p class="mt-2 text-sm text-gray-500">No hay datos disponibles</p>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="(item, index) in data" 
        :key="item.lead_type"
        class="flex items-center justify-between p-3 bg-white border"
      >
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 rounded-full" :class="getTypeColor(index)"></div>
          <div>
            <p class="font-medium text-gray-900">{{ item.lead_type }}</p>
            <p class="text-sm text-gray-500">{{ item.count }} leads</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold text-gray-900">{{ item.percentage }}%</p>
                  <div class="w-20 h-2 bg-gray-200 mt-1">
          <div 
            class="h-2" 
              :class="getTypeColor(index)"
              :style="{ width: `${item.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TypeDistributionChart',
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
    getTypeColor(index) {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-indigo-500',
        'bg-pink-500'
      ]
      return colors[index % colors.length]
    }
  }
}
</script> 