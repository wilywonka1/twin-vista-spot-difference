// audio.js — all sound is synthesised with WebAudio; there are no audio files.
let ctx = null;
function ac() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
function tone(freq, t0, dur, type, gain) {
  const a = ac(); const o = a.createOscillator(); const g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, a.currentTime + t0);
  g.gain.exponentialRampToValueAtTime(gain, a.currentTime + t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t0 + dur);
  o.connect(g); g.connect(a.destination); o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + dur + 0.05);
}
export function playFind() { tone(880, 0, 0.18, 'sine', 0.22); tone(1318, 0.07, 0.26, 'sine', 0.2); }
export function playMiss() { tone(140, 0, 0.16, 'square', 0.12); tone(98, 0.05, 0.2, 'square', 0.1); }
export function playHint() { tone(1568, 0, 0.3, 'sine', 0.12); tone(2093, 0.1, 0.34, 'sine', 0.1); }
export function playWin() { [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.2)); }
export function playTick() { tone(1200, 0, 0.05, 'sine', 0.07); }
export function playLose() { [392, 330, 262].forEach((f, i) => tone(f, i * 0.14, 0.3, 'triangle', 0.16)); }
