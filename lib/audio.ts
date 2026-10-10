// Web Audio synthesizer for Time Capsule

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioClass) audioCtx = new AudioClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playClickSound() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
}

export function playSealSound() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    // Heavy mechanical vault click & seal tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(70, now + 0.15);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(320, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(160, now + 0.25);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.15);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.25);
  } catch (e) {}
}

export function playUnlockSound() {
  const ctx = getContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    // Celestial chime / unlock fanfare
    const freqs = [392, 523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.07);
      gain.gain.setValueAtTime(0.05, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.35);
    });
  } catch (e) {}
}
