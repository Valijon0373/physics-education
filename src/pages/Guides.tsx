import { useEffect, useMemo, useState } from 'react'
import { guides } from '../data/content'

export function Guides() {
  const timeOptions = [5, 10, 15, 20]
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const activeGuide = useMemo(
    () => guides.find((g) => g.id === activeGuideId) ?? null,
    [activeGuideId],
  )

  const closeModal = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage)
    }
    setActiveGuideId(null)
    setUploadedImage(null)
    setSelectedMinutes(null)
    setRemainingSeconds(0)
    setIsRunning(false)
  }

  const isTaskActionEnabled = (id: string) => id === 'pdf1' || id === 'pdf2'

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isRunning, remainingSeconds])

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage)
      }
    }
  }, [uploadedImage])

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const hh = String(hours).padStart(2, '0')
    const mm = String(minutes).padStart(2, '0')
    const ss = String(secs).padStart(2, '0')
    return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
  }

  const handleStartTimer = () => {
    if (!remainingSeconds) {
      if (!selectedMinutes) return
      setRemainingSeconds(selectedMinutes * 60)
    }
    setIsRunning(true)
  }

  const handleResetTimer = () => {
    setIsRunning(false)
    setRemainingSeconds(selectedMinutes ? selectedMinutes * 60 : 0)
  }

  const isWordTask = activeGuide?.id === 'pdf2'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Topshiriqlar
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Bu yerda Krasvord va So'z o'yinlarni bajarish orqali bilimingizni
          oshiring
        </p>
      </div>

      <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-white/10 dark:border-white/10 dark:bg-slate-900/60">
        {guides.map((g) => (
          <li
            key={g.id}
            className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {g.title}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {g.summary}
              </p>
              <p className="mt-2 text-xs text-slate-500">{g.pages} bet</p>
            </div>
            <button
              type="button"
              disabled={!isTaskActionEnabled(g.id)}
              onClick={() => setActiveGuideId(g.id)}
              className="shrink-0 rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-800 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:enabled:hover:bg-white/10"
              title={
                isTaskActionEnabled(g.id)
                  ? 'Vazifani bajarish'
                  : "Bu topshiriq tez orada faol bo'ladi"
              }
            >
              {isTaskActionEnabled(g.id) ? 'Bajarish' : 'Tez orada'}
            </button>
          </li>
        ))}
      </ul>

      {activeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="min-h-[80vh] w-full max-w-6xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  {activeGuide.title} - Bajarish
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  O'ng tomonda vaqtni belgilang va timerni boshqaring.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Yopish
              </button>
            </div>

            <div
              className={`grid gap-6 ${isWordTask ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}
            >
              <div
                className={`flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50 ${isWordTask ? 'min-h-[520px] md:col-span-3' : 'min-h-[320px]'}`}
              >
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Yuklangan topshiriq rasmi"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="px-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    Rasm ko'rinishi shu joyda chiqadi.
                  </div>
                )}
              </div>

              {!isWordTask && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Savollar
                  </p>
                  <div className="min-h-[320px] rounded-xl border border-dashed border-slate-300 bg-white/70 p-3 dark:border-white/20 dark:bg-slate-900/60">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Shu bo'limda krasvord savollari ko'rinadi.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50">
                <label
                  htmlFor="task-time-select"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Vaqtni belgilash
                </label>
                <select
                  id="task-time-select"
                  value={selectedMinutes ?? ''}
                  onChange={(event) => {
                    const value = Number(event.target.value)
                    setSelectedMinutes(Number.isNaN(value) ? null : value)
                    setIsRunning(false)
                    setRemainingSeconds(0)
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-cyan-500 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="">Vaqtni tanlang</option>
                  {timeOptions.map((minute) => (
                    <option key={minute} value={minute}>
                      {minute} min
                    </option>
                  ))}
                </select>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tanlangan vaqt:{' '}
                  <span className="font-medium text-slate-900 dark:text-white">
                    {selectedMinutes ? `${selectedMinutes} min` : '--'}
                  </span>
                </p>

                <div className="rounded-xl bg-black p-4 text-center">
                  <p className="font-mono text-5xl font-semibold tracking-wider text-sky-400">
                    {formatTimer(remainingSeconds)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={isRunning ? () => setIsRunning(false) : handleStartTimer}
                    disabled={!selectedMinutes && remainingSeconds === 0}
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRunning ? 'Pauza' : 'Start'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
