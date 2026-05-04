import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

type DbGuide = {
  id: string
  name: string
  pdfUrl: string | null
}

export function Guides() {
  const [guides, setGuides] = useState<DbGuide[]>([])
  const guidesTable = import.meta.env.VITE_SUPABASE_GUIDES_TABLE ?? 'guides'

  useEffect(() => {
    const loadGuides = async () => {
      const { data, error } = await supabase
        .from(guidesTable)
        .select('id, name, pdf_url')
        .order('created_at', { ascending: false })
      if (error) return
      setGuides(
        (data ?? []).map((row) => ({
          id: String(row.id),
          name: String(row.name ?? ''),
          pdfUrl: (row.pdf_url as string | null) ?? null,
        })),
      )
    }
    void loadGuides()
  }, [guidesTable])
  const shelfRows = useMemo(() => {
    const size = 5
    const rows: DbGuide[][] = []
    for (let i = 0; i < guides.length; i += size) rows.push(guides.slice(i, i + size))
    return rows
  }, [guides])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-center">
          <span className="font-display inline-flex rounded-2xl bg-white/90 px-5 py-2 text-3xl font-bold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-950/55 dark:text-white dark:ring-white/10 sm:text-4xl">
            Qo'llanmalar
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center">
          <span className="inline-flex rounded-2xl bg-white/85 px-4 py-2 text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-950/45 dark:text-slate-200 dark:ring-white/10">
            Qo'llanmalarni ochib ko‘ring va kerakli bilimlarga ega bo'ling.
          </span>
        </p>
      </div>

      {guides.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400">
          Hozircha qo'llanmalar yo‘q. Admin panel orqali qo‘shing.
        </div>
      ) : (
        <div className="space-y-8">
          {shelfRows.map((row, rowIndex) => (
            <section key={`shelf-${rowIndex}`} className="relative pb-5">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {row.map((guide, index) => (
                  <article
                    key={guide.id}
                    className="relative mx-auto w-full max-w-[180px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-md dark:border-white/10 dark:bg-slate-900"
                  >
                    <div
                      className={[
                        'h-12',
                        index % 5 === 0
                          ? 'bg-gradient-to-r from-red-500 to-rose-400'
                          : index % 5 === 1
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            : index % 5 === 2
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : index % 5 === 3
                                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-400',
                      ].join(' ')}
                    />
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white">
                        {guide.name || `Qo'llanma-${rowIndex * 5 + index + 1}`}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                        Qo'llanma
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          if (guide.pdfUrl) window.open(guide.pdfUrl, '_blank', 'noopener,noreferrer')
                        }}
                        className="mt-3 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 transition hover:bg-slate-100 dark:border-white/15 dark:text-slate-100 dark:hover:bg-white/10"
                      >
                        Ochish
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-3 rounded-md bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 shadow-[0_10px_20px_rgba(0,0,0,0.25)]" />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
