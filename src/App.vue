<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <div class="title-section">
          <h1>⏱️ {{ t('app.title') }}</h1>
          <p class="subtitle">{{ t('app.subtitle') }}</p>
        </div>
        <div class="header-controls">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <main class="app-main">
      <StopwatchDisplay 
        :formatted-time="formattedTime"
        :is-flashing="isFlashing"
      />
      
      <ControlButtons 
        :is-running="isRunning"
        @start="start"
        @pause="pause"
        @reset="() => { reset(); resetTriggers(); }"
      />

      <AlarmSettings 
        :time-points="timePoints"
        :custom-presets="customPresets"
        @select-preset="(preset: Preset) => { clearTimePoints(); setTimePoints(preset.timePoints); }"
        @add-time-point="addTimePoint"
        @remove-time-point="removeTimePoint"
        @clear-time-points="clearTimePoints"
        @save-custom-preset="addCustomPreset"
        @delete-custom-preset="removeCustomPreset"
      />
    </main>

    <footer class="app-footer">
      <p>{{ t('app.footer') }}</p>
    </footer>

    <ToastNotification />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Preset } from './types';
import { useStopwatch } from './composables/useStopwatch';
import { useAlarm } from './composables/useAlarm';
import { useStorage } from './composables/useStorage';
import { provideTheme } from './composables/useTheme';
import StopwatchDisplay from './components/StopwatchDisplay.vue';
import ControlButtons from './components/ControlButtons.vue';
import AlarmSettings from './components/AlarmSettings.vue';
import ToastNotification from './components/ToastNotification.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import ThemeSwitcher from './components/ThemeSwitcher.vue';

const { t } = useI18n();

// Initialize theme
const theme = provideTheme();
onMounted(() => {
  theme.initTheme();
});

onUnmounted(() => {
  theme.cleanup();
});

// Stopwatch logic
const { 
  isRunning, 
  formattedTime, 
  currentSeconds,
  start, 
  pause, 
  reset 
} = useStopwatch();

// Alarm logic
const { 
  timePoints, 
  isFlashing,
  addTimePoint,
  removeTimePoint,
  clearTimePoints,
  resetTriggers,
  setTimePoints,
} = useAlarm(() => currentSeconds.value);

// Storage logic
const {
  customPresets,
  addCustomPreset,
  removeCustomPreset,
} = useStorage();
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.app-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.title-section {
  text-align: center;
  flex: 1;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.app-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0;
  color: #00ff88;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-tertiary);
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
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .app {
    padding: 1rem;
  }
  
  .app-header {
    margin-bottom: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .title-section {
    width: 100%;
  }
  
  .header-controls {
    flex-direction: column;
    width: 100%;
  }
}
</style>
