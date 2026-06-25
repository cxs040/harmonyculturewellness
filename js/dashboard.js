/* ══════════════════════════════════════════
   DASHBOARD — Content Management System
   ══════════════════════════════════════════ */

/* ── Section metadata ─────────────────── */
const SECTIONS = {
  timeline:                  { label: '歷史年表',    type: 'timeline' },
  confucianism:              { label: '儒家',         type: 'content'  },
  taoism:                    { label: '道家',         type: 'content'  },
  buddhism:                  { label: '釋家',         type: 'content'  },
  'documents-jing':          { label: '典籍文獻 · 經', type: 'docs'     },
  'documents-shi':           { label: '典籍文獻 · 史', type: 'docs'     },
  'documents-zi':            { label: '典籍文獻 · 子', type: 'docs'     },
  'documents-ji':            { label: '典籍文獻 · 集', type: 'docs'     },
  'documents-zhanghuangku':  { label: '典籍文獻 · 章黃學庫', type: 'docs' },
  'zhanghuang-yuyanxue':     { label: '章黃學 · 語言學', type: 'content' },
  'zhanghuang-wenzixue':     { label: '章黃學 · 文字學', type: 'content' },
  'zhanghuang-zhexue':       { label: '章黃學 · 哲學',   type: 'content' },
  'zhanghuang-shixue':       { label: '章黃學 · 史學',   type: 'content' },
  'zhanghuang-jingjixue':    { label: '章黃學 · 經濟學', type: 'content' },
  'zhanghuang-wenxue':       { label: '章黃學 · 文學',   type: 'content' },
  'zhanghuang-zhongyixue':   { label: '章黃學 · 中醫學', type: 'content' },
  'zhanghuang-xuanxue':      { label: '章黃學 · 玄學',   type: 'content' },
  reading:                   { label: '樂讀會',        type: 'content'  },
};

const ERA_OPTIONS = [
  { en: 'Spring & Autumn', zh: '春秋時代' },
  { en: 'Warring States',  zh: '戰國時代' },
  { en: 'Han Dynasty',     zh: '漢朝'     },
  { en: 'Tang Dynasty',    zh: '唐朝'     },
  { en: 'Song Dynasty',    zh: '宋朝'     },
  { en: 'Yuan · Ming · Qing', zh: '元明清' },
];

/* ── State ─────────────────────────────── */
let currentUser = null;
let currentSection = 'timeline';
let allFigures = [];

/* ══════════════════════════════════════════
   INIT / AUTH
   ══════════════════════════════════════════ */
async function init() {
  try {
    const res = await apiGet('/api/userinfo');
    if (res.status === 401) {
      // Not authenticated — show login screen
      document.getElementById('auth-screen').style.display = 'flex';
      return;
    }
    if (res.status === 403) {
      // Authenticated but not in allowlist
      document.getElementById('auth-screen').style.display = 'none';
      document.getElementById('access-denied').style.display = 'flex';
      return;
    }
    const user = await res.json();
    currentUser = user;
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('dash-layout').style.display = 'flex';
    document.getElementById('sidebar-email').textContent = user.email;
    document.getElementById('topbar-badge').textContent = user.isAdmin ? '管理員' : '編輯';
    setupNav();
    showSection('timeline');
  } catch {
    // API unreachable — local dev fallback
    currentUser = { email: 'local-dev', isAdmin: true };
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('dash-layout').style.display = 'flex';
    document.getElementById('sidebar-email').textContent = 'Local Dev';
    document.getElementById('topbar-badge').textContent = '管理員';
    setupNav();
    showSection('timeline');
  }
}

function logout() {
  window.location.href = '/.auth/logout?post_logout_redirect_uri=/';
}

/* ══════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════ */
function setupNav() {
  document.querySelectorAll('.nav-item[data-section]').forEach(el => {
    el.addEventListener('click', () => {
      const sec = el.dataset.section;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      showSection(sec);
    });
  });
}

function showSection(section) {
  currentSection = section;
  const meta = SECTIONS[section];
  document.getElementById('topbar-title').textContent = meta ? meta.label : section;

  if (!meta) return;
  if (meta.type === 'timeline') {
    renderTimelineSection();
  } else if (meta.type === 'docs') {
    renderDocsSection(section);
  } else {
    renderContentSection(section);
  }
}

/* ══════════════════════════════════════════
   TIMELINE SECTION
   ══════════════════════════════════════════ */
async function renderTimelineSection() {
  const el = document.getElementById('dash-content');
  el.innerHTML = `<div class="empty-state"><div class="spinner"></div></div>`;

  let figures = [];
  let storageError = false;
  try {
    const res = await apiGet('/api/figures');
    if (!res.ok) throw new Error(await res.text());
    figures = await res.json();
  } catch {
    storageError = true;
  }

  allFigures = figures;
  renderFigureTableHTML(figures, storageError);
}

function renderFigureTableHTML(figures, storageError = false) {
  const el = document.getElementById('dash-content');

  // Group by dynasty
  const byEra = {};
  ERA_OPTIONS.forEach(e => { byEra[e.en] = []; });
  figures.forEach(f => {
    const key = f.dynastyEn || f.partitionKey || 'Unknown';
    if (!byEra[key]) byEra[key] = [];
    byEra[key].push(f);
  });

  let html = storageError ? storageNotConfiguredBanner('figures') : '';
  html += `
    <div class="panel">
      <div class="panel-title">
        <span>歷史人物管理</span>
        <button class="btn btn-primary btn-sm" onclick="openAddFigureModal()">＋ 新增人物</button>
      </div>
      <p style="font-size:.78rem;color:var(--dash-muted);margin-bottom:1rem">
        共 ${figures.length} 位人物。新增或刪除人物後，網站年表將即時更新。
      </p>`;

  ERA_OPTIONS.forEach(era => {
    const list = byEra[era.en] || [];
    html += `
      <h4 style="font-size:.78rem;color:var(--dash-gold);margin:.9rem 0 .4rem;letter-spacing:.05em">
        ${era.zh} · ${era.en} (${list.length})
      </h4>`;

    if (!list.length) {
      html += `<p class="empty-state" style="padding:.5rem">此朝代暫無人物</p>`;
    } else {
      html += `<table class="dash-table"><thead><tr>
        <th>人物</th><th>學派</th><th>操作</th>
      </tr></thead><tbody>`;
      list.forEach(f => {
        const id = f.rowKey || f.id;
        const dynEn = f.dynastyEn || f.partitionKey;
        html += `<tr>
          <td>
            <div class="cell-name-zh">${esc(f.nameZh || '')}</div>
            <div class="cell-name-en">${esc(f.nameEn || '')}</div>
          </td>
          <td style="font-size:.78rem;color:var(--dash-muted)">${esc(f.catLabelZh || '')}</td>
          <td class="cell-actions">
            <button class="btn btn-ghost btn-sm" onclick='openEditFigureModal(${JSON.stringify(f)})'>編輯</button>
            <button class="btn btn-danger btn-sm" onclick="deleteFigure('${esc(dynEn)}','${esc(id)}')">刪除</button>
          </td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }
  });

  html += `</div>`;

  // Seed section (admin only)
  if (currentUser && currentUser.isAdmin) {
    html += `
      <div class="panel" style="border-color:rgba(201,168,76,.3)">
        <div class="panel-title"><span>資料初始化</span></div>
        <p style="font-size:.78rem;color:var(--dash-muted);margin-bottom:.75rem">
          首次使用時，可將 data.js 中的現有人物資料匯入 Azure Storage。此操作只需執行一次。
        </p>
        <button class="btn btn-ghost btn-sm" onclick="seedFigures()">從 data.js 匯入所有人物</button>
        <span id="seed-status" style="margin-left:.75rem;font-size:.78rem;color:var(--dash-muted)"></span>
      </div>`;
  }

  el.innerHTML = html;
}

function storageNotConfiguredBanner(type) {
  return `
    <div class="panel" style="border-color:rgba(224,82,82,.4);margin-bottom:1rem">
      <div class="panel-title" style="color:var(--dash-red)"><span>⚠ Azure Storage 未設定</span></div>
      <p style="font-size:.82rem;color:var(--dash-muted);line-height:1.7">
        尚未設定 <code>STORAGE_CONNECTION_STRING</code> 環境變數。<br/>
        請前往 <strong>Azure Portal → Static Web Apps → Configuration</strong> 新增：
      </p>
      <ul style="font-size:.78rem;color:var(--dash-muted);margin:.5rem 0 0 1.2rem;line-height:1.8">
        <li><code>STORAGE_CONNECTION_STRING</code> — Azure Storage 連接字串</li>
        <li><code>ADMIN_EMAIL</code> — 管理員信箱</li>
        <li><code>USER_EMAIL</code> — 編輯員信箱</li>
      </ul>
    </div>`;
}

/* ── Figure modal ───────────────────────── */
function openAddFigureModal() {
  document.getElementById('figure-modal-title').textContent = '新增歷史人物';
  document.getElementById('figure-form').reset();
  document.getElementById('fig-edit-id').value = '';
  document.getElementById('fig-edit-dynasty').value = '';
  document.getElementById('fig-id').disabled = false;
  document.getElementById('fig-submit-btn').textContent = '新增';
  document.getElementById('figure-modal').classList.add('open');
}

function openEditFigureModal(fig) {
  const id = fig.rowKey || fig.id;
  const dynEn = fig.dynastyEn || fig.partitionKey || '';
  document.getElementById('figure-modal-title').textContent = `編輯：${fig.nameZh || id}`;
  document.getElementById('fig-edit-id').value = id;
  document.getElementById('fig-edit-dynasty').value = dynEn;
  document.getElementById('fig-id').value = id;
  document.getElementById('fig-id').disabled = true;
  document.getElementById('fig-dynasty').value = dynEn;
  document.getElementById('fig-name-zh').value = fig.nameZh || '';
  document.getElementById('fig-name-en').value = fig.nameEn || '';
  document.getElementById('fig-dynasty-zh').value = fig.dynastyZh || '';
  document.getElementById('fig-cat-zh').value = fig.catLabelZh || '';
  document.getElementById('fig-cat-en').value = fig.catLabelEn || '';
  document.getElementById('fig-section').value = fig.section || 'documents';
  document.getElementById('fig-lat').value = fig.lat || '';
  document.getElementById('fig-lng').value = fig.lng || '';
  document.getElementById('fig-loc-zh').value = fig.locationZh || '';
  document.getElementById('fig-loc-en').value = fig.locationEn || '';
  document.getElementById('fig-quote-zh').value = fig.quoteZh || '';
  document.getElementById('fig-quote-en').value = fig.quoteEn || '';
  document.getElementById('fig-source-zh').value = fig.sourceZh || '';
  document.getElementById('fig-source-en').value = fig.sourceEn || '';
  document.getElementById('fig-submit-btn').textContent = '儲存更改';
  document.getElementById('figure-modal').classList.add('open');
}

function closeFigureModal() {
  document.getElementById('figure-modal').classList.remove('open');
}

async function submitFigureForm(e) {
  e.preventDefault();
  const editId = document.getElementById('fig-edit-id').value;
  const editDynasty = document.getElementById('fig-edit-dynasty').value;
  const isEdit = !!editId;

  const body = {
    id:          isEdit ? editId : document.getElementById('fig-id').value.trim(),
    dynastyEn:   document.getElementById('fig-dynasty').value,
    nameZh:      document.getElementById('fig-name-zh').value.trim(),
    nameEn:      document.getElementById('fig-name-en').value.trim(),
    dynastyZh:   document.getElementById('fig-dynasty-zh').value.trim(),
    catLabelZh:  document.getElementById('fig-cat-zh').value.trim(),
    catLabelEn:  document.getElementById('fig-cat-en').value.trim(),
    section:     document.getElementById('fig-section').value,
    lat:         parseFloat(document.getElementById('fig-lat').value) || 35.0,
    lng:         parseFloat(document.getElementById('fig-lng').value) || 105.0,
    locationZh:  document.getElementById('fig-loc-zh').value.trim(),
    locationEn:  document.getElementById('fig-loc-en').value.trim(),
    quoteZh:     document.getElementById('fig-quote-zh').value.trim(),
    quoteEn:     document.getElementById('fig-quote-en').value.trim(),
    sourceZh:    document.getElementById('fig-source-zh').value.trim(),
    sourceEn:    document.getElementById('fig-source-en').value.trim(),
  };

  const btn = document.getElementById('fig-submit-btn');
  btn.disabled = true;
  btn.textContent = '儲存中…';

  try {
    let res;
    if (isEdit) {
      res = await apiFetch(`/api/figures?id=${encodeURIComponent(editId)}`, 'PUT', body);
    } else {
      res = await apiFetch('/api/figures', 'POST', body);
    }
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || res.statusText);
    }
    toast('success', isEdit ? '人物已更新' : '人物已新增');
    closeFigureModal();
    renderTimelineSection();
  } catch (err) {
    toast('error', `儲存失敗：${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = isEdit ? '儲存更改' : '新增';
  }
}

async function deleteFigure(dynasty, id) {
  if (!confirm(`確定要刪除「${id}」嗎？此操作無法還原。`)) return;
  try {
    const res = await apiFetch(
      `/api/figures?id=${encodeURIComponent(id)}&dynasty=${encodeURIComponent(dynasty)}`,
      'DELETE'
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || res.statusText);
    }
    toast('success', `已刪除：${id}`);
    renderTimelineSection();
  } catch (err) {
    toast('error', `刪除失敗：${err.message}`);
  }
}

/* ── Seed existing data.js figures ──────── */
async function seedFigures() {
  if (!confirm('將從 data.js 匯入所有現有人物到 Azure Storage。已存在的人物將被跳過。繼續？')) return;

  const statusEl = document.getElementById('seed-status');
  statusEl.textContent = '匯入中…';

  // Build the figures list from global FIGURES + ERAS (from data.js, loaded on main site)
  // Since dashboard doesn't load data.js, we embed the seed data here
  const SEED_FIGURES = getSeedFigures();
  let ok = 0, skip = 0, fail = 0;

  for (const [id, fig] of Object.entries(SEED_FIGURES)) {
    try {
      const res = await apiFetch('/api/figures', 'POST', { id, ...fig });
      if (res.status === 201) ok++;
      else if (res.status === 409) skip++;
      else fail++;
    } catch {
      fail++;
    }
    statusEl.textContent = `處理中… ${ok + skip + fail}/${Object.keys(SEED_FIGURES).length}`;
  }

  toast('success', `匯入完成：新增 ${ok}，跳過 ${skip}，失敗 ${fail}`);
  statusEl.textContent = '';
  renderTimelineSection();
}

/* ══════════════════════════════════════════
   CONTENT SECTIONS (文章 / HTML 塊)
   ══════════════════════════════════════════ */
async function renderContentSection(section) {
  const el = document.getElementById('dash-content');
  el.innerHTML = `<div class="empty-state"><div class="spinner"></div></div>`;

  let items = [];
  let storageError = false;
  try {
    const res = await apiGet(`/api/content?section=${encodeURIComponent(section)}`);
    if (!res.ok) throw new Error(await res.text());
    items = await res.json();
  } catch {
    storageError = true;
  }

  const meta = SECTIONS[section] || { label: section };
  let html = storageError ? storageNotConfiguredBanner('content') : '';

  html += `
    <div class="panel">
      <div class="panel-title">
        <span>${meta.label} · 內容管理</span>
        <button class="btn btn-primary btn-sm" onclick="openAddContentModal('${esc(section)}')">＋ 新增內容</button>
      </div>
      <p style="font-size:.78rem;color:var(--dash-muted);margin-bottom:1rem">
        此處新增的內容會顯示在網站對應頁面中（現有靜態內容仍會保留）。
      </p>`;

  if (!items.length) {
    html += `<div class="empty-state">尚無內容，點擊「新增內容」開始編輯。</div>`;
  } else {
    items.forEach(item => {
      const id = item.rowKey || item.id;
      html += `
        <div class="content-block">
          <div class="block-info">
            <div class="block-title">
              <span class="block-type type-${item.type}">${item.type}</span>
              ${esc(item.titleZh || item.titleEn || '（無標題）')}
            </div>
            <div class="block-meta">
              排序 ${item.order || 0} ·
              ${formatDate(item.updatedAt || item.createdAt)} ·
              ${esc(item.updatedBy || item.createdBy || '')}
            </div>
          </div>
          <div>
            <button class="btn btn-ghost btn-sm" style="margin-right:.3rem" onclick='openEditContentModal(${JSON.stringify(item)})'>編輯</button>
            <button class="btn btn-danger btn-sm" onclick="deleteContent('${esc(section)}','${esc(id)}')">刪除</button>
          </div>
        </div>`;
    });
  }

  html += `</div>`;
  el.innerHTML = html;
}

/* ── Docs section (with file upload) ─────── */
async function renderDocsSection(section) {
  const el = document.getElementById('dash-content');
  el.innerHTML = `<div class="empty-state"><div class="spinner"></div></div>`;

  let items = [], uploads = [];
  let storageError = false;
  try {
    const [cRes, uRes] = await Promise.all([
      apiGet(`/api/content?section=${encodeURIComponent(section)}`),
      apiGet(`/api/upload?section=${encodeURIComponent(section)}`),
    ]);
    if (cRes.ok) items = await cRes.json();
    if (uRes.ok) uploads = await uRes.json();
  } catch {
    storageError = true;
  }

  const meta = SECTIONS[section] || { label: section };
  let html = storageError ? storageNotConfiguredBanner('docs') : '';

  // Content blocks panel
  html += `
    <div class="panel">
      <div class="panel-title">
        <span>${meta.label} · 文章內容</span>
        <button class="btn btn-primary btn-sm" onclick="openAddContentModal('${esc(section)}')">＋ 新增文章</button>
      </div>`;
  if (!items.length) {
    html += `<div class="empty-state">尚無文章</div>`;
  } else {
    items.forEach(item => {
      const id = item.rowKey || item.id;
      html += `
        <div class="content-block">
          <div class="block-info">
            <div class="block-title">
              <span class="block-type type-${item.type}">${item.type}</span>
              ${esc(item.titleZh || item.titleEn || '（無標題）')}
            </div>
            <div class="block-meta">${formatDate(item.updatedAt || item.createdAt)}</div>
          </div>
          <div>
            <button class="btn btn-ghost btn-sm" style="margin-right:.3rem" onclick='openEditContentModal(${JSON.stringify(item)})'>編輯</button>
            <button class="btn btn-danger btn-sm" onclick="deleteContent('${esc(section)}','${esc(id)}')">刪除</button>
          </div>
        </div>`;
    });
  }
  html += `</div>`;

  // File upload panel
  html += `
    <div class="panel">
      <div class="panel-title"><span>${meta.label} · 檔案上傳（PDF / 圖片）</span></div>
      <div class="upload-drop" id="upload-drop-${section}" onclick="document.getElementById('file-input-${section}').click()" ondragover="onDragOver(event)" ondrop="onDrop(event,'${esc(section)}')">
        <input type="file" id="file-input-${section}" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onchange="onFileSelect(event,'${esc(section)}')" />
        點擊或拖曳檔案到此處上傳
        <div style="font-size:.72rem;margin-top:.3rem">支援 PDF、圖片、Word 文件</div>
      </div>
      <div class="upload-list" id="upload-list-${section}">`;

  if (!uploads.length) {
    html += `<div class="empty-state" style="padding:.5rem">尚無上傳檔案</div>`;
  } else {
    uploads.forEach(u => {
      const name = u.name.split('/').pop();
      html += `
        <div class="upload-item">
          <a href="${esc(u.url)}" target="_blank" rel="noopener">${esc(name)}</a>
          <span style="font-size:.7rem;color:var(--dash-muted)">${formatSize(u.size)}</span>
          <button class="btn btn-danger btn-sm" onclick="deleteUpload('${esc(u.name)}','${esc(section)}')">刪除</button>
        </div>`;
    });
  }
  html += `</div></div>`;

  el.innerHTML = html;
}

/* ── Content modal ──────────────────────── */
function openAddContentModal(section) {
  document.getElementById('content-modal-title').textContent = '新增內容';
  document.getElementById('content-form').reset();
  document.getElementById('cnt-body-editor').innerHTML = '';
  document.getElementById('cnt-edit-id').value = '';
  document.getElementById('cnt-section').value = section;
  document.getElementById('cnt-submit-btn').textContent = '新增';
  document.getElementById('content-modal').classList.add('open');
}

function openEditContentModal(item) {
  const id = item.rowKey || item.id;
  document.getElementById('content-modal-title').textContent = `編輯：${item.titleZh || item.titleEn || id}`;
  document.getElementById('cnt-edit-id').value = id;
  document.getElementById('cnt-section').value = item.section || item.partitionKey;
  document.getElementById('cnt-title-zh').value = item.titleZh || '';
  document.getElementById('cnt-title-en').value = item.titleEn || '';
  document.getElementById('cnt-type').value = item.type || 'html';
  document.getElementById('cnt-order').value = item.order || 0;
  document.getElementById('cnt-body-editor').innerHTML = item.body || '';
  document.getElementById('cnt-submit-btn').textContent = '儲存更改';
  document.getElementById('content-modal').classList.add('open');
}

function closeContentModal() {
  document.getElementById('content-modal').classList.remove('open');
}

function onContentTypeChange() {}

async function submitContentForm(e) {
  e.preventDefault();
  const editId = document.getElementById('cnt-edit-id').value;
  const section = document.getElementById('cnt-section').value;
  const isEdit = !!editId;

  const body = {
    section,
    type:     document.getElementById('cnt-type').value,
    titleZh:  document.getElementById('cnt-title-zh').value.trim(),
    titleEn:  document.getElementById('cnt-title-en').value.trim(),
    body:     document.getElementById('cnt-body-editor').innerHTML,
    order:    parseInt(document.getElementById('cnt-order').value) || 0,
  };

  const btn = document.getElementById('cnt-submit-btn');
  btn.disabled = true;
  btn.textContent = '儲存中…';

  try {
    let res;
    if (isEdit) {
      res = await apiFetch(
        `/api/content?id=${encodeURIComponent(editId)}&section=${encodeURIComponent(section)}`,
        'PUT', body
      );
    } else {
      res = await apiFetch('/api/content', 'POST', body);
    }
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || res.statusText);
    }
    toast('success', isEdit ? '內容已更新' : '內容已新增');
    closeContentModal();
    showSection(section);
  } catch (err) {
    toast('error', `儲存失敗：${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = isEdit ? '儲存更改' : '新增';
  }
}

async function deleteContent(section, id) {
  if (!confirm('確定要刪除此內容？')) return;
  try {
    const res = await apiFetch(
      `/api/content?id=${encodeURIComponent(id)}&section=${encodeURIComponent(section)}`,
      'DELETE'
    );
    if (!res.ok) throw new Error((await res.json()).error);
    toast('success', '已刪除');
    showSection(section);
  } catch (err) {
    toast('error', `刪除失敗：${err.message}`);
  }
}

/* ══════════════════════════════════════════
   FILE UPLOAD
   ══════════════════════════════════════════ */
function onDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function onDrop(e, section) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const files = Array.from(e.dataTransfer.files);
  uploadFiles(files, section);
}

function onFileSelect(e, section) {
  const files = Array.from(e.target.files);
  uploadFiles(files, section);
}

async function uploadFiles(files, section) {
  if (!files.length) return;
  for (const file of files) {
    toast('success', `上傳中：${file.name}…`);
    try {
      const res = await fetch(
        `/api/upload?section=${encodeURIComponent(section)}&filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type || 'application/octet-stream')}`,
        {
          method: 'POST',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || res.statusText);
      }
      toast('success', `上傳成功：${file.name}`);
    } catch (err) {
      toast('error', `上傳失敗：${file.name} — ${err.message}`);
    }
  }
  // Refresh the section to show new upload
  showSection(currentSection);
}

async function deleteUpload(blobName, section) {
  if (!confirm(`確定要刪除檔案「${blobName.split('/').pop()}」？`)) return;
  try {
    const res = await apiFetch(`/api/upload?name=${encodeURIComponent(blobName)}`, 'DELETE');
    if (!res.ok) throw new Error((await res.json()).error);
    toast('success', '檔案已刪除');
    showSection(section);
  } catch (err) {
    toast('error', `刪除失敗：${err.message}`);
  }
}

/* ══════════════════════════════════════════
   RICH TEXT EDITOR HELPERS
   ══════════════════════════════════════════ */
function edFmt(cmd) {
  document.getElementById('cnt-body-editor').focus();
  document.execCommand(cmd, false, null);
}

function edLink() {
  const url = prompt('輸入連結 URL：', 'https://');
  if (url) {
    document.getElementById('cnt-body-editor').focus();
    document.execCommand('createLink', false, url);
  }
}

/* ══════════════════════════════════════════
   SEED DATA (embedded from data.js)
   ══════════════════════════════════════════ */
function getSeedFigures() {
  return {
    kongzi:      { nameZh:'孔子',   nameEn:'Confucius',       dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'confucianism', catLabelZh:'儒家', catLabelEn:'Confucianism', quoteZh:'學而時習之，不亦說乎？', quoteEn:'Is it not pleasant to learn and practise what you have learned?', sourceZh:'《論語·學而》', sourceEn:'Analects, Book I', lat:35.60, lng:116.99, locationZh:'魯國曲阜', locationEn:'Qufu, Lu State' },
    laozi:       { nameZh:'老子',   nameEn:'Laozi',           dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'taoism',       catLabelZh:'道家', catLabelEn:'Taoism',         quoteZh:'道可道，非常道；名可名，非常名。', quoteEn:'The Tao that can be told is not the eternal Tao.', sourceZh:'《道德經》第一章', sourceEn:'Tao Te Ching, Chapter I', lat:33.85, lng:115.48, locationZh:'陳國苦縣', locationEn:'Luyi, Henan' },
    sunzi:       { nameZh:'孫子',   nameEn:'Sun Tzu',         dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'documents',    catLabelZh:'典籍', catLabelEn:'Documents',      quoteZh:'知己知彼，百戰不殆。', quoteEn:'Know yourself and your enemy, and you need not fear the result of a hundred battles.', sourceZh:'《孫子兵法》', sourceEn:'The Art of War', lat:37.49, lng:117.52, locationZh:'齊國樂安', locationEn:'Huimin, Shandong' },
    guanzi:      { nameZh:'管仲',   nameEn:'Guan Zhong',      dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'documents',    catLabelZh:'法家', catLabelEn:'Legalism',       quoteZh:'倉廩實則知禮節，衣食足則知榮辱。', quoteEn:'When granaries are full, people know propriety; when clothed and fed, they understand honour.', sourceZh:'《管子·牧民》', sourceEn:'Guanzi, Shepherding the People', lat:36.71, lng:119.10, locationZh:'齊國', locationEn:'Qi State' },
    zichan:      { nameZh:'子產',   nameEn:'Zichan',          dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'confucianism', catLabelZh:'儒家', catLabelEn:'Confucianism',   quoteZh:'政如農功，日夜思之。', quoteEn:'Governance is like farming — it must be tended day and night.', sourceZh:'《左傳》', sourceEn:'Zuozhuan', lat:34.75, lng:113.65, locationZh:'鄭國', locationEn:'Zheng State' },
    yanying:     { nameZh:'晏嬰',   nameEn:'Yan Ying',        dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'documents',    catLabelZh:'典籍', catLabelEn:'Documents',      quoteZh:'為者常成，行者常至。', quoteEn:'Those who act persistently always succeed; those who walk steadily always arrive.', sourceZh:'《晏子春秋》', sourceEn:'Yanzi Chunqiu', lat:36.80, lng:118.30, locationZh:'齊國', locationEn:'Qi State' },
    bianque:     { nameZh:'扁鵲',   nameEn:'Bian Que',        dynastyZh:'春秋時代', dynastyEn:'Spring & Autumn', section:'documents',    catLabelZh:'醫家', catLabelEn:'Medicine',       quoteZh:'上醫治未病，中醫治欲病，下醫治已病。', quoteEn:'The superior physician prevents disease; the mediocre treats disease before it manifests; the inferior treats disease already present.', sourceZh:'《黃帝內經》', sourceEn:'Huangdi Neijing', lat:37.88, lng:114.50, locationZh:'鄭國', locationEn:'Zheng State' },
    mengzi:      { nameZh:'孟子',   nameEn:'Mencius',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'confucianism', catLabelZh:'儒家', catLabelEn:'Confucianism',   quoteZh:'老吾老，以及人之老；幼吾幼，以及人之幼。', quoteEn:'Treat the aged of your family with the reverence due to age, then extend it to others.', sourceZh:'《孟子·梁惠王上》', sourceEn:'Mencius, Book I Part A', lat:35.40, lng:117.00, locationZh:'鄒國', locationEn:'Zoucheng, Shandong' },
    xunzi:       { nameZh:'荀子',   nameEn:'Xunzi',           dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'confucianism', catLabelZh:'儒家', catLabelEn:'Confucianism',   quoteZh:'青，取之於藍，而青於藍；冰，水為之，而寒於水。', quoteEn:'Indigo surpasses its source plant in blueness; ice surpasses its source water in coldness.', sourceZh:'《荀子·勸學》', sourceEn:'Xunzi, An Exhortation to Learning', lat:38.42, lng:112.73, locationZh:'趙國', locationEn:'Xinjiang, Shanxi' },
    zhuangzi:    { nameZh:'莊子',   nameEn:'Zhuangzi',        dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'taoism',       catLabelZh:'道家', catLabelEn:'Taoism',         quoteZh:'吾生也有涯，而知也無涯。', quoteEn:'Our life has a limit, but our knowledge is without limit.', sourceZh:'《莊子·養生主》', sourceEn:'Zhuangzi, The Secret of Caring for Life', lat:34.42, lng:115.65, locationZh:'宋國蒙邑', locationEn:'Shangqiu, Henan' },
    liezi:       { nameZh:'列子',   nameEn:'Liezi',           dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'taoism',       catLabelZh:'道家', catLabelEn:'Taoism',         quoteZh:'天地無全功，聖人無全能，萬物無全用。', quoteEn:'Heaven and earth have no perfect work; sages have no perfect ability; all things have no perfect use.', sourceZh:'《列子·天瑞》', sourceEn:'Liezi, Heavenly Auspices', lat:34.73, lng:113.65, locationZh:'鄭國', locationEn:'Zheng State' },
    yangzhu:     { nameZh:'楊朱',   nameEn:'Yang Zhu',        dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'taoism',       catLabelZh:'道家', catLabelEn:'Taoism',         quoteZh:'拔一毛以利天下，不為也。', quoteEn:'To pluck one hair for the benefit of the world — he would not do it.', sourceZh:'《孟子》引', sourceEn:'Quoted in Mencius', lat:34.20, lng:108.90, locationZh:'魏國', locationEn:'Wei State' },
    mozi:        { nameZh:'墨子',   nameEn:'Mozi',            dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'墨家', catLabelEn:'Mohism',         quoteZh:'兼相愛，交相利。', quoteEn:'Love all universally; benefit each other mutually.', sourceZh:'《墨子·兼愛》', sourceEn:'Mozi, Universal Love', lat:35.20, lng:117.10, locationZh:'宋國', locationEn:'Song State' },
    shenbuhui:   { nameZh:'申不害', nameEn:'Shen Buhai',      dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'法家', catLabelEn:'Legalism',       quoteZh:'術者，因任而授官，循名而責實。', quoteEn:'Technique means assigning office by ability and demanding performance by title.', sourceZh:'《申子》', sourceEn:'Shenzi', lat:34.65, lng:113.45, locationZh:'韓國', locationEn:'Han State' },
    shendao:     { nameZh:'慎到',   nameEn:'Shen Dao',        dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'法家', catLabelEn:'Legalism',       quoteZh:'法雖不善，猶愈於無法。', quoteEn:'Even an imperfect law is better than no law at all.', sourceZh:'《慎子》', sourceEn:'Shenzi', lat:38.00, lng:115.00, locationZh:'趙國', locationEn:'Zhao State' },
    shanyang:    { nameZh:'商鞅',   nameEn:'Shang Yang',      dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'法家', catLabelEn:'Legalism',       quoteZh:'治世不一道，便國不法古。', quoteEn:'In governing the world, one method does not suffice; in benefiting the state, one need not follow the past.', sourceZh:'《商君書》', sourceEn:'The Book of Lord Shang', lat:34.35, lng:108.95, locationZh:'秦國', locationEn:'Qin State' },
    hanfeizi:    { nameZh:'韓非子', nameEn:'Han Feizi',       dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'法家', catLabelEn:'Legalism',       quoteZh:'法不阿貴，繩不撓曲。', quoteEn:'The law does not yield to the noble; the plumb line does not bend to the crooked.', sourceZh:'《韓非子·有度》', sourceEn:'Han Feizi, On Standards', lat:35.09, lng:113.08, locationZh:'韓國', locationEn:'Han State' },
    lisi:        { nameZh:'李斯',   nameEn:'Li Si',           dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'法家', catLabelEn:'Legalism',       quoteZh:'泰山不讓土壤，故能成其大；河海不擇細流，故能就其深。', quoteEn:'Mount Tai does not reject any soil, therefore it achieves its greatness; rivers do not reject any stream, therefore they achieve their depth.', sourceZh:'《諫逐客書》', sourceEn:'Memorial on Expelling Guests', lat:33.74, lng:115.75, locationZh:'楚國上蔡', locationEn:'Shangcai, Chu State' },
    huishi:      { nameZh:'惠施',   nameEn:'Hui Shi',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'名家', catLabelEn:'School of Names',quoteZh:'天與地卑，山與澤平。', quoteEn:'Heaven is as low as earth; mountains are level with marshes.', sourceZh:'《莊子·天下》', sourceEn:'Zhuangzi, All Under Heaven', lat:34.29, lng:115.65, locationZh:'宋國', locationEn:'Song State' },
    gongsunlong:  { nameZh:'公孫龍', nameEn:'Gongsun Long',   dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'名家', catLabelEn:'School of Names',quoteZh:'白馬非馬。', quoteEn:'A white horse is not a horse.', sourceZh:'《公孫龍子》', sourceEn:'Gongsun Longzi', lat:38.05, lng:114.30, locationZh:'趙國', locationEn:'Zhao State' },
    zouyan:      { nameZh:'鄒衍',   nameEn:'Zou Yan',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'陰陽家', catLabelEn:'Naturalism',    quoteZh:'五德終始，周而復始。', quoteEn:'The five virtues cycle in sequence, returning to the beginning.', sourceZh:'《史記》', sourceEn:'Shiji', lat:36.67, lng:116.99, locationZh:'齊國', locationEn:'Qi State' },
    guiguzi:     { nameZh:'鬼谷子', nameEn:'Guiguzi',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'縱橫家', catLabelEn:'Diplomacy',    quoteZh:'口者，心之門戶也。', quoteEn:'The mouth is the gateway to the mind.', sourceZh:'《鬼谷子》', sourceEn:'Guiguzi', lat:35.10, lng:111.20, locationZh:'衛國', locationEn:'Wei State' },
    suqin:       { nameZh:'蘇秦',   nameEn:'Su Qin',          dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'縱橫家', catLabelEn:'Diplomacy',    quoteZh:'合縱以抗秦。', quoteEn:'Unite the vertical alliance to resist Qin.', sourceZh:'《史記·蘇秦列傳》', sourceEn:'Shiji, Biography of Su Qin', lat:34.65, lng:112.45, locationZh:'東周洛陽', locationEn:'Luoyang, Zhou' },
    zhangyi:     { nameZh:'張儀',   nameEn:'Zhang Yi',        dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'縱橫家', catLabelEn:'Diplomacy',    quoteZh:'連橫以事秦。', quoteEn:'Form horizontal alliances to serve Qin.', sourceZh:'《史記·張儀列傳》', sourceEn:'Shiji, Biography of Zhang Yi', lat:34.30, lng:108.95, locationZh:'魏國', locationEn:'Wei State' },
    wuqi:        { nameZh:'吳起',   nameEn:'Wu Qi',           dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'兵家', catLabelEn:'Military',      quoteZh:'用兵之害，猶豫最大。', quoteEn:'Of all the dangers in using troops, hesitation is the greatest.', sourceZh:'《吳子》', sourceEn:'Wuzi', lat:35.80, lng:115.00, locationZh:'衛國', locationEn:'Wei State' },
    sunbin:      { nameZh:'孫臏',   nameEn:'Sun Bin',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'兵家', catLabelEn:'Military',      quoteZh:'善戰者，因其勢而利導之。', quoteEn:'The skilled commander follows the momentum and guides it to advantage.', sourceZh:'《孫臏兵法》', sourceEn:'Sun Bin Art of War', lat:35.40, lng:117.00, locationZh:'齊國', locationEn:'Qi State' },
    xuxing:      { nameZh:'許行',   nameEn:'Xu Xing',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'農家', catLabelEn:'Agriculturalism',quoteZh:'賢者與民並耕而食，饔饗而治。', quoteEn:'The worthy should farm alongside the people for food, and cook with them to govern.', sourceZh:'《孟子》引', sourceEn:'Quoted in Mencius', lat:30.50, lng:114.30, locationZh:'楚國', locationEn:'Chu State' },
    lvbuwei:     { nameZh:'呂不韋', nameEn:'Lü Buwei',        dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'雜家', catLabelEn:'Syncretism',     quoteZh:'不韋以為：天下之大義，莫大於信。', quoteEn:'Lü Buwei held that of all the great principles under heaven, none is greater than faithfulness.', sourceZh:'《呂氏春秋》', sourceEn:'Master Lü\'s Spring and Autumn Annals', lat:34.60, lng:113.65, locationZh:'衛國濮陽', locationEn:'Puyang, Wei State' },
    quyuan:      { nameZh:'屈原',   nameEn:'Qu Yuan',         dynastyZh:'戰國時代', dynastyEn:'Warring States', section:'documents',    catLabelZh:'楚辭', catLabelEn:'Chu Ci Poetry',  quoteZh:'路漫漫其修遠兮，吾將上下而求索。', quoteEn:'The road ahead is long and stretches far; I will search high and low.', sourceZh:'《離騷》', sourceEn:'Li Sao (Encountering Sorrow)', lat:30.30, lng:111.50, locationZh:'楚國秭歸', locationEn:'Zigui, Chu State' },
    dongzhongshu:{ nameZh:'董仲舒', nameEn:'Dong Zhongshu',   dynastyZh:'漢朝',     dynastyEn:'Han Dynasty',   section:'confucianism', catLabelZh:'儒家', catLabelEn:'Confucianism',   quoteZh:'仁義禮智信，五者，王道之本也。', quoteEn:'Benevolence, righteousness, ritual, wisdom, and integrity — these five are the foundation of the kingly way.', sourceZh:'《春秋繁露》', sourceEn:'Luxuriant Gems of the Spring and Autumn Annals', lat:38.57, lng:115.56, locationZh:'廣川', locationEn:'Jingxian, Hebei' },
    simaqian:    { nameZh:'司馬遷', nameEn:'Sima Qian',       dynastyZh:'漢朝',     dynastyEn:'Han Dynasty',   section:'documents',    catLabelZh:'典籍', catLabelEn:'Documents',      quoteZh:'人固有一死，或重於泰山，或輕於鴻毛。', quoteEn:'All men must die, but some deaths are weightier than Mount Tai, others lighter than a feather.', sourceZh:'《報任少卿書》', sourceEn:'Letter to Ren An', lat:35.48, lng:110.44, locationZh:'夏陽', locationEn:'Hancheng, Shaanxi' },
    bangu:       { nameZh:'班固',   nameEn:'Ban Gu',          dynastyZh:'漢朝',     dynastyEn:'Han Dynasty',   section:'documents',    catLabelZh:'典籍', catLabelEn:'Documents',      quoteZh:'蓋文章，經國之大業，不朽之盛事。', quoteEn:'Literary writing is the greatest undertaking in governing a nation.', sourceZh:'《典論·論文》', sourceEn:'Discourse on Literature', lat:34.34, lng:108.71, locationZh:'安陵', locationEn:'Xianyang, Shaanxi' },
    libai:       { nameZh:'李白',   nameEn:'Li Bai',          dynastyZh:'唐朝',     dynastyEn:'Tang Dynasty',  section:'documents',    catLabelZh:'詩詞', catLabelEn:'Poetry',         quoteZh:'君不見黃河之水天上來，奔流到海不復回。', quoteEn:'Do you not see the Yellow River pour from the sky, rushing to the sea never to return?', sourceZh:'《將進酒》', sourceEn:'Bring in the Wine', lat:31.78, lng:104.73, locationZh:'綿州昌隆', locationEn:'Jiangyou, Sichuan' },
    dufu:        { nameZh:'杜甫',   nameEn:'Du Fu',           dynastyZh:'唐朝',     dynastyEn:'Tang Dynasty',  section:'documents',    catLabelZh:'詩詞', catLabelEn:'Poetry',         quoteZh:'烽火連三月，家書抵萬金。', quoteEn:'Beacon fires have blazed for three months; a letter from home is worth ten thousand gold.', sourceZh:'《春望》', sourceEn:'Spring View', lat:34.26, lng:108.95, locationZh:'京兆杜陵', locationEn:'Duling, Chang\'an' },
    wangzhihuan: { nameZh:'王之渙', nameEn:'Wang Zhihuan',    dynastyZh:'唐朝',     dynastyEn:'Tang Dynasty',  section:'documents',    catLabelZh:'詩詞', catLabelEn:'Poetry',         quoteZh:'欲窮千里目，更上一層樓。', quoteEn:'To see a thousand miles, ascend one more flight of stairs.', sourceZh:'《登鸛雀樓》', sourceEn:'Ascending the Stork Tower', lat:37.44, lng:112.42, locationZh:'絳州', locationEn:'Jiangzhou, Shanxi' },
    sushi:       { nameZh:'蘇軾',   nameEn:'Su Shi (Su Dongpo)', dynastyZh:'宋朝', dynastyEn:'Song Dynasty',  section:'documents',    catLabelZh:'詩詞', catLabelEn:'Poetry',         quoteZh:'但願人長久，千里共嬋娟。', quoteEn:'May we both live long, to share the beauty of this moon, though far apart.', sourceZh:'《水調歌頭》', sourceEn:'Shui Diao Ge Tou', lat:30.05, lng:103.80, locationZh:'眉州眉山', locationEn:'Meishan, Sichuan' },
    zhuxi:       { nameZh:'朱熹',   nameEn:'Zhu Xi',          dynastyZh:'宋朝',     dynastyEn:'Song Dynasty',  section:'confucianism', catLabelZh:'儒家', catLabelEn:'Neo-Confucianism',quoteZh:'博學之，審問之，慎思之，明辨之，篤行之。', quoteEn:'Learn broadly, inquire carefully, reflect deeply, distinguish clearly, and practise earnestly.', sourceZh:'《中庸》注', sourceEn:'Commentary on the Doctrine of the Mean', lat:28.00, lng:117.50, locationZh:'徽州婺源', locationEn:'Wuyuan, Huizhou' },
    liqingzhao:  { nameZh:'李清照', nameEn:'Li Qingzhao',     dynastyZh:'宋朝',     dynastyEn:'Song Dynasty',  section:'documents',    catLabelZh:'詩詞', catLabelEn:'Poetry',         quoteZh:'尋尋覓覓，冷冷清清，淒淒慘慘戚戚。', quoteEn:'Seeking, always seeking, cold, so cold, desolate, wretched and miserable.', sourceZh:'《聲聲慢》', sourceEn:'Sheng Sheng Man', lat:36.67, lng:117.00, locationZh:'齊州章丘', locationEn:'Zhangqiu, Shandong' },
    luoguanzhong:{ nameZh:'羅貫中', nameEn:'Luo Guanzhong',   dynastyZh:'元明清',   dynastyEn:'Yuan · Ming · Qing', section:'documents', catLabelZh:'典籍', catLabelEn:'Documents', quoteZh:'話說天下大勢，分久必合，合久必分。', quoteEn:'It is a truth universally acknowledged that empires long united must divide, and long divided must unite.', sourceZh:'《三國演義》', sourceEn:'Romance of the Three Kingdoms', lat:30.20, lng:120.20, locationZh:'杭州', locationEn:'Hangzhou, Zhejiang' },
    caoxueqin:   { nameZh:'曹雪芹', nameEn:'Cao Xueqin',      dynastyZh:'元明清',   dynastyEn:'Yuan · Ming · Qing', section:'documents', catLabelZh:'典籍', catLabelEn:'Documents', quoteZh:'滿紙荒唐言，一把辛酸淚。都云作者痴，誰解其中味？', quoteEn:'A page full of absurd words, a bucketful of bitter tears. They all say the author is mad — who truly savours his intent?', sourceZh:'《紅樓夢》第一回', sourceEn:'Dream of the Red Chamber, Chapter 1', lat:39.90, lng:116.40, locationZh:'北京', locationEn:'Beijing' },
    wangyangming:{ nameZh:'王陽明', nameEn:'Wang Yangming',   dynastyZh:'元明清',   dynastyEn:'Yuan · Ming · Qing', section:'confucianism', catLabelZh:'儒家', catLabelEn:'Neo-Confucianism', quoteZh:'知行合一。', quoteEn:'Knowledge and action are one.', sourceZh:'《傳習錄》', sourceEn:'Instructions for Practical Living', lat:29.30, lng:120.10, locationZh:'餘姚', locationEn:'Yuyao, Zhejiang' },
  };
}

/* ══════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════ */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('zh-TW', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function toast(type, msg, duration = 3500) {
  const container = document.getElementById('toast');
  const el = document.createElement('div');
  el.className = `toast-msg ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

/* ── API helpers ────────────────────────── */
/* ── Auto-translate Chinese title → English ── */
async function translateTitle() {
  const zhInput  = document.getElementById('cnt-title-zh');
  const enInput  = document.getElementById('cnt-title-en');
  const btn      = document.getElementById('translate-btn');
  const text     = zhInput ? zhInput.value.trim() : '';

  if (!text) { toast('error', '請先填寫中文標題'); return; }

  btn.disabled = true;
  btn.textContent = '翻譯中…';

  try {
    const res  = await fetch('/api/translate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text }),
    });

    if (res.status === 501) {
      toast('error', '翻譯功能未設定（需要 ANTHROPIC_API_KEY）');
      return;
    }
    if (!res.ok) {
      toast('error', '翻譯失敗，請稍後再試');
      return;
    }

    const data = await res.json();
    if (data.translation && enInput) {
      enInput.value = data.translation;
      toast('success', '翻譯完成');
    }
  } catch (err) {
    toast('error', `翻譯錯誤：${err.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = '✦ 自動翻譯';
  }
}

async function apiGet(url) {
  return fetch(url, { headers: { 'Accept': 'application/json' } });
}

async function apiFetch(url, method, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return fetch(url, opts);
}

/* ── Boot ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
