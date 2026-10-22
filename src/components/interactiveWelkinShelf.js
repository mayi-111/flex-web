/**
 * InteractiveWelkinShelf - Section 03 Welkin 3D Archive Interactivity
 * Features:
 *  - 7 Quick-Jump Module Pills for 1-click navigation to any 3D file cassette
 *  - Interactive Slogan & Hint wave excitation trigger
 *  - In-Card Relativistic Laser Photon Simulation on the 3D Blueprint Canvas
 *  - Synchronized module pill highlights with stage selection
 */

import { sound } from './soundEngine.js';

export class InteractiveWelkinShelf {
  constructor() {
    this.stage = document.getElementById('feature-stage');
    this.pills = [];
    this.init();
  }

  init() {
    this.initQuickPills();
    this.initSloganWaveTriggers();
    this.initLaserSimulation();
    this.observeStageSelection();
  }

  // --- 1. Quick Module Jump Pills ---
  initQuickPills() {
    this.pills = Array.from(document.querySelectorAll('.welkin-quick-modules .qm-pill'));
    if (!this.pills.length) return;

    this.pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const index = Number(pill.dataset.module) || 0;
        sound.playInspect();

        this.jumpToModule(index);
      });
    });
  }

  jumpToModule(index) {
    if (!this.stage) return;
    const selector = document.getElementById('post-selector');
    const button = selector?.querySelector(`button[data-post-index="${index}"]`);

    if (button) {
      button.click();
    } else {
      this.stage.dataset.selectedIndex = String(index);
    }

    this.updateActivePill(index);
  }

  updateActivePill(index) {
    this.pills.forEach((pill, i) => {
      if (i === index) pill.classList.add('active');
      else pill.classList.remove('active');
    });
  }

  observeStageSelection() {
    if (!this.stage) return;

    const observer = new MutationObserver(() => {
      const idx = Number(this.stage.dataset.selectedIndex);
      if (Number.isInteger(idx)) {
        this.updateActivePill(idx);
      }
    });

    observer.observe(this.stage, { attributes: true, attributeFilter: ['data-selected-index'] });
  }

  // --- 2. Slogan Click Trigger ---
  initSloganWaveTriggers() {
    const targets = [
      document.getElementById('welkin-slogan-title'),
      document.getElementById('welkin-slogan-desc'),
      document.getElementById('welkin-editorial-hint')
    ];

    targets.forEach((el) => {
      if (!el) return;
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        sound.playPulse();

        // Dispatch synthetic scroll step to trigger standing waves
        if (this.stage) {
          const evt = new CustomEvent('welkin-wave-pulse', { bubbles: true });
          this.stage.dispatchEvent(evt);
        }

        // Visual flash on hint dot
        const dot = document.querySelector('.welkin-editorial-hint .hint-dot');
        if (dot) {
          dot.classList.add('pulse-flare');
          setTimeout(() => dot.classList.remove('pulse-flare'), 600);
        }

        this.showToast('已向 3D 磨砂玻璃卡匣阵列发射引力驻波激波！');
      });
    });
  }

  // --- 3. Inspected Blueprint Laser Photon Orbit Simulation ---
  initLaserSimulation() {
    const btn = document.getElementById('btn-laser-sim');
    if (!btn) return;

    btn.addEventListener('click', () => {
      sound.playChirp();
      btn.disabled = true;
      btn.classList.add('simulating');
      const origText = btn.innerHTML;
      btn.innerHTML = '<span>⚡ 正在解算光子零测地线偏折轨道...</span>';

      // Access current index
      const currentIndex = Number(this.stage?.dataset.selectedIndex) || 0;

      // Dispatch event to glass-scene or notify user
      window.dispatchEvent(new CustomEvent('welkin-photon-laser-sim', { detail: { index: currentIndex } }));

      setTimeout(() => {
        sound.playGranted();
        btn.disabled = false;
        btn.classList.remove('simulating');
        btn.innerHTML = origText;
        this.showToast('✓ 测地线光子轨道偏折解算完成，吸积盘多普勒集束通量峰值刷新！');
      }, 900);
    });
  }

  showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'rhine-toast';
    toast.innerHTML = `<span class="toast-rhine-icon">⬡</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}
