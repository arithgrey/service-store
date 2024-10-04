<template>
    <div class="overflow-hidden bg-yellow-300 py-4">
        <div class="flex items-center gap-32 animate-marquee whitespace-nowrap"
            :style="{ animationDuration: animationDuration + 's' }">
            <div class="flex">
                <Truck class="h-6 w-6 text-black mr-2" />
                <span class="text-lg uppercase font-bold text-black">
                    ¡Envío gratis en todos los pedidos!
                </span>
            </div>
            <div class="flex">
                <Truck class="h-6 w-6 text-black mr-2" />
                <span class="text-lg uppercase font-bold text-black">
                    ¡Envío gratis en todos los pedidos!
                </span>
            </div>
            <div class="flex">
                <Truck class="h-6 w-6 text-black mr-2" />
                <span class="text-lg uppercase font-bold text-black">
                    ¡Envío gratis en todos los pedidos!
                </span>
            </div>
            <div class="flex">
                <Truck class="h-6 w-6 text-black mr-2" />
                <span class="text-lg uppercase font-bold text-black">
                    ¡Envío gratis en todos los pedidos!
                </span>
            </div>
            <div class="flex">
                <Truck class="h-6 w-6 text-black mr-2" />
                <span class="text-lg uppercase font-bold text-black">
                    ¡Envío gratis en todos los pedidos!
                </span>
            </div>
            <div class="flex">
                <Truck class="h-6 w-6 text-black mr-2" />
                <span class="text-lg uppercase font-bold text-black">
                    ¡Envío gratis en todos los pedidos!
                </span>
            </div>
            
        </div>
    </div>
</template>

<script>
import Truck from '@/components/icons/Truck.vue';

export default {
    components: {
        Truck
    },
    data() {
        return {
            animationDuration: 20, // Duración de la animación en segundos
        };
    },
};
</script>

<style scoped>
@keyframes marquee {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(-100%);
    }
}

.animate-marquee {
    display: inline-flex;
    animation: marquee linear infinite;
}

/* flex y gap-32 aseguran una gran separación entre los elementos */
.flex {
    display: flex;
}

.gap-32 {
    gap: 8rem;
    /* 32 unidades de espacio (128px) */
}
</style>