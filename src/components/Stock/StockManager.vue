<template>
  <div class="inline-block">
    <!-- Cantidad disponible -->
    <div class="inline-flex items-center">
      <p class="text-gray-900"> Stock en esta bodega: {{ quantity }}</p>
      <button 
        v-if="canEdit"
        type="button" 
        class="ml-2 text-gray-500 hover:text-gray-700" 
        @click="editMode = !editMode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
          <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
        </svg>
      </button>
    </div>

    <!-- Editar cantidad -->
    <div v-if="editMode" class="mt-5">
      <!-- Selector de tipo de operación -->
      <div class="mb-3 mt-2">
        <select v-model="form.movementType" class="peer input-cart h-12">
          <option value="1">Agregar stock</option>
          <option value="2">Quitar stock</option>
        </select>
      </div>

      <div class="relative z-0 w-full mb-5 group">
        <input
          v-model="form.quantity"
          type="text"
          name="quantity"
          id="quantity"
          class="peer input-cart"
          placeholder="Cantidad por agregar*"
          @input="formatQuantity"
          required
          inputmode="numeric"
        />
        <span class="text-red-500 text-sm" v-if="errors && errors.quantity">{{ formatError(errors.quantity) }}</span>
        <span class="text-red-500 text-sm" v-if="v$?.form.quantity.$error">{{ v$?.form.quantity.$errors[0].$message }}</span>
      </div>

      <!-- Mostrar resumen con la cantidad final -->
      <div v-if="form.quantity && !isNaN(form.quantity)" class="mt-3">
        <p class="text-sm text-gray-700">
          Cantidad actual: <strong>{{ quantity }}</strong>
        </p>
        <p class="text-sm text-gray-700">
          {{ operationType }}: <strong>{{ form.quantity }}</strong>
        </p>
        <p class="text-sm text-gray-900 font-bold">
          Cantidad final: <strong>{{ finalQuantity }}</strong>
        </p>

        <!-- Botón de confirmar -->
        <button
          @click="confirmChange"
          class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import * as utilities from "@/rules/utilities.js";
import ValidationStockRules from "@/rules/stock/commons.js";

export default {
  name: 'StockManager',
  props: {
    productId: {
      type: [String, Number],
      required: true
    },
    warehouseId: {
      type: [String, Number],
      required: true
    }
  },
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      editMode: false,
      quantity: 0,
      form: {
        quantity: "",
        movementType: 1, 
      },
      errors: {
        quantity: "",
      },
    };
  },
  validations() {
    return {
      form: { quantity: ValidationStockRules.quantityRules() },
    };
  },
  watch: {
    productId: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.editMode = false;
          this.form.quantity = '';
          this.form.movementType = 1;
        }
        this.fetchStock();
      },
    },
    warehouseId: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.editMode = false;
          this.form.quantity = '';
          this.form.movementType = 1;
        }
        this.fetchStock();
      },
    },
  },
  computed: {
    finalQuantity() {
      const currentQuantity = parseInt(this.quantity, 10) || 0;
      const addedQuantity = parseInt(this.form.quantity, 10) || 0;
      return this.form.movementType === 1 
        ? currentQuantity + addedQuantity 
        : currentQuantity - addedQuantity;
    },
    operationType() {
      return this.form.movementType === 1 
        ? "Cantidad por agregar" 
        : "Cantidad por quitar";
    },
    operationLabel() {
      return this.form.movementType === 1 
        ? "Agregar cantidad" 
        : "Quitar cantidad";
    },
    canEdit() {
      return parseInt(this.warehouseId) > 0;
    }
  },
  methods: {
    ...utilities,
    async fetchStock() {
      if (!this.productId || !this.warehouseId) return;

      try {
        const params = { 
          product_id: this.productId,
          warehouse_id: this.warehouseId
        };
        const response = await this.$axios.get(`/stock/movements/stock-movements/warehouse-quantity/`, { params });
        this.quantity = response.data.quantity;
      } catch (error) {
        console.error("Error stock products:", error);
      }
    },
    async confirmChange() {
      if (!this.productId || !this.warehouseId) return;

      try {
        const params = { 
          product_id: this.productId, 
          warehouse_id: this.warehouseId,
          quantity: parseInt(this.form.quantity),
          movement_type: parseInt(this.form.movementType)
        };
        const response = await this.$axios.post(`/stock/movements/stock-movements/existence/`, params);
        await this.fetchStock();

        this.$emit('stock-updated', {
          productId: this.productId,
          warehouseId: this.warehouseId,
          quantity: this.quantity
        });
        
      } catch (error) {
        console.error("Error stock products:", error);
      }

      this.form.quantity = '';
      this.form.movementType = 1;
      this.editMode = false;
    },
  },
};
</script> 