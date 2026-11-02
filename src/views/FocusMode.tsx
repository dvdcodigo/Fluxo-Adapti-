import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Coffee,
  Sparkles,
  Flame,
  FileText,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AmbientPlayer } from '../components/AmbientPlayer';
import { FinishSessionModal } from '../components/FinishSessionModal';

type TimerMode = 'pomodoro' | 'fluxo_livre';
type PomodoroPhase = 'foco' | 'pausa';

export const FocusMode: React.FC = () => {
  const { tasks, activeFocusTask, setActiveFocusTask } = useApp();

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [phase, setPhase] = useState<PomodoroPhase>('foco');
  const [isRunning, setIsRunning] = useState(false);

  // Pomodoro duration options (in minutes)
  const [pomodoroFocusMinutes, setPomodoroFocusMinutes] = useState(25);
  const [pomodoroBreakMinutes, setPomodoroBreakMinutes] = useState(5);

  // Time remaining in seconds for Pomodoro (default 25 * 60)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);

  // Free flow stopwatch elapsed seconds
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Quick session notes (distraction dump) persisted to localStorage
  const [sessionNotes, setSessionNotes] = useState(() => {
    return localStorage.getItem('fluxo_adapti_focus_notes') || '';
  });

  useEffect(() => {
    localStorage.setItem('fluxo_adapti_focus_notes', sessionNotes);
  }, [sessionNotes]);

  // Finish modal
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [completedMinutesForModal, setCompletedMinutesForModal] = useState(25);

  // Timer interval ref
  const intervalRef = useRef<number | null>(null);

  // Sync with activeFocusTask if it changes
  useEffect(() => {
    if (activeFocusTask) {
      if (activeFocusTask.estimatedMinutes) {
        setPomodoroFocusMinutes(activeFocusTask.estimatedMinutes);
        setTimeLeftSeconds(activeFocusTask.estimatedMinutes * 60);
      }
      if (activeFocusTask.notes) {
        setSessionNotes(activeFocusTask.notes);
      }
    }
  }, [activeFocusTask]);

  // Main countdown / stopwatch effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (mode === 'pomodoro') {
          setTimeLeftSeconds(prev => {
            if (prev <= 1) {
              if (phase === 'foco') {
                setPhase('pausa');
                return pomodoroBreakMinutes * 60;
              } else {
                setPhase('foco');
                return pomodoroFocusMinutes * 60;
              }
            }
            return prev - 1;
          });
        } else {
          setElapsedSeconds(prev => prev + 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, phase, pomodoroBreakMinutes, pomodoroFocusMinutes]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      const targetMins = phase === 'foco' ? pomodoroFocusMinutes : pomodoroBreakMinutes;
      setTimeLeftSeconds(targetMins * 60);
    } else {
      setElapsedSeconds(0);
    }
  };

  const handleSelectMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'pomodoro') {
      setPhase('foco');
      setTimeLeftSeconds(pomodoroFocusMinutes * 60);
    } else {
      setElapsedSeconds(0);
    }
  };

  const handleSetPomodoroPreset = (focusMins: number, breakMins: number) => {
    setIsRunning(false);
    setPomodoroFocusMinutes(focusMins);
    setPomodoroBreakMinutes(breakMins);
    setPhase('foco');
    setTimeLeftSeconds(focusMins * 60);
  };

  const handleTriggerFinish = () => {
    setIsRunning(false);
    let minutesSpent = 0;
    if (mode === 'pomodoro') {
      const totalSecs = (phase === 'foco' ? pomodoroFocusMinutes : pomodoroBreakMinutes) * 60;
      const spentSecs = totalSecs - timeLeftSeconds;
      minutesSpent = Math.max(1, Math.round(spentSecs / 60));
    } else {
      minutesSpent = Math.max(1, Math.round(elapsedSeconds / 60));
    }

    setCompletedMinutesForModal(minutesSpent);
    setIsFinishModalOpen(true);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalPhaseSeconds =
    mode === 'pomodoro'
      ? (phase === 'foco' ? pomodoroFocusMinutes : pomodoroBreakMinutes) * 60
      : 3600;

  const progressPercent =
    mode === 'pomodoro'
      ? ((totalPhaseSeconds - timeLeftSeconds) / totalPhaseSeconds) * 100
      : ((elapsedSeconds % 3600) / 3600) * 100;

  const pendingTasks = tasks.filter(t => t.status === 'pendente');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Header & Active Task Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-medium mb-1">
            <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-semibold">Google Clock & Focus</span>
            <span aria-hidden="true">·</span>
            <span>Deep Work Sem Distrações</span>
          </div>
          <h1 className="text-2xl font-normal text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
            Modo <strong className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">Foco Profundo</strong>
          </h1>
        </div>

        {/* Task Selector Dropdown - Material Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] hidden md:inline">Tarefa vinculada:</span>
          <select
            value={activeFocusTask?.id || ''}
            onChange={e => {
              const selected = tasks.find(t => t.id === e.target.value) || null;
              setActiveFocusTask(selected);
            }}
            className="text-xs px-3.5 py-2 bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-full text-[#1f1f1f] dark:text-[#e3e3e3] focus:outline-hidden focus:border-[#1a73e8] max-w-[260px] truncate shadow-2xs"
          >
            <option value="">(Fluxo Livre Geral / Sem Tarefa)</option>
            {pendingTasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.subject}: {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active task badge notice */}
      {activeFocusTask && (
        <div className="bg-[#e8f0fe] dark:bg-[#1a73e8]/20 border border-[#d2e3fc] dark:border-[#1a73e8]/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-[#1967d2] dark:text-[#8ab4f8] block uppercase tracking-wider">
              {activeFocusTask.subject}
            </span>
            <span className="text-sm font-semibold text-[#001d35] dark:text-[#e8eaed] truncate block">
              {activeFocusTask.title}
            </span>
          </div>
          <button
            onClick={() => setActiveFocusTask(null)}
            className="text-xs text-[#1a73e8] dark:text-[#8ab4f8] hover:underline shrink-0 font-medium"
          >
            Desvincular
          </button>
        </div>
      )}

      {/* 2. Main Focus Timer Interface - Material Clock aesthetic */}
      <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl p-6 sm:p-8 shadow-xs text-center relative overflow-hidden">
        {/* Soft Google Blue / Green background aura */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
            isRunning ? 'opacity-25 bg-[#1a73e8]/20' : 'opacity-10 bg-[#5f6368]/15'
          }`}
        />

        {/* Mode Selector Tabs (Material Pill Tabs) */}
        <div className="inline-flex items-center gap-1 p-1 bg-[#f1f3f4] dark:bg-[#2d2f31] rounded-full mb-6">
          <button
            onClick={() => handleSelectMode('pomodoro')}
            className={`px-5 py-2 text-xs font-medium rounded-full transition-all ${
              mode === 'pomodoro'
                ? 'bg-[#ffffff] dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] shadow-xs font-semibold'
                : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
            }`}
          >
            Pomodoro Adaptativo
          </button>
          <button
            onClick={() => handleSelectMode('fluxo_livre')}
            className={`px-5 py-2 text-xs font-medium rounded-full transition-all ${
              mode === 'fluxo_livre'
                ? 'bg-[#ffffff] dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] shadow-xs font-semibold'
                : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
            }`}
          >
            Modo Fluxo Livre
          </button>
        </div>

        {/* Pomodoro Presets */}
        {mode === 'pomodoro' && (
          <div className="flex items-center justify-center gap-2 mb-6 text-xs flex-wrap">
            <span className="text-[#5f6368] dark:text-[#9aa0a6] text-xs">Ritmo:</span>
            {[
              { focus: 25, brk: 5, label: '25/5 min (Clássico)' },
              { focus: 50, brk: 10, label: '50/10 min (Imersão)' },
              { focus: 15, brk: 3, label: '15/3 min (Micro-Sprint)' },
            ].map(preset => {
              const isCurrent = pomodoroFocusMinutes === preset.focus && pomodoroBreakMinutes === preset.brk;
              return (
                <button
                  key={preset.label}
                  onClick={() => handleSetPomodoroPreset(preset.focus, preset.brk)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                    isCurrent
                      ? 'bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1967d2] dark:text-[#8ab4f8] font-semibold border-[#d2e3fc] dark:border-[#1a73e8]/40'
                      : 'border-transparent text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Circular SVG Timer Display with Google Colors */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#f1f3f4] dark:stroke-[#2d2f31]"
              strokeWidth="4"
              fill="none"
            />
            {/* Active progress ring in Google Blue / Green */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-300 ${
                phase === 'pausa'
                  ? 'stroke-[#34a853]'
                  : 'stroke-[#1a73e8] dark:stroke-[#8ab4f8]'
              }`}
              strokeWidth="4.5"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Center Timer Numeric Output */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {mode === 'pomodoro' ? (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] mb-1 flex items-center gap-1">
                  {phase === 'foco' ? (
                    <>
                      <Flame className="w-3.5 h-3.5 text-[#ea4335]" />
                      <span className="text-[#ea4335]">Foco Total</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-3.5 h-3.5 text-[#34a853]" />
                      <span className="text-[#34a853]">Pausa Merecida</span>
                    </>
                  )}
                </span>
                <span className="text-5xl font-mono tabular-nums font-normal text-[#1f1f1f] dark:text-[#e3e3e3] tracking-tight">
                  {formatTime(timeLeftSeconds)}
                </span>
                <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1">
                  {phase === 'foco' ? `${pomodoroFocusMinutes} min previstos` : 'Respire fundo'}
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1a73e8] dark:text-[#8ab4f8] mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>Fluxo Livre</span>
                </span>
                <span className="text-5xl font-mono tabular-nums font-normal text-[#1f1f1f] dark:text-[#e3e3e3] tracking-tight">
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1">
                  Sem contagem regressiva
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls - Material You Pill Buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={resetTimer}
            className="p-3 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#2d2f31] rounded-full transition-colors"
            title="Reiniciar cronômetro"
            aria-label="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3 text-sm font-medium text-white rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md ${
              isRunning
                ? 'bg-[#3c4043] hover:bg-[#202124]'
                : 'bg-[#1a73e8] hover:bg-[#1557b0]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{timeLeftSeconds === pomodoroFocusMinutes * 60 && elapsedSeconds === 0 ? 'Iniciar Sessão' : 'Retomar'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleTriggerFinish}
            className="flex items-center gap-1.5 px-5 py-3 text-xs font-medium text-[#137333] dark:text-[#81c995] bg-[#e6f4ea] dark:bg-[#137333]/20 hover:bg-[#ceead6] dark:hover:bg-[#137333]/30 border border-[#ceead6] dark:border-[#137333]/40 rounded-full transition-all"
            title="Finalizar e registrar questões e retenção"
          >
            <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
            <span>Concluir</span>
          </button>
        </div>
      </div>

      {/* 3. Ambient Audio Player (Synthesizer) */}
      <AmbientPlayer />

      {/* 4. Quick Session Notes (Google Keep style) */}
      <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#fbbc04]" />
            <h3 className="text-sm font-semibold text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
              Anotações Rápidas & Dúvidas (Estilo Google Keep)
            </h3>
          </div>
          <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
            Salvo localmente
          </span>
        </div>
        <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mb-3">
          Surgiu uma dúvida ou ideia fora de hora? Anote aqui para pesquisar depois sem abrir abas que quebram seu foco.
        </p>
        <textarea
          rows={3}
          value={sessionNotes}
          onChange={e => setSessionNotes(e.target.value)}
          placeholder="Ex.: Pesquisar documentação do Gemini para structured output e rate limits..."
          className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#f8fafd] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-xl focus:outline-hidden focus:border-[#1a73e8] text-[#1f1f1f] dark:text-[#e3e3e3] resize-none"
        />
      </div>

      {/* 5. Finish Modal Confirmation */}
      <FinishSessionModal
        task={activeFocusTask}
        durationMinutes={completedMinutesForModal}
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onFinished={() => {
          setIsFinishModalOpen(false);
          resetTimer();
        }}
      />
    </div>
  );
};
