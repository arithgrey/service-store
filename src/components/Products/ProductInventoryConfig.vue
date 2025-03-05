<template>
  <div class="mt-4 space-y-3">
    <h3 class="text-sm font-bold text-gray-900 border-b">Configuración de Inventario</h3>

    <!-- Stock Mínimo -->
    <div class="flex items-center">
      <p class="text-sm text-gray-900">Stock mínimo: {{ product.min_stock }}</p>
      <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editMinStockMode = !editMinStockMode">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
          <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
        </svg>
      </button>
    </div>

    <!-- Editar stock mínimo -->
    <div v-if="editMinStockMode" class="mt-5">
      <label for="min_stock" class="text-sm text-gray-900 border-b text-base">Actualizar stock mínimo:</label>
      <div class="relative z-0 w-full mb-5 mt-2 group">
        <input
          v-model="form.min_stock"
          type="text"
          name="min_stock"
          id="min_stock"
          class="peer input-cart"
          placeholder="Nuevo stock mínimo*"
          @input="formatMinStock"
          @keyup.enter="confirmMinStockChange"
          required
          inputmode="numeric"
          @focus="initializeMinStock"
        />
      </div>

      <!-- Mostrar resumen del cambio de stock mínimo -->
      <div v-if="form.min_stock && !isNaN(form.min_stock)" class="mt-3">
        <p class="text-sm text-gray-700">
          Actual: <strong>{{ product.min_stock }}</strong>
        </p>
        <p class="text-sm text-gray-700">
          Nuevo stock mínimo: <strong>{{ form.min_stock }}</strong>
        </p>

        <button
          @click="confirmMinStockChange"
          class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirmar
        </button>
      </div>
    </div>

    <!-- Stock Máximo -->
    <div class="flex items-center">
      <p class="text-sm text-gray-900">Stock máximo: {{ product.max_stock }}</p>
      <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editMaxStockMode = !editMaxStockMode">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
          <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
        </svg>
      </button>
    </div>

    <!-- Editar stock máximo -->
    <div v-if="editMaxStockMode" class="mt-5">
      <label for="max_stock" class="text-sm text-gray-900 border-b text-base">Actualizar stock máximo:</label>
      <div class="relative z-0 w-full mb-5 mt-2 group">
        <input
          v-model="form.max_stock"
          type="text"
          name="max_stock"
          id="max_stock"
          class="peer input-cart"
          placeholder="Nuevo stock máximo*"
          @input="formatMaxStock"
          @keyup.enter="confirmMaxStockChange"
          required
          inputmode="numeric"
          @focus="initializeMaxStock"
        />
      </div>

      <!-- Mostrar resumen del cambio de stock máximo -->
      <div v-if="form.max_stock && !isNaN(form.max_stock)" class="mt-3">
        <p class="text-sm text-gray-700">
          Actual: <strong>{{ product.max_stock }}</strong>
        </p>
        <p class="text-sm text-gray-700">
          Nuevo stock máximo: <strong>{{ form.max_stock }}</strong>
        </p>

        <button
          @click="confirmMaxStockChange"
          class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductInventoryConfig',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editMinStockMode: false,
      editMaxStockMode: false,
      form: {
        min_stock: "",
        max_stock: "",
      }
    };
  },
  methods: {
    formatMinStock() {
      this.form.min_stock = this.form.min_stock.replace(/[^0-9]/g, '');
    },
    async confirmMinStockChange() {
      try {
        const params = { 
          id: this.product.id, 
          min_stock: this.form.min_stock 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.$emit('min-stock-updated', this.form.min_stock);
        this.editMinStockMode = false;
        this.form.min_stock = '';
      } catch (error) {
        console.error("Error actualizando stock mínimo:", error);
      }
    },
    initializeMinStock() {
      if (!this.form.min_stock) {
        this.form.min_stock = this.product.min_stock.toString();
      }
    },
    formatMaxStock() {
      this.form.max_stock = this.form.max_stock.replace(/[^0-9]/g, '');
    },
    async confirmMaxStockChange() {
      try {
        const params = { 
          id: this.product.id, 
          max_stock: this.form.max_stock 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.$emit('max-stock-updated', this.form.max_stock);
        this.editMaxStockMode = false;
        this.form.max_stock = '';
      } catch (error) {
        console.error("Error actualizando stock máximo:", error);
      }
    },
    initializeMaxStock() {
      if (!this.form.max_stock) {
        this.form.max_stock = this.product.max_stock.toString();
      }
    },
  }
};
</script> 