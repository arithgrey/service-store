<template>
    <div>
        <div class="relative h-screen bg-gray-900">
            <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay muted loop playsinline ref="video">
                <source src="@/assets/cdmx.mp4" type="video/mp4" />
            </video>
        </div>

        <div class="no-pares bg-gray-950 p-5">
            <div class="grid text-center">
                <h3 class="text-5xl font-bold text-white uppercase">
                    Aún con dificultades
                </h3>
                <h3 class="text-5xl font-bold uppercase">
                    <span class="animate-pulse text-yellow-500">no abandones</span> <span class="text-white"> tus
                        objetivos
                    </span>
                </h3>
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-stretch bg-black">
            <img src="@/assets/images/playa-3.jpg" alt="Playa" class="w-full md:w-1/2 h-auto object-cover " />
            <div class="w-full md:w-1/2 pl-0 md:pl-5 bg-cream-100 p-5 flex flex-col justify-center">
                <h3 class="text-5xl font-bold uppercase mb-4 p-3 text-white">
                    Ser fitness debe ser tu decisión
                </h3>
                <p class="text-2xl text-white p-3">Creemos que el entorno, las multitudes en los gimnasios o el tráfico
                    no
                    deberían ser obstáculos
                    en tu rutina diaria.
                </p>
            </div>
        </div>
        <div class="relative h-screen">
            <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay muted loop playsinline ref="video">
                <source src="@/assets/dieta.mp4" type="video/mp4" />
            </video>
            <div class="absolute top-3/4 left-10  text-white bg-gray-950 p-3 ">
                <h1 class="text-5xl font-bold uppercase mb-4  text-white">
                    Equipamos a los que buscan llevar <br> su rendimiento al máximo en su hogar
                </h1>
            </div>
        </div>
        <div class="flex flex-col md:flex-row items-stretch bg-black">
            <img src="@/assets/images/playa-2.jpeg" alt="Playa" class="w-full md:w-1/2 h-auto object-cover " />
            <div class="w-full md:w-1/2 pl-0 md:pl-5 bg-cream-100 p-5 flex flex-col justify-center">
                <h3 class="text-5xl font-bold uppercase mb-4 p-3 text-white">
                    Distruta la transformación mientras te impulsas a conseguir nuevas experiencias.
                </h3>
            </div>
        </div>
        <router-link :to="{ name: 'product-list' }">

            <div class="relative h-screen">
                <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay muted loop playsinline
                    ref="video">
                    <source src="@/assets/halloween-4.mp4" type="video/mp4" />
                </video>
                <div class="absolute top-3/4 left-10  text-white bg-gray-950 p-3 ">
                    <h1 class="text-5xl font-bold uppercase mb-4  text-white">
                        Aprovecha las promos de<br> la temporada de Día de Muertos.
                    </h1>
                </div>
            </div>
        </router-link>
    </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.animate-pulse {
    animation: pulse 1s infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.7;
    }
}
</style>
