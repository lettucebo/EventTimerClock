import { ref, watch } from 'vue';
import type { TimePoint } from '../types';
import { playBeeps } from '../utils/audio';

export function useAlarm(currentSeconds: () => number) {
  const timePoints = ref<TimePoint[]>([]);
  const isFlashing = ref(false);

  watch(
    () => currentSeconds(),
    async (seconds) => {
      for (const point of timePoints.value) {
        if (!point.triggered && seconds >= point.timeInSeconds) {
          point.triggered = true;
          await triggerAlarm(point.ringCount);
        }
      }
    }
  );

  async function triggerAlarm(ringCount: number) {
    // 播放響鈴
    await playBeeps(ringCount);
    
    // 視覺化閃爍效果
    isFlashing.value = true;
    setTimeout(() => {
      isFlashing.value = false;
    }, 1000);
  }

  function addTimePoint(timeInSeconds: number, ringCount: number) {
    const newPoint: TimePoint = {
      id: crypto.randomUUID(),
      timeInSeconds,
      ringCount,
      triggered: false,
    };
    timePoints.value.push(newPoint);
    timePoints.value.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  }

  function removeTimePoint(id: string) {
    const index = timePoints.value.findIndex(p => p.id === id);
    if (index !== -1) {
      timePoints.value.splice(index, 1);
    }
  }

  function clearTimePoints() {
    timePoints.value = [];
  }

  function resetTriggers() {
    timePoints.value.forEach(point => {
      point.triggered = false;
    });
  }

  function setTimePoints(points: TimePoint[]) {
    timePoints.value = points.map(p => ({ ...p, triggered: false }));
  }

  return {
    timePoints,
    isFlashing,
    addTimePoint,
    removeTimePoint,
    clearTimePoints,
    resetTriggers,
    setTimePoints,
  };
}
