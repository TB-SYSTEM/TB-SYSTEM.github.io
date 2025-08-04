const projects = [
  { id: 'project-1', title: '项目一',  desc: '简短描述一句话' },
  { id: 'project-2', title: '项目二',  desc: '简短描述一句话' },
  { id: 'project-3', title: '项目三',  desc: '简短描述一句话' },
  { id: 'project-4', title: '项目四',  desc: '简短描述一句话' }
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
