/**
 * Stubbed data for the Rota OAB product surface.
 * Everything here is static sample data. A later milestone (see PLAN.md)
 * replaces these exports with Netlify Database queries per student.
 */

export type DisciplineId =
  | 'etica'
  | 'constitucional'
  | 'civil'
  | 'processo-civil'
  | 'penal'
  | 'processo-penal'
  | 'trabalho'
  | 'processo-trabalho'
  | 'administrativo'
  | 'tributario'
  | 'empresarial'
  | 'consumidor'
  | 'eca'
  | 'ambiental'
  | 'direitos-humanos'
  | 'filosofia'
  | 'internacional'

export type Discipline = {
  id: DisciplineId
  name: string
  /** Approximate number of questions in the 1st phase of the FGV exam. */
  examWeight: number
  /** Student accuracy so far, 0–100. */
  accuracy: number
  answered: number
}

export const disciplines: Discipline[] = [
  {
    id: 'etica',
    name: 'Ética Profissional',
    examWeight: 8,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'constitucional',
    name: 'Direito Constitucional',
    examWeight: 6,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'civil',
    name: 'Direito Civil',
    examWeight: 6,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'processo-civil',
    name: 'Processo Civil',
    examWeight: 6,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'penal',
    name: 'Direito Penal',
    examWeight: 6,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'processo-penal',
    name: 'Processo Penal',
    examWeight: 6,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'trabalho',
    name: 'Direito do Trabalho',
    examWeight: 5,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'processo-trabalho',
    name: 'Processo do Trabalho',
    examWeight: 5,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'administrativo',
    name: 'Direito Administrativo',
    examWeight: 5,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'tributario',
    name: 'Direito Tributário',
    examWeight: 5,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'empresarial',
    name: 'Direito Empresarial',
    examWeight: 4,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'consumidor',
    name: 'Direito do Consumidor',
    examWeight: 2,
    accuracy: 0,
    answered: 0,
  },
  { id: 'eca', name: 'ECA', examWeight: 2, accuracy: 0, answered: 0 },
  {
    id: 'ambiental',
    name: 'Direito Ambiental',
    examWeight: 2,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'direitos-humanos',
    name: 'Direitos Humanos',
    examWeight: 2,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'filosofia',
    name: 'Filosofia do Direito',
    examWeight: 2,
    accuracy: 0,
    answered: 0,
  },
  {
    id: 'internacional',
    name: 'Direito Internacional',
    examWeight: 2,
    accuracy: 0,
    answered: 0,
  },
]

export function disciplineName(id: DisciplineId) {
  return disciplines.find((d) => d.id === id)?.name ?? id
}

export type Question = {
  id: string
  discipline: DisciplineId
  topic: string
  source: 'Inspirada FGV' | 'Gerada por IA'
  statement: string
  options: { letter: 'A' | 'B' | 'C' | 'D'; text: string }[]
  answer: 'A' | 'B' | 'C' | 'D'
  explanation: string
  legalBasis: string
}

export const questions: Question[] = [
  {
    id: 'q-etica-01',
    discipline: 'etica',
    topic: 'Direitos e prerrogativas do advogado',
    source: 'Inspirada FGV',
    statement:
      'Lúcia, advogada, é procurada pela família de Roberto, preso em flagrante e recolhido em estabelecimento prisional. Ela ainda não possui procuração outorgada por Roberto. Ao chegar ao presídio, o diretor nega o acesso, sob o argumento de que a advogada não comprovou estar constituída. Diante do Estatuto da Advocacia, assinale a afirmativa correta.',
    options: [
      {
        letter: 'A',
        text: 'A negativa é legítima, pois a comunicação com o preso depende da apresentação prévia de procuração.',
      },
      {
        letter: 'B',
        text: 'A negativa é ilegítima, pois é direito do advogado comunicar-se com seus clientes presos, pessoal e reservadamente, ainda que sem procuração.',
      },
      {
        letter: 'C',
        text: 'A negativa é ilegítima apenas se o preso estiver incomunicável por decisão judicial.',
      },
      {
        letter: 'D',
        text: 'A negativa é legítima, salvo se a advogada estiver acompanhada de representante da OAB.',
      },
    ],
    answer: 'B',
    explanation:
      'O Estatuto garante ao advogado o direito de comunicar-se com seus clientes, pessoal e reservadamente, mesmo sem procuração, quando estes se acharem presos, detidos ou recolhidos, ainda que considerados incomunicáveis.',
    legalBasis: 'Lei nº 8.906/94, art. 7º, III',
  },
  {
    id: 'q-const-01',
    discipline: 'constitucional',
    topic: 'Processo legislativo — medidas provisórias',
    source: 'Inspirada FGV',
    statement:
      'Diante do aumento de furtos de cabos elétricos, o Presidente da República edita medida provisória que aumenta a pena do crime de furto quando praticado contra a infraestrutura de energia. Sobre a constitucionalidade da medida, assinale a afirmativa correta.',
    options: [
      {
        letter: 'A',
        text: 'É constitucional, desde que demonstradas relevância e urgência.',
      },
      {
        letter: 'B',
        text: 'É constitucional, mas só produz efeitos após aprovação pelo Senado Federal.',
      },
      {
        letter: 'C',
        text: 'É inconstitucional, pois é vedada a edição de medida provisória sobre direito penal.',
      },
      {
        letter: 'D',
        text: 'É inconstitucional, pois matéria penal exige lei complementar.',
      },
    ],
    answer: 'C',
    explanation:
      'A Constituição veda expressamente a edição de medidas provisórias sobre matéria relativa a direito penal, processual penal e processual civil. Matéria penal exige lei ordinária, não complementar.',
    legalBasis: 'CF/88, art. 62, § 1º, I, “b”',
  },
  {
    id: 'q-civil-01',
    discipline: 'civil',
    topic: 'Prescrição',
    source: 'Inspirada FGV',
    statement:
      'Marcos teve seu veículo abalroado por Pedro, que avançou o sinal vermelho. Passados dois anos e meio do acidente, Marcos procura um advogado para ajuizar ação de reparação de danos. Sobre o prazo prescricional, assinale a afirmativa correta.',
    options: [
      {
        letter: 'A',
        text: 'A pretensão está prescrita, pois o prazo é de dois anos.',
      },
      {
        letter: 'B',
        text: 'A pretensão não está prescrita, pois o prazo de reparação civil é de três anos.',
      },
      {
        letter: 'C',
        text: 'A pretensão não está prescrita, pois aplica-se o prazo geral de dez anos.',
      },
      {
        letter: 'D',
        text: 'A pretensão não está prescrita, pois o prazo é de cinco anos.',
      },
    ],
    answer: 'B',
    explanation:
      'Prescreve em três anos a pretensão de reparação civil. Como transcorreram dois anos e meio, ainda é possível ajuizar a ação.',
    legalBasis: 'Código Civil, art. 206, § 3º, V',
  },
  {
    id: 'q-penal-01',
    discipline: 'penal',
    topic: 'Crime impossível',
    source: 'Inspirada FGV',
    statement:
      'Joana, querendo matar seu desafeto, dispara contra ele com uma arma de brinquedo que acreditava ser verdadeira. A vítima nada sofre. Denunciada por tentativa de homicídio, Joana procura sua orientação. Assinale a tese defensiva correta.',
    options: [
      {
        letter: 'A',
        text: 'Desistência voluntária, pois o resultado não se produziu.',
      },
      {
        letter: 'B',
        text: 'Arrependimento eficaz, pois a vítima não sofreu lesão.',
      },
      {
        letter: 'C',
        text: 'Crime impossível, por absoluta ineficácia do meio empregado.',
      },
      {
        letter: 'D',
        text: 'Tentativa punível com redução de um a dois terços da pena.',
      },
    ],
    answer: 'C',
    explanation:
      'Não se pune a tentativa quando, por ineficácia absoluta do meio ou por absoluta impropriedade do objeto, é impossível consumar-se o crime. Uma arma de brinquedo é meio absolutamente ineficaz para matar.',
    legalBasis: 'Código Penal, art. 17',
  },
  {
    id: 'q-pc-01',
    discipline: 'processo-civil',
    topic: 'Resposta do réu — prazos',
    source: 'Inspirada FGV',
    statement:
      'Em ação de cobrança pelo procedimento comum, a audiência de conciliação foi realizada sem acordo. O réu, representado por advogado particular, pergunta qual o prazo para apresentar contestação. Assinale a afirmativa correta.',
    options: [
      { letter: 'A', text: '15 dias corridos, contados da citação.' },
      {
        letter: 'B',
        text: '15 dias úteis, contados da audiência de conciliação sem acordo.',
      },
      {
        letter: 'C',
        text: '30 dias úteis, contados da audiência de conciliação sem acordo.',
      },
      {
        letter: 'D',
        text: '10 dias úteis, contados da juntada do mandado de citação.',
      },
    ],
    answer: 'B',
    explanation:
      'O réu pode oferecer contestação no prazo de 15 dias, cujo termo inicial é a data da audiência de conciliação quando não houver autocomposição. Prazos processuais em dias são contados apenas em dias úteis.',
    legalBasis: 'CPC, arts. 219 e 335, I',
  },
  {
    id: 'q-trab-01',
    discipline: 'trabalho',
    topic: 'Férias',
    source: 'Inspirada FGV',
    statement:
      'Carla trabalha há um ano em uma empresa de tecnologia e, durante o período aquisitivo, teve quatro faltas injustificadas. Ela consulta você sobre a duração de suas férias. Assinale a afirmativa correta.',
    options: [
      { letter: 'A', text: 'Carla terá direito a 30 dias corridos de férias.' },
      { letter: 'B', text: 'Carla terá direito a 24 dias corridos de férias.' },
      { letter: 'C', text: 'Carla terá direito a 18 dias corridos de férias.' },
      {
        letter: 'D',
        text: 'Carla perdeu o direito às férias em razão das faltas.',
      },
    ],
    answer: 'A',
    explanation:
      'O empregado que tiver até cinco faltas injustificadas no período aquisitivo tem direito a 30 dias corridos de férias.',
    legalBasis: 'CLT, art. 130, I',
  },
  {
    id: 'q-trib-01',
    discipline: 'tributario',
    topic: 'Limitações ao poder de tributar — anterioridade',
    source: 'Inspirada FGV',
    statement:
      'Lei federal publicada em 20 de dezembro aumenta a alíquota do Imposto de Renda. Um cliente pergunta a partir de quando o aumento poderá ser exigido. Assinale a afirmativa correta.',
    options: [
      {
        letter: 'A',
        text: 'Imediatamente, pois o IR é exceção a todas as anterioridades.',
      },
      {
        letter: 'B',
        text: 'A partir de 1º de janeiro do ano seguinte, pois o IR é exceção apenas à anterioridade nonagesimal.',
      },
      {
        letter: 'C',
        text: 'Somente após 90 dias da publicação, pois o IR é exceção à anterioridade anual.',
      },
      {
        letter: 'D',
        text: 'A partir de 1º de janeiro, desde que decorridos 90 dias da publicação.',
      },
    ],
    answer: 'B',
    explanation:
      'O Imposto de Renda observa a anterioridade anual, mas é exceção à anterioridade nonagesimal. Assim, o aumento pode ser cobrado a partir de 1º de janeiro do exercício seguinte.',
    legalBasis: 'CF/88, art. 150, III, “b” e “c”, e § 1º',
  },
  {
    id: 'q-cdc-01',
    discipline: 'consumidor',
    topic: 'Direito de arrependimento',
    source: 'Inspirada FGV',
    statement:
      'Rafael comprou um fone de ouvido em uma loja virtual e o recebeu em casa. Quatro dias depois, desistiu da compra, embora o produto não tivesse defeito. A loja recusou a devolução. Assinale a afirmativa correta.',
    options: [
      {
        letter: 'A',
        text: 'A recusa é lícita, pois o direito de arrependimento exige vício do produto.',
      },
      {
        letter: 'B',
        text: 'A recusa é ilícita, pois o consumidor pode desistir em até 7 dias do recebimento, com devolução dos valores pagos.',
      },
      {
        letter: 'C',
        text: 'A recusa é ilícita, mas o consumidor deve arcar com o frete de devolução.',
      },
      {
        letter: 'D',
        text: 'A recusa é lícita, pois o prazo de arrependimento é de 48 horas.',
      },
    ],
    answer: 'B',
    explanation:
      'Nas contratações fora do estabelecimento comercial, o consumidor pode desistir no prazo de 7 dias a contar da assinatura ou do recebimento do produto, com devolução imediata e monetariamente atualizada dos valores pagos.',
    legalBasis: 'CDC, art. 49 e parágrafo único',
  },
]

/** Sample output shown by the AI generator preview until the real endpoint exists. */
export const aiSampleQuestion: Question = {
  id: 'ia-preview-01',
  discipline: 'etica',
  topic: 'Publicidade na advocacia',
  source: 'Gerada por IA',
  statement:
    'O advogado Henrique, recém-inscrito na OAB, pretende divulgar seu escritório em suas redes sociais. Ele planeja publicar a frase “o advogado que mais ganha causas na cidade” acompanhada dos valores de honorários praticados. À luz do Código de Ética e Disciplina da OAB, assinale a afirmativa correta.',
  options: [
    {
      letter: 'A',
      text: 'A publicação é permitida, pois a publicidade nas redes sociais é livre.',
    },
    {
      letter: 'B',
      text: 'A publicação é vedada, pois a publicidade deve ter caráter meramente informativo e é proibido divulgar valores de serviços ou promessas de resultado.',
    },
    {
      letter: 'C',
      text: 'A publicação é permitida apenas se paga por impulsionamento.',
    },
    {
      letter: 'D',
      text: 'A publicação é vedada somente quanto à menção dos honorários.',
    },
  ],
  answer: 'B',
  explanation:
    'A publicidade profissional do advogado tem caráter meramente informativo e deve primar pela discrição e sobriedade, sendo vedadas a menção a valores de serviços e expressões que configurem captação de clientela ou promessa de resultado.',
  legalBasis: 'Código de Ética e Disciplina da OAB, arts. 39 e 40',
}

export type Simulado = {
  id: string
  title: string
  description: string
  questions: number
  minutes: number
  status: 'novo' | 'concluido' | 'em-andamento'
  score?: number
  completedAt?: string
}

export const simulados: Simulado[] = [
  {
    id: 'rapido-etica',
    title: 'Treino relâmpago',
    description:
      'Oito questões mistas no padrão FGV para aquecer antes da revisão.',
    questions: 8,
    minutes: 24,
    status: 'novo',
  },
  {
    id: 'completo-03',
    title: 'Simulado completo nº 3',
    description:
      'Prova integral da 1ª fase com a distribuição oficial de disciplinas.',
    questions: 80,
    minutes: 300,
    status: 'novo',
  },
  {
    id: 'completo-02',
    title: 'Simulado completo nº 2',
    description:
      'Prova integral da 1ª fase com a distribuição oficial de disciplinas.',
    questions: 80,
    minutes: 300,
    status: 'novo',
  },
  {
    id: 'completo-01',
    title: 'Simulado completo nº 1',
    description:
      'Prova integral da 1ª fase com a distribuição oficial de disciplinas.',
    questions: 80,
    minutes: 300,
    status: 'novo',
  },
  {
    id: 'pontos-fracos',
    title: 'Foco nos pontos fracos',
    description:
      'Tributário, Processo do Trabalho e Empresarial, disciplinas que costumam derrubar a nota.',
    questions: 30,
    minutes: 90,
    status: 'novo',
  },
]

/** Score in full simulados over time (passing line is 40/80). Empty until the first one is finished. */
export const scoreHistory: { label: string; score: number }[] = []

export const student = {
  firstName: 'Arthur',
  examName: '46º Exame de Ordem',
  examDate: '2027-03-14',
  questionsAnswered: 0,
  overallAccuracy: 0,
}

export function daysUntil(isoDate: string, from = new Date()) {
  const target = new Date(isoDate + 'T00:00:00')
  return Math.max(
    0,
    Math.ceil((target.getTime() - from.getTime()) / 86_400_000),
  )
}
