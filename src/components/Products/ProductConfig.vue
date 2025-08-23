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
                     
                      <!-- Precio -->
                      <div class="flex items-center mt-1">
                        <p class="text-sm text-gray-900 font-bold">Precio: ${{ formattedPrice(product.price) }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editPriceMode = !editPriceMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Costo -->
                      <div class="flex items-center mt-2">
                        <p class="text-sm text-gray-900 font-bold">Costo: ${{ formattedPrice(product.cost) }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editCostMode = !editCostMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Nombre del Producto -->
                      <div class="flex items-center mt-2">
                        <p class="text-sm text-gray-900 font-bold">Nombre: {{ product.name }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editNameMode = !editNameMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Nombre Específico -->
                      <div class="flex items-center mt-2">
                        <p class="text-sm text-gray-900 font-bold">Nombre específico: {{ product.specific_name }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editSpecificNameMode = !editSpecificNameMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Nombre Corto -->
                      <div class="flex items-center mt-2">
                        <p class="text-sm text-gray-900 font-bold">Nombre corto: {{ product.short_name }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editShortNameMode = !editShortNameMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Link de Pago Express -->
                      <div class="flex items-center mt-2">
                        <p class="text-sm text-gray-900 font-bold">Link de pago: {{ product.express_payment_link ? 'Configurado' : 'No configurado' }}</p>
                        <button type="button" class="ml-2 text-gray-500 hover:text-gray-700" @click="editExpressPaymentLinkMode = !editExpressPaymentLinkMode">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
                            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
                          </svg>
                        </button>
                      </div>

                      <!-- Primary Toggle -->
                      <div class="flex items-center mt-1">
                        <p class="text-sm text-gray-900 font-bold">Es producto primario:</p>
                        <button 
                          type="button" 
                          class="ml-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                          :class="product.primary ? 'bg-indigo-600' : 'bg-gray-200'"
                          @click="togglePrimary"
                        >
                          <span 
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="product.primary ? 'translate-x-5' : 'translate-x-0'"
                          />
                        </button>
                      </div>

                      <!-- Top Seller Toggle -->
                      <div class="flex items-center mt-1">
                        <p class="text-sm text-gray-900 font-bold">Es top seller:</p>
                        <button 
                          type="button" 
                          class="ml-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                          :class="product.top_seller ? 'bg-indigo-600' : 'bg-gray-200'"
                          @click="toggleTopSeller"
                        >
                          <span 
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="product.top_seller ? 'translate-x-5' : 'translate-x-0'"
                          />
                        </button>
                      </div>

                      <!-- Es Público Toggle -->
                      <div class="flex items-center mt-1">
                        <p class="text-sm text-gray-900 font-bold">Es producto público:</p>
                        <button 
                          type="button" 
                          class="ml-2 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                          :class="product.es_publico ? 'bg-indigo-600' : 'bg-gray-200'"
                          @click="toggleEsPublico"
                        >
                          <span 
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="product.es_publico ? 'translate-x-5' : 'translate-x-0'"
                          />
                        </button>
                        <span class="ml-2 text-xs text-gray-500">
                          {{ product.es_publico ? 'Visible públicamente' : 'Oculto del público' }}
                        </span>
                      </div>

                      <!-- Stock Configuration -->
                      <ProductInventoryConfig 
                        :product="product"
                        @min-stock-updated="handleMinStockUpdate"
                        @max-stock-updated="handleMaxStockUpdate"
                      />

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

                      <!-- Editar costo -->
                      <div v-if="editCostMode" class="mt-5">
                        <label for="cost" class="text-sm text-gray-900 border-b text-base">Actualizar costo:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
                          <input
                            v-model="form.cost"
                            type="text"
                            name="cost"
                            id="cost"
                            class="peer input-cart"
                            placeholder="Nuevo costo*"
                            @input="formatCost"
                            @keyup.enter="confirmCostChange"
                            required
                            inputmode="numeric"
                            @focus="initializeCost"
                          />
                          <span class="text-red-500 text-sm" v-if="errors && errors.cost">{{ formatError(errors.cost) }}</span>
                        </div>

                        <!-- Mostrar resumen del cambio de costo -->
                        <div v-if="form.cost && !isNaN(form.cost)" class="mt-3">
                          <p class="text-sm text-gray-700">
                            Actual: <strong>${{ formattedPrice(product.cost) }}</strong>
                          </p>
                          <p class="text-sm text-gray-700">
                            Nuevo costo: <strong>${{ formattedPrice(form.cost) }}</strong>
                          </p>

                          <!-- Botón de confirmar costo -->
                          <button
                            @click="confirmCostChange"
                            class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>

                      <!-- Editar nombre -->
                      <div v-if="editNameMode" class="mt-5">
                        <label for="name" class="text-sm text-gray-900 border-b text-base">Actualizar nombre:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
                          <input
                            v-model="form.name"
                            type="text"
                            name="name"
                            id="name"
                            class="peer input-cart"
                            placeholder="Nuevo nombre*"
                            @keyup.enter="confirmNameChange"
                            required
                            @focus="initializeName"
                          />
                          <span class="text-red-500 text-sm" v-if="errors && errors.name">{{ formatError(errors.name) }}</span>
                        </div>

                        <!-- Mostrar resumen del cambio de nombre -->
                        <div v-if="form.name" class="mt-3">
                          <p class="text-sm text-gray-700">
                            Actual: <strong>{{ product.name }}</strong>
                          </p>
                          <p class="text-sm text-gray-700">
                            Nuevo nombre: <strong>{{ form.name }}</strong>
                          </p>

                          <!-- Botón de confirmar nombre -->
                          <button
                            @click="confirmNameChange"
                            class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>

                      <!-- Editar nombre específico -->
                      <div v-if="editSpecificNameMode" class="mt-5">
                        <label for="specific_name" class="text-sm text-gray-900 border-b text-base">Actualizar nombre específico:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
                          <textarea
                            v-model="form.specific_name"
                            name="specific_name"
                            id="specific_name"
                            class="peer input-cart"
                            placeholder="Nuevo nombre específico*"
                            rows="3"
                            @keyup.enter="confirmSpecificNameChange"
                            required
                            @focus="initializeSpecificName"
                          ></textarea>
                          <span class="text-red-500 text-sm" v-if="errors && errors.specific_name">{{ formatError(errors.specific_name) }}</span>
                        </div>

                        <!-- Mostrar resumen del cambio de nombre específico -->
                        <div v-if="form.specific_name" class="mt-3">
                          <p class="text-sm text-gray-700">
                            Actual: <strong>{{ product.specific_name }}</strong>
                          </p>
                          <p class="text-sm text-gray-700">
                            Nuevo nombre específico: <strong>{{ form.specific_name }}</strong>
                          </p>

                          <!-- Botón de confirmar nombre específico -->
                          <button
                            @click="confirmSpecificNameChange"
                            class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>

                      <!-- Editar nombre corto -->
                      <div v-if="editShortNameMode" class="mt-5">
                        <label for="short_name" class="text-sm text-gray-900 border-b text-base">Actualizar nombre corto:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
                          <input
                            v-model="form.short_name"
                            type="text"
                            name="short_name"
                            id="short_name"
                            class="peer input-cart"
                            placeholder="Nuevo nombre corto*"
                            @keyup.enter="confirmShortNameChange"
                            required
                            @focus="initializeShortName"
                          />
                          <span class="text-red-500 text-sm" v-if="errors && errors.short_name">{{ formatError(errors.short_name) }}</span>
                        </div>

                        <!-- Mostrar resumen del cambio de nombre corto -->
                        <div v-if="form.short_name" class="mt-3">
                          <p class="text-sm text-gray-700">
                            Actual: <strong>{{ product.short_name }}</strong>
                          </p>
                          <p class="text-sm text-gray-700">
                            Nuevo nombre corto: <strong>{{ form.short_name }}</strong>
                          </p>

                          <!-- Botón de confirmar nombre corto -->
                          <button
                            @click="confirmShortNameChange"
                            class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>

                      <!-- Editar link de pago express -->
                      <div v-if="editExpressPaymentLinkMode" class="mt-5">
                        <label for="express_payment_link" class="text-sm text-gray-900 border-b text-base">Actualizar link de pago:</label>
                        <div class="relative z-0 w-full mb-5 mt-2 group">
                          <input
                            v-model="form.express_payment_link"
                            type="url"
                            name="express_payment_link"
                            id="express_payment_link"
                            class="peer input-cart"
                            placeholder="Nuevo link de pago (opcional)"
                            @keyup.enter="confirmExpressPaymentLinkChange"
                            @focus="initializeExpressPaymentLink"
                          />
                          <span class="text-red-500 text-sm" v-if="errors && errors.express_payment_link">{{ formatError(errors.express_payment_link) }}</span>
                        </div>

                        <!-- Mostrar resumen del cambio de link de pago -->
                        <div v-if="form.express_payment_link !== undefined" class="mt-3">
                          <p class="text-sm text-gray-700">
                            Actual: <strong>{{ product.express_payment_link || 'No configurado' }}</strong>
                          </p>
                          <p class="text-sm text-gray-700">
                            Nuevo link: <strong>{{ form.express_payment_link || 'Sin link' }}</strong>
                          </p>

                          <!-- Botón de confirmar link de pago -->
                          <button
                            @click="confirmExpressPaymentLinkChange"
                            class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>

                      <!-- Componentes del Producto -->
                      <ProductComponentsConfig 
                        :product="product"
                        @component-added="handleComponentAdded"
                        @component-removed="handleComponentRemoved"
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
import ProductInventoryConfig from '@/components/Products/ProductInventoryConfig.vue';
import ProductComponentsConfig from '@/components/Products/ProductComponentsConfig.vue';

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
    ProductInventoryConfig,
    ProductComponentsConfig
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
      editCostMode: false,
      editNameMode: false,
      editSpecificNameMode: false,
      editShortNameMode: false,
      editExpressPaymentLinkMode: false,
      editStockMode: false,
      editMinStockMode: false,
      editMaxStockMode: false,
      form: {
        price: "",
        cost: "",
        name: "",
        specific_name: "",
        short_name: "",
        express_payment_link: "",
        stock: "",
        min_stock: "",
        max_stock: "",
        stock_status: ""
      },        
      errors: {
        price: "",
        cost: "",
        name: "",
        specific_name: "",
        short_name: "",
        express_payment_link: "",
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
    formatCost() {
      this.form.cost = this.form.cost.replace(/[^0-9]/g, '');
    },
    async confirmCostChange() {
      try {
        const params = { 
          id: this.product.id, 
          cost: this.form.cost 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.cost = this.form.cost;
        this.form.cost = '';
        this.editCostMode = false;
        this.$emit('cost-updated', this.form.cost);
        
      } catch (error) {
        console.error("Error actualizando costo:", error);
      }
    },
    initializeCost() {
      if (!this.form.cost) {
        this.form.cost = this.product.cost.toString();
      }
    },
    
    // Métodos para nombre
    initializeName() {
      if (!this.form.name) {
        this.form.name = this.product.name;
      }
    },
    async confirmNameChange() {
      try {
        const params = { 
          id: this.product.id, 
          name: this.form.name 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.name = this.form.name;
        this.form.name = '';
        this.editNameMode = false;
        this.$emit('name-updated', this.form.name);
        
      } catch (error) {
        console.error("Error actualizando nombre:", error);
      }
    },
    
    // Métodos para nombre específico
    initializeSpecificName() {
      if (!this.form.specific_name) {
        this.form.specific_name = this.product.specific_name;
      }
    },
    async confirmSpecificNameChange() {
      try {
        const params = { 
          id: this.product.id, 
          specific_name: this.form.specific_name 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.specific_name = this.form.specific_name;
        this.form.specific_name = '';
        this.editSpecificNameMode = false;
        this.$emit('specific-name-updated', this.form.specific_name);
        
      } catch (error) {
        console.error("Error actualizando nombre específico:", error);
      }
    },
    
    // Métodos para nombre corto
    initializeShortName() {
      if (!this.form.short_name) {
        this.form.short_name = this.product.short_name;
      }
    },
    async confirmShortNameChange() {
      try {
        const params = { 
          id: this.product.id, 
          short_name: this.form.short_name 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.short_name = this.form.short_name;
        this.form.short_name = '';
        this.editShortNameMode = false;
        this.$emit('short-name-updated', this.form.short_name);
        
      } catch (error) {
        console.error("Error actualizando nombre corto:", error);
      }
    },
    
    // Métodos para link de pago express
    initializeExpressPaymentLink() {
      if (this.form.express_payment_link === undefined) {
        this.form.express_payment_link = this.product.express_payment_link || '';
      }
    },
    async confirmExpressPaymentLinkChange() {
      try {
        const params = { 
          id: this.product.id, 
          express_payment_link: this.form.express_payment_link || null
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.express_payment_link = this.form.express_payment_link || null;
        this.form.express_payment_link = '';
        this.editExpressPaymentLinkMode = false;
        this.$emit('express-payment-link-updated', this.form.express_payment_link);
        
      } catch (error) {
        console.error("Error actualizando link de pago:", error);
      }
    },
    
    async togglePrimary() {
      try {
        const params = { 
          id: this.product.id, 
          primary: !this.product.primary 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.primary = !this.product.primary;
        this.$emit('primary-updated', this.product.primary);
        
      } catch (error) {
        console.error("Error actualizando estado primary:", error);
      }
    },
    async toggleTopSeller() {
      try {
        const params = { 
          id: this.product.id, 
          top_seller: !this.product.top_seller 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.top_seller = !this.product.top_seller;
        this.$emit('top-seller-updated', this.product.top_seller);
        
      } catch (error) {
        console.error("Error actualizando estado top_seller:", error);
      }
    },
    async toggleEsPublico() {
      try {
        const params = { 
          id: this.product.id, 
          es_publico: !this.product.es_publico 
        };
        const response = await this.$axios.patch(`enid/productos/${this.product.id}/`, params);
        this.product.es_publico = !this.product.es_publico;
        this.$emit('es-publico-updated', this.product.es_publico);
        
      } catch (error) {
        console.error("Error actualizando estado es_publico:", error);
      }
    },
    handleMinStockUpdate(newMinStock) {
      this.product.min_stock = newMinStock;
      this.$emit('min-stock-updated', newMinStock);
    },
    handleMaxStockUpdate(newMaxStock) {
      this.product.max_stock = newMaxStock;
      this.$emit('max-stock-updated', newMaxStock);
    },
    handleComponentAdded(component) {
      if (!this.product.primary_components) {
        this.product.primary_components = [];
      }
      this.product.primary_components.push(component);
    },
    handleComponentRemoved(componentId) {
      this.product.primary_components = this.product.primary_components.filter(
        comp => comp.id !== componentId
      );
    }
  },
};
</script>
