const LIST_EL   = document.getElementById('post-list');
const ARTICLE_DIR = 'wenzhang/';

// 获取文章列表
async function fetchFileList() {
  // 部署到线上时，需要服务器端索引，这里用简单的 `index.json`
  // 本地用 Live Server 时，可直接列出文件
  try {
    // 尝试读取 wenzhang/index.json
    const res = await fetch(ARTICLE_DIR + 'index.json');
    if (res.ok) {
      const files = await res.json();
      return files;
    }
  } catch {}

  // 如果没有 index.json，则退化为固定列表
  //（本地直接打开 file:// 时无法遍历目录，建议用 Live Server）
  return ['first-post.html', 'another.html']; // ←改成你的实际文件名
}

// 解析单篇文章的 <meta name="summary"> 和 <title>
async function parsePost(file) {
  const html = await fetch(ARTICLE_DIR + file).then(r => r.text());
  const dom  = new DOMParser().parseFromString(html, 'text/html');
  const title = dom.title || file.replace('.html', '');
  const summary = dom.querySelector('meta[name="summary"]')?.content || '暂无概括';
  return { file, title, summary };
}

// 渲染列表
async function render() {
  const files = await fetchFileList();
  const posts = await Promise.all(files.map(parsePost));
  LIST_EL.innerHTML = '';
  posts.forEach(({ file, title, summary }) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${ARTICLE_DIR}${file}">${title}</a>
      <p class="summary">${summary}</p>
    `;
    LIST_EL.appendChild(li);
  });
}

render();