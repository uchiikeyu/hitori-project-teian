/* サンプル4 — 全ページ共通の部品と動き */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const page = document.body.dataset.page;
  const PAGES = [
    ['index.html', 'トップ', 'top'],
    ['about.html', '私たちについて', 'about'],
    ['projects.html', 'プロジェクト', 'projects'],
    ['join.html', '関わる', 'join'],
  ];

  // ---------- プロジェクト（トップとプロジェクトページで共通） ----------
  const IMG = 'https://1-project.jp/wp-content/uploads/';
  window.PROJECTS = [
    { no: '01', name: '芋', en: 'Satsumaimo', sub: '畑で育て、干し芋に。',
      img: IMG + '2026/07/1248165937.jpg', ph: '畑の写真',
      body: '群馬の畑でさつまいもを育て、干し芋に加工して届けています。農業体験は、子どもたちや地域の人、障害のある方が関われる場にもなっています。2025年3月には、希望館に干し芋を納品しました。',
      facts: [['つくるもの', 'さつまいも・干し芋'], ['届けた先', '希望館（2025年3月）']],
      link: ['../サンプル3_芋ポップ/index.html', '芋のページを見る'] },
    { no: '02', name: 'hitoriの装い', en: 'Apparel', sub: '自然と暮らす、装い。',
      img: '', ph: 'キャップの写真',
      body: '芋一人ロゴ入りキャップ。シンプルなデザインと、軽やかなメッシュ素材。トープグレー、スモークグレー、チャコールグレー、コヨーテブラウン、オリーブの5色です。',
      facts: [['商品', '芋一人ロゴ入りキャップ'], ['価格', '¥3,960'], ['色', '5色']],
      link: ['https://denalist.base.shop/', 'オンラインショップへ'] },
    { no: '03', name: 'イベント', en: 'Events', sub: '人が集まる場をつくる。',
      img: '', ph: 'イベントの写真',
      body: '［イベントの内容をここに入れます。開催したもの、これから予定しているもの。］',
      facts: [['開催', '［回数・場所］'], ['次回', '［日程］']],
      link: ['join.html#contact', 'お問い合わせ'] },
    { no: '04', name: '次のプロジェクト', en: 'Next', sub: 'いま、種をまいています。',
      img: '', ph: '準備中',
      body: '芋から始まった一人プロジェクトは、これからいくつもの分野へ広がっていきます。次に芽を出すプロジェクトは、ここでお知らせします。',
      facts: [['公開', '準備中']],
      link: ['https://www.instagram.com/hitori_project2026/', 'Instagramで知らせを受け取る'] },
  ];
  // 応援の4段階（トップと関わるページで共通）
  window.STAGES = [
    { name: 'フォローする', v: 'フォロー', lead: '応援のはじまり。',
      body: 'Instagramで、日々の活動を見守ってください。フォローやシェアが、プロジェクトを次の人へ届けます。',
      btn: ['https://www.instagram.com/hitori_project2026/', 'Instagramをフォローする'] },
    { name: '商品を買う', v: '商品の購入', lead: '手に取ることが、続ける力に。',
      body: '干し芋やキャップを買うことが、活動を続ける力になり、売上は支援先や地域へ還元されます。',
      btn: ['https://denalist.base.shop/', 'オンラインショップへ'] },
    { name: 'ボランティアに参加する', v: 'ボランティア', lead: '現場で、一緒に手を動かす。',
      body: 'つくる日、届ける日、場をひらく日。ボランティアとして、プロジェクトの現場に関わってください。',
      btn: ['join.html#contact', '参加を申し込む'] },
    { name: '協賛・連携する', v: '協賛・連携', lead: '循環を、大きく育てる。',
      body: '企業・団体として、協賛や連携で活動を支えてください。新しいプロジェクトを一緒につくることもできます。',
      btn: ['join.html#contact', '協賛・連携を相談する'] },
  ];

  const media = (p, cls = '') => `<div class="photo ${cls}">${p.img ? `<img src="${p.img}" alt="" data-ph="${p.ph}">` : `<div class="ph">${p.ph}</div>`}</div>`;
  window.projectMedia = media;

  // ---------- ヘッダー・メニュー・フッター ----------
  const nav = PAGES.map(([h, l, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${l}</a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="curtain" aria-hidden="true"></div>
    <header class="site-head"><div class="wrap">
      <a class="mark" href="index.html" aria-label="一人プロジェクト トップ"><span class="mark-sym" aria-hidden="true"></span><span class="mark-word">HITORI PROJECT</span></a>
      <nav class="nav" aria-label="サイト内">${nav}</nav>
      <button class="menu-btn" aria-label="メニューを開く" aria-expanded="false"><i></i><i></i></button>
    </div></header>
    <nav class="sp-menu" aria-label="サイト内（スマホ）">${PAGES.map(([h, l], i) => `<a href="${h}"><span class="num">0${i + 1}</span>${l}</a>`).join('')}</nav>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site-foot"><div class="wrap">
      <p class="foot-big">一人の想いから、<br>循環を育てる。</p>
      <div class="foot-row">
        <ul>${PAGES.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}
          <li><a href="https://www.instagram.com/hitori_project2026/" target="_blank" rel="noopener">Instagram</a></li></ul>
        <span>© 一人プロジェクト</span>
      </div>
    </div></footer>`);

  const menuBtn = document.querySelector('.menu-btn');
  menuBtn.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });

  // ---------- ページの幕 ----------
  const curtain = document.querySelector('.curtain');
  setTimeout(() => curtain.classList.add('open'), 60);
  addEventListener('pageshow', e => { if (e.persisted) { curtain.classList.remove('close'); curtain.classList.add('open'); } });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || reduce || e.metaKey || e.ctrlKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (/^(https?:|mailto:|#)/.test(href) || href.includes('#')) return;
    e.preventDefault();
    curtain.classList.remove('open'); curtain.classList.add('close');
    setTimeout(() => { location.href = href; }, 750);
  });

  // ---------- 現れる ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  window.observeReveal = (root = document) => root.querySelectorAll('.rv,.fade,.rule,.ln').forEach(el => io.observe(el));
  observeReveal();

  // 写真が読めなかったら枠に置きかえる
  window.fixImages = (root = document) => root.querySelectorAll('img[data-ph]').forEach(img => {
    const swap = () => { img.outerHTML = `<div class="ph">${img.dataset.ph}</div>`; };
    if (img.complete && !img.naturalWidth) swap(); else img.addEventListener('error', swap, { once: true });
  });
  fixImages();

  // ---------- カーソル（マウスのとき） ----------
  if (fine && !reduce) {
    const dot = document.createElement('div'); dot.className = 'cur';
    const ring = document.createElement('div'); ring.className = 'cur-ring'; ring.innerHTML = '<span></span>';
    document.body.append(dot, ring);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    const loop = () => { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      ring.classList.toggle('big', !!t);
      ring.firstChild.textContent = t ? t.dataset.cursor : '';
    });
  }

  // ---------- タップした所に「一」と点 ----------
  if (!reduce) {
    let last = 0;
    document.addEventListener('pointerdown', e => {
      if (e.target.closest('input,textarea,.no-tap')) return;
      const now = performance.now(); if (now - last < 120) return; last = now;
      const l = document.createElement('i'); l.className = 'tap-line';
      const d = document.createElement('i'); d.className = 'tap-dot';
      l.style.left = d.style.left = e.clientX + 'px';
      l.style.top = d.style.top = e.clientY + 'px';
      document.body.append(l, d);
      setTimeout(() => { l.remove(); d.remove(); }, 950);
    }, { passive: true });
  }

  // ---------- 吸いつくボタン ----------
  if (fine && !reduce) {
    document.querySelectorAll('.mag').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.3,1.6,.5,1)'; el.style.transform = ''; setTimeout(() => el.style.transition = '', 600); });
    });
  }

  // ---------- 文字がスクロールで墨になる ----------
  const inks = [...document.querySelectorAll('.ink-text')];
  inks.forEach(el => {
    el.innerHTML = [...el.textContent].map(c => `<span>${c}</span>`).join('');
  });
  const inkScroll = () => inks.forEach(el => {
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * .85 - r.top) / (r.height + innerHeight * .4)));
    const spans = el.children, n = Math.floor(p * spans.length * 1.05);
    for (let i = 0; i < spans.length; i++) spans[i].classList.toggle('inked', i < n);
  });
  if (inks.length) { addEventListener('scroll', inkScroll, { passive: true }); inkScroll(); }

  // ---------- プロジェクトの詳細（全画面に広がる） ----------
  document.body.insertAdjacentHTML('beforeend', `<div class="pj-over" id="pjOver" role="dialog" aria-modal="true" aria-labelledby="pjTitle" hidden>
    <div class="pj-bg"></div><div class="pj-inner"></div></div>`);
  const over = document.getElementById('pjOver');
  let lastFocus = null;
  window.openProject = (i, fromEl) => {
    const p = PROJECTS[i];
    lastFocus = document.activeElement;
    over.querySelector('.pj-inner').innerHTML = `
      <button class="pj-close" aria-label="閉じる" data-cursor="close"><i></i><i></i></button>
      <div class="pj-media">${media(p, 'color')}</div>
      <div class="pj-text">
        <p class="pj-no"><span class="num">${p.no}</span><span class="en">${p.en}</span></p>
        <h2 class="h-sec" id="pjTitle">${p.name}</h2>
        <p class="pj-sub">${p.sub}</p>
        <p class="pj-body">${p.body}</p>
        <dl class="pj-facts">${p.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
        <a class="btn" href="${p.link[0]}"${/^https?:/.test(p.link[0]) ? ' target="_blank" rel="noopener"' : ''}><span class="dot"></span>${p.link[1]}</a>
      </div>`;
    fixImages(over);
    // 押したカードの位置から広がる
    const r = fromEl ? fromEl.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const bg = over.querySelector('.pj-bg');
    bg.style.clipPath = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
    over.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => { over.classList.add('show'); bg.style.clipPath = 'inset(0)'; }));
    over.querySelector('.pj-close').focus({ preventScroll: true });
    over.querySelector('.pj-close').addEventListener('click', closeProject);
    over._from = r;
  };
  const closeProject = () => {
    const r = over._from;
    over.classList.remove('show');
    over.querySelector('.pj-bg').style.clipPath = `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
    setTimeout(() => { over.hidden = true; document.body.style.overflow = ''; lastFocus?.focus({ preventScroll: true }); }, reduce ? 0 : 700);
  };
  addEventListener('keydown', e => { if (e.key === 'Escape' && !over.hidden) closeProject(); });
})();
