<template>
    <div class="relative h-screen">
      <video
        class="absolute top-0 left-0 w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
        ref="video"
      >
        <source src="@/assets/halloween-4.mp4" type="video/mp4" />
      </video>
      <div class="absolute top-3/4 left-10 text-white bg-gray-950 p-3">
        <h1 class="text-5xl font-bold uppercase mb-4 text-white">
          Aprovecha las promos de<br> la temporada de Día de Muertos.
        </h1>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "HalloweenVideoPromo",
  };
  </script>
  