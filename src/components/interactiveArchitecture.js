/**
 * InteractiveArchitecture - Section 02 Category Filters & Deep Formula / GLSL Inspector
 * Allows user to:
 *  - Filter skill matrix by 4 specialized domains with live pill counts
 *  - Click ANY skill chip to open an interactive Formula & Shader Inspector Modal
 *  - Inspect exact mathematical derivations (Kerr metric, RK4, Doppler beaming, Raymarching)
 *  - One-click copy equations or code snippets to clipboard with audio feedback
 */

import { sound } from './soundEngine.js';

export class InteractiveArchitecture {
  constructor() {
    this.filterContainer = null;
    this.skillCards = [];
    this.inspectorModal = null;

    // Database of technical formulas and GLSL snippets for each skill chip
    this.skillDatabase = {
      '克尔度规 (Kerr Metric)': {
        category: '数理与相对论 / RELATIVITY',
        score: '98%',
        tag: 'GENERAL RELATIVITY // EXACT SOLUTION',
        desc: '旋转无电荷轴对称黑洞的爱因斯坦引力场严格真空解，使用波雅尔-林德奎斯特 (Boyer-Lindquist) 坐标系表达。',
        formula: `ds² = -(1 - 2Mr/ρ²)dt² - (4Mar sin²θ/ρ²)dtdφ + (ρ²/Δ)dr² + ρ²dθ² + (r² + a² + 2Ma²r sin²θ/ρ²)sin²θ dφ²\n\n其中:\nρ² = r² + a²cos²θ\nΔ  = r² - 2Mr + a²`,
        engineApplication: '在 GARGANTUA 着色器中，利用逆度规张量 g^μν 解算零测地线动量演化方程，精确还原光线在旋转黑洞周围的偏折。'
      },
      '零测地线方程 (Null Geodesic)': {
        category: '数理与相对论 / RELATIVITY',
        score: '96%',
        tag: 'HAMILTON-JACOBI GEODESICS',
        desc: '无质量粒子（光子）在弯曲时空中运动的四维极值路径方程。',
        formula: `p^α ∇_α p^β = 0  且  g_αβ p^α p^β = 0\n\n哈密顿-雅可比可分离形式:\n(dr/dλ)² = R(r),  (dθ/dλ)² = Θ(θ)`,
        engineApplication: '用于摄像机视锥发射的每一条光线逆时间步进追踪，判断光线落入视界还是逃逸至天球背景。'
      },
      'RK4 数值步进积分器': {
        category: '数理与相对论 / RELATIVITY',
        score: '94%',
        tag: 'NUMERICAL ODE INTEGRATION',
        desc: '经典四阶龙格-库塔数值求解算法，兼顾计算收敛速度与测地线数值稳定性。',
        formula: `k₁ = f(t_n, y_n)\nk₂ = f(t_n + h/2, y_n + h·k₁/2)\nk₃ = f(t_n + h/2, y_n + h·k₂/2)\nk₄ = f(t_n + h, y_n + h·k₃)\ny_{n+1} = y_n + (h/6)(k₁ + 2k₂ + 2k₃ + k₄)`,
        engineApplication: '在着色器循环内对光线位置与动量八元常微分方程组进行积分，自适应调整步长 h 跨越强引力场。'
      },
      '多普勒集束与频移': {
        category: '数理与相对论 / RELATIVITY',
        score: '95%',
        tag: 'RELATIVISTIC DOPPLER & BEAMING',
        desc: '吸积盘近光速旋转物质发出的辐射因相对论效应产生的极端蓝移集束与红移暗化。',
        formula: `g = (p_μ u^μ_obs) / (p_μ u^μ_emit) = 1 / [ γ(1 - v_rot·cos α) ]\n\n表观辐射通量放大:\nI_obs(ν) = g³ · I_emit(ν/g)`,
        engineApplication: '吸积盘左侧朝向观察者高速运动，辐射被剧烈蓝移增亮数十倍；右侧远离观察者发生红移暗化，形成经典非对称不对称环影。'
      },
      '能层与光子球动力学': {
        category: '数理与相对论 / RELATIVITY',
        score: '92%',
        tag: 'ERGOSPHERE & PHOTON SPHERE',
        desc: '由于旋转时空拖拽导致静止极限面与事件视界分离形成的能量富集区。',
        formula: `静止极限面 (Ergosurface): r_ergo(θ) = M + √(M² - a²cos²θ)\n事件视界 (Event Horizon): r_event = M + √(M² - a²)\n\n光子临界碰撞截面: b_crit = 3√3 M (自旋 a=0)`,
        engineApplication: '实时着色器判定光子是否穿越临界视界，精确切割爱因斯坦光子环与全黑事件视界。'
      },
      'GLSL 着色器语言': {
        category: '着色器与管线 / GRAPHICS',
        score: '96%',
        tag: 'FRAGMENT SHADER ACCELERATION',
        desc: '纯原生 GLSL 3.0 ES 并行片段着色器，全流程无高级语言抽象开销。',
        formula: `// GARGANTUA 核心着色器光线步进片段\nvec3 raymarchGeodesic(vec3 ro, vec3 rd) {\n  vec4 state = vec4(ro, 0.0);\n  vec4 mom = vec4(normalize(rd), 0.0);\n  for(int i = 0; i < MAX_STEPS; i++) {\n    state += rk4Step(state, mom, dt);\n    if(length(state.xyz) < r_horizon) return vec3(0.0);\n  }\n  return sampleAccretionDisk(state);\n}`,
        engineApplication: '以每秒数千万次并行射线计算，将黑洞引力透镜完全交由 GPU 纯硬解渲染。'
      },
      'WebGL 2.0 原生管线': {
        category: '着色器与管线 / GRAPHICS',
        score: '95%',
        tag: 'DIRECT HARDWARE CONTROL',
        desc: '零 Three.js / Babylon 等大型运行时绑定的纯原生 WebGL 2.0 状态机调度。',
        formula: `const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });\ngl.bindVertexArray(vao);\ngl.useProgram(gargantuaProgram);\ngl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);`,
        engineApplication: '仅用单一全屏矩形四顶点，驱动 100% 纯片段着色器计算，保证全平台设备 60 FPS 顶格交付。'
      },
      '光线步进 (Raymarching)': {
        category: '着色器与管线 / GRAPHICS',
        score: '94%',
        tag: 'CURVED SPATIO-TEMPORAL MARCHING',
        desc: '沿非线性曲线（时空测地线）逐步推进光线矢量的容积采样技术。',
        formula: `x_{k+1} = x_k + v_k · Δλ\nv_{k+1} = v_k + a(x_k, v_k) · Δλ`,
        engineApplication: '穿越薄吸积盘时采用二次贝塞尔采样积分，消除密集层叠条纹伪影。'
      },
      'Three.js 场景调度': {
        category: '着色器与管线 / GRAPHICS',
        score: '90%',
        tag: 'HYBRID SCENIC COMPOSITION',
        desc: '用于外围 3D 雕塑网格、圆角卡匣与 Rhine Lab 空间界面的轻量三维场景管理。',
        formula: `scene.add(ribbonMesh);\nrenderer.render(scene, camera);`,
        engineApplication: '与原生 GLSL 黑洞画布无缝合成，实现磨砂玻璃卡匣与底层引力波纹的深度协同。'
      },
      '黑体辐射光谱积分': {
        category: '着色器与管线 / GRAPHICS',
        score: '92%',
        tag: 'PLANCK BLACKBODY EMISSION',
        desc: '根据普朗克辐射定律将吸积盘理论开尔文温度实时映射至物理准确的 RGB 色度学。',
        formula: `B_ν(T) = (2hν³ / c²) · 1 / [ exp(hν / kT) - 1 ]\n\nCIE 1931 色彩空间 XYZ 转换矩阵卷积`,
        engineApplication: '吸积盘内环数百万度等离子体呈现白蓝高能辐射，外缘逐渐渐变至红外与金橙色。'
      },
      '单文件交付 (123 KB)': {
        category: '轻量工程 / ARCHITECTURE',
        score: '100%',
        tag: 'ZERO RUNTIME OVERHEAD',
        desc: '全套物理着色器、数理积分与渲染循环内聚于单一 123 KB 文件，无任何外部资产下载。',
        formula: `INDEX.HTML (123.4 KB) = [ GLSL 源码 (48KB) + 数学内核 (32KB) + 渲染画布 (43.4KB) ]`,
        engineApplication: '极大降低全球访客首屏加载时延，在无网络或弱网环境下均可离线瞬间启动。'
      },
      '零外部网络依赖': {
        category: '轻量工程 / ARCHITECTURE',
        score: '100%',
        tag: '100% AIR-GAPPED OFFLINE READY',
        desc: '不依赖任何 Google Fonts、CDN 库或第三方追踪遥测代码，实现真正的纯静态交付。',
        formula: `EXTERNAL_HTTP_REQUESTS = 0\nNPM_RUNTIMES = 0\nLOCAL_COMPUTATION = 100%`,
        engineApplication: '防范 CDN 劫持或网络超时风险，保证十年后打开仍可原汁原味顺畅运行。'
      },
      '60 FPS 性能预算': {
        category: '轻量工程 / ARCHITECTURE',
        score: '96%',
        tag: 'STABLE FRAME-PACING GUARANTEE',
        desc: '针对集成显卡与移动端优化的着色器迭代步长与 Early-exit 跳出逻辑。',
        formula: `Frame Budget: 16.66 ms\nShader Pass: 8.2 ms\nBuffer Swap: 1.4 ms\nMargin: 7.06 ms`,
        engineApplication: '在弱算力设备上自适应降低半分辨率步进，保证交互丝滑不掉帧。'
      },
      '原生 ESNext / TS': {
        category: '轻量工程 / ARCHITECTURE',
        score: '95%',
        tag: 'MODERN WEB STANDARDS',
        desc: '遵循现代 ECMAScript 标准的高性能模块化编写，无历史打包包袱。',
        formula: `class RelativisticEngine extends EventTarget {\n  #state;\n  computeGeodesics() {}\n}`,
        engineApplication: '代码整洁高内聚，易于二次扩展与学术科研代码移植。'
      },
      'Vite 生产构建优化': {
        category: '轻量工程 / ARCHITECTURE',
        score: '94%',
        tag: 'EXTREME ROLLUP BUNDLING',
        desc: '基于 Rollup 与 Terser 的死代码消除（Tree-shaking）与着色器字符串极致压缩。',
        formula: `Vite Build Output: 0 Warnings · Gzip 42 KB`,
        engineApplication: '最大化代码复用度，构建产物即拉即跑。'
      },
      '3D 轴测卡匣抽拉交互': {
        category: '交互与体验 / INTERFACE',
        score: '96%',
        tag: 'AXONOMETRIC TACTILE CASSETTE',
        desc: '参考 RhineLabUI 与 Welkin 的 3D 磨砂玻璃档案匣物理抽拉与液压掀盖动效。',
        formula: `Camera Transition: Spring Damp f(t) = exp(-λt) · cos(ωt)\nHydraulic Lid: Angle θ(t) = -0.46π · smoothstep(0.15, 1.0, t)`,
        engineApplication: '提供从平视网格到俯仰主视角的无缝三维镜头推拉与 360 度交互旋转体验。'
      },
      'Web Audio 程序音效': {
        category: '交互与体验 / INTERFACE',
        score: '92%',
        tag: 'PROCEDURAL AUDIO SYNTHESIZER',
        desc: '基于 Web Audio API 振荡器与双二阶滤波器的实时程序化音效合成，0 外部 MP3/WAV 资源。',
        formula: `const osc = ctx.createOscillator();\nosc.frequency.exponentialRampToValueAtTime(120, t + 0.05);`,
        engineApplication: '提供打字微震、机械继电器拟态咔哒、警报号角与声学冲击波等拟真物理听感。'
      },
      '拟态硬件物理触感': {
        category: '交互与体验 / INTERFACE',
        score: '94%',
        tag: 'NEUMORPHIC DUAL LIGHT/DARK',
        desc: '以双重内凹/凸起柔性阴影重现工业硬件控制面板的沉浸式操作质感。',
        formula: `box-shadow: inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff;`,
        engineApplication: '打造如同实体仪器旋钮与机械开关般的指尖物理交互反馈。'
      },
      '整屏物理滑动画卷': {
        category: '交互与体验 / INTERFACE',
        score: '95%',
        tag: 'FULL-PAGE MAGNETIC SNAPPING',
        desc: '以整块屏幕为物理单元的磁吸画卷滚动，杜绝传统滚轮飘移，保证大开大合的视觉秩序感。',
        formula: `window.scrollTo({ top: sectionIndex * vh, behavior: 'smooth' });`,
        engineApplication: '让用户的每次滑动都如同一页精密翻阅的莱茵生命科研机密手报。'
      },
      '全键盘与无障碍支持': {
        category: '交互与体验 / INTERFACE',
        score: '92%',
        tag: 'ACCESSIBLE KEYBOARD SHORTCUTS',
        desc: '全面支持 Ctrl+B（3D控制台）、Ctrl+M（静音）、ArrowLeft/Right（翻阅）、ESC（返回）等全键位操作。',
        formula: `document.addEventListener('keydown', (e) => { ... });`,
        engineApplication: '专业开发者无需触碰鼠标即可通过键位行云流水穿梭于整个终端操作系统。'
      }
    };

    this.init();
  }

  init() {
    this.initFilterBar();
    this.initChipInspectors();
    this.createInspectorModal();
  }

  // --- 1. Category Filter Bar ---
  initFilterBar() {
    const sectionHeader = document.querySelector('#skills .sec-header-block');
    if (!sectionHeader) return;

    let filterBar = document.getElementById('skills-filter-bar');
    if (!filterBar) {
      filterBar = document.createElement('div');
      filterBar.id = 'skills-filter-bar';
      filterBar.className = 'skills-filter-bar';
      filterBar.innerHTML = `
        <button class="filter-tab-pill active" data-filter="all">全部 ALL <span class="pill-count">20</span></button>
        <button class="filter-tab-pill" data-filter="relativity">数理相对论 RELATIVITY <span class="pill-count">5</span></button>
        <button class="filter-tab-pill" data-filter="graphics">着色器管线 GRAPHICS <span class="pill-count">5</span></button>
        <button class="filter-tab-pill" data-filter="architecture">轻量交付 ARCHITECTURE <span class="pill-count">5</span></button>
        <button class="filter-tab-pill" data-filter="interface">交互体验 INTERFACE <span class="pill-count">5</span></button>
      `;
      sectionHeader.after(filterBar);
    }

    this.skillCards = Array.from(document.querySelectorAll('#skills .skill-group-card'));
    const pills = filterBar.querySelectorAll('.filter-tab-pill');

    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        sound.playClick();
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        this.filterCards(filter);
      });
    });
  }

  filterCards(filter) {
    const categoryMap = {
      'all': [0, 1, 2, 3],
      'relativity': [0],
      'graphics': [1],
      'architecture': [2],
      'interface': [3]
    };

    const targetIndices = new Set(categoryMap[filter] || [0, 1, 2, 3]);

    this.skillCards.forEach((card, index) => {
      if (targetIndices.has(index)) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  }

  // --- 2. Interactive Chip Inspection ---
  initChipInspectors() {
    const chips = document.querySelectorAll('#skills .skill-chip');
    chips.forEach((chip) => {
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('title', '点击调阅数学推导公式与着色器工程源码');

      const triggerInspect = () => {
        const chipName = chip.querySelector('.chip-name')?.textContent?.trim() || '';
        this.openInspector(chipName);
      };

      chip.addEventListener('click', triggerInspect);
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerInspect();
        }
      });
    });
  }

  // --- 3. Modal Creation & Open ---
  createInspectorModal() {
    if (document.getElementById('skill-inspector-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'skill-inspector-modal';
    modal.className = 'skill-inspector-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="inspector-backdrop" id="inspector-backdrop"></div>
      <div class="inspector-card-shell">
        <div class="inspector-header">
          <div class="ih-left">
            <span class="ih-rhine-badge">⬡ RHINE LAB // ARCHITECTURE PROBE</span>
            <span class="ih-category mono" id="insp-category">数理与相对论</span>
          </div>
          <button class="inspector-close-btn" id="insp-close-btn" title="关闭探针 (ESC)">✕</button>
        </div>

        <div class="inspector-body">
          <div class="insp-title-row">
            <h3 class="insp-title" id="insp-title">克尔度规 (Kerr Metric)</h3>
            <span class="insp-score mono" id="insp-score">98% 深度掌握</span>
          </div>
          <div class="insp-tag-badge mono" id="insp-tag">GENERAL RELATIVITY // EXACT SOLUTION</div>

          <p class="insp-desc" id="insp-desc"></p>

          <div class="insp-code-block-wrap">
            <div class="code-bar">
              <span class="code-label mono">MATHEMATICAL DERIVATION / GLSL IMPLEMENTATION</span>
              <button class="btn-copy-code mono" id="btn-copy-insp-code">
                <span>[ COPY / 复制公式源码 ]</span>
              </button>
            </div>
            <pre class="insp-code-pre mono"><code id="insp-code"></code></pre>
          </div>

          <div class="insp-engine-role">
            <span class="role-label mono">GARGANTUA 相对论引擎工程落地:</span>
            <p class="role-desc" id="insp-engine-role"></p>
          </div>
        </div>

        <div class="inspector-footer">
          <span class="footer-tip mono">提示: 按 ESC 或点击遮罩层可快速退出探针视窗</span>
          <a href="https://github.com/mayi-111/GARGANTUA-Blackhole-demo" target="_blank" rel="noopener noreferrer" class="btn-goto-repo">前往 GARGANTUA 查看落地 ↗</a>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.inspectorModal = modal;

    const closeBtn = document.getElementById('insp-close-btn');
    const backdrop = document.getElementById('inspector-backdrop');
    const copyBtn = document.getElementById('btn-copy-insp-code');

    const closeModal = () => this.closeInspector();
    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);

    copyBtn?.addEventListener('click', () => {
      sound.playCopy();
      const codeText = document.getElementById('insp-code')?.textContent || '';
      navigator.clipboard.writeText(codeText).catch(() => {});
      this.showToast('✓ 架构数学公式 / 着色器代码已复制到剪贴板！');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.inspectorModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  openInspector(chipName) {
    sound.playInspect();
    const data = this.skillDatabase[chipName] || {
      category: '技术架构 / ARCHITECTURE',
      score: '95%',
      tag: 'CORE SUBSYSTEM',
      desc: `${chipName} 是 mayi-111 在构建高精度物理引擎与纯白三维界面中的核心技术支柱。`,
      formula: `// ${chipName}\nvoid main() {\n  // 100% Native WebGL 2.0 / GLSL Execution\n}`,
      engineApplication: '在纯浏览器环境中实现零延迟、高保真物理图景呈现。'
    };

    document.getElementById('insp-title').textContent = chipName;
    document.getElementById('insp-category').textContent = data.category;
    document.getElementById('insp-score').textContent = `${data.score} 深度掌握`;
    document.getElementById('insp-tag').textContent = data.tag;
    document.getElementById('insp-desc').textContent = data.desc;
    document.getElementById('insp-code').textContent = data.formula;
    document.getElementById('insp-engine-role').textContent = data.engineApplication;

    this.inspectorModal.classList.add('active');
    this.inspectorModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  closeInspector() {
    sound.playClick();
    this.inspectorModal.classList.remove('active');
    this.inspectorModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
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
