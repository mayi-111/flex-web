/**
 * GlassProfileCard - Frosted Glass Archive Dossier & Authorization Key System
 * Directly replicates 个人名片参考图.png and 个人名片+黑夜模式参考图.png.
 * Handles keystroke pulse reaction, input rejection with hard cut 2.6s lockdown alert,
 * and classified dossier unlocking.
 */

import { sound } from './soundEngine.js';

export class GlassProfileCard {
  constructor(sculptureScene) {
    this.sculpture = sculptureScene;

    this.form = document.getElementById('auth-form');
    this.input = document.getElementById('auth-input');
    this.inputWrapper = document.getElementById('auth-input-wrapper');
    this.lockdownOverlay = document.getElementById('warning-lockdown-overlay');
    this.timerFill = document.getElementById('lockdown-timer-fill');
    this.unlockedDossier = document.getElementById('unlocked-dossier');
    this.dossierCloseBtn = document.getElementById('dossier-close-btn');

    this.liveClock = document.getElementById('live-locked-time');
    this.operatorName = document.getElementById('operator-display-name');
    this.editNameBtn = document.getElementById('btn-custom-name');
    this.eventLogText = document.getElementById('latest-event-text');

    this.isLockdownActive = false;
    this.lockdownTimer = null;
    this.lockdownDuration = 1000; // Reduced warning duration to 1.0s

    this.init();
  }

  init() {
    this.startClock();
    this.bindInputs();
    this.bindDossier();
    this.bindCustomName();
    this.bindLockdownDismiss();
  }

  bindLockdownDismiss() {
    if (this.lockdownOverlay) {
      this.lockdownOverlay.addEventListener('click', () => {
        this.dismissLockdown();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (this.isLockdownActive && (e.key === 'Escape' || e.key === 'Enter')) {
        e.preventDefault();
        this.dismissLockdown();
      }
    });
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      if (this.liveClock) {
        this.liveClock.textContent = `${h}:${m}:${s}`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  bindInputs() {
    if (!this.input || !this.form) return;

    // Keystroke Pulse & Mechanical Sound
    this.input.addEventListener('input', () => {
      sound.playTyping();
      if (this.sculpture) {
        this.sculpture.triggerKeystrokePulse();
      }
    });

    // Form Submission / Authorization check
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.verifyPassphrase();
    });
  }

  verifyPassphrase() {
    if (this.isLockdownActive) return;

    const val = (this.input.value || '').trim().toLowerCase();
    const authorizedKeys = ['mayi', 'mayi-111', 'gargantua', 'kerr', 'blackhole', 'rhinelab', 'endfield', 'arknights', 'admin', '123456', 'doctor', 'geek'];

    if (authorizedKeys.includes(val)) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  // --- Success / Dossier Unlock ---
  handleSuccess() {
    sound.playGranted();
    if (this.eventLogText) {
      this.eventLogText.textContent = 'ACCESS GRANTED 权限核验通过';
    }

    if (this.unlockedDossier) {
      this.unlockedDossier.classList.add('active');
    }
    this.input.value = '';
  }

  // --- Rejection & 1.0s Hard Cut Lockdown Alarm (Reduced duration) ---
  handleFailure() {
    this.isLockdownActive = true;
    sound.playDenied();

    if (this.eventLogText) {
      this.eventLogText.textContent = 'ERR 403 // LOCKDOWN 封锁';
    }

    // 1. Mark input wrapper red + shake
    this.inputWrapper.classList.add('denied');

    // 2. Hard cut full-screen WARNING lockdown overlay
    this.lockdownOverlay.classList.add('active');
    this.lockdownOverlay.setAttribute('aria-hidden', 'false');

    // 3. Reset and trigger 1.0s countdown bar
    if (this.timerFill) {
      this.timerFill.style.transition = 'none';
      this.timerFill.style.width = '100%';
      void this.timerFill.offsetWidth; // Force reflow
      this.timerFill.style.transition = `width ${this.lockdownDuration}ms linear`;
      this.timerFill.style.width = '0%';
    }

    // 4. Automatically recover in 1.0 second (or instantly via click/ESC)
    if (this.lockdownTimer) clearTimeout(this.lockdownTimer);
    this.lockdownTimer = setTimeout(() => {
      this.dismissLockdown();
    }, this.lockdownDuration);
  }

  dismissLockdown() {
    if (!this.isLockdownActive) return;
    if (this.lockdownTimer) {
      clearTimeout(this.lockdownTimer);
      this.lockdownTimer = null;
    }

    this.lockdownOverlay?.classList.remove('active');
    this.lockdownOverlay?.setAttribute('aria-hidden', 'true');
    this.inputWrapper?.classList.remove('denied');
    if (this.input) {
      this.input.value = '';
      this.input.focus();
    }
    this.isLockdownActive = false;

    if (this.eventLogText) {
      this.eventLogText.textContent = 'PORTAL RECOVERED 会话就绪';
    }
  }

  bindDossier() {
    if (this.dossierCloseBtn && this.unlockedDossier) {
      this.dossierCloseBtn.addEventListener('click', () => {
        sound.playClick();
        this.unlockedDossier.classList.remove('active');
      });
    }
  }

  bindCustomName() {
    if (!this.editNameBtn || !this.operatorName) return;

    // Load saved custom name
    const savedName = localStorage.getItem('rhine_operator_name');
    if (savedName) {
      this.operatorName.textContent = savedName;
    }

    this.editNameBtn.addEventListener('click', () => {
      sound.playClick();
      const current = this.operatorName.textContent;
      const nextName = window.prompt('请输入自定义个人代号 / 昵称 (Operator Codename):', current);
      if (nextName && nextName.trim()) {
        const cleaned = nextName.trim().toUpperCase().slice(0, 16);
        this.operatorName.textContent = cleaned;
        localStorage.setItem('rhine_operator_name', cleaned);
      }
    });
  }
}
