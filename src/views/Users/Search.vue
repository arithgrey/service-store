<template>
  <div class="container mx-auto px-4 flex flex-col items-center min-h-screen mb-10">
    <!-- Tabs Navigation -->
    <div class="w-full mb-6">
      <div class="bg-white shadow-sm border border-gray-200 p-1">
        <nav class="flex space-x-1" aria-label="Tabs">
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
              <span>Buscar Usuarios</span>
              <span v-if="users && users.length > 0" class="bg-gray-100 text-gray-600 text-xs px-2 py-1">
                {{ users.length }}
              </span>
            </div>
          </button>

          <button
            @click="switchTab('analytics')"
            :class="[
              activeTab === 'analytics'
                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              'flex-1 py-3 px-4 font-medium text-sm transition-all duration-200 border'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Estadísticas</span>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="w-full">
      <!-- Search Tab -->
      <div v-if="activeTab === 'search'" class="space-y-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p class="text-gray-600">Busca, filtra y gestiona todos los usuarios registrados en el sistema.</p>
        </div>
        <div class="mb-5">
          <SearchForm ref="searchForm" @list_users="handlerUsers" />
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoadingUsers" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
        
        <!-- Content -->
        <div v-else class="border-t w-full mb-5 flex">
          <div class="search-users w-1/4 mr-4 mt-5 overflow-y-auto max-h-90">
            <ItemListUser :users="users" @selected_user="handleSelectedUser"/>
          </div>

          <div class="description-user w-3/4 mt-5 border p-5" ref="descriptionUser">
            <DetailUser :user="selectedUser"/>
          </div>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Estadísticas de Usuarios</h1>
          <p class="text-gray-600">Monitorea el comportamiento y actividad de los usuarios registrados.</p>
        </div>
        
        <!-- Placeholder para estadísticas futuras -->
        <div class="bg-white shadow-sm border border-gray-200 p-8 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Estadísticas Próximamente</h3>
          <p class="text-gray-500">Las métricas y análisis de usuarios estarán disponibles próximamente.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from "@/components/Users/SearchForm.vue";
import DetailUser from  "@/components/Users/DetailUser.vue";
import ItemListUser from "@/components/Users/ItemListUser.vue";
import {timePassed}  from "@/helpers/time.js";

export default {
  components: {
    SearchForm,
    DetailUser,
    ItemListUser
  },
  data() {
    return {
      users: null,
      selectedUser: null,
      activeTab: 'search', // Tab por defecto
      isLoadingUsers: false,
    };
  },
  methods: {
    timePassed,
    handlerUsers(users) {      
      this.users = users;
      this.isLoadingUsers = false;
    },   
    handleSelectedUser(user) {
      this.selectedUser = user;
      this.$refs.descriptionUser.scrollIntoView({ behavior: 'smooth' });
    },    
    callSubmitForm() {
      this.$refs.searchForm.submitForm();
    },
    handleError(message) {
      console.error('Error en búsqueda de usuarios:', message);
    },
    switchTab(tab) {
      this.activeTab = tab;
      // Si cambiamos a la pestaña de búsqueda, cargar los usuarios
      if (tab === 'search' && !this.users) {
        this.isLoadingUsers = true;
        this.$nextTick(() => {
          this.callSubmitForm();
        });
      }
    },
  },
  mounted() {
    // Cargar usuarios al montar el componente
    this.isLoadingUsers = true;
    this.$nextTick(() => {
      this.callSubmitForm();
    });
  },
};
</script>

