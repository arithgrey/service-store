<template>
  <select class="peer input-cart h-12 mb-5" v-model="selectedWarehouse">
    <option value="" disabled selected>Seleccione una bodega</option>
    <option v-for="warehouse in warehouses" 
            :key="warehouse.id" 
            :value="warehouse.id">
      {{ warehouse.name }}
    </option>
  </select>
</template>

<script>

export default {
  name: 'ListSelect',
  data() {
    return {
      warehouses: [],
      selectedWarehouse: ''
    }
  },
  async created() {
    try {
      const response = await this.$axios.get('/stock/warehouses/warehouses/')
      this.warehouses = response.data
    } catch (error) {
      console.error('Error al cargar las bodegas:', error)
    }
  },
  watch: {
    selectedWarehouse(newValue) {
      this.$emit('warehouse-selected', newValue)
    }
  }
}
</script>
