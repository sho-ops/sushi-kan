'use client'

import Image from 'next/image'
import { Aperture, BookMarked, ChevronRight, Sparkles } from 'lucide-react'
import { rarityLabel, type Neta } from '@/lib/sushi-data'
import { cn } from '@/lib/utils'

function RarityBadge({ neta }: { neta: Neta }) {
  const styles: Record<Neta['rarity'], string> = {
    common: 'border-muted-foreground/40 text-muted-foreground',
    rare: 'border-primary/60 text-primary',
    legend: 'border-vermilion/70 bg-vermilion/10 text-vermilion',
  }
  return (
    <span
      className={cn(
        'rounded-full border px-3 py-0.5 font-serif text-xs tracking-widest',
        styles[neta.rarity],
      )}
    >
      {rarityLabel[neta.rarity]}
    </span>
  )
}

function TasteBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary/80"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function NewZukanCelebrationBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-stamp-in mb-4 overflow-hidden rounded-xl border border-primary/50 bg-gradient-to-r from-primary/15 via-primary/10 to-vermilion/10 p-4 shadow-[0_0_24px_-8px_var(--color-primary)]"
    >
      <div className="flex items-start gap-3">
        <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-primary">
          <BookMarked className="size-5" aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-vermilion shadow-[0_0_8px_var(--color-vermilion)]"
          />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-serif text-sm font-bold tracking-wide text-primary">
            図鑑に新しく登録されました！
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            ネタ図鑑タブでスタンプが点灯しました。コレクションを増やしていきましょう。
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-primary/60 bg-primary/10 px-2 py-0.5 font-serif text-[10px] tracking-widest text-primary">
          NEW
        </span>
      </div>
    </div>
  )
}

export function ResultView({
  result,
  showNewZukanCelebration = false,
  onOpenSommelier,
  onGoCamera,
}: {
  result: Neta | null
  showNewZukanCelebration?: boolean
  onOpenSommelier: () => void
  onGoCamera: () => void
}) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center px-8 pt-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-border">
          <Aperture className="size-7 text-muted-foreground" strokeWidth={1.2} aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-serif text-lg text-foreground">まだ判定がありません</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          「撮影」からネタをかざすと、
          <br />
          ここに見極めの結果が表示されます。
        </p>
        <button
          type="button"
          onClick={onGoCamera}
          className="mt-6 rounded-full bg-primary px-6 py-2.5 font-serif text-sm font-semibold tracking-widest text-primary-foreground"
        >
          撮影へすすむ
        </button>
      </div>
    )
  }

  const imageSrc = result.image || '/placeholder.svg'
  const isCapturedImage =
    imageSrc.startsWith('blob:') || imageSrc.startsWith('data:')

  return (
    <div className="px-5 pt-4">
      {showNewZukanCelebration && <NewZukanCelebrationBanner />}

      {/* ネタ写真 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
        <Image
          src={imageSrc}
          alt={`判別されたネタ：${result.name}`}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
          unoptimized={isCapturedImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-end gap-3">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-primary/90">
              {result.romaji.toUpperCase()}
            </p>
            <h2 className="font-serif text-3xl font-bold leading-none text-foreground drop-shadow">
              {result.name}
            </h2>
          </div>
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
          {showNewZukanCelebration && (
            <span className="animate-stamp-in flex items-center gap-1 rounded-full border border-primary/70 bg-background/90 px-2.5 py-1 font-serif text-[10px] tracking-widest text-primary shadow-[0_0_12px_-2px_var(--color-primary)]">
              <BookMarked className="size-3" aria-hidden="true" />
              図鑑GET
            </span>
          )}
          <RarityBadge neta={result} />
        </div>
      </div>

      {/* 判別スコア */}
      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-widest text-muted-foreground">
            判別の確度
          </span>
          <span className="font-serif text-lg font-bold text-primary">
            {result.confidence}
            <span className="text-sm">%</span>
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
            style={{ width: `${result.confidence}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground">
            {result.category}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground">
            旬 · {result.season}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-secondary-foreground">
            {result.kana}
          </span>
        </div>
      </div>

      {/* 味わいの図 */}
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 font-serif text-sm tracking-widest text-foreground">
          味わいの目安
        </h3>
        <div className="flex flex-col gap-2.5">
          <TasteBar label="旨み" value={result.taste.umami} />
          <TasteBar label="脂" value={result.taste.fat} />
          <TasteBar label="食感" value={result.taste.texture} />
        </div>
      </div>

      {/* ソムリエ解説を開く */}
      <button
        type="button"
        onClick={onOpenSommelier}
        className="mt-4 flex w-full items-center justify-between rounded-xl border border-primary/40 bg-primary/5 p-4 text-left transition-colors hover:bg-primary/10"
      >
        <span className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block font-serif text-sm font-semibold text-foreground">
              寿司ソムリエの解説
            </span>
            <span className="block text-[11px] text-muted-foreground">
              このネタの粋な味わい方
            </span>
          </span>
        </span>
        <ChevronRight className="size-5 text-primary" aria-hidden="true" />
      </button>
    </div>
  )
}
