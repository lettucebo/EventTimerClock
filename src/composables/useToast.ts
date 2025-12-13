import { ref } from 'vue';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
  function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
    const id = toastId++;
    const toast: Toast = { id, message, type };
    toasts.value.push(toast);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }

  return {
    toasts,
    showToast,
    removeToast,
  };
}
