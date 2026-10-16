/**
 * FullpageScroll - Section-by-Section Snapping Controller
 * Ensures navigation occurs strictly in whole-screen unit blocks:
 * "往上滑、往下滑它是以整块的单位来运行和滑动的"
 * 
 * Features:
 * - 1 Gesture = Exactly 1 Section slide (no runaway inertial skipping)
 * - Wheel, Touch swipe, Keyboard (PgUp/PgDn, Arrows), and Nav sync
 * - Floating side pagination bar with Rhine Lab HUD styling and tooltips
 * - Synchronized top header navigation with active indicator
 * - Safe inner scrolling for short viewports
 * - Web Audio procedural tick sound on page change
 */

import { sound } from './soundEngine.js';

export class FullpageScroll {
  constructor() {
    this.sections = [];
    this.currentIndex = 0;
    this.isAnimating = false;
    this.lastScrollTime = 0;
    this.cooldownMs = 700; // Animation cooldown to debounce wheel flick

    this.touchStartY = 0;
    this.touchStartX = 0;

    this.paginationEl = null;
    this.navLinks = [];

    this.init();
  }

  init() {
    // Collect all page sections in document order
    const sectionElements = document.querySelectorAll('.page-section');
    if (!sectionElements || sectionElements.length === 0) {
      console.warn('[FullpageScroll] No .page-section elements found.');
      return;
    }

    this.sections = Array.from(sectionElements);

    // Build the Floating Pagination Indicator on the right edge
    this.buildPaginationUI();

    // Cache top header navigation links
    this.navLinks = Array.from(document.querySelectorAll('.header-nav .nav-item'));

    // Determine initial active section based on current scroll or hash
    this.detectCurrentSectionFromScroll();

    // Bind event listeners
    this.bindEvents();

    // Initial UI state update
    this.updateActiveUI(this.currentIndex, false);

    console.log(`[FullpageScroll] Initialized with ${this.sections.length} full-page blocks.`);
  }

  buildPaginationUI() {
    // Check if already exists
    let container = document.getElementById('fullpage-pagination');
    if (!container) {
      container = document.createElement('nav');
      container.id = 'fullpage-pagination';
      container.className = 'fullpage-pagination';
      container.setAttribute('aria-label', '整屏滑动画卷导航');
      document.body.appendChild(container);
    }

    const labels = [
      '00 // HERO · 终端总览',
      '01 // ARCHIVE · 相对论档案',
      '02 // ARCHITECTURE · 核心架构',
      '03 // CASSETTE · 3D 玻璃档案盒',
      '04 // FEEDBACK · 留言终端',
      '05 // CONTACT · 通联协议'
    ];

    container.innerHTML = `
      <div class="fp-rail-wrapper">
        <div class="fp-rail-line">
          <div class="fp-active-glow" id="fp-active-glow"></div>
        </div>
        <div class="fp-dots-list">
          ${this.sections.map((sec, i) => {
            const numStr = String(i).padStart(2, '0');
            const label = labels[i] || `${numStr} // ${sec.getAttribute('data-label') || 'SECTION'}`;
            return `
              <button class="fp-dot-item" data-index="${i}" title="${label}" aria-label="${label}">
                <span class="fp-dot-num mono">${numStr}</span>
                <span class="fp-dot-node"><span class="fp-node-core"></span></span>
                <span class="fp-tooltip mono">${label}</span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
      <div class="fp-counter-hud mono" title="当前板块 / 总板块数">
        <span class="cur" id="fp-cur-num">00</span>
        <span class="slash">/</span>
        <span class="tot">0${this.sections.length - 1}</span>
      </div>
    `;

    this.paginationEl = container;

    // Click on pagination items
    const dotButtons = container.querySelectorAll('.fp-dot-item');
    dotButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(btn.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx)) {
          this.goToSection(targetIdx);
        }
      });
    });
  }

  bindEvents() {
    // 1. Mouse Wheel with Gesture Debounce
    window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

    // 2. Touch Gestures (Mobile/Tablet Swipe)
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaY = this.touchStartY - e.changedTouches[0].clientY;
        const deltaX = this.touchStartX - e.changedTouches[0].clientX;
        
        // Ensure predominantly vertical swipe
        if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX) * 1.4) {
          if (deltaY > 0) {
            this.nextSection();
          } else {
            this.prevSection();
          }
        }
      }
    }, { passive: true });

    // 3. Keyboard Arrow & Page navigation
    window.addEventListener('keydown', (e) => this.handleKeydown(e));

    // 4. Intercept Top Header Nav Clicks for smooth single-page transition
    this.navLinks.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSection(idx);
      });
    });

    // 5. Intercept internal anchor links targeting sections
    document.addEventListener('click', (e) => {
      const targetAnchor = e.target.closest('a[href^="#"]');
      if (!targetAnchor) return;
      const href = targetAnchor.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;

      const targetId = href.substring(1);
      const targetSecIdx = this.sections.findIndex(s => s.id === targetId);
      if (targetSecIdx !== -1) {
        e.preventDefault();
        this.goToSection(targetSecIdx);
      }
    });

    // 6. Native scroll listener to sync active states when user drags scrollbar
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (this.isAnimating) return;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.detectCurrentSectionFromScroll();
      }, 80);
    }, { passive: true });

    // 7. Handle window resize
    window.addEventListener('resize', () => {
      this.recalculateSectionPositions();
    });
  }

  isModalOpen() {
    const projectModal = document.getElementById('project-detail-modal');
    if (projectModal && projectModal.classList.contains('active')) return true;

    const sidebar = document.getElementById('control-sidebar');
    if (sidebar && (sidebar.classList.contains('active') || sidebar.classList.contains('open'))) return true;

    const warningOverlay = document.getElementById('warning-lockdown-overlay');
    if (warningOverlay && warningOverlay.classList.contains('active')) return true;

    return false;
  }

  handleWheel(e) {
    // If a modal or sidebar is open, allow native scroll inside that modal
    if (this.isModalOpen()) return;

    // Ignore tiny wheel trackpad jitters
    if (Math.abs(e.deltaY) < 16) return;

    // Check if the current section has scrollable overflow
    const currentSec = this.sections[this.currentIndex];
    if (currentSec) {
      const isScrollable = currentSec.scrollHeight > currentSec.clientHeight + 10;
      if (isScrollable) {
        // If scrolling down and not yet at bottom of section, let inner scroll
        const atBottom = currentSec.scrollTop + currentSec.clientHeight >= currentSec.scrollHeight - 5;
        const atTop = currentSec.scrollTop <= 5;
        if (e.deltaY > 0 && !atBottom) return;
        if (e.deltaY < 0 && !atTop) return;
      }
    }

    // Block browser native continuous scroll
    e.preventDefault();

    const now = Date.now();
    if (this.isAnimating || now - this.lastScrollTime < this.cooldownMs) {
      return;
    }

    if (e.deltaY > 0) {
      this.nextSection();
    } else {
      this.prevSection();
    }
  }

  handleKeydown(e) {
    if (this.isModalOpen()) return;

    // Don't intercept when user is typing in form inputs
    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;

    // If on 3D Shelf section (#projects) and pressing Arrow keys, let shelf navigate files
    const currentSec = this.sections[this.currentIndex];
    if (currentSec && currentSec.id === 'projects' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return;
    }

    if (e.key === 'PageDown' || (e.key === 'ArrowDown' && e.altKey)) {
      e.preventDefault();
      this.nextSection();
    } else if (e.key === 'PageUp' || (e.key === 'ArrowUp' && e.altKey)) {
      e.preventDefault();
      this.prevSection();
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.goToSection(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.goToSection(this.sections.length - 1);
    }
  }

  nextSection() {
    if (this.currentIndex < this.sections.length - 1) {
      this.goToSection(this.currentIndex + 1);
    }
  }

  prevSection() {
    if (this.currentIndex > 0) {
      this.goToSection(this.currentIndex - 1);
    }
  }

  goToSection(index, playSfx = true) {
    if (index < 0 || index >= this.sections.length) return;
    const targetSection = this.sections[index];
    if (!targetSection) return;

    this.currentIndex = index;
    this.isAnimating = true;
    this.lastScrollTime = Date.now();

    if (playSfx) {
      sound.playSliderTick();
    }

    // Scroll target section into view smoothly
    targetSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Update active UI elements immediately
    this.updateActiveUI(index, true);

    // Release animation lock after transition completes
    setTimeout(() => {
      this.isAnimating = false;
    }, this.cooldownMs);
  }

  detectCurrentSectionFromScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const midPoint = scrollY + viewportHeight * 0.4;

    for (let i = 0; i < this.sections.length; i++) {
      const sec = this.sections[i];
      const top = sec.offsetTop;
      const height = sec.offsetHeight;

      if (midPoint >= top && midPoint < top + height) {
        if (this.currentIndex !== i) {
          this.currentIndex = i;
          this.updateActiveUI(i, false);
        }
        break;
      }
    }
  }

  updateActiveUI(index, animateGlow = true) {
    // 1. Update Floating Pagination
    if (this.paginationEl) {
      const dots = this.paginationEl.querySelectorAll('.fp-dot-item');
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      const curNumEl = document.getElementById('fp-cur-num');
      if (curNumEl) {
        curNumEl.textContent = String(index).padStart(2, '0');
      }

      const activeGlow = document.getElementById('fp-active-glow');
      const dotsList = this.paginationEl.querySelector('.fp-dots-list');
      if (activeGlow && dots[index] && dotsList) {
        const activeNode = dots[index].querySelector('.fp-dot-node');
        if (activeNode) {
          const listRect = dotsList.getBoundingClientRect();
          const nodeRect = activeNode.getBoundingClientRect();
          const targetTop = (nodeRect.top - listRect.top) + (nodeRect.height / 2) - 8;
          activeGlow.style.top = `${targetTop}px`;
        }
      }
    }

    // 2. Update Top Header Navigation Items
    this.navLinks.forEach((link, i) => {
      if (i === index) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 3. Update HTML or Body data attribute for thematic CSS hooks
    document.documentElement.setAttribute('data-active-section', String(index));

    // 4. Update is-active class on all sections for entrance animation sequencing
    this.sections.forEach((sec, i) => {
      if (i === index) {
        sec.classList.add('is-active');
      } else {
        sec.classList.remove('is-active');
      }
    });
  }

  recalculateSectionPositions() {
    // If window resized, snap cleanly to current section
    const currentSec = this.sections[this.currentIndex];
    if (currentSec) {
      currentSec.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
}
