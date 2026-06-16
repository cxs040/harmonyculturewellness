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
  if (e.key === 'Escape') {
    if (document.getElementById('pdf-modal').classList.contains('open'))    closePDF();
    if (document.getElementById('fig-modal').classList.contains('open'))    closeFigure();
    if (document.getElementById('search-modal').classList.contains('open')) closeSearch();
  }
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    openSearch();
  }
  if (!document.getElementById('pdf-modal').classList.contains('open')) return;
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

/* ════════════════════════════════════════
   FIGURE DATA — timeline persons
   ════════════════════════════════════════ */
const FIGURES = {
  kongzi: {
    nameZh: '孔子', nameEn: 'Confucius',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？人不知而不慍，不亦君子乎？',
    quoteEn: 'Is it not pleasant to learn and practise what you have learned? Is it not joyful to have friends come from afar? Is it not virtue for a man to remain unperturbed though men may take no note of him?',
    sourceZh: '《論語·學而》', sourceEn: 'Analects, Book I',
  },
  laozi: {
    nameZh: '老子', nameEn: 'Laozi',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'taoism', catLabelZh: '道家', catLabelEn: 'Taoism',
    quoteZh: '道可道，非常道；名可名，非常名。無名天地之始，有名萬物之母。',
    quoteEn: 'The Tao that can be told is not the eternal Tao; the name that can be named is not the eternal name. The nameless is the origin of heaven and earth; the named is the mother of ten thousand things.',
    sourceZh: '《道德經》第一章', sourceEn: 'Tao Te Ching, Chapter I',
  },
  sunzi: {
    nameZh: '孫子', nameEn: 'Sun Tzu',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '知己知彼，百戰不殆；不知彼而知己，一勝一負；不知彼，不知己，每戰必敗。',
    quoteEn: 'If you know the enemy and know yourself, you need not fear the result of a hundred battles. If you know yourself but not the enemy, for every victory you will also suffer a defeat. If you know neither yourself nor the enemy, you will succumb in every battle.',
    sourceZh: '《孫子兵法·謀攻篇》', sourceEn: 'The Art of War, Chapter III',
  },
  mengzi: {
    nameZh: '孟子', nameEn: 'Mencius',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '老吾老，以及人之老；幼吾幼，以及人之幼。天下可運於掌。',
    quoteEn: 'Treat the aged of your own family with the reverence due to age, then extend that reverence to the aged of other families; treat your own young with the tenderness due to youth, then extend that tenderness to the young of other families — and the empire may be turned in your palm.',
    sourceZh: '《孟子·梁惠王上》', sourceEn: 'Mencius, Book I Part A',
  },
  zhuangzi: {
    nameZh: '莊子', nameEn: 'Zhuangzi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'taoism', catLabelZh: '道家', catLabelEn: 'Taoism',
    quoteZh: '吾生也有涯，而知也無涯。以有涯隨無涯，殆已！已而為知者，殆而已矣。',
    quoteEn: 'Our life has a limit, but our knowledge is without limit. To use what has a limit in pursuit of what is without limit is a perilous thing; and when, knowing this, we still seek the increase of our knowledge, the peril cannot be averted.',
    sourceZh: '《莊子·養生主》', sourceEn: 'Zhuangzi, The Secret of Caring for Life',
  },
  xunzi: {
    nameZh: '荀子', nameEn: 'Xunzi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '青，取之於藍，而青於藍；冰，水為之，而寒於水。',
    quoteEn: 'Indigo blue is extracted from the indigo plant and yet it surpasses the plant in blueness. Ice is made of water and yet it is colder than water — learning transforms the learner beyond the source.',
    sourceZh: '《荀子·勸學》', sourceEn: 'Xunzi, An Exhortation to Learning',
  },
  dongzhongshu: {
    nameZh: '董仲舒', nameEn: 'Dong Zhongshu',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '仁義禮智信，五者，王道之本也。此五者並行，人道出焉。聖人知其然，故多其愛而少其嚴。',
    quoteEn: 'Benevolence, righteousness, ritual propriety, wisdom, and integrity — these five are the foundation of the kingly way. When they flourish together, the way of humanity emerges. The sage, knowing this, emphasises love over severity.',
    sourceZh: '《春秋繁露》', sourceEn: 'Luxuriant Gems of the Spring and Autumn Annals',
  },
  simaqian: {
    nameZh: '司馬遷', nameEn: 'Sima Qian',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '人固有一死，或重於泰山，或輕於鴻毛，用之所趨異也。',
    quoteEn: 'It is certain that all men must die, but some deaths are weightier than Mount Tai and others lighter than a feather. To give one\'s life for the people is weightier than Mount Tai; to die in service to tyranny is lighter than a feather.',
    sourceZh: '《報任少卿書》', sourceEn: 'Letter to Ren An',
  },
  bangu: {
    nameZh: '班固', nameEn: 'Ban Gu',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '蓋文章，經國之大業，不朽之盛事。年壽有時而盡，榮樂止乎其身，二者必至之常期，未若文章之無窮。',
    quoteEn: 'Literary writing is the greatest undertaking in governing a nation and an affair of undying glory. A person\'s lifespan eventually ends, and honour ceases with the body — both have their inevitable terms. Yet they cannot compare with literary writing, which endures without end.',
    sourceZh: '《典論·論文》', sourceEn: 'Discourse on Literature',
  },
  libai: {
    nameZh: '李白', nameEn: 'Li Bai',
    dynastyZh: '唐朝', dynastyEn: 'Tang Dynasty',
    section: 'poetry', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '君不見黃河之水天上來，奔流到海不復回。君不見高堂明鏡悲白髮，朝如青絲暮成雪。人生得意須盡歡，莫使金樽空對月。',
    quoteEn: 'Do you not see the waters of the Yellow River pour down from the sky, rushing to the sea never to return? Do you not see the bright mirror in the high hall lamenting white hair — morning threads of silk, by evening turned to snow? When life is joyful, make the most of it; do not let the golden goblet face the moon alone and empty.',
    sourceZh: '《將進酒》', sourceEn: 'Bring in the Wine',
  },
  dufu: {
    nameZh: '杜甫', nameEn: 'Du Fu',
    dynastyZh: '唐朝', dynastyEn: 'Tang Dynasty',
    section: 'poetry', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '國破山河在，城春草木深。感時花濺淚，恨別鳥驚心。烽火連三月，家書抵萬金。',
    quoteEn: 'The nation is broken, yet mountains and rivers remain. Spring comes to the city — grass and trees grow deep. Moved by the times, flowers draw forth tears; grieving separation, birds startle the heart. The beacon fires have blazed for three months; a letter from home is worth ten thousand in gold.',
    sourceZh: '《春望》', sourceEn: 'Spring View',
  },
  wangzhihuan: {
    nameZh: '王之渙', nameEn: 'Wang Zhihuan',
    dynastyZh: '唐朝', dynastyEn: 'Tang Dynasty',
    section: 'poetry', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '白日依山盡，黃河入海流。欲窮千里目，更上一層樓。',
    quoteEn: 'The white sun sets beyond the mountains; the Yellow River flows into the sea. To see a thousand miles further, you must climb one more storey of the tower.',
    sourceZh: '《登鸛雀樓》', sourceEn: 'Ascending Stork Tower',
  },
  sushi: {
    nameZh: '蘇軾', nameEn: 'Su Shi',
    dynastyZh: '宋朝', dynastyEn: 'Song Dynasty',
    section: 'poetry', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '明月幾時有，把酒問青天。不知天上宮闕，今夕是何年。人有悲歡離合，月有陰晴圓缺，此事古難全。但願人長久，千里共嬋娟。',
    quoteEn: 'How long has the bright moon been there? I raise my cup to ask the blue sky. I wonder what year it is tonight in the palace above. People have sorrows and joys, partings and reunions; the moon waxes and wanes — perfection has always been elusive. I only wish those I love may live long, to share this beautiful moonlight across a thousand miles.',
    sourceZh: '《水調歌頭·明月幾時有》', sourceEn: 'Prelude to Water Melody',
  },
  zhuxi: {
    nameZh: '朱熹', nameEn: 'Zhu Xi',
    dynastyZh: '宋朝', dynastyEn: 'Song Dynasty',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '問渠那得清如許？為有源頭活水來。',
    quoteEn: 'How is it that this pond stays so crystal clear? Because living water flows ceaselessly from its source. (A metaphor for continuous study and the renewal of the mind through fresh learning.)',
    sourceZh: '《觀書有感》', sourceEn: 'Reflections on Reading',
  },
  liqingzhao: {
    nameZh: '李清照', nameEn: 'Li Qingzhao',
    dynastyZh: '宋朝', dynastyEn: 'Song Dynasty',
    section: 'poetry', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '生當作人傑，死亦為鬼雄。至今思項羽，不肯過江東。',
    quoteEn: 'In life, be a hero among the living; in death, be a hero among the dead. I still think of Xiang Yu, who refused to cross the river east and retreat from defeat.',
    sourceZh: '《夏日絕句》', sourceEn: 'Quatrain Written in Summer',
  },
  luoguanzhong: {
    nameZh: '羅貫中', nameEn: 'Luo Guanzhong',
    dynastyZh: '元末明初', dynastyEn: 'Yuan–Ming Period',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '話說天下大勢，分久必合，合久必分。',
    quoteEn: 'It is a truth universally acknowledged that the realm under heaven, after a long period of division, tends to unite; and after a long period of union, tends to divide.',
    sourceZh: '《三國演義》第一回', sourceEn: 'Romance of the Three Kingdoms, Chapter I',
  },
  caoxueqin: {
    nameZh: '曹雪芹', nameEn: 'Cao Xueqin',
    dynastyZh: '清朝', dynastyEn: 'Qing Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '滿紙荒唐言，一把辛酸淚。都云作者癡，誰解其中味？',
    quoteEn: 'Pages full of fantastical words, a handful of bitter tears — all say the author was a fool; who can understand the taste within?',
    sourceZh: '《紅樓夢》卷首題詩', sourceEn: 'Dream of the Red Chamber, Preface Poem',
  },
  wangyangming: {
    nameZh: '王陽明', nameEn: 'Wang Yangming',
    dynastyZh: '明朝', dynastyEn: 'Ming Dynasty',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '知是行之始，行是知之成。',
    quoteEn: 'Knowledge is the beginning of action; action is the completion of knowledge. True understanding and moral conduct are inseparable — to genuinely know something is already to act upon it.',
    sourceZh: '《傳習錄》', sourceEn: 'Instructions for Practical Living',
  },
};

/* ════════════════════════════════════════
   FIGURE MODAL — show famous passage
   ════════════════════════════════════════ */
function showFigure(figId) {
  const fig = FIGURES[figId];
  if (!fig) return;

  document.getElementById('fig-name-zh').textContent    = fig.nameZh;
  document.getElementById('fig-name-en').textContent    = fig.nameEn;
  document.getElementById('fig-dynasty-zh').textContent = fig.dynastyZh;
  document.getElementById('fig-dynasty-en').textContent = fig.dynastyEn;
  document.getElementById('fig-cat-badge').textContent  = fig.catLabelZh + ' · ' + fig.catLabelEn;
  document.getElementById('fig-quote-zh').textContent   = '「' + fig.quoteZh + '」';
  document.getElementById('fig-quote-en').textContent   = fig.quoteEn;
  document.getElementById('fig-src-zh').textContent     = fig.sourceZh;
  document.getElementById('fig-src-en').textContent     = fig.sourceEn;

  const btn = document.getElementById('fig-explore-btn');
  btn.querySelector('.fig-btn-zh').textContent = '探索' + fig.catLabelZh + ' →';
  btn.querySelector('.fig-btn-en').textContent = 'Explore ' + fig.catLabelEn + ' →';
  btn.onclick = () => { closeFigure(); navigateTo(fig.section); };

  document.getElementById('fig-modal').classList.add('open');
  document.getElementById('fig-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFigure() {
  document.getElementById('fig-modal').classList.remove('open');
  document.getElementById('fig-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════
   HANZIWRITER — home page stroke animations
   ════════════════════════════════════════ */
(function initHanziWriter() {
  if (typeof HanziWriter === 'undefined') return;

  const chars = [
    { id: 'hw-ren',  char: '仁' },
    { id: 'hw-dao',  char: '道' },
    { id: 'hw-shi',  char: '詩' },
    { id: 'hw-juan', char: '卷' },
  ];

  chars.forEach(({ id, char }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';

    let writer;
    try {
      writer = HanziWriter.create(id, char, {
        width: 80,
        height: 80,
        padding: 5,
        strokeColor: '#8B1A1A',
        outlineColor: 'rgba(201,169,110,0.3)',
        drawingWidth: 3,
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 150,
        delayBetweenLoops: 3000,
        loop: true,
        onLoadCharDataError: () => { el.textContent = char; },
      });
      writer.animateCharacter();
      el.addEventListener('mouseenter', () => writer.animateCharacter());
    } catch (e) {
      el.textContent = char;
    }
  });
})();

/* ════════════════════════════════════════
   SEARCH — index + modal
   ════════════════════════════════════════ */
const SEARCH_INDEX = [
  // ── Poems ──
  { type:'poem', typeLabel:'詩詞 · Poem',
    titleZh:'靜夜思', titleEn:'Thoughts on a Quiet Night',
    metaZh:'李白 · 唐', metaEn:'Li Bai · Tang',
    excerpt:'床前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。',
    section:'poetry', elementId:'poem-jingye' },
  { type:'poem', typeLabel:'詩詞 · Poem',
    titleZh:'春望', titleEn:'Spring View',
    metaZh:'杜甫 · 唐', metaEn:'Du Fu · Tang',
    excerpt:'國破山河在，城春草木深。感時花濺淚，恨別鳥驚心。',
    section:'poetry', elementId:'poem-chunwang' },
  { type:'poem', typeLabel:'詩詞 · Poem',
    titleZh:'水調歌頭', titleEn:'Prelude to Water Melody',
    metaZh:'蘇軾 · 宋', metaEn:'Su Shi · Song',
    excerpt:'明月幾時有，把酒問青天。人有悲歡離合，月有陰晴圓缺。',
    section:'poetry', elementId:'poem-shuidade' },
  { type:'poem', typeLabel:'詩詞 · Poem',
    titleZh:'登鸛雀樓', titleEn:'Ascending Stork Tower',
    metaZh:'王之渙 · 唐', metaEn:'Wang Zhihuan · Tang',
    excerpt:'白日依山盡，黃河入海流。欲窮千里目，更上一層樓。',
    section:'poetry', elementId:'poem-guanque' },
  // ── Confucianism ──
  { type:'concept', typeLabel:'儒家 · Confucianism',
    titleZh:'仁 · 仁愛', titleEn:'Rén · Benevolence',
    excerpt:'愛人，人與人之間相互敬愛的道德情感。Love and compassion for others.',
    section:'confucianism' },
  { type:'concept', typeLabel:'儒家 · Confucianism',
    titleZh:'義 · 正義', titleEn:'Yì · Righteousness',
    excerpt:'行事合乎道德規範，以正義為準則。Acting in accordance with moral principles.',
    section:'confucianism' },
  { type:'concept', typeLabel:'儒家 · Confucianism',
    titleZh:'禮 · 禮儀', titleEn:'Lǐ · Ritual Propriety',
    excerpt:'禮儀規範，是社會秩序與和諧的基礎。Rites forming the foundation of harmonious society.',
    section:'confucianism' },
  { type:'concept', typeLabel:'儒家 · Confucianism',
    titleZh:'智 · 智慧', titleEn:'Zhì · Wisdom',
    excerpt:'明辨是非，擁有道德判斷力與洞察力。Discerning right from wrong; moral wisdom.',
    section:'confucianism' },
  { type:'concept', typeLabel:'儒家 · Confucianism',
    titleZh:'信 · 誠信', titleEn:'Xìn · Integrity',
    excerpt:'言而有信，誠實守諾，立身之本。Faithfulness, trustworthiness, keeping one\'s word.',
    section:'confucianism' },
  // ── Taoism ──
  { type:'concept', typeLabel:'道家 · Taoism',
    titleZh:'道 · 宇宙本源', titleEn:'Tào · The Way',
    excerpt:'萬物之本，宇宙運行的根本規律。The fundamental principle underlying all existence.',
    section:'taoism' },
  { type:'concept', typeLabel:'道家 · Taoism',
    titleZh:'德 · 內在德性', titleEn:'Dé · Virtue & Power',
    excerpt:'順道而行所積累的內在力量與品德修為。Virtue accumulated through living with the Tao.',
    section:'taoism' },
  { type:'concept', typeLabel:'道家 · Taoism',
    titleZh:'無為 · 自然而然', titleEn:'Wúwéi · Non-Action',
    excerpt:'順應自然，不強行妄為；以柔克剛，以靜制動。Acting in harmony with natural flow.',
    section:'taoism' },
  { type:'concept', typeLabel:'道家 · Taoism',
    titleZh:'樸 · 純樸自然', titleEn:'Pǔ · Simplicity',
    excerpt:'返璞歸真，摒棄人為的繁瑣，回歸本真。Shedding artifice to rediscover authentic nature.',
    section:'taoism' },
  // ── Timeline figures (built from FIGURES) ──
  ...Object.entries(FIGURES).map(([key, fig]) => ({
    type: 'figure',
    typeLabel: fig.dynastyZh + ' · ' + fig.dynastyEn,
    titleZh: fig.nameZh, titleEn: fig.nameEn,
    metaZh: fig.dynastyZh + '　' + fig.catLabelZh,
    metaEn: fig.dynastyEn + ' · ' + fig.catLabelEn,
    excerpt: fig.quoteZh,
    section: fig.section, figureKey: key,
  })),
];

function openSearch() {
  document.getElementById('search-modal').classList.add('open');
  document.getElementById('search-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('search-input').focus(), 50);
}

function closeSearch() {
  document.getElementById('search-modal').classList.remove('open');
  document.getElementById('search-overlay').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('search-input').value = '';
  _renderHint();
}

function _shHighlight(text, q) {
  if (!text || !q) return text || '';
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(esc, 'gi'), m => `<mark class="sh">${m}</mark>`);
}

function _renderHint() {
  document.getElementById('search-results').innerHTML =
    `<p class="search-hint">
       <span class="zh">輸入關鍵字搜尋詩詞、儒道思想、人物典故…</span>
       <span class="en">Type to search poems, Confucian &amp; Taoist concepts, historical figures…</span>
     </p>`;
}

let _searchResults = [];

function _renderResults(results, q) {
  const box = document.getElementById('search-results');
  if (!results.length) {
    box.innerHTML = q
      ? `<p class="search-no-results">
           <span class="zh">找不到「${q}」的相關結果</span>
           <span class="en">No results for &ldquo;${q}&rdquo;</span>
         </p>`
      : _renderHint() || '';
    return;
  }
  box.innerHTML = results.map((item, i) => {
    const exc = (item.excerpt || '').length > 60
      ? item.excerpt.substring(0, 60) + '…' : (item.excerpt || '');
    return `<div class="search-result-item" tabindex="0" data-idx="${i}"
                 onclick="handleSearchResult(${i})"
                 onkeydown="if(event.key==='Enter')handleSearchResult(${i})">
      <div class="sr-badge">${item.typeLabel}</div>
      <div class="sr-main">
        <div class="sr-title">
          <span class="sr-zh">${_shHighlight(item.titleZh, q)}</span>
          <span class="sr-en">${_shHighlight(item.titleEn, q)}</span>
        </div>
        ${item.metaZh ? `<div class="sr-meta">
          <span class="sr-zh">${item.metaZh}</span>
          <span class="sr-en">${item.metaEn || ''}</span>
        </div>` : ''}
        <div class="sr-excerpt">${_shHighlight(exc, q)}</div>
      </div>
      <span class="sr-arrow">→</span>
    </div>`;
  }).join('');
}

function handleSearchResult(idx) {
  const item = _searchResults[idx];
  if (!item) return;
  closeSearch();
  if (item.figureKey) {
    navigateTo('timeline');
    setTimeout(() => showFigure(item.figureKey), 150);
  } else if (item.elementId) {
    navigateTo(item.section);
    setTimeout(() => {
      const el = document.getElementById(item.elementId);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('search-highlight');
      setTimeout(() => el.classList.remove('search-highlight'), 2200);
    }, 200);
  } else {
    navigateTo(item.section);
  }
}

(function initSearch() {
  const input   = document.getElementById('search-input');
  const openBtn = document.getElementById('search-open');
  if (openBtn) openBtn.addEventListener('click', openSearch);
  _renderHint();

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { _searchResults = []; _renderHint(); return; }
    _searchResults = SEARCH_INDEX.filter(item =>
      [item.titleZh, item.titleEn, item.metaZh, item.metaEn, item.excerpt]
        .some(f => f && f.toLowerCase().includes(q))
    ).slice(0, 12);
    _renderResults(_searchResults, q);
  });

  input.addEventListener('keydown', e => {
    const items = document.querySelectorAll('.search-result-item');
    const cur   = document.querySelector('.search-result-item:focus');
    const idx   = cur ? parseInt(cur.dataset.idx) : -1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (items[idx + 1] || items[0])?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      (items[idx - 1] || items[items.length - 1])?.focus();
    } else if (e.key === 'Enter' && _searchResults.length) {
      handleSearchResult(idx >= 0 ? idx : 0);
    }
  });
})();
