import { experiments } from '../data/content'

export function Experiments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-center text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Tajribalar
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Sinfdagi yoki uyda qilish mumkin bo‘lgan oddiy tajribalar — maqsad,
          materiallar va xavfsizlik eslatmalari bilan.
        </p>
      </div>

      <ul className="space-y-8">
        {experiments.map((exp) => (
          <li
            key={exp.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(340px,460px)] lg:items-stretch">
              <div className="flex h-full flex-col gap-4">
                <header>
                  <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
                    {exp.title}
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-300">
                      Maqsad:{' '}
                    </span>
                    {exp.goal}
                  </p>
                  <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
                    {exp.description}
                  </p>
                </header>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl shadow-black/10 dark:border-white/10 dark:shadow-black/50">
                  <div className="aspect-video w-full">
                    <iframe
                      title={exp.title}
                      src={exp.videoEmbedUrl}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>

              <aside className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-cyan-200 bg-slate-50 p-1 dark:border-cyan-500/20 dark:bg-slate-900/80">
                  <div className="rounded-xl bg-white px-4 py-3 dark:bg-slate-950/50">
                    <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                      Opisaniya (yo‘riqnoma)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Materiallar, bosqichlar, kuzatuvlar va kutiladigan natija.
                    </p>
                  </div>
                  <div className="flex-1 space-y-5 overflow-y-auto p-4">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90">
                        Materiallar
                      </h4>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                        {exp.materials.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90">
                        Bosqichlar
                      </h4>
                      <ol className="mt-2 list-inside list-decimal space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {exp.steps.map((s, i) => (
                          <li key={`${exp.id}-step-${i}`}>{s}</li>
                        ))}
                      </ol>
                    </div>

                    {exp.observations && exp.observations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400/90">
                          Kuzatuvlar
                        </h4>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700 dark:text-slate-300">
                          {exp.observations.map((o, i) => (
                            <li key={`${exp.id}-obs-${i}`}>{o}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.expectedResult && (
                      <div className="rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-200/90">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Kutiladigan natija:{' '}
                        </span>
                        {exp.expectedResult}
                      </div>
                    )}

                    {exp.safety && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/25 dark:bg-amber-500/5 dark:text-amber-200/90">
                        <span className="font-semibold">Xavfsizlik: </span>
                        {exp.safety}
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
