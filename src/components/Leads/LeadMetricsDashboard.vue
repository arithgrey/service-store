<template>
  <div class="lead-metrics-dashboard bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-xl p-6 mb-8">
    <!-- Header con estadísticas principales -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Dashboard de Leads</h2>
        <p class="text-gray-600">Métricas en tiempo real de la actividad de leads</p>
      </div>
      <div class="flex space-x-3 mt-4 lg:mt-0">
        <button 
          @click="refreshMetrics" 
          :disabled="loading"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Actualizar</span>
        </button>
        <div class="px-4 py-3 bg-green-100 text-green-800 rounded-lg flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium">En vivo</span>
        </div>
      </div>
    </div>

    <!-- KPIs Principales con diseño mejorado -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard 
        title="Total de Leads" 
        :value="overview.total_leads" 
        icon="users"
        color="blue"
        :loading="loading"
        subtitle="Todos los leads registrados"
      />
      <MetricCard 
        title="Nuevos Hoy" 
        :value="overview.new_leads_today" 
        icon="user-plus"
        color="green"
        :loading="loading"
        subtitle="Leads creados hoy"
      />
      <MetricCard 
        title="Esta Semana" 
        :value="overview.new_leads_week" 
        icon="calendar-week"
        color="purple"
        :loading="loading"
        subtitle="Leads de los últimos 7 días"
      />
      <MetricCard 
        title="Tasa de Conversión" 
        :value="`${overview.conversion_rate}%`" 
        icon="chart-line"
        color="orange"
        :loading="loading"
        subtitle="Porcentaje de conversión"
      />
    </div>

    <!-- Gráficos y Métricas Detalladas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Distribución por Estado -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Distribución por Estado</h3>
          <div class="text-sm text-gray-500">{{ getTotalStatusCount() }} leads</div>
        </div>
        <StatusDistributionChart 
          :data="statusMetrics" 
          :loading="loading"
        />
      </div>

      <!-- Distribución por Tipo -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Distribución por Tipo</h3>
          <div class="text-sm text-gray-500">{{ getTotalTypeCount() }} tipos</div>
        </div>
        <TypeDistributionChart 
          :data="typeMetrics" 
          :loading="loading"
        />
      </div>
    </div>

    <!-- Tendencias y Actividad Reciente -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Tendencias -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Tendencias (Últimos 7 días)</h3>
          <div class="flex space-x-2">
            <span class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Nuevos</span>
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Convertidos</span>
          </div>
        </div>
        <TrendsChart 
          :data="trends" 
          :loading="loading"
        />
      </div>

      <!-- Actividad Reciente -->
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Actividad Reciente</h3>
          <button @click="loadMoreActivity" class="text-sm text-blue-600 hover:text-blue-800">
            Ver más
          </button>
        </div>
        <RecentActivityList 
          :activities="recentActivity" 
          :loading="loading"
        />
      </div>
    </div>

    <!-- Funnel de Conversión -->
    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-800">Funnel de Conversión</h3>
        <div class="text-sm text-gray-500">
          Eficiencia: {{ getConversionEfficiency() }}%
        </div>
      </div>
      <ConversionFunnel 
        :funnel-data="conversionFunnel" 
        :loading="loading"
      />
    </div>

    <!-- Footer con información adicional -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div class="flex items-center space-x-4">
          <span>Última actualización: {{ lastUpdateTime }}</span>
          <span>•</span>
          <span>{{ getDataQuality() }}</span>
        </div>
        <div class="flex items-center space-x-4 mt-2 md:mt-0">
          <span class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Datos actualizados</span>
          </span>
          <span>•</span>
          <span>{{ getPerformanceMetrics() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MetricCard from './dashboard/MetricCard.vue'
import StatusDistributionChart from './dashboard/StatusDistributionChart.vue'
import TypeDistributionChart from './dashboard/TypeDistributionChart.vue'
import TrendsChart from './dashboard/TrendsChart.vue'
import RecentActivityList from './dashboard/RecentActivityList.vue'
import ConversionFunnel from './dashboard/ConversionFunnel.vue'

export default {
  name: 'LeadMetricsDashboard',
  components: {
    MetricCard,
    StatusDistributionChart,
    TypeDistributionChart,
    TrendsChart,
    RecentActivityList,
    ConversionFunnel
  },
  data() {
    return {
      loading: false,
      lastUpdateTime: '',
      overview: {
        total_leads: 0,
        new_leads_today: 0,
        new_leads_week: 0,
        new_leads_month: 0,
        conversion_rate: 0
      },
      statusMetrics: [],
      typeMetrics: [],
      trends: [],
      recentActivity: [],
      conversionFunnel: {
        total_leads: 0,
        pending_leads: 0,
        contacted_leads: 0,
        process_leads: 0,
        converted_leads: 0,
        discarded_leads: 0,
        pending_percentage: 0,
        contacted_percentage: 0,
        process_percentage: 0,
        converted_percentage: 0,
        discarded_percentage: 0
      }
    }
  },
  methods: {
    async loadMetrics() {
      this.loading = true
      try {
        // Cargar todas las métricas en paralelo con las rutas correctas del reverse proxy
        const [
          overviewResponse,
          statusResponse,
          typeResponse,
          trendsResponse,
          activityResponse,
          funnelResponse
        ] = await Promise.all([
          this.$axios.get('/lead/lead-metrics/overview/'),
          this.$axios.get('/lead/lead-metrics/by-status/'),
          this.$axios.get('/lead/lead-metrics/by-type/'),
          this.$axios.get('/lead/lead-metrics/trends/?days=7'),
          this.$axios.get('/lead/lead-metrics/recent-activity/?limit=5'),
          this.$axios.get('/lead/lead-metrics/conversion-funnel/')
        ])

        this.overview = overviewResponse.data
        this.statusMetrics = statusResponse.data
        this.typeMetrics = typeResponse.data
        this.trends = trendsResponse.data
        this.recentActivity = activityResponse.data
        this.conversionFunnel = funnelResponse.data

        this.lastUpdateTime = new Date().toLocaleTimeString('es-ES')
        this.$emit('metrics-loaded', this.overview)

      } catch (error) {
        console.error('Error cargando métricas:', error)
        this.$emit('error', 'Error al cargar las métricas de leads')
      } finally {
        this.loading = false
      }
    },
    refreshMetrics() {
      this.loadMetrics()
    },
    loadMoreActivity() {
      // Implementar carga de más actividad
      this.$emit('load-more-activity')
    },
    getTotalStatusCount() {
      return this.statusMetrics.reduce((total, item) => total + item.count, 0)
    },
    getTotalTypeCount() {
      return this.typeMetrics.length
    },
    getConversionEfficiency() {
      if (this.conversionFunnel.total_leads === 0) return 0
      const efficiency = (this.conversionFunnel.converted_leads / this.conversionFunnel.total_leads) * 100
      return Math.round(efficiency * 100) / 100
    },
    getDataQuality() {
      const totalLeads = this.overview.total_leads
      if (totalLeads === 0) return 'Sin datos'
      if (totalLeads < 10) return 'Datos limitados'
      if (totalLeads < 50) return 'Datos moderados'
      return 'Datos completos'
    },
    getPerformanceMetrics() {
      const conversionRate = this.overview.conversion_rate
      if (conversionRate >= 20) return 'Excelente conversión'
      if (conversionRate >= 10) return 'Buena conversión'
      if (conversionRate >= 5) return 'Conversión moderada'
      return 'Conversión baja'
    }
  },
  mounted() {
    this.loadMetrics()
    // Auto-refresh cada 5 minutos
    setInterval(() => {
      this.loadMetrics()
    }, 5 * 60 * 1000)
  }
}
</script>

<style scoped>
.lead-metrics-dashboard {
  min-height: 400px;
  backdrop-filter: blur(10px);
}

/* Animaciones suaves */
.lead-metrics-dashboard * {
  transition: all 0.3s ease;
}

/* Efecto hover en las tarjetas */
.lead-metrics-dashboard .bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style> 