export default {
  app: {
    title: 'Event Timer Clock',
    subtitle: 'Event Countdown Timer',
    footer: 'Built with Vue 3 + Vite + TypeScript'
  },
  control: {
    start: 'Start',
    pause: 'Pause',
    reset: 'Reset',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen'
  },
  alarm: {
    settings: 'Alarm Settings',
    presetMode: 'Preset Templates',
    customMode: 'Custom Settings',
    presetTemplates: 'Preset Templates',
    totalTime: 'Total Time',
    ringsCount: 'Ring(s)',
    delete: 'Delete',
    copyAndEdit: 'Copy & Edit',
    addCustomTemplate: 'Add Custom Template',
    templateName: 'Template Name',
    saveAsTemplate: 'Save as Template',
    clearAll: 'Clear All',
    addTimePoint: 'Add Time Point',
    timeLabel: 'Time (min:sec)',
    minutesPlaceholder: 'Min',
    secondsPlaceholder: 'Sec',
    ringCountLabel: 'Ring Count',
    add: 'Add',
    settedTimePoints: 'Configured Time Points',
    triggered: 'Triggered',
    remove: 'Remove'
  },
  preset: {
    speech15: 'Speech Mode (15 min)',
    presentation10: 'Presentation Mode (10 min)'
  },
  ringtone: {
    title: 'Ringtone Settings',
    presets: 'Preset Ringtones',
    custom: 'Custom Ringtones',
    upload: 'Upload Ringtone',
    uploadTitle: 'Upload Custom Ringtone',
    namePlaceholder: 'Enter ringtone name',
    save: 'Save',
    cancel: 'Cancel',
    formatHint: 'Supports MP3, WAV, OGG formats, max 512KB',
    selected: 'Ringtone selected',
    deleted: 'Ringtone deleted',
    uploaded: 'Ringtone uploaded successfully!',
    enterName: 'Please enter a ringtone name',
    nameTooLong: 'Ringtone name is too long',
    previewError: 'Failed to play ringtone',
    fileTooLarge: 'File too large, max 512KB supported',
    invalidFormat: 'Unsupported file format',
    readError: 'Failed to read file',
    preview: 'Preview ringtone',
    stopPreview: 'Stop preview',
    deleteLabel: 'Delete ringtone',
    classic: 'Classic',
    gentle: 'Gentle',
    alert: 'Alert',
    chime: 'Chime',
    digital: 'Digital'
  },
  toast: {
    enterTemplateName: 'Please enter template name',
    addTimePointFirst: 'Please add time points first',
    noValidTimePoints: 'No valid time points',
    templateSaved: 'Template saved!',
    timeGreaterThanZero: 'Time must be greater than 0 seconds',
    ringCountRange: 'Ring count must be between {min} and {max}'
  },
  language: {
    label: 'Language',
    zhTW: '繁體中文',
    en: 'English'
  },
  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto (System)'
  }
}
