/**
 * FeedbackForm - Interactive Signal In & Feedback Terminal
 * Implements real-time validation, input rejection red border with error prompts,
 * procedural error sounds, and encrypted local message transmission.
 */

import { sound } from './soundEngine.js';

export class FeedbackForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) return;

    this.nameInput = document.getElementById('fb-name');
    this.emailInput = document.getElementById('fb-email');
    this.msgInput = document.getElementById('fb-message');
    this.msgCounter = document.getElementById('fb-msg-counter');
    this.statusBox = document.getElementById('fb-form-status');

    this.init();
  }

  init() {
    this.bindCounter();
    this.bindLiveValidation();
    this.bindSubmit();
  }

  bindCounter() {
    if (this.msgInput && this.msgCounter) {
      this.msgInput.addEventListener('input', () => {
        sound.playTyping();
        this.msgCounter.textContent = this.msgInput.value.length;
      });
    }
  }

  bindLiveValidation() {
    [this.nameInput, this.emailInput, this.msgInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const field = input.closest('.form-field-group');
        if (field && field.classList.contains('has-error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(input) {
    const field = input.closest('.form-field-group');
    if (!field) return true;

    let isValid = true;
    const val = input.value.trim();

    if (input === this.nameInput) {
      isValid = val.length >= 1;
    } else if (input === this.emailInput) {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    } else if (input === this.msgInput) {
      isValid = val.length >= 6;
    }

    if (isValid) {
      field.classList.remove('has-error');
    } else {
      field.classList.add('has-error');
    }

    return isValid;
  }

  bindSubmit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = this.validateField(this.nameInput);
      const isEmailValid = this.validateField(this.emailInput);
      const isMsgValid = this.validateField(this.msgInput);

      if (!isNameValid || !isEmailValid || !isMsgValid) {
        // Rejection Feedback: Red input boxes + Error vibration + Alarm SFX
        sound.playDenied();
        this.form.classList.add('form-shake');
        setTimeout(() => this.form.classList.remove('form-shake'), 450);

        if (this.statusBox) {
          this.statusBox.className = 'form-status-msg error';
          this.statusBox.textContent = '⚠ 校验拒绝：请检查上方标红输入项并按要求填写。';
        }
        return;
      }

      // Valid Transmission
      sound.playGranted();
      const payload = {
        sender: this.nameInput.value.trim(),
        channel: this.emailInput.value.trim(),
        message: this.msgInput.value.trim(),
        timestamp: new Date().toISOString(),
        packetId: `PKT-${Math.floor(100000 + Math.random() * 900000)}`
      };

      if (this.statusBox) {
        this.statusBox.className = 'form-status-msg success';
        const packetContent = `[TERMINAL PACKET // ${payload.packetId}]\nSENDER: ${payload.sender} <${payload.channel}>\nTIME: ${payload.timestamp}\nDATA: "${payload.message}"\nSTATUS: READY FOR BROADCAST`;
        this.statusBox.innerHTML = `
          <div class="trans-success-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge-success">✓ 信号已在本地封装完成 (TRANSMISSION LOCAL SEALED)</span>
              <button type="button" class="copy-inline-btn" data-copy="${encodeURIComponent(packetContent)}" style="padding:3px 10px; font-size:11px; cursor:pointer;" title="复制信令报文">复制报文</button>
            </div>
            <pre class="trans-code">
[TERMINAL PACKET // ${payload.packetId}]
SENDER: ${payload.sender} &lt;${payload.channel}&gt;
TIME:   ${payload.timestamp}
DATA:   "${payload.message}"
STATUS: READY FOR BROADCAST</pre>
          </div>
        `;

        // Wire copy button
        const copyBtn = this.statusBox.querySelector('.copy-inline-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            sound.playClick();
            if (navigator.clipboard) {
              navigator.clipboard.writeText(packetContent);
            }
            copyBtn.textContent = '已复制 ✓';
            setTimeout(() => { copyBtn.textContent = '复制报文'; }, 2000);
          });
        }
      }

      this.form.reset();
      if (this.msgCounter) this.msgCounter.textContent = '0';
    });
  }
}
