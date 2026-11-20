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

  // ---------- お問い合わせ：Googleフォームへ送る ----------
  // 送り先と各項目の番号（entry.〇〇）は、サイト情報.txt に書くと仕上げで js/site.js に入る。
  // 送り先が空のあいだは、送信しても内容はどこにも送られない（見本の動き）。
  const GFORM = (window.SITE && SITE.form) || { action: '' };
  const form = document.getElementById('form');
  const err = document.getElementById('formErr');
  const el = n => form.elements.namedItem(n);
  if (!GFORM.action) document.getElementById('formNote').textContent = 'いまは見本のため、送信しても内容は届きません。';
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const v = n => el(n).value.trim();
    const kinds = checks.filter(c => c.checked).map(c => c.value);
    const bad = !v('name') ? ['name', 'お名前を入力してください。']
      : !/^\S+@\S+\.\S+$/.test(v('email')) ? ['email', 'メールアドレスを「name@example.jp」の形で入力してください。']
      : !kinds.length ? [checks[0], 'ご用件をひとつ以上えらんでください。']
      : !v('msg') ? ['msg', 'お問い合わせ内容を入力してください。']
      : !el('agree').checked ? ['agree', '個人情報の取り扱いに同意してください。'] : null;
    if (bad) { err.textContent = bad[1]; (typeof bad[0] === 'string' ? el(bad[0]) : bad[0]).focus(); return; }
    err.textContent = '';
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    if (GFORM.action) {
      const body = new URLSearchParams();
      ['name', 'email', 'tel', 'org', 'msg'].forEach(n => { if (GFORM[n]) body.append(GFORM[n], v(n)); });
      kinds.forEach(k => body.append(GFORM.kinds, k));
      try {
        // Googleフォームは返事を読めない形（no-cors）で送る。届いたかどうかはフォームの回答で確かめる
        await fetch(GFORM.action, { method: 'POST', mode: 'no-cors', body });
      } catch {
        err.textContent = '送信できませんでした。通信の状態を確かめて、もう一度お試しください。';
        btn.disabled = false;
        return;
      }
    } else {
      document.getElementById('sentNote').textContent = '（見本のため、実際には送られていません）';
    }
    form.classList.add('leaving');
    setTimeout(() => { form.hidden = true; const s = document.getElementById('sent'); s.hidden = false; s.focus(); }, 500);
  });
})();
