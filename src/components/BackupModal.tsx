import React, { useRef } from 'react';
import { X, Download, Upload, ShieldCheck, HardDrive, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BackupModal: React.FC = () => {
  const { isBackupModalOpen, setIsBackupModalOpen, exportBackup, importBackup, lastSavedAt } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBackupModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackup(content);
        if (success) {
          setIsBackupModalOpen(false);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Armazenamento & Backup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Seus dados ficam sempre salvos neste navegador
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live auto-save status */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-3.5 mb-4 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs text-emerald-900 dark:text-emerald-200">
            <span className="font-semibold block">Salvo automaticamente</span>
            <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
              {lastSavedAt}. Tudo que você adicionar ou editar permanece guardado.
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Para garantir que seu cronograma e temas (como <em>Engenharia de Software</em>) estejam seguros mesmo se você limpar o histórico do navegador ou mudar de máquina, faça um download do seu backup:
        </p>

        {/* Action options */}
        <div className="space-y-2.5 mb-5">
          <button
            onClick={exportBackup}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-left transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Exportar Backup (.json)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Baixe um arquivo seguro com todos os seus temas e tarefas
                </span>
              </div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-left transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                  Restaurar de um Arquivo (.json)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Carregue um arquivo salvo anteriormente
                </span>
              </div>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setIsBackupModalOpen(false)}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
