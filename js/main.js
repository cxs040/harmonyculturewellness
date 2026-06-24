/* ════════════════════════════════════════
   CHINESE CULTURE WEBSITE — MAIN JS
   All content lives in js/data.js.
   This file handles rendering + behaviour.
   ════════════════════════════════════════ */

/* ── Azure Speech TTS ── */
const SPEECH_KEY    = (typeof speechConfig !== 'undefined') ? speechConfig.key    : '';
const SPEECH_REGION = (typeof speechConfig !== 'undefined') ? speechConfig.region : '';
let   _ttsAudio     = null;

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
  const btn = document.createElement('div');
  btn.className = 'pdf-btn';
  if (doc.url) {
    btn.classList.add('pdf-btn-external');
    btn.onclick = () => window.open(doc.url, '_blank', 'noopener');
    btn.innerHTML = `
      <span>📜</span>
      <span class="zh">${doc.titleZh}</span>
      <span class="en">${doc.titleEn}</span>
      <span class="pdf-ext-icon">↗</span>
    `;
  } else {
    const path  = `pdfs/${section}/${doc.file}`;
    const title = `${doc.titleZh} — ${doc.titleEn}`;
    btn.onclick = () => openPDF(path, title);
    btn.innerHTML = `
      <span>📜</span>
      <span class="zh">${doc.titleZh}</span>
      <span class="en">${doc.titleEn}</span>
    `;
  }
  return btn;
}

/* ── Populate each section's PDF shelf ── */
function loadSectionShelves() {
  if (typeof DOCUMENTS === 'undefined') return;

  ['confucianism', 'taoism', 'buddhism', 'poetry'].forEach(section => {
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

  const all = ['confucianism', 'taoism', 'buddhism', 'poetry', 'documents']
    .flatMap(section => (DOCUMENTS[section] || []).map(doc => ({ ...doc, section })));

  if (!all.length) { empty.style.display = 'block'; return; }

  const sectionLabel = {
    confucianism: '儒家 · Confucianism',
    taoism:       '道家 · Taoism',
    buddhism:     '释家 · Buddhism',
    poetry:       '詩詞 · Poetry',
    documents:    '典籍 · Classics',
  };

  gallery.innerHTML = all.map(doc => {
    const onclick = doc.url
      ? `window.open('${doc.url}','_blank','noopener')`
      : `openPDF('pdfs/${doc.section}/${doc.file}', '${doc.titleZh} — ${doc.titleEn}')`;
    const extBadge = doc.url ? '<span class="doc-ext-badge">↗ ctext.org</span>' : '';
    return `
      <div class="doc-card${doc.url ? ' doc-external' : ''}" onclick="${onclick}">
        <div class="doc-icon">📜</div>
        <div class="doc-title-zh zh">${doc.titleZh}</div>
        <div class="doc-title-en en">${doc.titleEn}</div>
        <div class="doc-cat">${sectionLabel[doc.section]}${extBadge}</div>
      </div>
    `;
  }).join('');
}


/* ════════════════════════════════════════
   CONTENT RENDERERS
   Called on DOMContentLoaded. Pull all data
   from data.js and write it into the page.
   ════════════════════════════════════════ */

/* ── Philosophy sections: quote + heading + concept list ── */
function renderSectionContent() {
  ['confucianism', 'taoism', 'buddhism'].forEach(sec => {
    const el = document.getElementById(sec + '-content');
    if (!el) return;
    const q     = SECTION_QUOTES[sec];
    const h     = SECTION_HEADINGS[sec];
    const items = CONCEPTS[sec] || [];

    el.innerHTML = `
      <blockquote class="quote-block">
        <p class="zh">"${q.zh}"</p>
        <p class="en">"${q.en}"</p>
        <footer class="zh">— ${q.sourceZh}</footer>
        <footer class="en">— ${q.sourceEn}</footer>
      </blockquote>
      <div class="section-heading">
        <h3 class="zh">${h.zh}</h3>
        <h3 class="en">${h.en}</h3>
      </div>
      <div class="principle-list">
        ${items.map(c => `
          <div class="principle-row">
            <span class="p-char">${c.charZh}</span>
            <div>
              <strong class="zh">${c.titleZh}</strong>
              <strong class="en">${c.titleEn}</strong>
              <p class="zh">${c.descZh}</p>
              <p class="en">${c.descEn}</p>
            </div>
          </div>`).join('')}
      </div>`;
  });
}

/* ── Poetry page: poem grid ── */
function renderPoems() {
  const grid = document.getElementById('poem-grid');
  if (!grid) return;
  grid.innerHTML = POEMS.map(p => `
    <div class="poem-card" id="${p.id}">
      <div class="poem-title">
        <span class="zh">${p.titleZh}</span>
        <span class="en">${p.titleEn}</span>
      </div>
      <div class="poem-author">
        <span class="zh">${p.authorZh}</span>
        <span class="en">${p.authorEn}</span>
      </div>
      <div class="poem-lines zh">${p.linesZh.join('<br>')}</div>
      <div class="poem-lines en">${p.linesEn.join('<br>')}</div>
      <div class="poem-actions">
        <button class="poem-action-btn poem-listen-btn" onclick="togglePoem('${p.id}')" data-poem-id="${p.id}">
          <i class="ti ti-volume"></i>
          <span class="zh">聆聽</span><span class="en">Listen</span>
        </button>
        <button class="poem-action-btn" onclick="sharePoem('${p.id}')" title="Share">
          <i class="ti ti-share"></i>
          <span class="zh">分享</span><span class="en">Share</span>
        </button>
        <button class="poem-action-btn" onclick="printPoem('${p.id}')" title="Print">
          <i class="ti ti-printer"></i>
          <span class="zh">列印</span><span class="en">Print</span>
        </button>
      </div>
    </div>`).join('');
}

/* ── Timeline page: era cards with figure buttons ── */
function renderTimeline() {
  const container = document.getElementById('timeline-eras');
  if (!container) return;
  container.innerHTML = ERAS.map(era => `
    <div class="era-card">
      <div class="era-period">${era.period}</div>
      <div class="era-name-zh">${era.nameZh}</div>
      <div class="era-name-en">${era.nameEn}</div>
      <ul class="era-figures">
        ${era.figures.map(key => {
          const fig = FIGURES[key];
          if (!fig) return '';
          return `<li><button class="era-fig-btn" onclick="showFigure('${key}')">${fig.nameZh} ${fig.nameEn}</button></li>`;
        }).join('')}
      </ul>
    </div>`).join('');
}

/* ── Zhang-Huang Studies: render content by sub-category ── */
function renderZhanghuang() {
  const container = document.getElementById('zhanghuang-content');
  if (!container) return;

  const placeholder = (label) => `
    <div class="zh-placeholder">
      <span class="zh">${label} · 內容即將上線</span>
      <span class="en">${label} · Coming soon</span>
    </div>`;

  let html = '';

  /* ── 語言學 (yuyanxue) ── */
  html += `<div data-cat="yuyanxue">`;
  if (typeof ZHANGHUANG_CHART !== 'undefined') {
    const c = ZHANGHUANG_CHART;
    html += `
    <div class="zh-chart-card" id="${c.id}">
      <div class="zh-chart-head">
        <div class="zh-chart-title zh">${c.titleZh}</div>
        <div class="zh-chart-attr zh">${c.attributionZh}</div>
      </div>
      <div class="zh-chart-section">
        <div class="zh-chart-section-label zh">生物圈</div>
        <div class="zh-chart-block">
          <div class="zh-chart-row">
            <div class="zh-chart-row-head zh">植物圈</div>
            <div class="zh-chart-row-body">
              <div class="zh-chart-line zh"><span class="zh-chart-key">结构要素</span>器官</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">特性·关系</span>植物性 · 形体构造</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">功能</span>生理机能（无系统）</div>
            </div>
          </div>
          <div class="zh-chart-row">
            <div class="zh-chart-row-head zh">动物圈</div>
            <div class="zh-chart-row-body">
              <div class="zh-chart-line zh"><span class="zh-chart-key">结构要素</span>系统（体系）</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">特性·关系</span>动物性 · 系统构造</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">感受器系统</span>察觉之网</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">效应器系统</span>效用之网</div>
              <div class="zh-chart-note zh">德国生物学家乌克威尔认为，没有这两套系统的互相协作和平衡，生命体不可能存在。两套系统紧密交织，联结成"动物功能圈"。</div>
            </div>
          </div>
        </div>
      </div>
      <div class="zh-chart-section">
        <div class="zh-chart-section-label zh">人类系统</div>
        <div class="zh-chart-block">
          <div class="zh-chart-row">
            <div class="zh-chart-row-head zh">生命性</div>
            <div class="zh-chart-row-body">
              <div class="zh-chart-line zh"><span class="zh-chart-key">结构关系</span>生命体系</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">感受系统</span>认知、察觉、感知网络</div>
              <div class="zh-chart-line zh"><span class="zh-chart-key">效应系统</span>反应、行动、效用网络</div>
              <div class="zh-chart-note zh">研究其数量、状态、性质、分布状态、神经系统状态等，就能够给予我们生命体内外世界精确"图像"。</div>
            </div>
          </div>
          <div class="zh-chart-row">
            <div class="zh-chart-row-head zh">社会性</div>
            <div class="zh-chart-row-body">
              <div class="zh-chart-line zh"><span class="zh-chart-key">社会体系</span>符号系统是基石</div>
              <div class="zh-chart-path zh">人与人类社会发展路径：人 ── 使用符号 ── 创造符号（卡西尔）</div>
              <div class="zh-chart-symbols">
                <div class="zh-chart-sym-row">
                  <div class="zh-chart-sym-top"><span class="zh-chart-sym-tag zh">象征符号</span><span class="zh">比喻 · 象征 · 表征 · 艺术 · 创意 · 创新</span></div>
                  <div class="zh-chart-note zh">指那些用以表征人的思想、行为倾向的种种事物。如：图腾物、国旗、国徽、雕塑、纪念碑、庙宇等。</div>
                </div>
                <div class="zh-chart-sym-row">
                  <div class="zh-chart-sym-top"><span class="zh-chart-sym-tag zh">中介符号</span><span class="zh">载体桥梁 · 传递传承 · 转换平台</span></div>
                  <div class="zh-chart-note zh">指被用以作为接受和反馈信息的载体的一类符号。例如：文字、石器、机器等。</div>
                </div>
                <div class="zh-chart-sym-row">
                  <div class="zh-chart-sym-top"><span class="zh-chart-sym-tag zh">工具符号</span><span class="zh">预知应对 · 改造创造 · 制造创新</span></div>
                  <div class="zh-chart-note zh">指那些被用以扩展自我思想、行为的工具。语言是使用最多、意义最大的工具符号，也是制造与创造符号的符号。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="zh-chart-section">
        <div class="zh-chart-section-label zh">社会形态</div>
        <div class="zh-chart-social-wrap">
          <table class="zh-chart-social">
            <thead>
              <tr>
                <th class="zh">社会形态</th><th class="zh">特性</th>
                <th class="zh">主客体关系</th><th class="zh">人的类型</th><th class="zh">心理状态</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="zh">蒙昧社会</td><td class="zh">表象性</td><td class="zh">自然一人</td><td class="zh">自然人</td><td class="zh zh-chart-state">自在</td></tr>
              <tr><td rowspan="3" class="zh">文化社会<br>（含科学社会）</td><td class="zh">物质性</td><td class="zh">人一自然物</td><td class="zh">社会人</td><td class="zh zh-chart-state">自明</td></tr>
              <tr><td class="zh">物化性</td><td class="zh">人一人工物</td><td class="zh">异化人</td><td class="zh zh-chart-state-loss">自失</td></tr>
              <tr><td class="zh">理性化</td><td class="zh">人一发明物</td><td class="zh">文化人</td><td class="zh zh-chart-state">自觉</td></tr>
              <tr><td class="zh">文明社会</td><td class="zh">智能通融</td><td class="zh">人一自己</td><td class="zh">文明人</td><td class="zh zh-chart-state">自由</td></tr>
              <tr><td class="zh">宇宙蒙昧</td><td class="zh">智慧性</td><td class="zh">人一宇宙</td><td class="zh">宇宙人</td><td class="zh zh-chart-state-peak">自由自在</td></tr>
            </tbody>
          </table>
        </div>
        <div class="zh-chart-note zh" style="margin-top:0.6rem">
          1、人类系统，主要由感受系统、效应系统、符号系统组成。<br>
          2、构成社会体系与社会形态的核心要素，则是符号系统。<br>
          3、符号的意义是随时代变化、地区空间变化而变化的。
        </div>
      </div>
      <div class="zh-chart-ref zh">注：${c.referenceZh}</div>
      <div class="poem-actions">
        <button class="poem-action-btn poem-listen-btn" onclick="togglePoem('${c.id}')" data-poem-id="${c.id}">
          <i class="ti ti-volume"></i>
          <span class="zh">聆聽</span><span class="en">Listen</span>
        </button>
      </div>
    </div>`;
  }
  html += `
  <div class="zh-subsub-section">
    <div class="zh-subsub-head zh">音韻格律學 · Phonology &amp; Prosody</div>
    <div class="zh-subsub-item">
      <div class="zh-subsub-label zh">講義</div>
      ${placeholder('講義')}
    </div>
  </div>
  </div>`; /* end yuyanxue */

  /* ── 文字學 (wenzixue) ── */
  html += `<div data-cat="wenzixue">
    <div class="zh-subsub-section">
      <div class="zh-subsub-head zh">說文學 · Etymology</div>
      ${placeholder('說文學')}
    </div>
    <div class="zh-subsub-section">
      <div class="zh-subsub-head zh">形構學 · Structural Analysis</div>
      ${placeholder('形構學')}
    </div>
  </div>`;

  /* ── 哲學 ── */
  html += `<div data-cat="zhexue">${placeholder('哲學')}</div>`;

  /* ── 史學 ── */
  html += `<div data-cat="shixue">${placeholder('史學')}</div>`;

  /* ── 經濟學 ── */
  html += `<div data-cat="jingjixue">${placeholder('經濟學')}</div>`;

  /* ── 文學 (wenxue) — 律詩定稿 ── */
  if (typeof ZHANGHUANG_POEMS !== 'undefined') {
    html += `
    <div data-cat="wenxue">
      <div class="zhanghuang-intro">
        <p class="zh">律詩定稿 · 王天舒律詩修定稿小彙</p>
      </div>
      <div class="poem-grid">
        ${ZHANGHUANG_POEMS.map(p => `
          <div class="poem-card" id="${p.id}">
            <div class="poem-title"><span class="zh">${p.titleZh}</span></div>
            <div class="poem-author"><span class="zh">${p.subtitleZh}</span></div>
            <div class="poem-lines zh">${p.linesZh.join('<br>')}</div>
            ${p.noteZh ? `<div class="poem-note zh">${p.noteZh}</div>` : ''}
            <div class="poem-actions">
              <button class="poem-action-btn poem-listen-btn" onclick="togglePoem('${p.id}')" data-poem-id="${p.id}">
                <i class="ti ti-volume"></i>
                <span class="zh">聆聽</span><span class="en">Listen</span>
              </button>
              <button class="poem-action-btn" onclick="sharePoem('${p.id}')">
                <i class="ti ti-share"></i>
                <span class="zh">分享</span><span class="en">Share</span>
              </button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }

  /* ── 中醫學 ── */
  html += `<div data-cat="zhongyixue">${placeholder('中醫學')}</div>`;

  /* ── 玄學 ── */
  html += `<div data-cat="xuanxue">${placeholder('玄學')}</div>`;

  container.innerHTML = html;
  initZhanghuangTabs();
}

/* ════════════════════════════════════════
   DONOR SCROLLING BANNER
   ════════════════════════════════════════ */
function renderDonorBanner() {
  const c1 = document.getElementById('donor-copy-1');
  const c2 = document.getElementById('donor-copy-2');
  if (!c1 || typeof DONORS === 'undefined' || !DONORS.length) return;

  const sep = '　　✦　　';
  const text = DONORS.map(d =>
    `✦ 承蒙 ${d.nameZh} ${d.titleZh} 慷慨捐贈 ${d.amountZh}，${d.msgZh}！`
  ).join(sep) + sep;

  c1.textContent = text;
  c2.textContent = text;

  /* Speed: one full scroll = ~40 s regardless of text length */
  const track = document.getElementById('donor-marquee-track');
  if (track) {
    const duration = Math.max(30, DONORS.length * 5);
    track.style.animationDuration = duration + 's';
  }
}

/* ════════════════════════════════════════
   乐读会 SECTION
   ════════════════════════════════════════ */
function renderLeduhui() {
  const el = document.getElementById('leduhui-content');
  if (!el) return;
  el.innerHTML = `
    <blockquote class="quote-block">
      <p class="zh">"讀書之法，在循序而漸進，熟讀而精思。"</p>
      <p class="en">"The method of reading is to proceed step by step, to read thoroughly and think deeply."</p>
      <footer class="zh">— 朱熹《讀書之要》</footer>
      <footer class="en">— Zhu Xi, On the Essentials of Reading</footer>
    </blockquote>
    <div class="section-heading">
      <h3 class="zh">乐读会 · 共讀共長</h3>
      <h3 class="en">Reading Club · Learn Together, Grow Together</h3>
    </div>
    <div class="leduhui-intro">
      <p class="zh">
        乐读会是一個以閱讀為紐帶的學習社群。在這裡，我們分享書籍心得，探討思想，
        以書會友，以文化人，讓知識在交流中昇華，讓智慧在共讀中傳承。
      </p>
      <p class="en">
        乐读会 is a learning community united by the joy of reading. Here we share reflections,
        explore ideas, meet through books, and cultivate character through culture — letting knowledge
        deepen through dialogue and wisdom endure through shared reading.
      </p>
    </div>
    <div class="leduhui-placeholder">
      <div class="zh">書目討論區域 · 即將開放</div>
      <div class="en">Book discussions · Coming soon</div>
    </div>`;
}

/* ════════════════════════════════════════
   ZHANG-HUANG SUBCATEGORY TABS
   ════════════════════════════════════════ */
function initZhanghuangTabs() {
  const subcats = document.querySelector('.zh-subcats');
  if (!subcats || subcats._tabsInited) return;
  subcats._tabsInited = true;

  function applyTab(cat) {
    subcats.querySelectorAll('.zh-subcat-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.cat === cat)
    );
    const content = document.getElementById('zhanghuang-content');
    if (!content) return;
    content.querySelectorAll('[data-cat]').forEach(el => {
      el.style.display = (el.dataset.cat === cat) ? '' : 'none';
    });
  }

  const firstActive = subcats.querySelector('.zh-subcat-btn.active');
  if (firstActive) applyTab(firstActive.dataset.cat);

  subcats.addEventListener('click', e => {
    const btn = e.target.closest('.zh-subcat-btn');
    if (!btn) return;
    applyTab(btn.dataset.cat);
  });
}

/* ════════════════════════════════════════
   DOCUMENTS SUB-TABS (經 史 子 集 章黃學庫)
   ════════════════════════════════════════ */
function initDocumentsTabs() {
  const tabBar = document.querySelector('.docs-subtabs');
  if (!tabBar || tabBar._tabsInited) return;
  tabBar._tabsInited = true;

  function applyTab(subcat) {
    tabBar.querySelectorAll('.docs-subtab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.subcat === subcat)
    );
    document.querySelectorAll('.docs-subcat-content').forEach(el => {
      el.style.display = (el.dataset.subcat === subcat) ? '' : 'none';
    });
  }

  const firstActive = tabBar.querySelector('.docs-subtab-btn.active');
  if (firstActive) applyTab(firstActive.dataset.subcat);

  tabBar.addEventListener('click', e => {
    const btn = e.target.closest('.docs-subtab-btn');
    if (!btn) return;
    applyTab(btn.dataset.subcat);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSectionContent();
  renderPoems();
  renderZhanghuang();
  renderLeduhui();
  renderDonorBanner();
  renderTimeline();
  loadSectionShelves();
  loadDocumentArchive();
  initFigureMap();
  initZhanghuangTabs();
  initDocumentsTabs();
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
    if (btn) btn.textContent = '☀';
  }
  if (!btn) return;
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

  const decBtn = document.getElementById('font-decrease');
  const incBtn = document.getElementById('font-increase');
  if (decBtn) decBtn.addEventListener('click', () => { if (idx > 0) { idx--; applySize(); } });
  if (incBtn) incBtn.addEventListener('click', () => { if (idx < SIZES.length - 1) { idx++; applySize(); } });
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
   Pulls from QUOTES array in data.js
   ════════════════════════════════════════ */
(function initQuoteOfDay() {
  const now     = new Date();
  const start   = new Date(now.getFullYear(), 0, 0);
  const dayOfYr = Math.floor((now - start) / 86400000);
  const q       = QUOTES[dayOfYr % QUOTES.length];

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
  document.querySelectorAll('.poem-card.print-target')
    .forEach(c => c.classList.remove('print-target'));

  const card = document.getElementById(cardId);
  if (!card) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('documents').classList.add('active');

  card.classList.add('print-target');
  window.print();

  card.classList.remove('print-target');
  navigateTo('documents');
}

/* ════════════════════════════════════════
   FEATURE 7 — POEM TEXT-TO-SPEECH
   Azure AI Speech REST API (no SDK needed)
   ════════════════════════════════════════ */
async function togglePoem(poemId) {
  if (_ttsAudio && !_ttsAudio.paused) {
    _ttsAudio.pause();
    _ttsAudio = null;
    document.querySelectorAll('.poem-listen-btn').forEach(b =>
      _setListenBtnState(b.dataset.poemId, 'idle')
    );
    return;
  }

  if (_ttsAudio) { _ttsAudio.pause(); _ttsAudio = null; }
  document.querySelectorAll('.poem-listen-btn').forEach(b =>
    _setListenBtnState(b.dataset.poemId, 'idle')
  );

  const allPoems = [
    ...(typeof POEMS !== 'undefined' ? POEMS : []),
    ...(typeof ZHANGHUANG_POEMS !== 'undefined' ? ZHANGHUANG_POEMS : []),
    ...(typeof ZHANGHUANG_CHART !== 'undefined' ? [ZHANGHUANG_CHART] : []),
  ];
  const poem = allPoems.find(p => p.id === poemId);
  if (!poem) return;

  _setListenBtnState(poemId, 'loading');

  const text = poem.titleZh + '。' + poem.linesZh.join('');
  const ssml = `<speak version='1.0' xml:lang='zh-TW'><voice name='zh-TW-HsiaoChenNeural'>${text}</voice></speak>`;

  try {
    const res = await fetch(
      `https://${SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-160kbitrate-mono-mp3',
        },
        body: ssml,
      }
    );
    if (!res.ok) throw new Error('TTS error');
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    _ttsAudio  = new Audio(url);
    _setListenBtnState(poemId, 'playing');
    _ttsAudio.onended = () => {
      _setListenBtnState(poemId, 'idle');
      URL.revokeObjectURL(url);
      _ttsAudio = null;
    };
    _ttsAudio.play();
  } catch {
    _setListenBtnState(poemId, 'idle');
  }
}

function _setListenBtnState(poemId, state) {
  const btn = document.querySelector(`#${poemId} .poem-listen-btn`);
  if (!btn) return;
  btn.classList.remove('tts-loading', 'tts-playing');
  const icon = btn.querySelector('i');
  const zh   = btn.querySelector('.zh');
  const en   = btn.querySelector('.en');
  if (state === 'loading') {
    btn.classList.add('tts-loading');
    if (icon) icon.className = 'ti ti-loader-2';
    if (zh) zh.textContent = '載入…';
    if (en) en.textContent = 'Loading…';
  } else if (state === 'playing') {
    btn.classList.add('tts-playing');
    if (icon) icon.className = 'ti ti-player-stop';
    if (zh) zh.textContent = '停止';
    if (en) en.textContent = 'Stop';
  } else {
    if (icon) icon.className = 'ti ti-volume';
    if (zh) zh.textContent = '聆聽';
    if (en) en.textContent = 'Listen';
  }
}

/* ════════════════════════════════════════
   FEATURE 8 — AZURE MAPS
   Shows all historical figures as pins on a
   map of China. Clicking a figure name pans
   the map to their birthplace.
   ════════════════════════════════════════ */
let _map        = null;
let _mapReady   = false;
let _mapPopup   = null;
let _pendingKey = null;

function initFigureMap() {
  const MAPS_KEY = (typeof mapsConfig !== 'undefined') ? mapsConfig.key : '';
  if (!MAPS_KEY || MAPS_KEY === 'PLACEHOLDER' || typeof atlas === 'undefined') return;

  _map = new atlas.Map('figure-map', {
    center: [108, 34],
    zoom: 3.8,
    language: 'zh-Hant',
    style: 'road',
    authOptions: { authType: 'subscriptionKey', subscriptionKey: MAPS_KEY },
  });

  _mapPopup = new atlas.Popup({ pixelOffset: [0, -20], closeButton: true });

  _map.events.add('ready', () => {
    _mapReady = true;

    const datasource = new atlas.source.DataSource();
    _map.sources.add(datasource);

    const catColors = {
      confucianism: '#8B1A1A',
      taoism:       '#2E6B4F',
      poetry:       '#C9A96E',
      documents:    '#4A5568',
    };

    const symbolLayer = new atlas.layer.SymbolLayer(datasource, null, {
      iconOptions: { image: 'pin-round-red', anchor: 'bottom', allowOverlap: true },
      textOptions: {
        textField: ['get', 'nameZh'],
        offset: [0, -2.8],
        color: '#5a0d0d',
        haloColor: '#fff',
        haloWidth: 2,
        size: 13,
        allowOverlap: false,
      },
      filter: ['has', 'nameZh'],
    });
    _map.layers.add(symbolLayer);

    Object.entries(FIGURES).forEach(([key, fig]) => {
      if (!fig.lat || !fig.lng) return;
      datasource.add(new atlas.data.Feature(
        new atlas.data.Point([fig.lng, fig.lat]),
        { key, nameZh: fig.nameZh, nameEn: fig.nameEn,
          dynastyZh: fig.dynastyZh, dynastyEn: fig.dynastyEn,
          locationZh: fig.locationZh || '', locationEn: fig.locationEn || '' }
      ));
    });

    _map.events.add('click', symbolLayer, e => {
      if (!e.shapes || !e.shapes.length) return;
      const props = e.shapes[0].getProperties();
      const coords = e.shapes[0].getCoordinates();
      _showMapPopup(coords, props);
      showFigure(props.key);
    });

    _map.events.add('mouseover', symbolLayer, () => {
      _map.getCanvasContainer().style.cursor = 'pointer';
    });
    _map.events.add('mouseout', symbolLayer, () => {
      _map.getCanvasContainer().style.cursor = '';
    });

    if (_pendingKey) { panMapToFigure(_pendingKey); _pendingKey = null; }
  });
}

function panMapToFigure(key) {
  const fig = FIGURES[key];
  if (!fig || !fig.lat || !fig.lng) return;
  if (!_mapReady) { _pendingKey = key; return; }
  _map.setCamera({ center: [fig.lng, fig.lat], zoom: 6, type: 'fly', duration: 900 });

  document.getElementById('figure-map')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function _showMapPopup(coords, props) {
  if (!_mapPopup) return;
  const isZh = currentLang === 'zh';
  _mapPopup.setOptions({
    position: coords,
    content: `<div class="map-popup">
      <div class="map-popup-name">${props.nameZh} ${props.nameEn}</div>
      <div class="map-popup-dynasty">${isZh ? props.dynastyZh : props.dynastyEn}</div>
      <div class="map-popup-loc">${isZh ? props.locationZh : props.locationEn}</div>
    </div>`,
  });
  _mapPopup.open(_map);
}

/* ════════════════════════════════════════
   FIGURE MODAL — show famous passage
   Uses FIGURES from data.js
   ════════════════════════════════════════ */
function showFigure(figId) {
  const fig     = FIGURES[figId];
  const modal   = document.getElementById('fig-modal');
  const overlay = document.getElementById('fig-overlay');
  if (!fig || !modal || !overlay) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('fig-name-zh',    fig.nameZh);
  set('fig-name-en',    fig.nameEn);
  set('fig-dynasty-zh', fig.dynastyZh);
  set('fig-dynasty-en', fig.dynastyEn);
  set('fig-cat-badge',  fig.catLabelZh + ' · ' + fig.catLabelEn);
  set('fig-quote-zh',   '「' + fig.quoteZh + '」');
  set('fig-quote-en',   fig.quoteEn);
  set('fig-src-zh',     fig.sourceZh);
  set('fig-src-en',     fig.sourceEn);

  const btn = document.getElementById('fig-explore-btn');
  if (btn) {
    const zh = btn.querySelector('.fig-btn-zh');
    const en = btn.querySelector('.fig-btn-en');
    if (zh) zh.textContent = '探索' + fig.catLabelZh + ' →';
    if (en) en.textContent = 'Explore ' + fig.catLabelEn + ' →';
    btn.onclick = () => { closeFigure(); navigateTo(fig.section); };
  }

  modal.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  panMapToFigure(figId);
}

function closeFigure() {
  document.getElementById('fig-modal').classList.remove('open');
  document.getElementById('fig-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════════════
   HANZIWRITER — home page stroke animations
   ════════════════════════════════════════ */
function initHanziWriter() {
  if (typeof HanziWriter === 'undefined') return;

  const charDataLoader = (char, onComplete, onError) => {
    const urls = [
      `https://cdn.jsdelivr.net/npm/hanzi-writer-data@latest/${encodeURIComponent(char)}.json`,
      `https://unpkg.com/hanzi-writer-data@latest/${encodeURIComponent(char)}.json`,
    ];
    let attempt = 0;
    function tryNext() {
      if (attempt >= urls.length) { onError(); return; }
      fetch(urls[attempt++])
        .then(r => { if (!r.ok) throw new Error('bad status'); return r.json(); })
        .then(onComplete)
        .catch(tryNext);
    }
    tryNext();
  };

  const chars = [
    { id: 'hw-ren',  char: '仁' },
    { id: 'hw-dao',  char: '道' },
    { id: 'hw-shi',  char: '空' },
    { id: 'hw-juan', char: '卷' },
  ];

  chars.forEach(({ id, char }) => {
    const el = document.getElementById(id);
    if (!el) return;

    let settled = false;
    const fallback = setTimeout(() => {
      if (!settled) { settled = true; el.textContent = char; }
    }, 5000);

    el.textContent = '';

    try {
      const writer = HanziWriter.create(id, char, {
        width: 80, height: 80, padding: 5,
        strokeColor: '#8B1A1A', outlineColor: 'rgba(201,169,110,0.3)',
        drawingWidth: 3, strokeAnimationSpeed: 1,
        delayBetweenStrokes: 150, delayBetweenLoops: 3000, loop: true,
        charDataLoader,
        onLoadCharDataSuccess: () => { settled = true; clearTimeout(fallback); },
        onLoadCharDataError:   () => { settled = true; clearTimeout(fallback); el.textContent = char; },
      });
      writer.animateCharacter();
      el.addEventListener('mouseenter', () => writer.animateCharacter());
    } catch (e) {
      clearTimeout(fallback);
      el.textContent = char;
    }
  });
}

if (document.readyState === 'complete') {
  initHanziWriter();
} else {
  window.addEventListener('load', initHanziWriter);
}


/* ════════════════════════════════════════
   SEARCH — auto-built from data.js
   Adding content to data.js automatically
   makes it searchable here.
   ════════════════════════════════════════ */
const SEARCH_INDEX = [

  // Poems — built from POEMS in data.js
  ...POEMS.map(p => ({
    type: 'poem', typeLabel: '詩詞 · Poem',
    titleZh: p.titleZh,  titleEn: p.titleEn,
    metaZh:  p.authorZh, metaEn:  p.authorEn,
    excerpt: p.linesZh.join(''),
    section: 'documents', elementId: p.id,
  })),

  // Concepts — built from CONCEPTS in data.js
  ...['confucianism', 'taoism'].flatMap(sec =>
    (CONCEPTS[sec] || []).map(c => ({
      type: 'concept',
      typeLabel: sec === 'confucianism' ? '儒家 · Confucianism' : '道家 · Taoism',
      titleZh: c.titleZh, titleEn: c.titleEn,
      excerpt: c.descZh + ' ' + c.descEn,
      section: sec,
    }))
  ),

  // Figures — built from FIGURES in data.js
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

/* ════════════════════════════════════════
   VOICE SEARCH
   Uses Web Speech API (Chrome + Safari iOS)
   ════════════════════════════════════════ */
(function initVoiceSearch() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = document.getElementById('voice-search-btn');
  if (!btn) return;

  btn.style.display = 'flex'; // always show

  if (!SpeechRecognition) {
    // iOS Safari / unsupported: focus input so the keyboard (with its mic) appears
    btn.addEventListener('click', () => {
      setTimeout(() => document.getElementById('search-input')?.focus(), 80);
    });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous     = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  btn.addEventListener('click', () => {
    recognition.lang = currentLang === 'zh' ? 'zh-TW' : 'en-US';
    recognition.start();
    btn.classList.add('listening');
  });

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript.trim();
    btn.classList.remove('listening');
    openSearch();
    const input = document.getElementById('search-input');
    if (!input) return;
    input.value = transcript;
    input.dispatchEvent(new Event('input'));
  };

  recognition.onerror = () => btn.classList.remove('listening');
  recognition.onend   = () => btn.classList.remove('listening');
})();

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
