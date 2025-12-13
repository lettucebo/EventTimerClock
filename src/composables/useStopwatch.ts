import { ref, computed } from 'vue';

export function useStopwatch() {
  const isRunning = ref(false);
  const elapsedTime = ref(0); // 毫秒
  let startTime = 0;
  let animationFrameId: number | null = null;

  const formattedTime = computed(() => {
    const totalSeconds = Math.floor(elapsedTime.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  });

  const currentSeconds = computed(() => Math.floor(elapsedTime.value / 1000));

  function update() {
    if (isRunning.value) {
      elapsedTime.value = Date.now() - startTime;
      animationFrameId = requestAnimationFrame(update);
    }
  }

  function start() {
    if (!isRunning.value) {
      isRunning.value = true;
      startTime = Date.now() - elapsedTime.value;
      animationFrameId = requestAnimationFrame(update);
    }
  }

  function pause() {
    isRunning.value = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function reset() {
    pause();
    elapsedTime.value = 0;
  }

  return {
    isRunning,
    elapsedTime,
    formattedTime,
    currentSeconds,
    start,
    pause,
    reset,
  };
}
