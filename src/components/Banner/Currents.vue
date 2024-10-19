<template>
  <div class="grid grid-cols-2 gap-x-4">
    <div class="group relative text-sm">
      <router-link :to="{ name: 'product-list', hash: '#top-sellers' }">
        <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
          <img
            src="/images/04.jpg"
            alt="Las fotos de referencias, nuestros clientes"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="absolute inset-0 z-10" aria-hidden="true" />
        Ya sabes los top
      </router-link>
    </div>

    <div class="group relative text-sm">
      <router-link :to="{ name: 'referencias' }">
        <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
          <img
            src="/images/05.jpg"
            alt="Las fotos de referencias, nuestros clientes"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="absolute inset-0 z-10" aria-hidden="true" />
        Las referencias
      </router-link>
    </div>

    <div class="group relative text-sm">
      <router-link :to="{ name: 'impact' }">
        <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
          <img
            src="/images/nosotros.png"
            alt="Las fotos de referencias, nuestros clientes"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="absolute inset-0 z-10" aria-hidden="true" />
        Nosotros 
      </router-link>
    </div>
    <div class="group relative text-sm">
      <router-link :to="{ name: 'experiencia' }">
        <div class="aspect-square overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
          <img
            src="/images/comprar.png"
            alt="Las fotos de referencias, nuestros clientes"
            class="w-full h-full object-cover"
          />
        </div>
        <span class="absolute inset-0 z-10" aria-hidden="true" />
        Como comprar 
      </router-link>
    </div>

  </div>
</template>
