/* Cliente Assistido – Apresentação para parceiros (/parceria), versão 1.33.0.
   Página pública, sem login. Lista de lições → lição com telas do sistema, voz que lê trecho a trecho
   (troca a tela e a legenda junto com a fala), texto, frase pronta e ganhos. Progresso só neste aparelho. */
'use strict';
(function () {
  const P = window.CA_PARC, L = P.licoes, app = document.getElementById('app');
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const CHAVE = 'ca_parc_vistas';
  const vistas = () => { try { return JSON.parse(localStorage.getItem(CHAVE) || '[]'); } catch (e) { return []; } };
  const marcar = n => { try { const v = vistas(); if (!v.includes(n)) { v.push(n); localStorage.setItem(CHAVE, JSON.stringify(v)); } } catch (e) {} };
  const temVoz = 'speechSynthesis' in window;
  const imgSrc = n => '/parceria/telas/' + n + '.webp';
  let atual = null, telaIdx = 0, tocando = false, audio = null;

  function contatoHTML() {
    const c = P.contato || {}, num = String(c.whatsapp || '').replace(/\D/g, '');
    const msg = encodeURIComponent('Olá! Vi a apresentação do Cliente Assistido para parceiros e quero saber mais.');
    return `<section class="cta"><h2>Quer saber mais?</h2>
      <p>Fale com ${esc(c.nome || 'a equipe do CA')} para conhecer os valores, tirar dúvidas e agendar uma apresentação para a loja que você vai indicar.</p>
      ${num ? `<a class="btn" href="https://wa.me/${num}?text=${msg}" target="_blank" rel="noopener">💬 Falar no WhatsApp</a>` : ''}</section>`;
  }

  function home() {
    pararVoz();
    const v = vistas(), feitas = L.filter(l => v.includes(l.n)).length, prox = L.find(l => !v.includes(l.n)) || L[0];
    app.innerHTML = `<section class="hero">
        <h1>Conheça o Cliente Assistido</h1>
        <p>Em ${L.length} lições curtas, veja o propósito do CA, a rotina da tela Hoje, os aniversariantes, as campanhas e a visão do dono. Cada lição tem texto, áudio e telas do sistema.</p>
        <div class="barra"><i style="width:${Math.round(feitas * 100 / L.length)}%"></i></div>
        <div class="prog">${feitas} de ${L.length} lições vistas</div>
        <p style="margin:14px 0 0"><a class="btn pri" href="#licao-${prox.n}">${feitas ? (feitas >= L.length ? '↺ Ver de novo' : '▶ Continuar: lição ' + prox.n) : '▶ Começar'}</a></p>
      </section>
      <h2 class="sec">Lições</h2>
      <div class="lista">${L.map(l => `<a class="li${v.includes(l.n) ? ' visto' : ''}" href="#licao-${l.n}"><span class="num">${v.includes(l.n) ? '✓' : l.n}</span><span><b>${esc(l.titulo)}</b><small>${esc(l.resumo)}</small></span><span class="seta">›</span></a>`).join('')}</div>
      ${contatoHTML()}
      <p class="nota">As telas mostram uma loja de exemplo, com dados fictícios.</p>`;
    window.scrollTo(0, 0);
  }

  function licao(n) {
    pararVoz();
    const l = L.find(x => x.n === n); if (!l) return home();
    atual = l; telaIdx = 0; marcar(n);
    const ant = L.find(x => x.n === n - 1), prox = L.find(x => x.n === n + 1);
    app.innerHTML = `<article class="licao">
      <div class="cab"><a class="btn" href="#" style="min-height:40px;padding:6px 12px">← Lições</a><span class="passo">Lição ${n} de ${L.length}</span></div>
      <h1>${esc(l.titulo)}</h1><p style="margin:0;color:var(--mut)">${esc(l.resumo)}</p>
      <section class="card">
        <div class="telas"><div class="fone">${l.telas.map((t, i) => `<img src="${imgSrc(t.img)}" alt="${esc(t.leg)}" data-i="${i}" class="${i ? '' : 'on'}"${i ? ' loading="lazy"' : ''}>`).join('')}</div></div>
        <p class="telaLeg" id="telaLeg">${esc(l.telas[0].leg)}</p>
        ${l.telas.length > 1 ? `<div class="navT"><button data-t="-1" aria-label="Tela anterior">‹</button><span class="dots">${l.telas.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</span><button data-t="1" aria-label="Próxima tela">›</button></div>` : ''}
        <div class="leg" id="leg">${l.audio || temVoz ? 'Toque em “Ouvir a lição” para ouvir a explicação, com as telas mudando junto.' : esc(l.falas[0].t)}</div>
        ${l.audio || temVoz ? `<div class="ouvir"><button class="pri" id="ouvir">▶ Ouvir a lição</button><button class="hide" id="parar">⏹ Parar</button></div>` : ''}
      </section>
      <section class="card ler"><h2 style="margin:0;font-size:18px">📖 Leia</h2><dl>${l.ler.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl></section>
      <div class="frase"><small>💬 Para dizer ao lojista</small><p>“${esc(l.frase)}”</p></div>
      <section class="card"><h2 style="margin:0;font-size:18px">📈 Ganhos para a loja</h2><ul class="ganhos">${l.ganhos.map(g => `<li>${esc(g)}</li>`).join('')}</ul></section>
      <div class="rodape">${ant ? `<a class="btn" href="#licao-${ant.n}">‹ Lição ${ant.n}</a>` : '<a class="btn" href="#">‹ Lições</a>'}${prox ? `<a class="btn pri" href="#licao-${prox.n}">Próxima: lição ${prox.n} ›</a>` : '<a class="btn pri" href="#fim">Concluir ✓</a>'}</div>
      ${prox ? '' : contatoHTML()}
    </article>`;
    window.scrollTo(0, 0);
  }

  function irTela(i) {
    if (!atual) return;
    const n = atual.telas.length; telaIdx = (i + n) % n;
    app.querySelectorAll('.fone img').forEach(im => im.classList.toggle('on', +im.dataset.i === telaIdx));
    app.querySelectorAll('.dots i').forEach((d, k) => d.classList.toggle('on', k === telaIdx));
    const tl = document.getElementById('telaLeg'); if (tl) tl.textContent = atual.telas[telaIdx].leg;
  }
  function legenda(t) { const el = document.getElementById('leg'); if (el) el.textContent = t; }
  function botoes(on) {
    tocando = on;
    const o = document.getElementById('ouvir'), p = document.getElementById('parar');
    if (o) { o.classList.toggle('hide', on); o.textContent = '▶ Ouvir de novo'; } if (p) p.classList.toggle('hide', !on);
  }

  function ouvir() {
    const l = atual; if (!l) return;
    pararVoz(); botoes(true);
    if (l.audio) { // áudio gravado: a legenda e a tela seguem o tempo, proporcional ao tamanho de cada trecho
      audio = new Audio(l.audio);
      const tam = l.falas.map(f => f.t.length), tot = tam.reduce((a, b) => a + b, 0); let k = -1;
      audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return; const alvo = audio.currentTime / audio.duration * tot; let s = 0, i = 0;
        while (i < tam.length - 1 && s + tam[i] < alvo) { s += tam[i]; i++; }
        if (i !== k) { k = i; legenda(l.falas[i].t); irTela(l.falas[i].tela); }
      });
      audio.addEventListener('ended', () => botoes(false));
      audio.play().catch(() => botoes(false));
      return;
    }
    const voz = speechSynthesis.getVoices().find(x => /pt[-_]BR/i.test(x.lang));
    l.falas.forEach((f, i) => {
      const u = new SpeechSynthesisUtterance(f.t); u.lang = 'pt-BR'; u.rate = 1.08; if (voz) u.voice = voz;
      u.onstart = () => { if (atual === l) { legenda(f.t); irTela(f.tela); } };
      if (i === l.falas.length - 1) u.onend = () => { if (atual === l) botoes(false); };
      speechSynthesis.speak(u);
    });
  }
  function pararVoz() {
    if (temVoz) speechSynthesis.cancel();
    if (audio) { audio.pause(); audio = null; }
    if (tocando) botoes(false);
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-t]'); if (t) { irTela(telaIdx + +t.dataset.t); return; }
    if (e.target.id === 'ouvir') { ouvir(); return; }
    if (e.target.id === 'parar') { pararVoz(); return; }
    const im = e.target.closest('.fone img'); if (im) { const z = document.getElementById('zoom'); z.querySelector('img').src = im.src; z.querySelector('img').alt = im.alt; z.classList.add('on'); z.scrollTop = 0; return; }
    if (e.target.id === 'zoomFechar' || e.target.id === 'zoom') document.getElementById('zoom').classList.remove('on');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('zoom').classList.remove('on'); });
  function rota() {
    const m = location.hash.match(/^#licao-(\d+)$/);
    if (m) licao(+m[1]);
    else if (location.hash === '#fim') { home(); const c = app.querySelector('.cta'); if (c) c.scrollIntoView({ block: 'center' }); }
    else { atual = null; home(); }
  }
  window.addEventListener('hashchange', rota);
  window.addEventListener('pagehide', pararVoz);
  if (temVoz) speechSynthesis.getVoices(); // carrega a lista de vozes cedo (Android)
  rota();
})();
