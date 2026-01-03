import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import SettingsModal from './components/SettingsModal';
import { TimerMode, TimerState, AppSettings, ColorTheme } from './types';
import { audioService } from './services/audioService';
import { useWakeLock } from './hooks/useWakeLock';

const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  breakDuration: 5,
  autoStartBreaks: true,
  autoStartFocus: true,
  soundEnabled: true,
  countUpMode: false,
  theme: ColorTheme.WHITE
};

function App() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [timerState, setTimerState] = useState<TimerState>(TimerState.IDLE);
  const [timerMode, setTimerMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.focusDuration * 60);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keep screen on while running OR while the finished alert is showing
  useWakeLock(timerState === TimerState.RUNNING || timerState === TimerState.FINISHED);

  // Initialize time on load or settings change if IDLE
  useEffect(() => {
    if (timerState === TimerState.IDLE) {
      const duration = timerMode === TimerMode.FOCUS ? settings.focusDuration : settings.breakDuration;
      setTimeLeft(duration * 60);
    }
  }, [settings.focusDuration, settings.breakDuration, timerMode, timerState]);

  // Timer Logic
  useEffect(() => {
    let interval: number | null = null;

    if (timerState === TimerState.RUNNING && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft <= 0 && timerState === TimerState.RUNNING) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, timeLeft]);

  // Looping sound effect for FINISHED state
  useEffect(() => {
    let soundInterval: number | null = null;

    if (timerState === TimerState.FINISHED && settings.soundEnabled) {
      // Play immediately
      audioService.playComplete();
      
      // Loop every 2.5 seconds until user interacts
      soundInterval = window.setInterval(() => {
        audioService.playComplete();
      }, 2500);
    }

    return () => {
      if (soundInterval) clearInterval(soundInterval);
    };
  }, [timerState, settings.soundEnabled]);

  const handleTimerComplete = () => {
    let nextMode = timerMode === TimerMode.FOCUS ? TimerMode.BREAK : TimerMode.FOCUS;
    
    // Skip break mode if duration is 0
    if (nextMode === TimerMode.BREAK && settings.breakDuration === 0) {
      nextMode = TimerMode.FOCUS;
    }

    const shouldAutoStart = nextMode === TimerMode.BREAK ? settings.autoStartBreaks : settings.autoStartFocus;
    
    // Always prepare the next session's time
    const nextDuration = nextMode === TimerMode.FOCUS ? settings.focusDuration : settings.breakDuration;
    setTimeLeft(nextDuration * 60);
    setTimerMode(nextMode);

    if (shouldAutoStart) {
      if (settings.soundEnabled) {
         audioService.playComplete();
      }
      setTimerState(TimerState.RUNNING);
      // Brief delay for the start sound of the new interval if distinct
      if (settings.soundEnabled && nextMode === TimerMode.BREAK) {
        setTimeout(() => audioService.playIntervalStart(), 1000);
      }
    } else {
      // Enter FINISHED state (looping sound)
      setTimerState(TimerState.FINISHED);
    }
  };

  const handleSettingsUpdate = (newSettings: AppSettings) => {
    // Only adjust time if we are NOT in IDLE state
    // If IDLE, the useEffect handles the reset to full duration correctly.
    if (timerState !== TimerState.IDLE) {
      const isFocus = timerMode === TimerMode.FOCUS;
      const currentDuration = isFocus ? settings.focusDuration : settings.breakDuration;
      const newDuration = isFocus ? newSettings.focusDuration : newSettings.breakDuration;

      // If the duration for the CURRENT mode changed, we need to adjust timeLeft
      // so that the visually elapsed time remains constant.
      if (currentDuration !== newDuration) {
        const elapsed = (currentDuration * 60) - timeLeft;
        const newTimeLeft = (newDuration * 60) - elapsed;
        
        // Update timeLeft. If it becomes <= 0, the timer logic will handle completion
        setTimeLeft(newTimeLeft);
      }
    }
    
    setSettings(newSettings);
  };

  const toggleTimer = () => {
    if (timerState === TimerState.FINISHED) {
      // If finished, acknowledging starts the next phase
      setTimerState(TimerState.RUNNING);
      if (settings.soundEnabled) audioService.playStart();
      return;
    }

    if (timerState === TimerState.RUNNING) {
      setTimerState(TimerState.PAUSED);
      if (settings.soundEnabled) audioService.playPause();
    } else {
      setTimerState(TimerState.RUNNING);
      if (settings.soundEnabled) audioService.playStart();
    }
  };

  const resetTimer = () => {
    setTimerState(TimerState.IDLE);
    // Reset to default Focus mode on manual reset
    setTimerMode(TimerMode.FOCUS);
    setTimeLeft(settings.focusDuration * 60);
    if (settings.soundEnabled) audioService.playPause(); // Using pause sound as a soft cancel feedback
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Interaction handlers to show/hide controls
  const handleInteraction = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Hide controls after 3 seconds of inactivity
    controlsTimeoutRef.current = window.setTimeout(() => {
      // Only hide if settings are closed
      if (!isSettingsOpen) {
        setControlsVisible(false);
      }
    }, 3000);
  }, [isSettingsOpen]);

  useEffect(() => {
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleInteraction]);

  // Keep controls visible if settings are open
  useEffect(() => {
    if (isSettingsOpen) {
      setControlsVisible(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      handleInteraction(); // Restart timer when settings close
    }
  }, [isSettingsOpen, handleInteraction]);

  // Calculate Display Time
  // If CountUp mode: TotalDuration - TimeLeft = Elapsed Time
  const currentTotalDuration = timerMode === TimerMode.FOCUS ? settings.focusDuration * 60 : settings.breakDuration * 60;
  
  const displayTime = settings.countUpMode 
    ? (currentTotalDuration - timeLeft) 
    : timeLeft;
  
  // Calculate Next Session Info
  const isFocus = timerMode === TimerMode.FOCUS;
  // If current is Focus, next is Break (unless break is 0). If current is Break, next is Focus.
  let nextDuration = 0;
  let nextLabel = '';

  if (isFocus) {
      if (settings.breakDuration > 0) {
          nextDuration = settings.breakDuration * 60;
          nextLabel = 'INTERVALO';
      } else {
          // If break is 0, it loops back to focus
          nextDuration = settings.focusDuration * 60;
          nextLabel = 'FOCO';
      }
  } else {
      nextDuration = settings.focusDuration * 60;
      nextLabel = 'FOCO';
  }

  return (
    <div 
      className="min-h-screen w-full bg-black flex flex-col items-center justify-center relative overflow-hidden"
    >
      <TimerDisplay 
        secondsRemaining={displayTime} 
        theme={settings.theme}
        label={timerMode === TimerMode.BREAK ? 'INTERVALO' : undefined}
        nextSessionDuration={nextDuration}
        nextLabel={nextLabel}
      />

      <Controls 
        timerState={timerState}
        onToggle={toggleTimer}
        onReset={resetTimer}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        theme={settings.theme}
        visible={controlsVisible}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleSettingsUpdate}
      />
    </div>
  );
}

export default App;