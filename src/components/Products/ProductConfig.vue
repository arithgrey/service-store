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

                      <!-- Precio y cantidad -->
                      <p class="text-sm text-gray-500">ID del producto: {{ product.id }}</p>
                      <div class="flex items-center">
                        <p class="text-sm text-gray-900 font-bold">Precio: ${{ formattedPrice(product.price) }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editPriceMode = !editPriceMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Editar precio -->
                      <div v-if="editPriceMode" class="mt-5">
                        <label for="price" class="text-sm text-gray-900 border-b text-base">Actualizar precio:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
                          <input
                            v-model="form.price"
                            type="text"
                            name="price"
                            id="price"
                            class="peer input-cart"
                            placeholder="Nuevo precio*"
                            @input="formatPrice"
                            @keyup.enter="confirmPriceChange"
                            required
                            inputmode="numeric"
                            @focus="initializePrice"
                          />
                          <span class="text-red-500 text-sm" v-if="errors && errors.price">{{ formatError(errors.price) }}</span>
                        </div>

                        <!-- Mostrar resumen del cambio de precio -->
                        <div v-if="form.price && !isNaN(form.price)" class="mt-3">
                          <p class="text-sm text-gray-700">
                            Actual: <strong>${{ formattedPrice(product.price) }}</strong>
                          </p>
                          <p class="text-sm text-gray-700">
                            Nuevo precio: <strong>${{ formattedPrice(form.price) }}</strong>
                          </p>

                          <!-- Botón de confirmar precio -->
                          <button
                            @click="confirmPriceChange"
                            class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>

                      <!-- Componente de gestión de stock -->
                      <StockManager 
                        :product-id="product.id"
                      />

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
import { formattedPrice } from '@/components/Products/js/priceHelper';
import StockManager from '@/components/Products/StockManager.vue';

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
    StockManager
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
      editPriceMode: false,
      form: {
        price: ""
      },        
      errors: {
        price: "",
      },
    };
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
    formattedPrice,
    
    openCart() {
      this.open = true;
    },
    closeCart() {
      this.open = false;
    },
    
    formatPrice() {
      this.form.price = this.form.price.replace(/[^0-9]/g, '');
    },
    async confirmPriceChange() {
      try {
        const params = { 
          id: this.product.id, 
          price: this.form.price 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.price = this.form.price;
        this.form.price = '';
        this.editPriceMode = false;
        this.$emit('price-updated', this.form.price);
        
      } catch (error) {
        console.error("Error actualizando precio:", error);
      }
    },
    initializePrice() {
      if (!this.form.price) {
        this.form.price = this.product.price.toString();
      }
    },
  },
};
</script>
