<template>
    <div class="relative w-full overflow-hidden text-gray-950 text-xs mx-auto text-center bg-stone-100">
      <div 
        class="whitespace-nowrap transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div v-for="(slide, index) in slides" :key="index" class="inline-block w-full ">
          <p class="text-sm font-extrabold p-2">{{ slide }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        currentSlide: 0,
        slides: [
          "Envío gratis | 2 días hábiles",
          "Pago contra entrega dentro de CDMX",
          "En CDMX recibe el mismo día",
          "Cancela en cualquier momento",
          "Compra segura - rápida",
          "Atención al cliente 24/7",
          "Descuentos exclusivos (tiempo limitado)",
        ],
      };
    },
    mounted() {
      this.startSlider();
    },
    methods: {
      startSlider() {
        setInterval(() => {
          this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        }, 3000);
      },
    },
  };
  </script>
  
  