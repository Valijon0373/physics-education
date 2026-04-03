import { useState } from 'react'
import type { Exercise } from '../data/content'

type Props = {
  exercise: Exercise
  index: number
}

export function ExerciseCard({ exercise, index }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)

  const isCorrect = selected === exercise.correctIndex
  const answered = selected !== null

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/80">
      <p className="text-xs font-medium text-slate-500">
        Mashq {index + 1}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
        {exercise.question}
      </p>

      {exercise.hint && (
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          className="mt-2 text-xs text-cyan-600 hover:underline dark:text-cyan-500/90"
        >
          {showHint ? 'Maslahatni yashirish' : 'Maslahat'}
        </button>
      )}
      {showHint && exercise.hint && (
        <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-900 dark:bg-amber-500/10 dark:text-amber-200/90">
          {exercise.hint}
        </p>
      )}

      <ul className="mt-3 space-y-2">
        {exercise.options.map((opt, i) => {
          const isSel = selected === i
          const showAsCorrect = answered && i === exercise.correctIndex
          const showAsWrong = answered && isSel && !isCorrect

          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered}
                onClick={() => setSelected(i)}
                className={[
                  'w-full rounded-lg border px-3 py-2.5 text-left text-sm transition',
                  showAsCorrect
                    ? 'border-emerald-500/50 bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100'
                    : showAsWrong
                      ? 'border-red-400 bg-red-50 text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200'
                      : isSel
                        ? 'border-cyan-500/50 bg-cyan-50 text-slate-900 dark:border-cyan-500/50 dark:bg-cyan-500/10 dark:text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:border-white/20',
                ].join(' ')}
              >
                {opt}
              </button>
            </li>
          )
        })}
      </ul>

      {answered && (
        <p
          className={`mt-3 text-sm font-medium ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-300'}`}
        >
          {isCorrect ? "To'g'ri!" : "Noto'g'ri — to'g'ri javob yashil rangda."}
        </p>
      )}
    </div>
  )
}
