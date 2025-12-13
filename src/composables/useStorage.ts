import { ref, watch } from 'vue';
import type { Preset } from '../types';

const STORAGE_KEY = 'event-timer-presets';

export function useStorage() {
  const customPresets = ref<Preset[]>([]);

  // 載入自訂預設模板
  function loadCustomPresets() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        customPresets.value = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load custom presets:', error);
    }
  }

  // 儲存自訂預設模板
  function saveCustomPresets() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets.value));
    } catch (error) {
      console.error('Failed to save custom presets:', error);
    }
  }

  // 新增自訂預設
  function addCustomPreset(preset: Preset) {
    customPresets.value.push(preset);
    saveCustomPresets();
  }

  // 刪除自訂預設
  function removeCustomPreset(id: string) {
    const index = customPresets.value.findIndex(p => p.id === id);
    if (index !== -1) {
      customPresets.value.splice(index, 1);
      saveCustomPresets();
    }
  }

  // 更新自訂預設
  function updateCustomPreset(preset: Preset) {
    const index = customPresets.value.findIndex(p => p.id === preset.id);
    if (index !== -1) {
      customPresets.value[index] = preset;
      saveCustomPresets();
    }
  }

  // 監聽變化自動儲存
  watch(customPresets, () => {
    saveCustomPresets();
  }, { deep: true });

  // 初始化載入
  loadCustomPresets();

  return {
    customPresets,
    addCustomPreset,
    removeCustomPreset,
    updateCustomPreset,
  };
}
