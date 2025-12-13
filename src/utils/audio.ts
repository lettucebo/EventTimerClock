// Web Audio API 實作響鈴音效
let audioContext: AudioContext | null = null;

// Type extension for webkit prefix
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Constants for validation
const MIN_RING_COUNT = 1;
const MAX_RING_COUNT = 5;

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

export function playBeep(frequency: number = 800, duration: number = 200) {
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
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (err) {
    console.error('Failed to play beep:', err);
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
