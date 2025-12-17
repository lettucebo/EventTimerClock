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
  ringtone: {
    title: '鈴聲設定',
    presets: '預設鈴聲',
    custom: '自訂鈴聲',
    upload: '上傳鈴聲',
    uploadTitle: '上傳自訂鈴聲',
    namePlaceholder: '請輸入鈴聲名稱',
    save: '儲存',
    cancel: '取消',
    formatHint: '支援 MP3、WAV、OGG 格式，最大 512KB',
    selected: '已選擇此鈴聲',
    deleted: '鈴聲已刪除',
    uploaded: '鈴聲上傳成功！',
    enterName: '請輸入鈴聲名稱',
    nameTooLong: '鈴聲名稱過長',
    previewError: '無法播放鈴聲',
    fileTooLarge: '檔案過大，最大支援 512KB',
    invalidFormat: '不支援的檔案格式',
    readError: '讀取檔案失敗',
    preview: '預覽鈴聲',
    stopPreview: '停止預覽',
    deleteLabel: '刪除鈴聲',
    classic: '經典',
    gentle: '輕柔',
    alert: '警示',
    chime: '風鈴',
    digital: '數位'
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
