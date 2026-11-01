/* Cliente Assistido – API oficial do WhatsApp (1.55.0, pedido do Marcos, 01/11/2026).
   Módulo opcional: só funciona na loja em que o admin ligou (tabela wa_config, Admin → 📲 API oficial do WhatsApp).
   Primeira entrega: LEMBRETES automáticos (vencimentos e pós-venda), enviados pelo servidor no horário da loja,
   por modelos aprovados pela Meta. Campanhas continuam no envio manual.
   Como funciona:
   - Ao abrir o app (e depois de cada mudança), waSincronizar() calcula os lembretes dos próximos 7 dias e grava na
     wa_fila (um item por contato + chave: 'venc:<serviço>:<data>', 'pv1:<compra>', 'pv7:<compra>'), com o dia e a hora.
     Item que deixou de valer (serviço feito, pulado, contato saiu) é cancelado.
   - A função wa-envio (pg_cron a cada 15 min) envia na hora marcada; a wa-webhook recebe entregue/lido/falhou e as
     respostas dos clientes.
   - Aqui, o que já foi enviado vira "avisado" no contato (vencAv / pv1 / pv7) e quem respondeu vira status 'respondeu'.
   - Na tela Hoje, o botão Avisar/Enviar dos itens na fila vira "⏰ automático às Xh". */
'use strict';
(function () {
  const SB = () => window.CA_SB;
  const ACC = () => window.CA_ACCESS || {};
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const lojaId = () => (typeof KEY === 'string' && KEY.indexOf('ca_v1:') === 0) ? KEY.slice(6) : ((ACC().loja || {}).id || '');
  const ENVIADOS = ['enviado', 'entregue', 'lido', 'respondeu'];
  const ST_TXT = { agendado: '⏰ agendado', enviando: '📤 enviando', enviado: '✓ enviado', entregue: '✓✓ entregue', lido: '👁 lido', respondeu: '💬 respondeu', falhou: '⚠️ falhou', cancelado: 'cancelado', expirado: 'expirado' };
  let CFG = null, FILA = new Map(), ocupado = false, timer = null, ultima = 0;

  const somaD = (iso, n) => (typeof somaDias === 'function' ? somaDias(iso, n) : iso);
  const diasEntre = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  const horaAgora = () => new Date().getHours();
  const quando = (dia, hora) => `${dia}T${String(hora).padStart(2, '0')}:00:00-03:00`; // horário de Brasília
  const diaDe = t => { const x = new Date(t); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
  const horaDe = t => { const x = new Date(t), m = x.getMinutes(); return x.getHours() + 'h' + (m ? String(m).padStart(2, '0') : ''); };
  const nome1 = c => (typeof firstName === 'function' ? firstName(c.name) : '') || 'cliente';
  const loja = () => (typeof lojaNome === 'function' ? lojaNome() : 'nossa loja');
  const pode = () => !!(CFG && CFG.ativo && lojaId() && SB() && typeof S === 'object' && ['lojista', 'funcionario', 'operador', 'admin'].includes(ACC().papel));

  // Primeiro dia possível de envio: hoje, se o horário da loja ainda não passou; senão, amanhã
  function primeiroDia() { const h = today(); return horaAgora() < (+CFG.hora || 9) ? h : somaD(h, 1); }

  // Lembretes que deveriam estar na fila (próximos 7 dias)
  function desejados() {
    const out = [], ini = primeiroDia(), fim = somaD(today(), 7), hora = +CFG.hora || 9;
    const tipos = typeof vencTipos === 'function' ? vencTipos() : [];
    const pvOn = !(typeof desligado === 'function' && desligado('posvenda'));
    S.contacts.forEach(c => {
      if (c.excluded || c.status === 'saiu' || c.semZap || !c.num) return;
      // Vencimentos: avisa no dia (vencimento − antecedência) ou, se já está no prazo, no primeiro dia possível
      if (c.serv) tipos.forEach(t => {
        const info = proxVencInfo(c, t), prox = info.d; if (!prox) return;
        const chave = 'venc:' + t.k + ':' + prox;
        if ((c.vencAv || {})[t.k + ':' + prox]) return;
        let dia = somaD(prox, -(+t.aviso || 0)); if (dia < ini) dia = ini;
        if (dia > fim || diasEntre(dia, prox) < -60) return;
        const dias = diasEntre(dia, prox);
        const veic = (c.veic || {}).modelo ? ' do seu ' + c.veic.modelo : '';
        const rot = String(t.r || 'o serviço'); const frase = `${rot.charAt(0).toLowerCase() + rot.slice(1)}${veic} ${typeof venceFrase === 'function' ? venceFrase(dias, prox) : 'vence em ' + prox}`;
        out.push({ cid: c.id, num: c.num, tipo: 'venc', chave, enviar_em: quando(dia, hora), params: [nome1(c), loja(), frase] });
      });
      // Pós-venda: agradecimento no dia seguinte (até 6 dias) e "como ficou?" com 7 dias (até 14)
      if (pvOn && c.compra && !(typeof ehBeleza === 'function' && ehBeleza())) {
        [['pv1', 1, 6], ['pv7', 7, 14]].forEach(([k, de, ate]) => {
          if (c[k]) return;
          if (k === 'pv7' && +((CFG.modelos || {}).pv1_min || 0) > 0) return; // no piloto, só o agradecimento
          // PILOTO (teste): agradecimento N minutos depois de registrar a venda (wa_config.modelos.pv1_min)
          const min = +((CFG.modelos || {}).pv1_min || 0);
          if (k === 'pv1' && min > 0 && c.compraEm && c.compra === today()) {
            out.push({ cid: c.id, num: c.num, tipo: k, chave: 'pv1:' + c.compra + ':t' + c.compraEm, enviar_em: new Date(c.compraEm + min * 60000).toISOString(), params: [nome1(c), loja()] });
            return;
          }
          let dia = somaD(c.compra, de); if (dia < ini) dia = ini;
          if (dia > fim || diasEntre(c.compra, dia) > ate) return;
          out.push({ cid: c.id, num: c.num, tipo: k, chave: k + ':' + c.compra, enviar_em: quando(dia, hora), params: [nome1(c), loja()] });
        });
      }
    });
    return out;
  }

  async function carregarConfig() {
    const id = lojaId(); if (!id || !SB()) { CFG = null; return; }
    const { data } = await SB().from('wa_config').select('*').eq('store_id', id).maybeSingle();
    CFG = data || null;
  }

  // Traz a fila do servidor e aplica no app o que já foi enviado / respondido
  async function lerFila() {
    const desde = new Date(Date.now() - 20 * 86400000).toISOString();
    const { data, error } = await SB().from('wa_fila').select('id,cid,chave,tipo,status,enviar_em,params,erro').eq('store_id', lojaId()).gte('enviar_em', desde).limit(2000);
    if (error) return false;
    FILA = new Map((data || []).map(r => [r.cid + '|' + r.chave, r]));
    let mudou = false;
    (data || []).forEach(r => {
      if (!ENVIADOS.includes(r.status)) return;
      const c = S.contacts.find(x => x.id === r.cid); if (!c) return;
      const dia = String(r.enviar_em).slice(0, 10);
      if (r.tipo === 'venc') { const k = r.chave.slice(5); c.vencAv = c.vencAv || {}; if (!c.vencAv[k]) { c.vencAv[k] = dia; c.lastOpen = c.lastOpen && c.lastOpen > dia ? c.lastOpen : dia; mudou = true; } }
      else if (!c[r.tipo]) { c[r.tipo] = dia; mudou = true; }
      if (r.status === 'respondeu' && c.status !== 'respondeu' && c.status !== 'saiu') { c.status = 'respondeu'; c.lastReply = today(); c.reviewed = true; mudou = true; }
    });
    return mudou;
  }

  async function sincronizar() {
    if (ocupado) return; ocupado = true;
    try {
      await carregarConfig();
      if (!pode()) { FILA = new Map(); return; }
      const mudou = await lerFila();
      if (mudou) { save(); }
      const quer = desejados(), querChaves = new Set(quer.map(q => q.cid + '|' + q.chave));
      const novos = [], muda = [];
      quer.forEach(q => {
        const r = FILA.get(q.cid + '|' + q.chave);
        if (!r) novos.push(Object.assign({ store_id: lojaId(), status: 'agendado' }, q));
        else if ((r.status === 'agendado' || r.status === 'cancelado') && (new Date(r.enviar_em).getTime() !== new Date(q.enviar_em).getTime() || JSON.stringify(r.params) !== JSON.stringify(q.params) || r.status === 'cancelado'))
          muda.push({ id: r.id, enviar_em: q.enviar_em, params: q.params, num: q.num, status: 'agendado' });
      });
      const cancelar = [...FILA.values()].filter(r => r.status === 'agendado' && !querChaves.has(r.cid + '|' + r.chave)).map(r => r.id);
      if (novos.length) for (let i = 0; i < novos.length; i += 200) await SB().from('wa_fila').upsert(novos.slice(i, i + 200), { onConflict: 'store_id,cid,chave', ignoreDuplicates: true });
      for (const m of muda) await SB().from('wa_fila').update({ enviar_em: m.enviar_em, params: m.params, num: m.num, status: 'agendado', atualizado_em: new Date().toISOString() }).eq('id', m.id);
      if (cancelar.length) await SB().from('wa_fila').update({ status: 'cancelado', atualizado_em: new Date().toISOString() }).in('id', cancelar);
      if (novos.length || muda.length || cancelar.length) await lerFila();
      ultima = Date.now();
    } catch (e) { console.warn('wa: sincronização falhou', e); }
    finally { ocupado = false; if (typeof renderAll === 'function') renderAll(); }
  }
  const agendar = (ms) => { clearTimeout(timer); timer = setTimeout(sincronizar, ms); };
  window.CA_waSincronizar = () => agendar(300);

  // Tela Hoje: troca o botão dos itens que já estão na fila automática
  window.CA_waMarcar = function () {
    renderCard();
    if (!CFG || !CFG.ativo || !FILA.size) return;
    const troca = (a, chave) => {
      const r = FILA.get(a.dataset.cid + '|' + chave);
      if (!r || !['agendado', 'enviando'].includes(r.status)) return;
      const d = diaDe(r.enviar_em), hoje = today(), hora = horaDe(r.enviar_em);
      const s = document.createElement('span'); s.className = 'waAuto';
      s.innerHTML = r.status === 'enviando' ? '📤 enviando…' : `⏰ automático<small>${d === hoje ? 'hoje' : d === somaD(hoje, 1) ? 'amanhã' : fmtD(d)} às ${hora}</small>`;
      s.title = 'Será enviado sozinho pela API oficial do WhatsApp';
      a.replaceWith(s);
    };
    document.querySelectorAll('#vencLista a[data-venc]').forEach(a => { a.dataset.cid = a.dataset.venc; troca(a, 'venc:' + a.dataset.vk + ':' + a.dataset.vp); });
    document.querySelectorAll('#posLista a[data-pv]').forEach(a => {
      const c = S.contacts.find(x => x.id === a.dataset.pv); if (!c) return;
      const k = a.dataset.pvk === 'd1' ? 'pv1' : 'pv7'; a.dataset.cid = c.id; troca(a, k + ':' + c.compra); if (k === 'pv1' && c.compraEm) troca(a, 'pv1:' + c.compra + ':t' + c.compraEm);
    });
  };

  // Mais → 📲 Envio automático (dono, operador, admin): horário e últimos envios
  function renderCard() {
    const card = document.getElementById('waCard'); if (!card) return;
    const ok = !!(CFG && CFG.ativo) && ['lojista', 'operador', 'admin'].includes(ACC().papel);
    card.classList.toggle('hide', !ok); if (!ok) return;
    const sel = document.getElementById('waHora');
    if (sel && !sel.dataset.ok) { sel.innerHTML = Array.from({ length: 16 }, (_, i) => i + 6).map(h => `<option value="${h}">${h}h</option>`).join(''); sel.dataset.ok = '1'; }
    if (sel && document.activeElement !== sel) sel.value = String(CFG.hora || 9);
    const rows = [...FILA.values()].filter(r => r.status !== 'cancelado').sort((a, b) => String(b.enviar_em).localeCompare(String(a.enviar_em))).slice(0, 15);
    const ag = [...FILA.values()].filter(r => r.status === 'agendado').length;
    const sub = document.getElementById('waSub'); if (sub) sub.textContent = ag ? `${ag} lembrete(s) agendado(s)` : 'Nenhum lembrete agendado agora';
    const lista = document.getElementById('waLista');
    if (lista) lista.innerHTML = rows.length ? rows.map(r => {
      const c = S.contacts.find(x => x.id === r.cid) || {};
      const tipo = r.tipo === 'venc' ? '🔧 vencimento' : r.tipo === 'pv1' ? '🛍️ agradecimento' : '🛍️ como ficou?';
      return `<div class="it"><div class="t"><b>${esc(c.name || r.cid)}</b><small>${tipo} · ${fmtD(diaDe(r.enviar_em))} às ${horaDe(r.enviar_em)}${r.erro && r.status === 'falhou' ? ' · ' + esc(r.erro) : ''}</small></div><span class="waSt waSt-${r.status}">${ST_TXT[r.status] || r.status}</span></div>`;
    }).join('') : '<p class="mut small">Os lembretes aparecem aqui quando entram na fila.</p>';
  }
  document.addEventListener('change', async e => {
    if (e.target && e.target.id === 'waHora') {
      const h = +e.target.value; const { data } = await SB().rpc('wa_set_hora', { p_store: lojaId(), p_hora: h });
      if (data) { CFG.hora = h; await sincronizar(); } else alert('Não foi possível mudar o horário agora.');
    }
  });

  /* ---------- Admin → 📲 API oficial do WhatsApp ---------- */
  let ADM_LOJAS = [];
  async function admRender() {
    const box = document.getElementById('waAdmBox'); if (!box || !SB()) return;
    if (!ADM_LOJAS.length) { const { data } = await SB().from('stores').select('id,name').order('name'); ADM_LOJAS = data || []; }
    const sel = document.getElementById('waAdmLoja');
    if (sel && !sel.options.length) sel.innerHTML = ADM_LOJAS.map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join('');
    const id = sel ? sel.value : ''; if (!id) return;
    const { data: cfg } = await SB().from('wa_config').select('*').eq('store_id', id).maybeSingle();
    const c = cfg || { ativo: false, hora: 9, phone_number_id: '', waba_id: '', modelos: { venc: 'ca_lembrete_vencimento', pv1: 'ca_posvenda_obrigado', pv7: 'ca_posvenda_semana', idioma: 'pt_BR' } };
    const m = c.modelos || {};
    document.getElementById('waAdmForm').innerHTML = `
      <label class="ckl"><input type="checkbox" class="ck" id="waAdmAtivo"${c.ativo ? ' checked' : ''}> Envio automático ligado nesta loja</label>
      <div class="row wrap"><label class="grow">ID do número (phone_number_id)<input id="waAdmPhone" inputmode="numeric" value="${esc(c.phone_number_id || '')}"></label>
      <label class="grow">ID da conta (WABA)<input id="waAdmWaba" inputmode="numeric" value="${esc(c.waba_id || '')}"></label></div>
      <div class="row wrap"><label class="grow">Horário<select id="waAdmHora">${Array.from({ length: 16 }, (_, i) => i + 6).map(h => `<option value="${h}"${+c.hora === h ? ' selected' : ''}>${h}h</option>`).join('')}</select></label>
      <label class="grow">Idioma dos modelos<input id="waAdmIdioma" value="${esc(m.idioma || 'pt_BR')}"></label></div>
      <p class="small" style="margin:8px 0 2px"><b>Nomes dos modelos aprovados na Meta</b></p>
      <div class="row wrap"><label class="grow">Vencimento<input id="waAdmMVenc" value="${esc(m.venc || '')}"></label><label class="grow">Agradecimento<input id="waAdmMPv1" value="${esc(m.pv1 || '')}"></label><label class="grow">Como ficou?<input id="waAdmMPv7" value="${esc(m.pv7 || '')}"></label></div>
      <label class="grow">🧪 Piloto: agradecimento quantos minutos depois de registrar a venda? <span class="mut">(0 = normal, no dia seguinte no horário da loja)</span><input id="waAdmPilMin" type="number" min="0" max="120" inputmode="numeric" value="${+(m.pv1_min || 0)}"></label>
      <p class="mut small" style="margin:2px 0 10px">Com o número de teste da Meta, use o modelo <b>hello_world</b> (já vem aprovado, sem variáveis) até os modelos do CA serem aprovados.</p>
      <button class="primary" id="waAdmSalvar">Salvar</button> <span class="msg hide" id="waAdmMsg"></span>
      <hr style="margin:14px 0;border:0;border-top:1px solid var(--line)">
      <p class="small"><b>Enviar um teste agora</b> <span class="mut">(com o número de teste da Meta, só para celulares cadastrados lá)</span></p>
      <div class="row wrap"><label class="grow">Celular com DDI e DDD<input id="waAdmNum" inputmode="numeric" placeholder="5561999999999"></label>
      <label class="grow">Modelo<select id="waAdmTipo"><option value="pv1">Agradecimento</option><option value="pv7">Como ficou?</option><option value="venc">Vencimento</option></select></label></div>
      <button id="waAdmTeste">Enviar teste</button> <span class="msg hide" id="waAdmTMsg"></span>`;
  }
  const msg = (id, t) => { const el = document.getElementById(id); if (el) { el.textContent = t; el.classList.remove('hide'); } };
  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'waAdmCard' && e.target.open) admRender(); }, true);
  document.addEventListener('change', e => { if (e.target && e.target.id === 'waAdmLoja') admRender(); });
  document.addEventListener('click', async e => {
    if (e.target && e.target.id === 'waAdmSalvar') {
      const v = id => (document.getElementById(id).value || '').trim();
      const reg = {
        store_id: v('waAdmLoja'), ativo: document.getElementById('waAdmAtivo').checked, phone_number_id: v('waAdmPhone').replace(/\D/g, '') || null,
        waba_id: v('waAdmWaba').replace(/\D/g, '') || null, hora: +v('waAdmHora'),
        modelos: { venc: v('waAdmMVenc'), pv1: v('waAdmMPv1'), pv7: v('waAdmMPv7'), idioma: v('waAdmIdioma') || 'pt_BR', pv1_min: Math.max(0, Math.min(120, +v('waAdmPilMin') || 0)) }, atualizado_em: new Date().toISOString()
      };
      if (reg.ativo && !reg.phone_number_id) { msg('waAdmMsg', 'Informe o ID do número antes de ligar.'); return; }
      const { error } = await SB().from('wa_config').upsert(reg, { onConflict: 'store_id' });
      msg('waAdmMsg', error ? 'Não foi possível salvar: ' + error.message : 'Salvo ✓');
      if (!error && reg.store_id === lojaId()) sincronizar();
    }
    if (e.target && e.target.id === 'waAdmTeste') {
      const tipo = document.getElementById('waAdmTipo').value;
      const params = tipo === 'venc' ? ['Marcos', 'Loja Teste', 'a troca de óleo do seu carro vence em 5 dias'] : ['Marcos', 'Loja Teste'];
      msg('waAdmTMsg', 'Enviando…');
      const { data } = await SB().functions.invoke('wa-envio', { body: { modo: 'teste', store_id: document.getElementById('waAdmLoja').value, num: document.getElementById('waAdmNum').value, tipo, params } });
      const ERR = { sem_config: 'Salve o ID do número primeiro.', sem_chave: 'Falta guardar a chave de acesso (segredo WA_TOKEN) no Supabase.', numero_invalido: 'Número inválido: use 55 + DDD + número.', sem_permissao: 'Só o admin pode testar.' };
      msg('waAdmTMsg', data && data.ok ? 'Enviado ✓ Confira no celular.' : 'Não enviou: ' + (ERR[data && data.erro] || (data && data.erro) || 'erro desconhecido'));
    }
  });

  // Quando sincronizar: ao entrar, ao voltar para o app e alguns segundos depois de cada mudança
  const antes = window.CA_onSave;
  window.CA_onSave = function () { if (antes) antes.apply(this, arguments); if (CFG && CFG.ativo && !ocupado) agendar(5000); };
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - ultima > 60000) agendar(1500); });
  setInterval(() => { if (document.visibilityState === 'visible' && CFG && CFG.ativo) agendar(100); }, 10 * 60000);
  window.CA_waIniciar = () => agendar(1200);
  if (window.CA_ACCESS && window.CA_ACCESS.papel) agendar(1500);
})();
