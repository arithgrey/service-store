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
    },
  };
  </script>
  