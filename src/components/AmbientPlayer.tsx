import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, CloudRain, Waves, BookOpen, Music, Square } from 'lucide-react';
import { soundSynthesizer, AmbientSoundType } from '../utils/audioSynthesizer';

interface AmbientPlayerProps {
  compact?: boolean;
}

export const AmbientPlayer: React.FC<AmbientPlayerProps> = ({ compact = false }) => {
  const [currentSound, setCurrentSound] = useState<AmbientSoundType>('off');
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setCurrentSound(soundSynthesizer.getCurrentType());
    setVolume(soundSynthesizer.getVolume());
    setIsMuted(soundSynthesizer.getMuted());
  }, []);

  const handleSelectSound = (type: AmbientSoundType) => {
    soundSynthesizer.play(type);
    setCurrentSound(soundSynthesizer.getCurrentType());
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    soundSynthesizer.setVolume(newVol);
    if (isMuted && newVol > 0) {
      soundSynthesizer.toggleMute();
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const muted = soundSynthesizer.toggleMute();
    setIsMuted(muted);
  };

  const sounds: { type: AmbientSoundType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: 'chuva', label: 'Chuva Suave', icon: <CloudRain className="w-4 h-4" />, desc: 'Gotas e relaxamento' },
    { type: 'marrom', label: 'Ruído Marrom', icon: <Waves className="w-4 h-4" />, desc: 'Foco profundo & TDAH' },
    { type: 'biblioteca', label: 'Biblioteca', icon: <BookOpen className="w-4 h-4" />, desc: 'Ambiência silenciosa' },
    { type: 'lofi', label: 'Lo-Fi Melódico', icon: <Music className="w-4 h-4" />, desc: 'Acordes suaves de piano' },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#5f6368] dark:text-[#9aa0a6] font-medium">Áudio:</span>
        <div className="flex items-center gap-1 bg-[#f1f3f4] dark:bg-[#2d2f31] p-1 rounded-full">
          {sounds.map(s => {
            const isActive = currentSound === s.type;
            return (
              <button
                key={s.type}
                onClick={() => handleSelectSound(s.type)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ffffff] dark:bg-[#1e1f20] text-[#1a73e8] dark:text-[#8ab4f8] shadow-2xs font-semibold'
                    : 'text-[#444746] dark:text-[#c4c7c5] hover:text-[#1f1f1f] dark:hover:text-[#ffffff]'
                }`}
                title={s.desc}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
          {currentSound !== 'off' && (
            <button
              onClick={() => handleSelectSound('off')}
              className="p-1 text-[#5f6368] hover:text-[#d93025] dark:hover:text-[#f28b82]"
              title="Desligar som"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#1e1f20] border border-[#dadce0] dark:border-[#3c4043] rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-[#1f1f1f] dark:text-[#e3e3e3] font-google">
            Áudio Ambiente para Concentração
          </h4>
          <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
            Sintetizador acústico gerado localmente sem distrações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="p-1.5 text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#1f1f1f] dark:hover:text-[#ffffff] rounded-full"
            aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#ea4335]" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1.5 bg-[#dadce0] dark:bg-[#3c4043] rounded-lg cursor-pointer"
            aria-label="Volume do áudio ambiente"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {sounds.map(s => {
          const isActive = currentSound === s.type;
          return (
            <button
              key={s.type}
              onClick={() => handleSelectSound(s.type)}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'border-[#1a73e8] bg-[#e8f0fe] dark:bg-[#1a73e8]/20 text-[#001d35] dark:text-[#c2e7ff] ring-1 ring-[#1a73e8]'
                  : 'border-[#dadce0] dark:border-[#3c4043] hover:border-[#1a73e8]/40 bg-[#f8fafd] dark:bg-[#202124] text-[#444746] dark:text-[#c4c7c5]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={isActive ? 'text-[#1a73e8] dark:text-[#8ab4f8]' : 'text-[#5f6368] dark:text-[#9aa0a6]'}>
                  {s.icon}
                </span>
                {isActive && (
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#1a73e8] dark:text-[#8ab4f8] px-1.5 py-0.5 rounded-full bg-white/70 dark:bg-black/30">
                    Ativo
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">{s.label}</span>
              <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] mt-0.5 line-clamp-1">{s.desc}</span>
            </button>
          );
        })}
      </div>

      {currentSound !== 'off' && (
        <div className="mt-3 pt-3 border-t border-[#f1f3f4] dark:border-[#2d2f31] flex items-center justify-between text-xs">
          <span className="text-[#5f6368] dark:text-[#9aa0a6]">
            Tocando agora: <strong className="font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">{sounds.find(s => s.type === currentSound)?.label}</strong>
          </span>
          <button
            onClick={() => handleSelectSound('off')}
            className="text-xs text-[#5f6368] hover:text-[#d93025] dark:text-[#9aa0a6] dark:hover:text-[#f28b82] font-medium"
          >
            Pausar áudio
          </button>
        </div>
      )}
    </div>
  );
};
