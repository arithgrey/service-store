<template>
  <div class="bg-white shadow rounded-lg p-6">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Campos básicos -->
      <div class="grid grid-cols-1 gap-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto *
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Kit de Pesas 34kg"
          />
        </div>

        <div>
          <label for="specific_name" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="specific_name"
            v-model="formData.specific_name"
            required
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción detallada del producto"
          ></textarea>
        </div>

        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
            Precio *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">$</span>
            <input
              id="price"
              v-model="formData.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <div class="flex space-x-2">
            <select
              id="category"
              v-model="formData.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
            <button
              type="button"
              @click="showCreateCategoryModal = true"
              class="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span class="sr-only">Agregar categoría</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal para crear nueva categoría -->
        <TransitionRoot as="template" :show="showCreateCategoryModal">
          <Dialog as="div" class="relative z-50" @close="showCreateCategoryModal = false">
            <TransitionChild as="template" 
              enter="ease-in-out duration-300" 
              enter-from="opacity-0" 
              enter-to="opacity-100"
              leave="ease-in-out duration-300" 
              leave-from="opacity-100" 
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-hidden">
              <div class="absolute inset-0 overflow-hidden">
                <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <TransitionChild as="template" 
                    enter="transform transition ease-in-out duration-300 sm:duration-500"
                    enter-from="translate-x-full" 
                    enter-to="translate-x-0"
                    leave="transform transition ease-in-out duration-300 sm:duration-500" 
                    leave-from="translate-x-0"
                    leave-to="translate-x-full"
                  >
                    <DialogPanel class="pointer-events-auto w-screen max-w-md">
                      <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                          <div class="flex items-start justify-between">
                            <DialogTitle class="text-lg font-medium text-gray-900">Crear Nueva Categoría</DialogTitle>
                            <div class="ml-3 flex h-7 items-center">
                              <button 
                                type="button" 
                                class="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                @click="showCreateCategoryModal = false"
                              >
                                <span class="absolute -inset-0.5" />
                                <span class="sr-only">Cerrar modal</span>
                                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>

                          <!-- Formulario para crear categoría -->
                          <div class="mt-6">
                            <label for="newCategoryName" class="block text-sm font-medium text-gray-700">
                              Nombre de la categoría:
                            </label>
                            <input
                              v-model="newCategoryForm.name"
                              type="text"
                              id="newCategoryName"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="Ej: Ropa deportiva"
                              required
                            />
                            <span 
                              v-if="newCategoryForm.errors && newCategoryForm.errors.name" 
                              class="text-red-500 text-sm"
                            >
                              {{ newCategoryForm.errors.name }}
                            </span>
                          </div>

                          <!-- Botones de acción -->
                          <div class="mt-6 flex justify-end space-x-3">
                            <button
                              type="button"
                              class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              @click="showCreateCategoryModal = false"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              @click="createNewCategory"
                              :disabled="!newCategoryForm.name || isCreatingCategory"
                            >
                              <span v-if="isCreatingCategory">Creando...</span>
                              <span v-else>Crear Categoría</span>
                            </button>
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

        <!-- Imágenes del producto -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del producto
          </label>
          <ImageUploader
            ref="imageUploader"
            @images-changed="handleImagesChanged"
          />
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="isSubmitting">Guardando...</span>
          <span v-else>Guardar Producto</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ImageUploader from './ImageUploader.vue'

export default {
  name: 'ProductForm',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    XMarkIcon,
    ImageUploader
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({
        name: '',
        specific_name: '',
        price: '',
        category: ''
      })
    }
  },
  data() {
    return {
      formData: { ...this.initialData },
      categories: [],
      isSubmitting: false,
      showCreateCategoryModal: false,
      newCategoryForm: {
        name: '',
        errors: null
      },
      isCreatingCategory: false,
      productImages: null
    };
  },
  async mounted() {
    await this.loadCategories();
  },
  methods: {
    async loadCategories() {
      try {
        const response = await this.$axios.get('enid/categorias/');
        this.categories = response.data.results || response.data;
      } catch (error) {
        console.error('Error cargando categorías:', error);
        this.$emit('error', 'Error al cargar las categorías');
      }
    },

    async createNewCategory() {
      if (!this.newCategoryForm.name) return;
      
      this.isCreatingCategory = true;
      this.newCategoryForm.errors = null;

      try {
        const response = await this.$axios.post('enid/categorias/', {
          name: this.newCategoryForm.name
        });

        // Agregar la nueva categoría a la lista
        this.categories.push(response.data);
        
        // Seleccionar automáticamente la nueva categoría
        this.formData.category = response.data.id;
        
        // Solo cerramos el modal de categoría
        this.showCreateCategoryModal = false;
        this.newCategoryForm.name = '';
        
        // Mostramos un mensaje temporal
        this.showTemporaryMessage('Categoría creada exitosamente', 'success');

      } catch (error) {
        console.error('Error creando categoría:', error);
        this.newCategoryForm.errors = {
          name: error.response?.data?.error || 'Error al crear la categoría'
        };
      } finally {
        this.isCreatingCategory = false;
      }
    },

    showTemporaryMessage(text, type) {
      // Crear un mensaje temporal que no afecte al formulario principal
      const tempMessage = document.createElement('div');
      tempMessage.className = `fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg ${
        type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`;
      tempMessage.textContent = text;
      document.body.appendChild(tempMessage);

      // Eliminar el mensaje después de 3 segundos
      setTimeout(() => {
        document.body.removeChild(tempMessage);
      }, 3000);
    },

    handleImagesChanged(formData) {
      // Convertir el FormData a un array de archivos
      const images = [];
      let mainImageIndex = 0;
      
      for (let pair of formData.entries()) {
        const [key, value] = pair;
        if (key.startsWith('image_')) {
          images.push(value);
        } else if (key.startsWith('is_main_')) {
          if (value === 'true') {
            mainImageIndex = parseInt(key.split('_')[2]);
          }
        }
      }
      
      this.productImages = {
        images,
        mainImageIndex
      };
    },

    async handleSubmit() {
      this.isSubmitting = true;

      try {
        // Validación básica
        if (!this.formData.name || !this.formData.specific_name || !this.formData.price || !this.formData.category) {
          throw new Error('Por favor completa todos los campos requeridos');
        }

        // Validar precio
        const price = parseFloat(this.formData.price);
        if (isNaN(price) || price < 0) {
          throw new Error('El precio debe ser un número válido mayor a 0');
        }

        // Crear FormData para enviar producto e imágenes juntos
        const formData = new FormData();
        formData.append('name', this.formData.name);
        formData.append('specific_name', this.formData.specific_name);
        formData.append('price', price);
        formData.append('category', this.formData.category);
        
        // Valores por defecto
        formData.append('weight', 0.5);
        formData.append('cost', 0);
        formData.append('min_stock', 1);
        formData.append('max_stock', 100);
        formData.append('es_publico', true);

        // Agregar imágenes si existen
        if (this.productImages?.images) {
          this.productImages.images.forEach((file, index) => {
            formData.append(`uploaded_images[${index}]`, file);
          });
          formData.append('main_image_index', this.productImages.mainImageIndex);
        }

        // Enviar al backend
        const response = await this.$axios.post('enid/productos/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Obtener los datos del producto desde la respuesta
        const productData = response.data;
        
        // Redirigir usando el nombre de la ruta y sus parámetros
        this.$router.push({
          name: 'product-detail',
          params: {
            categorySlug: productData.category.slug,
            productSlug: productData.slug
          }
        });

        // Mostrar mensaje y limpiar formulario
        this.showMessage('¡Producto creado exitosamente!', 'success');
        this.resetForm();

      } catch (error) {
        console.error('Error creando producto:', error);
        
        let errorMessage = 'Error al crear el producto';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.showMessage(errorMessage, 'error');
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        name: '',
        specific_name: '',
        price: '',
        category: ''
      };
      this.$refs.imageUploader?.reset();
      this.productImages = null;
    }
  }
};
</script> 