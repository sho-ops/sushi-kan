'use client'

import { Aperture, BookMarked, ScrollText, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'camera' | 'result' | 'sommelier' | 'zukan'

const TABS: { id: TabId; label: string; sub: string; icon: typeof Aperture }[] = [
  { id: 'camera', label: '撮影', sub: 'かざす', icon: Aperture },
  { id: 'result', label: '判定', sub: 'みる', icon: ScrollText },
  { id: 'sommelier', label: '解説', sub: 'きく', icon: Sparkles },
  { id: 'zukan', label: '図鑑', sub: 'あつめる', icon: BookMarked },
]

export function BottomTabs({
  active,
  onChange,
}: {
  active: TabId
  onChange: (id: TabId) => void
}) {
  return (
    <nav
      aria-label="メインナビゲーション"
      className="absolute inset-x-0 bottom-0 z-20 border-t border-border/70 bg-background/95 backdrop-blur-md"
    >
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {TABS.map((t) => {
          const isActive = active === t.id || (t.id === 'sommelier' && false)
          const Icon = t.icon
          return (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full border transition-all',
                    isActive
                      ? 'border-primary/70 bg-primary/10 shadow-[0_0_20px_-6px_var(--color-primary)]'
                      : 'border-transparent',
                  )}
                >
                  <Icon
                    className="size-5"
                    strokeWidth={isActive ? 2.2 : 1.7}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-serif text-[11px] font-semibold tracking-widest">
                  {t.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
