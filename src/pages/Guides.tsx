import { guides } from '../data/content'

export function Guides() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Qo'llanmalar
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Qisqa qo‘llanmalar ro‘yxati. Haqiqiy PDF fayllarni `public/`
          papkasiga qo‘yib, `content.ts` dagi havolarni yangilang.
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
              disabled={!g.fileUrl}
              className="shrink-0 rounded-xl border border-slate-300 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-800 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:bg-white/5 dark:text-white dark:enabled:hover:bg-white/10"
              title={
                g.fileUrl
                  ? 'Yuklab olish'
                  : "PDF hali ulangan emas — content.ts da fileUrl qo'shing"
              }
            >
              {g.fileUrl ? 'Yuklab olish' : 'Tez orada'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
