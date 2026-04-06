import { Link } from 'react-router-dom'
import { PhotoGalleryCoverflow } from '../components/PhotoGalleryCoverflow'
import { galleryItems } from '../data/content'

/** Qo‘ying: `public/hero-banner.png` (talabalar / ochiq havoda o‘qish fon rasmi). */
const HERO_BG = '/hero-banner.png'

export function Home() {
  return (
    <div className="space-y-16">
      <section
        className="relative overflow-hidden rounded-3xl border border-white/15 shadow-md dark:border-white/10"
        aria-labelledby="home-hero-heading"
      >
        <div
          className="absolute inset-0 bg-slate-900/25 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(20, 30, 48, 0.28), rgba(20, 30, 48, 0.28)), url(${HERO_BG})`,
          }}
          role="img"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-[min(70vh,32rem)] flex-col items-center justify-center px-5 py-16 text-center sm:min-h-[min(75vh,36rem)] sm:px-8">
          <h1
            id="home-hero-heading"
            className="font-display max-w-4xl text-2xl font-bold uppercase leading-snug tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] sm:text-3xl md:text-4xl lg:text-[2.65rem] lg:leading-tight"
          >
            <span className="text-cyan-600 dark:text-cyan-400">7-sinf</span>{' '}
            <span className="text-white">Fizikada Mexanika</span>
            <br />
            <span className="text-white">O&apos;qitish</span>
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/darslar"
              className="inline-flex items-center justify-center rounded-md bg-cyan-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus-visible:outline-cyan-400"
            >
              Ba&apos;tafsil…
            </Link>
            <Link
              to="/muallif"
              className="inline-flex items-center justify-center rounded-md border-2 border-white/90 bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Muallif
            </Link>
          </div>
        </div>
      </section>

      <section id="bolimlar">
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
              href: 'https://thephysicsaviary.com/uz/',
              title: 'Virtual laboratoriya',
              desc: 'The Physics Aviary — onlayn fizika simulyatsiyalari va virtual tajribalar.',
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
          ].map((card) => {
            const key = 'href' in card ? card.href : card.to
            const className =
              'group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/50 dark:hover:border-cyan-500/30 dark:hover:bg-slate-900'
            const inner = (
              <>
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
                  {'href' in card ? 'Bajarish' : 'Ko‘rish →'}
                </span>
              </>
            )
            return (
              <li key={key}>
                {'href' in card ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link to={card.to} className={className}>
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <PhotoGalleryCoverflow items={galleryItems} />
    </div>
  )
}
