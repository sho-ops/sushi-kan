'use client'

import { useCallback, useState } from 'react'
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
  const [collected, setCollected] = useState<string[]>(['salmon', 'akami'])
  const [popupOpen, setPopupOpen] = useState(false)

  // 撮影 → 判別完了時に呼ばれる（デモではランダムに一貫を判別）
  const handleDetect = useCallback((neta: Neta) => {
    setResult(neta)
    setCollected((prev) => (prev.includes(neta.id) ? prev : [...prev, neta.id]))
    setTab('result')
    // 判別結果が表示された後、ソムリエがそっと語りかける
    window.setTimeout(() => setPopupOpen(true), 650)
  }, [])

  const openNeta = useCallback((neta: Neta) => {
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
    setTab(next)
  }, [])

  return (
    <div className="relative mx-auto flex min-h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background">
      <AppHeader collectedCount={collected.length} totalCount={NETA.length} />

      <main className="relative flex-1 overflow-y-auto pb-28">
        {tab === 'camera' && <CameraView onDetect={handleDetect} />}
        {tab === 'result' && (
          <ResultView
            result={result}
            onOpenSommelier={() => setPopupOpen(true)}
            onGoCamera={() => setTab('camera')}
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
