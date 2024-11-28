<template>
  <div>
    <!-- Renderiza dinámicamente el banner según la temporada -->
    <component :is="currentBanner" />
    <component :is="currentBannerOffert" />
    <div class="mx-auto xs:w-full md:w-10/12 p-5 md:p-0">
      <ProductList @open_shopping_cart_product_list="handleOpenCartProductList" />
    </div>
    <div class="mx-auto xs:w-full">
      <TrusthHome />
      <FreeDelivery />
      <component :is="currentCommunity" />
    </div>
  </div>
</template>

<script>
import ProductList from "@/components/Products/ProductList.vue";
import { getSeasonalContent } from "@/helpers/SeasonalHelper.js";
import BannerOffertRunning from "@/components/Banner/BannerOffertRunning.vue";
import BannerOffertHalloween from "@/components/Banner/BannerOffertHalloween.vue";
import BannerOffertChristmas from "@/components/Banner/BannerOffertChristmas.vue";

import TrusthHome from "@/components/Trusth/TrusthHome.vue";
import FreeDelivery from "@/components/Trusth/FreeDelivery.vue";
import Running from "@/components/Video/Running.vue";
import Halloweeen from "@/components/Video/Halloween.vue";
import Christmas from "@/components/Video/Christmas.vue";
import CommunityHalloween from "@/components/Video/CommunityHalloween.vue";
import CommunityChristmas from "@/components/Video/CommunityChristmas.vue";
import CommunityRunning from "@/components/Video/CommunityRunning.vue";

export default {
  components: {
    ProductList,
    BannerOffertRunning,
    BannerOffertHalloween,
    BannerOffertChristmas,
    TrusthHome,
    FreeDelivery,
    Running,
    Halloweeen,
    Christmas,
    CommunityHalloween,
    CommunityChristmas,
    CommunityRunning,
  },
  data() {
    return {
      // Por defecto, el banner  y community estándar
      currentBanner: "Running", 
      currentCommunity: "CommunityRunning",
      currentBannerOffert: "BannerOffertRunning",
    };
  },
  mounted() {
    this.updateSeasonalContent();
  },
  methods: {
    handleOpenCartProductList() {
      this.$emit("open_shopping_cart_product_list");
    },

    updateSeasonalContent() {
      const seasonalContent = getSeasonalContent();
      this.currentBanner = seasonalContent.banner;
      this.currentCommunity = seasonalContent.community;
      this.currentBannerOffert = seasonalContent.banner_offert;
    },
  },
};
</script>
