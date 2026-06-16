"""
Generate placeholder PDFs for all documents on the Chinese culture website.
Run once from the repo root: python generate_pdfs.py
"""

import os
from fpdf import FPDF

FONT_PATH = r"C:\Windows\Fonts\msyh.ttc"

# ------------------------------------------------------------------
# Document catalogue  (folder, filename, zh_title, en_title, author_zh, author_en, quote_zh)
# ------------------------------------------------------------------
DOCS = [
    # ── 儒家 Confucianism ──────────────────────────────────────────
    ("confucianism", "lunyu.pdf",
     "論語", "The Analects of Confucius",
     "孔子 Confucius", "春秋時代 · Spring & Autumn",
     "學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？"),
    ("confucianism", "daxue.pdf",
     "大學", "The Great Learning",
     "曾子 Zengzi（傳）", "先秦 · Pre-Qin",
     "大學之道，在明明德，在親民，在止於至善。"),
    ("confucianism", "zhongyong.pdf",
     "中庸", "The Doctrine of the Mean",
     "子思 Zisi（傳）", "先秦 · Pre-Qin",
     "天命之謂性，率性之謂道，修道之謂教。"),
    ("confucianism", "mengzi.pdf",
     "孟子", "Mencius",
     "孟子 Mencius", "戰國時代 · Warring States",
     "老吾老，以及人之老；幼吾幼，以及人之幼。"),
    ("confucianism", "xunzi.pdf",
     "荀子", "Xunzi",
     "荀子 Xunzi", "戰國時代 · Warring States",
     "青，取之於藍，而青於藍；冰，水為之，而寒於水。"),
    ("confucianism", "chunqiufanlu.pdf",
     "春秋繁露", "Luxuriant Gems of the Spring and Autumn Annals",
     "董仲舒 Dong Zhongshu", "漢朝 · Han Dynasty",
     "仁義禮智信，五者，王道之本也。"),
    ("confucianism", "chuanxilu.pdf",
     "傳習錄", "Instructions for Practical Living",
     "王陽明 Wang Yangming", "明朝 · Ming Dynasty",
     "知是行之始，行是知之成。"),

    # ── 道家 Taoism ────────────────────────────────────────────────
    ("taoism", "daodejing.pdf",
     "道德經", "Tao Te Ching",
     "老子 Laozi", "春秋時代 · Spring & Autumn",
     "道可道，非常道；名可名，非常名。"),
    ("taoism", "zhuangzi.pdf",
     "莊子", "Zhuangzi",
     "莊子 Zhuangzi", "戰國時代 · Warring States",
     "吾生也有涯，而知也無涯。"),

    # ── 詩詞 Poetry ────────────────────────────────────────────────
    ("poetry", "libai.pdf",
     "李白詩選", "Selected Poems of Li Bai",
     "李白 Li Bai", "唐朝 · Tang Dynasty",
     "君不見黃河之水天上來，奔流到海不復回。"),
    ("poetry", "dufu.pdf",
     "杜甫詩選", "Selected Poems of Du Fu",
     "杜甫 Du Fu", "唐朝 · Tang Dynasty",
     "國破山河在，城春草木深。感時花濺淚，恨別鳥驚心。"),
    ("poetry", "sushi.pdf",
     "蘇軾詩詞選", "Selected Works of Su Shi",
     "蘇軾 Su Shi", "宋朝 · Song Dynasty",
     "人有悲歡離合，月有陰晴圓缺，此事古難全。"),
    ("poetry", "liqingzhao.pdf",
     "李清照詞選", "Selected Ci of Li Qingzhao",
     "李清照 Li Qingzhao", "宋朝 · Song Dynasty",
     "生當作人傑，死亦為鬼雄。"),
    ("poetry", "tangshi300.pdf",
     "唐詩三百首", "Three Hundred Tang Poems",
     "蘅塘退士 編 Hengtang Tuishi (ed.)", "清朝 · Qing Dynasty",
     "熟讀唐詩三百首，不會作詩也會吟。"),

    # ── 典籍 Documents ─────────────────────────────────────────────
    ("documents", "sunzi.pdf",
     "孫子兵法", "The Art of War",
     "孫子 Sun Tzu", "春秋時代 · Spring & Autumn",
     "知己知彼，百戰不殆。"),
    ("documents", "shiji.pdf",
     "史記", "Records of the Grand Historian",
     "司馬遷 Sima Qian", "漢朝 · Han Dynasty",
     "人固有一死，或重於泰山，或輕於鴻毛。"),
    ("documents", "hanshu.pdf",
     "漢書", "Book of Han",
     "班固 Ban Gu", "漢朝 · Han Dynasty",
     "蓋文章，經國之大業，不朽之盛事。"),
    ("documents", "sanguo.pdf",
     "三國演義", "Romance of the Three Kingdoms",
     "羅貫中 Luo Guanzhong", "元末明初 · Yuan-Ming Period",
     "話說天下大勢，分久必合，合久必分。"),
    ("documents", "hongloumeng.pdf",
     "紅樓夢", "Dream of the Red Chamber",
     "曹雪芹 Cao Xueqin", "清朝 · Qing Dynasty",
     "滿紙荒唐言，一把辛酸淚。都云作者癡，誰解其中味？"),
]

GOLD   = (201, 169, 110)
RED    = (139,  26,  26)
CREAM  = (255, 249, 240)
INK    = ( 28,  28,  28)
SOFT   = ( 58,  58,  58)


def make_pdf(folder, filename, zh_title, en_title, author, dynasty, quote):
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font("msyh", fname=FONT_PATH)

    # ── background ──
    pdf.set_fill_color(*CREAM)
    pdf.rect(0, 0, 210, 297, "F")

    # ── top red bar ──
    pdf.set_fill_color(*RED)
    pdf.rect(0, 0, 210, 18, "F")

    # ── gold rule under bar ──
    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.8)
    pdf.line(0, 18, 210, 18)

    # ── top label ──
    pdf.set_font("msyh", size=9)
    pdf.set_text_color(201, 169, 110)
    pdf.set_xy(0, 5)
    pdf.cell(210, 8, "中華哲學文學典籍  ·  Chinese Philosophy & Literary Archives", align="C")

    # ── Chinese title ──
    pdf.set_font("msyh", size=52)
    pdf.set_text_color(*RED)
    pdf.set_xy(0, 40)
    pdf.cell(210, 26, zh_title, align="C")

    # ── gold divider ──
    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.5)
    pdf.line(30, 72, 180, 72)

    # ── English title ──
    pdf.set_font("msyh", size=16)
    pdf.set_text_color(*SOFT)
    pdf.set_xy(0, 76)
    pdf.cell(210, 10, en_title, align="C")

    # ── author / dynasty ──
    pdf.set_font("msyh", size=11)
    pdf.set_text_color(*GOLD[0:3])
    pdf.set_fill_color(*GOLD)
    pdf.set_text_color(139, 26, 26)
    pdf.set_xy(0, 94)
    pdf.cell(210, 8, author + "　·　" + dynasty, align="C")

    # ── quote box ──
    box_x, box_y, box_w, box_h = 20, 116, 170, 60
    pdf.set_fill_color(253, 246, 234)
    pdf.set_draw_color(*GOLD)
    pdf.set_line_width(0.4)
    pdf.rect(box_x, box_y, box_w, box_h, "FD")
    # left red accent
    pdf.set_fill_color(*RED)
    pdf.rect(box_x, box_y, 3, box_h, "F")

    pdf.set_font("msyh", size=13)
    pdf.set_text_color(*INK)
    pdf.set_xy(box_x + 8, box_y + 12)
    pdf.multi_cell(box_w - 12, 9, "「 " + quote + " 」")

    # ── placeholder notice ──
    pdf.set_font("msyh", size=10)
    pdf.set_text_color(160, 130, 80)
    pdf.set_xy(0, 196)
    pdf.cell(210, 8, "※ 此為示範頁面，完整典籍文件請另行上傳", align="C")
    pdf.set_font("msyh", size=9)
    pdf.set_xy(0, 206)
    pdf.cell(210, 7, "This is a placeholder page. Please upload the full document.", align="C")

    # ── bottom bar ──
    pdf.set_fill_color(*RED)
    pdf.rect(0, 279, 210, 18, "F")
    pdf.set_draw_color(*GOLD)
    pdf.line(0, 279, 210, 279)
    pdf.set_font("msyh", size=8)
    pdf.set_text_color(*GOLD)
    pdf.set_xy(0, 284)
    pdf.cell(210, 6, "章黃學研究院  ·  harmonyculturewellness.org", align="C")

    out_dir = os.path.join("pdfs", folder)
    os.makedirs(out_dir, exist_ok=True)
    pdf.output(os.path.join(out_dir, filename))
    print(f"  OK  {folder}/{filename}")


if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base)
    print("Generating PDFs …")
    for row in DOCS:
        make_pdf(*row)
    print(f"\nDone — {len(DOCS)} files created.")
