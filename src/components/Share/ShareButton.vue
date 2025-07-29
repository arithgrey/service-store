<template>
  <button
    @click="openShareModal"
    class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    :title="'Compartir ' + product.name"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
    </svg>
    <span>Compartir</span>
  </button>
</template>

<script>
export default {
  name: 'ShareButton',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    openShareModal() {
      this.$emit('open-share-modal', this.product);
    }
  }
};
</script> 