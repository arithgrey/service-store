<template>
  <div>
    <References api-endpoint="references/business/enid-service/imagenes-referencia/" />
    <div class="flex flex-col md:flex-row items-stretch bg-black p-2">
      <div class="w-full md:w-1/2 pl-0 md:pl-5 bg-cream-100 p-5 flex flex-col justify-center">
        <h3 class="text-4xl font-bold uppercase mb-4 p-3 text-white">
          Disfruta la transformación <br>
          <router-link to="/impact" class="animate-pulse text-yellow-300 cursor-pointer">
            Más sobre nosotros
          </router-link>
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import References from '@/components/Trusth/References.vue';

export default {
  components: {
    References,
  },
};
</script>
