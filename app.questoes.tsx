import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Sparkles, Wand2 } from 'lucide-react'
import { z } from 'zod'

import { QuestionCard } from '@/components/rota/question-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  aiSampleQuestion,
  disciplines,
  questions,
  type DisciplineId,
  type Question,
} from '@/lib/fixtures'

const searchSchema = z.object({
  aba: z.enum(['banco', 'ia']).optional(),
  disciplina: z.string().optional(),
})

export const Route = createFileRoute('/app/questoes')({
  validateSearch: searchSchema,
  component: QuestionsPage,
})

function QuestionsPage() {
  const { aba = 'banco', disciplina } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Questões</h1>
        <p className="mt-2 text-muted-foreground">
          Treine com questões comentadas no padrão FGV ou gere questões inéditas
          com IA.
        </p>
      </div>
      <Tabs
        value={aba}
        onValueChange={(v) =>
          navigate({ search: (s) => ({ ...s, aba: v as 'banco' | 'ia' }) })
        }
      >
        <TabsList className="h-11 bg-secondary">
          <TabsTrigger value="banco" className="px-4">
            Banco de questões
          </TabsTrigger>
          <TabsTrigger value="ia" className="px-4">
            <Sparkles /> Gerar com IA
          </TabsTrigger>
        </TabsList>
        <TabsContent value="banco" className="mt-6">
          <QuestionBank
            discipline={disciplina}
            onDisciplineChange={(d) =>
              navigate({
                search: (s) => ({ ...s, disciplina: d === 'todas' ? undefined : d }),
              })
            }
          />
        </TabsContent>
        <TabsContent value="ia" className="mt-6">
          <AiGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function QuestionBank({
  discipline,
  onDisciplineChange,
}: {
  discipline?: string
  onDisciplineChange: (d: string) => void
}) {
  const filtered = discipline
    ? questions.filter((q) => q.discipline === discipline)
    : questions
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<Record<string, boolean>>({})
  const current = filtered[Math.min(index, filtered.length - 1)] as
    | Question
    | undefined
  const answeredCount = Object.keys(results).length
  const correctCount = Object.values(results).filter(Boolean).length

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={discipline ?? 'todas'}
            onValueChange={(v) => {
              setIndex(0)
              onDisciplineChange(v)
            }}
          >
            <SelectTrigger className="w-64 bg-card" aria-label="Filtrar por disciplina">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as disciplinas</SelectItem>
              {disciplines.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'questão' : 'questões'}
          </span>
        </div>

        {current ? (
          <>
            <QuestionCard
              key={current.id}
              question={current}
              index={index}
              total={filtered.length}
              onAnswer={(_, ok) =>
                setResults((r) => ({ ...r, [current.id]: ok }))
              }
            />
            <div className="flex justify-between">
              <Button
                variant="outline"
                disabled={index === 0}
                onClick={() => setIndex((i) => i - 1)}
              >
                <ChevronLeft /> Anterior
              </Button>
              <Button
                disabled={index >= filtered.length - 1}
                onClick={() => setIndex((i) => i + 1)}
              >
                Próxima <ChevronRight />
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
            <p className="font-medium">
              Ainda não há questões desta disciplina na amostra.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Que tal gerar algumas com IA?
            </p>
          </div>
        )}
      </div>

      <aside className="h-fit rounded-2xl border bg-card p-5">
        <h2 className="text-lg font-semibold">Sessão atual</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-muted-foreground">Respondidas</dt>
            <dd className="font-display text-3xl font-semibold">{answeredCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Acertos</dt>
            <dd className="font-display text-3xl font-semibold text-success">
              {correctCount}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Cada resposta entra no seu desempenho por disciplina e ajusta as
          revisões do cronograma.
        </p>
      </aside>
    </div>
  )
}

function AiGenerator() {
  const [discipline, setDiscipline] = useState<DisciplineId>('etica')
  const [topic, setTopic] = useState('Publicidade na advocacia')
  const [level, setLevel] = useState('media')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [run, setRun] = useState(0)

  function generate(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setRun((r) => r + 1)
    // Preview only: the AI endpoint arrives in a later milestone (see PLAN.md).
    setTimeout(() => setState('done'), 1600)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={generate}
        className="h-fit space-y-5 rounded-2xl border bg-card p-5"
      >
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-accent/25 text-accent-foreground">
            <Wand2 className="size-5" />
          </span>
          <h2 className="text-lg font-semibold">Nova questão inédita</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ia-disciplina">Disciplina</Label>
          <Select
            value={discipline}
            onValueChange={(v) => setDiscipline(v as DisciplineId)}
          >
            <SelectTrigger id="ia-disciplina" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {disciplines.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ia-tema">Tema (opcional)</Label>
          <Input
            id="ia-tema"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ex.: honorários, prescrição, habeas corpus"
          />
        </div>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Dificuldade</legend>
          <RadioGroup value={level} onValueChange={setLevel} className="flex gap-4">
            {[
              ['facil', 'Fácil'],
              ['media', 'Média'],
              ['dificil', 'Difícil'],
            ].map(([v, l]) => (
              <div key={v} className="flex items-center gap-2">
                <RadioGroupItem value={v} id={`nivel-${v}`} />
                <Label htmlFor={`nivel-${v}`} className="font-normal">
                  {l}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
        <Button type="submit" className="w-full" disabled={state === 'loading'}>
          <Sparkles /> {state === 'loading' ? 'Gerando…' : 'Gerar questão'}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Questões geradas para fins de estudo, imitando o estilo da FGV. Sempre
          confira o fundamento legal indicado.
        </p>
      </form>

      <div>
        {state === 'idle' && (
          <div className="grid h-full min-h-72 place-items-center rounded-2xl border border-dashed bg-card p-10 text-center">
            <div>
              <Sparkles className="mx-auto size-8 text-accent" />
              <p className="mt-3 font-medium">
                Escolha uma disciplina e um tema para começar.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                A questão aparece aqui, com gabarito comentado.
              </p>
            </div>
          </div>
        )}
        {state === 'loading' && (
          <div className="space-y-4 rounded-2xl border bg-card p-7" aria-busy="true">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        )}
        {state === 'done' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Prévia de exemplo — a geração personalizada pelo tema escolhido
              chega em breve.
            </p>
            <QuestionCard key={run} question={aiSampleQuestion} />
          </div>
        )}
      </div>
    </div>
  )
}
