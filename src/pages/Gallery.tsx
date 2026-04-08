import { useEffect, useState } from 'react'
import { PhotoGalleryCoverflow } from '../components/PhotoGalleryCoverflow'
import type { GalleryItem } from '../data/content'
import { supabase } from '../lib/supabase'

function isGalleryStorageObject(name: string) {
  return Boolean(name) && name !== '.emptyFolderPlaceholder'
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loadError, setLoadError] = useState('')
  const galleryBucket = import.meta.env.VITE_SUPABASE_GALLERY_BUCKET ?? 'gallery'

  useEffect(() => {
    const load = async () => {
      setLoadError('')
      const { data, error } = await supabase.storage
        .from(galleryBucket)
        .list('admin-gallery', { limit: 100, sortBy: { column: 'name', order: 'desc' } })

      if (error) {
        setLoadError(error.message)
        setItems([])
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

      setItems(loadedItems)
    }

    void load()
  }, [])

  return (
    <div className="space-y-6 pt-8 sm:pt-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Fotogaleriya
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Pastdagi galereyada admin panel orqali qo‘shilgan rasmlar ko‘rinadi.
        </p>
      </div>

      {loadError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100">
          Galereyani yuklashda xatolik: {loadError}. Supabase’da Storage → bucket «{galleryBucket}» uchun
          ro‘yxatni o‘qish (list) ruxsatini tekshiring; rasmlar ochilmasa bucket <strong>public</strong>
          bo‘lishi yoki fayllarga umumiy o‘qish siyosati qo‘shilishi kerak.
        </p>
      ) : null}

      <PhotoGalleryCoverflow items={items} />
    </div>
  )
}
