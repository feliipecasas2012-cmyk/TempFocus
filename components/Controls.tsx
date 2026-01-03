import React from 'react';
import { Play, Pause, RotateCcw, Settings, Maximize, Minimize } from 'lucide-react';
import { TimerState, ColorTheme } from '../types';

interface ControlsProps {
  timerState: TimerState;
  onToggle: () => void;
  onReset: () => void;
  onOpenSettings: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  theme: ColorTheme;
  visible: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  timerState,
  onToggle,
  onReset,
  onOpenSettings,
  onToggleFullscreen,
  isFullscreen,
  theme,
  visible
}) => {
  const isRunning = timerState === TimerState.RUNNING;
  
  // Dynamic class to handle visibility fade
  const visibilityClass = visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none';

  // Cleaner button style: High transparency, thin borders, subtle hover
  const buttonBaseClass = `rounded-full border border-white/20 hover:border-white/80 transition-all duration-300 bg-transparent hover:bg-white/5 active:scale-95 flex items-center justify-center ${theme}`;

  return (
    <div className={`fixed bottom-0 left-0 w-full pb-12 pt-24 px-8 flex flex-col items-center justify-end bg-gradient-to-t from-black via-black/90 to-transparent transition-all duration-700 ease-out ${visibilityClass}`}>
      <div className="flex items-center gap-8 md:gap-12">
        
        {/* Reset Button */}
        <button
          onClick={onReset}
          className={`${buttonBaseClass} w-14 h-14 text-white/50 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
          aria-label="Reiniciar"
        >
          <RotateCcw size={20} strokeWidth={2} />
        </button>

        {/* Play/Pause Button - Main Action */}
        <button
          onClick={onToggle}
          className={`${buttonBaseClass} w-24 h-24 sm:w-28 sm:h-28 border-white/30 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
          aria-label={isRunning ? "Pausar" : "Iniciar"}
        >
          {isRunning ? (
            <Pause size={40} fill="currentColor" className="opacity-100" />
          ) : (
            <Play size={40} fill="currentColor" className="opacity-100 ml-1" />
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className={`${buttonBaseClass} w-14 h-14 text-white/50 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
          aria-label="Configurações"
        >
          <Settings size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Fullscreen Toggle (Separate from main cluster) */}
      <button
        onClick={onToggleFullscreen}
        className={`absolute top-6 right-6 p-3 rounded-full hover:bg-white/10 transition-all text-neutral-500 hover:text-white opacity-60 hover:opacity-100`}
        aria-label="Alternar Tela Cheia"
      >
        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>
    </div>
  );
};

export default Controls;