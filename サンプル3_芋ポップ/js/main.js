/* サンプル3 — 全ページ共通の部品と動き */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page;
  const PAGES = [
    ['index.html', 'トップ', 'top'],
    ['about.html', '想いとしくみ', 'about'],
    ['hatake.html', '畑と日記', 'hatake'],
    ['goods.html', 'グッズ', 'goods'],
    ['join.html', '関わる', 'join'],
  ];

  // ---------- ヘッダー・フッター ----------
  const nav = PAGES.map(([h, l, k]) =>
    `<a href="${h}"${k === page ? ' aria-current="page"' : ''}${k === 'join' && k !== page ? ' class="nav-cta"' : ''}>${l}</a>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
    <header class="site-head"><div class="wrap">
      <a class="logo" href="index.html"><span class="logo-mark" aria-hidden="true"></span>一人プロジェクト</a>
      <button class="menu-btn" aria-expanded="false">メニュー</button>
      <nav class="nav" aria-label="サイト内">${nav}</nav>
    </div>
    <div class="roll-track" aria-hidden="true"><div class="roll-fill"></div><div class="roll-imo"></div></div>
    </header>`);
  document.body.insertAdjacentHTML('beforeend', `
    <footer class="site-foot"><div class="wrap">
      <div class="foot-grid">
        <div><p class="foot-catch">種をまこう。<br>夢の種をまこう。</p>
          <p style="margin-top:14px;font-size:15px">農業・子ども・地域・未来を、静かにつなぐ。</p></div>
        <ul>${PAGES.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul>
        <ul>
          <li><a href="https://www.instagram.com/hitori_project2026/" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://denalist.base.shop/" target="_blank" rel="noopener">オンラインショップ</a></li>
          <li><a href="join.html#contact">お問い合わせ</a></li>
        </ul>
      </div>
      <small>© 一人プロジェクト</small>
    </div></footer>`);

  const head = document.querySelector('.site-head');
  const menuBtn = head.querySelector('.menu-btn');
  menuBtn.addEventListener('click', () => {
    const open = head.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'とじる' : 'メニュー';
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // ---------- スクロールで芋が転がる ----------
  const fill = head.querySelector('.roll-fill');
  const rimo = head.querySelector('.roll-imo');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const r = max > 0 ? Math.min(1, scrollY / max) : 0;
    fill.style.width = (r * 100) + '%';
    rimo.style.left = `calc(${r * 100}% + ${13 - r * 26}px)`;
    rimo.style.transform = `rotate(${r * 1440}deg)`;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 写真が「ぽよん」と出る ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: .2 });
  document.querySelectorAll('.pop-in').forEach(el => io.observe(el));

  // ---------- 写真が読めなかったら枠に置きかえる ----------
  document.querySelectorAll('img[data-ph]').forEach(img => {
    const swap = () => { img.outerHTML = `<div class="ph">${img.dataset.ph}</div>`; };
    if (img.complete && !img.naturalWidth) swap(); else img.addEventListener('error', swap);
  });

  // ---------- どこをタップしても小さな芋がポンと出て転がる ----------
  if (!reduce) {
    const imos = [];
    let raf = 0, last = 0;
    const step = () => {
      const floor = innerHeight - 6;
      for (let i = imos.length - 1; i >= 0; i--) {
        const m = imos[i];
        m.vy += .55; m.x += m.vx; m.y += m.vy; m.r += m.vx * 4; m.life--;
        if (m.y > floor) { m.y = floor; m.vy *= -.45; m.vx *= .85; }
        m.el.style.transform = `translate(${m.x}px,${m.y}px) rotate(${m.r}deg)`;
        m.el.style.opacity = Math.min(1, m.life / 20);
        if (m.life <= 0) { m.el.remove(); imos.splice(i, 1); }
      }
      raf = imos.length ? requestAnimationFrame(step) : 0;
    };
    window.popImo = (x, y, n = 1) => {
      for (let k = 0; k < n; k++) {
        const el = document.createElement('i');
        el.className = 'mini-imo' + (Math.random() < .3 ? ' y' : '');
        document.body.appendChild(el);
        imos.push({ el, x, y, vx: Math.random() * 6 - 3, vy: -6 - Math.random() * 5, r: Math.random() * 60, life: 70 + Math.random() * 20 });
      }
      while (imos.length > 40) imos.shift().el.remove();
      if (!raf) raf = requestAnimationFrame(step);
    };
    document.addEventListener('pointerdown', e => {
      if (e.target.closest('input,textarea,select,.no-imo')) return;
      const now = performance.now();
      if (now - last < 100) return;
      last = now;
      const ring = document.createElement('i');
      ring.className = 'tap-pop';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 460);
      window.popImo(e.clientX, e.clientY);
    }, { passive: true });
  } else {
    window.popImo = () => {};
  }
})();
