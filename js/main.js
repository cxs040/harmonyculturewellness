/* ════════════════════════════════════
   CHINESE CULTURE WEBSITE — MAIN JS
   Folder-based PDF routing edition
   ════════════════════════════════════ */

/* ── Language toggle ── */
let currentLang = 'zh';

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentLang = btn.dataset.lang;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.classList.toggle('lang-zh', currentLang === 'zh');
    document.body.classList.toggle('lang-en', currentLang === 'en');
  });
});

/* ── Navigation ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.section);
  });
});

function navigateTo(sectionId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l =>
    l.classList.toggle('active', l.dataset.section === sectionId)
  );
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── PDF Viewer (PDF.js) ── */
let pdfDoc      = null;
let currentPage = 1;
let totalPages  = 0;
let renderTask  = null;

if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

function openPDF(path, title) {
  document.getElementById('pdf-modal-title').textContent = title;
  document.getElementById('pdf-modal').classList.add('open');
  document.getElementById('pdf-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  if (typeof pdfjsLib === 'undefined') return;

  pdfjsLib.getDocument(path).promise
    .then(pdf => {
      pdfDoc      = pdf;
      totalPages  = pdf.numPages;
      currentPage = 1;
      renderPage(currentPage);
    })
    .catch(() => { /* file not yet uploaded — hint shown in modal */ });
}

function closePDF() {
  document.getElementById('pdf-modal').classList.remove('open');
  document.getElementById('pdf-overlay').classList.remove('open');
  document.body.style.overflow = '';
  pdfDoc = null;
}

function renderPage(num) {
  if (!pdfDoc) return;
  if (renderTask) renderTask.cancel();

  pdfDoc.getPage(num).then(page => {
    const canvas   = document.getElementById('pdf-canvas');
    const ctx      = canvas.getContext('2d');
    const maxWidth = Math.min(window.innerWidth * 0.82, 800);
    const scale    = maxWidth / page.getViewport({ scale: 1 }).width;
    const viewport = page.getViewport({ scale });
    canvas.width   = viewport.width;
    canvas.height  = viewport.height;
    renderTask     = page.render({ canvasContext: ctx, viewport });
    renderTask.promise.then(() => { renderTask = null; });
    document.getElementById('pdf-page-info').textContent = `${num} / ${totalPages}`;
  });
}

function prevPage() {
  if (pdfDoc && currentPage > 1) { currentPage--; renderPage(currentPage); }
}

function nextPage() {
  if (pdfDoc && currentPage < totalPages) { currentPage++; renderPage(currentPage); }
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('pdf-modal').classList.contains('open')) return;
  if (e.key === 'Escape')     closePDF();
  if (e.key === 'ArrowLeft')  prevPage();
  if (e.key === 'ArrowRight') nextPage();
});

/* ── Build a PDF button element ── */
function makePdfBtn(section, doc) {
  const path  = `pdfs/${section}/${doc.file}`;
  const label = `${doc.titleZh} — ${doc.titleEn}`;
  const btn   = document.createElement('div');
  btn.className = 'pdf-btn';
  btn.onclick   = () => openPDF(path, label);
  btn.innerHTML = `
    <span>📜</span>
    <span class="zh">${doc.titleZh}</span>
    <span class="en">${doc.titleEn}</span>
  `;
  return btn;
}

/* ── Populate each section's PDF shelf ── */
function loadSectionShelves() {
  if (typeof DOCUMENTS === 'undefined') return;

  ['confucianism', 'taoism', 'poetry'].forEach(section => {
    const shelf = document.getElementById(`shelf-${section}`);
    if (!shelf) return;
    const docs = DOCUMENTS[section] || [];
    if (!docs.length) {
      shelf.innerHTML = `<p class="shelf-empty zh">尚未上傳文件 — 請將PDF放入 pdfs/${section}/</p>
                         <p class="shelf-empty en">No files yet — upload PDFs to pdfs/${section}/</p>`;
      return;
    }
    docs.forEach(doc => shelf.appendChild(makePdfBtn(section, doc)));
  });
}

/* ── Populate Document Archive (all sections) ── */
function loadDocumentArchive() {
  const gallery = document.getElementById('doc-gallery');
  const empty   = document.getElementById('doc-empty');
  if (!gallery || typeof DOCUMENTS === 'undefined') return;

  const all = ['confucianism', 'taoism', 'poetry', 'documents']
    .flatMap(section => (DOCUMENTS[section] || []).map(doc => ({ ...doc, section })));

  if (!all.length) { empty.style.display = 'block'; return; }

  const sectionLabel = {
    confucianism: '儒家 · Confucianism',
    taoism:       '道家 · Taoism',
    poetry:       '詩詞 · Poetry',
    documents:    '典籍 · Classics',
  };

  gallery.innerHTML = all.map(doc => `
    <div class="doc-card" onclick="openPDF('pdfs/${doc.section}/${doc.file}', '${doc.titleZh} — ${doc.titleEn}')">
      <div class="doc-icon">📜</div>
      <div class="doc-title-zh zh">${doc.titleZh}</div>
      <div class="doc-title-en en">${doc.titleEn}</div>
      <div class="doc-cat">${sectionLabel[doc.section]}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  loadSectionShelves();
  loadDocumentArchive();
});
