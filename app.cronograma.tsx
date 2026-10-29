import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { daysUntil, student } from '@/lib/fixtures'
import { formatMinutes } from '@/lib/format'
import {
  areaStyle,
  clampToSchedule,
  eventsOn,
  isRestDay,
  scheduleAreas,
  scheduleEnd,
  scheduleEvents,
  scheduleStart,
  studyMinutes,
  useScheduleProgress,
  useToday,
} from '@/lib/schedule'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/cronograma')({
  component: SchedulePage,
})

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const ALL = 'todas'

function longDate(iso: string) {
  const label = new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function SchedulePage() {
  const today = useToday()
  const { done, toggle } = useScheduleProgress()
  const [picked, setPicked] = useState<string | null>(null)
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null)
  const [area, setArea] = useState(ALL)
  const [query, setQuery] = useState('')

  const selected = picked ?? clampToSchedule(today ?? scheduleStart)
  const view = month ?? {
    y: +selected.slice(0, 4),
    m: +selected.slice(5, 7) - 1,
  }

  const doneCount = scheduleEvents.filter((e) => done[e.id]).length
  const pct = Math.round((doneCount / scheduleEvents.length) * 100)

  const shiftMonth = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1)
    setMonth({ y: d.getFullYear(), m: d.getMonth() })
  }
  const pick = (iso: string) => {
    setPicked(iso)
    setMonth(null)
  }

  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const monthKey = `${view.y}-${String(view.m + 1).padStart(2, '0')}`
  const canPrev = monthKey > scheduleStart.slice(0, 7)
  const canNext = monthKey < scheduleEnd.slice(0, 7)

  const dayEvents = eventsOn(selected)
  const q = query.trim().toLowerCase()
  const visible = dayEvents.filter(
    (e) =>
      (area === ALL || e.area === area) &&
      (!q ||
        e.title.toLowerCase().includes(q) ||
        e.area.toLowerCase().includes(q) ||
        (e.teacher ?? '').toLowerCase().includes(q)),
  )
  const dayMinutes = studyMinutes(dayEvents)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Cronograma</h1>
          <p className="mt-2 text-muted-foreground">
            1h30 a 2h por dia · Ceisc + Direito Civil e Processo Civil nos dias
            leves · {daysUntil(student.examDate)} dias até o {student.examName}
          </p>
        </div>
        {today && (
          <Button
            variant="outline"
            onClick={() => pick(clampToSchedule(today))}
          >
            Ir para hoje
          </Button>
        )}
      </div>

      <section
        className="rounded-2xl border bg-card p-5"
        aria-labelledby="progresso"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="progresso" className="font-medium">
            Progresso do cronograma
          </h2>
          <span className="text-sm text-muted-foreground">
            <strong className="font-display text-xl text-primary">
              {pct}%
            </strong>{' '}
            · {doneCount} de {scheduleEvents.length} atividades concluídas
          </span>
        </div>
        <Progress
          value={pct}
          className="mt-3 h-2.5"
          aria-label="Progresso do cronograma"
        />
        <ul className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {scheduleAreas.map((a) => {
            const evs = scheduleEvents.filter((e) => e.area === a)
            return (
              <li
                key={a}
                className="flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1"
              >
                <span className={cn('size-2 rounded-full', areaStyle[a].dot)} />
                {a}{' '}
                <span className="tabular-nums">
                  {evs.filter((e) => done[e.id]).length}/{evs.length}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section
          className="rounded-2xl border bg-card p-4"
          aria-labelledby="mes"
        >
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrev}
              aria-label="Mês anterior"
            >
              <ChevronLeft />
            </Button>
            <h2 id="mes" className="font-display text-lg font-semibold">
              {MONTHS[view.m]} {view.y}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => shiftMonth(1)}
              disabled={!canNext}
              aria-label="Próximo mês"
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((w) => (
              <div
                key={w}
                className="pb-1 text-center text-xs font-semibold text-muted-foreground"
              >
                {w}
              </div>
            ))}
            {Array.from({ length: firstWeekday }, (_, i) => (
              <div key={`vazio-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const iso = `${monthKey}-${String(i + 1).padStart(2, '0')}`
              const evs = eventsOn(iso)
              const allDone = evs.length > 0 && evs.every((e) => done[e.id])
              const areas = Array.from(new Set(evs.map((e) => e.area))).slice(
                0,
                5,
              )
              const isToday = iso === today
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={!evs.length}
                  onClick={() => pick(iso)}
                  aria-pressed={iso === selected}
                  aria-label={`${longDate(iso)}${allDone ? ', concluído' : ''}`}
                  className={cn(
                    'relative flex min-h-14 flex-col rounded-lg border border-transparent p-1.5 text-left transition-colors hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none',
                    iso === selected && 'border-primary bg-secondary',
                  )}
                >
                  <span
                    className={cn(
                      'text-xs text-muted-foreground',
                      isToday && 'font-bold text-primary',
                    )}
                  >
                    {i + 1}
                  </span>
                  {allDone && (
                    <Check
                      className="absolute top-1.5 right-1.5 size-3 text-success"
                      strokeWidth={3}
                    />
                  )}
                  <span className="mt-auto flex flex-wrap gap-0.5">
                    {areas.map((a) => (
                      <span
                        key={a}
                        className={cn(
                          'size-1.5 rounded-full',
                          areaStyle[a].dot,
                        )}
                      />
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="dia" className="space-y-3">
          <h2 id="dia" className="font-display text-xl font-semibold">
            {longDate(selected)}
            <span className="font-sans text-base font-normal text-muted-foreground">
              {' '}
              · {isRestDay(selected) ? 'descanso' : formatMinutes(dayMinutes)}
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-40 flex-1">
              <Label htmlFor="busca" className="sr-only">
                Buscar atividade
              </Label>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="busca"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tema ou professor"
                className="pl-9"
              />
            </div>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="w-48" aria-label="Filtrar por matéria">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Todas as matérias</SelectItem>
                {scheduleAreas.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhuma atividade encontrada para este dia.
            </p>
          ) : (
            <ul className="space-y-2">
              {visible.map((e) => {
                const isDone = !!done[e.id]
                const meta = [
                  e.time,
                  e.minutes > 1 && formatMinutes(e.minutes),
                  e.teacher,
                  e.format,
                ]
                  .filter(Boolean)
                  .join(' · ')
                return (
                  <li key={e.id}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border border-l-4 bg-card p-3 transition-colors hover:bg-secondary/60 motion-reduce:transition-none',
                        areaStyle[e.area].border,
                        isDone && 'opacity-60',
                      )}
                    >
                      <Checkbox
                        checked={isDone}
                        onCheckedChange={() => toggle(e.id)}
                        className="mt-0.5"
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            'block text-sm font-medium leading-snug',
                            isDone && 'line-through',
                          )}
                        >
                          {e.title}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground/80">
                            {e.area}
                          </span>{' '}
                          · {meta}
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
