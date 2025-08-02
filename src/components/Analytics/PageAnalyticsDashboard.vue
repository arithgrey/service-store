<template>
  <div class="page-analytics-dashboard bg-gradient-to-br from-purple-50 to-indigo-100 shadow-xl p-6 mb-8">
    <!-- Header con estadísticas principales -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Analytics de Páginas</h2>
        <p class="text-gray-600">Métricas en tiempo real del comportamiento de usuarios</p>
      </div>
      <div class="flex space-x-3 mt-4 lg:mt-0">
        <button 
          @click="refreshMetrics" 
          :disabled="loading"
          class="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
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
        <div class="px-4 py-3 bg-green-100 text-green-800 flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium">En vivo</span>
        </div>
      </div>
    </div>

    <!-- KPIs Principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard 
        title="Vistas de Página" 
        :value="summary.total_page_views" 
        icon="eye"
        color="purple"
        :loading="loading"
        subtitle="Total de páginas vistas"
      />
      <MetricCard 
        title="Visitantes Únicos" 
        :value="summary.unique_visitors" 
        icon="users"
        color="blue"
        :loading="loading"
        subtitle="Usuarios únicos"
      />
      <MetricCard 
        title="Tiempo Promedio" 
        :value="`${summary.avg_session_duration}s`" 
        icon="clock"
        color="green"
        :loading="loading"
        subtitle="Tiempo en página"
      />
      <MetricCard 
        title="Tasa de Rebote" 
        :value="`${summary.bounce_rate}%`" 
        icon="trending-down"
        color="red"
        :loading="loading"
        subtitle="Usuarios que salen"
      />
    </div>

    <!-- Gráficos y Métricas Detalladas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Secciones Más Visitadas -->
      <div class="bg-white p-6 shadow-lg">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Secciones Más Visitadas</h3>
        <div class="space-y-3">
          <div v-for="section in summary.top_sections" :key="section.section" class="flex justify-between items-center p-3 bg-gray-50">
            <div class="flex-1">
              <p class="font-medium text-gray-800 capitalize">{{ formatSectionName(section.section) }}</p>
              <p class="text-sm text-gray-500">{{ section.views }} vistas</p>
            </div>
            <div class="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                class="bg-purple-500 h-full transition-all duration-300"
                :style="{ width: `${(section.views / summary.total_page_views) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Distribución por Dispositivo -->
      <div class="bg-white p-6 shadow-lg">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Dispositivos</h3>
        <div class="space-y-3">
          <div v-for="(count, device) in summary.device_distribution" :key="device" class="flex justify-between items-center p-3 bg-gray-50">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span class="font-medium text-gray-800 capitalize">{{ device }}</span>
            </div>
            <span class="text-lg font-semibold text-gray-800">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Eventos de Ecommerce -->
    <div class="bg-white p-6 shadow-lg mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Eventos de Ecommerce</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-blue-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-blue-600">{{ summary.ecommerce_events?.product_views || 0 }}</div>
          <div class="text-sm text-blue-600">Vistas de Producto</div>
        </div>
        <div class="p-4 bg-green-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-600">{{ summary.ecommerce_events?.add_to_cart || 0 }}</div>
          <div class="text-sm text-green-600">Agregados al Carrito</div>
        </div>
        <div class="p-4 bg-yellow-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ summary.ecommerce_events?.begin_checkout || 0 }}</div>
          <div class="text-sm text-yellow-600">Inicios de Checkout</div>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg text-center">
          <div class="text-2xl font-bold text-purple-600">{{ summary.ecommerce_events?.purchases || 0 }}</div>
          <div class="text-sm text-purple-600">Compras Completadas</div>
        </div>
      </div>
    </div>

    <!-- Tendencias -->
    <div class="bg-white p-6 shadow-lg mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Tendencias (Últimos 7 días)</h3>
      <div class="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div v-for="trend in trends" :key="trend.date" class="text-center p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 mb-2">{{ formatDate(trend.date) }}</p>
          <p class="text-lg font-semibold text-gray-800">{{ trend.page_views }}</p>
          <p class="text-xs text-gray-500">vistas</p>
        </div>
      </div>
    </div>

    <!-- Páginas Más Visitadas -->
    <div class="bg-white p-6 shadow-lg">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Páginas Más Visitadas</h3>
      <div class="space-y-3">
        <div v-for="page in summary.top_pages" :key="page.page_url" class="flex justify-between items-center p-3 bg-gray-50">
          <div class="flex-1">
            <p class="font-medium text-gray-800 truncate">{{ formatPageUrl(page.page_url) }}</p>
            <p class="text-sm text-gray-500">{{ page.views }} vistas</p>
          </div>
          <div class="w-16 bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              class="bg-blue-500 h-full transition-all duration-300"
              :style="{ width: `${(page.views / summary.total_page_views) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer con información adicional -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-600">
        <div>
          <p>Última actualización: {{ lastUpdateTime }}</p>
          <p>Calidad de datos: {{ getDataQuality() }}</p>
        </div>
        <div class="mt-4 md:mt-0">
          <p>Rendimiento: {{ getPerformanceMetrics() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MetricCard from '@/components/Leads/dashboard/MetricCard.vue'

export default {
  name: 'PageAnalyticsDashboard',
  components: {
    MetricCard
  },
  data() {
    return {
      loading: false,
      lastUpdateTime: '',
      summary: {
        total_page_views: 0,
        unique_visitors: 0,
        avg_session_duration: 0,
        bounce_rate: 0,
        top_pages: [],
        top_sections: [],
        device_distribution: {},
        browser_distribution: {},
        ecommerce_events: {
          product_views: 0,
          add_to_cart: 0,
          begin_checkout: 0,
          purchases: 0
        }
      },
      trends: []
    }
  },
  methods: {
    async loadMetrics() {
      this.loading = true
      try {
        // Cargar métricas de analytics
        const [summaryResponse, trendsResponse] = await Promise.all([
          this.$axios.get('/lead/page-analytics/page-access/summary/'),
          this.$axios.get('/lead/page-analytics/page-access/trends/?days=7')
        ])

        this.summary = summaryResponse.data
        this.trends = trendsResponse.data
        this.lastUpdateTime = new Date().toLocaleTimeString('es-ES')
        this.$emit('metrics-loaded', this.summary)

      } catch (error) {
        console.error('Error cargando analytics:', error)
        this.$emit('error', 'Error al cargar las métricas de analytics')
      } finally {
        this.loading = false
      }
    },
    
    refreshMetrics() {
      this.loadMetrics()
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    },
    
    formatSectionName(section) {
      const sectionNames = {
        'homepage': 'Página Principal',
        'product_detail': 'Detalle de Producto',
        'checkout': 'Proceso de Compra',
        'shopping_cart': 'Carrito de Compras',
        'search_results': 'Resultados de Búsqueda',
        'category_browse': 'Navegación por Categorías',
        'user_account': 'Área de Usuario',
        'leads_management': 'Gestión de Leads',
        'analytics_dashboard': 'Dashboard de Analytics',
        'other': 'Otras Secciones'
      }
      return sectionNames[section] || section
    },
    
    formatPageUrl(url) {
      if (url === '/') return 'Página Principal'
      return url.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    },
    
    getDataQuality() {
      const totalViews = this.summary.total_page_views
      if (totalViews === 0) return 'Sin datos'
      if (totalViews < 10) return 'Datos limitados'
      if (totalViews < 50) return 'Datos moderados'
      return 'Datos completos'
    },
    
    getPerformanceMetrics() {
      const bounceRate = this.summary.bounce_rate
      if (bounceRate <= 30) return 'Excelente retención'
      if (bounceRate <= 50) return 'Buena retención'
      if (bounceRate <= 70) return 'Retención moderada'
      return 'Retención baja'
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
.page-analytics-dashboard {
  min-height: 400px;
  backdrop-filter: blur(10px);
}

.page-analytics-dashboard * {
  transition: all 0.3s ease;
}
</style> 