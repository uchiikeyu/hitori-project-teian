/* プロジェクト一覧：大きな行・写真がついてくる・しぼりこみ・詳細 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const STATUS = ['now', 'now', 'soon', 'soon'];
  const list = document.getElementById('pjList');
  list.innerHTML = PROJECTS.map((p, i) => `
    <li class="pj-row-li" data-s="${STATUS[i]}">
      <button class="pj-row" data-i="${i}" data-cursor="view">
        <span class="num pj-row-no">${p.no}</span>
        <span class="pj-row-name">${p.name}</span>
        <span class="en pj-row-en">${p.en}</span>
        <span class="pj-row-sub small">${p.sub}</span>
        <span class="pj-row-st small">${STATUS[i] === 'now' ? '進行中' : '準備中'}</span>
      </button>
    </li>`).join('');
  list.querySelectorAll('.pj-row').forEach(b => b.addEventListener('click', () => openProject(+b.dataset.i, b)));

  // しぼりこみ
  const fbs = [...document.querySelectorAll('.pj-filter button')];
  fbs.forEach(b => b.addEventListener('click', () => {
    fbs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    list.querySelectorAll('.pj-row-li').forEach((li, k) => {
      const hit = b.dataset.f === 'all' || li.dataset.s === b.dataset.f;
      li.classList.toggle('out', !hit);
      li.hidden = !hit;
      if (hit && !reduce) { li.classList.remove('in'); void li.offsetWidth; li.style.animationDelay = (k * .06) + 's'; li.classList.add('in'); }
    });
  }));

  // 写真がカーソルについてくる
  const peek = document.getElementById('pjPeek');
  if (fine && !reduce) {
    let px = 0, py = 0, tx = 0, ty = 0;
    list.querySelectorAll('.pj-row').forEach(b => {
      b.addEventListener('pointerenter', () => {
        peek.innerHTML = projectMedia(PROJECTS[+b.dataset.i], 'color');
        fixImages(peek);
        peek.classList.add('show');
      });
      b.addEventListener('pointerleave', () => peek.classList.remove('show'));
    });
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    const f = () => { px += (tx - px) * .1; py += (ty - py) * .1; peek.style.transform = `translate(${px - 150}px,${py - 200}px) rotate(${(tx - px) * .04}deg)`; requestAnimationFrame(f); };
    f();
  }

  if (location.hash === '#p1') setTimeout(() => openProject(0, list.querySelector('.pj-row')), 700);
})();
