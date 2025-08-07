let board = [];
let score = 0;
let gameOver = false;
let hasWon = false;
const size = 4;

// 用于跟踪方块位置和动画
let tiles = [];

const boardEl = document.getElementById("game-board");
const scoreEl = document.getElementById("score");

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  tiles = Array.from({ length: size }, () => Array(size).fill(null));
  score = 0;
  gameOver = false;
  hasWon = false;
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
  // 添加新方块的动画标记
  tiles[r][c] = { value: board[r][c], isNew: true, isMerged: false };
}

function updateBoard() {
  boardEl.innerHTML = "";
  
  // 创建网格背景
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      boardEl.appendChild(cell);
    }
  }
  
  // 添加数字方块
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = board[r][c];
      if (value !== 0) {
        const tile = document.createElement("div");
        tile.className = "grid-cell tile-" + value;
        tile.textContent = value;
        tile.style.width = `calc((100% - 30px) / 4)`;
        tile.style.height = `calc((100% - 30px) / 4)`;
        tile.style.top = `calc(${r} * (100% - 30px) / 4 + 10px)`;
        tile.style.left = `calc(${c} * (100% - 30px) / 4 + 10px)`;
        
        // 添加动画类
        if (tiles[r][c] && tiles[r][c].isNew) {
          tile.classList.add("tile-new");
          // 清除标记，防止重复动画
          tiles[r][c].isNew = false;
        } else if (tiles[r][c] && tiles[r][c].isMerged) {
          tile.classList.add("tile-merged");
          // 清除标记，防止重复动画
          tiles[r][c].isMerged = false;
        }
        
        boardEl.appendChild(tile);
      }
    }
  }
  
  scoreEl.textContent = score;
  
  // 检查游戏是否结束
  if (isGameOver()) {
    setTimeout(() => {
      alert("游戏结束！最终得分：" + score);
    }, 100);
  } else if (!hasWon && board.some(row => row.includes(2048))) {
    hasWon = true;
    setTimeout(() => {
      alert("恭喜你达到2048！你可以继续游戏以获得更高分数。");
    }, 100);
  }
}

function slide(row, rowIndex) {
  let moved = false;
  // 创建一个新数组，初始值过滤掉0
  let arr = [];
  let positions = [];
  
  // 记录原始位置
  for (let i = 0; i < row.length; i++) {
    if (row[i] !== 0) {
      arr.push(row[i]);
      positions.push(i);
    }
  }
  
  // 合并相邻相同值 - 修复合并逻辑，确保每个方块只合并一次
  let i = 0;
  while (i < arr.length - 1) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1); // 移除已合并的元素
      positions.splice(i + 1, 1); // 同时移除位置信息
      moved = true;
      // 标记合并的方块
      if (tiles[rowIndex]) {
        tiles[rowIndex][positions[i]] = { value: arr[i], isNew: false, isMerged: true };
      }
    }
    i++;
  }
  
  // 创建结果数组，填充0到size长度
  let result = new Array(size).fill(0);
  // 将非零值复制到结果数组开头
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i];
  }
  
  // 检查是否发生移动
  if (row.some((val, i) => val !== result[i])) {
    moved = true;
  }
  
  return { moved, result };
}

function moveLeft() {
  if (gameOver) return Promise.resolve(false);
  
  let overallMoved = false;
  for (let r = 0; r < size; r++) {
    const { moved, result } = slide(board[r], r);
    if (moved) {
      board[r] = result;
      overallMoved = true;
    }
  }
  
  if (overallMoved) {
    addRandomTile();
    updateBoard();
  }
  
  return Promise.resolve(overallMoved);
}

function moveRight() {
  if (gameOver) return Promise.resolve(false);
  
  let overallMoved = false;
  for (let r = 0; r < size; r++) {
    // 反转行，使用slide函数，然后再反转回来
    const reversedRow = [...board[r]].reverse();
    const { moved, result } = slide(reversedRow, r);
    if (moved) {
      board[r] = result.reverse();
      overallMoved = true;
    }
  }
  
  if (overallMoved) {
    addRandomTile();
    updateBoard();
  }
  
  return Promise.resolve(overallMoved);
}

function transpose() {
  const newBoard = Array.from({ length: size }, () => Array(size).fill(0));
  const newTiles = Array.from({ length: size }, () => Array(size).fill(null));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      newBoard[c][r] = board[r][c];
      newTiles[c][r] = tiles[r][c];
    }
  }
  board = newBoard;
  tiles = newTiles;
}

function moveUp() {
  if (gameOver) return Promise.resolve(false);
  
  let overallMoved = false;
  // 转置矩阵
  transpose();
  // 对每一行执行左移操作
  for (let r = 0; r < size; r++) {
    const { moved, result } = slide(board[r], r);
    if (moved) {
      board[r] = result;
      overallMoved = true;
    }
  }
  // 转置回来
  transpose();
  
  if (overallMoved) {
    addRandomTile();
    updateBoard();
  }
  
  return Promise.resolve(overallMoved);
}

function moveDown() {
  if (gameOver) return Promise.resolve(false);
  
  let overallMoved = false;
  // 转置矩阵
  transpose();
  // 对每一行执行右移操作
  for (let r = 0; r < size; r++) {
    const reversedRow = [...board[r]].reverse();
    const { moved, result } = slide(reversedRow, r);
    if (moved) {
      board[r] = result.reverse();
      overallMoved = true;
    }
  }
  // 转置回来
  transpose();
  
  if (overallMoved) {
    addRandomTile();
    updateBoard();
  }
  
  return Promise.resolve(overallMoved);
}

// 检查游戏是否结束
function isGameOver() {
  // 检查是否还有空格
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return false;
    }
  }
  
  // 检查是否还能合并
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size - 1; c++) {
      if (board[r][c] === board[r][c + 1]) return false;
    }
  }
  
  for (let c = 0; c < size; c++) {
    for (let r = 0; r < size - 1; r++) {
      if (board[r][c] === board[r + 1][c]) return false;
    }
  }
  
  gameOver = true;
  return true;
}

let isMoving = false;

document.addEventListener("keydown", (e) => {
  // 如果正在移动或游戏结束，则忽略按键
  if (isMoving || gameOver) return;
  
  isMoving = true;
  
  let movePromise;
  
  switch (e.key) {
    case "ArrowLeft": 
      movePromise = moveLeft();
      break;
    case "ArrowRight": 
      movePromise = moveRight();
      break;
    case "ArrowUp": 
      movePromise = moveUp();
      break;
    case "ArrowDown": 
      movePromise = moveDown();
      break;
    default:
      movePromise = Promise.resolve(false);
  }
  
  movePromise.then(() => {
    isMoving = false;
  });
});

function restart() {
  init();
}

init();