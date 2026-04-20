import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Lessons() {
  type DbLesson = {
    id: string
    topic: string
    rule: string
    youtubeUrl: string
    pdfUrl: string | null
  }

  const lessonsTable = import.meta.env.VITE_SUPABASE_LESSONS_TABLE ?? 'lessons'
  const [dbLessons, setDbLessons] = useState<DbLesson[]>([])
  const [isLoadingDbLessons, setIsLoadingDbLessons] = useState(true)

  useEffect(() => {
    const loadDbLessons = async () => {
      setIsLoadingDbLessons(true)
      const { data, error } = await supabase
        .from(lessonsTable)
        .select('id, topic, rule, youtube_url, pdf_url')
        .order('created_at', { ascending: true })

      if (error) {
        setDbLessons([])
        setIsLoadingDbLessons(false)
        return
      }

      const mapped = (data ?? []).map((row) => ({
        id: String(row.id),
        topic: String(row.topic ?? ''),
        rule: String(row.rule ?? ''),
        youtubeUrl: String(row.youtube_url ?? ''),
        pdfUrl: (row.pdf_url as string | null) ?? null,
      }))
      setDbLessons(mapped)
      setIsLoadingDbLessons(false)
    }

    void loadDbLessons()
  }, [lessonsTable])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Mashqlar
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Ro‘yxatdan mavzuni tanlang — katta ekranda video chapda, mashqlar
          o‘ngda joylashgan.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {dbLessons.map((lesson) => {
          return (
            <li key={`db-${lesson.id}`}>
              <Link
                to={`/darslar/db-${lesson.id}`}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-400 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-cyan-500/40 dark:hover:shadow-lg dark:hover:shadow-cyan-500/5"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400/80">
                  {lesson.topic || 'Mavzu'}
                </span>
                <h2 className="font-display mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                  {lesson.topic || 'Yangi mashq'}
                </h2>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                  {lesson.rule || 'Qoida kiritilmagan'}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span />
                  <span className="font-medium text-cyan-600 dark:text-cyan-400">Mashqlarga o‘tish</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
      {!isLoadingDbLessons && dbLessons.length === 0 ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Hozircha mashqlar mavjud emas.
        </p>
      ) : null}
      {isLoadingDbLessons ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">Yuklanmoqda...</p>
      ) : null}
    </div>
  )
}
