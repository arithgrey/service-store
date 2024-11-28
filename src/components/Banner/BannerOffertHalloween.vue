<template>
  <div class="overflow-y-hidden bg-gray-950">
    <div
      class="mx-auto container flex justify-center items-center py-12 px-4 sm:px-6 2xl:px-0"
    >
      <div class="flex flex-col lg:flex-row justify-center items-center">
        <div
          class="w-full lg:w-3/4 sm:w-80 flex flex-col justify-start items-start"
        >
          <div>
            <p class="text-3xl xl:text-4xl font-semibold leading-9 text-white">
              OFERTAS HALLOWEEN: HASTA 30% + DESCUENTOS EXTRA
            </p>
          </div>
        </div>

        <DeliveryInfo />

      </div>
    </div>
  </div>
</template>


<script>
import DeliveryInfo from "@/components/Banner/DeliveryInfo.vue";

export default {
  name: "MainComponent",
  components: {
    DeliveryInfo,
  },
};
</script>
