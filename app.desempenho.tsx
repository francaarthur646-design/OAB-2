import { createFileRoute } from '@tanstack/react-router'

import { disciplines, scoreHistory, student } from '@/lib/fixtures'
import {
  addDays,
  eventsOn,
  studyMinutes,
  useScheduleProgress,
  useToday,
} from '@/lib/schedule'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/desempenho')({
  component: PerformancePage,
})

function PerformancePage() {
  const sorted = [...disciplines].sort((a, b) => b.accuracy - a.accuracy)
  const today = useToday()
  const { done } = useScheduleProgress()
  const weeklyHours = Array.from({ length: 7 }, (_, i) => {
    const day = today ? addDays(today, i - 6) : null
    const minutes = day
      ? studyMinutes(eventsOn(day).filter((e) => done[e.id]))
      : 0
    const label = day
      ? new Date(day + 'T00:00:00')
          .toLocaleDateString('pt-BR', { weekday: 'short' })
          .replace('.', '')
      : ''
    return { label, hours: Math.round((minutes / 60) * 10) / 10 }
  })
  const maxHours = Math.max(2, ...weeklyHours.map((d) => d.hours))
  const totalHours = weeklyHours.reduce((s, d) => s + d.hours, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Desempenho</h1>
        <p className="mt-2 text-muted-foreground">
          Sua evolução rumo aos 40 acertos da 1ª fase.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Acerto geral', `${student.overallAccuracy}%`],
          [
            'Questões resolvidas',
            student.questionsAnswered.toLocaleString('pt-BR'),
          ],
          [
            'Horas nos últimos 7 dias',
            `${totalHours.toLocaleString('pt-BR')}h`,
          ],
          [
            'Melhor simulado',
            scoreHistory.length
              ? `${Math.max(...scoreHistory.map((s) => s.score))}/80`
              : '—',
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section
          className="rounded-2xl border bg-card p-5"
          aria-labelledby="evolucao"
        >
          <h2 id="evolucao" className="text-lg font-semibold">
            Nota nos simulados completos
          </h2>
          <p className="text-xs text-muted-foreground">
            Acertos de 80 · linha tracejada = nota de corte
          </p>
          {scoreHistory.length > 1 ? (
            <ScoreChart />
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              Faça simulados completos para ver sua evolução.
            </p>
          )}
        </section>

        <section
          className="rounded-2xl border bg-card p-5"
          aria-labelledby="horas"
        >
          <h2 id="horas" className="text-lg font-semibold">
            Horas de estudo
          </h2>
          <p className="text-xs text-muted-foreground">
            Últimos 7 dias · atividades concluídas no cronograma
          </p>
          <div className="mt-6 flex h-48 items-end gap-3">
            {weeklyHours.map((d, i) => (
              <div
                key={i}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-semibold tabular-nums">
                  {d.hours ? `${d.hours.toLocaleString('pt-BR')}h` : '—'}
                </span>
                <div
                  className={cn(
                    'w-full rounded-t-md',
                    d.hours ? 'bg-chart-1' : 'h-1 bg-border',
                    i === weeklyHours.length - 1 && d.hours && 'bg-accent',
                  )}
                  style={
                    d.hours
                      ? { height: `${(d.hours / maxHours) * 100}%` }
                      : undefined
                  }
                />
                <span className="text-xs text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section
        className="rounded-2xl border bg-card p-5"
        aria-labelledby="disciplinas"
      >
        <h2 id="disciplinas" className="text-lg font-semibold">
          Acerto por disciplina
        </h2>
        <p className="text-xs text-muted-foreground">
          Peso = número aproximado de questões na prova
        </p>
        <ul className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">
          {sorted.map((d) => (
            <li
              key={d.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1"
            >
              <span className="truncate text-sm font-medium">
                {d.name}{' '}
                <span className="text-xs font-normal text-muted-foreground">
                  · peso {d.examWeight}
                </span>
              </span>
              <span
                className={cn(
                  'text-sm font-semibold tabular-nums',
                  d.accuracy < 55 && 'text-destructive',
                )}
              >
                {d.accuracy}%
              </span>
              <div className="col-span-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn(
                    'h-full rounded-full',
                    d.accuracy >= 70
                      ? 'bg-chart-1'
                      : d.accuracy >= 55
                        ? 'bg-chart-2'
                        : 'bg-chart-4',
                  )}
                  style={{ width: `${d.accuracy}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function ScoreChart() {
  const w = 520
  const h = 220
  const pad = { l: 32, r: 16, t: 16, b: 28 }
  const min = 20
  const max = 60
  const x = (i: number) =>
    pad.l + (i * (w - pad.l - pad.r)) / (scoreHistory.length - 1)
  const y = (v: number) =>
    pad.t + ((max - v) * (h - pad.t - pad.b)) / (max - min)
  const path = scoreHistory
    .map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.score)}`)
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-4 w-full"
      role="img"
      aria-label={`Notas: ${scoreHistory.map((p) => `${p.label} ${p.score}`).join(', ')}`}
    >
      {[20, 30, 40, 50, 60].map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            x2={w - pad.r}
            y1={y(v)}
            y2={y(v)}
            className="stroke-border"
          />
          <text
            x={pad.l - 8}
            y={y(v) + 4}
            textAnchor="end"
            className="fill-muted-foreground text-[11px]"
          >
            {v}
          </text>
        </g>
      ))}
      <line
        x1={pad.l}
        x2={w - pad.r}
        y1={y(40)}
        y2={y(40)}
        strokeDasharray="6 5"
        strokeWidth={1.5}
        className="stroke-accent"
      />
      <path
        d={path}
        fill="none"
        strokeWidth={3}
        strokeLinejoin="round"
        className="stroke-chart-1"
      />
      {scoreHistory.map((p, i) => (
        <g key={p.label}>
          <circle
            cx={x(i)}
            cy={y(p.score)}
            r={5}
            className="fill-card stroke-chart-1"
            strokeWidth={2.5}
          />
          <text
            x={x(i)}
            y={y(p.score) - 12}
            textAnchor="middle"
            className="fill-foreground text-[12px] font-semibold"
          >
            {p.score}
          </text>
          <text
            x={x(i)}
            y={h - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[11px]"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
