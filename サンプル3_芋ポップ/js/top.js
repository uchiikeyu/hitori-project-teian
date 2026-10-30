/* トップ：割れる焼き芋・つるを引っぱる・段階の横スクロール・キャップ */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pop = (el, n) => {
    const r = el.getBoundingClientRect();
    window.popImo(r.left + r.width / 2, r.top + r.height / 2, n);
  };

  // ---------- 焼き芋がパカッと割れる ----------
  const imo = document.getElementById('heroImo');
  const hint = document.getElementById('heroHint');
  imo.addEventListener('click', () => {
    const open = imo.classList.toggle('open');
    imo.setAttribute('aria-pressed', open);
    hint.textContent = open ? 'もう一度タップでとじる' : 'タップすると、パカッ';
    if (open) { pop(imo, 6); if (navigator.vibrate) navigator.vibrate([15, 30, 15]); }
  });

  // ---------- つるを引っぱって掘る ----------
  const dig = document.getElementById('dig');
  const plant = document.getElementById('digPlant');
  const handle = document.getElementById('digHandle');
  const countEl = document.getElementById('digCount');
  const done = document.getElementById('digDone');
  const tubers = [...plant.querySelectorAll('.tuber')];
  const PULL = () => dig.clientHeight * .5;   // 引っぱりきる距離
  let p = 0, harvested = false, drag = null, shown = 0;

  const setP = (v, animate) => {
    p = Math.max(0, Math.min(1, v));
    plant.classList.toggle('ease', !!animate);
    plant.style.transform = `translateY(${-p * PULL()}px)`;
    // 土の上に出た芋の数
    const soilTop = dig.querySelector('.dig-soil').getBoundingClientRect().top;
    const out = tubers.filter(t => {
      const b = t.getBoundingClientRect();
      const o = b.bottom - (animate ? 0 : 0) < soilTop + 4;
      t.classList.toggle('out', o);
      return o;
    }).length;
    if (out > shown) { tubers.filter(t => t.classList.contains('out')).slice(shown).forEach(t => pop(t, 1)); if (navigator.vibrate) navigator.vibrate(10); }
    shown = out;
    countEl.textContent = out;
  };

  const finish = () => {
    harvested = true;
    dig.classList.add('harvested');
    done.hidden = false;
    requestAnimationFrame(() => done.classList.add('show'));
    tubers.forEach((t, i) => setTimeout(() => pop(t, 2), reduce ? 0 : i * 80));
  };

  const release = () => {
    if (harvested) return;
    if (p > .92) { setP(1, true); setTimeout(() => { setP(1, false); finish(); }, 300); }
    else { setP(0, true); setTimeout(() => setP(0, false), 600); shown = 0; tubers.forEach(t => t.classList.remove('out')); countEl.textContent = 0; }
  };

  handle.addEventListener('pointerdown', e => {
    if (harvested) return;
    drag = { y: e.clientY, p };
    handle.setPointerCapture(e.pointerId);
    dig.classList.add('pulling');
  });
  handle.addEventListener('pointermove', e => {
    if (!drag) return;
    // 重く引っぱる感じ：抵抗をつける
    const raw = (drag.y - e.clientY) / PULL();
    setP(drag.p + raw * (1 - p * .35), false);
  });
  const up = () => { if (!drag) return; drag = null; dig.classList.remove('pulling'); release(); };
  handle.addEventListener('pointerup', up);
  handle.addEventListener('pointercancel', up);
  handle.addEventListener('keydown', e => {
    if (harvested || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    setP(p + .25, true);
    if (p >= 1) setTimeout(finish, 350);
  });
  document.getElementById('digReset').addEventListener('click', () => {
    harvested = false; shown = 0;
    dig.classList.remove('harvested');
    done.classList.remove('show'); done.hidden = true;
    tubers.forEach(t => t.classList.remove('out'));
    setP(0, true);
    countEl.textContent = 0;
  });
  addEventListener('resize', () => setP(p, false));

  // ---------- 段階：マウスでもドラッグして横に動かせる ----------
  const steps = document.getElementById('steps');
  let sd = null;
  steps.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    sd = { x: e.clientX, s: steps.scrollLeft };
    steps.classList.add('grab');
  });
  addEventListener('pointermove', e => { if (sd) steps.scrollLeft = sd.s - (e.clientX - sd.x); });
  addEventListener('pointerup', () => { sd = null; steps.classList.remove('grab'); });
  steps.querySelectorAll('.step').forEach(s => s.addEventListener('click', () => {
    s.classList.remove('boing'); void s.offsetWidth; s.classList.add('boing');
  }));

  // ---------- キャップの色 ----------
  const capBlob = document.getElementById('capBlob');
  const sws = [...document.querySelectorAll('.mini-sw button')];
  sws.forEach(b => b.addEventListener('click', () => {
    sws.forEach(x => x.classList.toggle('on', x === b));
    capBlob.classList.remove('hop'); void capBlob.offsetWidth; capBlob.classList.add('hop');
    setTimeout(() => capBlob.style.setProperty('--cap', b.style.getPropertyValue('--c')), reduce ? 0 : 180);
  }));
})();
