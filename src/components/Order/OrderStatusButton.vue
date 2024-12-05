<template>
    <div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
        @click="openModal"
      >
        Pedido recibido
        <Edit class="ml-3"/>

      </button>
  
      <!-- Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">Actualizar estado de la orden</h2>
          <label for="status" class="block text-sm font-medium text-gray-700">Selecciona el nuevo estado</label>
          <select
            id="status"
            v-model="selectedStatus"
            class="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option v-for="status in statusChoices" :key="status.key" :value="status.key">
              {{ status.label }}
            </option>
          </select>
          <div class="mt-4 flex justify-end">
            <button class="px-4 py-2 bg-gray-200 rounded-md mr-2" @click="closeModal">Cancelar</button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-md" @click="updateOrderStatus">Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
    import Edit from "@/components/Icons/Edit.vue";

  export default {
    components: {
      Edit,
    },
    props: {
      orderId: {
        type: Number,
        required: true,
      },
      currentStatus: {
        type: String,
        required: true,
      },
      statusChoices: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        isModalOpen: false,
        selectedStatus: this.currentStatus,
      };
    },
    methods: {
      openModal() {
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
      },
      async updateOrderStatus() {
        try {
          await this.$axios.put(`/enid/compra/${this.orderId}/`, { status: this.selectedStatus });
          this.$emit("status-updated", this.selectedStatus);
          this.closeModal();
        } catch (error) {
          console.error("Error al actualizar el estado:", error);
        }
      },
    },
  };
  </script>
  