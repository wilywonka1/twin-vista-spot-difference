// main.js — boot and the game loop for "Twin Vista: Spot the Difference".
// Start screen -> timed hunt on paired panels -> level complete -> next level.
import { LEVELS } from './differences.js';
import { drawScene } from './scenes.js';
import { playFind, playMiss, playHint, playWin, playTick, playLose } from './audio.js';
import { renderHud, showOverlay, hideOverlay, starsFor } from './ui.js';
import { hitDifference, bindPanel } from './input.js';

const left = document.getElementById('panel-left');
const right = document.getElementById('panel-right');
const lctx = left.getContext('2d');
const rctx = right.getContext('2d');
const el = {
  remaining: document.getElementById('remaining'), score: document.getElementById('score'),
  level: document.getElementById('level-name'), time: document.getElementById('time'),
  bar: document.getElementById('timebar-fill'), pips: document.getElementById('pips'),
  hintBtn: document.getElementById('hint-btn'), overlay: document.getElementById('overlay'),
};

const state = {
  screen: 'start', levelIndex: 0, found: new Set(), total: 0, score: 0,
  timeLeft: 0, levelSeconds: 0, levelTitle: '', hintsLeft: 0, clicks: 0, hits: 0,
  markers: [], missMarks: [], hintPulse: null, lastTickSecond: -1, raf: 0, lastTs: 0,
};
const appliedAll = (lvl) => new Set(lvl.diffs.map((d) => d.id));

function drawPanels(now) {
  const lvl = LEVELS[state.levelIndex];
  drawScene(lctx, lvl.scene, new Set());
  drawScene(rctx, lvl.scene, appliedAll(lvl));
  for (const ctx of [lctx, rctx]) {
    for (const m of state.markers) {
      const age = (now - m.at) / 1000; const grow = Math.min(1, age * 4);
      ctx.strokeStyle = '#ffd60a'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * grow + 4, 0, 7); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * grow + 9, 0, 7); ctx.stroke();
    }
    for (const m of state.missMarks) {
      const age = (now - m.at) / 700; if (age >= 1) continue;
      ctx.strokeStyle = 'rgba(230,57,70,' + (1 - age) + ')'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(m.x - 8, m.y - 8); ctx.lineTo(m.x + 8, m.y + 8); ctx.moveTo(m.x + 8, m.y - 8); ctx.lineTo(m.x - 8, m.y + 8); ctx.stroke();
    }
    if (state.hintPulse) {
      const age = (now - state.hintPulse.at) / 1000;
      if (age < 1.6) { const p = state.hintPulse; ctx.strokeStyle = 'rgba(72,202,228,' + (1 - age / 1.6) + ')'; ctx.lineWidth = 3 + Math.sin(age * 14) * 1.4; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 12 + Math.sin(age * 14) * 3, 0, 7); ctx.stroke(); }
      else state.hintPulse = null;
    }
  }
}

function hud() { renderHud(el, state); }

function startLevel(i) {
  const lvl = LEVELS[i];
  state.levelIndex = i; state.found = new Set(); state.total = lvl.diffs.length;
  state.timeLeft = lvl.seconds; state.levelSeconds = lvl.seconds; state.levelTitle = lvl.title;
  state.hintsLeft = lvl.hints; state.markers = []; state.missMarks = []; state.hintPulse = null;
  state.screen = 'play'; state.lastTickSecond = -1;
  hideOverlay(el); hud();
}

function endLevel(won) {
  state.screen = 'over';
  const lvl = LEVELS[state.levelIndex];
  const accuracy = state.clicks ? state.hits / state.clicks : 0;
  if (won) {
    playWin();
    state.score += Math.round(state.timeLeft) * 2 + state.found.size * 100;
    const stars = starsFor(accuracy, state.timeLeft, state.levelSeconds);
    const last = state.levelIndex === LEVELS.length - 1;
    const best = Math.max(state.score, Number(localStorage.getItem('twinvista-best') || 0));
    if (last) localStorage.setItem('twinvista-best', String(best));
    showOverlay(el, '<div class="card"><h2>' + (last ? 'Game Complete!' : 'Level Complete!') + '</h2>' +
      '<p class="stars">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</p>' +
      '<p>Found all ' + lvl.diffs.length + ' differences with ' + Math.round(accuracy * 100) + '% accuracy.</p>' +
      '<p>Score: <b>' + state.score + '</b>' + (last ? ' · Best: <b>' + best + '</b>' : '') + '</p>' +
      '<button id="ov-btn">' + (last ? 'Play again' : 'Next level') + '</button></div>');
    document.getElementById('ov-btn').onclick = () => { if (last) { state.score = 0; startLevel(0); } else startLevel(state.levelIndex + 1); };
  } else {
    playLose();
    showOverlay(el, '<div class="card"><h2>Time Up!</h2><p>You found ' + state.found.size + ' of ' + lvl.diffs.length + ' differences.</p>' +
      '<p>Score: <b>' + state.score + '</b></p><button id="ov-btn">Try this level again</button></div>');
    document.getElementById('ov-btn').onclick = () => startLevel(state.levelIndex);
  }
  hud();
}

function onTap(point) {
  if (state.screen !== 'play') return;
  const lvl = LEVELS[state.levelIndex];
  state.clicks++;
  const hit = hitDifference(lvl.diffs, state.found, point);
  if (hit) {
    state.hits++; state.found.add(hit.id); state.score += 100;
    state.markers.push({ x: hit.x, y: hit.y, r: hit.r, at: performance.now() });
    playFind(); hud();
    if (state.found.size === lvl.diffs.length) endLevel(true);
  } else {
    state.timeLeft = Math.max(0, state.timeLeft - 5); state.score = Math.max(0, state.score - 25);
    state.missMarks.push({ x: point.x, y: point.y, at: performance.now() });
    playMiss(); hud();
    if (state.timeLeft <= 0) endLevel(false);
  }
}

el.hintBtn.addEventListener('click', () => {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const lvl = LEVELS[state.levelIndex];
  const rest = lvl.diffs.filter((d) => !state.found.has(d.id));
  if (!rest.length) return;
  const pick = rest[Math.floor(Math.random() * rest.length)];
  state.hintPulse = { x: pick.x, y: pick.y, r: pick.r, at: performance.now() };
  state.hintsLeft--; state.timeLeft = Math.max(0, state.timeLeft - 10);
  playHint(); hud();
});

function frame(ts) {
  const dt = state.lastTs ? (ts - state.lastTs) / 1000 : 0; state.lastTs = ts;
  if (state.screen === 'play') {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (whole !== state.lastTickSecond) { state.lastTickSecond = whole; if (whole <= 10 && whole > 0) playTick(); hud(); }
    if (state.timeLeft <= 0) { state.timeLeft = 0; endLevel(false); }
  }
  drawPanels(ts);
  state.raf = requestAnimationFrame(frame);
}

function showStart() {
  state.screen = 'start';
  const best = Number(localStorage.getItem('twinvista-best') || 0);
  showOverlay(el, '<div class="card"><h1>Twin Vista</h1><p class="sub">Spot the Difference</p>' +
    '<p>Two pictures, side by side. Somewhere in the right-hand picture, small things have changed. ' +
    'Click a difference on <b>either</b> picture to ring it. A wrong click costs 5 seconds; a hint costs 10.</p>' +
    '<p>' + LEVELS.length + ' scenes: a sunset harbour, a forest clearing, a kitchen shelf and a night market — ' +
    'each one hides more differences than the last.</p>' +
    (best ? '<p>Your best score: <b>' + best + '</b></p>' : '') +
    '<button id="ov-btn">Start hunting</button></div>');
  document.getElementById('ov-btn').onclick = () => { state.score = 0; state.clicks = 0; state.hits = 0; startLevel(0); };
  hud();
}

bindPanel(left, onTap);
bindPanel(right, onTap);
state.total = LEVELS[0].diffs.length; state.levelTitle = LEVELS[0].title; state.levelSeconds = LEVELS[0].seconds; state.timeLeft = LEVELS[0].seconds;
showStart();
requestAnimationFrame(frame);
