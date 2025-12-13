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
