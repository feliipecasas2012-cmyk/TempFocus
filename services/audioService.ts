class AudioService {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  private playTone(frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.init();
    if (!this.audioContext || !this.gainNode) return;

    // Resume context if suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Envelope for soft start/stop
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.gainNode); // Connect to master gain

    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  public playStart() {
    // A rising positive tone
    this.playTone(440, 'sine', 0.15, 0.1); // A4
    setTimeout(() => this.playTone(880, 'sine', 0.4, 0.1), 150); // A5
  }

  public playPause() {
    // A simple blip
    this.playTone(300, 'sine', 0.2, 0.1);
  }

  public playComplete() {
    // A gentle sequence
    this.playTone(523.25, 'sine', 0.3, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.3, 0.15), 300); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.8, 0.15), 600); // G5
  }

  public playIntervalStart() {
    // Distinct deeper tone
    this.playTone(329.63, 'triangle', 0.8, 0.05); // E4
  }
}

export const audioService = new AudioService();
