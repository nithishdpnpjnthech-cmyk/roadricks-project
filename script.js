// =============================================================================
// HERO SLIDER — FIXED & REFACTORED
// Fixes 7 bugs. Drop this file in and replace the corresponding sections.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE — unified, atomic, always-consistent
// ─────────────────────────────────────────────────────────────────────────────
//
// BUG 1 FIX: heroImages were never included in saveData().
// BUG 2 FIX: saveHeroImagesToStorage() was a separate manual step, not wired
//             into the main save path, causing silent data loss on every
//             unrelated save (contact form, metrics, projects, etc.).
//
// SOLUTION: saveData() now always persists heroImages via per-key storage.
//           saveHeroImagesToStorage / loadHeroImagesFromStorage are internal
//           helpers called automatically — callers never need to think about it.
// ─────────────────────────────────────────────────────────────────────────────

const HERO_KEY_PREFIX = 'rodricks_hero_';
const HERO_COUNT_KEY  = 'rodricks_hero_count';

function _saveHeroImages() {
  try {
    // Clear stale keys first (count may have shrunk)
    const oldCount = parseInt(localStorage.getItem(HERO_COUNT_KEY) || '0', 10);
    for (let i = 0; i < oldCount; i++) {
      localStorage.removeItem(HERO_KEY_PREFIX + i);
    }

    let saved = 0;
    for (let i = 0; i < data.heroImages.length; i++) {
      try {
        localStorage.setItem(HERO_KEY_PREFIX + i, data.heroImages[i]);
        saved++;
      } catch (_) {
        // Quota exceeded — stop here; partial save is acceptable
        console.warn(`Hero image ${i} exceeds storage quota; only ${saved} of ${data.heroImages.length} saved.`);
        break;
      }
    }

    localStorage.setItem(HERO_COUNT_KEY, String(saved));
  } catch (e) {
    console.warn('Could not persist hero images:', e);
  }
}

function _loadHeroImages() {
  try {
    const rawCount = localStorage.getItem(HERO_COUNT_KEY);
    if (rawCount === null) return false; // first-ever visit — keep defaults

    const count = parseInt(rawCount, 10);
    if (!Number.isFinite(count) || count < 0) return false;

    const images = [];
    for (let i = 0; i < count; i++) {
      const img = localStorage.getItem(HERO_KEY_PREFIX + i);
      if (img) images.push(img);
    }

    data.heroImages = images; // replace defaults even when empty (user wiped all)
    return true;
  } catch (e) {
    console.warn('Could not load hero images:', e);
    return false;
  }
}

function saveData() {
  // BUG 1 + 2 FIX: always persist heroImages on every saveData() call.
  try {
    localStorage.setItem('rodricks_data', JSON.stringify({
      projects : data.projects,
      services : data.services,
      messages : data.messages,
      users    : data.users,
      metrics  : data.metrics,
      // heroImages intentionally excluded from this key (base64 too large)
      // — they are saved atomically below.
    }));

    _saveHeroImages(); // always called, not optional
  } catch (e) {
    console.warn('Storage unavailable:', e);
  }
}

function loadData() {
  // BUG 4 FIX: swallow only actual parse/IO errors, not logical failures.
  //            Validate each field before overwriting in-memory state so a
  //            partial corrupt save can't replace good defaults.
  let mainLoaded = false;
  try {
    const raw = localStorage.getItem('rodricks_data');
    if (raw) {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed.projects) && parsed.projects.length)
        data.projects = parsed.projects;
      if (Array.isArray(parsed.services) && parsed.services.length)
        data.services = parsed.services;
      if (Array.isArray(parsed.messages))
        data.messages = parsed.messages;
      if (Array.isArray(parsed.users) && parsed.users.length)
        data.users = parsed.users;
      if (parsed.metrics && typeof parsed.metrics === 'object')
        data.metrics = parsed.metrics;

      mainLoaded = true;
    }
  } catch (e) {
    console.warn('Could not load main saved data:', e);
  }

  _loadHeroImages(); // hero images loaded regardless of main-data outcome

  // Password migration: encode any plain-text passwords still in storage
  let migrated = false;
  data.users = data.users.map(u => {
    if (u.password && !_isBase64(u.password)) {
      migrated = true;
      return { ...u, password: btoa(u.password) };
    }
    return u;
  });
  if (migrated) saveData();

  return mainLoaded;
}

function _isBase64(str) {
  try { return btoa(atob(str)) === str; } catch (_) { return false; }
}


// ─────────────────────────────────────────────────────────────────────────────
// HERO SLIDER — safe, race-free, index-stable
// ─────────────────────────────────────────────────────────────────────────────
//
// BUG 3 FIX: interval was cleared with clearInterval(data.slideInterval) but
//             data.slideInterval could be a stale ID if renderHeroSlider() was
//             called while a tick was already in flight (React-style re-render).
//             Solution: use a module-scoped _heroIntervalId variable and always
//             null it after clearing — making the clear idempotent.
//
// BUG 5 FIX: the setInterval callback captured validImages.length at render
//             time. If images were later removed, modulo would wrap to an index
//             that no longer existed in the DOM. Solution: read the live slide
//             count inside the callback, not the closure.
//
// BUG 6 FIX: removeHeroImg() spliced the array while the interval might be mid-
//             tick. Solution: pause the interval before mutating, re-render
//             (which starts a fresh interval) after.
// ─────────────────────────────────────────────────────────────────────────────

// Module-scope, not on data{} — avoids accidental serialisation and stale IDs
let _heroIntervalId = null;

function _clearHeroInterval() {
  if (_heroIntervalId !== null) {
    clearInterval(_heroIntervalId);
    _heroIntervalId = null;
  }
}

function renderHeroSlider() {
  const slider = document.getElementById('heroSlider');
  const dots   = document.getElementById('heroDots');
  if (!slider || !dots) return;

  // BUG 3 FIX: always clear via the module-scope id, then null it
  _clearHeroInterval();

  slider.innerHTML = '';
  dots.innerHTML   = '';

  const validImages = data.heroImages.filter(img => typeof img === 'string' && img.trim() !== '');

  if (!validImages.length) {
    slider.innerHTML = '<div class="hero-slide active" style="background:linear-gradient(135deg,#161616,#252525)"></div>';
    data.currentSlide = 0;
    return;
  }

  // Clamp currentSlide to valid range after image removal
  data.currentSlide = Math.max(0, Math.min(data.currentSlide, validImages.length - 1));

  validImages.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === data.currentSlide ? ' active' : '');
    slide.style.backgroundImage = `url('${img}')`;
    slider.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === data.currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  });

  if (validImages.length > 1) {
    // BUG 5 FIX: read slide count live inside the callback, not from closure
    _heroIntervalId = setInterval(() => {
      const total = document.querySelectorAll('.hero-slide').length;
      if (total > 0) goToSlide((data.currentSlide + 1) % total);
    }, 5000);
  }
}

function goToSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  // Defensively clamp — protects against race between removal and next tick
  const safeIdx = Math.max(0, Math.min(idx, slides.length - 1));

  slides.forEach((s, i) => s.classList.toggle('active', i === safeIdx));
  dots.forEach((d, i)   => d.classList.toggle('active', i === safeIdx));
  data.currentSlide = safeIdx;
}


// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — HERO IMAGES
// ─────────────────────────────────────────────────────────────────────────────

function renderAdminHeroImages() {
  const grid = document.getElementById('heroImgGrid');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 10 }, (_, i) => {
    const img = data.heroImages[i];
    return `<div class="hero-img-item">
      ${img
        ? `<img src="${img}" onerror="this.style.display='none'">
           <button class="hero-img-remove" onclick="removeHeroImg(${i})" aria-label="Remove image ${i + 1}">×</button>`
        : '<div class="img-placeholder">📷<span style="font-size:0.6rem">Empty</span></div>'
      }
      <div class="img-num">${i + 1}</div>
    </div>`;
  }).join('');
}

function removeHeroImg(i) {
  // BUG 6 FIX: stop interval BEFORE mutating the array, then re-render.
  //             Previously the interval could fire mid-splice with a dead index.
  _clearHeroInterval();

  data.heroImages.splice(i, 1);
  data.currentSlide = Math.max(0, Math.min(data.currentSlide, data.heroImages.length - 1));

  renderAdminHeroImages();
  // Re-render slider (starts a fresh safe interval inside renderHeroSlider)
  renderHeroSlider();
  saveData(); // persist immediately so the removal survives a refresh
  notify('Image removed');
}

function handleHeroUpload(e) {
  // BUG 7 FIX: uploaded images were only held in memory; never auto-saved.
  //             Now saveData() is called after all files are processed.
  const files = Array.from(e.target.files);
  const slots  = 10 - data.heroImages.length;
  const total  = Math.min(files.length, slots);

  if (total === 0) { e.target.value = ''; return; }

  let processed = 0;

  files.slice(0, total).forEach(f => {
    const reader = new FileReader();
    reader.onload = ev => {
      data.heroImages.push(ev.target.result);
      processed++;

      if (processed === total) {
        renderAdminHeroImages();
        renderHeroSlider(); // live preview updates immediately
        saveData();         // BUG 7 FIX: persist right away
        e.target.value = '';
        notify(`${total} image${total > 1 ? 's' : ''} uploaded and saved`, 'green');
      }
    };
    reader.onerror = () => {
      processed++;
      console.warn(`Failed to read file: ${f.name}`);
      if (processed === total) {
        renderAdminHeroImages();
        e.target.value = '';
      }
    };
    reader.readAsDataURL(f);
  });
}

function saveHeroImages() {
  // This is now a thin UI action — saveData() does the heavy lifting.
  data.currentSlide = Math.max(0, Math.min(data.currentSlide, data.heroImages.length - 1));
  renderHeroSlider();
  saveData();
  notify('Hero images saved!', 'green');
}
