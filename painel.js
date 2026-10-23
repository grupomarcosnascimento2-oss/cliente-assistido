/* Cliente Assistido – Painel do operador CA (versão 1.16.0).
   Aba "Lojas": todas as lojas atendidas numa tela só, com o que cada uma tem para hoje.
   Os números vêm da cópia de cada loja neste aparelho; "Atualizar todas" busca o servidor. */
'use strict';
(function () {
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ACC = () => window.CA_ACCESS || {};
  const PLANO = { basico: 'Essencial', premium: 'Premium' };
  let atualizando = false, iniciado = false;

  function copia(id) { try { return JSON.parse(localStorage.getItem('ca_v1:' + id) || 'null'); } catch (e) { return null; } }

  function render() {
    const box = $('#painelLista'); if (!box) return;
    const acc = ACC(), lojas = acc.lojas || [];
    if (acc.papel !== 'operador') return;
    const linhas = lojas.map(l => {
      const d = copia(l.id);
      const r = d && window.CA_resumoDe ? window.CA_resumoDe(d, l) : null;
      return { l, r, sync: window.CA_syncInfo ? window.CA_syncInfo(l.id) : {} };
    });
    // Lojas com algo para fazer primeiro: aprovação/ajuste, depois mais tarefas no dia.
    const tarefas = x => x.r ? x.r.envios + x.r.niver + x.r.venc + x.r.pos + x.r.resp : 0;
    linhas.sort((a, b) => ((b.r && b.r.ajustes) || 0) - ((a.r && a.r.ajustes) || 0) || tarefas(b) - tarefas(a) || a.l.nome.localeCompare(b.l.nome));
    const tot = linhas.reduce((t, x) => { if (x.r) { t.env += x.r.envios; t.outros += x.r.niver + x.r.venc + x.r.pos; t.resp += x.r.resp; } return t; }, { env: 0, outros: 0, resp: 0 });
    $('#painelTot').innerHTML = `<div><b>${tot.env}</b><small>envios de campanha</small></div><div><b>${tot.outros}</b><small>aniversários, vencimentos e pós-venda</small></div><div><b>${tot.resp}</b><small>respostas para marcar</small></div>`;
    const atual = acc.loja && acc.loja.id;
    box.innerHTML = linhas.map(({ l, r, sync }) => {
      const nums = !r ? '<span>Ainda não aberta neste aparelho: toque em Atualizar todas ou em Abrir.</span>' : [
        r.ajustes ? `<span class="alerta">✏️ ${r.ajustes} ajuste(s) pedido(s) pelo dono</span>` : '',
        r.pendentes ? `<span class="alerta">⏳ ${r.pendentes} aguardando aprovação</span>` : '',
        `<span>📤 ${r.envios} envio(s)${r.aguardam > r.envios ? ` de ${r.aguardam}` : ''}</span>`,
        r.niver ? `<span>🎂 ${r.niver}</span>` : '', r.venc ? `<span>🔧 ${r.venc} vencimento(s)</span>` : '', r.pos ? `<span>🛍️ ${r.pos} pós-venda</span>` : '',
        r.resp ? `<span>💬 ${r.resp} para marcar</span>` : '', r.vendas ? `<span>💰 ${r.vendas} interesse(s) esperando o dono</span>` : '', r.enviadosHoje ? `<span>✓ ${r.enviadosHoje} enviado(s) hoje</span>` : '',
        !r.implantacao ? '<span>🚀 implantação em andamento</span>' : ''
      ].filter(Boolean).join('');
      return `<div class="pLoja${l.id === atual ? ' atual' : ''}">
        <div class="pTop"><div><b>${esc(l.nome)}</b><br><small class="mut">${esc(PLANO[l.plano] || l.plano || '')}${r ? ' · ' + r.contatos + ' contato(s) · campanha: ' + esc(r.campanha) : ''}${sync.lastOk ? ' · atualizado às ' + esc(sync.lastOk) : ''}</small></div>
          ${l.id === atual ? '<span class="tag">aberta</span>' : `<button class="primary" data-painel-abrir="${l.id}">Abrir</button>`}</div>
        <div class="pNums">${nums}</div></div>`;
    }).join('') || '<p class="mut small">Nenhuma loja atribuída a você ainda. Fale com o administrador.</p>';
  }

  async function atualizarTodas() {
    if (atualizando) return;
    const lojas = (ACC().lojas || []).filter(l => l.sync);
    if (!lojas.length || !window.CA_pullStore) return;
    atualizando = true;
    const b = $('#painelAtualizar'); b.disabled = true;
    try {
      for (let i = 0; i < lojas.length; i++) {
        b.textContent = `Atualizando ${i + 1} de ${lojas.length}…`;
        try { await window.CA_pullStore(lojas[i].id); } catch (e) { /* segue para a próxima loja */ }
      }
      $('#painelMsg').textContent = 'Lojas atualizadas às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '.';
    } finally { atualizando = false; b.disabled = false; b.textContent = 'Atualizar todas'; render(); }
  }

  function abrir(id) {
    const sel = $('#opLoja'); if (!sel) return;
    sel.value = id; sel.dispatchEvent(new Event('change', { bubbles: true }));
    const t = document.querySelector('.tabs button[data-tab="hoje"]'); if (t) t.click();
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-painel-abrir]'); if (a) { abrir(a.dataset.painelAbrir); return; }
    if (e.target.closest('#painelAtualizar')) { atualizarTodas(); return; }
    if (e.target.closest('.tabs button[data-tab="painel"]')) render();
  });

  // Chamado pelo auth.js depois de liberar o acesso.
  window.CA_painelInit = function (acc) {
    const tab = $('#tabPainel'); if (!tab) return;
    const op = acc && acc.papel === 'operador';
    tab.classList.toggle('hide', !op);
    if (!op) return;
    render();
    if (!iniciado) { // primeira entrada do dia: abre no painel e busca as novidades de todas as lojas
      iniciado = true; tab.click(); atualizarTodas();
    }
  };
  window.CA_renderPainel = render;
  // O acesso pode ter sido liberado antes deste arquivo carregar.
  if (window.CA_ACCESS && window.CA_ACCESS.ok) window.CA_painelInit(window.CA_ACCESS);
})();
