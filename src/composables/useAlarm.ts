import { ref, watch } from 'vue';
import type { TimePoint } from '../types';
import { playBeeps } from '../utils/audio';

export function useAlarm(currentSeconds: () => number) {
  const timePoints = ref<TimePoint[]>([]);
  const isFlashing = ref(false);

  watch(
    () => currentSeconds(),
    async (seconds) => {
      let changed = false;
      const updatedPoints = timePoints.value.map(point => {
        if (!point.triggered && seconds >= point.timeInSeconds) {
          changed = true;
          // Trigger alarm asynchronously without blocking the update
          triggerAlarm(point.ringCount);
          return { ...point, triggered: true };
        }
        return point;
      });
      if (changed) {
        timePoints.value = updatedPoints;
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
    timePoints.value = timePoints.value.map(point => ({
      ...point,
      triggered: false,
    }));
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
