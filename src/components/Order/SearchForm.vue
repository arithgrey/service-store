<template>
  <div>
    <form class="mt-8 flex items-center space-x-4" @submit.prevent="submitForm">
      
      <div class="">
        <select
          id="status"
          v-model="form.status"
          class="peer input-cart h-12"
        >
          <option value="all">Todos</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <input
          v-model="form.q"
          class="peer input-cart h-12"
          placeholder="Buscar por texto..."
          type="text"
          inputmode="text"
        />
        <button
          type="submit"
          class="flex items-center justify-center h-12 px-4 text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { minLength } from "@vuelidate/validators";
import { helpers } from "@vuelidate/validators";
import { required } from "@vuelidate/validators";

export const rules = {
  q: {
    minLength: helpers.withMessage("Encuentra tu orden", minLength(1)),
    required: helpers.withMessage("Encuentra tu orden", required),
  },
};

export default {
  props: {
    api: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formSubmitted: false,
      form: {
        q: "",
        status: "all", // Valor por defecto como "all"
        payment_on_delivery: false,
      },
      statusOptions: [
        { value: "pending", label: "Pedido recibido" },
        { value: "payment_confirmed", label: "Pago confirmado" },
        { value: "preparing", label: "Preparando" },
        { value: "ready_for_shipping", label: "Listo para envío" },
        { value: "in_transit", label: "En tránsito" },
        { value: "delivered", label: "Entregado" },
        { value: "canceled", label: "Cancelado" },
        { value: "returned", label: "Devuelto" },
      ],
    };
  },
  setup: () => ({ v$: useVuelidate() }),
  validations() {
    return {
      form: rules,
    };
  },
  methods: {
    async submitForm() {
      const params = {
        q: this.form.q,
        payment_on_delivery: this.form.payment_on_delivery,
      };
      
      if (this.form.status && this.form.status !== 'all') {
        params.status = this.form.status;
      }
      
      try {
        const response = await this.$axios.get(this.api, { params });
        this.handlerListOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.$emit("error", "Error al obtener las órdenes.");
      }
    },
    handlerListOrders(response) {
      if (response.status === 200) {
        this.$emit("list_orders", response.data);
      } else {
        this.$emit("error", "No se pudieron obtener las órdenes.");
      }
    },
  },
};
</script>
