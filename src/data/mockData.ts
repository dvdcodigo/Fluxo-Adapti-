import {
  SubjectInfo,
  Task,
  SpacedReviewItem,
  WeeklyDay,
  KnowledgeGardenTopic,
  Flashcard,
} from '../types';

export const initialSubjects: SubjectInfo[] = [
  {
    id: 'sub-1',
    name: 'Direito Constitucional',
    color: '#6366f1',
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    darkAccentBg: 'dark:bg-indigo-950/60',
    darkAccentText: 'dark:text-indigo-300',
    totalTopics: 28,
    coveredTopics: 21,
  },
  {
    id: 'sub-2',
    name: 'Raciocínio Lógico & Algoritmos',
    color: '#0d9488',
    accentBg: 'bg-teal-50',
    accentText: 'text-teal-700',
    darkAccentBg: 'dark:bg-teal-950/60',
    darkAccentText: 'dark:text-teal-300',
    totalTopics: 24,
    coveredTopics: 17,
  },
  {
    id: 'sub-3',
    name: 'Língua Portuguesa',
    color: '#059669',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    darkAccentBg: 'dark:bg-emerald-950/60',
    darkAccentText: 'dark:text-emerald-300',
    totalTopics: 32,
    coveredTopics: 24,
  },
  {
    id: 'sub-4',
    name: 'Tecnologia & Dados',
    color: '#3b82f6',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    darkAccentBg: 'dark:bg-blue-950/60',
    darkAccentText: 'dark:text-blue-300',
    totalTopics: 30,
    coveredTopics: 18,
  },
  {
    id: 'sub-5',
    name: 'Economia & Finanças',
    color: '#8b5cf6',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    darkAccentBg: 'dark:bg-purple-950/60',
    darkAccentText: 'dark:text-purple-300',
    totalTopics: 20,
    coveredTopics: 9,
  },
  {
    id: 'sub-6',
    name: 'Gestão & Projetos',
    color: '#d97706',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    darkAccentBg: 'dark:bg-amber-950/60',
    darkAccentText: 'dark:text-amber-300',
    totalTopics: 16,
    coveredTopics: 13,
  },
];

const todayStr = new Date().toISOString().split('T')[0];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Controle Concentrado vs Difuso: ADI e ADC',
    subject: 'Direito Constitucional',
    estimatedMinutes: 45,
    energyLevel: 'alta',
    difficulty: 'desafiadora',
    status: 'pendente',
    scheduledDate: todayStr,
    notes: 'Aprofundar nos efeitos erga omnes e modulação temporal de efeitos pelo STF.',
  },
  {
    id: 'task-2',
    title: 'Estruturas de Dados: Árvores de Busca Balanceadas',
    subject: 'Raciocínio Lógico & Algoritmos',
    estimatedMinutes: 40,
    energyLevel: 'alta',
    difficulty: 'desafiadora',
    status: 'pendente',
    scheduledDate: todayStr,
    notes: 'Calcular rotações em árvores AVL e propriedades de balanceamento.',
  },
  {
    id: 'task-3',
    title: 'Interpretação Textual & Concordância Verbal em Questões',
    subject: 'Língua Portuguesa',
    estimatedMinutes: 30,
    energyLevel: 'media',
    difficulty: 'moderada',
    status: 'pendente',
    scheduledDate: todayStr,
    notes: 'Focar na partícula "se" como apassivadora vs índice de indeterminação.',
  },
  {
    id: 'task-4',
    title: 'Modelagem Entidade-Relacionamento e Normalização 3FN',
    subject: 'Tecnologia & Dados',
    estimatedMinutes: 35,
    energyLevel: 'media',
    difficulty: 'moderada',
    status: 'pendente',
    scheduledDate: todayStr,
  },
  {
    id: 'task-5',
    title: 'Revisão com Flashcards: Direitos e Garantias Fundamentais',
    subject: 'Direito Constitucional',
    estimatedMinutes: 15,
    energyLevel: 'baixa',
    difficulty: 'leve',
    status: 'pendente',
    scheduledDate: todayStr,
    isSpacedReview: true,
  },
  {
    id: 'task-6',
    title: 'Mapeamento Mental: Ciclo Scrum, Papéis e Cerimônias',
    subject: 'Gestão & Projetos',
    estimatedMinutes: 20,
    energyLevel: 'baixa',
    difficulty: 'leve',
    status: 'pendente',
    scheduledDate: todayStr,
  },
  {
    id: 'task-7',
    title: 'Leitura Acolhedora: Princípios da Administração Pública',
    subject: 'Direito Constitucional',
    estimatedMinutes: 25,
    actualMinutes: 25,
    energyLevel: 'baixa',
    difficulty: 'leve',
    status: 'concluida',
    scheduledDate: todayStr,
    completedAt: `${todayStr}T09:30:00Z`,
    questionsCount: 10,
    correctQuestions: 9,
    retentionRating: 'facil',
  },
];

export const sampleFlashcards: Flashcard[] = [
  {
    id: 'card-1',
    question: 'Qual é a principal diferença entre o Controle Difuso e o Controle Concentrado de Constitucionalidade no Brasil?',
    answer: 'O controle difuso pode ser exercido por qualquer juiz ou tribunal em caso concreto inter partes. O controle concentrado é privativo do STF por meio de ações diretas (ADI, ADC, ADPF) com eficácia erga omnes e efeito vinculante.',
    topic: 'Controle de Constitucionalidade',
    subject: 'Direito Constitucional',
    intervalDays: 7,
    reviewCount: 3,
  },
  {
    id: 'card-2',
    question: 'Na oração "Alugam-se casas", qual a função sintática de "casas" e qual o papel do "se"?',
    answer: '"Casas" é o sujeito paciente. O "se" funciona como partícula apassivadora (pronome apassivador), exigindo concordância no plural.',
    topic: 'Concordância Verbal & Partícula Se',
    subject: 'Língua Portuguesa',
    intervalDays: 4,
    reviewCount: 2,
  },
  {
    id: 'card-3',
    question: 'Qual a complexidade de tempo de busca em uma Árvore Binária de Busca equilibrada (AVL) no pior caso?',
    answer: 'O(log n), pois a árvore garante balanceamento estrito da altura após inserções e remoções.',
    topic: 'Estruturas de Dados',
    subject: 'Raciocínio Lógico & Algoritmos',
    intervalDays: 1,
    reviewCount: 1,
  },
  {
    id: 'card-4',
    question: 'Quais são as três condições essenciais para uma relação estar na 3ª Forma Normal (3FN)?',
    answer: '1. Estar na 2FN; 2. Não possuir dependências funcionais transitivas; ou seja, nenhum atributo não chave pode depender de outro atributo não chave.',
    topic: 'Normalização de Dados',
    subject: 'Tecnologia & Dados',
    intervalDays: 3,
    reviewCount: 2,
  },
  {
    id: 'card-5',
    question: 'Em macroeconomia, o que caracteriza a Curva de Phillips tradicional no curto prazo?',
    answer: 'A relação inversa entre inflação e taxa de desemprego: menor desemprego tende a gerar pressões inflacionárias mais altas no curto prazo.',
    topic: 'Inflação e Mercado de Trabalho',
    subject: 'Economia & Finanças',
    intervalDays: 14,
    reviewCount: 4,
  },
  {
    id: 'card-6',
    question: 'No framework Scrum, quem é o responsável exclusivo pela priorização do Product Backlog?',
    answer: 'O Product Owner (PO). Ele define o valor dos itens de trabalho e orienta as prioridades do time.',
    topic: 'Metodologia Scrum',
    subject: 'Gestão & Projetos',
    intervalDays: 30,
    reviewCount: 5,
  },
];

export const initialSpacedReviews: SpacedReviewItem[] = [
  {
    id: 'rev-1',
    subject: 'Direito Constitucional',
    topicTitle: 'Controle Concentrado vs Difuso (Efeitos STF)',
    stage: 'D+1',
    scheduledDate: todayStr,
    status: 'pronta',
    daysOverdueOrLeft: 0,
    flashcards: [sampleFlashcards[0]],
  },
  {
    id: 'rev-2',
    subject: 'Língua Portuguesa',
    topicTitle: 'Concordância Verbal com Partícula Apassivadora',
    stage: 'D+7',
    scheduledDate: todayStr,
    status: 'pronta',
    daysOverdueOrLeft: 0,
    flashcards: [sampleFlashcards[1]],
  },
  {
    id: 'rev-3',
    subject: 'Raciocínio Lógico & Algoritmos',
    topicTitle: 'Árvores Binárias Balanceadas (AVL)',
    stage: 'D+1',
    scheduledDate: todayStr,
    status: 'pronta',
    daysOverdueOrLeft: 0,
    flashcards: [sampleFlashcards[2]],
  },
  {
    id: 'rev-4',
    subject: 'Tecnologia & Dados',
    topicTitle: 'Normalização Relacional (1FN a 3FN)',
    stage: 'D+7',
    scheduledDate: todayStr,
    status: 'pronta',
    daysOverdueOrLeft: 0,
    flashcards: [sampleFlashcards[3]],
  },
  {
    id: 'rev-5',
    subject: 'Economia & Finanças',
    topicTitle: 'Curva de Phillips e Política Monetária',
    stage: 'D+30',
    scheduledDate: '2026-11-05',
    status: 'agendada',
    daysOverdueOrLeft: 3,
    flashcards: [sampleFlashcards[4]],
  },
  {
    id: 'rev-6',
    subject: 'Gestão & Projetos',
    topicTitle: 'Artefatos do Scrum & Sprint Planning',
    stage: 'D+60',
    scheduledDate: '2026-11-12',
    status: 'agendada',
    daysOverdueOrLeft: 10,
    flashcards: [sampleFlashcards[5]],
  },
];

export const initialGardenTopics: KnowledgeGardenTopic[] = [
  {
    id: 'gt-1',
    subject: 'Direito Constitucional',
    title: 'Direitos e Garantias Fundamentais',
    retentionScore: 92,
    stage: 'florescendo',
    lastStudied: 'Há 2 dias',
    sessionsCount: 6,
  },
  {
    id: 'gt-2',
    subject: 'Direito Constitucional',
    title: 'Princípios da Administração Pública (LIMPE)',
    retentionScore: 88,
    stage: 'florescendo',
    lastStudied: 'Hoje',
    sessionsCount: 4,
  },
  {
    id: 'gt-3',
    subject: 'Direito Constitucional',
    title: 'Controle de Constitucionalidade',
    retentionScore: 68,
    stage: 'crescendo',
    lastStudied: 'Ontem',
    sessionsCount: 3,
  },
  {
    id: 'gt-4',
    subject: 'Raciocínio Lógico & Algoritmos',
    title: 'Lógica Proposicional & Equivalências',
    retentionScore: 90,
    stage: 'florescendo',
    lastStudied: 'Há 3 dias',
    sessionsCount: 5,
  },
  {
    id: 'gt-5',
    subject: 'Raciocínio Lógico & Algoritmos',
    title: 'Árvores AVL e Balanceamento',
    retentionScore: 48,
    stage: 'broto',
    lastStudied: 'Há 4 dias',
    sessionsCount: 2,
  },
  {
    id: 'gt-6',
    subject: 'Língua Portuguesa',
    title: 'Concordância Nominal e Verbal',
    retentionScore: 85,
    stage: 'florescendo',
    lastStudied: 'Há 1 dia',
    sessionsCount: 5,
  },
  {
    id: 'gt-7',
    subject: 'Língua Portuguesa',
    title: 'Regência e Emprego do Sinal da Crase',
    retentionScore: 74,
    stage: 'crescendo',
    lastStudied: 'Há 2 dias',
    sessionsCount: 3,
  },
  {
    id: 'gt-8',
    subject: 'Tecnologia & Dados',
    title: 'Consultas SQL e Junções (JOINs)',
    retentionScore: 82,
    stage: 'florescendo',
    lastStudied: 'Há 5 dias',
    sessionsCount: 4,
  },
  {
    id: 'gt-9',
    subject: 'Tecnologia & Dados',
    title: 'Normalização e Modelagem 3FN',
    retentionScore: 62,
    stage: 'crescendo',
    lastStudied: 'Ontem',
    sessionsCount: 2,
  },
  {
    id: 'gt-10',
    subject: 'Economia & Finanças',
    title: 'Taxa Selic, Copom e Meta de Inflação',
    retentionScore: 35,
    stage: 'broto',
    lastStudied: 'Há 6 dias',
    sessionsCount: 1,
  },
  {
    id: 'gt-11',
    subject: 'Economia & Finanças',
    title: 'Balanço Patrimonial e Liquidez',
    retentionScore: 20,
    stage: 'semente',
    lastStudied: 'Não iniciado',
    sessionsCount: 0,
  },
  {
    id: 'gt-12',
    subject: 'Gestão & Projetos',
    title: 'Scrum, Kanban e Práticas Ágeis',
    retentionScore: 94,
    stage: 'florescendo',
    lastStudied: 'Há 2 dias',
    sessionsCount: 6,
  },
];

export const getWeeklyScheduleDays = (tasks: Task[]): WeeklyDay[] => {
  const days: { name: string; offset: number }[] = [
    { name: 'Seg', offset: -4 },
    { name: 'Ter', offset: -3 },
    { name: 'Qua', offset: -2 },
    { name: 'Qui', offset: -1 },
    { name: 'Sex', offset: 0 },
    { name: 'Sáb', offset: 1 },
    { name: 'Dom', offset: 2 },
  ];

  const now = new Date();

  return days.map(d => {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + d.offset);
    const dateIso = targetDate.toISOString().split('T')[0];
    const isToday = d.offset === 0;
    const isPast = d.offset < 0;

    const dayTasks = tasks.filter(t => t.scheduledDate === dateIso);

    // Mock realistic past study targets
    let targetMin = 90;
    let completedMin = 0;
    let completed = false;

    if (d.name === 'Seg') {
      targetMin = 100;
      completedMin = 105;
      completed = true;
    } else if (d.name === 'Ter') {
      targetMin = 90;
      completedMin = 90;
      completed = true;
    } else if (d.name === 'Qua') {
      targetMin = 120;
      completedMin = 115;
      completed = true;
    } else if (d.name === 'Qui') {
      targetMin = 75;
      completedMin = 80;
      completed = true;
    } else if (isToday) {
      targetMin = 120;
      completedMin = dayTasks.filter(t => t.status === 'concluida').reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes), 0);
      completed = false;
    } else {
      // Future
      targetMin = d.name === 'Sáb' ? 60 : 40;
      completedMin = 0;
      completed = false;
    }

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const displayDate = `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`;

    return {
      dayName: d.name,
      fullDate: dateIso,
      displayDate,
      isToday,
      isPast,
      completed,
      targetMinutes: targetMin,
      completedMinutes: completedMin,
      tasks: dayTasks,
    };
  });
};
