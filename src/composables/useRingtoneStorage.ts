import { ref, watch, computed } from 'vue';
import type { Ringtone, RingtoneSettings } from '../types';
import { PRESET_RINGTONES, DEFAULT_RINGTONE_ID } from '../utils/audio';

const STORAGE_KEY = 'event-timer-ringtone-settings';

// Maximum file size for custom ringtones (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed audio formats
const ALLOWED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function useRingtoneStorage() {
  const selectedRingtoneId = ref<string>(DEFAULT_RINGTONE_ID);
  const customRingtones = ref<Ringtone[]>([]);

  // Load settings from localStorage
  function loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings: RingtoneSettings = JSON.parse(stored);
        selectedRingtoneId.value = settings.selectedRingtoneId || DEFAULT_RINGTONE_ID;
        customRingtones.value = settings.customRingtones || [];
      }
    } catch (error) {
      console.error('Failed to load ringtone settings:', error);
    }
  }

  // Save settings to localStorage
  function saveSettings() {
    try {
      const settings: RingtoneSettings = {
        selectedRingtoneId: selectedRingtoneId.value,
        customRingtones: customRingtones.value,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save ringtone settings:', error);
    }
  }

  // Get all available ringtones (preset + custom)
  const allRingtones = computed<Ringtone[]>(() => {
    const presets: Ringtone[] = PRESET_RINGTONES.map(preset => ({
      id: preset.id,
      name: preset.nameKey,  // Will be translated in the component
      type: 'preset' as const,
    }));
    return [...presets, ...customRingtones.value];
  });

  // Get the currently selected ringtone
  const selectedRingtone = computed<Ringtone | null>(() => {
    return allRingtones.value.find(r => r.id === selectedRingtoneId.value) || null;
  });

  // Select a ringtone
  function selectRingtone(id: string) {
    const ringtone = allRingtones.value.find(r => r.id === id);
    if (ringtone) {
      selectedRingtoneId.value = id;
    }
  }

  // Validate file before upload
  function validateFile(file: File): FileValidationResult {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'fileTooLarge',  // i18n key
      };
    }

    // Check file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: 'invalidFormat',  // i18n key
      };
    }

    return { valid: true };
  }

  // Add a custom ringtone
  async function addCustomRingtone(file: File, name: string): Promise<FileValidationResult> {
    const validation = validateFile(file);
    if (!validation.valid) {
      return validation;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result as string;
        const ringtone: Ringtone = {
          id: 'custom-' + crypto.randomUUID(),
          name,
          type: 'custom',
          data,
        };
        customRingtones.value.push(ringtone);
        resolve({ valid: true });
      };
      reader.onerror = () => {
        resolve({ valid: false, error: 'readError' });
      };
      reader.readAsDataURL(file);
    });
  }

  // Remove a custom ringtone
  function removeCustomRingtone(id: string) {
    const index = customRingtones.value.findIndex(r => r.id === id);
    if (index !== -1) {
      // If this was the selected ringtone, switch to default
      if (selectedRingtoneId.value === id) {
        selectedRingtoneId.value = DEFAULT_RINGTONE_ID;
      }
      customRingtones.value.splice(index, 1);
    }
  }

  // Watch for changes and save
  watch([selectedRingtoneId, customRingtones], () => {
    saveSettings();
  }, { deep: true });

  // Initialize
  loadSettings();

  return {
    selectedRingtoneId,
    selectedRingtone,
    customRingtones,
    allRingtones,
    selectRingtone,
    addCustomRingtone,
    removeCustomRingtone,
    validateFile,
    MAX_FILE_SIZE,
    ALLOWED_FORMATS,
  };
}
