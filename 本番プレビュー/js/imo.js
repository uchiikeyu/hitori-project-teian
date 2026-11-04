/* 芋のページ：一年の線・干す日数 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- 一年の線：スクロールで金の点が下りる ----------
  const year = document.getElementById('year');
  const rail = year.querySelector('.year-rail');
  const fill = document.getElementById('yearFill');
  const dot = document.getElementById('yearDot');
  const num = document.getElementById('yearNum');
  const name = document.getElementById('yearName');
  const stages = [...year.querySelectorAll('.stage-y')];

  const track = () => {
    const r = rail.getBoundingClientRect();
    const y = Math.min(Math.max(innerHeight * .5 - r.top, 0), r.height);
    fill.style.height = y + 'px';
    dot.style.transform = `translateY(${y - 5}px)`;
  };
  addEventListener('scroll', track, { passive: true });
  addEventListener('resize', track);
  track();

  // 画面のまん中に来た段を「いま」にする
  let cur = -1;
  const setNow = i => {
    if (i === cur) return;
    cur = i;
    stages.forEach((s, j) => { s.classList.toggle('now', j === i); if (j <= i) s.classList.add('seen'); });
    const st = stages[i];
    num.textContent = st.dataset.m;
    name.textContent = st.querySelector('.h-sub').textContent;
    if (!reduce) { num.classList.remove('flip'); void num.offsetWidth; num.classList.add('flip'); }
    // 「寝かせる」の間だけ、暗い部屋に入る
    year.classList.toggle('is-dark', st.classList.contains('y-dark'));
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) setNow(stages.indexOf(e.target));
  }), { rootMargin: '-45% 0px -45% 0px' });
  stages.forEach(s => io.observe(s));
  setNow(0);

  // ---------- 干す：日数で色・大きさ・ひとことが変わる ----------
  const dry = document.getElementById('dry');
  const art = document.getElementById('dryArt');
  // 蒸したての淡い黄 → 飴色
  const mix = (a, b, t) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - t) + parseInt(b.substr(i, 2), 16) * t).toString(16).padStart(2, '0')).join('');
  const day = document.getElementById('dryDay');
  const note = document.getElementById('dryNote');
  const NOTES = [
    [0, '蒸したて。やわらかく、色は淡い。'],
    [4, '表面が乾きはじめ、色が深まる。'],
    [9, '外は締まり、中はしっとり。'],
    [13, '飴色に。噛むほど甘い。'],
  ];
  let last = '';
  const setDry = () => {
    const d = +dry.value, t = d / +dry.max;
    art.style.setProperty('--slice', mix('EFDDA0', 'B8732A', t));
    art.style.setProperty('--edge', mix('D9BE72', '7E4718', t));
    art.style.setProperty('--hi', mix('F8EDC6', 'D9A257', t));
    art.style.setProperty('--s', 1 - t * .14);   // 乾くと、ひとまわり縮む
    dry.style.setProperty('--p', t * 100 + '%');
    day.textContent = d;
    const n = NOTES.filter(([from]) => d >= from).pop()[1];
    if (n !== last) { last = n; note.textContent = n; note.classList.remove('swap'); void note.offsetWidth; note.classList.add('swap'); }
  };
  dry.addEventListener('input', () => { setDry(); if (navigator.vibrate && +dry.value % 7 === 0) navigator.vibrate(6); });
  setDry();
})();
