import { Link } from 'react-router-dom'
import { PhotoGalleryCoverflow } from '../components/PhotoGalleryCoverflow'
import { galleryItems } from '../data/content'

export function Home() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-cyan-50/50 px-6 py-16 shadow-sm dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/40 dark:shadow-none">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/20" />
        <div className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/15" />
        <div className="relative max-w-2xl space-y-6">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-600 dark:text-cyan-400/90">
            Fizika · Mexanika
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Video darslar, mashqlar va tajribalar — bitta joyda
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            O‘quvchilar darsni ko‘rib, yonida zudlik bilan mashq qiladi;
            fotogaleriya va qo‘llanmalar bilan sinf yoki masofaviy ta‘limni
            boyitishingiz mumkin.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/darslar"
              className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-600 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Darslarni ochish
            </Link>
            <Link
              to="/tajribalar"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Tajribalar
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
          Bo‘limlar
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              to: '/darslar',
              title: 'Video + mashqlar',
              desc: "Har bir mavzu uchun embed video va yon panelda testlar.",
              accent: 'from-cyan-500/20 to-transparent',
            },
            {
              to: '/galereya',
              title: 'Fotogaleriya',
              desc: "Laboratoriya va darsdan kadrlar — Coverflow ko‘rinishida.",
              accent: 'from-violet-500/20 to-transparent',
            },
            {
              to: '/tajribalar',
              title: 'Tajribalar',
              desc: "Maqsad, materiallar va bosqichma-bosqich ko‘rsatmalar.",
              accent: 'from-amber-500/15 to-transparent',
            },
            {
              to: '/qollanmalar',
              title: "Qo'llanmalar",
              desc: "Formulalar, namunaviy hisobotlar — yuklab olish uchun.",
              accent: 'from-emerald-500/15 to-transparent',
            },
          ].map((card) => (
            <li key={card.to}>
              <Link
                to={card.to}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-cyan-500/30 dark:hover:bg-slate-900"
              >
                <div
                  className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${card.accent}`}
                />
                <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                  {card.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                  {card.desc}
                </p>
                <span className="mt-4 text-sm font-medium text-cyan-600 dark:text-cyan-400/90">
                  Ko‘rish →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <PhotoGalleryCoverflow items={galleryItems} />
    </div>
  )
}
