import { useState } from 'react'
import { BookOpenCheck, CheckCircle2, Sparkles, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { disciplineName, type Question } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

type Letter = Question['answer']

export function QuestionCard({
  question,
  index,
  total,
  onAnswer,
  revealOnAnswer = true,
  selected: controlledSelected,
}: {
  question: Question
  index?: number
  total?: number
  onAnswer?: (letter: Letter, correct: boolean) => void
  /** When false (simulado mode), the answer key stays hidden. */
  revealOnAnswer?: boolean
  selected?: Letter | null
}) {
  const [localSelected, setLocalSelected] = useState<Letter | null>(null)
  const selected = controlledSelected ?? localSelected
  const answered = selected !== null && revealOnAnswer
  const correct = selected === question.answer

  function choose(letter: Letter) {
    if (answered) return
    setLocalSelected(letter)
    onAnswer?.(letter, letter === question.answer)
  }

  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
      <header className="mb-4 flex flex-wrap items-center gap-2 text-xs">
        {index !== undefined && total !== undefined && (
          <span className="font-semibold text-muted-foreground">
            Questão {index + 1} de {total}
          </span>
        )}
        <Badge variant="secondary">{disciplineName(question.discipline)}</Badge>
        <Badge variant="outline">{question.topic}</Badge>
        {question.source === 'Gerada por IA' ? (
          <Badge className="bg-accent text-accent-foreground">
            <Sparkles /> Gerada por IA
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            Padrão FGV
          </Badge>
        )}
      </header>

      <p className="text-[15px] leading-relaxed sm:text-base">
        {question.statement}
      </p>

      <fieldset className="mt-5 space-y-2.5">
        <legend className="sr-only">Alternativas</legend>
        {question.options.map((opt) => {
          const isSelected = selected === opt.letter
          const isAnswer = opt.letter === question.answer
          return (
            <button
              key={opt.letter}
              type="button"
              onClick={() => choose(opt.letter)}
              aria-pressed={isSelected}
              disabled={answered && !isSelected && !isAnswer}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border bg-background px-4 py-3 text-left text-sm leading-relaxed transition-colors motion-reduce:transition-none',
                'hover:border-primary/50 hover:bg-secondary/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                !answered && isSelected && 'border-primary bg-secondary',
                answered && isAnswer && 'border-success bg-success/10',
                answered && isSelected && !isAnswer && 'border-destructive bg-destructive/10',
                answered && !isSelected && !isAnswer && 'opacity-55',
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full border font-semibold',
                  isSelected && !answered && 'border-primary bg-primary text-primary-foreground',
                  answered && isAnswer && 'border-success bg-success text-white',
                  answered && isSelected && !isAnswer && 'border-destructive bg-destructive text-white',
                )}
              >
                {opt.letter}
              </span>
              <span className="pt-0.5">{opt.text}</span>
            </button>
          )
        })}
      </fieldset>

      {answered && (
        <div
          role="status"
          className={cn(
            'mt-5 rounded-xl border p-4 text-sm',
            correct ? 'border-success/40 bg-success/5' : 'border-destructive/30 bg-destructive/5',
          )}
        >
          <p className="flex items-center gap-2 font-semibold">
            {correct ? (
              <>
                <CheckCircle2 className="size-5 text-success" /> Resposta correta!
              </>
            ) : (
              <>
                <XCircle className="size-5 text-destructive" /> Não foi dessa vez —
                gabarito: {question.answer}
              </>
            )}
          </p>
          <p className="mt-2 leading-relaxed text-foreground/85">
            {question.explanation}
          </p>
          <p className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BookOpenCheck className="size-4" /> Fundamento: {question.legalBasis}
          </p>
        </div>
      )}

      {answered && !onAnswer && (
        <Button variant="ghost" size="sm" className="mt-3" onClick={() => setLocalSelected(null)}>
          Tentar de novo
        </Button>
      )}
    </article>
  )
}
