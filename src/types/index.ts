export interface TimePoint {
  id: string;
  timeInSeconds: number;  // 觸發時間（秒）
  ringCount: number;      // 響鈴次數 (1-5)
  triggered: boolean;     // 是否已觸發
}

export interface AutoAlarmSettings {
  enabled: boolean;       // 是否啟用自動響鈴
  intervalSeconds: number; // 響鈴間隔（秒）
  ringCount: number;      // 每次響鈴次數 (1-5)
  maxTriggers: number;    // 最大觸發次數
  triggeredCount: number; // 已觸發次數
  lastTriggeredAt: number; // 上次觸發時間（秒）
}

export interface Preset {
  id: string;
  name: string;
  totalTime: number;      // 總時間（秒）
  timePoints: TimePoint[];
  autoAlarm?: AutoAlarmSettings; // 自動響鈴設定
}

export interface StopwatchState {
  isRunning: boolean;
  elapsedTime: number;    // 經過時間（毫秒）
  currentPreset: Preset | null;
}
