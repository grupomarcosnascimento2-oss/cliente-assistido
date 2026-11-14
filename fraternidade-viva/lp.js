/* Fraternidade Viva – landing page de venda (1.82.0). Página pública, sem login.
   Abertura em reels (4 telas com foto; a voz da Mariana só toca depois do toque em Ouvir), depois a página tradicional.
   Amostra: começo da lição 1 com as cenas e os áudios do próprio curso (curso-fraternidade.js). */
(() => {
  const ZAP = '5561999999340';
  const BASE = 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/lp/';
  const REELS_AUD = ['1-18gvb4d.mp3', '2-726wbl.mp3', '3-1i7zxv.mp3', '4-1hagxe0.mp3'].map(f => BASE + f);
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const moeda = v => 'R$ ' + v.toFixed(2).replace('.', ',');
  const total = n => 99 + Math.max(0, n - 5) * 9.9;

  /* ---------- WhatsApp ---------- */
  let membros = 10, mexeu = false;
  function linkZap(origem) {
    // Duas mensagens diferentes: quem quer começar já (compra) e quem ainda quer conversar (dúvidas)
    const msg = origem === 'duvida'
      ? 'Olá, Marcos! Vi a página da Fraternidade Viva e tenho algumas dúvidas antes de começar com a minha pastoral. Pode me ajudar?'
      : origem === 'preco' || mexeu
        ? `Olá, Marcos! Quero começar agora a formação Fraternidade Viva com a minha pastoral. Seriam ${membros} membros (${moeda(total(membros))}). Como faço o pagamento?`
        : 'Olá, Marcos! Quero começar agora a formação Fraternidade Viva com a minha pastoral. Como faço o pagamento?';
    return 'https://wa.me/' + ZAP + '?text=' + encodeURIComponent(msg);
  }
  document.addEventListener('click', e => {
    const z = e.target.closest('[data-zap]');
    if (z) { e.preventDefault(); window.open(linkZap(z.dataset.zap), '_blank', 'noopener'); return; }
    const p = e.target.closest('[data-padre]');
    if (p) {
      e.preventDefault();
      const msg = 'Padre, a paz de Cristo! Queria contar que a nossa pastoral vai iniciar a Fraternidade Viva, uma formação católica curta, pelo celular, sobre vencer a fofoca e crescer juntos no amor fraterno, com o Evangelho e o Catecismo. Cada membro faz as 6 lições no seu ritmo. Se o senhor quiser conhecer: ' + location.origin + '/fraternidade-viva . Conto com a sua bênção!';
      window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      return;
    }
    const ir = e.target.closest('[data-ir]');
    if (ir) { e.preventDefault(); pararReels(); $(ir.dataset.ir).scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); }
  });

  /* ---------- Reels ---------- */
  const slides = $$('.rl'), barras = $$('.barras b');
  const DUR_MUDO = 6500;
  let atual = 0, inicio = 0, dur = DUR_MUDO, pausado = false, comSom = false, acabou = false, raf = 0, aud = null;
  function mostrar(i) {
    atual = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, k) => s.classList.toggle('on', k === atual));
    barras.forEach((b, k) => b.style.width = k < atual ? '100%' : '0%');
    inicio = performance.now(); dur = DUR_MUDO;
    if (comSom) tocar(atual);
  }
  function tocar(i) {
    if (!aud) aud = new Audio();
    aud.onloadedmetadata = () => { if (aud.duration && isFinite(aud.duration)) { dur = aud.duration * 1000 + 1200; inicio = performance.now(); } };
    aud.onended = null;
    aud.src = REELS_AUD[i];
    aud.play().catch(() => {});
  }
  function fimReels() {
    acabou = true; barras.forEach(b => b.style.width = '100%');
    $('#rlCta').style.display = 'inline-flex';
    const o = $('#rlOuvir'); o.classList.remove('pulso', 'tocando');
    o.querySelector('span').textContent = 'Ouvir de novo';
  }
  function loop(t) {
    if (!pausado && !acabou) {
      const p = Math.min(1, (t - inicio) / dur);
      if (barras[atual]) barras[atual].style.width = (p * 100) + '%';
      if (p >= 1) { if (atual < slides.length - 1) mostrar(atual + 1); else fimReels(); }
    } else if (pausado) inicio += 16;
    raf = requestAnimationFrame(loop);
  }
  function pararReels() { if (aud) aud.pause(); comSom = false; const o = $('#rlOuvir'); if (o) o.classList.remove('tocando'); }
  if (slides.length) {
    if (reduz) { mostrar(slides.length - 1); fimReels(); }
    else { mostrar(0); raf = requestAnimationFrame(loop); }
    $('#rlOuvir').addEventListener('click', () => {
      const o = $('#rlOuvir');
      if (comSom && !acabou) { pararReels(); o.querySelector('span').textContent = 'Ouvir a Mariana'; return; }
      const eraFim = acabou; comSom = true; acabou = false; $('#rlCta').style.display = 'none';
      o.classList.remove('pulso'); o.classList.add('tocando'); o.querySelector('span').textContent = 'Pausar a voz';
      mostrar(eraFim ? 0 : atual);
      if (!raf) raf = requestAnimationFrame(loop);
    });
    $$('[data-rl]').forEach(b => b.addEventListener('click', () => {
      if (acabou && +b.dataset.rl > 0) return;
      acabou = false; $('#rlCta').style.display = 'none';
      mostrar(atual + (+b.dataset.rl));
    }));
    const reels = $('#reels');
    const segura = v => { pausado = v; if (aud && comSom) v ? aud.pause() : aud.play().catch(() => {}); };
    reels.addEventListener('pointerdown', e => { if (!e.target.closest('button,a')) segura(true); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => reels.addEventListener(ev, () => pausado && segura(false)));
    new IntersectionObserver(es => es.forEach(x => { if (!x.isIntersecting && comSom) { pararReels(); $('#rlOuvir span').textContent = 'Ouvir a Mariana'; } }), { threshold: .15 }).observe(reels);
  }

  /* ---------- Aparecer ao rolar ---------- */
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('vis'); io.unobserve(x.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.rev').forEach(el => io.observe(el));

  /* ---------- Barra fixa ---------- */
  const fixa = $('#fixa'), hero = $('#inicio'), preco = $('#preco');
  let heroFora = false, precoVis = false;
  const atualizaFixa = () => fixa.classList.toggle('on', heroFora && !precoVis);
  new IntersectionObserver(([x]) => { heroFora = !x.isIntersecting && x.boundingClientRect.top < 0; atualizaFixa(); }).observe(hero);
  new IntersectionObserver(([x]) => { precoVis = x.isIntersecting; atualizaFixa(); }, { threshold: .2 }).observe(preco);

  /* ---------- Calculadora ---------- */
  const faixa = $('#faixa');
  function calc(n) {
    membros = Math.max(5, Math.min(200, n));
    faixa.value = Math.min(membros, +faixa.max);
    $('#qtd').textContent = membros; $('#qtd2').textContent = membros;
    const t = total(membros);
    $('#tot').textContent = moeda(t);
    $('#tot2').textContent = moeda(t / membros) + ' por membro' + (membros > 5 ? ` · 5 por R$ 99 + ${membros - 5} × R$ 9,90` : '');
  }
  faixa.addEventListener('input', () => { mexeu = true; calc(+faixa.value); });
  $$('[data-q]').forEach(b => b.addEventListener('click', () => { mexeu = true; calc(membros + (+b.dataset.q)); }));
  calc(10);

  /* ---------- Amostra da lição 1 ---------- */
  const curso = window.CA_CURSOS && window.CA_CURSOS.fraternidade;
  const palco = $('#palco'), leg = $('#legA'), btn = $('#amOuvir');
  const N = 4;
  if (curso && palco) {
    const falas = curso.ilus.falas(1).slice(0, N), A = curso.audio;
    palco.innerHTML = falas.map((f, i) => f.svg.replace('<svg', `<svg data-a="${i}"${i ? '' : ' class="on"'}`)).join('');
    const svgs = [...palco.querySelectorAll('svg')];
    let tocando = false, el = null;
    const cena = i => svgs.forEach((s, k) => s.classList.toggle('on', k === i));
    const parar = () => { tocando = false; if (el) el.pause(); btn.querySelector('span').textContent = 'Ouvir a amostra'; };
    const passo = i => {
      if (!tocando) return;
      if (i >= falas.length) {
        parar();
        leg.innerHTML = 'Gostou? A lição continua com vídeo, o Catecismo, um exemplo na prática e um gesto para viver hoje. <b>&nbsp;São 6 lições assim.</b>';
        btn.querySelector('span').textContent = 'Ouvir de novo';
        return;
      }
      cena(i); leg.textContent = falas[i].t;
      el.src = A.base + '1-' + i + '-' + A.lic[1].t[i] + '.mp3';
      el.onended = () => passo(i + 1);
      el.onerror = () => setTimeout(() => passo(i + 1), Math.max(2500, falas[i].t.length * 65));
      el.play().catch(() => el.onerror());
    };
    btn.addEventListener('click', () => {
      if (tocando) { parar(); return; }
      pararReels();
      if (!el) el = new Audio();
      tocando = true; btn.querySelector('span').textContent = 'Pausar';
      passo(0);
    });
  } else if (palco) { palco.closest('.sec').style.display = 'none'; }
})();
