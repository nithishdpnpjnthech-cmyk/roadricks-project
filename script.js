// ===========================
// DATA STORE
// ===========================
let data = {
  heroImages: [
    'https://images.unsplash.com/photo-1583121274603-d7eba2e77a10?w=1600&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1600&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80',
  ],
  projects: [
    {id:1,name:'1967 Porsche 911',year:'2023',status:'finished',category:'Classic German',desc:'A stunning restoration of an iconic air-cooled flat-six legend.',outcome:'Returned to full concours condition with factory-correct Slate Grey paint and period-correct interior. Awarded Best in Class at the 2023 National Classic Car Show.',img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',featured:true,award:true,timeline:[{date:'Jan 2023',title:'Initial Assessment',desc:'Full strip-down and condition report completed.'},{date:'Feb 2023',title:'Bodywork & Chassis',desc:'Rust removal, panel beating, and chassis reinforcement.'},{date:'Apr 2023',title:'Engine Rebuild',desc:'Complete rebuild of the 2.0L flat-six engine.'},{date:'Jun 2023',title:'Paint & Trim',desc:'Factory-correct Slate Grey respray and leather interior.'},{date:'Aug 2023',title:'Final Assembly',desc:'Reassembly, testing and final detailing.'}]},
    {id:2,name:'1955 Mercedes 300SL',year:'2023',status:'finished',category:'Classic German',desc:'The iconic gullwing doors brought back to their original glory.',outcome:'Immaculate restoration with matching-numbers engine rebuild and period Ivory paint. Now a museum piece.',img:'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',featured:true,award:false,timeline:[{date:'Mar 2023',title:'Disassembly',desc:'Full teardown, all parts catalogued.'},{date:'May 2023',title:'Gullwing Door Restoration',desc:'Door alignment corrected, hinges rebuilt.'},{date:'Sep 2023',title:'Completion',desc:'Final inspection and client handover.'}]},
    {id:3,name:'1969 Ford Mustang Boss 429',year:'2024',status:'current',category:'American Muscle',desc:'One of the rarest Mustangs ever built, currently under full restoration.',outcome:'',img:'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80',featured:false,award:false,timeline:[{date:'Jan 2024',title:'Strip Down',desc:'Full disassembly and parts inventory in progress.'}]},
    {id:4,name:'1963 Ferrari 250 GTE',year:'2022',status:'finished',category:'Italian Sports',desc:'A matching-numbers GTE returned to show condition.',outcome:'Ground-up restoration completed in 18 months. Now valued at over $2M.',img:'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',featured:true,award:true,timeline:[{date:'Jan 2021',title:'Acquisition',desc:'Vehicle acquired and initial assessment complete.'},{date:'Jun 2022',title:'Completion',desc:'Full concours restoration delivered to client.'}]},
    {id:5,name:'1957 Chevrolet Bel Air',year:'2024',status:'current',category:'American Classic',desc:'The quintessential American classic receiving a frame-off restoration.',outcome:'',img:'https://images.unsplash.com/photo-1566024349612-2e56a9e73e96?w=800&q=80',featured:false,award:false,timeline:[{date:'Feb 2024',title:'Frame Off',desc:'Body removed from chassis. Chassis sandblasted.'}]},
    {id:6,name:'1971 Jaguar E-Type Series 3',year:'2023',status:'finished',category:'British Classic',desc:'The last of the E-Types, beautifully restored in British Racing Green.',outcome:'Completed to original Jaguar specification with a rebuilt V12 engine.',img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',featured:false,award:false,timeline:[{date:'Apr 2022',title:'Start',desc:'Project commenced.'},{date:'Mar 2023',title:'Finish',desc:'Delivered to client in perfect condition.'}]},
  ],
  services: [
    {id:1,name:'Engine Restoration',desc:'Complete engine rebuilds and performance tuning. We restore engines to original specifications or enhance them with period-appropriate modifications. Our master mechanics specialize in vintage powerplants from pre-war to post-war era vehicles.',icon:'🔧',img:'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',images:["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80","https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=800&q=80","https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80"]},
    {id:2,name:'Body & Chassis Work',desc:'Frame-off restorations and structural rebuilds. Expert panel work, fabrication and rust remediation by our skilled coachbuilders restoring every panel to factory specification.',icon:'⚙️',img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',images:["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80","https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80","https://images.unsplash.com/photo-1617814076229-3d5fa6a6bf25?w=800&q=80"]},
    {id:3,name:'Paint & Finishing',desc:'Period-correct paint matching and application. Factory-correct resprays and custom finishes applied in our climate-controlled spray booth to achieve a flawless, show-quality result.',icon:'🎨',img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80',images:["https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&q=80","https://images.unsplash.com/photo-1547247139-7c47e2b13a2e?w=800&q=80","https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80"]},
    {id:4,name:'Interior Trimming',desc:'Bespoke interior restoration using the finest materials. Hand-stitched leather, Connolly hide and period-correct materials to revive every cabin to concours standard.',icon:'🛋️',img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80',images:["https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80","https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80"]},
    {id:5,name:'Servicing & Recommissioning',desc:'Full mechanical service and recommissioning of classic vehicles. We bring dormant vehicles back to life with full fluid changes, brake overhauls, and safety inspections.',icon:'🔩',img:'https://images.unsplash.com/photo-1635773054018-2b0c29be3b6d?w=600&q=80',images:["https://images.unsplash.com/photo-1566024349612-2e56a9e73e96?w=800&q=80","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80","https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80"]},
    {id:6,name:'Precision Engineering',desc:'In-house precision engineering solutions for mechanical components large and small. Our fully equipped machine shop handles every stage of manufacture and rebuild.',icon:'🏗️',img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',images:["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80","https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80","https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80"]},
  ],
  messages: [
    {id:1,name:'James Patterson',email:'james@email.com',phone:'555-0101',message:"I have a 1965 Aston Martin DB5 that needs a full restoration. Can we arrange a viewing?",date:'2024-03-15',read:false},
    {id:2,name:'Sarah Mitchell',email:'sarah@email.com',phone:'555-0182',message:"Looking for a quote on engine rebuilding for my 1958 Bentley S1. The car runs but has low oil pressure.",date:'2024-03-14',read:false},
    {id:3,name:'Robert Chen',email:'robert@email.com',phone:'555-0234',message:"I'd like to discuss the interior retrimming of my 1970 Ferrari Dino. Budget is flexible for the right shop.",date:'2024-03-10',read:true},
  ],
  users: [
    {id:1,username:'admin',password:'admin123',role:'Administrator',active:true}
  ],
  metrics:{m1:'500+',m2:'34',m3:'18',m4:'98%'},
  currentTab:'current',
  currentSlide:0,
  slideInterval:null,
};
let pageHistory = [];

function currentPageKey() {
  const active = document.querySelector('.page.active');
  return active ? active.id.replace('page-','') : 'home';
}

function toggleMobileNav() {
  const isOpen = document.body.classList.toggle('mobile-nav-open');
  const toggle = document.querySelector('.nav-toggle');
  if(toggle) toggle.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileNav() {
  document.body.classList.remove('mobile-nav-open');
  const toggle = document.querySelector('.nav-toggle');
  if(toggle) toggle.setAttribute('aria-expanded', 'false');
}

// ===========================
// PAGE NAVIGATION
// ===========================
function showPage(page, fromBack=false) {
  const allowedPages = ['home','restore','services','about','contact','projectDetail'];
  const targetPage = allowedPages.includes(page) ? page : 'home';
  const previousPage = currentPageKey();
  if(!fromBack && previousPage !== targetPage) {
    pageHistory.push(previousPage);
    if(pageHistory.length > 12) pageHistory.shift();
  }
  closeMobileNav();
  // Hide ALL pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Clear all nav highlights
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  // Show target page — always fall back to home if element not found
  const el = document.getElementById('page-' + targetPage) || document.getElementById('page-home');
  if(!el) return; // guard: should never happen but prevents crash
  el.classList.add('active');
  // projectDetail maps to restore nav highlight
  const navKey = targetPage === 'projectDetail' ? 'restore' : targetPage;
  const navEl = document.getElementById('nav-' + navKey);
  if(navEl) navEl.classList.add('active');
  document.body.classList.toggle('contact-page-active', targetPage === 'contact');
  // Reset scroll — show scroll indicator if going to home
  window.scrollTo(0, 0);
  const scrollIndicator = document.getElementById('scrollIndicator');
  if(scrollIndicator) scrollIndicator.classList.remove('hide');
  // Render page content
  if(targetPage === 'home') renderHome();
  if(targetPage === 'restore') renderProjects();
  if(targetPage === 'services') renderServicesPage();
}

function goBackPage() {
  const fallback = 'home';
  let previous = pageHistory.pop();
  while(previous && previous === currentPageKey()) previous = pageHistory.pop();
  showPage(previous || fallback, true);
}

// ===========================
// HERO SLIDER
// ===========================
function renderHeroSlider() {
  const slider = document.getElementById('heroSlider');
  const dots = document.getElementById('heroDots');
  if(!slider || !dots) return;
  slider.innerHTML=''; dots.innerHTML='';
  if(!data.heroImages.length) {
    slider.innerHTML='<div class="hero-slide active" style="background:linear-gradient(135deg,#161616,#252525)"></div>';
    clearInterval(data.slideInterval);
    return;
  }
  data.heroImages.forEach((img,i)=>{
    const slide = document.createElement('div');
    slide.className='hero-slide'+(i===0?' active':'');
    slide.style.backgroundImage=`url('${img}')`;
    slider.appendChild(slide);
    const dot = document.createElement('button');
    dot.className='hero-dot'+(i===0?' active':'');
    dot.onclick=()=>goToSlide(i);
    dots.appendChild(dot);
  });
  clearInterval(data.slideInterval);
  data.slideInterval = setInterval(()=>goToSlide((data.currentSlide+1)%data.heroImages.length),5000);
}

function goToSlide(idx) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  slides.forEach((s,i)=>s.classList.toggle('active',i===idx));
  dots.forEach((d,i)=>d.classList.toggle('active',i===idx));
  data.currentSlide=idx;
}

// ===========================
// HOME RENDER
// ===========================
function renderHome() {
  renderHeroSlider();
  renderServicesPreview();
  renderFeatured();
  renderMetrics();
}

function renderServicesPreview() {
  const grid = document.getElementById('servicesPreviewGrid');
  if(!grid) return;
  grid.innerHTML = data.services.slice(0,4).map(s=>`
    <div class="service-card" onclick="showPage('services')">
      <span class="service-icon">${s.icon}</span>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if(!grid) return;
  const featured = data.projects.filter(p=>p.featured).slice(0,3);
  if(!featured.length){grid.innerHTML='<p style="color:var(--muted);font-size:0.8rem">No featured projects set.</p>';return;}
  const [main,...sides] = featured;
  grid.innerHTML=`
    <div class="featured-main" onclick="openProject(${main.id})">
      <img class="featured-img" src="${main.images && main.images.length ? main.images[0] : main.img}" alt="${main.name}" onerror="this.style.background='var(--dark3)'">
      <div class="featured-overlay">
        <div class="featured-info"><h3>${main.name}</h3><span>${main.category||main.status}</span></div>
      </div>
      ${main.award?'<div class="award-badge">★ Award Winner</div>':''}
    </div>
    <div class="featured-side">
      ${sides.map(p=>`
        <div class="featured-side-item" onclick="openProject(${p.id})">
          <img class="featured-img" src="${p.images && p.images.length ? p.images[0] : p.img}" alt="${p.name}" onerror="this.style.background='var(--dark3)'">
          <div class="featured-overlay">
            <div class="featured-info"><h3 style="font-size:1rem">${p.name}</h3><span>${p.category||p.status}</span></div>
          </div>
          ${p.award?'<div class="award-badge">★ Award</div>':''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderMetrics() {
  document.getElementById('m1').textContent=data.metrics.m1;
  document.getElementById('m2').textContent=data.metrics.m2;
  document.getElementById('m3').textContent=data.metrics.m3;
  document.getElementById('m4').textContent=data.metrics.m4;
}

// ===========================
// PROJECTS
// ===========================
function switchTab(tab,btn) {
  data.currentTab=tab;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProjects();
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if(!grid) return;
  const projects = data.projects.filter(p=>p.status===data.currentTab);
  grid.innerHTML = projects.length ? projects.map(p=>`
    <div class="project-card" onclick="openProject(${p.id})">
      <img class="project-card-img" src="${p.images && p.images.length ? p.images[0] : p.img}" alt="${p.name}" onerror="this.style.background='var(--dark3)'">
      <div class="project-card-overlay">
        <div class="project-card-info">
          <h4>${p.name}</h4>
          <span>${p.status==='finished'?'Completed':'In Progress'}${p.category?' / '+p.category:''}</span>
        </div>
      </div>
      ${p.status==='finished'?'<div class="after-tag">AFTER</div>':''}
      ${p.award?'<div class="award-badge" style="top:auto;bottom:1rem;right:1rem">★ Award</div>':''}
    </div>
  `).join('') : '<p style="color:var(--muted);font-size:0.8rem;padding:2rem">No projects in this category yet.</p>';
}

function openProject(id) {
  const p = data.projects.find(x=>x.id===id);
  if(!p) return;
  const timeline = sortedTimeline(p.timeline || []);
  const latest = timeline[0];
  document.getElementById('detailCategory').textContent=p.status==='finished'?'Completed Project':'Live Project';
  document.getElementById('detailTitle').textContent=p.name;
  document.getElementById('detailYear').textContent=p.status==='finished'?`Completed: ${p.year}`:`In Progress - ${p.year}`;
  document.getElementById('detailStatus').textContent=p.status==='finished'?'Completed':'In Progress';
  document.getElementById('detailLastUpdated').textContent=`Last Updated: ${latest ? formatDate(latest.date) : 'Not available'}`;
  const heroImg = (p.images && p.images.length) ? p.images[0] : p.img;
  document.getElementById('detailHero').style.backgroundImage=`url('${heroImg}')`;
  document.getElementById('detailOutcome').textContent=p.outcome||'This project is currently in progress.';
  document.getElementById('detailTimeline').innerHTML=timeline.length ? timeline.map((t,i)=>`
    <div class="timeline-item ${i===0?'latest':''}">
      <div class="timeline-dot"></div>
      <span class="timeline-date">${formatDate(t.date)}</span>
      <h4>${t.title}</h4>
      <p>${t.desc}</p>
    </div>
  `).join('') : '<p style="color:#5f5a52;font-size:0.84rem;line-height:1.8">No timeline updates have been added yet.</p>';
  const mainImg = (p.images && p.images.length > 0) ? p.images[0] : p.img;
  document.getElementById('detailImages').innerHTML = `
    <div class="detail-img-wrap">
      <img class="detail-img" src="${mainImg}" alt="${p.name}" onerror="this.style.background='#ccc'">
    </div>
  `;
  showPage('projectDetail');
}

function sortedTimeline(timeline) {
  return [...timeline].sort((a,b)=>new Date(b.date || 0) - new Date(a.date || 0));
}

function formatDate(value) {
  if(!value) return 'Date pending';
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
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
  'https://images.unsplash.com/photo-1599912027611-484b9fc447af?w=600&q=80',
  'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
];

function renderServicesPage() {
  const grid = document.getElementById('servicesFullGrid');
  if(!grid) return;
  grid.innerHTML = data.services.map((s,i)=>`
    <div class="service-full-card" onclick="highlightService(${i})">
      <img class="service-full-img" src="${s.img || serviceImages[i % serviceImages.length]}" alt="${s.name}" onerror="this.style.background='#ccc'">
      <div class="service-full-body">
        <div class="service-full-title">${s.name}</div>
        <div class="service-full-desc">${s.desc ? s.desc.split('.')[0] + '.' : ''}</div>
        <button class="service-full-link">LEARN MORE &nbsp;&#8594;</button>
      </div>
    </div>
  `).join('');
}

function highlightService(idx) {
  const s = data.services[idx];
  if(!s) return;
  const detail = document.getElementById('serviceDetailSection');
  const img = s.img || serviceImages[idx % serviceImages.length];
  detail.querySelector('h2').textContent = s.name;
  const ps = detail.querySelectorAll('p');
  if(ps[0]) ps[0].textContent = s.desc;
  const detailImg = detail.querySelector('.service-detail-img');
  if(detailImg) { detailImg.src = img; detailImg.alt = s.name; }
  detail.scrollIntoView({behavior:'smooth', block:'start'});
}

// ===========================
// CONTACT FORM
// ===========================
function submitContact() {
  const name=document.getElementById('contactName').value.trim();
  const phone=document.getElementById('contactPhone').value.trim();
  const email=document.getElementById('contactEmail').value.trim();
  const message=document.getElementById('contactMessage').value.trim();
  if(!name||!phone||!email||!message){alert('Please fill in all required fields.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Please enter a valid email address.');return;}
  data.messages.unshift({
    id:Date.now(),name,email,phone,message,
    date:new Date().toISOString().split('T')[0],read:false
  });
  document.getElementById('contactName').value='';
  document.getElementById('contactPhone').value='';
  document.getElementById('contactEmail').value='';
  document.getElementById('contactMessage').value='';
  const msg=document.getElementById('submitMsg');
  msg.style.display='block';
  setTimeout(()=>msg.style.display='none',4000);
  updateMsgBadge();
  saveData();
}

// ===========================
// ADMIN LOGIN
// ===========================
function openAdminLogin(){
  const modal=document.getElementById('adminLogin');
  const err=document.getElementById('loginError');
  modal.classList.add('open');
  err.style.display='none';
  document.getElementById('loginUser').focus();
}
function closeAdminLogin(){
  document.getElementById('adminLogin').classList.remove('open');
  document.getElementById('loginError').style.display='none';
  document.getElementById('loginPass').value='';
}
function doLogin(){
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  const err=document.getElementById('loginError');
  // Support both plain (legacy) and btoa-encoded passwords
  const encoded=btoa(p);
  const user=data.users.find(x=>x.active!==false && x.username===u &&
    (x.password===encoded || x.password===p));
  if(user){
    err.style.display='none';
    localStorage.setItem('isAdminLoggedIn','true');
    localStorage.setItem('adminUsername', u);
    closeAdminLogin();
    openAdmin();
  } else {
    err.style.display='block';
  }
}

// ===========================
// ADMIN PANEL
// ===========================
function openAdmin(){
  document.getElementById('adminPanel').classList.add('open');
  adminNav('dashboard',document.querySelector('.admin-nav-item'));
  renderAdminDashboard();
  updateMsgBadge();
}
function closeAdmin(){document.getElementById('adminPanel').classList.remove('open')}
function logoutAdmin(){
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('adminUsername');
  closeAdmin();
  notify('Logged out successfully');
}

function adminNavItem(section){
  return Array.from(document.querySelectorAll('.admin-nav-item')).find(item=>item.getAttribute('onclick')?.includes(`'${section}'`));
}

function adminNav(section,el){
  document.querySelectorAll('.admin-nav-item').forEach(i=>i.classList.remove('active'));
  if(el) el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('sec-'+section).classList.add('active');
  const titles={dashboard:'Dashboard',users:'Users',heroImages:'Hero Images',projects:'All Projects',addProject:'Add / Edit Project',featured:'Featured Projects',services:'Services',messages:'Messages',metrics:'Site Metrics'};
  document.getElementById('adminTopTitle').textContent=titles[section]||section;
  if(section==='dashboard') renderAdminDashboard();
  if(section==='users') renderAdminUsers();
  if(section==='heroImages') renderAdminHeroImages();
  if(section==='projects') renderAdminProjects();
  if(section==='featured') renderAdminFeatured();
  if(section==='services') renderAdminServices();
  if(section==='messages') renderAdminMessages();
  if(section==='metrics') renderAdminMetrics();
  if(section==='addProject'){
    clearProjectForm();
    // ensure builder has 3 rows ready
    setTimeout(()=>{ if(!document.querySelectorAll('#imgBuilder .img-builder-row').length) populateImgBuilder([]); },50);
  }
}

function notify(msg,type='gold'){
  const n=document.getElementById('adminNotif');
  n.textContent=msg;
  n.style.borderLeftColor=type==='red'?'var(--red)':type==='green'?'var(--green)':'var(--gold)';
  n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'),3000);
}

function updateMsgBadge(){
  const unread=data.messages.filter(m=>!m.read).length;
  const badge=document.getElementById('msgBadge');
  if(badge) badge.textContent=unread>0?unread:'';
}

function renderAdminDashboard(){
  document.getElementById('dash-projects').textContent=data.projects.length;
  document.getElementById('dash-current').textContent=data.projects.filter(p=>p.status==='current').length;
  document.getElementById('dash-messages').textContent=data.messages.length;
  document.getElementById('dash-unread').textContent=data.messages.filter(m=>!m.read).length;
  const tbody=document.getElementById('dashProjectsTable');
  tbody.innerHTML=data.projects.slice(0,6).map(p=>`
    <tr>
      <td>${p.name}</td>
      <td>${p.year}</td>
      <td><span class="badge badge-${p.status}">${p.status}</span></td>
      <td>${p.featured?'<span class="badge badge-featured">Featured</span>':'-'}</td>
      <td>
        <button class="action-btn action-edit" onclick="editProject(${p.id})">Edit</button>
        <button class="action-btn action-del" onclick="deleteProject(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderAdminUsers(){
  const tbody=document.getElementById('usersTable');
  if(!tbody) return;
  const currentUser=localStorage.getItem('adminUsername')||'admin';
  tbody.innerHTML=data.users.map(u=>`
    <tr>
      <td><strong>${u.username}</strong>${u.username===currentUser?' <span style="font-size:0.65rem;color:var(--gold)">(you)</span>':''}</td>
      <td>${u.role||'User'}</td>
      <td><span class="badge badge-read">Active</span></td>
      <td>${u.username===currentUser
        ? '<span style="font-size:0.7rem;color:var(--muted)">—</span>'
        : `<button class="user-action-del" onclick="deleteUser('${u.username}')">Delete</button>`
      }</td>
    </tr>
  `).join('');
}

function addUser(){
  const uEl=document.getElementById('newUsername');
  const pEl=document.getElementById('newPassword');
  const rEl=document.getElementById('newRole');
  const errEl=document.getElementById('userFormError');
  const u=uEl.value.trim();
  const p=pEl.value;
  const r=rEl.value;
  errEl.classList.remove('show');
  if(!u||!p){errEl.textContent='Username and password are required.';errEl.classList.add('show');return;}
  if(p.length<4){errEl.textContent='Password must be at least 4 characters.';errEl.classList.add('show');return;}
  if(data.users.find(x=>x.username.toLowerCase()===u.toLowerCase())){
    errEl.textContent='Username already exists. Choose a different one.';errEl.classList.add('show');return;
  }
  data.users.push({id:Date.now(),username:u,password:btoa(p),role:r,active:true});
  uEl.value=''; pEl.value='';
  renderAdminUsers();
  saveData();
  notify('User "'+u+'" added successfully','green');
}

function deleteUser(username){
  const currentUser=localStorage.getItem('adminUsername')||'admin';
  if(username===currentUser){notify('Cannot delete your own account','red');return;}
  if(!confirm('Delete user "'+username+'"?')) return;
  data.users=data.users.filter(u=>u.username!==username);
  renderAdminUsers();
  saveData();
  notify('User deleted');
}

// Hero Images Admin
function renderAdminHeroImages(){
  const grid=document.getElementById('heroImgGrid');
  grid.innerHTML=Array.from({length:10},(_,i)=>{
    const img=data.heroImages[i];
    return `<div class="hero-img-item">
      ${img?`<img src="${img}" onerror="this.style.display='none'"><button class="hero-img-remove" onclick="removeHeroImg(${i})">×</button>`:'<div class="img-placeholder">📷<span style="font-size:0.6rem">Empty</span></div>'}
      <div class="img-num">${i+1}</div>
    </div>`;
  }).join('');
}

function removeHeroImg(i){
  data.heroImages.splice(i, 1);
  renderAdminHeroImages();
  renderHeroSlider();  // keep live slider in sync
  saveData();          // persist deletion immediately
  notify('Image removed');
}

function handleHeroUpload(e){
  const MAX_WIDTH = 1200;  // resize to max 1200px wide
  const QUALITY   = 0.7;   // JPEG compression quality (0-1)
  const MAX_SLOTS = 10;

  const files = Array.from(e.target.files);
  if(!files.length) return;

  const slotsAvailable = MAX_SLOTS - data.heroImages.length;
  if(slotsAvailable <= 0) {
    notify('Maximum 10 images reached.', 'red');
    e.target.value = '';
    return;
  }

  const filesToProcess = files.slice(0, slotsAvailable);
  let processed = 0;

  function compressAndStore(file) {
    const reader = new FileReader();

    reader.onload = ev => {
      const img = new Image();

      img.onload = () => {
        // Resize down only — never scale up
        let w = img.width;
        let h = img.height;
        if(w > MAX_WIDTH) {
          h = Math.round(h * MAX_WIDTH / w);
          w = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);

        // Compress to JPEG — 80-95% smaller than raw PNG base64
        const compressed = canvas.toDataURL('image/jpeg', QUALITY);

        if(data.heroImages.length < MAX_SLOTS) {
          data.heroImages.push(compressed);
        }

        processed++;
        if(processed === filesToProcess.length) {
          renderAdminHeroImages();
          renderHeroSlider();
          saveData();
          notify('Image(s) uploaded and saved!', 'green');
        }
      };

      img.onerror = () => {
        console.error('Image decode failed for:', file.name);
        processed++;
        if(processed === filesToProcess.length) {
          notify('One or more images could not be decoded.', 'red');
          renderAdminHeroImages();
        }
      };

      img.src = ev.target.result;
    };

    reader.onerror = () => {
      console.error('FileReader failed for:', file.name);
      processed++;
      if(processed === filesToProcess.length) {
        notify('One or more images could not be read.', 'red');
        renderAdminHeroImages();
      }
    };

    reader.readAsDataURL(file);
  }

  filesToProcess.forEach(compressAndStore);
  e.target.value = ''; // reset so same file can be re-selected
}

function saveHeroImages(){
  renderHeroSlider();
  saveData();
  notify('Hero images updated!','green');
}

// Projects Admin
function renderAdminProjects(){
  const tbody=document.getElementById('allProjectsTable');
  tbody.innerHTML=data.projects.map(p=>`
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${p.year}</td>
      <td><span class="badge badge-${p.status}">${p.status}</span></td>
      <td>${p.award?'<span class="badge badge-featured">★ Award</span>':'-'}</td>
      <td>${p.featured?'<span class="badge badge-featured">Yes</span>':'-'}</td>
      <td>
        <button class="action-btn action-view" onclick="openProject(${p.id});closeAdmin()">View</button>
        <button class="action-btn action-edit" onclick="editProject(${p.id})">Edit</button>
        <button class="action-btn action-del" onclick="deleteProject(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editProject(id){
  const p=data.projects.find(x=>x.id===id);
  if(!p) return;
  adminNav('addProject',adminNavItem('addProject'));
  document.getElementById('editProjectId').value=id;
  document.getElementById('pName').value=p.name;
  document.getElementById('pYear').value=p.year;
  document.getElementById('pStatus').value=p.status;
  document.getElementById('pCategory').value=p.category||'';
  document.getElementById('pDesc').value=p.desc||'';
  document.getElementById('pOutcome').value=p.outcome||'';
  document.getElementById('pImg').value=p.img||'';
  document.getElementById('pFeatured').checked=p.featured||false;
  document.getElementById('pAward').checked=p.award||false;
  document.getElementById('timelineEntries').innerHTML='';
  (p.timeline||[]).forEach(t=>addTimelineEntry(t));
  // Load images into builder
  const imgs=p.images&&p.images.length ? p.images : [p.img||''];
  populateImgBuilder(imgs);
}

function deleteProject(id){
  if(!confirm('Delete this project?')) return;
  data.projects=data.projects.filter(p=>p.id!==id);
  renderAdminProjects();
  renderAdminDashboard();
  renderProjects();
  renderFeatured();
  saveData();
  notify('Project deleted','red');
}

// ── Image Builder ──────────────────────────────────────────
function addImgRow(url=''){
  const builder=document.getElementById('imgBuilder');
  if(!builder) return;
  const rows=builder.querySelectorAll('.img-builder-row');
  const idx=Date.now()+'_'+Math.random();
  const div=document.createElement('div');
  div.className='img-builder-row';
  div.dataset.idx=idx;
  const angleLabels=['Front view','Side view','Rear view','Detail view','Interior view'];
  const angleNum=rows.length;
  div.innerHTML=`
    <img class="img-thumb" id="thumb_${idx}" alt="preview">
    <input type="text" placeholder="${angleLabels[angleNum]||'Image URL'} — paste URL or upload below"
      value="${url}" oninput="previewImgRow(this,'${idx}')"
      style="flex:1">
    <label style="flex-shrink:0;cursor:pointer;font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;
      padding:0.28rem 0.6rem;border:1px solid rgba(184,149,90,0.4);color:var(--gold);
      font-family:'Montserrat',sans-serif;border-radius:2px" title="Upload image">
      📁
      <input type="file" accept="image/*" style="display:none"
        onchange="handleImgFile(event,'${idx}')">
    </label>
    <button type="button" class="btn-remove-img" onclick="removeImgRow(this,'${idx}')">✕</button>
  `;
  builder.appendChild(div);
  if(url) previewImgRow(div.querySelector('input[type=text]'), idx);
}

function previewImgRow(input, idx){
  const thumb=document.getElementById('thumb_'+idx);
  if(!thumb) return;
  const url=input.value.trim();
  if(url){
    thumb.src=url;
    thumb.classList.add('visible');
    thumb.onerror=()=>{thumb.classList.remove('visible')};
  } else {
    thumb.classList.remove('visible');
  }
  document.getElementById('imgError').classList.remove('show');
}

function handleImgFile(event, idx){
  const file=event.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    const row=document.querySelector(`.img-builder-row[data-idx="${idx}"]`);
    if(!row) return;
    const input=row.querySelector('input[type=text]');
    input.value=e.target.result;
    previewImgRow(input, idx);
  };
  reader.readAsDataURL(file);
}

function removeImgRow(btn, idx){
  const builder=document.getElementById('imgBuilder');
  const row=document.querySelector(`.img-builder-row[data-idx="${idx}"]`);
  if(!row) return;
  const rows=builder.querySelectorAll('.img-builder-row');
  if(rows.length<=1){notify('You need at least 1 image field','red');return;}
  row.remove();
}

function getImgUrls(){
  const rows=document.querySelectorAll('#imgBuilder .img-builder-row');
  return Array.from(rows).map(r=>r.querySelector('input[type=text]').value.trim()).filter(Boolean);
}

function populateImgBuilder(images){
  const builder=document.getElementById('imgBuilder');
  if(!builder) return;
  builder.innerHTML='';
  const imgs=(images&&images.length)?images:['','',''];
  imgs.forEach(url=>addImgRow(url));
  // ensure at least 3 rows
  if(!builder.querySelectorAll('.img-builder-row').length) addImgRow();
}

function saveProject(){
  const name=document.getElementById('pName').value.trim();
  const year=document.getElementById('pYear').value.trim();
  const imgErrEl=document.getElementById('imgError');
  if(!name||!year){alert('Name and year are required.');return;}
  // Collect & validate images
  const rawUrls=getImgUrls();
  const normalized=rawUrls.map(u=>u.toLowerCase().trim());
  const unique=[...new Set(normalized)];
  if(rawUrls.length < 1){
    imgErrEl.textContent='Please add at least 1 image.';
    imgErrEl.classList.add('show');
    document.getElementById('imgBuilder').scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  imgErrEl.classList.remove('show');
  const editId=document.getElementById('editProjectId').value;
  const timeline=Array.from(document.querySelectorAll('#timelineEntries .timeline-entry')).map(row=>{
    const inputs=row.querySelectorAll('input');
    const desc=row.querySelector('textarea');
    return{date:inputs[0].value,title:inputs[1].value.trim(),desc:(desc?desc.value:'').trim()};
  }).filter(t=>t.title);
  const proj={
    id:editId?parseInt(editId):Date.now(),
    name,year,
    status:document.getElementById('pStatus').value,
    category:document.getElementById('pCategory').value,
    desc:document.getElementById('pDesc').value,
    outcome:document.getElementById('pOutcome').value,
    img:rawUrls.length ? rawUrls[0] : '',
    images:rawUrls,
    featured:document.getElementById('pFeatured').checked,
    award:document.getElementById('pAward').checked,
    timeline
  };
  if(editId){
    const idx=data.projects.findIndex(p=>p.id===parseInt(editId));
    if(idx>-1) data.projects[idx]=proj;
  } else {
    data.projects.push(proj);
  }
  clearProjectForm();
  renderProjects();
  renderFeatured();
  renderAdminProjects();
  renderAdminFeatured();
  renderAdminDashboard();
  saveData();
  notify('Project saved!','green');
}

function clearProjectForm(){
  ['editProjectId','pName','pYear','pCategory','pDesc','pOutcome','pImg'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
  document.getElementById('pStatus').value='current';
  document.getElementById('pFeatured').checked=false;
  document.getElementById('pAward').checked=false;
  document.getElementById('timelineEntries').innerHTML='';
  populateImgBuilder([]);
  const imgErrEl=document.getElementById('imgError');
  if(imgErrEl) imgErrEl.classList.remove('show');
}

function addTimelineEntry(data_={date:'',title:'',desc:''}){
  const div=document.createElement('div');
  div.className='timeline-entry';
  div.innerHTML=`
    <input type="date" title="Update date" value="${toDateInputValue(data_.date)||''}">
    <input type="text" placeholder="Update title" value="${data_.title||''}">
    <textarea placeholder="Update description">${data_.desc||''}</textarea>
    <button class="remove-entry" onclick="this.parentElement.remove()">X</button>
  `;
  document.getElementById('timelineEntries').appendChild(div);
}

function toDateInputValue(value){
  if(!value) return new Date().toISOString().split('T')[0];
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return value;
  return date.toISOString().split('T')[0];
}

// Featured Admin
function renderAdminFeatured(){
  const tbody=document.getElementById('featuredTable');
  tbody.innerHTML=data.projects.map(p=>`
    <tr>
      <td><strong>${p.name}</strong></td>
      <td><span class="badge badge-${p.status}">${p.status}</span></td>
      <td>${p.featured?'<span class="badge badge-featured">✓ Featured</span>':'<span style="color:var(--muted);font-size:0.78rem">—</span>'}</td>
      <td>${p.award?'<span class="badge badge-featured">★</span>':'-'}</td>
      <td>
        <button class="action-btn ${p.featured?'action-del':'action-feature'}" onclick="toggleFeatured(${p.id})">${p.featured?'Remove':'Add to Featured'}</button>
        <button class="action-btn action-edit" onclick="toggleAward(${p.id})">${p.award?'Remove Award':'Set Award'}</button>
      </td>
    </tr>
  `).join('');
}

function toggleFeatured(id){
  const p=data.projects.find(x=>x.id===id);
  if(p){p.featured=!p.featured;renderAdminFeatured();renderFeatured();renderAdminDashboard();saveData();notify(p.featured?'Added to featured':'Removed from featured');}
}

function toggleAward(id){
  const p=data.projects.find(x=>x.id===id);
  if(p){p.award=!p.award;renderAdminFeatured();renderFeatured();renderProjects();saveData();notify(p.award?'Award set':'Award removed');}
}

// Services Admin
function renderAdminServices(){
  const tbody=document.getElementById('servicesTable');
  tbody.innerHTML=data.services.map(s=>`
    <tr>
      <td>${s.icon} <strong>${s.name}</strong></td>
      <td style="color:var(--muted);font-size:0.78rem">${s.desc.substring(0,60)}...</td>
      <td>
        <button class="action-btn action-edit" onclick="editService(${s.id})">Edit</button>
        <button class="action-btn action-del" onclick="deleteService(${s.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function editService(id){
  const s=data.services.find(x=>x.id===id);
  if(!s) return;
  document.getElementById('svcName').value=s.name;
  document.getElementById('svcDesc').value=s.desc;
  document.getElementById('svcIcon').value=s.icon;
  if(document.getElementById('svcImg')) document.getElementById('svcImg').value=s.img||'';
  document.getElementById('svcName').dataset.editId=id;
}

function deleteService(id){
  if(!confirm('Delete this service?')) return;
  data.services=data.services.filter(s=>s.id!==id);
  renderAdminServices();
  renderServicesPreview();
  renderServicesPage();
  saveData();
  notify('Service deleted','red');
}

function saveService(){
  const name=document.getElementById('svcName').value.trim();
  const desc=document.getElementById('svcDesc').value.trim();
  const icon=document.getElementById('svcIcon').value.trim()||'🔧';
  if(!name){alert('Service name required.');return;}
  const editId=document.getElementById('svcName').dataset.editId;
  const svcImg = document.getElementById('svcImg') ? document.getElementById('svcImg').value.trim() : '';
  if(editId){
    const idx=data.services.findIndex(s=>s.id===parseInt(editId));
    if(idx>-1) data.services[idx]={...data.services[idx],name,desc,icon,img:svcImg||data.services[idx].img||''};
    delete document.getElementById('svcName').dataset.editId;
  } else {
    data.services.push({id:Date.now(),name,desc,icon,img:svcImg});
  }
  document.getElementById('svcName').value='';
  document.getElementById('svcDesc').value='';
  document.getElementById('svcIcon').value='';
  if(document.getElementById('svcImg')) document.getElementById('svcImg').value='';
  renderAdminServices();
  renderServicesPreview();
  renderServicesPage();
  saveData();
  notify('Service saved!','green');
}

// Messages Admin
function renderAdminMessages(){
  const list=document.getElementById('messagesList');
  if(!data.messages.length){
    list.innerHTML='<p style="color:var(--muted);font-size:0.8rem">No messages yet.</p>';
    return;
  }
  list.innerHTML=data.messages.map(m=>`
    <div class="message-card ${m.read?'':'unread'}">
      <div class="message-card-header">
        <div>
          <span class="message-sender">${m.name}</span>
          <span style="margin-left:0.8rem;font-size:0.72rem;color:var(--muted)">${m.email}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.8rem">
          <span class="message-date">${m.date}</span>
          <span class="badge ${m.read?'badge-read':'badge-unread'}">${m.read?'Read':'Unread'}</span>
          <button class="action-btn action-edit" style="padding:0.2rem 0.6rem" onclick="toggleMessageRead(${m.id})">${m.read?'Mark Unread':'Mark Read'}</button>
          <button class="action-btn action-view" style="padding:0.2rem 0.6rem" onclick="toggleMessageDetail(${m.id})">View</button>
          <button class="action-btn action-del" style="padding:0.2rem 0.6rem" onclick="event.stopPropagation();deleteMessage(${m.id})">Delete</button>
        </div>
      </div>
      <div class="message-preview">${m.message.substring(0,100)}${m.message.length>100?'...':''}</div>
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
  saveData();
}

function toggleMessageDetail(id){
  const m=data.messages.find(x=>x.id===id);
  if(m){
    const detail=document.getElementById('msg-'+id);
    if(detail) detail.classList.toggle('open');
  }
}

function toggleMessageRead(id){
  const m=data.messages.find(x=>x.id===id);
  if(m){
    m.read=!m.read;
    renderAdminMessages();
    renderAdminDashboard();
    updateMsgBadge();
    saveData();
  }
}

function deleteMessage(id){
  data.messages=data.messages.filter(m=>m.id!==id);
  renderAdminMessages();
  renderAdminDashboard();
  updateMsgBadge();
  saveData();
  notify('Message deleted','red');
}

function clearAllMessages(){
  if(!confirm('Clear all messages?')) return;
  data.messages=[];
  renderAdminMessages();
  renderAdminDashboard();
  updateMsgBadge();
  saveData();
  notify('All messages cleared','red');
}

// Metrics Admin
function renderAdminMetrics(){
  document.getElementById('met1').value=data.metrics.m1;
  document.getElementById('met2').value=data.metrics.m2;
  document.getElementById('met3').value=data.metrics.m3;
  document.getElementById('met4').value=data.metrics.m4;
}

function saveMetrics(){
  data.metrics.m1=document.getElementById('met1').value;
  data.metrics.m2=document.getElementById('met2').value;
  data.metrics.m3=document.getElementById('met3').value;
  data.metrics.m4=document.getElementById('met4').value;
  renderMetrics();
  saveData();
  notify('Metrics updated!','green');
}

// ===========================
// PERSISTENCE (JSON-based storage via localStorage)
// ===========================
function saveData() {
  try {
    const payload = {
      projects:   data.projects,
      services:   data.services,
      messages:   data.messages,
      users:      data.users,
      metrics:    data.metrics,
      heroImages: data.heroImages
    };
    localStorage.setItem('rodricks_data', JSON.stringify(payload));
  } catch(e) {
    if(e && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Try removing some hero images.');
      // notify() may not be safe to call before DOM is ready — guard it
      try { notify('Storage full — remove unused hero images and try again.', 'red'); } catch(_) {}
    } else {
      console.warn('Storage unavailable:', e);
    }
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem('rodricks_data');
    if(saved) {
      const parsed = JSON.parse(saved);
      if(parsed.projects  && parsed.projects.length)  data.projects  = parsed.projects;
      if(parsed.services  && parsed.services.length)  data.services  = parsed.services;
      if(parsed.messages)                             data.messages  = parsed.messages;
      if(parsed.users     && parsed.users.length)     data.users     = parsed.users;
      if(parsed.metrics)                              data.metrics   = parsed.metrics;
      // Only restore heroImages when the saved array is a non-empty valid array.
      // Never overwrite the hardcoded defaults with an empty array — that causes a blank slider.
      if(
        Object.prototype.hasOwnProperty.call(parsed, 'heroImages') &&
        Array.isArray(parsed.heroImages) &&
        parsed.heroImages.length > 0
      ) {
        data.heroImages = parsed.heroImages;
      }
    }
    // Migrate: encode any plain-text passwords that aren't already base64
    let migrated = false;
    data.users = data.users.map(u => {
      if(u.password && !isBase64(u.password)) {
        migrated = true;
        return { ...u, password: btoa(u.password) };
      }
      return u;
    });
    if(migrated) saveData();
  } catch(e) { console.warn('Could not load saved data:', e); }
}
function isBase64(str){
  try{ return btoa(atob(str))===str; }catch(e){ return false; }
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderHome();
});
// ===========================
// SCROLL INDICATOR
// ===========================
window.addEventListener('scroll', function () {
  var indicator = document.getElementById('scrollIndicator');
  if (!indicator) return;
  if (window.scrollY > 50) {
    indicator.classList.add('hide');
  } else {
    indicator.classList.remove('hide');
  }
}, { passive: true });
