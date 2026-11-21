// input.js — click handling and hit-testing against the difference circles.
// A click on EITHER panel counts: both panels share the 500 x 375 scene space.
export function scenePoint(canvas, event) {
  const r = canvas.getBoundingClientRect();
  return { x: (event.clientX - r.left) * (500 / r.width), y: (event.clientY - r.top) * (375 / r.height) };
}
export function hitDifference(diffs, found, point) {
  let best = null; let bestD = 1e9;
  for (const d of diffs) {
    if (found.has(d.id)) continue;
    const dist = Math.hypot(point.x - d.x, point.y - d.y);
    if (dist <= d.r + 8 && dist < bestD) { best = d; bestD = dist; }
  }
  return best;
}
export function bindPanel(canvas, handler) {
  canvas.addEventListener('pointerdown', (e) => handler(scenePoint(canvas, e)));
}
