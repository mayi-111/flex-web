/**
 * Main Application Entrypoint
 * Coordinates Rhine Lab Terminal OS subsystems.
 */

import { sound } from './components/soundEngine.js';
import { WaveBackground } from './components/waveBackground.js';
import { SculptureScene } from './components/sculptureScene.js';
import { SidebarControls } from './components/sidebarControls.js';
import { NeumorphicSwitch } from './components/neumorphicSwitch.js';
import { GlassProfileCard } from './components/glassProfileCard.js';
import { Archive3DShelf } from './components/archive3DShelf.js';
import { FeedbackForm } from './components/feedbackForm.js';
import { FooterContact } from './components/footerContact.js';
import { FullpageScroll } from './components/fullpageScroll.js';
import { BootEntrance } from './components/bootEntrance.js';
import { InteractiveTelemetry } from './components/interactiveTelemetry.js';
import { InteractiveArchitecture } from './components/interactiveArchitecture.js';
import { InteractiveWelkinShelf } from './components/interactiveWelkinShelf.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[RHINE LAB OS] Booting terminal subsystems...');

  // 0. Cinematic Terminal Boot Entrance Animation (简约大气开场入场)
  const bootEntrance = new BootEntrance();

  // 1. Audio Toggle & First Gesture Unlock
  const audioBtn = document.getElementById('audio-toggle-btn');
  const audioStateText = document.getElementById('audio-state-text');

  const resumeAudioOnFirstGesture = () => {
    sound.ensureContext();
    window.removeEventListener('pointerdown', resumeAudioOnFirstGesture);
    window.removeEventListener('keydown', resumeAudioOnFirstGesture);
  };
  window.addEventListener('pointerdown', resumeAudioOnFirstGesture);
  window.addEventListener('keydown', resumeAudioOnFirstGesture);

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isUnmuted = sound.toggleMute();
      if (isUnmuted) {
        audioBtn.classList.remove('muted');
        if (audioStateText) audioStateText.textContent = 'ON';
      } else {
        audioBtn.classList.add('muted');
        if (audioStateText) audioStateText.textContent = 'OFF';
      }
    });
  }

  // 2. Real-time Topbar Clock
  const clockEl = document.getElementById('topbar-clock');
  const updateClock = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
  };
  updateClock();
  setInterval(updateClock, 1000);

  // 3. Dynamic Wave Ripple Background
  const waveBg = new WaveBackground('wave-canvas');

  // 4. Pure White 3D Parametric Ribbon Sculpture (Replaces black hole!)
  const sculptureScene = new SculptureScene('sculpture-container');

  // 5. Sidebar Controls Console
  const sidebarControls = new SidebarControls(sculptureScene, waveBg);

  // 6. Neumorphic Day/Night Switch
  const themeSwitch = new NeumorphicSwitch('theme-switch');

  // 7. Frosted Glass Profile Card with Keystroke Pulse & 2.6s Warning Lockdown Alert
  const profileCard = new GlassProfileCard(sculptureScene);

  // 8. Rhine Lab 3D Slotted Archive Cassette Shelf (作品简介参考图.png)
  const archiveShelf = new Archive3DShelf('archive-3d-shelf');

  // 9. Feedback Signal In Form with Red Input Error Rejection Feedback
  const feedbackForm = new FeedbackForm('feedback-form');

  // 10. Footer Social Contacts & Say Hi
  const footerContact = new FooterContact(waveBg);

  // 11. Full-Page Section Snapping Engine ("以整块的单位来运行和滑动")
  const fullpageScroll = new FullpageScroll();

  // 12. Section 01 Interactive Telemetry (Tabs, Geodesic Oscilloscope, Metric Switcher, GPU Probe, Specs Copy)
  const interactiveTelemetry = new InteractiveTelemetry();

  // 13. Section 02 Interactive Architecture Matrix (Category Filter Bar & GLSL / Formula Inspector Modal)
  const interactiveArch = new InteractiveArchitecture();

  // 14. Section 03 Interactive Welkin Shelf (Quick Module Pills, Slogan Shockwaves, Laser Photon Sim)
  const interactiveWelkin = new InteractiveWelkinShelf();

  // Keyboard shortcut Ctrl+M for audio
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      if (audioBtn) audioBtn.click();
    }
  });

  console.log('[RHINE LAB OS] All 10 subsystems operational. Session ready.');
});
