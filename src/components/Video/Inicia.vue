<template>
 
  <div class="relative h-screen bg-gray-900">
    <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay muted loop playsinline ref="video">
      <source src="@/assets/inicia.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="absolute top-1/2 left-10 transform -translate-y-1/2 text-white">
      <h1 class="text-4xl font-bold">
        Ya en serio...  ¡Inicia! 
      </h1>
    </div>
  </div>

</template>

<script>
export default {
  name: 'VideoPlayer',
  mounted() {
    const video = this.$refs.video;
    video.play();
  },
};
</script>