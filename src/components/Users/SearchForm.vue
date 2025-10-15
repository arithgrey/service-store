<template>
  <div>
    <form class="mt-8" @submit.prevent="submitForm">
      <div class="flex flex-col md:flex-row gap-4">
        <div>
          <select
            v-model="form.is_active"
            class="peer input-cart h-[42px]"
          >
            <option
              v-for="status in statusList"
              :key="status.id"
              :value="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </div>
        <div>
          <input
            v-model="form.q"
            class="peer input-cart h-[42px]"
            placeholder="Buscar por email o nombre..."
            type="text"
            inputmode="text"
          />
        </div>

        <button
          type="submit"
          class="relative flex items-center px-3 mt-1 font-medium tracking-wide text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-300 transform active:scale-95 ease-in-out"
        >
          <span>
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
          </span>
        </button>
      </div>
      <span class="text-red-500 text-sm" v-if="v$?.form.q.$error">
        {{ v$?.form.q.$errors[0].$message }}
      </span>
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
    minLength: helpers.withMessage("Busca un usuario", minLength(1)),
    required: helpers.withMessage("Busca un usuario", required),
  },
};

export default {
  components: {},
  data() {
    return {
      formSubmitted: false,
      
      form: {
        q: "",
        is_active: "all",
      },
      statusList: [
        { id: 'all', name: 'Todos' },
        { id: 'true', name: 'Activos' },
        { id: 'false', name: 'Inactivos' },
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
      await this.searchUsers();
    },
    
    async searchUsers() {
      const params = { 
        q: this.form.q,
        is_active: this.form.is_active 
      };
      const response = await this.$axios.get(`/oauth/user/user-search/`, {params});
      this.handlerListUsers(response);
    },

    handlerListUsers(response){        
        if(response.status ==  200){            
            this.$emit("list_users", response.data)
        }
    }
  },
  watch: {
    'form.is_active': {
      handler: async function() {
        await this.searchUsers();
      },
      immediate: true
    }
  }
};
</script>

