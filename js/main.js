/* 1. 滚动视差 */
const parallax = document.getElementById('parallax');
window.addEventListener('scroll', () => {
  const offset = window.pageYOffset;
  parallax.style.transform = `translateY(${offset * 0.3}px)`;
});

/* 2. 背景粒子 */
const COUNT = 40;
for (let i = 0; i < COUNT; i++) {
  const dot = document.createElement('span');
  dot.style.cssText = `
    position: fixed; width: 2px; height: 2px; background: #6ee7b7; border-radius: 50%;
    pointer-events: none; opacity: 0.6; z-index: -1;
    left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
    animation: float ${5 + Math.random() * 10}s linear infinite;
  `;
  document.body.appendChild(dot);
}
const style = document.createElement('style');
style.innerHTML = `
  @keyframes float {
    0% { transform: translateY(0) scale(1); }
    100% { transform: translateY(-100vh) scale(0); }
  }
`;
document.head.appendChild(style);

/* 3. 微光鼠标跟随 */
const spark = document.createElement('div');
spark.id = 'spark';
spark.style.cssText = `
  position: fixed; width: 30px; height: 30px; border-radius: 50%;
  background: radial-gradient(circle, #6ee7b7 0%, transparent 70%);
  pointer-events: none; transform: translate(-50%, -50%) scale(0); transition: 0.1s;
  z-index: 9999;
`;
document.body.appendChild(spark);
window.addEventListener('mousemove', (e) => {
  spark.style.left = e.clientX + 'px';
  spark.style.top = e.clientY + 'px';
  spark.style.transform = 'translate(-50%, -50%) scale(1)';
});
