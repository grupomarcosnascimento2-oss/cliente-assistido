/* Cliente Assistido – IA nas campanhas (1.46.0).
   Na aba Campanha: "✨ Escrever as 5 versões com IA" (usa nome + Objetivo/contexto) e, em cada versão,
   "✨ Refazer com IA" (troca só aquela, com um pedido opcional do tipo "mais curta" ou "mais animada").
   Quem escreve é a edge function ia-campanha (a chave da IA fica só no servidor). Os textos entram nas caixas
   para a pessoa revisar; nada é salvo nem enviado sem ela tocar em Salvar campanha.
   Aparece para o admin sempre e, nas lojas, quando o admin liga o recurso 'ia_campanha' (lojista e operador). */
'use strict';
(function () {
  const papel = () => document.body.dataset.papel || '';
  const lojaId = () => (typeof KEY === 'string' && KEY.indexOf('ca_v1:') === 0) ? KEY.slice(6) : (((window.CA_ACCESS || {}).loja || {}).id || '');
  window.CA_iaOk = () => papel() === 'admin' || (['lojista', 'operador'].includes(papel()) && typeof ligado === 'function' && ligado('ia_campanha'));
  const ERROS = {
    sem_chave: 'A IA ainda não foi configurada no servidor. Fale com o suporte do Cliente Assistido.',
    recurso_desligado: 'A IA não está liberada para esta loja. Fale com o suporte do Cliente Assistido.',
    limite: 'Você usou o limite de textos com IA das últimas 24 horas. Tente de novo mais tarde.',
    sem_objetivo: 'Escreva o Objetivo / contexto da campanha (para quem é, qual a finalidade) antes de usar a IA.',
    sem_permissao: 'Seu usuário não pode usar a IA nesta loja.',
    nao_autorizado: 'Entre de novo no app para usar a IA.'
  };
  const msgErro = e => ERROS[e] || 'A IA não conseguiu responder agora. Tente de novo em instantes.';
  const aviso = t => { if (typeof showMsg === 'function') showMsg('#iaMsg', t); };

  async function pedir(corpo) {
    const sb = window.CA_SB; if (!sb) return { erro: 'nao_autorizado' };
    try {
      const { data, error } = await sb.functions.invoke('ia-campanha', { body: Object.assign({ store_id: lojaId() }, corpo) });
      if (error) return { erro: 'falhou' };
      return data || { erro: 'falhou' };
    } catch (e) { return { erro: 'falhou' }; }
  }
  const caixas = () => [...document.querySelectorAll('#cMsgs [data-msg]')];
  const contexto = () => ({ nome: ($('#cNome') || {}).value || '', objetivo: (($('#cObjetivo') || {}).value || '').trim(), versoes: caixas().map(t => t.value) });
  function preencher(t, txt) { t.value = txt; if (typeof ajustarAltura === 'function') ajustarAltura(t); t.classList.add('iaNova'); setTimeout(() => t.classList.remove('iaNova'), 2500); }
  function ocupado(b, sim, txt) { if (!b) return; b.disabled = sim; if (sim) { b.dataset.txt = b.textContent; b.textContent = txt; } else if (b.dataset.txt) b.textContent = b.dataset.txt; }

  // Mostra/esconde a barra de IA conforme o papel e o recurso (chamado por renderCampanha).
  window.CA_iaRender = function () {
    const bar = $('#iaBar'); if (bar) bar.classList.toggle('hide', !window.CA_iaOk());
  };

  document.addEventListener('click', async e => {
    const b5 = e.target.closest('#btnIA5');
    if (b5) {
      const ctx = contexto();
      if (ctx.objetivo.length < 15) { aviso(ERROS.sem_objetivo); $('#cObjetivo').focus(); return; }
      if (ctx.versoes.some(v => v.trim()) && !confirm('A IA vai escrever 5 versões novas no lugar das mensagens que estão nas caixas. Continuar?')) return;
      ocupado(b5, true, '✨ Escrevendo as 5 versões…'); aviso('A IA está escrevendo. Leva alguns segundos.');
      const r = await pedir({ modo: 'todas', nome: ctx.nome, objetivo: ctx.objetivo, versoes: ctx.versoes });
      ocupado(b5, false);
      if (r.erro || !Array.isArray(r.versoes) || !r.versoes.length) { aviso(msgErro(r.erro)); return; }
      const cx = caixas(); r.versoes.slice(0, cx.length).forEach((t, i) => preencher(cx[i], t));
      aviso('Pronto: 5 versões escritas pela IA. Revise, ajuste do seu jeito e toque em Salvar campanha.' + (r.restantes != null ? ` (restam ${r.restantes} usos de IA nas próximas 24 h)` : ''));
      if (window.CA_log) window.CA_log('ia_campanha', { modo: 'todas', campanha: ctx.nome });
      return;
    }
    const b1 = e.target.closest('[data-ia1]');
    if (b1) {
      const i = +b1.dataset.ia1, ctx = contexto(), t = caixas()[i]; if (!t) return;
      if (ctx.objetivo.length < 15) { aviso(ERROS.sem_objetivo); $('#cObjetivo').focus(); return; }
      const pedido = prompt(`O que você quer mudar na versão ${i + 1}? (opcional)\n\nEx.: mais curta, mais animada, sem emoji, falar do horário de sábado.\nDeixe em branco para a IA escrever outra do jeito dela.`, '');
      if (pedido === null) return;
      ocupado(b1, true, '✨ Escrevendo…');
      const r = await pedir({ modo: 'uma', indice: i, pedido, nome: ctx.nome, objetivo: ctx.objetivo, versoes: ctx.versoes });
      ocupado(b1, false);
      if (r.erro || !Array.isArray(r.versoes) || !r.versoes[0]) { aviso(msgErro(r.erro)); return; }
      preencher(t, r.versoes[0]);
      aviso(`Versão ${i + 1} reescrita pela IA. Revise e toque em Salvar campanha.`);
      if (window.CA_log) window.CA_log('ia_campanha', { modo: 'uma', campanha: ctx.nome });
    }
  });
})();
