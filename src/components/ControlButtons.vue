<template>
  <div class="control-buttons">
    <button 
      v-if="!isRunning" 
      @click="$emit('start')" 
      class="btn btn-start"
    >
      {{ t('control.start') }}
    </button>
    <button 
      v-if="isRunning" 
      @click="$emit('pause')" 
      class="btn btn-pause"
    >
      {{ t('control.pause') }}
    </button>
    <button 
      @click="$emit('reset')" 
      class="btn btn-reset"
    >
      {{ t('control.reset') }}
    </button>
    <button 
      @click="toggleFullscreen" 
      class="btn btn-fullscreen"
    >
      {{ isFullscreen ? t('control.exitFullscreen') : t('control.fullscreen') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  isRunning: boolean;
}>();

defineEmits<{
  start: [];
  pause: [];
  reset: [];
}>();

const isFullscreen = ref(false);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
      .then(() => {
        isFullscreen.value = true;
      })
      .catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
  } else {
    document.exitFullscreen()
      .then(() => {
        isFullscreen.value = false;
      })
      .catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style scoped>
.control-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  text-transform: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn-start {
  background: var(--primary-color);
  color: var(--bg-primary);
}

.btn-start:hover {
  background: var(--btn-start-hover);
}

.btn-pause {
  background: var(--btn-pause-bg);
  color: var(--bg-primary);
}

.btn-pause:hover {
  background: var(--btn-pause-hover);
}

.btn-reset {
  background: var(--btn-reset-bg);
  color: white;
}

.btn-reset:hover {
  background: var(--btn-reset-hover);
}

.btn-fullscreen {
  background: var(--btn-fullscreen-bg);
  color: white;
}

.btn-fullscreen:hover {
  background: var(--btn-fullscreen-hover);
}

@media (max-width: 768px) {
  .control-buttons {
    gap: 0.5rem;
  }
  
  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    min-width: 100px;
  }
}
</style>
