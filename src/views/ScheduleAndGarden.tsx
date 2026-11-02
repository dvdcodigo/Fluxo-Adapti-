import React, { useState } from 'react';
import {
  CalendarDays,
  Flower2,
  Sprout,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Filter,
  Plus,
  BookPlus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWeeklyScheduleDays } from '../data/mockData';
import { KnowledgeGardenTopic } from '../types';

export const ScheduleAndGarden: React.FC = () => {
  const {
    tasks,
    gardenTopics,
    subjects,
    setIsSubjectModalOpen,
    setIsTaskModalOpen,
    addGardenTopic,
    deleteGardenTopic,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'jardim' | 'semanal'>('jardim');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('todos');

  const [isQuickTopicOpen, setIsQuickTopicOpen] = useState(false);
  const [quickTopicTitle, setQuickTopicTitle] = useState('');
  const [quickTopicSubject, setQuickTopicSubject] = useState(subjects[0]?.name || '');

  const weeklyDays = getWeeklyScheduleDays(tasks);

  const totalEditalTopics = subjects.reduce((acc, s) => acc + s.totalTopics, 0);
  const totalCoveredTopics = subjects.reduce((acc, s) => acc + s.coveredTopics, 0);
  const overallCoveragePercent = totalEditalTopics > 0 ? Math.round((totalCoveredTopics / totalEditalTopics) * 100) : 0;

  const filteredGarden = gardenTopics.filter(topic => {
    if (selectedSubjectFilter === 'todos') return true;
    return topic.subject === selectedSubjectFilter;
  });

  const getStageIcon = (stage: KnowledgeGardenTopic['stage']) => {
    switch (stage) {
      case 'florescendo':
        return <Flower2 className="w-5 h-5 text-[#ea4335]" />;
      case 'crescendo':
        return <Sprout className="w-5 h-5 text-[#34a853]" />;
      case 'broto':
        return <Sprout className="w-4 h-4 text-[#1a73e8]" />;
      case 'semente':
      default:
        return <div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04] mx-1" />;
    }
  };

  const getStageLabel = (stage: KnowledgeGardenTopic['stage']) => {
    switch (stage) {
      case 'florescendo':
        return '🌸 Florescendo (Domínio)';
      case 'crescendo':
        return '🌿 Em Crescimento';
      case 'broto':
        return '🌱 Broto Inicial';
      case 'semente':
      default:
        return '🌰 Semente (Iniciando)';
    }
  };

  const handleQuickAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopicTitle.trim()) return;

    addGardenTopic({
      subject: quickTopicSubject || (subjects[0]?.name || 'Geral'),
      title: quickTopicTitle.trim(),
      initialScore: 20,
    });

    setQuickTopicTitle('');
    setIsQuickTopicOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Final Goal / Edital Coverage Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-medium mb-1">
            <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-semibold">Google Workspace Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>Edital e Temas de Estudo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] dark:text-[#e3e3e3] tracking-tight font-google">
            Cronograma & <strong className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">Cobertura de Temas</strong>
          </h1>
        </div>

        {/* Action buttons and View Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSubjectModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1a73e8] dark:text-[#8ab4f8] bg-[#f8fafd] dark:bg-[#202124] hover:bg-[#e8f0fe] dark:hover:bg-[#1a73e8]/20 border border-[#dadce0] dark:border-[#3c4043] rounded-full transition-all shadow-2xs"
          >
            <BookPlus className="w-3.5 h-3.5" />
            <span>+ Novo Tema / Matéria</span>
          </button>

          <div className="inline-flex items-center gap-1 p-1 bg-[#f1f3f4] dark:bg-[#2d2f31] rounded-full shrink-0">
            <button
              onClick={() => setActiveSection('jardim')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeSection === 'jardim'
                  ? 'bg-[#ffffff] dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] shadow-2xs font-semibold'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
              }`}
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span>Jardim</span>
            </button>
            <button
              onClick={() => setActiveSection('semanal')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                activeSection === 'semanal'
                  ? 'bg-[#ffffff] dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] shadow-2xs font-semibold'
                  : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Grade Semanal</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Edital Coverage Meter Banner */}
      <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1a73e8] dark:text-[#8ab4f8]">
              Cobertura da Meta Final
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#1f1f1f] dark:text-[#e3e3e3] mt-0.5 font-google">
              {overallCoveragePercent > 0
                ? `Você cobriu ${overallCoveragePercent}% dos tópicos previstos para o seu cronograma`
                : 'Seu cronograma está pronto para receber suas matérias e tópicos'}
            </h3>
          </div>
          <span className="text-xs font-mono tabular-nums text-[#5f6368] dark:text-[#9aa0a6] font-semibold">
            {totalCoveredTopics} de {totalEditalTopics} tópicos dominados
          </span>
        </div>

        {/* Main Progress Bar - Google Blue */}
        <div className="w-full bg-[#f1f3f4] dark:bg-[#2d2f31] h-3 rounded-full overflow-hidden mb-4">
          <div
            className="bg-[#1a73e8] dark:bg-[#8ab4f8] h-full rounded-full transition-all duration-700"
            style={{ width: `${overallCoveragePercent}%` }}
          />
        </div>

        {/* Subject-by-Subject Mini Progress Breakdown */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-[#f1f3f4] dark:border-[#2d2f31]">
            {subjects.map(sub => {
              const pct = sub.totalTopics > 0 ? Math.round((sub.coveredTopics / sub.totalTopics) * 100) : 0;
              return (
                <div key={sub.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#1f1f1f] dark:text-[#e3e3e3] truncate mr-1" title={sub.name}>
                      {sub.name}
                    </span>
                    <span className="font-mono tabular-nums text-[#5f6368] dark:text-[#9aa0a6]">{pct}%</span>
                  </div>
                  <div className="w-full bg-[#f1f3f4] dark:bg-[#2d2f31] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: sub.color || '#1a73e8' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-[#5f6368] text-center py-2">
            Nenhuma disciplina cadastrada ainda. Clique em "+ Novo Tema / Matéria" para começar.
          </div>
        )}
      </div>

      {/* 3. Section A: Jardim do Conhecimento (Botanical Retention Garden) */}
      {activeSection === 'jardim' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
                Seu Jardim do Conhecimento
              </h2>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                Cada tópico é cultivado através de revisões ativas e sessões de foco
              </p>
            </div>

            {/* Actions & Subject Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQuickTopicOpen(!isQuickTopicOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#137333] dark:text-[#81c995] bg-[#e6f4ea] dark:bg-[#137333]/20 hover:bg-[#ceead6] dark:hover:bg-[#137333]/30 rounded-full transition-colors border border-[#ceead6] dark:border-[#137333]/40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Plantar Tópico</span>
              </button>

              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#5f6368]" />
                <select
                  value={selectedSubjectFilter}
                  onChange={e => setSelectedSubjectFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-full text-[#1f1f1f] dark:text-[#e3e3e3] focus:outline-hidden max-w-[190px] truncate"
                >
                  <option value="todos">Todas as Matérias</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Plant Topic Collapsible Form */}
          {isQuickTopicOpen && (
            <form
              onSubmit={handleQuickAddTopic}
              className="bg-[#e6f4ea] dark:bg-[#137333]/20 border border-[#ceead6] dark:border-[#137333]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in duration-200"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  required
                  placeholder="Nome do Tópico (Ex.: Arquitetura com Gemini & Vector Search)"
                  value={quickTopicTitle}
                  onChange={e => setQuickTopicTitle(e.target.value)}
                  className="w-full px-3.5 py-1.5 text-xs bg-[#ffffff] dark:bg-[#1e1f20] border border-[#ceead6] dark:border-[#137333]/40 rounded-lg text-[#1f1f1f] dark:text-[#e3e3e3] focus:outline-hidden"
                />
              </div>
              <div className="w-full sm:w-auto">
                <select
                  value={quickTopicSubject}
                  onChange={e => setQuickTopicSubject(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs bg-[#ffffff] dark:bg-[#1e1f20] border border-[#ceead6] dark:border-[#137333]/40 rounded-lg text-[#1f1f1f] dark:text-[#e3e3e3] focus:outline-hidden"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-2xs"
                >
                  Plantar
                </button>
                <button
                  type="button"
                  onClick={() => setIsQuickTopicOpen(false)}
                  className="px-2.5 py-1.5 text-xs text-[#5f6368] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]"
                >
                  Fechar
                </button>
              </div>
            </form>
          )}

          {/* Plant cards grid */}
          {filteredGarden.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredGarden.map(topic => {
                return (
                  <div
                    key={topic.id}
                    className="p-4 rounded-2xl bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8]/50 dark:hover:border-[#8ab4f8]/50 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group relative"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-full bg-[#f8fafd] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043]">
                            {getStageIcon(topic.stage)}
                          </div>
                          <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] font-medium truncate max-w-[160px]">
                            {topic.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#1f1f1f] dark:text-[#e3e3e3] tabular-nums">
                            {topic.retentionScore}%
                          </span>
                          <button
                            onClick={() => deleteGardenTopic(topic.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#5f6368] hover:text-[#d93025] transition-opacity"
                            title="Remover tópico do jardim"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3] line-clamp-2">
                        {topic.title}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#f1f3f4] dark:border-[#2d2f31] flex items-center justify-between text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
                      <span>{getStageLabel(topic.stage)}</span>
                      <span>{topic.sessionsCount} sessão(ões)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#ffffff] dark:bg-[#1e1f20] rounded-3xl border border-[#dadce0] dark:border-[#3c4043] shadow-2xs">
              <Sprout className="w-8 h-8 text-[#34a853] mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">
                Seu Jardim está pronto para as primeiras sementes
              </h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1 max-w-sm mx-auto">
                Adicione um tópico pelo botão acima ou conclua sessões de estudo para ver seu conhecimento florescer.
              </p>
              <button
                onClick={() => setIsQuickTopicOpen(true)}
                className="mt-4 px-5 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Plantar Primeiro Tópico</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Section B: Cronograma Semanal em Colunas (Seg a Dom) */}
      {activeSection === 'semanal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
                Grade Semanal de Carga Horária
              </h2>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                Visualização estilo Google Calendar com redistribuição suave de carga
              </p>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1a73e8] dark:text-[#8ab4f8] bg-[#f8fafd] dark:bg-[#202124] hover:bg-[#e8f0fe] dark:hover:bg-[#1a73e8]/20 rounded-full transition-colors border border-[#dadce0] dark:border-[#3c4043]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Tarefa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weeklyDays.map(day => {
              const isToday = day.isToday;
              const hasTasks = day.tasks.length > 0;

              return (
                <div
                  key={day.dayName}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all min-h-[320px] ${
                    isToday
                      ? 'border-[#1a73e8] dark:border-[#8ab4f8] bg-[#e8f0fe]/40 dark:bg-[#1a73e8]/15 ring-1 ring-[#1a73e8]/30 shadow-2xs'
                      : 'border-[#dadce0] dark:border-[#3c4043] bg-[#ffffff] dark:bg-[#1e1f20]'
                  }`}
                >
                  <div>
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f1f3f4] dark:border-[#2d2f31]">
                      <div>
                        <span className="text-xs font-bold text-[#1f1f1f] dark:text-[#e3e3e3]">
                          {day.dayName}
                        </span>
                        <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] block">
                          {day.displayDate}
                        </span>
                      </div>
                      {isToday && (
                        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-[#1a73e8] text-white">
                          Hoje
                        </span>
                      )}
                    </div>

                    {/* Day Target */}
                    <div className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        <Clock className="w-3 h-3 text-[#5f6368]" />
                        {day.completedMinutes > 0 ? `${day.completedMinutes}m feitos` : `${day.targetMinutes}m meta`}
                      </span>
                    </div>

                    {/* Tasks in this day */}
                    <div className="space-y-1.5">
                      {hasTasks ? (
                        day.tasks.map(t => (
                          <div
                            key={t.id}
                            className="p-2 rounded-xl bg-[#f8fafd] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] text-xs shadow-2xs"
                          >
                            <span className="text-[10px] text-[#1a73e8] dark:text-[#8ab4f8] block font-semibold truncate">
                              {t.subject}
                            </span>
                            <span className="font-medium text-[#1f1f1f] dark:text-[#e3e3e3] line-clamp-1">
                              {t.title}
                            </span>
                            <span className="text-[10px] text-[#5f6368] font-mono tabular-nums">
                              {t.estimatedMinutes} min
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-[11px] text-[#5f6368] rounded-xl bg-[#f8fafd]/50 dark:bg-[#202124]/30 border border-dashed border-[#dadce0] dark:border-[#3c4043]">
                          Carga suave / Descanso
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer of the day */}
                  <div className="pt-2 border-t border-[#f1f3f4] dark:border-[#2d2f31] text-[10px] text-[#5f6368] flex items-center justify-between">
                    <span>{day.tasks.length} tarefa(s)</span>
                    {day.completed && (
                      <span className="text-[#137333] dark:text-[#81c995] font-medium">Cumprido</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
