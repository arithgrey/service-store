<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">Plantillas de Landing</h3>
      <button
        @click="showAddLandingModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Agregar Plantilla
      </button>
    </div>

    <!-- Lista de plantillas del producto -->
    <div v-if="productLandings.length > 0" class="space-y-4">
      <div
        v-for="productLanding in productLandings"
        :key="productLanding.id"
        class="border border-gray-200 rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h4 class="text-sm font-medium text-gray-900">
              {{ productLanding.template.name }}
            </h4>
            <p class="text-sm text-gray-500">
              URL: {{ productLanding.template.base_url }}
            </p>
            <div class="mt-2 flex items-center space-x-4">
              <span
                v-if="productLanding.is_primary"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Principal
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="togglePrimaryLanding(productLanding)"
              :class="productLanding.is_primary ? 'bg-green-600' : 'bg-gray-600'"
              class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {{ productLanding.is_primary ? 'Principal' : 'Hacer Principal' }}
            </button>
            <button
              @click="removeLanding(productLanding)"
              class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="text-center py-8">
      <div class="text-gray-400">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No hay plantillas</h3>
        <p class="mt-1 text-sm text-gray-500">
          Agrega plantillas de landing para este producto.
        </p>
      </div>
    </div>

    <!-- Modal para agregar plantilla -->
    <TransitionRoot as="template" :show="showAddLandingModal">
      <Dialog as="div" class="relative z-50" @close="showAddLandingModal = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-20 transition-opacity backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Agregar Plantilla de Landing
                  </DialogTitle>

                  <div class="space-y-4">
                    <!-- Selección de acción -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Acción:</label>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            v-model="actionType"
                            type="radio"
                            value="existing"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Seleccionar plantilla existente</span>
                        </label>
                        <label class="flex items-center">
                          <input
                            v-model="actionType"
                            type="radio"
                            value="new"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span class="ml-2 text-sm text-gray-700">Crear nueva plantilla</span>
                        </label>
                      </div>
                    </div>

                    <!-- Formulario para plantilla existente -->
                    <div v-if="actionType === 'existing'" class="space-y-4">
                      <!-- Seleccionar plantilla -->
                      <div>
                        <label for="template_id" class="block text-sm font-medium text-gray-700">Plantilla:</label>
                        <select
                          v-model="newLandingForm.template_id"
                          id="template_id"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Selecciona una plantilla...</option>
                          <option 
                            v-for="template in availableTemplates" 
                            :key="template.id" 
                            :value="template.id"
                          >
                            {{ template.name }} ({{ template.template_type }})
                          </option>
                        </select>
                        <span class="text-red-500 text-sm" v-if="newLandingForm.errors && newLandingForm.errors.template_id">{{ formatError(newLandingForm.errors.template_id) }}</span>
                      </div>

                      <!-- Es landing principal -->
                      <div class="flex items-center">
                        <input
                          v-model="newLandingForm.is_primary"
                          id="is_primary"
                          type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label for="is_primary" class="ml-2 block text-sm text-gray-900">
                          Es landing principal
                        </label>
                      </div>
                    </div>

                    <!-- Formulario para nueva plantilla -->
                    <div v-if="actionType === 'new'" class="space-y-4">
                      <!-- Nombre de la plantilla -->
                      <div>
                        <label for="new_template_name" class="block text-sm font-medium text-gray-700">Nombre de la plantilla:</label>
                        <input
                          v-model="newTemplateForm.name"
                          type="text"
                          id="new_template_name"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                        <span class="text-red-500 text-sm" v-if="newTemplateForm.errors && newTemplateForm.errors.name">{{ formatError(newTemplateForm.errors.name) }}</span>
                      </div>

                      <!-- URL base de la plantilla -->
                      <div>
                        <label for="new_template_base_url" class="block text-sm font-medium text-gray-700">URL base de la plantilla:</label>
                        <input
                          v-model="newTemplateForm.base_url"
                          type="text"
                          id="new_template_base_url"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="https://enidservice.com/kits-para-pasar-al-siguiente-nivel?"
                          required
                        />
                        <p class="mt-1 text-xs text-gray-500">Se generará: https://enidservice.com/[url-base]?</p>
                        <span class="text-red-500 text-sm" v-if="newTemplateForm.errors && newTemplateForm.errors.base_url">{{ formatError(newTemplateForm.errors.base_url) }}</span>
                      </div>

                      <!-- Tipo de plantilla -->
                      <div>
                        <label for="new_template_type" class="block text-sm font-medium text-gray-700">Tipo de plantilla:</label>
                        <select
                          v-model="newTemplateForm.template_type"
                          id="new_template_type"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Selecciona un tipo...</option>
                          <option 
                            v-for="type in templateTypes" 
                            :key="type.value" 
                            :value="type.value"
                          >
                            {{ type.label }}
                          </option>
                        </select>
                        <span class="text-red-500 text-sm" v-if="newTemplateForm.errors && newTemplateForm.errors.template_type">{{ formatError(newTemplateForm.errors.template_type) }}</span>
                      </div>

                      <!-- Es landing principal -->
                      <div class="flex items-center">
                        <input
                          v-model="newLandingForm.is_primary"
                          id="new_is_primary"
                          type="checkbox"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label for="new_is_primary" class="ml-2 block text-sm text-gray-900">
                          Es landing principal
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Botones de acción -->
                  <div class="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      @click="showAddLandingModal = false"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      @click="addLanding"
                      :disabled="!canSubmitForm || isAddingLanding"
                    >
                      <span v-if="isAddingLanding">Agregando...</span>
                      <span v-else>Agregar Plantilla</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import * as utilities from "@/rules/utilities.js";

export default {
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XMarkIcon
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      productLandings: [],
      availableTemplates: [],
      templateTypes: [],
      showAddLandingModal: false,
      isAddingLanding: false,
      actionType: 'existing', // 'existing' o 'new'
      newLandingForm: {
        template_id: '',
        is_primary: false,
        errors: {}
      },
      newTemplateForm: {
        name: '',
        base_url: '',
        template_type: '',
        errors: {}
      }
    };
  },
  mounted() {
    this.loadProductLandings();
    this.loadTemplates();
    this.loadTemplateTypes();
  },
  computed: {
    canSubmitForm() {
      if (this.actionType === 'existing') {
        return this.newLandingForm.template_id;
      } else {
        return this.newTemplateForm.name && 
               this.newTemplateForm.base_url && 
               this.newTemplateForm.template_type;
      }
    }
  },
  methods: {
    ...utilities,
    
    async loadProductLandings() {
      try {
        const response = await this.$axios.get(`/landings/product-landings/by_product/?product_id=${this.product.id}`);
        this.productLandings = response.data;
      } catch (error) {
        console.error("Error cargando plantillas del producto:", error);
      }
    },
    
    async loadTemplates() {
      if (this.availableTemplates.length === 0) {
        try {
          const response = await this.$axios.get('/landings/templates/');
          this.availableTemplates = response.data.results;
        } catch (error) {
          console.error("Error cargando plantillas disponibles:", error);
        }
      }
    },
    
    async loadTemplateTypes() {
      if (this.templateTypes.length === 0) {
        try {
          const response = await this.$axios.get('/landings/templates/template_types/');
          this.templateTypes = response.data.template_types;
        } catch (error) {
          console.error("Error cargando tipos de plantilla:", error);
        }
      }
    },
    
    async addLanding() {
      this.isAddingLanding = true;
      try {
        if (this.actionType === 'new') {
          // Crear nueva plantilla y relación
          await this.createNewTemplateAndLanding();
        } else {
          // Usar plantilla existente
          await this.addExistingTemplate();
        }
      } catch (error) {
        console.error("Error agregando plantilla:", error);
        if (error.response && error.response.data) {
          if (this.actionType === 'new') {
            this.newTemplateForm.errors = error.response.data;
          } else {
            this.newLandingForm.errors = error.response.data;
          }
        }
      } finally {
        this.isAddingLanding = false;
      }
    },
    
    async createNewTemplateAndLanding() {
      // 1. Crear la plantilla con configuración básica
      const templateData = {
        name: this.newTemplateForm.name,
        base_url: this.newTemplateForm.base_url,
        template_type: this.newTemplateForm.template_type,
        config: {
          title: this.newTemplateForm.name,
          subtitle: `Plantilla ${this.newTemplateForm.name}`,
          button_text: "Ver más"
        }
      };
      
      const templateResponse = await this.$axios.post('/landings/templates/', templateData);
      const template = templateResponse.data;
      
      // 2. Crear la relación producto-plantilla
      const productLandingData = {
        product_id: this.product.id,
        template_id: template.id,
        is_primary: this.newLandingForm.is_primary
      };
      
      const productLandingResponse = await this.$axios.post('/landings/product-landings/', productLandingData);
      
      // Agregar la nueva relación a la lista
      this.productLandings.push(productLandingResponse.data);
      
      // Limpiar formularios y cerrar modal
      this.resetForms();
      this.showAddLandingModal = false;
      
      // Emitir eventos
      this.$emit('landing-added', productLandingResponse.data);
      this.$emit('template-created', template);
      
    },
    
    async addExistingTemplate() {
      const params = {
        product_id: this.product.id,
        template_id: this.newLandingForm.template_id,
        is_primary: this.newLandingForm.is_primary
      };
      
      const response = await this.$axios.post('/landings/product-landings/', params);
      
      // Agregar la nueva relación a la lista
      this.productLandings.push(response.data);
      
      // Limpiar formularios y cerrar modal
      this.resetForms();
      this.showAddLandingModal = false;
      
      // Emitir evento
      this.$emit('landing-added', response.data);
    },
    
    resetForms() {
      this.actionType = 'existing';
      this.newLandingForm = {
        template_id: '',
        is_primary: false,
        errors: {}
      };
      this.newTemplateForm = {
        name: '',
        base_url: '',
        template_type: '',
        errors: {}
      };
    },
    
    async removeLanding(productLanding) {
      if (confirm('¿Estás seguro de que quieres eliminar esta plantilla de landing?')) {
        try {
          await this.$axios.delete(`/landings/product-landings/${productLanding.id}/`);
          
          // Remover de la lista
          this.productLandings = this.productLandings.filter(pl => pl.id !== productLanding.id);
          
          // Emitir evento
          this.$emit('landing-removed', productLanding);
          
        } catch (error) {
          console.error("Error eliminando plantilla:", error);
        }
      }
    },
    
    async togglePrimaryLanding(productLanding) {
      try {
        const params = {
          is_primary: !productLanding.is_primary
        };
        
        const response = await this.$axios.patch(`/landings/product-landings/${productLanding.id}/`, params);
        
        // Actualizar en la lista
        const index = this.productLandings.findIndex(pl => pl.id === productLanding.id);
        if (index !== -1) {
          this.productLandings[index] = response.data;
        }
        
        // Si se marcó como principal, desmarcar las demás
        if (response.data.is_primary) {
          this.productLandings.forEach(pl => {
            if (pl.id !== productLanding.id) {
              pl.is_primary = false;
            }
          });
        }
        
        // Emitir evento
        this.$emit('primary-landing-updated', response.data);
        
      } catch (error) {
        console.error("Error actualizando plantilla principal:", error);
      }
    }
  }
};
</script>