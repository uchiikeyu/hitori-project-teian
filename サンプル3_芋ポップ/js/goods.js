/* グッズ：キャップの色替え・傾き、干し芋をかじる */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.getElementById('capStage');
  const cap = document.getElementById('capSvg');
  const nameEl = document.getElementById('colorName');
  const sws = [...document.querySelectorAll('.sw')];
  const hop = () => { stage.classList.remove('hop'); void stage.offsetWidth; stage.classList.add('hop'); };

  sws.forEach(sw => sw.addEventListener('click', () => {
    sws.forEach(s => { s.classList.toggle('on', s === sw); s.setAttribute('aria-pressed', s === sw); });
    nameEl.textContent = sw.textContent.trim();
    hop();
    setTimeout(() => stage.style.setProperty('--cap', sw.style.getPropertyValue('--c')), reduce ? 0 : 200);
    if (navigator.vibrate) navigator.vibrate(10);
  }));
  stage.addEventListener('click', hop);
  if (!reduce) {
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cap.style.transform = `rotateY(${x * 40}deg) rotateX(${-y * 25}deg)`;
    });
    stage.addEventListener('pointerleave', () => { cap.style.transform = ''; });
  }

  // 干し芋：タップするたびに右からひと口
  const hoshi = document.getElementById('hoshi');
  const marks = document.getElementById('biteMarks');
  const msg = document.getElementById('hoshiMsg');
  const MSGS = ['もぐもぐ', 'ねっとり甘い', 'まだまだある', 'あと少し…', 'ごちそうさまでした！'];
  const ns = 'http://www.w3.org/2000/svg';
  let bites = 0;
  const add = (tag, attrs) => {
    const el = document.createElementNS(ns, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    el.setAttribute('fill', '#000');
    marks.appendChild(el);
  };
  hoshi.addEventListener('click', () => {
    if (bites >= MSGS.length) {
      marks.innerHTML = ''; bites = 0;
      msg.textContent = 'おかわり、どうぞ';
      hoshi.setAttribute('aria-label', '干し芋をひと口かじる');
      return;
    }
    bites++;
    const last = bites === MSGS.length;
    const x = last ? 0 : 214 - bites * 34;
    // かじった所から右はなくなり、ふちは歯形に丸く欠ける
    add('rect', { x, y: 0, width: 230 - x, height: 120 });
    if (!last) for (const cy of [32, 60, 88]) add('circle', { cx: x, cy: cy + (Math.random() * 6 - 3), r: 15 });
    msg.textContent = MSGS[bites - 1];
    hoshi.classList.remove('chomp'); void hoshi.offsetWidth; hoshi.classList.add('chomp');
    if (last) hoshi.setAttribute('aria-label', 'もう一枚出す');
    if (navigator.vibrate) navigator.vibrate(18);
  });
})();
