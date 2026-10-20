class SoundFX {
  private ctx: AudioContext | null = null;
  private metronomeTimer: number | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a quick tactical chirp (mesh sync, button click, notification)
  public playChirp(frequency = 880, duration = 0.08) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or suspended
    }
  }

  // Play urgent disaster alert sound
  public playEmergencyAlert() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [800, 1000, 800, 1000].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + (idx + 1) * 0.12);
      });
    } catch {}
  }

  // Continuous or pulsing SOS Siren
  public startSiren() {
    const ctx = this.getContext();
    if (!ctx || this.sirenOsc) return;
    try {
      this.sirenOsc = ctx.createOscillator();
      this.sirenGain = ctx.createGain();
      this.sirenOsc.type = 'triangle';

      const now = ctx.currentTime;
      this.sirenOsc.frequency.setValueAtTime(700, now);

      // LFO modulation
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 1.8; // 1.8 Hz warble
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 350;

      lfo.connect(this.sirenOsc.frequency);
      lfo.start();

      this.sirenGain.gain.setValueAtTime(0.25, now);
      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(ctx.destination);
      this.sirenOsc.start();
    } catch {}
  }

  public stopSiren() {
    if (this.sirenOsc) {
      try {
        this.sirenOsc.stop();
        this.sirenOsc.disconnect();
      } catch {}
      this.sirenOsc = null;
      this.sirenGain = null;
    }
  }

  // CPR Metronome at 110 BPM (AHA guideline is 100-120 BPM)
  public startCPRMetronome(bpm = 110, onTick?: () => void) {
    this.stopCPRMetronome();
    const intervalMs = (60 / bpm) * 1000;

    const tick = () => {
      const ctx = this.getContext();
      if (ctx) {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6 pitch

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } catch {}
      }
      if (onTick) onTick();
    };

    tick();
    this.metronomeTimer = window.setInterval(tick, intervalMs);
  }

  public stopCPRMetronome() {
    if (this.metronomeTimer) {
      clearInterval(this.metronomeTimer);
      this.metronomeTimer = null;
    }
  }
}

export const soundFX = new SoundFX();
