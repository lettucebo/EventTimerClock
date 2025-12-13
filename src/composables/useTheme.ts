import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'user-theme';
const currentTheme = ref<Theme>('auto');
const systemPrefersDark = ref(false);

export function useTheme() {
  // 獲取實際應用的主題（考慮 auto 模式）
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (currentTheme.value === 'auto') {
      return systemPrefersDark.value ? 'dark' : 'light';
    }
    return currentTheme.value;
  };

  // 載入儲存的主題偏好
  const loadTheme = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'auto')) {
        currentTheme.value = stored as Theme;
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  // 儲存主題偏好
  const saveTheme = (theme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // 檢測系統主題偏好
  const detectSystemTheme = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemPrefersDark.value = mediaQuery.matches;

      // 監聽系統主題變化
      mediaQuery.addEventListener('change', (e) => {
        systemPrefersDark.value = e.matches;
        applyTheme();
      });
    }
  };

  // 應用主題到 DOM
  const applyTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    const root = document.documentElement;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  };

  // 設定主題
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    saveTheme(theme);
    applyTheme();
  };

  // 切換主題（在 light 和 dark 之間切換）
  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // 初始化
  const initTheme = () => {
    loadTheme();
    detectSystemTheme();
    applyTheme();
  };

  // 監聽主題變化
  watch(currentTheme, () => {
    applyTheme();
  });

  // 監聽系統主題變化（當使用 auto 模式時）
  watch(systemPrefersDark, () => {
    if (currentTheme.value === 'auto') {
      applyTheme();
    }
  });

  return {
    currentTheme,
    effectiveTheme: getEffectiveTheme,
    setTheme,
    toggleTheme,
    initTheme,
  };
}

// 單例模式：確保所有組件共享同一個主題狀態
let themeInstance: ReturnType<typeof useTheme> | null = null;

export function getThemeInstance() {
  if (!themeInstance) {
    themeInstance = useTheme();
  }
  return themeInstance;
}
