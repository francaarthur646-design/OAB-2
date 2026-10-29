# Rota OAB — Roteiro do produto

Aplicativo instalável (PWA) de preparação para o Exame de Ordem (banca FGV):
cronograma de estudos, banco de questões, questões geradas por IA, simulados,
acompanhamento de desempenho e lembretes por notificação.

## Milestone 1 — Superfície do produto ✅

- Landing page com instalação do app e questão interativa de demonstração.
- Área do aluno (`/app`) com Painel, Cronograma, Questões (banco + gerador IA em prévia),
  Simulados (lista + prova cronometrada com cartão-resposta e correção), Desempenho e Lembretes.
- Manifest + service worker: app instalável, shell offline, permissão de notificação e notificação de teste.
- Todos os dados vêm de `src/lib/fixtures.ts`.

## Milestone 2 — Contas de aluno

- Netlify Identity (`@netlify/identity`): cadastro, login, recuperação de senha, login com Google.
- Proteger as rotas `/app/*`; onboarding com data da prova e horas disponíveis.

## Milestone 3 — Modelo de dados (Netlify Database + Drizzle)

- Tabelas: `students`, `disciplines`, `questions`, `answers`, `study_plans`, `study_blocks`,
  `simulados`, `simulado_attempts`, `reminder_settings`, `push_subscriptions`.
- Seed com as 17 disciplinas e as questões de exemplo.
- Trocar os imports de `fixtures.ts` por loaders/server functions.

## Milestone 4 — Banco de questões e simulados reais

- Persistir respostas e calcular acerto por disciplina/tema.
- Filtros por tema, dificuldade e "só as que errei".
- Simulados de 80 questões com a distribuição oficial; salvar tentativas e retomar provas em andamento.

## Milestone 5 — Cronograma inteligente

- Gerar o plano a partir da data da prova, horas disponíveis, peso das disciplinas e acerto do aluno.
- Reorganizar blocos atrasados; revisões espaçadas das questões erradas.

## Milestone 6 — Questões geradas por IA (estilo FGV)

- Server function via Netlify AI Gateway gerando questões em JSON validado por Zod
  (enunciado em caso concreto, 4 alternativas, gabarito, comentário, fundamento legal).
- Salvar as questões geradas no banco do aluno, marcar como "Gerada por IA", permitir reportar erro.
- Limite diário de gerações por aluno.

## Milestone 7 — Notificações push

- Web Push com chaves VAPID; salvar inscrições em `push_subscriptions`.
- Netlify Scheduled Function (a cada 15 min) que envia o lembrete diário no horário escolhido
  e o alerta "você ainda não estudou hoje" quando não há bloco concluído até o horário definido.
- Respeitar dias da semana e fuso horário do aluno.

## Milestone 8 — Evoluções

- Desempenho com histórico real, metas semanais e comparação com a nota de corte.
- Preparação para a 2ª fase (peças e questões discursivas com correção por IA).
