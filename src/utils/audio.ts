// Web Audio API 實作響鈴音效
import type { Ringtone } from '../types';

let audioContext: AudioContext | null = null;
let currentAudio: HTMLAudioElement | null = null;

// Type extension for webkit prefix
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Constants for validation
const MIN_RING_COUNT = 1;
const MAX_RING_COUNT = 5;

// Default ringtone ID (classic beep)
export const DEFAULT_RINGTONE_ID = 'preset-classic';

// Preset ringtones configuration
export interface PresetRingtoneConfig {
  id: string;
  nameKey: string;  // i18n key for the name
  frequency: number;
  waveType: OscillatorType;
  duration: number;
  pattern: number[];  // Pattern of delays between notes
  notes?: number[];   // Multiple frequencies for melody
}

export const PRESET_RINGTONES: PresetRingtoneConfig[] = [
  {
    id: 'preset-classic',
    nameKey: 'ringtone.classic',
    frequency: 800,
    waveType: 'sine',
    duration: 200,
    pattern: [300],
  },
  {
    id: 'preset-gentle',
    nameKey: 'ringtone.gentle',
    frequency: 523,  // C5
    waveType: 'sine',
    duration: 400,
    pattern: [500],
    notes: [523, 659, 784],  // C5, E5, G5 - gentle chord
  },
  {
    id: 'preset-alert',
    nameKey: 'ringtone.alert',
    frequency: 1000,
    waveType: 'square',
    duration: 150,
    pattern: [100, 100],
  },
  {
    id: 'preset-chime',
    nameKey: 'ringtone.chime',
    frequency: 880,  // A5
    waveType: 'triangle',
    duration: 500,
    pattern: [600],
    notes: [880, 1047, 1319, 1568],  // A5, C6, E6, G6 - ascending chime
  },
  {
    id: 'preset-digital',
    nameKey: 'ringtone.digital',
    frequency: 1200,
    waveType: 'sawtooth',
    duration: 100,
    pattern: [80, 80, 200],
  },
];

function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      } else {
        console.error('Web Audio API is not supported in this browser');
        return null;
      }
    } catch (err) {
      console.error('Failed to create AudioContext:', err);
      return null;
    }
  }
  return audioContext;
}

export function playBeep(frequency: number = 800, duration: number = 200, waveType: OscillatorType = 'sine') {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      return;
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = waveType;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (err) {
    console.error('Failed to play beep:', err);
  }
}

// Play a preset ringtone by its configuration
export async function playPresetRingtone(config: PresetRingtoneConfig) {
  const notes = config.notes || [config.frequency];
  
  for (let i = 0; i < notes.length; i++) {
    playBeep(notes[i], config.duration, config.waveType);
    if (i < notes.length - 1) {
      const delay = config.pattern[i % config.pattern.length] || 300;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Play a custom ringtone from base64 data or URL
export async function playCustomRingtone(ringtone: Ringtone): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Stop any currently playing audio
      stopCurrentAudio();

      const audio = new Audio();
      
      if (ringtone.data) {
        audio.src = ringtone.data;
      } else if (ringtone.url) {
        audio.src = ringtone.url;
      } else {
        reject(new Error('No audio source available'));
        return;
      }

      currentAudio = audio;

      audio.onended = () => {
        currentAudio = null;
        resolve();
      };

      audio.onerror = () => {
        currentAudio = null;
        reject(new Error('Failed to play audio'));
      };

      audio.play().catch(reject);
    } catch (err) {
      reject(new Error(`Failed to play custom ringtone: ${err instanceof Error ? err.message : String(err)}`));
    }
  });
}

// Stop currently playing audio
export function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// Play ringtone based on ringtone object and count
export async function playRingtone(ringtone: Ringtone | null, count: number = 1) {
  // Validate input to prevent hanging or unexpected behavior
  if (!Number.isFinite(count) || count < MIN_RING_COUNT || count > MAX_RING_COUNT) {
    console.warn(`Invalid ring count: ${count}. Must be between ${MIN_RING_COUNT} and ${MAX_RING_COUNT}`);
    return;
  }

  for (let i = 0; i < count; i++) {
    if (!ringtone || ringtone.type === 'preset') {
      // Find preset config
      const presetId = ringtone?.id || DEFAULT_RINGTONE_ID;
      const config = PRESET_RINGTONES.find(p => p.id === presetId) || PRESET_RINGTONES[0];
      await playPresetRingtone(config);
    } else {
      // Play custom ringtone
      try {
        await playCustomRingtone(ringtone);
      } catch (err) {
        console.error('Failed to play custom ringtone, falling back to default:', err);
        const config = PRESET_RINGTONES[0];
        await playPresetRingtone(config);
      }
    }

    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

export async function playBeeps(count: number) {
  // Validate input to prevent hanging or unexpected behavior
  if (!Number.isFinite(count) || count < MIN_RING_COUNT || count > MAX_RING_COUNT) {
    console.warn(`Invalid beep count: ${count}. Must be between ${MIN_RING_COUNT} and ${MAX_RING_COUNT}`);
    return;
  }
  
  for (let i = 0; i < count; i++) {
    playBeep();
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}
