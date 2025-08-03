let board = [];
let score = 0;
const size = 4;

const boardEl = document.getElementById("game-board");
const scoreEl = document.getElementById("score");

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  const empties = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  boardEl.innerHTML = "";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = board[r][c];
      const tile = document.createElement("div");
      tile.className = "grid-cell";
      if (value !== 0) {
        tile.textContent = value;
        tile.classList.add("tile-" + value);
      }
      boardEl.appendChild(tile);
    }
  }
  scoreEl.textContent = score;
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val);
  while (arr.length < size) arr.push(0);
  return arr;
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < size; r++) {
    const original = [...board[r]];
    board[r] = slide(board[r]);
    if (board[r].join(",") !== original.join(",")) moved = true;
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < size; r++) {
    const original = [...board[r]];
    board[r] = slide(board[r].slice().reverse()).reverse();
    if (board[r].join(",") !== original.join(",")) moved = true;
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function transpose() {
  board = board[0].map((_, i) => board.map(row => row[i]));
}

function moveUp() {
  transpose();
  moveLeft();
  transpose();
}

function moveDown() {
  transpose();
  moveRight();
  transpose();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

function restart() {
  init();
}

init();
