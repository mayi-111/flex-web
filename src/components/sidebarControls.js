/**
 * SidebarControls - Manages 3D Ribbon Sculpture & Wave Parameters Console
 * Provides real-time parameter tweaking, architectural presets, and audio feedback.
 */

import { sound } from './soundEngine.js';

export class SidebarControls {
  constructor(sculptureScene, waveBg) {
    this.sculpture = sculptureScene;
    this.wave = waveBg;

    this.sidebar = document.getElementById('control-sidebar');
    this.toggleBtn = document.getElementById('sidebar-toggle-btn');
    this.closeBtn = document.getElementById('sidebar-close-btn');

    this.presets = {
      mobius: {
        twist: 2.4,
        radius: 3.4,
        slats: 380,
        speed: 0.45
      },
      helix: {
        twist: 4.2,
        radius: 3.2,
        slats: 450,
        speed: 0.65
      },
      cyber: {
        twist: 1.6,
        radius: 3.8,
        slats: 320,
        speed: 0.75
      },
      minimal: {
        twist: 1.0,
        radius: 2.8,
        slats: 220,
        speed: 0.35
      }
    };

    this.init();
  }

  init() {
    this.bindSidebarToggles();
    this.bindSliders();
    this.bindPresets();
    this.startPerformanceMonitor();
  }

  bindSidebarToggles() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => {
        sound.playClick();
        this.sidebar.classList.toggle('open');
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        sound.playClick();
        this.sidebar.classList.remove('open');
      });
    }

    // Shortcut: Ctrl+B or Ctrl+C
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        sound.playClick();
        this.sidebar.classList.toggle('open');
      }
      if (e.key === 'Escape' && this.sidebar.classList.contains('open')) {
        this.sidebar.classList.remove('open');
      }
    });
  }

  bindSliders() {
    // 3D Sculpture Sliders
    const bindSlider = (id, valId, unit, cb) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(valId);
      if (!el || !valEl) return;
      el.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        valEl.textContent = `${v.toFixed(unit === 'SLATS' ? 0 : 2)} ${unit}`;
        cb(v);
        sound.playSliderTick();
      });
    };

    bindSlider('param-twist', 'val-twist', 'rad', (v) => this.sculpture.setTwist(v));
    bindSlider('param-radius', 'val-radius', 'R', (v) => this.sculpture.setRadius(v));
    bindSlider('param-slats', 'val-slats', 'SLATS', (v) => this.sculpture.setSlatsCount(v));
    bindSlider('param-speed', 'val-speed', 'x', (v) => this.sculpture.setSpeed(v));

    // Wave Background Slider
    const waveEl = document.getElementById('param-ripple');
    const waveValEl = document.getElementById('val-ripple');
    if (waveEl && waveValEl && this.wave) {
      waveEl.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        waveValEl.textContent = `${v.toFixed(2)}x`;
        this.wave.mouse.radius = 160 * v;
        sound.playSliderTick();
      });
    }
  }

  bindPresets() {
    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playClick();
        presetBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-preset');
        if (this.presets[key]) {
          this.applyPreset(this.presets[key]);
        }
      });
    });
  }

  applyPreset(p) {
    const updateSlider = (id, valId, unit, val) => {
      const el = document.getElementById(id);
      const valEl = document.getElementById(valId);
      if (el) el.value = val;
      if (valEl) valEl.textContent = `${val.toFixed(unit === 'SLATS' ? 0 : 2)} ${unit}`;
    };

    updateSlider('param-twist', 'val-twist', 'rad', p.twist);
    updateSlider('param-radius', 'val-radius', 'R', p.radius);
    updateSlider('param-slats', 'val-slats', 'SLATS', p.slats);
    updateSlider('param-speed', 'val-speed', 'x', p.speed);

    this.sculpture.setTwist(p.twist);
    this.sculpture.setRadius(p.radius);
    this.sculpture.setSlatsCount(p.slats);
    this.sculpture.setSpeed(p.speed);
  }

  startPerformanceMonitor() {
    const fpsEl = document.getElementById('stat-fps');
    let lastTime = performance.now();
    let frames = 0;

    const loop = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        if (fpsEl) fpsEl.textContent = `${fps} FPS`;
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
