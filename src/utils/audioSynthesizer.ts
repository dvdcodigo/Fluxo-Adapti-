/**
 * Native Web Audio API ambient sound generator.
 * Zero external audio files or broken URLs needed.
 */

export type AmbientSoundType = 'chuva' | 'marrom' | 'biblioteca' | 'lofi' | 'off';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: AmbientSoundType = 'off';
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;
  private isMuted: boolean = false;
  private lofiInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public stop() {
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }

    this.activeNodes.forEach(node => {
      try {
        if (typeof node === 'number') {
          clearInterval(node);
        } else if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
          node.disconnect();
        } else {
          node.disconnect();
        }
      } catch {
        // Ignore disconnection errors on already stopped nodes
      }
    });

    this.activeNodes = [];
    this.currentType = 'off';
  }

  public play(type: AmbientSoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.currentType === type) {
      this.stop();
      return;
    }

    this.stop();
    this.currentType = type;

    switch (type) {
      case 'chuva':
        this.playRain();
        break;
      case 'marrom':
        this.playBrownNoise();
        break;
      case 'biblioteca':
        this.playLibraryAmbiance();
        break;
      case 'lofi':
        this.playLoFiChords();
        break;
      default:
        break;
    }
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Rain Synthesizer: Pink/White noise + Bandpass + randomized drops
  private playRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter, rainGain);
  }

  // 2. Brown Noise: Deep, soft, soothing for focus & ADHD
  private playBrownNoise() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for low amplitude
    }

    const brownSource = this.ctx.createBufferSource();
    brownSource.buffer = noiseBuffer;
    brownSource.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(450, this.ctx.currentTime);

    const brownGain = this.ctx.createGain();
    brownGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    brownSource.connect(lowpass);
    lowpass.connect(brownGain);
    brownGain.connect(this.masterGain);
    brownSource.start();

    this.activeNodes.push(brownSource, lowpass, brownGain);
  }

  // 3. Library Ambiance: Warm low frequency room resonance & distant acoustic presence
  private playLibraryAmbiance() {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80, this.ctx.currentTime); // Low warm room hum
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(120, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);

    // Subtle gentle noise bed
    const bufferSize = this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.03;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    noise.connect(noiseFilter);
    filter.connect(gain);
    noiseFilter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    noise.start();

    this.activeNodes.push(osc1, osc2, noise, filter, noiseFilter, gain);
  }

  // 4. Lo-Fi Mellow Rhodes Chords: Soft pentatonic / 7th chords cycling slowly
  private playLoFiChords() {
    if (!this.ctx || !this.masterGain) return;

    // Progression of chill chords: [Cmaj7, Am7, Dm7, G7sus]
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 261.63, 329.63, 392.00], // G7sus/C
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'lofi') return;
      const notes = chords[chordIndex % chords.length];
      chordIndex++;

      const chordGain = this.ctx.createGain();
      chordGain.gain.setValueAtTime(0, this.ctx.currentTime);
      // Soft gentle attack, sustain, decay
      chordGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.8);
      chordGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.2);
      chordGain.connect(this.masterGain);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);
      filter.connect(chordGain);

      notes.forEach(freq => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.connect(filter);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 4.5);
      });
    };

    // Play immediately then every 4 seconds
    playChord();
    const interval = window.setInterval(playChord, 4500);
    this.lofiInterval = interval;
    this.activeNodes.push(interval);
  }
}

export const soundSynthesizer = new AudioSynthesizer();
