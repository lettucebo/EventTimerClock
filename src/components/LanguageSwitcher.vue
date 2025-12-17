<template>
  <div class="language-switcher">
    <label for="language-select">{{ t('language.label') }}:</label>
    <select 
      id="language-select"
      v-model="currentLocale" 
      @change="changeLocale"
      class="language-select"
    >
      <option value="zh-TW">{{ t('language.zhTW') }}</option>
      <option value="en">{{ t('language.en') }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SupportedLocale } from '../i18n'
import { saveLocale } from '../i18n'

const { locale, t } = useI18n()
const currentLocale = ref<SupportedLocale>(locale.value as SupportedLocale)

function changeLocale() {
  locale.value = currentLocale.value
  saveLocale(currentLocale.value)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.language-switcher label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.language-select {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-select option {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.language-select:hover {
  border-color: var(--border-hover);
}

.language-select:focus {
  outline: none;
  border-color: var(--border-hover);
  box-shadow: 0 0 5px var(--primary-shadow-light);
}

@media (max-width: 768px) {
  .language-switcher {
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
  }
  
  .language-select {
    width: 100%;
  }
}
</style>
