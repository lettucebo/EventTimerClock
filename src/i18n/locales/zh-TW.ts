export default {
  app: {
    title: 'Event Timer Clock',
    subtitle: '活動倒數計時器',
    footer: '使用 Vue 3 + Vite + TypeScript 建立'
  },
  control: {
    start: '開始',
    pause: '暫停',
    reset: '重置',
    fullscreen: '全螢幕',
    exitFullscreen: '退出全螢幕'
  },
  alarm: {
    settings: '響鈴設定',
    presetMode: '預設模板',
    customMode: '自訂設定',
    presetTemplates: '預設模板',
    totalTime: '總時間',
    ringsCount: '次響鈴',
    delete: '刪除',
    copyAndEdit: '複製與編輯',
    addCustomTemplate: '新增自訂模板',
    templateName: '模板名稱',
    saveAsTemplate: '儲存為模板',
    clearAll: '清除全部',
    addTimePoint: '新增時間點',
    timeLabel: '時間 (分:秒)',
    minutesPlaceholder: '分',
    secondsPlaceholder: '秒',
    ringCountLabel: '響鈴次數',
    add: '新增',
    settedTimePoints: '已設定的時間點',
    triggered: '已觸發',
    remove: '移除'
  },
  preset: {
    speech15: '演講模式 (15分鐘)',
    presentation10: '簡報模式 (10分鐘)'
  },
  toast: {
    enterTemplateName: '請輸入模板名稱',
    addTimePointFirst: '請先新增時間點',
    noValidTimePoints: '沒有有效的時間點',
    templateSaved: '模板已儲存！',
    timeGreaterThanZero: '時間必須大於 0 秒',
    ringCountRange: '響鈴次數必須介於 {min} 到 {max} 之間'
  },
  language: {
    label: '語言',
    zhTW: '繁體中文',
    en: 'English'
  },
  theme: {
    label: '主題',
    light: '亮色',
    dark: '暗色',
    auto: '跟隨系統'
  }
}
