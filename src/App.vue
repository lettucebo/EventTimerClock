<template>
  <div class="app">
    <header class="app-header">
      <h1>⏱️ Event Timer Clock</h1>
      <p class="subtitle">活動倒數計時器</p>
    </header>

    <main class="app-main">
      <StopwatchDisplay 
        :formatted-time="formattedTime"
        :is-flashing="isFlashing"
      />
      
      <ControlButtons 
        :is-running="isRunning"
        @start="handleStart"
        @pause="handlePause"
        @reset="handleReset"
      />

      <AlarmSettings 
        :time-points="timePoints"
        :custom-presets="customPresets"
        @select-preset="handleSelectPreset"
        @add-time-point="handleAddTimePoint"
        @remove-time-point="handleRemoveTimePoint"
        @clear-time-points="handleClearTimePoints"
        @save-custom-preset="handleSaveCustomPreset"
        @delete-custom-preset="handleDeleteCustomPreset"
      />
    </main>

    <footer class="app-footer">
      <p>使用 Vue 3 + Vite + TypeScript 建立</p>
    </footer>

    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import type { Preset } from './types';
import { useStopwatch } from './composables/useStopwatch';
import { useAlarm } from './composables/useAlarm';
import { useStorage } from './composables/useStorage';
import StopwatchDisplay from './components/StopwatchDisplay.vue';
import ControlButtons from './components/ControlButtons.vue';
import AlarmSettings from './components/AlarmSettings.vue';
import ToastNotification from './components/ToastNotification.vue';

// 碼錶邏輯
const { 
  isRunning, 
  formattedTime, 
  currentSeconds,
  start, 
  pause, 
  reset 
} = useStopwatch();

// 響鈴邏輯
const { 
  timePoints, 
  isFlashing,
  addTimePoint,
  removeTimePoint,
  clearTimePoints,
  resetTriggers,
  setTimePoints,
} = useAlarm(() => currentSeconds.value);

// 儲存邏輯
const {
  customPresets,
  addCustomPreset,
  removeCustomPreset,
} = useStorage();

// 控制按鈕處理
function handleStart() {
  start();
}

function handlePause() {
  pause();
}

function handleReset() {
  reset();
  resetTriggers();
}

// 預設模板處理
function handleSelectPreset(preset: Preset) {
  clearTimePoints();
  setTimePoints(preset.timePoints);
}

// 時間點處理
function handleAddTimePoint(timeInSeconds: number, ringCount: number) {
  addTimePoint(timeInSeconds, ringCount);
}

function handleRemoveTimePoint(id: string) {
  removeTimePoint(id);
}

function handleClearTimePoints() {
  clearTimePoints();
}

// 自訂模板處理
function handleSaveCustomPreset(preset: Preset) {
  addCustomPreset(preset);
}

function handleDeleteCustomPreset(id: string) {
  removeCustomPreset(id);
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0;
  color: #00ff88;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: #aaa;
  margin: 0.5rem 0 0;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  text-align: center;
  padding: 2rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .app-header {
    margin-bottom: 1rem;
  }
}
</style>
