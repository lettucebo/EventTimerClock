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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SupportedLocale } from '../i18n'
import { saveLocale } from '../i18n'

const { locale, t } = useI18n()
const currentLocale = ref<SupportedLocale>(locale.value as SupportedLocale)

// 監聽 locale 變化，同步更新 currentLocale
watch(locale, (newLocale) => {
  currentLocale.value = newLocale as SupportedLocale
})

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
  color: #ccc;
  font-size: 0.9rem;
}

.language-select {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-select:hover {
  border-color: #00ff88;
}

.language-select:focus {
  outline: none;
  border-color: #00ff88;
  box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
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
