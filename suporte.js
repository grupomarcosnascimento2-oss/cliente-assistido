/* Cliente Assistido – Suporte (1.51.0, pedido do Marcos, 30/10/2026).
   Ícone 🎧 no topo, ao lado do nome (#btnSuporte, desenhado em auth.js). Abre o painel #supPainel:
   a IA de suporte (edge function ia-suporte) responde dúvidas de uso do app na hora; se não resolver,
   "Falar com uma pessoa no WhatsApp" abre o WhatsApp do suporte com loja, usuário, versão e a última dúvida.
   Cada pergunta fica em support_chats; o admin vê em Admin → 🛟 Suporte: perguntas dos usuários (#supAdmCard).
   A conversa fica só na memória desta tela (some ao fechar o app). */
'use strict';
(function () {
  const WHATS = '5561999999340';
  const ACC = () => window.CA_ACCESS || {};
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const primeiro = t => String(t || '').trim().split(/\s+/)[0] || '';
  const lojaId = () => (typeof KEY === 'string' && KEY.indexOf('ca_v1:') === 0) ? KEY.slice(6) : ((ACC().loja || {}).id || '');
  const telaAtual = () => { const b = document.querySelector('.tabs button.on, .tabs button.active, .tabs button[aria-selected="true"]'); return b ? b.textContent.trim() : ''; };
  const versao = () => (typeof APP_VERSION === 'object' ? APP_VERSION.num : '');
  const SUGESTOES = ['Como carrego os contatos da loja?', 'Como crio uma campanha?', 'Por que o botão de enviar fica esperando?', 'Como marco quem respondeu?', 'Como deixo a mesma lista em dois celulares?'];
  const ERROS = {
    limite: 'Você já fez muitas perguntas hoje. Para continuar agora, fale com uma pessoa do suporte pelo WhatsApp, logo abaixo.',
    sem_chave: 'O suporte com IA está indisponível no momento. Fale com uma pessoa pelo WhatsApp, logo abaixo.',
    nao_autorizado: 'Entre de novo no app para usar o suporte.',
    sem_permissao: 'Seu usuário não está ativo. Fale com o suporte pelo WhatsApp, logo abaixo.'
  };
  let conversa = []; // [{q, r, id}]
  let ocupado = false;

  function painel() {
    let p = document.getElementById('supPainel'); if (p) return p;
    p = document.createElement('div'); p.id = 'supPainel'; p.className = 'supFundo hide';
    p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-labelledby', 'supTit');
    p.innerHTML = `<div class="supCaixa">
      <div class="supTopo"><div><b id="supTit">🎧 Suporte do Cliente Assistido</b><small>Tire suas dúvidas sobre o uso do app</small></div><button class="supX" data-sup-fechar="1" aria-label="Fechar">✕</button></div>
      <div class="supMsgs" id="supMsgs" aria-live="polite"></div>
      <div class="supSug" id="supSug"></div>
      <form class="supForm" id="supForm"><textarea id="supTxt" rows="2" maxlength="800" placeholder="Escreva a sua dúvida…"></textarea><button class="primary" id="supEnviar" type="submit">Enviar</button></form>
      <a class="supZap" id="supZap" target="_blank" rel="noopener">💬 Falar com uma pessoa no WhatsApp</a>
      <p class="supNota">As respostas são da IA de suporte e a equipe do CA confere. Não envie senhas nem dados de cartão.</p>
    </div>`;
    document.body.appendChild(p);
    return p;
  }
  function linkZap() {
    const a = ACC(), loja = (a.loja || {}).nome || '', ult = conversa.length ? conversa[conversa.length - 1].q : '';
    const t = `Olá! Preciso de ajuda com o Cliente Assistido.\nLoja: ${loja || '-'}\nUsuário: ${a.nome || a.email || '-'}\nVersão do app: ${versao() || '-'}${ult ? '\nDúvida: ' + ult : ''}`;
    return `https://wa.me/${WHATS}?text=${encodeURIComponent(t)}`;
  }
  function desenhar() {
    const box = document.getElementById('supMsgs'); if (!box) return;
    const nome = primeiro(ACC().nome);
    box.innerHTML = `<div class="supMsg ia"><b>🤖 Assistente CA</b>Olá${nome ? ', ' + esc(nome) : ''}! 👋 Sou a assistente do Cliente Assistido. Pergunte como fazer qualquer coisa no app, que eu explico o passo a passo.</div>`
      + conversa.map(c => `<div class="supMsg eu">${esc(c.q)}</div>${c.r ? `<div class="supMsg ia${c.erro ? ' erro' : ''}"><b>🤖 Assistente CA</b>${esc(c.r)}${c.id ? `<span class="supUtil" data-sup-id="${c.id}">${c.util === undefined ? 'Isso ajudou? <button data-sup-util="1">👍 Sim</button><button data-sup-util="0">👎 Não</button>' : c.util ? 'Obrigado pelo retorno! 💚' : 'Que pena. Toque em “Falar com uma pessoa no WhatsApp” que a gente resolve.'}</span>` : ''}</div>` : ''}`).join('');
    const sug = document.getElementById('supSug');
    if (sug) sug.innerHTML = conversa.length ? '' : SUGESTOES.map(s => `<button type="button" data-sup-sug="${esc(s)}">${esc(s)}</button>`).join('');
    const z = document.getElementById('supZap'); if (z) z.href = linkZap();
    box.scrollTop = box.scrollHeight;
  }
  function abrir() {
    const p = painel(); p.classList.remove('hide'); document.body.classList.add('supAberto');
    desenhar(); setTimeout(() => { const t = document.getElementById('supTxt'); if (t) t.focus(); }, 50);
  }
  function fechar() { const p = document.getElementById('supPainel'); if (p) p.classList.add('hide'); document.body.classList.remove('supAberto'); }

  async function perguntar(q) {
    q = String(q || '').trim(); if (q.length < 3 || ocupado) return;
    const sb = window.CA_SB;
    ocupado = true; const item = { q }; conversa.push(item); desenhar();
    const t = document.getElementById('supTxt'); if (t) t.value = '';
    const btn = document.getElementById('supEnviar'); if (btn) btn.disabled = true;
    const ultima = document.querySelector('#supMsgs .supMsg.eu:last-child');
    const parar = (window.CA_iaEspera && ultima) ? window.CA_iaEspera(ultima, ['Lendo a sua dúvida…', 'Procurando o caminho no app…', 'Escrevendo o passo a passo…', 'Quase pronto…']) : () => 0;
    let r = null;
    try {
      if (!sb) throw new Error('sem conexão');
      const { data } = await sb.functions.invoke('ia-suporte', { body: { pergunta: q, historico: conversa.slice(0, -1).filter(c => c.r && !c.erro).map(c => ({ q: c.q, r: c.r })), tela: telaAtual(), store_id: lojaId() } });
      r = data;
    } catch (e) { r = null; }
    parar(); ocupado = false; if (btn) btn.disabled = false;
    if (r && r.resposta) { item.r = r.resposta; item.id = r.id || null; }
    else { item.r = ERROS[r && r.erro] || 'Não consegui responder agora. Tente de novo em instantes ou fale com uma pessoa pelo WhatsApp, logo abaixo.'; item.erro = true; }
    desenhar();
    if (window.CA_log) window.CA_log('suporte_ia', { tela: telaAtual() });
  }

  document.addEventListener('click', e => {
    if (e.target.closest('#btnSuporte')) { abrir(); return; }
    if (e.target.closest('[data-sup-fechar]') || e.target.id === 'supPainel') { fechar(); return; }
    const s = e.target.closest('[data-sup-sug]'); if (s) { perguntar(s.dataset.supSug); return; }
    const u = e.target.closest('[data-sup-util]');
    if (u) {
      const id = u.closest('[data-sup-id]').dataset.supId, util = u.dataset.supUtil === '1', c = conversa.find(x => String(x.id) === id);
      if (c) { c.util = util; desenhar(); }
      if (window.CA_SB) window.CA_SB.rpc('support_feedback', { p_id: id, p_util: util }).then(() => {}, () => {});
      return;
    }
    if (e.target.closest('#supZap') && window.CA_log) window.CA_log('suporte_whatsapp', {});
  });
  document.addEventListener('submit', e => { if (e.target.id === 'supForm') { e.preventDefault(); perguntar(document.getElementById('supTxt').value); } });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('supAberto')) fechar();
    if (e.key === 'Enter' && !e.shiftKey && e.target && e.target.id === 'supTxt') { e.preventDefault(); perguntar(e.target.value); }
  });

  /* ---------- Admin: perguntas feitas ao suporte ---------- */
  async function renderAdmin() {
    const box = document.getElementById('supAdmLista'); if (!box || !window.CA_SB) return;
    box.innerHTML = '<p class="mut small">Carregando…</p>';
    const { data, error } = await window.CA_SB.from('support_chats').select('created_at,user_email,user_name,papel,tela,pergunta,resposta,util,stores(name)').order('created_at', { ascending: false }).limit(40);
    if (error) { box.innerHTML = '<p class="mut small">Não foi possível carregar agora.</p>'; return; }
    const sub = document.getElementById('supAdmSub'); if (sub) sub.textContent = data && data.length ? `${data.length} pergunta(s) mais recentes` : 'Nenhuma pergunta ainda';
    box.innerHTML = (data || []).length ? data.map(d => `<div class="trDuv"><small class="mut"><b>${esc(d.user_name || (d.user_email || '').split('@')[0])}</b>${d.stores && d.stores.name ? ' · ' + esc(d.stores.name) : ''} · ${esc(d.papel || '')}${d.tela ? ' · aba ' + esc(d.tela) : ''} · ${new Date(d.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}${d.util === true ? ' · 👍' : d.util === false ? ' · 👎' : ''}</small><p>${esc(d.pergunta)}</p><p class="trResp"><b>🤖 IA:</b> ${esc(d.resposta || '')}</p></div>`).join('')
      : '<p class="mut small">Ninguém perguntou nada ao suporte ainda.</p>';
  }
  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'supAdmCard' && e.target.open) renderAdmin(); }, true);
})();
