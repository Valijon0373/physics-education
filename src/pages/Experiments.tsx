import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function Experiments() {
  type ExperimentItem = {
    id: string
    title: string
    goal: string
    description: string
    videoUrl: string
  }

  const [experiments, setExperiments] = useState<ExperimentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const experimentsTable = import.meta.env.VITE_SUPABASE_EXPERIMENTS_TABLE ?? 'experiments'

  const withYoutubeEmbedParams = (embedUrl: string) => {
    const url = embedUrl.trim()
    if (!url) return ''
    if (!url.includes('/embed/')) return url

    try {
      const u = new URL(url)
      // Reduce “More videos / related” overlays as much as YouTube allows.
      u.searchParams.set('rel', '0')
      u.searchParams.set('modestbranding', '1')
      u.searchParams.set('iv_load_policy', '3')
      u.searchParams.set('playsinline', '1')
      return u.toString()
    } catch {
      // If URL parsing fails, fall back to the original string.
      return url
    }
  }

  const toYoutubeEmbedUrl = (value: string) => {
    const raw = String(value ?? '').trim()
    if (!raw) return ''

    // If it's already an embed URL, keep it (but normalize domain).
    if (raw.includes('youtube.com/embed/') || raw.includes('youtube-nocookie.com/embed/')) {
      return withYoutubeEmbedParams(
        raw.replace('https://www.youtube.com/embed/', 'https://www.youtube-nocookie.com/embed/'),
      )
    }

    // If user stored only the video id.
    if (/^[a-zA-Z0-9_-]{6,}$/.test(raw)) {
      return withYoutubeEmbedParams(`https://www.youtube-nocookie.com/embed/${raw}`)
    }

    // youtu.be/<id>
    const short = raw.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{6,})/)
    if (short?.[1]) return withYoutubeEmbedParams(`https://www.youtube-nocookie.com/embed/${short[1]}`)

    // youtube.com/watch?v=<id>
    const watch = raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/)
    if (watch?.[1]) return withYoutubeEmbedParams(`https://www.youtube-nocookie.com/embed/${watch[1]}`)

    // youtube.com/shorts/<id>
    const shorts = raw.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/)
    if (shorts?.[1]) return withYoutubeEmbedParams(`https://www.youtube-nocookie.com/embed/${shorts[1]}`)

    // youtube.com/live/<id>
    const live = raw.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{6,})/)
    if (live?.[1]) return withYoutubeEmbedParams(`https://www.youtube-nocookie.com/embed/${live[1]}`)

    return raw
  }

  useEffect(() => {
    const loadExperiments = async () => {
      setError('')
      setIsLoading(true)

      const { data, error: loadError } = await supabase
        .from(experimentsTable)
        .select('id, title, goal, description, video_url')
        .order('created_at', { ascending: true })

      if (loadError) {
        setError(`Tajribalarni olishda xatolik: ${loadError.message}`)
        setExperiments([])
        setIsLoading(false)
        return
      }

      const mapped = (data ?? []).map((item) => ({
        id: String(item.id),
        title: String(item.title ?? ''),
        goal: String(item.goal ?? ''),
        description: String(item.description ?? ''),
        videoUrl: toYoutubeEmbedUrl(String(item.video_url ?? '')),
      }))

      setExperiments(mapped)
      setIsLoading(false)
    }

    void loadExperiments()
  }, [experimentsTable])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-center">
          <span className="font-display inline-flex rounded-2xl bg-white/90 px-5 py-2 text-3xl font-bold text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-950/55 dark:text-white dark:ring-white/10 sm:text-4xl">
            Tajribalar
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center">
          <span className="inline-flex rounded-2xl bg-white/85 px-4 py-2 text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-slate-950/45 dark:text-slate-200 dark:ring-white/10">
            Sinfdagi yoki uyda qilish mumkin bo‘lgan oddiy tajribalar — maqsad, materiallar va
            xavfsizlik eslatmalari bilan.
          </span>
        </p>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          Tajribalar yuklanmoqda...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      )}

      {!isLoading && !error && experiments.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          Hozircha tajribalar mavjud emas.
        </div>
      )}

      {!isLoading && !error && experiments.length > 0 && (
        <ul className="space-y-8">
        {experiments.map((exp) => (
          <li
            key={exp.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(340px,460px)] lg:items-stretch">
              <div className="flex h-full flex-col gap-4">
                <header>
                  <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
                    {exp.title}
                  </h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-300">
                      Maqsad:{' '}
                    </span>
                    {exp.goal}
                  </p>
                </header>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-xl shadow-black/10 dark:border-white/10 dark:shadow-black/50">
                  <div className="aspect-video w-full">
                    {exp.videoUrl ? (
                      <iframe
                        title={exp.title}
                        src={exp.videoUrl}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-slate-300">
                        Video havolasi topilmadi
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <aside className="h-full rounded-2xl border border-cyan-200 bg-slate-50 p-5 dark:border-cyan-500/20 dark:bg-slate-900/80">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Qisqacha
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {exp.description?.trim() ? exp.description : "Hozircha qisqacha ma'lumot kiritilmagan."}
                </p>
              </aside>
            </div>
          </li>
        ))}
        </ul>
      )}
    </div>
  )
}
