<template>
  <div class="conversion-funnel">
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="bg-gray-200 h-12 rounded"></div>
      </div>
    </div>
    
    <div v-else class="space-y-4">
      <!-- Total de Leads -->
      <div class="funnel-step bg-blue-50 border-l-4 border-blue-500 p-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-lg font-semibold text-blue-900">Total de Leads</h4>
            <p class="text-sm text-blue-700">{{ funnelData.total_leads }} leads</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-blue-900">100%</span>
          </div>
        </div>
      </div>

      <!-- Pendientes -->
      <div class="funnel-step bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-lg font-semibold text-yellow-900">Pendientes</h4>
            <p class="text-sm text-yellow-700">{{ funnelData.pending_leads }} leads</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-yellow-900">{{ funnelData.pending_percentage }}%</span>
          </div>
        </div>
        <div class="mt-2 w-full bg-yellow-200 h-2">
          <div class="bg-yellow-500 h-2" :style="{ width: `${funnelData.pending_percentage}%` }"></div>
        </div>
      </div>

      <!-- Contactados -->
      <div class="funnel-step bg-blue-50 border-l-4 border-blue-500 p-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-lg font-semibold text-blue-900">Contactados</h4>
            <p class="text-sm text-blue-700">{{ funnelData.contacted_leads }} leads</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-blue-900">{{ funnelData.contacted_percentage }}%</span>
          </div>
        </div>
        <div class="mt-2 w-full bg-blue-200 h-2">
          <div class="bg-blue-500 h-2" :style="{ width: `${funnelData.contacted_percentage}%` }"></div>
        </div>
      </div>

      <!-- En Proceso -->
      <div class="funnel-step bg-purple-50 border-l-4 border-purple-500 p-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-lg font-semibold text-purple-900">En Proceso</h4>
            <p class="text-sm text-purple-700">{{ funnelData.process_leads }} leads</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-purple-900">{{ funnelData.process_percentage }}%</span>
          </div>
        </div>
        <div class="mt-2 w-full bg-purple-200 h-2">
          <div class="bg-purple-500 h-2" :style="{ width: `${funnelData.process_percentage}%` }"></div>
        </div>
      </div>

      <!-- Convertidos -->
      <div class="funnel-step bg-green-50 border-l-4 border-green-500 p-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-lg font-semibold text-green-900">Convertidos</h4>
            <p class="text-sm text-green-700">{{ funnelData.converted_leads }} leads</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-green-900">{{ funnelData.converted_percentage }}%</span>
          </div>
        </div>
        <div class="mt-2 w-full bg-green-200 h-2">
          <div class="bg-green-500 h-2" :style="{ width: `${funnelData.converted_percentage}%` }"></div>
        </div>
      </div>

      <!-- Descartados -->
      <div class="funnel-step bg-red-50 border-l-4 border-red-500 p-4">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-lg font-semibold text-red-900">Descartados</h4>
            <p class="text-sm text-red-700">{{ funnelData.discarded_leads }} leads</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-bold text-red-900">{{ funnelData.discarded_percentage }}%</span>
          </div>
        </div>
        <div class="mt-2 w-full bg-red-200 h-2">
          <div class="bg-red-500 h-2" :style="{ width: `${funnelData.discarded_percentage}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConversionFunnel',
  props: {
    funnelData: {
      type: Object,
      default: () => ({
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
      })
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.funnel-step {
  transition: all 0.3s ease;
}

.funnel-step:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 