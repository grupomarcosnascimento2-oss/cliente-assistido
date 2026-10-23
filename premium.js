/* Cliente Assistido – Atendimento das respostas e relatório (versão 1.17.0).
   1. Respostas prontas: ao marcar "Respondeu", abre uma folha com respostas que abrem o WhatsApp com o texto pronto
      (o envio continua manual). As respostas ficam em S.respostas e são editadas na aba Campanha.
   2. Interesse de compra: quem atende (operador CA ou funcionário) avisa o dono, que recebe uma notificação no
      celular e vê o cliente no cartão "Clientes interessados" da tela Hoje. Fica em c.venda = {st, em, por, nota}.
   3. Relatório da semana em Mais: números dos últimos 7 dias, com texto para copiar e mandar ao dono. */
'use strict';
(function () {
  const ACC = () => window.CA_ACCESS || {};
  const PAPEL = () => ACC().papel || '';
  const dono = () => ['lojista', 'admin'].includes(PAPEL());
  const quem = e => String(e || '').split('@')[0];
  const RESP_PADRAO = [
    { t: 'Agradecer', txt: 'Que bom falar com você, {nome}! 😊 Qualquer coisa, é só chamar aqui.' },
    { t: 'Horário', txt: 'Nosso horário é de segunda a sexta, das 8h às 18h, e sábado das 8h às 12h. Te esperamos, {nome}!' },
    { t: 'Endereço', txt: 'Estamos na [endereço da loja]. É só chegar, {nome}!' },
    { t: 'Agendar', txt: 'Posso agendar para você, {nome}? Me diz o melhor dia e horário.' },
    { t: 'Passar para o responsável', txt: 'Vou passar o seu pedido para o responsável da {loja}, {nome}. Ele já te chama aqui.' },
    { t: 'Sem interesse agora', txt: 'Tudo bem, {nome}! Obrigado pelo retorno. Quando precisar, estamos aqui.' }
  ];
  const respostas = () => (Array.isArray(S.respostas) && S.respostas.length ? S.respostas : RESP_PADRAO);
  const preencher = (t, c) => phRamo(t, c).replace(/\{nome\}/gi, firstName(c.name)).replace(/\s+([,!?.])/g, '$1').replace(/,\s*!/g, '!');

  /* ---------- Aviso para o dono (notificação no celular) ---------- */
  window.CA_avisarDono = async function (tipo, extra) {
    const sb = window.CA_SB, loja = ACC().loja;
    if (!sb || !loja || !loja.id || dono()) return;
    try { await sb.functions.invoke('daily-reminder', { body: Object.assign({ mode: 'aviso', tipo, store_id: loja.id }, extra || {}) }); } catch (e) { /* o aviso na tela Hoje continua valendo */ }
  };

  /* ---------- Folha "Fulano respondeu": respostas prontas e interesse de compra ---------- */
  let atual = null;
  function abrirFolha(id) {
    const c = S.contacts.find(x => x.id === id); if (!c) return;
    atual = id;
    $('#rsTitulo').textContent = `${c.name || fmt(c.num)} respondeu`;
    $('#rsLista').innerHTML = respostas().map((r, i) => {
      const txt = preencher(r.txt, c);
      return `<a class="rsItem" href="${esc(openLink(c.num, txt))}" data-rs="${i}"><b>${esc(r.t || 'Resposta ' + (i + 1))}</b><span>${esc(txt)}</span></a>`;
    }).join('');
    const v = c.venda;
    $('#rsVenda').innerHTML = v && v.st === 'aberto'
      ? `<p class="msg small">💰 Interesse de compra já avisado ao dono${v.nota ? ': ' + esc(v.nota) : ''}.</p>`
      : `<button class="big venda" data-rs-venda="1">💰 ${dono() ? 'Registrar interesse de compra' : 'Quer comprar: avisar o dono'}</button>`;
    $('#respSheet').classList.remove('hide');
  }
  window.CA_aposResposta = abrirFolha;
  document.addEventListener('click', e => {
    if (e.target.closest('#rsFechar')) { $('#respSheet').classList.add('hide'); return; }
    const it = e.target.closest('[data-rs]');
    if (it) {
      const c = S.contacts.find(x => x.id === atual);
      if (c && window.CA_log) window.CA_log('resposta_pronta', { nome: c.name || '', num: c.num, resposta: (respostas()[+it.dataset.rs] || {}).t || '' });
      setTimeout(() => $('#respSheet').classList.add('hide'), 300);
      return;
    }
    if (e.target.closest('[data-rs-venda]')) {
      const c = S.contacts.find(x => x.id === atual); if (!c) return;
      const nota = prompt('O que o cliente quer? (ex.: "orçamento de pneus", "trocar o óleo sábado")', '');
      if (nota === null) return;
      c.venda = { st: dono() ? 'atendido' : 'aberto', em: new Date().toISOString(), por: ACC().email || '', nota: nota.trim().slice(0, 140) };
      if (dono()) c.venda.atendidoEm = c.venda.em;
      if (c.status !== 'respondeu') { c.status = 'respondeu'; c.lastReply = today(); }
      c.reviewed = true;
      save();
      if (window.CA_log) window.CA_log('aviso_venda', { nome: c.name || '', num: c.num, nota: c.venda.nota });
      if (!dono()) window.CA_avisarDono('venda');
      $('#respSheet').classList.add('hide');
      renderAll();
      if (!dono()) setTimeout(() => alert('Pronto: o dono foi avisado no celular e vê este cliente na tela Hoje.'), 50);
    }
  });

  /* ---------- Cartão "Clientes interessados" (dono) ---------- */
  function renderVendas() {
    const card = $('#vendaCard'); if (!card) return;
    const lista = dono() ? S.contacts.filter(c => c.venda && c.venda.st === 'aberto').sort((a, b) => b.venda.em.localeCompare(a.venda.em)) : [];
    card.classList.toggle('hide', !lista.length);
    if (!lista.length) { card.innerHTML = ''; return; }
    card.innerHTML = `<h3>💰 Clientes interessados</h3><p class="mut small">Responderam querendo comprar. Chame logo: quem demora perde a venda.</p>` +
      lista.map(c => {
        const d = new Date(c.venda.em);
        return `<div class="it"><div class="t"><b>${esc(c.name || fmt(c.num))}</b><small>${fmt(c.num)} · avisado por ${esc(quem(c.venda.por))} em ${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small>${c.venda.nota ? `<p class="small" style="margin:4px 0">“${esc(c.venda.nota)}”</p>` : ''}
          <div class="marks"><a class="go" href="${esc(openLink(c.num, ''))}">Chamar no WhatsApp</a><button data-venda-ok="${c.id}">Já atendi</button></div></div></div>`;
      }).join('');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-venda-ok]'); if (!b) return;
    const c = S.contacts.find(x => x.id === b.dataset.vendaOk); if (!c || !c.venda) return;
    c.venda.st = 'atendido'; c.venda.atendidoEm = new Date().toISOString();
    save(); if (window.CA_log) window.CA_log('venda_atendida', { nome: c.name || '', num: c.num });
    renderAll();
  });

  /* ---------- Respostas prontas: edição na aba Campanha ---------- */
  function renderRespEdit() {
    const box = $('#respEdit'); if (!box) return;
    if (box.contains(document.activeElement)) return; // não atrapalha quem está digitando
    box.innerHTML = respostas().map((r, i) => `<div class="respIt">
      <div class="row" style="gap:8px"><input data-rt="${i}" value="${esc(r.t)}" placeholder="Nome da resposta"><button class="x" data-rdel="${i}" title="Remover">✕</button></div>
      <textarea class="auto" rows="2" data-rx="${i}">${esc(r.txt)}</textarea></div>`).join('');
    if (typeof ajustarTextos === 'function') requestAnimationFrame(ajustarTextos);
  }
  function guardarResp() {
    S.respostas = [...document.querySelectorAll('#respEdit .respIt')].map(el => ({ t: el.querySelector('[data-rt]').value.trim(), txt: el.querySelector('[data-rx]').value.trim() })).filter(r => r.txt);
    save();
  }
  document.addEventListener('change', e => { if (e.target.closest('#respEdit')) guardarResp(); });
  document.addEventListener('click', e => {
    const d = e.target.closest('[data-rdel]');
    if (d) { const l = respostas().slice(); l.splice(+d.dataset.rdel, 1); S.respostas = l.length ? l : RESP_PADRAO.slice(); save(); renderRespEdit(); return; }
    if (e.target.closest('#respAdd')) { S.respostas = respostas().concat([{ t: '', txt: '' }]); renderRespEdit(); const xs = document.querySelectorAll('#respEdit [data-rt]'); if (xs.length) xs[xs.length - 1].focus(); return; }
    if (e.target.closest('#respPadrao')) { if (!confirm('Voltar para as respostas prontas padrão? As suas mudanças serão perdidas.')) return; S.respostas = RESP_PADRAO.slice(); save(); renderRespEdit(); }
  });

  /* ---------- Relatório da semana ---------- */
  const dataMenos = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
  const fmtCurta = iso => iso.split('-').reverse().slice(0, 2).join('/');
  let semana = 0; // 0 = últimos 7 dias; 1 = os 7 dias anteriores
  function calcular(sem) {
    const fim = dataMenos(sem * 7), ini = dataMenos(sem * 7 + 6);
    const dentro = d => !!d && d !== 'pulou' && d.slice(0, 10) >= ini && d.slice(0, 10) <= fim;
    const r = { ini, fim, envios: 0, resp: 0, vendas: 0, atendidas: 0, parabens: 0, pos: 0, venc: 0, novos: 0, sairam: 0, porCamp: {} };
    const nomes = Object.fromEntries(S.campaigns.map(c => [c.id, c.name || 'Campanha sem nome']));
    const dias = []; for (let i = 0; i < 7; i++) dias.push(dataMenos(sem * 7 + i));
    S.contacts.forEach(c => {
      Object.entries(c.opened || {}).forEach(([cid, d]) => {
        if (!dentro(d)) return;
        r.envios++;
        const k = nomes[cid] || 'Campanha antiga';
        r.porCamp[k] = r.porCamp[k] || { e: 0, r: 0 }; r.porCamp[k].e++;
        if (c.lastReply && c.lastReply >= d) r.porCamp[k].r++;
      });
      if (dentro(c.lastReply)) r.resp++;
      if (c.venda && dentro(c.venda.em)) { r.vendas++; if (c.venda.st === 'atendido') r.atendidas++; }
      if (c.bday && c.bdaySent && dias.some(d => d.slice(5) === mmdd(c.bday) && c.bdaySent === d.slice(0, 4))) r.parabens++;
      if (dentro(c.pv1)) r.pos++; if (dentro(c.pv7)) r.pos++;
      Object.values(c.vencAv || {}).forEach(d => { if (dentro(d)) r.venc++; });
      if (dentro(c.added)) r.novos++;
      if (c.status === 'saiu' && dentro(c.saiuEm)) r.sairam++;
    });
    r.taxa = r.envios ? Math.min(100, Math.round(r.resp * 100 / r.envios)) : 0;
    return r;
  }
  function texto(r) {
    const loja = (ACC().loja || {}).nome || '';
    const l = [`📊 Relatório da semana${loja ? ' – ' + loja : ''} (${fmtCurta(r.ini)} a ${fmtCurta(r.fim)})`, '',
      `• ${r.envios} mensagem(ns) de campanha enviada(s)`,
      `• ${r.resp} cliente(s) responderam${r.envios ? ` (${r.taxa}% de resposta)` : ''}`,
      `• ${r.vendas} interesse(s) de compra${r.vendas ? ` (${r.atendidas} já atendido(s))` : ''}`];
    const extra = [r.parabens ? `${r.parabens} parabéns` : '', r.pos ? `${r.pos} pós-venda` : '', r.venc ? `${r.venc} aviso(s) de vencimento` : ''].filter(Boolean);
    if (extra.length) l.push('• ' + extra.join(', '));
    if (r.novos) l.push(`• ${r.novos} contato(s) novo(s) na lista`);
    if (r.sairam) l.push(`• ${r.sairam} pediu(ram) para sair (respeitado)`);
    const camps = Object.entries(r.porCamp);
    if (camps.length) { l.push('', 'Por campanha:'); camps.forEach(([n, x]) => l.push(`• ${n}: ${x.e} enviada(s), ${x.r} resposta(s)`)); }
    l.push('', 'Cliente Assistido · Quem é lembrado, vende mais.');
    return l.join('\n');
  }
  function renderRelatorio() {
    const card = $('#relCard'); if (!card) return;
    const pode = ['lojista', 'admin', 'operador'].includes(PAPEL());
    card.classList.toggle('hide', !pode); if (!pode) return;
    const r = calcular(semana);
    $('#relPeriodo').textContent = `${semana ? 'Semana anterior' : 'Últimos 7 dias'}: ${fmtCurta(r.ini)} a ${fmtCurta(r.fim)}`;
    $('#relNums').innerHTML = [[r.envios, 'enviadas'], [r.resp, 'responderam'], [r.taxa + '%', 'de resposta'], [r.vendas, 'interesses de compra'], [r.parabens + r.pos + r.venc, 'parabéns, pós-venda e vencimentos'], [r.novos, 'contatos novos']]
      .map(([n, t]) => `<div><b>${n}</b><small>${t}</small></div>`).join('');
    $('#relCamp').innerHTML = Object.entries(r.porCamp).map(([n, x]) => `<div class="it"><div class="t"><b>${esc(n)}</b><small>${x.e} enviada(s) · ${x.r} resposta(s) · ${x.e ? Math.round(x.r * 100 / x.e) : 0}%</small></div></div>`).join('') || '<p class="mut small">Nenhuma mensagem de campanha neste período.</p>';
    $('#relSem').textContent = semana ? 'Ver últimos 7 dias' : 'Ver semana anterior';
  }
  document.addEventListener('click', async e => {
    if (e.target.closest('#relSem')) { semana = semana ? 0 : 1; renderRelatorio(); return; }
    if (e.target.closest('#relCopiar')) {
      const t = texto(calcular(semana));
      try { await navigator.clipboard.writeText(t); }
      catch (x) { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (y) {} ta.remove(); }
      const m = $('#relMsg'); m.textContent = 'Relatório copiado. Cole na conversa com o dono da loja no WhatsApp.'; m.classList.remove('hide'); setTimeout(() => m.classList.add('hide'), 6000);
      if (window.CA_log) window.CA_log('relatorio_copiado', {});
    }
  });
  window.CA_relatorioTexto = sem => texto(calcular(sem || 0));

  window.CA_renderPremium = function () {
    try { renderVendas(); renderRespEdit(); renderRelatorio(); } catch (e) { /* nunca trava a tela */ }
  };
  window.CA_renderPremium();
})();
