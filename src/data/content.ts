export type Exercise = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  hint?: string
}

export type Lesson = {
  id: string
  title: string
  topic: string
  description: string
  durationMin: number
  /** YouTube embed URL (youtube.com/embed/...) */
  videoEmbedUrl: string
  exercises: Exercise[]
}

export type GalleryItem = {
  id: string
  title: string
  caption: string
  imageUrl: string
}

export type Experiment = {
  id: string
  title: string
  /** YouTube embed URL (youtube.com/embed/...) */
  videoEmbedUrl: string
  /** Tajriba haqida qisqacha izoh */
  description: string
  goal: string
  materials: string[]
  steps: string[]
  /** Nima kuzatish/kayd qilish kerak */
  observations?: string[]
  /** Kutiladigan natija */
  expectedResult?: string
  safety?: string
}

export type Guide = {
  id: string
  title: string
  summary: string
  pages: number
  /** Placeholder — haqiqiy PDF URL bilan almashtiring */
  fileUrl?: string
}

export const lessons: Lesson[] = [
  {
    id: 'kinematika-1',
    topic: 'Kinematika',
    title: "To'g'ri chiziqli harakat",
    description:
      "Tezlik, tezlanish va grafiklar — mexanikaning asoslari. Video bilan bir qatorda mashqlarni bajaring.",
    durationMin: 18,
    videoEmbedUrl: 'https://www.youtube.com/embed/ZM8ECpBUQEc',
    exercises: [],
  },
  {
    id: 'dinamika-1',
    topic: 'Dinamika',
    title: "Nyuton qonunlari",
    description:
      "Kuch, massa va tezlanish o'rtasidagi bog'liqlik. Kundalik hayotdan misollar.",
    durationMin: 22,
    videoEmbedUrl: 'https://www.youtube.com/embed/kkkj44PdmMg',
    exercises: [
      {
        id: 'd1',
        question: "Nyutonning ikkinchi qonuni qanday yoziladi? (F, m, a)",
        options: ['F = m/a', 'F = ma', 'F = m + a', 'F = m²a'],
        correctIndex: 1,
      },
      {
        id: 'd2',
        question:
          "5 kg massali jismga 20 N kuch ta'sir qilsa, tezlanish necha m/s²?",
        options: ['2', '4', '5', '10'],
        correctIndex: 1,
      },
      {
        id: 'd3',
        question:
          "Harakatdagi jism uchun inertsiya qonuni qaysi Nyuton qonuniga mos keladi?",
        options: ['1', '2', '3', '4'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'ish-energiya',
    topic: 'Ish va energiya',
    title: 'Mexanik ish va kinetik energiya',
    description:
      "Ish, quvvat va energiya saqlanish — masalalar va grafiklar tahlili.",
    durationMin: 16,
    videoEmbedUrl: 'https://www.youtube.com/embed/2QV5yYl9yag',
    exercises: [
      {
        id: 'e1',
        question: "10 N kuch 2 m masofaga yo'naltirilgan bo'lsa, ish necha J?",
        options: ['5 J', '12 J', '20 J', '100 J'],
        correctIndex: 2,
      },
      {
        id: 'e2',
        question:
          "2 kg massali jismning tezligi 3 m/s bo'lsa, kinetik energiya necha J?",
        options: ['6 J', '9 J', '18 J', '3 J'],
        correctIndex: 1,
        hint: 'Eₖ = mv²/2',
      },
    ],
  },
]

export const galleryItems: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/pendulum/800/600',
  },
  {
    id: 'g2',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/prism/800/600',
  },
  {
    id: 'g3',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/lab/800/600',
  },
  {
    id: 'g4',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/balance/800/600',
  },
  {
    id: 'g5',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/friction/800/600',
  },
  {
    id: 'g6',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/class/800/600',
  },
  {
    id: 'g7',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/campus/800/600',
  },
  {
    id: 'g8',
    title: 'Mexanik Muvozanat',
    caption: 'Kuchlar Diagrammasi',
    imageUrl: 'https://picsum.photos/seed/institute/800/600',
  },
]

export const experiments: Experiment[] = [
  {
    id: 'exp1',
    title: "Erkin tushish tezlanishi g'",
    videoEmbedUrl: 'https://www.youtube.com/embed/0jHsq36_NTU',
    description:
      "Bu tajriba orqali erkin tushish vaqtini o‘lchab, Yerning tortishish tezlanishini (g) taxminiy hisoblaymiz. O‘lchovlarni bir necha marta takrorlash va o‘rtacha qiymat olish xatoni kamaytiradi.",
    goal: "Yer sharini tezlanishini sodda usul bilan baholash.",
    materials: [
      "Metal shar",
      "metr chizg'ich",
      "sekundomer",
      "qattiq stol yoki pol",
    ],
    steps: [
      "Balandlikni h cm da belgilang.",
      "Shar erkin tashlang, tushish vaqtini 3 marta o'lchang.",
      "O'rtacha vaqt orqali g' ≈ 2h/t² ni hisoblang.",
    ],
  },
  {
    id: 'exp2',
    title: 'Ishqalanish burchagi',
    videoEmbedUrl: 'https://www.youtube.com/embed/4k0E5Jt6Efc',
    description:
      "Qiyalik burchagi ortgani sari og‘irlik kuchining tekislik bo‘ylab tarkibi oshadi. Blok sirg‘ala boshlagan “chegara” holatni topib, ishqalanish xossalarini amaliy kuzatamiz.",
    goal: "Tekis plitalarda maksimal burchakni topish.",
    materials: [
      "Qiyalik qilinishi mumkin bo'lgan taxta",
      "kichik blok",
      "transportir",
    ],
    steps: [
      "Burchakni asta-sekin oshiring.",
      "Blok sirg'alishni boshlagan paytdagi burchakni yozib oling.",
      "Natijani sinfdoshlar bilan solishtiring.",
    ],
    observations: [
      "Sirg‘alish boshlanish burchagini 3–5 marta o‘lchab, o‘rtachasini oling.",
      "Turli yuzalar (qog‘oz, mato, yog‘och) bilan solishtirib ko‘ring.",
    ],
    expectedResult:
      "Blok sirg‘ala boshlaydigan burchak bir xil sharoitda yaqin qiymatlarda chiqadi; sirt qo‘polroq bo‘lsa, bu burchak kattaroq bo‘ladi.",
  },
  {
    id: 'exp3',
    title: 'Prujina qattaligi',
    videoEmbedUrl: 'https://www.youtube.com/embed/3I9FQk9F7wI',
    description:
      "Yuk oshgani sari prujina cho‘zilishi deyarli chiziqli ortadi. Kuch–cho‘zilish grafigi orqali Guk qonunini tekshirib, prujinaning qattiqligini (k) topamiz.",
    goal: "Guk qonuni bo'yicha k ni aniqlash.",
    materials: ["Prujina", "osma tarozi", "toshlar", "chizg'ich"],
    steps: [
      "Prujina uzunligini yukisiz o'lchang.",
      "Har bir yukdan keyin cho'zilishni yozing.",
      "F = kx grafikidan k ni toping.",
    ],
    observations: [
      "Har bir yuk uchun cho‘zilish \(x\) ni jadvalga yozing.",
      "Grafikni chizishda nuqtalarni tekislashtiruvchi to‘g‘ri chiziq o‘tkazing.",
    ],
    expectedResult:
      "Kuch–cho‘zilish grafigi deyarli to‘g‘ri chiziq bo‘ladi; uning og‘ish burchagi (nishabligi) prujina qattiqligiga mos keladi.",
  },
]

export const guides: Guide[] = [
  {
    id: 'pdf1',
    title: 'Krasvord-1',
    summary:
      "Kinematika, dinamika, ish-energiya bo'limlari uchun qisqa jadval va misollar.",
    pages: 8,
  },
  {
    id: 'pdf2',
    title: "So'z topshiriqi-1",
    summary: "Tajriba maqsadi, sxema, jadval va xulosa bo'limlari.",
    pages: 4,
  },
  {
    id: 'pdf3',
    title: 'Krasvord-2',
    summary: "50 ta tanlangan masala va yo'riqnomalar.",
    pages: 24,
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
