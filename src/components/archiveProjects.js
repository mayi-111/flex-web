/**
 * ArchiveProjects - Manages Portfolio & Research Dossiers Carousel
 * Replicates 作品简介参考图.png and 网站主视觉参考图.png.
 */

import { sound } from './soundEngine.js';

export class ArchiveProjects {
  constructor() {
    this.projects = [
      {
        num: '01',
        title: '[PV练习] 靶向抗体',
        scriptTitle: 'Targeted Antibody',
        date: '2026 08 23',
        code: 'SYS. /// 102_ALDB',
        software: ['Ae', 'Ai', 'Bl'],
        summary: '以莱茵生命医学科技与靶向药物动力学为概念核心的动态视觉PV练习，探索黑白红强对比工业构图与赛博微观流体动力学。',
        previewSvg: `
          <svg viewBox="0 0 400 240" class="work-svg-visual">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                <stop offset="50%" stop-color="#d0d5dd" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="#e53935" stop-opacity="0.7"/>
              </linearGradient>
            </defs>
            <circle cx="200" cy="120" r="70" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" fill="none" opacity="0.3"/>
            <path d="M120 120 C150 70, 250 170, 280 120 C250 80, 180 160, 120 120" fill="url(#g1)" stroke="var(--color-primary-red)" stroke-width="1.8"/>
            <circle cx="200" cy="120" r="14" fill="var(--color-primary-red)"/>
            <circle cx="160" cy="95" r="7" fill="var(--color-primary-red)" opacity="0.8"/>
            <circle cx="240" cy="145" r="9" fill="var(--color-primary-red)" opacity="0.8"/>
            <text x="140" y="210" font-family="'Chakra Petch', sans-serif" font-size="28" font-weight="900" fill="currentColor" opacity="0.12">CX 5B PRDT</text>
          </svg>
        `
      },
      {
        num: '02',
        title: '[3D物理] 终末地引力奇点',
        scriptTitle: 'Endfield Singularity Engine',
        date: '2026 09 15',
        code: 'SYS. /// 204_KERR',
        software: ['GLSL', 'Three', 'Math'],
        summary: '基于广义相对论克尔度规与光线追踪引力透镜算法的 WebGL 实时黑洞吸积盘模拟引擎，呈现极端天体物理的多普勒频移。',
        previewSvg: `
          <svg viewBox="0 0 400 240" class="work-svg-visual">
            <ellipse cx="200" cy="120" rx="140" ry="42" fill="none" stroke="var(--color-primary-red)" stroke-width="2.5" opacity="0.75"/>
            <ellipse cx="200" cy="120" rx="90" ry="26" fill="none" stroke="#ffa726" stroke-width="1.8"/>
            <circle cx="200" cy="120" r="34" fill="#000000" stroke="#ffa726" stroke-width="2"/>
            <path d="M110 120 Q200 40 290 120" fill="none" stroke="#ff7700" stroke-width="3" opacity="0.85"/>
            <text x="110" y="210" font-family="'Chakra Petch', sans-serif" font-size="26" font-weight="900" fill="currentColor" opacity="0.12">KERR METRIC</text>
          </svg>
        `
      },
      {
        num: '03',
        title: '[UI架构] 莱茵神经接入终端',
        scriptTitle: 'Rhine Neural OS Protocol',
        date: '2026 10 01',
        code: 'SYS. /// 308_NIRI',
        software: ['Svelte', 'Audio', 'Rust'],
        summary: '高响应拟态硬件交互系统，融合零外部依赖的 Web Audio API 程序合成音效与毫秒级触觉物理反馈开关。',
        previewSvg: `
          <svg viewBox="0 0 400 240" class="work-svg-visual">
            <rect x="80" y="50" width="240" height="140" rx="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
            <line x1="80" y1="80" x2="320" y2="80" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
            <circle cx="100" cy="65" r="4" fill="var(--color-primary-red)"/>
            <circle cx="115" cy="65" r="4" fill="#ffa726"/>
            <rect x="100" y="105" width="200" height="24" rx="3" fill="none" stroke="var(--color-primary-red)" stroke-width="1.2"/>
            <text x="130" y="165" font-family="'JetBrains Mono', monospace" font-size="12" fill="currentColor" opacity="0.6">&gt; INITIALIZING CORE...</text>
          </svg>
        `
      },
      {
        num: '04',
        title: '[动态合成] 源石晶格共鸣重组',
        scriptTitle: 'Originium Lattice Rebuild',
        date: '2026 10 12',
        code: 'SYS. /// 412_SPEC',
        software: ['C4D', 'Ae', 'Houd'],
        summary: '明日方舟世界观下源石晶体与生体神经网络谐振动画，探索高密度点阵半色调与非线性动力学粒子的美学张力。',
        previewSvg: `
          <svg viewBox="0 0 400 240" class="work-svg-visual">
            <polygon points="200,40 260,100 240,190 160,190 140,100" fill="none" stroke="var(--color-primary-red)" stroke-width="2"/>
            <polygon points="200,60 240,105 225,175 175,175 160,105" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
            <circle cx="200" cy="120" r="12" fill="var(--color-primary-red)"/>
            <line x1="140" y1="100" x2="260" y2="100" stroke="var(--color-primary-red)" stroke-dasharray="2 2"/>
            <text x="105" y="210" font-family="'Chakra Petch', sans-serif" font-size="26" font-weight="900" fill="currentColor" opacity="0.12">ORIGINIUM 04</text>
          </svg>
        `
      }
    ];

    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.prevBtn = document.getElementById('work-prev-btn');
    this.nextBtn = document.getElementById('work-next-btn');
    this.accessBtn = document.getElementById('access-file-btn');

    this.currentNumEl = document.getElementById('current-work-index');
    this.giantNumEl = document.getElementById('work-giant-num');
    this.titleEl = document.getElementById('work-title');
    this.scriptTitleEl = document.getElementById('work-script-title');
    this.dateEl = document.getElementById('work-date');
    this.publishTimeEl = document.getElementById('work-publish-time');
    this.codeEl = document.getElementById('work-code');
    this.previewBox = document.getElementById('work-render-preview');

    this.bindEvents();
    this.renderActiveProject();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        sound.playClick();
        this.currentIndex = (this.currentIndex - 1 + this.projects.length) % this.projects.length;
        this.renderActiveProject();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        sound.playClick();
        this.currentIndex = (this.currentIndex + 1) % this.projects.length;
        this.renderActiveProject();
      });
    }

    if (this.accessBtn) {
      this.accessBtn.addEventListener('click', () => {
        sound.playGranted();
        const p = this.projects[this.currentIndex];
        const modalEl = document.getElementById('project-detail-modal');
        if (modalEl) {
          document.getElementById('pm-filenum').textContent = `FILE NUMBER: ${p.num}`;
          document.getElementById('pm-title').textContent = p.title;
          document.getElementById('pm-subtitle').textContent = p.scriptTitle;
          document.getElementById('pm-category').textContent = p.code;
          document.getElementById('pm-desc').textContent = p.summary;
          document.getElementById('pm-metric').textContent = `工程规格: ${p.software.join(' · ')}`;
          document.getElementById('pm-year').textContent = p.date.substring(0, 4);

          const techBox = document.getElementById('pm-tech-tags');
          if (techBox) {
            techBox.innerHTML = p.software.map(t => `<span class="tech-chip">${t}</span>`).join('');
          }

          const kerrPreview = document.getElementById('modal-kerr-preview');
          if (kerrPreview) kerrPreview.style.display = 'none';

          const linkBtn = document.getElementById('pm-github-btn');
          if (linkBtn) linkBtn.style.display = 'none';

          modalEl.classList.add('active');
        }
      });
    }
  }

  renderActiveProject() {
    const p = this.projects[this.currentIndex];

    if (this.currentNumEl) this.currentNumEl.textContent = p.num;
    if (this.giantNumEl) this.giantNumEl.textContent = p.num;
    if (this.titleEl) this.titleEl.textContent = p.title;
    if (this.scriptTitleEl) this.scriptTitleEl.textContent = p.scriptTitle;
    if (this.dateEl) this.dateEl.textContent = p.date;
    if (this.publishTimeEl) this.publishTimeEl.textContent = p.date;
    if (this.codeEl) this.codeEl.textContent = p.code;

    // Update Software Badges
    const badgesCol = document.querySelector('.software-badges-col');
    if (badgesCol) {
      badgesCol.innerHTML = `
        ${p.software.map(s => `<div class="software-badge">${s}</div>`).join('')}
        <div class="software-label">
          <span class="label-zh">使用软件</span>
          <span class="label-script">Software</span>
        </div>
      `;
    }

    if (this.previewBox) {
      this.previewBox.innerHTML = p.previewSvg;
    }
  }
}
