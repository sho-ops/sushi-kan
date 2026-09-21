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
    id: 'akami',
    name: '赤身',
    kana: 'あかみ',
    romaji: 'Akami',
    category: 'マグロ',
    rarity: 'common',
    image: '/neta/akami.png',
    confidence: 98,
    season: '通年',
    sommelier:
      '本鮪の背側、赤身でございます。鉄分をふくむ凛とした旨みと、赤酢のシャリが織りなす調和をお楽しみください。醤油はネタの端に、ほんの一滴で十分でございます。',
    taste: { umami: 82, fat: 30, texture: 60 },
  },
  {
    id: 'otoro',
    name: '大トロ',
    kana: 'おおとろ',
    romaji: 'Otoro',
    category: 'マグロ',
    rarity: 'legend',
    image: '/neta/otoro.png',
    confidence: 96,
    season: '冬',
    sommelier:
      '本鮪の腹、最上部の大トロにございます。舌にのせた瞬間にとろける脂の甘み、これぞ冬の贅の極み。噛まずとも消えゆく口溶けを、ゆるりとご堪能ください。',
    taste: { umami: 88, fat: 98, texture: 40 },
  },
  {
    id: 'salmon',
    name: 'サーモン',
    kana: 'さーもん',
    romaji: 'Salmon',
    category: '海の幸',
    rarity: 'common',
    image: '/neta/salmon.png',
    confidence: 99,
    season: '通年',
    sommelier:
      'とろりとした脂と、鮮やかな橙色が美しいサーモンでございます。まろやかな旨みは老若男女に愛される一貫。すだちを軽く搾れば、後味がいっそう爽やかに。',
    taste: { umami: 70, fat: 80, texture: 55 },
  },
  {
    id: 'hamachi',
    name: 'ハマチ',
    kana: 'はまち',
    romaji: 'Hamachi',
    category: '光り・青魚',
    rarity: 'rare',
    image: '/neta/hamachi.png',
    confidence: 94,
    season: '冬',
    sommelier:
      '出世魚・鰤の若魚、ハマチでございます。程よい脂と歯ごたえ、後を引く旨み。寒の時季には脂がのり、口の中で豊かに広がってまいります。',
    taste: { umami: 74, fat: 68, texture: 70 },
  },
  {
    id: 'uni',
    name: 'ウニ',
    kana: 'うに',
    romaji: 'Uni',
    category: '軍艦',
    rarity: 'legend',
    image: '/neta/uni.png',
    confidence: 92,
    season: '夏',
    sommelier:
      '磯の香り立つ雲丹の軍艦でございます。海苔のぱりりとした食感の後、濃厚な甘みが波のように押し寄せます。まさに海の宝石、ひと息に召し上がるのが粋。',
    taste: { umami: 90, fat: 72, texture: 25 },
  },
  {
    id: 'ikura',
    name: 'イクラ',
    kana: 'いくら',
    romaji: 'Ikura',
    category: '軍艦',
    rarity: 'rare',
    image: '/neta/ikura.png',
    confidence: 95,
    season: '秋',
    sommelier:
      '秋の恵み、鮭の卵イクラの軍艦でございます。ひと粒ひと粒が弾け、口いっぱいに旨みの潮が満ちてまいります。宝石のごとき輝きも、どうぞご賞味を。',
    taste: { umami: 80, fat: 60, texture: 90 },
  },
  {
    id: 'anago',
    name: '穴子',
    kana: 'あなご',
    romaji: 'Anago',
    category: '煮物',
    rarity: 'rare',
    image: '/neta/anago.png',
    confidence: 93,
    season: '夏',
    sommelier:
      'ふっくらと煮上げた穴子でございます。甘辛い煮ツメを刷き、ほろりと解ける身の柔らかさが身上。塩でさっぱりと召し上がるのもまた一興にございます。',
    taste: { umami: 76, fat: 55, texture: 35 },
  },
]

export function getNeta(id: string) {
  return NETA.find((n) => n.id === id)
}
