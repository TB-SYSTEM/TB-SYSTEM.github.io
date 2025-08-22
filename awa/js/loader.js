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

/* ========== 搜索 ========== */
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const postList      = document.getElementById('post-list');
const countSpan     = document.getElementById('search-count');

let postCache = [];   // 缓存所有文章的 {file, title, summary, html}

// 首次加载完成后全文缓存
window.addEventListener('DOMContentLoaded', async () => {
  const files = await fetchFileList();
  postCache = await Promise.all(files.map(async f => {
    const res  = await fetch(ARTICLE_DIR + f);
    const html = await res.text();
    const dom  = new DOMParser().parseFromString(html, 'text/html');
    const title   = dom.title || f.replace('.html','');
    const summary = dom.querySelector('meta[name="summary"]')?.content || '';
    const bodyText = dom.body.textContent.toLowerCase();
    return {file:f, title, summary, bodyText, html};
  }));
});

// 实时搜索
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {  // 清空
    postList.hidden = false;
    searchResults.hidden = true;
    countSpan.textContent = '';
    return;
  }

  const hits = postCache.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.summary.toLowerCase().includes(q) ||
    p.bodyText.includes(q)
  );

  renderSearch(hits, q);
});

// 渲染搜索结果
function renderSearch(list, keyword) {
  postList.hidden = true;
  searchResults.hidden = false;
  countSpan.textContent = list.length ? `共 ${list.length} 条` : '无匹配';

  searchResults.innerHTML = '';
  list.forEach(p => {
    const li = document.createElement('li');
    // 高亮关键词
    const title = p.title.replace(new RegExp(keyword,'gi'), m => `<mark>${m}</mark>`);
    li.innerHTML = `
      <a href="${ARTICLE_DIR}${p.file}">${title}</a>
      <p class="summary">${p.summary}</p>
    `;
    searchResults.appendChild(li);
  });
}