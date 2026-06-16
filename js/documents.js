/* ══════════════════════════════════════════════════════════
   DOCUMENT REGISTRY

   HOW TO ADD A FILE:
   1. Upload your PDF to the matching folder in GitHub:
        pdfs/confucianism/   → shows in 儒家 section
        pdfs/taoism/         → shows in 道家 section
        pdfs/poetry/         → shows in 詩詞 section
        pdfs/documents/      → shows in 典籍文件 archive

   2. Add one line below in the matching section.

   That's it. No other changes needed.
   ══════════════════════════════════════════════════════════ */

const DOCUMENTS = {

  /* ── 儒家 Confucianism ──────────────────────────────────
     Works by: 孔子 · 孟子 · 荀子 · 董仲舒 · 朱熹 · 王陽明  */
  confucianism: [
    { file: 'lunyu.pdf',        titleZh: '論語',    titleEn: 'The Analects of Confucius'                       },
    { file: 'daxue.pdf',        titleZh: '大學',    titleEn: 'The Great Learning'                              },
    { file: 'zhongyong.pdf',    titleZh: '中庸',    titleEn: 'The Doctrine of the Mean'                        },
    { file: 'mengzi.pdf',       titleZh: '孟子',    titleEn: 'Mencius'                                         },
    { file: 'xunzi.pdf',        titleZh: '荀子',    titleEn: 'Xunzi'                                           },
    { file: 'chunqiufanlu.pdf', titleZh: '春秋繁露', titleEn: 'Luxuriant Gems of the Spring and Autumn Annals' },
    { file: 'chuanxilu.pdf',    titleZh: '傳習錄',  titleEn: 'Instructions for Practical Living'               },
  ],

  /* ── 道家 Taoism ────────────────────────────────────────
     Works by: 老子 · 莊子                                  */
  taoism: [
    { file: 'daodejing.pdf', titleZh: '道德經', titleEn: 'Tao Te Ching' },
    { file: 'zhuangzi.pdf',  titleZh: '莊子',   titleEn: 'Zhuangzi'     },
  ],

  /* ── 詩詞 Poetry ────────────────────────────────────────
     Works by: 李白 · 杜甫 · 王之渙 · 蘇軾 · 李清照         */
  poetry: [
    { file: 'libai.pdf',      titleZh: '李白詩選',   titleEn: 'Selected Poems of Li Bai'   },
    { file: 'dufu.pdf',       titleZh: '杜甫詩選',   titleEn: 'Selected Poems of Du Fu'    },
    { file: 'sushi.pdf',      titleZh: '蘇軾詩詞選', titleEn: 'Selected Works of Su Shi'   },
    { file: 'liqingzhao.pdf', titleZh: '李清照詞選', titleEn: 'Selected Ci of Li Qingzhao' },
    { file: 'tangshi300.pdf', titleZh: '唐詩三百首', titleEn: 'Three Hundred Tang Poems'   },
  ],

  /* ── 典籍 Documents ─────────────────────────────────────
     Works by: 孫子 · 司馬遷 · 班固 · 羅貫中 · 曹雪芹       */
  documents: [
    { file: 'sunzi.pdf',       titleZh: '孫子兵法', titleEn: 'The Art of War',                 url: 'https://ctext.org/art-of-war/zh'      },
    { file: 'shiji.pdf',       titleZh: '史記',     titleEn: 'Records of the Grand Historian', url: 'https://ctext.org/shiji/zh'            },
    { file: 'hanshu.pdf',      titleZh: '漢書',     titleEn: 'Book of Han',                    url: 'https://ctext.org/han-shu/zh'          },
    { file: 'sanguo.pdf',      titleZh: '三國演義', titleEn: 'Romance of the Three Kingdoms',  url: 'https://ctext.org/sanguo-yanyi/zh'     },
    { file: 'hongloumeng.pdf', titleZh: '紅樓夢',   titleEn: 'Dream of the Red Chamber',       url: 'https://ctext.org/hongloumeng/zh'      },
  ],

};
