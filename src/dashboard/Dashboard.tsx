import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import {
  Book,
  BookOpen,
  CheckCircle2,
  Eye,
  FlaskConical,
  Image,
  LayoutDashboard,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'
import type { GalleryItem } from '../data/content'
import { supabase } from '../lib/supabase'
import { deleteTaskRow, eqCandidatesForTaskId } from '../lib/taskSupabase'
import { ADMIN_AUTH_KEY } from './auth'

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function AdminDashboard() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('Dashboard')
  type TaskType = 'krasvord' | "soz-topshirigi"
  type TaskListItem = {
    id: string
    title: string
    type: TaskType
    questions: string | null
    imageUrl: string | null
  }
  type ExperimentItem = {
    id: string
    title: string
    goal: string
    description: string
    videoUrl: string
  }
  type LessonAdminItem = {
    id: string
    topic: string
    rule: string
    youtubeUrl: string
    pdfUrl: string | null
  }
  type GuideAdminItem = {
    id: string
    name: string
    pdfUrl: string | null
  }
  type AdminGalleryItem = GalleryItem & { storagePath?: string }
  const [adminGalleryItems, setAdminGalleryItems] = useState<AdminGalleryItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskType, setTaskType] = useState<TaskType>('krasvord')
  const [taskQuestions, setTaskQuestions] = useState('')
  const [taskImage, setTaskImage] = useState<File | null>(null)
  const [taskItems, setTaskItems] = useState<TaskListItem[]>([])
  const [lessonItems, setLessonItems] = useState<LessonAdminItem[]>([])
  const [isLessonsLoading, setIsLessonsLoading] = useState(false)
  const [lessonError, setLessonError] = useState('')
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [isLessonSaving, setIsLessonSaving] = useState(false)
  const [lessonTopic, setLessonTopic] = useState('')
  const [lessonRule, setLessonRule] = useState('')
  const [lessonYoutubeLink, setLessonYoutubeLink] = useState('')
  const [lessonPdf, setLessonPdf] = useState<File | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [previewLesson, setPreviewLesson] = useState<LessonAdminItem | null>(null)
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState<LessonAdminItem | null>(null)
  const [guideItems, setGuideItems] = useState<GuideAdminItem[]>([])
  const [isGuidesLoading, setIsGuidesLoading] = useState(false)
  const [guideError, setGuideError] = useState('')
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false)
  const [isGuideSaving, setIsGuideSaving] = useState(false)
  const [guideName, setGuideName] = useState('')
  const [guidePdf, setGuidePdf] = useState<File | null>(null)
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null)
  const [confirmDeleteGuide, setConfirmDeleteGuide] = useState<GuideAdminItem | null>(null)
  const [experimentItems, setExperimentItems] = useState<ExperimentItem[]>([])
  const [isExperimentsLoading, setIsExperimentsLoading] = useState(false)
  const [experimentError, setExperimentError] = useState('')
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false)
  const [isExperimentSaving, setIsExperimentSaving] = useState(false)
  const [experimentTitle, setExperimentTitle] = useState('')
  const [experimentGoal, setExperimentGoal] = useState('')
  const [experimentDescription, setExperimentDescription] = useState('')
  const [experimentYoutubeLink, setExperimentYoutubeLink] = useState('')
  const [editingExperimentId, setEditingExperimentId] = useState<string | null>(null)
  const [previewExperiment, setPreviewExperiment] = useState<ExperimentItem | null>(null)
  const [confirmDeleteExperiment, setConfirmDeleteExperiment] = useState<ExperimentItem | null>(null)
  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [isTaskSaving, setIsTaskSaving] = useState(false)
  const [taskError, setTaskError] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [confirmDeleteTask, setConfirmDeleteTask] = useState<TaskListItem | null>(null)
  const [selectedUploadFiles, setSelectedUploadFiles] = useState<File[]>([])
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<AdminGalleryItem | null>(null)
  const [taskSuccess, setTaskSuccess] = useState<{
    message: string
    kind: 'created' | 'updated' | 'deleted'
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryBucket = import.meta.env.VITE_SUPABASE_GALLERY_BUCKET ?? 'gallery'
  const tasksTable = import.meta.env.VITE_SUPABASE_TASKS_TABLE ?? 'tasks'
  const experimentsTable = import.meta.env.VITE_SUPABASE_EXPERIMENTS_TABLE ?? 'experiments'
  const lessonsTable = import.meta.env.VITE_SUPABASE_LESSONS_TABLE ?? 'lessons'
  const lessonsBucket = import.meta.env.VITE_SUPABASE_LESSONS_BUCKET ?? galleryBucket
  const guidesTable = import.meta.env.VITE_SUPABASE_GUIDES_TABLE ?? 'guides'
  const guidesBucket = import.meta.env.VITE_SUPABASE_GUIDES_BUCKET ?? galleryBucket

  const toYoutubeEmbedUrl = (value: string) => {
    const raw = value.trim()
    if (!raw) return ''
    if (raw.includes('youtube.com/embed/')) return raw
    const short = raw.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{6,})/)
    if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`
    const watch = raw.match(/[?&]v=([a-zA-Z0-9_-]{6,})/)
    if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`
    return raw
  }

  const loadGalleryFromStorage = async () => {
    const { data, error } = await supabase.storage
      .from(galleryBucket)
      .list('admin-gallery', { limit: 100, sortBy: { column: 'name', order: 'desc' } })

    if (error) {
      setUploadError(`Rasmlarni olishda xatolik: ${error.message}`)
      return
    }

    const loadedItems = (data ?? [])
      .filter((file) => Boolean(file.name))
      .map((file) => {
        const storagePath = `admin-gallery/${file.name}`
        const { data: publicUrlData } = supabase.storage.from(galleryBucket).getPublicUrl(storagePath)
        const title = file.name.replace(/\.[^/.]+$/, '')

        return {
          id: file.id ?? storagePath,
          title,
          caption: "Supabase Storage orqali qo'shilgan rasm",
          imageUrl: publicUrlData.publicUrl,
          storagePath,
        } satisfies AdminGalleryItem
      })

    setAdminGalleryItems(loadedItems)
  }

  useEffect(() => {
    void loadGalleryFromStorage()
  }, [])

  const loadTasks = async (silent = false) => {
    if (!silent) {
      setTaskError('')
      setIsTasksLoading(true)
    }

    const { data, error } = await supabase
      .from(tasksTable)
      .select('id, title, type, questions, image_url')
      .order('created_at', { ascending: false })

    if (error) {
      setTaskError(`Topshiriqlarni olishda xatolik: ${error.message}`)
      if (!silent) setIsTasksLoading(false)
      return
    }

    const seen = new Set<string>()
    const mappedItems = (data ?? [])
      .map((item) => ({
        id: String(item.id),
        title: item.title as string,
        type: item.type as TaskType,
        questions: (item.questions as string | null) ?? null,
        imageUrl: (item.image_url as string | null) ?? null,
      }))
      .filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })

    setTaskItems(mappedItems)
    if (!silent) setIsTasksLoading(false)
  }

  useEffect(() => {
    void loadTasks()
  }, [])

  const loadLessons = async (silent = false) => {
    if (!silent) {
      setLessonError('')
      setIsLessonsLoading(true)
    }

    const { data, error } = await supabase
      .from(lessonsTable)
      .select('id, topic, rule, youtube_url, pdf_url')
      .order('created_at', { ascending: false })

    if (error) {
      setLessonError(`Mashqlarni olishda xatolik: ${error.message}`)
      if (!silent) setIsLessonsLoading(false)
      return
    }

    const mapped = (data ?? []).map((row) => ({
      id: String(row.id),
      topic: String(row.topic ?? ''),
      rule: String(row.rule ?? ''),
      youtubeUrl: String(row.youtube_url ?? ''),
      pdfUrl: (row.pdf_url as string | null) ?? null,
    }))

    setLessonItems(mapped)
    if (!silent) setIsLessonsLoading(false)
  }

  useEffect(() => {
    void loadLessons()
  }, [])

  const loadGuides = async (silent = false) => {
    if (!silent) {
      setGuideError('')
      setIsGuidesLoading(true)
    }

    const { data, error } = await supabase
      .from(guidesTable)
      .select('id, name, pdf_url')
      .order('created_at', { ascending: false })

    if (error) {
      setGuideError(`Qo'llanmalarni olishda xatolik: ${error.message}`)
      if (!silent) setIsGuidesLoading(false)
      return
    }

    const mapped = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ''),
      pdfUrl: (row.pdf_url as string | null) ?? null,
    }))
    setGuideItems(mapped)
    if (!silent) setIsGuidesLoading(false)
  }

  useEffect(() => {
    void loadGuides()
  }, [])

  const loadExperiments = async (silent = false) => {
    if (!silent) {
      setExperimentError('')
      setIsExperimentsLoading(true)
    }

    const { data, error } = await supabase
      .from(experimentsTable)
      .select('id, title, goal, description, video_url')
      .order('created_at', { ascending: false })

    if (error) {
      if (error.message.includes("Could not find the table 'public.experiments'")) {
        setExperimentError(
          `Supabase'da "${experimentsTable}" jadvali topilmadi. "supabase/experiments-public-read.sql" faylini SQL Editor'da ishga tushiring.`,
        )
        setExperimentItems([])
        if (!silent) setIsExperimentsLoading(false)
        return
      }
      setExperimentError(`Tajribalarni olishda xatolik: ${error.message}`)
      if (!silent) setIsExperimentsLoading(false)
      return
    }

    const mapped = (data ?? []).map((item) => ({
      id: String(item.id),
      title: String(item.title ?? ''),
      goal: String(item.goal ?? ''),
      description: String(item.description ?? ''),
      videoUrl: String(item.video_url ?? ''),
    }))

    setExperimentItems(mapped)
    if (!silent) setIsExperimentsLoading(false)
  }

  useEffect(() => {
    void loadExperiments()
  }, [])

  useEffect(() => {
    if (!taskSuccess) return
    const timer = window.setTimeout(() => {
      setTaskSuccess(null)
    }, 3000)
    return () => window.clearTimeout(timer)
  }, [taskSuccess])

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_AUTH_KEY) !== '1') {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const logout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
    navigate('/login', { replace: true })
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Mashqlar', icon: BookOpen },
    { label: 'Tajribalar', icon: FlaskConical },
    { label: 'Topshiriqlar', icon: ListChecks },
    { label: "Qo'llanmalar", icon: Book },
    { label: 'Galeriya', icon: Image },
  ]

  const onGalleryImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const imageFiles = Array.from(selectedFiles).filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    setSelectedUploadFiles(imageFiles)
  }

  const resetTaskModal = () => {
    setEditingTaskId(null)
    setTaskTitle('')
    setTaskType('krasvord')
    setTaskQuestions('')
    setTaskImage(null)
    setIsTaskModalOpen(false)
  }

  const openNewTaskModal = () => {
    setTaskError('')
    setEditingTaskId(null)
    setTaskTitle('')
    setTaskType('krasvord')
    setTaskQuestions('')
    setTaskImage(null)
    setIsTaskModalOpen(true)
  }

  const startEditTask = (item: TaskListItem) => {
    setTaskError('')
    setEditingTaskId(item.id)
    setTaskTitle(item.title)
    setTaskType(item.type)
    setTaskQuestions(item.questions ?? '')
    setTaskImage(null)
    setIsTaskModalOpen(true)
  }

  const openTaskPreview = (item: TaskListItem) => {
    if (item.imageUrl) {
      window.open(item.imageUrl, '_blank', 'noopener,noreferrer')
      return
    }
    const body = item.questions?.trim() || "Qo‘shimcha matn yo‘q."
    const html = `<!DOCTYPE html><html lang="uz"><head><meta charset="utf-8"><title>${escapeHtml(item.title)}</title></head><body style="font-family:system-ui,sans-serif;padding:1.25rem;max-width:42rem;margin:0 auto;line-height:1.5"><h1 style="font-size:1.2rem">${escapeHtml(item.title)}</h1><pre style="white-space:pre-wrap;font-size:0.95rem">${escapeHtml(body)}</pre></body></html>`
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) URL.revokeObjectURL(url)
    else setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  const onConfirmDeleteTask = async () => {
    const item = confirmDeleteTask
    setConfirmDeleteTask(null)
    if (!item) return

    setTaskError('')
    try {
      if (item.imageUrl) {
        const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
        const prefix = `${baseUrl}/storage/v1/object/public/${galleryBucket}/`
        if (item.imageUrl.startsWith(prefix)) {
          const objectPath = decodeURIComponent(item.imageUrl.slice(prefix.length))
          const { error: removeError } = await supabase.storage.from(galleryBucket).remove([objectPath])
          if (removeError) {
            console.warn('Storage o‘chirishda xato:', removeError.message)
          }
        }
      }

      const { ok, error: delErr } = await deleteTaskRow(supabase, tasksTable, item.id)
      if (!ok) throw new Error(delErr ?? "O'chirishda xatolik.")

      await loadTasks(true)
      setTaskSuccess({
        kind: 'deleted',
        message: "Muvaffaqiyatli o'chirildi",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "O'chirishda xatolik."
      setTaskError(`${message} (Table: "${tasksTable}")`)
    }
  }

  const onTaskImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return
    setTaskImage(selectedFile)
  }

  const resetLessonModal = () => {
    setEditingLessonId(null)
    setLessonTopic('')
    setLessonRule('')
    setLessonYoutubeLink('')
    setLessonPdf(null)
    setIsLessonModalOpen(false)
  }

  const startEditLesson = (item: LessonAdminItem) => {
    setLessonError('')
    setEditingLessonId(item.id)
    setLessonTopic(item.topic)
    setLessonRule(item.rule)
    setLessonYoutubeLink(item.youtubeUrl)
    setLessonPdf(null)
    setIsLessonModalOpen(true)
  }

  const onConfirmDeleteLesson = async () => {
    const item = confirmDeleteLesson
    setConfirmDeleteLesson(null)
    if (!item) return

    setLessonError('')
    try {
      if (item.pdfUrl) {
        const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
        const prefix = `${baseUrl}/storage/v1/object/public/${lessonsBucket}/`
        if (item.pdfUrl.startsWith(prefix)) {
          const objectPath = decodeURIComponent(item.pdfUrl.slice(prefix.length))
          const { error: removeError } = await supabase.storage.from(lessonsBucket).remove([objectPath])
          if (removeError) {
            console.warn('Lessons PDF o‘chirishda xato:', removeError.message)
          }
        }
      }

      let deleted = false
      for (const candidate of eqCandidatesForTaskId(item.id)) {
        const { error, count } = await supabase
          .from(lessonsTable)
          .delete({ count: 'exact' })
          .eq('id', candidate)
        if (error) throw new Error(error.message)
        if ((count ?? 0) > 0) {
          deleted = true
          break
        }
      }
      if (!deleted) throw new Error("Mashq o'chirilmadi: mos ID topilmadi.")

      await loadLessons(true)
      setTaskSuccess({ kind: 'deleted', message: "Mashq muvaffaqiyatli o'chirildi" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "O'chirishda xatolik."
      setLessonError(message)
    }
  }

  const onLessonPdfPick = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    if (selectedFile.type !== 'application/pdf') {
      setLessonError('Faqat PDF fayl yuklang.')
      return
    }
    setLessonPdf(selectedFile)
  }

  const resetGuideModal = () => {
    setEditingGuideId(null)
    setGuideName('')
    setGuidePdf(null)
    setIsGuideModalOpen(false)
  }

  const onGuidePdfPick = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return
    if (selectedFile.type !== 'application/pdf') {
      setGuideError('Faqat PDF fayl yuklang.')
      return
    }
    setGuidePdf(selectedFile)
  }

  const onSaveGuide = async () => {
    if (!guideName.trim()) {
      setGuideError('Nomini kiriting.')
      return
    }
    if (!guidePdf && !editingGuideId) {
      setGuideError('PDF fayl yuklang.')
      return
    }

    setGuideError('')
    setIsGuideSaving(true)
    try {
      let pdfUrl: string | null =
        guideItems.find((item) => item.id === editingGuideId)?.pdfUrl ?? null
      if (guidePdf) {
        const extension = guidePdf.name.split('.').pop() ?? 'pdf'
        const objectPath = `guides/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

        const { error: uploadErrorData } = await supabase.storage
          .from(guidesBucket)
          .upload(objectPath, guidePdf, { upsert: false, contentType: 'application/pdf' })
        if (uploadErrorData) throw new Error(`PDF yuklanmadi: ${uploadErrorData.message}`)

        const { data: publicUrlData } = supabase.storage.from(guidesBucket).getPublicUrl(objectPath)
        pdfUrl = publicUrlData.publicUrl || null
      }

      if (editingGuideId) {
        let updated = false
        for (const candidate of eqCandidatesForTaskId(editingGuideId)) {
          const { data, error } = await supabase
            .from(guidesTable)
            .update({ name: guideName.trim(), pdf_url: pdfUrl })
            .eq('id', candidate)
            .select('id')
          if (error) throw new Error(error.message)
          if (data?.[0]) {
            updated = true
            break
          }
        }
        if (!updated) throw new Error("Qo'llanma yangilanmadi: mos ID topilmadi.")
      } else {
        const { error: insertError } = await supabase
          .from(guidesTable)
          .insert({ name: guideName.trim(), pdf_url: pdfUrl })
        if (insertError) throw new Error(insertError.message)
      }

      await loadGuides(true)
      setTaskSuccess({
        kind: editingGuideId ? 'updated' : 'created',
        message: editingGuideId
          ? "Qo'llanma muvaffaqiyatli yangilandi"
          : "Qo'llanma muvaffaqiyatli qo'shildi",
      })
      resetGuideModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Saqlashda xatolik yuz berdi.'
      setGuideError(`${message} (Table: "${guidesTable}", Bucket: "${guidesBucket}")`)
    } finally {
      setIsGuideSaving(false)
    }
  }

  const onConfirmDeleteGuide = async () => {
    const item = confirmDeleteGuide
    setConfirmDeleteGuide(null)
    if (!item) return
    setGuideError('')
    try {
      if (item.pdfUrl) {
        const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '')
        const prefix = `${baseUrl}/storage/v1/object/public/${guidesBucket}/`
        if (item.pdfUrl.startsWith(prefix)) {
          const objectPath = decodeURIComponent(item.pdfUrl.slice(prefix.length))
          const { error: removeError } = await supabase.storage.from(guidesBucket).remove([objectPath])
          if (removeError) console.warn("Qo'llanma PDF o'chirishda xato:", removeError.message)
        }
      }
      let deleted = false
      for (const candidate of eqCandidatesForTaskId(item.id)) {
        const { error, count } = await supabase
          .from(guidesTable)
          .delete({ count: 'exact' })
          .eq('id', candidate)
        if (error) throw new Error(error.message)
        if ((count ?? 0) > 0) {
          deleted = true
          break
        }
      }
      if (!deleted) throw new Error("Qo'llanma o'chirilmadi: mos ID topilmadi.")
      await loadGuides(true)
      setTaskSuccess({ kind: 'deleted', message: "Qo'llanma muvaffaqiyatli o'chirildi" })
    } catch (error) {
      const message = error instanceof Error ? error.message : "O'chirishda xatolik."
      setGuideError(message)
    }
  }

  const onSaveLesson = async () => {
    if (!lessonTopic.trim()) {
      setLessonError('Mavzuni kiriting.')
      return
    }
    if (!lessonRule.trim()) {
      setLessonError('Qoidani kiriting.')
      return
    }
    if (!lessonYoutubeLink.trim()) {
      setLessonError('YouTube linkni kiriting.')
      return
    }
    if (!lessonPdf && !editingLessonId) {
      setLessonError('PDF fayl yuklang.')
      return
    }

    setLessonError('')
    setIsLessonSaving(true)
    try {
      let pdfUrl: string | null =
        lessonItems.find((item) => item.id === editingLessonId)?.pdfUrl ?? null

      if (lessonPdf) {
        const extension = lessonPdf.name.split('.').pop() ?? 'pdf'
        const objectPath = `lessons/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

        const { error: uploadErrorData } = await supabase.storage
          .from(lessonsBucket)
          .upload(objectPath, lessonPdf, { upsert: false, contentType: 'application/pdf' })

        if (uploadErrorData) {
          throw new Error(`PDF yuklanmadi: ${uploadErrorData.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from(lessonsBucket).getPublicUrl(objectPath)
        pdfUrl = publicUrlData.publicUrl || null
      }

      const payload = {
        topic: lessonTopic.trim(),
        rule: lessonRule.trim(),
        youtube_url: toYoutubeEmbedUrl(lessonYoutubeLink),
        pdf_url: pdfUrl,
      }

      if (editingLessonId) {
        let updated = false
        for (const candidate of eqCandidatesForTaskId(editingLessonId)) {
          const { data, error } = await supabase
            .from(lessonsTable)
            .update(payload)
            .eq('id', candidate)
            .select('id')
          if (error) throw new Error(error.message)
          if (data?.[0]) {
            updated = true
            break
          }
        }
        if (!updated) throw new Error('Mashq yangilanmadi: mos ID topilmadi.')
      } else {
        const { error: insertError } = await supabase.from(lessonsTable).insert(payload)
        if (insertError) throw new Error(insertError.message)
      }

      await loadLessons(true)
      setTaskSuccess({
        kind: editingLessonId ? 'updated' : 'created',
        message: editingLessonId ? 'Mashq muvaffaqiyatli yangilandi' : "Mashq muvaffaqiyatli qo'shildi",
      })
      resetLessonModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Saqlashda xatolik yuz berdi.'
      setLessonError(
        `${message} (Table: "${lessonsTable}", Bucket: "${lessonsBucket}")`,
      )
    } finally {
      setIsLessonSaving(false)
    }
  }

  const resetExperimentModal = () => {
    setEditingExperimentId(null)
    setExperimentTitle('')
    setExperimentGoal('')
    setExperimentDescription('')
    setExperimentYoutubeLink('')
    setIsExperimentModalOpen(false)
  }

  const startEditExperiment = (item: ExperimentItem) => {
    setExperimentError('')
    setEditingExperimentId(item.id)
    setExperimentTitle(item.title)
    setExperimentGoal(item.goal)
    setExperimentDescription(item.description)
    setExperimentYoutubeLink(item.videoUrl)
    setIsExperimentModalOpen(true)
  }

  const onConfirmDeleteExperiment = async () => {
    const item = confirmDeleteExperiment
    setConfirmDeleteExperiment(null)
    if (!item) return

    setExperimentError('')
    try {
      let deleted = false
      for (const candidate of eqCandidatesForTaskId(item.id)) {
        const { error, count } = await supabase
          .from(experimentsTable)
          .delete({ count: 'exact' })
          .eq('id', candidate)

        if (error) throw new Error(error.message)
        if ((count ?? 0) > 0) {
          deleted = true
          break
        }
      }

      if (!deleted) {
        throw new Error("Tajriba o'chirilmadi: mos ID topilmadi.")
      }

      await loadExperiments(true)
      setTaskSuccess({
        kind: 'deleted',
        message: "Tajriba muvaffaqiyatli o'chirildi",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "O'chirishda xatolik."
      setExperimentError(message)
    }
  }

  const onSaveExperiment = async () => {
    if (!experimentTitle.trim()) {
      setExperimentError('Mavzuni kiriting.')
      return
    }
    if (!experimentGoal.trim()) {
      setExperimentError('Maqsadni kiriting.')
      return
    }
    if (!experimentDescription.trim()) {
      setExperimentError('Opisaniyani kiriting.')
      return
    }
    if (!experimentYoutubeLink.trim()) {
      setExperimentError('YouTube linkni kiriting.')
      return
    }

    setExperimentError('')
    setIsExperimentSaving(true)

    try {
      const payload = {
        title: experimentTitle.trim(),
        goal: experimentGoal.trim(),
        description: experimentDescription.trim(),
        video_url: toYoutubeEmbedUrl(experimentYoutubeLink),
      }
      if (editingExperimentId) {
        let updated = false
        for (const candidate of eqCandidatesForTaskId(editingExperimentId)) {
          const { data, error } = await supabase
            .from(experimentsTable)
            .update(payload)
            .eq('id', candidate)
            .select('id')
          if (error) throw new Error(error.message)
          if (data?.[0]) {
            updated = true
            break
          }
        }

        if (!updated) {
          throw new Error("Tajriba yangilanmadi: mos ID topilmadi.")
        }
      } else {
        const { error } = await supabase.from(experimentsTable).insert(payload)
        if (error) {
          if (error.message.includes("Could not find the table 'public.experiments'")) {
            throw new Error(
              `"${experimentsTable}" jadvali yo'q. "supabase/experiments-public-read.sql" ni SQL Editor'da ishga tushiring.`,
            )
          }
          throw new Error(error.message)
        }
      }
      await loadExperiments(true)
      setTaskSuccess({
        kind: editingExperimentId ? 'updated' : 'created',
        message: editingExperimentId
          ? 'Tajriba muvaffaqiyatli yangilandi'
          : "Tajriba muvaffaqiyatli qo'shildi",
      })
      resetExperimentModal()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Saqlashda xatolik yuz berdi."
      setExperimentError(
        `${message} (Table: "${experimentsTable}"). Supabase'da jadval va ustunlar mavjudligini tekshiring.`,
      )
    } finally {
      setIsExperimentSaving(false)
    }
  }

  const onSaveTask = async () => {
    if (!taskTitle.trim()) {
      setTaskError('Sarlavhani kiriting.')
      return
    }

    if (taskType === 'krasvord' && !taskQuestions.trim()) {
      setTaskError('Krasvord uchun savollarni kiriting.')
      return
    }

    setTaskError('')
    setIsTaskSaving(true)

    try {
      let uploadedImageUrl: string | null | undefined

      if (taskImage) {
        const extension = taskImage.name.split('.').pop() ?? 'jpg'
        const objectPath = `tasks/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

        const { error: uploadErrorData } = await supabase.storage
          .from(galleryBucket)
          .upload(objectPath, taskImage, { upsert: false })

        if (uploadErrorData) {
          throw new Error(`Rasm yuklanmadi: ${uploadErrorData.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from(galleryBucket).getPublicUrl(objectPath)
        uploadedImageUrl = publicUrlData.publicUrl || null
      }

      if (editingTaskId) {
        type UpdatePayload = {
          title: string
          type: TaskType
          questions: string | null
          image_url?: string | null
        }
        const updatePayload: UpdatePayload = {
          title: taskTitle.trim(),
          type: taskType,
          questions: taskType === 'krasvord' ? taskQuestions.trim() : null,
        }
        if (taskImage) {
          updatePayload.image_url = uploadedImageUrl ?? null
        }

        let updatedTask: {
          id: unknown
          title: unknown
          type: unknown
          questions: unknown
          image_url: unknown
        } | null = null

        for (const candidate of eqCandidatesForTaskId(editingTaskId)) {
          const { data: rows, error: updateError } = await supabase
            .from(tasksTable)
            .update(updatePayload)
            .eq('id', candidate)
            .select('id, title, type, questions, image_url')

          if (updateError) {
            throw new Error(updateError.message)
          }
          if (rows?.[0]) {
            updatedTask = rows[0]
            break
          }
        }

        if (!updatedTask) {
          throw new Error(
            "Topshiriq yangilanmadi: bazada mos ID topilmadi (ustun turi yoki ID noto'g'ri bo'lishi mumkin).",
          )
        }

        await loadTasks(true)

        setTaskSuccess({
          kind: 'updated',
          message: 'Muvaffaqiyatli yangilandi',
        })
        resetTaskModal()
      } else {
        const payload = {
          title: taskTitle.trim(),
          type: taskType,
          questions: taskType === 'krasvord' ? taskQuestions.trim() : null,
          image_url: uploadedImageUrl ?? null,
        }

        const { error: insertError } = await supabase
          .from(tasksTable)
          .insert(payload)
          .select('id')
          .single()

        if (insertError) {
          throw new Error(insertError.message)
        }

        await loadTasks(true)

        setTaskSuccess({
          kind: 'created',
          message: "Muvaffaqiyatli qo'shildi",
        })
        resetTaskModal()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Saqlashda xatolik yuz berdi."
      setTaskError(
        `${message} (Table: "${tasksTable}"). Supabase'da jadval va ustunlar mavjudligini tekshiring.`,
      )
    } finally {
      setIsTaskSaving(false)
    }
  }

  const uploadSelectedImages = async () => {
    if (selectedUploadFiles.length === 0) return
    setUploadError('')
    setIsUploading(true)

    try {
      const uploadedItems = await Promise.all(
        selectedUploadFiles.map(async (file, index) => {
          const uniqueId = `admin-${Date.now()}-${index}`
          const extension = file.name.split('.').pop() ?? 'jpg'
          const objectPath = `admin-gallery/${uniqueId}.${extension}`

          const { error: uploadErrorData } = await supabase.storage
            .from(galleryBucket)
            .upload(objectPath, file, { upsert: false })

          if (uploadErrorData) {
            throw new Error(uploadErrorData.message)
          }

          const { data: publicUrlData } = supabase.storage.from(galleryBucket).getPublicUrl(objectPath)

          if (!publicUrlData.publicUrl) {
            throw new Error('Public URL olinmadi.')
          }

          return {
            id: uniqueId,
            title: file.name.replace(/\.[^/.]+$/, '') || `Rasm ${index + 1}`,
            caption: "Supabase Storage orqali qo'shilgan rasm",
            imageUrl: publicUrlData.publicUrl,
            storagePath: objectPath,
          } satisfies AdminGalleryItem
        }),
      )

      setAdminGalleryItems((prev) => [...prev, ...uploadedItems])
      setIsUploadModalOpen(false)
      setSelectedUploadFiles([])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Yuklashda xatolik yuz berdi.'
      setUploadError(
        `${message} (Bucket: "${galleryBucket}"). Supabase'da bucket public ekanini va mavjudligini tekshiring.`,
      )
    } finally {
      setIsUploading(false)
    }
  }

  const onDeleteGalleryItem = async () => {
    if (!confirmDeleteItem) return

    const itemToDelete = confirmDeleteItem
    setConfirmDeleteItem(null)

    if (itemToDelete.storagePath) {
      const { error } = await supabase.storage.from(galleryBucket).remove([itemToDelete.storagePath])
      if (error) {
        setUploadError(`O'chirishda xatolik: ${error.message}`)
        return
      }
    }

    setAdminGalleryItems((prev) => prev.filter((item) => item.id !== itemToDelete.id))
  }

  return (
    <div className="min-h-svh bg-slate-100 text-slate-900 transition-colors dark:bg-[#071826] dark:text-slate-100">
      <div className="flex min-h-svh">
        <aside className="w-64 border-r border-slate-200 bg-white px-4 py-6 dark:border-white/10 dark:bg-[#0a2032]">
          <div className="mb-8">
            <p className="text-lg font-semibold tracking-wide">Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin panel</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActiveMenu(item.label)}
                  className={[
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition',
                    activeMenu === item.label
                      ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 px-6 py-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
            <h1 className="text-2xl font-semibold">
              {activeMenu === 'Dashboard' ? 'Admin Dashboard' : activeMenu}
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-rose-500 px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-500/10 dark:text-rose-400"
              >
                Chiqish
              </button>
            </div>
          </div>

          {activeMenu === 'Dashboard' ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { title: 'Mashqlar', value: `${lessonItems.length} ta` },
                  { title: 'Tajribalar', value: `${experimentItems.length} ta` },
                  { title: 'Topshiriqlar', value: `${taskItems.length} ta` },
                  { title: "Qo'llanmalar", value: `${guideItems.length} ta` },
                  { title: 'Galeriya', value: `${adminGalleryItems.length} ta` },
                ].map((card) => (
                  <article
                    key={card.title}
                    className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d2438]"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
                    <p className="mt-2 text-3xl font-bold text-cyan-700 dark:text-cyan-300">
                      {card.value}
                    </p>
                  </article>
                ))}
              </section>

              <section className="mt-6">
                <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                  <h2 className="text-lg font-semibold">So‘nggi yangilanishlar</h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li>Mexanika bo‘limiga 3 ta yangi mashq qo‘shildi.</li>
                    <li>Tajribalar bo‘limidagi video fayllar yangilandi.</li>
                    <li>Topshiriqlar sahifasiga yangi test yuklandi.</li>
                  </ul>
                </article>
              </section>
            </>
          ) : null}

          {activeMenu === 'Galeriya' ? (
            <section className="space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">— Foto galereya —</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadError('')
                      setIsUploadModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  >
                    <Plus className="h-4 w-4" />
                    Qo'shish
                  </button>
                </div>
                {uploadError ? (
                  <p className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300">
                    {uploadError}
                  </p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {adminGalleryItems.map((item) => (
                    <article
                      key={item.id}
                      className="group overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#112f47]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02] group-hover:blur-[2.5px] group-hover:brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/35 opacity-0 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => window.open(item.imageUrl, '_blank', 'noopener,noreferrer')}
                            className="rounded-full bg-white/90 p-2.5 text-slate-800 transition hover:bg-white"
                            aria-label="Rasmni ko'rish"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteItem(item)}
                            className="rounded-full bg-rose-600 p-2.5 text-white transition hover:bg-rose-700"
                            aria-label="Rasmni o'chirish"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold">admin</p>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          {activeMenu === 'Mashqlar' ? (
            <section className="space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Mashqlar</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setLessonError('')
                      setEditingLessonId(null)
                      setLessonTopic('')
                      setLessonRule('')
                      setLessonYoutubeLink('')
                      setLessonPdf(null)
                      setIsLessonModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  >
                    <Plus className="h-4 w-4" />
                    Qo'shish
                  </button>
                </div>
                {lessonError ? (
                  <p className="mt-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300">
                    {lessonError}
                  </p>
                ) : null}
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <h3 className="text-base font-semibold">Mavjud mashqlar</h3>
                {isLessonsLoading ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">Yuklanmoqda...</p>
                ) : lessonItems.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                    Hozircha mashqlar mavjud emas.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {lessonItems.map((item) => (
                      <article
                        key={item.id}
                        className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d2438]"
                      >
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
                            {item.topic}
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.rule}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.youtubeUrl ? (
                              <a
                                href={item.youtubeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                              >
                                YouTube
                              </a>
                            ) : null}
                            {item.pdfUrl ? (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/10"
                              >
                                PDF
                              </a>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewLesson(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-cyan-500 px-3 py-1.5 text-sm font-semibold text-cyan-500 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                            aria-label="Ko'rish"
                            title="Ko'rish"
                          >
                            <Eye className="h-4 w-4" />
                            Ko'rish
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditLesson(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-500 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                            aria-label="Tahrirlash"
                            title="Tahrirlash"
                          >
                            <Pencil className="h-4 w-4" />
                            Tahrirlash
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteLesson(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            aria-label="O'chirish"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                            O'chirish
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </article>
            </section>
          ) : null}

          {activeMenu === 'Topshiriqlar' ? (
            <section className="space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Topshiriqlar</h2>
                  <button
                    type="button"
                    onClick={openNewTaskModal}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  >
                    <Plus className="h-4 w-4" />
                    Qo'shish
                  </button>
                </div>
                {taskError ? (
                  <p className="mt-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300">
                    {taskError}
                  </p>
                ) : null}
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <h3 className="text-base font-semibold">Mavjud topshiriqlar</h3>
                {isTasksLoading ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">Yuklanmoqda...</p>
                ) : taskItems.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                    Hozircha topshiriqlar mavjud emas.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {taskItems.map((item) => (
                      <article
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d2438]"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {item.type === 'krasvord' ? 'Krasvord' : "So'z topshirig'i"}
                          </p>
                          {item.questions ? (
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.questions}</p>
                          ) : null}
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="mt-3 h-28 w-full max-w-xs rounded-md object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openTaskPreview(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-cyan-500 px-3 py-1.5 text-sm font-semibold text-cyan-500 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                            aria-label="Ko‘rish"
                            title="Ko‘rish"
                          >
                            <Eye className="h-4 w-4" />
                            Ko'rish
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditTask(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-500 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                            aria-label="Tahrirlash"
                            title="Tahrirlash"
                          >
                            <Pencil className="h-4 w-4" />
                            Tahrirlash
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteTask(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            aria-label="O‘chirish"
                            title="O‘chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                            O'chirish
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </article>
            </section>
          ) : null}

          {activeMenu === "Qo'llanmalar" ? (
            <section className="space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Qo'llanmalar</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setGuideError('')
                      setEditingGuideId(null)
                      setGuideName('')
                      setGuidePdf(null)
                      setIsGuideModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  >
                    <Plus className="h-4 w-4" />
                    Qo'shish
                  </button>
                </div>
                {guideError ? (
                  <p className="mt-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300">
                    {guideError}
                  </p>
                ) : null}
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <h3 className="text-base font-semibold">Mavjud qo'llanmalar</h3>
                {isGuidesLoading ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">Yuklanmoqda...</p>
                ) : guideItems.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                    Hozircha qo'llanmalar mavjud emas.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {guideItems.map((item) => (
                      <article
                        key={item.id}
                        className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d2438]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setGuideError('')
                              setEditingGuideId(item.id)
                              setGuideName(item.name)
                              setGuidePdf(null)
                              setIsGuideModalOpen(true)
                            }}
                            className="inline-flex items-center gap-2 rounded-md border border-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-500 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                            aria-label="Tahrirlash"
                            title="Tahrirlash"
                          >
                            <Pencil className="h-4 w-4" />
                            Tahrirlash
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (item.pdfUrl) window.open(item.pdfUrl, '_blank', 'noopener,noreferrer')
                            }}
                            className="inline-flex items-center gap-2 rounded-md border border-cyan-500 px-3 py-1.5 text-sm font-semibold text-cyan-500 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                            aria-label="Ko'rish"
                            title="Ko'rish"
                          >
                            <Eye className="h-4 w-4" />
                            Ko'rish
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteGuide(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            aria-label="O'chirish"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                            O'chirish
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </article>
            </section>
          ) : null}

          {activeMenu === 'Tajribalar' ? (
            <section className="space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Tajribalar</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setExperimentError('')
                      setEditingExperimentId(null)
                      setExperimentTitle('')
                      setExperimentGoal('')
                      setExperimentDescription('')
                      setExperimentYoutubeLink('')
                      setIsExperimentModalOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  >
                    <Plus className="h-4 w-4" />
                    Qo'shish
                  </button>
                </div>
                {experimentError ? (
                  <p className="mt-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300">
                    {experimentError}
                  </p>
                ) : null}
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#0d2438]">
                <h3 className="text-base font-semibold">Mavjud tajribalar</h3>
                {isExperimentsLoading ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">Yuklanmoqda...</p>
                ) : experimentItems.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-300">
                    Hozircha tajribalar mavjud emas.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {experimentItems.map((item) => (
                      <article
                        key={item.id}
                        className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0d2438]"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Maqsad
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.goal}</p>
                          <p className="mt-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Opisaniya
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewExperiment(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-cyan-500 px-3 py-1.5 text-sm font-semibold text-cyan-500 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                            aria-label="Ko'rish"
                            title="Ko'rish"
                          >
                            <Eye className="h-4 w-4" />
                            Ko'rish
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditExperiment(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-500 transition hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                            aria-label="Tahrirlash"
                            title="Tahrirlash"
                          >
                            <Pencil className="h-4 w-4" />
                            Tahrirlash
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteExperiment(item)}
                            className="inline-flex items-center gap-2 rounded-md border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                            aria-label="O'chirish"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                            O'chirish
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </article>
            </section>
          ) : null}
        </main>
      </div>

      {isUploadModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Rasmni yuklang</h3>
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false)
                  setSelectedUploadFiles([])
                }}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onGalleryImagePick}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
            />

            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {selectedUploadFiles.length > 0
                ? `${selectedUploadFiles.length} ta rasm tanlandi`
                : 'JPG, PNG yoki WEBP rasm tanlang'}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false)
                  setSelectedUploadFiles([])
                }}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Yo'q
              </button>
              <button
                type="button"
                disabled={isUploading || selectedUploadFiles.length === 0}
                onClick={uploadSelectedImages}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? 'Yuklanmoqda...' : 'Yuklash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteTask ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <h3 className="text-lg font-semibold">Topshiriqni o‘chirmoqchimisiz?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {confirmDeleteTask.title}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteTask(null)}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteTask}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <h3 className="text-lg font-semibold">Rasmni o'chirmoqchimisiz?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {confirmDeleteItem.title}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteItem(null)}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={onDeleteGalleryItem}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isTaskModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingTaskId ? 'Topshiriqni tahrirlash' : "Topshiriq qo'shish"}
              </h3>
              <button
                type="button"
                onClick={resetTaskModal}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Sarlavha</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="Sarlavhani yozing"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Topshiriq turi</label>
                <select
                  value={taskType}
                  onChange={(event) => setTaskType(event.target.value as TaskType)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                >
                  <option value="krasvord">Krasvord</option>
                  <option value="soz-topshirigi">So'z topshirig'i</option>
                </select>
              </div>

              {taskType === 'krasvord' ? (
                <div>
                  <label className="mb-1 block text-sm font-medium">Savollar</label>
                  <textarea
                    value={taskQuestions}
                    onChange={(event) => setTaskQuestions(event.target.value)}
                    placeholder="Savollarni kiriting"
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                  />
                </div>
              ) : null}

              <div>
                <label className="mb-1 block text-sm font-medium">Rasm yuklash</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onTaskImagePick}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {taskImage
                    ? `Tanlangan rasm: ${taskImage.name}`
                    : editingTaskId
                      ? 'Yangi rasm tanlansa, avvalgisi almashtiriladi.'
                      : 'Rasm tanlanmagan'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetTaskModal}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={onSaveTask}
                disabled={isTaskSaving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                {isTaskSaving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isLessonModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingLessonId ? "Mashqni tahrirlash" : "Mashq qo'shish"}
              </h3>
              <button
                type="button"
                onClick={resetLessonModal}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Mavzu</label>
                <input
                  type="text"
                  value={lessonTopic}
                  onChange={(event) => setLessonTopic(event.target.value)}
                  placeholder="Mavzuni yozing"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Qoida</label>
                <textarea
                  value={lessonRule}
                  onChange={(event) => setLessonRule(event.target.value)}
                  placeholder="Qoidani yozing"
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">YouTube link</label>
                <input
                  type="text"
                  value={lessonYoutubeLink}
                  onChange={(event) => setLessonYoutubeLink(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">PDF yuklash</label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={onLessonPdfPick}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {lessonPdf
                    ? `Tanlangan fayl: ${lessonPdf.name}`
                    : editingLessonId
                      ? 'Yangi PDF tanlansa, avvalgisi almashtiriladi.'
                      : 'PDF tanlanmagan'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetLessonModal}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={onSaveLesson}
                disabled={isLessonSaving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                {isLessonSaving ? 'Saqlanmoqda...' : editingLessonId ? 'Yangilash' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isGuideModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingGuideId ? "Qo'llanmani tahrirlash" : "Qo'llanma qo'shish"}
              </h3>
              <button
                type="button"
                onClick={resetGuideModal}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Nomi</label>
                <input
                  type="text"
                  value={guideName}
                  onChange={(event) => setGuideName(event.target.value)}
                  placeholder="Qo'llanma nomini yozing"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">PDF yuklash</label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={onGuidePdfPick}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {guidePdf
                    ? `Tanlangan fayl: ${guidePdf.name}`
                    : editingGuideId
                      ? 'Yangi PDF tanlansa, avvalgisi almashtiriladi.'
                      : 'PDF tanlanmagan'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetGuideModal}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={onSaveGuide}
                disabled={isGuideSaving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                {isGuideSaving ? 'Saqlanmoqda...' : editingGuideId ? 'Yangilash' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteGuide ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <h3 className="text-lg font-semibold">Qo'llanmani o'chirmoqchimisiz?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{confirmDeleteGuide.name}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteGuide(null)}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteGuide}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewLesson ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Mashq ma'lumotlari</h3>
              <button
                type="button"
                onClick={() => setPreviewLesson(null)}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mavzu</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">{previewLesson.topic}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Qoida</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{previewLesson.rule}</p>
              </div>
              {previewLesson.youtubeUrl ? (
                <a
                  href={previewLesson.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-lg border border-cyan-500 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                >
                  YouTube ni ochish
                </a>
              ) : null}
              {previewLesson.pdfUrl ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10">
                  <iframe title="Mashq PDF preview" src={previewLesson.pdfUrl} className="h-[420px] w-full" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteLesson ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <h3 className="text-lg font-semibold">Mashqni o'chirmoqchimisiz?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{confirmDeleteLesson.topic}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteLesson(null)}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteLesson}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isExperimentModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editingExperimentId ? 'Tajribani tahrirlash' : "Tajriba qo'shish"}
              </h3>
              <button
                type="button"
                onClick={resetExperimentModal}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Mavzu</label>
                <input
                  type="text"
                  value={experimentTitle}
                  onChange={(event) => setExperimentTitle(event.target.value)}
                  placeholder="Mavzuni yozing"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Maqsad</label>
                <input
                  type="text"
                  value={experimentGoal}
                  onChange={(event) => setExperimentGoal(event.target.value)}
                  placeholder="Maqsadni yozing"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Opisaniya</label>
                <textarea
                  value={experimentDescription}
                  onChange={(event) => setExperimentDescription(event.target.value)}
                  placeholder="Opisaniyani yozing"
                  rows={8}
                  className="min-h-[220px] w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">YouTube link</label>
                <input
                  type="text"
                  value={experimentYoutubeLink}
                  onChange={(event) => setExperimentYoutubeLink(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetExperimentModal}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={onSaveExperiment}
                disabled={isExperimentSaving}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                {isExperimentSaving ? 'Saqlanmoqda...' : editingExperimentId ? 'Yangilash' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewExperiment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Tajriba ma'lumotlari</h3>
              <button
                type="button"
                onClick={() => setPreviewExperiment(null)}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                aria-label="Yopish"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Mavzu</p>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {previewExperiment.title}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Maqsad</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{previewExperiment.goal}</p>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-black dark:border-white/10">
                <div className="aspect-video w-full">
                  <iframe
                    title={previewExperiment.title}
                    src={toYoutubeEmbedUrl(previewExperiment.videoUrl)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDeleteExperiment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-[#10283c]">
            <h3 className="text-lg font-semibold">Tajribani o'chirmoqchimisiz?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {confirmDeleteExperiment.title}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteExperiment(null)}
                className="rounded-lg border border-sky-500 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteExperiment}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Ha
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {taskSuccess ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4 sm:px-6">
          <div className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-emerald-400/70 bg-emerald-50/95 px-4 py-3 text-sm shadow-lg shadow-emerald-500/20 backdrop-blur-sm dark:border-emerald-400/60 dark:bg-emerald-900/80">
            <CheckCircle2
              className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
              strokeWidth={1.75}
              aria-hidden
            />
            <p className="flex-1 text-left text-[13px] font-medium text-emerald-900 dark:text-emerald-50">
              {taskSuccess.message}
            </p>
            <button
              type="button"
              onClick={() => setTaskSuccess(null)}
              className="ml-1 rounded-full bg-emerald-600/10 p-1 text-emerald-700 transition hover:bg-emerald-600/20 dark:text-emerald-100"
              aria-label="Yopish"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
