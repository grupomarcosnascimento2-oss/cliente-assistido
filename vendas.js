/* Cliente Assistido – Admin → 💳 Vendas (1.86.0).
   Lista as compras da Fraternidade Viva feitas pelo Mercado Pago (tabela fv_compras; RLS: só o admin lê).
   Mostra resumo (vendas liberadas, total recebido, mês atual), filtros por situação e, em cada compra:
   comprador, tipo (individual ou pastoral com nº de membros), valor, forma de pagamento (Pix/cartão),
   situação, datas, acesso até (individual) ou a loja criada (pastoral) e observação.
   "Conferir no Mercado Pago" chama a edge function fv-compra {acao:'status'}, que consulta o pagamento e libera se aprovado. */
'use strict';
(function () {
  const $ = s => document.querySelector(s);
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SB = () => window.CA_SB, ACC = () => window.CA_ACCESS || {};
  const real = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const dataHora = iso => { if (!iso) return ''; try { return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  const dataBr = d => d ? String(d).slice(0, 10).split('-').reverse().join('/') : '';
  const ST = {
    liberado: ['✅ Liberada', 'ok'], pago: ['💰 Paga, liberando', 'ok'], pendente: ['⏳ Aguardando pagamento', 'warn'],
    recusado: ['❌ Recusada', 'bad'], conflito: ['⚠️ Pagou, mas precisa de ajuste', 'bad'], cancelado: ['🚫 Cancelada', '']
  };
  const FORMA = { bank_transfer: 'Pix', credit_card: 'Cartão de crédito', debit_card: 'Cartão de débito', account_money: 'Saldo Mercado Pago', ticket: 'Boleto' };
  const FILTROS = [['ativas', 'Todas'], ['liberado', 'Liberadas'], ['pendente', 'Aguardando'], ['problema', 'Com problema'], ['cancelado', 'Canceladas']];
  let filtro = 'ativas', dados = [], lojas = {}, carregado = false;

  function passa(c) {
    if (filtro === 'ativas') return c.status !== 'cancelado';
    if (filtro === 'liberado') return c.status === 'liberado' || c.status === 'pago';
    if (filtro === 'problema') return c.status === 'conflito' || c.status === 'recusado';
    return c.status === filtro;
  }
  function forma(c) {
    if (!c.mp_tipo) return '';
    let t = FORMA[c.mp_tipo] || c.mp_tipo;
    if (c.mp_tipo === 'credit_card' && c.mp_parcelas > 1) t += ` em ${c.mp_parcelas}x`;
    return t;
  }
  function itemHTML(c) {
    const st = ST[c.status] || [c.status, ''];
    const tipo = c.tipo === 'pastoral' ? `⛪ Pastoral · ${c.membros || '?'} membros` : '🙋 Individual · 60 dias';
    const det = [];
    if (forma(c)) det.push('Pagamento: ' + esc(forma(c)));
    det.push('Pedido em ' + dataHora(c.criado_em));
    if (c.pago_em) det.push('Pago em ' + dataHora(c.pago_em));
    if (c.liberado_em) det.push('Liberado em ' + dataHora(c.liberado_em));
    if (c.tipo !== 'pastoral' && c.acesso_ate) det.push('Acesso até ' + dataBr(c.acesso_ate));
    if (c.tipo === 'pastoral' && c.store_id) det.push('Pastoral: ' + esc(lojas[c.store_id] || 'loja criada'));
    const zap = String(c.whatsapp || '').replace(/\D/g, '');
    const acoes = [];
    if (c.status === 'pendente' || c.status === 'pago' || c.status === 'recusado') acoes.push(`<button class="mini" data-venda-conferir="${esc(c.id)}">🔄 Conferir no Mercado Pago</button>`);
    if (zap) acoes.push(`<a class="mini" target="_blank" rel="noopener" href="https://wa.me/${zap.length <= 11 ? '55' + zap : zap}">💬 WhatsApp</a>`);
    acoes.push(`<button class="mini" data-venda-copiar="${esc(c.email)}">📋 Copiar e-mail</button>`);
    return `<div class="vdIt">
      <div class="vdTop"><b>${esc(c.nome)}</b><span class="vdValor">${real(c.valor)}</span></div>
      <div class="vdLinha"><span class="tag ${st[1]}">${st[0]}</span><small class="mut">${tipo}</small></div>
      <small class="mut vdEmail">${esc(c.email)}${zap ? ' · ' + esc(zap) : ''}</small>
      <small class="mut vdDet">${det.join(' · ')}</small>
      ${c.obs ? `<small class="vdObs">📝 ${esc(c.obs)}</small>` : ''}
      <div class="vdAcoes">${acoes.join('')}</div>
    </div>`;
  }
  function desenhar() {
    const box = $('#vendasBox'); if (!box) return;
    const ok = dados.filter(c => c.status === 'liberado' || c.status === 'pago');
    const total = ok.reduce((s, c) => s + Number(c.valor || 0), 0);
    const ini = new Date(); ini.setDate(1); ini.setHours(0, 0, 0, 0);
    const doMes = ok.filter(c => new Date(c.pago_em || c.criado_em) >= ini);
    const totMes = doMes.reduce((s, c) => s + Number(c.valor || 0), 0);
    const aguard = dados.filter(c => c.status === 'pendente').length;
    const prob = dados.filter(c => c.status === 'conflito').length;
    $('#vendasSub').textContent = ok.length ? `${ok.length} venda(s) liberada(s) · ${real(total)} no total` : 'Compras da Fraternidade Viva pelo Mercado Pago';
    const lista = dados.filter(passa);
    box.innerHTML = `<div class="vdNums">
        <div><b>${ok.length}</b><span>vendas liberadas</span></div>
        <div><b>${real(total)}</b><span>recebido no total</span></div>
        <div><b>${real(totMes)}</b><span>${doMes.length} venda(s) este mês</span></div>
        <div><b>${aguard}</b><span>aguardando pagamento</span></div>
      </div>
      ${prob ? `<p class="vdAlerta">⚠️ ${prob} compra(s) paga(s) precisam de ajuste: o e-mail já tinha cadastro em outra loja. Veja em "Com problema" e acerte o usuário em Admin → Usuários.</p>` : ''}
      <div class="vdFiltro">${FILTROS.map(([k, t]) => `<button class="${k === filtro ? 'on' : ''}" data-venda-filtro="${k}">${t}</button>`).join('')}</div>
      ${lista.length ? lista.map(itemHTML).join('') : '<p class="mut small">Nenhuma compra neste filtro.</p>'}
      <p class="mut small" style="margin-top:10px">Valores brutos, antes da taxa do Mercado Pago. Os pedidos "aguardando" que não forem pagos expiram sozinhos no Mercado Pago. Devolução: no Mercado Pago, em Atividade → a venda → Devolver.</p>`;
  }
  async function carregar() {
    const sb = SB(), box = $('#vendasBox'); if (!sb || !box || ACC().papel !== 'admin') return;
    const [r, s] = await Promise.all([
      sb.from('fv_compras').select('*').order('criado_em', { ascending: false }).limit(200),
      sb.from('stores').select('id,name')
    ]);
    if (r.error) { box.innerHTML = '<p class="msg small">Não foi possível carregar agora: ' + esc(r.error.message) + '</p>'; return; }
    dados = r.data || []; lojas = {}; (s.data || []).forEach(x => { lojas[x.id] = x.name; });
    carregado = true; desenhar();
  }
  async function conferir(id, btn) {
    const sb = SB(); if (!sb) return;
    btn.disabled = true; btn.textContent = '⏳ Conferindo…';
    try { await sb.functions.invoke('fv-compra', { body: { acao: 'status', id } }); } catch (e) {}
    await carregar();
  }
  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'vendasCard' && e.target.open) carregar(); }, true);
  document.addEventListener('click', e => {
    const f = e.target.closest('[data-venda-filtro]'); if (f) { filtro = f.dataset.vendaFiltro; desenhar(); return; }
    const c = e.target.closest('[data-venda-conferir]'); if (c) { conferir(c.dataset.vendaConferir, c); return; }
    const cp = e.target.closest('[data-venda-copiar]');
    if (cp) { try { navigator.clipboard.writeText(cp.dataset.vendaCopiar); cp.textContent = '✓ Copiado'; setTimeout(() => { cp.textContent = '📋 Copiar e-mail'; }, 1500); } catch (x) {} return; }
    if (e.target.id === 'vendasAtualizar') { e.preventDefault(); carregar(); }
    if (e.target.closest('.tabs button[data-tab="admin"]')) setTimeout(carregar, 80);
  });
  window.CA_carregarVendas = carregar;
})();
