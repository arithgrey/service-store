<template>
  <div>
    <div v-if="user" class="space-y-6">
      <!-- Header del usuario -->
      <div class="border-b pb-4 border-cyan-700">
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl mr-4">
            {{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}
          </div>
          <div class="flex-1">
            <h5 class="text-2xl font-bold text-gray-900 mb-1">
              {{ user.username || user.email }}
            </h5>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
          <div>
            <span 
              :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ user.is_active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Información del usuario -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="text-sm font-semibold text-gray-600 block mb-1">ID de Usuario</label>
          <p class="text-gray-900">{{ user.id }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="text-sm font-semibold text-gray-600 block mb-1">Nombre de Usuario</label>
          <p class="text-gray-900">{{ user.username || 'No especificado' }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="text-sm font-semibold text-gray-600 block mb-1">Email</label>
          <p class="text-gray-900">{{ user.email }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="text-sm font-semibold text-gray-600 block mb-1">Nombre Completo</label>
          <p class="text-gray-900">{{ user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'No especificado' }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="text-sm font-semibold text-gray-600 block mb-1">Fecha de Registro</label>
          <p class="text-gray-900">{{ formatDate(user.date_joined) }}</p>
          <p class="text-sm text-gray-500">{{ timePassed(user.date_joined) }}</p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <label class="text-sm font-semibold text-gray-600 block mb-1">Último Inicio de Sesión</label>
          <p class="text-gray-900">{{ user.last_login ? formatDate(user.last_login) : 'Nunca' }}</p>
          <p v-if="user.last_login" class="text-sm text-gray-500">{{ timePassed(user.last_login) }}</p>
        </div>
      </div>

      <!-- Permisos y Roles -->
      <div class="border-t pt-4">
        <h6 class="text-lg font-semibold text-gray-900 mb-3">Permisos y Roles</h6>
        <div class="flex flex-wrap gap-2">
          <span 
            v-if="user.is_superuser" 
            class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            🔐 Superusuario
          </span>
          <span 
            v-if="user.is_staff" 
            class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            👤 Staff
          </span>
          <span 
            v-if="!user.is_staff && !user.is_superuser" 
            class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            👥 Usuario Regular
          </span>
        </div>
      </div>

      <!-- Grupos (si existen) -->
      <div v-if="user.groups && user.groups.length > 0" class="border-t pt-4">
        <h6 class="text-lg font-semibold text-gray-900 mb-3">Grupos</h6>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="group in user.groups" 
            :key="group"
            class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ group }}
          </span>
        </div>
      </div>

      <!-- Estadísticas (placeholder para futuro) -->
      <div class="border-t pt-4">
        <h6 class="text-lg font-semibold text-gray-900 mb-3">Actividad</h6>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-blue-800 text-sm">
            ℹ️ Las estadísticas de actividad del usuario estarán disponibles próximamente.
          </p>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <p class="text-gray-500">Selecciona un usuario para ver sus detalles</p>
    </div>
  </div>
</template>

<script>
import { timePassed } from "@/helpers/time.js";

export default {
  props: {
    user: {
      type: Object,
      required: false,
      default: null
    },
  },
  methods: {
    timePassed,
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

