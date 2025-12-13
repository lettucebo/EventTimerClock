// Web Audio API 實作響鈴音效
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playBeep(frequency: number = 800, duration: number = 200) {
  const ctx = getAudioContext();
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
}

export async function playBeeps(count: number) {
  for (let i = 0; i < count; i++) {
    playBeep();
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}
