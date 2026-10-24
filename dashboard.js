/* Cliente Assistido – Painel de resultados na aba Mais (versão 1.23.0).
   Tudo calculado no aparelho, com o que o app já guarda (sem digitação extra e sem biblioteca de gráfico):
   1. Destaques: últimos 7 dias comparados com os 7 anteriores (usa CA_calcSemana, do relatório da semana).
   2. Envios dos últimos 30 dias: barras por dia (S.sentLog) com a linha do limite diário.
   3. Funil dos últimos 30 dias: receberam mensagem → responderam → interesse de compra.
   Funcionário vê só o gráfico de envios. */
'use strict';
(function () {
  const PAPEL = () => (window.CA_ACCESS || {}).papel || '';
  const completo = () => ['lojista', 'admin', 'operador'].includes(PAPEL());
  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const diasAtras = n => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d); };

  function tile(valor, rotulo, atual, anterior, sufixo) {
    const dif = atual - anterior;
    const seta = !anterior && !atual ? '<em class="eq">sem dados ainda</em>'
      : dif > 0 ? `<em class="up">▲ ${dif}${sufixo || ''} vs sem. anterior</em>`
      : dif < 0 ? `<em class="down">▼ ${-dif}${sufixo || ''} vs sem. anterior</em>`
      : '<em class="eq">igual à sem. anterior</em>';
    return `<div class="dTile"><b>${valor}</b><span>${rotulo}</span>${seta}</div>`;
  }
  function renderTiles() {
    const box = $('#dashTiles'); if (!box) return;
    if (!completo() || !window.CA_calcSemana) { box.innerHTML = ''; box.classList.add('hide'); return; }
    box.classList.remove('hide');
    const a = window.CA_calcSemana(0), b = window.CA_calcSemana(1);
    box.innerHTML = tile(a.envios, 'mensagens enviadas (7 dias)', a.envios, b.envios)
      + tile(a.taxa + '%', 'de resposta', a.taxa, b.taxa, ' pts')
      + tile(a.vendas, 'interesses de compra', a.vendas, b.vendas)
      + tile(a.novos, 'contatos novos', a.novos, b.novos);
  }

  function renderEnvios() {
    const box = $('#dashEnvios'); if (!box) return;
    const dias = []; for (let i = 29; i >= 0; i--) dias.push(diasAtras(i));
    const vals = dias.map(d => (S.sentLog || {})[d] || 0);
    const lim = typeof limiteDia === 'function' ? limiteDia() : 0;
    const max = Math.max(1, lim, ...vals);
    const W = 300, H = 120, top = 10, base = 100, bw = W / 30;
    const y = v => base - (v / max) * (base - top);
    const barras = vals.map((v, i) => {
      const h = Math.max(v ? 2 : 0, base - y(v));
      const [, m, dd] = dias[i].split('-');
      return `<rect class="bar${i === 29 ? ' hoje' : ''}" x="${(i * bw + 1).toFixed(1)}" y="${(base - h).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${h.toFixed(1)}" rx="1.5"><title>${dd}/${m}: ${v} envio(s)</title></rect>`;
    }).join('');
    const rot = [0, 7, 14, 21, 29].map(i => { const [, m, dd] = dias[i].split('-'); const pos = i === 0 ? ['0', 'start'] : i === 29 ? [W, 'end'] : [(i * bw + bw / 2).toFixed(1), 'middle']; return `<text x="${pos[0]}" y="${H - 6}" text-anchor="${pos[1]}">${i === 29 ? 'hoje' : dd + '/' + m}</text>`; }).join('');
    const linha = lim ? `<line class="lim" x1="0" x2="${W}" y1="${y(lim).toFixed(1)}" y2="${y(lim).toFixed(1)}"/><text class="limTx" x="${W - 2}" y="${(y(lim) - 3).toFixed(1)}" text-anchor="end">limite ${lim}/dia</text>` : '';
    const total = vals.reduce((s, v) => s + v, 0), ativos = vals.filter(v => v > 0).length;
    box.innerHTML = `<div class="dChart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Envios por dia nos últimos 30 dias">${barras}${linha}${rot}</svg></div>
      <div class="dLeg"><span><b>${total}</b> envio(s) em 30 dias</span><span>${ativos} dia(s) com envio · média ${ativos ? Math.round(total / ativos) : 0}/dia</span></div>`;
  }

  function renderFunil() {
    const wrap = $('#dashFunilBox'), box = $('#dashFunil'); if (!box) return;
    if (!completo()) { wrap.classList.add('hide'); return; }
    wrap.classList.remove('hide');
    const ini = diasAtras(29);
    let rec = 0, resp = 0, vendas = 0;
    S.contacts.forEach(c => {
      const ds = Object.values(c.opened || {}).filter(d => d && d !== 'pulou' && d.slice(0, 10) >= ini).sort();
      if (ds.length) { rec++; if (c.lastReply && c.lastReply >= ds[0]) resp++; }
      if (c.venda && c.venda.em && c.venda.em.slice(0, 10) >= ini) vendas++;
    });
    const pct = n => rec ? Math.round(n * 100 / rec) : 0;
    const linha = (cl, rotulo, n, sub) => `<div class="dFun ${cl}"><div class="rot"><span>${rotulo}</span><b>${n}${sub}</b></div><div class="trilho"><div class="enc" style="width:${rec ? Math.max(2, n * 100 / rec) : 0}%"></div></div></div>`;
    box.innerHTML = rec ? `<div class="dFunil">${linha('f1', 'Receberam mensagem', rec, '')}${linha('f2', 'Responderam', resp, ` · ${pct(resp)}%`)}${linha('f3', 'Interesse de compra', vendas, ` · ${pct(vendas)}%`)}</div>`
      : '<p class="mut small">Ainda não há envios nos últimos 30 dias. Assim que a loja começar, o funil aparece aqui.</p>';
  }

  window.CA_renderDash = function () {
    try { renderTiles(); renderEnvios(); renderFunil(); } catch (e) { /* o painel nunca pode travar a aba Mais */ }
  };
  window.CA_renderDash();
})();
