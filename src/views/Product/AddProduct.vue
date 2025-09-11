<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p class="mt-2 text-gray-600">Administra y crea productos para tu tienda</p>
          </div>
          
          <!-- Botón para agregar producto -->
          <button
            @click="showAddPanel = true"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Agregar Producto
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Lista de productos -->
      <ProductListAdmin
        ref="productListAdmin"
        @success="handleSuccess"
        @error="handleError"
      />
    </div>

    <!-- Panel lateral para agregar producto -->
    <SidePanel
      :is-open="showAddPanel"
      title="Agregar Nuevo Producto"
      @close="handleCloseAddPanel"
    >
      <ProductForm
        @success="handleProductCreated"
        @error="handleError"
        @cancel="handleCloseAddPanel"
        @product-created="handleProductCreated"
      />
    </SidePanel>

    <!-- Mensaje de éxito/error -->
    <div v-if="message" class="fixed bottom-4 right-4 z-50">
      <div
        :class="[
          'p-4 rounded-md shadow-lg transition-all duration-300 max-w-sm',
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        ]"
      >
        <div class="flex items-center">
          <svg
            v-if="message.type === 'success'"
            class="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg
            v-else
            class="w-5 h-5 mr-2 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="font-medium">{{ message.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidePanel from '@/components/Common/SidePanel.vue';
import ProductForm from '@/components/Product/ProductForm.vue';
import ProductListAdmin from '@/components/Product/ProductListAdmin.vue';

export default {
  name: 'AddProduct',
  components: {
    SidePanel,
    ProductForm,
    ProductListAdmin,
  },
  data() {
    return {
      showAddPanel: false,
      message: null,
    };
  },
  methods: {
    handleCloseAddPanel() {
      this.showAddPanel = false;
    },
    
    handleProductCreated(product) {
      this.showAddPanel = false;
      this.showMessage('¡Producto creado exitosamente!', 'success');
      
      // Recargar la lista de productos
      this.$nextTick(() => {
        this.$refs.productListAdmin?.fetchAllProducts();
      });
    },
    
    handleSuccess(message) {
      this.showMessage(message, 'success');
    },
    
    handleError(message) {
      this.showMessage(message, 'error');
    },
    
    showMessage(text, type) {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 5000);
    },
  },
};
</script>
