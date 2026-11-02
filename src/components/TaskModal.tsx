import React, { useState } from 'react';
import { X, Plus, Clock, Brain, Tag, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CognitiveEnergy, TaskDifficulty } from '../types';

export const TaskModal: React.FC = () => {
  const { isTaskModalOpen, setIsTaskModalOpen, addNewTask, subjects } = useApp();

  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || 'Engenharia de Software');
  const [isTypingNewSubject, setIsTypingNewSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [energyLevel, setEnergyLevel] = useState<CognitiveEnergy>('media');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('moderada');
  const [notes, setNotes] = useState('');

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalSubject = isTypingNewSubject
      ? (customSubjectName.trim() || 'Geral')
      : selectedSubject;

    addNewTask({
      title: title.trim(),
      subject: finalSubject,
      estimatedMinutes,
      energyLevel,
      difficulty,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setCustomSubjectName('');
    setIsTypingNewSubject(false);
    setNotes('');
    setIsTaskModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#202124] dark:text-[#e8eaed]">Nova Meta de Estudo</h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">Adicione uma sessão com esforço dimensionado</p>
            </div>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(false)}
            className="p-2 text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#e8eaed] rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] mb-1.5">
              Tópico / Assunto
            </label>
            <input
              type="text"
              required
              placeholder="Ex.: Engenharia de Prompts com Gemini & Function Calling"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] rounded-xl focus:outline-hidden focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] dark:text-[#e8eaed] placeholder-[#80868b]"
            />
          </div>

          {/* Subject with support for typing new custom subject on the fly */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6]">
                Tema / Disciplina
              </label>
              <button
                type="button"
                onClick={() => setIsTypingNewSubject(!isTypingNewSubject)}
                className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] hover:underline font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-[#fbbc04]" />
                <span>{isTypingNewSubject ? 'Escolher existente' : '+ Criar novo tema'}</span>
              </button>
            </div>

            {isTypingNewSubject ? (
              <input
                type="text"
                required={isTypingNewSubject}
                placeholder="Ex.: Engenharia de Software: Dev na Área de IA (Imersão Alura + Google)"
                value={customSubjectName}
                onChange={e => setCustomSubjectName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#e8f0fe]/40 dark:bg-[#1a73e8]/10 border border-[#1a73e8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#1a73e8]/30 text-[#202124] dark:text-[#e8eaed]"
                autoFocus
              />
            ) : (
              <select
                value={selectedSubject}
                onChange={e => {
                  if (e.target.value === '__NEW__') {
                    setIsTypingNewSubject(true);
                  } else {
                    setSelectedSubject(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] rounded-xl focus:outline-hidden focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] dark:text-[#e8eaed]"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="__NEW__">+ Digitar Novo Tema Personalizado...</option>
              </select>
            )}
          </div>

          {/* Estimated Time */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                <span>Tempo Estimado: <strong className="text-[#1a73e8] dark:text-[#8ab4f8]">{estimatedMinutes} minutos</strong></span>
              </label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setEstimatedMinutes(mins)}
                  className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                    estimatedMinutes === mins
                      ? 'border-[#1a73e8] bg-[#e8f0fe] dark:bg-[#1a73e8]/25 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold ring-1 ring-[#1a73e8]/30'
                      : 'border-[#dadce0] dark:border-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Cognitive Energy Demand */}
          <div>
            <label className="block text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] mb-1.5 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
              <span>Demanda de Bateria Cognitiva</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'alta', label: '⚡ Alta', desc: 'Teoria / Algoritmos', color: 'border-[#ea4335] text-[#d93025] bg-[#fce8e6] dark:bg-[#ea4335]/20 dark:text-[#f28b82]' },
                  { id: 'media', label: '⚖️ Média', desc: 'Questões de fixação', color: 'border-[#1a73e8] text-[#1a73e8] bg-[#e8f0fe] dark:bg-[#1a73e8]/20 dark:text-[#8ab4f8]' },
                  { id: 'baixa', label: '🔋 Baixa', desc: 'Flashcard / Revisão', color: 'border-[#34a853] text-[#1e8e3e] bg-[#e6f4ea] dark:bg-[#34a853]/20 dark:text-[#81c995]' },
                ] as const
              ).map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setEnergyLevel(opt.id)}
                  className={`p-2.5 text-left rounded-xl border transition-all ${
                    energyLevel === opt.id
                      ? `${opt.color} font-semibold ring-1 ring-black/5`
                      : 'border-[#dadce0] dark:border-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31]'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[10px] opacity-80 mt-0.5 truncate">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
              <span>Sensação de Dificuldade</span>
            </label>
            <div className="flex gap-2">
              {(['leve', 'moderada', 'desafiadora'] as const).map(diff => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-2 text-xs font-medium rounded-xl capitalize border transition-all ${
                    difficulty === diff
                      ? 'border-[#1a73e8] bg-[#e8f0fe] dark:bg-[#1a73e8]/25 text-[#1a73e8] dark:text-[#8ab4f8] font-semibold'
                      : 'border-[#dadce0] dark:border-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] mb-1.5">
              Anotações / Foco Principal (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex.: Aula da Imersão Alura: construir pipeline com Gemini..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] rounded-xl focus:outline-hidden focus:border-[#1a73e8] text-[#202124] dark:text-[#e8eaed] placeholder-[#80868b] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f1f3f4] dark:border-[#3c4043]">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-sm cursor-pointer"
            >
              Adicionar ao Dia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

