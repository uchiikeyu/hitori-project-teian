/* トップ：はじける線・プロジェクトのレール・めぐる輪・お知らせ */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  // ---------- 一本の線（弦のようにはじける） ----------
  const box = document.querySelector('.string-box');
  const cv = document.getElementById('string');
  const ctx = cv.getContext('2d');
  const N = 96;
  let W = 0, H = 0, y = new Float32Array(N), v = new Float32Array(N);
  let ptr = null, held = new Set(), dotX = .62, dot = { y: 0, vy: 0, off: 0 };
  let plucks = 0;
  const hint = document.getElementById('stringHint');
  const size = () => {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = box.clientWidth; H = box.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size(); addEventListener('resize', size);

  // やわらかい弦の音（初期は鳴らさない）
  let actx = null, soundOn = false;
  const tone = (x) => {
    if (!soundOn) return;
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'triangle';
    o.frequency.value = 196 + (1 - x) * 196;   // 左ほど高い
    g.gain.setValueAtTime(.0001, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.12, actx.currentTime + .01);
    g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + 1.6);
    o.connect(g).connect(actx.destination); o.start(); o.stop(actx.currentTime + 1.7);
  };
  const soundBtn = document.getElementById('soundBtn');
  soundBtn?.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn);
    soundBtn.textContent = soundOn ? '音：あり' : '音：なし';
    if (soundOn) tone(.5);
  });

  const pluck = (xr, amp) => {
    const c = Math.round(xr * (N - 1));
    for (let i = 1; i < N - 1; i++) {
      const d = (i - c) / 6;
      v[i] += amp * Math.exp(-d * d);
    }
    // 点の近くをはじいたら点が跳ねる
    if (Math.abs(xr - dotX) < .12) dot.vy = -Math.abs(amp) * .9 - 4;
    tone(xr);
    plucks++;
    if (plucks === 1) hint.textContent = 'もう一度。点の近くをはじくと…';
    if (plucks === 4) hint.textContent = '一人の想いが、波になって広がっていく。';
    if (navigator.vibrate) navigator.vibrate(8);
  };

  box.addEventListener('pointerdown', e => {
    const r = box.getBoundingClientRect();
    const xr = (e.clientX - r.left) / r.width;
    const dy = e.clientY - r.top - H / 2;
    pluck(xr, (dy > 0 ? -1 : 1) * 14);
  });
  box.addEventListener('pointermove', e => {
    const r = box.getBoundingClientRect();
    ptr = { x: (e.clientX - r.left) / r.width, y: e.clientY - r.top - H / 2 };
  });
  box.addEventListener('pointerleave', () => { ptr = null; held.clear(); });

  const step = () => {
    // 指が線の近くにあるあいだは、線が指についてくる。離れると弾む
    if (ptr && !reduce) {
      const c = ptr.x * (N - 1);
      const near = Math.abs(ptr.y - y[Math.round(Math.max(0, Math.min(N - 1, c)))]) < 46;
      for (let i = 1; i < N - 1; i++) {
        const d = (i - c) / 5, w = Math.exp(-d * d);
        if (near && w > .05) { y[i] += (Math.max(-90, Math.min(90, ptr.y)) - y[i]) * .25 * w; held.add(i); }
      }
      if (!near && held.size) { held.clear(); tone(ptr.x); }
    }
    for (let k = 0; k < 2; k++) {
      for (let i = 1; i < N - 1; i++) v[i] += (y[i - 1] + y[i + 1] - 2 * y[i]) * .32;
      for (let i = 1; i < N - 1; i++) { v[i] *= .992; y[i] += v[i] * .5; }
    }
    // 点：線の上に乗っていて、はじかれると跳ぶ
    const di = Math.round(dotX * (N - 1));
    if (dot.vy !== 0 || dot.off < 0) {
      dot.vy += .45; dot.off += dot.vy;
      if (dot.off >= 0) { dot.off = 0; dot.vy = Math.abs(dot.vy) > 2 ? -dot.vy * .35 : 0; }
    }
    dot.y = y[di] + dot.off;
    // 描く
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const px = (i / (N - 1)) * W, py = H / 2 + y[i];
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.strokeStyle = '#16181D'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.arc(dotX * W, H / 2 + dot.y - 7, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#A88B5C'; ctx.fill();
    requestAnimationFrame(step);
  };
  step();
  // 最初の一度だけ、ひとりでに揺れる
  if (!reduce) setTimeout(() => { pluck(.3, 10); plucks = 0; }, 1300);

  // ---------- プロジェクトのレール ----------
  const rail = document.getElementById('rail');
  const track = document.getElementById('railTrack');
  track.innerHTML = PROJECTS.map((p, i) => `
    <button class="pj-card" data-i="${i}" aria-label="${p.name}を開く">
      ${projectMedia(p)}
      <span class="pj-meta"><span class="num">${p.no}</span><span class="en">${p.en}</span></span>
      <span class="pj-name">${p.name}</span>
      <span class="pj-sub small">${p.sub}</span>
    </button>`).join('');
  fixImages(track);
  let x = 0, vx = 0, drag = null, moved = 0;
  const maxX = () => Math.min(0, rail.clientWidth - track.scrollWidth - 40);
  const nowEl = document.getElementById('pjNow'), bar = document.getElementById('pjBar');
  const apply = () => {
    track.style.transform = `translateX(${x}px)`;
    const m = maxX(), p = m ? x / m : 0;
    bar.style.transform = `scaleX(${.25 + p * .75})`;
    nowEl.textContent = '0' + Math.min(4, Math.round(p * 3) + 1);
    // 近いカードほど大きく
    track.querySelectorAll('.pj-card').forEach(c => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - innerWidth / 2) / innerWidth;
      c.style.setProperty('--k', Math.max(0, 1 - d * 1.4).toFixed(3));
    });
  };
  const glide = () => {
    if (drag) return;
    x += vx; vx *= .92;
    const m = maxX();
    if (x > 0) { x += (0 - x) * .2; vx *= .5; }
    if (x < m) { x += (m - x) * .2; vx *= .5; }
    apply();
    if (Math.abs(vx) > .1 || x > .5 || x < m - .5) requestAnimationFrame(glide);
  };
  rail.addEventListener('pointerdown', e => {
    drag = { sx: e.clientX, x0: x, lx: e.clientX, t: performance.now() }; moved = 0; vx = 0;
    try { rail.setPointerCapture(e.pointerId); } catch (_) {} rail.classList.add('dragging');
  });
  rail.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.sx; moved = Math.max(moved, Math.abs(dx));
    let nx = drag.x0 + dx; const m = maxX();
    if (nx > 0) nx *= .35; if (nx < m) nx = m + (nx - m) * .35;
    vx = e.clientX - drag.lx; drag.lx = e.clientX;
    x = nx; apply();
  });
  const up = e => {
    if (!drag) return;
    drag = null; rail.classList.remove('dragging');
    if (moved < 6) {
      const card = document.elementFromPoint(e.clientX, e.clientY)?.closest('.pj-card');
      if (card) openProject(+card.dataset.i, card);
    } else glide();
  };
  rail.addEventListener('pointerup', up);
  rail.addEventListener('pointercancel', () => { drag = null; rail.classList.remove('dragging'); glide(); });
  track.addEventListener('click', e => {           // キーボード（Enter）用
    if (e.detail !== 0) return;
    const card = e.target.closest('.pj-card'); if (card) openProject(+card.dataset.i, card);
  });
  track.addEventListener('focusin', e => {
    const c = e.target.closest('.pj-card'); if (!c) return;
    x = Math.max(maxX(), Math.min(0, -c.offsetLeft + 20)); apply();
  });
  addEventListener('resize', apply);
  addEventListener('scroll', apply, { passive: true });
  apply();

  // ---------- めぐる輪（スクロールで回る） ----------
  const sec = document.getElementById('cycle');
  const rot = document.getElementById('ringRot');
  const nodes = [...rot.querySelectorAll('.node')];
  const arc = document.getElementById('ringArc');
  const no = document.getElementById('ringNo');
  const steps = [...document.querySelectorAll('.cstep')];
  let act = -1;
  const cyc = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - innerHeight;
    const p = Math.max(0, Math.min(1, -r.top / total));
    const R = rot.clientWidth / 2;
    nodes.forEach((n, i) => {
      const a = (i * 90 - p * 270 - 90) * Math.PI / 180;
      n.style.transform = `translate(${R + Math.cos(a) * R}px,${R + Math.sin(a) * R}px) translate(-50%,-50%)`;
    });
    arc.style.strokeDashoffset = 1068 * (1 - p);
    const i = Math.min(3, Math.round(p * 3));
    if (i !== act) {
      act = i;
      nodes.forEach((n, j) => n.classList.toggle('on', j === i));
      steps.forEach((s, j) => s.classList.toggle('on', j === i));
      no.textContent = '0' + (i + 1);
      no.classList.remove('flip'); void no.offsetWidth; no.classList.add('flip');
    }
  };
  addEventListener('scroll', cyc, { passive: true }); addEventListener('resize', cyc); cyc();
  steps.forEach((s, i) => s.addEventListener('click', () => {
    const top = sec.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (sec.offsetHeight - innerHeight) * (i / 3) + 2, behavior: reduce ? 'auto' : 'smooth' });
  }));

  // ---------- 応援の4段階：点が階段をのぼる ----------
  const stairs = document.getElementById('stairs');
  const sdot = document.getElementById('stairDot');
  const sbtns = [...stairs.querySelectorAll('.stair')];
  const detail = document.getElementById('stairDetail');
  let stage = 0;
  const placeDot = (hop) => {
    const b = sbtns[stage], r = b.getBoundingClientRect(), s = stairs.getBoundingClientRect();
    // スマホでは行の右はし、PCでは段の上に乗る
    const narrow = innerWidth <= 600;
    sdot.style.transform = narrow
      ? `translate(${r.right - s.left - 24}px,${r.top - s.top + r.height / 2 + 12}px)`
      : `translate(${r.left - s.left + r.width / 2}px,${r.top - s.top}px)`;
    if (hop) { sdot.classList.remove('hop'); void sdot.offsetWidth; sdot.classList.add('hop'); }
  };
  const setStage = i => {
    stage = i;
    const st = STAGES[i];
    sbtns.forEach((b, j) => { b.classList.toggle('on', j <= i); b.classList.toggle('now', j === i); b.setAttribute('aria-pressed', j === i); });
    placeDot(true);
    detail.classList.remove('swap'); void detail.offsetWidth; detail.classList.add('swap');
    document.getElementById('sdLead').textContent = st.lead;
    document.getElementById('sdBody').textContent = st.body;
    document.getElementById('sdBtnT').textContent = st.btn[1];
    const a = document.getElementById('sdBtn');
    a.href = st.btn[0];
    if (/^https?:/.test(st.btn[0])) { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    if (navigator.vibrate) navigator.vibrate(8);
  };
  sbtns.forEach((b, i) => b.addEventListener('click', () => setStage(i)));
  setStage(0);
  addEventListener('resize', () => placeDot(false));

  // ---------- お知らせ：写真がカーソルについてくる ----------
  const peek = document.getElementById('newsPeek');
  if (fine && !reduce) {
    let px = 0, py = 0, tx = 0, ty = 0, on = false;
    document.querySelectorAll('.news-row[data-img]').forEach(row => {
      row.addEventListener('pointerenter', () => { peek.style.backgroundImage = `url("${row.dataset.img}")`; peek.classList.add('show'); on = true; });
      row.addEventListener('pointerleave', () => { peek.classList.remove('show'); on = false; });
    });
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
    const f = () => { px += (tx - px) * .12; py += (ty - py) * .12; if (on) peek.style.transform = `translate(${px + 30}px,${py - 90}px) rotate(${(tx - px) * .05}deg)`; requestAnimationFrame(f); };
    f();
  }
})();
