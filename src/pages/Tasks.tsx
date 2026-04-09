import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type TaskType = 'krasvord' | 'soz-topshirigi'

type DbTask = {
  id: string
  title: string
  type: TaskType
  questions: string | null
  imageUrl: string | null
}

export function Tasks() {
  const timeOptions = [5, 10, 15, 20]
  const tasksTable = import.meta.env.VITE_SUPABASE_TASKS_TABLE ?? 'tasks'

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const [tasks, setTasks] = useState<DbTask[]>([])
  const [isTasksLoading, setIsTasksLoading] = useState(true)
  const [tasksLoadError, setTasksLoadError] = useState('')

  const loadTasks = useCallback(
    async (silentRefresh = false) => {
      if (!silentRefresh) {
        setTasksLoadError('')
        setIsTasksLoading(true)
      }

      const { data, error } = await supabase
        .from(tasksTable)
        .select('id, title, type, questions, image_url')
        .order('created_at', { ascending: false })

      if (error) {
        if (!silentRefresh) {
          setTasksLoadError(error.message)
          setTasks([])
          setIsTasksLoading(false)
        }
        return
      }

      const seen = new Set<string>()
      const mapped = (data ?? [])
        .map((row) => ({
          id: String(row.id),
          title: row.title as string,
          type: row.type as TaskType,
          questions: (row.questions as string | null) ?? null,
          imageUrl: (row.image_url as string | null) ?? null,
        }))
        .filter((row) => {
          if (seen.has(row.id)) return false
          seen.add(row.id)
          return true
        })

      setTasks(mapped)
      if (!silentRefresh) setIsTasksLoading(false)
    },
    [tasksTable],
  )

  useEffect(() => {
    void loadTasks(false)
  }, [loadTasks])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') void loadTasks(true)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [loadTasks])

  useEffect(() => {
    const refresh = () => void loadTasks(true)
    window.addEventListener('focus', refresh)
    window.addEventListener('pageshow', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('pageshow', refresh)
    }
  }, [loadTasks])

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeTaskId) ?? null,
    [activeTaskId, tasks],
  )

  const activeTitle = activeTask?.title ?? ''
  const isWordTask = activeTask?.type === 'soz-topshirigi'
  const modalImageSrc = activeTask?.imageUrl ?? null

  useEffect(() => {
    if (activeTaskId && !isTasksLoading && !tasks.some((t) => t.id === activeTaskId)) {
      setActiveTaskId(null)
      setSelectedMinutes(null)
      setRemainingSeconds(0)
      setIsRunning(false)
    }
  }, [activeTaskId, tasks, isTasksLoading])

  const closeModal = () => {
    setActiveTaskId(null)
    setSelectedMinutes(null)
    setRemainingSeconds(0)
    setIsRunning(false)
  }

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

  const modalOpen = Boolean(activeTask)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Topshiriqlar
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Bu yerda Krasvord va So'z o'yinlarni bajarish orqali bilimingizni oshiring
        </p>
      </div>

      {tasksLoadError ? (
        <p className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100">
          Topshiriqlarni yuklashda xatolik: {tasksLoadError}. SQL Editor’da{' '}
          <code className="rounded bg-black/10 px-1">supabase/tasks-public-read.sql</code> ni ishga
          tushiring (jadval nomi: «{tasksTable}»).
        </p>
      ) : null}

      {isTasksLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
          Yuklanmoqda…
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
          Hozircha topshiriqlar yo‘q. Admin panel orqali qo‘shing.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-950/30 shadow-xl backdrop-blur-md dark:border-white/10">
          <ul className="divide-y divide-white/10">
            {tasks.map((task) => {
              const description = (task.questions ?? '').trim()
              const isReady = Boolean(task.imageUrl || description)
              return (
                <li key={task.id} className="px-5 py-5 sm:px-8">
                  <div className="flex items-center justify-between gap-6">
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-white sm:text-lg">{task.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-white/70">
                        {description || "Tez orada batafsil ma'lumot joylanadi."}
                      </p>
                      <p className="mt-2 text-xs text-white/50">
                        {task.type === 'krasvord' ? 'Krasvord' : "So'z topshirig'i"}
                      </p>
                    </div>

                    {isReady ? (
                      <button
                        type="button"
                        onClick={() => setActiveTaskId(task.id)}
                        className="shrink-0 rounded-xl border border-cyan-400/70 bg-transparent px-5 py-2 text-sm font-semibold text-cyan-100 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-500/10"
                      >
                        Bajarish
                      </button>
                    ) : (
                      <span className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/70">
                        Tez orada
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {modalOpen && activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="min-h-[80vh] w-full max-w-6xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-slate-900 dark:text-white">
                  {activeTitle} - Bajarish
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

            <div className={`grid gap-6 ${isWordTask ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
              <div
                className={`relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950 dark:border-white/10 ${isWordTask ? 'min-h-[min(62vh,560px)] md:col-span-3 md:min-h-[520px]' : 'min-h-[min(48vh,400px)] md:min-h-[360px]'}`}
              >
                {modalImageSrc ? (
                  <img
                    src={modalImageSrc}
                    alt="Topshiriq rasmi"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-6 dark:bg-slate-900/80">
                    <div className="relative w-full max-w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-[#efefef] shadow-xl dark:border-white/10">
                      <div className="h-16 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300" />
                      <div className="px-5 pb-14 pt-6">
                        <p className="text-xs text-slate-500">Muallif</p>
                        <p className="mt-4 text-xl font-black uppercase leading-tight text-slate-900">
                          Physics Workbook
                        </p>
                        <p className="mt-3 text-sm text-slate-700">
                          Boshlang‘ich daraja uchun qo‘llanma
                        </p>
                        <button
                          type="button"
                          className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md"
                          disabled
                        >
                          Modulga o‘tish
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-indigo-500/80" />
                    </div>
                  </div>
                )}
              </div>

              {!isWordTask && (
                <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    Savollar
                  </p>
                  <div className="min-h-[320px] rounded-xl border border-dashed border-slate-300 bg-white/70 p-3 dark:border-white/20 dark:bg-slate-900/60">
                    {activeTask.questions?.trim() ? (
                      <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                        {activeTask.questions}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Savollar hali kiritilmagan.
                      </p>
                    )}
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

