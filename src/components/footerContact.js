/**
 * FooterContact - Handles Social Links, Clipboard Copy & SAY HI Action
 * Replicates 波纹效果背景参考图.png & Requirement 6.
 */

import { sound } from './soundEngine.js';

export class FooterContact {
  constructor(waveBackground = null) {
    this.waveBg = waveBackground;
    this.toastContainer = document.getElementById('toast-container');
    this.sayHiBtn = document.getElementById('say-hi-btn');
    this.init();
  }

  init() {
    this.bindCopyButtons();
    this.bindSayHi();
  }

  showToast(message, icon = '✓') {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--color-primary-red); font-weight: 800;">${icon}</span> <span>${message}</span>`;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  copyToClipboard(text, label, triggerBtn = null) {
    sound.playClick();
    
    // Trigger wave ripple at button location
    if (triggerBtn && this.waveBg) {
      const rect = triggerBtn.getBoundingClientRect();
      this.waveBg.triggerShockwave(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5, 30);
    }

    // Temporary visual state
    if (triggerBtn) {
      triggerBtn.classList.add('copied');
      const origText = triggerBtn.getAttribute('data-orig-text') || triggerBtn.innerHTML;
      if (!triggerBtn.getAttribute('data-orig-text')) {
        triggerBtn.setAttribute('data-orig-text', origText);
      }
      setTimeout(() => {
        triggerBtn.classList.remove('copied');
      }, 1600);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`${label} 已复制到剪贴板: ${text}`);
      }).catch(() => {
        this.fallbackCopy(text, label);
      });
    } else {
      this.fallbackCopy(text, label);
    }
  }

  fallbackCopy(text, label) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      this.showToast(`${label} 已复制: ${text}`);
    } catch (e) {
      this.showToast(`通联信息: ${text}`);
    }
    document.body.removeChild(input);
  }

  bindCopyButtons() {
    // Universal Copy Targets across whole page + Footer minimal badges
    const universalCopyBtns = document.querySelectorAll('.copy-inline-btn, [data-copy], [data-clipboard], .qc-item[data-clipboard]');
    universalCopyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const copyVal = btn.getAttribute('data-clipboard') || btn.getAttribute('data-copy') || btn.textContent.trim();
        const copyLabel = btn.getAttribute('title') || '通联代码';
        if (copyVal) {
          e.preventDefault();
          this.copyToClipboard(copyVal, copyLabel, btn);
        }
      });
    });
  }

  bindSayHi() {
    if (!this.sayHiBtn) return;

    // Magnetic Cursor Attraction
    window.addEventListener('pointermove', (e) => {
      const rect = this.sayHiBtn.getBoundingClientRect();
      const btnX = rect.left + rect.width * 0.5;
      const btnY = rect.top + rect.height * 0.5;
      const dist = Math.hypot(e.clientX - btnX, e.clientY - btnY);

      if (dist < 90) {
        const pull = (1 - dist / 90) * 16;
        const angle = Math.atan2(e.clientY - btnY, e.clientX - btnX);
        const offsetX = Math.cos(angle) * pull;
        const offsetY = Math.sin(angle) * pull;
        this.sayHiBtn.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(1.04)`;
      } else {
        this.sayHiBtn.style.transform = '';
      }
    });

    this.sayHiBtn.addEventListener('click', () => {
      sound.playGranted();
      
      // Trigger full-screen dynamic wave shockwave collision
      if (this.waveBg) {
        const rect = this.sayHiBtn.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        this.waveBg.triggerShockwave(cx, cy, 70);
      }

      this.sayHiBtn.classList.add('pulse-active');
      setTimeout(() => this.sayHiBtn.classList.remove('pulse-active'), 800);

      this.showToast('向终端发送问候成功！通联请求已广播 (SAY HI SENT)', '📡');
    });
  }
}
