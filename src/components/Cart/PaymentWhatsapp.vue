<template>
    <a v-if="isMobile"
      @click.prevent="sendWhatsAppMessage"
      class="inline-flex w-full items-center mt-3 cursor-pointer justify-center rounded-md border-2 border-transparent bg-black bg-none 
      py-2 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-blue-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-5 mr-2">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
      <span class="text">Paga al recibir (CDMX)</span>
    </a>
  </template>
  
  <script>
  export default {
    props: {
      productName: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isMobile: false,
      };
    },
    mounted() {
      this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
      
    },
    methods: {
      sendWhatsAppMessage() {
        if (typeof fbq === 'function') {
          fbq('track', 'Lead');
        }
        const currentUrl = window.location.href;
        const message = `Hola, me interesa este producto: ${this.productName}. Aquí está el enlace: ${currentUrl}`;
        const whatsappUrl = `https://wa.me/5552967027?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      },
    },
  };
  </script>
  