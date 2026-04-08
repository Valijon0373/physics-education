import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLessonById } from '../data/content'
import { ExerciseCard } from '../components/ExerciseCard'
import { supabase } from '../lib/supabase'

export function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const isDbLesson = Boolean(lessonId?.startsWith('db-'))
  const rawDbId = isDbLesson ? String(lessonId).replace(/^db-/, '') : ''
  const staticLesson = lessonId && !isDbLesson ? getLessonById(lessonId) : undefined
  const lessonsTable = import.meta.env.VITE_SUPABASE_LESSONS_TABLE ?? 'lessons'
  const [dbLesson, setDbLesson] = useState<{
    id: string
    topic: string
    title: string
    description: string
    videoEmbedUrl: string
    pdfUrl: string | null
  } | null>(null)
  const [isDbLoading, setIsDbLoading] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const lesson = staticLesson
    ? staticLesson
    : dbLesson
      ? {
          id: `db-${dbLesson.id}`,
          topic: dbLesson.topic,
          title: dbLesson.title,
          description: dbLesson.description,
          durationMin: 0,
          videoEmbedUrl: dbLesson.videoEmbedUrl,
          exercises: [],
        }
      : undefined

  useEffect(() => {
    if (!isDbLesson || !rawDbId) return
    const loadDbLesson = async () => {
      setIsDbLoading(true)
      const { data, error } = await supabase
        .from(lessonsTable)
        .select('id, topic, rule, youtube_url, pdf_url')
        .eq('id', rawDbId)
        .maybeSingle()
      if (error || !data) {
        setDbLesson(null)
        setIsDbLoading(false)
        return
      }
      setDbLesson({
        id: String(data.id),
        topic: String(data.topic ?? ''),
        title: String(data.topic ?? 'Mashq'),
        description: String(data.rule ?? ''),
        videoEmbedUrl: String(data.youtube_url ?? ''),
        pdfUrl: (data.pdf_url as string | null) ?? null,
      })
      setIsDbLoading(false)
    }
    void loadDbLesson()
  }, [isDbLesson, lessonsTable, rawDbId])

  const watchUrl = useMemo(() => {
    if (!lesson?.videoEmbedUrl) return ''
    const match = lesson.videoEmbedUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/)
    if (!match?.[1]) return lesson.videoEmbedUrl
    return `https://www.youtube.com/watch?v=${match[1]}`
  }, [lesson?.videoEmbedUrl])

  if (isDbLesson && isDbLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-slate-900/60">
        <p className="text-slate-600 dark:text-slate-400">Yuklanmoqda...</p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-white/10 dark:bg-slate-900/60">
        <p className="text-slate-600 dark:text-slate-400">Dars topilmadi.</p>
        <Link
          to="/darslar"
          className="mt-4 inline-block text-cyan-600 hover:underline dark:text-cyan-400"
        >
          Darslar ro‘yxatiga qaytish
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link
          to="/darslar"
          className="text-slate-600 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400"
        >
          ← Darslar
        </Link>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="text-cyan-600 dark:text-cyan-400/90">{lesson.topic}</span>
      </div>

      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
          {lesson.description}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,380px)] lg:items-start">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl shadow-black/10 dark:border-white/10 dark:shadow-black/50">
            <div className="relative aspect-video w-full">
              {!videoFailed ? (
                <iframe
                  title={lesson.title}
                  src={lesson.videoEmbedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setVideoFailed(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-center">
                  <div className="max-w-md">
                    <p className="text-lg font-semibold text-white">Video hozir ochilmadi</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Muallif tomonidan embed cheklangan bo‘lishi mumkin. Videoni YouTube’da ochib
                      ko‘ring.
                    </p>
                    {watchUrl ? (
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900"
                      >
                        YouTube’da ochish
                      </a>
                    ) : null}
                  </div>
                </div>
              )}
              {watchUrl ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 to-transparent p-3">
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pointer-events-auto inline-flex items-center rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-white"
                  >
                    Video ochilmasa YouTube’da ko‘ring
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-cyan-200 bg-slate-50 p-1 dark:border-cyan-500/20 dark:bg-slate-900/80">
            <div className="rounded-xl bg-white px-4 py-3 dark:bg-slate-950/50">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Mashqlar
              </h2>
                <p className="text-xs text-slate-500">{isDbLesson ? '' : 'Videoni ko‘rib, savollarni yeching.'}</p>
            </div>
            <div className="max-h-[min(70vh,640px)] space-y-3 overflow-y-auto p-3">
              {isDbLesson ? (
                dbLesson?.pdfUrl ? (
                  <div className="space-y-2">
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/50">
                      <iframe
                        title="Mashq PDF"
                        src={dbLesson.pdfUrl}
                        className="h-[420px] w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="inline-block rounded-lg border border-cyan-500 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                    >
                      PDF ni ochish
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">PDF biriktirilmagan.</p>
                )
              ) : (
                lesson.exercises.map((ex, i) => <ExerciseCard key={ex.id} exercise={ex} index={i} />)
              )}
            </div>
          </div>
        </aside>
      </div>

      {isDbLesson && isPdfModalOpen && dbLesson?.pdfUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">PDF ko‘rish</h3>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Yopish
              </button>
            </div>
            <iframe title="Mashq PDF modal" src={dbLesson.pdfUrl} className="h-full w-full" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
