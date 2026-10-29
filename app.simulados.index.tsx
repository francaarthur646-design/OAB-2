import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, Clock, FileStack, Play, RotateCcw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { simulados } from '@/lib/fixtures'
import { formatMinutes } from '@/lib/format'

export const Route = createFileRoute('/app/simulados/')({
  component: SimuladosPage,
})

function SimuladosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Simulados</h1>
        <p className="mt-2 text-muted-foreground">
          Treine nas condições da prova: tempo cronometrado, gabarito só no
          final e nota de corte de 40 acertos.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {simulados.map((s) => (
          <article key={s.id} className="flex flex-col rounded-2xl border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              {s.status === 'concluido' && (
                <Badge variant="secondary">
                  <CheckCircle2 /> Concluído em {s.completedAt}
                </Badge>
              )}
              {s.status === 'em-andamento' && (
                <Badge className="bg-accent text-accent-foreground">Em andamento</Badge>
              )}
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FileStack className="size-4" /> {s.questions} questões
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" /> {formatMinutes(s.minutes)}
              </span>
              {s.score !== undefined && (
                <span
                  className={
                    s.score >= 40 ? 'font-semibold text-success' : 'font-semibold text-destructive'
                  }
                >
                  {s.score}/80 {s.score >= 40 ? '· aprovado' : '· abaixo do corte'}
                </span>
              )}
            </div>
            <Button
              asChild
              className="mt-5 w-full sm:w-fit"
              variant={s.status === 'concluido' ? 'outline' : 'default'}
            >
              <Link to="/app/simulados/$simuladoId" params={{ simuladoId: s.id }}>
                {s.status === 'concluido' ? (
                  <>
                    <RotateCcw /> Refazer
                  </>
                ) : (
                  <>
                    <Play /> {s.status === 'em-andamento' ? 'Continuar' : 'Iniciar'}
                  </>
                )}
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  )
}
