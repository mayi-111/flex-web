/**
 * NeumorphicSwitch - Tactile Skeuomorphic Day/Night Toggle Switch
 * Directly replicates 拟态开关1.png (OFF) and 拟态开关2.png (ON).
 */

import { sound } from './soundEngine.js';

export class NeumorphicSwitch {
  constructor(switchId) {
    this.switchEl = document.getElementById(switchId);
    if (!this.switchEl) return;

    this.labelOff = document.querySelector('.label-off');
    this.labelOn = document.querySelector('.label-on');
    this.isDark = false;

    this.init();
  }

  init() {
    // Check saved preference or system preference
    const saved = localStorage.getItem('rhine_terminal_theme');
    if (saved === 'dark') {
      this.setTheme(true, false);
    } else {
      this.setTheme(false, false);
    }

    this.bindEvents();
  }

  bindEvents() {
    this.switchEl.addEventListener('click', () => {
      this.toggle();
    });

    // Keyboard accessibility
    this.switchEl.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    const nextState = !this.isDark;
    this.setTheme(nextState, true);
  }

  setTheme(isDark, playAudio = true) {
    this.isDark = isDark;
    this.switchEl.setAttribute('aria-checked', isDark ? 'true' : 'false');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (this.labelOff && this.labelOn) {
      if (isDark) {
        this.labelOff.classList.remove('active');
        this.labelOn.classList.add('active');
      } else {
        this.labelOff.classList.add('active');
        this.labelOn.classList.remove('active');
      }
    }

    localStorage.setItem('rhine_terminal_theme', isDark ? 'dark' : 'light');

    if (playAudio) {
      sound.playSwitch(isDark);
    }
  }
}
