import { Link } from 'react-router-dom'
import { lessons } from '../data/content'

export function Lessons() {
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
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              to={`/darslar/${lesson.id}`}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-400 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-cyan-500/40 dark:hover:shadow-lg dark:hover:shadow-cyan-500/5"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-cyan-600 dark:text-cyan-400/80">
                {lesson.topic}
              </span>
              <h2 className="font-display mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {lesson.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                {lesson.description}
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-500">
                  ~{lesson.durationMin} daqiqa
                </span>
                <span className="font-medium text-cyan-600 dark:text-cyan-400">
                  Mashqlarga o‘tish
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
