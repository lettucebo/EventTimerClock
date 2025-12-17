import { ref, watch, computed } from 'vue';
import type { Ringtone, RingtoneSettings } from '../types';
import { PRESET_RINGTONES, DEFAULT_RINGTONE_ID, stopCurrentAudio } from '../utils/audio';

const STORAGE_KEY = 'event-timer-ringtone-settings';

// Maximum file size for custom ringtones (512KB to avoid localStorage quota issues)
const MAX_FILE_SIZE = 512 * 1024;

// Maximum name length for custom ringtones
const MAX_NAME_LENGTH = 50;

// Maximum characters to show in error preview
const ERROR_PREVIEW_MAX_LENGTH = 200;

// Legacy DOMException codes for quota exceeded errors in older browsers
const LEGACY_QUOTA_EXCEEDED_CODE_WEBKIT = 22;
const LEGACY_QUOTA_EXCEEDED_CODE_FIREFOX = 1014;

// Allowed audio formats (MIME types)
export const ALLOWED_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Singleton state - shared across all usages
const selectedRingtoneId = ref<string>(DEFAULT_RINGTONE_ID);
const customRingtones = ref<Ringtone[]>([]);
let isInitialized = false;

export function useRingtoneStorage() {

  // Load settings from localStorage
  function loadSettings() {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const settings: RingtoneSettings = JSON.parse(stored);
        selectedRingtoneId.value = settings.selectedRingtoneId || DEFAULT_RINGTONE_ID;
        customRingtones.value = settings.customRingtones || [];
      }
    } catch (error) {
      const storedValuePreview =
        stored && stored.length > ERROR_PREVIEW_MAX_LENGTH 
          ? stored.slice(0, ERROR_PREVIEW_MAX_LENGTH) + '…' 
          : stored;
      console.error(
        'Failed to load ringtone settings from localStorage. Stored value will be reset.',
        {
          error,
          storedValuePreview,
        },
      );
      // Remove potentially corrupted data and fall back to defaults
      localStorage.removeItem(STORAGE_KEY);
      selectedRingtoneId.value = DEFAULT_RINGTONE_ID;
      customRingtones.value = [];
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
      let message = 'Failed to save ringtone settings.';

      // Provide a more specific explanation when localStorage quota is exceeded
      if (error instanceof DOMException) {
        const quotaExceeded =
          error.name === 'QuotaExceededError' ||
          error.code === LEGACY_QUOTA_EXCEEDED_CODE_WEBKIT ||
          error.code === LEGACY_QUOTA_EXCEEDED_CODE_FIREFOX;

        if (quotaExceeded) {
          message =
            'Unable to save ringtone settings because the browser storage limit has been reached. ' +
            'Try deleting some custom ringtones or clearing other saved data, then try again.';
        }
      }

      console.error(message, error);
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

    // Check file type (MIME type)
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: 'invalidFormat',  // i18n key
      };
    }

    // Additional check: validate file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
      return {
        valid: false,
        error: 'invalidFormat',  // i18n key
      };
    }

    return { valid: true };
  }

  // Validate ringtone name
  function validateName(name: string): FileValidationResult {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { valid: false, error: 'enterName' };
    }
    if (trimmedName.length > MAX_NAME_LENGTH) {
      return { valid: false, error: 'nameTooLong' };
    }
    return { valid: true };
  }

  // Add a custom ringtone
  async function addCustomRingtone(file: File, name: string): Promise<FileValidationResult> {
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return fileValidation;
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return nameValidation;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      
      const cleanup = () => {
        reader.onload = null;
        reader.onerror = null;
      };

      reader.onload = () => {
        cleanup();
        const data = reader.result as string;
        const ringtone: Ringtone = {
          id: 'custom-' + crypto.randomUUID(),
          name: name.trim(),
          type: 'custom',
          data,
        };
        customRingtones.value.push(ringtone);
        resolve({ valid: true });
      };
      reader.onerror = () => {
        cleanup();
        resolve({ valid: false, error: 'readError' });
      };
      reader.readAsDataURL(file);
    });
  }

  // Remove a custom ringtone
  function removeCustomRingtone(id: string) {
    const index = customRingtones.value.findIndex(r => r.id === id);
    if (index !== -1) {
      // Stop playback if this ringtone is currently playing
      stopCurrentAudio();
      
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

  // Initialize only once (singleton pattern)
  if (!isInitialized) {
    loadSettings();
    isInitialized = true;
  }

  return {
    selectedRingtoneId,
    selectedRingtone,
    customRingtones,
    allRingtones,
    selectRingtone,
    addCustomRingtone,
    removeCustomRingtone,
    validateFile,
    validateName,
    MAX_FILE_SIZE,
    MAX_NAME_LENGTH,
    ALLOWED_FORMATS,
  };
}
