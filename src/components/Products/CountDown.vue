<template>
  <div class="text-gray-950 bg-stone-100 mt-5 p-2">
    <div class="flex h-7 items-center justify-center text-sm font-extrabold bg-stone-100">
      En {{ hours }} horas, {{ minutes }} minutos y {{ seconds }} segundos <span class="underline ml-1"> termina la oferta</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeLeft: 11545,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  },
  created() {
    this.startCountdown();
  },
  methods: {
    startCountdown() {
      this.updateTime();
      const countdownInterval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          this.updateTime();
        } else {
          clearInterval(countdownInterval);
        }
      }, 1000);
    },
    updateTime() {
      this.hours = Math.floor(this.timeLeft / 3600);
      this.minutes = Math.floor((this.timeLeft % 3600) / 60);
      this.seconds = this.timeLeft % 60;
    },
  },
};
</script>
