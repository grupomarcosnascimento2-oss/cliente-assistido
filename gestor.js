/* Cliente Assistido – Painel gerencial (1.53.0, pedido do Marcos, 30/10/2026; primeiro cliente: Supermercado Goiás).
   Perfil 'gestor' (dono/diretoria): ao entrar, vê SÓ este painel (body.modoGestor), sem abas de trabalho, só com Ajuda e Sair.
   Só números, visão de gestor: nada de nomes, telefones ou listas operacionais.
   Unidades (ex.: Matriz e Filial) em stores.recursos.unidades [{id, nome}]; cada executor (lojista/funcionário) tem
   app_users.unidade; contatos novos levam c.unidade de quem cadastrou. Os números vêm do servidor (rpc painel_gestor):
   envios e respostas do activity_log (unidade = unidade de quem fez), base de clientes e contatos novos do store_contacts.
   O admin abre o mesmo painel de qualquer loja em Admin → Lojas → 📊 Painel gerencial. */
'use strict';
(function () {
  const ACC = () => window.CA_ACCESS || {};
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nf = n => Math.round(n).toLocaleString('pt-BR');
  const CORES = ['#22D07F', '#FF8A00', '#3B82F6', '#E879F9', '#FACC15'];
  const GRUPOS = { frequentes: ['Frequentes', '#22D07F'], novos: ['Novos', '#3B82F6'], sumidos: ['Sumidos', '#FF8A00'], outros: ['Outros', '#9FB3C8'] };
  let D = null, VIS = 'todas', PER = '30', LOJA = null, ALVO = null;

  const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const dataDe = s => new Date(s + 'T12:00:00');
  const somaDias = (s, n) => { const d = dataDe(s); d.setDate(d.getDate() + n); return iso(d); };
  const domingo = s => dataDe(s).getDay() === 0;

  function janelas() {
    const hoje = D.hoje;
    if (PER === 'mes') { const ini = hoje.slice(0, 8) + '01'; const n = Math.round((dataDe(hoje) - dataDe(ini)) / 864e5) + 1; return { ini, fim: hoje, n, pIni: somaDias(ini, -n), pFim: somaDias(ini, -1) }; }
    const n = +PER; const ini = somaDias(hoje, -(n - 1)); return { ini, fim: hoje, n, pIni: somaDias(ini, -n), pFim: somaDias(ini, -1) };
  }
  const unidades = () => (D.unidades || []).filter(u => u && u.id);
  const multi = () => unidades().length > 1;
  const daUnidade = u => VIS === 'todas' || u === VIS;
  const metaDia = () => VIS === 'todas' || !multi() ? D.limite : Math.max(1, Math.round(D.limite / unidades().length));

  function somar(ini, fim) {
    const r = { env: 0, out: 0, resp: 0, sem: 0, novos: 0, dia: {} };
    (D.dias || []).forEach(x => { if (x.d < ini || x.d > fim || !daUnidade(x.u)) return; r.env += x.env; r.out += x.out; r.resp += x.resp; r.sem += x.sem; const k = r.dia[x.d] = r.dia[x.d] || { env: 0, resp: 0, sem: 0, porU: {} }; k.env += x.env; k.resp += x.resp; k.sem += x.sem; k.porU[x.u] = (k.porU[x.u] || 0) + x.env; });
    (D.novos || []).forEach(x => { if (x.d >= ini && x.d <= fim && daUnidade(x.u)) r.novos += x.n; });
    return r;
  }
  function serieNovos(dias) { const por = {}; (D.novos || []).forEach(x => { if (daUnidade(x.u)) por[x.d] = (por[x.d] || 0) + x.n; }); let a = 0; return dias.map(x => (a += por[x] || 0)); }
  const base = () => (D.base || []).filter(x => daUnidade(x.u)).reduce((s, x) => s + x.n, 0);
  const taxa = r => (r.resp + r.sem) ? r.resp * 100 / (r.resp + r.sem) : 0;
  function diasUteis(ini, fim) { const l = []; for (let s = ini; s <= fim; s = somaDias(s, 1)) if (!domingo(s)) l.push(s); return l; }
  function constancia(r, ini, fim) { const m = metaDia(), us = diasUteis(ini, fim); let ok = 0; us.forEach(s => { if ((r.dia[s] || {}).env >= m * .8) ok++; }); return { ok, tot: us.length }; }
  function saude(r, ini, fim, baseAtual) {
    const c = constancia(r, ini, fim), tx = taxa(r);
    const pc = c.tot ? c.ok / c.tot : 0, pt = Math.min(tx / 35, 1), pb = Math.min(r.novos / Math.max(1, baseAtual * .03), 1);
    return { nota: Math.round(100 * (.5 * pc + .3 * pt + .2 * pb)), c, tx };
  }
  function metaMes() {
    const hoje = D.hoje, ini = hoje.slice(0, 8) + '01'; const d = dataDe(ini); d.setMonth(d.getMonth() + 1); d.setDate(0); const fimMes = iso(d);
    const total = diasUteis(ini, fimMes).length * metaDia(), passados = diasUteis(ini, hoje).length;
    const r = somar(ini, hoje); const pct = total ? r.env * 100 / total : 0, ideal = total ? passados * metaDia() * 100 / total : 0;
    return { pct, ideal, total, env: r.env };
  }

  /* ---------- desenho ---------- */
  function spark(vals, cor) {
    if (!vals.length) return '';
    const mx = Math.max(1, ...vals), w = 64, h = 26, st = vals.length > 1 ? w / (vals.length - 1) : w;
    return `<svg width="${w}" height="${h}" aria-hidden="true"><polyline points="${vals.map((v, i) => `${(i * st).toFixed(1)},${(h - 3 - v * (h - 6) / mx).toFixed(1)}`).join(' ')}" fill="none" stroke="${cor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function varTxt(a, b, suf, pp) {
    if (pp) { const d = a - b; return `<span class="gvar ${d >= 0 ? 'up' : 'down'}">${d >= 0 ? '▲' : '▼'} ${Math.abs(d).toFixed(0)} p.p.</span>`; }
    if (!b) return a ? '<span class="gvar up">▲ novo</span>' : '<span class="gvar">—</span>';
    const p = (a - b) * 100 / b; return `<span class="gvar ${p >= 0 ? 'up' : 'down'}">${p >= 0 ? '▲' : '▼'} ${Math.abs(p).toFixed(0)}%${suf || ''}</span>`;
  }
  const corU = u => { const i = unidades().findIndex(x => x.id === u); return i >= 0 ? CORES[i % CORES.length] : '#9FB3C8'; };

  function render() {
    const box = document.getElementById('gerencialBox'); if (!box || !D) return;
    const J = janelas(), at = somar(J.ini, J.fim), ant = somar(J.pIni, J.pFim), b = base();
    const s = saude(at, J.ini, J.fim, b), sAnt = saude(ant, J.pIni, J.pFim, Math.max(1, b - at.novos)), mm = metaMes();
    const dias = []; for (let x = J.ini; x <= J.fim; x = somaDias(x, 1)) dias.push(x);
    const diasU = dias.filter(x => !domingo(x)); // tendência sem os domingos (loja fechada), para a linha não ficar serrilhada
    const serie = k => diasU.map(x => (at.dia[x] || {})[k] || 0);
    const enviadas = at.env + at.out, enviadasAnt = ant.env + ant.out;
    const classe = s.nota >= 75 ? ['Boa', '#22D07F', 'ok'] : s.nota >= 50 ? ['Atenção', '#FACC15', 'mid'] : ['Baixa', '#F0565B', 'low'];
    const h = new Date().getHours(), saud = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
    const nome = String(ACC().nome || '').trim().split(/\s+/)[0];
    const us = unidades();
    const frase = `A equipe cumpriu a meta em ${s.c.ok} de ${s.c.tot} dia(s) e a taxa de resposta ${s.tx >= taxa(ant) ? 'subiu ou se manteve' : 'caiu'} em relação ao período anterior.`;

    // gráfico de barras
    const mxDia = Math.max(metaDia(), ...dias.map(x => (at.dia[x] || {}).env || 0)), bw = 300 / dias.length;
    const barras = dias.map((x, i) => {
      const k = at.dia[x] || { porU: {} }; let y = 125; const parts = [];
      const ordem = VIS === 'todas' && multi() ? us.map(u => u.id).concat(['_']) : [VIS === 'todas' ? null : VIS];
      if (ordem[0] === null) { const v = k.env || 0, hh = v * 115 / mxDia; parts.push(`<rect x="${(i * bw + bw * .15).toFixed(1)}" y="${(125 - hh).toFixed(1)}" width="${(bw * .7).toFixed(1)}" height="${hh.toFixed(1)}" rx="2" fill="#22D07F"/>`); }
      else ordem.forEach(u => { const v = (k.porU || {})[u] || 0; if (!v) return; const hh = v * 115 / mxDia; y -= hh; parts.push(`<rect x="${(i * bw + bw * .15).toFixed(1)}" y="${y.toFixed(1)}" width="${(bw * .7).toFixed(1)}" height="${hh.toFixed(1)}" rx="2" fill="${corU(u)}"/>`); });
      return parts.join('');
    }).join('');
    const yMeta = 125 - metaDia() * 115 / mxDia;

    // calendário do mês
    const hoje = D.hoje, mIni = hoje.slice(0, 8) + '01', dm = dataDe(mIni); const ult = new Date(dm.getFullYear(), dm.getMonth() + 1, 0).getDate();
    const rm = somar(mIni, hoje), m = metaDia(); let cal = ''; for (let i = 0; i < dm.getDay(); i++) cal += '<i class="f"></i>';
    for (let d = 1; d <= ult; d++) { const x = mIni.slice(0, 8) + String(d).padStart(2, '0'); const v = (rm.dia[x] || {}).env || 0; const k = x > hoje ? 'f' : domingo(x) && !v ? 'dom' : v >= m * .8 ? 'a' : v > 0 ? 'c' : ''; cal += `<i class="${k}" title="${d}: ${v} envio(s)"></i>`; }
    const mesNome = dm.toLocaleDateString('pt-BR', { month: 'long' });

    // rosca da base
    const gr = {}; (D.base || []).filter(x => daUnidade(x.u)).forEach(x => { const g = GRUPOS[x.g] ? x.g : 'outros'; gr[g] = (gr[g] || 0) + x.n; });
    let acum = 0; const rosca = Object.keys(GRUPOS).filter(g => gr[g]).map(g => { const p = gr[g] * 100 / Math.max(1, b); const seg = `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${GRUPOS[g][1]}" stroke-width="6" stroke-dasharray="${p.toFixed(2)} ${(100 - p).toFixed(2)}" stroke-dashoffset="${(25 - acum).toFixed(2)}"/>`; acum += p; return seg; }).join('');

    // matriz × filial
    let cmp = '';
    if (VIS === 'todas' && multi()) {
      const porU = us.map(u => { const sv = VIS; VIS = u.id; const r = somar(J.ini, J.fim), bb = base(), c = constancia(r, J.ini, J.fim); VIS = sv; return { u, env: r.env + r.out, tx: taxa(r), base: bb, dias: c.ok }; });
      const linha = (rot, k, fmt) => { const tot = porU.reduce((a, x) => a + x[k], 0) || 1; return `<div class="glin"><small><span>${rot}</span><span>${porU.map(x => fmt(x[k])).join(' · ')}</span></small><div class="gbar">${porU.map(x => `<i style="width:${(x[k] * 100 / tot).toFixed(1)}%;background:${corU(x.u.id)}"></i>`).join('')}</div></div>`; };
      cmp = `<div class="gcard"><h3>${us.map(u => esc(u.nome)).join(' × ')}</h3>${linha('Mensagens enviadas', 'env', nf)}${linha('Taxa de resposta', 'tx', v => v.toFixed(0) + '%')}${linha('Clientes na base', 'base', nf)}${linha('Dias com meta cumprida', 'dias', nf)}<div class="gleg">${us.map(u => `<span><i style="background:${corU(u.id)}"></i>${esc(u.nome)}</span>`).join('')}</div></div>`;
    }

    box.innerHTML = `
      <div class="gTopo"><div><h2>📊 Painel gerencial</h2><small>${esc(D.loja || '')}</small></div>${ALVO ? '<button class="gFechar" data-g-fechar="1">✕ Fechar</button>' : ''}</div>
      <h1 class="gOla">${saud}${nome && !ALVO ? ', ' + esc(nome) : ''} 👋</h1>
      <p class="gSub">Resumo do relacionamento com os clientes · atualizado ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
      ${multi() ? `<div class="gPills">${[['todas', 'Consolidado']].concat(us.map(u => [u.id, u.nome])).map(([k, v]) => `<button data-g-vis="${esc(k)}" class="${VIS === k ? 'on' : ''}">${esc(v)}</button>`).join('')}</div>` : ''}
      <div class="gPer">${[['7', '7 dias'], ['30', '30 dias'], ['mes', 'Mês atual']].map(([k, v]) => `<button data-g-per="${k}" class="${PER === k ? 'on' : ''}">${v}</button>`).join('')}</div>
      <div class="gcard"><h3>Saúde do relacionamento</h3><div class="gSaude">
        <svg width="120" height="120" viewBox="0 0 120 120" aria-label="Nota ${s.nota} de 100"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="12"/>
          <circle class="gAnel" cx="60" cy="60" r="50" fill="none" stroke="${classe[1]}" stroke-width="12" stroke-linecap="round" stroke-dasharray="314.2" stroke-dashoffset="${(314.2 * (1 - s.nota / 100)).toFixed(1)}" transform="rotate(-90 60 60)"/>
          <text x="60" y="66" text-anchor="middle" font-size="32" font-weight="800" fill="#fff" data-g-conta="${s.nota}">0</text><text x="60" y="85" text-anchor="middle" font-size="11" fill="#9FB3C8">de 100</text></svg>
        <div><b style="color:${classe[1]}">${classe[0]}</b><p>${frase}</p>${varTxt(s.nota, sAnt.nota, '', true).replace('p.p.', 'pontos')}</div></div>
        <details class="gComo"><summary>Como a nota é calculada</summary><p>50% constância (dias com a meta do dia cumprida, sem contar domingos), 30% taxa de resposta (35% ou mais vale nota cheia) e 20% crescimento da base (3% de clientes novos no período vale nota cheia).</p></details></div>
      <div class="gKpis">
        <div class="gkpi"><small>Mensagens enviadas</small><b data-g-conta="${enviadas}">0</b>${varTxt(enviadas, enviadasAnt)}${spark(serie('env'), '#22D07F')}</div>
        <div class="gkpi"><small>Taxa de resposta</small><b data-g-conta="${s.tx.toFixed(0)}" data-g-suf="%">0%</b>${varTxt(s.tx, taxa(ant), '', true)}${spark(diasU.map(x => { const k = at.dia[x]; return k && (k.resp + k.sem) ? k.resp / (k.resp + k.sem) : 0; }), '#22D07F')}</div>
        <div class="gkpi"><small>Clientes na base</small><b data-g-conta="${b}">0</b><span class="gvar up">▲ ${nf(at.novos)} no período</span>${spark(serieNovos(dias), '#FF8A00')}</div>
        <div class="gkpi"><small>Meta do mês</small><b data-g-conta="${mm.pct.toFixed(0)}" data-g-suf="%">0%</b><span class="gvar ${mm.pct >= mm.ideal ? 'up' : 'down'}">${mm.pct >= mm.ideal ? '▲' : '▼'} ${Math.abs(mm.pct - mm.ideal).toFixed(0)}% ${mm.pct >= mm.ideal ? 'acima' : 'abaixo'} do ritmo</span>
          <svg width="64" height="26" aria-hidden="true"><rect x="0" y="16" width="64" height="8" rx="4" fill="rgba(255,255,255,.1)"/><rect x="0" y="16" width="${Math.min(64, mm.pct * .64).toFixed(1)}" height="8" rx="4" fill="#FACC15"/></svg></div>
      </div>
      <div class="gcard"><h3>Envios de campanha dia a dia</h3><svg width="100%" height="130" viewBox="0 0 300 130" preserveAspectRatio="none">${barras}<line x1="0" y1="${yMeta.toFixed(1)}" x2="300" y2="${yMeta.toFixed(1)}" stroke="#9FB3C8" stroke-dasharray="4 4" stroke-width="1"/></svg>
        <div class="gleg">${VIS === 'todas' && multi() ? us.map(u => `<span><i style="background:${corU(u.id)}"></i>${esc(u.nome)}</span>`).join('') : '<span><i style="background:#22D07F"></i>Envios</span>'}<span><i class="tr"></i>Meta do dia (${metaDia()})</span></div></div>
      ${cmp}
      <div class="gcard"><h3>Constância da equipe · ${esc(mesNome)}</h3><div class="gdias"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div><div class="gcal">${cal}</div>
        <div class="gleg"><span><i style="background:#0A8F52"></i>Meta cumprida</span><span><i style="background:rgba(250,204,21,.8)"></i>Parcial</span><span><i style="background:rgba(255,255,255,.1)"></i>Sem envio</span></div></div>
      <div class="gcard"><h3>Base de clientes</h3><div class="gDuo"><svg width="110" height="110" viewBox="0 0 42 42">${rosca || '<circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="6"/>'}<text x="21" y="22.5" text-anchor="middle" font-size="5.5" font-weight="800" fill="#fff">${nf(b)}</text><text x="21" y="27.5" text-anchor="middle" font-size="3" fill="#9FB3C8">clientes</text></svg>
        <ul>${Object.keys(GRUPOS).filter(g => gr[g]).map(g => `<li><i style="background:${GRUPOS[g][1]}"></i>${GRUPOS[g][0]}<b>${(gr[g] * 100 / Math.max(1, b)).toFixed(0)}%</b></li>`).join('') || '<li class="mut">Sem clientes ainda</li>'}</ul></div></div>
      <p class="gNota">Os números somam o trabalho de todos os aparelhos da loja com o backup ligado.</p>`;
    contar(box);
  }
  function contar(box) {
    const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.querySelectorAll('[data-g-conta]').forEach(el => {
      const alvo = +el.dataset.gConta, suf = el.dataset.gSuf || ''; if (reduz) { el.textContent = nf(alvo) + suf; return; }
      const t0 = performance.now(), dur = 900;
      const passo = t => { const p = Math.min(1, (t - t0) / dur), v = alvo * (1 - Math.pow(1 - p, 3)); el.textContent = nf(v) + suf; if (p < 1) requestAnimationFrame(passo); };
      requestAnimationFrame(passo);
    });
  }

  async function carregar(storeId) {
    const box = document.getElementById('gerencialBox'); if (!box) return;
    if (!D) box.innerHTML = '<p class="gSub" style="padding:30px 4px">Carregando os números…</p>';
    const sb = window.CA_SB; if (!sb || !storeId) { box.innerHTML = '<p class="gSub" style="padding:30px 4px">Sem conexão agora. Tente de novo em instantes.</p>'; return; }
    const { data, error } = await sb.rpc('painel_gestor', { p_store: storeId });
    if (error || !data) { box.innerHTML = '<p class="gSub" style="padding:30px 4px">Não foi possível carregar os números agora. Tente de novo em instantes.</p>'; return; }
    D = data; LOJA = storeId; if (VIS !== 'todas' && !unidades().some(u => u.id === VIS)) VIS = 'todas';
    render();
  }

  // Chamado pelo auth.js (applyRole): o gestor vê só o painel.
  window.CA_gestorIniciar = function () {
    const acc = ACC(), sou = acc.papel === 'gestor';
    document.body.classList.toggle('modoGestor', sou);
    if (sou && acc.loja && acc.loja.id) { ALVO = null; carregar(acc.loja.id); }
  };
  if (window.CA_ACCESS && window.CA_ACCESS.papel) window.CA_gestorIniciar(); // o auth.js pode ter aplicado o papel antes deste arquivo carregar
  // Admin: abrir o painel de qualquer loja (Admin → Lojas).
  window.CA_gestorAbrir = function (storeId) { ALVO = storeId; D = null; VIS = 'todas'; document.body.classList.add('gestorPrevia'); carregar(storeId); window.scrollTo(0, 0); };

  document.addEventListener('click', e => {
    const v = e.target.closest('[data-g-vis]'); if (v) { VIS = v.dataset.gVis; render(); return; }
    const p = e.target.closest('[data-g-per]'); if (p) { PER = p.dataset.gPer; render(); return; }
    if (e.target.closest('[data-g-fechar]')) { ALVO = null; D = null; document.body.classList.remove('gestorPrevia'); const b = document.getElementById('gerencialBox'); if (b) b.innerHTML = ''; return; }
    const a = e.target.closest('[data-verpainel]'); if (a) { window.CA_gestorAbrir(a.dataset.verpainel); }
  });
  // Atualiza ao voltar para o app e a cada 5 minutos com o painel na tela.
  document.addEventListener('visibilitychange', () => { if (!document.hidden && LOJA && (document.body.classList.contains('modoGestor') || ALVO)) carregar(LOJA); });
  setInterval(() => { if (!document.hidden && LOJA && document.body.classList.contains('modoGestor')) carregar(LOJA); }, 300000);
})();
