import { NETA, getNeta, type Neta } from "@/lib/sushi-data";

const ALIASES: Record<string, string> = {
  ヒラメ: "hirame",
  平目: "hirame",
  カレイ: "karei",
  鮃: "karei",
  ブリ: "buri",
  鰤: "buri",
  寒ブリ: "buri",
  カンパチ: "kanpachi",
  スズキ: "suzuki",
  鱸: "suzuki",
  カワハギ: "kawahagi",
  皮剥: "kawahagi",
  赤身: "akami",
  マグロ: "akami",
  本マグロ: "akami",
  中トロ: "chutoro",
  大トロ: "otoro",
  トロ: "otoro",
  コハダ: "kohada",
  小肌: "kohada",
  アジ: "aji",
  鯵: "aji",
  サバ: "saba",
  鯖: "saba",
  〆サバ: "saba",
  イワシ: "iwashi",
  鰯: "iwashi",
  サンマ: "sanma",
  秋刀魚: "sanma",
  サヨリ: "sayori",
  ホタテ: "hotate",
  帆立: "hotate",
  赤貝: "akagai",
  トリガイ: "torigai",
  鳥貝: "torigai",
  ミル貝: "mirugai",
  海松貝: "mirugai",
  アワビ: "awabi",
  鮑: "awabi",
  車エビ: "kurumaebi",
  ボタンエビ: "botanebi",
  牡丹海老: "botanebi",
  穴子: "anago",
  あなご: "anago",
  ウニ: "uni",
  雲丹: "uni",
  イクラ: "ikura",
  タコ: "tako",
  蛸: "tako",
  サワラ: "sawara",
  鰆: "sawara",
  キンメダイ: "kinmedai",
  金目鯛: "kinmedai",
  ノドグロ: "nodoguro",
  喉黒: "nodoguro",
  カツオ: "katsuo-tataki",
  鰹: "katsuo-tataki",
  タタキ: "katsuo-tataki",
  サーモン: "salmon",
  鮭: "salmon",
};

function createDynamicNeta(name: string, capturedImageUrl?: string): Neta {
  const id = `detected-${name.replace(/\s+/g, "-")}`;

  return {
    id,
    name,
    kana: "",
    romaji: name,
    category: "判別結果",
    rarity: "common",
    image: capturedImageUrl ?? "/placeholder.svg",
    confidence: 88,
    season: "—",
    sommelier: `${name}と判別いたしました。`,
    taste: { umami: 70, fat: 50, texture: 50 },
  };
}

export function resolveNetaFromName(
  rawName: string,
  capturedImageUrl?: string,
): Neta {
  const name = rawName
    .trim()
    .replace(/^["'「『]|["'」』]$/g, "")
    .replace(/\.$/, "")
    .trim();

  let matched =
    NETA.find(
      (neta) =>
        name.includes(neta.name) ||
        neta.name.includes(name) ||
        name.toLowerCase().includes(neta.romaji.toLowerCase()),
    ) ?? null;

  if (!matched) {
    for (const [alias, id] of Object.entries(ALIASES)) {
      if (name.includes(alias)) {
        matched = getNeta(id) ?? null;
        break;
      }
    }
  }

  const base = matched ?? createDynamicNeta(name, capturedImageUrl);

  return {
    ...base,
    name: matched ? base.name : name,
    image: capturedImageUrl ?? base.image,
    confidence: matched ? matched.confidence : 88,
    sommelier: matched
      ? matched.sommelier
      : `${name}と判別いたしました。`,
  };
}
