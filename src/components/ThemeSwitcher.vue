<template>
  <div class="theme-switcher">
    <label for="theme-select">{{ t('theme.label') }}:</label>
    <select 
      id="theme-select"
      v-model="currentTheme" 
      @change="changeTheme"
      class="theme-select"
    >
      <option value="light">{{ t('theme.light') }}</option>
      <option value="dark">{{ t('theme.dark') }}</option>
      <option value="auto">{{ t('theme.auto') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getThemeInstance } from '../composables/useTheme'
import type { Theme } from '../composables/useTheme'

const { t } = useI18n()
const themeInstance = getThemeInstance()
const currentTheme = ref<Theme>(themeInstance.currentTheme.value)

// 同步主題變化
watch(() => themeInstance.currentTheme.value, (newTheme) => {
  currentTheme.value = newTheme
})

function changeTheme() {
  themeInstance.setTheme(currentTheme.value)
}
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.theme-switcher label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.theme-select {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-select:hover {
  border-color: var(--border-hover);
}

.theme-select:focus {
  outline: none;
  border-color: var(--border-hover);
  box-shadow: 0 0 5px var(--primary-shadow-light);
}

@media (max-width: 768px) {
  .theme-switcher {
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
  }
  
  .theme-select {
    width: 100%;
  }
}
</style>
