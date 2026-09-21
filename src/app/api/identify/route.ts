import { NextResponse } from "next/server";

import { identifyNetaName } from "@/lib/gemini-identify";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "画像ファイルを選択してください。" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "JPEG、PNG、WebP、GIF形式の画像のみ対応しています。" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "画像サイズは10MB以下にしてください。" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const name = await identifyNetaName(base64, file.type);

    return NextResponse.json({ name });
  } catch (error) {
    console.error("Identify API error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "寿司の判別中にエラーが発生しました。";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
