<template>
  <div class="grid grid-cols-7 gap-1 mb-2">
    <div
      v-for="day in daysOfWeek"
      :key="day"
      class="text-center text-xs font-medium text-gray-500 py-2"
    >
      {{ day }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarDaysHeader',
  
  data() {
    return {
      daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    };
  }
};
</script>
