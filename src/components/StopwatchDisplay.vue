<template>
  <div class="stopwatch-display" :class="{ flashing: isFlashing }">
    <div class="time">{{ formattedTime }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  formattedTime: string;
  isFlashing: boolean;
}>();
</script>

<style scoped>
.stopwatch-display {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  background: var(--bg-card);
  border-radius: 1rem;
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;
}

.stopwatch-display.flashing {
  animation: flash 0.5s ease-in-out 2;
}

.time {
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: var(--primary-color);
  text-shadow: 0 0 20px var(--primary-shadow);
  letter-spacing: 0.1em;
}

@keyframes flash {
  0%, 100% {
    background: var(--bg-card);
  }
  50% {
    background: rgba(255, 100, 100, 0.7);
  }
}

@media (max-width: 768px) {
  .stopwatch-display {
    padding: 2rem 1rem;
    margin-bottom: 1rem;
  }
  
  .time {
    font-size: clamp(3rem, 20vw, 6rem);
  }
}
</style>
