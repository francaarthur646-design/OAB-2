import { createFileRoute } from '@tanstack/react-router'
import { BellOff, BellRing, Download, MoonStar, Send, Sun } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  showLocalNotification,
  useInstallPrompt,
  useLocalStorageState,
  useNotificationPermission,
} from '@/lib/pwa'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app/lembretes')({
  component: RemindersPage,
})

type Prefs = {
  daily: boolean
  dailyTime: string
  missed: boolean
  missedTime: string
  days: number[]
}

const defaultPrefs: Prefs = {
  daily: true,
  dailyTime: '19:00',
  missed: true,
  missedTime: '21:30',
  days: [1, 2, 3, 4, 5, 6],
}

const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const STORAGE_KEY = 'rota-oab:lembretes'

function RemindersPage() {
  // Preferences live on this device until accounts and server push arrive.
  const [prefs, setPrefs] = useLocalStorageState<Prefs>(STORAGE_KEY, defaultPrefs)
  const { state, request } = useNotificationPermission()
  const { canInstall, installed, install } = useInstallPrompt()

  const update = (patch: Partial<Prefs>) => setPrefs({ ...prefs, ...patch })

  async function enable() {
    const result = await request()
    if (result === 'granted') toast.success('Notificações ativadas')
    else if (result === 'denied')
      toast.error('Notificações bloqueadas', {
        description: 'Libere as notificações nas configurações do navegador.',
      })
  }

  async function test() {
    const ok = await showLocalNotification(
      'Hora de estudar! 📚',
      'Sua meta de hoje: Tributário — 1h40 entre teoria e questões.',
    )
    if (!ok) toast('Ative as notificações primeiro.')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Lembretes</h1>
        <p className="mt-2 text-muted-foreground">
          Constância aprova. Escolha quando a Rota deve chamar você para
          estudar.
        </p>
      </div>

      <section
        className={cn(
          'flex flex-wrap items-center gap-4 rounded-2xl border p-5',
          state === 'granted' ? 'bg-success/5 border-success/30' : 'bg-card',
        )}
      >
        <span
          className={cn(
            'grid size-11 place-items-center rounded-xl',
            state === 'granted' ? 'bg-success text-white' : 'bg-secondary text-primary',
          )}
        >
          {state === 'denied' ? <BellOff className="size-5" /> : <BellRing className="size-5" />}
        </span>
        <div className="flex-1">
          <h2 className="font-semibold">
            {state === 'granted'
              ? 'Notificações ativadas neste aparelho'
              : state === 'denied'
                ? 'Notificações bloqueadas'
                : state === 'unsupported'
                  ? 'Este navegador não suporta notificações'
                  : 'Ative as notificações'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {state === 'denied'
              ? 'Libere nas configurações do navegador para receber lembretes.'
              : 'No iPhone, instale o app na tela inicial antes de ativar.'}
          </p>
        </div>
        {state === 'granted' ? (
          <Button variant="outline" onClick={test}>
            <Send /> Enviar teste
          </Button>
        ) : (
          <Button onClick={enable} disabled={state === 'unsupported' || state === 'denied'}>
            Ativar notificações
          </Button>
        )}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <ReminderCard
          icon={Sun}
          title="Lembrete diário"
          description="Um aviso no horário em que você costuma estudar."
          enabled={prefs.daily}
          onEnabled={(daily) => update({ daily })}
          time={prefs.dailyTime}
          onTime={(dailyTime) => update({ dailyTime })}
          id="diario"
        />
        <ReminderCard
          icon={MoonStar}
          title="Se eu não estudar no dia"
          description="Se nenhum bloco for concluído até este horário, você recebe um alerta para salvar a sequência."
          enabled={prefs.missed}
          onEnabled={(missed) => update({ missed })}
          time={prefs.missedTime}
          onTime={(missedTime) => update({ missedTime })}
          id="perdido"
        />
      </div>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Dias de estudo</h2>
        <p className="text-sm text-muted-foreground">
          Os lembretes só são enviados nos dias marcados.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {weekdays.map((label, i) => {
            const on = prefs.days.includes(i)
            return (
              <button
                key={label}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  update({
                    days: on ? prefs.days.filter((d) => d !== i) : [...prefs.days, i].sort(),
                  })
                }
                className={cn(
                  'h-10 w-14 rounded-full border text-sm font-semibold transition-colors motion-reduce:transition-none',
                  on ? 'border-primary bg-primary text-primary-foreground' : 'bg-background hover:bg-secondary',
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </section>

      {!installed && (
        <section className="flex flex-wrap items-center gap-4 rounded-2xl bg-sidebar p-5 text-sidebar-foreground">
          <Download className="size-6 text-sidebar-primary" />
          <div className="flex-1">
            <h2 className="font-semibold">Instale a Rota OAB</h2>
            <p className="text-sm text-sidebar-foreground/75">
              Com o app instalado, os lembretes chegam como notificações do
              celular.
            </p>
          </div>
          <Button
            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            onClick={async () => {
              if (canInstall) await install()
              else
                toast('Instale pelo navegador', {
                  description:
                    'Abra o menu do navegador e toque em “Adicionar à tela inicial”.',
                })
            }}
          >
            Instalar
          </Button>
        </section>
      )}
    </div>
  )
}

function ReminderCard({
  icon: Icon,
  title,
  description,
  enabled,
  onEnabled,
  time,
  onTime,
  id,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  enabled: boolean
  onEnabled: (v: boolean) => void
  time: string
  onTime: (v: string) => void
  id: string
}) {
  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 text-primary" />
        <div className="flex-1">
          <Label htmlFor={`${id}-switch`} className="text-base font-semibold">
            {title}
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Switch id={`${id}-switch`} checked={enabled} onCheckedChange={onEnabled} />
      </div>
      <div className={cn('mt-4 flex items-center gap-3', !enabled && 'opacity-50')}>
        <Label htmlFor={`${id}-hora`} className="text-sm">
          Horário
        </Label>
        <Input
          id={`${id}-hora`}
          type="time"
          value={time}
          disabled={!enabled}
          onChange={(e) => onTime(e.target.value)}
          className="w-32"
        />
      </div>
    </section>
  )
}
