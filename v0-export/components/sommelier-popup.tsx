'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { Quote, X } from 'lucide-react'
import type { Neta } from '@/lib/sushi-data'

export function SommelierPopup({
  neta,
  open,
  onClose,
}: {
  neta: Neta | null
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !neta) return null

  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sommelier-title"
    >
      {/* 暗幕 */}
      <button
        type="button"
        aria-label="解説を閉じる"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* シート */}
      <div className="animate-stamp-in relative z-10 w-full max-w-md rounded-t-3xl border-t border-primary/40 bg-popover p-6 pb-8 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />

        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        {/* ソムリエの肩書き */}
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-primary/60 bg-vermilion font-serif text-lg font-bold text-background">
            匠
          </span>
          <div>
            <p className="font-serif text-sm font-semibold tracking-widest text-foreground">
              寿司ソムリエ · 匠
            </p>
            <p className="text-[11px] tracking-widest text-primary/80">
              SUSHI SOMMELIER
            </p>
          </div>
        </div>

        {/* 対象ネタ */}
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={neta.image || '/placeholder.svg'}
              alt={neta.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </span>
          <div>
            <h3
              id="sommelier-title"
              className="font-serif text-xl font-bold text-foreground"
            >
              {neta.name}
            </h3>
            <p className="text-[11px] tracking-widest text-muted-foreground">
              {neta.romaji.toUpperCase()} · {neta.category}
            </p>
          </div>
        </div>

        {/* 解説コメント */}
        <div className="relative mt-4 rounded-xl bg-secondary/60 p-4">
          <Quote
            className="absolute -top-2 left-3 size-6 text-primary/50"
            aria-hidden="true"
          />
          <p className="pt-2 text-sm leading-loose text-foreground/90">
            {neta.sommelier}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-primary py-3 font-serif text-sm font-semibold tracking-[0.3em] text-primary-foreground"
        >
          いただきます
        </button>
      </div>
    </div>
  )
}
