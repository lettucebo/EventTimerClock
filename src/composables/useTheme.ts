import { ref, watch, inject, provide } from 'vue';
import type { InjectionKey, Ref } from 'vue';

export type Theme = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'user-theme';

export interface ThemeState {
  currentTheme: Ref<Theme>;
  effectiveTheme: () => 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
  cleanup: () => void;
}

export const ThemeKey: InjectionKey<ThemeState> = Symbol('theme');

export function createTheme(): ThemeState {
  const currentTheme = ref<Theme>('auto');
  const systemPrefersDark = ref(false);
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
      const validThemes: Theme[] = ['light', 'dark', 'auto'];
      if (stored && validThemes.includes(stored as Theme)) {
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
  let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;
  
  const detectSystemTheme = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemPrefersDark.value = mediaQuery.matches;

      // 移除舊的監聽器（如果存在）
      if (mediaQueryListener) {
        mediaQuery.removeEventListener('change', mediaQueryListener);
      }

      // 建立新的監聽器
      mediaQueryListener = (e: MediaQueryListEvent) => {
        systemPrefersDark.value = e.matches;
        applyTheme();
      };

      // 監聽系統主題變化
      mediaQuery.addEventListener('change', mediaQueryListener);
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

  // 清理函式
  const cleanup = () => {
    if (mediaQueryListener && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.removeEventListener('change', mediaQueryListener);
      mediaQueryListener = null;
    }
  };

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
    cleanup,
  };
}

export function provideTheme() {
  const theme = createTheme();
  provide(ThemeKey, theme);
  return theme;
}

export function useTheme(): ThemeState {
  const theme = inject(ThemeKey);
  if (!theme) {
    throw new Error('useTheme must be used within a component that has called provideTheme');
  }
  return theme;
}
