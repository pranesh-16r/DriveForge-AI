/**
 * DriveForge AI - GTA Mod Shop Sound FX Synthesizer (Web Audio API)
 * Generates arcade-quality mechanical clicks, cash register cha-chings, engine revs, and spray sounds.
 * Requires zero external audio files.
 */

class GTASoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  // 1. Mechanical Socket Wrench / Ratchet Click (Menu Selection)
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore audio context errors
    }
  }

  // 2. GTA Mod Shop Cash Register "Cha-Ching" (Mod Installed)
  public playCashRegister() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      
      // High coin metallic chime 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1800, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      // High coin metallic chime 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2400, now + 0.06);
      gain2.gain.setValueAtTime(0.3, now + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      // Mechanical slide noise
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.4);
      noise.start(now);
    } catch {
      // Ignore audio errors
    }
  }

  // 3. Engine Rev / Throttle Rumble & Anti-Lag Backfire Pop
  public playEngineRev(stage: number = 2) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 1.6;

      // Engine Low Pitch V8 Rumble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      // Pitch ramp: idle -> high rev -> pitch drop
      const baseFreq = 70 + stage * 20;
      const maxFreq = 280 + stage * 80;

      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(maxFreq, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + duration);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);

      // Turbo Spool Whine
      if (stage >= 2) {
        const turbo = ctx.createOscillator();
        const turboGain = ctx.createGain();
        turbo.type = 'sine';
        turbo.frequency.setValueAtTime(800, now + 0.2);
        turbo.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
        turbo.frequency.exponentialRampToValueAtTime(1000, now + 1.1);

        turboGain.gain.setValueAtTime(0.001, now);
        turboGain.gain.linearRampToValueAtTime(0.1, now + 0.6);
        turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        turbo.connect(turboGain);
        turboGain.connect(ctx.destination);
        turbo.start(now);
        turbo.stop(now + 1.2);
      }

      // Exhaust Anti-Lag Backfire Pops (Crackles at peak rev)
      [0.6, 0.72, 0.85].forEach((delay) => {
        setTimeout(() => {
          if (!this.ctx) return;
          try {
            const popTime = this.ctx.currentTime;
            const popOsc = this.ctx.createOscillator();
            const popGain = this.ctx.createGain();
            popOsc.type = 'square';
            popOsc.frequency.setValueAtTime(120, popTime);
            popOsc.frequency.exponentialRampToValueAtTime(30, popTime + 0.05);

            popGain.gain.setValueAtTime(0.4, popTime);
            popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.05);

            popOsc.connect(popGain);
            popGain.connect(this.ctx.destination);
            popOsc.start(popTime);
            popOsc.stop(popTime + 0.05);
          } catch {
            // ignore
          }
        }, delay * 1000);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // 4. Paint Spray Can Hiss (Respray Option)
  public playSpray() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Ignore audio errors
    }
  }
}

export const gtaSoundEngine = new GTASoundEngine();
