import React from 'react';
import { Sun, Moon, LifeBuoy, BookPlus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp, AppTab } from '../context/AppContext';
import { GoogleFluxoLogo } from './GoogleFluxoLogo';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    setIsRescueModalOpen,
    setIsClearModalOpen,
    setIsSubjectModalOpen,
    setIsBackupModalOpen,
    lastSavedAt,
  } = useApp();

  const navItems: { id: AppTab; label: string }[] = [
    { id: 'hoje', label: 'Hoje' },
    { id: 'foco', label: 'Modo Foco' },
    { id: 'revisoes', label: 'Revisões Espaçadas' },
    { id: 'cronograma', label: 'Cronograma & Edital' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#ffffff] dark:bg-[#1e1f20] border-b border-[#dadce0] dark:border-[#3c4043] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Google Product Brand Lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('hoje')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
              title="Fluxo Adapti - Google Workspace Edition"
            >
              <GoogleFluxoLogo size={34} className="group-hover:scale-105 transition-transform" />
              <div className="flex items-baseline">
                <span className="text-[20px] font-normal tracking-tight text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
                  Fluxo <strong className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">Adapti</strong>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[11px] font-medium uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] px-1.5 py-0.5 rounded bg-[#f1f3f4] dark:bg-[#2d2f31]">
                  Workspace
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Material You (M3) Pill Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-1.5 text-xs sm:text-[13px] font-medium rounded-full whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#c2e7ff] text-[#001d35] dark:bg-[#004a77] dark:text-[#c2e7ff] font-semibold shadow-xs'
                      : 'text-[#444746] dark:text-[#c4c7c5] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Material You Actions & Google Account Circle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Add Custom Subject - Google Blue Style */}
            <button
              onClick={() => setIsSubjectModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#1a73e8] dark:text-[#8ab4f8] bg-[#f8fafd] dark:bg-[#202124] hover:bg-[#e8f0fe] dark:hover:bg-[#1a73e8]/20 rounded-full transition-colors border border-[#dadce0] dark:border-[#3c4043] whitespace-nowrap shadow-2xs"
              title="Adicionar novo tema, matéria ou curso"
            >
              <BookPlus className="w-3.5 h-3.5" />
              <span>Novo Tema</span>
            </button>

            {/* Quick Modo Socorro action - Google Green Style */}
            <button
              onClick={() => setIsRescueModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#137333] dark:text-[#81c995] bg-[#e6f4ea] dark:bg-[#137333]/20 hover:bg-[#ceead6] dark:hover:bg-[#137333]/30 rounded-full transition-colors whitespace-nowrap border border-[#ceead6] dark:border-[#137333]/40"
              title="Redistribui tarefas pendentes de hoje sem culpa"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Socorro</span>
            </button>

            {/* Live Saved status badge & Backup modal trigger */}
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors border border-[#dadce0] dark:border-[#3c4043]"
              title={`Armazenamento automático ativo: ${lastSavedAt}`}
            >
              <div className="w-2 h-2 rounded-full bg-[#34a853]" />
              <span className="text-[11px] font-medium">Salvo</span>
            </button>

            {/* Theme Toggle - Material button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors"
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#fbbc04]" /> : <Moon className="w-4 h-4 text-[#5f6368]" />}
            </button>

            {/* Clear / Zerar cronograma */}
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="p-2 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#d93025] dark:hover:text-[#f28b82] hover:bg-[#fce8e6] dark:hover:bg-[#d93025]/20 rounded-full transition-colors"
              title="Zerar cronograma para começar do zero"
              aria-label="Zerar cronograma"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Google Profile Circle Avatar */}
            <div
              className="w-8 h-8 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-medium text-xs shadow-xs cursor-pointer select-none ml-1 ring-2 ring-white dark:ring-[#1e1f20]"
              title="Conta Google de Estudos"
            >
              D
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
