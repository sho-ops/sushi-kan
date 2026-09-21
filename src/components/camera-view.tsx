'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Aperture, Camera, ImagePlus, Loader2, Images } from 'lucide-react'
import { resolveNetaFromName } from '@/lib/resolve-neta'
import type { Neta } from '@/lib/sushi-data'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'scanning'

const VIDEO_CONSTRAINTS_ATTEMPTS: MediaStreamConstraints[] = [
  { video: { facingMode: 'environment' }, audio: false },
  { video: { facingMode: { ideal: 'environment' } }, audio: false },
  { video: { facingMode: 'user' }, audio: false },
  { video: true, audio: false },
]

async function acquireCameraStream(): Promise<MediaStream> {
  let lastError: unknown

  for (const constraints of VIDEO_CONSTRAINTS_ATTEMPTS) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError ?? new Error('カメラストリームを取得できませんでした')
}

async function bindStreamToVideo(
  video: HTMLVideoElement,
  stream: MediaStream,
): Promise<void> {
  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')
  video.muted = true
  video.playsInline = true
  video.autoplay = true
  video.srcObject = stream

  await new Promise<void>((resolve, reject) => {
    let settled = false

    const timeoutId = window.setTimeout(() => {
      if (settled) return
      settled = true
      video.removeEventListener('loadedmetadata', onReady)
      reject(new Error('映像の読み込みがタイムアウトしました'))
    }, 8000)

    const onReady = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      video.removeEventListener('loadedmetadata', onReady)
      resolve()
    }

    video.addEventListener('loadedmetadata', onReady)

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onReady()
    }
  })

  try {
    await video.play()
  } catch {
    await new Promise((resolve) => window.setTimeout(resolve, 300))
    await video.play()
  }
}

async function waitForVideoFrame(
  video: HTMLVideoElement,
  timeoutMs = 4000,
): Promise<boolean> {
  const started = Date.now()

  while (Date.now() - started < timeoutMs) {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      return true
    }
    await new Promise((resolve) => window.setTimeout(resolve, 100))
  }

  return video.videoWidth > 0 && video.videoHeight > 0
}

export function CameraView({ onDetect }: { onDetect: (neta: Neta) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const nativeCameraInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const startCameraRequestRef = useRef(0)

  const [phase, setPhase] = useState<Phase>('idle')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraStarting, setCameraStarting] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [detectError, setDetectError] = useState<string | null>(null)

  const isScanning = phase === 'scanning'
  const showLiveVideo = !previewUrl

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    const video = videoRef.current
    if (video) {
      video.srcObject = null
    }
    setCameraReady(false)
    setCameraStarting(false)
  }, [])

  const startCamera = useCallback(async () => {
    const requestId = ++startCameraRequestRef.current

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'ライブプレビューは使えません。「カメラで撮る」または「アルバムから選ぶ」をお使いください。',
      )
      setCameraStarting(false)
      setCameraReady(false)
      return
    }

    setCameraStarting(true)
    setCameraError(null)
    setCameraReady(false)

    stopCamera()

    try {
      const stream = await acquireCameraStream()
      if (requestId !== startCameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream

      const video = videoRef.current
      if (!video) {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        throw new Error('映像プレビューの準備ができませんでした')
      }

      await bindStreamToVideo(video, stream)

      if (requestId !== startCameraRequestRef.current) {
        return
      }

      const hasFrame = await waitForVideoFrame(video)
      if (!hasFrame) {
        throw new Error('カメラ映像のサイズを取得できませんでした')
      }

      setCameraReady(true)
    } catch {
      if (requestId !== startCameraRequestRef.current) {
        return
      }
      stopCamera()
      setCameraError(
        'カメラのプレビューを開始できません。「カメラで撮る」（カメラアプリ）または「アルバムから選ぶ」をお試しください。',
      )
    } finally {
      if (requestId === startCameraRequestRef.current) {
        setCameraStarting(false)
      }
    }
  }, [stopCamera])

  useEffect(() => {
    void startCamera()

    return () => {
      startCameraRequestRef.current += 1
      stopCamera()
      revokePreview()
    }
  }, [startCamera, stopCamera, revokePreview])

  const identifyImage = async (file: File, preview: string) => {
    revokePreview()
    previewUrlRef.current = preview
    setPreviewUrl(preview)
    setPhase('scanning')
    setDetectError(null)
    stopCamera()

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/identify', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? '判別に失敗しました。')
      }

      const neta = resolveNetaFromName(data.name, preview)
      setPhase('idle')
      onDetect(neta)
    } catch (error) {
      setPhase('idle')
      setDetectError(
        error instanceof Error ? error.message : '判別に失敗しました。',
      )
      await startCamera()
    }
  }

  const captureFromLivePreview = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || !cameraReady) {
      return false
    }

    const hasFrame = await waitForVideoFrame(video)
    if (!hasFrame) {
      setDetectError('カメラ映像を取得できません。もう一度お試しください。')
      return true
    }

    try {
      await video.play()
    } catch {
      // play() は iOS で user gesture 後なら通常成功
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    if (!context) return true

    context.drawImage(video, 0, 0)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92)
    })

    if (!blob) {
      setDetectError('写真の撮影に失敗しました。')
      return true
    }

    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    await identifyImage(file, url)
    return true
  }

  const handleTakePhoto = async () => {
    if (isScanning) return

    if (cameraReady) {
      await captureFromLivePreview()
      return
    }

    nativeCameraInputRef.current?.click()
  }

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    await identifyImage(file, url)
    event.target.value = ''
  }

  const openGallery = () => {
    if (isScanning) return
    galleryInputRef.current?.click()
  }

  const resetCamera = async () => {
    revokePreview()
    setPreviewUrl(null)
    setDetectError(null)
    setPhase('idle')
    await startCamera()
  }

  return (
    <div className="flex flex-col items-center px-5 pt-6 pb-2">
      <div className="mb-5 text-center">
        <h2 className="font-serif text-xl font-bold tracking-wide text-foreground">
          ネタにかざす
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          お皿の一貫を枠に収めて、
          <br />
          下のボタンから撮影または写真を選んでください。
        </p>
      </div>

      <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-black/60">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="判別する寿司の写真"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-700',
              isScanning
                ? 'scale-105 brightness-90'
                : 'scale-100 brightness-75',
            )}
          />
        ) : null}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          disablePictureInPicture
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            !showLiveVideo && 'pointer-events-none opacity-0',
            showLiveVideo && !cameraReady && 'opacity-0',
            showLiveVideo && cameraReady && 'opacity-100',
          )}
        />

        {showLiveVideo && !cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            {cameraStarting ? (
              <>
                <Loader2
                  className="size-10 animate-spin text-primary"
                  aria-hidden="true"
                />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  カメラを起動しています…
                </p>
              </>
            ) : (
              <>
                <Images
                  className="size-14 text-muted-foreground/40"
                  strokeWidth={1}
                  aria-hidden="true"
                />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  {cameraError ??
                    '下の「カメラで撮る」または「アルバムから選ぶ」で開始できます'}
                </p>
              </>
            )}
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        {(['left-4 top-4 border-l-2 border-t-2', 'right-4 top-4 border-r-2 border-t-2', 'left-4 bottom-4 border-b-2 border-l-2', 'right-4 bottom-4 border-b-2 border-r-2'] as const).map(
          (pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute size-8 rounded-sm border-primary/80',
                pos,
              )}
            />
          ),
        )}

        {isScanning && (
          <>
            <span
              aria-hidden="true"
              className="animate-scanline pointer-events-none absolute inset-x-6 top-6 h-0.5 rounded-full bg-primary shadow-[0_0_14px_2px_var(--color-primary)]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-primary">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span className="font-serif text-sm tracking-widest">解析中…</span>
            </div>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFileSelect}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleFileSelect}
      />

      <p className="mt-6 w-full max-w-xs text-center font-serif text-xs tracking-widest text-muted-foreground">
        判別のしかた
      </p>

      <div className="mt-3 grid w-full max-w-xs grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleTakePhoto}
          disabled={isScanning}
          aria-label="カメラで撮影して判別する"
          className={cn(
            'touch-manipulation flex min-h-[52px] flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-primary/10 px-3 py-3 transition-transform active:scale-[0.98] disabled:opacity-60',
          )}
        >
          <Camera className="size-6 text-primary" strokeWidth={1.8} aria-hidden="true" />
          <span className="font-serif text-sm font-semibold text-foreground">
            カメラで撮る
          </span>
          <span className="text-[10px] leading-tight text-muted-foreground">
            {cameraReady ? 'プレビューから撮影' : 'カメラアプリを起動'}
          </span>
        </button>

        <button
          type="button"
          onClick={openGallery}
          disabled={isScanning}
          aria-label="写真ライブラリから画像を選んで判別する"
          className={cn(
            'touch-manipulation flex min-h-[52px] flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-3 transition-transform active:scale-[0.98] disabled:opacity-60',
          )}
        >
          <ImagePlus className="size-6 text-primary" strokeWidth={1.8} aria-hidden="true" />
          <span className="font-serif text-sm font-semibold text-foreground">
            アルバムから選ぶ
          </span>
          <span className="text-[10px] leading-tight text-muted-foreground">
            保存済みの写真
          </span>
        </button>
      </div>

      {cameraReady && (
        <button
          type="button"
          onClick={handleTakePhoto}
          disabled={isScanning}
          aria-label="シャッターボタンで撮影"
          className="group mt-6 flex flex-col items-center gap-2 disabled:opacity-70"
        >
          <span className="relative flex size-[4.5rem] items-center justify-center rounded-full border-2 border-primary/70 transition-transform active:scale-95">
            <span className="absolute inset-0 rounded-full bg-primary/10 blur-md transition-opacity group-hover:opacity-100" />
            <span className="flex size-[3.5rem] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_-4px_var(--color-primary)]">
              <Aperture className="size-7" strokeWidth={1.8} aria-hidden="true" />
            </span>
          </span>
          <span className="font-serif text-xs font-semibold tracking-[0.25em] text-muted-foreground">
            シャッター（プレビュー中）
          </span>
        </button>
      )}

      {detectError && (
        <div
          role="alert"
          className="mt-4 w-full max-w-xs rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-xs text-destructive"
        >
          {detectError}
          {!cameraReady && (
            <button
              type="button"
              onClick={resetCamera}
              className="mt-2 block w-full min-h-[44px] text-primary underline-offset-2 hover:underline"
            >
              ライブプレビューを再試行
            </button>
          )}
        </div>
      )}

      <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        スマホでは「カメラで撮る」がカメラ、「アルバムから選ぶ」が写真フォルダを開きます。
      </p>
    </div>
  )
}
