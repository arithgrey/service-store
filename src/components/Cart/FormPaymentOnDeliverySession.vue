<template>
    <div>
      <form class="mt-8" @submit.prevent="submitForm" :disabled="loading">
        <div>
          <h5 class="text-2xl font-bold tracking-tight text-gray-900 sm:tc mb-5 ">
            ¿Dónde enviamos tu pedido?
          </h5>
          <p class="mt-4 text-sm text-gray-950 bg-gray-50">
            Solo usaremos estos datos para ayudarnos a entregar tu pedido
          </p>
          <div>
            <div class="relative z-0 w-full mb-5 mt-5 group">
              <input
                v-model="form.name"
                @input="formatName"
                type="text"
                name="name"
                id="floating_name"
                class="peer input-cart"
                placeholder="Nombre"
                required
              />
              <span
                class="text-red-500 text-sm"
                v-if="this.errors && this.errors.name"
                >{{ formatError(this.errors.name) }}</span
              >
              <span class="text-red-500 text-sm" v-if="v$?.form.name.$error">
                {{ v$?.form.name.$errors[0].$message }}
              </span>
            </div>
  
            <div class="relative z-0 w-full mb-5 mt-5 group">
              <input
                v-model="form.phone_number"
                @input="formatPhoneNumber"
                type="tel"
                id="floating_name_phone_number"
                class="peer input-cart"
                placeholder="Teléfono*"
                required
              />
              <span
                class="text-red-500 text-sm"
                v-if="this.errors && this.errors.phone_number"
                >{{ formatError(this.errors.phone_number) }}</span
              >
              <span
                class="text-red-500 text-sm"
                v-if="v$?.form.phone_number.$error"
              >
                {{ v$?.form.phone_number.$errors[0].$message }}
              </span>
            </div>
          </div>
        </div>
  
        <div
          :class="{ hidden: !isContact, block: isContact }"
          ref="shippingAddressSection"
        >
          <h5 class="text-1xl font-bold tracking-tight text-gray-900 sm:tc mb-5">
            Dirección de entrega
          </h5>
          <p class="text-sm text-gray-600 mb-4">
            Escribe tu dirección y selecciona una de las sugerencias de Google Maps
          </p>

          <AddressAutocomplete
            v-model="form.street"
            name="street"
            id="floating_street"
            placeholder="Escribe tu dirección completa*"
            @address-selected="handleAddressSelected"
          />
          <span
            class="text-red-500 text-sm"
            v-if="this.errors && this.errors.street"
            >{{ formatError(this.errors.street) }}</span
          >
          <span class="text-red-500 text-sm" v-if="v$?.form.street.$error">
            {{ v$?.form.street.$errors[0].$message }}
          </span>

          <!-- Información adicional de la dirección seleccionada -->
          <div v-if="selectedAddressInfo" class="mb-4 p-3 bg-blue-50 rounded-md">
            <p class="text-sm text-blue-800">
              <strong>Dirección seleccionada:</strong> {{ selectedAddressInfo.formattedAddress }}
            </p>
          </div>
  
          <button
            :disabled="loading"
            type="submit"
            class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { useVuelidate } from "@vuelidate/core";
  import { fields } from "@/components/Cart/js/paymentOnDeliveryFields.js";
  import { rules } from "@/rules/checkout/paymentOnDeliveryValidator.js";
  import * as utilities from "@/rules/utilities.js";
  import * as utilitiesLeads from "@/components/Cart/js/leads.js";
  import AddressAutocomplete from "@/components/Cart/AddressAutocomplete.vue";
  
  export default {
    data() {
      return {
        ...fields,
        selectedAddressInfo: null,
      };
    },
    setup: () => ({ v$: useVuelidate() }),
    validations() {
      return {
        form: rules,
      };
    },
    computed: {
      isContact() {
        
        let status = (
          !this.v$?.form.name.$error &&
          !this.v$?.form.phone_number.$error &&
          this.form.name.length > 0 &&
          this.form.phone_number.length > 0 
        );

        return status;
  
      },
    },
    methods: {
      ...utilities,
      ...utilitiesLeads,
  
      async submitForm() {
        try {
  
          this.loading = true;
          const isValid = await this.validateForm();
          if (!isValid) return;
  
          let response = await this.processPaymentOnDelivery();
          
          if (response) {
            this.nextToSaveOrder(response.data);
          }
          
          
        } catch (error) { 
            this.handleSubmissionError(error);
        } finally {
          this.loading = false;
        }
      },
  
      async validateForm() {
        const result = await this.v$.$validate();
        if (!result) {
          this.cleanErrors();
          return false;
        }
        return true;
      },
  
      async processPaymentOnDelivery() {
        
          this.cleanErrors();
          this.form.products = this.$store.getters.getProductsFromCart;      
          return await this.$axios.post("enid/order-payment-on-delivery/pod/", this.form);
      },
  
      async nextToSaveOrder(response) {
          this.cleanFields();
          await this.clearCart();
          this.$router.push({ name: "order-detail", params: { id: response.id } });
      },
  
      async clearCart() {
        await this.$store.commit("clearCart");
      },
  
      handleSubmissionError(error) {      
        console.error("Error during form submission:", error);
        if (error.response && error.response.data) {
          this.errors = error.response.data;
        }
      },

      // Manejar dirección seleccionada del componente AddressAutocomplete
      handleAddressSelected(addressData) {
        this.selectedAddressInfo = addressData;
        this.v$?.form.street.$touch();
      },
    },

    components: {
      AddressAutocomplete
    },
  };
  </script>
  