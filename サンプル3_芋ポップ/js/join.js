/* 関わる：応援ハンコ・フォーム見本 */
(() => {
  const ways = [...document.querySelectorAll('.way')];
  const sum = document.getElementById('waysSum');
  const checks = [...document.querySelectorAll('#checks input')];
  const update = () => {
    const sel = ways.filter(w => w.classList.contains('on')).map(w => w.dataset.v);
    sum.textContent = sel.length ? `${sel.join('・')}。${sel.length === 4 ? 'ぜんぶ選んでくれて、ありがとう！' : 'お問い合わせのご用件に入れておきました。'}` : '';
    checks.forEach(c => { if (c.value !== 'その他') c.checked = sel.includes(c.value); });
  };
  ways.forEach(w => w.addEventListener('click', () => {
    const on = w.classList.toggle('on');
    w.setAttribute('aria-pressed', on);
    if (on) {
      const r = w.getBoundingClientRect();
      window.popImo(r.right - 40, r.top + 40, 3);
      if (navigator.vibrate) navigator.vibrate(20);
    }
    update();
  }));

  const form = document.getElementById('form');
  const err = document.getElementById('formErr');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl = form.elements.namedItem('name');
    const emailEl = form.elements.namedItem('email');
    const name = nameEl.value.trim(), email = emailEl.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      err.textContent = !name ? 'お名前を入力してください。' : 'メールアドレスを「name@example.jp」の形で入力してください。';
      (!name ? nameEl : emailEl).focus();
      form.classList.remove('nope'); void form.offsetWidth; form.classList.add('nope');
      return;
    }
    err.textContent = '';
    form.hidden = true;
    document.getElementById('sent').hidden = false;
    const r = document.getElementById('sent').getBoundingClientRect();
    window.popImo(r.left + r.width / 2, r.top + 40, 10);
  });
})();
