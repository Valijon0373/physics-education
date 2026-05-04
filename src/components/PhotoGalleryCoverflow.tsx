import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type { GalleryItem } from '../data/content'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

import './PhotoGalleryCoverflow.css'

type Props = {
  items: GalleryItem[]
}

export function PhotoGalleryCoverflow({ items }: Props) {
  if (items.length === 0) return null

  return (
    <div className="photo-gallery-coverflow rounded-2xl bg-[#f0f2f5] px-3 py-8 shadow-inner dark:bg-slate-900/80 sm:px-6 sm:py-10">
      <h2 className="mb-6 text-center font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl">
        — Foto galereya —
      </h2>

      <Swiper
        modules={[Autoplay, EffectCoverflow, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        initialSlide={Math.min(3, Math.max(0, items.length - 1))}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 42,
          stretch: 0,
          depth: 160,
          modifier: 1,
          slideShadows: true,
        }}
        className="photo-gallery-swiper !pb-12"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className="!w-[min(70vw,320px)]">
            <div className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
