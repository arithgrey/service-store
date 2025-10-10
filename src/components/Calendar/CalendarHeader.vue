<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
    <p class="mt-2 text-sm text-gray-600">{{ subtitle }}</p>
  </div>
</template>

<script>
export default {
  name: 'CalendarHeader',
  
  props: {
    title: {
      type: String,
      required: true,
      default: 'Calendario'
    },
    subtitle: {
      type: String,
      required: false,
      default: ''
    }
  }
};
</script>
