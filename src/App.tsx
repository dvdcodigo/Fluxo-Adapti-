import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RescueModal } from './components/RescueModal';
import { TaskModal } from './components/TaskModal';
import { TodayDashboard } from './views/TodayDashboard';
import { FocusMode } from './views/FocusMode';
import { SpacedReviews } from './views/SpacedReviews';
import { ScheduleAndGarden } from './views/ScheduleAndGarden';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { SubjectModal } from './components/SubjectModal';
import { BackupModal } from './components/BackupModal';
import { CheckCircle2, Info, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-[#f8fafd] dark:bg-[#131314] text-[#1f1f1f] dark:text-[#e3e3e3] flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Header */}
      <Header />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'hoje' && <TodayDashboard />}
        {activeTab === 'foco' && <FocusMode />}
        {activeTab === 'revisoes' && <SpacedReviews />}
        {activeTab === 'cronograma' && <ScheduleAndGarden />}
      </main>

      {/* Gentle Toast Notification for Anti-Guilt Rebalancing & Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#ffffff] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-1.5 rounded-full bg-[#e6f4ea] dark:bg-[#137333]/30 text-[#137333] dark:text-[#81c995] shrink-0">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
            ) : (
              <Info className="w-4 h-4 text-[#1a73e8]" />
            )}
          </div>
          <div className="text-xs text-[#1f1f1f] dark:text-[#e3e3e3] leading-relaxed">
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* Modals */}
      <RescueModal />
      <TaskModal />
      <ClearConfirmModal />
      <SubjectModal />
      <BackupModal />

      {/* Google Material Clean Footer */}
      <footer className="border-t border-[#dadce0] dark:border-[#3c4043] py-6 text-center text-xs text-[#5f6368] dark:text-[#9aa0a6] bg-[#ffffff]/50 dark:bg-[#1e1f20]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
              <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
            </div>
            <span className="font-google">Fluxo Adapti — Produtividade sustentável inspirada nos produtos Google</span>
          </div>
          <div className="flex items-center gap-4 text-[#5f6368] dark:text-[#9aa0a6]">
            <span>Material You & Ebbinghaus</span>
            <span aria-hidden="true">·</span>
            <span>Google Workspace Style</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
