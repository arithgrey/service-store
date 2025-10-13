<template>
  <div>
    <div v-if="users && users.length === 0">
      <p class="text-gray-500 text-center py-8">No se encontraron usuarios.</p>
    </div>
    <div v-else>
      <div
        v-for="item in users"
        :key="item.id"
        @click="selectUser(item)"
        :class="{
          'border-cyan-700 bg-blue-50': selectedUser && selectedUser.id === item.id,
        }"
        class="shadow-md bg-white w-full border cursor-pointer hover:shadow-lg transition-shadow mb-3"
      >
        <div class="p-6">
          <div class="flex items-center mb-3">
            <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold mr-3">
              {{ item.username ? item.username.charAt(0).toUpperCase() : 'U' }}
            </div>
            <div class="flex-1">
              <h5 class="text-lg font-semibold text-gray-900">
                {{ item.username || item.email }}
              </h5>
              <p class="text-sm text-gray-600">
                {{ item.email }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <span :class="item.is_active ? 'text-green-600' : 'text-red-600'" class="font-medium">
              {{ item.is_active ? '● Activo' : '● Inactivo' }}
            </span>
            <span class="text-gray-500">
              {{ timePassed(item.date_joined) }}
            </span>
          </div>
          
          <div v-if="item.is_staff || item.is_superuser" class="mt-2 flex gap-2">
            <span v-if="item.is_staff" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Staff
            </span>
            <span v-if="item.is_superuser" class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Superusuario
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { timePassed } from "@/helpers/time.js";

export default {
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  computed: {
    reactiveUsers() {      
      return this.users.slice();
    },
  },
  data() {
    return {
      selectedUser: null,
    };
  },
  methods: {
    timePassed,
    selectUser(user) {
      this.selectedUser = user;      
      this.$emit("selected_user", user);
    },
  },
};
</script>

