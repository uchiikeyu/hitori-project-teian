/* 想いとしくみ：はじくカード・ホイルをむく・関わる人 */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- カードをはじく ----------
  const deck = document.getElementById('deck');
  const dots = [...document.querySelectorAll('#cycleDots li')];
  const laps = document.getElementById('cycleLaps');
  let lapCount = 0;
  const topCard = () => { const cs = deck.querySelectorAll('.card'); return cs[cs.length - 1]; };
  const markDot = () => {
    const i = +topCard().dataset.i;
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
  };
  const fling = (card, dir) => {
    card.classList.add('fly');
    card.style.transform = `translate(${dir * 130}%, -10%) rotate(${dir * 28}deg)`;
    card.style.opacity = 0;
    if (navigator.vibrate) navigator.vibrate(10);
    setTimeout(() => {
      // いちばん下に戻して、また積む
      card.classList.remove('fly');
      card.style.transform = ''; card.style.opacity = '';
      deck.prepend(card);
      markDot();
      if (card.dataset.i === '3') {
        lapCount++;
        laps.textContent = `ぐるっと${lapCount}周。また畑へ。`;
        const r = deck.getBoundingClientRect();
        window.popImo(r.left + r.width / 2, r.top + r.height / 3, 8);
      }
    }, reduce ? 0 : 380);
  };

  let d = null;
  deck.addEventListener('pointerdown', e => {
    const c = e.target.closest('.card');
    if (!c || c !== topCard()) return;
    d = { c, x: e.clientX, y: e.clientY, dx: 0 };
    c.setPointerCapture(e.pointerId);
    c.classList.add('drag');
  });
  deck.addEventListener('pointermove', e => {
    if (!d) return;
    d.dx = e.clientX - d.x;
    const dy = (e.clientY - d.y) * .3;
    d.c.style.transform = `translate(${d.dx}px,${dy}px) rotate(${d.dx / 14}deg)`;
  });
  const end = () => {
    if (!d) return;
    const { c, dx } = d; d = null;
    c.classList.remove('drag');
    if (Math.abs(dx) > 80) fling(c, Math.sign(dx));
    else if (Math.abs(dx) < 6) fling(c, 1);       // タップでもめくれる
    else c.style.transform = '';
  };
  deck.addEventListener('pointerup', end);
  deck.addEventListener('pointercancel', end);
  document.getElementById('deckNext').addEventListener('click', () => fling(topCard(), 1));

  // ---------- ホイルをむく ----------
  document.querySelectorAll('.foil-imo').forEach(b => b.addEventListener('click', () => {
    const open = b.classList.toggle('open');
    b.setAttribute('aria-expanded', open);
    if (open) {
      const r = b.getBoundingClientRect();
      window.popImo(r.left + r.width / 2, r.top + r.height / 2, 3);
    }
  }));

  // ---------- 関わる人 ----------
  const say = document.getElementById('peopleSay');
  const ps = [...document.querySelectorAll('#people button')];
  ps.forEach(b => b.addEventListener('click', () => {
    ps.forEach(x => x.classList.toggle('on', x === b));
    say.classList.remove('swap'); void say.offsetWidth; say.classList.add('swap');
    say.textContent = `${b.textContent}：${b.dataset.d}`;
  }));
})();
