import { useEffect, useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Clock, Flag } from 'lucide-react'

import { QuestionCard } from '@/components/rota/question-card'
import { Button } from '@/components/ui/button'
import { questions, simulados, type Question } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/simulados/$simuladoId')({
  loader: ({ params }) => {
    const simulado = simulados.find((s) => s.id === params.simuladoId)
    if (!simulado) throw notFound()
    return { simulado }
  },
  component: SimuladoRunner,
})

type Letter = Question['answer']

/** Sample runs use the 8 stub questions at the official pace of ~3.75 min each. */
const SECONDS_PER_QUESTION = 225

function SimuladoRunner() {
  const { simulado } = Route.useLoaderData()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Letter>>({})
  const [finished, setFinished] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(questions.length * SECONDS_PER_QUESTION)

  useEffect(() => {
    if (finished) return
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setFinished(true)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [finished])

  const q = questions[current]
  const answered = Object.keys(answers).length
  const score = questions.filter((x) => answers[x.id] === x.answer).length
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="space-y-6">
        <BackLink />
        <section className="rounded-2xl bg-sidebar p-6 text-sidebar-foreground sm:p-8">
          <p className="text-sm text-sidebar-foreground/70">{simulado.title} · resultado</p>
          <h1 className="mt-2 text-4xl font-semibold">
            {score} de {questions.length} acertos
          </h1>
          <p className="mt-2 text-sidebar-foreground/80">
            {pct >= 50
              ? `${pct}% de aproveitamento — acima da nota de corte. Continue assim!`
              : `${pct}% de aproveitamento — abaixo dos 50% exigidos. Revise os comentários abaixo.`}
          </p>
        </section>
        <h2 className="text-xl font-semibold">Correção comentada</h2>
        <div className="space-y-5">
          {questions.map((x, i) =>
            answers[x.id] ? (
              <QuestionCard
                key={x.id}
                question={x}
                index={i}
                total={questions.length}
                selected={answers[x.id]}
                onAnswer={() => {}}
              />
            ) : (
              <div key={x.id} className="rounded-2xl border border-dashed bg-card p-5 text-sm">
                <p className="font-medium">Questão {i + 1} em branco</p>
                <p className="mt-1 text-muted-foreground">
                  Gabarito: {x.answer} — {x.legalBasis}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <BackLink />
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{simulado.title}</h1>
          <p className="text-sm text-muted-foreground">
            Amostra de {questions.length} questões · gabarito ao final
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-2 rounded-full border bg-card px-4 py-2 font-mono text-lg font-semibold tabular-nums',
            secondsLeft < 300 && 'border-destructive text-destructive',
          )}
          role="timer"
          aria-label="Tempo restante"
        >
          <Clock className="size-4" /> {mm}:{ss}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
        <div className="space-y-4">
          <QuestionCard
            key={q.id}
            question={q}
            index={current}
            total={questions.length}
            revealOnAnswer={false}
            selected={answers[q.id] ?? null}
            onAnswer={(letter) => setAnswers((a) => ({ ...a, [q.id]: letter }))}
          />
          <div className="flex justify-between">
            <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
              Anterior
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((c) => c + 1)}>Próxima</Button>
            ) : (
              <Button onClick={() => setFinished(true)}>
                <Flag /> Entregar prova
              </Button>
            )}
          </div>
        </div>
        <aside className="h-fit rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Cartão-resposta</h2>
          <p className="text-xs text-muted-foreground">
            {answered} de {questions.length} respondidas
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {questions.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ir para a questão ${i + 1}`}
                aria-current={i === current}
                className={cn(
                  'grid aspect-square place-items-center rounded-lg border text-sm font-semibold',
                  answers[x.id] && 'border-primary bg-primary text-primary-foreground',
                  i === current && 'ring-2 ring-accent ring-offset-2 ring-offset-card',
                )}
              >
                {answers[x.id] ?? i + 1}
              </button>
            ))}
          </div>
          <Button variant="outline" className="mt-5 w-full" onClick={() => setFinished(true)}>
            <Flag /> Entregar agora
          </Button>
        </aside>
      </div>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/app/simulados"
      className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="size-4" /> Simulados
    </Link>
  )
}
