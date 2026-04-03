import { PhotoGalleryCoverflow } from '../components/PhotoGalleryCoverflow'
import { galleryItems } from '../data/content'

export function Gallery() {
  return (
    <div className="space-y-6 pt-8 sm:pt-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Fotogaleriya
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Pastdagi galereyada suratlarni siljiting yoki nuqtalar orqali tanlang.
          Rasmlarni `content.ts` faylida o‘zingiznikiga almashtiring.
        </p>
      </div>

      <PhotoGalleryCoverflow items={galleryItems} />
    </div>
  )
}
