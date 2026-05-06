// ===========================
// CONFIG — set your backend URL here
// ===========================
// During local development: 'http://localhost:8000'
// After deploying to Render/Railway: 'https://your-app.onrender.com'
const API_URL = window.BACKEND_URL || 'http://localhost:8000';

// ===========================
// STATE
// ===========================
let data = {
  heroImages: [],
  projects:   [],
  services:   [],
  messages:   [],
  users:      [],
  metrics:    { m1:'500+', m2:'34', m3:'18', m4:'98%' },
};

let pageHistory        = [];
let currentAdminUser   = null;

// ===========================
// BOOTSTRAP — fetch from backend API
// ===========================
async function initApp() {
  try {
    const res = await fetch(`${API_URL}/data`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    if (Array.isArray(json.heroImages) && json.heroImages.length) data.heroImages = json.heroImages;
    if (Array.isArray(json.projects)   && json.projects.length)   data.projects   = json.projects;
    if (Array.isArray(json.services)   && json.services.length)   data.services   = json.services;
    if (Array.isArray(json.messages))                             data.messages   = json.messages;
    if (Array.isArray(json.users)      && json.users.length)      data.users      = json.users;
    if (json.metrics && typeof json.metrics === 'object')         data.metrics    = json.metrics;
  } catch (err) {
    console.warn('Could not reach backend — check that the server is running at ' + API_URL, err);
    notify('Could not connect to backend. Check console for details.', 'red');
  }
  // Ensure every user has a base64-encoded password
  data.users = data.users.map(u =>
    u.password && !isBase64(u.password) ? { ...u, password: btoa(u.password) } : u
  );
  // Runtime-only state
  data.currentTab    = 'current';
  data.currentSlide  = 0;
  data.slideInterval = null;

  renderHome();
}

// ===========================
// PERSIST — save full data object to backend
// ===========================
async function saveData() {
  try {
    // Build payload — only the six persisted keys, never runtime state
    const payload = {
      heroImages: Array.isArray(data.heroImages) ? data.heroImages : [],
      projects:   Array.isArray(data.projects)   ? data.projects   : [],
      services:   Array.isArray(data.services)   ? data.services   : [],
      messages:   Array.isArray(data.messages)   ? data.messages   : [],
      users:      Array.isArray(data.users)       ? data.users      : [],
      metrics:    (data.metrics && typeof data.metrics === 'object') ? data.metrics : {},
    };

    // Serialize and validate before sending
    let body;
    try {
      body = JSON.stringify(payload);
    } catch (serr) {
      console.error('saveData: JSON.stringify failed', serr, payload);
      notify('Save failed — data could not be serialized.', 'red');
      return false;
    }

    if (!body || body === 'undefined' || body === 'null') {
      console.error('saveData: body is empty or null after stringify', body);
      notify('Save failed — payload is empty.', 'red');
      return false;
    }

    // Debug log — shows exactly what is being sent
    console.log('[saveData] Sending to', `${API_URL}/data`, '—', body.length, 'bytes');
    console.log('[saveData] Payload:', payload);

    const res = await fetch(`${API_URL}/data`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '(no response body)');
      console.error(`saveData: server returned ${res.status}`, errText);
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const json = await res.json().catch(() => ({}));
    console.log('[saveData] Success:', json);
    return true;
  } catch (err) {
    console.error('saveData failed:', err);
    notify('Save failed — check your backend connection.', 'red');
    return false;
  }
}

// ===========================
// UPLOAD — send a single image file to backend
// Returns the hosted URL string, or null on failure
// ===========================
async function uploadImageFile(file) {
  const form = new FormData();
  form.append('file', file);
  try {
    const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: form });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload failed');
    }
    const json = await res.json();
    // Backend returns { url: '/uploads/filename.jpg' }
    // Make it absolute so it works from any frontend origin
    return json.url.startsWith('http') ? json.url : `${API_URL}${json.url}`;
  } catch (err) {
    console.error('uploadImageFile failed:', err);
    notify('Image upload failed: ' + err.message, 'red');
    return null;
  }
}

// exportData is kept as a backup download option (optional, not needed for normal use)
function exportData() {
  const payload = {
    heroImages: data.heroImages,
    projects:   data.projects,
    services:   data.services,
    messages:   data.messages,
    users:      data.users,
    metrics:    data.metrics,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'data-backup.json'; a.click();
  URL.revokeObjectURL(url);
  notify('Backup downloaded.', 'green');
}

// ===========================
// UTILITIES
// ===========================
function isBase64(str) {
  try { return btoa(atob(str)) === str; } catch (e) { return false; }
}

function formatDate(value) {
  if (!value) return 'Date pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
}

function toDateInputValue(value) {
  if (!value) return new Date().toISOString().split('T')[0];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().split('T')[0];
}

function sortedTimeline(timeline) {
  return [...(timeline || [])].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function getFirstImage(project) {
  if (Array.isArray(project.images) && project.images.length) return project.images[0];
  return project.img || '';
}

// ===========================
// MOBILE NAV
// ===========================
function toggleMobileNav() {
  const isOpen = document.body.classList.toggle('mobile-nav-open');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileNav() {
  document.body.classList.remove('mobile-nav-open');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

// ===========================
// PAGE NAVIGATION
// ===========================
const VALID_PAGES = ['home','restore','services','about','contact','projectDetail'];

function currentPageKey() {
  const active = document.querySelector('.page.active');
  return active ? active.id.replace('page-', '') : 'home';
}

function showPage(page, fromBack = false) {
  const targetPage = VALID_PAGES.includes(page) ? page : 'home';
  const previousPage = currentPageKey();

  if (!fromBack && previousPage !== targetPage) {
    pageHistory.push(previousPage);
    if (pageHistory.length > 20) pageHistory.shift();
  }

  closeMobileNav();

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Clear nav highlights
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

  // Show target page; always fall back to home if element missing
  const el = document.getElementById('page-' + targetPage) || document.getElementById('page-home');
  if (!el) return;
  el.classList.add('active');

  // projectDetail highlights the restore nav item
  const navKey = targetPage === 'projectDetail' ? 'restore' : targetPage;
  const navEl  = document.getElementById('nav-' + navKey);
  if (navEl) navEl.classList.add('active');

  document.body.classList.toggle('contact-page-active', targetPage === 'contact');

  window.scrollTo(0, 0);

  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) scrollIndicator.classList.remove('hide');

  // Render content for the target page
  if (targetPage === 'home')          renderHome();
  if (targetPage === 'restore')       renderProjects();
  if (targetPage === 'services')      renderServicesPage();
}

function goBackPage() {
  let previous = pageHistory.pop();
  while (previous && previous === currentPageKey()) previous = pageHistory.pop();
  showPage(previous || 'home', true);
}

// ===========================
// HERO SLIDER
// ===========================
function renderHeroSlider() {
  const slider = document.getElementById('heroSlider');
  const dots   = document.getElementById('heroDots');
  if (!slider || !dots) return;

  slider.innerHTML = '';
  dots.innerHTML   = '';

  // Clear any existing interval first
  if (data.slideInterval) {
    clearInterval(data.slideInterval);
    data.slideInterval = null;
  }

  const images = Array.isArray(data.heroImages) ? data.heroImages.filter(Boolean) : [];

  if (!images.length) {
    slider.innerHTML = '<div class="hero-slide active" style="background:linear-gradient(135deg,#161616,#252525)"></div>';
    return;
  }

  // Clamp currentSlide to valid range after any image removal
  if (data.currentSlide >= images.length) data.currentSlide = 0;

  images.forEach((img, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === data.currentSlide ? ' active' : '');
    slide.style.backgroundImage = `url('${img}')`;
    slider.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === data.currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  });

  data.slideInterval = setInterval(() => {
    goToSlide((data.currentSlide + 1) % images.length);
  }, 5000);
}

function goToSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  const safeIdx = Math.max(0, Math.min(idx, slides.length - 1));
  slides.forEach((s, i) => s.classList.toggle('active', i === safeIdx));
  dots.forEach((d, i)   => d.classList.toggle('active', i === safeIdx));
  data.currentSlide = safeIdx;
}

// ===========================
// HOME PAGE
// ===========================
function renderHome() {
  renderHeroSlider();
  renderServicesPreview();
  renderFeatured();
  renderMetrics();
}

function renderServicesPreview() {
  const grid = document.getElementById('servicesPreviewGrid');
  if (!grid) return;
  const services = Array.isArray(data.services) ? data.services.slice(0, 4) : [];
  grid.innerHTML = services.map(s => `
    <div class="service-card" onclick="showPage('services')">
      <span class="service-icon">${s.icon || '🔧'}</span>
      <h3>${s.name}</h3>
      <p>${s.desc || ''}</p>
    </div>
  `).join('') || '<p style="color:var(--muted);font-size:0.8rem">No services configured.</p>';
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = (data.projects || []).filter(p => p.featured).slice(0, 3);
  if (!featured.length) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:0.8rem">No featured projects set.</p>';
    return;
  }
  const [main, ...sides] = featured;
  grid.innerHTML = `
    <div class="featured-main" onclick="openProject(${main.id})">
      <img class="featured-img" src="${getFirstImage(main)}" alt="${main.name}" onerror="this.style.background='var(--dark3)'">
      <div class="featured-overlay">
        <div class="featured-info"><h3>${main.name}</h3><span>${main.category || main.status}</span></div>
      </div>
      ${main.award ? '<div class="award-badge">★ Award Winner</div>' : ''}
    </div>
    <div class="featured-side">
      ${sides.map(p => `
        <div class="featured-side-item" onclick="openProject(${p.id})">
          <img class="featured-img" src="${getFirstImage(p)}" alt="${p.name}" onerror="this.style.background='var(--dark3)'">
          <div class="featured-overlay">
            <div class="featured-info"><h3 style="font-size:1rem">${p.name}</h3><span>${p.category || p.status}</span></div>
          </div>
          ${p.award ? '<div class="award-badge">★ Award</div>' : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderMetrics() {
  const m = data.metrics || {};
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('m1', m.m1 || ''); set('m2', m.m2 || ''); set('m3', m.m3 || ''); set('m4', m.m4 || '');
}

// ===========================
// RESTORATION / PROJECTS
// ===========================
function switchTab(tab, btn) {
  data.currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProjects();
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  const projects = (data.projects || []).filter(p => p.status === data.currentTab);
  grid.innerHTML = projects.length
    ? projects.map(p => `
        <div class="project-card" onclick="openProject(${p.id})">
          <img class="project-card-img" src="${getFirstImage(p)}" alt="${p.name}" onerror="this.style.background='var(--dark3)'">
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
}

function openProject(id) {
  const p = (data.projects || []).find(x => x.id === id);
  if (!p) return;

  const timeline = sortedTimeline(p.timeline);
  const latest   = timeline[0];

  document.getElementById('detailCategory').textContent  = p.status === 'finished' ? 'Completed Project' : 'Live Project';
  document.getElementById('detailTitle').textContent      = p.name;
  document.getElementById('detailYear').textContent       = p.status === 'finished' ? `Completed: ${p.year}` : `In Progress — ${p.year}`;
  document.getElementById('detailStatus').textContent     = p.status === 'finished' ? 'Completed' : 'In Progress';
  document.getElementById('detailLastUpdated').textContent = `Last Updated: ${latest ? formatDate(latest.date) : 'Not available'}`;
  document.getElementById('detailHero').style.backgroundImage = `url('${getFirstImage(p)}')`;
  document.getElementById('detailOutcome').textContent    = p.outcome || 'This project is currently in progress.';

  // Timeline
  document.getElementById('detailTimeline').innerHTML = timeline.length
    ? timeline.map((t, i) => `
        <div class="timeline-item ${i === 0 ? 'latest' : ''}">
          <div class="timeline-dot"></div>
          <span class="timeline-date">${formatDate(t.date)}</span>
          <h4>${t.title}</h4>
          <p>${t.desc}</p>
        </div>
      `).join('')
    : '<p style="color:#5f5a52;font-size:0.84rem;line-height:1.8">No timeline updates have been added yet.</p>';

  // Gallery — show ALL images (full grid on detail page)
  const images = Array.isArray(p.images) && p.images.length ? p.images : [p.img].filter(Boolean);
  document.getElementById('detailImages').innerHTML = images.map(src => `
    <div class="detail-img-wrap">
      <img class="detail-img" src="${src}" alt="${p.name}" onerror="this.style.background='#ccc'">
    </div>
  `).join('') || '<p style="color:#5f5a52;font-size:0.84rem">No images available.</p>';

  showPage('projectDetail');
}

// ===========================
// SERVICES PAGE
// ===========================
const serviceImages = [
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  'https://images.unsplash.com/photo-1635773054018-2b0c29be3b6d?w=600&q=80',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80',
];

function renderServicesPage() {
  const grid = document.getElementById('servicesFullGrid');
  if (!grid) return;
  const services = Array.isArray(data.services) ? data.services : [];
  grid.innerHTML = services.map((s, i) => `
    <div class="service-full-card" onclick="highlightService(${i})">
      <img class="service-full-img" src="${s.img || serviceImages[i % serviceImages.length]}" alt="${s.name}" onerror="this.style.background='#ccc'">
      <div class="service-full-body">
        <div class="service-full-title">${s.name}</div>
        <div class="service-full-desc">${s.desc ? s.desc.split('.')[0] + '.' : ''}</div>
        <button class="service-full-link">LEARN MORE &nbsp;&#8594;</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--muted);font-size:0.8rem">No services configured.</p>';
}

function highlightService(idx) {
  const s      = (data.services || [])[idx];
  if (!s) return;
  const detail = document.getElementById('serviceDetailSection');
  if (!detail) return;
  const img    = s.img || serviceImages[idx % serviceImages.length];
  const h2     = detail.querySelector('h2');
  if (h2) h2.textContent = s.name;
  const ps = detail.querySelectorAll('p');
  if (ps[0]) ps[0].textContent = s.desc || '';
  const detailImg = detail.querySelector('.service-detail-img');
  if (detailImg) { detailImg.src = img; detailImg.alt = s.name; }
  detail.scrollIntoView({ behavior:'smooth', block:'start' });
}

// ===========================
// CONTACT FORM
// ===========================
async function submitContact() {
  const name    = document.getElementById('contactName').value.trim();
  const phone   = document.getElementById('contactPhone').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  if (!name || !phone || !email || !message) { alert('Please fill in all required fields.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }

  try {
    const res = await fetch(`${API_URL}/contact`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, phone, message, date: new Date().toISOString().split('T')[0] }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();

    // Also update local state for immediate display in admin
    data.messages.unshift({ id: json.id, name, email, phone, message, date: new Date().toISOString().split('T')[0], read: false });
  } catch (err) {
    console.error('Contact submit failed:', err);
    alert('Could not send your message. Please try again later.');
    return;
  }

  document.getElementById('contactName').value    = '';
  document.getElementById('contactPhone').value   = '';
  document.getElementById('contactEmail').value   = '';
  document.getElementById('contactMessage').value = '';

  const msgEl = document.getElementById('submitMsg');
  if (msgEl) { msgEl.style.display = 'block'; setTimeout(() => msgEl.style.display = 'none', 4000); }

  updateMsgBadge();
}

// ===========================
// ADMIN LOGIN
// ===========================
function openAdminLogin() {
  const modal = document.getElementById('adminLogin');
  const err   = document.getElementById('loginError');
  if (!modal) return;
  modal.classList.add('open');
  if (err) err.style.display = 'none';
  const userEl = document.getElementById('loginUser');
  if (userEl) userEl.focus();
}

function closeAdminLogin() {
  const modal = document.getElementById('adminLogin');
  if (modal) modal.classList.remove('open');
  const err  = document.getElementById('loginError');
  if (err) err.style.display = 'none';
  const pass = document.getElementById('loginPass');
  if (pass) pass.value = '';
}

function doLogin() {
  const u   = (document.getElementById('loginUser').value || '').trim();
  const p   = document.getElementById('loginPass').value || '';
  const err = document.getElementById('loginError');

  const encoded = btoa(p);
  const user = (data.users || []).find(x =>
    x.active !== false && x.username === u &&
    (x.password === encoded || x.password === p)
  );

  if (user) {
    if (err) err.style.display = 'none';
    currentAdminUser = u;  // session stored in memory, NOT localStorage
    closeAdminLogin();
    openAdmin();
  } else {
    if (err) err.style.display = 'block';
  }
}

// ===========================
// ADMIN PANEL
// ===========================
function openAdmin() {
  const panel = document.getElementById('adminPanel');
  if (!panel) return;
  panel.classList.add('open');
  adminNav('dashboard', document.querySelector('.admin-nav-item'));
  renderAdminDashboard();
  updateMsgBadge();
}

function closeAdmin() {
  const panel = document.getElementById('adminPanel');
  if (panel) panel.classList.remove('open');
}

function logoutAdmin() {
  currentAdminUser = null;
  closeAdmin();
  notify('Logged out successfully');
}

function adminNavItem(section) {
  return Array.from(document.querySelectorAll('.admin-nav-item'))
    .find(item => (item.getAttribute('onclick') || '').includes(`'${section}'`));
}

function adminNav(section, el) {
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  const secEl = document.getElementById('sec-' + section);
  if (secEl) secEl.classList.add('active');

  const titles = {
    dashboard:'Dashboard', users:'Users', heroImages:'Hero Images',
    projects:'All Projects', addProject:'Add / Edit Project',
    featured:'Featured Projects', services:'Services',
    messages:'Messages', metrics:'Site Metrics',
  };
  const titleEl = document.getElementById('adminTopTitle');
  if (titleEl) titleEl.textContent = titles[section] || section;

  if (section === 'dashboard')   renderAdminDashboard();
  if (section === 'users')       renderAdminUsers();
  if (section === 'heroImages')  renderAdminHeroImages();
  if (section === 'projects')    renderAdminProjects();
  if (section === 'featured')    renderAdminFeatured();
  if (section === 'services')    renderAdminServices();
  if (section === 'messages')    renderAdminMessages();
  if (section === 'metrics')     renderAdminMetrics();
  if (section === 'addProject') {
    clearProjectForm();
    setTimeout(() => {
      if (!document.querySelectorAll('#imgBuilder .img-builder-row').length) populateImgBuilder([]);
    }, 50);
  }
}

function notify(msg, type = 'gold') {
  const n = document.getElementById('adminNotif');
  if (!n) return;
  n.textContent = msg;
  n.style.borderLeftColor = type === 'red' ? 'var(--red)' : type === 'green' ? 'var(--green)' : 'var(--gold)';
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3200);
}

function updateMsgBadge() {
  const unread = (data.messages || []).filter(m => !m.read).length;
  const badge  = document.getElementById('msgBadge');
  if (badge) badge.textContent = unread > 0 ? unread : '';
}

// ── Dashboard ──
function renderAdminDashboard() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('dash-projects',  (data.projects  || []).length);
  set('dash-current',   (data.projects  || []).filter(p => p.status === 'current').length);
  set('dash-messages',  (data.messages  || []).length);
  set('dash-unread',    (data.messages  || []).filter(m => !m.read).length);

  const tbody = document.getElementById('dashProjectsTable');
  if (!tbody) return;
  tbody.innerHTML = (data.projects || []).slice(0, 6).map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.year}</td>
      <td><span class="badge badge-${p.status}">${p.status}</span></td>
      <td>${p.featured ? '<span class="badge badge-featured">Featured</span>' : '-'}</td>
      <td>
        <button class="action-btn action-edit" onclick="editProject(${p.id})">Edit</button>
        <button class="action-btn action-del"  onclick="deleteProject(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// ── Users ──
function renderAdminUsers() {
  const tbody = document.getElementById('usersTable');
  if (!tbody) return;
  tbody.innerHTML = (data.users || []).map(u => `
    <tr>
      <td><strong>${u.username}</strong>${u.username === currentAdminUser ? ' <span style="font-size:0.65rem;color:var(--gold)">(you)</span>' : ''}</td>
      <td>${u.role || 'User'}</td>
      <td><span class="badge badge-read">Active</span></td>
      <td>${u.username === currentAdminUser
        ? '<span style="font-size:0.7rem;color:var(--muted)">—</span>'
        : `<button class="user-action-del" onclick="deleteUser('${u.username}')">Delete</button>`
      }</td>
    </tr>
  `).join('');
}

function addUser() {
  const uEl    = document.getElementById('newUsername');
  const pEl    = document.getElementById('newPassword');
  const rEl    = document.getElementById('newRole');
  const errEl  = document.getElementById('userFormError');
  const u = uEl.value.trim();
  const p = pEl.value;
  const r = rEl.value;
  errEl.classList.remove('show');

  if (!u || !p) { errEl.textContent = 'Username and password are required.'; errEl.classList.add('show'); return; }
  if (p.length < 4) { errEl.textContent = 'Password must be at least 4 characters.'; errEl.classList.add('show'); return; }
  if ((data.users || []).find(x => x.username.toLowerCase() === u.toLowerCase())) {
    errEl.textContent = 'Username already exists.'; errEl.classList.add('show'); return;
  }

  data.users.push({ id: Date.now(), username: u, password: btoa(p), role: r, active: true });
  uEl.value = ''; pEl.value = '';
  renderAdminUsers();
  saveData().then(ok => { if (ok) notify('User "' + u + '" added.', 'green'); });
}

function deleteUser(username) {
  if (username === currentAdminUser) { notify('Cannot delete your own account', 'red'); return; }
  if (!confirm('Delete user "' + username + '"?')) return;
  data.users = (data.users || []).filter(u => u.username !== username);
  renderAdminUsers();
  saveData().then(ok => { if (ok) notify('User deleted'); });
}

// ── Hero Images ──
function renderAdminHeroImages() {
  const grid = document.getElementById('heroImgGrid');
  if (!grid) return;
  grid.innerHTML = Array.from({ length: 10 }, (_, i) => {
    const img = (data.heroImages || [])[i];
    return `
      <div class="hero-img-item">
        ${img
          ? `<img src="${img}" onerror="this.style.display='none'"><button class="hero-img-remove" onclick="removeHeroImg(${i})">×</button>`
          : '<div class="img-placeholder">📷<span style="font-size:0.6rem">Empty</span></div>'}
        <div class="img-num">${i + 1}</div>
      </div>`;
  }).join('');
}

function removeHeroImg(i) {
  if (!Array.isArray(data.heroImages)) return;
  data.heroImages.splice(i, 1);
  // Reset slide index to avoid out-of-bounds
  if (data.currentSlide >= data.heroImages.length) data.currentSlide = 0;
  renderAdminHeroImages();
  renderHeroSlider();
  notify('Image removed');
}

function handleHeroUpload(e) {
  // Stop the event dead — prevents it bubbling to the upload-area div's onclick
  // which would call heroUpload.click() again and re-open the file picker
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const MAX_SLOTS = 10;
  const files     = Array.from(e.target.files || []);
  e.target.value  = '';   // reset BEFORE any async work — prevents re-fire on same file

  if (!files.length) return;

  if (!Array.isArray(data.heroImages)) data.heroImages = [];
  const slotsAvailable = MAX_SLOTS - data.heroImages.length;
  if (slotsAvailable <= 0) { notify('Maximum 10 hero images reached.', 'red'); return; }

  const toProcess = files.slice(0, slotsAvailable);
  notify('Uploading ' + toProcess.length + ' image(s)…');

  Promise.all(toProcess.map(file => uploadImageFile(file)))
    .then(urls => {
      const valid = urls.filter(Boolean);
      valid.forEach(url => { if (data.heroImages.length < MAX_SLOTS) data.heroImages.push(url); });
      if (valid.length) {
        renderAdminHeroImages();
        renderHeroSlider();
        saveData().then(ok => { if (ok) notify(valid.length + ' hero image(s) uploaded!', 'green'); });
      }
    })
    .catch(err => {
      console.error('handleHeroUpload error:', err);
      notify('Upload error — see console.', 'red');
    });
}

async function saveHeroImages() {
  renderHeroSlider();
  const ok = await saveData();
  if (ok) notify('Hero images saved!', 'green');
}

// ── Projects ──
function renderAdminProjects() {
  const tbody = document.getElementById('allProjectsTable');
  if (!tbody) return;
  tbody.innerHTML = (data.projects || []).map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${p.year}</td>
      <td><span class="badge badge-${p.status}">${p.status}</span></td>
      <td>${p.award ? '<span class="badge badge-featured">★ Award</span>' : '-'}</td>
      <td>${p.featured ? '<span class="badge badge-featured">Yes</span>' : '-'}</td>
      <td>
        <button class="action-btn action-view" onclick="openProject(${p.id});closeAdmin()">View</button>
        <button class="action-btn action-edit" onclick="editProject(${p.id})">Edit</button>
        <button class="action-btn action-del"  onclick="deleteProject(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editProject(id) {
  const p = (data.projects || []).find(x => x.id === id);
  if (!p) return;
  adminNav('addProject', adminNavItem('addProject'));
  document.getElementById('editProjectId').value  = id;
  document.getElementById('pName').value          = p.name || '';
  document.getElementById('pYear').value          = p.year || '';
  document.getElementById('pStatus').value        = p.status || 'current';
  document.getElementById('pCategory').value      = p.category || '';
  document.getElementById('pDesc').value          = p.desc || '';
  document.getElementById('pOutcome').value       = p.outcome || '';
  document.getElementById('pImg').value           = p.img || '';
  document.getElementById('pFeatured').checked    = !!p.featured;
  document.getElementById('pAward').checked       = !!p.award;
  document.getElementById('timelineEntries').innerHTML = '';
  (p.timeline || []).forEach(t => addTimelineEntry(t));
  const imgs = Array.isArray(p.images) && p.images.length ? p.images : [p.img || ''];
  populateImgBuilder(imgs);
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  data.projects = (data.projects || []).filter(p => p.id !== id);
  renderAdminProjects();
  renderAdminDashboard();
  renderProjects();
  renderFeatured();
  saveData().then(ok => { if (ok) notify('Project deleted', 'red'); });
}

// ── Image Builder (unlimited images) ──
function addImgRow(url = '') {
  const builder = document.getElementById('imgBuilder');
  if (!builder) return;
  const angleLabels = ['Front view','Side view','Rear view','Detail view','Interior view'];
  const idx         = Date.now() + '_' + Math.random();
  const angleNum    = builder.querySelectorAll('.img-builder-row').length;
  const div         = document.createElement('div');
  div.className     = 'img-builder-row';
  div.dataset.idx   = idx;
  div.innerHTML = `
    <img class="img-thumb" id="thumb_${idx}" alt="preview">
    <input type="text"
      placeholder="${angleLabels[angleNum] || 'Image URL'} — paste URL or upload"
      value="${url.replace(/"/g, '&quot;')}"
      oninput="previewImgRow(this,'${idx}')"
      style="flex:1">
    <label style="flex-shrink:0;cursor:pointer;font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;
      padding:0.28rem 0.6rem;border:1px solid rgba(184,149,90,0.4);color:var(--gold);
      font-family:'Montserrat',sans-serif;border-radius:2px" title="Upload image">
      📁
      <input type="file" accept="image/*" style="display:none" onchange="handleImgFile(event,'${idx}')">
    </label>
    <button type="button" class="btn-remove-img" onclick="removeImgRow(this,'${idx}')">✕</button>
  `;
  builder.appendChild(div);
  if (url) previewImgRow(div.querySelector('input[type=text]'), idx);
}

function previewImgRow(input, idx) {
  const thumb = document.getElementById('thumb_' + idx);
  if (!thumb) return;
  const url = input.value.trim();
  if (url) {
    thumb.src = url;
    thumb.classList.add('visible');
    thumb.onerror = () => thumb.classList.remove('visible');
  } else {
    thumb.classList.remove('visible');
  }
  const imgErr = document.getElementById('imgError');
  if (imgErr) imgErr.classList.remove('show');
}

async function handleImgFile(event, idx) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();

  const file = event.target.files[0];
  event.target.value = '';   // reset before async work

  if (!file) return;
  notify('Uploading image…');
  const url = await uploadImageFile(file);
  if (!url) return;
  const row = document.querySelector(`.img-builder-row[data-idx="${idx}"]`);
  if (!row) return;
  const input = row.querySelector('input[type=text]');
  if (!input) return;
  input.value = url;
  previewImgRow(input, idx);
  notify('Image uploaded!', 'green');
}

function removeImgRow(btn, idx) {
  const builder = document.getElementById('imgBuilder');
  if (!builder) return;
  const row  = document.querySelector(`.img-builder-row[data-idx="${idx}"]`);
  const rows = builder.querySelectorAll('.img-builder-row');
  if (rows.length <= 1) { notify('You need at least 1 image field', 'red'); return; }
  if (row) row.remove();
}

function getImgUrls() {
  return Array.from(document.querySelectorAll('#imgBuilder .img-builder-row'))
    .map(r => (r.querySelector('input[type=text]') || {}).value || '')
    .map(v => v.trim())
    .filter(Boolean);
}

function populateImgBuilder(images) {
  const builder = document.getElementById('imgBuilder');
  if (!builder) return;
  builder.innerHTML = '';
  const imgs = Array.isArray(images) && images.length ? images : [''];
  imgs.forEach(url => addImgRow(url));
}

function saveProject() {
  const name    = (document.getElementById('pName').value || '').trim();
  const year    = (document.getElementById('pYear').value || '').trim();
  const imgErr  = document.getElementById('imgError');

  if (!name || !year) { alert('Name and year are required.'); return; }

  const rawUrls = getImgUrls();
  if (!rawUrls.length) {
    if (imgErr) { imgErr.textContent = 'Please add at least 1 image.'; imgErr.classList.add('show'); }
    const builder = document.getElementById('imgBuilder');
    if (builder) builder.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }
  if (imgErr) imgErr.classList.remove('show');

  const editId   = document.getElementById('editProjectId').value;
  const timeline = Array.from(document.querySelectorAll('#timelineEntries .timeline-entry')).map(row => {
    const inputs = row.querySelectorAll('input');
    const desc   = row.querySelector('textarea');
    return { date: inputs[0] ? inputs[0].value : '', title: inputs[1] ? inputs[1].value.trim() : '', desc: desc ? desc.value.trim() : '' };
  }).filter(t => t.title);

  const proj = {
    id:       editId ? parseInt(editId) : Date.now(),
    name, year,
    status:   document.getElementById('pStatus').value,
    category: document.getElementById('pCategory').value,
    desc:     document.getElementById('pDesc').value,
    outcome:  document.getElementById('pOutcome').value,
    img:      rawUrls[0],
    images:   rawUrls,
    featured: document.getElementById('pFeatured').checked,
    award:    document.getElementById('pAward').checked,
    timeline,
  };

  if (editId) {
    const idx = (data.projects || []).findIndex(p => p.id === parseInt(editId));
    if (idx > -1) data.projects[idx] = proj;
    else data.projects.push(proj);
  } else {
    if (!Array.isArray(data.projects)) data.projects = [];
    data.projects.push(proj);
  }

  clearProjectForm();
  renderProjects();
  renderFeatured();
  renderAdminProjects();
  renderAdminFeatured();
  renderAdminDashboard();
  saveData().then(ok => { if (ok) notify('Project saved!', 'green'); });
}

function clearProjectForm() {
  ['editProjectId','pName','pYear','pCategory','pDesc','pOutcome','pImg'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const pStatus = document.getElementById('pStatus');
  if (pStatus) pStatus.value = 'current';
  const pFeatured = document.getElementById('pFeatured');
  if (pFeatured) pFeatured.checked = false;
  const pAward = document.getElementById('pAward');
  if (pAward) pAward.checked = false;
  const te = document.getElementById('timelineEntries');
  if (te) te.innerHTML = '';
  populateImgBuilder([]);
  const imgErr = document.getElementById('imgError');
  if (imgErr) imgErr.classList.remove('show');
}

function addTimelineEntry(data_ = { date:'', title:'', desc:'' }) {
  const div       = document.createElement('div');
  div.className   = 'timeline-entry';
  div.innerHTML   = `
    <input type="date" title="Update date" value="${toDateInputValue(data_.date) || ''}">
    <input type="text" placeholder="Update title" value="${(data_.title || '').replace(/"/g,'&quot;')}">
    <textarea placeholder="Update description">${data_.desc || ''}</textarea>
    <button class="remove-entry" onclick="this.parentElement.remove()">X</button>
  `;
  const te = document.getElementById('timelineEntries');
  if (te) te.appendChild(div);
}

// ── Featured ──
function renderAdminFeatured() {
  const tbody = document.getElementById('featuredTable');
  if (!tbody) return;
  tbody.innerHTML = (data.projects || []).map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge badge-${p.status}">${p.status}</span></td>
      <td>${p.featured ? '<span class="badge badge-featured">✓ Featured</span>' : '<span style="color:var(--muted);font-size:0.78rem">—</span>'}</td>
      <td>${p.award ? '<span class="badge badge-featured">★</span>' : '-'}</td>
      <td>
        <button class="action-btn ${p.featured ? 'action-del' : 'action-feature'}" onclick="toggleFeatured(${p.id})">${p.featured ? 'Remove' : 'Add to Featured'}</button>
        <button class="action-btn action-edit" onclick="toggleAward(${p.id})">${p.award ? 'Remove Award' : 'Set Award'}</button>
      </td>
    </tr>
  `).join('');
}

function toggleFeatured(id) {
  const p = (data.projects || []).find(x => x.id === id);
  if (!p) return;
  p.featured = !p.featured;
  renderAdminFeatured(); renderFeatured(); renderAdminDashboard();
  saveData().then(ok => { if (ok) notify(p.featured ? 'Added to featured' : 'Removed from featured'); });
}

function toggleAward(id) {
  const p = (data.projects || []).find(x => x.id === id);
  if (!p) return;
  p.award = !p.award;
  renderAdminFeatured(); renderFeatured(); renderProjects();
  saveData().then(ok => { if (ok) notify(p.award ? 'Award set' : 'Award removed'); });
}

// ── Services Admin ──
function renderAdminServices() {
  const tbody = document.getElementById('servicesTable');
  if (!tbody) return;
  tbody.innerHTML = (data.services || []).map(s => `
    <tr>
      <td>${s.icon || ''} <strong>${s.name}</strong></td>
      <td style="color:var(--muted);font-size:0.78rem">${(s.desc || '').substring(0, 60)}${s.desc && s.desc.length > 60 ? '...' : ''}</td>
      <td>
        <button class="action-btn action-edit" onclick="editService(${s.id})">Edit</button>
        <button class="action-btn action-del"  onclick="deleteService(${s.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editService(id) {
  const s = (data.services || []).find(x => x.id === id);
  if (!s) return;
  const svcName = document.getElementById('svcName');
  document.getElementById('svcDesc').value = s.desc  || '';
  document.getElementById('svcIcon').value = s.icon  || '';
  const svcImg = document.getElementById('svcImg');
  if (svcImg) svcImg.value = s.img || '';
  if (svcName) { svcName.value = s.name || ''; svcName.dataset.editId = id; }
}

function deleteService(id) {
  if (!confirm('Delete this service?')) return;
  data.services = (data.services || []).filter(s => s.id !== id);
  renderAdminServices(); renderServicesPreview(); renderServicesPage();
  saveData().then(ok => { if (ok) notify('Service deleted', 'red'); });
}

function saveService() {
  const svcName = document.getElementById('svcName');
  const name    = (svcName ? svcName.value : '').trim();
  const desc    = (document.getElementById('svcDesc').value || '').trim();
  const icon    = (document.getElementById('svcIcon').value || '').trim() || '🔧';
  if (!name) { alert('Service name required.'); return; }

  const svcImg = document.getElementById('svcImg');
  const img    = svcImg ? svcImg.value.trim() : '';
  const editId = svcName ? svcName.dataset.editId : '';

  if (editId) {
    const idx = (data.services || []).findIndex(s => s.id === parseInt(editId));
    if (idx > -1) data.services[idx] = { ...data.services[idx], name, desc, icon, img: img || data.services[idx].img || '' };
    if (svcName) delete svcName.dataset.editId;
  } else {
    if (!Array.isArray(data.services)) data.services = [];
    data.services.push({ id: Date.now(), name, desc, icon, img });
  }

  if (svcName) svcName.value = '';
  document.getElementById('svcDesc').value = '';
  document.getElementById('svcIcon').value = '';
  if (svcImg) svcImg.value = '';

  renderAdminServices(); renderServicesPreview(); renderServicesPage();
  saveData().then(ok => { if (ok) notify('Service saved!', 'green'); });
}

// ── Messages ──
function renderAdminMessages() {
  const list = document.getElementById('messagesList');
  if (!list) return;
  const messages = data.messages || [];
  if (!messages.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:0.8rem">No messages yet.</p>';
    updateMsgBadge();
    return;
  }
  list.innerHTML = messages.map(m => `
    <div class="message-card ${m.read ? '' : 'unread'}">
      <div class="message-card-header">
        <div>
          <span class="message-sender">${m.name}</span>
          <span style="margin-left:0.8rem;font-size:0.72rem;color:var(--muted)">${m.email}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.8rem">
          <span class="message-date">${m.date}</span>
          <span class="badge ${m.read ? 'badge-read' : 'badge-unread'}">${m.read ? 'Read' : 'Unread'}</span>
          <button class="action-btn action-edit" style="padding:0.2rem 0.6rem" onclick="toggleMessageRead(${m.id})">${m.read ? 'Mark Unread' : 'Mark Read'}</button>
          <button class="action-btn action-view" style="padding:0.2rem 0.6rem" onclick="toggleMessageDetail(${m.id})">View</button>
          <button class="action-btn action-del"  style="padding:0.2rem 0.6rem" onclick="event.stopPropagation();deleteMessage(${m.id})">Delete</button>
        </div>
      </div>
      <div class="message-preview">${m.message.substring(0, 100)}${m.message.length > 100 ? '...' : ''}</div>
      <div class="message-detail" id="msg-${m.id}">
        <div style="display:flex;gap:2rem;font-size:0.78rem;color:var(--muted)">
          <span>📞 ${m.phone}</span>
          <span>✉️ ${m.email}</span>
        </div>
        <div class="message-full">${m.message}</div>
      </div>
    </div>
  `).join('');
  updateMsgBadge();
}

function toggleMessageDetail(id) {
  const detail = document.getElementById('msg-' + id);
  if (detail) detail.classList.toggle('open');
}

function toggleMessageRead(id) {
  const m = (data.messages || []).find(x => x.id === id);
  if (!m) return;
  m.read = !m.read;
  renderAdminMessages(); renderAdminDashboard(); updateMsgBadge();
  saveData();
}

function deleteMessage(id) {
  data.messages = (data.messages || []).filter(m => m.id !== id);
  renderAdminMessages(); renderAdminDashboard(); updateMsgBadge();
  saveData().then(ok => { if (ok) notify('Message deleted', 'red'); });
}

function clearAllMessages() {
  if (!confirm('Clear all messages?')) return;
  data.messages = [];
  renderAdminMessages(); renderAdminDashboard(); updateMsgBadge();
  saveData().then(ok => { if (ok) notify('All messages cleared', 'red'); });
}

// ── Metrics ──
function renderAdminMetrics() {
  const m = data.metrics || {};
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set('met1', m.m1 || ''); set('met2', m.m2 || ''); set('met3', m.m3 || ''); set('met4', m.m4 || '');
}

function saveMetrics() {
  if (!data.metrics) data.metrics = {};
  data.metrics.m1 = document.getElementById('met1').value;
  data.metrics.m2 = document.getElementById('met2').value;
  data.metrics.m3 = document.getElementById('met3').value;
  data.metrics.m4 = document.getElementById('met4').value;
  renderMetrics();
  saveData().then(ok => { if (ok) notify('Metrics updated!', 'green'); });
}

// ===========================
// SCROLL INDICATOR
// ===========================
window.addEventListener('scroll', function () {
  const indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;
  indicator.classList.toggle('hide', window.scrollY > 50);
}, { passive: true });

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  // Wire the hero upload file input via addEventListener.
  // This is the ONLY place this handler is attached — no inline onchange in HTML.
  // Using addEventListener (not onclick/onchange attribute) means:
  // 1. The handler runs in the correct scope
  // 2. It cannot be re-attached accidentally by innerHTML rewrites
  // 3. stopImmediatePropagation() works correctly
  const heroUpload = document.getElementById('heroUpload');
  if (heroUpload) {
    heroUpload.addEventListener('change', handleHeroUpload, { capture: false });
  }

  initApp();
});