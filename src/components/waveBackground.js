/**
 * WaveBackground - Topographic & Elastic Ripple Wave Canvas
 * Replicates the wave line background in 波纹效果背景参考图.png.
 * Lines deflect, compress, and oscillate with elastic physical collision when mouse sweeps past.
 */

import { sound } from './soundEngine.js';

export class WaveBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse tracking
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      speed: 0,
      radius: 160
    };

    // Concentric Wave Rings & Horizontal Contour Lines
    this.rings = [];
    this.numRings = 28;
    this.time = 0;
    this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.shockwaves = [];

    this.init();
    this.bindEvents();
    this.animate();
  }

  /**
   * Triggers an expanding physical shockwave across all wave rings
   * e.g. when user clicks "SAY HI", buttons, or authorization keys
   */
  triggerShockwave(x, y, force = 48) {
    const originX = (typeof x === 'number') ? x : this.width * 0.5;
    const originY = (typeof y === 'number') ? y : this.height * 0.5;
    this.shockwaves.push({
      x: originX,
      y: originY,
      radius: 12,
      maxRadius: Math.hypot(this.width, this.height) * 1.15,
      speed: 26,
      force: force
    });
  }

  init() {
    this.resize();
    this.createRings();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.createRings();
  }

  createRings() {
    this.rings = [];
    const maxRadius = Math.sqrt(this.width * this.width + this.height * this.height) * 0.75;
    const ringSpacing = maxRadius / this.numRings;

    for (let i = 0; i < this.numRings; i++) {
      const baseRadius = (i + 1) * ringSpacing;
      const numPoints = Math.max(48, Math.floor((baseRadius * Math.PI * 2) / 24));
      const points = [];

      for (let j = 0; j < numPoints; j++) {
        const angle = (j / numPoints) * Math.PI * 2;
        points.push({
          angle,
          baseRadius,
          currentRadius: baseRadius,
          offset: 0,
          velocity: 0
        });
      }

      this.rings.push({
        baseRadius,
        points,
        numPoints
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('pointermove', (e) => {
      const prevX = this.mouse.targetX;
      const prevY = this.mouse.targetY;
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;

      if (prevX > 0 && prevY > 0) {
        this.mouse.vx = e.clientX - prevX;
        this.mouse.vy = e.clientY - prevY;
        this.mouse.speed = Math.sqrt(this.mouse.vx * this.mouse.vx + this.mouse.vy * this.mouse.vy);
      }
    });

    window.addEventListener('pointerleave', () => {
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
      this.mouse.speed = 0;
    });

    // Clicking anywhere on the empty background triggers an expanding physical ripple
    window.addEventListener('click', (e) => {
      const isInteractive = Boolean(e.target.closest('button, input, textarea, a, select, [role="button"], [role="switch"], .blackhole-sidebar, #post-selector, #feedback-form, .glass-card, .skill-inspector-modal, .telemetry-hud-card, .specs-table-card, .bio-paragraphs, .welkin-side-editorial, .sys-header, .unlocked-dossier, .toast-container'));
      if (isInteractive) return;
      this.triggerShockwave(e.clientX, e.clientY, 36);
      sound.playPulse();
    });

    // Observe theme change
    const observer = new MutationObserver(() => {
      this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.time += 0.015;

    // Smooth mouse position damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.15;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.15;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update active shockwaves
    for (let s = this.shockwaves.length - 1; s >= 0; s--) {
      const sw = this.shockwaves[s];
      sw.radius += sw.speed;
      if (sw.radius > sw.maxRadius) {
        this.shockwaves.splice(s, 1);
      }
    }

    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;

    // Line Colors
    const lineColor = this.isDark 
      ? 'rgba(255, 255, 255, 0.07)' 
      : 'rgba(20, 24, 32, 0.09)';
    
    const highlightColor = this.isDark 
      ? 'rgba(255, 60, 40, 0.35)' 
      : 'rgba(229, 57, 53, 0.28)';

    this.ctx.lineWidth = 1;

    for (let r = 0; r < this.rings.length; r++) {
      const ring = this.rings[r];
      this.ctx.beginPath();

      let hasDrawnFirst = false;

      for (let p = 0; p < ring.points.length; p++) {
        const pt = ring.points[p];

        // Theoretical undisturbed point position
        let px = centerX + Math.cos(pt.angle) * pt.baseRadius;
        let py = centerY + Math.sin(pt.angle) * pt.baseRadius;

        // Subtle ambient organic wave flow
        const ambientWave = Math.sin(pt.angle * 6 + this.time + r * 0.4) * 3 +
                            Math.cos(pt.angle * 3 - this.time * 0.8) * 2;

        // Elastic Mouse Collision & Deflection
        const dx = px - this.mouse.x;
        const dy = py - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let mouseForce = 0;
        if (dist < this.mouse.radius && this.mouse.x > 0) {
          // Push lines outward around cursor with spring bounce
          const normDist = 1 - dist / this.mouse.radius;
          mouseForce = normDist * normDist * 32 * (1 + Math.min(this.mouse.speed * 0.05, 1.5));
          
          // Velocity impulse
          pt.velocity += mouseForce * 0.15;
        }

        // Physical shockwave pulse impulses
        for (let s = 0; s < this.shockwaves.length; s++) {
          const sw = this.shockwaves[s];
          const distSw = Math.hypot(px - sw.x, py - sw.y);
          const diff = Math.abs(distSw - sw.radius);
          if (diff < 80) {
            const atten = (1 - diff / 80) * (1 - sw.radius / sw.maxRadius);
            const impulse = Math.cos((diff / 80) * Math.PI * 0.5) * sw.force * atten;
            pt.velocity += impulse * 0.2;
          }
        }

        // Spring physics: acceleration towards baseline + damping
        const springK = 0.08;
        const damping = 0.86;
        const force = -springK * pt.offset;
        pt.velocity += force;
        pt.velocity *= damping;
        pt.offset += pt.velocity;

        // Total radius with displacement
        const rCurrent = pt.baseRadius + ambientWave + pt.offset;
        px = centerX + Math.cos(pt.angle) * rCurrent;
        py = centerY + Math.sin(pt.angle) * rCurrent;

        if (!hasDrawnFirst) {
          this.ctx.moveTo(px, py);
          hasDrawnFirst = true;
        } else {
          this.ctx.lineTo(px, py);
        }
      }

      this.ctx.closePath();

      // Check proximity to mouse for highlight accent
      const distToCenter = Math.abs(ring.baseRadius - Math.sqrt(
        Math.pow(this.mouse.x - centerX, 2) + Math.pow(this.mouse.y - centerY, 2)
      ));

      if (distToCenter < 90 && this.mouse.x > 0) {
        this.ctx.strokeStyle = highlightColor;
        this.ctx.lineWidth = 1.6;
      } else {
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = 1;
      }

      this.ctx.stroke();
    }
  }
}
