/* 私たちについて：写真のゆっくりスクロール・大切にしていること・関わる人 */
(() => {
  const photo = document.getElementById('aboutPhoto');
  const par = () => {
    const r = photo.getBoundingClientRect();
    const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
    photo.style.setProperty('--py', (p * -12).toFixed(2) + '%');
    photo.style.setProperty('--clip', Math.max(0, Math.min(12, r.top / innerHeight * 16)).toFixed(2) + '%');
  };
  addEventListener('scroll', par, { passive: true }); par();

  document.querySelectorAll('.value-head').forEach(h => h.addEventListener('click', () => {
    const v = h.parentElement;
    const open = !v.classList.contains('open');
    document.querySelectorAll('.value').forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', false); });
    if (open) { v.classList.add('open'); h.setAttribute('aria-expanded', true); }
  }));

  const desc = document.getElementById('peopleDesc');
  const list = document.getElementById('people');
  const pick = b => {
    list.classList.add('picking');
    list.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    desc.classList.remove('swap'); void desc.offsetWidth; desc.classList.add('swap');
    desc.textContent = b.dataset.d;
  };
  list.querySelectorAll('button').forEach(b => {
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pick(b); });
    b.addEventListener('click', () => pick(b));
    b.addEventListener('focus', () => pick(b));
  });
})();
