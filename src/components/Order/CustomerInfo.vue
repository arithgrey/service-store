<template>
  <div v-if="userInfo" class="customer-info">
    <div class="flex items-center space-x-2">
      <!-- Avatar con inicial -->
      <div class="avatar">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
          {{ getUserInitial }}
        </div>
      </div>
      
      <!-- Información del cliente -->
      <div class="customer-details flex-1">
        <p class="text-sm font-semibold text-gray-900">
          {{ getFullName }}
        </p>
        <p class="text-xs text-gray-600">
          {{ userInfo.email }}
        </p>
      </div>
    </div>
  </div>
  
  <!-- Estado cuando no hay información del usuario -->
  <div v-else class="customer-info-empty">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-xs text-gray-500">Sin información del cliente</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomerInfo',
  
  props: {
    userInfo: {
      type: Object,
      required: false,
      default: null
    },
    compact: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    getUserInitial() {
      if (!this.userInfo) return '?';
      
      if (this.userInfo.first_name) {
        return this.userInfo.first_name.charAt(0).toUpperCase();
      }
      
      if (this.userInfo.username) {
        return this.userInfo.username.charAt(0).toUpperCase();
      }
      
      if (this.userInfo.email) {
        return this.userInfo.email.charAt(0).toUpperCase();
      }
      
      return '?';
    },
    
    getFullName() {
      if (!this.userInfo) return 'Cliente Anónimo';
      
      const firstName = this.userInfo.first_name || '';
      const lastName = this.userInfo.last_name || '';
      
      const fullName = `${firstName} ${lastName}`.trim();
      
      if (fullName) {
        return fullName;
      }
      
      if (this.userInfo.username) {
        return this.userInfo.username;
      }
      
      return 'Cliente';
    }
  }
};
</script>

<style scoped>
.customer-info {
  @apply py-1;
}

.customer-info-empty {
  @apply py-1;
}
</style>


