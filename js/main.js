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

/* ── Build a clickable PDF card ── */
function makePdfCard(section, doc) {
  const path  = `pdfs/${section}/${doc.file}`;
  const title = `${doc.titleZh} — ${doc.titleEn}`;
  const btn   = document.createElement('div');
  btn.className = 'pdf-btn';
  btn.onclick   = () => openPDF(path, title);
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
    docs.forEach(doc => shelf.appendChild(makePdfCard(section, doc)));
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

/* ════════════════════════════════════════
   FEATURE 1 — DARK MODE TOGGLE
   ════════════════════════════════════════ */
(function initDarkMode() {
  const btn  = document.getElementById('dark-toggle');
  const body = document.body;
  const saved = localStorage.getItem('darkMode');
  if (saved === 'on') {
    body.classList.add('dark');
    btn.textContent = '☀';
  }
  btn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    btn.textContent = isDark ? '☀' : '☽';
    localStorage.setItem('darkMode', isDark ? 'on' : 'off');
  });
})();

/* ════════════════════════════════════════
   FEATURE 2 — FONT SIZE CONTROLS
   ════════════════════════════════════════ */
(function initFontSize() {
  const SIZES  = ['font-small', 'font-medium', 'font-large'];
  const body   = document.body;
  let idx      = parseInt(localStorage.getItem('fontSizeIdx') || '1', 10);

  function applySize() {
    body.classList.remove(...SIZES);
    body.classList.add(SIZES[idx]);
    localStorage.setItem('fontSizeIdx', idx);
  }

  applySize();

  document.getElementById('font-decrease').addEventListener('click', () => {
    if (idx > 0) { idx--; applySize(); }
  });
  document.getElementById('font-increase').addEventListener('click', () => {
    if (idx < SIZES.length - 1) { idx++; applySize(); }
  });
})();

/* ════════════════════════════════════════
   FEATURE 3 — BACK TO TOP
   ════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ════════════════════════════════════════
   FEATURE 4 — QUOTE OF THE DAY
   ════════════════════════════════════════ */
(function initQuoteOfDay() {
  const quotes = [
    { text: '學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？',    source: '《論語·學而》· 孔子' },
    { text: '道可道，非常道；名可名，非常名。',                   source: '《道德經》第一章 · 老子' },
    { text: '知己知彼，百戰不殆。',                               source: '《孫子兵法》· 孫子' },
    { text: '天下興亡，匹夫有責。',                               source: '《日知錄》· 顧炎武' },
    { text: '窮則獨善其身，達則兼善天下。',                       source: '《孟子·盡心上》· 孟子' },
    { text: '不以物喜，不以己悲。',                               source: '《岳陽樓記》· 范仲淹' },
    { text: '人有悲歡離合，月有陰晴圓缺，此事古難全。',           source: '《水調歌頭》· 蘇軾' },
    { text: '海內存知己，天涯若比鄰。',                           source: '《送杜少府之任蜀州》· 王勃' },
    { text: '千里之行，始於足下。',                               source: '《道德經》第六十四章 · 老子' },
    { text: '博學之，審問之，慎思之，明辨之，篤行之。',           source: '《禮記·中庸》' },
    { text: '路漫漫其修遠兮，吾將上下而求索。',                   source: '《離騷》· 屈原' },
    { text: '知之者不如好之者，好之者不如樂之者。',               source: '《論語·雍也》· 孔子' },
  ];

  const now     = new Date();
  const start   = new Date(now.getFullYear(), 0, 0);
  const dayOfYr = Math.floor((now - start) / 86400000);
  const q       = quotes[dayOfYr % quotes.length];

  const block = document.getElementById('quote-of-day');
  if (!block) return;
  block.querySelector('.qod-text').textContent   = '「' + q.text + '」';
  block.querySelector('.qod-source').textContent = '— ' + q.source;
})();

/* ════════════════════════════════════════
   FEATURE 5 — SHARE POEM
   ════════════════════════════════════════ */
function sharePoem(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  const titleEl  = card.querySelector('.poem-title');
  const authorEl = card.querySelector('.poem-author');
  const linesEl  = card.querySelector('.poem-lines.zh') ||
                   card.querySelector('.poem-lines');

  const title  = titleEl  ? titleEl.textContent.trim()  : '';
  const author = authorEl ? authorEl.textContent.trim() : '';
  const lines  = linesEl  ? linesEl.innerText.trim()    : '';
  const text   = `${title}\n${author}\n\n${lines}\n\n— 中華哲學文學典籍`;

  if (navigator.share) {
    navigator.share({ title, text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast()).catch(() => {
      // fallback for environments without clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    });
  }
}

function showToast() {
  const toast = document.getElementById('share-toast');
  if (!toast) return;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ════════════════════════════════════════
   FEATURE 6 — PRINT POEM
   ════════════════════════════════════════ */
function printPoem(cardId) {
  // Remove any previous print-target
  document.querySelectorAll('.poem-card.print-target')
    .forEach(c => c.classList.remove('print-target'));

  const card = document.getElementById(cardId);
  if (!card) return;

  // Ensure poetry section is 'active' for print CSS to work
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('poetry').classList.add('active');

  card.classList.add('print-target');
  window.print();

  // Restore nav state after print dialog closes
  card.classList.remove('print-target');
  navigateTo('poetry');
}
