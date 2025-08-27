<template>
  <div>
    <!-- Overlay de fondo -->
    <transition name="fade">
      <div v-if="isOpen" 
           class="fixed inset-0 bg-black bg-opacity-50 z-40"
           @click="$emit('close')">
      </div>
    </transition>

    <!-- Panel lateral -->
    <transition name="slide">
      <div v-if="isOpen" 
           class="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-xl z-50 overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button @click="$emit('close')" 
                  class="p-2 hover:bg-gray-100 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Contenido -->
        <div class="p-6">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidePanel',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style> 