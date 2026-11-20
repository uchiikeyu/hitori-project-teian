/* お知らせ：WordPressの投稿の一覧と、1件の記事 */
(() => {
  const id = new URLSearchParams(location.search).get('id');
  const row = p => `<li><a class="news-row" href="news.html?id=${p.id}">
    <span class="num">${p.date}</span><span class="news-cat">${p.cat}</span><span class="news-t">${p.title}</span><span class="arr" aria-hidden="true"></span></a></li>`;

  if (id) {
    // 1件の記事
    loadNews({ id }).then(({ posts: [p] }) => {
      document.getElementById('newsIndex').hidden = true;
      document.getElementById('post').hidden = false;
      document.getElementById('postDate').textContent = p.date;
      document.getElementById('postCat').textContent = p.cat;
      document.getElementById('postTitle').innerHTML = p.title;
      document.getElementById('postBody').innerHTML = p.html;
      if (p.img) document.getElementById('postImg').innerHTML = `<img src="${p.img}" alt="">`;
      document.title = document.getElementById('postTitle').textContent + '｜一人プロジェクト';
      // この記事をSNSで共有する
      const u = encodeURIComponent(location.href), t = encodeURIComponent(document.title);
      document.getElementById('postShare').innerHTML = `<span>この記事をシェア</span>
        <a href="https://social-plugins.line.me/lineit/share?url=${u}" target="_blank" rel="noopener">LINE</a>
        <a href="https://twitter.com/intent/tweet?url=${u}&text=${t}" target="_blank" rel="noopener">X</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">Facebook</a>`;
    }).catch(() => {});   // 読めないときは一覧のまま
    return;
  }

  // 一覧（10件ずつ）
  const list = document.getElementById('newsAll');
  const pager = document.getElementById('newsPager');
  let page = 1;
  const more = first => loadNews({ per: 10, page }).then(({ posts, pages }) => {
    if (!posts.length) return;
    if (first) list.innerHTML = '';
    list.insertAdjacentHTML('beforeend', posts.map(row).join(''));
    pager.hidden = page >= pages;
    page++;
  }).catch(() => {});
  document.getElementById('newsMore').addEventListener('click', () => more(false));
  more(true);
})();
