import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function readTheme(): Theme {
  try {
    const t = localStorage.getItem('theme')
    if (t === 'dark' || t === 'light') return t
  } catch {
    /* ignore */
  }
  return 'light'
}

type ThemeToggleProps = {
  /** Mobil menyu: «Tungi» [switch] «rejim» qatori */
  variant?: 'button' | 'mobile-row'
  /** Mobil header: ixchamroq switch va yozuv */
  compact?: boolean
}

export function ThemeToggle({ variant = 'button', compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(readTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const isDark = theme === 'dark'

  if (variant === 'mobile-row') {
    const rowGap = compact ? 'gap-1.5 px-0 py-0' : 'gap-3 px-4 py-1'
    const labelClass = compact
      ? 'select-none text-xs font-medium text-slate-800 dark:text-slate-100'
      : 'select-none text-base font-medium leading-none text-slate-800 dark:text-slate-100'
    const trackClass = compact ? 'h-[26px] w-[46px]' : 'h-8 w-[52px]'
    const thumbSize = compact ? 'h-[22px] w-[22px]' : 'h-[26px] w-[26px]'
    const thumbOffset = compact ? 'left-[2px] top-[2px]' : 'left-[3px] top-[3px]'
    const thumbTranslate = isDark ? 'translate-x-5' : 'translate-x-0'

    return (
      <div className={['flex items-center', rowGap].join(' ')}>
        <span className={labelClass}>Tungi rejim</span>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? 'Kun rejimiga o‘tish' : 'Tungi rejimga o‘tish'}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={[
            'relative inline-flex shrink-0 items-center rounded-full border border-slate-500/10 transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 dark:border-white/10',
            trackClass,
            isDark
              ? 'bg-cyan-600 shadow-inner shadow-cyan-900/20'
              : 'bg-[#b8c4ce] dark:bg-slate-600',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none absolute block rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.18)] ring-0 transition-transform duration-200 ease-out',
              thumbSize,
              thumbOffset,
              thumbTranslate,
            ].join(' ')}
          />
        </button>
     
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label={isDark ? 'Kun rejimiga o‘tish' : 'Tungi rejimga o‘tish'}
      title={isDark ? 'Kun rejimi' : 'Tungi rejim'}
    >
      {isDark ? (
        <MoonIcon className="h-4 w-4 text-cyan-400" />
      ) : (
        <SunIcon className="h-4 w-4 text-amber-500" />
      )}
      <span className="hidden sm:inline">{isDark ? 'Tun' : 'Kun'}</span>
    </button>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
