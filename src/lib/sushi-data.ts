export type Rarity = 'common' | 'rare' | 'legend'

export type Neta = {
  id: string
  name: string
  kana: string
  romaji: string
  category: string
  rarity: Rarity
  image: string
  /** 判別スコア（デモ用の基準値） */
  confidence: number
  season: string
  /** 寿司ソムリエの解説 */
  sommelier: string
  /** 味わいの指標 0-100 */
  taste: {
    umami: number
    fat: number
    texture: number
  }
}

export const rarityLabel: Record<Rarity, string> = {
  common: '並',
  rare: '上',
  legend: '特上',
}

export const NETA: Neta[] = [
  {
    id: 'hirame',
    name: 'ヒラメ',
    kana: 'ひらめ',
    romaji: 'Hirame',
    category: '白身',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 94,
    season: '冬',
    sommelier:
      '「寒平目」という言葉がある通り、冬場は脂が乗り格別。昆布締めにして旨味を凝縮させると、シャリとの一体感が段違いに増します。',
    taste: { umami: 78, fat: 45, texture: 65 },
  },
  {
    id: 'karei',
    name: 'カレイ',
    kana: 'かれい',
    romaji: 'Karei',
    category: '白身',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 93,
    season: '春',
    sommelier:
      '春の産卵期前のカレイは身が引き締まり、淡白ながら上品な甘みが特徴。縁側の部位はコリコリとした食感と濃厚な脂が楽しめます。',
    taste: { umami: 72, fat: 35, texture: 70 },
  },
  {
    id: 'buri',
    name: 'ブリ',
    kana: 'ぶり',
    romaji: 'Buri',
    category: '白身',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 95,
    season: '冬',
    sommelier:
      '冬の「寒ブリ」は王様。脂の乗りが凄まじく、口の中でとろける感覚は至福。炙ることで香ばしさを足すと、また違った表情を見せます。',
    taste: { umami: 80, fat: 85, texture: 55 },
  },
  {
    id: 'kanpachi',
    name: 'カンパチ',
    kana: 'かんぱち',
    romaji: 'Kanpachi',
    category: '白身',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 92,
    season: '夏',
    sommelier:
      '夏が旬の白身。ブリよりも身がしっかりしており、爽やかな脂の甘みが特徴。若々しくハリのある食感を楽しめる一貫です。',
    taste: { umami: 74, fat: 60, texture: 72 },
  },
  {
    id: 'suzuki',
    name: 'スズキ',
    kana: 'すずき',
    romaji: 'Suzuki',
    category: '白身',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 91,
    season: '夏',
    sommelier:
      '夏の風物詩。洗いにすることもあるほど身が締まっており、清涼感のある味わい。ポン酢や塩でさっぱりと頂くのが通の楽しみ方。',
    taste: { umami: 70, fat: 40, texture: 68 },
  },
  {
    id: 'kawahagi',
    name: 'カワハギ',
    kana: 'かわはぎ',
    romaji: 'Kawahagi',
    category: '白身',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 90,
    season: '通年',
    sommelier:
      '「海のフォアグラ」とも呼ばれる濃厚な肝と、淡白な身を合わせて頂くのが醍醐味。肝のクリーミーさがシャリと混ざり合う瞬間は絶品。',
    taste: { umami: 76, fat: 55, texture: 60 },
  },
  {
    id: 'akami',
    name: '本マグロ（赤身）',
    kana: 'ほんまぐろ（あかみ）',
    romaji: 'Hon Maguro Akami',
    category: '赤身',
    rarity: 'common',
    image: '/neta/akami.png',
    confidence: 98,
    season: '通年',
    sommelier:
      'マグロ本来の鉄分を含んだ深い旨味を堪能できる一貫。漬けにすることで身が引き締まり、より濃厚な味わいに変化します。',
    taste: { umami: 82, fat: 30, texture: 60 },
  },
  {
    id: 'chutoro',
    name: '本マグロ（中トロ）',
    kana: 'ほんまぐろ（ちゅうとろ）',
    romaji: 'Hon Maguro Chutoro',
    category: '赤身',
    rarity: 'legend',
    image: '/neta/otoro.png',
    confidence: 97,
    season: '冬',
    sommelier:
      '赤身の旨味と脂の甘みの黄金比率。口の中に入れた瞬間、体温で脂が溶け出す絶妙な口どけが楽しめます。',
    taste: { umami: 86, fat: 75, texture: 48 },
  },
  {
    id: 'otoro',
    name: '本マグロ（大トロ）',
    kana: 'ほんまぐろ（おおとろ）',
    romaji: 'Hon Maguro Otoro',
    category: '赤身',
    rarity: 'legend',
    image: '/neta/otoro.png',
    confidence: 96,
    season: '冬',
    sommelier:
      '口の中に広がる圧倒的な脂の甘み。濃厚ですが後味は意外にスッキリとしており、マグロの醍醐味を最大限に感じられます。',
    taste: { umami: 88, fat: 98, texture: 40 },
  },
  {
    id: 'kohada',
    name: 'コハダ',
    kana: 'こはだ',
    romaji: 'Kohada',
    category: '光り物',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 93,
    season: '通年',
    sommelier:
      '江戸前寿司の真骨頂。酢と塩の加減で職人の技量が試される一品。独特の光沢と酸味が、脂の乗った身を引き締めています。',
    taste: { umami: 75, fat: 50, texture: 55 },
  },
  {
    id: 'aji',
    name: 'アジ',
    kana: 'あじ',
    romaji: 'Aji',
    category: '光り物',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 94,
    season: '夏',
    sommelier:
      '大衆魚ながら、鮮度が良いものの旨味は高級魚に引けを取りません。ネギ生姜を添えると、青魚特有の香りが引き立ちます。',
    taste: { umami: 78, fat: 45, texture: 62 },
  },
  {
    id: 'saba',
    name: 'サバ（〆サバ）',
    kana: 'さば（しめさば）',
    romaji: 'Saba',
    category: '光り物',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 92,
    season: '通年',
    sommelier:
      '脂の乗ったサバを酢で締めることで、旨味を最大限に引き出しています。脂のくどさを酢がさっぱりと消してくれる名コンビ。',
    taste: { umami: 76, fat: 65, texture: 58 },
  },
  {
    id: 'iwashi',
    name: 'イワシ',
    kana: 'いわし',
    romaji: 'Iwashi',
    category: '光り物',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 91,
    season: '梅雨',
    sommelier:
      '「入梅イワシ」と呼ばれる時期は脂が乗りすぎてトロけるほど。鮮度が命であり、提供された瞬間に食べるのが一番の贅沢です。',
    taste: { umami: 80, fat: 70, texture: 45 },
  },
  {
    id: 'sanma',
    name: 'サンマ',
    kana: 'さんま',
    romaji: 'Sanma',
    category: '光り物',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 93,
    season: '秋',
    sommelier:
      '秋の味覚。炙りにして脂を溶かすと香ばしさが倍増します。シャリの酸味とサンマの濃厚な脂が混ざる瞬間は、秋の訪れを感じさせます。',
    taste: { umami: 77, fat: 72, texture: 50 },
  },
  {
    id: 'sayori',
    name: 'サヨリ',
    kana: 'さより',
    romaji: 'Sayori',
    category: '光り物',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 90,
    season: '通年',
    sommelier:
      '見た目の美しさと上品な味わいから「海の貴婦人」と呼ばれることも。淡白な身の中に潜む、ほのかな甘みを楽しんで。',
    taste: { umami: 72, fat: 38, texture: 64 },
  },
  {
    id: 'hotate',
    name: 'ホタテ',
    kana: 'ほたて',
    romaji: 'Hotate',
    category: '貝類',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 95,
    season: '冬',
    sommelier:
      '肉厚で甘みが強い。軽く炙ることで香ばしさが加わり、甘みがより際立ちます。噛むほどに旨味が溢れ出す一貫。',
    taste: { umami: 82, fat: 35, texture: 75 },
  },
  {
    id: 'akagai',
    name: '赤貝',
    kana: 'あかがい',
    romaji: 'Akagai',
    category: '貝類',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 92,
    season: '春',
    sommelier:
      '磯の香りとコリコリとした食感が心地よい。身だけでなく、ヒモの部分も一緒に楽しむのが通な楽しみ方です。',
    taste: { umami: 80, fat: 25, texture: 85 },
  },
  {
    id: 'torigai',
    name: 'トリガイ',
    kana: 'とりがい',
    romaji: 'Torigai',
    category: '貝類',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 91,
    season: '春〜夏',
    sommelier:
      '独特の甘みと食感があり、春から初夏にかけての楽しみ。新鮮なものは色が美しく、食欲をそそります。',
    taste: { umami: 78, fat: 20, texture: 80 },
  },
  {
    id: 'mirugai',
    name: 'ミル貝',
    kana: 'みるがい',
    romaji: 'Mirugai',
    category: '貝類',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 90,
    season: '通年',
    sommelier:
      '貝類の中でも特に旨味が強く、食感も豊か。噛みしめるごとに広がる磯の風味がたまりません。',
    taste: { umami: 84, fat: 22, texture: 78 },
  },
  {
    id: 'awabi',
    name: 'アワビ',
    kana: 'あわび',
    romaji: 'Awabi',
    category: '貝類',
    rarity: 'legend',
    image: '/placeholder.svg',
    confidence: 94,
    season: '通年',
    sommelier:
      '高級貝の代名詞。煮アワビにすると柔らかく、旨味がぎゅっと凝縮されます。磯の香りが鼻に抜ける贅沢な一貫。',
    taste: { umami: 86, fat: 30, texture: 70 },
  },
  {
    id: 'kurumaebi',
    name: '車エビ',
    kana: 'くるまえび',
    romaji: 'Kurumaebi',
    category: 'エビ・カニ',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 96,
    season: '通年',
    sommelier:
      '茹でたての温かい状態で提供されるのが粋。甘みと弾力が凄まじく、おぼろを噛ませることで旨味の相乗効果が生まれます。',
    taste: { umami: 80, fat: 25, texture: 82 },
  },
  {
    id: 'botanebi',
    name: 'ボタンエビ',
    kana: 'ぼたんえび',
    romaji: 'Botanebi',
    category: 'エビ・カニ',
    rarity: 'legend',
    image: '/placeholder.svg',
    confidence: 93,
    season: '通年',
    sommelier:
      'とろけるような甘みが最大の特徴。生でしか味わえない、濃厚でネットリとした食感は他のエビにはない魅力です。',
    taste: { umami: 85, fat: 55, texture: 35 },
  },
  {
    id: 'anago',
    name: '穴子',
    kana: 'あなご',
    romaji: 'Anago',
    category: 'その他',
    rarity: 'rare',
    image: '/neta/anago.png',
    confidence: 93,
    season: '夏',
    sommelier:
      '煮穴子は職人の仕事が光る一品。ふっくらと煮込まれた身は、シャリの上でほどけるように溶けます。ツメの甘みとベストマッチ。',
    taste: { umami: 76, fat: 55, texture: 35 },
  },
  {
    id: 'uni',
    name: 'ウニ',
    kana: 'うに',
    romaji: 'Uni',
    category: 'その他',
    rarity: 'legend',
    image: '/neta/uni.png',
    confidence: 92,
    season: '夏',
    sommelier:
      '磯の香りとクリーミーな舌触り。産地によって味わいが異なり、ミョウバンを使っていないものは驚くほどスッキリと甘い。',
    taste: { umami: 90, fat: 72, texture: 25 },
  },
  {
    id: 'ikura',
    name: 'イクラ',
    kana: 'いくら',
    romaji: 'Ikura',
    category: 'その他',
    rarity: 'rare',
    image: '/neta/ikura.png',
    confidence: 95,
    season: '秋',
    sommelier:
      'プチッとはじける食感と、濃厚な旨味の汁がシャリを包み込みます。醤油漬けの絶妙な塩梅が、日本酒にもよく合います。',
    taste: { umami: 80, fat: 60, texture: 90 },
  },
  {
    id: 'tako',
    name: 'タコ',
    kana: 'たこ',
    romaji: 'Tako',
    category: 'その他',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 91,
    season: '通年',
    sommelier:
      '茹で加減が職人の腕の見せ所。程よい弾力があり、噛むほどにタコ本来の旨味がじわじわと出てきます。塩とスダチで食べるのも粋。',
    taste: { umami: 74, fat: 15, texture: 88 },
  },
  {
    id: 'sawara',
    name: 'サワラ',
    kana: 'さわら',
    romaji: 'Sawara',
    category: '変わり種',
    rarity: 'rare',
    image: '/placeholder.svg',
    confidence: 92,
    season: '春',
    sommelier:
      '春を告げる魚。身が非常に柔らかく、炙ることで皮目の香ばしさと身の旨味が引き立ちます。塩で食べるのがおすすめ。',
    taste: { umami: 76, fat: 50, texture: 52 },
  },
  {
    id: 'kinmedai',
    name: 'キンメダイ',
    kana: 'きんめだい',
    romaji: 'Kinmedai',
    category: '変わり種',
    rarity: 'legend',
    image: '/placeholder.svg',
    confidence: 91,
    season: '通年',
    sommelier:
      '美しい赤色と、皮下の脂の甘みが特徴。炙ることで皮が香ばしくなり、脂の甘みがより一層際立ちます。',
    taste: { umami: 82, fat: 78, texture: 48 },
  },
  {
    id: 'nodoguro',
    name: 'ノドグロ',
    kana: 'のどぐろ',
    romaji: 'Nodoguro',
    category: '変わり種',
    rarity: 'legend',
    image: '/placeholder.svg',
    confidence: 90,
    season: '通年',
    sommelier:
      '「白身のトロ」と言われるほど脂が乗っています。口に入れた瞬間に広がる上品な脂の甘みは、まさに至福の一言。',
    taste: { umami: 84, fat: 88, texture: 42 },
  },
  {
    id: 'katsuo-tataki',
    name: 'カツオのタタキ',
    kana: 'かつおのたたき',
    romaji: 'Katsuo Tataki',
    category: '変わり種',
    rarity: 'common',
    image: '/placeholder.svg',
    confidence: 93,
    season: '初夏',
    sommelier:
      '皮目を香ばしく焼き上げることで、カツオの鉄分を含んだ旨味が引き立ちます。薬味のニンニクや生姜との相性が抜群。',
    taste: { umami: 80, fat: 40, texture: 58 },
  },
]

export function getNeta(id: string) {
  return NETA.find((n) => n.id === id)
}
