import React from 'react';
import { X, Heart, ShieldCheck, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RescueModal: React.FC = () => {
  const { isRescueModalOpen, setIsRescueModalOpen, tasks, recalculateDayRescueMode } = useApp();

  if (!isRescueModalOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingToday = tasks.filter(t => t.scheduledDate === todayStr && t.status === 'pendente');
  const totalPendingMinutes = pendingToday.reduce((acc, t) => acc + t.estimatedMinutes, 0);

  const handleConfirmRescue = () => {
    recalculateDayRescueMode();
    setIsRescueModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Soft background aura */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#34a853]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e6f4ea] dark:bg-[#34a853]/20 text-[#1e8e3e] dark:text-[#81c995] flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#202124] dark:text-[#e8eaed]">
                Modo Socorro · Recalcular Dia
              </h3>
              <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
                Adaptação inteligente e livre de culpa
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRescueModalOpen(false)}
            className="p-2 text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#e8eaed] rounded-full hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-guilt encouragement card */}
        <div className="bg-[#e6f4ea] dark:bg-[#34a853]/15 border border-[#ceead6] dark:border-[#34a853]/30 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1e8e3e] dark:text-[#81c995] shrink-0 mt-0.5" />
            <div className="text-xs text-[#137333] dark:text-[#ceead6] space-y-1">
              <p className="font-semibold text-[#0d652d] dark:text-[#e6f4ea]">
                Respire fundo. Cansaço não é falta de disciplina.
              </p>
              <p className="leading-relaxed opacity-90">
                Dias atípicos acontecem com todo estudante de alto rendimento. O segredo da consistência de longo prazo não é forçar a exaustão, mas saber recalibrar sem perder o ânimo.
              </p>
            </div>
          </div>
        </div>

        {/* Current status summary */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs text-[#5f6368] dark:text-[#9aa0a6] px-1">
            <span>Tarefas pendentes hoje:</span>
            <span className="font-semibold text-[#202124] dark:text-[#e8eaed] font-mono tabular-nums">
              {pendingToday.length} tarefas ({totalPendingMinutes} min)
            </span>
          </div>

          {pendingToday.length > 0 ? (
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
              {pendingToday.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-medium text-[#202124] dark:text-[#e8eaed] block truncate">
                      {task.title}
                    </span>
                    <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
                      {task.subject}
                    </span>
                  </div>
                  <span className="text-[#5f6368] dark:text-[#9aa0a6] font-mono tabular-nums shrink-0">
                    {task.estimatedMinutes} min
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center rounded-2xl bg-[#f8fafd] dark:bg-[#2d2f31] border border-[#dadce0] dark:border-[#3c4043] text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              Não há tarefas pendentes para hoje. Seu dia está leve e organizado!
            </div>
          )}

          {pendingToday.length > 0 && (
            <div className="p-3.5 bg-[#f1f3f4] dark:bg-[#2d2f31] rounded-2xl text-xs space-y-1.5 border border-[#dadce0] dark:border-[#3c4043]">
              <div className="flex items-center gap-1.5 font-medium text-[#202124] dark:text-[#e8eaed]">
                <Calendar className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>O que o algoritmo fará agora:</span>
              </div>
              <p className="text-[#5f6368] dark:text-[#9aa0a6] text-[11px] leading-relaxed">
                Essas {pendingToday.length} pendências serão diluídas suavemente nos próximos 3 dias úteis com menor carga horária individual, garantindo que nenhum dia futuro vire uma bola de neve.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#f1f3f4] dark:border-[#3c4043]">
          <button
            onClick={() => setIsRescueModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmRescue}
            disabled={pendingToday.length === 0}
            className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-[#1e8e3e] hover:bg-[#137333] disabled:opacity-50 disabled:pointer-events-none rounded-full transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rebalancear Sem Culpa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
