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
export default {
  name: 'ProductForm',
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
      isSubmitting: false
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

        // Datos para enviar
        const productData = {
          ...this.formData,
          price: price
        };

        // Enviar al backend
        await this.$axios.post('enid/productos/', productData);
        
        this.$emit('success', 'Producto creado exitosamente!');
        this.resetForm();

      } catch (error) {
        console.error('Error creando producto:', error);
        
        let errorMessage = 'Error al crear el producto';
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.$emit('error', errorMessage);
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
    }
  }
};
</script> 