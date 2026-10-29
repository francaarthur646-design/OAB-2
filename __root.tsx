import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'
import { useRegisterServiceWorker } from '@/lib/pwa'

import '../styles.css'

const siteName = 'Rota OAB — sua rota até a aprovação'
const siteDescription =
  'Aplicativo de estudos para o Exame de Ordem: cronograma inteligente, banco de questões no estilo FGV, simulados, desempenho e lembretes diários.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { name: 'theme-color', content: '#1f3d33' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'Rota OAB' },
    ],
    links: [
      { rel: 'manifest', href: '/manifest.webmanifest' },
      {
        rel: 'apple-touch-icon',
        href: '/.netlify/images?url=/img/icon.png&w=180&h=180&fm=png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        href: '/.netlify/images?url=/img/icon.png&w=64&h=64&fm=png',
      },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useRegisterServiceWorker()
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
