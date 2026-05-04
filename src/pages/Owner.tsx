import ownerPhoto from '../assets/owner.jpg'

const socialLinks = [
  {
    label: 'Telegram',
    href: 'https://t.me/HilolaSalayevaa',
    className:
      'bg-gradient-to-br from-sky-100 to-cyan-50 text-[#229ED9] shadow-sm shadow-sky-200/60 hover:shadow-md dark:from-sky-950/40 dark:to-slate-800 dark:text-sky-300',
    icon: IconTelegram,
  },
  {
    label: 'Instagram',
    href: '#',
    className:
      'bg-gradient-to-br from-pink-100 via-amber-50 to-white text-pink-600 shadow-sm shadow-pink-200/50 hover:shadow-md dark:from-pink-950/35 dark:to-slate-800 dark:text-pink-400',
    icon: IconInstagram,
  },
  {
    label: 'Facebook',
    href: '#',
    className:
      'bg-gradient-to-br from-sky-100 to-white text-[#1877F2] shadow-sm shadow-sky-200/60 hover:shadow-md dark:from-sky-950/40 dark:to-slate-800 dark:text-sky-400',
    icon: IconFacebook,
  },
  {
    label: 'LinkedIn',
    href: '#',
    className:
      'bg-gradient-to-br from-slate-100 to-sky-50 text-[#0A66C2] shadow-sm shadow-slate-200/60 hover:shadow-md dark:from-slate-800 dark:to-slate-900 dark:text-sky-300',
    icon: IconLinkedIn,
  },
] as const

export function Owner() {
  return (
    <div className="pt-6 sm:pt-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
        <div className="flex shrink-0 justify-start lg:w-28 xl:w-32">
          <h1
            id="owner-page-title"
            className="font-display text-3xl font-bold tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)] dark:text-white sm:text-4xl lg:pt-2 lg:text-5xl lg:leading-none xl:text-6xl lg:[writing-mode:vertical-rl]"
          >
            Muallif
          </h1>
        </div>

        <article
          className="min-w-0 flex-1 overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 dark:bg-slate-900 dark:shadow-black/40 dark:ring-white/10 sm:p-8"
          aria-labelledby="owner-page-title"
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-10">
            <div className="min-w-0 flex-1 text-left">
              <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Salayeva Hilola Shuhrat qizi 2001-yil 7-aprelda Xorazm viloyati Xiva tumani
                Polosulton mahallasida tug‘ilgan.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                2019-2023-yillarda Urganch davlat universitetining Fizika yo‘nalishida tahsil
                olgan. Hozirda Urganch davlat pedagogika institutining magistratura bosqichi
                2-kurs talabasi hisoblanadi.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                2021-yilda 8-sonli umumiy o‘rta ta’lim maktabida fizika o‘qituvchisi sifatida
                faoliyat yuritgan. 2022-yildan boshlab 22-sonli umumiy o‘rta ta’lim maktabida
                fizika o‘qituvchisi lavozimida ishlab kelmoqda.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                Bugungi kunga qadar ilmiy jurnal va to‘plamlarda 8 ta ilmiy maqolalari chop
                etilgan. Hozirda “Mexanika bo‘limidan amaliy va tajriba mashg‘ulotlarini olib borishda va
                to‘g‘ri tashkil qilishda innovatsion pedagogik texnologiyalardan foydalanish
                metodikasi” mavzusida ilmiy izlanish olib bormoqda.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                ijtimoiy tarmoqlar orqali kuzatishingiz mumkin!
              </p>
            </div>

            <div className="mx-auto w-full max-w-[300px] shrink-0 text-center sm:max-w-[320px] lg:mx-0 lg:max-w-[280px]">
              <div className="overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={ownerPhoto}
                  alt="Salayeva Hilola Shuhrat qizi"
                  className="aspect-[4/5] w-full object-cover"
                  width={400}
                  height={500}
                  loading="lazy"
                />
              </div>
              <h2
                id="owner-card-name"
                className="mt-5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                Salayeva Hilola Shuhrat qizi
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Magistratura Talabasi, Fizika fani o&apos;qituvchisi
              </p>
              <hr className="mx-auto mt-5 w-[85%] border-0 border-t border-slate-200 dark:border-white/10" />
              <div className="mt-5 flex items-center justify-center gap-3">
                {socialLinks.map(({ label, href, className, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    {...(href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' as const }
                      : {})}
                    aria-label={label}
                    className={[
                      'inline-flex size-11 items-center justify-center rounded-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500',
                      className,
                    ].join(' ')}
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

function IconTelegram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
