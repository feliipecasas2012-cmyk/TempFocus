import React from 'react';
import { X, Volume2, VolumeX, Check } from 'lucide-react';
import { AppSettings, ColorTheme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const themes = [
    { value: ColorTheme.WHITE, label: 'Branco', colorClass: 'bg-white' },
    { value: ColorTheme.YELLOW, label: 'Amarelo', colorClass: 'bg-yellow-400' },
    { value: ColorTheme.GREEN, label: 'Verde', colorClass: 'bg-green-400' },
    { value: ColorTheme.ORANGE, label: 'Laranja', colorClass: 'bg-orange-400' },
    { value: ColorTheme.PINK, label: 'Rosa', colorClass: 'bg-pink-400' },
  ];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const update = (key: keyof AppSettings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-black border border-neutral-800 p-8 rounded-2xl w-full max-w-md mx-4 shadow-2xl relative text-neutral-200 font-sans max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-600 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-sm font-bold mb-8 text-neutral-400 font-mono tracking-[0.2em] uppercase">
          Configurações
        </h2>

        <div className="space-y-8">
          
          {/* Times */}
          <div className="space-y-4">
            <h3 className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2">Duração (Minutos)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs mb-2 text-neutral-500 group-hover:text-neutral-300 transition-colors">Foco</label>
                <input 
                  type="number" 
                  min="1"
                  max="180"
                  value={settings.focusDuration}
                  onChange={(e) => update('focusDuration', Number(e.target.value))}
                  className="w-full bg-transparent border border-neutral-800 hover:border-neutral-600 focus:border-white rounded-lg p-3 text-white outline-none transition-all text-center font-mono text-xl"
                />
              </div>
              <div className="group">
                <label className="block text-xs mb-2 text-neutral-500 group-hover:text-neutral-300 transition-colors">Intervalo</label>
                <input 
                  type="number" 
                  min="0"
                  max="60"
                  value={settings.breakDuration}
                  onChange={(e) => update('breakDuration', Number(e.target.value))}
                  className="w-full bg-transparent border border-neutral-800 hover:border-neutral-600 focus:border-white rounded-lg p-3 text-white outline-none transition-all text-center font-mono text-xl"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-neutral-900"></div>

          {/* Theme */}
          <div className="space-y-4">
            <h3 className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-2">Tema</h3>
            <div className="grid grid-cols-5 gap-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => update('theme', t.value)}
                  className={`h-10 rounded-lg border transition-all flex items-center justify-center relative ${
                    settings.theme === t.value 
                      ? 'border-neutral-500 bg-neutral-900' 
                      : 'border-neutral-800 bg-transparent hover:border-neutral-700'
                  }`}
                  aria-label={`Selecionar cor ${t.label}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${t.colorClass} shadow-[0_0_8px_currentColor]`}></div>
                  {settings.theme === t.value && (
                    <div className="absolute -top-1.5 -right-1.5 bg-neutral-800 rounded-full p-0.5 border border-black">
                      <Check size={8} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-neutral-900"></div>

          {/* Toggles */}
          <div className="space-y-1">
            
            {/* Stopwatch Mode */}
            <div className="flex items-center justify-between py-3 rounded-lg hover:bg-neutral-900/30 transition-colors px-2 -mx-2">
               <span className="flex flex-col gap-0.5">
                 <span className="text-neutral-200 font-medium text-sm">
                    Modo Cronômetro
                 </span>
                <span className="text-[10px] text-neutral-500">Conta de 00:00 até o final</span>
              </span>
              <button 
                onClick={() => update('countUpMode', !settings.countUpMode)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative border ${settings.countUpMode ? 'bg-neutral-500 border-neutral-500' : 'bg-transparent border-neutral-700'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm ${settings.countUpMode ? 'left-[22px] bg-black' : 'left-0.5 bg-neutral-500'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-3 rounded-lg hover:bg-neutral-900/30 transition-colors px-2 -mx-2">
              <span className="flex items-center gap-2 text-neutral-200 font-medium text-sm">
                Efeitos Sonoros
                {settings.soundEnabled ? <Volume2 size={14} className="text-neutral-500" /> : <VolumeX size={14} className="text-neutral-600" />}
              </span>
              <button 
                onClick={() => update('soundEnabled', !settings.soundEnabled)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative border ${settings.soundEnabled ? 'bg-neutral-500 border-neutral-500' : 'bg-transparent border-neutral-700'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm ${settings.soundEnabled ? 'left-[22px] bg-black' : 'left-0.5 bg-neutral-500'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-3 rounded-lg hover:bg-neutral-900/30 transition-colors px-2 -mx-2">
              <span className="text-neutral-200 font-medium text-sm">Auto-iniciar Intervalos</span>
              <button 
                onClick={() => update('autoStartBreaks', !settings.autoStartBreaks)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative border ${settings.autoStartBreaks ? 'bg-neutral-500 border-neutral-500' : 'bg-transparent border-neutral-700'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm ${settings.autoStartBreaks ? 'left-[22px] bg-black' : 'left-0.5 bg-neutral-500'}`}></div>
              </button>
            </div>
             <div className="flex items-center justify-between py-3 rounded-lg hover:bg-neutral-900/30 transition-colors px-2 -mx-2">
              <span className="text-neutral-200 font-medium text-sm">Auto-iniciar Foco</span>
              <button 
                onClick={() => update('autoStartFocus', !settings.autoStartFocus)}
                className={`w-10 h-5 rounded-full transition-all duration-300 relative border ${settings.autoStartFocus ? 'bg-neutral-500 border-neutral-500' : 'bg-transparent border-neutral-700'}`}
              >
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-sm ${settings.autoStartFocus ? 'left-[22px] bg-black' : 'left-0.5 bg-neutral-500'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;