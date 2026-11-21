// ui.js — HUD and overlay screens: remaining counter, pips, timer bar, menus.
export function fmtTime(s) { const m = Math.floor(s / 60); const r = Math.ceil(s % 60); return m + ':' + String(r === 60 ? 0 : r).padStart(2, '0'); }
export function renderHud(el, state) {
  const left = state.total - state.found.size;
  el.remaining.textContent = left + ' difference' + (left === 1 ? '' : 's') + ' remaining';
  el.score.textContent = 'Score ' + state.score;
  el.level.textContent = state.levelTitle;
  el.time.textContent = fmtTime(Math.max(0, state.timeLeft));
  el.bar.style.width = Math.max(0, (state.timeLeft / state.levelSeconds) * 100) + '%';
  el.bar.style.background = state.timeLeft < 15 ? '#e63946' : state.timeLeft < 40 ? '#f4a261' : '#2a9d8f';
  el.pips.innerHTML = '';
  for (let i = 0; i < state.total; i++) { const d = document.createElement('span'); d.className = 'pip' + (i < state.found.size ? ' on' : ''); el.pips.appendChild(d); }
  el.hintBtn.textContent = 'Hint (' + state.hintsLeft + ' left, −10s)';
  el.hintBtn.disabled = state.hintsLeft <= 0;
}
export function showOverlay(el, html) { el.overlay.innerHTML = html; el.overlay.classList.remove('hidden'); }
export function hideOverlay(el) { el.overlay.classList.add('hidden'); el.overlay.innerHTML = ''; }
export function starsFor(accuracy, timeLeft, levelSeconds) {
  let s = 1; if (accuracy >= 0.7) s++; if (accuracy >= 0.9 && timeLeft > levelSeconds * 0.25) s++; return s;
}
