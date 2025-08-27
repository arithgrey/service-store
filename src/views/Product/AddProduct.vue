<template>
  <div>
    <!-- Botón para abrir el panel -->
    <button
      @click="showPanel = true"
      class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Agregar Producto
    </button>

    <!-- Panel lateral con el formulario -->
    <SidePanel
      :is-open="showPanel"
      title="Agregar Nuevo Producto"
      @close="handleClose"
    >
      <ProductForm
        @success="handleSuccess"
        @error="handleError"
        @cancel="handleClose"
        @product-created="handleProductCreated"
      />
    </SidePanel>

    <!-- Mensaje de éxito/error -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div
        :class="[
          'p-4 rounded-md shadow-lg transition-all duration-300',
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        ]"
      >
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script>
import SidePanel from '@/components/Common/SidePanel.vue';
import ProductForm from '@/components/Product/ProductForm.vue';

export default {
  name: 'AddProduct',
  components: {
    SidePanel,
    ProductForm
  },
  data() {
    return {
      showPanel: false,
      message: null,
      redirectTimeout: null
    };
  },
  beforeDestroy() {
    // Limpiar timeout si existe
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
    }
  },
  methods: {
    handleClose() {
      this.showPanel = false;
    },

    handleSuccess(message) {
      this.message = { text: message, type: 'success' };
      this.showPanel = false;
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        this.message = null;
      }, 5000);
    },

    handleError(message) {
      this.message = { text: message, type: 'error' };
      setTimeout(() => {
        this.message = null;
      }, 5000);
    },

    handleProductCreated({ url, product }) {
      // Cerrar el panel inmediatamente
      this.showPanel = false;

      // Mostrar mensaje de éxito
      this.message = { 
        text: '¡Producto creado exitosamente! Redirigiendo...', 
        type: 'success' 
      };

      // Limpiar cualquier timeout existente
      if (this.redirectTimeout) {
        clearTimeout(this.redirectTimeout);
      }

      // Configurar nuevo timeout para redirección
      this.redirectTimeout = setTimeout(() => {
        // Limpiar mensaje antes de redirigir
        this.message = null;
        // Redirigir a la página del producto
        this.$router.replace(url);
      }, 1000);
    }
  }
};
</script>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style> 