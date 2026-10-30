/* 畑と日記：月のつまみ・記事・動画 */
(() => {
  // 一般的なさつまいもの一年（目安）
  const M = {
    1: ['干し芋づくり', '寒さと冬の日ざしで、蒸した芋をじっくり干す。', ['hoshi', 'snow']],
    2: ['干し芋づくり', '冬の間は、干し芋の仕上げと出荷の季節。', ['hoshi', 'snow']],
    3: ['土づくり', '畑を耕して、春の植え付けにそなえる。', ['sun']],
    4: ['苗を育てる', '植え付けに使う苗を育てる。', ['sun', 'sprout']],
    5: ['植え付け', '苗を一本ずつ、畑に植えていく。', ['sun', 'sprout']],
    6: ['植え付け', '根づいた苗が、少しずつ伸びはじめる。', ['sun', 'sprout']],
    7: ['つるが伸びる', '夏の日ざしで、葉とつるが畑いっぱいに広がる。', ['sun', 'vine']],
    8: ['つるが伸びる', '草取りをしながら、土の中で芋が太るのを待つ。', ['sun', 'vine', 'tubers']],
    9: ['収穫', 'つるをたどって、土の中の芋を掘り出す。', ['sun', 'vine', 'tubers']],
    10: ['収穫', 'つるをたどって、土の中の芋を掘り出す。いちばんにぎやかな季節。', ['sun', 'vine', 'tubers']],
    11: ['収穫と貯蔵', '掘った芋を寝かせて、甘みを引き出す。', ['sun', 'tubers']],
    12: ['干し芋づくり', '寝かせた芋を蒸して、干し芋づくりが始まる。', ['hoshi', 'snow']],
  };
  const svg = document.getElementById('growSvg');
  const range = document.getElementById('month');
  const show = (m) => {
    const [t, b, on] = M[m];
    document.getElementById('mNum').textContent = m;
    document.getElementById('mTitle').textContent = t;
    document.getElementById('mBody').textContent = b;
    svg.querySelectorAll('.g').forEach(g => {
      const v = on.some(k => g.classList.contains(k));
      g.style.opacity = v ? 1 : 0;
      g.style.transform = v ? 'none' : (g.classList.contains('tubers') ? 'translateY(30px)' : 'scale(.4)');
      g.style.transformOrigin = '50% 100%';
    });
    // 芋が見えている月は、土を少し透かす
    svg.querySelector('rect[y="230"]').setAttribute('fill', on.includes('tubers') ? '#6E4A30' : '#5B3A24');
  };
  let prev = +range.value;
  range.addEventListener('input', () => {
    const m = +range.value;
    show(m);
    if (m !== prev && navigator.vibrate) navigator.vibrate(6);
    if ([9, 10].includes(m) && m !== prev) {
      const r = svg.getBoundingClientRect();
      window.popImo(r.left + r.width / 2, r.top + r.height * .75, 3);
    }
    prev = m;
  });
  show(prev);

  // 記事を開く
  const btn = document.getElementById('diaryBtn');
  const open = document.getElementById('diaryOpen');
  btn.addEventListener('click', () => {
    const o = open.classList.toggle('show');
    btn.setAttribute('aria-expanded', o);
  });
  if (location.hash === '#n1') btn.click();

  // 動画（準備中）
  const movie = document.getElementById('movie');
  document.getElementById('play').addEventListener('click', () => {
    movie.classList.remove('wobble'); void movie.offsetWidth; movie.classList.add('wobble');
    document.getElementById('movieMsg').textContent = '動画は準備中です。公開したらここで見られます。';
  });
})();
