import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  CognitiveEnergy,
  Task,
  SpacedReviewItem,
  KnowledgeGardenTopic,
  SubjectInfo,
  SessionLog,
  RetentionRating,
  SubjectCategory,
} from '../types';
import {
  initialSubjects,
  initialTasks,
  initialSpacedReviews,
  initialGardenTopics,
} from '../data/mockData';

export type AppTab = 'hoje' | 'foco' | 'revisoes' | 'cronograma';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  cognitiveEnergy: CognitiveEnergy;
  setCognitiveEnergy: (energy: CognitiveEnergy) => void;
  tasks: Task[];
  filteredTodayTasks: Task[];
  activeFocusTask: Task | null;
  setActiveFocusTask: (task: Task | null) => void;
  startFocusOnTask: (task: Task) => void;
  spacedReviews: SpacedReviewItem[];
  gardenTopics: KnowledgeGardenTopic[];
  subjects: SubjectInfo[];
  sessionLogs: SessionLog[];
  lastSavedAt: string;
  isRescueModalOpen: boolean;
  setIsRescueModalOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isClearModalOpen: boolean;
  setIsClearModalOpen: (open: boolean) => void;
  isSubjectModalOpen: boolean;
  setIsSubjectModalOpen: (open: boolean) => void;
  isBackupModalOpen: boolean;
  setIsBackupModalOpen: (open: boolean) => void;
  toastMessage: { text: string; type?: 'info' | 'success' } | null;
  showToast: (text: string, type?: 'info' | 'success') => void;
  recalculateDayRescueMode: () => { movedCount: number; message: string };
  completeTask: (
    taskId: string,
    data?: {
      actualMinutes?: number;
      questionsCount?: number;
      correctQuestions?: number;
      retentionRating?: RetentionRating;
      notes?: string;
    }
  ) => void;
  addNewTask: (task: {
    title: string;
    subject: SubjectCategory;
    estimatedMinutes: number;
    energyLevel: CognitiveEnergy;
    difficulty: 'leve' | 'moderada' | 'desafiadora';
    notes?: string;
  }) => void;
  deleteTask: (taskId: string) => void;
  updateTaskNotes: (taskId: string, notes: string) => void;
  completeReview: (reviewId: string) => void;
  reviewFlashcard: (
    reviewId: string,
    cardId: string,
    rating: 'facil' | 'bom' | 'dificil' | 'esqueci'
  ) => void;
  addCustomSubject: (data: { name: string; totalTopics?: number; color?: string }) => SubjectInfo;
  deleteSubject: (subjectId: string) => void;
  addGardenTopic: (data: { subject: string; title: string; initialScore?: number }) => void;
  deleteGardenTopic: (topicId: string) => void;
  clearAllData: () => void;
  resetToDefaults: () => void;
  exportBackup: () => void;
  importBackup: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  INITIALIZED: 'fluxo_adapti_initialized_v2',
  THEME: 'fluxo_adapti_theme',
  ENERGY: 'fluxo_adapti_energy',
  TAB: 'fluxo_adapti_active_tab',
  TASKS: 'fluxo_adapti_tasks',
  REVIEWS: 'fluxo_adapti_reviews',
  GARDEN: 'fluxo_adapti_garden',
  SUBJECTS: 'fluxo_adapti_subjects',
  LOGS: 'fluxo_adapti_logs',
  FOCUS_TASK_ID: 'fluxo_adapti_focus_task_id',
};

const PALETTE_COLORS = [
  { color: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-950/60', darkText: 'dark:text-indigo-300' },
  { color: '#059669', bg: 'bg-emerald-50', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-950/60', darkText: 'dark:text-emerald-300' },
  { color: '#0d9488', bg: 'bg-teal-50', text: 'text-teal-700', darkBg: 'dark:bg-teal-950/60', darkText: 'dark:text-teal-300' },
  { color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', darkBg: 'dark:bg-blue-950/60', darkText: 'dark:text-blue-300' },
  { color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-700', darkBg: 'dark:bg-purple-950/60', darkText: 'dark:text-purple-300' },
  { color: '#e11d48', bg: 'bg-rose-50', text: 'text-rose-700', darkBg: 'dark:bg-rose-950/60', darkText: 'dark:text-rose-300' },
  { color: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700', darkBg: 'dark:bg-amber-950/60', darkText: 'dark:text-amber-300' },
  { color: '#0284c7', bg: 'bg-sky-50', text: 'text-sky-700', darkBg: 'dark:bg-sky-950/60', darkText: 'dark:text-sky-300' },
];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null && raw !== undefined) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Erro ao carregar dados locais para ${key}:`, err);
  }
  return fallback;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if first-time ever on this browser
  const isFirstTime = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.INITIALIZED) === null;

  // Initialize and ensure seed data is committed to disk on first run
  if (isFirstTime) {
    try {
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialSpacedReviews));
      localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(initialGardenTopics));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    } catch {
      // ignore
    }
  }

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Active navigation tab
  const [activeTab, setActiveTabState] = useState<AppTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TAB);
    if (saved === 'hoje' || saved === 'foco' || saved === 'revisoes' || saved === 'cronograma') {
      return saved as AppTab;
    }
    return 'hoje';
  });

  const setActiveTab = (tab: AppTab) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEYS.TAB, tab);
  };

  // Cognitive Energy Selector: 'alta' | 'media' | 'baixa'
  const [cognitiveEnergy, setCognitiveEnergyState] = useState<CognitiveEnergy>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ENERGY);
    return (saved as CognitiveEnergy) || 'media';
  });

  // Subjects state (customizable and persisted!)
  const [subjects, setSubjects] = useState<SubjectInfo[]>(() => {
    return loadFromStorage(STORAGE_KEYS.SUBJECTS, initialSubjects);
  });

  // Tasks state (persisted, respects empty array if user cleared!)
  const [tasks, setTasks] = useState<Task[]>(() => {
    return loadFromStorage(STORAGE_KEYS.TASKS, initialTasks);
  });

  // Active focus task (if selected)
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEYS.FOCUS_TASK_ID);
    if (!savedId) return null;
    const all = loadFromStorage<Task[]>(STORAGE_KEYS.TASKS, initialTasks);
    return all.find(t => t.id === savedId) || null;
  });

  // Spaced reviews state
  const [spacedReviews, setSpacedReviews] = useState<SpacedReviewItem[]>(() => {
    return loadFromStorage(STORAGE_KEYS.REVIEWS, initialSpacedReviews);
  });

  // Knowledge Garden topics state
  const [gardenTopics, setGardenTopics] = useState<KnowledgeGardenTopic[]>(() => {
    return loadFromStorage(STORAGE_KEYS.GARDEN, initialGardenTopics);
  });

  // Session Logs
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => {
    return loadFromStorage(STORAGE_KEYS.LOGS, []);
  });

  // Last saved time indicator
  const [lastSavedAt, setLastSavedAt] = useState<string>('Salvo agora');

  // Modals
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Friendly toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'info' | 'success' } | null>(null);

  const showToast = useCallback((text: string, type: 'info' | 'success' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  // Theme synchronization to html class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setCognitiveEnergy = (energy: CognitiveEnergy) => {
    setCognitiveEnergyState(energy);
    localStorage.setItem(STORAGE_KEYS.ENERGY, energy);
  };

  const updateSaveTimestamp = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLastSavedAt(`Salvo às ${timeStr}`);
  };

  // Immediate persistence effects: every state change writes safely to localStorage!
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    updateSaveTimestamp();
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    updateSaveTimestamp();
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(spacedReviews));
    updateSaveTimestamp();
  }, [spacedReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(gardenTopics));
    updateSaveTimestamp();
  }, [gardenTopics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sessionLogs));
    updateSaveTimestamp();
  }, [sessionLogs]);

  useEffect(() => {
    if (activeFocusTask) {
      localStorage.setItem(STORAGE_KEYS.FOCUS_TASK_ID, activeFocusTask.id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.FOCUS_TASK_ID);
    }
  }, [activeFocusTask]);

  // Dynamic sorting and filtering for today's tasks based on cognitive energy
  // Includes tasks scheduled for today OR unfinished pending tasks from previous days so nothing is lost upon opening the app!
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredTodayTasks = useMemo(() => {
    const todayTasks = tasks.filter(t => {
      // Direct today match
      if (t.scheduledDate === todayStr) return true;
      // Also keep pending tasks from past dates visible on "Hoje" so the user never loses them!
      if (t.status === 'pendente' && t.scheduledDate < todayStr) return true;
      return false;
    });

    return [...todayTasks].sort((a, b) => {
      if (a.status === 'concluida' && b.status !== 'concluida') return 1;
      if (b.status === 'concluida' && a.status !== 'concluida') return -1;

      const energyWeight = {
        alta: { alta: 3, media: 2, baixa: 1 },
        media: { media: 3, alta: 2, baixa: 1 },
        baixa: { baixa: 3, media: 2, alta: 1 },
      }[cognitiveEnergy];

      const scoreA = energyWeight[a.energyLevel] || 0;
      const scoreB = energyWeight[b.energyLevel] || 0;

      return scoreB - scoreA;
    });
  }, [tasks, cognitiveEnergy, todayStr]);

  const startFocusOnTask = (task: Task) => {
    setActiveFocusTask(task);
    setActiveTab('foco');
  };

  // Add custom subject / tema
  const addCustomSubject = useCallback(
    ({ name, totalTopics = 12, color }: { name: string; totalTopics?: number; color?: string }): SubjectInfo => {
      const trimmed = name.trim();
      const existing = subjects.find(s => s.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        return existing;
      }

      const paletteIndex = subjects.length % PALETTE_COLORS.length;
      const palette = PALETTE_COLORS[paletteIndex];

      const newSubject: SubjectInfo = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: trimmed,
        color: color || palette.color,
        accentBg: palette.bg,
        accentText: palette.text,
        darkAccentBg: palette.darkBg,
        darkAccentText: palette.darkText,
        totalTopics: Math.max(1, totalTopics),
        coveredTopics: 0,
      };

      setSubjects(prev => {
        const next = [...prev, newSubject];
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(next));
        return next;
      });

      showToast(`Tema "${trimmed}" adicionado e salvo com sucesso!`, 'success');
      return newSubject;
    },
    [subjects, showToast]
  );

  const deleteSubject = (subjectId: string) => {
    const target = subjects.find(s => s.id === subjectId);
    if (!target) return;
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    showToast(`Tema "${target.name}" removido.`, 'info');
  };

  // Add topic to Knowledge Garden
  const addGardenTopic = ({
    subject,
    title,
    initialScore = 15,
  }: {
    subject: string;
    title: string;
    initialScore?: number;
  }) => {
    const trimmedTitle = title.trim();
    addCustomSubject({ name: subject });

    const newTopic: KnowledgeGardenTopic = {
      id: `gt-${Date.now()}`,
      subject,
      title: trimmedTitle,
      retentionScore: initialScore,
      stage: initialScore >= 80 ? 'florescendo' : initialScore >= 55 ? 'crescendo' : initialScore >= 30 ? 'broto' : 'semente',
      lastStudied: 'Hoje',
      sessionsCount: 0,
    };

    setGardenTopics(prev => {
      const next = [newTopic, ...prev];
      localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(next));
      return next;
    });

    setSubjects(prev =>
      prev.map(s => (s.name.toLowerCase() === subject.toLowerCase() ? { ...s, totalTopics: s.totalTopics + 1 } : s))
    );

    showToast(`Tópico "${trimmedTitle}" plantado e salvo no Jardim!`, 'success');
  };

  const deleteGardenTopic = (topicId: string) => {
    setGardenTopics(prev => prev.filter(g => g.id !== topicId));
    showToast('Tópico removido do Jardim.', 'info');
  };

  // Algoritmo do "Modo Socorro"
  const recalculateDayRescueMode = () => {
    const todayPending = filteredTodayTasks.filter(t => t.status === 'pendente');

    if (todayPending.length === 0) {
      const msg = 'Você não tem tarefas pendentes para hoje. Excelente momento para descansar ou fazer uma pausa!';
      showToast(msg, 'info');
      return { movedCount: 0, message: msg };
    }

    const todayDate = new Date();
    const nextDays: string[] = [];
    let currentCheck = new Date(todayDate);
    while (nextDays.length < 3) {
      currentCheck.setDate(currentCheck.getDate() + 1);
      const dayOfWeek = currentCheck.getDay();
      if (dayOfWeek !== 0) {
        nextDays.push(currentCheck.toISOString().split('T')[0]);
      }
    }

    const pendingIds = new Set(todayPending.map(p => p.id));
    let movedIndex = 0;

    const updatedTasks = tasks.map(task => {
      if (pendingIds.has(task.id)) {
        const targetDay = nextDays[movedIndex % nextDays.length];
        movedIndex++;
        return {
          ...task,
          scheduledDate: targetDay,
          status: 'pendente' as const,
          notes: task.notes
            ? `${task.notes} (Rebalanceado suavemente)`
            : 'Rebalanceado pelo Modo Socorro para evitar sobrecarga.',
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    const friendlyMessage = 'Sem problemas! Seu cronograma foi rebalanceado e salvo automaticamente.';
    showToast(friendlyMessage, 'success');
    return { movedCount: todayPending.length, message: friendlyMessage };
  };

  // Complete a task
  const completeTask = (
    taskId: string,
    data?: {
      actualMinutes?: number;
      questionsCount?: number;
      correctQuestions?: number;
      retentionRating?: RetentionRating;
      notes?: string;
    }
  ) => {
    const nowIso = new Date().toISOString();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const rating = data?.retentionRating || 'medio';
    const actualMinutes = data?.actualMinutes || task.estimatedMinutes;

    // 1. Update task
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'concluida',
              completedAt: nowIso,
              actualMinutes,
              questionsCount: data?.questionsCount,
              correctQuestions: data?.correctQuestions,
              retentionRating: rating,
              notes: data?.notes || t.notes,
            }
          : t
      )
    );

    // 2. Add or advance Spaced Repetition queue
    const nextDays = rating === 'facil' ? 3 : 1;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextDays);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    setSpacedReviews(prev => {
      const existing = prev.find(r => r.topicTitle.toLowerCase() === task.title.toLowerCase());
      if (existing) {
        return prev.map(r =>
          r.id === existing.id
            ? {
                ...r,
                stage: (existing.stage === 'D+1' ? 'D+7' : existing.stage === 'D+7' ? 'D+30' : 'D+60') as
                  | 'D+1'
                  | 'D+7'
                  | 'D+30'
                  | 'D+60',
                scheduledDate: nextDateStr,
                status: 'agendada' as const,
              }
            : r
        );
      } else {
        const newReview: SpacedReviewItem = {
          id: `rev-${Date.now()}`,
          subject: task.subject,
          topicTitle: task.title,
          stage: 'D+1',
          scheduledDate: nextDateStr,
          status: 'agendada',
          daysOverdueOrLeft: nextDays,
          flashcards: [
            {
              id: `fc-${Date.now()}`,
              question: `Qual o ponto principal abordado no tópico "${task.title}"?`,
              answer: task.notes || 'Revisão conceitual dos pontos-chave estudados.',
              topic: task.title,
              subject: task.subject,
              intervalDays: nextDays,
              reviewCount: 1,
            },
          ],
        };
        return [newReview, ...prev];
      }
    });

    // 3. Update Jardim do Conhecimento
    setGardenTopics(prev => {
      const existing = prev.find(g => g.title.toLowerCase() === task.title.toLowerCase());
      const scoreBoost = rating === 'facil' ? 18 : rating === 'medio' ? 10 : 5;

      if (existing) {
        const newScore = Math.min(100, existing.retentionScore + scoreBoost);
        const newStage =
          newScore >= 80 ? 'florescendo' : newScore >= 55 ? 'crescendo' : newScore >= 30 ? 'broto' : 'semente';
        return prev.map(g =>
          g.id === existing.id
            ? {
                ...g,
                retentionScore: newScore,
                stage: newStage,
                lastStudied: 'Hoje',
                sessionsCount: g.sessionsCount + 1,
              }
            : g
        );
      } else {
        const initialScore = 40 + scoreBoost;
        const newTopic: KnowledgeGardenTopic = {
          id: `gt-${Date.now()}`,
          subject: task.subject,
          title: task.title,
          retentionScore: initialScore,
          stage: initialScore >= 55 ? 'crescendo' : 'broto',
          lastStudied: 'Hoje',
          sessionsCount: 1,
        };
        return [newTopic, ...prev];
      }
    });

    // 4. Update covered topics count in subject
    setSubjects(prev =>
      prev.map(s => {
        if (s.name.toLowerCase() === task.subject.toLowerCase()) {
          return { ...s, coveredTopics: Math.min(s.totalTopics, s.coveredTopics + 1) };
        }
        return s;
      })
    );

    // 5. Log session
    const log: SessionLog = {
      id: `log-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      subject: task.subject,
      durationMinutes: actualMinutes,
      mode: 'pomodoro',
      timestamp: nowIso,
      questionsTotal: data?.questionsCount,
      questionsCorrect: data?.correctQuestions,
      retentionRating: rating,
      notes: data?.notes,
    };
    setSessionLogs(prev => [log, ...prev]);

    showToast(`Parabéns! "${task.title}" concluído e salvo no navegador.`, 'success');

    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
  };

  const addNewTask = (taskData: {
    title: string;
    subject: SubjectCategory;
    estimatedMinutes: number;
    energyLevel: CognitiveEnergy;
    difficulty: 'leve' | 'moderada' | 'desafiadora';
    notes?: string;
  }) => {
    addCustomSubject({ name: taskData.subject });

    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: taskData.title,
      subject: taskData.subject,
      estimatedMinutes: taskData.estimatedMinutes,
      energyLevel: taskData.energyLevel,
      difficulty: taskData.difficulty,
      status: 'pendente',
      scheduledDate: todayStr,
      notes: taskData.notes,
    };

    setTasks(prev => {
      const next = [newTask, ...prev];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(next));
      return next;
    });

    setGardenTopics(prev => {
      const exists = prev.some(g => g.title.toLowerCase() === taskData.title.toLowerCase());
      if (exists) return prev;
      const nextGarden: KnowledgeGardenTopic[] = [
        {
          id: `gt-${Date.now()}`,
          subject: taskData.subject,
          title: taskData.title,
          retentionScore: 10,
          stage: 'semente',
          lastStudied: 'Hoje',
          sessionsCount: 0,
        },
        ...prev,
      ];
      localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(nextGarden));
      return nextGarden;
    });

    showToast(`Meta "${taskData.title}" salva com sucesso!`, 'success');
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => {
      const next = prev.filter(t => t.id !== taskId);
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(next));
      return next;
    });
    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
    showToast('Tarefa removida.', 'info');
  };

  const updateTaskNotes = (taskId: string, notes: string) => {
    setTasks(prev => {
      const next = prev.map(t => (t.id === taskId ? { ...t, notes } : t));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(next));
      return next;
    });
  };

  const completeReview = (reviewId: string) => {
    setSpacedReviews(prev => {
      const next = prev.map(r => {
        if (r.id === reviewId) {
          const nextStage: 'D+1' | 'D+7' | 'D+30' | 'D+60' =
            r.stage === 'D+1' ? 'D+7' : r.stage === 'D+7' ? 'D+30' : 'D+60';
          const addDays = nextStage === 'D+7' ? 7 : nextStage === 'D+30' ? 23 : 30;
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + addDays);
          return {
            ...r,
            stage: nextStage,
            status: 'concluida' as const,
            scheduledDate: futureDate.toISOString().split('T')[0],
            daysOverdueOrLeft: addDays,
          };
        }
        return r;
      });
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(next));
      return next;
    });
    showToast('Revisão concluída e salva! Curva de retenção reforçada.', 'success');
  };

  const reviewFlashcard = (
    reviewId: string,
    cardId: string,
    rating: 'facil' | 'bom' | 'dificil' | 'esqueci'
  ) => {
    setSpacedReviews(prev => {
      const next = prev.map(review => {
        if (review.id !== reviewId) return review;
        const updatedCards = review.flashcards.map(fc => {
          if (fc.id !== cardId) return fc;
          let newInterval = fc.intervalDays;
          if (rating === 'facil') newInterval = Math.round(fc.intervalDays * 2.2);
          else if (rating === 'bom') newInterval = Math.round(fc.intervalDays * 1.6);
          else if (rating === 'dificil') newInterval = Math.max(1, Math.round(fc.intervalDays * 1.1));
          else newInterval = 1;

          return {
            ...fc,
            difficultyRating: rating,
            intervalDays: newInterval,
            reviewCount: fc.reviewCount + 1,
          };
        });
        return { ...review, flashcards: updatedCards };
      });
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(next));
      return next;
    });
  };

  // ZERAR TUDO: Clear all and GUARANTEE that upon reload it remains empty and does NOT resurrect mock data!
  const clearAllData = () => {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    setTasks([]);
    setSpacedReviews([]);
    setGardenTopics([]);
    setSessionLogs([]);
    setActiveFocusTask(null);
    showToast('Cronograma zerado e salvo! Pronto para você adicionar suas próprias metas.', 'success');
  };

  // RESTAURAR DEMO: Explicitly reset to seed demo items
  const resetToDefaults = () => {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialSpacedReviews));
    localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(initialGardenTopics));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(initialSubjects));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    setSubjects(initialSubjects);
    setTasks(initialTasks);
    setSpacedReviews(initialSpacedReviews);
    setGardenTopics(initialGardenTopics);
    setSessionLogs([]);
    showToast('Dados de demonstração restaurados e salvos.', 'info');
  };

  // Export all user data to a downloadable JSON file for permanent safety
  const exportBackup = () => {
    const backupData = {
      app: 'Fluxo Adapti',
      version: 2,
      exportedAt: new Date().toISOString(),
      subjects,
      tasks,
      spacedReviews,
      gardenTopics,
      sessionLogs,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fluxo-adapti-backup-${todayStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado para arquivo com sucesso!', 'success');
  };

  // Import user data from JSON
  const importBackup = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.subjects)) setSubjects(data.subjects);
      if (Array.isArray(data.tasks)) setTasks(data.tasks);
      if (Array.isArray(data.spacedReviews)) setSpacedReviews(data.spacedReviews);
      if (Array.isArray(data.gardenTopics)) setGardenTopics(data.gardenTopics);
      if (Array.isArray(data.sessionLogs)) setSessionLogs(data.sessionLogs);

      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(data.subjects || []));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(data.tasks || []));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(data.spacedReviews || []));
      localStorage.setItem(STORAGE_KEYS.GARDEN, JSON.stringify(data.gardenTopics || []));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.sessionLogs || []));

      showToast('Cronograma importado e salvo com sucesso!', 'success');
      return true;
    } catch (err) {
      showToast('Arquivo de backup inválido.', 'info');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        cognitiveEnergy,
        setCognitiveEnergy,
        tasks,
        filteredTodayTasks,
        activeFocusTask,
        setActiveFocusTask,
        startFocusOnTask,
        spacedReviews,
        gardenTopics,
        subjects,
        sessionLogs,
        lastSavedAt,
        isRescueModalOpen,
        setIsRescueModalOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isClearModalOpen,
        setIsClearModalOpen,
        isSubjectModalOpen,
        setIsSubjectModalOpen,
        isBackupModalOpen,
        setIsBackupModalOpen,
        toastMessage,
        showToast,
        recalculateDayRescueMode,
        completeTask,
        addNewTask,
        deleteTask,
        updateTaskNotes,
        completeReview,
        reviewFlashcard,
        addCustomSubject,
        deleteSubject,
        addGardenTopic,
        deleteGardenTopic,
        clearAllData,
        resetToDefaults,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
