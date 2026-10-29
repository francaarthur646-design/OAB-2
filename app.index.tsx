import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BellRing,
  Check,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { disciplines, scoreHistory, student } from '@/lib/fixtures'
import { formatMinutes } from '@/lib/format'
import {
  eventsOn,
  isRestDay,
  scheduleEvents,
  studyMinutes,
  streakDays,
  useScheduleProgress,
  useToday,
} from '@/lib/schedule'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/')({
  component: Dashboard,
})

function Dashboard() {
  const today = useToday()
  const { done, toggle } = useScheduleProgress()
  const blocks = today ? eventsOn(today) : []
  const restDay = today ? isRestDay(today) : false
  const doneMinutes = studyMinutes(blocks.filter((b) => done[b.id]))
  const goal = studyMinutes(blocks)
  const pct = goal ? Math.min(100, Math.round((doneMinutes / goal) * 100)) : 0
  const streak = today ? streakDays(done, today) : 0
  const scheduleDone = scheduleEvents.filter((e) => done[e.id]).length
  const schedulePct = Math.round((scheduleDone / scheduleEvents.length) * 100)
  const answered = disciplines.some((d) => d.answered > 0)
  const weakest = [...disciplines]
    .filter((d) => d.answered > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
  const lastScore = scoreHistory.at(-1)?.score
  const dateLabel = today
    ? new Date(today + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : ''

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="min-h-5 text-sm font-medium text-muted-foreground first-letter:uppercase">
            {dateLabel}
          </p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
            Bom dia, {student.firstName}.
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-semibold">
          <Flame className="size-4 text-chart-4" />
          {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}
        </div>
      </div>

      {today &&
        blocks.length > 0 &&
        !restDay &&
        blocks.every((b) => !done[b.id]) && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-accent/60 bg-accent/15 px-5 py-4 text-sm">
            <BellRing className="size-5 shrink-0 text-accent-foreground" />
            <p className="flex-1">
              <strong>Você ainda não estudou hoje.</strong>{' '}
              {streak
                ? `Conclua as atividades para manter sua sequência de ${streak} ${streak === 1 ? 'dia' : 'dias'}.`
                : 'Conclua as atividades de hoje para começar sua sequência.'}
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/app/lembretes">Ajustar lembretes</Link>
            </Button>
          </div>
        )}

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section
          className="rounded-2xl border bg-card p-5 sm:p-6"
          aria-labelledby="hoje"
        >
          <div className="flex items-center justify-between">
            <h2 id="hoje" className="text-xl font-semibold">
              Estudo de hoje
            </h2>
            <span className="text-sm text-muted-foreground">
              {restDay
                ? 'Descanso'
                : `${formatMinutes(doneMinutes)} de ${formatMinutes(goal)}`}
            </span>
          </div>
          <Progress
            value={pct}
            className="mt-4 h-2.5"
            aria-label="Progresso da meta diária"
          />
          <ul className="mt-5 space-y-2.5">
            {blocks.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => toggle(b.id)}
                  aria-pressed={!!done[b.id]}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-colors hover:bg-secondary/60 motion-reduce:transition-none',
                    done[b.id] && 'bg-secondary/50',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border-2',
                      done[b.id]
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border',
                    )}
                  >
                    {done[b.id] && (
                      <Check className="size-3.5" strokeWidth={3} />
                    )}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        'block text-sm font-medium leading-snug',
                        done[b.id] && 'text-muted-foreground line-through',
                      )}
                    >
                      {b.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {b.area} · {b.time}
                    </span>
                  </span>
                  {b.minutes > 1 && (
                    <span className="shrink-0 text-sm font-medium text-muted-foreground">
                      {formatMinutes(b.minutes)}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <Button asChild variant="link" className="mt-3 px-0">
            <Link to="/app/cronograma">
              Ver o cronograma completo <ArrowRight />
            </Link>
          </Button>
        </section>

        <div className="grid gap-5">
          <section className="grid grid-cols-2 gap-3">
            <Stat
              icon={Target}
              label="Acerto geral"
              value={
                student.questionsAnswered ? `${student.overallAccuracy}%` : '—'
              }
            />
            <Stat
              icon={TrendingUp}
              label="Último simulado"
              value={lastScore === undefined ? '—' : `${lastScore}/80`}
              hint="Aprovação: 40"
            />
            <Stat
              label="Questões feitas"
              value={student.questionsAnswered.toLocaleString('pt-BR')}
            />
            <Stat
              label="Cronograma"
              value={`${schedulePct}%`}
              hint={`${scheduleDone} de ${scheduleEvents.length} atividades`}
            />
          </section>

          <section className="relative overflow-hidden rounded-2xl bg-sidebar p-5 text-sidebar-foreground">
            <Sparkles className="absolute -top-3 -right-3 size-24 text-sidebar-primary/15" />
            <h2 className="text-lg font-semibold">
              Gere questões no estilo FGV
            </h2>
            <p className="mt-1 text-sm text-sidebar-foreground/75">
              A IA cria questões inéditas sobre o tema que você mais erra.
            </p>
            <Button
              asChild
              size="sm"
              className="mt-4 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            >
              <Link to="/app/questoes" search={{ aba: 'ia' }}>
                <Sparkles /> Gerar agora
              </Link>
            </Button>
          </section>
        </div>
      </div>

      <section
        className="rounded-2xl border bg-card p-5 sm:p-6"
        aria-labelledby="foco"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="foco" className="text-xl font-semibold">
            Onde focar esta semana
          </h2>
          <Link
            to="/app/desempenho"
            className="text-sm font-medium text-primary hover:underline"
          >
            Desempenho completo
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {!answered && (
            <p className="text-sm text-muted-foreground sm:col-span-3">
              Resolva questões para descobrir onde focar.
            </p>
          )}
          {weakest.map((d) => (
            <div key={d.id} className="rounded-xl border bg-background p-4">
              <p className="font-medium">{d.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {d.examWeight} questões na prova · {d.answered} resolvidas
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Progress
                  value={d.accuracy}
                  className="h-2 [&>div]:bg-chart-4"
                  aria-label={`Acerto em ${d.name}`}
                />
                <span className="text-sm font-semibold">{d.accuracy}%</span>
              </div>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="mt-4 w-full"
              >
                <Link to="/app/questoes" search={{ disciplina: d.id }}>
                  Treinar questões
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
