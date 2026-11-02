import React, { useState } from 'react';
import { X, CheckCircle2, Award, Sparkles, BookOpen } from 'lucide-react';
import { Task, RetentionRating } from '../types';
import { useApp } from '../context/AppContext';

interface FinishSessionModalProps {
  task: Task | null;
  durationMinutes: number;
  isOpen: boolean;
  onClose: () => void;
  onFinished: () => void;
}

export const FinishSessionModal: React.FC<FinishSessionModalProps> = ({
  task,
  durationMinutes,
  isOpen,
  onClose,
  onFinished,
}) => {
  const { completeTask } = useApp();

  const [questionsCount, setQuestionsCount] = useState<number | ''>(10);
  const [correctQuestions, setCorrectQuestions] = useState<number | ''>(8);
  const [retentionRating, setRetentionRating] = useState<RetentionRating>('medio');
  const [sessionNotes, setSessionNotes] = useState(task?.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      completeTask(task.id, {
        actualMinutes: durationMinutes,
        questionsCount: questionsCount === '' ? undefined : Number(questionsCount),
        correctQuestions: correctQuestions === '' ? undefined : Number(correctQuestions),
        retentionRating,
        notes: sessionNotes,
      });
    }
    onFinished();
  };

  const accuracy =
    typeof questionsCount === 'number' && typeof correctQuestions === 'number' && questionsCount > 0
      ? Math.round((correctQuestions / questionsCount) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fef7e0] dark:bg-[#fbbc04]/20 text-[#b06000] dark:text-[#fdd663] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#202124] dark:text-[#e8eaed]">
                Sessão Concluída com Foco!
              </h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
                {task ? task.title : 'Estudo em Fluxo Livre'} · <strong className="text-[#1a73e8] dark:text-[#8ab4f8]">{durationMinutes} min</strong> dedicados
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#e8eaed] rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question practice logger */}
          <div className="bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-semibold text-[#202124] dark:text-[#e8eaed] block">
              Prática de Questões (Opcional)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#5f6368] dark:text-[#9aa0a6] mb-1">
                  Total de Questões
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={questionsCount}
                  onChange={e => setQuestionsCount(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="Ex.: 10"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-xl text-[#202124] dark:text-[#e8eaed] focus:outline-hidden focus:border-[#1a73e8]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#5f6368] dark:text-[#9aa0a6] mb-1">
                  Acertos
                </label>
                <input
                  type="number"
                  min="0"
                  max={questionsCount || 500}
                  value={correctQuestions}
                  onChange={e => setCorrectQuestions(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="Ex.: 8"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-xl text-[#202124] dark:text-[#e8eaed] focus:outline-hidden focus:border-[#1a73e8]"
                />
              </div>
            </div>
            {accuracy !== null && (
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#dadce0]/60 dark:border-[#3c4043]">
                <span className="text-[#5f6368] dark:text-[#9aa0a6]">Aproveitamento:</span>
                <span className="font-semibold text-[#1e8e3e] dark:text-[#81c995] font-mono tabular-nums">
                  {accuracy}% de acerto
                </span>
              </div>
            )}
          </div>

          {/* Retention Assessment */}
          <div>
            <label className="block text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] mb-2">
              Como foi a retenção deste conteúdo?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'facil', label: 'Fácil', desc: 'Fixação alta', active: 'border-[#34a853] bg-[#e6f4ea] dark:bg-[#34a853]/20 text-[#1e8e3e] dark:text-[#81c995]' },
                  { id: 'medio', label: 'Médio', desc: 'Fixação normal', active: 'border-[#1a73e8] bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#8ab4f8]' },
                  { id: 'dificil', label: 'Difícil', desc: 'Precisa reforço', active: 'border-[#ea4335] bg-[#fce8e6] dark:bg-[#ea4335]/20 text-[#d93025] dark:text-[#f28b82]' },
                ] as const
              ).map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setRetentionRating(opt.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    retentionRating === opt.id
                      ? `${opt.active} font-semibold ring-1 ring-black/5`
                      : 'border-[#dadce0] dark:border-[#3c4043] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31]'
                  }`}
                >
                  <span className="block text-xs font-semibold">{opt.label}</span>
                  <span className="block text-[10px] opacity-80 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] mt-2">
              Sua resposta recalcula automaticamente a Curva do Esquecimento e o intervalo da próxima revisão espaçada.
            </p>
          </div>

          {/* Session takeaway notes */}
          <div>
            <label className="block text-xs font-medium text-[#3c4043] dark:text-[#bdc1c6] mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
              <span>Conclusão / Ponto Chave</span>
            </label>
            <textarea
              rows={2}
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              placeholder="O que você aprendeu que não pode esquecer na revisão?"
              className="w-full px-3.5 py-2.5 text-xs bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] rounded-xl text-[#202124] dark:text-[#e8eaed] placeholder-[#80868b] resize-none focus:outline-hidden focus:border-[#1a73e8]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f1f3f4] dark:border-[#3c4043]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-colors shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar & Rebalancear</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
