const projects = [
  { id: 'project-1', title: '2048',  desc: '经典2048，awa' },
  { id: 'project-2', title: '霓虹弹球',  desc: '不停弹弹弹！' },
  { id: 'project-3', title: '亿点即爆',  desc: '"亿"是什么意思？' }
];

const portfolio = document.getElementById('portfolio');

projects.forEach(p => {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = `../Projets/${p.id}/index.html`;

  card.innerHTML = `
    <img src="../Projets/${p.id}/cover.jpg" alt="${p.title}" loading="lazy">
    <div class="info">
      <div class="title">${p.title}</div>
      <div class="desc">${p.desc}</div>
    </div>
  `;

  portfolio.appendChild(card);
});
