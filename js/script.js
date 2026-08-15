const STORAGE_KEY = 'medRecruitCandidates_v3';
const LEGACY_STORAGE_KEYS = ['medRecruitCandidates_v2'];
const AUTH_KEY = 'medRecruitAdminLogged';
const PROFILE_KEY = 'jpRecruitUserProfile_v1';
const SIDEBAR_KEY = 'jpSidebarCollapsed_v1';

const seedCandidates = [
  {
    id: 1, name: 'Dra. Mariana Costa', initials: 'MC', specialty: 'Cardiologia', city: 'São Paulo',
    crm: 'CRM/SP 123456', rqe: 'RQE 44521', status: 'analise', statusLabel: 'Em análise',
    email: 'mariana.costa@email.com', phone: '(11) 99999-0000', experience: '8 anos', availability: 'Seg a Sex • Tarde',
    createdAt: '2026-08-10T13:22:00-03:00',
    notes: 'Perfil com boa experiência hospitalar e disponibilidade para início imediato.',
    curriculum: ['Especialista em Cardiologia com atuação clínica e hospitalar.','Passagem por pronto atendimento e ambulatório especializado.','Experiência em liderança de equipe multidisciplinar.'],
    documents: []
  },
  {
    id: 2, name: 'Dr. Lucas Amaral', initials: 'LA', specialty: 'Clínica Geral', city: 'Cerquilho',
    crm: 'CRM/SP 145877', rqe: 'Não informado', status: 'novo', statusLabel: 'Novo',
    email: 'lucas.amaral@email.com', phone: '(15) 99880-3434', experience: '4 anos', availability: 'Seg a Sab • Manhã',
    createdAt: '2026-08-09T10:14:00-03:00',
    notes: 'Médico com perfil generalista e disponibilidade para unidades no interior.',
    curriculum: ['Atuação em clínica geral e medicina de família.','Experiência em atendimento ambulatorial e plantões.','Disponibilidade para contratação imediata.'],
    documents: []
  },
  {
    id: 3, name: 'Dra. Ana Ribeiro', initials: 'AR', specialty: 'Neurologia', city: 'Tatuí',
    crm: 'CRM/SP 138721', rqe: 'RQE 39110', status: 'aprovado', statusLabel: 'Aprovado',
    email: 'ana.ribeiro@email.com', phone: '(15) 99781-3301', experience: '10 anos', availability: 'Ter e Qui • Integral',
    createdAt: '2026-08-08T16:40:00-03:00',
    notes: 'Aprovada após entrevista e avaliação técnica.',
    curriculum: ['Especialista em Neurologia com foco em atendimento ambulatorial.','Experiência em diagnóstico e acompanhamento clínico.','Excelente comunicação e relacionamento com pacientes.'],
    documents: []
  },
  {
    id: 4, name: 'Dr. Rafael Mendes', initials: 'RM', specialty: 'Pediatria', city: 'Itapeva',
    crm: 'CRM/SP 119882', rqe: 'RQE 44209', status: 'entrevista', statusLabel: 'Entrevista',
    email: 'rafael.mendes@email.com', phone: '(15) 99690-1180', experience: '6 anos', availability: 'Seg a Sex • Tarde',
    createdAt: '2026-08-07T09:35:00-03:00',
    notes: 'Entrevista agendada para próxima semana.',
    curriculum: ['Experiência em pediatria clínica e atendimento de rotina.','Vivência hospitalar e em pronto atendimento pediátrico.','Boa aderência ao perfil da unidade.'],
    documents: []
  },
  {
    id: 5, name: 'Dra. Camila Duarte', initials: 'CD', specialty: 'Ginecologia', city: 'Embu das Artes',
    crm: 'CRM/SP 151903', rqe: 'RQE 52218', status: 'reprovado', statusLabel: 'Reprovado',
    email: 'camila.duarte@email.com', phone: '(11) 98841-2250', experience: '7 anos', availability: 'Qua e Sex • Manhã',
    createdAt: '2026-08-06T11:05:00-03:00',
    notes: 'Processo encerrado após análise curricular.',
    curriculum: ['Atuação em ginecologia clínica e preventiva.','Experiência em consultório e ambulatório.','Boa aceitação para atendimento por agenda.'],
    documents: []
  }
];

const statusMap = {
  novo: { label: 'Novo', cls: 'status-novo' },
  analise: { label: 'Em análise', cls: 'status-analise' },
  entrevista: { label: 'Entrevista', cls: 'status-entrevista' },
  aprovado: { label: 'Aprovado', cls: 'status-aprovado' },
  reprovado: { label: 'Reprovado', cls: 'status-reprovado' }
};

function normalizeCandidate(candidate, index = 0){
  const status = statusMap[candidate.status] ? candidate.status : 'novo';
  let createdAt = candidate.createdAt;
  if(!createdAt){
    if(Number(candidate.id) > 1000000000000) createdAt = new Date(Number(candidate.id)).toISOString();
    else createdAt = new Date(Date.now() - index * 86400000).toISOString();
  }
  const documents = Array.isArray(candidate.documents) ? candidate.documents : [];
  if(candidate.hasPdf && candidate.pdfName && !documents.some(d => d.type === 'curriculo')){
    documents.push({ key: `legacy:${candidate.id}`, type: 'curriculo', label: 'Currículo profissional', name: candidate.pdfName, legacy: true });
  }
  return {
    ...candidate,
    status,
    statusLabel: statusMap[status].label,
    createdAt,
    documents
  };
}

function loadCandidates(){
  let raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    for(const key of LEGACY_STORAGE_KEYS){
      raw = localStorage.getItem(key);
      if(raw) break;
    }
  }
  if(!raw){
    const initial = seedCandidates.map(normalizeCandidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try{
    const parsed = JSON.parse(raw).map(normalizeCandidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  }catch(e){
    const initial = seedCandidates.map(normalizeCandidate);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveCandidates(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function sortByDate(list){
  return [...list].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function formatDate(value){
  const date = value ? new Date(value) : null;
  if(!date || Number.isNaN(date.getTime())) return 'Sem data';
  return new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' }).format(date);
}

function initialsFromName(name){
  return name.split(/\s+/).filter(Boolean).slice(0,2).map(p => p[0]?.toUpperCase() || '').join('');
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

let candidates = loadCandidates();

// ---------- IndexedDB documents ----------
const FILE_DB_NAME = 'jpMedicalRecruitFiles_v2';
const FILE_DB_VERSION = 1;
const FILE_STORE = 'documents';

function openFileDatabase(){
  return new Promise((resolve, reject) => {
    if(!('indexedDB' in window)) return reject(new Error('IndexedDB indisponível'));
    const request = indexedDB.open(FILE_DB_NAME, FILE_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if(!db.objectStoreNames.contains(FILE_STORE)) db.createObjectStore(FILE_STORE, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Falha ao abrir armazenamento de documentos'));
  });
}

async function saveCandidateDocument(candidateId, type, label, file, index = 0){
  const db = await openFileDatabase();
  const key = `${candidateId}:${type}:${index}:${Date.now()}:${Math.random().toString(36).slice(2,8)}`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, 'readwrite');
    tx.objectStore(FILE_STORE).put({ key, candidateId, type, label, name:file.name, mime:file.type || 'application/octet-stream', size:file.size, blob:file });
    tx.oncomplete = () => { db.close(); resolve({ key, type, label, name:file.name, mime:file.type || '', size:file.size }); };
    tx.onerror = () => { const err = tx.error; db.close(); reject(err || new Error('Falha ao salvar documento')); };
  });
}

async function getCandidateDocument(key){
  if(!key || key.startsWith('legacy:')) return null;
  const db = await openFileDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(FILE_STORE, 'readonly');
    const req = tx.objectStore(FILE_STORE).get(key);
    req.onsuccess = () => { const result = req.result || null; db.close(); resolve(result); };
    req.onerror = () => { const err = req.error; db.close(); reject(err || new Error('Falha ao carregar documento')); };
  });
}

function getAppLink(){
  return new URL('pages/candidatura.html', window.location.href).href;
}

function showToast(message){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

async function openStoredDocument(meta){
  if(!meta || meta.legacy){
    showToast('Este arquivo antigo não está disponível no armazenamento atual.');
    return;
  }
  const viewer = window.open('', '_blank');
  try{
    const record = await getCandidateDocument(meta.key);
    if(!record?.blob){
      viewer?.close();
      showToast('Arquivo não encontrado neste navegador.');
      return;
    }
    const url = URL.createObjectURL(record.blob);
    if(viewer) viewer.location.href = url;
    else{
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }catch(err){
    viewer?.close();
    showToast('Não foi possível abrir este documento.');
  }
}

// ---------- DASHBOARD ----------
if(document.body.dataset.page === 'dashboard'){
  const els = {
    loginScreen: document.getElementById('loginScreen'), loginLoadingScreen: document.getElementById('loginLoadingScreen'), dashboardScreen: document.getElementById('dashboardScreen'),
    loginForm: document.getElementById('loginForm'), loginMessage: document.getElementById('loginMessage'),
    loginEmail: document.getElementById('loginEmail'), loginPassword: document.getElementById('loginPassword'),
    togglePassword: document.getElementById('togglePassword'), logoutButton: document.getElementById('logoutButton'),
    profileMenuButton: document.getElementById('profileMenuButton'), sidebarProfileMenu: document.getElementById('sidebarProfileMenu'), viewProfileButton: document.getElementById('viewProfileButton'),
    candidateList: document.getElementById('candidateList'), candidateSearch: document.getElementById('candidateSearch'),
    statusFilter: document.getElementById('statusFilter'), emptyState: document.getElementById('emptyState'),
    metricTotal: document.getElementById('metricTotal'), metricReview: document.getElementById('metricReview'),
    metricApproved: document.getElementById('metricApproved'), metricRejected: document.getElementById('metricRejected'),
    candidateModal: document.getElementById('candidateModal'), closeCandidateModal: document.getElementById('closeCandidateModal'),
    modalDocumentsList: document.getElementById('modalDocumentsList'), modalDocumentsCount: document.getElementById('modalDocumentsCount'),
    newCandidateModal: document.getElementById('newCandidateModal'), openNewCandidate: document.getElementById('openNewCandidate'),
    closeNewCandidate: document.getElementById('closeNewCandidate'), cancelNewCandidate: document.getElementById('cancelNewCandidate'),
    newCandidateForm: document.getElementById('newCandidateForm'), copyApplicationLink: document.getElementById('copyApplicationLink'),
    previewApplicationLink: document.getElementById('previewApplicationLink'), openApplicationPage: document.getElementById('openApplicationPage'),
    openPdfButton: document.getElementById('openPdfButton'),
    kanbanNew: document.getElementById('kanbanNew'), kanbanReview: document.getElementById('kanbanReview'),
    kanbanInterview: document.getElementById('kanbanInterview'), kanbanApproved: document.getElementById('kanbanApproved'),
    kanbanRejected: document.getElementById('kanbanRejected'),
    sidebarToggle: document.getElementById('sidebarToggle'), sidebarEmptyToggle: document.getElementById('sidebarEmptyToggle'), specialtyChart: document.getElementById('specialtyChart'),
    specialtyTotal: document.getElementById('specialtyTotal'), specialtyLeader: document.getElementById('specialtyLeader'),
    specialtyLeaderCount: document.getElementById('specialtyLeaderCount'), specialtyKinds: document.getElementById('specialtyKinds'),
    rqeRate: document.getElementById('rqeRate'), specialtyDonut: document.getElementById('specialtyDonut'),
    specialtyDonutTotal: document.getElementById('specialtyDonutTotal'), specialtyLegend: document.getElementById('specialtyLegend'),
    indicatorsUpdatedAt: document.getElementById('indicatorsUpdatedAt'), indicatorDoctorsTotal: document.getElementById('indicatorDoctorsTotal'),
    indicatorSpecialtiesTotal: document.getElementById('indicatorSpecialtiesTotal'), indicatorRqeRate: document.getElementById('indicatorRqeRate'),
    indicatorInProcess: document.getElementById('indicatorInProcess'), profileForm: document.getElementById('profileForm')
  };

  let activeCandidateId = null;

  function setSidebarCollapsed(collapsed){
    els.dashboardScreen?.classList.toggle('sidebar-collapsed', collapsed);
    if(els.sidebarToggle){
      els.sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
      els.sidebarToggle.title = collapsed ? 'Expandir menu' : 'Recolher menu';
    }
    if(els.sidebarEmptyToggle){
      els.sidebarEmptyToggle.setAttribute('aria-label', collapsed ? 'Expandir menu pela área inferior' : 'Recolher menu pela área inferior');
      els.sidebarEmptyToggle.title = collapsed ? 'Expandir menu' : 'Recolher menu';
    }
    localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
  }
  setSidebarCollapsed(localStorage.getItem(SIDEBAR_KEY) === '1');
  els.sidebarToggle?.addEventListener('click', () => setSidebarCollapsed(!els.dashboardScreen.classList.contains('sidebar-collapsed')));
  els.sidebarEmptyToggle?.addEventListener('click', () => setSidebarCollapsed(!els.dashboardScreen.classList.contains('sidebar-collapsed')));
  const handleSidebarToggleKey = e => {
    if(e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    setSidebarCollapsed(!els.dashboardScreen.classList.contains('sidebar-collapsed'));
  };
  els.sidebarToggle?.addEventListener('keydown', handleSidebarToggleKey);
  els.sidebarEmptyToggle?.addEventListener('keydown', handleSidebarToggleKey);

  function loadProfile(){
    const defaults={name:'Administrador',role:'Equipe de recrutamento',email:'admin@jpservicosmedicos.com.br',phone:''};
    try{return {...defaults,...JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')}}catch(e){return defaults}
  }
  function renderProfile(){
    const p=loadProfile();
    const name=document.getElementById('profileName'), role=document.getElementById('profileRole'), email=document.getElementById('profileEmail'), phone=document.getElementById('profilePhone');
    if(name) name.value=p.name; if(role) role.value=p.role; if(email) email.value=p.email; if(phone) phone.value=p.phone||'';
    const initials=initialsFromName(p.name)||'AD';
    document.querySelectorAll('.avatar-circle').forEach(el=>el.textContent=initials);
    const big=document.getElementById('profileAvatar'); if(big) big.textContent=initials;
    const displayName=document.getElementById('profileDisplayName'); if(displayName) displayName.textContent=p.name;
    const displayRole=document.getElementById('profileDisplayRole'); if(displayRole) displayRole.textContent=p.role;
    const userStrong=document.querySelector('.sidebar-user strong'); if(userStrong) userStrong.textContent=p.name;
    const userEmail=document.querySelector('.sidebar-user span'); if(userEmail) userEmail.textContent=p.email;
    const menuName=document.getElementById('profileMenuName'); if(menuName) menuName.textContent=p.name;
    const menuEmail=document.getElementById('profileMenuEmail'); if(menuEmail) menuEmail.textContent=p.email;
    const menuRole=document.getElementById('profileMenuRole'); if(menuRole) menuRole.textContent=p.role;
  }
  renderProfile();

  function setProfileMenu(open, returnFocus=false){
    els.sidebarProfileMenu?.classList.toggle('hidden-section', !open);
    els.sidebarProfileMenu?.setAttribute('aria-hidden', open ? 'false' : 'true');
    els.profileMenuButton?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if(!open && returnFocus) els.profileMenuButton?.focus();
  }
  els.profileMenuButton?.addEventListener('click', e=>{
    e.stopPropagation();
    setProfileMenu(els.profileMenuButton.getAttribute('aria-expanded') !== 'true');
  });
  els.sidebarProfileMenu?.addEventListener('click', e=>e.stopPropagation());
  document.addEventListener('click', ()=>setProfileMenu(false));
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && els.profileMenuButton?.getAttribute('aria-expanded') === 'true') setProfileMenu(false,true);
  });
  els.viewProfileButton?.addEventListener('click', ()=>{
    setProfileMenu(false);
    document.querySelector('.side-item[data-section="settingsSection"]')?.click();
  });
  els.profileForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const profile={name:document.getElementById('profileName').value.trim(),role:document.getElementById('profileRole').value.trim(),email:document.getElementById('profileEmail').value.trim(),phone:document.getElementById('profilePhone').value.trim()};
    if(!profile.name||!profile.role||!profile.email) return;
    localStorage.setItem(PROFILE_KEY,JSON.stringify(profile)); renderProfile(); showToast('Perfil atualizado com sucesso.');
  });

  function setScreen(screen){
    const logged = screen === 'dashboard';
    els.loginScreen?.classList.toggle('hidden-section', logged);
    els.dashboardScreen?.classList.toggle('hidden-section', !logged);
    localStorage.setItem(AUTH_KEY, logged ? '1' : '0');
    window.scrollTo({ top:0, behavior:'smooth' });
  }
  if(localStorage.getItem(AUTH_KEY) === '1') setScreen('dashboard');

  els.togglePassword?.addEventListener('click', () => {
    const show = els.loginPassword.type === 'password';
    els.loginPassword.type = show ? 'text' : 'password';
    const label = els.togglePassword.querySelector('.toggle-label');
    if(label) label.textContent = show ? 'Ocultar' : 'Mostrar';
    els.togglePassword.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  });

  let loginInProgress = false;
  els.loginForm?.addEventListener('submit', e => {
    e.preventDefault();
    if(loginInProgress) return;
    if(!els.loginEmail.value.trim() || !els.loginPassword.value.trim()){
      els.loginMessage.textContent = 'Preencha e-mail e senha para continuar.';
      return;
    }
    loginInProgress = true;
    els.loginMessage.textContent = '';
    const submitButton = els.loginForm.querySelector('button[type="submit"]');
    submitButton?.setAttribute('disabled','');
    els.loginForm.setAttribute('aria-busy','true');
    els.loginScreen?.classList.add('hidden-section');
    els.loginLoadingScreen?.classList.remove('hidden-section');
    els.loginLoadingScreen?.setAttribute('aria-hidden','false');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      els.loginLoadingScreen?.classList.add('hidden-section');
      els.loginLoadingScreen?.setAttribute('aria-hidden','true');
      setScreen('dashboard');
      renderAll();
      submitButton?.removeAttribute('disabled');
      els.loginForm.removeAttribute('aria-busy');
      loginInProgress = false;
    }, reducedMotion ? 300 : 900);
  });

  els.logoutButton?.addEventListener('click', () => setScreen('login'));

  document.querySelectorAll('.side-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.side-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      const section = document.getElementById(btn.dataset.section);
      section?.classList.add('active');

      // Recarrega os dados ao acessar Indicadores para refletir candidaturas/status recentes.
      if(btn.dataset.section === 'reportsSection'){
        candidates = loadCandidates();
        renderReports();
        section?.classList.remove('indicators-refreshing');
        void section?.offsetWidth;
        section?.classList.add('indicators-refreshing');
        setTimeout(() => section?.classList.remove('indicators-refreshing'), 520);
      }
      if(btn.dataset.section === 'candidatesSection'){
        candidates = loadCandidates();
        renderMetrics();
        renderList();
      }
    });
  });

  function currentFiltered(){
    const q = (els.candidateSearch?.value || '').trim().toLowerCase();
    const status = els.statusFilter?.value || 'all';
    return sortByDate(candidates).filter(c => {
      const hay = `${c.name} ${c.specialty} ${c.city} ${c.crm} ${c.email}`.toLowerCase();
      return (!q || hay.includes(q)) && (status === 'all' || c.status === status);
    });
  }

  function renderModalDocuments(candidate){
    const docs = Array.isArray(candidate.documents) ? candidate.documents : [];
    if(els.modalDocumentsCount) els.modalDocumentsCount.textContent = `${docs.length} ${docs.length === 1 ? 'arquivo' : 'arquivos'}`;
    if(!els.modalDocumentsList) return;
    els.modalDocumentsList.innerHTML = '';
    if(!docs.length){
      els.modalDocumentsList.innerHTML = '<div class="document-empty-state">Nenhum documento foi anexado por este médico.</div>';
      return;
    }
    docs.forEach(doc => {
      const item = document.createElement('article');
      item.className = 'candidate-document-item';
      item.innerHTML = `
        <div class="candidate-document-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v5h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="candidate-document-copy">
          <strong>${escapeHtml(doc.label || 'Documento')}</strong>
          <span>${escapeHtml(doc.name || 'arquivo')}</span>
        </div>
        <button type="button" class="document-open-button">Abrir</button>`;
      item.querySelector('.document-open-button').addEventListener('click', () => openStoredDocument(doc));
      els.modalDocumentsList.appendChild(item);
    });
  }

  function refreshStatusActionButtons(status){
    document.querySelectorAll('[data-status-action]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.statusAction === status);
    });
  }

  function openModal(candidate){
    activeCandidateId = candidate.id;
    document.getElementById('modalAvatar').textContent = candidate.initials;
    document.getElementById('modalName').textContent = candidate.name;
    document.getElementById('modalSpecialty').textContent = `${candidate.specialty} • ${candidate.city}`;
    document.getElementById('modalCrm').textContent = candidate.crm;
    document.getElementById('modalRqe').textContent = candidate.rqe || 'Não informado';
    document.getElementById('modalEmail').textContent = candidate.email;
    document.getElementById('modalPhone').textContent = candidate.phone;
    document.getElementById('modalExperience').textContent = candidate.experience || 'Não informado';
    document.getElementById('modalAvailability').textContent = candidate.availability || 'Não informado';
    document.getElementById('modalNotes').textContent = candidate.notes || 'Sem observações.';
    const st = document.getElementById('modalStatus');
    st.textContent = candidate.statusLabel;
    st.className = `status-pill ${statusMap[candidate.status]?.cls || ''}`;
    const list = document.getElementById('modalCurriculum');
    list.innerHTML = '';
    (candidate.curriculum || ['Resumo não informado.']).forEach(text => {
      const li = document.createElement('li'); li.textContent = text; list.appendChild(li);
    });
    const cv = (candidate.documents || []).find(d => d.type === 'curriculo');
    if(els.openPdfButton){
      els.openPdfButton.disabled = !cv;
      els.openPdfButton.classList.toggle('is-disabled', !cv);
      els.openPdfButton.textContent = cv ? 'Abrir currículo' : 'Currículo não anexado';
      els.openPdfButton.onclick = cv ? () => openStoredDocument(cv) : null;
    }
    renderModalDocuments(candidate);
    refreshStatusActionButtons(candidate.status);
    els.candidateModal.classList.remove('hidden');
    els.candidateModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal){
    modal?.classList.add('hidden');
    modal?.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function updateCandidateStatus(candidateId, newStatus){
    if(!statusMap[newStatus]) return;
    const idx = candidates.findIndex(c => c.id === candidateId);
    if(idx < 0) return;
    candidates[idx] = { ...candidates[idx], status:newStatus, statusLabel:statusMap[newStatus].label, statusUpdatedAt:new Date().toISOString() };
    saveCandidates(candidates);
    renderAll();
    openModal(candidates[idx]);
    showToast(`Candidatura marcada como ${statusMap[newStatus].label.toLowerCase()}.`);
  }

  document.querySelectorAll('[data-status-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      if(activeCandidateId == null) return;
      updateCandidateStatus(activeCandidateId, btn.dataset.statusAction);
    });
  });

  function renderMetrics(){
    els.metricTotal.textContent = candidates.length;
    els.metricReview.textContent = candidates.filter(c => c.status === 'analise').length;
    els.metricApproved.textContent = candidates.filter(c => c.status === 'aprovado').length;
    els.metricRejected.textContent = candidates.filter(c => c.status === 'reprovado').length;
  }

  function renderList(){
    const filtered = currentFiltered();
    els.candidateList.innerHTML = '';
    filtered.forEach(c => {
      const row = document.createElement('article');
      row.className = 'candidate-row medical-grid';
      row.innerHTML = `
        <div class="doctor-cell">
          <div class="doctor-avatar">${escapeHtml(c.initials)}</div>
          <div class="doctor-meta"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.city)} • ${escapeHtml(c.email)}</span></div>
        </div>
        <div class="info-chip">${escapeHtml(c.specialty)}</div>
        <div class="info-chip">${escapeHtml(c.crm)}</div>
        <div class="date-cell"><strong>${formatDate(c.createdAt)}</strong><span>Candidatura</span></div>
        <span class="status-pill ${statusMap[c.status]?.cls || ''}">${escapeHtml(c.statusLabel)}</span>
        <button class="eye-button" type="button" aria-label="Ver currículo e documentos de ${escapeHtml(c.name)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>`;
      row.querySelector('.eye-button').addEventListener('click', () => openModal(c));
      els.candidateList.appendChild(row);
    });
    els.emptyState.classList.toggle('hidden', filtered.length > 0);
  }

  function renderKanban(){
    const slots = { novo:els.kanbanNew, analise:els.kanbanReview, entrevista:els.kanbanInterview, aprovado:els.kanbanApproved, reprovado:els.kanbanRejected };
    Object.values(slots).filter(Boolean).forEach(el => el.innerHTML = '');
    sortByDate(candidates).forEach(c => {
      const card = document.createElement('article');
      card.className = 'kanban-item';
      card.innerHTML = `<strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.specialty)} • ${escapeHtml(c.crm)}</span><small>${formatDate(c.createdAt)}</small>`;
      card.addEventListener('click', () => openModal(c));
      slots[c.status]?.appendChild(card);
    });
  }

  function renderReports(){
    if(!els.specialtyChart) return;
    candidates = sortByDate(loadCandidates());
    const counts={};
    candidates.forEach(c=>{
      const key=(c.specialty||'Não informado').trim()||'Não informado';
      counts[key]=(counts[key]||0)+1;
    });
    const data=Object.entries(counts).sort((a,b)=> b[1]-a[1] || a[0].localeCompare(b[0],'pt-BR'));
    const total=candidates.length||0;
    const palette=['#0b4f7d','#087cad','#25a8d1','#62bfda','#9dd8e7','#d2af78','#8fa9b7','#5f8fa7'];
    const withRqe=candidates.filter(c=>c.rqe && c.rqe!=='Não informado').length;
    const rqePercent=total?Math.round(withRqe/total*100):0;
    const inProcess=candidates.filter(c=>['analise','entrevista','novo'].includes(c.status)).length;

    els.specialtyChart.innerHTML='';
    if(els.specialtyLegend) els.specialtyLegend.innerHTML='';

    data.forEach(([name,count],index)=>{
      const pctTotal=total ? (count/total*100) : 0;
      const row=document.createElement('div');
      row.className='specialty-bar-row';
      row.innerHTML=`<div class="specialty-bar-label"><strong>${escapeHtml(name)}</strong><span>${count} ${count===1?'médico':'médicos'}</span></div><div class="specialty-bar-track"><i style="width:${Math.max(3,pctTotal)}%"></i></div><div class="specialty-bar-value"><strong>${pctTotal.toFixed(total && count<total ? 0 : 0)}%</strong></div>`;
      els.specialtyChart.appendChild(row);

      if(els.specialtyLegend && index<8){
        const legend=document.createElement('div');
        legend.className='specialty-legend-item';
        legend.innerHTML=`<i style="background:${palette[index%palette.length]}"></i><span>${escapeHtml(name)}</span>`;
        els.specialtyLegend.appendChild(legend);
      }
    });

    if(!data.length){
      els.specialtyChart.innerHTML='<div class="chart-empty">Nenhum candidato disponível para gerar os indicadores.</div>';
      if(els.specialtyLegend) els.specialtyLegend.innerHTML='';
    }

    if(els.specialtyDonut){
      if(!data.length){
        els.specialtyDonut.style.background='#edf4f7';
      }else{
        let cursor=0;
        const stops=[];
        data.forEach(([name,count],index)=>{
          const start=cursor;
          cursor += total ? (count/total*100) : 0;
          stops.push(`${palette[index%palette.length]} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`);
        });
        els.specialtyDonut.style.background=`conic-gradient(${stops.join(',')})`;
      }
      els.specialtyDonut.setAttribute('aria-label', `${total} médicos distribuídos em ${data.length} especialidades`);
    }

    const leader=data[0]||['—',0];
    if(els.specialtyTotal) els.specialtyTotal.textContent=total;
    if(els.specialtyDonutTotal) els.specialtyDonutTotal.textContent=total;
    if(els.specialtyLeader) els.specialtyLeader.textContent=leader[0];
    if(els.specialtyLeaderCount) els.specialtyLeaderCount.textContent=`${leader[1]} ${leader[1]===1?'médico':'médicos'}`;
    if(els.specialtyKinds) els.specialtyKinds.textContent=data.length;
    if(els.rqeRate) els.rqeRate.textContent=`${rqePercent}%`;
    if(els.indicatorDoctorsTotal) els.indicatorDoctorsTotal.textContent=total;
    if(els.indicatorSpecialtiesTotal) els.indicatorSpecialtiesTotal.textContent=data.length;
    if(els.indicatorRqeRate) els.indicatorRqeRate.textContent=`${rqePercent}%`;
    if(els.indicatorInProcess) els.indicatorInProcess.textContent=inProcess;
    if(els.indicatorsUpdatedAt) els.indicatorsUpdatedAt.textContent=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }

  function renderAll(){
    candidates = loadCandidates();
    renderMetrics(); renderList(); renderKanban(); renderReports(); renderProfile();
  }

  els.candidateSearch?.addEventListener('input', renderList);
  els.statusFilter?.addEventListener('change', renderList);
  els.closeCandidateModal?.addEventListener('click', () => closeModal(els.candidateModal));
  els.candidateModal?.addEventListener('click', e => { if(e.target === els.candidateModal) closeModal(els.candidateModal); });

  els.openNewCandidate?.addEventListener('click', () => {
    els.newCandidateModal.classList.remove('hidden'); document.body.style.overflow = 'hidden';
  });
  [els.closeNewCandidate, els.cancelNewCandidate].forEach(btn => btn?.addEventListener('click', () => closeModal(els.newCandidateModal)));
  els.newCandidateModal?.addEventListener('click', e => { if(e.target === els.newCandidateModal) closeModal(els.newCandidateModal); });

  els.newCandidateForm?.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.getElementById('newStatus').value;
    const name = document.getElementById('newName').value.trim();
    const candidate = normalizeCandidate({
      id: Date.now(), name, initials: initialsFromName(name), specialty:document.getElementById('newSpecialty').value.trim(),
      city:document.getElementById('newCity').value.trim(), crm:document.getElementById('newCrm').value.trim(),
      rqe:document.getElementById('newRqe').value.trim() || 'Não informado', status, statusLabel:statusMap[status].label,
      email:document.getElementById('newEmail').value.trim(), phone:document.getElementById('newPhone').value.trim(),
      experience:document.getElementById('newExperience').value.trim() || 'Não informado',
      availability:document.getElementById('newAvailability').value.trim(), createdAt:new Date().toISOString(),
      notes:document.getElementById('newNotes').value.trim() || 'Candidato adicionado manualmente pelo painel.',
      curriculum:['Candidato cadastrado manualmente no painel administrativo.'], documents:[]
    });
    candidates.unshift(candidate); saveCandidates(candidates); els.newCandidateForm.reset(); closeModal(els.newCandidateModal); renderAll(); showToast('Médico cadastrado com sucesso.');
  });

  els.copyApplicationLink?.addEventListener('click', async () => {
    const link = getAppLink();
    try{ await navigator.clipboard.writeText(link); showToast('Link da candidatura copiado.'); }
    catch(e){ showToast(link); }
  });
  els.previewApplicationLink?.addEventListener('click', () => window.open(getAppLink(), '_blank'));
  if(els.openApplicationPage) els.openApplicationPage.href = getAppLink();

  document.addEventListener('keydown', e => {
    if(e.key !== 'Escape') return;
    if(!els.candidateModal.classList.contains('hidden')) closeModal(els.candidateModal);
    if(!els.newCandidateModal.classList.contains('hidden')) closeModal(els.newCandidateModal);
  });

  renderAll();
}

// ---------- PUBLIC APPLICATION ----------
if(document.body.dataset.page === 'application'){
  const form = document.getElementById('applicationForm');
  const msg = document.getElementById('applicationMessage');
  const success = document.getElementById('applicationSuccess');
  const titleBlock = document.querySelector('.application-form-title');
  const sendAnother = document.getElementById('sendAnotherApplication');
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const fileInputs = [...document.querySelectorAll('.document-file-input')];

  function showValidation(message){
    if(!msg) return;
    msg.textContent = message; msg.classList.add('is-error');
  }
  function clearValidation(){
    if(!msg) return;
    msg.textContent = ''; msg.classList.remove('is-error');
  }
  function validFile(file){
    const type = file.type || '';
    const name = file.name.toLowerCase();
    const allowed = type === 'application/pdf' || type === 'image/jpeg' || type === 'image/png' || /\.(pdf|jpe?g|png)$/.test(name);
    if(!allowed){ showValidation('Envie apenas arquivos PDF, JPG ou PNG.'); return false; }
    if(file.size > MAX_FILE_SIZE){ showValidation(`O arquivo ${file.name} ultrapassa o limite de 10 MB.`); return false; }
    return true;
  }
  function updateFileSummary(input){
    const summary = document.querySelector(`[data-file-summary="${input.id}"]`);
    if(!summary) return;
    const files = [...(input.files || [])];
    if(!files.length){
      summary.textContent = 'Nenhum arquivo selecionado';
      return;
    }
    summary.textContent = files.length === 1 ? files[0].name : `${files.length} arquivos selecionados`;
  }

  fileInputs.forEach(input => {
    input.addEventListener('change', () => {
      clearValidation();
      const files = [...(input.files || [])];
      if(files.some(file => !validFile(file))){ input.value = ''; updateFileSummary(input); return; }
      updateFileSummary(input);
    });
  });

  form?.addEventListener('submit', async e => {
    e.preventDefault(); clearValidation();
    const name = document.getElementById('appName').value.trim();
    const email = document.getElementById('appEmail').value.trim();
    const phone = document.getElementById('appPhone').value.trim();
    const city = document.getElementById('appCity').value.trim();
    const specialty = document.getElementById('appSpecialty').value.trim();
    const crm = document.getElementById('appCrm').value.trim();
    const rqe = document.getElementById('appRqe').value.trim() || 'Não informado';
    const experience = document.getElementById('appExperience').value.trim() || 'Não informado';
    const availability = document.getElementById('appAvailability').value.trim();
    const summary = document.getElementById('appSummary').value.trim();

    if(!name || !crm || !phone || !email || !availability){
      showValidation('Preencha Nome, CRM, Telefone, E-mail e Disponibilidade para enviar sua candidatura.');
      form.querySelector(':invalid')?.focus(); return;
    }
    if(!document.getElementById('appEmail').checkValidity()){
      showValidation('Digite um e-mail válido para continuar.'); document.getElementById('appEmail').focus(); return;
    }

    const missingInput = fileInputs.find(input => !(input.files && input.files.length));
    if(missingInput){
      const label = missingInput.dataset.documentLabel || 'documento obrigatório';
      showValidation(`Anexe ${label} para continuar. Todos os documentos são obrigatórios.`);
      missingInput.closest('.document-upload-card')?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    const allSelected = fileInputs.flatMap(input => [...(input.files || [])]);
    if(allSelected.some(file => !validFile(file))) return;

    const id = Date.now();
    const documents = [];
    try{
      for(const input of fileInputs){
        const type = input.dataset.documentType || 'documento';
        const label = input.dataset.documentLabel || 'Documento';
        const files = [...(input.files || [])];
        for(let i=0;i<files.length;i++){
          const meta = await saveCandidateDocument(id, type, label, files[i], i);
          documents.push(meta);
        }
      }
    }catch(err){
      showValidation('Não foi possível salvar um dos documentos neste navegador. Tente arquivos menores ou outro navegador.');
      return;
    }

    const candidate = normalizeCandidate({
      id, name, initials:initialsFromName(name), specialty:specialty || 'Especialidade não informada',
      city:city || 'Cidade não informada', crm, rqe, status:'novo', statusLabel:'Novo', email, phone, experience, availability,
      createdAt:new Date().toISOString(), documents,
      notes: documents.length ? `${documents.length} documento(s) anexado(s) na candidatura.` : 'Candidatura enviada sem documentos anexados.',
      curriculum:[summary || 'Resumo profissional não informado.', `Disponibilidade: ${availability}.`, `${documents.length} documento(s) anexado(s).`]
    });

    const list = loadCandidates(); list.unshift(candidate); saveCandidates(list);
    form.reset(); fileInputs.forEach(updateFileSummary);
    form.classList.add('hidden'); titleBlock?.classList.add('hidden'); success?.classList.remove('hidden');
    success?.scrollIntoView({ behavior:'smooth', block:'center' });
  });

  sendAnother?.addEventListener('click', () => {
    success?.classList.add('hidden'); titleBlock?.classList.remove('hidden'); form?.classList.remove('hidden'); clearValidation();
    window.scrollTo({ top:0, behavior:'smooth' });
  });
}
