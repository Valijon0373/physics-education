import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PhotoGalleryCoverflow } from '../components/PhotoGalleryCoverflow'
import type { GalleryItem } from '../data/content'
import { supabase } from '../lib/supabase'

/** Qo‘ying: `public/hero-banner.png` (talabalar / ochiq havoda o‘qish fon rasmi). */
const HERO_BG = '/hero-banner.png'

function isGalleryStorageObject(name: string) {
  return Boolean(name) && name !== '.emptyFolderPlaceholder'
}

export function Home() {
  const [showDetails, setShowDetails] = useState(false)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const galleryBucket = import.meta.env.VITE_SUPABASE_GALLERY_BUCKET ?? 'gallery'

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.storage
        .from(galleryBucket)
        .list('admin-gallery', { limit: 100, sortBy: { column: 'name', order: 'desc' } })

      if (error) {
        setGalleryItems([])
        return
      }

      const loadedItems = (data ?? [])
        .filter((file) => isGalleryStorageObject(file.name))
        .map((file, index) => {
          const storagePath = `admin-gallery/${file.name}`
          const { data: publicUrlData } = supabase.storage.from(galleryBucket).getPublicUrl(storagePath)
          return {
            id: file.id ?? `${storagePath}-${index}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            caption: "Supabase Storage orqali qo'shilgan rasm",
            imageUrl: publicUrlData.publicUrl,
          } satisfies GalleryItem
        })

      setGalleryItems(loadedItems)
    }

    void load()
  }, [])

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
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-md bg-cyan-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:focus-visible:outline-cyan-400"
            >
              {showDetails ? 'Yopish' : "Ba'tafsil…"}
            </button>
            <Link
              to="/muallif"
              className="inline-flex items-center justify-center rounded-md border-2 border-white/90 bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Muallif
            </Link>
          </div>

          {showDetails && (
            <div className="mt-6 max-w-4xl rounded-2xl bg-white/90 p-5 text-left text-slate-800 shadow-lg ring-1 ring-white/70 backdrop-blur-sm dark:bg-slate-900/85 dark:text-slate-200 dark:ring-white/10 sm:p-6">
              <p className="leading-relaxed">
                Ushbu sayt 7-sinf fizika kursining mexanika bo‘limi bo‘yicha bilimlarni
                mustahkamlash va rivojlantirish maqsadida yaratilgan. Saytimizda o‘quvchilar
                uchun sodda va tushunarli tarzda tuzilgan masalalar, qiziqarli tajribalar hamda
                ularning batafsil tushuntirishlari jamlangan.
              </p>
              <p className="mt-3 leading-relaxed">
                Asosiy e’tibor nazariy bilimni amaliyot bilan bog‘lashga qaratilgan. Har bir
                mavzu bo‘yicha berilgan masalalar osondan murakkabga qarab tartiblangan bo‘lib,
                o‘quvchilarning mustaqil fikrlashini rivojlantirishga xizmat qiladi.
              </p>
              <p className="mt-3 leading-relaxed">
                Shuningdek, saytimizda uy sharoitida bajarish mumkin bo‘lgan oddiy va xavfsiz
                tajribalar orqali fizika faniga bo‘lgan qiziqishni oshirish ko‘zda tutilgan.
              </p>

              <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                🎯 Saytning maqsadi:
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
                <li>O‘quvchilarga mexanika mavzularini chuqur o‘rgatish</li>
                <li>Masala yechish ko‘nikmalarini shakllantirish</li>
                <li>Tajribalar orqali bilimlarni mustahkamlash</li>
                <li>Fizikani qiziqarli va tushunarli qilish</li>
              </ul>

              <h2 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
                🔬 Saytda siz quyidagilarni topasiz:
              </h2>
              <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed">
                <li>🧮 Har bir mavzu bo‘yicha masalalar to‘plami</li>
                <li>📊 Bosqichma-bosqich yechimlar</li>
                <li>🧪 Qiziqarli va oddiy tajribalar</li>
                <li>📘 Nazariy tushuntirishlar</li>
              </ul>

              <p className="mt-4 leading-relaxed">
                Bizning maqsadimiz — fizika fanini o‘rganishni oson, samarali va qiziqarli
                qilishdir.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="bolimlar">
        <h2 className="mb-8 text-center">
          <span className="font-display inline-flex rounded-2xl bg-white/90 px-5 py-2 text-2xl font-semibold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-950/55 dark:text-white dark:ring-white/10">
            O'quv dasturlari
          </span>
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              to: '/darslar',
              title: 'Video + mashqlar',
              desc: "Har bir mavzuga oid video va mashqlar jamlangan bo'lim.",
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
              to: '/topshiriqlar',
              title: 'Topshiriqlar',
              desc: "Krasvord va so'z-topish topshiriqlari mavjud bo'lim.",
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
