/**
 * BootEntrance - Minimalist Cinematic Terminal Boot Entrance Sequence
 * Elegant, sleek, sci-fi laboratory initialization curtain.
 */

import { sound } from './soundEngine.js';

export class BootEntrance {
  constructor() {
    this.curtain = document.getElementById('terminal-boot-curtain');
    this.progressBar = document.getElementById('boot-progress-bar');
    this.statusLog = document.getElementById('boot-status-log');
    this.statusPct = document.getElementById('boot-status-pct');
    this.skipBtn = document.getElementById('boot-skip-btn');

    this.progress = 0;
    this.isCompleted = false;
    this.animationTimer = null;

    this.init();
  }

  init() {
    if (!this.curtain) return;

    // Steps log sequence
    const steps = [
      { at: 20, text: 'INITIALIZING BOYER-LINDQUIST METRIC...' },
      { at: 50, text: 'CALIBRATING KERR GEODESIC RAYMARCHING...' },
      { at: 78, text: 'LOADING CONTINUOUS ARRAY GLASS SHADERS...' },
      { at: 95, text: 'SYNCHRONIZING 3D SLAT SCULPTURE & WAVE MATRIX...' },
      { at: 100, text: 'TERMINAL ONLINE // SYSTEM READY' }
    ];

    // Keyboard and click to accelerate/skip
    const fastForward = () => {
      if (this.isCompleted) return;
      this.finishSequence(true);
    };

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fastForward();
      });
    }
    this.curtain.addEventListener('click', fastForward);
    window.addEventListener('keydown', (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key) && !this.isCompleted) {
        fastForward();
      }
    });

    // Animate progress smoothly over ~1.3s
    const startTime = performance.now();
    const duration = 1250; // ms

    const frame = (now) => {
      if (this.isCompleted) return;

      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - t, 2.5);
      this.progress = Math.round(eased * 100);

      if (this.progressBar) {
        this.progressBar.style.width = `${this.progress}%`;
      }
      if (this.statusPct) {
        this.statusPct.textContent = `${String(this.progress).padStart(2, '0')}%`;
      }

      // Update log text based on current progress
      for (const step of steps) {
        if (this.progress <= step.at) {
          if (this.statusLog && this.statusLog.textContent !== step.text) {
            this.statusLog.textContent = step.text;
          }
          break;
        }
      }

      if (t < 1) {
        this.animationTimer = requestAnimationFrame(frame);
      } else {
        this.finishSequence(false);
      }
    };

    this.animationTimer = requestAnimationFrame(frame);
  }

  finishSequence(skipped = false) {
    if (this.isCompleted) return;
    this.isCompleted = true;

    if (this.animationTimer) {
      cancelAnimationFrame(this.animationTimer);
    }

    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.statusPct) this.statusPct.textContent = '100%';
    if (this.statusLog) this.statusLog.textContent = 'TERMINAL ONLINE // SYSTEM READY';

    // Play subtle harmonious boot chime
    sound.playBootChime();

    // Trigger exit transition
    const delay = skipped ? 80 : 220;
    setTimeout(() => {
      if (this.curtain) {
        this.curtain.classList.add('revealed');
      }
      document.body.classList.add('page-revealed');

      // Fully disconnect curtain after transition completes
      setTimeout(() => {
        if (this.curtain) {
          this.curtain.style.display = 'none';
        }
      }, 900);
    }, delay);
  }
}
