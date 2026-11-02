import React, { useState } from 'react';
import {
  Brain,
  RotateCw,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Flashcard } from '../types';

export const SpacedReviews: React.FC = () => {
  const { spacedReviews, completeReview, reviewFlashcard } = useApp();

  const [selectedStage, setSelectedStage] = useState<'todos' | 'D+1' | 'D+7' | 'D+30' | 'D+60'>('todos');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(
    spacedReviews.find(r => r.status === 'pronta')?.id || spacedReviews[0]?.id || null
  );

  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const activeReview = spacedReviews.find(r => r.id === activeReviewId);
  const readyTodayCount = spacedReviews.filter(r => r.status === 'pronta' || r.daysOverdueOrLeft === 0).length;

  const filteredReviews = spacedReviews.filter(r => {
    if (selectedStage === 'todos') return true;
    return r.stage === selectedStage;
  });

  const handleCardRating = (card: Flashcard, rating: 'facil' | 'bom' | 'dificil' | 'esqueci') => {
    if (!activeReview) return;
    reviewFlashcard(activeReview.id, card.id, rating);
    setIsAnswerRevealed(false);

    if (currentCardIndex < (activeReview.flashcards.length - 1)) {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleCompleteCurrentReview = () => {
    if (!activeReview) return;
    completeReview(activeReview.id);
    setIsAnswerRevealed(false);
    setCurrentCardIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Scientific & Anti-Guilt Framing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#dadce0] dark:border-[#3c4043]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-medium mb-1">
            <span className="text-[#1a73e8] dark:text-[#8ab4f8] font-semibold">Google Classroom & Ebbinghaus</span>
            <span aria-hidden="true">·</span>
            <span>Fixação de Longo Prazo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] dark:text-[#e3e3e3] tracking-tight font-google">
            Central de <strong className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">Revisões Espaçadas</strong>
          </h1>
          <p className="text-xs sm:text-sm text-[#444746] dark:text-[#c4c7c5] mt-1 max-w-2xl">
            Revisar nos intervalos certos (D+1, D+7, D+30) consolida sinapses de forma permanente sem a necessidade de reestudar tudo do zero.
          </p>
        </div>

        {/* Counter Widget - Google Style */}
        <div className="flex items-center gap-3 bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-3 px-4 shadow-2xs shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1a73e8] dark:text-[#8ab4f8] flex items-center justify-center font-bold">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-[#1f1f1f] dark:text-[#e3e3e3] font-mono tabular-nums leading-none block">
              {readyTodayCount} {readyTodayCount === 1 ? 'tópico pronto' : 'tópicos prontos'}
            </span>
            <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
              para revisar hoje
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Explanation of Spaced Intervals with 4 Google Colors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            stage: 'D+1 (24 Horas)',
            desc: 'Combate a perda imediata de 60% da memória de trabalho.',
            badge: 'Intervenção Crítica',
            color: 'text-[#1a73e8] dark:text-[#8ab4f8]',
            bar: 'bg-[#1a73e8]',
          },
          {
            stage: 'D+7 (1 Semana)',
            desc: 'Reforça o caminho neural antes que a curva volte a cair.',
            badge: 'Consolidação',
            color: 'text-[#0d9488] dark:text-[#2dd4bf]',
            bar: 'bg-[#0d9488]',
          },
          {
            stage: 'D+30 (1 Mês)',
            desc: 'Transfere o conhecimento para a memória de longo prazo.',
            badge: 'Estabilização',
            color: 'text-[#188038] dark:text-[#81c995]',
            bar: 'bg-[#188038]',
          },
          {
            stage: 'D+60 (2 Meses)',
            desc: 'Manutenção sem esforço com flashcards de alta velocidade.',
            badge: 'Domínio Permanente',
            color: 'text-[#b06000] dark:text-[#fdd663]',
            bar: 'bg-[#fbbc04]',
          },
        ].map(item => (
          <div
            key={item.stage}
            className="p-4 rounded-2xl bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] text-xs shadow-2xs relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${item.bar}`} />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] block mb-1">
              {item.badge}
            </span>
            <h3 className={`font-bold text-sm ${item.color} mb-1 font-google`}>
              {item.stage}
            </h3>
            <p className="text-[#5f6368] dark:text-[#9aa0a6] text-[11px] leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Stage Filter & Main Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Review Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
              Fila de Revisões
            </h2>
            {/* Stage filter pills */}
            <div className="flex items-center gap-1 p-1 bg-[#f1f3f4] dark:bg-[#2d2f31] rounded-full text-xs">
              {(['todos', 'D+1', 'D+7', 'D+30', 'D+60'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedStage(tab)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    selectedStage === tab
                      ? 'bg-[#ffffff] dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] shadow-2xs font-semibold'
                      : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
                  }`}
                >
                  {tab === 'todos' ? 'Todos' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredReviews.length === 0 ? (
              <div className="p-8 text-center bg-[#ffffff] dark:bg-[#1e1f20] rounded-2xl border border-[#dadce0] dark:border-[#3c4043] text-xs text-[#5f6368]">
                Nenhuma revisão agendada para este filtro.
              </div>
            ) : (
              filteredReviews.map(review => {
                const isSelected = activeReviewId === review.id;
                const isReady = review.status === 'pronta' || review.daysOverdueOrLeft === 0;

                return (
                  <button
                    key={review.id}
                    onClick={() => {
                      setActiveReviewId(review.id);
                      setIsAnswerRevealed(false);
                      setCurrentCardIndex(0);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/80 dark:bg-[#1a73e8]/20 text-[#001d35] dark:text-[#c2e7ff] ring-1 ring-[#1a73e8] shadow-2xs'
                        : 'border-[#dadce0] dark:border-[#3c4043] bg-[#ffffff] dark:bg-[#1e1f20] hover:border-[#1a73e8]/40 text-[#444746] dark:text-[#c4c7c5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
                        {review.subject}
                      </span>
                      <span className="font-mono tabular-nums text-[11px] px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/30 font-semibold text-[#5f6368] dark:text-[#9aa0a6] shadow-2xs">
                        {review.stage}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-medium text-[#1f1f1f] dark:text-[#e3e3e3] line-clamp-1">
                      {review.topicTitle}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-[#5f6368] dark:text-[#9aa0a6] mt-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#5f6368]" />
                        {isReady ? (
                          <strong className="text-[#137333] dark:text-[#81c995] font-semibold">
                            Pronta para hoje
                          </strong>
                        ) : (
                          `Em ${review.daysOverdueOrLeft} dias`
                        )}
                      </span>
                      <span>{review.flashcards.length} card(s) ativo(s)</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Active Recall / Flashcard Area */}
        <div className="lg:col-span-7">
          {activeReview ? (
            <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-3xl p-6 shadow-2xs flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Active review header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4] dark:border-[#2d2f31] mb-4">
                  <div>
                    <span className="text-xs font-semibold text-[#1a73e8] dark:text-[#8ab4f8]">
                      {activeReview.subject} · {activeReview.stage}
                    </span>
                    <h3 className="text-base font-bold text-[#1f1f1f] dark:text-[#e3e3e3] mt-0.5 font-google">
                      {activeReview.topicTitle}
                    </h3>
                  </div>
                  <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] font-mono tabular-nums">
                    Card {currentCardIndex + 1} de {activeReview.flashcards.length}
                  </span>
                </div>

                {/* The Flashcard */}
                {activeReview.flashcards.length > 0 ? (
                  (() => {
                    const currentCard = activeReview.flashcards[currentCardIndex];
                    return (
                      <div className="space-y-4">
                        {/* Front (Question) */}
                        <div className="bg-[#f8fafd] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-6 relative shadow-2xs">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] mb-2 block flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#1a73e8]" />
                            <span>Pergunta / Recordação Ativa</span>
                          </span>
                          <p className="text-sm sm:text-base font-normal text-[#1f1f1f] dark:text-[#e3e3e3] leading-relaxed">
                            {currentCard.question}
                          </p>
                        </div>

                        {/* Back (Answer) Revealed or Hidden */}
                        {isAnswerRevealed ? (
                          <div className="bg-[#e6f4ea] dark:bg-[#137333]/20 border border-[#ceead6] dark:border-[#137333]/40 rounded-2xl p-6 animate-in fade-in duration-200 shadow-2xs">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#137333] dark:text-[#81c995] mb-2 block flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#34a853]" />
                              <span>Resposta & Validação</span>
                            </span>
                            <p className="text-sm font-normal text-[#1f1f1f] dark:text-[#e3e3e3] leading-relaxed">
                              {currentCard.answer}
                            </p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsAnswerRevealed(true)}
                            className="w-full py-8 border-2 border-dashed border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8] dark:hover:border-[#8ab4f8] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1a73e8] dark:hover:text-[#8ab4f8] transition-all cursor-pointer bg-[#f8fafd]/50 dark:bg-[#202124]/50"
                          >
                            <Eye className="w-5 h-5" />
                            <span className="text-xs sm:text-sm font-medium">
                              Clique para Revelar a Resposta & Checar Retenção
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-[#5f6368]">Nenhum card cadastrado para este tópico.</p>
                )}
              </div>

              {/* Bottom Actions based on card reveal */}
              <div className="pt-4 border-t border-[#f1f3f4] dark:border-[#2d2f31] mt-6">
                {isAnswerRevealed && activeReview.flashcards.length > 0 ? (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-[#1f1f1f] dark:text-[#e3e3e3] block text-center">
                      Qual foi o nível de facilidade da recordação?
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleCardRating(activeReview.flashcards[currentCardIndex], 'esqueci')}
                        className="py-2.5 px-2 text-xs font-medium rounded-full border border-[#dadce0] dark:border-[#3c4043] hover:bg-[#fce8e6] dark:hover:bg-[#d93025]/20 text-[#d93025] dark:text-[#f28b82] transition-colors"
                      >
                        Esqueci (D+1)
                      </button>
                      <button
                        onClick={() => handleCardRating(activeReview.flashcards[currentCardIndex], 'dificil')}
                        className="py-2.5 px-2 text-xs font-medium rounded-full border border-[#dadce0] dark:border-[#3c4043] hover:bg-[#fef7e0] dark:hover:bg-[#fbbc04]/20 text-[#b06000] dark:text-[#fdd663] transition-colors"
                      >
                        Difícil (D+2)
                      </button>
                      <button
                        onClick={() => handleCardRating(activeReview.flashcards[currentCardIndex], 'bom')}
                        className="py-2.5 px-2 text-xs font-medium rounded-full border border-[#d2e3fc] dark:border-[#1a73e8]/40 bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#1967d2] dark:text-[#8ab4f8] transition-colors"
                      >
                        Bom (D+7)
                      </button>
                      <button
                        onClick={() => handleCardRating(activeReview.flashcards[currentCardIndex], 'facil')}
                        className="py-2.5 px-2 text-xs font-medium rounded-full border border-[#ceead6] dark:border-[#137333]/40 bg-[#e6f4ea] dark:bg-[#137333]/20 text-[#137333] dark:text-[#81c995] transition-colors font-semibold"
                      >
                        Fácil (D+14)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                      Tópico com {activeReview.flashcards[currentCardIndex]?.reviewCount || 1} revisões registradas
                    </span>
                    <button
                      onClick={handleCompleteCurrentReview}
                      className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-full transition-all shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Concluir Revisão</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#ffffff] dark:bg-[#1e1f20] rounded-3xl border border-[#dadce0] dark:border-[#3c4043]">
              <Brain className="w-8 h-8 text-[#5f6368] mx-auto mb-3" />
              <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6]">
                Selecione um tópico na lista ao lado para iniciar sua revisão espaçada.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
