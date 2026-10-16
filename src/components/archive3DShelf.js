/**
 * Archive3DShelf - Welkin Procedural Glass Archive Showcase
 * 1:1 Reproduction of Welkin Art Direction (Hexo Theme Welkin by ZenithSeraph)
 * & User Reference Screenshots:
 *  - "翻一翻。档案会跟着动。光影也是。"
 *  - Axonometric stepped cascading array of warm ivory frosted acrylic/glass cassettes.
 *  - Pure, serene, breathable composition — zero clutter, zero fake barcodes or industrial caution tape.
 *  - Soft contact shadows, gentle studio lighting, and glossy rim highlights.
 *  - Interactive spring traveling wave on wheel, drag, and arrow buttons.
 *  - Dynamic 3D-tracked floating HUD label: "客体细节 / 2026.01.12", "点一下，慢慢展开。", "打开档案 ↗".
 *  - "点一下。档案慢慢打开。" -> Cinematic camera push-in & card expansion into frosted glass dossier.
 *  - All 7 flagship modules dedicated 100% to User's GARGANTUA Relativistic Kerr Blackhole Engine.
 */

import * as THREE from 'three';
import { sound } from './soundEngine.js';

export class Archive3DShelf {
  constructor(containerId = 'archive-3d-shelf') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Flagship Modules: 100% mayi-111 / GARGANTUA Blackhole Engine
    this.projects = [
      {
        id: 'MOD-01',
        index: '01',
        title: 'GARGANTUA 相对论克尔黑洞引擎',
        subTitle: 'RELATIVISTIC KERR BLACK HOLE ENGINE',
        category: '广义相对论 / 实时物理引擎',
        date: '2026.01.12',
        desc: '从零实现的广义相对论黑洞实时物理可视化引擎：引力透镜光线偏折、吸积盘极端相对论多普勒频移、光子环与事件视界。单文件 123 KB 交付，零外部依赖，直接在纯 WebGL 环境下计算测地线光线弯曲。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['WebGL 2.0', 'GLSL Shaders', 'Three.js', 'General Relativity', 'Raymarching'],
        metric: '单文件 123 KB · 零依赖 · 60 FPS'
      },
      {
        id: 'MOD-02',
        index: '02',
        title: '克尔测地线四阶龙格库塔积分',
        subTitle: 'KERR GEODESIC RK4 NUMERICAL INTEGRATOR',
        category: '微分几何 / 测地线方程',
        date: '2026.01.10',
        desc: '基于 Boyer-Lindquist 坐标系精确求解旋转黑洞弯曲时空中的零测地线微分方程。采用四阶龙格库塔（RK4）数值自适应积分，计算光线掠过引力奇点时的极端偏折轨迹。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Boyer-Lindquist', 'RK4 Numerical', 'Geodesic Math', 'GLSL Integration'],
        metric: '自适应步长 · 亚像素级偏折精度'
      },
      {
        id: 'MOD-03',
        index: '03',
        title: '极端相对论多普勒集束与频移',
        subTitle: 'RELATIVISTIC DOPPLER BEAMING & SHIFT',
        category: '天体物理 / 辐射流转',
        date: '2026.01.08',
        desc: '模拟吸积盘高速绕转等离子体（β≈0.72c）引起的极端相对论多普勒效应。迎面朝向观察者的高速粒子呈现剧烈蓝移与集束增亮，背向远离端呈现暗红红移，完美还原非对称黑洞盘面。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Doppler Beaming', 'Lorentz Invariance', 'Planck Spectrum', 'Astrophysics'],
        metric: 'β = 0.72c · 洛伦兹变换'
      },
      {
        id: 'MOD-04',
        index: '04',
        title: '爱因斯坦光子球与阴影边界',
        subTitle: 'EINSTEIN PHOTON SPHERE & SHADOW',
        category: '物理可视 / 边界理论',
        date: '2026.01.05',
        desc: '计算极端引力场下不稳定光子圆轨道的几何临界截面，呈现围绕黑洞的极窄高亮光子环（Photon Ring）与无光逃逸的事件视界阴影（Black Hole Shadow）。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Photon Sphere', 'Shadow Boundary', 'Critical Radius', 'Raymarching'],
        metric: '临界捕获半径 r_c · 无限重像'
      },
      {
        id: 'MOD-05',
        index: '05',
        title: '克尔能层与时空拖拽效应',
        subTitle: 'KERR ERGOSPHERE & FRAME DRAGGING',
        category: '时空几何 / 彭罗斯机制',
        date: '2026.01.03',
        desc: '转动时空的引力磁效应（愣色-蒂尔林效应）。在静止极限面与外事件视界之间，时空本身被强行拖曳以超越光速旋转，呈现克尔度规特有的扁球形能层结构。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Ergosphere', 'Frame-Dragging', 'Penrose Process', 'Static Limit'],
        metric: '自旋参数 a* = 0.998 · 极端旋转'
      },
      {
        id: 'MOD-06',
        index: '06',
        title: 'Novikov-Thorne 几何薄吸积盘',
        subTitle: 'THIN ACCRETION DISK MULTI-TEMP MODEL',
        category: '吸积盘物理 / 流体动力学',
        date: '2025.12.28',
        desc: '基于 Novikov-Thorne 理论模型计算内最稳定圆轨道（ISCO）至外边缘的温度与辐射场分布。利用程序化噪声与多色黑体光谱积分生成高保真湍流吸积盘纹理。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Novikov-Thorne', 'ISCO Radius', 'Blackbody Gradient', 'Procedural GLSL'],
        metric: 'r_ISCO = 1.237 r_g · 普朗克积分'
      },
      {
        id: 'MOD-07',
        index: '07',
        title: '123 KB 单文件零依赖极致架构',
        subTitle: 'ZERO-DEPENDENCY SINGLE-FILE BUNDLE',
        category: '工程架构 / 极轻交付',
        date: '2025.12.20',
        desc: '完全不依赖外部重型计算框架与外部 CDN。将复杂的测地线求解矩阵、着色器编译与交互视口完整凝练在 123 KB 单一独立文件中，秒级开箱即跑，极致稳定。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Vanilla WebGL', 'Raw GLSL', 'Single File Architecture', 'High Perf'],
        metric: '单文件 123 KB · 零外部依赖 · 60 FPS'
      }
    ];

    this.selectedIndex = 0;
    this.targetIndex = 0;
    this.springIndex = 0;
    this.isDetailOpen = false;

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);

    // Camera viewpoints (Welkin Axonometric Telephoto Perspective)
    this.overviewCamPos = new THREE.Vector3(-14.5, 12.8, 17.5);
    this.overviewLookAt = new THREE.Vector3(0.5, 0.4, -0.5);
    this.detailCamPos = new THREE.Vector3(-0.8, 2.2, 8.4);
    this.detailLookAt = new THREE.Vector3(0, 1.2, 0);

    this.currentCamPos = this.overviewCamPos.clone();
    this.currentLookAt = this.overviewLookAt.clone();
    this.targetCamPos = this.overviewCamPos.clone();
    this.targetLookAt = this.overviewLookAt.clone();

    // Parallax sway
    this.parallaxX = 0;
    this.parallaxY = 0;
    this.targetParallaxX = 0;
    this.targetParallaxY = 0;

    // Cassette Meshes & Groups
    this.cassettes = [];
    this.gridGroup = null;

    // DOM UI elements
    this.floatingHud = document.getElementById('welkin-floating-hud');
    this.hudMeta = document.getElementById('welkin-hud-meta');
    this.hudTitle = document.getElementById('welkin-hud-title');
    this.hudOpenBtn = document.getElementById('welkin-hud-open-btn');

    this.sloganTitle = document.getElementById('welkin-slogan-title');
    this.sloganDesc = document.getElementById('welkin-slogan-desc');

    this.curIndexEl = document.getElementById('welkin-cur-index');
    this.totIndexEl = document.getElementById('welkin-tot-index');
    this.prevBtn = document.getElementById('welkin-prev-btn');
    this.nextBtn = document.getElementById('welkin-next-btn');
    this.allModulesBtn = document.getElementById('w-nav-all-modules');
    this.centerHintBtn = document.getElementById('welkin-center-scroll-hint');

    this.detailCard = document.getElementById('welkin-detail-card');
    this.backBtn = document.getElementById('welkin-back-btn');
    this.sheetMeta = document.getElementById('welkin-sheet-meta');
    this.sheetTitle = document.getElementById('welkin-sheet-title');
    this.sheetDesc = document.getElementById('welkin-sheet-desc');
    this.sheetMetric = document.getElementById('welkin-sheet-metric');
    this.sheetCategory = document.getElementById('welkin-sheet-category');
    this.sheetRepoLink = document.getElementById('welkin-sheet-repo-link');
    this.sheetNextBtn = document.getElementById('welkin-sheet-next-link');

    this.clock = new THREE.Clock();

    this.init();
    this.buildSteppedCascade();
    this.bindEvents();
    this.updateHUD(0);
    this.animate();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 580;

    this.scene = new THREE.Scene();

    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';

    // Warm ivory Welkin studio background
    const bgColor = isDark ? 0x14171d : 0xf6f4f0;
    this.scene.background = new THREE.Color(bgColor);
    this.scene.fog = new THREE.Fog(bgColor, 28, 70);

    // Axonometric telephoto camera (FOV 26)
    this.camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 100);
    this.camera.position.copy(this.overviewCamPos);
    this.camera.lookAt(this.overviewLookAt);

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;

    // Serene studio lighting setup
    const hemiLight = new THREE.HemisphereLight(0xfffdfa, 0xb8aba0, 0.95);
    this.scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ec, 1.35);
    keyLight.position.set(-8, 16, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xedf4fa, 0.55);
    fillLight.position.set(12, 10, -8);
    this.scene.add(fillLight);

    const specularRimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    specularRimLight.position.set(0, 12, -14);
    this.scene.add(specularRimLight);

    // Ground plane with subtle contact drop shadow
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.ShadowMaterial({ opacity: isDark ? 0.28 : 0.08 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * Generates crisp printed paper label texture inside the glass cassette
   */
  createPaperFaceTexture(project, isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // Warm ivory parchment base
    ctx.fillStyle = isDark ? '#1a1e24' : '#f5f2eb';
    ctx.fillRect(0, 0, 1024, 768);

    // Soft border
    ctx.strokeStyle = isDark ? '#2d333b' : '#e2ded5';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 984, 728);

    // Large clean numeral (e.g. 01)
    ctx.fillStyle = isDark ? '#f0f3f6' : '#333734';
    ctx.font = '700 136px "Chakra Petch", "JetBrains Mono", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(project.index, 60, 56);

    // Date
    ctx.fillStyle = isDark ? '#8b949e' : '#888b83';
    ctx.font = '600 34px "JetBrains Mono", monospace';
    ctx.fillText(project.date, 64, 218);

    // Title
    ctx.fillStyle = isDark ? '#f0f3f6' : '#2b2f2c';
    ctx.font = '700 52px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    const cleanTitle = project.title.length > 14 ? project.title.substring(0, 13) + '…' : project.title;
    ctx.fillText(cleanTitle, 60, 310);

    // Subtitle / English
    ctx.fillStyle = isDark ? '#7d8590' : '#72766d';
    ctx.font = '600 24px "Chakra Petch", sans-serif';
    ctx.fillText(project.subTitle, 64, 388);

    // 1px delicate divider rule
    ctx.strokeStyle = isDark ? '#30363d' : '#d8d4c9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 440);
    ctx.lineTo(960, 440);
    ctx.stroke();

    // Summary line
    ctx.fillStyle = isDark ? '#9da7b3' : '#575b53';
    ctx.font = '500 26px "Noto Sans SC", "Microsoft YaHei", sans-serif';
    const descLine = project.desc.substring(0, 34) + '…';
    ctx.fillText(descLine, 60, 480);

    // Metric badge pill
    ctx.fillStyle = isDark ? '#21262d' : '#eae5dc';
    ctx.fillRect(60, 570, 560, 58);
    ctx.strokeStyle = isDark ? '#38434f' : '#cbc5b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 570, 560, 58);

    ctx.fillStyle = isDark ? '#58a6ff' : '#0969da';
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillText(`⬡ ${project.metric}`, 80, 608);

    // Footer brand tag
    ctx.fillStyle = isDark ? '#6e7681' : '#9ea197';
    ctx.font = '600 22px "Chakra Petch", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('WELKIN · GARGANTUA ARCHIVE ↗', 960, 680);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  /**
   * Generates spine label texture for the top edge of the cassette
   */
  createSpineTexture(project, isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = isDark ? '#1f242c' : '#eeebe4';
    ctx.fillRect(0, 0, 1024, 128);

    // Top spine rule
    ctx.fillStyle = isDark ? '#e53935' : '#c62828';
    ctx.fillRect(0, 0, 18, 128);

    ctx.fillStyle = isDark ? '#f0f3f6' : '#333734';
    ctx.font = '700 44px "Chakra Petch", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${project.index} // ${project.title.substring(0, 14)}`, 38, 64);

    ctx.fillStyle = isDark ? '#8b949e' : '#7b8075';
    ctx.font = '600 28px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(project.date, 980, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    return texture;
  }

  /**
   * Builds the pure ivory translucent frosted acrylic stepped cascade
   */
  buildSteppedCascade() {
    this.gridGroup = new THREE.Group();
    this.cassettes = [];

    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';

    // Cassette dimensions matching reference
    const cWidth = 3.20;
    const cHeight = 0.24;
    const cDepth = 2.10;
    const boxGeo = new THREE.BoxGeometry(cWidth, cHeight, cDepth);

    // Translucent Warm Ivory Frosted Glass Material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x22262e : 0xfaf8f4,
      roughness: 0.20,
      metalness: 0.04,
      transmission: 0.65,
      transparent: true,
      opacity: 0.92,
      ior: 1.48,
      thickness: 0.45,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      envMapIntensity: 0.95
    });

    // Cascade arrangement parameters
    const rowStepZ = 0.48; // Overlapping step along depth
    const rowStepY = 0.14; // Cascading staircase lift
    const colSpacingX = 3.85; // Columns spacing

    // Build 3 columns of cascades:
    // Left (-1) and Right (+1) columns provide rich architectural depth.
    // Center (0) column houses the 7 primary interactive GARGANTUA modules.
    const columns = [-1, 0, 1];

    columns.forEach(col => {
      const isCenterCol = col === 0;
      const count = isCenterCol ? this.projects.length : 8;

      for (let r = 0; r < count; r++) {
        const projIdx = isCenterCol ? r : (r % this.projects.length);
        const proj = this.projects[projIdx];

        const cassetteGroup = new THREE.Group();
        cassetteGroup.userData = {
          isPrimary: isCenterCol,
          index: r,
          projectIndex: projIdx,
          project: proj
        };

        // Outer Frosted Glass Shell
        const shellMesh = new THREE.Mesh(boxGeo, glassMat);
        shellMesh.castShadow = true;
        shellMesh.receiveShadow = true;
        cassetteGroup.add(shellMesh);

        // Inner Printed Parchment Label Plate
        const paperGeo = new THREE.PlaneGeometry(cWidth - 0.22, cDepth - 0.22);
        const paperTex = this.createPaperFaceTexture(proj, isDark);
        const paperMat = new THREE.MeshStandardMaterial({
          map: paperTex,
          roughness: 0.82,
          metalness: 0.02
        });
        const paperMesh = new THREE.Mesh(paperGeo, paperMat);
        paperMesh.rotation.x = -Math.PI / 2;
        paperMesh.position.y = cHeight / 2 - 0.015; // Just below top glass face
        cassetteGroup.add(paperMesh);

        // Top Spine Edge Label Plate
        const spineGeo = new THREE.PlaneGeometry(cWidth - 0.16, cHeight - 0.04);
        const spineTex = this.createSpineTexture(proj, isDark);
        const spineMat = new THREE.MeshBasicMaterial({
          map: spineTex,
          transparent: true,
          opacity: 0.90
        });
        const spineMesh = new THREE.Mesh(spineGeo, spineMat);
        spineMesh.position.set(0, 0, -cDepth / 2 - 0.002);
        spineMesh.rotation.y = Math.PI;
        cassetteGroup.add(spineMesh);

        // Contact Ambient Shadow beneath this cassette
        const shadowGeo = new THREE.PlaneGeometry(cWidth * 1.05, cDepth * 1.05);
        const shadowMat = new THREE.MeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: isDark ? 0.25 : 0.09,
          depthWrite: false
        });
        const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
        shadowMesh.rotation.x = -Math.PI / 2;
        shadowMesh.position.y = -cHeight / 2 - 0.005;
        cassetteGroup.add(shadowMesh);

        // Base Position in Stepped Cascade Tray
        const posX = col * colSpacingX;
        const posZ = (r - count * 0.45) * rowStepZ;
        const posY = (count - r) * rowStepY;

        cassetteGroup.position.set(posX, posY, posZ);
        cassetteGroup.userData.basePos = cassetteGroup.position.clone();
        cassetteGroup.userData.baseRot = cassetteGroup.rotation.clone();

        this.gridGroup.add(cassetteGroup);

        if (isCenterCol) {
          this.cassettes.push(cassetteGroup);
        }
      }
    });

    this.scene.add(this.gridGroup);
  }

  bindEvents() {
    // 1. Mouse wheel inside stage switches active cassette with traveling wave
    this.container.addEventListener('wheel', (e) => {
      // Prevent full-page scroll while hovering over the 3D showcase
      if (Math.abs(e.deltaY) > 18) {
        e.preventDefault();
        e.stopPropagation();

        if (this.isDetailOpen) return;

        if (e.deltaY > 0) {
          this.nextCassette();
        } else {
          this.prevCassette();
        }
      }
    }, { passive: false });

    // 2. Parallax mouse movement
    const onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      this.mouse.x = nx;
      this.mouse.y = ny;

      this.targetParallaxX = nx * 1.4;
      this.targetParallaxY = ny * 0.9;
    };
    this.container.addEventListener('mousemove', onPointerMove);

    // 3. Click detection on cassettes via raycaster
    this.container.addEventListener('click', (e) => {
      if (this.isDetailOpen) return;

      const rect = this.container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      this.raycaster.setFromCamera(new THREE.Vector2(nx, ny), this.camera);
      const hits = this.raycaster.intersectObjects(this.cassettes, true);

      if (hits.length > 0) {
        let root = hits[0].object;
        while (root.parent && root.parent !== this.gridGroup) {
          root = root.parent;
        }

        if (root.userData && typeof root.userData.projectIndex === 'number') {
          const idx = root.userData.projectIndex;
          if (idx === this.selectedIndex) {
            this.openDetail();
          } else {
            this.selectIndex(idx);
          }
        }
      }
    });

    // 4. UI Button Bindings
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevCassette());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextCassette());
    }
    if (this.hudOpenBtn) {
      this.hudOpenBtn.addEventListener('click', () => this.openDetail());
    }
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => this.closeDetail());
    }
    if (this.sheetNextBtn) {
      this.sheetNextBtn.addEventListener('click', () => {
        this.nextCassette();
        this.updateDetailCard(this.selectedIndex);
      });
    }
    if (this.allModulesBtn) {
      this.allModulesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDetail();
      });
    }
    if (this.centerHintBtn) {
      this.centerHintBtn.addEventListener('click', () => {
        this.selectIndex((this.selectedIndex + 1) % this.projects.length);
      });
    }

    // 5. Global Keyboard Shortcuts: ← → navigate, ENTER open, ESC close
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;

      // Only respond if Section 03 is in viewport or active
      const sec = document.getElementById('projects');
      if (sec && sec.classList.contains('is-active')) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          this.nextCassette();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.prevCassette();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (!this.isDetailOpen) {
            this.openDetail();
          }
        } else if (e.key === 'Escape') {
          if (this.isDetailOpen) {
            e.preventDefault();
            this.closeDetail();
          }
        }
      }
    });

    // 6. Handle window resize
    window.addEventListener('resize', () => this.onResize());
  }

  nextCassette() {
    sound.playSliderTick();
    const next = (this.selectedIndex + 1) % this.projects.length;
    this.selectIndex(next);
  }

  prevCassette() {
    sound.playSliderTick();
    const prev = (this.selectedIndex - 1 + this.projects.length) % this.projects.length;
    this.selectIndex(prev);
  }

  selectIndex(index) {
    if (index < 0 || index >= this.projects.length) return;
    this.selectedIndex = index;
    this.targetIndex = index;
    this.updateHUD(index);

    if (this.isDetailOpen) {
      this.updateDetailCard(index);
    }
  }

  openDetail() {
    sound.playClick();
    this.isDetailOpen = true;

    // Transition Left Editorial Slogan: "翻一翻。" -> "点一下。"
    if (this.sloganTitle) {
      this.sloganTitle.textContent = '点一下。';
    }
    if (this.sloganDesc) {
      this.sloganDesc.innerHTML = '档案慢慢打开。';
    }

    // Hide Floating HUD
    if (this.floatingHud) {
      this.floatingHud.classList.remove('visible');
    }

    // Populate and show Detail Card
    this.updateDetailCard(this.selectedIndex);
    if (this.detailCard) {
      this.detailCard.classList.add('open');
      this.detailCard.setAttribute('aria-hidden', 'false');
    }

    // Set camera target for intimate inspection pose
    this.targetCamPos.copy(this.detailCamPos);
    this.targetLookAt.copy(this.detailLookAt);
  }

  closeDetail() {
    sound.playClick();
    this.isDetailOpen = false;

    // Restore Left Slogan: "翻一翻。"
    if (this.sloganTitle) {
      this.sloganTitle.textContent = '翻一翻。';
    }
    if (this.sloganDesc) {
      this.sloganDesc.innerHTML = '档案会跟着动。<br>光影也是。';
    }

    // Hide Detail Card
    if (this.detailCard) {
      this.detailCard.classList.remove('open');
      this.detailCard.setAttribute('aria-hidden', 'true');
    }

    // Restore Floating HUD
    this.updateHUD(this.selectedIndex);

    // Restore camera target
    this.targetCamPos.copy(this.overviewCamPos);
    this.targetLookAt.copy(this.overviewLookAt);
  }

  updateHUD(index) {
    const proj = this.projects[index];
    if (!proj) return;

    if (this.curIndexEl) {
      this.curIndexEl.textContent = proj.index;
    }
    if (this.totIndexEl) {
      this.totIndexEl.textContent = String(this.projects.length).padStart(2, '0');
    }

    if (this.hudMeta) {
      this.hudMeta.textContent = `客体细节 / ${proj.date}`;
    }
    if (this.hudTitle) {
      this.hudTitle.textContent = '点一下，慢慢展开。';
    }

    if (this.floatingHud && !this.isDetailOpen) {
      this.floatingHud.classList.add('visible');
    }
  }

  updateDetailCard(index) {
    const proj = this.projects[index];
    if (!proj) return;

    if (this.sheetMeta) {
      this.sheetMeta.textContent = `关于 GARGANTUA / ${proj.date}`;
    }
    if (this.sheetTitle) {
      this.sheetTitle.textContent = `${proj.title}。`;
    }
    if (this.sheetDesc) {
      this.sheetDesc.textContent = proj.desc;
    }
    if (this.sheetMetric) {
      this.sheetMetric.textContent = proj.metric;
    }
    if (this.sheetCategory) {
      this.sheetCategory.textContent = proj.category;
    }
    if (this.sheetRepoLink) {
      this.sheetRepoLink.href = proj.github;
    }
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 580;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const dt = Math.min(this.clock.getDelta(), 0.1);

    // 1. Spring physics for traveling wave position
    const springForce = (this.targetIndex - this.springIndex) * 12.0;
    this.springIndex += springForce * dt;

    // 2. Parallax camera sway
    this.parallaxX += (this.targetParallaxX - this.parallaxX) * 0.08;
    this.parallaxY += (this.targetParallaxY - this.parallaxY) * 0.08;

    // 3. Camera Position and LookAt interpolation
    this.currentCamPos.lerp(this.targetCamPos, 0.08);
    this.currentLookAt.lerp(this.targetLookAt, 0.08);

    this.camera.position.set(
      this.currentCamPos.x + this.parallaxX,
      this.currentCamPos.y + this.parallaxY,
      this.currentCamPos.z
    );
    this.camera.lookAt(this.currentLookAt);

    // 4. Update stepped cassette positions and traveling wave
    this.cassettes.forEach((cassette, i) => {
      const basePos = cassette.userData.basePos;
      const baseRot = cassette.userData.baseRot;

      if (this.isDetailOpen && i === this.selectedIndex) {
        // Detailed Inspection View: Active cassette rises and faces viewer upright
        const targetInspPos = new THREE.Vector3(0, 1.25, 2.5);
        cassette.position.lerp(targetInspPos, 0.10);
        cassette.rotation.x = THREE.MathUtils.lerp(cassette.rotation.x, -0.15, 0.10);
        cassette.rotation.y = THREE.MathUtils.lerp(cassette.rotation.y, 0, 0.10);
        cassette.rotation.z = THREE.MathUtils.lerp(cassette.rotation.z, 0, 0.10);
      } else {
        // Stepped Cascade View: Traveling Gaussian wave
        const dist = i - this.springIndex;
        const wave = Math.exp(-dist * dist * 1.2); // Smooth bell curve

        // Elevate selected cassette forward & upward catching the key light
        const liftY = wave * 0.65;
        const nudgeZ = -wave * 0.22;

        cassette.position.x = basePos.x;
        cassette.position.y = basePos.y + liftY;
        cassette.position.z = basePos.z + nudgeZ;

        // Subtle tilt angle to catch directional studio light
        cassette.rotation.x = baseRot.x - wave * 0.08;
        cassette.rotation.y = baseRot.y;
        cassette.rotation.z = baseRot.z;
      }
    });

    // 5. Update 2D Screen-space Projection for Floating HUD Marker
    if (this.floatingHud && !this.isDetailOpen && this.cassettes[this.selectedIndex]) {
      const activeBox = this.cassettes[this.selectedIndex];
      const markerWorldPos = activeBox.position.clone().add(new THREE.Vector3(1.20, 0.38, -0.10));
      
      const screenPos = markerWorldPos.project(this.camera);
      const halfW = this.container.clientWidth / 2;
      const halfH = this.container.clientHeight / 2;

      const px = screenPos.x * halfW + halfW;
      const py = -screenPos.y * halfH + halfH;

      this.floatingHud.style.transform = `translate(${px}px, ${py}px)`;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
