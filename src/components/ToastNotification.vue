<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
      >
        {{ toast.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast';

const { toasts } = useToast();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  min-width: 250px;
  pointer-events: auto;
}

.toast-success {
  background: #00ff88;
  color: #1a1a2e;
}

.toast-error {
  background: #ff4444;
  color: white;
}

.toast-info {
  background: #4444ff;
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 768px) {
  .toast-container {
    top: 1rem;
    right: 1rem;
    left: 1rem;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>
