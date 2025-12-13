<template>
  <div class="control-buttons">
    <button 
      v-if="!isRunning" 
      @click="$emit('start')" 
      class="btn btn-start"
    >
      開始
    </button>
    <button 
      v-if="isRunning" 
      @click="$emit('pause')" 
      class="btn btn-pause"
    >
      暫停
    </button>
    <button 
      @click="$emit('reset')" 
      class="btn btn-reset"
    >
      重置
    </button>
    <button 
      @click="toggleFullscreen" 
      class="btn btn-fullscreen"
    >
      {{ isFullscreen ? '退出全螢幕' : '全螢幕' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

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
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
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
  background: #00ff88;
  color: #1a1a2e;
}

.btn-start:hover {
  background: #00dd77;
}

.btn-pause {
  background: #ffa500;
  color: #1a1a2e;
}

.btn-pause:hover {
  background: #ff9500;
}

.btn-reset {
  background: #ff4444;
  color: white;
}

.btn-reset:hover {
  background: #dd3333;
}

.btn-fullscreen {
  background: #4444ff;
  color: white;
}

.btn-fullscreen:hover {
  background: #3333dd;
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
