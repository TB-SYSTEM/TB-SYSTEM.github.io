/* ========== 基础 & 配置 ========== */
const cv   = document.getElementById('gameCanvas');
const ctx  = cv.getContext('2d');
const $    = id => document.getElementById(id);
const W    = cv.width, H = cv.height;

const PADDLE_W = 90, PADDLE_H = 12, BALL_R = 9;
const BRICK_W  = 55, BRICK_H = 22, GAP = 6;
let ROWS   = 4, COLS = 9;
let bricks = [], level = 1, lives = 3, score = 0;
let paddleX = (W - PADDLE_W) / 2;
let ballX = W/2, ballY = H-40;
let dx = 4, dy = -4;
let paused = false;
let rightDown=false, leftDown=false;

/* ========== 工具 ========== */
const rand = (min,max)=>Math.random()*(max-min)+min;
const neon = (c,a=1)=>{
  ctx.globalAlpha=a;
  ctx.shadowColor=c;
  ctx.shadowBlur=12;
  ctx.fillStyle=c;
  ctx.strokeStyle=c;
};
const clearGlow = ()=>ctx.shadowBlur=0;

/* ========== 砖块 ========== */
function initBricks(){
  bricks=[];
  ROWS = Math.min(level+3,7);
  COLS = Math.min(9+Math.floor(level/2),12);
  for(let r=0;r<ROWS;r++){
    bricks[r]=[];
    for(let c=0;c<COLS;c++){
      bricks[r][c]={
        x:0,y:0,
        alive:true,
        hue:rand(0,360)
      };
    }
  }
}

/* ========== 事件 ========== */
document.addEventListener('keydown',e=>{
  if(e.code==='ArrowRight') rightDown=true;
  if(e.code==='ArrowLeft')  leftDown=true;
  if(e.code==='Space'){paused=!paused;e.preventDefault();}
});
document.addEventListener('keyup',e=>{
  if(e.code==='ArrowRight') rightDown=false;
  if(e.code==='ArrowLeft')  leftDown=false;
});

/* ========== 碰撞检测 ========== */
function collide(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const b=bricks[r][c];
      if(b.alive &&
         ballX>b.x && ballX<b.x+BRICK_W &&
         ballY>b.y && ballY<b.y+BRICK_H){
        b.alive=false;
        dy=-dy;
        score+=(10+level*5);
        $('score').textContent=score;
        if(bricks.flat().every(b=>!b.alive)) nextLevel();
      }
    }
  }
}

/* ========== 下一关 ========== */
function nextLevel(){
  level++;
  $('level').textContent=level;
  dx = (dx>0?1:-1)*(4+level*0.5);
  dy = -Math.abs(dx);
  ballX=W/2; ballY=H-40;
  paddleX=(W-PADDLE_W)/2;
  initBricks();
  showMsg(`LEVEL ${level}`);
}

/* ========== 提示文字 ========== */
function showMsg(txt){
  const msg=$('msg');
  msg.textContent=txt; msg.classList.add('show');
  setTimeout(()=>msg.classList.remove('show'),1000);
}

/* ========== 主循环 ========== */
function loop(){
  if(paused){requestAnimationFrame(loop);return;}
  ctx.clearRect(0,0,W,H);

  /* 背景网格 */
  neon('#0ff',.05);
  for(let i=0;i<W;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
  for(let j=0;j<H;j+=40){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
  clearGlow();

  /* 砖块 */
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const b=bricks[r][c];
      if(b.alive){
        b.x=c*(BRICK_W+GAP)+GAP;
        b.y=r*(BRICK_H+GAP)+GAP+35;
        neon(`hsl(${b.hue},100%,55%)`);
        ctx.fillRect(b.x,b.y,BRICK_W,BRICK_H);
        ctx.strokeRect(b.x,b.y,BRICK_W,BRICK_H);
      }
    }
  }

  /* 挡板 */
  neon('#0ff');
  ctx.fillRect(paddleX,H-PADDLE_H,PADDLE_W,PADDLE_H);
  clearGlow();

  /* 球 */
  neon('#fff');
  ctx.beginPath();
  ctx.arc(ballX,ballY,BALL_R,0,Math.PI*2);
  ctx.fill();
  clearGlow();

  /* 边界 & 掉球 */
  if(ballX+dx>W-BALL_R||ballX+dx<BALL_R) dx=-dx;
  if(ballY+dy<BALL_R) dy=-dy;
  else if(ballY+dy>H-BALL_R){
    if(ballX>paddleX && ballX<paddleX+PADDLE_W){
      const hitPos=(ballX-paddleX)/PADDLE_W;
      const angle=(hitPos-0.5)*Math.PI/3;
      const speed=Math.sqrt(dx*dx+dy*dy);
      dx=speed*Math.sin(angle);
      dy=-speed*Math.cos(angle);
    }else{
      lives--;
      $('lives').textContent=lives;
      if(lives<=0){
        showMsg('GAME OVER');
        setTimeout(()=>location.reload(),1500);
        return;
      }else{
        ballX=W/2; ballY=H-40;
        dx=(dx>0?1:-1)*(4+level*0.5);
        dy=-Math.abs(dx);
        paddleX=(W-PADDLE_W)/2;
        showMsg(`LIVES ${lives}`);
      }
    }
  }

  /* 移动挡板 */
  if(rightDown&&paddleX<W-PADDLE_W) paddleX+=8;
  if(leftDown&&paddleX>0) paddleX-=8;

  ballX+=dx; ballY+=dy;
  collide();
  requestAnimationFrame(loop);
}

/* ========== 启动 ========== */
initBricks();
loop();