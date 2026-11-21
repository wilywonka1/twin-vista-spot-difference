// scenes.js — every picture in the game, drawn in code on a 500 x 375 canvas.
// One renderer per scene draws BOTH panels: the left panel gets the base
// scene, the right panel gets the same scene with each difference applied,
// so the pair always matches pixel for pixel outside the difference spots.

function circle(c, x, y, r, fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
function rect(c, x, y, w, h, fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
function tri(c, x1, y1, x2, y2, x3, y3, fill) { c.fillStyle = fill; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.lineTo(x3, y3); c.closePath(); c.fill(); }
function line(c, x1, y1, x2, y2, stroke, w) { c.strokeStyle = stroke; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
function cloud(c, x, y, s, fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, 14 * s, 0, 7); c.arc(x + 16 * s, y + 3 * s, 11 * s, 0, 7); c.arc(x - 16 * s, y + 3 * s, 10 * s, 0, 7); c.fill(); }
function tree(c, x, y, s, leaf) { rect(c, x - 4 * s, y, 8 * s, 26 * s, '#6b4a2f'); circle(c, x, y - 8 * s, 20 * s, leaf); circle(c, x - 14 * s, y + 2 * s, 13 * s, leaf); circle(c, x + 14 * s, y + 2 * s, 13 * s, leaf); }
function star(c, x, y, r, fill) { c.fillStyle = fill; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rad = i % 2 ? r * 0.45 : r; const px = x + Math.cos(a) * rad; const py = y + Math.sin(a) * rad; i ? c.lineTo(px, py) : c.moveTo(px, py); } c.closePath(); c.fill(); }

function harbour(c, on) {
  const sky = c.createLinearGradient(0, 0, 0, 250); sky.addColorStop(0, '#2e4a7a'); sky.addColorStop(0.6, '#e2703a'); sky.addColorStop(1, '#f7b267');
  rect(c, 0, 0, 500, 250, sky);
  if (!on.has('sun')) circle(c, 388, 62, 26, '#ffd97a'); else { circle(c, 388, 62, 26, '#ffd97a'); c.strokeStyle = '#fff3c4'; c.lineWidth = 3; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line(c, 388 + Math.cos(a) * 32, 62 + Math.sin(a) * 32, 388 + Math.cos(a) * 42, 62 + Math.sin(a) * 42, '#fff3c4', 3); } }
  cloud(c, 90, 52, 1, 'rgba(255,190,150,0.8)'); cloud(c, 250, 34, 0.8, 'rgba(255,170,140,0.7)'); cloud(c, 330, 96, 0.7, 'rgba(255,180,150,0.6)');
  if (!on.has('gull')) { c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.beginPath(); c.arc(106, 58, 9, 3.4, 6); c.arc(130, 58, 9, 3.4, 6); c.stroke(); }
  c.strokeStyle = 'rgba(255,255,255,0.75)'; c.lineWidth = 2; c.beginPath(); c.arc(196, 44, 7, 3.4, 6); c.arc(216, 44, 7, 3.4, 6); c.stroke();
  rect(c, 0, 248, 500, 127, '#274b63');
  c.strokeStyle = 'rgba(140,200,230,0.5)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(20 + i * 55, 268 + (i % 3) * 26); c.lineTo(58 + i * 55, 268 + (i % 3) * 26); c.stroke(); }
  // lighthouse on the right headland
  rect(c, 428, 250, 72, 14, '#3d5a45'); tri(c, 452, 120, 438, 178, 466, 178, '#e8e3d8'); rect(c, 440, 150, 24, 10, '#c8452c'); rect(c, 440, 128, 24, 10, '#c8452c');
  if (!on.has('lamp')) circle(c, 452, 112, 9, '#ffe98a'); tri(c, 452, 176, 452, 252, 500, 252, '#5a4632');
  // boats
  function boat(x, y, hull, sailFill) { tri(c, x, y, x + 8, y - 52, x + 8, y, sailFill); rect(c, x + 6, y - 54, 3, 56, '#4a3220'); tri(c, x - 26, y + 2, x + 34, y + 2, x + 22, y + 16, hull); }
  boat(120, 232, '#7a4a2b', '#f4ead8');
  if (!on.has('sail')) boat(196, 208, '#31556e', '#e8b4b8'); else boat(196, 208, '#31556e', '#7fb069');
  boat(300, 238, '#5d3a5e', '#f4ead8');
  // quay and props
  rect(c, 0, 330, 500, 45, '#8a6a4a'); rect(c, 0, 326, 500, 6, '#a5825e');
  for (let i = 0; i < 12; i++) rect(c, 14 + i * 42, 332, 3, 40, 'rgba(0,0,0,0.18)');
  if (!on.has('barrel')) { rect(c, 52, 288, 28, 34, '#9c6642'); rect(c, 52, 298, 28, 4, '#5e3c22'); rect(c, 52, 312, 28, 4, '#5e3c22'); }
  rect(c, 96, 296, 24, 26, '#b08954'); rect(c, 96, 306, 24, 3, '#6e5230');
  circle(c, 350, 316, 10, '#c8452c'); circle(c, 366, 320, 8, '#e2703a'); // buoys ashore
  for (let i = 0; i < 5; i++) { line(c, 160 + i * 8, 330, 160 + i * 8, 306, '#d8cfc0', 2); circle(c, 164 + i * 8, 302, 3, '#ffd97a'); } // drying net lights
  rect(c, 240, 300, 40, 22, '#31556e'); rect(c, 246, 292, 28, 8, '#274b63'); // crate stack
}

function forest(c, on) {
  const sky = c.createLinearGradient(0, 0, 0, 375); sky.addColorStop(0, '#1d3557'); sky.addColorStop(0.5, '#457b9d'); sky.addColorStop(1, '#a8dadc');
  rect(c, 0, 0, 500, 375, sky);
  if (!on.has('moon')) { circle(c, 428, 52, 22, '#f1fa8c'); circle(c, 418, 46, 18, '#457b9d'); }
  else circle(c, 428, 52, 22, '#f4f1de');
  for (const [x, y] of [[40, 40], [120, 24], [210, 60], [300, 30], [470, 110], [180, 96]]) star(c, x, y, 5, '#eaf6ff');
  rect(c, 0, 300, 500, 75, '#2d6a4f'); rect(c, 0, 292, 500, 12, '#40916c');
  tree(c, 60, 250, 1.6, '#1b4332'); tree(c, 150, 268, 1.2, '#2d6a4f'); tree(c, 330, 258, 1.4, '#1b4332'); tree(c, 440, 246, 1.7, '#2d6a4f'); tree(c, 250, 282, 0.9, '#40916c');
  if (!on.has('owl')) { circle(c, 84, 96, 11, '#8a6a4a'); circle(c, 79, 93, 3.4, '#fff'); circle(c, 89, 93, 3.4, '#fff'); circle(c, 79, 93, 1.6, '#111'); circle(c, 89, 93, 1.6, '#111'); tri(c, 80, 84, 88, 84, 84, 76, '#8a6a4a'); }
  if (!on.has('butterfly')) { circle(c, 232, 124, 6, '#e5989b'); circle(c, 244, 124, 6, '#e5989b'); circle(c, 238, 130, 4, '#6d6875'); } else { circle(c, 232, 124, 6, '#84a98c'); circle(c, 244, 124, 6, '#84a98c'); circle(c, 238, 130, 4, '#35452f'); }
  // fox, bottom right
  circle(c, 388, 272, 16, '#e07a3f'); tri(c, 376, 258, 380, 244, 388, 256, '#e07a3f'); tri(c, 392, 256, 400, 244, 402, 258, '#e07a3f'); circle(c, 383, 270, 2.4, '#111'); circle(c, 393, 270, 2.4, '#111');
  if (!on.has('foxTail')) { c.strokeStyle = '#e07a3f'; c.lineWidth = 8; c.beginPath(); c.moveTo(402, 276); c.quadraticCurveTo(424, 268, 428, 252); c.stroke(); circle(c, 428, 250, 5, '#fff'); }
  else { c.strokeStyle = '#e07a3f'; c.lineWidth = 8; c.beginPath(); c.moveTo(402, 276); c.quadraticCurveTo(420, 284, 434, 278); c.stroke(); circle(c, 436, 277, 5, '#fff'); }
  if (!on.has('mushroom')) { rect(c, 312, 292, 7, 12, '#f1faee'); c.fillStyle = '#c8452c'; c.beginPath(); c.arc(316, 294, 13, Math.PI, 0); c.fill(); circle(c, 310, 288, 2.4, '#fff'); circle(c, 320, 286, 2, '#fff'); }
  if (!on.has('acorn')) { circle(c, 150, 210, 7, '#9c6642'); rect(c, 143, 200, 14, 5, '#5e3c22'); }
  if (!on.has('flower')) { for (let i = 0; i < 5; i++) circle(c, 452 + Math.cos(i * 1.26) * 6, 318 + Math.sin(i * 1.26) * 6, 4.4, '#ffb703'); circle(c, 452, 318, 3.6, '#fb8500'); line(c, 452, 326, 452, 340, '#2d6a4f', 2.4); }
  for (const [x, y, col] of [[30, 330, '#ffb703'], [200, 336, '#e5989b'], [270, 322, '#f1fa8c'], [480, 344, '#ffb703']]) { circle(c, x, y, 3.4, col); line(c, x, y + 3, x, y + 12, '#2d6a4f', 2); }
  circle(c, 108, 330, 9, '#8a6a4a'); circle(c, 122, 334, 7, '#a5825e'); // stones & log
  rect(c, 180, 344, 60, 12, '#6b4a2f'); circle(c, 240, 350, 6, '#8a6a4a');
}

function kitchen(c, on) {
  rect(c, 0, 0, 500, 375, '#f6ead8'); rect(c, 0, 250, 500, 125, '#d9c7a7');
  for (let i = 0; i < 6; i++) line(c, 0, 262 + i * 20, 500, 262 + i * 20, 'rgba(120,90,50,0.18)', 2);
  // window with curtain
  rect(c, 16, 36, 110, 110, '#bfe3f0'); rect(c, 66, 36, 5, 110, '#8a6a4a'); rect(c, 16, 88, 110, 5, '#8a6a4a'); rect(c, 12, 32, 118, 6, '#8a6a4a');
  if (!on.has('curtain')) { c.fillStyle = '#e5989b'; c.beginPath(); c.moveTo(16, 36); c.lineTo(52, 36); c.lineTo(44, 146); c.lineTo(16, 146); c.fill(); }
  else { c.fillStyle = '#84a98c'; c.beginPath(); c.moveTo(16, 36); c.lineTo(52, 36); c.lineTo(44, 146); c.lineTo(16, 146); c.fill(); }
  circle(c, 96, 62, 13, '#ffd97a');
  // wall clock
  circle(c, 250, 74, 24, '#fff'); c.strokeStyle = '#5e3c22'; c.lineWidth = 3; c.beginPath(); c.arc(250, 74, 24, 0, 7); c.stroke();
  if (!on.has('clock')) { line(c, 250, 74, 250, 58, '#333', 3); line(c, 250, 74, 262, 80, '#333', 3); } else { line(c, 250, 74, 238, 64, '#333', 3); line(c, 250, 74, 250, 88, '#333', 3); }
  // shelves
  rect(c, 150, 160, 320, 8, '#8a6a4a'); rect(c, 30, 262, 440, 8, '#8a6a4a');
  // kettle on upper shelf
  if (!on.has('kettle')) { circle(c, 108, 132, 17, '#b8c4cc'); rect(c, 92, 108, 32, 8, '#8d9aa3'); tri(c, 122, 122, 136, 114, 124, 134, '#b8c4cc'); }
  else { circle(c, 108, 132, 17, '#e07a3f'); rect(c, 92, 108, 32, 8, '#b45f2c'); tri(c, 122, 122, 136, 114, 124, 134, '#e07a3f'); }
  // jars and tins on upper shelf
  for (const [x, col] of [[180, '#c8452c'], [206, '#e9c46a'], [232, '#2a9d8f'], [330, '#e9c46a'], [356, '#c8452c']]) { rect(c, x, 128, 20, 32, col); rect(c, x - 2, 122, 24, 7, '#5e3c22'); }
  rect(c, 268, 118, 44, 42, '#457b9d'); rect(c, 276, 126, 28, 16, '#bfe3f0'); // radio
  // hanging plant
  line(c, 408, 40, 408, 76, '#5e3c22', 2); rect(c, 392, 76, 32, 18, '#c8452c');
  if (!on.has('plant')) { circle(c, 398, 72, 9, '#2d6a4f'); circle(c, 418, 72, 9, '#40916c'); circle(c, 408, 64, 10, '#2d6a4f'); }
  else { circle(c, 398, 72, 9, '#e5989b'); circle(c, 418, 72, 9, '#ffb703'); circle(c, 408, 64, 10, '#e5989b'); }
  // lower shelf: mug, eggs, spoons, bread
  if (!on.has('mug')) { rect(c, 164, 210, 22, 26, '#2a9d8f'); c.strokeStyle = '#2a9d8f'; c.lineWidth = 4; c.beginPath(); c.arc(190, 222, 8, -1.4, 1.4); c.stroke(); }
  else { rect(c, 164, 210, 22, 26, '#c8452c'); c.strokeStyle = '#c8452c'; c.lineWidth = 4; c.beginPath(); c.arc(190, 222, 8, -1.4, 1.4); c.stroke(); }
  rect(c, 272, 214, 44, 20, '#e9e2d0'); circle(c, 282, 224, 7, '#fff'); circle(c, 296, 224, 7, '#fff');
  if (!on.has('egg')) circle(c, 292, 236, 0, '#fff');
  if (on.has('egg')) { circle(c, 292, 232, 8, '#fff'); circle(c, 292, 232, 3.4, '#ffb703'); }
  if (!on.has('spoon')) { circle(c, 452, 218, 6, '#b8c4cc'); rect(c, 450, 224, 4, 20, '#8d9aa3'); }
  rect(c, 400, 216, 20, 20, '#e9c46a'); rect(c, 428, 206, 14, 30, '#b8c4cc'); // cheese + bottle
  if (!on.has('bread')) { c.fillStyle = '#d9a05b'; c.beginPath(); c.ellipse(128, 322, 26, 13, 0, 0, 7); c.fill(); line(c, 116, 314, 122, 320, '#a5763a', 2); line(c, 130, 312, 136, 318, '#a5763a', 2); }
  else { c.fillStyle = '#d9a05b'; c.beginPath(); c.ellipse(128, 322, 26, 13, 0, 0, 7); c.fill(); }
  // cat and its bowl
  circle(c, 330, 330, 15, '#5b5b66'); circle(c, 316, 320, 10, '#5b5b66'); tri(c, 309, 314, 312, 304, 318, 312, '#5b5b66'); tri(c, 320, 312, 326, 304, 327, 314, '#5b5b66'); circle(c, 313, 319, 1.8, '#ffd97a'); circle(c, 321, 319, 1.8, '#ffd97a');
  if (!on.has('catBowl')) { c.fillStyle = '#c8452c'; c.beginPath(); c.ellipse(356, 326, 16, 7, 0, 0, 7); c.fill(); }
  rect(c, 420, 306, 52, 34, '#457b9d'); rect(c, 428, 314, 36, 8, '#bfe3f0'); // cookbook stand
}

function market(c, on) {
  const sky = c.createLinearGradient(0, 0, 0, 375); sky.addColorStop(0, '#141433'); sky.addColorStop(1, '#3a2a5e');
  rect(c, 0, 0, 500, 375, sky);
  if (!on.has('moonMarket')) { circle(c, 36, 30, 15, '#f4f1de'); circle(c, 28, 25, 12, '#1d1d42'); } else circle(c, 36, 30, 15, '#f4f1de');
  for (const [x, y] of [[120, 26], [210, 44], [300, 20], [452, 44], [168, 66]]) star(c, x, y, 4.4, '#eaf6ff');
  if (!on.has('star')) star(c, 372, 36, 9, '#ffd97a'); else star(c, 372, 36, 9, '#e5989b');
  rect(c, 0, 300, 500, 75, '#2c2440'); for (let i = 0; i < 10; i++) line(c, i * 52, 300, i * 52 - 14, 375, 'rgba(255,255,255,0.08)', 3);
  // shop fronts
  rect(c, 20, 120, 130, 180, '#4a2c50'); rect(c, 170, 100, 160, 200, '#2c405e'); rect(c, 350, 130, 130, 170, '#50382c');
  rect(c, 20, 120, 130, 16, '#e2703a'); rect(c, 170, 100, 160, 16, '#c8452c'); rect(c, 350, 130, 130, 16, '#e9c46a');
  // main sign
  rect(c, 196, 40, 108, 30, '#ffd97a'); c.fillStyle = '#7a2c1e'; c.font = 'bold 17px Georgia'; c.textAlign = 'center';
  c.fillText(on.has('sign') ? 'NOODLE MOON' : 'MOON NOODLE', 250, 61);
  // string lanterns
  line(c, 0, 70, 500, 96, 'rgba(255,255,255,0.35)', 1.6);
  for (let i = 0; i < 8; i++) { const x = 30 + i * 62; const y = 76 + Math.sin(i) * 5; circle(c, x, y, 8, ['#e2703a', '#e9c46a', '#c8452c', '#2a9d8f'][i % 4]); }
  if (!on.has('lantern')) { circle(c, 70, 92, 11, '#c8452c'); rect(c, 64, 79, 12, 4, '#7a2c1e'); line(c, 70, 103, 70, 114, '#e9c46a', 2); }
  else { circle(c, 70, 92, 11, '#2a9d8f'); rect(c, 64, 79, 12, 4, '#14532d'); line(c, 70, 103, 70, 114, '#e9c46a', 2); }
  // umbrella stall
  if (!on.has('umbrella')) { tri(c, 104, 152, 196, 152, 150, 112, '#c8452c'); tri(c, 128, 152, 172, 152, 150, 112, '#e2703a'); } else { tri(c, 104, 152, 196, 152, 150, 112, '#2a9d8f'); tri(c, 128, 152, 172, 152, 150, 112, '#457b9d'); }
  line(c, 150, 152, 150, 226, '#d8cfc0', 3); rect(c, 108, 226, 84, 10, '#8a6a4a');
  if (!on.has('teapot')) { circle(c, 96, 252, 11, '#b8c4cc'); tri(c, 84, 246, 74, 240, 86, 256, '#b8c4cc'); rect(c, 90, 238, 12, 5, '#8d9aa3'); }
  else { circle(c, 96, 252, 11, '#e9c46a'); tri(c, 84, 246, 74, 240, 86, 256, '#e9c46a'); rect(c, 90, 238, 12, 5, '#a5763a'); }
  // melon stall
  rect(c, 280, 236, 100, 10, '#8a6a4a'); circle(c, 296, 224, 12, '#2d6a4f'); circle(c, 322, 220, 13, '#40916c'); circle(c, 348, 224, 12, '#2d6a4f');
  if (!on.has('melon')) { c.fillStyle = '#e5989b'; c.beginPath(); c.ellipse(322, 252, 13, 9, 0, 0, 7); c.fill(); }
  else { c.fillStyle = '#84a98c'; c.beginPath(); c.ellipse(322, 252, 13, 9, 0, 0, 7); c.fill(); }
  // fish stall sign-fish
  if (!on.has('fish')) { c.fillStyle = '#84c7e8'; c.beginPath(); c.ellipse(392, 178, 16, 8, 0, 0, 7); c.fill(); tri(c, 406, 178, 418, 168, 418, 188, '#84c7e8'); circle(c, 384, 176, 2, '#111'); }
  else { c.fillStyle = '#e9c46a'; c.beginPath(); c.ellipse(392, 178, 16, 8, 0, 0, 7); c.fill(); tri(c, 406, 178, 418, 168, 418, 188, '#e9c46a'); circle(c, 384, 176, 2, '#111'); }
  if (!on.has('balloon')) { circle(c, 462, 122, 12, '#e5989b'); line(c, 462, 134, 458, 160, '#d8cfc0', 1.6); }
  // fan dancer prop + drum
  if (!on.has('fan')) { tri(c, 210, 300, 186, 276, 234, 276, '#e9c46a'); line(c, 210, 300, 210, 282, '#7a2c1e', 2); }
  else { tri(c, 210, 300, 186, 276, 234, 276, '#e5989b'); line(c, 210, 300, 210, 282, '#7a2c1e', 2); }
  if (!on.has('drum')) { rect(c, 252, 306, 32, 26, '#c8452c'); rect(c, 252, 306, 32, 6, '#f4ead8'); rect(c, 252, 326, 32, 6, '#f4ead8'); }
  // cat on the right stall roof edge
  if (!on.has('cat')) { circle(c, 428, 302, 12, '#22222e'); circle(c, 417, 294, 8, '#22222e'); tri(c, 411, 289, 413, 281, 418, 287, '#22222e'); tri(c, 420, 287, 425, 281, 426, 289, '#22222e'); }
  else { circle(c, 428, 302, 12, '#e8e3d8'); circle(c, 417, 294, 8, '#e8e3d8'); tri(c, 411, 289, 413, 281, 418, 287, '#e8e3d8'); tri(c, 420, 287, 425, 281, 426, 289, '#e8e3d8'); }
  rect(c, 396, 314, 70, 8, '#8a6a4a');
}

const RENDERERS = { harbour, forest, kitchen, market };
export function drawScene(ctx, sceneKey, appliedIds) {
  ctx.clearRect(0, 0, 500, 375);
  RENDERERS[sceneKey](ctx, appliedIds);
}
