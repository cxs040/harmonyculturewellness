/* ════════════════════════════════════
   CHINESE CULTURE WEBSITE — MAIN JS
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

/* ── PDF Viewer ── */
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let renderTask = null;

if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

function openPDF(url, title) {
  document.getElementById('pdf-modal-title').textContent = title;
  document.getElementById('pdf-modal').classList.add('open');
  document.getElementById('pdf-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  if (typeof pdfjsLib === 'undefined') return;

  pdfjsLib.getDocument(url).promise
    .then(pdf => {
      pdfDoc = pdf;
      totalPages = pdf.numPages;
      currentPage = 1;
      renderPage(currentPage);
    })
    .catch(() => {
      /* File not yet uploaded — the hint text in the modal guides the user */
    });
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
    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');
    const scale = Math.min(1.5, (window.innerWidth * 0.85) / page.getViewport({ scale: 1 }).width);
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    renderTask = page.render({ canvasContext: ctx, viewport });
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

/* Keyboard shortcuts for PDF modal */
document.addEventListener('keydown', e => {
  if (!document.getElementById('pdf-modal').classList.contains('open')) return;
  if (e.key === 'Escape')     closePDF();
  if (e.key === 'ArrowLeft')  prevPage();
  if (e.key === 'ArrowRight') nextPage();
});

/* ── Populate Document Archive ── */
function loadDocuments() {
  const gallery = document.getElementById('doc-gallery');
  const empty   = document.getElementById('doc-empty');
  if (!gallery) return;

  const docs = (typeof DOCUMENTS !== 'undefined') ? DOCUMENTS : [];

  if (!docs.length) {
    empty.style.display = 'block';
    return;
  }

  gallery.innerHTML = docs.map(doc => `
    <div class="doc-card" onclick="openPDF('${doc.path}', '${doc.titleZh} — ${doc.titleEn}')">
      <div class="doc-icon">📜</div>
      <div class="doc-title-zh zh">${doc.titleZh}</div>
      <div class="doc-title-en en">${doc.titleEn}</div>
      <div class="doc-cat">${doc.category}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadDocuments);
