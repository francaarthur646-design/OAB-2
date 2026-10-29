import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  ChartNoAxesCombined,
  Download,
  FileStack,
  Smartphone,
  Sparkles,
  Timer,
} from 'lucide-react'
import { toast } from 'sonner'

import { Logo } from '@/components/rota/logo'
import { QuestionCard } from '@/components/rota/question-card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { questions } from '@/lib/fixtures'
import { useInstallPrompt } from '@/lib/pwa'

export const Route = createFileRoute('/')({
  component: Home,
})

const features = [
  {
    icon: CalendarCheck2,
    title: 'Cronograma que se adapta',
    text: 'Informe a data da prova e suas horas livres. A Rota distribui as 17 disciplinas pelo peso que cada uma tem na 1ª fase.',
  },
  {
    icon: FileStack,
    title: 'Banco de questões comentadas',
    text: 'Questões no padrão FGV filtradas por disciplina e tema, com gabarito, explicação e o artigo de lei que fundamenta a resposta.',
  },
  {
    icon: Sparkles,
    title: 'Questões inéditas com IA',
    text: 'Escolha um tema e gere questões novas imitando o estilo da banca — enunciado em caso concreto e quatro alternativas.',
  },
  {
    icon: Timer,
    title: 'Simulados cronometrados',
    text: 'Provas completas de 80 questões em 5 horas, ou treinos curtos focados nos seus pontos fracos.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Desempenho por disciplina',
    text: 'Veja onde você acerta e onde perde pontos, e acompanhe sua nota rumo aos 40 acertos.',
  },
  {
    icon: BellRing,
    title: 'Lembretes que não deixam falhar',
    text: 'Notificações no horário que você escolher — e um aviso quando o dia está acabando e você ainda não estudou.',
  },
]

function Home() {
  const { canInstall, install } = useInstallPrompt()

  async function onInstall() {
    if (canInstall) {
      await install()
    } else {
      toast('Instale pelo navegador', {
        description:
          'No celular, abra o menu do navegador e toque em “Adicionar à tela inicial”. No computador, use o ícone de instalação na barra de endereço.',
      })
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-2">
            <a
              href="#recursos"
              className="hidden px-3 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
            >
              Recursos
            </a>
            <a
              href="#questao"
              className="hidden px-3 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
            >
              Teste uma questão
            </a>
            <Button asChild size="sm">
              <Link to="/app">Abrir o app</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="bg-grain">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <span className="size-1.5 rounded-full bg-accent" />
              Preparação para o Exame de Ordem · banca FGV
            </p>
            <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
              Sua rota até a <em className="text-primary">carteira da OAB</em>,
              um dia de estudo por vez.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Cronograma personalizado, questões comentadas no estilo FGV,
              questões inéditas geradas por IA, simulados e lembretes diários —
              tudo em um aplicativo que você instala no celular.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link to="/app">
                  Começar a estudar <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
                onClick={onInstall}
              >
                <Download /> Instalar aplicativo
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t pt-6">
              {[
                ['80', 'questões por simulado'],
                ['17', 'disciplinas mapeadas'],
                ['40', 'acertos para passar'],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-semibold text-primary">
                    {n}
                  </dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 -z-0 rotate-2 rounded-[2rem] bg-accent/30" />
            <img
              src="/.netlify/images?url=/img/hero.png&w=1100&fm=webp"
              srcSet="/.netlify/images?url=/img/hero.png&w=640&fm=webp 640w, /.netlify/images?url=/img/hero.png&w=1100&fm=webp 1100w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Estudante de Direito revisando o Vade Mecum, com uma estrada sinuosa levando a um tribunal ao fundo"
              width={1376}
              height={768}
              className="relative aspect-[16/10] w-full rounded-[1.75rem] object-cover shadow-xl"
            />
            <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-lg">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-semibold">12 dias seguidos</p>
                <p className="text-xs text-muted-foreground">
                  Meta de hoje: 2h30 de estudo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Tudo o que a 1ª fase exige, organizado para você.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Menos tempo decidindo o que estudar, mais tempo resolvendo questões.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40 motion-reduce:transition-none"
            >
              <span className="mb-4 grid size-11 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="questao" className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-content gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Experimente agora.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Uma questão de Ética no padrão da FGV — a disciplina que mais vale
              pontos na prova. Escolha uma alternativa e veja o comentário com o
              fundamento legal.
            </p>
            <Button asChild variant="link" className="mt-4 px-0">
              <Link to="/app/questoes">
                Ver o banco de questões <ArrowRight />
              </Link>
            </Button>
          </div>
          <QuestionCard question={questions[0]} />
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 rounded-[2rem] bg-sidebar p-8 text-sidebar-foreground sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Smartphone className="mb-5 size-9 text-accent" />
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Instale no celular e estude em qualquer lugar.
            </h2>
            <p className="mt-4 text-sidebar-foreground/75">
              A Rota OAB funciona como um aplicativo: ícone na tela inicial,
              tela cheia e notificações para lembrar você de estudar.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              size="lg"
              className="h-12 bg-accent text-base text-accent-foreground hover:bg-accent/90"
              onClick={onInstall}
            >
              <Download /> Instalar aplicativo
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-sidebar-border bg-transparent text-base text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Link to="/app">Continuar no navegador</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-reading px-4 pb-20 sm:px-6">
        <h2 className="mb-6 text-center text-3xl font-semibold">
          Perguntas frequentes
        </h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="ia">
            <AccordionTrigger>As questões geradas por IA são oficiais?</AccordionTrigger>
            <AccordionContent>
              Não. Elas são inéditas e criadas para treino, imitando o estilo de
              enunciado e de alternativas da FGV. Cada questão vem com
              comentário e fundamento legal para você conferir.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lembretes">
            <AccordionTrigger>Como funcionam os lembretes?</AccordionTrigger>
            <AccordionContent>
              Você escolhe o horário do lembrete diário e ativa as notificações.
              Se o dia estiver acabando sem nenhum estudo registrado, a Rota
              envia um aviso para você não quebrar a sequência.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fases">
            <AccordionTrigger>Serve para a 2ª fase?</AccordionTrigger>
            <AccordionContent>
              O foco atual é a prova objetiva (1ª fase). A preparação para a
              peça prático-profissional está no nosso roteiro de evolução.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <p>
            Material de estudo independente, sem vínculo com a OAB ou com a FGV.
          </p>
        </div>
      </footer>
    </div>
  )
}
