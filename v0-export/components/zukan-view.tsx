'use client'

import Image from 'next/image'
import { Check, HelpCircle } from 'lucide-react'
import { NETA, rarityLabel, type Neta } from '@/lib/sushi-data'
import { cn } from '@/lib/utils'

function ZukanCard({
  neta,
  collected,
  onSelect,
}: {
  neta: Neta
  collected: boolean
  onSelect: (neta: Neta) => void
}) {
  return (
    <button
      type="button"
      disabled={!collected}
      onClick={() => collected && onSelect(neta)}
      aria-label={collected ? `${neta.name}の詳細を見る` : '未収集のネタ'}
      className={cn(
        'group relative flex aspect-square flex-col overflow-hidden rounded-xl border text-left transition-transform',
        collected
          ? 'border-primary/40 bg-card active:scale-95'
          : 'border-border/60 bg-secondary/30',
      )}
    >
      {/* 画像 or シルエット */}
      <div className="relative flex-1">
        {collected ? (
          <Image
            src={neta.image || '/placeholder.svg'}
            alt={neta.name}
            fill
            sizes="(max-width: 448px) 33vw, 140px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HelpCircle
              className="size-8 text-muted-foreground/40"
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </div>
        )}

        {/* 収集済みスタンプ */}
        {collected && (
          <span
            aria-hidden="true"
            className="animate-stamp-in absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full border-2 border-vermilion bg-background/70 text-vermilion"
          >
            <Check className="size-4" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* 名前帯 */}
      <div className="flex items-center justify-between gap-1 border-t border-border/60 bg-background/70 px-2 py-1.5">
        <span
          className={cn(
            'font-serif text-xs font-semibold tracking-wide',
            collected ? 'text-foreground' : 'text-muted-foreground/60',
          )}
        >
          {collected ? neta.name : '？？？'}
        </span>
        {collected && (
          <span className="shrink-0 text-[9px] tracking-widest text-primary/80">
            {rarityLabel[neta.rarity]}
          </span>
        )}
      </div>
    </button>
  )
}

export function ZukanView({
  collected,
  onSelect,
}: {
  collected: string[]
  onSelect: (neta: Neta) => void
}) {
  const count = collected.length
  const total = NETA.length
  const pct = Math.round((count / total) * 100)

  return (
    <div className="px-5 pt-4">
      <div className="mb-4 text-center">
        <h2 className="font-serif text-xl font-bold tracking-wide text-foreground">
          ネタ図鑑
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          食べたネタの印を集めて、江戸前を巡る
        </p>
      </div>

      {/* 進捗（スタンプラリー） */}
      <div className="mb-5 rounded-xl border border-border bg-card p-4">
        <div className="flex items-end justify-between">
          <span className="text-xs tracking-widest text-muted-foreground">
            収集の進み具合
          </span>
          <span className="font-serif text-foreground">
            <span className="text-2xl font-bold text-primary">{count}</span>
            <span className="text-sm text-muted-foreground"> / {total}</span>
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-right text-[11px] text-muted-foreground">
          制覇率 {pct}%
        </p>
      </div>

      {/* 図鑑グリッド */}
      <div className="grid grid-cols-3 gap-3">
        {NETA.map((neta) => (
          <ZukanCard
            key={neta.id}
            neta={neta}
            collected={collected.includes(neta.id)}
            onSelect={onSelect}
          />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        「撮影」で新たなネタを判別すると、
        <br />
        自動で図鑑に印が押されます。
      </p>
    </div>
  )
}
