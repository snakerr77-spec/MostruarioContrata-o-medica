
const STORAGE_KEY = 'medRecruitCandidates_v2';
const AUTH_KEY = 'medRecruitAdminLogged';

const seedCandidates = [
  {
    id: 1,
    name: 'Dra. Mariana Costa',
    initials: 'MC',
    specialty: 'Cardiologia',
    city: 'São Paulo',
    crm: 'CRM/SP 123456',
    rqe: 'RQE 44521',
    status: 'analise',
    statusLabel: 'Em análise',
    email: 'mariana.costa@email.com',
    phone: '(11) 99999-0000',
    experience: '8 anos',
    availability: 'Seg a Sex • Tarde',
    notes: 'Perfil com boa experiência hospitalar e disponibilidade para início imediato.',
    curriculum: [
      'Especialista em Cardiologia com atuação clínica e hospitalar.',
      'Passagem por pronto atendimento e ambulatório especializado.',
      'Experiência em liderança de equipe multidisciplinar.'
    ]
  },
  {
    id: 2,
    name: 'Dr. Lucas Amaral',
    initials: 'LA',
    specialty: 'Clínica Geral',
    city: 'Cerquilho',
    crm: 'CRM/SP 145877',
    rqe: 'Não informado',
    status: 'novo',
    statusLabel: 'Novo',
    email: 'lucas.amaral@email.com',
    phone: '(15) 99880-3434',
    experience: '4 anos',
    availability: 'Seg a Sab • Manhã',
    notes: 'Médico com perfil generalista e disponibilidade para unidades no interior.',
    curriculum: [
      'Atuação em clínica geral e medicina de família.',
      'Experiência em atendimento ambulatorial e plantões.',
      'Disponibilidade para contratação imediata.'
    ]
  },
  {
    id: 3,
    name: 'Dra. Ana Ribeiro',
    initials: 'AR',
    specialty: 'Neurologia',
    city: 'Tatuí',
    crm: 'CRM/SP 138721',
    rqe: 'RQE 39110',
    status: 'aprovado',
    statusLabel: 'Aprovado',
    email: 'ana.ribeiro@email.com',
    phone: '(15) 99781-3301',
    experience: '10 anos',
    availability: 'Ter e Qui • Integral',
    notes: 'Aprovada após entrevista e avaliação técnica.',
    curriculum: [
      'Especialista em Neurologia com foco em atendimento ambulatorial.',
      'Experiência em diagnóstico e acompanhamento clínico.',
      'Excelente comunicação e relacionamento com pacientes.'
    ]
  },
  {
    id: 4,
    name: 'Dr. Rafael Mendes',
    initials: 'RM',
    specialty: 'Pediatria',
    city: 'Itapeva',
    crm: 'CRM/SP 119882',
    rqe: 'RQE 44209',
    status: 'entrevista',
    statusLabel: 'Entrevista',
    email: 'rafael.mendes@email.com',
    phone: '(15) 99690-1180',
    experience: '6 anos',
    availability: 'Seg a Sex • Tarde',
    notes: 'Entrevista agendada para próxima semana.',
    curriculum: [
      'Experiência em pediatria clínica e atendimento de rotina.',
      'Vivência hospitalar e em pronto atendimento pediátrico.',
      'Boa aderência ao perfil da unidade.'
    ]
  },
  {
    id: 5,
    name: 'Dra. Camila Duarte',
    initials: 'CD',
    specialty: 'Ginecologia',
    city: 'Embu das Artes',
    crm: 'CRM/SP 151903',
    rqe: 'RQE 52218',
    status: 'analise',
    statusLabel: 'Em análise',
    email: 'camila.duarte@email.com',
    phone: '(11) 98841-2250',
    experience: '7 anos',
    availability: 'Qua e Sex • Manhã',
    notes: 'Currículo em análise com interesse para agenda feminina.',
    curriculum: [
      'Atuação em ginecologia clínica e preventiva.',
      'Experiência em consultório e ambulatório.',
      'Boa aceitação para atendimento por agenda.'
    ]
  }
];

function loadCandidates(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCandidates));
    return [...seedCandidates];
  }
  try { return JSON.parse(raw); } catch(e){ return [...seedCandidates]; }
}
function saveCandidates(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

const PDF_DB_NAME = 'medRecruitPdfDb_v1';
const PDF_STORE = 'pdfs';

function openPdfDatabase(){
  return new Promise((resolve, reject) => {
    if(!('indexedDB' in window)){
      reject(new Error('IndexedDB indisponível'));
      return;
    }
    const request = indexedDB.open(PDF_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if(!db.objectStoreNames.contains(PDF_STORE)) db.createObjectStore(PDF_STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Falha ao abrir banco de PDFs'));
  });
}

async function saveCandidatePdf(candidateId, file){
  const db = await openPdfDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, 'readwrite');
    tx.objectStore(PDF_STORE).put({ id: candidateId, name: file.name, type: file.type || 'application/pdf', size: file.size, blob: file });
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = () => { const err = tx.error; db.close(); reject(err || new Error('Falha ao salvar PDF')); };
  });
}

async function getCandidatePdf(candidateId){
  const db = await openPdfDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, 'readonly');
    const request = tx.objectStore(PDF_STORE).get(candidateId);
    request.onsuccess = () => { const result = request.result || null; db.close(); resolve(result); };
    request.onerror = () => { const err = request.error; db.close(); reject(err || new Error('Falha ao carregar PDF')); };
  });
}
let candidates = loadCandidates();

const statusMap = {
  novo: { label:'Novo', cls:'status-novo' },
  analise: { label:'Em análise', cls:'status-analise' },
  entrevista: { label:'Entrevista', cls:'status-entrevista' },
  aprovado: { label:'Aprovado', cls:'status-aprovado' }
};

function getAppLink(){
  return new URL('pages/candidatura.html', window.location.href).href;
}

function showToast(message){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>toast.classList.add('hidden'), 2600);
}

function initialsFromName(name){
  return name.split(/\s+/).slice(0,2).map(p => p[0]?.toUpperCase() || '').join('');
}

if(document.body.dataset.page === 'dashboard'){
  const els = {
    loginScreen: document.getElementById('loginScreen'),
    dashboardScreen: document.getElementById('dashboardScreen'),
    loginForm: document.getElementById('loginForm'),
    loginMessage: document.getElementById('loginMessage'),
    loginEmail: document.getElementById('loginEmail'),
    loginPassword: document.getElementById('loginPassword'),
    togglePassword: document.getElementById('togglePassword'),
    logoutButton: document.getElementById('logoutButton'),
    candidateList: document.getElementById('candidateList'),
    candidateSearch: document.getElementById('candidateSearch'),
    statusFilter: document.getElementById('statusFilter'),
    emptyState: document.getElementById('emptyState'),
    metricTotal: document.getElementById('metricTotal'),
    metricReview: document.getElementById('metricReview'),
    metricInterview: document.getElementById('metricInterview'),
    metricApproved: document.getElementById('metricApproved'),
    candidateModal: document.getElementById('candidateModal'),
    closeCandidateModal: document.getElementById('closeCandidateModal'),
    newCandidateModal: document.getElementById('newCandidateModal'),
    openNewCandidate: document.getElementById('openNewCandidate'),
    closeNewCandidate: document.getElementById('closeNewCandidate'),
    cancelNewCandidate: document.getElementById('cancelNewCandidate'),
    newCandidateForm: document.getElementById('newCandidateForm'),
    copyApplicationLink: document.getElementById('copyApplicationLink'),
    previewApplicationLink: document.getElementById('previewApplicationLink'),
    openApplicationPage: document.getElementById('openApplicationPage'),
    openPdfButton: document.getElementById('openPdfButton'),
    kanbanNew: document.getElementById('kanbanNew'),
    kanbanReview: document.getElementById('kanbanReview'),
    kanbanInterview: document.getElementById('kanbanInterview'),
    kanbanApproved: document.getElementById('kanbanApproved')
  };

  function setScreen(screen){
    const logged = screen === 'dashboard';
    els.loginScreen.classList.toggle('hidden-section', logged);
    els.dashboardScreen.classList.toggle('hidden-section', !logged);
    localStorage.setItem(AUTH_KEY, logged ? '1' : '0');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if(localStorage.getItem(AUTH_KEY) === '1') setScreen('dashboard');

  els.togglePassword?.addEventListener('click', ()=>{
    const show = els.loginPassword.type === 'password';
    els.loginPassword.type = show ? 'text' : 'password';
    const label = els.togglePassword.querySelector('.toggle-label');
    if(label) label.textContent = show ? 'Ocultar' : 'Mostrar';
    els.togglePassword.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  });

  els.loginForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!els.loginEmail.value.trim() || !els.loginPassword.value.trim()){
      els.loginMessage.textContent = 'Preencha e-mail e senha para continuar.';
      return;
    }
    els.loginMessage.textContent = '';
    setScreen('dashboard');
    renderAll();
  });

  els.logoutButton?.addEventListener('click', ()=> setScreen('login'));

  document.querySelectorAll('.side-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.side-item').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.content-section').forEach(s=>s.classList.remove('active'));
      document.getElementById(btn.dataset.section)?.classList.add('active');
    });
  });

  function currentFiltered(){
    const q = (els.candidateSearch?.value || '').trim().toLowerCase();
    const status = els.statusFilter?.value || 'all';
    return candidates.filter(c => {
      const hay = `${c.name} ${c.specialty} ${c.city} ${c.crm}`.toLowerCase();
      const matchQ = !q || hay.includes(q);
      const matchS = status === 'all' || c.status === status;
      return matchQ && matchS;
    });
  }

  function openModal(c){
    document.getElementById('modalAvatar').textContent = c.initials;
    document.getElementById('modalName').textContent = c.name;
    document.getElementById('modalSpecialty').textContent = `${c.specialty} • ${c.city}`;
    document.getElementById('modalCrm').textContent = c.crm;
    document.getElementById('modalRqe').textContent = c.rqe || 'Não informado';
    document.getElementById('modalEmail').textContent = c.email;
    document.getElementById('modalPhone').textContent = c.phone;
    document.getElementById('modalExperience').textContent = c.experience || 'Não informado';
    document.getElementById('modalAvailability').textContent = c.availability || 'Não informado';
    document.getElementById('modalNotes').textContent = c.notes || 'Sem observações.';
    const st = document.getElementById('modalStatus');
    st.textContent = c.statusLabel;
    st.className = `status-pill ${statusMap[c.status]?.cls || ''}`;
    const list = document.getElementById('modalCurriculum');
    list.innerHTML = '';
    (c.curriculum || ['Resumo não informado.']).forEach(item => {
      const li = document.createElement('li'); li.textContent = item; list.appendChild(li);
    });
    if(els.openPdfButton){
      els.openPdfButton.dataset.candidateId = String(c.id);
      els.openPdfButton.disabled = !c.hasPdf;
      els.openPdfButton.classList.toggle('is-disabled', !c.hasPdf);
      els.openPdfButton.textContent = c.hasPdf ? `Abrir currículo PDF${c.pdfName ? ' • ' + c.pdfName : ''}` : 'Currículo PDF não anexado';
    }
    els.candidateModal.classList.remove('hidden');
    els.candidateModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal){
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function renderMetrics(){
    els.metricTotal.textContent = candidates.length;
    els.metricReview.textContent = candidates.filter(c => c.status === 'analise').length;
    els.metricInterview.textContent = candidates.filter(c => c.status === 'entrevista').length;
    els.metricApproved.textContent = candidates.filter(c => c.status === 'aprovado').length;
  }

  function renderList(){
    const filtered = currentFiltered();
    els.candidateList.innerHTML = '';
    filtered.forEach(c => {
      const row = document.createElement('article');
      row.className = 'candidate-row medical-grid';
      row.innerHTML = `
        <div class="doctor-cell">
          <div class="doctor-avatar">${c.initials}</div>
          <div class="doctor-meta">
            <strong>${c.name}</strong>
            <span>${c.city} • ${c.email}</span>
          </div>
        </div>
        <div class="info-chip">${c.specialty}</div>
        <div class="info-chip">${c.crm}</div>
        <span class="status-pill ${statusMap[c.status]?.cls || ''}">${c.statusLabel}</span>
        <button class="eye-button" type="button" aria-label="Ver currículo de ${c.name}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>
      `;
      row.querySelector('.eye-button').addEventListener('click', ()=> openModal(c));
      els.candidateList.appendChild(row);
    });
    els.emptyState.classList.toggle('hidden', filtered.length > 0);
  }

  function renderKanban(){
    const slots = {
      novo: els.kanbanNew,
      analise: els.kanbanReview,
      entrevista: els.kanbanInterview,
      aprovado: els.kanbanApproved
    };
    Object.values(slots).forEach(el => el.innerHTML = '');
    candidates.forEach(c => {
      const card = document.createElement('article');
      card.className = 'kanban-item';
      card.innerHTML = `<strong>${c.name}</strong><span>${c.specialty} • ${c.crm}</span>`;
      card.addEventListener('click', ()=> openModal(c));
      slots[c.status]?.appendChild(card);
    });
  }

  function renderAll(){
    candidates = loadCandidates();
    renderMetrics();
    renderList();
    renderKanban();
  }

  els.candidateSearch?.addEventListener('input', renderList);
  els.statusFilter?.addEventListener('change', renderList);

  els.closeCandidateModal?.addEventListener('click', ()=> closeModal(els.candidateModal));
  els.candidateModal?.addEventListener('click', (e)=> { if(e.target === els.candidateModal) closeModal(els.candidateModal); });

  els.openPdfButton?.addEventListener('click', async () => {
    const id = Number(els.openPdfButton.dataset.candidateId || 0);
    if(!id || els.openPdfButton.disabled) return;
    const viewer = window.open('', '_blank');
    try{
      const record = await getCandidatePdf(id);
      if(!record?.blob){
        if(viewer) viewer.close();
        showToast('O PDF deste currículo não está disponível neste navegador.');
        return;
      }
      const url = URL.createObjectURL(record.blob);
      if(viewer){
        viewer.location.href = url;
      }else{
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }catch(err){
      if(viewer) viewer.close();
      showToast('Não foi possível abrir o PDF do currículo.');
    }
  });

  els.openNewCandidate?.addEventListener('click', ()=>{
    els.newCandidateModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });
  [els.closeNewCandidate, els.cancelNewCandidate].forEach(btn => btn?.addEventListener('click', ()=> closeModal(els.newCandidateModal)));
  els.newCandidateModal?.addEventListener('click', (e)=> { if(e.target === els.newCandidateModal) closeModal(els.newCandidateModal); });

  els.newCandidateForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const status = document.getElementById('newStatus').value;
    const specialty = document.getElementById('newSpecialty').value.trim();
    const candidate = {
      id: Date.now(),
      name: document.getElementById('newName').value.trim(),
      initials: initialsFromName(document.getElementById('newName').value.trim()),
      specialty,
      city: document.getElementById('newCity').value.trim(),
      crm: document.getElementById('newCrm').value.trim(),
      rqe: document.getElementById('newRqe').value.trim() || 'Não informado',
      status,
      statusLabel: statusMap[status].label,
      email: document.getElementById('newEmail').value.trim(),
      phone: document.getElementById('newPhone').value.trim() || 'Não informado',
      experience: document.getElementById('newExperience').value.trim() || 'Não informado',
      availability: document.getElementById('newAvailability').value.trim() || 'Não informado',
      notes: document.getElementById('newNotes').value.trim() || 'Candidato adicionado manualmente pelo painel.',
      curriculum: [
        `${specialty} com foco clínico e atendimento especializado.`,
        'Candidato cadastrado manualmente no painel administrativo.',
        'Aguardando complementação de dados do currículo.'
      ]
    };
    candidates.unshift(candidate);
    saveCandidates(candidates);
    els.newCandidateForm.reset();
    closeModal(els.newCandidateModal);
    renderAll();
    showToast('Médico cadastrado com sucesso.');
  });

  els.copyApplicationLink?.addEventListener('click', async ()=>{
    const link = getAppLink();
    try{ await navigator.clipboard.writeText(link); showToast('Link da candidatura copiado.'); }
    catch(e){ showToast(link); }
  });
  els.previewApplicationLink?.addEventListener('click', ()=> window.open(getAppLink(), '_blank'));
  if(els.openApplicationPage) els.openApplicationPage.href = getAppLink();

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(!els.candidateModal.classList.contains('hidden')) closeModal(els.candidateModal);
      if(!els.newCandidateModal.classList.contains('hidden')) closeModal(els.newCandidateModal);
    }
  });

  renderAll();
}

if(document.body.dataset.page === 'application'){
  const form = document.getElementById('applicationForm');
  const msg = document.getElementById('applicationMessage');
  const pdfInput = document.getElementById('appCvFile');
  const pdfName = document.getElementById('appCvFileName');
  const pdfHint = document.getElementById('appCvFileHint');
  const success = document.getElementById('applicationSuccess');
  const titleBlock = document.querySelector('.application-form-title');
  const sendAnother = document.getElementById('sendAnotherApplication');
  const MAX_PDF_SIZE = 10 * 1024 * 1024;

  function showValidation(message){
    if(!msg) return;
    msg.textContent = message;
    msg.classList.add('is-error');
  }

  function clearValidation(){
    if(!msg) return;
    msg.textContent = '';
    msg.classList.remove('is-error');
  }

  function validatePdf(file){
    if(!file) return true;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if(!isPdf){
      showValidation('O currículo precisa ser um arquivo PDF.');
      return false;
    }
    if(file.size > MAX_PDF_SIZE){
      showValidation('O PDF deve ter no máximo 10 MB.');
      return false;
    }
    return true;
  }

  pdfInput?.addEventListener('change', () => {
    clearValidation();
    const file = pdfInput.files?.[0];
    if(!file){
      pdfName.textContent = 'Selecionar currículo em PDF';
      pdfHint.textContent = 'Clique para escolher o arquivo';
      return;
    }
    if(!validatePdf(file)){
      pdfInput.value = '';
      pdfName.textContent = 'Selecionar currículo em PDF';
      pdfHint.textContent = 'Clique para escolher o arquivo';
      return;
    }
    pdfName.textContent = file.name;
    pdfHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB • PDF pronto para anexar`;
  });

  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    clearValidation();

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
    const file = pdfInput?.files?.[0] || null;

    if(!name || !crm || !phone || !email || !availability){
      showValidation('Preencha Nome, CRM, Telefone, E-mail e Disponibilidade para enviar sua candidatura.');
      form.querySelector(':invalid')?.focus();
      return;
    }

    if(!document.getElementById('appEmail').checkValidity()){
      showValidation('Digite um e-mail válido para continuar.');
      document.getElementById('appEmail').focus();
      return;
    }

    if(!validatePdf(file)) return;

    const id = Date.now();
    if(file){
      try{
        await saveCandidatePdf(id, file);
      }catch(err){
        showValidation('Não foi possível anexar o PDF neste navegador. Tente novamente ou use um arquivo menor.');
        return;
      }
    }

    const list = loadCandidates();
    const candidate = {
      id,
      name,
      initials: initialsFromName(name),
      specialty: specialty || 'Especialidade não informada',
      city: city || 'Cidade não informada',
      crm,
      rqe,
      status: 'novo',
      statusLabel: 'Novo',
      email,
      phone,
      experience,
      availability,
      hasPdf: Boolean(file),
      pdfName: file?.name || '',
      notes: file ? `Currículo PDF anexado: ${file.name}` : 'Candidatura enviada pela página pública sem PDF anexado.',
      curriculum: [
        summary || 'Resumo profissional não informado.',
        `Disponibilidade: ${availability}.`,
        file ? `Currículo PDF anexado: ${file.name}.` : 'Currículo PDF não anexado.'
      ]
    };

    list.unshift(candidate);
    saveCandidates(list);
    form.reset();
    if(pdfName) pdfName.textContent = 'Selecionar currículo em PDF';
    if(pdfHint) pdfHint.textContent = 'Clique para escolher o arquivo';
    form.classList.add('hidden');
    titleBlock?.classList.add('hidden');
    success?.classList.remove('hidden');
    success?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  sendAnother?.addEventListener('click', () => {
    success?.classList.add('hidden');
    titleBlock?.classList.remove('hidden');
    form?.classList.remove('hidden');
    clearValidation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
