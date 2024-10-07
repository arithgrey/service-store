<template>
  <div>
    <p>{{ category_name }}</p>
    <p>{{ video_path }}</p>
    <div class="relative h-screen bg-gray-900">
      <video
        class="absolute top-0 left-0 w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
        ref="video"
      >
        <source src="@/assets/calistenia.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div class="absolute top-1/2 left-10 transform -translate-y-1/2 text-white">
        <h1 class="text-4xl font-bold">
          Pasa el siguiente nivel ya!
        </h1>
        <p class="mt-4 text-lg">Sin excusas, sin complicaciones</p>
        <p>mantén tu rutina en casa, incluso en los días de peor clima</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      category_name: null,
      video_path: null,
    };
  },
  watch: {  
    "$route.params.categorySlug": function (newQ, oldQ) {
      this.video_path = `/assets/${newQ}.mp4/`;
      this.category_name = this.$route.params.newQ;

    },
  },  
  mounted() {
    this.category_name = this.$route.params.categorySlug;
    this.video_path = `/assets/${category_name}.mp4/`;
    const video = this.$refs.video;
    video.play();    
  },
};
</script>
