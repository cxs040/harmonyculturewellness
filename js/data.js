/* ════════════════════════════════════════
   SITE CONTENT DATA
   ─────────────────────────────────────────
   Edit THIS file to add, remove, or update
   all website content. No other file needs
   changing for content edits.

   QUICK GUIDE
   ┌─ Add a poem       → add an object to POEMS
   ├─ Add a concept    → add to CONCEPTS.confucianism or CONCEPTS.taoism
   ├─ Add a figure     → add to FIGURES, then add its key to ERAS
   └─ Add a daily quote→ add to QUOTES
   ════════════════════════════════════════ */


/* ══════════════════════════════════════════
   SECTION OPENING QUOTES
   The blockquote shown at the top of each
   philosophy section.
   ══════════════════════════════════════════ */
const SECTION_QUOTES = {

  confucianism: {
    zh:       '學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？',
    en:       'Is it not pleasant to learn with constant perseverance? Is it not delightful to have friends coming from distant quarters?',
    sourceZh: '《論語·學而》',
    sourceEn: 'Analects of Confucius, Book I',
  },

  taoism: {
    zh:       '道可道，非常道；名可名，非常名。無名天地之始，有名萬物之母。',
    en:       'The Tao that can be told is not the eternal Tao; the name that can be named is not the eternal name. The nameless is the origin of heaven and earth; the named is the mother of ten thousand things.',
    sourceZh: '《道德經》第一章 · 老子',
    sourceEn: 'Tao Te Ching, Chapter I · Laozi',
  },

};

/* Sub-heading shown above each concept list */
const SECTION_HEADINGS = {
  confucianism: { zh: '五常：核心德目', en: 'The Five Constants' },
  taoism:       { zh: '核心概念',       en: 'Core Concepts'      },
};


/* ══════════════════════════════════════════
   CONCEPTS / PRINCIPLES
   Listed under each philosophy section.
   HOW TO ADD: append an object to the array.
   Fields: charZh, titleZh, titleEn, descZh, descEn
   ══════════════════════════════════════════ */
const CONCEPTS = {

  confucianism: [
    {
      charZh: '仁', titleZh: '仁 · 仁愛', titleEn: 'Rén · Benevolence',
      descZh: '愛人，人與人之間相互敬愛的道德情感',
      descEn: 'Love and compassion for others; the highest moral virtue',
    },
    {
      charZh: '義', titleZh: '義 · 正義', titleEn: 'Yì · Righteousness',
      descZh: '行事合乎道德規範，以正義為準則',
      descEn: 'Acting in accordance with moral principles and justice',
    },
    {
      charZh: '禮', titleZh: '禮 · 禮儀', titleEn: 'Lǐ · Ritual Propriety',
      descZh: '禮儀規範，是社會秩序與和諧的基礎',
      descEn: 'Rites and rituals that form the foundation of harmonious society',
    },
    {
      charZh: '智', titleZh: '智 · 智慧', titleEn: 'Zhì · Wisdom',
      descZh: '明辨是非，擁有道德判斷力與洞察力',
      descEn: 'Discerning right from wrong; moral wisdom and insight',
    },
    {
      charZh: '信', titleZh: '信 · 誠信', titleEn: 'Xìn · Integrity',
      descZh: '言而有信，誠實守諾，立身之本',
      descEn: "Faithfulness, trustworthiness, and keeping one's word",
    },
  ],

  taoism: [
    {
      charZh: '道', titleZh: '道 · 宇宙本源', titleEn: 'Tào · The Way',
      descZh: '萬物之本，宇宙運行的根本規律，不可言說，只可體悟',
      descEn: 'The fundamental principle underlying all existence; the natural order of the universe beyond words',
    },
    {
      charZh: '德', titleZh: '德 · 內在德性', titleEn: 'Dé · Virtue & Power',
      descZh: '順道而行所積累的內在力量與品德修為',
      descEn: 'The power and virtue accumulated through living in harmony with the Tao',
    },
    {
      charZh: '無', titleZh: '無為 · 自然而然', titleEn: 'Wúwéi · Non-Action',
      descZh: '順應自然，不強行妄為；以柔克剛，以靜制動',
      descEn: 'Acting in harmony with the natural flow; yielding and softness overcome the forceful and rigid',
    },
    {
      charZh: '樸', titleZh: '樸 · 純樸自然', titleEn: 'Pǔ · Simplicity',
      descZh: '返璞歸真，摒棄人為的繁瑣，回歸本真',
      descEn: "Returning to simplicity; shedding artifice to rediscover one's authentic nature",
    },
  ],

};


/* ══════════════════════════════════════════
   POEMS
   Displayed on the Poetry page.
   HOW TO ADD: append an object to the array.
   Fields:
     id        — unique HTML id (e.g. 'poem-mypoem')
     titleZh / titleEn
     authorZh / authorEn
     linesZh   — array, one string per line
     linesEn   — array, one string per line
   ══════════════════════════════════════════ */
const POEMS = [

  {
    id: 'poem-jingye',
    titleZh: '靜夜思',       titleEn: 'Thoughts on a Quiet Night',
    authorZh: '李白 · 唐',   authorEn: 'Li Bai · Tang Dynasty',
    linesZh: ['床前明月光，', '疑是地上霜。', '舉頭望明月，', '低頭思故鄉。'],
    linesEn: [
      'Before my bed the moonlight gleams,',
      'I wonder if it is frost on the ground.',
      'Raising my head I gaze at the bright moon,',
      'Bowing my head I think of my distant home.',
    ],
  },

  {
    id: 'poem-chunwang',
    titleZh: '春望',         titleEn: 'Spring View',
    authorZh: '杜甫 · 唐',   authorEn: 'Du Fu · Tang Dynasty',
    linesZh: ['國破山河在，', '城春草木深。', '感時花濺淚，', '恨別鳥驚心。'],
    linesEn: [
      'The nation is broken; mountains and rivers remain.',
      'Spring comes to the city; grass and trees grow deep.',
      'Moved by the times, flowers draw tears;',
      'Grieving separation, birds startle the heart.',
    ],
  },

  {
    id: 'poem-shuidade',
    titleZh: '水調歌頭',     titleEn: 'Prelude to Water Melody',
    authorZh: '蘇軾 · 宋',   authorEn: 'Su Shi · Song Dynasty',
    linesZh: [
      '明月幾時有，把酒問青天。',
      '不知天上宮闕，今夕是何年。',
      '人有悲歡離合，月有陰晴圓缺，',
      '此事古難全。但願人長久，千里共嬋娟。',
    ],
    linesEn: [
      'How long has the bright moon been there?',
      'I raise my cup to ask the blue sky.',
      'People have joys and sorrows, partings and reunions;',
      'The moon waxes and wanes — this has ever been so.',
      'I only wish for enduring life, to share this moonlight across a thousand miles.',
    ],
  },

  {
    id: 'poem-guanque',
    titleZh: '登鸛雀樓',     titleEn: 'Ascending Stork Tower',
    authorZh: '王之渙 · 唐', authorEn: 'Wang Zhihuan · Tang Dynasty',
    linesZh: ['白日依山盡，', '黃河入海流。', '欲窮千里目，', '更上一層樓。'],
    linesEn: [
      'The white sun descends behind the mountains;',
      'The Yellow River flows into the sea.',
      'To exhaust the view a thousand miles distant,',
      'Ascend yet one more storey of the tower.',
    ],
  },

  {
    id: 'poem-liangzhou',
    titleZh: '涼州詞',       titleEn: 'Liangzhou Ci',
    authorZh: '王之渙 · 唐', authorEn: 'Wang Zhihuan · Tang Dynasty',
    linesZh: ['黃河遠上白雲間，', '一片孤城萬仞山。', '羌笛何須怨楊柳，', '春風不度玉門關。'],
    linesEn: [
      'The Yellow River winds far up among the white clouds;',
      'A solitary city stands amid ten-thousand-fathom peaks.',
      'Why should the Qiang flute grieve with the tune of willows?',
      'Spring breezes never cross beyond the Jade Gate Pass.',
    ],
  },

  {
    id: 'poem-lushan',
    titleZh: '望廬山瀑布',   titleEn: 'Gazing at the Waterfall of Mount Lu',
    authorZh: '李白 · 唐',   authorEn: 'Li Bai · Tang Dynasty',
    linesZh: ['日照香爐生紫煙，', '遙看瀑布掛前川。', '飛流直下三千尺，', '疑是銀河落九天。'],
    linesEn: [
      'Sunlight on Incense Burner Peak conjures violet mist;',
      'Far off I watch the waterfall hang before the river.',
      'The torrent plunges straight down three thousand feet —',
      'I wonder if the Milky Way has fallen from the ninth heaven.',
    ],
  },

  {
    id: 'poem-denggao',
    titleZh: '登高',         titleEn: 'Ascending the Heights',
    authorZh: '杜甫 · 唐',   authorEn: 'Du Fu · Tang Dynasty',
    linesZh: [
      '風急天高猿嘯哀，渚清沙白鳥飛回。',
      '無邊落木蕭蕭下，不盡長江滾滾來。',
      '萬里悲秋常作客，百年多病獨登臺。',
      '艱難苦恨繁霜鬢，潦倒新停濁酒杯。',
    ],
    linesEn: [
      'Sharp wind, high sky — gibbons cry in sorrow; clear islet, white sand — birds circle and return.',
      'Endless falling leaves rustle down; the boundless Yangtze rolls on without cease.',
      'Ten thousand li from home I grieve in autumn yet again; a hundred years of illness, I climb alone.',
      'Hardship and bitter regret have thickened the frost at my temples; worn down, I set aside my cup of wine.',
    ],
  },

  {
    id: 'poem-xilin',
    titleZh: '題西林壁',     titleEn: 'Inscription on the Wall of West Forest Temple',
    authorZh: '蘇軾 · 宋',   authorEn: 'Su Shi · Song Dynasty',
    linesZh: ['橫看成嶺側成峰，', '遠近高低各不同。', '不識廬山真面目，', '只緣身在此山中。'],
    linesEn: [
      'Viewed from the front it forms a range; from the side, a peak —',
      'Near and far, high and low, each perspective differs.',
      'Why can I not tell the true face of Mount Lu?',
      'Only because I myself am standing within the mountain.',
    ],
  },

  {
    id: 'poem-rumengling',
    titleZh: '如夢令',       titleEn: 'As If in a Dream',
    authorZh: '李清照 · 宋', authorEn: 'Li Qingzhao · Song Dynasty',
    linesZh: [
      '昨夜雨疏風驟，濃睡不消殘酒。',
      '試問卷簾人，卻道海棠依舊。',
      '知否？知否？應是綠肥紅瘦。',
    ],
    linesEn: [
      'Last night sparse rain and fierce wind; deep sleep could not dispel the lingering wine.',
      'I asked the one who rolled up the blind — "The crabapple blossoms are still the same."',
      'But do you know? Do you know? The green leaves must be lush, the red petals thin.',
    ],
  },

  {
    id: 'poem-guanshuyougan',
    titleZh: '觀書有感',     titleEn: 'Reflections on Reading',
    authorZh: '朱熹 · 宋',   authorEn: 'Zhu Xi · Song Dynasty',
    linesZh: ['半畝方塘一鑑開，', '天光雲影共徘徊。', '問渠那得清如許？', '為有源頭活水來。'],
    linesEn: [
      'Half an acre of square pond opens like a mirror;',
      'Sky-light and cloud shadows linger and drift together.',
      'How is it that this pond stays so crystal clear?',
      'Because living water flows ceaselessly from its source.',
    ],
  },

];


/* ══════════════════════════════════════════
   HISTORICAL FIGURES
   HOW TO ADD A FIGURE:
   1. Add a key → object entry below.
   2. Add the key to the correct era in ERAS.

   Fields:
     nameZh / nameEn       — display name
     dynastyZh / dynastyEn — era label in modal badge
     section               — Explore button destination:
                             'confucianism' | 'taoism' | 'poetry' | 'documents'
     catLabelZh / catLabelEn — category badge
     quoteZh / quoteEn     — famous passage shown in modal
     sourceZh / sourceEn   — citation
   ══════════════════════════════════════════ */
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
    quoteEn: "It is certain that all men must die, but some deaths are weightier than Mount Tai and others lighter than a feather. To give one's life for the people is weightier than Mount Tai; to die in service to tyranny is lighter than a feather.",
    sourceZh: '《報任少卿書》', sourceEn: 'Letter to Ren An',
  },

  bangu: {
    nameZh: '班固', nameEn: 'Ban Gu',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '蓋文章，經國之大業，不朽之盛事。年壽有時而盡，榮樂止乎其身，二者必至之常期，未若文章之無窮。',
    quoteEn: "Literary writing is the greatest undertaking in governing a nation and an affair of undying glory. A person's lifespan eventually ends, and honour ceases with the body — both have their inevitable terms. Yet they cannot compare with literary writing, which endures without end.",
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


/* ══════════════════════════════════════════
   TIMELINE ERAS
   Defines the order of eras on the Timeline
   page and which figures belong to each.

   HOW TO ADD A FIGURE TO AN ERA:
     Add its key (from FIGURES) to the
     figures array of the matching era.
   HOW TO ADD A NEW ERA:
     Append a new object to the array.
   ══════════════════════════════════════════ */
const ERAS = [
  {
    period:  '770 – 476 BCE',
    nameZh:  '春秋時代',
    nameEn:  'Spring & Autumn',
    figures: ['kongzi', 'laozi', 'sunzi'],
  },
  {
    period:  '475 – 221 BCE',
    nameZh:  '戰國時代',
    nameEn:  'Warring States',
    figures: ['mengzi', 'zhuangzi', 'xunzi'],
  },
  {
    period:  '206 BCE – 220 CE',
    nameZh:  '漢朝',
    nameEn:  'Han Dynasty',
    figures: ['dongzhongshu', 'simaqian', 'bangu'],
  },
  {
    period:  '618 – 907 CE',
    nameZh:  '唐朝',
    nameEn:  'Tang Dynasty',
    figures: ['libai', 'dufu', 'wangzhihuan'],
  },
  {
    period:  '960 – 1279 CE',
    nameZh:  '宋朝',
    nameEn:  'Song Dynasty',
    figures: ['sushi', 'zhuxi', 'liqingzhao'],
  },
  {
    period:  '1271 – 1912 CE',
    nameZh:  '元明清',
    nameEn:  'Yuan · Ming · Qing',
    figures: ['luoguanzhong', 'caoxueqin', 'wangyangming'],
  },
];


/* ══════════════════════════════════════════
   QUOTE OF THE DAY POOL
   Shown on the Home page. Rotates daily.
   HOW TO ADD: append an object to the array.
   Fields: text, source
   ══════════════════════════════════════════ */
const QUOTES = [
  { text: '學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？',    source: '《論語·學而》· 孔子'         },
  { text: '道可道，非常道；名可名，非常名。',                   source: '《道德經》第一章 · 老子'      },
  { text: '知己知彼，百戰不殆。',                               source: '《孫子兵法》· 孫子'           },
  { text: '天下興亡，匹夫有責。',                               source: '《日知錄》· 顧炎武'           },
  { text: '窮則獨善其身，達則兼善天下。',                       source: '《孟子·盡心上》· 孟子'        },
  { text: '不以物喜，不以己悲。',                               source: '《岳陽樓記》· 范仲淹'         },
  { text: '人有悲歡離合，月有陰晴圓缺，此事古難全。',           source: '《水調歌頭》· 蘇軾'           },
  { text: '海內存知己，天涯若比鄰。',                           source: '《送杜少府之任蜀州》· 王勃'    },
  { text: '千里之行，始於足下。',                               source: '《道德經》第六十四章 · 老子'   },
  { text: '博學之，審問之，慎思之，明辨之，篤行之。',           source: '《禮記·中庸》'                },
  { text: '路漫漫其修遠兮，吾將上下而求索。',                   source: '《離騷》· 屈原'               },
  { text: '知之者不如好之者，好之者不如樂之者。',               source: '《論語·雍也》· 孔子'          },
];
