/**
 * Archive3DShelf - Welkin Procedural Glass Archive Direct Port
 * Integrates official ZenithSeraph/hexo-theme-welkin glass-scene engine,
 * motion physics, and detail inspection directly into Section 03.
 */

import '../welkin/motion.js';
import '../welkin/detail-view.js';
import { initializeGlassScene } from '../welkin/glass-scene.js';

export class Archive3DShelf {
  constructor() {
    this.init();
  }

  init() {
    // 100% GARGANTUA Blackhole Engine Flagship Modules
    window.WELKIN_POSTS = [
      {
        slug: 'gargantua-relativistic-kerr-engine',
        title: 'GARGANTUA 相对论克尔黑洞引擎',
        date: '2026-01-12',
        category: '广义相对论',
        categories: ['广义相对论', '物理引擎'],
        tags: ['WebGL 2.0', 'GLSL Shaders', 'Raymarching', 'Single File 123KB'],
        excerpt: '从零实现的广义相对论黑洞实时物理可视化引擎：引力透镜光线偏折、吸积盘极端相对论多普勒频移、光子环与事件视界。单文件 123 KB 交付，零外部依赖，直接在纯 WebGL 环境下计算测地线光线弯曲。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      },
      {
        slug: 'kerr-geodesic-rk4-integrator',
        title: '克尔测地线四阶龙格库塔积分',
        date: '2026-01-10',
        category: '微分几何',
        categories: ['微分几何', '测地线方程'],
        tags: ['Boyer-Lindquist', 'RK4 Numerical', 'Geodesic Math'],
        excerpt: '基于 Boyer-Lindquist 坐标系精确求解旋转黑洞弯曲时空中的零测地线微分方程。采用四阶龙格库塔（RK4）数值自适应积分，计算光线掠过引力奇点时的极端偏折轨迹。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      },
      {
        slug: 'relativistic-doppler-beaming-shift',
        title: '极端相对论多普勒集束与频移',
        date: '2026-01-08',
        category: '天体物理',
        categories: ['天体物理', '辐射流转'],
        tags: ['Doppler Beaming', 'Lorentz Invariance', 'Planck Spectrum'],
        excerpt: '模拟吸积盘高速绕转等离子体（β≈0.72c）引起的极端相对论多普勒效应。迎面朝向观察者的高速粒子呈现剧烈蓝移与集束增亮，背向远离端呈现暗红红移，完美还原非对称黑洞盘面。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      },
      {
        slug: 'einstein-photon-sphere-shadow',
        title: '爱因斯坦光子球与阴影边界',
        date: '2026-01-05',
        category: '物理可视',
        categories: ['物理可视', '边界理论'],
        tags: ['Photon Sphere', 'Shadow Boundary', 'Raymarching'],
        excerpt: '计算极端引力场下不稳定光子圆轨道的几何临界截面，呈现围绕黑洞的极窄高亮光子环（Photon Ring）与无光逃逸的事件视界阴影（Black Hole Shadow）。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      },
      {
        slug: 'kerr-ergosphere-frame-dragging',
        title: '克尔能层与时空拖拽效应',
        date: '2026-01-03',
        category: '时空几何',
        categories: ['时空几何', '彭罗斯机制'],
        tags: ['Ergosphere', 'Frame-Dragging', 'Penrose Process'],
        excerpt: '转动时空的引力磁效应（愣色-蒂尔林效应）。在静止极限面与外事件视界之间，时空本身被强行拖曳以超越光速旋转，呈现克尔度规特有的扁球形能层结构。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      },
      {
        slug: 'novikov-thorne-thin-accretion-disk',
        title: 'Novikov-Thorne 几何薄吸积盘',
        date: '2025-12-28',
        category: '吸积盘物理',
        categories: ['吸积盘物理', '流体动力学'],
        tags: ['Novikov-Thorne', 'ISCO Radius', 'Blackbody Gradient'],
        excerpt: '基于 Novikov-Thorne 理论模型计算内最稳定圆轨道（ISCO）至外边缘的温度与辐射场分布。利用程序化噪声与多色黑体光谱积分生成高保真湍流吸积盘纹理。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      },
      {
        slug: 'single-file-zero-dependency-bundle',
        title: '123 KB 单文件零依赖极致架构',
        date: '2025-12-20',
        category: '工程架构',
        categories: ['工程架构', '极轻交付'],
        tags: ['Vanilla WebGL', 'Raw GLSL', 'Single File', 'High Perf'],
        excerpt: '完全不依赖外部重型计算框架与外部 CDN。将复杂的测地线求解矩阵、着色器编译与交互视口完整凝练在 123 KB 单一独立文件中，秒级开箱即跑，极致稳定。',
        url: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo'
      }
    ];

    window.WELKIN_FEATURED = window.WELKIN_POSTS.map(post => ({ ...post, displayCover: '' }));

    // Generate post-selector buttons required by Welkin motion & glass-scene
    const selector = document.getElementById('post-selector');
    if (selector) {
      selector.innerHTML = '';
      window.WELKIN_FEATURED.forEach((post, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'post-choice';
        button.dataset.postIndex = String(index);
        button.dataset.number = String(index + 1).padStart(2, '0');
        button.style.setProperty('--slot', String(index));
        button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
        button.setAttribute('aria-label', '预览：' + post.title);

        const title = document.createElement('span');
        title.className = 'choice-title';
        title.textContent = post.title;

        const date = document.createElement('span');
        date.className = 'choice-date';
        date.textContent = post.date.replaceAll('-', '.');

        const face = document.createElement('span');
        face.className = 'file-face';
        face.append(title, date);
        button.append(face);
        selector.append(button);
      });
    }

    // Populate the drawer entries inside #entries
    const entriesEl = document.getElementById('entries');
    if (entriesEl) {
      entriesEl.innerHTML = '';
      window.WELKIN_POSTS.forEach((post) => {
        const item = document.createElement('a');
        item.className = 'entry';
        item.href = post.url || 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo';
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
        item.innerHTML = `
          <time class="entry-date">${post.date.replaceAll('-', '.')}</time>
          <span class="entry-title">${post.title}</span>
          <span class="entry-category">${post.category}</span>
          <span class="entry-arrow" aria-hidden="true">↗</span>
        `;
        entriesEl.appendChild(item);
      });
    }

    // Drawer close handling
    const archiveSection = document.getElementById('archive');
    const showArticlesBtn = document.getElementById('show-articles');
    if (archiveSection) {
      let closeDrawerBtn = document.getElementById('close-archive-drawer');
      if (!closeDrawerBtn) {
        closeDrawerBtn = document.createElement('button');
        closeDrawerBtn.id = 'close-archive-drawer';
        closeDrawerBtn.className = 'archive-close';
        closeDrawerBtn.style.position = 'relative';
        closeDrawerBtn.style.top = '0';
        closeDrawerBtn.style.left = '0';
        closeDrawerBtn.style.marginBottom = '16px';
        closeDrawerBtn.textContent = '← 返回 3D 档案匣';
        const archiveHead = archiveSection.querySelector('.archive-head');
        if (archiveHead) {
          archiveHead.prepend(closeDrawerBtn);
        }
      }
      closeDrawerBtn.addEventListener('click', () => {
        archiveSection.hidden = true;
        document.body.classList.remove('articles-visible');
        if (showArticlesBtn) showArticlesBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Initialize motion & 3D scene
    if (typeof window.initWelkinMotion === 'function') {
      window.initWelkinMotion(window.WELKIN_FEATURED);
    }
    initializeGlassScene();
    window.dispatchEvent(new Event('welkin-ready'));

    // Link editorial slogan with Welkin view change
    this.bindSloganLinkage();
  }

  bindSloganLinkage() {
    const stage = document.getElementById('feature-stage');
    const sloganTitle = document.getElementById('welkin-slogan-title');
    const sloganDesc = document.getElementById('welkin-slogan-desc');

    if (!stage || !sloganTitle) return;

    const updateSlogan = (state) => {
      if (state === 'opening' || state === 'open') {
        sloganTitle.textContent = '看一看。';
        sloganDesc.innerHTML = '玻璃舱盖已升起。<br>按住拖拽可左右旋转。';
      } else {
        sloganTitle.textContent = '翻一翻。';
        sloganDesc.innerHTML = '档案会跟着动。<br>光影也是。';
      }
    };

    window.addEventListener('welkin-view-change', (e) => {
      const state = e.detail?.state;
      updateSlogan(state);
    });

    const observer = new MutationObserver(() => {
      const state = stage.getAttribute('data-archive-view');
      updateSlogan(state);
    });
    observer.observe(stage, { attributes: true, attributeFilter: ['data-archive-view'] });
  }
}
