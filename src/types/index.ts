export interface TimePoint {
  id: string;
  timeInSeconds: number;  // 觸發時間（秒）
  ringCount: number;      // 響鈴次數 (1-5)
  triggered: boolean;     // 是否已觸發
}

export interface Preset {
  id: string;
  name: string;
  totalTime: number;      // 總時間（秒）
  timePoints: TimePoint[];
}

export interface StopwatchState {
  isRunning: boolean;
  elapsedTime: number;    // 經過時間（毫秒）
  currentPreset: Preset | null;
}

// Ringtone types
export type RingtoneType = 'preset' | 'custom';

export interface Ringtone {
  id: string;
  name: string;
  type: RingtoneType;
  url?: string;           // URL for preset ringtones (relative path)
  data?: string;          // Base64 data for custom ringtones
}

export interface RingtoneSettings {
  selectedRingtoneId: string;
  customRingtones: Ringtone[];
}
