<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-50" @close="open = false">
        <!-- TransitionChild para fondo oscuro -->
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <!-- TransitionChild para el panel -->
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full" enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0"
                leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-lg font-medium text-gray-900">Configuración</DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            @click="open = false">
                            <span class="absolute -inset-0.5" />
                            <span class="sr-only">Cerrar panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <!-- Cantidad disponible -->
                      <p class="text-sm text-gray-500">ID del producto: {{ product.id }}</p>
                      <div class="flex items-center">
                        <p class="text-sm text-gray-900 font-bold">Cantidad actual: {{ quantity }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editMode = !editMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path
                              d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Editar cantidad -->
                      <div v-if="editMode" class="mt-5">
                        <label for="quantity" class="text-sm text-gray-900 border-b text-base">Agregar cantidad:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
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
                            Cantidad por agregar: <strong>{{ form.quantity }}</strong>
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
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import * as utilities from "@/rules/utilities.js";
import ValidationStockRules from "@/rules/stock/commons.js";

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

export default {
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Bars3Icon,
    MagnifyingGlassIcon,
    XMarkIcon,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      editMode: false,
      quantity: 0,
      form: {
        quantity: ""
      },        
      errors: {
        quantity: "",
      },
    };
  },
  watch: {
    'product.id': {
      immediate: true,
      handler(newVal) {
        this.fetchStock();
      },
    },
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      form: { quantity: ValidationStockRules.quantityRules() },
    };
  },
  computed: {
    finalQuantity() {
      const currentQuantity = parseInt(this.quantity, 10) || 0;
      const addedQuantity = parseInt(this.form.quantity, 10) || 0;
      return currentQuantity + addedQuantity;
    }
  },
  methods: {
    ...utilities,
    async fetchStock() {
      try {
        const params = { product_id: this.product.id };
        const response = await this.$axios.get(`/stock/movements/stock-movements/quantity/`, { params });
        this.quantity = response.data.quantity;
      } catch (error) {
        console.error("Error stock products:", error);
      }
    },
    openCart() {
      this.open = true;
    },
    closeCart() {
      this.open = false;
    },
    async confirmChange() {
      const finalQuantity = this.finalQuantity;
      console.log(`Cantidad final: ${finalQuantity}`);
      
      try {
        
        const params = { product_id: this.product.id, quantity: this.form.quantity, movement_type: 1 };
        const response = await this.$axios.post(`/stock/movements/stock-movements/existence/`, params);
        await this.fetchStock();
     
      } catch (error) {
        console.error("Error stock products:", error);
      }

      this.form.quantity = '';
      this.editMode = false;
    }
  },
};
</script>
