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

  buddhism: {
    zh:       '觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空，度一切苦厄。',
    en:       'The Bodhisattva Avalokiteśvara, while practising the deep perfection of wisdom, perceived that all five aggregates are empty, and freed all beings from suffering.',
    sourceZh: '《般若波羅蜜多心經》',
    sourceEn: 'The Heart Sutra (Prajñāpāramitā Hṛdaya)',
  },

};

/* Sub-heading shown above each concept list */
const SECTION_HEADINGS = {
  confucianism: { zh: '五常：核心德目', en: 'The Five Constants' },
  taoism:       { zh: '核心概念',       en: 'Core Concepts'      },
  buddhism:     { zh: '核心義理',       en: 'Core Teachings'     },
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

  buddhism: [
    {
      charZh: '空', titleZh: '空 · 性空緣起', titleEn: 'Kōng · Emptiness (Śūnyatā)',
      descZh: '萬物無固定自性，因緣和合而生。空非虛無，乃指萬物無常自存之性，破除對自我與外物的執著',
      descEn: 'All phenomena lack inherent self-existence; they arise through dependent origination. Emptiness is not nothingness — it points to the absence of fixed, independent essence',
    },
    {
      charZh: '緣', titleZh: '緣起 · 相依相存', titleEn: 'Yuánqǐ · Dependent Origination',
      descZh: '此有故彼有，此生故彼生。萬物相互依存，因緣際會方生萬象，無一物可獨立存在',
      descEn: 'Because this exists, that exists; because this arises, that arises. All phenomena arise through mutual conditions — nothing exists independently',
    },
    {
      charZh: '諦', titleZh: '四諦 · 苦集滅道', titleEn: 'Sì Dì · Four Noble Truths',
      descZh: '苦諦（生命之苦）、集諦（苦之根源在貪愛）、滅諦（苦可止息）、道諦（八正道為解脫之徑）',
      descEn: 'Suffering exists; it has a cause (craving); it can cease; the Noble Eightfold Path leads to its cessation',
    },
    {
      charZh: '道', titleZh: '八正道 · 解脫之路', titleEn: 'Bā Zhèngdào · Noble Eightfold Path',
      descZh: '正見、正思、正語、正業、正命、正精進、正念、正定，通向涅槃解脫之路',
      descEn: 'Right view, intention, speech, action, livelihood, effort, mindfulness, and concentration — the path to nirvāṇa',
    },
    {
      charZh: '禪', titleZh: '禪定 · 明心見性', titleEn: 'Chán · Meditation & Insight',
      descZh: '透過靜坐冥想，觀照自心，息滅妄念，以達明心見性、超越生死之境界',
      descEn: 'Through meditative practice one stills the mind, observes the nature of awareness, and attains liberation beyond birth and death',
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
    lat: 35.60, lng: 116.99, locationZh: '魯國曲阜', locationEn: 'Qufu, Lu State',
  },

  laozi: {
    nameZh: '老子', nameEn: 'Laozi',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'taoism', catLabelZh: '道家', catLabelEn: 'Taoism',
    quoteZh: '道可道，非常道；名可名，非常名。無名天地之始，有名萬物之母。',
    quoteEn: 'The Tao that can be told is not the eternal Tao; the name that can be named is not the eternal name. The nameless is the origin of heaven and earth; the named is the mother of ten thousand things.',
    sourceZh: '《道德經》第一章', sourceEn: 'Tao Te Ching, Chapter I',
    lat: 33.85, lng: 115.48, locationZh: '陳國苦縣（今河南鹿邑）', locationEn: 'Luyi, Henan',
  },

  sunzi: {
    nameZh: '孫子', nameEn: 'Sun Tzu',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '知己知彼，百戰不殆；不知彼而知己，一勝一負；不知彼，不知己，每戰必敗。',
    quoteEn: 'If you know the enemy and know yourself, you need not fear the result of a hundred battles. If you know yourself but not the enemy, for every victory you will also suffer a defeat. If you know neither yourself nor the enemy, you will succumb in every battle.',
    sourceZh: '《孫子兵法·謀攻篇》', sourceEn: 'The Art of War, Chapter III',
    lat: 37.49, lng: 117.52, locationZh: '齊國樂安（今山東惠民）', locationEn: 'Huimin, Shandong',
  },

  mengzi: {
    nameZh: '孟子', nameEn: 'Mencius',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '老吾老，以及人之老；幼吾幼，以及人之幼。天下可運於掌。',
    quoteEn: 'Treat the aged of your own family with the reverence due to age, then extend that reverence to the aged of other families; treat your own young with the tenderness due to youth, then extend that tenderness to the young of other families — and the empire may be turned in your palm.',
    sourceZh: '《孟子·梁惠王上》', sourceEn: 'Mencius, Book I Part A',
    lat: 35.40, lng: 117.00, locationZh: '鄒國（今山東鄒城）', locationEn: 'Zoucheng, Shandong',
  },

  zhuangzi: {
    nameZh: '莊子', nameEn: 'Zhuangzi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'taoism', catLabelZh: '道家', catLabelEn: 'Taoism',
    quoteZh: '吾生也有涯，而知也無涯。以有涯隨無涯，殆已！已而為知者，殆而已矣。',
    quoteEn: 'Our life has a limit, but our knowledge is without limit. To use what has a limit in pursuit of what is without limit is a perilous thing; and when, knowing this, we still seek the increase of our knowledge, the peril cannot be averted.',
    sourceZh: '《莊子·養生主》', sourceEn: 'Zhuangzi, The Secret of Caring for Life',
    lat: 34.42, lng: 115.65, locationZh: '宋國蒙邑（今河南商丘）', locationEn: 'Shangqiu, Henan',
  },

  xunzi: {
    nameZh: '荀子', nameEn: 'Xunzi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '青，取之於藍，而青於藍；冰，水為之，而寒於水。',
    quoteEn: 'Indigo blue is extracted from the indigo plant and yet it surpasses the plant in blueness. Ice is made of water and yet it is colder than water — learning transforms the learner beyond the source.',
    sourceZh: '《荀子·勸學》', sourceEn: 'Xunzi, An Exhortation to Learning',
    lat: 38.42, lng: 112.73, locationZh: '趙國（今山西新絳）', locationEn: 'Xinjiang, Shanxi',
  },

  dongzhongshu: {
    nameZh: '董仲舒', nameEn: 'Dong Zhongshu',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '仁義禮智信，五者，王道之本也。此五者並行，人道出焉。聖人知其然，故多其愛而少其嚴。',
    quoteEn: 'Benevolence, righteousness, ritual propriety, wisdom, and integrity — these five are the foundation of the kingly way. When they flourish together, the way of humanity emerges. The sage, knowing this, emphasises love over severity.',
    sourceZh: '《春秋繁露》', sourceEn: 'Luxuriant Gems of the Spring and Autumn Annals',
    lat: 38.57, lng: 115.56, locationZh: '廣川（今河北景縣）', locationEn: 'Jingxian, Hebei',
  },

  simaqian: {
    nameZh: '司馬遷', nameEn: 'Sima Qian',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '人固有一死，或重於泰山，或輕於鴻毛，用之所趨異也。',
    quoteEn: "It is certain that all men must die, but some deaths are weightier than Mount Tai and others lighter than a feather. To give one's life for the people is weightier than Mount Tai; to die in service to tyranny is lighter than a feather.",
    sourceZh: '《報任少卿書》', sourceEn: 'Letter to Ren An',
    lat: 35.48, lng: 110.44, locationZh: '夏陽（今陝西韓城）', locationEn: 'Hancheng, Shaanxi',
  },

  bangu: {
    nameZh: '班固', nameEn: 'Ban Gu',
    dynastyZh: '漢朝', dynastyEn: 'Han Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '蓋文章，經國之大業，不朽之盛事。年壽有時而盡，榮樂止乎其身，二者必至之常期，未若文章之無窮。',
    quoteEn: "Literary writing is the greatest undertaking in governing a nation and an affair of undying glory. A person's lifespan eventually ends, and honour ceases with the body — both have their inevitable terms. Yet they cannot compare with literary writing, which endures without end.",
    sourceZh: '《典論·論文》', sourceEn: 'Discourse on Literature',
    lat: 34.34, lng: 108.71, locationZh: '安陵（今陝西咸陽）', locationEn: 'Xianyang, Shaanxi',
  },

  libai: {
    nameZh: '李白', nameEn: 'Li Bai',
    dynastyZh: '唐朝', dynastyEn: 'Tang Dynasty',
    section: 'documents', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '君不見黃河之水天上來，奔流到海不復回。君不見高堂明鏡悲白髮，朝如青絲暮成雪。人生得意須盡歡，莫使金樽空對月。',
    quoteEn: 'Do you not see the waters of the Yellow River pour down from the sky, rushing to the sea never to return? Do you not see the bright mirror in the high hall lamenting white hair — morning threads of silk, by evening turned to snow? When life is joyful, make the most of it; do not let the golden goblet face the moon alone and empty.',
    sourceZh: '《將進酒》', sourceEn: 'Bring in the Wine',
    lat: 31.78, lng: 104.73, locationZh: '綿州昌隆（今四川江油）', locationEn: 'Jiangyou, Sichuan',
  },

  dufu: {
    nameZh: '杜甫', nameEn: 'Du Fu',
    dynastyZh: '唐朝', dynastyEn: 'Tang Dynasty',
    section: 'documents', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '國破山河在，城春草木深。感時花濺淚，恨別鳥驚心。烽火連三月，家書抵萬金。',
    quoteEn: 'The nation is broken, yet mountains and rivers remain. Spring comes to the city — grass and trees grow deep. Moved by the times, flowers draw forth tears; grieving separation, birds startle the heart. The beacon fires have blazed for three months; a letter from home is worth ten thousand in gold.',
    sourceZh: '《春望》', sourceEn: 'Spring View',
    lat: 34.76, lng: 113.02, locationZh: '鞏縣（今河南鞏義）', locationEn: 'Gongyi, Henan',
  },

  wangzhihuan: {
    nameZh: '王之渙', nameEn: 'Wang Zhihuan',
    dynastyZh: '唐朝', dynastyEn: 'Tang Dynasty',
    section: 'documents', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '白日依山盡，黃河入海流。欲窮千里目，更上一層樓。',
    quoteEn: 'The white sun sets beyond the mountains; the Yellow River flows into the sea. To see a thousand miles further, you must climb one more storey of the tower.',
    sourceZh: '《登鸛雀樓》', sourceEn: 'Ascending Stork Tower',
    lat: 37.87, lng: 112.55, locationZh: '絳州（今山西新絳）', locationEn: 'Xinjiang, Shanxi',
  },

  sushi: {
    nameZh: '蘇軾', nameEn: 'Su Shi',
    dynastyZh: '宋朝', dynastyEn: 'Song Dynasty',
    section: 'documents', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '明月幾時有，把酒問青天。不知天上宮闕，今夕是何年。人有悲歡離合，月有陰晴圓缺，此事古難全。但願人長久，千里共嬋娟。',
    quoteEn: 'How long has the bright moon been there? I raise my cup to ask the blue sky. I wonder what year it is tonight in the palace above. People have sorrows and joys, partings and reunions; the moon waxes and wanes — perfection has always been elusive. I only wish those I love may live long, to share this beautiful moonlight across a thousand miles.',
    sourceZh: '《水調歌頭·明月幾時有》', sourceEn: 'Prelude to Water Melody',
    lat: 30.07, lng: 103.85, locationZh: '眉州眉山（今四川眉山）', locationEn: 'Meishan, Sichuan',
  },

  zhuxi: {
    nameZh: '朱熹', nameEn: 'Zhu Xi',
    dynastyZh: '宋朝', dynastyEn: 'Song Dynasty',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '問渠那得清如許？為有源頭活水來。',
    quoteEn: 'How is it that this pond stays so crystal clear? Because living water flows ceaselessly from its source. (A metaphor for continuous study and the renewal of the mind through fresh learning.)',
    sourceZh: '《觀書有感》', sourceEn: 'Reflections on Reading',
    lat: 26.17, lng: 118.18, locationZh: '南劍州尤溪（今福建尤溪）', locationEn: 'Youxi, Fujian',
  },

  liqingzhao: {
    nameZh: '李清照', nameEn: 'Li Qingzhao',
    dynastyZh: '宋朝', dynastyEn: 'Song Dynasty',
    section: 'documents', catLabelZh: '詩詞', catLabelEn: 'Poetry',
    quoteZh: '生當作人傑，死亦為鬼雄。至今思項羽，不肯過江東。',
    quoteEn: 'In life, be a hero among the living; in death, be a hero among the dead. I still think of Xiang Yu, who refused to cross the river east and retreat from defeat.',
    sourceZh: '《夏日絕句》', sourceEn: 'Quatrain Written in Summer',
    lat: 36.67, lng: 117.00, locationZh: '齊州濟南（今山東濟南）', locationEn: 'Jinan, Shandong',
  },

  luoguanzhong: {
    nameZh: '羅貫中', nameEn: 'Luo Guanzhong',
    dynastyZh: '元末明初', dynastyEn: 'Yuan–Ming Period',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '話說天下大勢，分久必合，合久必分。',
    quoteEn: 'It is a truth universally acknowledged that the realm under heaven, after a long period of division, tends to unite; and after a long period of union, tends to divide.',
    sourceZh: '《三國演義》第一回', sourceEn: 'Romance of the Three Kingdoms, Chapter I',
    lat: 37.87, lng: 112.55, locationZh: '太原（今山西太原）', locationEn: 'Taiyuan, Shanxi',
  },

  caoxueqin: {
    nameZh: '曹雪芹', nameEn: 'Cao Xueqin',
    dynastyZh: '清朝', dynastyEn: 'Qing Dynasty',
    section: 'documents', catLabelZh: '典籍', catLabelEn: 'Documents',
    quoteZh: '滿紙荒唐言，一把辛酸淚。都云作者癡，誰解其中味？',
    quoteEn: 'Pages full of fantastical words, a handful of bitter tears — all say the author was a fool; who can understand the taste within?',
    sourceZh: '《紅樓夢》卷首題詩', sourceEn: 'Dream of the Red Chamber, Preface Poem',
    lat: 32.06, lng: 118.79, locationZh: '江寧（今江蘇南京）', locationEn: 'Nanjing, Jiangsu',
  },

  wangyangming: {
    nameZh: '王陽明', nameEn: 'Wang Yangming',
    dynastyZh: '明朝', dynastyEn: 'Ming Dynasty',
    section: 'confucianism', catLabelZh: '儒家', catLabelEn: 'Confucianism',
    quoteZh: '知是行之始，行是知之成。',
    quoteEn: 'Knowledge is the beginning of action; action is the completion of knowledge. True understanding and moral conduct are inseparable — to genuinely know something is already to act upon it.',
    sourceZh: '《傳習錄》', sourceEn: 'Instructions for Practical Living',
    lat: 29.97, lng: 121.15, locationZh: '餘姚（今浙江餘姚）', locationEn: 'Yuyao, Zhejiang',
  },

  /* ══════════════════════════════════════════
     諸子百家 — HUNDRED SCHOOLS OF THOUGHT
     春秋 · 戰國 全覽
     ══════════════════════════════════════════ */

  /* ── 儒家 (Confucianism) — Spring & Autumn ── */
  guanzi: {
    nameZh: '管仲', nameEn: 'Guan Zhong',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'documents', catLabelZh: '法家先驅', catLabelEn: 'Proto-Legalism',
    quoteZh: '倉廩實而知禮節，衣食足而知榮辱。上服度則六親固，四維張則君令行。',
    quoteEn: 'When the granaries are full, the people learn ritual propriety; when clothing and food are sufficient, they understand honour and shame. When the ruler observes proper measure, the six relationships are secure; when the four moral principles are upheld, the ruler\'s commands are heeded.',
    sourceZh: '《管子·牧民》', sourceEn: 'Guanzi, Shepherding the People',
    lat: 36.57, lng: 119.57, locationZh: '齊國（今山東安丘）', locationEn: 'Anqiu, Shandong',
  },

  zichan: {
    nameZh: '子產', nameEn: 'Zi Chan',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'documents', catLabelZh: '法家先驅', catLabelEn: 'Proto-Legalism',
    quoteZh: '寬猛相濟，政是以和。火烈，民望而畏之，故鮮死焉；水懦弱，民狎而翫之，則多死焉。故從政者寬以濟猛，猛以濟寬，政是以和。',
    quoteEn: 'Leniency and severity must complement each other — this is how governance achieves harmony. Fire is fierce: the people fear it and few perish in it. Water is gentle: the people take it lightly and many drown in it. Therefore the statesman tempers severity with leniency and leniency with severity — and governance achieves harmony.',
    sourceZh: '《左傳·昭公二十年》', sourceEn: 'Zuo Zhuan, 20th Year of Duke Zhao',
    lat: 34.39, lng: 113.85, locationZh: '鄭國新鄭（今河南新鄭）', locationEn: 'Xinzheng, Henan',
  },

  yanying: {
    nameZh: '晏嬰', nameEn: 'Yan Ying',
    dynastyZh: '春秋時代', dynastyEn: 'Spring & Autumn',
    section: 'documents', catLabelZh: '政治家', catLabelEn: 'Statesman',
    quoteZh: '聖人千慮，必有一失；愚人千慮，必有一得。',
    quoteEn: 'Even a sage, after a thousand deliberations, must make one mistake; even a fool, after a thousand deliberations, must arrive at one correct answer.',
    sourceZh: '《晏子春秋·內篇雜下》', sourceEn: 'Yanzi Chunqiu, Inner Chapters',
    lat: 36.38, lng: 119.75, locationZh: '齊國夷維（今山東高密）', locationEn: 'Gaomi, Shandong',
  },

  /* ── 墨家 (Mohism) ── */
  mozi: {
    nameZh: '墨子', nameEn: 'Mozi',
    dynastyZh: '春秋末至戰國初', dynastyEn: 'Late Spring & Autumn',
    section: 'documents', catLabelZh: '墨家', catLabelEn: 'Mohism',
    quoteZh: '兼相愛，交相利。視人之國，若視其國；視人之家，若視其家；視人之身，若視其身。',
    quoteEn: 'Love all people impartially and benefit them mutually. Regard other states as your own state; regard other families as your own family; regard other persons as yourself.',
    sourceZh: '《墨子·兼愛中》', sourceEn: 'Mozi, Universal Love II',
    lat: 34.77, lng: 117.67, locationZh: '魯國（今山東滕州）', locationEn: 'Tengzhou, Shandong',
  },

  /* ── 道家 (Taoism) — additional ── */
  liezi: {
    nameZh: '列子', nameEn: 'Liezi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'taoism', catLabelZh: '道家', catLabelEn: 'Taoism',
    quoteZh: '天地無全功，聖人無全能，萬物無全用。故天職生覆，地職形載，聖職教化，物職所宜。',
    quoteEn: 'Heaven and earth do not encompass all functions; the sage does not possess all capacities; the ten thousand things do not have all uses. Heaven\'s duty is to produce and shelter; earth\'s is to shape and support; the sage\'s is to teach and transform; each thing\'s is to serve its fitting purpose.',
    sourceZh: '《列子·天瑞》', sourceEn: 'Liezi, Heavenly Gifts',
    lat: 34.76, lng: 113.63, locationZh: '鄭國（今河南鄭州）', locationEn: 'Zhengzhou, Henan',
  },

  yangzhu: {
    nameZh: '楊朱', nameEn: 'Yang Zhu',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'taoism', catLabelZh: '道家·楊朱學派', catLabelEn: 'Taoism · Yang Zhu School',
    quoteZh: '古之人損一毫利天下，不與也；悉天下奉一身，不取也。人人不損一毫，人人不利天下，天下治矣。',
    quoteEn: 'The men of old would not give up a single hair to benefit the world, nor would they take all the world\'s wealth for their own person. If every person refused to sacrifice a single hair, and every person refrained from exploiting the world, the world would govern itself.',
    sourceZh: '《列子·楊朱》', sourceEn: 'Liezi, Yang Zhu',
    lat: 34.79, lng: 114.28, locationZh: '魏國（今河南開封附近）', locationEn: 'Near Kaifeng, Henan',
  },

  /* ── 法家 (Legalism) ── */
  shenbuhui: {
    nameZh: '申不害', nameEn: 'Shen Buhai',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '法家', catLabelEn: 'Legalism',
    quoteZh: '術者，因任而授官，循名而責實，操殺生之柄，課群臣之能者也。此人主之所執也。',
    quoteEn: 'The method of statecraft means: assign office according to ability, hold men accountable to the name of their post, hold the power of life and death, and assess the competence of all ministers. This is what the ruler must hold fast to.',
    sourceZh: '《韓非子·定法》引申子', sourceEn: 'Cited in Han Feizi, Fixing Standards',
    lat: 34.41, lng: 113.80, locationZh: '鄭國→韓國（今河南鄭州）', locationEn: 'Zhengzhou, Henan',
  },

  shendao: {
    nameZh: '慎到', nameEn: 'Shen Dao',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '法家·道家', catLabelEn: 'Legalism · Taoism',
    quoteZh: '賢而屈於不肖者，權輕也；不肖而服於賢者，位尊也。堯為匹夫，不能治三人；而桀為天子，能亂天下。',
    quoteEn: 'When the worthy submits to the unworthy, it is because the former\'s authority is light; when the unworthy obeys the worthy, it is because the latter\'s position is high. Yao as a commoner could not govern three people; but Jie as the Son of Heaven could throw the empire into chaos.',
    sourceZh: '《慎子》', sourceEn: 'Shenzi',
    lat: 36.62, lng: 114.47, locationZh: '趙國（今河北邯鄲）', locationEn: 'Handan, Hebei',
  },

  shanyang: {
    nameZh: '商鞅', nameEn: 'Shang Yang',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '法家', catLabelEn: 'Legalism',
    quoteZh: '法者，所以愛民也；禮者，所以便事也。是以聖人苟可以強國，不法其故；苟可以利民，不循其禮。',
    quoteEn: 'Law is the means by which the people are protected; ritual the means by which affairs proceed. If a sage can strengthen the state, he need not follow old models; if he can benefit the people, he need not observe established rites.',
    sourceZh: '《商君書·更法》', sourceEn: 'The Book of Lord Shang, Changing the Law',
    lat: 35.30, lng: 114.87, locationZh: '衛國（今河南濮陽）', locationEn: 'Puyang, Henan',
  },

  hanfeizi: {
    nameZh: '韓非子', nameEn: 'Han Feizi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '法家', catLabelEn: 'Legalism',
    quoteZh: '法不阿貴，繩不撓曲。法之所加，智者弗能辭，勇者弗敢爭。刑過不避大臣，賞善不遺匹夫。',
    quoteEn: 'The law does not yield to the noble; the plumb-line does not bend for the crooked. Where the law applies, neither the wise can excuse themselves nor the brave dare resist. Punishment for transgressions spares not the high minister; reward for virtue overlooks not the common man.',
    sourceZh: '《韓非子·有度》', sourceEn: 'Han Feizi, Having Standards',
    lat: 34.39, lng: 113.86, locationZh: '韓國新鄭（今河南新鄭）', locationEn: 'Xinzheng, Henan',
  },

  lisi: {
    nameZh: '李斯', nameEn: 'Li Si',
    dynastyZh: '戰國末至秦朝', dynastyEn: 'Late Warring States — Qin',
    section: 'documents', catLabelZh: '法家', catLabelEn: 'Legalism',
    quoteZh: '泰山不讓土壤，故能成其大；河海不擇細流，故能就其深；王者不卻衆庶，故能明其德。',
    quoteEn: 'Mount Tai does not reject a single clod of earth — that is how it achieves its greatness. The rivers and seas do not turn away the smallest streams — that is how they achieve their depth. A true king does not reject the common people — that is how he makes his virtue shine.',
    sourceZh: '《諫逐客書》', sourceEn: 'Memorial Against the Expulsion of Guest Officials',
    lat: 33.26, lng: 114.52, locationZh: '楚國上蔡（今河南上蔡）', locationEn: 'Shangcai, Henan',
  },

  /* ── 名家 (School of Names) ── */
  huishi: {
    nameZh: '惠施', nameEn: 'Hui Shi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '名家', catLabelEn: 'School of Names',
    quoteZh: '至大無外，謂之大一；至小無內，謂之小一。無厚，不可積也，其大千里。天與地卑，山與澤平。',
    quoteEn: 'That which has nothing beyond it is called the Great One; that which has nothing within it is called the Small One. That which has no thickness cannot be stacked up, yet it can extend for a thousand li. Heaven is as low as the earth; mountains are level with marshes.',
    sourceZh: '《莊子·天下》引惠施十事', sourceEn: 'Zhuangzi, The World — Ten Theses of Hui Shi',
    lat: 34.42, lng: 115.63, locationZh: '宋國（今河南商丘）', locationEn: 'Shangqiu, Henan',
  },

  gongsunlong: {
    nameZh: '公孫龍', nameEn: 'Gongsun Long',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '名家', catLabelEn: 'School of Names',
    quoteZh: '白馬非馬。馬者，所以命形也；白者，所以命色也。命色者非命形也，故曰白馬非馬。',
    quoteEn: 'A white horse is not a horse. "Horse" is what names the form; "white" is what names the colour. What names the colour is not what names the form — therefore a white horse is not a horse.',
    sourceZh: '《公孫龍子·白馬論》', sourceEn: 'Gongsun Longzi, White Horse Discourse',
    lat: 36.60, lng: 114.50, locationZh: '趙國（今河北邯鄲）', locationEn: 'Handan, Hebei',
  },

  /* ── 陰陽家 (Yin-Yang School) ── */
  zouyan: {
    nameZh: '鄒衍', nameEn: 'Zou Yan',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '陰陽家', catLabelEn: 'Yin-Yang School',
    quoteZh: '稱引天地剖判以來，五德轉移，治各有宜，而符應若茲。以為儒者所謂中國者，於天下乃八十一分居其一分耳。',
    quoteEn: 'From the separation of heaven and earth down to the present, the Five Virtues have rotated, each era governed by its fitting virtue, and the signs have corresponded accordingly. What the Confucians call the Middle Kingdom is but one eighty-first part of all under heaven.',
    sourceZh: '《史記·孟子荀卿列傳》', sourceEn: 'Records of the Grand Historian',
    lat: 36.81, lng: 118.05, locationZh: '齊國臨淄（今山東淄博）', locationEn: 'Zibo, Shandong',
  },

  /* ── 縱橫家 (School of Diplomacy) ── */
  guiguzi: {
    nameZh: '鬼谷子', nameEn: 'Guiguzi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '縱橫家', catLabelEn: 'School of Diplomacy',
    quoteZh: '口者，心之門戶也，心者，神之主也。志意、喜欲、思慮、智謀，此皆由門戶出入。',
    quoteEn: 'The mouth is the gateway of the heart; the heart is the master of the spirit. Will and intention, joy and desire, thought and deliberation, wisdom and strategy — all pass in and out through this gateway.',
    sourceZh: '《鬼谷子·捭闔》', sourceEn: 'Guiguzi, Opening and Closing',
    lat: 35.69, lng: 114.30, locationZh: '雲夢山（今河南鶴壁）', locationEn: 'Hebi, Henan',
  },

  suqin: {
    nameZh: '蘇秦', nameEn: 'Su Qin',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '縱橫家', catLabelEn: 'School of Diplomacy',
    quoteZh: '夫家貧則思良妻，國亂則思良相。今趙秦相攻，天下震動，合六國之衆以抗強秦，此縱之所以立也。',
    quoteEn: 'When the household is poor, one longs for a good wife; when the state is in disorder, one longs for a good minister. Now that Zhao and Qin attack each other and all under heaven trembles, uniting the six states to resist mighty Qin — this is the purpose for which the Vertical Alliance exists.',
    sourceZh: '《戰國策·趙策》', sourceEn: 'Strategies of the Warring States, Zhao Strategies',
    lat: 34.62, lng: 112.46, locationZh: '東周雒邑（今河南洛陽）', locationEn: 'Luoyang, Henan',
  },

  zhangyi: {
    nameZh: '張儀', nameEn: 'Zhang Yi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '縱橫家', catLabelEn: 'School of Diplomacy',
    quoteZh: '以天下之地，倍諸侯之衆，奉西面而事秦，秦必喜，天下亦安矣。此所謂以橫破縱者也。',
    quoteEn: 'With the land of all under heaven and the combined armies of the lords — if they face west and serve Qin, Qin will be pleased and the world will find peace. This is what is meant by using the Horizontal Alliance to break the Vertical Alliance.',
    sourceZh: '《戰國策·秦策》', sourceEn: 'Strategies of the Warring States, Qin Strategies',
    lat: 35.13, lng: 111.22, locationZh: '魏國安邑（今山西夏縣）', locationEn: 'Xiaxian, Shanxi',
  },

  /* ── 兵家 (Military School) ── */
  wuqi: {
    nameZh: '吳起', nameEn: 'Wu Qi',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '兵家', catLabelEn: 'Military School',
    quoteZh: '凡制國治軍，必教之以禮，勵之以義，使有恥也。夫人有恥，在大足以戰，在小足以守矣。',
    quoteEn: 'In governing a state and commanding an army, one must instruct the people in ritual propriety and inspire them with righteousness, so that they have a sense of shame. When people have a sense of shame, a large force is sufficient to fight and a small force is sufficient to hold firm.',
    sourceZh: '《吳子·圖國》', sourceEn: 'Wuzi, Planning for the State',
    lat: 35.71, lng: 115.01, locationZh: '衛國（今河南濮陽）', locationEn: 'Puyang, Henan',
  },

  sunbin: {
    nameZh: '孫臏', nameEn: 'Sun Bin',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '兵家', catLabelEn: 'Military School',
    quoteZh: '勝者，勝已敗之敵也；敗者，戰未負之兵也。善戰者，立於不敗之地，而不失敵之敗也。',
    quoteEn: 'The victor is one who defeats an already-beaten enemy; the defeated is one who fights an army not yet broken. The skilled commander stands on ground where defeat is impossible, and does not miss the moment of the enemy\'s downfall.',
    sourceZh: '《孫臏兵法·篇題》', sourceEn: 'Sun Bin\'s Art of War',
    lat: 35.55, lng: 115.48, locationZh: '齊國阿鄄（今山東鄄城）', locationEn: 'Juancheng, Shandong',
  },

  /* ── 農家 (Agriculturalism) ── */
  xuxing: {
    nameZh: '許行', nameEn: 'Xu Xing',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '農家', catLabelEn: 'Agriculturalism',
    quoteZh: '賢者與民並耕而食，饔飧而治。今也滕有倉廩府庫，則是厲民而自養也，惡得賢？',
    quoteEn: 'A worthy ruler tills the fields alongside the people and eats what he grows, cooks his own morning and evening meals while governing. But Teng has granaries and treasuries — this means he burdens the people to feed himself. How can that be worthy?',
    sourceZh: '《孟子·滕文公上》所引', sourceEn: 'Cited in Mencius, Duke Wen of Teng I',
    lat: 30.70, lng: 112.00, locationZh: '楚國（今湖北荊州附近）', locationEn: 'Near Jingzhou, Hubei',
  },

  /* ── 雜家 (Eclecticism) ── */
  lvbuwei: {
    nameZh: '呂不韋', nameEn: 'Lü Buwei',
    dynastyZh: '戰國末至秦朝', dynastyEn: 'Late Warring States — Qin',
    section: 'documents', catLabelZh: '雜家', catLabelEn: 'Eclecticism',
    quoteZh: '天下無粹白之狐，而有粹白之裘，取之衆白也。夫取於衆，此三王之所以大立功名也。',
    quoteEn: 'There is no fox of pure white in the world, yet there are garments of pure white fur — for they are made by combining many white pieces. Taking from the many — this is how the Three Kings achieved their great merit and fame.',
    sourceZh: '《呂氏春秋·用衆》', sourceEn: 'Master Lü\'s Spring and Autumn Annals, Employing the Multitude',
    lat: 35.71, lng: 114.99, locationZh: '衛國（今河南安陽）', locationEn: 'Anyang, Henan',
  },

  /* ── 醫家 (Medical School) ── */
  bianque: {
    nameZh: '扁鵲', nameEn: 'Bian Que',
    dynastyZh: '春秋末至戰國初', dynastyEn: 'Late Spring & Autumn',
    section: 'documents', catLabelZh: '醫家', catLabelEn: 'Medical School',
    quoteZh: '人之所病，病疾多；而醫之所病，病道少。疾雖久，猶可畢也；言不可治者，未得其術也。',
    quoteEn: 'What people lament is that there are too many diseases; what physicians lament is that there are too few methods. Even long-standing illness can ultimately be cured — to say it is incurable is simply to say one has not yet mastered the technique.',
    sourceZh: '《史記·扁鵲倉公列傳》', sourceEn: 'Records of the Grand Historian, Biography of Bian Que',
    lat: 38.71, lng: 116.10, locationZh: '渤海鄚州（今河北任丘）', locationEn: 'Renqiu, Hebei',
  },

  /* ── 文學 (Literary School) ── */
  quyuan: {
    nameZh: '屈原', nameEn: 'Qu Yuan',
    dynastyZh: '戰國時代', dynastyEn: 'Warring States',
    section: 'documents', catLabelZh: '楚辭·文學', catLabelEn: 'Chu Ci · Literature',
    quoteZh: '路漫漫其修遠兮，吾將上下而求索。長太息以掩涕兮，哀民生之多艱。',
    quoteEn: 'The road ahead is long and far, yet I shall search above and below. I heave a long sigh and wipe away my tears — I grieve that the people\'s lives are so full of hardship.',
    sourceZh: '《離騷》', sourceEn: 'Li Sao (Encountering Sorrow)',
    lat: 30.83, lng: 110.97, locationZh: '楚國丹陽（今湖北秭歸）', locationEn: 'Zigui, Hubei',
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
    nameZh:  '春秋時代 · 諸子百家之源',
    nameEn:  'Spring & Autumn · Origins of the Hundred Schools',
    figures: ['kongzi', 'laozi', 'sunzi', 'guanzi', 'zichan', 'yanying', 'bianque'],
  },
  {
    period:  '475 – 221 BCE',
    nameZh:  '戰國時代 · 百家爭鳴',
    nameEn:  'Warring States · Contention of the Hundred Schools',
    figures: [
      'mengzi', 'xunzi',                          /* 儒家 */
      'zhuangzi', 'liezi', 'yangzhu',              /* 道家 */
      'mozi',                                      /* 墨家 */
      'shenbuhui', 'shendao', 'shanyang', 'hanfeizi', 'lisi', /* 法家 */
      'huishi', 'gongsunlong',                     /* 名家 */
      'zouyan',                                    /* 陰陽家 */
      'guiguzi', 'suqin', 'zhangyi',               /* 縱橫家 */
      'wuqi', 'sunbin',                            /* 兵家 */
      'xuxing',                                    /* 農家 */
      'lvbuwei',                                   /* 雜家 */
      'quyuan',                                    /* 楚辭·文學 */
    ],
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
   ZHANG-HUANG STUDIES — 王天舒律詩修定稿小彙
   Poems for the 實用章黃學 section.
   Fields: id, titleZh, subtitleZh, linesZh, noteZh (optional)
   ══════════════════════════════════════════ */
const ZHANGHUANG_POEMS = [

  {
    id: 'zh-poem-01',
    titleZh:    '居美国生活有感',
    subtitleZh: '五律一首，天舒作于丙午',
    linesZh: [
      '精英扛国器，政务订条科。',
      '独讲修身乐，群聊励志歌。',
      '须随生烂漫，莫道命蹉跎。',
      '西往霞光顾，东来紫气和。',
    ],
  },

  {
    id: 'zh-poem-02',
    titleZh:    '天涯海角吟',
    subtitleZh: '天舒作于乙巳',
    linesZh: [
      '海南景象万千生，',
      '独自流连醉意倾。',
      '恍若春光红豆影。',
      '痴迷巨浪起涛声。',
      '椰林摇曳随风舞，',
      '小岛浮云幻化惊。',
      '满眼晨空金灿色，',
      '天涯不负我来行。',
    ],
  },

  {
    id: 'zh-poem-03',
    titleZh:    '前行美术馆观石潭个人画展有作',
    subtitleZh: '七律一首',
    linesZh: [
      '朋友圈中开画展，',
      '儿时梦想画中参。',
      '夸张写意丹青乐，',
      '坦荡胸怀水墨涵。',
      '艺术平生常戏谑，',
      '斯文内敛独攀探。',
      '传承国粹添新趣，',
      '美术前行看石潭。',
    ],
  },

  {
    id: 'zh-poem-04',
    titleZh:    '得福游仙绽笑颜',
    subtitleZh: '天舒乐游大云山七律一首',
    linesZh: [
      '为睹深闺人未识，',
      '驱车百里入云山。',
      '卧峰影侧呈慈爱，',
      '平镜湖宽照月闲。',
      '灵祝庙堂钟鼓起，',
      '真君殿外紫霞环。',
      '千年修悟行真道，',
      '得福游仙绽笑颜。',
    ],
  },

  {
    id: 'zh-poem-05',
    titleZh:    '今韵和希贤腊月有感',
    subtitleZh: '七律一首，天舒作于乙已',
    linesZh: [
      '煮酒蒸糕薰肉凝，',
      '春联词赋送温情。',
      '干塘放水鲜鱼跃，',
      '炮响烟花美凤兴。',
      '国泰民安拥快乐，',
      '物丰埠满享清平。',
      '霜风寒冻围炉暖，',
      '祈盼来年腊月行。',
    ],
  },

  {
    id: 'zh-poem-06',
    titleZh:    '旅美忆乙巳新化之行',
    subtitleZh: '天舒作七律一首',
    linesZh: [
      '跟随夫子读书郎，',
      '下榻维多利亚堂。',
      '盛世惊飞新化县，',
      '华章复现蚩尤乡。',
      '微风傍晚嘻杨柳，',
      '翠鸟清晨闹景冈。',
      '旅美忽然怜往昔，',
      '犹闻竹笛诉衷肠。',
    ],
    noteZh: '注：①读书郎，是杜纯梓教授的网名。②蚩尤乡，指中华三祖之一的蚩尤故里大熊山。',
  },

  {
    id: 'zh-poem-07',
    titleZh:    '得幸美如诗',
    subtitleZh: '天舒作五律一首',
    linesZh: [
      '丙午暇余半，常拥胜事时。',
      '闲来孙女乐，忙在圣贤思。',
      '菜圃青蔬满，身心快意滋。',
      '悠然医旧疾，幸得美如诗。',
    ],
  },

  {
    id: 'zh-poem-08',
    titleZh:    '财神眷顾有感',
    subtitleZh: '今韵五律一首',
    linesZh: [
      '马年来问候，岁月愈清明。',
      '五路财神眷，八方圣帝情。',
      '高低生意好，远近禄福丰。',
      '数字新时代，开局就向荣。',
    ],
  },

  {
    id: 'zh-poem-09',
    titleZh:    '今朝春节美',
    subtitleZh: '天舒五律一首于美国',
    linesZh: [
      '丙午离乡里，游园雅趣同。',
      '观书迷小店，赏景品轻功。',
      '武术花人眼，欢歌漫月宫。',
      '今朝春节美，亦是乐无穷。',
    ],
  },

  {
    id: 'zh-poem-10',
    titleZh:    '大熊山趣游',
    subtitleZh: '五律一首，天舒作于乙已',
    linesZh: [
      '野趣原稀少，佳峰秘藏深。',
      '飞云亲水镜，静草碧山林。',
      '独具蚩尤魄，兼容孔孟心。',
      '大熊多胜景，墨客复哦吟。',
    ],
    noteZh: '注：大熊，指新化县蚩尤故里大熊山。',
  },

];


/* ══════════════════════════════════════════
   DONORS
   Displayed as a scrolling banner on home page.
   HOW TO ADD: append an object to the array.
   ══════════════════════════════════════════ */
const DONORS = [
  { nameZh: '王大明', titleZh: '先生', amountZh: '壹仟伍佰元',   msgZh: '鼎力相助，感激不盡'   },
  { nameZh: '李秀英', titleZh: '女士', amountZh: '貳仟元',       msgZh: '仁義解囊，功德無量'   },
  { nameZh: '張志遠', titleZh: '先生', amountZh: '伍仟元',       msgZh: '高誼厚情，銘感五內'   },
  { nameZh: '陳美玲', titleZh: '女士', amountZh: '壹仟貳佰元',   msgZh: '慷慨仗義，令人感銘'   },
  { nameZh: '劉建國', titleZh: '先生', amountZh: '參仟伍佰元',   msgZh: '厚德載物，深表謝忱'   },
  { nameZh: '趙天佑', titleZh: '先生', amountZh: '壹仟元',       msgZh: '善舉可嘉，萬分感激'   },
  { nameZh: '林曉燕', titleZh: '女士', amountZh: '貳仟捌佰元',   msgZh: '芳心仁義，芳名永載'   },
  { nameZh: '黃文峰', titleZh: '先生', amountZh: '肆仟元',       msgZh: '熱心助學，深表謝意'   },
];


/* ══════════════════════════════════════════
   ZHANG-HUANG CHART
   生物（信息）功能（动力、动能）圈
   Theoretical framework by 王天舒
   ══════════════════════════════════════════ */
const ZHANGHUANG_CHART = {
  id: 'zh-chart-01',
  titleZh: '生物（信息）功能（动力、动能）圈',
  attributionZh: '王天舒自制',
  linesZh: [
    '植物圈：结构要素器官，植物性，形体构造，功能为生理机能，器官形态，无系统。',
    '动物圈：结构要素系统，动物性，系统构造。感受器系统——察觉之网；效应器系统——效用之网。两套系统互相协作，联结成动物功能圈。',
    '人类：生命性，生命体系。感受系统——认知、察觉、感知网络；效应系统——反应、行动、效用网络。',
    '社会性，社会体系以符号系统为基石。人与人类社会发展路径：人使用符号，创造符号，使人类超越其它生物。',
    '象征符号——比喻、象征、表征、艺术、创意、创新。中介符号——载体桥梁、传递传承、转换平台。工具符号——预知应对、改造创造、制造创新。语言是使用最多、意义最大的工具符号。',
    '社会形态：蒙昧社会，表象性，自然人，心理状态自在。',
    '文化社会：物质性，社会人，自明；物化性，异化人，自失；理性化，文化人，自觉。',
    '文明社会，智能通融，文明人，自由。宇宙蒙昧，智慧性，宇宙人，自由自在。',
    '人类系统主要由感受系统、效应系统、符号系统组成。构成社会体系与社会形态的核心要素是符号系统。符号的意义随时代变化、地区空间变化而变化。',
  ],
  referenceZh: '参考《心灵大嬗变》傅治平著，一九九七年五月第一版',
};


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
