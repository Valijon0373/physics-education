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
  goal: string
  materials: string[]
  steps: string[]
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
    exercises: [
      {
        id: 'k1',
        question:
          "Avtomobil 72 km/soat tezlik bilan harakatlanmoqda. Tezlikni m/s da ifodalang.",
        options: ['10 m/s', '15 m/s', '20 m/s', '25 m/s'],
        correctIndex: 2,
        hint: '1 km/soat = 1000/3600 m/s',
      },
      {
        id: 'k2',
        question:
          "Boshlang'ich tezlik 0, tezlanish 2 m/s². 5 sekunddan keyin tezlik qancha?",
        options: ['5 m/s', '8 m/s', '10 m/s', '12 m/s'],
        correctIndex: 2,
      },
      {
        id: 'k3',
        question:
          "To'g'ri chiziqli tekis tezlanuvchan harakatda masofa qaysi formula bilan hisoblanadi?",
        options: ['s = vt', 's = v₀t + at²/2', 's = at', 's = v²/a'],
        correctIndex: 1,
      },
    ],
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
    title: 'Pendulum tajribasi',
    caption: "Og'irlik kuchi va davr",
    imageUrl: 'https://picsum.photos/seed/pendulum/800/600',
  },
  {
    id: 'g2',
    title: 'Prisma va nur',
    caption: 'Spektr tahlili',
    imageUrl: 'https://picsum.photos/seed/prism/800/600',
  },
  {
    id: 'g3',
    title: 'Laboratoriya uskunalari',
    caption: 'Datchiklar va o\'lchov',
    imageUrl: 'https://picsum.photos/seed/lab/800/600',
  },
  {
    id: 'g4',
    title: 'Mexanik muvozanat',
    caption: 'Kuchlar diagrammasi',
    imageUrl: 'https://picsum.photos/seed/balance/800/600',
  },
  {
    id: 'g5',
    title: 'Sirt ustidagi harakat',
    caption: 'Ishqalanish koeffitsienti',
    imageUrl: 'https://picsum.photos/seed/friction/800/600',
  },
  {
    id: 'g6',
    title: 'Sinfdagi tajriba',
    caption: 'Talabalar ishtiroki',
    imageUrl: 'https://picsum.photos/seed/class/800/600',
  },
  {
    id: 'g7',
    title: 'Kampus',
    caption: 'Ochiq havoda mashg‘ulot',
    imageUrl: 'https://picsum.photos/seed/campus/800/600',
  },
  {
    id: 'g8',
    title: 'UrDPI binosi',
    caption: 'Institutdan lavha',
    imageUrl: 'https://picsum.photos/seed/institute/800/600',
  },
]

export const experiments: Experiment[] = [
  {
    id: 'exp1',
    title: "Erkin tushish tezlanishi g'",
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
    safety: "Oynani himoya qiling; shar pastdan tashlansin.",
  },
  {
    id: 'exp2',
    title: 'Ishqalanish burchagi',
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
  },
  {
    id: 'exp3',
    title: 'Prujina qattaligi',
    goal: "Guk qonuni bo'yicha k ni aniqlash.",
    materials: ["Prujina", "osma tarozi", "toshlar", "chizg'ich"],
    steps: [
      "Prujina uzunligini yukisiz o'lchang.",
      "Har bir yukdan keyin cho'zilishni yozing.",
      "F = kx grafikidan k ni toping.",
    ],
  },
]

export const guides: Guide[] = [
  {
    id: 'pdf1',
    title: 'Mexanika — asosiy formulalar',
    summary:
      "Kinematika, dinamika, ish-energiya bo'limlari uchun qisqa jadval va misollar.",
    pages: 8,
  },
  {
    id: 'pdf2',
    title: 'Laboratoriya hisobot namunasi',
    summary: "Tajriba maqsadi, sxema, jadval va xulosa bo'limlari.",
    pages: 4,
  },
  {
    id: 'pdf3',
    title: 'Masalalar to‘plami (1-bosqich)',
    summary: "50 ta tanlangan masala va yo'riqnomalar.",
    pages: 24,
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id)
}
