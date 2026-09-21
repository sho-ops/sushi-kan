'use client'

import { useCallback, useRef, useState } from 'react'
import { NETA, type Neta } from '@/lib/sushi-data'
import { AppHeader } from './app-header'
import { BottomTabs, type TabId } from './bottom-tabs'
import { CameraView } from './camera-view'
import { ResultView } from './result-view'
import { ZukanView } from './zukan-view'
import { SommelierPopup } from './sommelier-popup'

export function SushiApp() {
  const [tab, setTab] = useState<TabId>('camera')
  const [result, setResult] = useState<Neta | null>(null)
  const [collected, setCollected] = useState<string[]>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [newZukanRegistration, setNewZukanRegistration] = useState(false)
  const collectedRef = useRef(collected)
  collectedRef.current = collected

  // 撮影 → Gemini判別完了時に呼ばれる
  const handleDetect = useCallback((neta: Neta) => {
    const prev = collectedRef.current
    const inCatalog = NETA.some((item) => item.id === neta.id)
    const isFirstCatalogCollect = inCatalog && !prev.includes(neta.id)

    setNewZukanRegistration(isFirstCatalogCollect)
    setCollected((current) =>
      current.includes(neta.id) ? current : [...current, neta.id],
    )
    setResult(neta)
    setTab('result')
    // 判別結果が表示された後、ソムリエがそっと語りかける
    const sommelierDelay = isFirstCatalogCollect ? 1100 : 650
    window.setTimeout(() => setPopupOpen(true), sommelierDelay)
  }, [])

  const openNeta = useCallback((neta: Neta) => {
    setNewZukanRegistration(false)
    setResult(neta)
    setTab('result')
  }, [])

  const handleTabChange = useCallback((next: TabId) => {
    if (next === 'sommelier') {
      // ソムリエタブは解説ポップアップを開く（背景は直近の判定結果）
      setTab('result')
      setPopupOpen(true)
      return
    }
    if (next !== 'result') {
      setNewZukanRegistration(false)
    }
    setTab(next)
  }, [])

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background">
      <AppHeader
        collectedCount={collected.length}
        totalCount={NETA.length}
        collectHighlighted={newZukanRegistration}
      />

      <main className="relative flex-1 overflow-y-auto pb-28">
        {tab === 'camera' && <CameraView onDetect={handleDetect} />}
        {tab === 'result' && (
          <ResultView
            result={result}
            showNewZukanCelebration={newZukanRegistration}
            onOpenSommelier={() => setPopupOpen(true)}
            onGoCamera={() => {
              setNewZukanRegistration(false)
              setTab('camera')
            }}
          />
        )}
        {tab === 'zukan' && <ZukanView collected={collected} onSelect={openNeta} />}
      </main>

      <BottomTabs active={tab} onChange={handleTabChange} />

      <SommelierPopup
        neta={result}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  )
}
