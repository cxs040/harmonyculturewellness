/* ══════════════════════════════════════════════════════════
   DOCUMENT REGISTRY — folder-based

   HOW TO ADD A FILE:
   1. Upload your PDF to the matching folder in GitHub:
        pdfs/confucianism/   → shows in 儒家 section
        pdfs/taoism/         → shows in 道家 section
        pdfs/poetry/         → shows in 詩詞 section
        pdfs/documents/      → shows in 典籍文件 archive

   2. Add one line below in the matching section — just the filename.

   That's it. No other changes needed.
   ══════════════════════════════════════════════════════════ */

const DOCUMENTS = {

  confucianism: [
    // { file: 'lunyu.pdf',    titleZh: '論語',  titleEn: 'The Analects of Confucius' },
    // { file: 'daxue.pdf',    titleZh: '大學',  titleEn: 'The Great Learning'        },
    // { file: 'zhongyong.pdf',titleZh: '中庸',  titleEn: 'The Doctrine of the Mean'  },
  ],

  taoism: [
    // { file: 'daodejing.pdf',titleZh: '道德經',titleEn: 'Tao Te Ching' },
    // { file: 'zhuangzi.pdf', titleZh: '莊子',  titleEn: 'Zhuangzi'     },
  ],

  poetry: [
    // { file: 'tangshi.pdf',  titleZh: '唐詩三百首',titleEn: 'Three Hundred Tang Poems' },
    // { file: 'shijing.pdf',  titleZh: '詩經',      titleEn: 'Book of Songs'            },
  ],

  documents: [
    // General archive — any file that doesn't fit the above categories
    // { file: 'intro.pdf',    titleZh: '簡介',  titleEn: 'Introduction' },
  ],

};
