import { ref, inject, provide } from 'vue';
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
  let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;
  let mediaQueryList: MediaQueryList | null = null;

  // Get the effective theme (considering auto mode)
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (currentTheme.value === 'auto') {
      return systemPrefersDark.value ? 'dark' : 'light';
    }
    return currentTheme.value;
  };

  // Load stored theme preference
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

  // Save theme preference
  const saveTheme = (theme: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Detect system theme preference
  const detectSystemTheme = () => {
    if (window.matchMedia) {
      // Create new MediaQueryList
      mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      systemPrefersDark.value = mediaQueryList.matches;

      // Create new listener
      mediaQueryListener = (e: MediaQueryListEvent) => {
        systemPrefersDark.value = e.matches;
        // Only apply theme if in auto mode
        if (currentTheme.value === 'auto') {
          applyTheme();
        }
      };

      // Listen to system theme changes
      mediaQueryList.addEventListener('change', mediaQueryListener);
    }
  };

  // Apply theme to DOM
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

  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    saveTheme(theme);
    applyTheme();
  };

  // Toggle theme (between light and dark)
  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize
  const initTheme = () => {
    loadTheme();
    detectSystemTheme();
    applyTheme();
  };

  // Cleanup function
  const cleanup = () => {
    if (mediaQueryListener && mediaQueryList) {
      mediaQueryList.removeEventListener('change', mediaQueryListener);
      mediaQueryListener = null;
      mediaQueryList = null;
    }
  };

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
