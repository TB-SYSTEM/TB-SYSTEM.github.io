/* 只扫描 zhenghuo/ 文件夹里的作品 */
const projects = [
  { id: 'zheng-1', title: '作品 1', desc: '整活作品描述' },
  { id: 'zheng-2', title: '作品 2', desc: '整活作品描述' },
  { id: 'zheng-3', title: '作品 3', desc: '整活作品描述' },
  { id: 'zheng-4', title: '作品 4', desc: '整活作品描述' }
];

const gallery = document.getElementById('gallery');

projects.forEach(p => {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = `../zhenghuo/${p.id}/index.html`;   // 指向 zhenghuo/项目/index.html

  card.innerHTML = `
    <img src="../zhenghuo/${p.id}/cover.jpg" alt="${p.title}" loading="lazy">
    <div class="info">
      <div class="title">${p.title}</div>
      <div class="desc">${p.desc}</div>
    </div>
  `;

  gallery.appendChild(card);
});
