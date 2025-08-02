<template>
  <div class="metric-card bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300" :class="borderColorClass">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div v-if="loading" class="animate-pulse">
          <div class="bg-gray-200 h-4 w-24 rounded mb-2"></div>
          <div class="bg-gray-200 h-8 w-16 rounded mb-2"></div>
          <div class="bg-gray-200 h-3 w-32 rounded"></div>
        </div>
        <div v-else>
          <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
          <p class="text-3xl font-bold text-gray-900 mb-2">{{ formattedValue }}</p>
          <p v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
          
          <!-- Indicador de tendencia -->
          <div v-if="trend" class="flex items-center mt-2">
            <svg 
              :class="trendIconClass" 
              class="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path v-if="trend === 'up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
            </svg>
            <span :class="trendTextClass" class="text-xs font-medium">{{ trendValue }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex-shrink-0 ml-4">
        <div v-if="loading" class="animate-pulse bg-gray-200 h-12 w-12 rounded-full"></div>
        <div v-else class="p-3 rounded-full shadow-lg" :class="iconBgColorClass">
          <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <!-- Users Icon -->
            <path v-if="icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            <!-- User Plus Icon -->
            <path v-else-if="icon === 'user-plus'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            <!-- Calendar Week Icon -->
            <path v-else-if="icon === 'calendar-week'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            <!-- Chart Line Icon -->
            <path v-else-if="icon === 'chart-line'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            <!-- Default Icon -->
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Barra de progreso opcional -->
    <div v-if="showProgress && !loading" class="mt-4">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progreso</span>
        <span>{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="h-2 rounded-full transition-all duration-300" 
          :class="progressColorClass"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    icon: {
      type: String,
      default: 'chart-bar'
    },
    color: {
      type: String,
      default: 'blue',
      validator: value => ['blue', 'green', 'purple', 'orange', 'red', 'yellow'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: ''
    },
    trend: {
      type: String,
      default: '',
      validator: value => ['', 'up', 'down'].includes(value)
    },
    trendValue: {
      type: String,
      default: ''
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    progressPercentage: {
      type: Number,
      default: 0
    }
  },
  computed: {
    formattedValue() {
      if (typeof this.value === 'number') {
        return this.value.toLocaleString()
      }
      return this.value
    },
    borderColorClass() {
      const colors = {
        blue: 'hover:border-blue-200',
        green: 'hover:border-green-200',
        purple: 'hover:border-purple-200',
        orange: 'hover:border-orange-200',
        red: 'hover:border-red-200',
        yellow: 'hover:border-yellow-200'
      }
      return colors[this.color] || colors.blue
    },
    iconBgColorClass() {
      const colors = {
        blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
        green: 'bg-gradient-to-br from-green-500 to-green-600',
        purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
        orange: 'bg-gradient-to-br from-orange-500 to-orange-600',
        red: 'bg-gradient-to-br from-red-500 to-red-600',
        yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
      }
      return colors[this.color] || colors.blue
    },
    trendIconClass() {
      if (this.trend === 'up') {
        return 'text-green-500'
      } else if (this.trend === 'down') {
        return 'text-red-500'
      }
      return 'text-gray-400'
    },
    trendTextClass() {
      if (this.trend === 'up') {
        return 'text-green-600'
      } else if (this.trend === 'down') {
        return 'text-red-600'
      }
      return 'text-gray-500'
    },
    progressColorClass() {
      const colors = {
        blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
        green: 'bg-gradient-to-r from-green-500 to-green-600',
        purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
        orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
        red: 'bg-gradient-to-r from-red-500 to-red-600',
        yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
      }
      return colors[this.color] || colors.blue
    }
  }
}
</script>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--tw-gradient-stops));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover::before {
  opacity: 1;
}

.metric-card:hover {
  transform: translateY(-4px);
}
</style> 