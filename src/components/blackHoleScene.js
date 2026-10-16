/**
 * BlackHoleScene - Relativistic 3D Black Hole & Accretion Disk Simulation
 * Implemented using Three.js with Custom GLSL Shaders.
 * Features Gravitational Lensing, Doppler Beaming, ISCO Boundaries, and Particle Inflow.
 */

import * as THREE from 'three';

export class BlackHoleScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Parameters
    this.params = {
      mass: 1.25,        // Schwarzschild radius scale
      spin: 0.94,        // Kerr parameter (a/M)
      lensing: 1.80,     // Lensing warp intensity
      brightness: 2.20,  // Accretion disk luminosity
      particleSpeed: 1.50,
      colorType: 'amber',
      cameraAngle: 'inclined'
    };

    // Color definitions
    this.colorPalettes = {
      amber: {
        inner: new THREE.Color('#fff2cf'),
        mid: new THREE.Color('#ffa726'),
        outer: new THREE.Color('#ff3d00')
      },
      crimson: {
        inner: new THREE.Color('#ffebee'),
        mid: new THREE.Color('#ff2238'),
        outer: new THREE.Color('#8b0000')
      },
      plasma: {
        inner: new THREE.Color('#e0f7ff'),
        mid: new THREE.Color('#00d2ff'),
        outer: new THREE.Color('#0044ff')
      },
      white: {
        inner: new THREE.Color('#ffffff'),
        mid: new THREE.Color('#d4e5ff'),
        outer: new THREE.Color('#78909c')
      }
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.diskMesh = null;
    this.lensingMesh = null;
    this.horizonMesh = null;
    this.photonRingMesh = null;
    this.particleSystem = null;
    this.particlePositions = null;
    this.particleVelocities = null;

    this.diskMaterial = null;
    this.lensingMaterial = null;
    this.photonRingMaterial = null;

    this.pulseIntensity = 0;
    this.targetCameraPos = new THREE.Vector3(0, 3.2, 8.5);
    this.currentCameraPos = new THREE.Vector3(0, 3.2, 8.5);

    this.init();
    this.createBlackHole();
    this.createAccretionDisk();
    this.createGravitationalLensing();
    this.createParticleStream();
    this.bindEvents();
    this.animate();
  }

  init() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);
  }

  createBlackHole() {
    // 1. Central Event Horizon (Pure Black Shadow Sphere)
    const horizonGeo = new THREE.SphereGeometry(1.4 * this.params.mass, 48, 48);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    this.scene.add(this.horizonMesh);

    // 2. Photon Ring (Einstein Ring around shadow edge)
    const ringGeo = new THREE.RingGeometry(1.42 * this.params.mass, 1.48 * this.params.mass, 64);
    this.photonRingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: this.colorPalettes[this.params.colorType].mid },
        uBrightness: { value: this.params.brightness }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uBrightness;
        varying vec2 vUv;
        void main() {
          float dist = length(vUv - 0.5) * 2.0;
          float intensity = pow(1.0 - abs(dist - 0.5) * 2.0, 3.0) * uBrightness * 2.5;
          gl_FragColor = vec4(uColor * (1.0 + intensity), intensity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.photonRingMesh = new THREE.Mesh(ringGeo, this.photonRingMaterial);
    this.scene.add(this.photonRingMesh);
  }

  createAccretionDisk() {
    // Equatorial Flat Accretion Disk with Custom Shader
    const innerRadius = 1.8 * this.params.mass;
    const outerRadius = 6.2 * this.params.mass;
    const diskGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128, 32);

    this.diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpin: { value: this.params.spin },
        uBrightness: { value: this.params.brightness },
        uColorInner: { value: this.colorPalettes[this.params.colorType].inner },
        uColorMid: { value: this.colorPalettes[this.params.colorType].mid },
        uColorOuter: { value: this.colorPalettes[this.params.colorType].outer },
        uPulse: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPos;
        void main() {
          vUv = uv;
          vPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uSpin;
        uniform float uBrightness;
        uniform vec3 uColorInner;
        uniform vec3 uColorMid;
        uniform vec3 uColorOuter;
        uniform float uPulse;
        varying vec2 vUv;
        varying vec3 vPos;

        // Procedural Simplex-style Noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        void main() {
          float r = length(vPos.xy);
          float angle = atan(vPos.y, vPos.x);

          // Normalized radius across the disk
          float normR = (r - 1.8) / (6.2 - 1.8);
          normR = clamp(normR, 0.0, 1.0);

          // Keplerian differential rotation: inner orbits rotate faster
          float speed = (1.0 / pow(max(r, 0.5), 1.4)) * (0.8 + uSpin * 1.5);
          float spiralAngle = angle + uTime * speed * 2.5;

          // Multi-frequency plasma noise bands
          vec2 uvCoords = vec2(spiralAngle * 3.0, normR * 14.0);
          float n1 = noise(uvCoords);
          float n2 = noise(uvCoords * 2.2 + uTime * 0.5);
          float plasma = (n1 * 0.65 + n2 * 0.35);

          // Relativistic Doppler Beaming (left side boosted, right side dimmed)
          float doppler = 1.0 + (vPos.x / r) * uSpin * 0.95;

          // Color gradient across temperature
          vec3 col = mix(uColorInner, uColorMid, smoothstep(0.0, 0.45, normR));
          col = mix(col, uColorOuter, smoothstep(0.45, 1.0, normR));

          // Soft edge feathering at inner ISCO and outer boundary
          float edgeAlpha = smoothstep(0.0, 0.12, normR) * (1.0 - smoothstep(0.82, 1.0, normR));

          // Keystroke Pulse illumination
          float pulseWave = sin(normR * 20.0 - uTime * 12.0) * uPulse;

          float finalIntensity = (plasma * 1.2 + 0.3 + pulseWave) * doppler * uBrightness * edgeAlpha;

          gl_FragColor = vec4(col * finalIntensity, finalIntensity * 0.85);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.diskMesh = new THREE.Mesh(diskGeo, this.diskMaterial);
    this.diskMesh.rotation.x = Math.PI * 0.45; // Tilted accretion disk
    this.scene.add(this.diskMesh);
  }

  createGravitationalLensing() {
    // Vertical Curved Gravitational Lensing Halo (The hallmark Interstellar arch)
    const haloGeo = new THREE.CylinderGeometry(2.3 * this.params.mass, 2.3 * this.params.mass, 3.8 * this.params.mass, 64, 16, true);
    this.lensingMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLensing: { value: this.params.lensing },
        uBrightness: { value: this.params.brightness },
        uColorMid: { value: this.colorPalettes[this.params.colorType].mid },
        uColorOuter: { value: this.colorPalettes[this.params.colorType].outer }
      },
      vertexShader: `
        varying vec3 vPos;
        varying vec2 vUv;
        void main() {
          vPos = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uLensing;
        uniform float uBrightness;
        uniform vec3 uColorMid;
        uniform vec3 uColorOuter;
        varying vec3 vPos;
        varying vec2 vUv;

        void main() {
          // Einstein ring arch luminance
          float archDist = abs(vUv.y - 0.5) * 2.0;
          float intensity = pow(1.0 - archDist, 2.8) * uLensing * uBrightness * 0.7;

          // Subtle vertical plasma shimmer
          float shimmer = sin(vPos.y * 6.0 + uTime * 3.0) * 0.15 + 0.85;

          vec3 col = mix(uColorMid, uColorOuter, archDist);
          gl_FragColor = vec4(col * intensity * shimmer, intensity * 0.7);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.lensingMesh = new THREE.Mesh(haloGeo, this.lensingMaterial);
    this.scene.add(this.lensingMesh);
  }

  createParticleStream() {
    // Relativistic Particle Stream Spiraling into the Singularity
    const count = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 5.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      velocities[i] = 0.01 + Math.random() * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particlePositions = positions;
    this.particleVelocities = velocities;

    const particleMat = new THREE.PointsMaterial({
      color: this.colorPalettes[this.params.colorType].mid,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, particleMat);
    this.particleSystem.rotation.x = Math.PI * 0.45;
    this.scene.add(this.particleSystem);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    // Slight parallax on mouse move
    window.addEventListener('pointermove', (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      
      if (this.params.cameraAngle === 'inclined') {
        this.targetCameraPos.x = nx * 1.2;
        this.targetCameraPos.y = 3.2 + ny * 0.8;
      }
    });
  }

  // Parameter Updaters called from Sidebar
  setMass(val) {
    this.params.mass = val;
    const r = 1.4 * val;
    this.horizonMesh.scale.set(val, val, val);
    this.photonRingMesh.scale.set(val, val, val);
    this.diskMesh.scale.set(val, val, val);
    this.lensingMesh.scale.set(val, val, val);
  }

  setSpin(val) {
    this.params.spin = val;
    if (this.diskMaterial) {
      this.diskMaterial.uniforms.uSpin.value = val;
    }
  }

  setLensing(val) {
    this.params.lensing = val;
    if (this.lensingMaterial) {
      this.lensingMaterial.uniforms.uLensing.value = val;
    }
  }

  setBrightness(val) {
    this.params.brightness = val;
    if (this.diskMaterial) this.diskMaterial.uniforms.uBrightness.value = val;
    if (this.lensingMaterial) this.lensingMaterial.uniforms.uBrightness.value = val;
    if (this.photonRingMaterial) this.photonRingMaterial.uniforms.uBrightness.value = val;
  }

  setParticleSpeed(val) {
    this.params.particleSpeed = val;
  }

  setColorScheme(scheme) {
    if (!this.colorPalettes[scheme]) return;
    this.params.colorType = scheme;
    const pal = this.colorPalettes[scheme];

    if (this.diskMaterial) {
      this.diskMaterial.uniforms.uColorInner.value = pal.inner;
      this.diskMaterial.uniforms.uColorMid.value = pal.mid;
      this.diskMaterial.uniforms.uColorOuter.value = pal.outer;
    }

    if (this.lensingMaterial) {
      this.lensingMaterial.uniforms.uColorMid.value = pal.mid;
      this.lensingMaterial.uniforms.uColorOuter.value = pal.outer;
    }

    if (this.photonRingMaterial) {
      this.photonRingMaterial.uniforms.uColor.value = pal.mid;
    }

    if (this.particleSystem) {
      this.particleSystem.material.color = pal.mid;
    }
  }

  setCameraAngle(angle) {
    this.params.cameraAngle = angle;
    if (angle === 'equatorial') {
      this.targetCameraPos.set(0, 0.4, 8.8);
    } else if (angle === 'polar') {
      this.targetCameraPos.set(0, 8.5, 0.1);
    } else {
      this.targetCameraPos.set(0, 3.2, 8.5);
    }
  }

  triggerKeystrokePulse() {
    this.pulseIntensity = 1.0;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const t = performance.now() * 0.001;

    // Smooth camera transition
    this.currentCameraPos.lerp(this.targetCameraPos, 0.05);
    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(0, 0, 0);

    // Keep photon ring facing camera
    if (this.photonRingMesh) {
      this.photonRingMesh.lookAt(this.camera.position);
    }

    // Update shaders
    if (this.diskMaterial) {
      this.diskMaterial.uniforms.uTime.value = t;
      this.diskMaterial.uniforms.uPulse.value = this.pulseIntensity;
    }

    if (this.lensingMaterial) {
      this.lensingMaterial.uniforms.uTime.value = t;
    }

    // Decay pulse intensity
    this.pulseIntensity *= 0.94;

    // Animate Infalling Particles
    if (this.particlePositions && this.particleSystem) {
      const pos = this.particlePositions;
      const count = pos.length / 3;
      const speedMult = this.params.particleSpeed;

      for (let i = 0; i < count; i++) {
        let x = pos[i * 3];
        let z = pos[i * 3 + 2];
        let r = Math.sqrt(x * x + z * z);
        let angle = Math.atan2(z, x);

        // Angular acceleration inward
        angle += (0.015 + (1.0 / Math.max(r, 0.6)) * 0.04) * speedMult;
        // Infall radial velocity
        r -= 0.012 * speedMult;

        // Reset if crossed ISCO horizon
        if (r < 1.6 * this.params.mass) {
          r = 7.0 + Math.random() * 1.5;
        }

        pos[i * 3] = Math.cos(angle) * r;
        pos[i * 3 + 2] = Math.sin(angle) * r;
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
