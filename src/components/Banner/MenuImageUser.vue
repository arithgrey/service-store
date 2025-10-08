<template>
  <div class="relative ml-3" @click="toggleMenu">
    <img
      :src="userAvatar"
      class="w-8 h-8 rounded-full cursor-pointer object-cover"
      alt="Imagen de usuario"
      @error="handleImageError"
    />
    <transition name="fade">
      <div
        v-if="showMenu && isAuthenticated"
        class="absolute right-0 mt-5 w-72 bg-white overflow-hidden shadow p-5"
      >
        <ul>
          <li v-if="currentUser && currentUser.name">
            <div class="ml-4 flow-root">
              <a                
                class="group flex items-center cursor-pointer"
              >
                <img
                  :src="userAvatar"
                  class="w-8 h-8 rounded-full cursor-pointer object-cover"
                  alt="Imagen de usuario"
                  @error="handleImageError"
                />
                <p class="ml-3 text-md">
                  {{currentUser.name}}
                </p>
              </a>
            </div>
          </li>
              
          <li class="mt-3">
            <div class="ml-4 flow-root">
              <router-link
                :to="{ name: 'ecommerce-user' }"
                class="group flex items-center cursor-pointer"
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
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                <p class="ml-3">Ordenes de compra</p>
              </router-link>
            </div>
          </li>
          <li @click="logout" class="mt-2">
            <div class="ml-4 flow-root">
              <a class="group flex items-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 mr-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                <p class="ml-3">Cerrar sesión</p>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>



<script>
export default {
  data() {
    return {
      showMenu: false,
      imageError: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.user;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userAvatar() {
      console.log('🔍 MenuImageUser - currentUser:', this.currentUser);
      console.log('🔍 MenuImageUser - currentUser.picture:', this.currentUser?.picture);
      console.log('🔍 MenuImageUser - imageError:', this.imageError);
      
      // Si hay error cargando la imagen o no hay imagen de Google, usar la por defecto
      if (this.imageError || !this.currentUser?.picture) {
        console.log('🔍 MenuImageUser - Usando imagen por defecto');
        return '/images/user.png';
      }
      // Usar la imagen de perfil de Google
      console.log('🔍 MenuImageUser - Usando imagen de Google:', this.currentUser.picture);
      return this.currentUser.picture;
    }
  },
  methods: {
    handleImageError() {
      // Si falla la carga de la imagen de Google, usar la por defecto
      this.imageError = true;
    },
    
    logout() {
      const refresh_token = localStorage.getItem("refresh_token");
      this.$axios
        .post(`/logout/`, { refresh_token: refresh_token })

        .then((response) => {
          this.$store.commit("clearToken");
        })
        .catch((error) => {
          console.error("Error al hacer logout:", error);
        });
        
        this.$store.commit("clearToken");
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
  watch: {
    currentUser: {
      handler(newUser, oldUser) {
        console.log('🔍 MenuImageUser - Usuario cambió:', { newUser, oldUser });
        // Reset error state when user changes
        this.imageError = false;
      },
      immediate: true
    }
  }
};
</script>

