import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import bgVideo from '../assets/bg.mp4'
import bgPoster from '../assets/bg/bg.svg'
import { PageLoader } from './PageLoader'
import { ThemeToggle } from './ThemeToggle'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white',
  ].join(' ')

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'block w-full rounded-xl px-4 py-3 text-base font-medium transition-colors',
    isActive
      ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
  ].join(' ')

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [menuOpen])

  return (
    <div className="relative flex min-h-svh flex-col font-sans">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <video
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          src={bgVideo}
          poster={bgPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="absolute inset-0 bg-slate-50/52 dark:bg-slate-950/62" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="shrink-0 font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            Fizika<span className="text-cyan-600 dark:text-cyan-400">Lab</span>
          </Link>

          <div className="hidden flex-wrap items-center gap-2 md:flex">
            <nav className="flex flex-wrap items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Bosh sahifa
              </NavLink>
              <NavLink to="/darslar" className={navLinkClass}>
                Mashqlar
              </NavLink>
              <NavLink to="/tajribalar" className={navLinkClass}>
                Tajribalar
              </NavLink>
              <NavLink to="/qollanmalar" className={navLinkClass}>
                Qo'llanmalar
              </NavLink>
            </nav>
            <ThemeToggle />
          </div>

          <button
            type="button"
            className="relative z-[170] inline-flex shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
          >
            {menuOpen ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <div
        className={[
          'fixed inset-0 z-[150] bg-slate-900/45 backdrop-blur-[2px] transition-opacity duration-700 ease-in-out md:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <aside
        id="mobile-menu"
        className={[
          'fixed inset-y-0 right-0 z-[160] flex w-[min(88vw,300px)] flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-700 ease-in-out dark:border-white/10 dark:bg-slate-950 md:hidden',
          menuOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        ].join(' ')}
        aria-hidden={!menuOpen}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-white/10">
          <span className="text-lg font-semibold text-slate-900 dark:text-white">Menu</span>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={() => setMenuOpen(false)}
            aria-label="Menyuni yopish"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
            Bosh sahifa
          </NavLink>
          <NavLink to="/darslar" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
            Mashqlar
          </NavLink>
          <NavLink
            to="/tajribalar"
            className={mobileNavLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Tajribalar
          </NavLink>
          <NavLink
            to="/qollanmalar"
            className={mobileNavLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Qo'llanmalar
          </NavLink>

          <div className="mt-3 border-t border-slate-200 pt-4 dark:border-white/10">
            <ThemeToggle variant="mobile-row" />
          </div>
        </div>
      </aside>

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Suspense key={location.pathname} fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-white/10">
        <p>Mexanika fizikasi — ta'lim loyihasi</p>
      </footer>
    </div>
  )
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function IconX({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
