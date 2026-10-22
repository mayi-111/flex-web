/** Split-type editorial motion, inspired by TitanGate's masked character reveals. */
const HEADLINES = '.text-motion-line, .op-name, .sec-chinese-title, .welkin-slogan-title, .headline-text';
const READING = '.hero-tagline-lede, .bio-p, .welkin-slogan-desc, .sg-note';
const LABELS = '.hero-meta-bar .meta-tag, .sec-english-title, .qc-key, .contact-title';
const SELECTOR = `${HEADLINES}, ${READING}, ${LABELS}`;

export class TextMotion {
  constructor() {
    this.preference = matchMedia('(prefers-reduced-motion: reduce)');
    this.records = new Map();
    this.animations = new Set();
    this.timers = new Map();
    this.started = false;
    this.words = typeof Intl.Segmenter === 'function'
      ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : null;
    this.graphemes = typeof Intl.Segmenter === 'function'
      ? new Intl.Segmenter('zh-CN', { granularity: 'grapheme' }) : null;
    this.onPreference = () => this.preference.matches ? this.disable() : this.start();
    this.onVisibility = () => { if (document.hidden) this.finishActive(); };
    this.preference.addEventListener('change', this.onPreference);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.bootObserver = new MutationObserver(() => this.start());
    this.bootObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    this.start();
  }

  start() {
    if (this.started || this.preference.matches || !document.body.classList.contains('page-revealed')) return;
    if (!Element.prototype.animate || !window.IntersectionObserver) return;
    this.started = true;
    document.body.classList.add('text-motion-enabled');
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const record = this.records.get(entry.target);
        if (!record) return;
        if (entry.isIntersecting) {
          if (!record.visible) this.reveal(record);
          record.visible = true;
        } else {
          record.visible = false;
          this.finishRecord(record);
        }
      });
    }, { threshold: 0, rootMargin: '-56px 0px -6% 0px' });
    document.querySelectorAll(SELECTOR).forEach(element => this.prepare(element));
    const biography = document.getElementById('archive-bio-paragraphs');
    if (biography) {
      this.contentObserver = new MutationObserver(records => {
        records.forEach(record => {
          record.removedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            [node, ...node.querySelectorAll('.bio-p')].forEach(element => this.release(element));
          });
          record.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (node.matches('.bio-p')) this.prepare(node);
            node.querySelectorAll('.bio-p').forEach(element => this.prepare(element));
          });
        });
      });
      this.contentObserver.observe(biography, { childList: true });
    }
  }

  prepare(element) {
    if (this.records.has(element)) return;
    const mode = element.matches(HEADLINES) ? 'headline' : element.matches(READING) ? 'reading' : 'label';
    const source = document.createElement('span');
    source.className = 'tm-source';
    source.append(...element.childNodes);
    const visual = document.createElement('span');
    visual.className = `tm-visual tm-${mode}`;
    visual.setAttribute('aria-hidden', 'true');
    visual.append(...[...source.childNodes].map(node => node.cloneNode(true)));
    const record = { element, source, visual, mode, units: [], animations: new Set(), visible: false };
    if (mode !== 'label') {
      const walker = document.createTreeWalker(visual, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => this.splitNode(node, record));
    }
    element.classList.add('tm-host');
    element.append(source, visual);
    this.records.set(element, record);
    this.observer.observe(element);
  }

  splitNode(node, record) {
    const text = node.textContent;
    const tokens = this.words ? [...this.words.segment(text)].map(part => part.segment)
      : text.match(/\s+|[A-Za-z0-9]+|[^\s]/gu) || [];
    const fragment = document.createDocumentFragment();
    let lastWord = null;
    tokens.forEach(token => {
      if (/^\s+$/u.test(token)) {
        fragment.append(document.createTextNode(token));
        lastWord = null;
        return;
      }
      // Keep Chinese closing punctuation attached to the preceding word.
      if (record.mode === 'headline' && lastWord && /^[\p{P}\p{S}]+$/u.test(token)) {
        this.addCharacters(token, lastWord, record);
        return;
      }
      const word = document.createElement('span');
      word.className = record.mode === 'headline' ? 'tm-word' : 'tm-read-unit';
      if (record.mode === 'headline') this.addCharacters(token, word, record);
      else {
        word.textContent = token;
        record.units.push(word);
      }
      fragment.append(word);
      lastWord = word;
    });
    node.replaceWith(fragment);
  }

  addCharacters(text, word, record) {
    const characters = this.graphemes ? [...this.graphemes.segment(text)].map(part => part.segment) : [...text];
    characters.forEach(character => {
      const mask = document.createElement('span');
      mask.className = 'tm-mask';
      const glyph = document.createElement('span');
      glyph.className = 'tm-char';
      glyph.textContent = character;
      mask.append(glyph);
      word.append(mask);
      record.units.push(glyph);
    });
  }

  reveal(record) {
    this.finishRecord(record);
    if (document.hidden || this.preference.matches) return;
    if (record.mode === 'label') return this.scramble(record);
    const mobile = matchMedia('(max-width: 768px)').matches;
    const headline = record.mode === 'headline';
    const siblings = record.element.parentElement?.querySelectorAll('.text-motion-line, .headline-text');
    const row = siblings ? Math.max(0, [...siblings].indexOf(record.element)) : 0;
    const spread = headline ? (mobile ? 240 : 360) : 650;
    record.units.forEach((unit, index) => {
      const frames = headline ? [
        { transform: `translateY(${mobile ? 105 : 118}%) rotateX(-35deg)`, opacity: 0.15 },
        { transform: 'translateY(0) rotateX(0deg)', opacity: 1 }
      ] : [{ opacity: 0.16 }, { opacity: 1 }];
      const animation = unit.animate(frames, {
        duration: headline ? 850 : 420,
        delay: row * 120 + index / Math.max(1, record.units.length - 1) * spread,
        easing: headline ? 'cubic-bezier(.76, 0, .24, 1)' : 'ease-out',
        fill: 'backwards'
      });
      this.animations.add(animation);
      record.animations.add(animation);
      const cleanup = () => { this.animations.delete(animation); record.animations.delete(animation); };
      animation.onfinish = cleanup;
      animation.oncancel = cleanup;
    });
  }

  scramble(record) {
    const original = record.source.textContent;
    if (!original.trim()) return;
    const chars = [...original];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let step = 0;
    record.visual.style.setProperty('--tm-ink', getComputedStyle(record.visual).color);
    const overlay = document.createElement('span');
    overlay.className = 'tm-scramble-ink';
    record.visual.append(overlay);
    record.visual.classList.add('tm-scrambling');
    const tick = () => {
      const progress = ++step / 14;
      // Scramble Latin/digit slots only; Chinese and separators retain their shape.
      overlay.textContent = chars.map((character, index) =>
        /[a-z0-9]/i.test(character) && index / Math.max(1, chars.length - 1) > progress
          ? alphabet[Math.floor(Math.random() * alphabet.length)] : character
      ).join('');
      if (step >= 14) this.finishLabel(record);
    };
    this.timers.set(record, setInterval(tick, 45));
    tick();
  }

  finishLabel(record) {
    clearInterval(this.timers.get(record));
    this.timers.delete(record);
    record.visual.querySelector('.tm-scramble-ink')?.remove();
    record.visual.classList.remove('tm-scrambling');
    record.visual.style.removeProperty('--tm-ink');
  }

  finishRecord(record) {
    record.animations.forEach(animation => animation.cancel());
    record.animations.clear();
    if (this.timers.has(record)) this.finishLabel(record);
  }

  finishActive() { this.records.forEach(record => this.finishRecord(record)); }

  release(element) {
    const record = this.records.get(element);
    if (!record) return;
    this.observer?.unobserve(element);
    this.finishRecord(record);
    element.replaceChildren(...record.source.childNodes);
    element.classList.remove('tm-host');
    this.records.delete(element);
  }

  disable() {
    this.observer?.disconnect();
    this.contentObserver?.disconnect();
    [...this.records.keys()].forEach(element => this.release(element));
    document.body.classList.remove('text-motion-enabled');
    this.started = false;
  }

  destroy() {
    this.disable();
    this.bootObserver.disconnect();
    this.preference.removeEventListener('change', this.onPreference);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }
}
