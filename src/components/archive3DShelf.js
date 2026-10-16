/**
 * Archive3DShelf - Rhine Lab 3D Slotted Archive Cassette Shelf
 * Direct 1:1 reproduction of 作品简介参考图.png & Bilibili PV BV1jebG6zE1E:
 *  - Axonometric / perspective rows of white & titanium archive cassettes (卡匣/档案盒子).
 *  - Slotted mechanical guide rails base plate with finger pull notch rivets on each box.
 *  - Procedural spine textures: File Number, Barcodes, Rhine Lab Logo, and Classified Gold Seal for File X-001.
 *  - Yellow tape classified archive box (`RHINE LAB. LLC. INFO`) adjacent to the elevated cassette.
 *  - Clicking any box smoothly slides/pulls it UPWARDS out of its slot with spring physics.
 *  - Subtle mouse parallax sway giving real-time tactile 3D depth.
 *  - Cinematic Three.js camera smooth pan & zoom tracking towards the extracted cassette.
 *  - Text scramble / decryption effect on FILE NUMBER readout with mechanical typing clicks.
 *  - Dynamic 2D-projected HUD rule line: INTERNAL DATABASE, FILE NUMBER, ACCESS FILE →, and REFERENCE AREA.
 *  - Prominently features user's flagship project: GARGANTUA Blackhole Demo (https://github.com/mayi-111/GARGANTUA-Blackhole-demo).
 *  - Full keyboard navigation: ← → change column, ↑ ↓ change row/file, ENTER to open dossier.
 */

import * as THREE from 'three';
import { sound } from './soundEngine.js';

export class Archive3DShelf {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Project Definitions (All 7 modules feature User's GARGANTUA Blackhole project!)
    this.projects = [
      {
        id: 'X-001',
        index: '01',
        title: 'GARGANTUA 相对论克尔黑洞引擎',
        subTitle: 'RELATIVISTIC KERR BLACK HOLE ENGINE',
        category: '广义相对论 / 实时物理引擎',
        desc: '从零实现的广义相对论黑洞实时物理可视化引擎：引力透镜光线偏折、吸积盘极端相对论多普勒频移、光子环与事件视界。单文件 123 KB 交付，零外部依赖，直接在纯 WebGL 环境下计算测地线光线弯曲。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['WebGL 2.0', 'GLSL Shaders', 'Three.js', 'General Relativity', 'Raymarching'],
        metric: '单文件 123 KB · 零依赖 · 60 FPS',
        year: '2026',
        hasGoldTag: true
      },
      {
        id: 'X-002',
        index: '02',
        title: '克尔测地线四阶龙格库塔积分',
        subTitle: 'KERR GEODESIC RK4 NUMERICAL INTEGRATOR',
        category: '微分几何 / 测地线方程',
        desc: '基于 Boyer-Lindquist 坐标系精确求解旋转黑洞弯曲时空中的零测地线微分方程。采用四阶龙格库塔（RK4）数值自适应积分，计算光线掠过引力奇点时的极端偏折轨迹。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Boyer-Lindquist', 'RK4 Numerical', 'Geodesic Math', 'GLSL Integration'],
        metric: '自适应步长 · 亚像素级偏折精度',
        year: '2026',
        hasGoldTag: false
      },
      {
        id: 'X-003',
        index: '03',
        title: '极端相对论多普勒集束与频移',
        subTitle: 'RELATIVISTIC DOPPLER BEAMING & SHIFT',
        category: '天体物理 / 辐射流转',
        desc: '模拟吸积盘高速绕转等离子体（β≈0.72c）引起的极端相对论多普勒效应。迎面朝向观察者的高速粒子呈现剧烈蓝移与集束增亮，背向远离端呈现暗红红移，完美还原非对称黑洞盘面。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Doppler Beaming', 'Lorentz Invariance', 'Planck Spectrum', 'Astrophysics'],
        metric: 'β = 0.72c · 洛伦兹变换',
        year: '2026',
        hasGoldTag: false
      },
      {
        id: 'X-004',
        index: '04',
        title: '爱因斯坦光子球与阴影边界',
        subTitle: 'EINSTEIN PHOTON SPHERE & SHADOW',
        category: '物理可视 / 边界理论',
        desc: '计算极端引力场下不稳定光子圆轨道的几何临界截面，呈现围绕黑洞的极窄高亮光子环（Photon Ring）与无光逃逸的事件视界阴影（Black Hole Shadow）。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Photon Sphere', 'Shadow Boundary', 'Critical Radius', 'Raymarching'],
        metric: '临界捕获半径 r_c · 无限重像',
        year: '2026',
        hasGoldTag: false
      },
      {
        id: 'X-005',
        index: '05',
        title: '克尔能层与时空拖拽效应',
        subTitle: 'KERR ERGOSPHERE & FRAME DRAGGING',
        category: '时空几何 / 彭罗斯机制',
        desc: '转动时空的引力磁效应（愣色-蒂尔林效应）。在静止极限面与外事件视界之间，时空本身被强行拖曳以超越光速旋转，呈现克尔度规特有的扁球形能层结构。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Ergosphere', 'Frame-Dragging', 'Penrose Process', 'Static Limit'],
        metric: '自旋参数 a* = 0.998 · 极端旋转',
        year: '2026',
        hasGoldTag: false
      },
      {
        id: 'X-006',
        index: '06',
        title: 'Novikov-Thorne 几何薄吸积盘',
        subTitle: 'THIN ACCRETION DISK MULTI-TEMP MODEL',
        category: '吸积盘物理 / 流体动力学',
        desc: '基于 Novikov-Thorne 理论模型计算内最稳定圆轨道（ISCO）至外边缘的温度与辐射场分布。利用程序化噪声与多色黑体光谱积分生成高保真湍流吸积盘纹理。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Novikov-Thorne', 'ISCO Radius', 'Blackbody Gradient', 'Procedural GLSL'],
        metric: 'r_ISCO = 1.237 r_g · 普朗克积分',
        year: '2026',
        hasGoldTag: false
      },
      {
        id: 'X-007',
        index: '07',
        title: '123 KB 单文件零依赖极致架构',
        subTitle: 'ZERO-DEPENDENCY SINGLE-FILE BUNDLE',
        category: '工程架构 / 极轻交付',
        desc: '完全不依赖外部重型计算框架与外部 CDN。将复杂的测地线求解矩阵、着色器编译与交互视口完整凝练在 123 KB 单一独立文件中，秒级开箱即跑，极致稳定。',
        github: 'https://github.com/mayi-111/GARGANTUA-Blackhole-demo',
        tech: ['Vanilla WebGL', 'Raw GLSL', 'Single File Architecture', 'High Perf'],
        metric: '单文件 123 KB · 零外部依赖 · 60 FPS',
        year: '2026',
        hasGoldTag: false
      }
    ];

    // Columns matching GARGANTUA subsystems
    this.columns = [
      { id: '01', name: '相对论核心' },
      { id: '02', name: '测地线积分' },
      { id: '03', name: '多普勒集束' },
      { id: '04', name: '爱因斯坦环' },
      { id: '05', name: '能层与视界' },
      { id: '06', name: '吸积盘物理' },
      { id: '07', name: '轻量工程化' }
    ];

    // Grid Configuration: 7 Columns x 14 Rows for high-density archive bay
    this.numCols = 7;
    this.numRows = 14;
    this.activeCol = 3; // Column 04 / 07 (Center column)
    this.activeRow = 6; // Center row
    this.selectedProjectIdx = 0; // Starts with GARGANTUA X-001

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);

    // Parallax sway
    this.parallaxTargetX = 0;
    this.parallaxTargetY = 0;
    this.parallaxCurrentX = 0;
    this.parallaxCurrentY = 0;

    // Interactive Drag Orbit & Click Filter
    this.isDragging = false;
    this.hasDragged = false;
    this.startPointerPos = { x: 0, y: 0 };
    this.prevMousePos = { x: 0, y: 0 };
    this.dragRotY = 0;
    this.dragRotX = 0;

    // Auto-cruise demo
    this.isAutoCruise = false;
    this.cruiseInterval = null;
    this.currentModalProject = null;

    this.boxes = []; // All 3D cassette meshes
    this.boxGroup = null;
    this.hoveredBox = null;
    this.selectedBox = null;

    // Spacious Axonometric Camera Vantage Point matching 作品简介参考图.png
    this.defaultCamPos = new THREE.Vector3(-18.5, 20.5, 26.5);
    this.defaultCamLookAt = new THREE.Vector3(0.8, 0.2, -0.8);
    this.currentCamPos = this.defaultCamPos.clone();
    this.currentCamLookAt = this.defaultCamLookAt.clone();
    this.targetCamPos = this.defaultCamPos.clone();
    this.targetCamLookAt = this.defaultCamLookAt.clone();

    // DOM UI Overlays
    this.floatingHudEl = document.getElementById('shelf-floating-hud');
    this.modalEl = document.getElementById('project-detail-modal');
    this.scrambleTimer = null;

    this.init();
    this.buildCassetteGrid();
    this.bindEvents();
    this.selectProject(0, true);
    this.animate();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 560;

    this.scene = new THREE.Scene();
    
    // Axonometric telephoto camera matching 作品简介参考图.png (distant, majestic perspective)
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 120);
    this.camera.position.copy(this.defaultCamPos);
    this.camera.lookAt(this.defaultCamLookAt);

    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true, 
      powerPreference: 'high-performance' 
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Soft warm architectural lighting matching 作品简介参考图.png
    const ambientLight = new THREE.AmbientLight(0xfffcf5, 0.98);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaf0, 1.15);
    dirLight.position.set(-8, 20, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0006;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xdde5f0, 0.45);
    fillLight.position.set(14, 10, -8);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff3322, 0.16);
    rimLight.position.set(0, -6, 10);
    this.scene.add(rimLight);

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  /**
   * Generates procedural canvas texture for the cassette spine
   */
  createSpineTexture(fileId, title, hasGoldTag, isAdjacentYellow, isDark) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const bgColor = hasGoldTag 
      ? '#fff8e6' 
      : (isAdjacentYellow ? '#fffbe8' : (isDark ? '#1a1d24' : '#f5f7fa'));
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 512, 1024);

    // Top Classification Band
    ctx.fillStyle = (hasGoldTag || isAdjacentYellow) ? '#f59e0b' : '#e53935';
    ctx.fillRect(0, 0, 512, 54);

    // Band text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RHINE LAB // CLASSIFIED', 256, 36);

    // File ID Text
    ctx.fillStyle = (hasGoldTag || isAdjacentYellow) ? '#b45309' : (isDark ? '#f4f6fb' : '#111827');
    ctx.font = '900 68px "Chakra Petch", monospace';
    ctx.fillText(fileId, 256, 170);

    // Barcode stripes
    ctx.fillStyle = (hasGoldTag || isAdjacentYellow) ? '#78350f' : (isDark ? '#8b949e' : '#374151');
    const barTop = 230;
    const barHeight = 80;
    let curX = 40;
    while (curX < 472) {
      const w = Math.random() > 0.4 ? 6 : (Math.random() > 0.5 ? 12 : 3);
      ctx.fillRect(curX, barTop, w, barHeight);
      curX += w + Math.floor(Math.random() * 8 + 3);
    }

    // Spine title
    ctx.font = 'bold 32px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title.substring(0, 10), 256, 370);

    // Spec Box
    ctx.strokeStyle = (hasGoldTag || isAdjacentYellow) ? '#f59e0b' : (isDark ? '#30363d' : '#d0d7de');
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 420, 432, 280);

    ctx.font = '22px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = isDark ? '#a0aec0' : '#4b5563';
    ctx.fillText('> PROTOCOL: SECURE-A', 60, 470);
    ctx.fillText('> MEMORY: PERSISTED', 60, 520);
    ctx.fillText('> CHASSIS: TITANIUM', 60, 570);
    ctx.fillText('> ENGIN: 60 FPS REL', 60, 620);
    ctx.fillText('> INTEGRITY: 100%', 60, 670);

    // Classified tape for GARGANTUA
    if (hasGoldTag) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 750, 512, 120);
      ctx.fillStyle = '#000000';
      ctx.font = '900 32px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ KERR BLACKHOLE ENGINE ★', 256, 818);
      ctx.font = '20px "JetBrains Mono", monospace';
      ctx.fillText('RELATIVISTIC GENERAL RELATIVITY', 256, 846);
    } else if (isAdjacentYellow) {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 750, 512, 120);
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 28px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RHINE LAB. LLC. INFO', 256, 820);
    }

    // Bottom Rhine Lab Logo & Seal
    ctx.fillStyle = isDark ? '#e6edf3' : '#1f2937';
    ctx.font = 'bold 36px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⬡ RHINE LAB OS', 256, 960);

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  buildCassetteGrid() {
    this.boxGroup = new THREE.Group();
    this.boxes = [];

    // Cassette Box Geometry (slender architectural cassette matching 作品简介参考图.png)
    const boxW = 0.40;
    const boxH = 1.85;
    const boxD = 4.60;
    const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);

    // Spacing between rows and columns
    const spacingX = 2.25; // Column spacing
    const spacingZ = 0.80; // Slot spacing along the row

    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';

    // Materials
    const baseColor = isDark ? 0x181b22 : 0xfcfcfc;
    let projCounter = 0;

    for (let c = 0; c < this.numCols; c++) {
      for (let r = 0; r < this.numRows; r++) {
        const posX = (c - (this.numCols - 1) * 0.5) * spacingX;
        const posZ = (r - (this.numRows - 1) * 0.5) * spacingZ;

        // Associate cassettes with real projects
        const isFeatured = (c === 3 && r === 6); // Center box is File X-001 (GARGANTUA)
        const isAdjacentYellow = (c === 3 && r === 5); // Yellow labeled box matching reference
        const projectData = isFeatured 
          ? this.projects[0] 
          : this.projects[projCounter % this.projects.length];

        const hasGoldTag = isFeatured;

        // Spine material with procedural texture
        const spineTexture = this.createSpineTexture(
          projectData.id, 
          projectData.title, 
          hasGoldTag,
          isAdjacentYellow,
          isDark
        );

        const spineMat = new THREE.MeshStandardMaterial({
          map: spineTexture,
          roughness: 0.3,
          metalness: 0.1
        });

        const bodyMat = new THREE.MeshStandardMaterial({
          color: hasGoldTag ? 0xfff8e8 : (isAdjacentYellow ? 0xfffbe8 : baseColor),
          roughness: 0.32,
          metalness: 0.08
        });

        const topMat = new THREE.MeshStandardMaterial({
          color: (hasGoldTag || isAdjacentYellow) ? 0xf59e0b : (isDark ? 0x222732 : 0xe8ecf2),
          roughness: 0.28,
          metalness: 0.15
        });

        const materials = [
          bodyMat,   // right
          bodyMat,   // left
          topMat,    // top
          bodyMat,   // bottom
          spineMat,  // front spine
          bodyMat    // back
        ];

        const mesh = new THREE.Mesh(boxGeo, materials);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Position in perspective array
        mesh.position.set(posX, 0, posZ);

        // Circular finger pull notch rivet on top front (matching reference screenshot)
        const ringGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16);
        const ringMat = new THREE.MeshStandardMaterial({
          color: isDark ? 0x090b0e : 0xb8c0cc,
          roughness: 0.5,
          metalness: 0.3
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(0, boxH * 0.5 + 0.005, -boxD * 0.38);
        mesh.add(ringMesh);

        // Internal metadata
        mesh.userData = {
          col: c,
          row: r,
          projectIndex: isFeatured ? 0 : (projCounter % this.projects.length),
          projectData: projectData,
          baseY: 0,
          targetY: 0,
          currentY: 0,
          targetRotX: 0,
          currentRotX: 0,
          isLifted: false,
          isFeatured: isFeatured
        };

        this.boxGroup.add(mesh);
        this.boxes.push(mesh);

        projCounter++;
      }
    }

    // Add mechanical slotted guide rails rack floor (底座滑槽支架)
    this.buildShelfBaseRack(spacingX, spacingZ, isDark);

    // Initial tilt matching 作品简介参考图.png
    this.boxGroup.rotation.y = -0.42;
    this.scene.add(this.boxGroup);
  }

  buildShelfBaseRack(spacingX, spacingZ, isDark) {
    const rackW = this.numCols * spacingX + 0.9;
    const rackD = this.numRows * spacingZ + 1.2;
    const rackH = 0.24;

    const baseGeo = new THREE.BoxGeometry(rackW, rackH, rackD);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0c0e12 : 0xdedcd5,
      roughness: 0.65,
      metalness: 0.25
    });

    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -rackH * 0.5 - 0.02, 0);
    baseMesh.receiveShadow = true;
    this.boxGroup.add(baseMesh);

    // Guide rail divider fins between columns
    for (let c = 0; c <= this.numCols; c++) {
      const finX = (c - this.numCols * 0.5) * spacingX;
      const finGeo = new THREE.BoxGeometry(0.08, 0.45, rackD);
      const finMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x1b1f28 : 0xbfc6d2,
        roughness: 0.4,
        metalness: 0.4
      });
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.position.set(finX, 0.12, 0);
      this.boxGroup.add(finMesh);
    }
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth || window.innerWidth;
      const h = this.container.clientHeight || 560;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Pointer Move with Parallax & Raycasting
    this.container.addEventListener('pointermove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Parallax target angles
      this.parallaxTargetX = this.mouse.x * 0.045;
      this.parallaxTargetY = this.mouse.y * 0.03;
    });

    this.container.addEventListener('pointerleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.parallaxTargetX = 0;
      this.parallaxTargetY = 0;
    });

    // Interactive Drag to Orbit 3D Shelf
    this.container.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.hud-info-badge') || e.target.closest('button')) return;
      this.isDragging = true;
      this.hasDragged = false;
      this.startPointerPos = { x: e.clientX, y: e.clientY };
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const dist = Math.hypot(e.clientX - this.startPointerPos.x, e.clientY - this.startPointerPos.y);
      if (dist > 6) {
        this.hasDragged = true;
      }

      const deltaX = e.clientX - this.prevMousePos.x;
      const deltaY = e.clientY - this.prevMousePos.y;
      this.prevMousePos = { x: e.clientX, y: e.clientY };

      this.dragRotY += deltaX * 0.0035;
      this.dragRotX += deltaY * 0.0022;
      this.dragRotY = Math.max(-0.4, Math.min(0.4, this.dragRotY));
      this.dragRotX = Math.max(-0.25, Math.min(0.25, this.dragRotX));
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    // Auto-Cruise Pill click
    const cyclePill = document.querySelector('.shelf-cycle-pill');
    if (cyclePill) {
      cyclePill.style.cursor = 'pointer';
      cyclePill.title = '点击开启/停止自动巡航演示';
      cyclePill.addEventListener('click', () => this.toggleAutoCruise());
    }

    // Click to Pull Up Cassette & Focus Camera (Filter out drag release)
    this.container.addEventListener('click', (e) => {
      if (this.hasDragged) {
        this.hasDragged = false;
        return;
      }
      if (this.hoveredBox) {
        if (this.isAutoCruise) this.toggleAutoCruise(); // Pause cruise on manual click
        sound.playSwitch(true);
        if (this.selectedBox === this.hoveredBox) {
          // Double-clicking active box opens dossier immediately!
          this.openProjectModal(this.selectedBox.userData.projectData);
        } else {
          this.activateBox(this.hoveredBox);
        }
      }
    });

    // Keyboard Arrow Keys Navigation
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const activeSection = document.documentElement.getAttribute('data-active-section');
      if (activeSection !== '4' && !this.container.matches(':hover')) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.stepRow(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.stepRow(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.stepCol(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.stepCol(1);
      } else if (e.key === 'Enter') {
        if (this.selectedBox) {
          e.preventDefault();
          this.openProjectModal(this.selectedBox.userData.projectData);
        }
      }
    });

    // Bottom Navigation Bar Controls
    const navPrevBtn = document.getElementById('shelf-prev-file');
    const navNextBtn = document.getElementById('shelf-next-file');
    const navPrevCol = document.getElementById('shelf-prev-col');
    const navNextCol = document.getElementById('shelf-next-col');
    const accessBtn = document.getElementById('shelf-access-file-btn');

    if (navPrevBtn) navPrevBtn.addEventListener('click', () => this.stepRow(-1));
    if (navNextBtn) navNextBtn.addEventListener('click', () => this.stepRow(1));
    if (navPrevCol) navPrevCol.addEventListener('click', () => this.stepCol(-1));
    if (navNextCol) navNextCol.addEventListener('click', () => this.stepCol(1));
    if (accessBtn) {
      accessBtn.addEventListener('click', () => {
        if (this.selectedBox) {
          this.openProjectModal(this.selectedBox.userData.projectData);
        }
      });
    }

    // Modal Close
    const modalClose = document.getElementById('project-modal-close');
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    if (modalClose) modalClose.addEventListener('click', () => this.closeProjectModal());
    if (modalBackdrop) modalBackdrop.addEventListener('click', () => this.closeProjectModal());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl && this.modalEl.classList.contains('active')) {
        this.closeProjectModal();
      }
    });
  }

  stepRow(delta) {
    sound.playClick();
    this.activeRow = (this.activeRow + delta + this.numRows) % this.numRows;
    this.findAndActivateBox(this.activeCol, this.activeRow);
  }

  stepCol(delta) {
    sound.playClick();
    this.activeCol = (this.activeCol + delta + this.numCols) % this.numCols;
    
    // Shift camera default vantage point smoothly to follow the selected column
    const colOffsetX = (this.activeCol - (this.numCols - 1) * 0.5) * 1.8;
    this.defaultCamPos.x = -18.5 + colOffsetX * 0.5;
    this.defaultCamLookAt.x = 0.8 + colOffsetX * 0.5;

    this.findAndActivateBox(this.activeCol, this.activeRow);
  }

  toggleAutoCruise() {
    this.isAutoCruise = !this.isAutoCruise;
    const pill = document.querySelector('.shelf-cycle-pill');
    
    if (this.isAutoCruise) {
      sound.playGranted();
      if (pill) {
        pill.innerHTML = '<span class="green-dot">●</span> 自动巡航中 (点击停止)';
        pill.style.background = 'var(--color-primary-red)';
        pill.style.color = '#fff';
      }
      this.cruiseInterval = setInterval(() => {
        // Step row, and occasionally change col
        if (Math.random() > 0.6) {
          this.stepCol(1);
        } else {
          this.stepRow(1);
        }
      }, 2600);
    } else {
      sound.playClick();
      if (pill) {
        pill.textContent = '无限循环 · 五类档案连续切换';
        pill.style.background = '';
        pill.style.color = '';
      }
      clearInterval(this.cruiseInterval);
      this.cruiseInterval = null;
    }
  }

  findAndActivateBox(col, row) {
    const target = this.boxes.find(b => b.userData.col === col && b.userData.row === row);
    if (target) {
      this.activateBox(target);
    }
  }

  activateBox(box) {
    // Reset previously pulled-up box
    this.boxes.forEach(b => {
      b.userData.targetY = 0;
      b.userData.targetRotX = 0;
      b.userData.isLifted = false;
    });

    // Smoothly pull THIS box UPWARDS out of the slot! (Lift by 1.80 units + slight forward tilt)
    box.userData.targetY = 1.80;
    box.userData.targetRotX = -0.12;
    box.userData.isLifted = true;
    this.selectedBox = box;

    this.activeCol = box.userData.col;
    this.activeRow = box.userData.row;
    this.selectedProjectIdx = box.userData.projectIndex;

    // Spacious axonometric camera vantage point that gently tracks column across the shelf
    const colOffsetX = (this.activeCol - (this.numCols - 1) * 0.5) * 1.8;
    this.targetCamLookAt.set(colOffsetX * 0.5 + 0.8, 0.4, -0.6);
    this.targetCamPos.set(colOffsetX * 0.5 - 18.5, 20.5, 26.5);

    this.updateHudOverlay(box.userData.projectData);
  }

  selectProject(projIdx, skipSound = false) {
    const box = this.boxes.find(b => b.userData.projectIndex === projIdx && b.userData.col === 3) ||
                this.boxes.find(b => b.userData.projectIndex === projIdx);
    if (box) {
      if (!skipSound) sound.playSwitch(true);
      this.activateBox(box);
    }
  }

  scrambleFileNum(targetText) {
    const el = document.getElementById('shelf-hud-filenum');
    if (!el) return;
    const chars = '0123456789ABCDEF-X#$*';
    let iter = 0;
    clearInterval(this.scrambleTimer);
    try {
      if (sound && typeof sound.playTypewriter === 'function') {
        sound.playTypewriter();
      }
    } catch (e) {}

    this.scrambleTimer = setInterval(() => {
      el.textContent = targetText.split('').map((c, i) => {
        if (i < iter) return targetText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      iter += 1.4;
      if (iter >= targetText.length) {
        clearInterval(this.scrambleTimer);
        el.textContent = targetText;
      }
    }, 24);
  }

  updateHudOverlay(project) {
    if (!project) return;

    const targetFileNum = `FILE NUMBER: ${project.id}`;
    this.scrambleFileNum(targetFileNum);

    const categoryEl = document.getElementById('shelf-hud-category');
    const indexCounterEl = document.getElementById('shelf-current-index');
    const colCounterEl = document.getElementById('shelf-current-column');
    const colNameEl = document.getElementById('shelf-current-column-name');

    if (categoryEl) categoryEl.textContent = `INTERNAL DATABASE / ${project.category}`;
    if (indexCounterEl) indexCounterEl.textContent = project.index;

    const colData = this.columns[this.activeCol] || { id: `0${this.activeCol + 1}`, name: '工程研究' };
    if (colCounterEl) colCounterEl.textContent = `COLUMN ${colData.id} / 05`;
    if (colNameEl) colNameEl.textContent = colData.name;
  }

  openProjectModal(project) {
    sound.playGranted();
    if (!this.modalEl || !project) return;
    this.currentModalProject = project.id;

    // Populate modal with rich project data (especially GARGANTUA!)
    document.getElementById('pm-filenum').textContent = `FILE NUMBER: ${project.id}`;
    document.getElementById('pm-title').textContent = project.title;
    document.getElementById('pm-subtitle').textContent = project.subTitle;
    document.getElementById('pm-category').textContent = project.category;
    document.getElementById('pm-desc').textContent = project.desc;
    document.getElementById('pm-metric').textContent = project.metric;
    document.getElementById('pm-year').textContent = project.year;

    // Tech Tags
    const techBox = document.getElementById('pm-tech-tags');
    if (techBox) {
      techBox.innerHTML = project.tech.map(t => `<span class="tech-chip">${t}</span>`).join('');
    }

    // Kerr Simulation for GARGANTUA modules
    const kerrPreview = document.getElementById('modal-kerr-preview');
    if (kerrPreview) {
      kerrPreview.style.display = 'flex';
      this.initKerrSimulation();
    }

    // GitHub Link Button
    const linkBtn = document.getElementById('pm-github-btn');
    if (linkBtn) {
      if (project.github) {
        linkBtn.href = project.github;
        linkBtn.style.display = 'inline-flex';
        linkBtn.innerHTML = `<span>前往 GitHub 仓库调阅代码 (${project.id})</span> <span class="arrow">↗</span>`;
      } else {
        linkBtn.style.display = 'none';
      }
    }

    this.modalEl.classList.add('active');
  }

  initKerrSimulation() {
    const canvas = document.getElementById('kerr-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    // Interactive inclination tilt
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const handlePointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltX = nx * 0.45;
      targetTiltY = ny * 0.35;
    };
    canvas.addEventListener('pointermove', handlePointer);
    canvas.addEventListener('pointerleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    // 80 Relativistic Accretion Disk Plasma Particles
    const particles = [];
    for (let i = 0; i < 80; i++) {
      const r = 44 + Math.random() * 160;
      particles.push({
        radius: r,
        angle: Math.random() * Math.PI * 2,
        speed: (2.8 / Math.sqrt(r)) * (0.85 + Math.random() * 0.3), // Keplerian relativistic velocity
        size: Math.random() * 2.2 + 0.8,
        seed: Math.random() * 100
      });
    }

    const renderKerr = () => {
      if (!this.modalEl || !this.modalEl.classList.contains('active')) {
        canvas.removeEventListener('pointermove', handlePointer);
        return;
      }
      requestAnimationFrame(renderKerr);
      t += 0.032;

      tiltX += (targetTiltX - tiltX) * 0.1;
      tiltY += (targetTiltY - tiltY) * 0.1;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5 + tiltY * 30;

      // Dark space background
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, w, h);

      // Distorted background starfield with gravitational lensing deflection
      for (let i = 0; i < 40; i++) {
        let sx = ((Math.sin(i * 91 + t * 0.05) * 0.5 + 0.5) * w);
        let sy = ((Math.cos(i * 37 + t * 0.04) * 0.5 + 0.5) * h);
        const dist = Math.hypot(sx - cx, sy - cy);
        if (dist > 36) {
          // Einstein ring gravitational deflection
          const defl = 480 / (dist + 20);
          const angle = Math.atan2(sy - cy, sx - cx);
          sx += Math.cos(angle) * defl;
          sy += Math.sin(angle) * defl;
          ctx.fillStyle = i % 3 === 0 ? '#ffddaa' : '#ffffff';
          ctx.globalAlpha = Math.min(1, Math.max(0.1, dist / 180));
          ctx.fillRect(sx, sy, 1.3, 1.3);
        }
      }
      ctx.globalAlpha = 1.0;

      // Color gradients with asymmetric Doppler beaming
      const diskAngle = -0.07 + tiltX * 0.3;
      const gradTop = ctx.createLinearGradient(cx - 200, cy - 60, cx + 200, cy - 60);
      gradTop.addColorStop(0, 'rgba(255, 245, 210, 0.98)'); // Blueshift (approaching observer)
      gradTop.addColorStop(0.35, 'rgba(255, 145, 25, 0.92)');
      gradTop.addColorStop(0.7, 'rgba(215, 45, 15, 0.45)');  // Redshift (receding)
      gradTop.addColorStop(1, 'rgba(110, 10, 10, 0.06)');

      // 1. Relativistic Accretion Disk (Lensed Upper Arc wrapping over event horizon)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 14 + tiltY * 12, 160, 68 + tiltY * 20, diskAngle, Math.PI, 0, false);
      ctx.lineWidth = 18;
      ctx.strokeStyle = gradTop;
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 28;
      ctx.stroke();
      ctx.restore();

      // 2. Relativistic Accretion Disk (Lensed Lower Arc underneath horizon)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 14 - tiltY * 12, 140, 54 - tiltY * 18, -diskAngle, 0, Math.PI, false);
      ctx.lineWidth = 12;
      ctx.strokeStyle = gradTop;
      ctx.stroke();
      ctx.restore();

      // 3. Flat Equatorial Accretion Disk
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, 205, 38 + Math.abs(tiltY * 16), diskAngle, 0, Math.PI * 2);
      ctx.lineWidth = 26;
      ctx.strokeStyle = gradTop;
      ctx.shadowColor = '#ff7700';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // 4. Relativistic Plasma Streamers / Particles Orbiting Accretion Disk
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        
        // 3D coordinates projected onto tilted accretion plane
        const rx = Math.cos(p.angle) * p.radius;
        const rz = Math.sin(p.angle) * p.radius;
        const px = cx + rx * Math.cos(diskAngle) - (rz * 0.22) * Math.sin(diskAngle);
        const py = cy + rx * Math.sin(diskAngle) + (rz * 0.22) * Math.cos(diskAngle);

        // Doppler Beaming Intensity: approaching side (cos(angle) < 0) is vastly brighter
        const doppler = Math.pow(Math.max(0.1, (-Math.sin(p.angle) * 0.5 + 0.6)), 2.5);
        const alpha = Math.min(1, Math.max(0.1, (p.radius - 38) / 100)) * doppler;

        ctx.fillStyle = doppler > 0.8 ? '#ffffff' : (doppler > 0.4 ? '#ffb347' : '#e53935');
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.8 + doppler * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // 5. Kerr Black Hole Event Horizon (Central Pure Black Shadow)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 39, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 16;
      ctx.fill();

      // 6. Einstein Photon Ring (Ultra-sharp relativistic boundary)
      ctx.lineWidth = 2.4;
      const ringPulse = 0.88 + Math.sin(t * 3) * 0.08;
      ctx.strokeStyle = `rgba(255, 248, 225, ${ringPulse})`;
      ctx.shadowColor = '#ffd54f';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // 7. Live Telemetry HUD Overlay
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('M_BH: 4.3×10⁶ M☉  |  a* = 0.998  |  r_ISCO = 1.237 r_g', 16, h - 14);
      ctx.fillStyle = 'rgba(255, 87, 34, 0.75)';
      ctx.fillText('RELATIVISTIC DOPPLER BEAMING β = 0.72c', w - 245, h - 14);
    };

    renderKerr();
  }

  closeProjectModal() {
    sound.playClick();
    this.currentModalProject = null;
    if (this.modalEl) {
      this.modalEl.classList.remove('active');
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 1. Smooth Spring Elevation & Tilt for ALL Cassette Boxes
    for (let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i];
      box.userData.currentY += (box.userData.targetY - box.userData.currentY) * 0.14;
      box.position.y = box.userData.currentY;

      box.userData.currentRotX += (box.userData.targetRotX - box.userData.currentRotX) * 0.12;
      box.rotation.x = box.userData.currentRotX;
    }

    // 2. Parallax Sway + Drag Orbit
    this.parallaxCurrentX += (this.parallaxTargetX - this.parallaxCurrentX) * 0.06;
    this.parallaxCurrentY += (this.parallaxTargetY - this.parallaxCurrentY) * 0.06;

    if (!this.isDragging) {
      this.dragRotY *= 0.94;
      this.dragRotX *= 0.94;
    }

    this.boxGroup.rotation.y = -0.42 + this.parallaxCurrentX + this.dragRotY;
    this.boxGroup.rotation.x = this.parallaxCurrentY + this.dragRotX;

    // 3. Cinematic Camera Interpolation (smooth pan across columns at distant axonometric vantage)
    this.currentCamPos.lerp(this.targetCamPos, 0.065);
    this.currentCamLookAt.lerp(this.targetCamLookAt, 0.065);
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentCamLookAt);

    // 4. Dynamic Screen-Projected HUD Tracking for the Lifted Cassette
    if (this.selectedBox && this.floatingHudEl) {
      const worldPos = new THREE.Vector3();
      this.selectedBox.getWorldPosition(worldPos);
      worldPos.y += 0.95; // Top of the elevated cassette box

      const screenPos = worldPos.clone().project(this.camera);
      const height = this.container.clientHeight || 560;
      const sy = (-(screenPos.y * 0.5) + 0.5) * height;

      // Position center HUD bar horizontally across the screen aligning vertically with the lifted box
      const targetY = Math.max(30, Math.min(height - 150, Math.round(sy - 70)));
      this.floatingHudEl.style.transform = `translate3d(0, ${targetY}px, 0)`;
      this.floatingHudEl.style.opacity = '1';
    }

    // 5. Raycasting for Hover Detection (traverse parent hierarchy if child rivet is hit)
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.boxes, true);

    if (intersects.length > 0) {
      let topMesh = intersects[0].object;
      while (topMesh && !this.boxes.includes(topMesh) && topMesh.parent) {
        topMesh = topMesh.parent;
      }

      if (topMesh && this.boxes.includes(topMesh)) {
        if (this.hoveredBox !== topMesh) {
          if (this.hoveredBox && !this.hoveredBox.userData.isLifted) {
            this.hoveredBox.userData.targetY = 0;
          }
          this.hoveredBox = topMesh;
          if (!topMesh.userData.isLifted) {
            topMesh.userData.targetY = 0.28; // Subtle lift on hover!
            sound.playSliderTick();
          }
        }
        this.container.style.cursor = 'pointer';
      }
    } else {
      if (this.hoveredBox && !this.hoveredBox.userData.isLifted) {
        this.hoveredBox.userData.targetY = 0;
      }
      this.hoveredBox = null;
      this.container.style.cursor = 'default';
    }

    // 6. Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}
