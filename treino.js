/* Cliente Assistido – Treino de atendimento (versão 1.26.0).
   Recurso opcional por loja ('treino', começa desligado; só o admin liga).
   Funcionário, dono e admin fazem a trilha na aba Treino: ouvir, ver o cartão, ler, desafio do dia e pergunta.
   A resposta certa conclui a lição e libera a próxima. Progresso: neste aparelho (ca_treino:<email>) e no servidor
   (tabela training_progress), para o dono acompanhar a equipe em Mais → Treinamento da equipe.
   Áudio: arquivo gravado quando houver (licao.audio); sem arquivo, a voz do próprio celular lê o roteiro. */
'use strict';
(function () {
  const T = () => window.CA_TRILHA1;
  const ACC = () => window.CA_ACCESS || {};
  const LOJA = () => ACC().loja || {};
  const SB = () => window.CA_SB;
  const pode = () => ['lojista', 'funcionario', 'admin'].includes(ACC().papel) && typeof ligado === 'function' && ligado('treino');
  const dono = () => ['lojista', 'admin'].includes(ACC().papel);
  const chave = () => 'ca_treino:' + (ACC().email || 'anon');
  const lerP = () => { try { return JSON.parse(localStorage.getItem(chave()) || '{}'); } catch (e) { return {}; } };
  const gravarP = p => { try { localStorage.setItem(chave(), JSON.stringify(p)); } catch (e) {} };
  const prog = () => { const p = lerP(); p.feitas = p.feitas || {}; return p; };
  const feitas = () => Object.keys(prog().feitas).length;
  const hojeBR = () => new Date().toLocaleDateString('pt-BR');
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let aberta = null; // número da lição aberta

  // Sincroniza com o servidor o que foi feito neste aparelho (e traz o que foi feito em outro aparelho).
  async function sincronizar() {
    const sb = SB(), loja = LOJA(), email = ACC().email; if (!sb || !loja.id || !email) return;
    try {
      const { data } = await sb.from('training_progress').select('licao,done_at').eq('store_id', loja.id).eq('user_email', email).eq('trilha', T().id);
      const p = prog(); let mudou = false;
      (data || []).forEach(r => { if (!p.feitas[r.licao]) { p.feitas[r.licao] = r.done_at.slice(0, 10); mudou = true; } });
      if (mudou) { gravarP(p); render(); }
      const noServ = new Set((data || []).map(r => r.licao));
      const faltam = Object.keys(p.feitas).filter(n => !noServ.has(+n));
      if (faltam.length) await sb.from('training_progress').upsert(faltam.map(n => ({ store_id: loja.id, user_email: email, user_name: ACC().nome || null, trilha: T().id, licao: +n })), { onConflict: 'store_id,user_email,trilha,licao', ignoreDuplicates: true });
    } catch (e) { /* sem internet: fica no aparelho e envia depois */ }
  }

  function render() {
    const tab = document.querySelector('.tabs button[data-tab="treino"]');
    const ok = pode() && !!T();
    if (tab) tab.classList.toggle('hide', !ok);
    renderEquipe();
    const box = $('#treinoBox'); if (!box || !ok) return;
    if (aberta) return renderLicao(aberta);
    const p = prog(), n = feitas(), tot = T().licoes.length, prox = T().licoes.find(l => !p.feitas[l.n]);
    box.innerHTML = `
      <div class="card">
        <h3>🎓 ${esc(T().nome)}</h3>
        <p class="mut small">${tot} lições curtas, de 5 a 7 minutos. Uma por dia: ouça, veja o cartão, leia, faça o desafio e responda a pergunta.</p>
        <div class="rodBar"><i style="width:${Math.round(n * 100 / tot)}%"></i></div>
        <p class="small" style="margin:6px 0 0"><b>${n} de ${tot}</b> lições concluídas</p>
        ${prox ? `<button class="primary big" style="margin-top:10px" data-tr-abrir="${prox.n}">${n ? 'Continuar' : 'Começar'}: lição ${prox.n}</button>`
          : `<p class="rodOk">Trilha concluída! 🎉</p><button class="primary big" data-tr-cert="1">Ver meu certificado</button>`}
      </div>
      <div class="card"><h3>Lições</h3>${T().licoes.map(l => {
        const f = p.feitas[l.n], liberada = l.n === 1 || p.feitas[l.n - 1];
        return `<div class="it trIt${f ? ' feita' : ''}"><div class="t"><b>${l.n}. ${esc(l.t)}</b><small>${f ? '✓ concluída' : liberada ? 'disponível' : '🔒 conclua a lição anterior'}</small></div>
          ${liberada ? `<button data-tr-abrir="${l.n}">${f ? 'Rever' : 'Abrir'}</button>` : ''}</div>`;
      }).join('')}</div>`;
  }

  function embaralhar(l) { // ordem das opções muda a cada vez, a certa não fica sempre no mesmo lugar
    return l.opcoes.map((t, i) => ({ t, i })).sort(() => Math.random() - .5);
  }
  function renderLicao(n) {
    const l = T().licoes.find(x => x.n === n); if (!l) { aberta = null; return render(); }
    const f = prog().feitas[n];
    const audio = l.audio ? `<audio controls preload="none" src="${esc(l.audio)}" style="width:100%"></audio>`
      : ('speechSynthesis' in window ? `<div class="row wrap"><button class="primary" data-tr-ouvir="${n}">▶️ Ouvir a lição</button><button class="hide" data-tr-parar="1">⏹ Parar</button></div>`
        : '<p class="mut small">Este celular não lê em voz alta. Leia o texto abaixo.</p>');
    $('#treinoBox').innerHTML = `
      <div class="card trLicao">
        <button class="linkbtn" data-tr-voltar="1">← Voltar às lições</button>
        <p class="mut small" style="margin:6px 0 0">Lição ${n} de ${T().licoes.length}</p>
        <h3 style="margin-top:2px">${esc(l.t)}</h3>
        <h4 class="trPasso">🎧 Ouça</h4>${audio}
        <details class="trRot"><summary>Ver o texto do áudio</summary><p class="small">${esc(l.roteiro)}</p></details>
        <h4 class="trPasso">🖼️ Veja</h4>
        <div class="trCartao"><span>“${esc(l.cartao)}”</span><small>${esc(T().nome)} · Cliente Assistido</small></div>
        <h4 class="trPasso">📖 Leia</h4><ul class="trLer">${l.ler.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h4 class="trPasso">✅ Faça hoje</h4><p class="trDesafio">${esc(l.desafio)}</p>
        <h4 class="trPasso">❓ Responda</h4><p><b>${esc(l.pergunta)}</b></p>
        <div class="trOpc">${embaralhar(l).map(o => `<button data-tr-resp="${n}:${o.i}">${esc(o.t)}</button>`).join('')}</div>
        <p class="small" id="trMsg">${f ? '✓ Você já concluiu esta lição.' : ''}</p>
      </div>`;
  }

  function concluir(n) {
    const p = prog();
    if (!p.feitas[n]) {
      p.feitas[n] = new Date().toISOString().slice(0, 10);
      if (Object.keys(p.feitas).length === T().licoes.length && !p.concluiu) p.concluiu = p.feitas[n];
      gravarP(p);
      if (window.CA_log) window.CA_log('treino_licao', { licao: n, titulo: T().licoes[n - 1].t });
      sincronizar();
    }
  }

  function certificado() {
    const p = prog(), nome = ACC().nome || ACC().email || '', loja = LOJA().nome || '';
    const data = p.concluiu ? p.concluiu.split('-').reverse().join('/') : hojeBR();
    const w = window.open('', '_blank'); if (!w) return alert('Libere as janelas pop-up deste site para ver o certificado.');
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificado · Cliente Assistido</title>
      <style>body{margin:0;background:#f3f5f4;font-family:Georgia,"Times New Roman",serif;color:#14201b}.c{max-width:760px;margin:24px auto;background:#fff;border:10px double #0A8F52;padding:40px 32px;text-align:center}
      h1{font-size:30px;margin:0 0 4px;color:#0B2545;letter-spacing:1px}h2{font-size:26px;margin:18px 0}p{font-size:17px;line-height:1.6;margin:8px 0}.m{color:#64706a;font-size:14px}
      button{font:16px sans-serif;padding:10px 16px;margin:12px;border-radius:8px;border:1px solid #0A8F52;background:#0A8F52;color:#fff}@media print{button{display:none}body{background:#fff}.c{margin:0}}</style></head>
      <body><div style="text-align:center"><button onclick="print()">Imprimir ou salvar em PDF</button></div><div class="c">
      <p class="m">CLIENTE ASSISTIDO · TREINAMENTO DE ATENDIMENTO</p><h1>CERTIFICADO</h1><p>Certificamos que</p><h2>${esc(nome)}</h2>
      <p>${loja ? 'da loja <b>' + esc(loja) + '</b>, ' : ''}concluiu a trilha <b>${esc(T().nome)}</b>,<br>com carga horária de ${T().horas} horas, em ${esc(data)}.</p>
      <p class="m" style="margin-top:28px">Quem é lembrado, vende mais.</p></div></body></html>`);
    w.document.close();
  }

  /* ---------- Dono: Treinamento da equipe (Mais) ---------- */
  async function renderEquipe() {
    const card = $('#treinoEquipe'); if (!card) return;
    const mostra = dono() && ligado('treino');
    card.classList.toggle('hide', !mostra); if (!mostra || !card.open) return;
    const sb = SB(), loja = LOJA(); const box = $('#treinoEqLista');
    if (!sb || !loja.id) { box.innerHTML = '<p class="mut small">Sem conexão agora.</p>'; return; }
    const { data, error } = await sb.from('training_progress').select('user_email,user_name,licao,done_at').eq('store_id', loja.id).eq('trilha', T().id);
    if (error) { box.innerHTML = '<p class="mut small">Não foi possível carregar agora.</p>'; return; }
    const por = {};
    (data || []).forEach(r => { const k = r.user_email; por[k] = por[k] || { nome: r.user_name || k.split('@')[0], n: 0, ult: '' }; por[k].n++; if (r.done_at > por[k].ult) por[k].ult = r.done_at; });
    const tot = T().licoes.length, lista = Object.values(por).sort((a, b) => b.n - a.n);
    box.innerHTML = lista.length ? lista.map(u => `<div class="it"><div class="t"><b>${esc(u.nome)}</b><small>${u.n >= tot ? '🎓 concluiu a trilha' : `${u.n} de ${tot} lições`} · última em ${new Date(u.ult).toLocaleDateString('pt-BR')}</small>
        <div class="rodBar"><i style="width:${Math.round(u.n * 100 / tot)}%"></i></div></div></div>`).join('')
      : '<p class="mut small">Ninguém da equipe começou ainda. A aba Treino aparece para todos da loja.</p>';
  }

  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'treinoEquipe' && e.target.open) renderEquipe(); }, true);
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-tr-abrir]');
    if (a) { aberta = +a.dataset.trAbrir; renderLicao(aberta); window.scrollTo(0, 0); return; }
    if (e.target.closest('[data-tr-voltar]')) { pararVoz(); aberta = null; render(); window.scrollTo(0, 0); return; }
    if (e.target.closest('[data-tr-cert]')) { certificado(); return; }
    const o = e.target.closest('[data-tr-ouvir]');
    if (o) { falar(T().licoes[+o.dataset.trOuvir - 1].roteiro); return; }
    if (e.target.closest('[data-tr-parar]')) { pararVoz(); return; }
    const r = e.target.closest('[data-tr-resp]');
    if (r) {
      const [n, i] = r.dataset.trResp.split(':').map(Number), l = T().licoes[n - 1];
      document.querySelectorAll('.trOpc button').forEach(b => b.classList.remove('certa', 'errada'));
      if (i === l.certa) {
        r.classList.add('certa'); concluir(n);
        const prox = T().licoes.find(x => !prog().feitas[x.n]);
        $('#trMsg').innerHTML = `<span class="rodOk">Isso mesmo! 👏 Lição ${n} concluída.</span> ` + (prox ? `<button class="primary" data-tr-abrir="${prox.n}">Próxima lição</button>` : `<button class="primary" data-tr-cert="1">🎓 Ver meu certificado</button>`);
      } else { r.classList.add('errada'); $('#trMsg').textContent = 'Quase! Releia os pontos acima e tente de novo.'; }
    }
  });

  // Voz do celular (quando a lição não tem áudio gravado)
  function falar(txt) {
    if (!('speechSynthesis' in window)) return;
    pararVoz();
    const u = new SpeechSynthesisUtterance(txt); u.lang = 'pt-BR'; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find(x => /pt[-_]BR/i.test(x.lang)); if (v) u.voice = v;
    const parar = document.querySelector('[data-tr-parar]'); if (parar) parar.classList.remove('hide');
    u.onend = () => { const b = document.querySelector('[data-tr-parar]'); if (b) b.classList.add('hide'); };
    speechSynthesis.speak(u);
  }
  function pararVoz() { if ('speechSynthesis' in window) speechSynthesis.cancel(); const b = document.querySelector('[data-tr-parar]'); if (b) b.classList.add('hide'); }

  window.CA_renderTreino = function () { try { render(); } catch (e) { /* o treino nunca pode travar o app */ } };
  document.addEventListener('click', e => { if (e.target.closest('.tabs button[data-tab="treino"]')) { aberta = null; render(); sincronizar(); } else if (e.target.closest('.tabs button')) pararVoz(); });
  window.CA_renderTreino();
})();
