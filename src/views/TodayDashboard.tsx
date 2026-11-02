import React from 'react';
import {
  Zap,
  Scale,
  BatteryMedium,
  LifeBuoy,
  Play,
  CheckCircle,
  Plus,
  Clock,
  Sparkles,
  CalendarCheck2,
  Smile,
  BookPlus,
  Trash2,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CognitiveEnergy } from '../types';

export const TodayDashboard: React.FC = () => {
  const {
    cognitiveEnergy,
    setCognitiveEnergy,
    filteredTodayTasks,
    setIsRescueModalOpen,
    setIsTaskModalOpen,
    setIsClearModalOpen,
    setIsSubjectModalOpen,
    startFocusOnTask,
    completeTask,
  } = useApp();

  const energyOptions: {
    level: CognitiveEnergy;
    label: string;
    icon: React.ReactNode;
    desc: string;
    activeBorder: string;
    activeBg: string;
    activeText: string;
  }[] = [
    {
      level: 'alta',
      label: '⚡ Alta Energia',
      icon: <Zap className="w-4 h-4 text-[#ea4335]" />,
      desc: 'Teorias densas, resoluções complexas e raciocínio analítico',
      activeBorder: 'border-[#ea4335]',
      activeBg: 'bg-[#fce8e6] dark:bg-[#ea4335]/20',
      activeText: 'text-[#c5221f] dark:text-[#f28b82]',
    },
    {
      level: 'media',
      label: '⚖️ Média Energia',
      icon: <Scale className="w-4 h-4 text-[#1a73e8]" />,
      desc: 'Resolução de questões padrão, leitura e resumos ativos',
      activeBorder: 'border-[#1a73e8]',
      activeBg: 'bg-[#e8f0fe] dark:bg-[#1a73e8]/20',
      activeText: 'text-[#1967d2] dark:text-[#8ab4f8]',
    },
    {
      level: 'baixa',
      label: '🔋 Baixa Energia',
      icon: <BatteryMedium className="w-4 h-4 text-[#34a853]" />,
      desc: 'Flashcards rápidos, revisões guiadas e mapas conceituais',
      activeBorder: 'border-[#34a853]',
      activeBg: 'bg-[#e6f4ea] dark:bg-[#34a853]/20',
      activeText: 'text-[#137333] dark:text-[#81c995]',
    },
  ];

  const pendingTasks = filteredTodayTasks.filter(t => t.status === 'pendente');
  const completedTasks = filteredTodayTasks.filter(t => t.status === 'concluida');
  const totalPlannedMinutes = filteredTodayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const totalDoneMinutes = completedTasks.reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes), 0);
  const progressPercent = totalPlannedMinutes > 0 ? Math.round((totalDoneMinutes / totalPlannedMinutes) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting & Anti-Guilt Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-medium mb-1">
            <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-semibold">Hoje</span>
            <span aria-hidden="true">·</span>
            <span>Planejador Inteligente & Anti-Culpa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] dark:text-[#e3e3e3] tracking-tight font-google">
            Seu Ritmo, <strong className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">Sua Jornada</strong>
          </h1>
          <p className="text-xs sm:text-sm text-[#444746] dark:text-[#c4c7c5] mt-1 max-w-2xl leading-relaxed">
            Sem cronogramas rígidos que geram ansiedade. Defina sua bateria mental e o fluxo se adapta ao seu momento.
          </p>
        </div>

        {/* Quick Actions - Material Design 3 */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1a73e8] dark:text-[#8ab4f8] bg-[#f8fafd] dark:bg-[#202124] hover:bg-[#e8f0fe] dark:hover:bg-[#1a73e8]/20 border border-[#dadce0] dark:border-[#3c4043] rounded-full transition-all shadow-2xs"
            title="Criar nova disciplina ou tema"
          >
            <BookPlus className="w-4 h-4" />
            <span>Novo Tema</span>
          </button>

          <button
            onClick={() => setIsRescueModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#137333] dark:text-[#81c995] bg-[#e6f4ea] dark:bg-[#137333]/20 hover:bg-[#ceead6] dark:hover:bg-[#137333]/30 border border-[#ceead6] dark:border-[#137333]/40 rounded-full transition-all shadow-2xs"
          >
            <LifeBuoy className="w-4 h-4 text-[#34a853]" />
            <span className="hidden sm:inline">Modo Socorro</span>
          </button>

          {/* Google Material Extended FAB style */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>

          <button
            onClick={() => setIsClearModalOpen(true)}
            className="p-2 text-[#5f6368] hover:text-[#d93025] dark:hover:text-[#f28b82] hover:bg-[#fce8e6] dark:hover:bg-[#d93025]/20 border border-[#dadce0] dark:border-[#3c4043] rounded-full transition-colors"
            title="Zerar cronograma e começar do zero"
            aria-label="Zerar cronograma"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Cognitive Battery / Energy Selector - Material You Style */}
      <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
              Bateria Cognitiva de Hoje
            </span>
            <h2 className="text-sm font-semibold text-[#1f1f1f] dark:text-[#e3e3e3] mt-0.5">
              Como você está se sentindo agora?
            </h2>
          </div>
          <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
            Reordenação adaptativa em tempo real
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {energyOptions.map(opt => {
            const isSelected = cognitiveEnergy === opt.level;
            return (
              <button
                key={opt.level}
                onClick={() => setCognitiveEnergy(opt.level)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${opt.activeBorder} ${opt.activeBg} ring-1 ${opt.activeBorder} shadow-2xs`
                    : 'border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#202124] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] text-[#444746] dark:text-[#c4c7c5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold flex items-center gap-1.5 ${isSelected ? opt.activeText : 'text-[#1f1f1f] dark:text-[#e3e3e3]'}`}>
                    {opt.icon}
                    <span>{opt.label}</span>
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 font-semibold shadow-2xs">
                      Ativa
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] leading-snug">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dynamic filter feedback */}
        <div className="mt-3 pt-3 border-t border-[#f1f3f4] dark:border-[#2d2f31] flex items-center justify-between text-xs text-[#5f6368] dark:text-[#9aa0a6]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
            {cognitiveEnergy === 'alta' && 'Foco de alta densidade conceitual e resoluções complexas.'}
            {cognitiveEnergy === 'media' && 'Equilíbrio sustentável entre exercícios, leitura e fixação.'}
            {cognitiveEnergy === 'baixa' && 'Modo acolhedor: revisões ativas com flashcards e tarefas leves sem sobrecarga.'}
          </span>
          <span className="font-mono tabular-nums text-[#1f1f1f] dark:text-[#e3e3e3] font-semibold">
            {pendingTasks.length} meta(s) a cumprir
          </span>
        </div>
      </div>

      {/* 3. Positive Weekly Consistency Widget (Material M3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Positive Progress */}
        <div className="md:col-span-2 bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center shrink-0">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1f1f1f] dark:text-[#e3e3e3]">
                  Consistência Semanal Sustentável
                </h3>
                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
                  Progresso contínuo sem ansiedade punitiva
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] bg-[#e8f0fe] dark:bg-[#1a73e8]/20 px-3 py-1 rounded-full border border-[#d2e3fc] dark:border-[#1a73e8]/40 font-mono tabular-nums">
              4 de 5 dias concluídos
            </span>
          </div>

          {/* Days indicators */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {[
              { day: 'Seg', state: 'done', label: '105 min' },
              { day: 'Ter', state: 'done', label: '90 min' },
              { day: 'Qua', state: 'done', label: '115 min' },
              { day: 'Qui', state: 'done', label: '80 min' },
              { day: 'Sex (Hoje)', state: 'today', label: `${totalDoneMinutes} min` },
              { day: 'Sáb', state: 'rest', label: 'Leve' },
              { day: 'Dom', state: 'rest', label: 'Pausa' },
            ].map(d => (
              <div
                key={d.day}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  d.state === 'done'
                    ? 'border-[#ceead6] dark:border-[#137333]/40 bg-[#e6f4ea] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81c995]'
                    : d.state === 'today'
                    ? 'border-[#1a73e8] dark:border-[#8ab4f8] bg-[#e8f0fe]/60 dark:bg-[#1a73e8]/20 text-[#1967d2] dark:text-[#8ab4f8] ring-1 ring-[#1a73e8]/30 font-semibold'
                    : 'border-[#dadce0] dark:border-[#3c4043] bg-[#f8fafd] dark:bg-[#202124] text-[#5f6368] dark:text-[#9aa0a6]'
                }`}
              >
                <span className="block text-[11px] font-medium truncate">{d.day}</span>
                <span className="block text-[10px] font-mono mt-0.5 tabular-nums opacity-90">
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#444746] dark:text-[#c4c7c5] flex items-center gap-1.5">
            <Smile className="w-4 h-4 text-[#34a853] shrink-0" />
            <span>
              Você acumulou <strong>{390 + totalDoneMinutes} minutos</strong> de estudo focado esta semana com equilíbrio.
            </span>
          </p>
        </div>

        {/* Daily summary meter */}
        <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5f6368] dark:text-[#9aa0a6] mb-1">
              <span>Carga Horária de Hoje</span>
              <span className="font-mono tabular-nums font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">
                {totalDoneMinutes} / {totalPlannedMinutes} min
              </span>
            </div>
            {/* Google Blue M3 progress bar */}
            <div className="w-full bg-[#f1f3f4] dark:bg-[#2d2f31] h-2.5 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#1a73e8] dark:bg-[#8ab4f8] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              {progressPercent >= 100
                ? 'Meta diária concluída com sucesso!'
                : `${progressPercent}% concluído hoje.`}
            </p>
          </div>

          <div className="pt-3 border-t border-[#f1f3f4] dark:border-[#2d2f31] flex items-center justify-between text-xs">
            <span className="text-[#5f6368] dark:text-[#9aa0a6]">Precisa respirar?</span>
            <button
              onClick={() => setIsRescueModalOpen(true)}
              className="font-medium text-[#137333] dark:text-[#81c995] hover:underline"
            >
              Rebalancear pendências
            </button>
          </div>
        </div>
      </div>

      {/* 4. Today's Tasks List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base font-bold text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
              Tarefas Recomendadas para Hoje
            </h2>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
              Ordenadas conforme sua bateria cognitiva ({cognitiveEnergy})
            </p>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar meta</span>
          </button>
        </div>

        {filteredTodayTasks.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl shadow-2xs">
            <Sparkles className="w-8 h-8 text-[#1a73e8] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">
              Nenhuma tarefa pendente para hoje
            </h3>
            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1 max-w-sm mx-auto">
              Seu cronograma está livre. Adicione uma nova sessão de estudos ou crie um tema personalizado.
            </p>
            <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-5 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-all inline-flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Tarefa</span>
              </button>
              <button
                onClick={() => setIsSubjectModalOpen(true)}
                className="px-4 py-2.5 text-xs font-medium text-[#1a73e8] dark:text-[#8ab4f8] bg-[#f8fafd] dark:bg-[#202124] hover:bg-[#e8f0fe] dark:hover:bg-[#1a73e8]/20 border border-[#dadce0] dark:border-[#3c4043] rounded-full transition-colors inline-flex items-center gap-2"
              >
                <BookPlus className="w-4 h-4" />
                <span>+ Novo Tema / Matéria</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredTodayTasks.map(task => {
              const isCompleted = task.status === 'concluida';
              const energyBadge = {
                alta: '⚡ Alta',
                media: '⚖️ Média',
                baixa: '🔋 Leve',
              }[task.energyLevel];

              const difficultyText = {
                leve: 'Conceito Leve',
                moderada: 'Moderada',
                desafiadora: 'Desafiadora',
              }[task.difficulty];

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-[#f8fafd]/80 dark:bg-[#1e1f20]/50 border-[#dadce0]/60 dark:border-[#3c4043]/60 opacity-75'
                      : 'bg-[#ffffff] dark:bg-[#1e1f20] border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8]/50 dark:hover:border-[#8ab4f8]/50 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Zero-pill unboxed metadata */}
                      <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] flex-wrap">
                        <span className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">{task.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5f6368]" />
                          {task.estimatedMinutes} min
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{energyBadge}</span>
                        <span aria-hidden="true">·</span>
                        <span>{difficultyText}</span>
                        {task.isSpacedReview && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#137333] dark:text-[#81c995] font-medium">Revisão Espaçada</span>
                          </>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-medium text-[#1f1f1f] dark:text-[#e3e3e3] ${
                          isCompleted ? 'line-through text-[#80868b] dark:text-[#9aa0a6]' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.notes && (
                        <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] line-clamp-1">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions - Material buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e6f4ea] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81c995] text-xs font-medium border border-[#ceead6] dark:border-[#137333]/40">
                          <Check className="w-3.5 h-3.5" />
                          <span>Concluída</span>
                          {task.retentionRating && (
                            <span className="text-[11px] opacity-80">
                              ({task.retentionRating})
                            </span>
                          )}
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => completeTask(task.id, { retentionRating: 'medio' })}
                            className="px-3 py-1.5 text-xs font-medium text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors border border-[#dadce0] dark:border-[#3c4043]"
                            title="Marcar como concluída diretamente"
                          >
                            Concluir
                          </button>

                          <button
                            onClick={() => startFocusOnTask(task)}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-all shadow-2xs hover:shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Focar</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
