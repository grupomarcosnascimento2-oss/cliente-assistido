/* Cliente Assistido – Menu da aba Mais (1.71.0, pedido do Marcos em 09/11/2026).
   A aba Mais tinha muitos blocos e era preciso rolar para achar. Agora, ao entrar em Mais, aparece o menu (☰ Mais opções)
   com um item por bloco; escolhendo um item, só aquele bloco aparece, já aberto. Tocar no título do menu abre/fecha a lista.
   FIXOS = blocos que continuam sempre à mostra no painel, fora do menu (hoje só o curso Cliente Encantado). Para tirar um item
   do menu e deixá-lo fixo no painel, basta colocar o id dele em FIXOS. Blocos escondidos (.hide) não entram no menu.
   Quem abre um bloco por código (roteiro, ?ver=relatorio...) continua funcionando: abrir um bloco do menu o seleciona.
   No módulo do curso (body.modoTreino) o menu não é usado. */
'use strict';
(function () {
  const FIXOS = ['treinoCard'];
  const EXTRA = { dashCard: { tit: '📈 Resultados', sub: 'Envios, respostas e funil dos últimos dias' } };
  const mais = () => document.getElementById('mais');
  const menu = () => document.getElementById('maisMenu');
  let sel = null, aberto = true, desenhando = false;

  const ativo = () => !!mais() && !!menu() && !document.body.classList.contains('modoTreino') && !document.body.classList.contains('modoGestor');
  // Blocos do menu: filhos diretos de #mais com id, cartões (details ou .card), fora dos FIXOS e do próprio menu
  const blocos = () => [...mais().children].filter(el => el.id && el.id !== 'maisMenu' && !FIXOS.includes(el.id) && (el.tagName === 'DETAILS' || el.classList.contains('card')));
  const visivel = el => !el.classList.contains('hide');
  const txt = (el, s) => { const x = el.querySelector(s); return x ? x.textContent.trim() : ''; };
  const info = el => {
    if (EXTRA[el.id]) return EXTRA[el.id];
    if (el.tagName === 'DETAILS') return { tit: txt(el, ':scope>summary .histTit') || txt(el, ':scope>summary'), sub: txt(el, ':scope>summary small') };
    return { tit: txt(el, 'h3') || el.id, sub: txt(el, 'p') };
  };
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function aplicar() {
    if (!mais()) return;
    const on = ativo();
    document.body.classList.toggle('maisComMenu', on);
    if (!on) { mais().querySelectorAll('.maisOculto').forEach(el => el.classList.remove('maisOculto')); return; }
    const lista = blocos();
    if (sel && !lista.some(el => el.id === sel && visivel(el))) sel = null;
    lista.forEach(el => el.classList.toggle('maisOculto', el.id !== sel));
    desenhar(lista);
  }

  function desenhar(lista) {
    desenhando = true;
    const itens = lista.filter(visivel);
    const atual = sel && itens.find(el => el.id === sel);
    const ia = atual ? info(atual) : null;
    menu().innerHTML = `<button class="maisMenuCab" id="maisMenuCab" aria-expanded="${aberto}">
        <span class="maisMenuIco" aria-hidden="true">☰</span>
        <span class="maisMenuTit"><b>${atual ? esc(ia.tit) : 'Mais opções'}</b><small>${atual ? 'Tocar para ver o menu' : 'Escolha o que você quer ver'}</small></span>
        <span class="maisMenuSeta" aria-hidden="true">${aberto ? '▲' : '▼'}</span></button>
      <div class="maisMenuLista${aberto ? '' : ' hide'}" role="menu">
        ${itens.map(el => { const i = info(el); return `<button role="menuitem" class="maisMenuIt${el.id === sel ? ' on' : ''}${el.classList.contains('so-dono') ? ' so-dono' : ''}" data-mais-ir="${el.id}"><b>${esc(i.tit)}</b>${i.sub ? `<small>${esc(i.sub)}</small>` : ''}</button>`; }).join('')}
      </div>`;
    desenhando = false;
  }

  function escolher(id, abrirBloco) {
    const el = document.getElementById(id); if (!el) return;
    sel = id; aberto = false; aplicar();
    if (abrirBloco && el.tagName === 'DETAILS' && !el.open) el.open = true;
    requestAnimationFrame(() => { if (typeof ajustarTextos === 'function') ajustarTextos(); try { const t = document.querySelector('nav.tabs:not(#tabsCurso)'), h = t ? t.getBoundingClientRect().height : 0; scrollTo({ top: menu().getBoundingClientRect().top + scrollY - h - 6, behavior: 'smooth' }); } catch (e) {} });
  }

  // Ao entrar na aba Mais: menu aberto, nenhum bloco escolhido
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tabs button[data-tab="mais"], [data-goto="mais"]');
    if (tab) { sel = null; aberto = true; fecharTodos(); aplicar(); return; }
    if (e.target.closest('#maisMenuCab')) { aberto = !aberto; desenhar(blocos()); return; }
    const it = e.target.closest('[data-mais-ir]');
    if (it) { if (typeof travaDe === 'function' && travaDe(it)) return; escolher(it.dataset.maisIr, true); }
  });
  // Bloco fechado fora do menu: fecha (assim, abrir de novo por código dispara o toggle)
  function fecharTodos() { if (!mais()) return; blocos().forEach(el => { if (el.tagName === 'DETAILS' && el.open) el.open = false; }); }
  // Abriram um bloco por código (roteiro, link ?ver=, outro script): mostra esse bloco
  document.addEventListener('toggle', e => {
    const el = e.target; if (!ativo() || !el.open || !el.parentElement || el.parentElement.id !== 'mais') return;
    if (FIXOS.includes(el.id) || el.id === sel) return;
    escolher(el.id, false);
  }, true);
  // Blocos que aparecem/somem (.hide) ou mudam o subtítulo: atualiza o menu
  let pend = 0;
  const obs = new MutationObserver(() => { if (desenhando || pend) return; pend = requestAnimationFrame(() => { pend = 0; aplicar(); }); });
  function observar() {
    if (!mais()) return;
    blocos().forEach(el => obs.observe(el, { attributes: true, attributeFilter: ['class'] }));
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    aplicar();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observar); else observar();
  window.CA_maisMenu = { aplicar, escolher, FIXOS };
})();
