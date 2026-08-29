// Web Audio programmatic synthesizer for crisp, high-impact casual mobile game sound effects
// Features realistic physical modeling of glass/crystal shattering, pings, and line blasts

import { TileType } from '../types';

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private noiseBuffer: AudioBuffer | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.createNoiseBuffer();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.5; // 0.5s of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  playSelect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(1040, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playSwap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.1);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playInvalidSwap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.14);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * Realistic glass breaking and crystal shattering sound synthesis
   */
  playGlassShatter(tileType?: TileType, combo: number = 1) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const comboBoost = Math.min(combo * 0.15, 0.6);

    // 1. Sharp Impact Crack Transient (initial snap)
    const crackOsc = this.ctx.createOscillator();
    const crackGain = this.ctx.createGain();
    crackOsc.type = 'triangle';
    crackOsc.frequency.setValueAtTime(4200, now);
    crackOsc.frequency.exponentialRampToValueAtTime(800, now + 0.025);
    crackGain.gain.setValueAtTime(0.4 + comboBoost * 0.2, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
    crackOsc.connect(crackGain);
    crackGain.connect(this.ctx.destination);
    crackOsc.start(now);
    crackOsc.stop(now + 0.035);

    // 2. Filtered Noise Splinter Crunch (broken glass shards grinding)
    if (this.noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = this.noiseBuffer;

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(2800, now);

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(4500 + Math.random() * 800, now);
      bandpass.Q.setValueAtTime(3.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35 + comboBoost * 0.15, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noiseSource.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + 0.15);
    }

    // 3. High-Pitched Crystalline Ringdown Harmonics (singing glass resonance)
    // Adjust base pitch slightly by tile color for harmonic richness
    let pitchMod = 1.0;
    if (tileType === TileType.RUBY) pitchMod = 0.95;
    else if (tileType === TileType.SAPPHIRE) pitchMod = 1.15;
    else if (tileType === TileType.EMERALD) pitchMod = 1.05;
    else if (tileType === TileType.TOPAZ) pitchMod = 1.25;
    else if (tileType === TileType.AMETHYST) pitchMod = 1.35;
    else if (tileType === TileType.AMBER) pitchMod = 1.1;

    const ringFreqs = [
      (2200 + Math.random() * 200) * pitchMod,
      (4600 + Math.random() * 400) * pitchMod,
      (7800 + Math.random() * 600) * pitchMod,
    ];

    ringFreqs.forEach((freq, idx) => {
      const ringOsc = this.ctx!.createOscillator();
      const ringGain = this.ctx!.createGain();
      ringOsc.type = 'sine';
      ringOsc.frequency.setValueAtTime(freq, now + idx * 0.008);
      ringOsc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + 0.18);

      const vol = (0.22 - idx * 0.05 + comboBoost * 0.1);
      ringGain.gain.setValueAtTime(Math.max(0.05, vol), now + idx * 0.008);
      ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16 + idx * 0.04);

      ringOsc.connect(ringGain);
      ringGain.connect(this.ctx!.destination);
      ringOsc.start(now + idx * 0.008);
      ringOsc.stop(now + 0.22);
    });

    // 4. Secondary Micro-Shatter Shard Tinkle
    const tinkleDelay = 0.035;
    const tinkleOsc = this.ctx.createOscillator();
    const tinkleGain = this.ctx.createGain();
    tinkleOsc.type = 'sine';
    tinkleOsc.frequency.setValueAtTime((5800 + Math.random() * 1200) * pitchMod, now + tinkleDelay);
    tinkleGain.gain.setValueAtTime(0.18, now + tinkleDelay);
    tinkleGain.gain.exponentialRampToValueAtTime(0.001, now + tinkleDelay + 0.08);

    tinkleOsc.connect(tinkleGain);
    tinkleGain.connect(this.ctx.destination);
    tinkleOsc.start(now + tinkleDelay);
    tinkleOsc.stop(now + tinkleDelay + 0.09);
  }

  // Alias playSmash to authentic glass shatter
  playSmash(combo: number = 1, tileType?: TileType) {
    this.playGlassShatter(tileType, combo);
  }

  playSpecial() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.38);

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);

    // Add crystal explosion sparkle
    setTimeout(() => {
      this.playGlassShatter(undefined, 3);
    }, 120);
  }

  playLineBlast() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    this.playGlassShatter(undefined, 2);
  }

  playCombo(level: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
    const count = Math.min(level + 1, 5);

    for (let i = 0; i < count; i++) {
      const noteTime = now + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[Math.min(i, notes.length - 1)], noteTime);

      gain.gain.setValueAtTime(0.28, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + 0.16);
    }
  }

  playLevelComplete() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    melody.forEach((freq, i) => {
      const time = now + i * 0.1;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(time);
      osc.stop(time + 0.25);
    });
  }

  playGameOver() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, i) => {
      const time = now + i * 0.15;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(time);
      osc.stop(time + 0.3);
    });
  }
}

export const soundManager = new SoundManager();
