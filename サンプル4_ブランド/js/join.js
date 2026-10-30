/* 関わる：応援の4段階・フォーム見本 */
(() => {
  // ---------- 応援の4段階 ----------
  const path = document.getElementById('path');
  path.insertAdjacentHTML('beforeend', STAGES.map((st, i) => `
    <li class="stage" data-i="${i}">
      <button class="stage-head" aria-pressed="false">
        <span class="stage-mark" aria-hidden="true"></span>
        <span class="num">0${i + 1}</span>
        <span class="stage-t">${st.name}</span>
        <span class="stage-lead small">${st.lead}</span>
      </button>
      <div class="stage-body"><div>
        <p>${st.body}</p>
        <a class="btn" href="${st.btn[0]}"${/^https?:/.test(st.btn[0]) ? ' target="_blank" rel="noopener"' : ''}><span class="dot"></span>${st.btn[1]}</a>
      </div></div>
    </li>`).join(''));
  const stages = [...path.querySelectorAll('.stage')];
  const fill = document.getElementById('pathFill');
  const sum = document.getElementById('waysSum');
  const checks = [...document.querySelectorAll('#checks input')];
  const pick = i => {
    stages.forEach((s, j) => {
      s.classList.toggle('done', j < i);
      s.classList.toggle('now', j === i);
      s.querySelector('.stage-head').setAttribute('aria-pressed', j === i);
    });
    const r = stages[i].querySelector('.stage-mark').getBoundingClientRect();
    const p = path.getBoundingClientRect();
    fill.style.height = (r.top + r.height / 2 - p.top) + 'px';
    sum.textContent = i < 3
      ? `いまは「${STAGES[i].v}」の段階。次の一歩は「${STAGES[i + 1].v}」です。`
      : 'いちばん上の段です。一緒に、循環を大きく育てましょう。';
    checks.forEach(c => { if (c.value === STAGES[i].v) c.checked = true; });
  };
  stages.forEach((s, i) => s.querySelector('.stage-head').addEventListener('click', () => pick(i)));
  // 開閉のアニメーションが終わってから線の長さを合わせ直す
  path.addEventListener('transitionend', e => {
    if (e.target.classList.contains('stage-body')) { const c = stages.findIndex(s => s.classList.contains('now')); if (c >= 0) pick(c); }
  });
  setTimeout(() => pick(0), 50);   // はじめは「フォロー」の段から
  addEventListener('resize', () => { const c = stages.findIndex(s => s.classList.contains('now')); if (c >= 0) pick(c); });

  // ---------- フォーム（見本：送信しない） ----------
  const form = document.getElementById('form');
  const err = document.getElementById('formErr');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameEl = form.elements.namedItem('name'), emailEl = form.elements.namedItem('email');
    const name = nameEl.value.trim(), email = emailEl.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      err.textContent = !name ? 'お名前を入力してください。' : 'メールアドレスを「name@example.jp」の形で入力してください。';
      (!name ? nameEl : emailEl).focus();
      return;
    }
    err.textContent = '';
    form.classList.add('leaving');
    setTimeout(() => { form.hidden = true; document.getElementById('sent').hidden = false; }, 500);
  });
})();
