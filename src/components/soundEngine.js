/**
 * SoundEngine - Web Audio API Procedural Synthesizer
 * Zero external audio files required. High-performance procedural sound generation.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.masterGain = null;
    this.isBgmPlaying = false;
    this.bgmOscillators = [];
    this.bgmFilter = null;
    this.analyser = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // SFX bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // BGM bus
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      // Analyser for UI visualizers
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      this.startAmbientBgm();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
    return !this.isMuted;
  }

  // --- Ambient Sci-Fi BGM Synthesis ---
  startAmbientBgm() {
    if (this.isBgmPlaying || !this.ctx) return;
    this.isBgmPlaying = true;

    const t = this.ctx.currentTime;
    
    // Low ambient resonant filter
    this.bgmFilter = this.ctx.createBiquadFilter();
    this.bgmFilter.type = 'lowpass';
    this.bgmFilter.frequency.setValueAtTime(280, t);
    this.bgmFilter.Q.setValueAtTime(3.5, t);
    this.bgmFilter.connect(this.bgmGain);

    // Minor chord progression base frequencies (D minor / sci-fi ambient)
    // D2 (73.4Hz), A2 (110Hz), F3 (174.6Hz), C3 (130.8Hz)
    const baseFreqs = [73.42, 110.0, 174.61, 220.0];

    this.bgmOscillators = baseFreqs.map((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i === 0 ? 'sine' : (i % 2 === 0 ? 'triangle' : 'sawtooth');
      osc.frequency.setValueAtTime(freq, t);

      // Gentle slight detune for cosmic lushness
      osc.detune.setValueAtTime((i - 1.5) * 6, t);

      gain.gain.setValueAtTime(0.08 / (i + 1), t);
      osc.connect(gain);
      gain.connect(this.bgmFilter);
      osc.start();
      return osc;
    });

    // Slow LFO for filter breathing sweep
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, t); // Very slow 12-second cycle
    lfoGain.gain.setValueAtTime(140, t);
    lfo.connect(lfoGain);
    lfoGain.connect(this.bgmFilter.frequency);
    lfo.start();
    this.bgmOscillators.push(lfo);
  }

  // --- Tactile Neumorphic Switch SFX ---
  playSwitch(isOn) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Stage 1: Mechanical relay click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isOn ? 850 : 620, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.045);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.05);

    // Stage 2: Heavy physical snap resonance
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(isOn ? 160 : 130, t + 0.01);
    thud.frequency.exponentialRampToValueAtTime(40, t + 0.09);

    thudGain.gain.setValueAtTime(0.7, t + 0.01);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    thud.connect(thudGain);
    thudGain.connect(this.sfxGain);
    thud.start(t + 0.01);
    thud.stop(t + 0.1);
  }

  // --- Terminal Keyboard Micro-Click ---
  playTyping() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Random pitch variation like mechanical switch
    const freq = 1200 + Math.random() * 800;
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.02);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.02);
  }

  // --- Hacker Scramble Decryption Click / Typewriter ---
  playTypewriter() {
    this.playTyping();
  }

  // --- Access Denied / Warning Klaxon Alarm ---
  playDenied() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;

    // Harsh glitch pulse 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(140, t);
    osc1.frequency.setValueAtTime(90, t + 0.12);

    gain1.gain.setValueAtTime(0.65, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.sfxGain);
    osc1.start(t);
    osc1.stop(t + 0.35);

    // Second harsh alarm klaxon
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(280, t + 0.15);
    osc2.frequency.setValueAtTime(180, t + 0.28);

    gain2.gain.setValueAtTime(0.55, t + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc2.connect(gain2);
    gain2.connect(this.sfxGain);
    osc2.start(t + 0.15);
    osc2.stop(t + 0.45);
  }

  // --- Access Granted Chime ---
  playGranted() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  // --- Slider Param Micro-Tick ---
  playSliderTick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, t);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.008);
  }

  // --- UI Click ---
  playClick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(980, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.03);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.035);
  }
}

export const sound = new SoundEngine();
