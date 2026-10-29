import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import {
  BellRing,
  CalendarDays,
  ChartNoAxesCombined,
  FileStack,
  House,
  Timer,
} from 'lucide-react'

import { Logo } from '@/components/rota/logo'
import { daysUntil, student } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/app')({
  component: AppLayout,
})

const nav = [
  { to: '/app', label: 'Painel', icon: House, exact: true },
  { to: '/app/cronograma', label: 'Cronograma', icon: CalendarDays },
  { to: '/app/questoes', label: 'Questões', icon: FileStack },
  { to: '/app/simulados', label: 'Simulados', icon: Timer },
  { to: '/app/desempenho', label: 'Desempenho', icon: ChartNoAxesCombined },
  { to: '/app/lembretes', label: 'Lembretes', icon: BellRing },
] as const

function AppLayout() {
  const days = daysUntil(student.examDate)
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-sidebar p-5 text-sidebar-foreground lg:flex">
        <Link to="/" aria-label="Página inicial da Rota OAB">
          <Logo tone="light" />
        </Link>
        <nav className="mt-10 flex flex-col gap-1" aria-label="Principal">
          {nav.map(({ to, label, icon: Icon, ...rest }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: 'exact' in rest }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground motion-reduce:transition-none"
              activeProps={{
                className:
                  'bg-sidebar-accent !text-sidebar-foreground [&_svg]:text-sidebar-primary',
              }}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-4">
          <p className="text-xs text-sidebar-foreground/70">{student.examName}</p>
          <p className="mt-1 font-display text-3xl font-semibold text-sidebar-primary">
            {days} dias
          </p>
          <p className="text-xs text-sidebar-foreground/70">até a prova objetiva</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden">
          <Link to="/" aria-label="Página inicial da Rota OAB">
            <Logo />
          </Link>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
            {days} dias para a prova
          </span>
        </header>
        <main className="mx-auto w-full max-w-content flex-1 px-4 py-6 sm:px-6 lg:py-10">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {nav.map(({ to, label, icon: Icon, ...rest }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: 'exact' in rest }}
            className={cn(
              'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground',
            )}
            activeProps={{ className: '!text-primary [&_svg]:stroke-[2.4]' }}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
