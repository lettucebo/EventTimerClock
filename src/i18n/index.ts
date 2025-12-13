import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW'
import en from './locales/en'

// 支援的語言列表
export const SUPPORTED_LOCALES = ['zh-TW', 'en'] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// 從瀏覽器取得語言，fallback 到繁體中文
function getBrowserLocale(): SupportedLocale {
  const browserLang = navigator.language
  
  // 完全匹配
  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale
  }
  
  // 語言碼匹配 (例如: zh-CN, zh-HK -> zh-TW)
  const langCode = browserLang.split('-')[0]
  for (const locale of SUPPORTED_LOCALES) {
    if (locale.split('-')[0] === langCode) {
      return locale
    }
  }
  
  // 預設使用繁體中文
  return 'zh-TW'
}

// 從 localStorage 取得使用者選擇的語言，或使用瀏覽器語言
function getInitialLocale(): SupportedLocale {
  const stored = localStorage.getItem('user-locale')
  if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
    return stored as SupportedLocale
  }
  return getBrowserLocale()
}

// 儲存語言選擇到 localStorage
export function saveLocale(locale: SupportedLocale) {
  localStorage.setItem('user-locale', locale)
}

// 建立 i18n 實例
export const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getInitialLocale(),
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    'en': en
  }
})
