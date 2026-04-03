import { Link, useParams } from 'react-router-dom'
import { getLessonById } from '../data/content'
import { ExerciseCard } from '../components/ExerciseCard'

export function LessonDetail() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = lessonId ? getLessonById(lessonId) : undefined

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
        <p className="mt-2 text-sm text-slate-500">
          Taxminiy davomiylik: {lesson.durationMin} daqiqa
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(300px,380px)] lg:items-start">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl shadow-black/10 dark:border-white/10 dark:shadow-black/50">
            <div className="aspect-video w-full">
              <iframe
                title={lesson.title}
                src={lesson.videoEmbedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Video manbasi: tashqi platforma (YouTube). O‘z kontentingiz uchun
            embed havolani `content.ts` faylida almashtiring.
          </p>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-cyan-200 bg-slate-50 p-1 dark:border-cyan-500/20 dark:bg-slate-900/80">
            <div className="rounded-xl bg-white px-4 py-3 dark:bg-slate-950/50">
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                Mashqlar
              </h2>
              <p className="text-xs text-slate-500">
                Videoni ko‘rib, savollarni yeching.
              </p>
            </div>
            <div className="max-h-[min(70vh,640px)] space-y-3 overflow-y-auto p-3">
              {lesson.exercises.map((ex, i) => (
                <ExerciseCard key={ex.id} exercise={ex} index={i} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
