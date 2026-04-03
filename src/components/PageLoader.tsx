import { Atom } from 'react-loading-indicators'

/** Sahifa yuklanayotganda — boshqa sahifaga o‘tishda */
export function PageLoader() {
  return (
    <div
      className="flex min-h-[min(60vh,560px)] w-full flex-col items-center justify-center gap-4 py-16"
      aria-busy
      aria-label="Yuklanmoqda"
    >
      <Atom color="#316dcc" size="large" />
    </div>
  )
}
