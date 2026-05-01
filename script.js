/**
 * Rodrick's Classic Car Restoration — app.js
 * Production rewrite. All logic encapsulated in the App IIFE.
 * No global pollution except the handful of functions the HTML
 * onclick attributes need (explicitly exported at the bottom).
 */
(function App() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 1. STATE
  // ═══════════════════════════════════════════════════════════════

  // UI-only state — never serialised
  const ui = {
    currentTab    : 'current',
    currentSlide  : 0,
    intervalId    : null,      // hero slider timer — kept off the data object
    pageHistory   : [],
  };

  // Persisted application data — serialised to localStorage
  const defaults = {
    heroImages : [
      'https://images.unsplash.com/photo-1583121274603-d7eba2e77a10?w=1600&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80',
    ],
    projects : [
      {
        id: 1, name: '1967 Porsche 911', year: '2023', status: 'finished',
        category: 'Classic German', featured: true, award: true,
        desc: 'A stunning restoration of an iconic air-cooled flat-six legend.',
        outcome: 'Returned to full concours condition with factory-correct Slate Grey paint and period-correct interior. Awarded Best in Class at the 2023 National Classic Car Show.',
        img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
          'https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=800&q=80',
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
        ],
        timeline: [
          { date: '2023-01-01', title: 'Initial Assessment',  desc: 'Full strip-down and condition report completed.' },
          { date: '2023-02-01', title: 'Bodywork & Chassis',  desc: 'Rust removal, panel beating, and chassis reinforcement.' },
          { date: '2023-04-01', title: 'Engine Rebuild',      desc: 'Complete rebuild of the 2.0L flat-six engine.' },
          { date: '2023-06-01', title: 'Paint & Trim',        desc: 'Factory-correct Slate Grey respray and leather interior.' },
          { date: '2023-08-01', title: 'Final Assembly',      desc: 'Reassembly, testing and final detailing.' },
        ],
      },
      {
        id: 2, name: '1955 Mercedes 300SL', year: '2023', status: 'finished',
        category: 'Classic German', featured: true, award: false,
        desc: 'The iconic gullwing doors brought back to their original glory.',
        outcome: 'Immaculate restoration with matching-numbers engine rebuild and period Ivory paint. Now a museum piece.',
        img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
          'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80',
          'https://images.unsplash.com/photo-1617814076229-3d5fa6a6bf25?w=800&q=80',
        ],
        timeline: [
          { date: '2023-03-01', title: 'Disassembly',               desc: 'Full teardown, all parts catalogued.' },
          { date: '2023-05-01', title: 'Gullwing Door Restoration', desc: 'Door alignment corrected, hinges rebuilt.' },
          { date: '2023-09-01', title: 'Completion',                desc: 'Final inspection and client handover.' },
        ],
      },
      {
        id: 3, name: '1969 Ford Mustang Boss 429', year: '2024', status: 'current',
        category: 'American Muscle', featured: false, award: false,
        desc: 'One of the rarest Mustangs ever built, currently under full restoration.',
        outcome: '',
        img: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80',
          'https://images.unsplash.com/photo-1547247139-7c47e2b13a2e?w=800&q=80',
          'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80',
        ],
        timeline: [
          { date: '2024-01-01', title: 'Strip Down', desc: 'Full disassembly and parts inventory in progress.' },
        ],
      },
      {
        id: 4, name: '1963 Ferrari 250 GTE', year: '2022', status: 'finished',
        category: 'Italian Sports', featured: true, award: true,
        desc: 'A matching-numbers GTE returned to show condition.',
        outcome: 'Ground-up restoration completed in 18 months. Now valued at over $2M.',
        img: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
        ],
        timeline: [
          { date: '2021-01-01', title: 'Acquisition', desc: 'Vehicle acquired and initial assessment complete.' },
          { date: '2022-06-01', title: 'Completion',  desc: 'Full concours restoration delivered to client.' },
        ],
      },
      {
        id: 5, name: '1957 Chevrolet Bel Air', year: '2024', status: 'current',
        category: 'American Classic', featured: false, award: false,
        desc: 'The quintessential American classic receiving a frame-off restoration.',
        outcome: '',
        img: 'https://images.unsplash.com/photo-1566024349612-2e56a9e73e96?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1566024349612-2e56a9e73e96?w=800&q=80',
          'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80',
          'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        ],
        timeline: [
          { date: '2024-02-01', title: 'Frame Off', desc: 'Body removed from chassis. Chassis sandblasted.' },
        ],
      },
      {
        id: 6, name: '1971 Jaguar E-Type Series 3', year: '2023', status: 'finished',
        category: 'British Classic', featured: false, award: false,
        desc: 'The last of the E-Types, beautifully restored in British Racing Green.',
        outcome: 'Completed to original Jaguar specification with a rebuilt V12 engine.',
        img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
          'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
        ],
        timeline: [
          { date: '2022-04-01', title: 'Start',  desc: 'Project commenced.' },
          { date: '2023-03-01', title: 'Finish', desc: 'Delivered to client in perfect condition.' },
        ],
      },
    ],
    services : [
      { id: 1, name: 'Engine Restoration',         icon: '🔧', img: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80', desc: 'Complete engine rebuilds and performance tuning. We restore engines to original specifications or enhance them with period-appropriate modifications. Our master mechanics specialize in vintage powerplants from pre-war to post-war era vehicles.' },
      { id: 2, name: 'Body & Chassis Work',         icon: '⚙️', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', desc: 'Frame-off restorations and structural rebuilds. Expert panel work, fabrication and rust remediation by our skilled coachbuilders restoring every panel to factory specification.' },
      { id: 3, name: 'Paint & Finishing',           icon: '🎨', img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', desc: 'Period-correct paint matching and application. Factory-correct resprays and custom finishes applied in our climate-controlled spray booth to achieve a flawless, show-quality result.' },
      { id: 4, name: 'Interior Trimming',           icon: '🛋️', img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80', desc: 'Bespoke interior restoration using the finest materials. Hand-stitched leather, Connolly hide and period-correct materials to revive every cabin to concours standard.' },
      { id: 5, name: 'Servicing & Recommissioning', icon: '🔩', img: 'https://images.unsplash.com/photo-1635773054018-2b0c29be3b6d?w=600&q=80', desc: 'Full mechanical service and recommissioning of classic vehicles. We bring dormant vehicles back to life with full fluid changes, brake overhauls, and safety inspections.' },
      { id: 6, name: 'Precision Engineering',       icon: '🏗️', img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80', desc: 'In-house precision engineering solutions for mechanical components large and small. Our fully equipped machine shop handles every stage of manufacture and rebuild.' },
    ],
    messages : [
      { id: 1, name: 'James Patterson',  email: 'james@email.com',  phone: '555-0101', read: false, date: '2024-03-15', message: 'I have a 1965 Aston Martin DB5 that needs a full restoration. Can we arrange a viewing?' },
      { id: 2, name: 'Sarah Mitchell',   email: 'sarah@email.com',  phone: '555-0182', read: false, date: '2024-03-14', message: 'Looking for a quote on engine rebuilding for my 1958 Bentley S1. The car runs but has low oil pressure.' },
      { id: 3, name: 'Robert Chen',      email: 'robert@email.com', phone: '555-0234', read: true,  date: '2024-03-10', message: "I'd like to discuss the interior retrimming of my 1970 Ferrari Dino. Budget is flexible for the right shop." },
    ],
    users : [
      { id: 1, username: 'admin', password: btoa('admin123'), role: 'Administrator', active: true },
    ],
    metrics : { m1: '500+', m2: '34', m3: '18', m4: '98%' },
  };

  // Live data — starts as defaults, then hydrated from storage on init
  let data = deepClone(defaults);

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }


  // ═══════════════════════════════════════════════════════════════
  // 2. PERSISTENCE
  // Unified, atomic. heroImages stored per-key (base64 can be large).
  // Every mutation ends with Storage.save() — no manual trigger needed.
  // ═══════════════════════════════════════════════════════════════

  const STORAGE_KEY        = 'rodricks_data';
  const HERO_PREFIX        = 'rodricks_hero_';
  const HERO_COUNT_KEY     = 'rodricks_hero_count';

  const Storage = {

    save() {
      try {
        // Main data (excludes heroImages — too large for a single key)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          projects : data.projects,
          services : data.services,
          messages : data.messages,
          users    : data.users,
          metrics  : data.metrics,
        }));
        this._saveHeroImages();
      } catch (e) {
        console.warn('[Storage] save failed:', e);
      }
    },

    load() {
      // Load main data
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Validate each field before overwriting — corrupt saves can't clobber defaults
          if (Array.isArray(parsed.projects) && parsed.projects.length) data.projects = parsed.projects;
          if (Array.isArray(parsed.services) && parsed.services.length) data.services = parsed.services;
          if (Array.isArray(parsed.messages))                           data.messages = parsed.messages;
          if (Array.isArray(parsed.users)     && parsed.users.length)   data.users    = parsed.users;
          if (parsed.metrics && typeof parsed.metrics === 'object')     data.metrics  = parsed.metrics;
        }
      } catch (e) {
        console.warn('[Storage] main load failed — using defaults:', e);
      }

      // Load hero images (separate keys)
      this._loadHeroImages();

      // Migrate plain-text passwords → btoa
      let needsSave = false;
      data.users = data.users.map(u => {
        if (u.password && !this._isBase64(u.password)) {
          needsSave = true;
          return { ...u, password: btoa(u.password) };
        }
        return u;
      });
      if (needsSave) this.save();
    },

    _saveHeroImages() {
      try {
        // Clear old keys (count may have shrunk after removals)
        const oldCount = parseInt(localStorage.getItem(HERO_COUNT_KEY) || '0', 10);
        for (let i = 0; i < oldCount; i++) localStorage.removeItem(HERO_PREFIX + i);

        let saved = 0;
        for (let i = 0; i < data.heroImages.length; i++) {
          try {
            localStorage.setItem(HERO_PREFIX + i, data.heroImages[i]);
            saved++;
          } catch (_) {
            // Quota hit — partial save is acceptable; log and stop
            console.warn(`[Storage] hero image ${i} exceeds quota; ${saved}/${data.heroImages.length} saved.`);
            break;
          }
        }
        localStorage.setItem(HERO_COUNT_KEY, String(saved));
      } catch (e) {
        console.warn('[Storage] hero image save failed:', e);
      }
    },

    _loadHeroImages() {
      try {
        const raw = localStorage.getItem(HERO_COUNT_KEY);
        // Key never set = first visit. Keep defaults (Unsplash URLs).
        if (raw === null) return;

        const count = parseInt(raw, 10);
        if (!Number.isFinite(count) || count < 0) return;

        const images = [];
        for (let i = 0; i < count; i++) {
          const img = localStorage.getItem(HERO_PREFIX + i);
          if (img) images.push(img);
        }
        // Replace defaults — even an empty array is intentional (user wiped all)
        data.heroImages = images;
      } catch (e) {
        console.warn('[Storage] hero image load failed — keeping defaults:', e);
      }
    },

    _isBase64(str) {
      // Regex check — avoids the costly try/catch-as-control-flow antipattern
      return /^[A-Za-z0-9+/]+={0,2}$/.test(str) && str.length % 4 === 0;
    },
  };


  // ═══════════════════════════════════════════════════════════════
  // 3. HERO SLIDER
  // ═══════════════════════════════════════════════════════════════

  const Slider = {

    /** Rebuilds the DOM and starts/restarts autoplay. Safe to call multiple times. */
    render() {
      const sliderEl = document.getElementById('heroSlider');
      const dotsEl   = document.getElementById('heroDots');
      if (!sliderEl || !dotsEl) return;

      this._stopAutoplay();
      sliderEl.innerHTML = '';
      dotsEl.innerHTML   = '';

      const images = data.heroImages.filter(img => typeof img === 'string' && img.trim());

      if (!images.length) {
        sliderEl.innerHTML = '<div class="hero-slide active" style="background:linear-gradient(135deg,#161616,#252525)"></div>';
        ui.currentSlide = 0;
        return;
      }

      // Clamp persisted slide index — may be out of range if images were removed
      ui.currentSlide = Math.max(0, Math.min(ui.currentSlide, images.length - 1));

      images.forEach((src, i) => {
        // Slide
        const slide = document.createElement('div');
        slide.className = 'hero-slide' + (i === ui.currentSlide ? ' active' : '');
        slide.style.backgroundImage = `url('${src}')`;
        sliderEl.appendChild(slide);

        // Dot
        const dot = document.createElement('button');
        dot.className = 'hero-dot' + (i === ui.currentSlide ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => this.goTo(i));
        dotsEl.appendChild(dot);
      });

      if (images.length > 1) this._startAutoplay();
    },

    goTo(idx) {
      const slides = document.querySelectorAll('.hero-slide');
      const dots   = document.querySelectorAll('.hero-dot');
      if (!slides.length) return;

      const safe = Math.max(0, Math.min(idx, slides.length - 1));
      slides.forEach((s, i) => s.classList.toggle('active', i === safe));
      dots.forEach((d, i)   => d.classList.toggle('active', i === safe));
      ui.currentSlide = safe;
    },

    next() {
      const total = document.querySelectorAll('.hero-slide').length;
      if (total > 0) this.goTo((ui.currentSlide + 1) % total);
    },

    _startAutoplay() {
      // Read live slide count inside the callback — not a closure over a stale value
      ui.intervalId = setInterval(() => this.next(), 5000);
    },

    _stopAutoplay() {
      if (ui.intervalId !== null) {
        clearInterval(ui.intervalId);
        ui.intervalId = null;
      }
    },
  };


  // ═══════════════════════════════════════════════════════════════
  // 4. NAVIGATION
  // ═══════════════════════════════════════════════════════════════

  const VALID_PAGES = ['home', 'restore', 'services', 'about', 'contact', 'projectDetail'];

  const Nav = {

    currentPage() {
      const el = document.querySelector('.page.active');
      return el ? el.id.replace('page-', '') : 'home';
    },

    show(page, fromBack = false) {
      const target   = VALID_PAGES.includes(page) ? page : 'home';
      const previous = this.currentPage();

      if (!fromBack && previous !== target) {
        // Deduplicate: don't push the same page twice in a row
        if (ui.pageHistory[ui.pageHistory.length - 1] !== previous) {
          ui.pageHistory.push(previous);
          if (ui.pageHistory.length > 20) ui.pageHistory.shift();
        }
      }

      this._closeMobileNav();

      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

      const el = document.getElementById('page-' + target) || document.getElementById('page-home');
      el.classList.add('active');

      const navKey = target === 'projectDetail' ? 'restore' : target;
      const navEl  = document.getElementById('nav-' + navKey);
      if (navEl) navEl.classList.add('active');

      document.body.classList.toggle('contact-page-active', target === 'contact');
      window.scrollTo(0, 0);

      // Render page content
      if (target === 'home')          Renderer.home();
      if (target === 'restore')       Renderer.projects();
      if (target === 'services')      Renderer.servicesPage();
    },

    back() {
      const previous = ui.pageHistory.pop();
      this.show(previous || 'home', true);
    },

    toggleMobileNav() {
      const isOpen = document.body.classList.toggle('mobile-nav-open');
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', String(isOpen));
    },

    _closeMobileNav() {
      document.body.classList.remove('mobile-nav-open');
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    },
  };


  // ═══════════════════════════════════════════════════════════════
  // 5. RENDERER — all DOM rendering in one place
  // ═══════════════════════════════════════════════════════════════

  const Renderer = {

    home() {
      Slider.render();
      this.servicesPreview();
      this.featured();
      this.metrics();
    },

    servicesPreview() {
      const grid = document.getElementById('servicesPreviewGrid');
      if (!grid) return;
      grid.innerHTML = data.services.slice(0, 4).map(s => `
        <div class="service-card" onclick="App.showPage('services')">
          <span class="service-icon">${s.icon}</span>
          <h3>${s.name}</h3>
          <p>${s.desc}</p>
        </div>
      `).join('');
    },

    featured() {
      const grid = document.getElementById('featuredGrid');
      if (!grid) return;
      const list = data.projects.filter(p => p.featured).slice(0, 3);
      if (!list.length) {
        grid.innerHTML = '<p style="color:var(--muted);font-size:0.8rem">No featured projects set.</p>';
        return;
      }
      const [main, ...sides] = list;
      grid.innerHTML = `
        <div class="featured-main" onclick="App.openProject(${main.id})">
          <img class="featured-img" src="${main.img}" alt="${main.name}" onerror="this.style.background='var(--dark3)'">
          <div class="featured-overlay">
            <div class="featured-info"><h3>${main.name}</h3><span>${main.category || main.status}</span></div>
          </div>
          ${main.award ? '<div class="award-badge">★ Award Winner</div>' : ''}
        </div>
        <div class="featured-side">
          ${sides.map(p => `
            <div class="featured-side-item" onclick="App.openProject(${p.id})">
              <img class="featured-img" src="${p.img}" alt="${p.name}" onerror="this.style.background='var(--dark3)'">
              <div class="featured-overlay">
                <div class="featured-info"><h3 style="font-size:1rem">${p.name}</h3><span>${p.category || p.status}</span></div>
              </div>
              ${p.award ? '<div class="award-badge">★ Award</div>' : ''}
            </div>
          `).join('')}
        </div>
      `;
    },

    metrics() {
      const { m1, m2, m3, m4 } = data.metrics;
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('m1', m1); set('m2', m2); set('m3', m3); set('m4', m4);
    },

    projects() {
      const grid = document.getElementById('projectsGrid');
      if (!grid) return;
      const list = data.projects.filter(p => p.status === ui.currentTab);
      grid.innerHTML = list.length
        ? list.map(p => `
            <div class="project-card" onclick="App.openProject(${p.id})">
              <img class="project-card-img" src="${p.img}" alt="${p.name}" onerror="this.style.background='var(--dark3)'">
              <div class="project-card-overlay">
                <div class="project-card-info">
                  <h4>${p.name}</h4>
                  <span>${p.status === 'finished' ? 'Completed' : 'In Progress'}${p.category ? ' / ' + p.category : ''}</span>
                </div>
              </div>
              ${p.status === 'finished' ? '<div class="after-tag">AFTER</div>' : ''}
              ${p.award ? '<div class="award-badge" style="top:auto;bottom:1rem;right:1rem">★ Award</div>' : ''}
            </div>
          `).join('')
        : '<p style="color:var(--muted);font-size:0.8rem;padding:2rem">No projects in this category yet.</p>';
    },

    projectDetail(id) {
      const p = data.projects.find(x => x.id === id);
      if (!p) return;

      const timeline = [...(p.timeline || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
      const latest   = timeline[0];

      const setText = (elId, val) => { const el = document.getElementById(elId); if (el) el.textContent = val; };
      setText('detailCategory',   p.status === 'finished' ? 'Completed Project' : 'Live Project');
      setText('detailTitle',      p.name);
      setText('detailYear',       p.status === 'finished' ? `Completed: ${p.year}` : `In Progress - ${p.year}`);
      setText('detailStatus',     p.status === 'finished' ? 'Completed' : 'In Progress');
      setText('detailLastUpdated', `Last Updated: ${latest ? formatDate(latest.date) : 'Not available'}`);
      setText('detailOutcome',    p.outcome || 'This project is currently in progress.');

      const heroEl = document.getElementById('detailHero');
      if (heroEl) heroEl.style.backgroundImage = `url('${p.img}')`;

      const timelineEl = document.getElementById('detailTimeline');
      if (timelineEl) {
        timelineEl.innerHTML = timeline.length
          ? timeline.map((t, i) => `
              <div class="timeline-item ${i === 0 ? 'latest' : ''}">
                <div class="timeline-dot"></div>
                <span class="timeline-date">${formatDate(t.date)}</span>
                <h4>${t.title}</h4>
                <p>${t.desc}</p>
              </div>
            `).join('')
          : '<p style="color:#5f5a52;font-size:0.84rem;line-height:1.8">No timeline updates yet.</p>';
      }

      // Gallery — use dedicated images; never repeat the hero image as a fallback three times
      const angleLabels = ['Front View', 'Side View', 'Rear View'];
      const galleryImgs = Array.isArray(p.images) && p.images.length >= 3
        ? p.images.slice(0, 3)
        : angleLabels.map((_, i) => (p.images && p.images[i]) || p.img);

      const detailImagesEl = document.getElementById('detailImages');
      if (detailImagesEl) {
        detailImagesEl.innerHTML = galleryImgs.map((img, i) => `
          <div class="detail-img-wrap">
            <img class="detail-img" src="${img}" alt="${p.name} – ${angleLabels[i]}" onerror="this.style.background='#ccc'">
            <span class="detail-img-label">${angleLabels[i]}</span>
          </div>
        `).join('');
      }
    },

    servicesPage() {
      const grid = document.getElementById('servicesFullGrid');
      if (!grid) return;
      grid.innerHTML = data.services.map((s, i) => `
        <div class="service-full-card" onclick="App.highlightService(${i})">
          <img class="service-full-img" src="${s.img}" alt="${s.name}" onerror="this.style.background='#ccc'">
          <div class="service-full-body">
            <div class="service-full-title">${s.name}</div>
            <div class="service-full-desc">${s.desc.split('.')[0]}.</div>
            <button class="service-full-link">LEARN MORE &nbsp;&#8594;</button>
          </div>
        </div>
      `).join('');
    },

    adminDashboard() {
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      set('dash-projects', data.projects.length);
      set('dash-current',  data.projects.filter(p => p.status === 'current').length);
      set('dash-messages', data.messages.length);
      set('dash-unread',   data.messages.filter(m => !m.read).length);

      const tbody = document.getElementById('dashProjectsTable');
      if (tbody) {
        tbody.innerHTML = data.projects.slice(0, 6).map(p => `
          <tr>
            <td>${p.name}</td>
            <td>${p.year}</td>
            <td><span class="badge badge-${p.status}">${p.status}</span></td>
            <td>${p.featured ? '<span class="badge badge-featured">Featured</span>' : '-'}</td>
            <td>
              <button class="action-btn action-edit" onclick="App.editProject(${p.id})">Edit</button>
              <button class="action-btn action-del"  onclick="App.deleteProject(${p.id})">Delete</button>
            </td>
          </tr>
        `).join('');
      }
    },

    adminUsers() {
      const tbody      = document.getElementById('usersTable');
      if (!tbody) return;
      const currentUser = localStorage.getItem('adminUsername') || 'admin';
      tbody.innerHTML = data.users.map(u => `
        <tr>
          <td><strong>${u.username}</strong>${u.username === currentUser ? ' <span style="font-size:0.65rem;color:var(--gold)">(you)</span>' : ''}</td>
          <td>${u.role || 'User'}</td>
          <td><span class="badge badge-read">Active</span></td>
          <td>${u.username === currentUser
            ? '<span style="font-size:0.7rem;color:var(--muted)">—</span>'
            : `<button class="user-action-del" onclick="App.deleteUser('${u.username}')">Delete</button>`
          }</td>
        </tr>
      `).join('');
    },

    adminHeroImages() {
      const grid = document.getElementById('heroImgGrid');
      if (!grid) return;
      grid.innerHTML = Array.from({ length: 10 }, (_, i) => {
        const img = data.heroImages[i];
        return `<div class="hero-img-item">
          ${img
            ? `<img src="${img}" onerror="this.style.display='none'">
               <button class="hero-img-remove" onclick="App.removeHeroImg(${i})" aria-label="Remove image ${i + 1}">×</button>`
            : '<div class="img-placeholder">📷<span style="font-size:0.6rem">Empty</span></div>'
          }
          <div class="img-num">${i + 1}</div>
        </div>`;
      }).join('');
    },

    adminProjects() {
      const tbody = document.getElementById('allProjectsTable');
      if (!tbody) return;
      tbody.innerHTML = data.projects.map(p => `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td>${p.year}</td>
          <td><span class="badge badge-${p.status}">${p.status}</span></td>
          <td>${p.award ? '<span class="badge badge-featured">★ Award</span>' : '-'}</td>
          <td>${p.featured ? '<span class="badge badge-featured">Yes</span>' : '-'}</td>
          <td>
            <button class="action-btn action-view" onclick="App.openProject(${p.id});App.closeAdmin()">View</button>
            <button class="action-btn action-edit" onclick="App.editProject(${p.id})">Edit</button>
            <button class="action-btn action-del"  onclick="App.deleteProject(${p.id})">Delete</button>
          </td>
        </tr>
      `).join('');
    },

    adminFeatured() {
      const tbody = document.getElementById('featuredTable');
      if (!tbody) return;
      tbody.innerHTML = data.projects.map(p => `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td><span class="badge badge-${p.status}">${p.status}</span></td>
          <td>${p.featured ? '<span class="badge badge-featured">✓ Featured</span>' : '<span style="color:var(--muted);font-size:0.78rem">—</span>'}</td>
          <td>${p.award ? '<span class="badge badge-featured">★</span>' : '-'}</td>
          <td>
            <button class="action-btn ${p.featured ? 'action-del' : 'action-feature'}" onclick="App.toggleFeatured(${p.id})">${p.featured ? 'Remove' : 'Add to Featured'}</button>
            <button class="action-btn action-edit" onclick="App.toggleAward(${p.id})">${p.award ? 'Remove Award' : 'Set Award'}</button>
          </td>
        </tr>
      `).join('');
    },

    adminServices() {
      const tbody = document.getElementById('servicesTable');
      if (!tbody) return;
      tbody.innerHTML = data.services.map(s => `
        <tr>
          <td>${s.icon} <strong>${s.name}</strong></td>
          <td style="color:var(--muted);font-size:0.78rem">${s.desc.substring(0, 60)}…</td>
          <td>
            <button class="action-btn action-edit" onclick="App.editService(${s.id})">Edit</button>
            <button class="action-btn action-del"  onclick="App.deleteService(${s.id})">Delete</button>
          </td>
        </tr>
      `).join('');
    },

    adminMessages() {
      const list = document.getElementById('messagesList');
      if (!list) return;
      if (!data.messages.length) {
        list.innerHTML = '<p style="color:var(--muted);font-size:0.8rem">No messages yet.</p>';
        return;
      }
      list.innerHTML = data.messages.map(m => `
        <div class="message-card ${m.read ? '' : 'unread'}">
          <div class="message-card-header">
            <div>
              <span class="message-sender">${m.name}</span>
              <span style="margin-left:0.8rem;font-size:0.72rem;color:var(--muted)">${m.email}</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.8rem">
              <span class="message-date">${m.date}</span>
              <span class="badge ${m.read ? 'badge-read' : 'badge-unread'}">${m.read ? 'Read' : 'Unread'}</span>
              <button class="action-btn action-edit" style="padding:0.2rem 0.6rem" onclick="App.toggleMessageRead(${m.id})">${m.read ? 'Mark Unread' : 'Mark Read'}</button>
              <button class="action-btn action-view" style="padding:0.2rem 0.6rem" onclick="App.toggleMessageDetail(${m.id})">View</button>
              <button class="action-btn action-del"  style="padding:0.2rem 0.6rem" onclick="App.deleteMessage(${m.id})">Delete</button>
            </div>
          </div>
          <div class="message-preview">${m.message.substring(0, 100)}${m.message.length > 100 ? '…' : ''}</div>
          <div class="message-detail" id="msg-${m.id}">
            <div style="display:flex;gap:2rem;font-size:0.78rem;color:var(--muted)">
              <span>📞 ${m.phone}</span><span>✉️ ${m.email}</span>
            </div>
            <div class="message-full">${m.message}</div>
          </div>
        </div>
      `).join('');
    },

    adminMetrics() {
      const fields = { met1: 'm1', met2: 'm2', met3: 'm3', met4: 'm4' };
      Object.entries(fields).forEach(([elId, key]) => {
        const el = document.getElementById(elId);
        if (el) el.value = data.metrics[key];
      });
    },
  };


  // ═══════════════════════════════════════════════════════════════
  // 6. HELPERS
  // ═══════════════════════════════════════════════════════════════

  function formatDate(value) {
    if (!value) return 'Date pending';
    const d = new Date(value);
    return isNaN(d.getTime())
      ? value
      : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function notify(msg, type = 'gold') {
    const n = document.getElementById('adminNotif');
    if (!n) return;
    n.textContent = msg;
    n.style.borderLeftColor = type === 'red' ? 'var(--red)' : type === 'green' ? 'var(--green)' : 'var(--gold)';
    n.classList.add('show');
    setTimeout(() => n.classList.remove('show'), 3000);
  }

  function updateMsgBadge() {
    const badge = document.getElementById('msgBadge');
    if (badge) badge.textContent = data.messages.filter(m => !m.read).length || '';
  }

  function toDateInputValue(value) {
    if (!value) return new Date().toISOString().split('T')[0];
    const d = new Date(value);
    return isNaN(d.getTime()) ? value : d.toISOString().split('T')[0];
  }

  function showFormError(elId, msg) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
  }

  function hideFormError(elId) {
    const el = document.getElementById(elId);
    if (el) el.classList.remove('show');
  }


  // ═══════════════════════════════════════════════════════════════
  // 7. ADMIN — PANEL, AUTH, SECTIONS
  // ═══════════════════════════════════════════════════════════════

  const Admin = {

    sectionTitles: {
      dashboard  : 'Dashboard',
      users      : 'Users',
      heroImages : 'Hero Images',
      projects   : 'All Projects',
      addProject : 'Add / Edit Project',
      featured   : 'Featured Projects',
      services   : 'Services',
      messages   : 'Messages',
      metrics    : 'Site Metrics',
    },

    openLogin() {
      const modal = document.getElementById('adminLogin');
      if (!modal) return;
      document.getElementById('loginError').style.display = 'none';
      modal.classList.add('open');
      const userEl = document.getElementById('loginUser');
      if (userEl) userEl.focus();
    },

    closeLogin() {
      const modal = document.getElementById('adminLogin');
      if (modal) modal.classList.remove('open');
      const passEl = document.getElementById('loginPass');
      if (passEl) passEl.value = '';
      const errEl = document.getElementById('loginError');
      if (errEl) errEl.style.display = 'none';
    },

    doLogin() {
      const username = (document.getElementById('loginUser').value || '').trim();
      const password = document.getElementById('loginPass').value || '';
      const encoded  = btoa(password);
      const errEl    = document.getElementById('loginError');

      const user = data.users.find(u =>
        u.active !== false &&
        u.username === username &&
        (u.password === encoded || u.password === password) // support legacy plain-text
      );

      if (user) {
        errEl.style.display = 'none';
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUsername',   username);
        this.closeLogin();
        this.open();
      } else {
        errEl.style.display = 'block';
      }
    },

    open() {
      const panel = document.getElementById('adminPanel');
      if (panel) panel.classList.add('open');
      this.nav('dashboard');
      updateMsgBadge();
    },

    close() {
      const panel = document.getElementById('adminPanel');
      if (panel) panel.classList.remove('open');
    },

    logout() {
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminUsername');
      this.close();
      notify('Logged out successfully');
    },

    nav(section, el) {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      if (el) el.classList.add('active');
      else {
        // Find the nav item by its onclick attribute when called without a DOM ref
        const found = Array.from(document.querySelectorAll('.admin-nav-item'))
          .find(i => i.getAttribute('onclick')?.includes(`'${section}'`));
        if (found) found.classList.add('active');
      }

      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      const sec = document.getElementById('sec-' + section);
      if (sec) sec.classList.add('active');

      const titleEl = document.getElementById('adminTopTitle');
      if (titleEl) titleEl.textContent = this.sectionTitles[section] || section;

      // Render the relevant section
      const map = {
        dashboard  : () => Renderer.adminDashboard(),
        users      : () => Renderer.adminUsers(),
        heroImages : () => Renderer.adminHeroImages(),
        projects   : () => Renderer.adminProjects(),
        featured   : () => Renderer.adminFeatured(),
        services   : () => Renderer.adminServices(),
        messages   : () => { Renderer.adminMessages(); updateMsgBadge(); },
        metrics    : () => Renderer.adminMetrics(),
        addProject : () => { ProjectForm.clear(); },
      };
      if (map[section]) map[section]();
    },
  };


  // ═══════════════════════════════════════════════════════════════
  // 8. PROJECT FORM (add / edit)
  // ═══════════════════════════════════════════════════════════════

  const ProjectForm = {

    clear() {
      ['editProjectId', 'pName', 'pYear', 'pCategory', 'pDesc', 'pOutcome', 'pImg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const statusEl = document.getElementById('pStatus');
      if (statusEl) statusEl.value = 'current';
      const featEl = document.getElementById('pFeatured');
      if (featEl) featEl.checked = false;
      const awardEl = document.getElementById('pAward');
      if (awardEl) awardEl.checked = false;
      const timelineEl = document.getElementById('timelineEntries');
      if (timelineEl) timelineEl.innerHTML = '';
      hideFormError('imgError');
      this.ImageBuilder.populate([]);
    },

    populate(project) {
      Admin.nav('addProject');
      document.getElementById('editProjectId').value  = project.id;
      document.getElementById('pName').value          = project.name         || '';
      document.getElementById('pYear').value          = project.year         || '';
      document.getElementById('pStatus').value        = project.status       || 'current';
      document.getElementById('pCategory').value      = project.category     || '';
      document.getElementById('pDesc').value          = project.desc         || '';
      document.getElementById('pOutcome').value       = project.outcome      || '';
      document.getElementById('pImg').value           = project.img          || '';
      document.getElementById('pFeatured').checked    = !!project.featured;
      document.getElementById('pAward').checked       = !!project.award;
      document.getElementById('timelineEntries').innerHTML = '';
      (project.timeline || []).forEach(t => this.addTimelineEntry(t));
      const imgs = (project.images && project.images.length >= 3)
        ? project.images
        : [project.img || '', '', ''];
      this.ImageBuilder.populate(imgs);
    },

    save() {
      const name  = document.getElementById('pName').value.trim();
      const year  = document.getElementById('pYear').value.trim();
      if (!name || !year) { alert('Name and year are required.'); return; }

      const rawUrls = this.ImageBuilder.getUrls();
      if (rawUrls.length < 3) {
        showFormError('imgError', 'Please add at least 3 image URLs.');
        document.getElementById('imgBuilder').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const lower = rawUrls.map(u => u.toLowerCase());
      if (new Set(lower).size < lower.length) {
        showFormError('imgError', 'Duplicate image URLs found. Each image must be unique.');
        return;
      }
      hideFormError('imgError');

      const timeline = Array.from(document.querySelectorAll('#timelineEntries .timeline-entry'))
        .map(row => {
          const inputs  = row.querySelectorAll('input');
          const desc    = row.querySelector('textarea');
          return { date: inputs[0]?.value || '', title: (inputs[1]?.value || '').trim(), desc: (desc?.value || '').trim() };
        })
        .filter(t => t.title);

      const editId = document.getElementById('editProjectId').value;
      const project = {
        id       : editId ? parseInt(editId, 10) : Date.now(),
        name, year,
        status   : document.getElementById('pStatus').value,
        category : document.getElementById('pCategory').value,
        desc     : document.getElementById('pDesc').value,
        outcome  : document.getElementById('pOutcome').value,
        img      : rawUrls[0] || '',
        images   : rawUrls,
        featured : document.getElementById('pFeatured').checked,
        award    : document.getElementById('pAward').checked,
        timeline,
      };

      if (editId) {
        const idx = data.projects.findIndex(p => p.id === parseInt(editId, 10));
        if (idx > -1) data.projects[idx] = project;
      } else {
        data.projects.push(project);
      }

      this.clear();
      Renderer.projects();
      Renderer.featured();
      Renderer.adminProjects();
      Renderer.adminFeatured();
      Renderer.adminDashboard();
      Storage.save();
      notify('Project saved!', 'green');
    },

    addTimelineEntry(entry = { date: '', title: '', desc: '' }) {
      const div = document.createElement('div');
      div.className = 'timeline-entry';
      div.innerHTML = `
        <input type="date" value="${toDateInputValue(entry.date)}">
        <input type="text" placeholder="Update title" value="${entry.title || ''}">
        <textarea placeholder="Update description">${entry.desc || ''}</textarea>
        <button class="remove-entry" onclick="this.parentElement.remove()">X</button>
      `;
      document.getElementById('timelineEntries').appendChild(div);
    },

    // Image Builder sub-module
    ImageBuilder: {

      populate(images) {
        const builder = document.getElementById('imgBuilder');
        if (!builder) return;
        builder.innerHTML = '';
        const list = (images && images.length) ? images : ['', '', ''];
        list.forEach(url => this.addRow(url));
        while (builder.querySelectorAll('.img-builder-row').length < 3) this.addRow('');
      },

      addRow(url = '') {
        const builder = document.getElementById('imgBuilder');
        if (!builder) return;
        const rows = builder.querySelectorAll('.img-builder-row');
        if (rows.length >= 5) { notify('Maximum 5 images allowed', 'red'); return; }

        const angleLabels = ['Front view', 'Side view', 'Rear view', 'Detail view', 'Interior view'];
        const idx = `r${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const div = document.createElement('div');
        div.className   = 'img-builder-row';
        div.dataset.idx = idx;
        div.innerHTML   = `
          <img class="img-thumb" id="thumb_${idx}" alt="preview">
          <input type="text" placeholder="${angleLabels[rows.length] || 'Image URL'}"
            value="${url}" oninput="App._imgRowPreview(this,'${idx}')">
          <label style="flex-shrink:0;cursor:pointer;font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;
            padding:0.28rem 0.6rem;border:1px solid rgba(184,149,90,0.4);color:var(--gold);
            font-family:'Montserrat',sans-serif;border-radius:2px" title="Upload">
            📁<input type="file" accept="image/*" style="display:none"
              onchange="App._imgRowFile(event,'${idx}')">
          </label>
          <button type="button" class="btn-remove-img" onclick="App._imgRowRemove(this,'${idx}')">✕</button>
        `;
        builder.appendChild(div);
        if (url) {
          const input = div.querySelector('input[type=text]');
          this._preview(input, idx);
        }
      },

      _preview(input, idx) {
        const thumb = document.getElementById('thumb_' + idx);
        if (!thumb) return;
        const url = input.value.trim();
        if (url) {
          thumb.src     = url;
          thumb.onerror = () => thumb.classList.remove('visible');
          thumb.classList.add('visible');
        } else {
          thumb.classList.remove('visible');
        }
        hideFormError('imgError');
      },

      removeRow(btn, idx) {
        const builder = document.getElementById('imgBuilder');
        const row     = document.querySelector(`.img-builder-row[data-idx="${idx}"]`);
        if (!row) return;
        if (builder.querySelectorAll('.img-builder-row').length <= 1) {
          notify('You need at least 1 image field', 'red');
          return;
        }
        row.remove();
      },

      getUrls() {
        return Array.from(document.querySelectorAll('#imgBuilder .img-builder-row'))
          .map(r => r.querySelector('input[type=text]').value.trim())
          .filter(Boolean);
      },
    },
  };


  // ═══════════════════════════════════════════════════════════════
  // 9. CONTACT FORM
  // ═══════════════════════════════════════════════════════════════

  function submitContact() {
    const get   = id => (document.getElementById(id) || {}).value?.trim() || '';
    const name    = get('contactName');
    const phone   = get('contactPhone');
    const email   = get('contactEmail');
    const message = get('contactMessage');

    if (!name || !phone || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    data.messages.unshift({
      id      : Date.now(),
      name, phone, email, message,
      date    : new Date().toISOString().split('T')[0],
      read    : false,
    });

    ['contactName', 'contactPhone', 'contactEmail', 'contactMessage'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });

    const msg = document.getElementById('submitMsg');
    if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 4000); }

    updateMsgBadge();
    Storage.save();
  }


  // ═══════════════════════════════════════════════════════════════
  // 10. PUBLIC API
  // All functions the HTML onclick attributes reference live here.
  // ═══════════════════════════════════════════════════════════════

  const API = {

    // ── Navigation ──────────────────────────────────────────────
    showPage(page)         { Nav.show(page); },
    goBackPage()           { Nav.back(); },
    toggleMobileNav()      { Nav.toggleMobileNav(); },

    // ── Slider ──────────────────────────────────────────────────
    goToSlide(idx)         { Slider.goTo(idx); },

    // ── Projects ────────────────────────────────────────────────
    openProject(id) {
      Renderer.projectDetail(id);
      Nav.show('projectDetail');
    },

    switchTab(tab, btn) {
      ui.currentTab = tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      if (btn) btn.classList.add('active');
      Renderer.projects();
    },

    editProject(id) {
      const p = data.projects.find(x => x.id === id);
      if (p) ProjectForm.populate(p);
    },

    deleteProject(id) {
      if (!confirm('Delete this project?')) return;
      data.projects = data.projects.filter(p => p.id !== id);
      Renderer.adminProjects();
      Renderer.adminDashboard();
      Renderer.projects();
      Renderer.featured();
      Storage.save();
      notify('Project deleted', 'red');
    },

    saveProject()          { ProjectForm.save(); },
    clearProjectForm()     { ProjectForm.clear(); },
    addTimelineEntry()     { ProjectForm.addTimelineEntry(); },

    toggleFeatured(id) {
      const p = data.projects.find(x => x.id === id);
      if (!p) return;
      p.featured = !p.featured;
      Renderer.adminFeatured();
      Renderer.featured();
      Renderer.adminDashboard();
      Storage.save();
      notify(p.featured ? 'Added to featured' : 'Removed from featured');
    },

    toggleAward(id) {
      const p = data.projects.find(x => x.id === id);
      if (!p) return;
      p.award = !p.award;
      Renderer.adminFeatured();
      Renderer.featured();
      Renderer.projects();
      Storage.save();
      notify(p.award ? 'Award set' : 'Award removed');
    },

    // ── Image Builder ────────────────────────────────────────────
    addImgRow()            { ProjectForm.ImageBuilder.addRow(); },
    _imgRowPreview(input, idx) { ProjectForm.ImageBuilder._preview(input, idx); },
    _imgRowFile(event, idx) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        const row   = document.querySelector(`.img-builder-row[data-idx="${idx}"]`);
        if (!row) return;
        const input = row.querySelector('input[type=text]');
        input.value = e.target.result;
        ProjectForm.ImageBuilder._preview(input, idx);
      };
      reader.readAsDataURL(file);
    },
    _imgRowRemove(btn, idx) { ProjectForm.ImageBuilder.removeRow(btn, idx); },

    // ── Services ─────────────────────────────────────────────────
    highlightService(idx) {
      const s      = data.services[idx];
      const detail = document.getElementById('serviceDetailSection');
      if (!s || !detail) return;
      const h2 = detail.querySelector('h2');
      if (h2) h2.textContent = s.name;
      const ps = detail.querySelectorAll('p');
      if (ps[0]) ps[0].textContent = s.desc;
      const img = detail.querySelector('.service-detail-img');
      if (img) { img.src = s.img; img.alt = s.name; }
      detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    editService(id) {
      const s = data.services.find(x => x.id === id);
      if (!s) return;
      const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val; };
      set('svcName', s.name);
      set('svcDesc', s.desc);
      set('svcIcon', s.icon);
      set('svcImg',  s.img || '');
      const nameEl = document.getElementById('svcName');
      if (nameEl) nameEl.dataset.editId = id;
    },

    deleteService(id) {
      if (!confirm('Delete this service?')) return;
      data.services = data.services.filter(s => s.id !== id);
      Renderer.adminServices();
      Renderer.servicesPreview();
      Renderer.servicesPage();
      Storage.save();
      notify('Service deleted', 'red');
    },

    saveService() {
      const name   = (document.getElementById('svcName')?.value || '').trim();
      const desc   = (document.getElementById('svcDesc')?.value || '').trim();
      const icon   = (document.getElementById('svcIcon')?.value || '').trim() || '🔧';
      const svcImg = (document.getElementById('svcImg')?.value  || '').trim();
      if (!name) { alert('Service name required.'); return; }

      const nameEl = document.getElementById('svcName');
      const editId = nameEl?.dataset.editId;

      if (editId) {
        const idx = data.services.findIndex(s => s.id === parseInt(editId, 10));
        if (idx > -1) data.services[idx] = { ...data.services[idx], name, desc, icon, img: svcImg || data.services[idx].img };
        if (nameEl) delete nameEl.dataset.editId;
      } else {
        data.services.push({ id: Date.now(), name, desc, icon, img: svcImg });
      }

      ['svcName', 'svcDesc', 'svcIcon', 'svcImg'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });

      Renderer.adminServices();
      Renderer.servicesPreview();
      Renderer.servicesPage();
      Storage.save();
      notify('Service saved!', 'green');
    },

    // ── Messages ─────────────────────────────────────────────────
    toggleMessageDetail(id) {
      const detail = document.getElementById('msg-' + id);
      if (detail) detail.classList.toggle('open');
    },

    toggleMessageRead(id) {
      const m = data.messages.find(x => x.id === id);
      if (!m) return;
      m.read = !m.read;
      Renderer.adminMessages();
      Renderer.adminDashboard();
      updateMsgBadge();
      Storage.save();
    },

    deleteMessage(id) {
      data.messages = data.messages.filter(m => m.id !== id);
      Renderer.adminMessages();
      Renderer.adminDashboard();
      updateMsgBadge();
      Storage.save();
      notify('Message deleted', 'red');
    },

    clearAllMessages() {
      if (!confirm('Clear all messages?')) return;
      data.messages = [];
      Renderer.adminMessages();
      Renderer.adminDashboard();
      updateMsgBadge();
      Storage.save();
      notify('All messages cleared', 'red');
    },

    // ── Users ────────────────────────────────────────────────────
    addUser() {
      const uEl   = document.getElementById('newUsername');
      const pEl   = document.getElementById('newPassword');
      const rEl   = document.getElementById('newRole');
      const errEl = document.getElementById('userFormError');
      const u     = uEl?.value.trim() || '';
      const p     = pEl?.value        || '';
      const r     = rEl?.value        || 'User';

      errEl?.classList.remove('show');

      if (!u || !p) {
        showFormError('userFormError', 'Username and password are required.');
        return;
      }
      if (p.length < 4) {
        showFormError('userFormError', 'Password must be at least 4 characters.');
        return;
      }
      if (data.users.find(x => x.username.toLowerCase() === u.toLowerCase())) {
        showFormError('userFormError', 'Username already exists.');
        return;
      }

      data.users.push({ id: Date.now(), username: u, password: btoa(p), role: r, active: true });
      if (uEl) uEl.value = '';
      if (pEl) pEl.value = '';
      Renderer.adminUsers();
      Storage.save();
      notify(`User "${u}" added successfully`, 'green');
    },

    deleteUser(username) {
      const current = localStorage.getItem('adminUsername') || 'admin';
      if (username === current) { notify('Cannot delete your own account', 'red'); return; }
      if (!confirm(`Delete user "${username}"?`)) return;
      data.users = data.users.filter(u => u.username !== username);
      Renderer.adminUsers();
      Storage.save();
      notify('User deleted');
    },

    // ── Hero Images ──────────────────────────────────────────────
    removeHeroImg(i) {
      Slider._stopAutoplay();                         // stop before mutating
      data.heroImages.splice(i, 1);
      ui.currentSlide = Math.max(0, Math.min(ui.currentSlide, data.heroImages.length - 1));
      Renderer.adminHeroImages();
      Slider.render();                                // re-render starts fresh timer
      Storage.save();
      notify('Image removed');
    },

    handleHeroUpload(e) {
      const files  = Array.from(e.target.files);
      const slots  = 10 - data.heroImages.length;
      const total  = Math.min(files.length, slots);
      if (total === 0) { e.target.value = ''; return; }

      let done = 0;
      files.slice(0, total).forEach(f => {
        const reader = new FileReader();
        reader.onload = ev => {
          data.heroImages.push(ev.target.result);
          done++;
          if (done === total) {
            Renderer.adminHeroImages();
            Slider.render();
            Storage.save();               // persist immediately — no manual step
            e.target.value = '';
            notify(`${total} image${total > 1 ? 's' : ''} uploaded and saved`, 'green');
          }
        };
        reader.onerror = () => {
          done++;
          console.warn('[Upload] failed to read:', f.name);
          if (done === total) {
            Renderer.adminHeroImages();
            e.target.value = '';
          }
        };
        reader.readAsDataURL(f);
      });
    },

    saveHeroImages() {
      ui.currentSlide = Math.max(0, Math.min(ui.currentSlide, data.heroImages.length - 1));
      Slider.render();
      Storage.save();
      notify('Hero images saved!', 'green');
    },

    // ── Metrics ──────────────────────────────────────────────────
    saveMetrics() {
      const get = id => (document.getElementById(id)?.value || '');
      data.metrics = { m1: get('met1'), m2: get('met2'), m3: get('met3'), m4: get('met4') };
      Renderer.metrics();
      Storage.save();
      notify('Metrics updated!', 'green');
    },

    // ── Admin gate ───────────────────────────────────────────────
    openAdminLogin()   { Admin.openLogin(); },
    closeAdminLogin()  { Admin.closeLogin(); },
    doLogin()          { Admin.doLogin(); },
    openAdmin()        { Admin.open(); },
    closeAdmin()       { Admin.close(); },
    logoutAdmin()      { Admin.logout(); },
    adminNav(s, el)    { Admin.nav(s, el); },

    // ── Contact ──────────────────────────────────────────────────
    submitContact()    { submitContact(); },
  };


  // ═══════════════════════════════════════════════════════════════
  // 11. BOOT
  // ═══════════════════════════════════════════════════════════════

  function boot() {
    Storage.load();
    Nav.show('home');         // renders home (including Slider.render()) once, cleanly
    updateMsgBadge();
  }

  boot();


  // ═══════════════════════════════════════════════════════════════
  // 12. EXPORT to window
  // Only the API surface — nothing internal leaks.
  // ═══════════════════════════════════════════════════════════════

  window.App = API;

  // Convenience shims for any existing HTML onclick="functionName(...)"
  // that doesn't yet use the App.* prefix.
  const shims = [
    'showPage','goBackPage','toggleMobileNav','goToSlide',
    'openProject','switchTab','editProject','deleteProject',
    'saveProject','clearProjectForm','addTimelineEntry',
    'toggleFeatured','toggleAward','addImgRow',
    'highlightService','editService','deleteService','saveService',
    'toggleMessageDetail','toggleMessageRead','deleteMessage','clearAllMessages',
    'addUser','deleteUser',
    'removeHeroImg','handleHeroUpload','saveHeroImages',
    'saveMetrics',
    'openAdminLogin','closeAdminLogin','doLogin','openAdmin','closeAdmin','logoutAdmin','adminNav',
    'submitContact',
  ];

  shims.forEach(fn => {
    if (typeof window[fn] === 'undefined') {
      window[fn] = (...args) => API[fn]?.(...args);
    }
  });

})();
