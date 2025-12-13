<template>
  <div class="time-point-editor">
    <h3>{{ t('alarm.addTimePoint') }}</h3>
    <div class="editor-form">
      <div class="form-group">
        <label>{{ t('alarm.timeLabel') }}</label>
        <div class="time-input">
          <input 
            v-model.number="minutes" 
            type="number" 
            min="0" 
            max="999"
            :placeholder="t('alarm.minutesPlaceholder')"
          />
          <span>:</span>
          <input 
            v-model.number="seconds" 
            type="number" 
            min="0" 
            max="59"
            :placeholder="t('alarm.secondsPlaceholder')"
          />
        </div>
      </div>
      <div class="form-group">
        <label>{{ t('alarm.ringCountLabel') }}</label>
        <input 
          v-model.number="ringCount" 
          type="number" 
          :min="MIN_RING_COUNT" 
          :max="MAX_RING_COUNT"
        />
      </div>
      <button @click="addPoint" class="btn btn-add">{{ t('alarm.add') }}</button>
    </div>
    
    <div v-if="timePoints.length > 0" class="points-list">
      <h3>{{ t('alarm.settedTimePoints') }}</h3>
      <ul>
        <li v-for="point in sortedPoints" :key="point.id" class="point-item">
          <span class="point-time">{{ formatTime(point.timeInSeconds) }}</span>
          <span class="point-rings">{{ point.ringCount }}{{ t('alarm.ringsCount') }}</span>
          <span v-if="point.triggered" class="point-status">{{ t('alarm.triggered') }}</span>
          <button @click="$emit('remove', point.id)" class="btn-remove">{{ t('alarm.remove') }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TimePoint } from '../types';
import { useToast } from '../composables/useToast';

// Constants
const MIN_RING_COUNT = 1;
const MAX_RING_COUNT = 5;

const { t } = useI18n();
const { showToast } = useToast();

const props = defineProps<{
  timePoints: TimePoint[];
}>();

const emit = defineEmits<{
  add: [timeInSeconds: number, ringCount: number];
  remove: [id: string];
}>();

const minutes = ref(1);
const seconds = ref(0);
const ringCount = ref(2); // Default to mid-range value for better UX

const sortedPoints = computed(() => {
  return [...props.timePoints].sort((a, b) => a.timeInSeconds - b.timeInSeconds);
});

function addPoint() {
  const totalSeconds = (minutes.value || 0) * 60 + (seconds.value || 0);
  
  if (totalSeconds <= 0) {
    showToast(t('toast.timeGreaterThanZero'), 'error');
    return;
  }
  
  if (ringCount.value < MIN_RING_COUNT || ringCount.value > MAX_RING_COUNT) {
    showToast(t('toast.ringCountRange', { min: MIN_RING_COUNT, max: MAX_RING_COUNT }), 'error');
    return;
  }
  
  emit('add', totalSeconds, ringCount.value);
  // 重置表單
  minutes.value = 1;
  seconds.value = 0;
  ringCount.value = 2;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}
</script>

<style scoped>
.time-point-editor {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #00ff88;
}

.editor-form {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #ccc;
}

.time-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time-input input {
  width: 70px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.time-input span {
  color: #00ff88;
  font-size: 1.2rem;
}

.form-group input[type="number"] {
  width: 100px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}

input:focus {
  outline: none;
  border-color: #00ff88;
}

.btn-add {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  background: #00ff88;
  color: #1a1a2e;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-add:hover {
  background: #00dd77;
}

.points-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.point-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.point-time {
  font-weight: 600;
  color: #00ff88;
  min-width: 60px;
}

.point-rings {
  color: #ccc;
  flex: 1;
}

.point-status {
  color: #ffa500;
  font-size: 0.8rem;
}

.btn-remove {
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-remove:hover {
  background: #dd3333;
}

@media (max-width: 768px) {
  .editor-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-group input[type="number"],
  .time-input input {
    width: 100%;
  }
  
  .point-item {
    flex-wrap: wrap;
  }
}
</style>
