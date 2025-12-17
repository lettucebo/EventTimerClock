import type { TimePoint, AutoAlarmSettings } from '../types';
import { ref, watch } from 'vue';
import { playRingtone } from '../utils/audio';
import { useRingtoneStorage } from './useRingtoneStorage';
import { playBeeps } from '../utils/audio';

// Default auto alarm settings
function createDefaultAutoAlarm(): AutoAlarmSettings {
  return {
    enabled: false,
    intervalSeconds: 60,
    ringCount: 3,
    maxTriggers: 3,
    triggeredCount: 0,
    lastTriggeredAt: 0,
  };
}

export function useAlarm(currentSeconds: () => number) {
  const timePoints = ref<TimePoint[]>([]);
  const autoAlarm = ref<AutoAlarmSettings>(createDefaultAutoAlarm());
  const isFlashing = ref(false);
  const { selectedRingtone } = useRingtoneStorage();

  watch(
    () => currentSeconds(),
    async (seconds) => {
      // Handle time points
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

      // Handle auto alarm after all time points are triggered
      if (autoAlarm.value.enabled && timePoints.value.length > 0) {
        const allTriggered = timePoints.value.every(p => p.triggered);
        const maxTime = Math.max(...timePoints.value.map(p => p.timeInSeconds));
        
        if (allTriggered && seconds > maxTime) {
          const timeSinceMax = seconds - maxTime;
          const interval = autoAlarm.value.intervalSeconds;
          const expectedTriggers = Math.floor(timeSinceMax / interval);
          
          if (expectedTriggers > autoAlarm.value.triggeredCount && 
              autoAlarm.value.triggeredCount < autoAlarm.value.maxTriggers) {
            // Trigger auto alarm
            triggerAlarm(autoAlarm.value.ringCount);
            autoAlarm.value.triggeredCount++;
            autoAlarm.value.lastTriggeredAt = seconds;
          }
        }
      }
    }
  );

  async function triggerAlarm(ringCount: number) {
    // 播放響鈴 (使用選取的鈴聲)
    await playRingtone(selectedRingtone.value, ringCount);
    
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
    // Reset auto alarm triggers
    autoAlarm.value.triggeredCount = 0;
    autoAlarm.value.lastTriggeredAt = 0;
  }

  function setTimePoints(points: TimePoint[]) {
    timePoints.value = points.map(p => ({ ...p, triggered: false }));
  }

  function setAutoAlarm(settings: AutoAlarmSettings) {
    autoAlarm.value = { ...settings, triggeredCount: 0, lastTriggeredAt: 0 };
  }

  function updateAutoAlarm(settings: Partial<AutoAlarmSettings>) {
    autoAlarm.value = { ...autoAlarm.value, ...settings };
  }

  function resetAutoAlarm() {
    autoAlarm.value = createDefaultAutoAlarm();
  }

  return {
    timePoints,
    autoAlarm,
    isFlashing,
    addTimePoint,
    removeTimePoint,
    clearTimePoints,
    resetTriggers,
    setTimePoints,
    setAutoAlarm,
    updateAutoAlarm,
    resetAutoAlarm,
  };
}
