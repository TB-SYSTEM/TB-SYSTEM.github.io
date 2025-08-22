/******************************************************************
 * 全局状态
 ******************************************************************/
const state = {
  seq: [], binTarget: '', clockAnswer: '', mirrorNeed: '',
  vals: [0, 0, 0, 0], finalSeed: 0, room: 0
};
const SAVE_KEY = 'miniPuzzleSave';

/******************************************************************
 * 存档 I/O
 ******************************************************************/
function loadSave() {
  const s = localStorage.getItem(SAVE_KEY);
  if (!s) return false;
  Object.assign(state, JSON.parse(s));
  return true;
}
function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

/******************************************************************
 * 初始化
 ******************************************************************/
function initGame() {
  state.binTarget   = Array.from({length:16}, () => Math.random() > 0.5 ? 1 : 0).join('');
  state.clockAnswer = String(100 + Math.floor(Math.random() * 1400)).slice(-4).replace(/(..)/, '$1:');
  state.mirrorNeed  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  state.finalSeed   = Math.floor(Math.random() * 9000) + 1000;
  state.room = 0;
  save();
}

/******************************************************************
 * 房间切换
 ******************************************************************/
function next(n) {
  state.room = n;
  save();
  document.querySelectorAll('.room').forEach(r => r.classList.remove('active'));
  document.getElementById('r' + n).classList.add('active');

  if (n === 2) {
    document.getElementById('targetBin').textContent = state.binTarget;
    buildBoard();
  }
  if (n === 3) {
    const t = state.clockAnswer.split(':');
    tickClock(parseInt(t[0]), parseInt(t[1]));
  }
}

/******************************************************************
 * 机关实现
 ******************************************************************/
function startOrResume() {
  if (!loadSave()) initGame();
  next(state.room);
}

/* 三色开关 */
function switchPress(c) {
  state.seq.push(c);
  const goal = ['red', 'green', 'blue', 'red', 'green', 'blue'];
  for (let i = 0; i < state.seq.length; i++)
    if (state.seq[i] !== goal[i]) { state.seq = []; document.getElementById('bulb').textContent = '灯泡：⚫'; return; }

  if (state.seq.length === 6) {
    state.vals[0] = 6;
    next(2);
  }
}

/* 二进制棋盘 */
function buildBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.idx = i;
    cell.onclick = () => toggleCell(cell);
    board.appendChild(cell);
  }
}
function toggleCell(cell) {
  cell.classList.toggle('on');
  const cur = Array.from(document.querySelectorAll('.cell')).map(c => c.classList.contains('on') ? 1 : 0).join('');
  if (cur === state.binTarget) {
    state.vals[1] = parseInt(state.binTarget, 2);
    next(3);
  }
}

/* 时钟 */
let h = 0, m = 0;
function tickClock(H, M) { h = H; m = M; document.getElementById('clockText').textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); }
function checkTime() {
  if (document.getElementById('timeInput').value === state.clockAnswer) {
    state.vals[2] = h * 60 + m;
    next(4);
  } else alert('时间错误');
}

/* 回文 */
function checkMirror() {
  const s = document.getElementById('mirrorInput').value.toUpperCase();
  if (s.includes(state.mirrorNeed) && s === [...s].reverse().join('')) {
    state.vals[3] = s.length;
    makeFinalLog();
    next(5);
  } else alert('不符合规则');
}
function makeFinalLog() {
  const [a, b, c, d] = state.vals;
  const finalLog = document.getElementById('finalLog');
  finalLog.innerHTML = '';
  [
    `${a}×${b}+${c}-${d}= ${a * b + c - d}`,
    `(${a * b + c - d}) % 9973 = ${(a * b + c - d) % 9973}`,
    `最终密码 = ${state.finalSeed + (a * b + c - d) % 9973}`
  ].forEach(l => { const div = document.createElement('div'); div.textContent = l; finalLog.appendChild(div); });
}

/* 最终校验 */
function checkFinal() {
  const [a, b, c, d] = state.vals;
  const ans = state.finalSeed + ((a * b + c - d) % 9973);
  if (parseInt(document.getElementById('finalInput').value) === ans) {
    document.getElementById('showSeed').textContent = ans;
    resetSave();
    location.href = 'inbex.html'; // 通关跳转
  } else alert('密码错误');
}
