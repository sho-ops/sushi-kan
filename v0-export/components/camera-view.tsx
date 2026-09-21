'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Aperture, Loader2 } from 'lucide-react'
import { NETA, type Neta } from '@/lib/sushi-data'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'scanning'

export function CameraView({ onDetect }: { onDetect: (neta: Neta) => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [preview, setPreview] = useState<Neta | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const capture = () => {
    if (phase === 'scanning') return
    const picked = NETA[Math.floor(Math.random() * NETA.length)]
    setPreview(picked)
    setPhase('scanning')
    const t = window.setTimeout(() => {
      setPhase('idle')
      onDetect(picked)
    }, 2000)
    timers.current.push(t)
  }

  return (
    <div className="flex flex-col items-center px-5 pt-6">
      <div className="mb-5 text-center">
        <h2 className="font-serif text-xl font-bold tracking-wide text-foreground">
          ネタにかざす
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          お皿の一貫を枠に収めて、下のボタンを一押し。
          <br />
          瞬時にネタを見極めます。
        </p>
      </div>

      {/* ビューファインダー */}
      <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-black/60">
        {/* 被写体プレビュー */}
        {preview ? (
          <Image
            src={preview.image || '/placeholder.svg'}
            alt="カメラに写っている寿司"
            fill
            sizes="320px"
            className={cn(
              'object-cover transition-all duration-700',
              phase === 'scanning'
                ? 'scale-105 brightness-90'
                : 'scale-100 brightness-75',
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Aperture
              className="size-16 text-muted-foreground/40"
              strokeWidth={1}
              aria-hidden="true"
            />
          </div>
        )}

        {/* 暗幕グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {/* コーナーの照準ブラケット */}
        {(['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-b-2 border-l-2', 'right-4 bottom-4 border-b-2 border-r-2'] as const).map(
          (pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={cn('absolute size-8 rounded-sm border-primary/80', pos)}
            />
          ),
        )}

        {/* スキャンライン */}
        {phase === 'scanning' && (
          <span
            aria-hidden="true"
            className="animate-scanline absolute inset-x-6 top-6 h-0.5 rounded-full bg-primary shadow-[0_0_14px_2px_var(--color-primary)]"
          />
        )}

        {/* スキャン中のラベル */}
        {phase === 'scanning' && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-primary">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span className="font-serif text-sm tracking-widest">
              解析中…
            </span>
          </div>
        )}
      </div>

      {/* シャッターボタン */}
      <button
        type="button"
        onClick={capture}
        disabled={phase === 'scanning'}
        aria-label="撮影して判別する"
        className="group mt-10 flex flex-col items-center gap-2 disabled:opacity-70"
      >
        <span className="relative flex size-20 items-center justify-center rounded-full border-2 border-primary/70 transition-transform active:scale-95">
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-md transition-opacity group-hover:opacity-100" />
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-4px_var(--color-primary)]">
            <Aperture className="size-8" strokeWidth={1.8} aria-hidden="true" />
          </span>
        </span>
        <span className="font-serif text-sm font-semibold tracking-[0.3em] text-foreground">
          撮 影
        </span>
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        ※ デモ版のため、撮影ごとにネタをランダムに判別します
      </p>
    </div>
  )
}
