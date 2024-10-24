<template>
  <div class="bg-gradient-to-r from-blue-950 to-purple-500 text-white shadow-lg flex flex-col lg:flex-row items-center justify-between">
    <!-- Sección de texto -->
    <div class="w-full lg:w-1/2 p-6 text-center">
      <h2 class="text-2xl lg:text-4xl font-bold mb-4">Compártenos en Instagram y Facebook las fotos de tu transformación</h2>
      <div class="flex justify-center space-x-6">
        <!-- Ícono de Instagram más grande -->
        <a href="https://www.instagram.com/enid_service/" target="_blank" class="hover:text-gray-300 flex items-center space-x-2">
          <i class="fab fa fa-instagram text-2xl lg:text-3xl" aria-hidden="true"></i>
          <span>#enid_service</span>
        </a>
        <!-- Ícono de Facebook más grande -->
        <a href="https://www.facebook.com/enidservicemx/" target="_blank" class="hover:text-gray-300 flex items-center space-x-2">
          <i class="fab fa-facebook-square text-2xl lg:text-3xl" aria-hidden="true"></i>
          <span>@enidservice</span>
        </a>
      </div>
      <p class="text-sm mt-5">No olvides usar el <span class="font-bold">#enidservice</span> para etiquetarnos.</p>
    </div>

    <!-- Sección de imagen -->
    <div class="w-full lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0 p-0">
      <img src="/images/share.png" alt="Transformación Enid Service" class="w-full h-auto shadow-lg">
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialShare',
};
</script>
