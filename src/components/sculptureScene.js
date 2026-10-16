/**
 * SculptureScene - Pure White Interactive 3D Parametric Slat Ribbon
 * Directly replicates the 3D procedural sculpture in 个人名片参考图.png.
 * Features:
 *  - Thousands of architectural slats forming a continuous twisted Mobius ribbon.
 *  - Responsive mouse parallax & organic breathing oscillation.
 *  - Real-time keystroke pulse excitation wave traveling through the slats.
 *  - 3D-to-2D projected HUD callout tags (TERMINAL NODE, SESSION SEAL, RHINE LAB.LLC.).
 */

import * as THREE from 'three';

export class SculptureScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Adjustable Parameters via Console
    this.params = {
      twist: 2.4,          // Number of twists
      radius: 3.4,         // Ribbon radius (spacious & comfortable)
      width: 1.15,         // Ribbon width
      slatsCount: 380,     // Total number of architectural slats
      speed: 0.45,         // Orbit rotation speed
      pulseSpeed: 4.8,     // Propagation speed of energy wave
      colorTheme: 'light'  // 'light' or 'dark'
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.slatsGroup = null;
    this.slatMeshes = [];
    this.pulseWaves = []; // Active energy pulses triggered by typing

    // Mouse tracking for 3D parallax
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.hudNodes = [];

    this.init();
    this.buildRibbonSculpture();
    this.initHudNodes();
    this.bindEvents();
    this.animate();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 16.5); // Moved further back for spacious depth!

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Soft architectural lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(6, 10, 8);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xdde3ea, 0.5);
    dirLight2.position.set(-8, -6, -4);
    this.scene.add(dirLight2);

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  buildRibbonSculpture() {
    if (this.slatsGroup) {
      this.scene.remove(this.slatsGroup);
      this.slatsGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    }

    this.slatsGroup = new THREE.Group();
    this.slatMeshes = [];

    const count = this.params.slatsCount;
    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';

    // Shared geometry for the slats
    const slatGeo = new THREE.BoxGeometry(0.045, this.params.width, 0.12);

    for (let i = 0; i < count; i++) {
      const u = i / count; // 0.0 to 1.0 along the ribbon
      const angle = u * Math.PI * 2;

      // Mobius / Lissajous 3D ribbon path
      const r = this.params.radius * (1 + 0.28 * Math.cos(angle * 2));
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle * 2) * 1.6;
      const pz = Math.sin(angle) * (r * 0.7);

      // Ribbon surface normal & twist
      const twistAngle = angle * this.params.twist;

      // Material for each slat
      const mat = new THREE.MeshStandardMaterial({
        color: isDark ? new THREE.Color(0x282c35) : new THREE.Color(0xf0f2f5),
        roughness: 0.35,
        metalness: 0.15,
        emissive: new THREE.Color(0x000000)
      });

      const mesh = new THREE.Mesh(slatGeo, mat);
      mesh.position.set(px, py, pz);

      // Rotate slat perpendicular to tangent and apply twist
      mesh.lookAt(px * 1.5, py, pz * 1.5);
      mesh.rotateZ(twistAngle);

      mesh.userData = {
        basePos: mesh.position.clone(),
        baseRot: mesh.rotation.clone(),
        uIndex: u,
        pulseValue: 0
      };

      this.slatsGroup.add(mesh);
      this.slatMeshes.push(mesh);
    }

    // Initial orientation to match reference image (tilted artistic view)
    this.slatsGroup.rotation.x = 0.38;
    this.slatsGroup.rotation.y = -0.55;
    this.slatsGroup.rotation.z = 0.15;

    this.scene.add(this.slatsGroup);
  }

  initHudNodes() {
    // 3D Anchor points for floating HUD callouts matching 个人名片参考图.png
    this.hudNodes = [
      {
        id: 'hud-node-terminal',
        slatIndex: Math.floor(this.params.slatsCount * 0.18),
        title: 'TERMINAL NODE',
        desc: 'GEEK LOCAL ACCESS • PAM AUTHORITY',
        el: null
      },
      {
        id: 'hud-node-seal',
        slatIndex: Math.floor(this.params.slatsCount * 0.62),
        title: 'SESSION SEAL',
        desc: 'LOCKED 00:00:05 • 1 DISPLAY SEALED',
        el: null
      },
      {
        id: 'hud-node-rhine',
        slatIndex: Math.floor(this.params.slatsCount * 0.88),
        title: 'RHINE LAB.LLC.',
        desc: 'PARAMETRIC RIBBON MATRIX',
        el: null
      }
    ];

    // Create or bind HTML overlay elements for these nodes
    let hudContainer = document.getElementById('sculpture-hud-overlay');
    if (!hudContainer) {
      hudContainer = document.createElement('div');
      hudContainer.id = 'sculpture-hud-overlay';
      hudContainer.className = 'sculpture-hud-overlay';
      this.container.appendChild(hudContainer);
    }

    hudContainer.innerHTML = '';
    this.hudNodes.forEach((node) => {
      const el = document.createElement('div');
      el.className = 'hud-callout-pin';
      el.id = node.id;
      el.innerHTML = `
        <div class="pin-dot"></div>
        <div class="pin-line"></div>
        <div class="pin-content">
          <span class="pin-tag">SERVICES SECT</span>
          <span class="pin-title">${node.title}</span>
          <span class="pin-desc">${node.desc}</span>
        </div>
      `;
      hudContainer.appendChild(el);
      node.el = el;
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    window.addEventListener('pointermove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Theme changes
    const observer = new MutationObserver(() => {
      this.updateThemeColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  }

  updateThemeColors() {
    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    
    const baseColor = isDark ? new THREE.Color(0x282c35) : new THREE.Color(0xf0f2f5);
    this.slatMeshes.forEach((mesh) => {
      mesh.material.color.copy(baseColor);
    });
  }

  /**
   * Excites an energetic light pulse along the 3D ribbon sculpture
   * Triggered on every keystroke in the authorization input box!
   */
  triggerKeystrokePulse() {
    this.pulseWaves.push({
      progress: 0,
      speed: 0.045,
      width: 0.18,
      intensity: 1.0
    });
  }

  // Update Console Parameters
  setTwist(val) {
    this.params.twist = val;
    this.buildRibbonSculpture();
  }

  setRadius(val) {
    this.params.radius = val;
    this.buildRibbonSculpture();
  }

  setSlatsCount(val) {
    this.params.slatsCount = Math.floor(val);
    this.buildRibbonSculpture();
    this.initHudNodes();
  }

  setSpeed(val) {
    this.params.speed = val;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = performance.now() * 0.001;

    // Smooth mouse parallax damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Organic idle sway + mouse parallax
    if (this.slatsGroup) {
      this.slatsGroup.rotation.y = -0.55 + Math.sin(t * 0.4 * this.params.speed) * 0.12 + this.mouse.x * 0.35;
      this.slatsGroup.rotation.x = 0.38 + Math.cos(t * 0.3 * this.params.speed) * 0.08 + this.mouse.y * 0.25;
    }

    // Update active keystroke pulse waves
    for (let w = this.pulseWaves.length - 1; w >= 0; w--) {
      const wave = this.pulseWaves[w];
      wave.progress += wave.speed;
      wave.intensity *= 0.985;
      if (wave.progress > 1.3 || wave.intensity < 0.05) {
        this.pulseWaves.splice(w, 1);
      }
    }

    const isDark = document.documentElement.classList.contains('dark') || 
                   document.documentElement.getAttribute('data-theme') === 'dark';
    const baseColor = isDark ? new THREE.Color(0x282c35) : new THREE.Color(0xf0f2f5);
    const pulseColor = isDark ? new THREE.Color(0xff3344) : new THREE.Color(0xe53935);

    // Update each slat's emission and breathing displacement
    const count = this.slatMeshes.length;
    for (let i = 0; i < count; i++) {
      const mesh = this.slatMeshes[i];
      const u = mesh.userData.uIndex;

      let totalPulse = 0;
      for (let w = 0; w < this.pulseWaves.length; w++) {
        const wave = this.pulseWaves[w];
        const dist = Math.abs(u - wave.progress);
        if (dist < wave.width) {
          const factor = (1 - dist / wave.width) * wave.intensity;
          totalPulse += factor;
        }
      }

      totalPulse = Math.min(totalPulse, 1.0);

      if (totalPulse > 0.02) {
        mesh.material.emissive.copy(pulseColor).multiplyScalar(totalPulse * 1.6);
        mesh.scale.set(1 + totalPulse * 0.8, 1 + totalPulse * 0.4, 1 + totalPulse * 0.8);
      } else {
        mesh.material.emissive.setHex(0x000000);
        mesh.scale.set(1, 1, 1);
      }
    }

    // Update 3D-to-2D projected HUD callout tags
    this.updateHudProjections();

    this.renderer.render(this.scene, this.camera);
  }

  updateHudProjections() {
    if (!this.slatsGroup || !this.hudNodes) return;

    // Only display 3D callout pins on Hero (0) and Archive (1) sections to prevent visual clutter
    const activeSection = document.documentElement.getAttribute('data-active-section') || '0';
    const isVisibleSection = (activeSection === '0' || activeSection === '1');

    if (!isVisibleSection) {
      this.hudNodes.forEach((node) => {
        if (node.el) node.el.style.opacity = '0';
      });
      return;
    }

    const widthHalf = window.innerWidth * 0.5;
    const heightHalf = window.innerHeight * 0.5;
    const tempV = new THREE.Vector3();

    this.hudNodes.forEach((node) => {
      const mesh = this.slatMeshes[node.slatIndex];
      if (!mesh || !node.el) return;

      mesh.getWorldPosition(tempV);
      tempV.project(this.camera);

      // Check if node is in front of camera
      if (tempV.z < 1) {
        const sx = tempV.x * widthHalf + widthHalf;
        const sy = -(tempV.y * heightHalf) + heightHalf;
        node.el.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
        node.el.style.opacity = '1';
      } else {
        node.el.style.opacity = '0';
      }
    });
  }
}
