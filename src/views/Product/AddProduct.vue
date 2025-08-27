<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Agregar Nuevo Producto</h1>
        <p class="mt-2 text-gray-600">Ingresa la información básica del producto</p>
      </div>

      <!-- Formulario Simplificado -->
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
                v-model="form.name"
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
                v-model="form.specific_name"
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
                  v-model="form.price"
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
              <select
                id="category"
                v-model="form.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una categoría</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="handleCancel"
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

      <!-- Mensaje de éxito/error -->
      <div v-if="message" class="mt-6">
        <div
          :class="[
            'p-4 rounded-md',
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          ]"
        >
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddProduct',
  data() {
    return {
      form: {
        name: '',
        specific_name: '',
        price: '',
        category: ''
      },
      categories: [],
      isSubmitting: false,
      message: null
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
        this.showMessage('Error al cargar las categorías', 'error');
      }
    },

    async handleSubmit() {
      this.isSubmitting = true;
      this.message = null;

      try {
        // Validación básica
        if (!this.form.name || !this.form.specific_name || !this.form.price || !this.form.category) {
          throw new Error('Por favor completa todos los campos requeridos');
        }

        // Validar precio
        const price = parseFloat(this.form.price);
        if (isNaN(price) || price < 0) {
          throw new Error('El precio debe ser un número válido mayor a 0');
        }

        // Datos para enviar
        const productData = {
          ...this.form,
          price: price
        };
        
        // Enviar al backend
        await this.$axios.post('enid/productos/', productData);
        
        this.showMessage('Producto creado exitosamente!', 'success');
        this.resetForm();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);

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

    handleCancel() {
      this.$router.push('/');
    },

    resetForm() {
      this.form = {
        name: '',
        specific_name: '',
        price: '',
        category: ''
      };
    },

    showMessage(text, type) {
      this.message = { text, type };
      setTimeout(() => {
        this.message = null;
      }, 5000);
    }
  }
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 