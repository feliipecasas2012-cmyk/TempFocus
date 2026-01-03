export enum TimerMode {
  FOCUS = 'FOCUS',
  BREAK = 'BREAK'
}

export enum TimerState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}

export enum ColorTheme {
  WHITE = 'text-white',
  YELLOW = 'text-yellow-400',
  GREEN = 'text-green-400',
  ORANGE = 'text-orange-400',
  PINK = 'text-pink-400'
}

export interface AppSettings {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  countUpMode: boolean; // New setting for stopwatch mode
  theme: ColorTheme;
}