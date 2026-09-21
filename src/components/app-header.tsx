import { cn } from '@/lib/utils'

export function AppHeader({
  collectedCount,
  totalCount,
  collectHighlighted = false,
}: {
  collectedCount: number
  totalCount: number
  collectHighlighted?: boolean
}) {
  return (
    <header className="relative z-10 shrink-0 border-b border-border/60 bg-background/80 px-5 pb-4 pt-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 朱の印章風マーク */}
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-sm bg-vermilion font-serif text-lg font-bold text-background"
          >
            鮨
          </span>
          <div className="leading-tight">
            <h1 className="font-serif text-lg font-bold tracking-widest text-foreground">
              鮨鑑
            </h1>
            <p className="text-[10px] font-medium tracking-[0.35em] text-primary/80">
              SUSHIKAN
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] tracking-widest text-muted-foreground">
            収集
          </p>
          <p className="font-serif text-sm text-foreground">
            <span
              className={cn(
                'inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1 text-primary transition-all',
                collectHighlighted &&
                  'animate-pulse bg-primary/20 shadow-[0_0_16px_-2px_var(--color-primary)]',
              )}
            >
              {collectedCount}
            </span>
            <span className="text-muted-foreground"> / {totalCount} 種</span>
          </p>
        </div>
      </div>

      {/* 金の細線（和のあしらい） */}
      <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
    </header>
  )
}
