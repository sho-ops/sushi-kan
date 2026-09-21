# 鮨鑑（SUSHIKAN）— 保守・運用ガイド

寿司の写真からネタ名を AI で判別する Web アプリです。  
この README は **非エンジニアの方** が、エラー対応や機能追加を安全に行うための説明書です。

---

## 目次

1. [このアプリでできること](#このアプリでできること)
2. [全体の仕組み（5分で理解）](#全体の仕組み5分で理解)
3. [フォルダ構成（どこに何があるか）](#フォルダ構成どこに何があるか)
4. [初回セットアップ](#初回セットアップ)
5. [日常の操作（開発サーバーの起動・停止）](#日常の操作開発サーバーの起動停止)
6. [よくあるエラーと対処法](#よくあるエラーと対処法)
7. [安全に変更できる場所・触らない方がよい場所](#安全に変更できる場所触らない方がよい場所)
8. [機能追加のガイド](#機能追加のガイド)
9. [用語集](#用語集)

---

## このアプリでできること

| 画面（タブ） | 内容 |
|-------------|------|
| **撮影** | カメラで撮影、または端末内の画像を選んで判別 |
| **判定** | AI が判別したネタ名・確度・味わいの目安を表示 |
| **解説** | 寿司ソムリエ風のポップアップ解説 |
| **図鑑** | 判別したネタを集めるスタンプラリー（7種） |

---

## 全体の仕組み（5分で理解）

ユーザーが写真を撮ると、次の流れで判別されます。

```mermaid
flowchart LR
    A[ユーザーが撮影] --> B[camera-view.tsx]
    B --> C[/api/identify]
    C --> D[gemini-identify.ts]
    D --> E[Gemini API]
    E --> F[ネタ名 例: サーモン]
    F --> G[resolve-neta.ts]
    G --> H[result-view.tsx で表示]
```

### 役割の分担

| 部分 | 役割 | 例えるなら |
|------|------|-----------|
| **画面（components）** | 見た目・ボタン・カメラ | お店のフロント |
| **API（app/api）** | 画像を受け取り AI に渡す | 受付カウンター |
| **Gemini 連携（lib/gemini-identify.ts）** | Google AI に「ネタ名だけ教えて」と依頼 | 専門家への電話 |
| **ネタデータ（lib/sushi-data.ts）** | 図鑑の7種の名前・解説・画像 | 商品カタログ |
| **名前の変換（lib/resolve-neta.ts）** | AI の返答を図鑑データに当てはめる | カタログとの照合 |

### 重要な設定ファイル

| ファイル | 内容 | 注意 |
|---------|------|------|
| `.env.local` | Gemini API キー（秘密） | **Git にアップロードしない** |
| `.env.example` | 設定の見本（キーは空） | 共有して OK |

---

## フォルダ構成（どこに何があるか）

```
sushi_kan/
├── .env.local          ★ APIキー（自分だけの秘密ファイル）
├── .env.example        設定の見本
├── package.json        使っているライブラリ一覧
├── public/
│   └── neta/           図鑑用のネタ画像（7枚）
├── src/
│   ├── app/            アプリの入口・API
│   │   ├── page.tsx           トップページ
│   │   ├── layout.tsx         全体レイアウト・フォント
│   │   ├── globals.css        色・デザインの基本設定
│   │   └── api/identify/
│   │       └── route.ts       ★ 判別API（画像を受け取る）
│   ├── components/     画面パーツ（v0 由来の UI）
│   │   ├── sushi-app.tsx      ★ メイン（タブ切替の司令塔）
│   │   ├── camera-view.tsx    ★ カメラ・撮影・ファイル選択
│   │   ├── result-view.tsx    判定結果の表示
│   │   ├── zukan-view.tsx     図鑑
│   │   ├── sommelier-popup.tsx ソムリエ解説
│   │   ├── app-header.tsx     ヘッダー
│   │   └── bottom-tabs.tsx    下のタブメニュー
│   └── lib/            ロジック（裏方）
│       ├── gemini-identify.ts ★ Gemini API との通信
│       ├── resolve-neta.ts    ★ AI の返答 → 図鑑データ変換
│       └── sushi-data.ts      ★ 7種のネタ情報（名前・解説など）
├── v0-export/          v0 から取り込んだ元データ（参考用）
└── sushi-identifier.zip v0 の ZIP（参考用・触らなくて OK）
```

★印は、判別機能に関わる **重要ファイル** です。

---

## 初回セットアップ

### 必要なもの

- **Node.js** 20 以上（[https://nodejs.org](https://nodejs.org)）
- **Google Gemini API キー**（[Google AI Studio](https://aistudio.google.com/apikey) で無料取得）

### 手順

1. プロジェクトフォルダを開く（PowerShell またはターミナル）

2. ライブラリをインストール（初回のみ）

   ```powershell
   npm install
   ```

3. 環境変数ファイルを作成

   ```powershell
   copy .env.example .env.local
   ```

4. `.env.local` をメモ帳などで開き、API キーを設定

   ```env
   GEMINI_API_KEY=ここにAPIキーを貼り付け
   ```

   **注意:** 変数名は `GEMINI_API_KEY` です。`NEXT_PUBLIC_` を付けないでください（キーが外部に漏れます）。

5. 開発サーバーを起動（後述）

---

## 日常の操作（開発サーバーの起動・停止）

### 起動

```powershell
cd "C:\Users\think\OneDrive\デスクトップ\sushi_kan"
npm run dev
```

**成功のサイン:**

```
✓ Ready in ...
- Local: http://localhost:3000
```

ブラウザで **http://localhost:3000** を開きます。

### 停止

PowerShell で **Ctrl + C** を押します。

### コードや `.env.local` を変更したあと

必ず **サーバーを一度止めて、再度 `npm run dev`** してください。  
再起動しないと、設定変更が反映されないことがあります。

---

## よくあるエラーと対処法

### 1. `Port 3000 is in use` / `Another next dev server is already running`

**意味:** すでに古いサーバーが動いている。

**対処:**

```powershell
# メッセージに表示された PID 番号を使う（例: 15432）
taskkill /PID 15432 /F
npm run dev
```

`✓ Ready` と `http://localhost:3000` だけが表示され、`⨯ Another next dev server...` が **出なければ成功** です。

---

### 2. `429 Too Many Requests` / `limit: 0`

**意味:** Gemini API の利用枠の問題（アプリのバグではないことが多い）。

| 表示 | 意味 | 対処 |
|------|------|------|
| `limit: 0` | そのモデルに無料枠がない | [AI Studio](https://aistudio.google.com/apikey) で新しい API キーを作成、または Billing を有効化 |
| 429（待てと書いてある） | 一時的な上限 | 1分ほど待って再試行 |

利用状況: [https://ai.dev/rate-limit](https://ai.dev/rate-limit)

現在のデフォルトモデル: **`gemini-3.6-flash`**（`src/lib/gemini-identify.ts`）

---

### 3. `404 Not Found` / `model is not found`

**意味:** 指定した AI モデル名が古い・使えない。

**対処:** `.env.local` に以下を追加して再起動

```env
GEMINI_MODEL=gemini-3.6-flash
```

---

### 4. `GEMINI_API_KEY が設定されていません`

**意味:** API キーが読み込まれていない。

**確認リスト:**

- [ ] `.env.local` ファイルがプロジェクト直下にある
- [ ] 変数名が `GEMINI_API_KEY` になっている（スペルミスなし）
- [ ] 値が空でない
- [ ] サーバーを再起動した

---

### 5. カメラが起動しない

**意味:** ブラウザがカメラを許可していない、または HTTP 環境。

**対処:**

- ブラウザのカメラ許可を「許可」にする
- `localhost` または HTTPS でアクセスする
- カメラが使えない場合は **「画像ファイルを選ぶ」** を使う

---

### 6. PowerShell が赤くなる

**だいたいはエラー** です。ただし `npm run dev` では:

- **`✓ Ready`** → 成功
- **`⨯` や `Error`** → 失敗（上記の対処を参照）

---

## 安全に変更できる場所・触らない方がよい場所

### ✅ 比較的安全に変更できる

| 変更したい内容 | 編集するファイル |
|---------------|-----------------|
| ネタの名前・解説・味の数値 | `src/lib/sushi-data.ts` |
| 図鑑の画像 | `public/neta/` 内の PNG を差し替え |
| AI への指示文（プロンプト） | `src/lib/gemini-identify.ts` の `IDENTIFY_PROMPT` |
| 画面の文言 | 各 `src/components/*.tsx` |
| 色・フォント | `src/app/globals.css` |
| AI モデル名 | `.env.local` の `GEMINI_MODEL` |

### ⚠️ 変更時は注意（動作確認必須）

| ファイル | 理由 |
|---------|------|
| `src/components/camera-view.tsx` | カメラ・API 送信の核心部分 |
| `src/app/api/identify/route.ts` | サーバー側の API |
| `src/lib/resolve-neta.ts` | 判別名と図鑑の対応付け |
| `package.json` | ライブラリ追加・削除は `npm install` が必要 |

### 🚫 基本的に触らない

| ファイル・フォルダ | 理由 |
|-------------------|------|
| `.env.local` | 秘密鍵。内容を人に送らない・Git に上げない |
| `node_modules/` | 自動生成。手で編集しない |
| `.next/` | ビルド結果。削除しても `npm run dev` で再生成される |
| `v0-export/` / `sushi-identifier.zip` | 取り込み済みの参考資料 |

---

## 機能追加のガイド

変更前に **必ず Git でコミット** するか、フォルダごとバックアップしてください。

### 例1: 図鑑にネタを1つ追加したい

1. `public/neta/` に画像を追加（例: `hirame.png`）
2. `src/lib/sushi-data.ts` の `NETA` 配列に1件追加
3. `src/lib/resolve-neta.ts` の `ALIASES` に別名を追加（任意）
4. `npm run dev` で再起動 → 図鑑タブを確認

### 例2: AI の判別指示を変えたい

1. `src/lib/gemini-identify.ts` の `IDENTIFY_PROMPT` を編集
2. サーバー再起動 → 撮影して結果を確認

### 例3: 画面のデザインを変えたい

1. v0 で UI を作り直す場合 → `src/components/` を差し替え
2. 色だけ変える場合 → `src/app/globals.css`

### 変更後の確認チェックリスト

- [ ] `npm run dev` がエラーなく起動する
- [ ] http://localhost:3000 が表示される
- [ ] 撮影 or 画像選択 → 判別 → 判定タブに結果が出る
- [ ] 図鑑に印が付く

本番公開前には:

```powershell
npm run build
```

が **エラーなく終わること** も確認してください。

---

## 用語集

| 用語 | 意味 |
|------|------|
| **Next.js** | このアプリの土台（Web アプリフレームワーク） |
| **npm** | ライブラリの管理・コマンド実行ツール |
| **開発サーバー** | 自分の PC 上だけで動くテスト用サーバー（`npm run dev`） |
| **API** | プログラム同士がデータをやり取りする窓口 |
| **Gemini API** | Google の AI サービス（画像からネタ名を判別） |
| **環境変数** | `.env.local` に書く秘密の設定値 |
| **v0** | UI をデザインしたツール（[v0.app](https://v0.app)） |
| **コンポーネント** | 画面の部品（ボタン、カメラ画面など） |
| **ビルド** | 公開用にアプリをまとめる作業（`npm run build`） |

---

## 困ったときの連絡・調査のしかた

1. **ブラウザのエラーメッセージ** をそのままメモする
2. **PowerShell の赤い部分** をコピーする
3. 変更した **ファイル名** をメモする
4. エンジニアや AI に相談するときは、上記3点を渡すとスムーズです

---

## 技術情報（参考）

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS v4 / shadcn/ui
- Google Gemini API（デフォルト: `gemini-3.6-flash`）
- UI 原型: [v0 プロジェクト](https://v0.app/sho-ops/chat/sushi-identifier-f3b5Ab0uhYg)

---

*最終更新: 2026年9月 — 非エンジニア向け保守ガイドとして作成*
