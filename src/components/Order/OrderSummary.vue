<template>
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:tc mb-5">
        Resumen de pedido
      </h2>
      <div class="mb-10 p-3 bg-gray-50">
        <div class="flex justify-between text-base font-medium text-gray-900">
          <p class="text-2xl">Total</p>
          <p class="text-2xl border-b border-black">
            {{ totalPriceQuantity }}
          </p>
        </div>
        <p class="mt-0.5 text-sm text-gray-900">
          ({{ totalItemsCart }} Productos)
        </p>
        <p class="mt-0.5 text-sm text-gray-900">Envío gratis</p>
        
        <!-- Botón para vaciar carrito -->
        <div class="mt-4 flex justify-end">
          <button
            @click="clearCart"
            type="button"
            class="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Vaciar carrito
          </button>
        </div>
      </div>
      <CartList />
  
      <div class="w-full mt-10">
        <PaymentMethods class="w-full" />
      </div>
  
      <div class="mt-15">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:tc mb-2">
          Llegada ?<span class="border p-1">?</span>
        </h2>
        <div class="bg-gray-50 p-2">
          <p class="text-sm">
            Llegan <span class="font-bold">HOY en CDMX</span> y área
            metropolitana
          </p>
          <p class="text-sm">
            En los estados, recibe tu pedido de
            <span class="font-bold">2 a 4 días hábiles</span>
          </p>
        </div>
        <div class="mt-5">
          <AccessButton @click="openSeccionLogin" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import CartList from "@/components/Cart/CartList.vue";
  import PaymentMethods from "@/components/Payments/PaymentMethods.vue";
  import AccessButton from "@/components/Login/AccessButton.vue";
  
  export default {
    components: {
      CartList,
      PaymentMethods,
      AccessButton,
    },
    props: {
      totalPriceQuantity: {
        type: Number,
        required: true,
      },
      totalItemsCart: {
        type: Number,
        required: true,
      },
    },
    methods: {
      openSeccionLogin() {
        this.$emit("open_seccion_login");
      },
      clearCart() {
        this.$store.commit("clearCart");
      },
    },
  };
  </script>
  