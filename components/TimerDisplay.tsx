import React from 'react';
import { ColorTheme } from '../types';

interface TimerDisplayProps {
  secondsRemaining: number;
  theme: ColorTheme;
  label?: string;
  nextSessionDuration?: number;
  nextLabel?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ 
  secondsRemaining, 
  theme, 
  label,
  nextSessionDuration,
  nextLabel
}) => {
  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(h)} : ${pad(m)} : ${pad(s)}`;
  };

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default relative w-full max-w-full px-4">
      {/* 
        Adjusted font sizes:
        - 11vw for mobile portrait (fits 12 chars: "00 : 00 : 00")
        - whitespace-nowrap ensures it never breaks lines
      */}
      <div 
        className={`font-mono text-[11vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw] leading-none tracking-tight whitespace-nowrap transition-colors duration-500 drop-shadow-[0_0_5px_currentColor] ${theme}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatTime(secondsRemaining)}
      </div>
      
      {label && (
        <div className={`mt-2 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.2em] opacity-80 uppercase transition-colors duration-500 drop-shadow-[0_0_3px_currentColor] ${theme}`}>
          {label}
        </div>
      )}

      {/* Secondary "Next Session" Display - Positioned relative to the main timer to avoid overlap */}
      {nextSessionDuration !== undefined && nextLabel && (
        <div className="absolute top-full mt-8 sm:mt-12 flex flex-col items-center animate-fade-in transition-opacity duration-500">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-600 mb-1">
            Próximo: {nextLabel}
          </span>
          <span className="font-mono text-lg sm:text-xl text-neutral-500/50 font-bold">
            {formatTime(nextSessionDuration)}
          </span>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;