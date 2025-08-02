<template>
  <div class="container mx-auto px-4 flex flex-col items-center min-h-screen mb-10">
    <!-- Tabs Navigation -->
    <div class="w-full mb-6">
      <div class="bg-white shadow-sm border border-gray-200 p-1">
        <nav class="flex space-x-1" aria-label="Tabs">
                      <button
            @click="switchTab('dashboard')"
            :class="[
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              'flex-1 py-3 px-4 font-medium text-sm transition-all duration-200 border'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Dashboard</span>
            </div>
          </button>
          
          <button
            @click="switchTab('search')"
            :class="[
              activeTab === 'search'
                ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              'flex-1 py-3 px-4 font-medium text-sm transition-all duration-200 border'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>Buscar Leads</span>
                                    <span v-if="leads && leads.length > 0" class="bg-gray-100 text-gray-600 text-xs px-2 py-1">
                {{ leads.length }}
              </span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="w-full">
      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard de Métricas</h1>
          <p class="text-gray-600">Visualiza el rendimiento y las tendencias de tus leads en tiempo real.</p>
        </div>
        <LeadMetricsDashboard @error="handleError" />
      </div>

      <!-- Search Tab -->
      <div v-if="activeTab === 'search'" class="space-y-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Leads</h1>
          <p class="text-gray-600">Busca, filtra y gestiona todos tus leads de manera eficiente.</p>
        </div>
        <div class="mb-5">
          <SearchForm ref="searchForm" @list_leads="handlerLeads" />
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoadingLeads" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando leads...</p>
          </div>
        </div>
        
        <!-- Content -->
        <div v-else class="border-t w-full mb-5 flex">
          <div class="search-leads w-1/4 mr-4 mt-5 overflow-y-auto max-h-90">
            <ItemListLead :leads="leads" @selected_lead="handleSelectedLead"/>
          </div>

          <div class="description-lead w-3/4 mt-5 border p-5" ref="descriptionLead">
            <DetailLead :lead="selectedLead"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from "@/components/Leads/SearchForm.vue";
import DetailLead from  "@/components/Leads/DetailLead.vue";
import ItemListLead from "@/components/Leads/ItemListLead.vue";
import LeadMetricsDashboard from "@/components/Leads/LeadMetricsDashboard.vue";
import {timePassed}  from "@/helpers/time.js";


export default {
  components: {
    SearchForm,
    DetailLead,
    ItemListLead,
    LeadMetricsDashboard
  },
  data() {
    return {
      leads: null,
      selectedLead: null,
      activeTab: 'dashboard', // Tab por defecto
      isLoadingLeads: false,
    };
  },
  methods: {
    timePassed,
    handlerLeads(leads) {      
      this.leads = leads;
      this.isLoadingLeads = false;
    },   
    handleSelectedLead(lead) {
      
      this.selectedLead = lead;
      this.$refs.descriptionLead.scrollIntoView({ behavior: 'smooth' });

    },    
    callSubmitForm() {
      
      this.$refs.searchForm.submitForm();
    },
    handleError(message) {
      // Manejar errores del dashboard
      console.error('Error en dashboard:', message);
      // Aquí podrías mostrar una notificación al usuario
    },
    switchTab(tab) {
      this.activeTab = tab;
      // Si cambiamos a la pestaña de búsqueda, cargar los leads
      if (tab === 'search' && !this.leads) {
        this.isLoadingLeads = true;
        this.$nextTick(() => {
          this.callSubmitForm();
        });
      }
    },
  },
  mounted() {
    // No cargar leads automáticamente, solo cuando se active la pestaña de búsqueda
  },
  
};
</script>
