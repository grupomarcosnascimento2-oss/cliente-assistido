/* Cliente Assistido – Roteiro de implantação na tela Hoje (versão 1.15.0).
   Lista os primeiros passos da loja, marca sozinho o que já foi feito e leva até a tela de cada passo.
   Estado guardado em S.implantacao = { pulos: {passo: data}, oculto: bool, concluido: data }. */
'use strict';
(function () {
  const ACC = () => window.CA_ACCESS || {};
  const LOJA = () => ACC().loja || {};
  const ST = () => { S.implantacao = S.implantacao || { pulos: {} }; S.implantacao.pulos = S.implantacao.pulos || {}; return S.implantacao; };
  const dono = () => ['lojista', 'admin'].includes(ACC().papel);
  const algumEnvio = () => Object.keys(S.sentLog || {}).length > 0 || S.contacts.some(c => c.opened && Object.keys(c.opened).length);

  // Cada passo: quem vê (mostra), quando está feito (feito), para onde leva (aba + cartão) e se pode pular.
  function passos() {
    const p = PACOTE(), item = p && p.item;
    return [
      { k: 'loja', t: 'Confira os dados da loja', d: 'Nome, cidade, WhatsApp e responsável. O ramo liga os recursos certos para você.',
        mostra: dono, feito: () => !!(LOJA().cidade && LOJA().whatsapp), aba: 'mais', alvo: '#lojaCard', pula: true },
      { k: 'instalar', t: 'Instale o app no celular', d: 'Assim ele abre pelo ícone na tela inicial, como um aplicativo, e o lembrete diário funciona também no iPhone.',
        mostra: () => !!window.CA_INSTALAR, feito: () => window.CA_INSTALAR.instalado(), aba: 'mais', alvo: '#instalarCard', pula: true },
      { k: 'contatos', t: 'Traga seus contatos', d: 'Pelo Google Contatos, pela agenda do celular ou por arquivo. Só quem já conhece a loja.',
        mostra: () => true, feito: () => S.contacts.length > 0, aba: 'contatos', alvo: '#contatos .card' },
      { k: 'veiculos', t: item ? `Cadastre os dados de cada ${item.rotulo.toLowerCase()}` : '', d: 'Importe a planilha do sistema da oficina (placa, modelo e datas de serviço) ou preencha a ficha 🚗 de cada cliente. É o que gera os avisos de vencimento.',
        mostra: () => !!item && ligado('veiculo'), feito: () => S.contacts.some(c => c.veic && Object.keys(c.veic).length), aba: 'contatos', alvo: '#contatos .card', pula: true },
      { k: 'campanha', t: 'Escolha a primeira campanha', d: 'Comece por um modelo pronto: ele já vem com público, datas e 5 mensagens. Depois é só revisar e salvar.',
        mostra: () => true, feito: () => S.campaigns.some(c => c.tpl || c.salva || c.aprov) || algumEnvio(), aba: 'campanha', alvo: '#btnModelo' },
      { k: 'envio', t: 'Faça o primeiro envio', d: 'Em "Enviar hoje", toque em Abrir / Enviar: o WhatsApp abre com a mensagem pronta e você só confere e envia.',
        mostra: () => true, feito: algumEnvio, aba: 'hoje', alvo: '#listaHoje' },
      { k: 'lembrete', t: 'Ative o lembrete diário', d: 'Uma notificação por dia, no horário que você escolher, avisando quem está esperando mensagem.',
        mostra: () => true, feito: () => !!window.CA_LEMBRETE_ON || !!ST().lembrete, aba: 'mais', alvo: '#lembreteCard', pula: true },
      { k: 'equipe', t: 'Cadastre a sua equipe', d: 'Quem vai usar o app com você entra com a própria conta Google. Você pode desativar quando quiser.',
        mostra: () => dono() && (LOJA().aparelhos || 1) > 1, feito: () => (window.CA_EQUIPE_ATIVOS || 0) > 1, aba: 'mais', alvo: '#equipeCard', pula: true },
      { k: 'backup', t: 'Ligue o backup automático', d: 'Seus contatos ficam guardados com segurança e a mesma lista aparece para toda a equipe e no notebook.',
        mostra: () => dono() && LOJA().plano !== 'premium', feito: () => !!LOJA().sync || !!($('#syncOn') && $('#syncOn').checked), aba: 'mais', alvo: '#syncCard', pula: true }
    ].filter(x => x.mostra());
  }

  function render() {
    const card = $('#implCard'); if (!card) return;
    const st = ST(), papel = ACC().papel;
    if (!papel || papel === 'funcionario' || st.oculto) { card.classList.add('hide'); return; }
    const lista = passos();
    // Lembrete ligado neste aparelho: guarda para não voltar a pedir no notebook.
    if (window.CA_LEMBRETE_ON && !st.lembrete) { st.lembrete = today(); save(); }
    const estado = x => x.feito() ? 'feito' : st.pulos[x.k] ? 'pulado' : 'falta';
    const falta = lista.filter(x => estado(x) === 'falta');
    const prontos = lista.length - falta.length;
    if (!falta.length && !st.concluido) { st.concluido = today(); save(); if (window.CA_log) window.CA_log('implantacao_concluida', {}); }
    const prox = falta[0];
    card.classList.remove('hide');
    card.innerHTML = `
      <div class="implTop"><h3>🚀 Primeiros passos</h3><span class="implN">${prontos} de ${lista.length}</span></div>
      <div class="implBar" role="progressbar" aria-valuemin="0" aria-valuemax="${lista.length}" aria-valuenow="${prontos}"><i style="width:${Math.round(prontos / lista.length * 100)}%"></i></div>
      ${falta.length ? '<p class="mut small">Siga na ordem. Cada passo é marcado sozinho quando você termina.</p>' : '<p class="msg small"><b>Implantação concluída!</b> A loja está pronta. Agora é manter o ritmo: alguns envios por dia, sempre para quem conhece a loja.</p>'}
      <ol class="implLista">${lista.map(x => {
        const e = estado(x), atual = x === prox;
        return `<li class="impl-${e}${atual ? ' atual' : ''}">
          <span class="implIc" aria-hidden="true">${e === 'feito' ? '✓' : e === 'pulado' ? '–' : ''}</span>
          <div class="implTx"><b>${esc(x.t)}</b>${e === 'pulado' ? ' <small class="mut">(pulado)</small>' : ''}
            ${atual ? `<p class="small mut">${esc(x.d)}</p>` : ''}
            ${e !== 'feito' ? `<div class="implBt">${atual ? `<button class="primary" data-impl-ir="${x.k}">Fazer agora</button>` : `<button class="linkbtn" data-impl-ir="${x.k}">Fazer agora</button>`}
              ${x.pula && e === 'falta' ? `<button class="linkbtn" data-impl-pular="${x.k}">Pular</button>` : ''}
              ${e === 'pulado' ? `<button class="linkbtn" data-impl-volta="${x.k}">Voltar para a lista</button>` : ''}</div>` : ''}
          </div></li>`;
      }).join('')}</ol>
      <div class="implPe">${falta.length ? '<button class="linkbtn" data-impl-ocultar="1">Ocultar roteiro</button>' : '<button data-impl-ocultar="1">Ocultar roteiro</button>'}</div>`;
    const reabrir = $('#implReabrir'); if (reabrir) reabrir.classList.add('hide');
  }

  function ir(k) {
    const x = passos().find(p => p.k === k); if (!x) return;
    const tab = document.querySelector(`.tabs button[data-tab="${x.aba}"]`); if (tab) tab.click();
    setTimeout(() => {
      const el = $(x.alvo); if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const c = el.closest('.card') || el;
      c.classList.remove('implFlash'); void c.offsetWidth; c.classList.add('implFlash');
    }, 80);
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-impl-ir],[data-impl-pular],[data-impl-volta],[data-impl-ocultar],#implReabrir');
    if (!b) return;
    const st = ST();
    if (b.dataset.implIr) ir(b.dataset.implIr);
    else if (b.dataset.implPular) { st.pulos[b.dataset.implPular] = today(); save(); render(); }
    else if (b.dataset.implVolta) { delete st.pulos[b.dataset.implVolta]; save(); render(); }
    else if (b.dataset.implOcultar) {
      st.oculto = true; save(); render();
      const r = $('#implReabrir'); if (r) r.classList.remove('hide');
    } else if (b.id === 'implReabrir') { st.oculto = false; save(); document.querySelector('.tabs button[data-tab="hoje"]').click(); render(); window.scrollTo(0, 0); }
  });

  window.CA_renderImpl = function () {
    try { render(); } catch (e) { /* o roteiro nunca pode travar a tela Hoje */ }
    const r = $('#implReabrir'), st = S.implantacao || {}, papel = ACC().papel;
    if (r) r.classList.toggle('hide', !(st.oculto && papel && papel !== 'funcionario'));
  };
  window.CA_renderImpl();
})();
