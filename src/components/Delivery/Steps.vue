<template>
    <div class="w-full max-w-2xl mx-auto mt-8">
      <div class="flex items-center justify-between">
        <div
          v-for="(stage, index) in stages"
          :key="index"
          class="flex items-center"
        >
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full"
            :class="{
              'bg-gray-900 text-white': index <= currentStage,
              'bg-gray-300 text-gray-500': index > currentStage,
            }"
          >
            <span class="text-lg font-semibold">{{ index + 1 }}</span>
          </div>
  
          <div
            v-if="index < stages.length - 1"
            class="h-1 w-8 sm:w-16 mx-2"
            :class="{
              'bg-gray-900': index < currentStage,
              'bg-gray-300': index >= currentStage,
            }"
          ></div>
        </div>
      </div>
  
      <!-- Etiquetas de las etapas -->
      <div class="flex justify-between mt-4 text-sm">
        <span
          v-for="(stage, index) in stages"
          :key="index"
          class="text-center"
          :class="{
            'text-gray-900 font-bold': index === currentStage,
            'text-gray-500': index !== currentStage,
          }"
        >
          {{ stage }}
        </span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        stages: [
          "Pedido recibido",
          "Preparando el pedido",
          "En tránsito",
          "Entregado",
        ],
        currentStage: 1,
      };
    },
  };
  </script>
  