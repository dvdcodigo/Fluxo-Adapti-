import React, { useState } from 'react';
import { X, BookPlus, Sparkles, Palette, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SubjectModal: React.FC = () => {
  const { isSubjectModalOpen, setIsSubjectModalOpen, addCustomSubject, addGardenTopic } = useApp();

  const [name, setName] = useState('');
  const [totalTopics, setTotalTopics] = useState(10);
  const [initialTopic, setInitialTopic] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');

  if (!isSubjectModalOpen) return null;

  const colorOptions = [
    { label: 'Índigo', color: '#6366f1' },
    { label: 'Esmeralda', color: '#059669' },
    { label: 'Azul', color: '#3b82f6' },
    { label: 'Roxo', color: '#8b5cf6' },
    { label: 'Teal', color: '#0d9488' },
    { label: 'Rosa', color: '#e11d48' },
    { label: 'Âmbar', color: '#d97706' },
    { label: 'Céu', color: '#0284c7' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomSubject({
      name: name.trim(),
      totalTopics: Number(totalTopics) || 10,
      color: selectedColor,
    });

    if (initialTopic.trim()) {
      addGardenTopic({
        subject: name.trim(),
        title: initialTopic.trim(),
        initialScore: 20,
      });
    }

    setName('');
    setInitialTopic('');
    setIsSubjectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Adicionar Tema / Disciplina
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Crie um novo módulo no seu cronograma e edital
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubjectModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nome do Tema ou Curso
            </label>
            <input
              type="text"
              required
              placeholder="Ex.: Engenharia de Software: Dev na Área de IA (Imersão Alura + Google)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Total topics */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Estimativa de Tópicos / Módulos</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="100"
                value={totalTopics}
                onChange={e => setTotalTopics(parseInt(e.target.value) || 1)}
                className="w-24 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Usado para calcular a % de cobertura do edital / curso
              </span>
            </div>
          </div>

          {/* Color Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Cor Identificadora</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colorOptions.map(c => (
                <button
                  type="button"
                  key={c.color}
                  onClick={() => setSelectedColor(c.color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor === c.color ? 'scale-110 border-slate-900 dark:border-white shadow-xs' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Optional First Topic to Plant in Garden */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Primeiro Tópico para o Jardim (Opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex.: Engenharia de Prompts e Agentes com Gemini"
              value={initialTopic}
              onChange={e => setInitialTopic(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Planta essa semente imediatamente no seu Jardim do Conhecimento.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-xs"
            >
              Criar Tema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
