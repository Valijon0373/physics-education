import { experiments } from '../data/content'

export function Experiments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Tajribalar
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Sinfdagi yoki uyda qilish mumkin bo‘lgan oddiy tajribalar — maqsad,
          materiallar va xavfsizlik eslatmalari bilan.
        </p>
      </div>

      <ul className="space-y-6">
        {experiments.map((exp) => (
          <li
            key={exp.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-8"
          >
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
              {exp.title}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-800 dark:text-slate-300">
                Maqsad:{' '}
              </span>
              {exp.goal}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90">
                  Materiallar
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {exp.materials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90">
                  Bosqichlar
                </h3>
                <ol className="mt-2 list-inside list-decimal space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {exp.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            {exp.safety && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/5 dark:text-amber-200/90">
                <span className="font-semibold">Xavfsizlik: </span>
                {exp.safety}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
