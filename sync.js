/* Cliente Assistido – Backup e sincronização dos contatos (opcional no Essencial, incluída no Premium).
   Os contatos continuam neste aparelho; com a sincronização ligada, uma cópia fica no servidor da loja
   (Supabase, protegida por RLS: cada loja só vê a própria lista). Regra de conflito: a alteração local
   ainda não enviada vence; senão vale a versão mais recente do servidor. */
'use strict';
(function () {
  const K = 'ca_sync'; // estado por loja: 'ca_sync:<loja>'
  const $ = s => document.querySelector(s);
  let st = {}, sid = null, on = false, premium = false, busy = false, mudo = false, timer = null, loop = null;

  function ler(id) {
    try {
      const v = JSON.parse(localStorage.getItem(K + ':' + id) || 'null');
      if (v) return v;
      const antigo = JSON.parse(localStorage.getItem(K) || 'null'); // versão 1.5: chave única
      return antigo && antigo.sid === id ? antigo : { sid: id };
    } catch (e) { return { sid: id }; }
  }
  function gravar() { if (sid) try { localStorage.setItem(K + ':' + sid, JSON.stringify(st)); } catch (e) {} }
  function hash(s) { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0).toString(36); }
  const estado = () => ({ campaigns: S.campaigns, activeCampId: S.activeCampId, bdayMsg: S.bdayMsg, pvMsg1: S.pvMsg1, pvMsg7: S.pvMsg7, vencCfg: S.vencCfg || {}, implantacao: S.implantacao || {}, sentLog: S.sentLog, settings: { app: S.settings.app, autoGroups: S.settings.autoGroups, ddd: S.settings.ddd, limit: S.settings.limit, descanso: S.settings.descanso, gFreq: S.settings.gFreq } });
  const sb = () => window.CA_SB;
  const hora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  function status(t) { const el = $('#syncStatus'); if (el) el.textContent = t; }

  // Chamado pelo app.js a cada save(): agenda o envio das mudanças.
  window.CA_onSave = () => { if (on && !mudo) { clearTimeout(timer); timer = setTimeout(enviar, 2500); } };

  async function enviar() {
    if (!on || busy || !sid) return;
    busy = true; status('Sincronizando…');
    try {
      const hs = st.hashes || {}, novos = {}, linhas = [];
      for (const c of S.contacts) { const k = hash(JSON.stringify(c)); novos[c.id] = k; if (hs[c.id] !== k) linhas.push({ store_id: sid, cid: c.id, data: c }); }
      for (let i = 0; i < linhas.length; i += 500) {
        const { error } = await sb().from('store_contacts').upsert(linhas.slice(i, i + 500), { onConflict: 'store_id,cid' });
        if (error) throw error;
      }
      const e = estado(), eh = hash(JSON.stringify(e));
      if (st.stateHash !== eh) {
        const { error } = await sb().from('store_state').upsert({ store_id: sid, data: e }, { onConflict: 'store_id' });
        if (error) throw error;
        st.stateHash = eh;
      }
      st.hashes = Object.assign(hs, novos); st.lastOk = hora(); gravar();
      enviarFila();
      status(`Sincronizado às ${st.lastOk}${linhas.length ? ` · ${linhas.length} contato(s) enviado(s)` : ''}.`);
    } catch (err) {
      status('Sem conexão com o servidor agora. Seus contatos estão salvos neste celular; tento de novo em instantes.');
    } finally { busy = false; }
  }

  async function receber() {
    if (!on || busy || !sid) return;
    busy = true; status('Buscando atualizações…');
    let mudou = 0;
    try {
      st.hashes = st.hashes || {};
      const desde = st.lastPull || '1970-01-01T00:00:00Z'; let max = desde;
      const porId = new Map(S.contacts.map(c => [c.id, c]));
      for (let de = 0; ; de += 1000) {
        const { data, error } = await sb().from('store_contacts').select('cid,data,updated_at').eq('store_id', sid).gt('updated_at', desde).order('updated_at').range(de, de + 999);
        if (error) throw error;
        for (const r of data) {
          if (r.updated_at > max) max = r.updated_at;
          const loc = porId.get(r.cid);
          if (loc && hash(JSON.stringify(loc)) !== st.hashes[r.cid] && st.hashes[r.cid] !== undefined) continue; // mudança local pendente vence
          if (loc) { Object.keys(loc).forEach(k => delete loc[k]); Object.assign(loc, r.data); }
          else { S.contacts.push(r.data); porId.set(r.cid, r.data); }
          st.hashes[r.cid] = hash(JSON.stringify(r.data)); mudou++;
        }
        if (data.length < 1000) break;
      }
      const { data: est } = await sb().from('store_state').select('data,updated_at').eq('store_id', sid).maybeSingle();
      if (est && est.updated_at > (st.stateAt || '') && hash(JSON.stringify(estado())) === (st.stateHash || hash(JSON.stringify(estado())))) {
        const d = est.data || {};
        if (Array.isArray(d.campaigns) && d.campaigns.length) { S.campaigns = d.campaigns; if (d.activeCampId) S.activeCampId = d.activeCampId; }
        else if (d.campaign) { S.campaign = d.campaign; S.campaigns = []; }
        if (d.bdayMsg) S.bdayMsg = d.bdayMsg;
        if (d.pvMsg1) S.pvMsg1 = d.pvMsg1;
        if (d.pvMsg7) S.pvMsg7 = d.pvMsg7;
        if (d.vencCfg) S.vencCfg = d.vencCfg;
        if (d.implantacao) S.implantacao = d.implantacao;
        if (d.sentLog) S.sentLog = d.sentLog;
        if (d.settings) Object.assign(S.settings, d.settings);
        normalizarCampanhas(S);
        st.stateAt = est.updated_at; st.stateHash = hash(JSON.stringify(estado())); mudou++;
      }
      st.lastPull = max; gravar();
      if (mudou) { mudo = true; save(); mudo = false; renderAll(); }
    } catch (err) {
      status('Sem conexão com o servidor agora. Seus contatos estão salvos neste celular.');
    } finally { busy = false; }
  }

  async function sincronizar() { await receber(); await enviar(); }

  function renderCard() {
    const txt = $('#syncTxt'), ck = $('#syncOn'); if (!txt || !ck) return;
    ck.checked = on; ck.disabled = premium || !sid;
    $('#syncLbl').textContent = premium ? 'Incluído no plano Premium' : 'Guardar meus contatos com segurança no servidor';
    if (!sid) { txt.textContent = 'Disponível para usuários ligados a uma loja.'; status(''); return; }
    txt.textContent = on
      ? 'Seus contatos estão guardados com segurança no servidor do Cliente Assistido: backup automático, a mesma lista para o dono e os funcionários e acesso pelo notebook.'
      : 'Hoje seus contatos ficam só neste celular. Ligando, eles também ficam guardados com segurança no servidor do Cliente Assistido: você ganha backup automático, a mesma lista para o dono e os funcionários e acesso pelo notebook.';
    if (!on) status((window.CA_ACCESS || {}).papel === 'operador' ? 'Esta loja está sem o backup ligado, então a lista dela não aparece para o operador. Peça ao dono para ligar o backup ou passe a loja para o Premium.' : '');
    const pap = (window.CA_ACCESS || {}).papel;
    const ac = $('#ativCard'); if (ac) ac.classList.toggle('hide', !(on && ['lojista', 'admin', 'operador'].includes(pap)));
    if (window.CA_renderImpl) window.CA_renderImpl();
  }

  /* ---------- Registro de atividades (só com backup ligado: os dados já estão no servidor) ---------- */
  const fila = () => { try { return JSON.parse(localStorage.getItem('ca_logq') || '[]'); } catch (e) { return []; } };
  const guardaFila = q => { try { localStorage.setItem('ca_logq', JSON.stringify(q.slice(-200))); } catch (e) {} };
  window.CA_log = function (action, detail) {
    const acc = window.CA_ACCESS || {};
    if (!on || !sid || !acc.email) return;
    const q = fila(); q.push({ store_id: sid, user_email: acc.email, user_role: acc.papel, action, detail: detail || {} }); guardaFila(q);
    enviarFila();
  };
  let enviandoFila = false;
  async function enviarFila() {
    if (enviandoFila) return;
    const q = fila(); if (!q.length || !sb()) return;
    enviandoFila = true;
    try {
      const { error } = await sb().from('activity_log').insert(q);
      if (!error) guardaFila(fila().slice(q.length)); // tira só o que foi enviado
    } finally { enviandoFila = false; }
    if (fila().length) setTimeout(enviarFila, 1000);
  }
  const ACOES = {
    envio: d => `enviou mensagem para ${d.nome || d.num}${d.campanha ? ' (campanha "' + d.campanha + '")' : ''}`,
    parabens: d => `enviou parabéns para ${d.nome || d.num}`,
    importou_google: d => `importou ${d.quantidade} contato(s) do Google Contatos`,
    posvenda_obrigado: d => `agradeceu a compra de ${d.nome || d.num}`,
    posvenda_como_ficou: d => `perguntou a ${d.nome || d.num} como ficou a compra`,
    marcou_respondeu: d => `marcou que ${d.nome || d.num} respondeu`,
    marcou_aberto: d => `marcou que ${d.nome || d.num} não respondeu`,
    marcou_saiu: d => `marcou que ${d.nome || d.num} pediu para sair`,
    campanha_salva: d => `salvou a campanha "${d.campanha || 'sem nome'}"`,
    perfil_loja: () => 'atualizou os dados da loja',
    aviso_vencimento: d => `avisou o vencimento (${d.tipo || ''}) de ${d.nome || d.num || 'um cliente'}`,
    ficha_veiculo: d => `atualizou a ficha do veículo de ${d.nome || d.num || 'um cliente'}`,
    campanha_modelo: d => `criou a campanha "${d.campanha || ''}" a partir de um modelo`,
    campanha_encerrada: d => `encerrou a campanha "${d.campanha || 'sem nome'}"`,
    excluiu_em_massa: d => `excluiu ${d.quantidade} contato(s) da lista`,
    moveu_em_massa: d => `moveu ${d.quantidade} contato(s) para ${d.grupo}`,
    entrou: () => 'entrou no app', abriu_loja: () => 'abriu a loja para atendimento'
  };
  const PAP = { admin: 'Administrador', lojista: 'Dono', funcionario: 'Funcionário', operador: 'Operador CA' };
  async function carregarAtividades() {
    const box = $('#ativLista'); if (!box || !on || !sid) return;
    const { data, error } = await sb().from('activity_log').select('user_email,user_role,action,detail,created_at').eq('store_id', sid).order('created_at', { ascending: false }).limit(40);
    if (error) { box.innerHTML = '<p class="mut small">Não foi possível carregar agora.</p>'; return; }
    const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    box.innerHTML = (data || []).map(r => {
      const dt = new Date(r.created_at);
      const quando = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const quem = (r.user_email || '').split('@')[0];
      const txt = (ACOES[r.action] || (() => r.action))(r.detail || {});
      return `<div class="ativ"><small>${quando} · ${esc(quem)} (${PAP[r.user_role] || r.user_role || ''})</small><br>${esc(txt)}</div>`;
    }).join('') || '<p class="mut small">Nenhuma atividade registrada ainda.</p>';
  }
  document.addEventListener('click', e => { if (e.target.closest('[data-tab="mais"]')) carregarAtividades(); });

  window.CA_startSync = function (acc) {
    const loja = acc && acc.loja;
    const novo = loja ? loja.id : null;
    if (st.sid !== novo || !novo) st = novo ? ler(novo) : {};
    sid = novo; on = !!(loja && loja.sync); premium = !!(loja && loja.plano === 'premium');
    renderCard();
    clearInterval(loop);
    if (on) { sincronizar(); loop = setInterval(receber, 120000); }
  };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && on) receber(); });

  const ck = $('#syncOn');
  if (ck) ck.addEventListener('change', async e => {
    const ligar = e.target.checked;
    const msg = ligar
      ? 'Ligar o backup automático?\n\nUma cópia dos seus contatos ficará guardada no servidor do Cliente Assistido, protegida e usada só para o serviço da sua loja, conforme a LGPD. Os contatos continuam também neste celular.'
      : 'Desligar o backup automático?\n\nOs contatos continuam neste celular. A cópia no servidor deixa de ser atualizada; para apagá-la, fale com o suporte.';
    if (!confirm(msg)) { e.target.checked = !ligar; return; }
    const { data, error } = await sb().rpc('set_store_sync', { p_enabled: ligar });
    if (error) { alert('Não foi possível alterar: ' + (error.message.includes('premium') ? 'o plano Premium inclui a sincronização.' : error.message)); e.target.checked = !ligar; return; }
    const acc = window.CA_ACCESS || {};
    if (acc.loja) acc.loja.sync = !!(data && data.sync);
    try { localStorage.setItem('ca_access', JSON.stringify(acc)); } catch (x) {}
    window.CA_startSync(acc);
    if (ligar) status('Enviando seus contatos pela primeira vez…');
  });

  if (window.CA_ACCESS) window.CA_startSync(window.CA_ACCESS);
})();
