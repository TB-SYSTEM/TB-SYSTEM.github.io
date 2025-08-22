/* ========= 开机动画 ========= */
const lines = [
  'PuzzleOS BIOS v2.05 (C) 2025',
  'Memory Test: 32768K OK',
  'Detecting IDE drives...',
  'Drive 0: 128MB Flash',
  'Booting from Drive 0...',
  'Loading puzzle kernel...'
];
let idx = 0, char = 0;
const bootText  = document.getElementById('bootText');
const barBox    = document.getElementById('barBox');
const bar       = document.getElementById('bar');
const bootScreen= document.getElementById('bootScreen');
const game      = document.getElementById('game');

function type() {
  if (idx < lines.length) {
    if (char < lines[idx].length) {
      bootText.textContent += lines[idx][char++];
      setTimeout(type, 40);
    } else {
      bootText.textContent += '\n'; idx++; char = 0;
      setTimeout(type, 300);
    }
  } else {
    bootText.classList.remove('cursor');
    barBox.style.display = 'block';
    let pct = 0;
    const prog = setInterval(() => {
      pct += 5;
      bar.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(prog);
        try { // 滴声
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.type = 'square';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.connect(ctx.destination);
          osc.start(); osc.stop(ctx.currentTime + 0.1);
        } catch {}
        setTimeout(() => {
          bootScreen.style.display = 'none';
          game.style.display = 'block';
          // 通知 game.js 可以开始
          if (typeof startOrResume === 'function') startOrResume();
        }, 500);
      }
    }, 60);
  }
}
// 立即启动
type();
