# 中華哲學文學典籍網站

**章黃學研究院** · [harmonyculturewellness.org](https://harmonyculturewellness.org)

---

## 目錄

1. [網站結構](#網站結構)
2. [如何新增 PDF 文件](#如何新增-pdf-文件)
3. [如何新增內容](#如何新增內容)
4. [如何部署更新](#如何部署更新)

---

## 網站結構

```
chinese-culture-website/
├── index.html          # 主頁面（所有區塊均在此檔案）
├── css/
│   └── style.css       # 全站樣式
├── js/
│   ├── data.js         # ★ 所有內容資料（詩詞、人物、概念、名言）
│   ├── main.js         # 渲染邏輯（讀取 data.js 自動生成頁面）
│   └── documents.js    # ★ PDF 文件清單
├── pdfs/
│   ├── confucianism/   # 儒家典籍 PDF
│   ├── taoism/         # 道家典籍 PDF
│   ├── poetry/         # 詩詞 PDF
│   ├── documents/      # 其他典籍 PDF
│   └── zhanghuang/     # 實用章黃學 PDF（備用）
├── generate_pdfs.py    # 生成示範用 PDF 的 Python 腳本
└── README.md           # 本說明文件
```

> **核心原則**：所有展示內容（詩詞、人物、概念、名言）統一存放於 `js/data.js`；
> PDF 文件清單存放於 `js/documents.js`。
> 更新內容只需編輯這兩個檔案，無需修改 HTML。

---

## 如何新增 PDF 文件

### 第一步：上傳 PDF 至 GitHub

將 PDF 檔案上傳到對應的資料夾：

| 資料夾 | 顯示位置 |
|--------|----------|
| `pdfs/confucianism/` | 儒家區塊 |
| `pdfs/taoism/`       | 道家區塊 |
| `pdfs/poetry/`       | 詩詞區塊 |
| `pdfs/documents/`    | 典籍文件區塊 |
| `pdfs/zhanghuang/`   | 實用章黃學區塊 |

**上傳方式（GitHub 網頁）：**
1. 進入 GitHub 儲存庫頁面
2. 點選對應資料夾（如 `pdfs/confucianism/`）
3. 點選右上角「Add file」→「Upload files」
4. 拖曳或選擇 PDF 檔案
5. 填寫 commit 訊息，點選「Commit changes」

### 第二步：在 `js/documents.js` 新增一行

開啟 `js/documents.js`，在對應的陣列中加入一行：

```javascript
{ file: '檔名.pdf', titleZh: '中文標題', titleEn: 'English Title' },
```

**範例**——在儒家區塊新增《禮記》：

```javascript
confucianism: [
  { file: 'lunyu.pdf',  titleZh: '論語', titleEn: 'The Analects of Confucius' },
  // 在此加入新的一行：
  { file: 'liji.pdf',   titleZh: '禮記', titleEn: 'Book of Rites' },
],
```

完成後，文件卡片會自動出現在網站對應的書架上，無需修改其他任何檔案。

---

## 如何新增內容

所有展示內容統一在 `js/data.js` 管理。

### 新增詩詞

在 `POEMS` 陣列中加入一個物件：

```javascript
{
  id: 'poem-唯一識別碼',          // 頁面內錨點，不可重複
  titleZh: '詩詞標題',
  titleEn: 'Poem Title in English',
  authorZh: '作者 · 朝代',
  authorEn: 'Author · Dynasty',
  linesZh: ['第一句', '第二句', '第三句', '第四句'],
  linesEn: ['Line one', 'Line two', 'Line three', 'Line four'],
},
```

### 新增歷史人物

**1. 在 `FIGURES` 物件中加入人物資料：**

```javascript
FIGURES.新人物key = {
  nameZh: '人物名稱',
  nameEn: 'Name in English',
  dynastyZh: '朝代',
  dynastyEn: 'Dynasty',
  section: 'confucianism',        // 'confucianism' 或 'taoism'
  catLabelZh: '儒家',
  catLabelEn: 'Confucianism',
  quoteZh: '名言原文',
  quoteEn: 'Quote in English',
  sourceZh: '出處',
  sourceEn: 'Source',
};
```

**2. 在 `ERAS` 陣列的對應時代中加入人物 key：**

```javascript
{ period: '221 – 206 BCE', nameZh: '秦朝', nameEn: 'Qin Dynasty',
  figures: ['已有人物key', '新人物key'] },
```

### 新增哲學概念

在 `CONCEPTS.confucianism` 或 `CONCEPTS.taoism` 陣列中加入：

```javascript
{
  termZh: '概念名稱',
  termEn: 'Concept Name',
  defZh: '中文解釋（一至兩句）',
  defEn: 'English explanation (one or two sentences).',
},
```

### 新增每日名言

在 `QUOTES` 陣列中加入：

```javascript
{ zh: '名言原文', en: 'Quote in English', src: '— 出處' },
```

---

## 如何部署更新

本網站使用 **GitHub Pages** 自動部署，推送到 `main` 分支後數分鐘內即會更新。

### 使用 Git 命令列

```bash
git add .
git commit -m "說明本次更新的內容"
git push origin main
```

### 使用 GitHub 網頁

直接在 GitHub 網頁上編輯檔案並 commit，GitHub Pages 會自動重新部署。

### 確認部署完成

前往 `https://harmonyculturewellness.org` 確認更新是否已生效。
若瀏覽器顯示舊內容，請按 `Ctrl + Shift + R`（強制重新整理）清除快取。

---

## 技術說明

| 項目 | 說明 |
|------|------|
| 託管平台 | GitHub Pages（免費靜態網站托管） |
| 自訂網域 | harmonyculturewellness.org（由 Namecheap 管理 DNS） |
| 字體 | Cormorant Garamond（標題）、Noto Serif SC（中文） |
| 漢字筆順動畫 | HanziWriter 3.5 |
| PDF 生成工具 | Python `fpdf2` + Microsoft YaHei 字型 |

---

*章黃學研究院 · 傳承千年文化智慧*
