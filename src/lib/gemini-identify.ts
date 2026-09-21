import { GoogleGenerativeAI } from "@google/generative-ai";

const IDENTIFY_PROMPT =
  "この画像に写っている寿司ネタの名称を、余計な解説は一切抜きで、1語（例：ヒラメ、本マグロ（中トロ））だけで出力してください";

const DEFAULT_MODEL = "gemini-3.6-flash";
const FALLBACK_MODELS = [DEFAULT_MODEL] as const;

function parseModelList(): string[] {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  if (fromEnv) {
    return [fromEnv];
  }
  return [...FALLBACK_MODELS];
}

function toUserFriendlyError(error: unknown, triedModels: string[]): Error {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("limit: 0") || message.includes("free_tier")) {
    return new Error(
      `Gemini APIの無料枠がこのモデルに割り当てられていません。Google AI Studio（https://aistudio.google.com/apikey）で新しいAPIキーを作成するか、請求（Billing）を有効にしてください。モデルは ${DEFAULT_MODEL} を使用しています。`,
    );
  }

  if (message.includes("429")) {
    return new Error(
      "Gemini APIの利用上限に達しました。1分ほど待ってから再試行してください。",
    );
  }

  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    return new Error(
      "GEMINI_API_KEY が無効です。Google AI Studio で正しいキーを設定してください。",
    );
  }

  return new Error(message);
}

async function identifyWithModel(
  apiKey: string,
  modelName: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const result = await model.generateContent([
    { text: IDENTIFY_PROMPT },
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ]);

  const text = result.response.text().trim();

  if (!text) {
    throw new Error("寿司ネタを判別できませんでした。");
  }

  return text
    .replace(/^["'「『]|["'」』]$/g, "")
    .replace(/\.$/, "")
    .trim();
}

export async function identifyNetaName(
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY が設定されていません。.env.local を確認してください。",
    );
  }

  const models = parseModelList();
  let lastError: unknown;

  for (const modelName of models) {
    try {
      return await identifyWithModel(apiKey, modelName, imageBase64, mimeType);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);

      const shouldTryNext =
        models.length > 1 &&
        (message.includes("404") ||
          message.includes("not found") ||
          message.includes("limit: 0") ||
          message.includes("free_tier"));

      if (!shouldTryNext) {
        break;
      }
    }
  }

  throw toUserFriendlyError(lastError, models);
}
