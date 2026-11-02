import React from 'react';
import { Trash2, X, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ClearConfirmModal: React.FC = () => {
  const { isClearModalOpen, setIsClearModalOpen, clearAllData, resetToDefaults } = useApp();

  if (!isClearModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Zerar Cronograma
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comece do zero com sua própria rotina
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsClearModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 rounded-xl p-4 mb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Folha em branco para suas próprias metas
          </p>
          <p>
            Ao zerar, todas as tarefas, revisões e tópicos de exemplo serão removidos para que você monte seu cronograma personalizado (ex.: <em>Engenharia de Software: Dev na Área de IA</em>).
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
            Você poderá restaurar os dados de demonstração a qualquer momento se desejar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              resetToDefaults();
              setIsClearModalOpen(false);
            }}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Demo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearAllData();
              setIsClearModalOpen(false);
            }}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Zerar Tudo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
