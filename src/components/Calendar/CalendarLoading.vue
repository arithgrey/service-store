<template>
  <div class="text-center py-12">
    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    <p class="mt-4 text-gray-600">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'CalendarLoading',
  
  props: {
    message: {
      type: String,
      required: false,
      default: 'Cargando estadísticas...'
    }
  }
};
</script>
