/* Cliente Assistido – Controle de prospecções (1.32.0). Só para o admin, primeiro bloco da aba Admin.
   Tabela prospects no Supabase (RLS: só admin). Fases: 1 agendar apresentação, 2 realizar apresentação, 3 implantação.
   Observações vão se acumulando em notas [{em, texto, por}], a mais nova primeiro na tela. Relatórios ficam para depois. */
'use strict';
(function () {
  const FASES = { 1: 'Agendar apresentação', 2: 'Realizar apresentação', 3: 'Implantação' };
  const $ = s => document.querySelector(s);
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SB = () => window.CA_SB;
  const admin = () => (window.CA_ACCESS || {}).papel === 'admin';
  const hoje = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const fmtData = iso => iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
  const fmtHora = iso => { try { const d = new Date(iso); return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  const digitos = t => String(t || '').replace(/\D/g, '');
  const zapLink = t => { let d = digitos(t); if (!d) return ''; if (d.length <= 11) d = '55' + d; return 'https://wa.me/' + d; };
  const fmtZap = t => { const d = digitos(t).replace(/^55(?=\d{10,11}$)/, ''); return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : t || ''; };
  let LISTA = [], filtro = 0, abertos = new Set(), carregado = false;

  async function carregar() {
    const sb = SB(); if (!sb || !admin()) return;
    const { data, error } = await sb.from('prospects').select('*');
    if (error) { const b = $('#prospLista'); if (b) b.innerHTML = '<p class="msg">Não foi possível carregar agora: ' + esc(error.message) + '</p>'; return; }
    LISTA = data || []; carregado = true; render();
  }
  function ordenar(l) { // agenda mais próxima primeiro (sem data por último); empate: alterado mais recentemente
    return l.slice().sort((a, b) => (a.agenda || '9999').localeCompare(b.agenda || '9999') || String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
  }
  function tagAgenda(p) {
    if (!p.agenda) return '';
    const h = hoje();
    if (p.agenda < h) return `<span class="tag red">atrasada · ${fmtData(p.agenda)}</span>`;
    if (p.agenda === h) return `<span class="tag warn">hoje</span>`;
    return `<span class="tag">📅 ${fmtData(p.agenda)}</span>`;
  }
  function render() {
    const sub = $('#prospSub'), n = f => LISTA.filter(p => p.fase === f).length;
    if (sub) sub.textContent = carregado
      ? `${LISTA.length} prospecção(ões) · ${n(1)} para agendar · ${n(2)} para apresentar · ${n(3)} em implantação`
      : 'Visitas, contatos, fase e observações de cada possível cliente';
    const filt = $('#prospFiltro');
    if (filt) filt.innerHTML = [0, 1, 2, 3].map(f => `<button data-pr-filtro="${f}" class="${filtro === f ? 'on' : ''}">${f ? f + ' · ' + FASES[f] : 'Todas'} (${f ? n(f) : LISTA.length})</button>`).join('');
    const box = $('#prospLista'); if (!box) return;
    const l = ordenar(filtro ? LISTA.filter(p => p.fase === filtro) : LISTA);
    box.innerHTML = l.length ? l.map(itemHTML).join('') : `<p class="mut small">${LISTA.length ? 'Nenhuma prospecção nesta fase.' : 'Nenhuma prospecção ainda. Cadastre a primeira acima.'}</p>`;
  }
  function itemHTML(p) {
    const notas = (p.notas || []).slice().reverse(), z = zapLink(p.whatsapp);
    return `<details class="prIt fase${p.fase}" data-pr="${p.id}"${abertos.has(p.id) ? ' open' : ''}>
      <summary><div class="prCab"><b>${esc(p.nome)}</b><span class="prFase f${p.fase}">${p.fase} · ${FASES[p.fase]}</span></div>
        <small>${p.contato ? esc(p.contato) + ' · ' : ''}${p.whatsapp ? esc(fmtZap(p.whatsapp)) + ' · ' : ''}${notas.length} observação(ões) ${tagAgenda(p)}</small></summary>
      <div class="prCorpo">
        ${z ? `<a class="go prZap" href="${esc(z)}" target="_blank" rel="noopener">💬 Abrir conversa no WhatsApp</a>` : ''}
        <div class="row wrap">
          <label class="grow">Fase<select data-pr-fase="${p.id}">${[1, 2, 3].map(f => `<option value="${f}"${p.fase === f ? ' selected' : ''}>${f} · ${FASES[f]}</option>`).join('')}</select></label>
          <label class="grow">Próxima data (agenda)<input type="date" data-pr-agenda="${p.id}" value="${esc(p.agenda || '')}"></label>
        </div>
        <label>Nova observação<textarea class="auto" rows="2" data-pr-obs="${p.id}" placeholder="O que aconteceu nesta visita ou contato? Próximo passo?"></textarea></label>
        <button class="primary" data-pr-addobs="${p.id}">Acrescentar observação</button>
        <h4 class="prH">Histórico de observações</h4>
        ${notas.length ? notas.map(o => `<div class="prNota"><small>${esc(fmtHora(o.em))}</small><p>${esc(o.texto)}</p></div>`).join('') : '<p class="mut small">Nenhuma observação ainda.</p>'}
        <details class="prEdit"><summary>Editar nome, contato e WhatsApp</summary>
          <label>Possível cliente<input data-pr-enome="${p.id}" value="${esc(p.nome)}"></label>
          <label>Contato (pessoa)<input data-pr-econtato="${p.id}" value="${esc(p.contato || '')}"></label>
          <label>WhatsApp<input type="tel" inputmode="tel" data-pr-ezap="${p.id}" value="${esc(p.whatsapp || '')}"></label>
          <button data-pr-salvar="${p.id}">Salvar dados</button>
        </details>
        <small class="mut">Cadastrada em ${esc(fmtHora(p.created_at))}${p.updated_at ? ' · última alteração ' + esc(fmtHora(p.updated_at)) : ''}</small>
      </div></details>`;
  }
  async function atualizar(id, campos, msgOk) {
    const sb = SB(); if (!sb) return alert('Sem conexão agora.');
    const { error } = await sb.from('prospects').update(Object.assign({}, campos, { updated_at: new Date().toISOString() })).eq('id', id);
    if (error) return alert('Não foi possível salvar: ' + error.message);
    const p = LISTA.find(x => x.id === id); if (p) Object.assign(p, campos, { updated_at: new Date().toISOString() });
    abertos.add(id); render();
    if (msgOk) { const el = document.querySelector(`[data-pr="${id}"] .prCorpo`); if (el) { el.insertAdjacentHTML('afterbegin', `<p class="rodOk small prOk">${msgOk}</p>`); setTimeout(() => { const o = el.querySelector('.prOk'); if (o) o.remove(); }, 2500); } }
  }
  async function cadastrar() {
    const nome = ($('#prNome').value || '').trim();
    if (!nome) { alert('Informe o nome do possível cliente.'); $('#prNome').focus(); return; }
    const obs = ($('#prObs').value || '').trim(), quem = (window.CA_ACCESS || {}).email || '';
    const reg = { nome, contato: ($('#prContato').value || '').trim() || null, whatsapp: ($('#prZap').value || '').trim() || null,
      fase: +$('#prFase').value || 1, agenda: $('#prAgenda').value || null, criado_por: quem,
      notas: obs ? [{ em: new Date().toISOString(), texto: obs, por: quem }] : [] };
    const sb = SB(); if (!sb) return alert('Sem conexão agora.');
    const b = $('#prSalvar'); b.disabled = true;
    const { data, error } = await sb.from('prospects').insert(reg).select().single();
    b.disabled = false;
    if (error) return alert('Não foi possível cadastrar: ' + error.message);
    ['#prNome', '#prContato', '#prZap', '#prAgenda', '#prObs'].forEach(s => { $(s).value = ''; }); $('#prFase').value = '1';
    const novo = data || Object.assign({ id: 'tmp' + Date.now(), created_at: new Date().toISOString() }, reg);
    LISTA.push(novo); abertos.add(novo.id); $('#prNovo').open = false; filtro = 0; render();
    const el = document.querySelector(`[data-pr="${novo.id}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.tabs button[data-tab="admin"]')) { carregar(); return; }
    if (e.target.id === 'prSalvar') { cadastrar(); return; }
    const f = e.target.closest('[data-pr-filtro]'); if (f) { filtro = +f.dataset.prFiltro; render(); return; }
    const a = e.target.closest('[data-pr-addobs]');
    if (a) {
      const id = a.dataset.prAddobs, t = document.querySelector(`[data-pr-obs="${id}"]`), texto = (t.value || '').trim();
      if (!texto) { t.focus(); return; }
      const p = LISTA.find(x => x.id === id); if (!p) return;
      atualizar(id, { notas: (p.notas || []).concat([{ em: new Date().toISOString(), texto, por: (window.CA_ACCESS || {}).email || '' }]) }, 'Observação registrada ✓');
      return;
    }
    const s = e.target.closest('[data-pr-salvar]');
    if (s) {
      const id = s.dataset.prSalvar, v = k => (document.querySelector(`[data-pr-${k}="${id}"]`).value || '').trim();
      if (!v('enome')) return alert('O nome do possível cliente não pode ficar vazio.');
      atualizar(id, { nome: v('enome'), contato: v('econtato') || null, whatsapp: v('ezap') || null }, 'Dados salvos ✓');
    }
  });
  document.addEventListener('change', e => {
    const fa = e.target.closest('[data-pr-fase]'); if (fa) { atualizar(fa.dataset.prFase, { fase: +fa.value }, 'Fase atualizada ✓'); return; }
    const ag = e.target.closest('[data-pr-agenda]'); if (ag) atualizar(ag.dataset.prAgenda, { agenda: ag.value || null }, 'Data atualizada ✓');
  });
  document.addEventListener('toggle', e => {
    const d = e.target; if (!d || !d.matches) return;
    if (d.id === 'prospCard' && d.open && !carregado) carregar();
    if (d.matches('details.prIt')) { if (d.open) abertos.add(d.dataset.pr); else abertos.delete(d.dataset.pr); }
  }, true);
  window.CA_carregarProspec = carregar;
  setTimeout(() => { if (admin()) carregar(); }, 1500);
})();
