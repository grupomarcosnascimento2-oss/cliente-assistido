// Cliente Assistido – Contatos de outra loja do grupo (1.57.0).
// Pedido do Marcos para o Supermercado Goiás: a Sede consulta, em Mais, a lista de contatos da Filial.
// As listas NÃO se juntam: cada loja tem o seu número de WhatsApp e envia só para a própria lista
// (evita mandar duas vezes para o mesmo cliente). Aqui é só consulta: sem botão de WhatsApp, sem editar.
// Configuração por loja (admin, pelo banco): stores.recursos.vinculadas = [{ id: '<loja>', nome: 'Filial' }].
// Dados pela rpc contatos_vinculados(p_store) (SECURITY DEFINER: só quem é da loja que tem o vínculo, ou admin).
(function () {
  const $ = s => document.querySelector(s);
  const ACC = () => window.CA_ACCESS || {};
  const POR = 20;
  let lojas = [], cache = {}, sel = null, q = '', lim = POR;
  const semAc = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fone = n => { const d = String(n || '').replace(/\D/g, '').replace(/^55/, ''); return d.length >= 10 ? `(${d.slice(0, 2)}) ${d.slice(2, -4)}-${d.slice(-4)}` : d; };
  const GRP = { novos: 'Novos', frequentes: 'Frequentes', sumidos: 'Sumidos', outros: 'Outros' };
  const niver = b => { const m = String(b || '').match(/(\d{1,2})[\/-](\d{1,2})$|^\d{4}-(\d{2})-(\d{2})$/); if (!m) return ''; return m[1] ? `${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}` : `${m[4]}/${m[3]}`; };

  window.CA_vincIniciar = function () {
    const acc = ACC(), card = $('#vincCard'); if (!card) return;
    lojas = ((acc.loja && acc.loja.recursos && acc.loja.recursos.vinculadas) || []).filter(v => v && v.id);
    const ok = lojas.length && ['lojista', 'funcionario'].includes(acc.papel);
    card.classList.toggle('hide', !ok); if (!ok) return;
    if (!sel || !lojas.some(v => v.id === sel)) sel = lojas[0].id;
    const nome = (lojas.find(v => v.id === sel) || {}).nome || 'outra loja';
    $('#vincTit').textContent = lojas.length > 1 ? '🏬 Contatos das outras lojas' : `🏬 Contatos da ${nome}`;
    $('#vincSub').textContent = cache[sel] ? `${cache[sel].contatos.length} contato(s) · só para consulta` : 'Só para consulta';
    if (card.open) render();
  };

  async function carregar(id, forcar) {
    if (cache[id] && !forcar) return cache[id];
    const sb = window.CA_SB; if (!sb) return { erro: 'sem_conexao' };
    const { data, error } = await sb.rpc('contatos_vinculados', { p_store: id });
    if (error || !data || data.erro) return { erro: (data && data.erro) || 'falhou' };
    cache[id] = { contatos: data.contatos || [], em: new Date() };
    return cache[id];
  }

  async function render(forcar) {
    const box = $('#vincBox'); if (!box) return;
    const v = lojas.find(x => x.id === sel); if (!v) { box.innerHTML = ''; return; }
    if (!cache[sel] || forcar) box.innerHTML = '<p class="mut small">Carregando os contatos…</p>';
    const r = await carregar(sel, forcar);
    if (r.erro) { box.innerHTML = `<p class="mut small">Não foi possível carregar agora${r.erro === 'sem_permissao' ? ' (sem permissão)' : ''}. Tente de novo em instantes.</p>`; return; }
    const termo = semAc(q).trim(), dig = q.replace(/\D/g, '');
    const lista = r.contatos.filter(c => !termo || semAc(c.nome).includes(termo) || (dig.length >= 3 && String(c.num || '').includes(dig)));
    const hora = r.em.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    $('#vincSub').textContent = `${r.contatos.length} contato(s) · só para consulta`;
    box.innerHTML = `
      ${lojas.length > 1 ? `<div class="chips vincLojas">${lojas.map(x => `<button class="chip${x.id === sel ? ' on' : ''}" data-vinc-loja="${esc(x.id)}">${esc(x.nome || 'Loja')}</button>`).join('')}</div>` : ''}
      <p class="vincAviso">👀 Lista da <b>${esc(v.nome || 'outra loja')}</b>, só para consulta. Ela não se junta à sua lista e os envios para estes clientes são feitos pela ${esc(v.nome || 'outra loja')}, pelo número dela.</p>
      <div class="busca"><input id="vincBusca" type="search" placeholder="🔎 Buscar nome ou número" value="${esc(q)}"></div>
      <p class="mut small">${termo ? `${lista.length} encontrado(s)` : `${r.contatos.length} contato(s)`} · atualizado às ${hora} <button class="lnk" data-vinc-atualizar>Atualizar</button></p>
      <div class="vincLista">${lista.slice(0, lim).map(c => `<div class="it"><div class="t"><b>${esc(c.nome || fone(c.num))}</b><small>${[fone(c.num), GRP[c.grupo] || '', c.status === 'saiu' ? '🚫 saiu' : c.status === 'respondeu' ? '💬 respondeu' : '', niver(c.niver) ? '🎂 ' + niver(c.niver) : ''].filter(Boolean).join(' · ')}</small></div></div>`).join('') || '<p class="mut small">Nenhum contato encontrado.</p>'}</div>
      ${lista.length > lim ? `<button class="x-wide" data-vinc-mais>Mostrar mais ${Math.min(POR, lista.length - lim)}</button>` : ''}`;
  }

  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'vincCard' && e.target.open) render(); }, true);
  document.addEventListener('click', e => {
    const l = e.target.closest('[data-vinc-loja]'); if (l) { sel = l.dataset.vincLoja; q = ''; lim = POR; render(); return; }
    if (e.target.closest('[data-vinc-mais]')) { lim += POR; render(); return; }
    if (e.target.closest('[data-vinc-atualizar]')) { render(true); }
  });
  let t = null;
  document.addEventListener('input', e => {
    if (e.target && e.target.id === 'vincBusca') {
      q = e.target.value; lim = POR; clearTimeout(t);
      t = setTimeout(() => { const pos = e.target.selectionStart; render().then(() => { const i = $('#vincBusca'); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (_) {} } }); }, 250);
    }
  });
  if (ACC().papel) window.CA_vincIniciar();
})();
