import { useCallback, useSyncExternalStore } from 'react'

import { useLocalStorageState } from '@/lib/pwa'
import { scheduleEvents } from '@/lib/schedule-data'

export type ScheduleArea =
  | 'Metodologia'
  | 'Mentoria'
  | 'Ética'
  | 'Constitucional'
  | 'Trabalho'
  | 'Tributário'
  | 'Penal'
  | 'Processo Penal'
  | 'Processo do Trabalho'
  | 'Civil'
  | 'Processo Civil'
  | 'Simulado'
  | 'Revisão'
  | 'Questões'

export type ScheduleEvent = {
  id: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  /** Start time, HH:MM. */
  time: string
  minutes: number
  title: string
  area: ScheduleArea
  teacher?: string
  format?: 'Gravada' | 'Ao vivo'
}

export { scheduleEvents }

export const scheduleStart = scheduleEvents[0].date
export const scheduleEnd = scheduleEvents[scheduleEvents.length - 1].date

/** Dot and left-border colors per area (literal classes so Tailwind keeps them). */
export const areaStyle: Record<ScheduleArea, { dot: string; border: string }> =
  {
    Ética: { dot: 'bg-chart-5', border: 'border-l-chart-5' },
    Constitucional: { dot: 'bg-chart-3', border: 'border-l-chart-3' },
    Civil: { dot: 'bg-chart-1', border: 'border-l-chart-1' },
    'Processo Civil': { dot: 'bg-chart-1', border: 'border-l-chart-1' },
    Penal: { dot: 'bg-chart-4', border: 'border-l-chart-4' },
    'Processo Penal': { dot: 'bg-chart-4', border: 'border-l-chart-4' },
    Trabalho: { dot: 'bg-success', border: 'border-l-success' },
    'Processo do Trabalho': { dot: 'bg-success', border: 'border-l-success' },
    Tributário: { dot: 'bg-chart-2', border: 'border-l-chart-2' },
    Simulado: { dot: 'bg-accent', border: 'border-l-accent' },
    Mentoria: { dot: 'bg-accent', border: 'border-l-accent' },
    Metodologia: {
      dot: 'bg-muted-foreground',
      border: 'border-l-muted-foreground',
    },
    Revisão: {
      dot: 'bg-muted-foreground',
      border: 'border-l-muted-foreground',
    },
    Questões: {
      dot: 'bg-muted-foreground',
      border: 'border-l-muted-foreground',
    },
  }

export const scheduleAreas = Array.from(
  new Set(scheduleEvents.map((e) => e.area)),
) as ScheduleArea[]

const byDate = new Map<string, ScheduleEvent[]>()
for (const e of scheduleEvents) {
  const list = byDate.get(e.date) ?? []
  list.push(e)
  byDate.set(e.date, list)
}
for (const list of byDate.values())
  list.sort((a, b) => a.time.localeCompare(b.time))

export function eventsOn(date: string) {
  return byDate.get(date) ?? []
}

export function isRestDay(date: string) {
  const evs = eventsOn(date)
  return evs.length > 0 && evs.every((e) => e.title.startsWith('Descanso'))
}

/** Study time for a day, as in the original file: no simulados, mentorias or 1-minute items. */
export function studyMinutes(events: ScheduleEvent[]) {
  return events
    .filter(
      (e) => e.area !== 'Simulado' && e.area !== 'Mentoria' && e.minutes > 1,
    )
    .reduce((s, e) => s + e.minutes, 0)
}

export function toIsoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toIsoDate(d)
}

export function clampToSchedule(iso: string) {
  if (iso < scheduleStart) return scheduleStart
  if (iso > scheduleEnd) return scheduleEnd
  return iso
}

const noopSubscribe = () => () => {}

/** The student's local date; null during SSR and hydration. */
export function useToday() {
  return useSyncExternalStore(
    noopSubscribe,
    () => toIsoDate(new Date()),
    () => null,
  )
}

/**
 * Completed activities, stored on this device until accounts exist (milestone 2).
 * The key is new so progress from the previous sample schedule starts at zero.
 */
export function useScheduleProgress() {
  const [done, setDone] = useLocalStorageState<Record<string, true>>(
    'rota-cronograma-concluidas',
    {},
  )
  const toggle = useCallback(
    (id: string) => {
      const next = { ...done }
      if (next[id]) delete next[id]
      else next[id] = true
      setDone(next)
    },
    [done, setDone],
  )
  return { done, toggle }
}

/** Consecutive fully completed study days ending today (or yesterday). Rest days are skipped. */
export function streakDays(done: Record<string, true>, today: string) {
  const complete = (d: string) => eventsOn(d).every((e) => done[e.id])
  let day = complete(today) ? today : addDays(today, -1)
  let streak = 0
  while (day >= scheduleStart) {
    if (!isRestDay(day)) {
      if (!complete(day)) break
      streak++
    }
    day = addDays(day, -1)
  }
  return streak
}
