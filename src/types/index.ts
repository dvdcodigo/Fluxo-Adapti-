export type CognitiveEnergy = 'alta' | 'media' | 'baixa';

export type TaskDifficulty = 'leve' | 'moderada' | 'desafiadora';

export type TaskStatus = 'pendente' | 'concluida' | 'adiada';

export type RetentionRating = 'facil' | 'medio' | 'dificil';

export type SubjectCategory = string;

export interface SubjectInfo {
  id: string;
  name: SubjectCategory;
  color: string; // Tailwind color token or hex
  accentBg: string;
  accentText: string;
  darkAccentBg: string;
  darkAccentText: string;
  totalTopics: number;
  coveredTopics: number;
}

export interface Task {
  id: string;
  title: string;
  subject: SubjectCategory;
  estimatedMinutes: number;
  actualMinutes?: number;
  energyLevel: CognitiveEnergy;
  difficulty: TaskDifficulty;
  status: TaskStatus;
  scheduledDate: string; // YYYY-MM-DD
  completedAt?: string;
  notes?: string;
  questionsCount?: number;
  correctQuestions?: number;
  retentionRating?: RetentionRating;
  isSpacedReview?: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  subject: SubjectCategory;
  difficultyRating?: 'facil' | 'bom' | 'dificil' | 'esqueci';
  intervalDays: number;
  reviewCount: number;
}

export interface SpacedReviewItem {
  id: string;
  subject: SubjectCategory;
  topicTitle: string;
  stage: 'D+1' | 'D+7' | 'D+30' | 'D+60';
  scheduledDate: string;
  status: 'pronta' | 'concluida' | 'agendada';
  daysOverdueOrLeft: number; // 0 = hoje, >0 dias restantes, <0 dias passados
  flashcards: Flashcard[];
}

export interface WeeklyDay {
  dayName: string; // 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb' | 'Dom'
  fullDate: string; // YYYY-MM-DD
  displayDate: string; // '02 Nov'
  isToday: boolean;
  isPast: boolean;
  completed: boolean;
  targetMinutes: number;
  completedMinutes: number;
  tasks: Task[];
}

export interface KnowledgeGardenTopic {
  id: string;
  subject: SubjectCategory;
  title: string;
  retentionScore: number; // 0 to 100
  stage: 'semente' | 'broto' | 'crescendo' | 'florescendo';
  lastStudied: string;
  sessionsCount: number;
}

export interface SessionLog {
  id: string;
  taskId?: string;
  taskTitle: string;
  subject: SubjectCategory;
  durationMinutes: number;
  mode: 'pomodoro' | 'fluxo_livre';
  timestamp: string;
  questionsTotal?: number;
  questionsCorrect?: number;
  retentionRating?: RetentionRating;
  notes?: string;
}
