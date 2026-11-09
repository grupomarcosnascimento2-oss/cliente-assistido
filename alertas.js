/* Cliente Assistido – Central de alertas do Módulo de Treinamento (1.73.0, pedido do Marcos em 09/11/2026).
   Menu "Alertas" logo depois do "Hoje" no #tabsCurso, para o dono e para a equipe (aluno/funcionário).
   Junta os principais informativos. 1º tipo: Orientação rápida publicada (orientacoes.js → window.CA_orientAlertas).
   Para criar outros tipos (ex.: urgências), registre uma fonte: window.CA_alertasFonte(() => [{ id, ico, nivel: 'info'|'atencao'|'urgente'|'ok',
   titulo, texto, em (ISO), pendente (bool), exige (bool: a pessoa precisa agir; conta no número do menu até resolver), acao: { rotulo, fn } }]).
   O número vermelho do menu = alertas ainda não vistos + os que exigem ação. Vistos ficam em localStorage ca_alertas_vistos:<email>. */
'use strict';
(function () {
  const FONTES = [];
  window.CA_alertasFonte = f => { if (typeof f === 'function') FONTES.push(f); };
  const ACC = () => window.CA_ACCESS || {};
  const chave = () => 'ca_alertas_vistos:' + String(ACC().email || '').toLowerCase();
  const escH = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const dataBR = d => d ? new Date(d).toLocaleDateString('pt-BR') : '';
  const lerVistos = () => { try { return new Set(JSON.parse(localStorage.getItem(chave()) || '[]')); } catch (e) { return new Set(); } };
  const gravarVistos = s => { try { localStorage.setItem(chave(), JSON.stringify([...s].slice(-300))); } catch (e) { /* sem espaço: segue */ } };
  const ehDono = () => ['lojista', 'admin'].includes(ACC().papel);
  let lista = [];

  function coletar() {
    const todas = [];
    const fontes = FONTES.slice(); if (window.CA_orientAlertas) fontes.unshift(window.CA_orientAlertas);
    fontes.forEach(f => { try { (f() || []).forEach(a => a && a.id && todas.push(a)); } catch (e) { /* uma fonte com erro não derruba as outras */ } });
    const peso = a => a.nivel === 'urgente' ? 0 : a.exige ? 1 : 2;
    todas.sort((a, b) => peso(a) - peso(b) || String(b.em || '').localeCompare(String(a.em || '')));
    return todas;
  }

  function atualizar() {
    lista = coletar();
    const vistos = lerVistos();
    const n = lista.filter(a => a.exige || !vistos.has(a.id)).length;
    const tab = document.querySelector('#tabsCurso [data-curso="alertas"]');
    if (tab) tab.innerHTML = 'Alertas' + (n ? ` <i class="orPonto">${n}</i>` : '');
  }

  function render(box) {
    lista = coletar();
    const vistos = lerVistos();
    const itens = lista.map((a, i) => `<div class="alIt al-${escH(a.nivel || 'info')}${a.exige ? ' exige' : ''}">
        <div class="alTop"><span class="alIco" aria-hidden="true">${a.ico || '🔔'}</span>
          <span class="alTags">${!vistos.has(a.id) ? '<em class="alNovo">Novo</em>' : ''}${a.nivel === 'urgente' ? '<em class="alUrg">Urgente</em>' : ''}${a.pendente ? '<em class="alPend">Pendente</em>' : '<em class="alOk">✓ Em dia</em>'}</span>
          <small class="mut">${dataBR(a.em)}</small></div>
        <b class="alTit">${escH(a.titulo)}</b>
        ${a.texto ? `<p class="alTx">${escH(a.texto)}</p>` : ''}
        ${a.acao ? `<button class="trEqBtn${a.exige ? '' : ' sec'}" data-al-acao="${i}">${escH(a.acao.rotulo)}</button>` : ''}
      </div>`).join('');
    box.innerHTML = `<div class="card alCard"><h3 class="alTitulo">🔔 Alertas</h3>
      <p class="mut small">${ehDono() ? 'Os principais avisos sobre o treinamento da sua equipe.' : 'Os avisos importantes da loja para você. O que estiver pendente pede uma ação sua.'}</p>
      ${itens || '<p class="mut alVazio">Nenhum alerta por enquanto. Quando houver uma orientação nova da loja ou algo importante, aparece aqui.</p>'}</div>`;
    lista.forEach(a => vistos.add(a.id)); gravarVistos(vistos);
    atualizar();
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-al-acao]'); if (!b) return;
    const a = lista[+b.dataset.alAcao]; if (a && a.acao && a.acao.fn) a.acao.fn();
  });
  window.CA_alertasRender = render;
  window.CA_alertasAtualizar = atualizar;
})();
