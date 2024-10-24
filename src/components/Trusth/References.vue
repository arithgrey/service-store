<template>
  <Share />
  <div class="flex flex-col md:flex-row items-stretch bg-black p-2">
    <div class="w-full  pl-0 md:pl-5 bg-cream-100 p-5 flex flex-col justify-center text-right">
      <h3 class="text-4xl font-bold uppercase mb-4 p-3 text-white">
        Nuestra historía <br>
        <span class="animate-pulse text-yellow-300 cursor-pointer">
          contada por ustedes
        </span>
      </h3>
    </div>
  </div>


  <div>
    <div ref="imageContainer" class="max-h-screen overflow-y-auto p-1" @scroll="handleScroll">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="(image, index) in images" :key="index" class="grid gap-4">
          <div class="relative overflow-hidden" style="padding-top: 100%">
            <img class="absolute inset-0 w-full h-full object-cover" :src="image.get_image_url" :alt="image.name" />
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-4">
        <i class="animate-spin text-gray-500 fas fa-spinner fa-2x"></i>
        Cargando...
      </div>
    </div>
  </div>
</template>

<script>

import Share from '@/components/Trusth/Share.vue'

export default {
  components: {
    Share
  },
  props: {
    apiEndpoint: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      images: [],
      next: null,
      loading: false,
    };
  },
  mounted() {
    this.fetchImagesReferences();
  },
  methods: {
    async fetchImagesReferences() {
      try {
        const response = await this.$axios.get(this.apiEndpoint);
        this.images = response.data.results;
        this.next = response.data.next;
      } catch (error) {
        console.error("Error fetching references list:", error);
      }
    },
    async loadMoreImages() {
      try {
        const response = await this.$axios.get(this.next);
        this.images = [...this.images, ...response.data.results];
        this.next = response.data.next;
      } catch (error) {
        console.error("Error loading more images:", error);
      } finally {
        this.loading = false;
      }
    },
    handleScroll() {
      const container = this.$refs.imageContainer;
      const bottomOfContainer =
        container.scrollHeight - container.scrollTop === container.clientHeight;

      if (bottomOfContainer && this.next && !this.loading) {
        this.loading = true;
        this.loadMoreImages();
      }
    },
  },
};
</script>