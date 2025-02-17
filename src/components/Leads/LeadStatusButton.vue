<template>
  <div class="flex justify-end">
    <button 
      class="flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      @click="openModal"
    >
      {{ statusDisplay }}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-full max-w-md mx-4">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2">Actualizar estado del lead</h2>
          <p class="text-gray-600">Selecciona el nuevo estado</p>

          <select v-model="selectedStatus" class="w-full mt-4 p-2 border rounded-md">
            <option 
              v-for="option in statusChoices" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <div class="flex justify-end space-x-4 mt-6">
            <button 
              @click="showModal = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button 
              @click="updateLeadStatus"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeadStatusButton',
  props: {
    leadId: {
      type: Number,
      required: true
    },
    currentStatus: {
      type: String,
      required: true
    },
    statusDisplay: {
      type: String,
      required: true
    },
    statusChoices: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      selectedStatus: ''
    }
  },
  methods: {
    openModal() {
      this.selectedStatus = this.currentStatus;
      this.showModal = true;
    },
    async updateLeadStatus() {
      try {
        await this.$axios.patch(`/lead/lead/${this.leadId}/`, {
          status: this.selectedStatus
        });
        this.showModal = false;
        this.$emit('status-updated', this.selectedStatus);

      } catch (error) {
        console.error('Error al actualizar el status:', error);
      }
    }
  }
}
</script> 