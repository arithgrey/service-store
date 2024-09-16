<template>
  <div class="flex flex-col items-center justify-center w-full bg-sky-800 p-1">
    <div class="text-center  font-semibold text-white ">
      En {{ hours }} horas, {{ minutes }} minutos y {{ seconds }} segundos termina la oferta
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
