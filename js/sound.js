/* ===================================================
   SOUND & SPEECH ENGINE (WEB AUDIO & WEB SPEECH API)
   Synthesizes cute game audio + ambient background music
   =================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.ambientNodes = [];
    this.isAmbientPlaying = false;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft button click sound
  playClick() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play a happy correct answer chime
  playCorrect() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
    });
  }

  // Play a gentle "try again" sound
  playWrong() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Play Star collection sound
  playStar() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Play Victory fanfare celebration
  playFanfare() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [
      { freq: 523.25, start: 0, dur: 0.15 },
      { freq: 659.25, start: 0.15, dur: 0.15 },
      { freq: 783.99, start: 0.3, dur: 0.15 },
      { freq: 1046.50, start: 0.45, dur: 0.5 }
    ];

    chords.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, this.ctx.currentTime + note.start);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + note.start);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + note.start + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + note.start);
      osc.stop(this.ctx.currentTime + note.start + note.dur);
    });
  }

  // Ambient background music (gentle kid-friendly looping melody)
  startAmbientMusic() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    if (!this.ctx || this.isAmbientPlaying) return;

    this.isAmbientPlaying = true;
    this.playAmbientLoop();
  }

  playAmbientLoop() {
    if (!this.isAmbientPlaying || !this.ctx) return;

    // Simple pentatonic loop: C D E G A (C major pentatonic)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const melody = [0, 2, 4, 5, 4, 2, 0, 1, 2, 3, 2, 1, 0].map(i => scale[i]);
    const tempo = 0.35;

    melody.forEach((freq, idx) => {
      if (!this.isAmbientPlaying) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * tempo);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * tempo);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + idx * tempo + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * tempo + tempo - 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * tempo);
      osc.stop(this.ctx.currentTime + idx * tempo + tempo);
    });

    // Loop after melody ends
    const totalDuration = melody.length * tempo * 1000;
    this.ambientTimeout = setTimeout(() => {
      if (this.isAmbientPlaying) this.playAmbientLoop();
    }, totalDuration);
  }

  stopAmbientMusic() {
    this.isAmbientPlaying = false;
    if (this.ambientTimeout) {
      clearTimeout(this.ambientTimeout);
      this.ambientTimeout = null;
    }
  }

  // Text-To-Speech function using Web Speech API
  speak(text, lang = 'vi-VN') {
    if (!this.speechEnabled) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.includes(lang.replace('-', '_')) || v.lang.includes(lang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

// Global instance
window.soundEngine = new SoundEngine();
