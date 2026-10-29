import { cn } from '@/lib/utils'

export function Logo({
  className,
  tone = 'dark',
}: {
  className?: string
  tone?: 'dark' | 'light'
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img
        src="/.netlify/images?url=/img/icon.png&w=80&h=80&fm=webp"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-[10px]"
      />
      <span
        className={cn(
          'font-display text-xl font-semibold tracking-tight',
          tone === 'light' ? 'text-sidebar-foreground' : 'text-foreground',
        )}
      >
        Rota <span className="text-accent">OAB</span>
      </span>
    </span>
  )
}
