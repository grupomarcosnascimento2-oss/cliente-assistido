/* Cliente Assistido – Treino de atendimento (versão 1.26.0; ilustrações na 1.26.1; uma cena por trecho e legenda sincronizada na 1.26.2).
   Recurso opcional por loja ('treino', começa desligado; só o admin liga).
   Funcionário, dono e admin fazem a trilha na aba Treino: ouvir, ver o cartão, ler, desafio do dia e pergunta.
   A resposta certa libera o botão Concluir lição (1.27.0), que conclui e libera a próxima. Dúvidas vão para training_questions. Progresso: neste aparelho (ca_treino:<email>) e no servidor
   (tabela training_progress), para o dono acompanhar a equipe em Mais → Treinamento da equipe.
   Áudio: arquivo gravado quando houver (licao.audio); sem arquivo, a voz do próprio celular lê o roteiro. */
'use strict';
(function () {
  const T = () => window.CA_TRILHA1;
  const ACC = () => window.CA_ACCESS || {};
  const LOJA = () => ACC().loja || {};
  const SB = () => window.CA_SB;
  // 1.32.2: a liberação é feita pelo admin, loja por loja, em Admin → Lojas → Editar → "Curso..." (recurso 'treino', começa desligado).
  // Não há mais lista fixa no código: quem manda é o recurso ligado na loja. (Antes, SO_ADMIN + LOJAS_LIBERADAS travavam a liberação.)
  const liberada = () => true;
  // 1.42.0: além da loja ter o curso (recurso 'treino'), o admin libera usuário por usuário (app_users.treino).
  // O aluno (papel 'aluno') já vem liberado. O admin sempre vê, para acompanhar e testar.
  const lojaTem = () => typeof ligado === 'function' && ligado('treino');
  const pode = () => { const a = ACC(); if (a.papel === 'admin') return true; return liberada() && ['lojista', 'funcionario', 'aluno'].includes(a.papel) && lojaTem() && (!!a.treino || a.papel === 'aluno'); };
  const modoTreino = () => document.body.classList.contains('modoTreino');
  const dono = () => liberada() && ['lojista', 'admin'].includes(ACC().papel);
  const indep = () => !!(LOJA().recursos && LOJA().recursos.independente); // 1.43.0: aluno independente (comprou só o curso, sem loja)
  const diasAcesso = () => { const a = ACC().acesso_ate; if (!a) return null; const h = new Date(); h.setHours(0, 0, 0, 0); return Math.round((new Date(a + 'T00:00:00') - h) / 86400000); };
  const primeiroNome = t => String(t || '').trim().split(/\s+/)[0] || '';
  const chave = () => 'ca_treino:' + (ACC().email || 'anon');
  const lerP = () => { try { return JSON.parse(localStorage.getItem(chave()) || '{}'); } catch (e) { return {}; } };
  const gravarP = p => { try { localStorage.setItem(chave(), JSON.stringify(p)); } catch (e) {} };
  // 1.44.5: progresso zerado a pedido (e-mail → momento do reset). No aparelho, apaga as lições feitas uma vez;
  // do servidor, ignora as lições concluídas antes desse momento (caso uma versão antiga tenha reenviado).
  const ZERAR = { 'grupomarcosnascimento@gmail.com': '2026-10-27T04:00:00Z' };
  const zerarEm = () => ZERAR[String(ACC().email || '').toLowerCase()] || '';
  const prog = () => {
    const p = lerP(); p.feitas = p.feitas || {};
    const z = zerarEm(); if (z && p.zeradoEm !== z) { p.feitas = {}; delete p.concluiu; p.zeradoEm = z; gravarP(p); }
    return p;
  };
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
      (data || []).filter(r => !zerarEm() || r.done_at >= zerarEm()).forEach(r => { if (!p.feitas[r.licao]) { p.feitas[r.licao] = r.done_at.slice(0, 10); mudou = true; } });
      if (mudou) { gravarP(p); render(); }
      const noServ = new Set((data || []).filter(r => !zerarEm() || r.done_at >= zerarEm()).map(r => r.licao));
      const faltam = Object.keys(p.feitas).filter(n => !noServ.has(+n));
      if (faltam.length) await sb.from('training_progress').upsert(faltam.map(n => ({ store_id: loja.id, user_email: email, user_name: ACC().nome || null, trilha: T().id, licao: +n })), { onConflict: 'store_id,user_email,trilha,licao', ignoreDuplicates: true });
    } catch (e) { /* sem internet: fica no aparelho e envia depois */ }
  }

  function render() {
    const card = $('#treinoCard'); // 1.31.0: o Treino é o primeiro bloco da aba Mais
    const ok = pode() && !!T();
    if (card) card.classList.toggle('hide', !ok && !modoTreino());
    renderEquipe();
    const box = $('#treinoBox'); if (!box) return;
    if (!ok) { // 1.42.0: no modo treinamento, explica em vez de mostrar a tela vazia
      if (modoTreino()) box.innerHTML = `<div class="card trBoas"><h3>Olá${primeiroNome(ACC().nome) ? ', ' + esc(primeiroNome(ACC().nome)) : ''}! 👋</h3><p>O Curso Excelência no Atendimento ao Cliente ainda não foi liberado para você. Assim que a liberação for feita, ele aparece aqui.</p><p class="mut small">Dúvidas? Fale com o responsável pela loja.</p></div>`;
      return;
    }
    if (aberta) return renderLicao(aberta);
    const p = prog(), n = feitas(), tot = T().licoes.length, prox = T().licoes.find(l => !p.feitas[l.n]), pct = Math.round(n * 100 / tot);
    const nome = primeiroNome(ACC().nome), loja = indep() ? '' : (LOJA().nome || '').trim(), dAc = diasAcesso();
    // 1.42.0: quem já começou vê o progresso primeiro (botão Continuar à mão); quem está começando vê antes as boas-vindas
    const cBoas = `
      <div class="card trBoas">
        <h3>Olá${nome ? ', ' + esc(nome) : ''}! 👋</h3>
        <p>${indep() ? 'Você decidiu investir em você, e essa é a melhor decisão que um profissional pode tomar.' : `Este curso é um investimento ${loja ? 'da <b>' + esc(loja) + '</b> ' : ''}em você.`} Em ${tot} lições curtas, você aprende a atender de um jeito que faz o cliente voltar, comprar de novo e lembrar do seu nome.</p>
        <h4 class="trPasso">🚀 Por que ele é importante para você</h4>
        <ul class="trPorque">
          <li><span>🌟</span><span><b>Você é lembrado.</b> Quem atende bem é elogiado, procurado pelo nome e indicado pelos clientes.</span></li>
          ${indep() ? '<li><span>💼</span><span><b>Você se destaca no mercado.</b> Atendimento é o que toda loja procura: é diferencial para conseguir uma vaga e para crescer onde você estiver.</span></li><li><span>📄</span><span><b>Seu certificado vale no currículo.</b> Mostra que você se preparou para atender com excelência.</span></li>' : `<li><span>📈</span><span><b>Você cresce${loja ? ' na ' + esc(loja) : ' na empresa'}.</b> Atendimento excelente gera confiança do dono e abre espaço para novas responsabilidades.</span></li>`}
          <li><span>🤝</span><span><b>Seu dia fica mais leve.</b> Saber o que dizer em cada situação, até com o cliente chateado, dá segurança.</span></li>
          <li><span>🎒</span><span><b>É seu para sempre.</b> Saber atender bem é uma habilidade que vai com você para toda a vida profissional.</span></li>
        </ul>
        <div class="trCertMini" ${n >= tot ? 'data-tr-cert="1" role="button"' : ''}>
          <div class="trCertSelo">🏅</div>
          <div><b>${n >= tot ? 'Seu certificado está pronto!' : 'Ao concluir, você recebe um certificado'}</b><small>Certificado de conclusão do Curso Excelência no Atendimento ao Cliente, com 2 horas, o seu nome e a assinatura de Marcos Nascimento.${n >= tot ? ' Toque para ver.' : ''}</small></div>
        </div>
      </div>
`, cProg = `
      <div class="card trProg">
        <h3>📊 Seu progresso</h3>
        <div class="trProgTopo"><b>${pct}%</b><span>${n} de ${tot} lições concluídas</span></div>
        <div class="rodBar"><i style="width:${pct}%"></i></div>
        <div class="trSelos" aria-label="Lições">${T().licoes.map(l => `<span class="${p.feitas[l.n] ? 'ok' : prox && prox.n === l.n ? 'prox' : ''}" title="Lição ${l.n}: ${esc(l.t)}">${p.feitas[l.n] ? '✓' : l.n}</span>`).join('')}</div>
        <p class="small mut" style="margin:8px 0 0">${n >= tot ? 'Parabéns, você concluiu o curso! 🎉' : `Faltam ${tot - n} lição(ões) para o seu certificado. Cada uma leva de 5 a 7 minutos.`}</p>
        ${dAc !== null && ACC().papel !== 'admin' ? `<p class="trAcesso${dAc <= 5 ? ' fim' : ''}">📅 Seu acesso vai até <b>${ACC().acesso_ate.split('-').reverse().join('/')}</b> (${dAc <= 0 ? 'último dia' : 'faltam ' + dAc + ' dia(s)'}).${n < tot ? ' Conclua as lições dentro do prazo para receber o certificado.' : ''}</p>` : ''}
        ${prox ? `<button class="primary big" style="margin-top:10px" data-tr-abrir="${prox.n}">▶ ${n ? 'Continuar' : 'Começar'}: lição ${prox.n}</button>`
          : `<button class="primary big" style="margin-top:10px" data-tr-cert="1">🏅 Ver meu certificado</button>`}
      </div>`;
    box.innerHTML = faixaNoticias(n, tot) + (n ? cProg + cBoas : cBoas + cProg) + `
      ${(T().porque || []).length ? `<div class="card"><h3>📊 Por que este treinamento importa</h3>${quadroPesq([pesqDaVez()])}</div>` : ''}
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
    const audio = l.audio ? `<audio controls preload="none" src="${esc(l.audio)}" style="width:100%" id="trAudio"></audio>`
      : ('speechSynthesis' in window ? `<div class="row wrap"><button class="primary" data-tr-ouvir="${n}">▶️ Ouvir a lição</button><button class="hide" data-tr-parar="1">⏹ Parar</button></div>`
        : '<p class="mut small">Este celular não lê em voz alta. Leia o texto abaixo.</p>');
    $('#treinoBox').innerHTML = `
      <div class="card trLicao">
        <button class="linkbtn" data-tr-voltar="1">← Voltar às lições</button>
        <p class="mut small" style="margin:6px 0 0">Lição ${n} de ${T().licoes.length}</p>
        <h3 style="margin-top:2px">${esc(l.t)}</h3>
        <h4 class="trPasso">🎧 Ouça</h4>${audio}
        <details class="trRot"><summary>Ver o texto do áudio</summary><p class="small">${esc(roteiroDe(l))}</p></details>
        <h4 class="trPasso">🖼️ Veja</h4>
        <div class="trCartao"><span>“${esc(l.cartao)}”</span><small>${esc(T().nome)} · Curso Excelência no Atendimento ao Cliente</small></div>
        ${painelIlus(n)}
        ${videoHTML(n)}
        ${dialogoHTML(n)}
        ${(l.pesquisas || []).length ? `<h4 class="trPasso">📊 O que dizem as pesquisas</h4>${quadroPesq(l.pesquisas)}` : ''}
        <h4 class="trPasso">📖 Leia</h4><ul class="trLer">${l.ler.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h4 class="trPasso">✅ Faça hoje</h4><p class="trDesafio">${esc(l.desafio)}</p>
        <h4 class="trPasso">❓ Responda</h4><p><b>${esc(l.pergunta)}</b></p>
        <div class="trOpc">${embaralhar(l).map(o => `<button data-tr-resp="${n}:${o.i}">${esc(o.t)}</button>`).join('')}</div>
        <p class="small" id="trMsg"></p>
        <div class="trFim">
          <button class="primary big" id="trConcluir" data-tr-concluir="${n}"${f ? ' disabled' : ' disabled'}>${f ? '✓ Lição concluída' : '✔ Concluir lição'}</button>
          <p class="small mut" id="trConclMsg">${f ? 'Você já concluiu esta lição. ' + proxBotao() : 'Acerte a pergunta acima para liberar o botão.'}</p>
        </div>
        <h4 class="trPasso">💬 Ficou com alguma dúvida?</h4>
        <p class="small mut" style="margin-top:0">Escreva aqui o que não ficou claro ou uma situação do seu dia a dia. Sua dúvida vai para a equipe do Cliente Assistido e ajuda a melhorar o treino.</p>
        <textarea class="auto" id="trDuvida" maxlength="1000" rows="3" placeholder="Ex.: e quando o cliente não responde a mensagem?"></textarea>
        <button data-tr-duvida="${n}" style="margin-top:6px">Enviar dúvida</button>
        <p class="small" id="trDuvMsg"></p>
        <div id="trDuvLista"></div>
      </div>`;
    ilusI = 0; ilusIniciar(); minhasDuvidas(n);
  }

  // 1.26.2: painel de ilustrações entre "Veja" e "Leia". Cada trecho da fala tem a sua cena; a legenda embaixo do painel
  // mostra o trecho que o áudio está dizendo. Sem áudio tocando, as cenas passam a cada 7 s, sem legenda.
  let ilusTimer = null, ilusI = 0, falando = false, falaN = 0;
  const falasDe = n => (window.CA_ILUS ? window.CA_ILUS.falas(n) : []);
  const roteiroDe = l => (window.CA_ILUS && window.CA_ILUS.roteiro(l.n)) || l.roteiro;
  function painelIlus(n) {
    const f = falasDe(n); if (!f.length) return '';
    return `<div class="trIlus" data-ilus="${n}" aria-label="Ilustrações da lição">
      <div class="trIlusVia">${f.map((c, i) => `<figure class="trIlusSl${i ? '' : ' on'}">${c.svg}</figure>`).join('')}</div></div>
      <p class="trLeg" id="trLeg" aria-live="polite"><span class="mut">Toque em ▶️ Ouvir a lição: a legenda acompanha o áudio.</span></p>`;
  }
  function ilusMostrar(i) {
    const sl = document.querySelectorAll('.trIlusSl'); if (!sl.length) return;
    ilusI = (i + sl.length) % sl.length; sl.forEach((x, k) => x.classList.toggle('on', k === ilusI));
  }
  function legenda(t) { const el = $('#trLeg'); if (el) el.innerHTML = t ? esc(t) : ''; }
  function ilusIniciar() { clearInterval(ilusTimer); if (document.querySelector('.trIlusSl')) ilusTimer = setInterval(() => { if (!falando && document.visibilityState === 'visible') ilusMostrar(ilusI + 1); }, 7000); }
  function ilusParar() { clearInterval(ilusTimer); ilusTimer = null; }
  function trecho(i) { const f = falasDe(falaN); if (!f[i]) return; ilusMostrar(i); legenda(f[i].t); }

  // 1.28.0: quadro de números de pesquisas, cada um com a fonte (link)
  // 1.42.0: faixa de notícias no topo do painel do curso: frases sobre a importância do treinamento (números com fonte
  // vêm de CA_TRILHA1.porque) e o progresso do próprio aluno. Fica passando sem parar; tocar pausa; com movimento reduzido, fica parada.
  function faixaNoticias(n, tot) {
    const dAc = diasAcesso();
    const itens = [n >= tot ? '🎉 Você concluiu o curso! Seu certificado já está liberado.' : `🏅 Faltam ${tot - n} lição(ões) para o seu certificado.`]
      .concat(dAc !== null && dAc <= 10 && ACC().papel !== 'admin' ? [`📅 Seu acesso termina em ${Math.max(0, dAc)} dia(s): aproveite para concluir as lições.`] : [])
      .concat((T().porque || []).map(x => `📊 ${x.n} ${x.t}`))
      .concat(['🌟 Quem atende bem é lembrado, elogiado e indicado.', '⏱️ Cada lição leva de 5 a 7 minutos: dá para fazer no intervalo.',
        '🤝 Cliente bem atendido volta, compra de novo e traz outros.', '📈 Atender com excelência é a habilidade que todo dono de loja procura.',
        '🎯 Uma lição por dia: em uma semana você termina o curso.']);
    const tx = itens.map(esc).join('<i>•</i>'), seg = Math.max(40, Math.round(itens.join(' ').length / 7));
    return `<div class="trNews" title="Toque para pausar" aria-label="Notícias do curso"><span class="trNewsIc" aria-hidden="true">📰</span>
      <div class="trNewsVia"><div class="trNewsTx" style="animation-duration:${seg}s"><span>${tx}<i>•</i></span><span aria-hidden="true">${tx}<i>•</i></span></div></div></div>`;
  }
  document.addEventListener('click', e => { const f = e.target.closest('.trNews'); if (f) f.classList.toggle('pausada'); });
  function quadroPesq(lista) {
    return `<div class="trPesq">${lista.map(p => `<div class="trPesqIt"><b>${esc(p.n)}</b><div><p>${esc(p.t)}</p><small>Fonte: ${p.u
      ? `<a href="${esc(p.u)}" target="_blank" rel="noopener">${esc(p.f)}</a>` : esc(p.f)}</small></div></div>`).join('')}</div>`;
  }
  // 1.28.2: na tela inicial aparece uma pesquisa por vez; troca a cada abertura do app e a cada volta para a lista.
  let pesqI = null;
  function pesqDaVez(avancar) {
    const l = T().porque, k = 'ca_tr_pesq';
    if (pesqI === null || avancar) {
      let i = 0; try { i = +localStorage.getItem(k) || 0; } catch (e) {}
      pesqI = i % l.length;
      try { localStorage.setItem(k, String((pesqI + 1) % l.length)); } catch (e) {}
    }
    return l[pesqI];
  }
  function proxBotao() {
    const prox = T().licoes.find(x => !prog().feitas[x.n]);
    return prox ? `<button class="primary" data-tr-abrir="${prox.n}">Próxima lição</button>` : `<button class="primary" data-tr-cert="1">🎓 Ver meu certificado</button>`;
  }

  /* ---------- 1.27.0: dúvidas dos alunos (tabela training_questions) ----------
     FUTURO (decisão do Marcos, 24/10/2026): a IA de suporte do Cliente Assistido vai responder estas dúvidas.
     Colunas resposta, respondida_em e respondida_por ('ia') já existem na tabela; a integração será feita na hora certa. */
  async function enviarDuvida(n) {
    const el = $('#trDuvida'), msg = $('#trDuvMsg'), texto = (el.value || '').trim();
    if (texto.length < 3) { msg.textContent = 'Escreva a sua dúvida antes de enviar.'; return; }
    const sb = SB(), loja = LOJA();
    if (!sb || !loja.id) { msg.textContent = 'Sem conexão agora. Sua dúvida ficou no campo; tente de novo daqui a pouco.'; return; }
    msg.textContent = 'Enviando...';
    const { error } = await sb.from('training_questions').insert({ store_id: loja.id, user_email: ACC().email, user_name: ACC().nome || null, trilha: T().id, licao: n, texto });
    if (error) { msg.textContent = 'Não foi possível enviar agora. Sua dúvida ficou no campo; tente de novo.'; return; }
    el.value = ''; if (window.ajustarAltura) window.ajustarAltura(el);
    msg.innerHTML = '<span class="rodOk">Dúvida enviada, obrigado! 🙌</span>';
    if (window.CA_log) window.CA_log('treino_duvida', { licao: n });
    minhasDuvidas(n);
  }
  function duvidaHTML(d, comQuem) {
    const quando = new Date(d.created_at).toLocaleDateString('pt-BR');
    const quem = comQuem ? `<b>${esc(d.user_name || (d.user_email || '').split('@')[0])}</b>${d.stores && d.stores.name ? ' · ' + esc(d.stores.name) : ''} · lição ${d.licao} · ` : '';
    return `<div class="trDuv"><small class="mut">${quem}${quando}</small><p>${esc(d.texto)}</p>${d.resposta
      ? `<p class="trResp"><b>Resposta:</b> ${esc(d.resposta)}</p>` : '<small class="mut">Aguardando resposta</small>'}</div>`;
  }
  async function minhasDuvidas(n) {
    const box = $('#trDuvLista'), sb = SB(), loja = LOJA(); if (!box || !sb || !loja.id) return;
    const { data } = await sb.from('training_questions').select('licao,texto,created_at,resposta').eq('store_id', loja.id).eq('user_email', ACC().email).eq('trilha', T().id).eq('licao', n).order('created_at', { ascending: false });
    if (aberta !== n || !$('#trDuvLista')) return;
    box.innerHTML = (data && data.length) ? '<p class="small" style="margin:10px 0 4px"><b>Suas dúvidas nesta lição</b></p>' + data.map(d => duvidaHTML(d)).join('') : '';
  }

  function concluir(n) {
    const p = prog();
    if (!p.feitas[n]) {
      p.feitas[n] = (d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))(new Date()); // data local (1.31.9)
      if (Object.keys(p.feitas).length === T().licoes.length && !p.concluiu) p.concluiu = p.feitas[n];
      gravarP(p);
      if (window.CA_log) window.CA_log('treino_licao', { licao: n, titulo: T().licoes[n - 1].t });
      sincronizar();
    }
  }

  function certificado() {
    const p = prog(), nome = ACC().nome || ACC().email || '', loja = indep() ? '' : (LOJA().nome || '');
    const data = p.concluiu ? p.concluiu.split('-').reverse().join('/') : hojeBR();
    const w = window.open('', '_blank'); if (!w) return alert('Libere as janelas pop-up deste site para ver o certificado.');
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificado · Curso Excelência no Atendimento ao Cliente · Cliente Assistido</title>
      <style>body{margin:0;background:#f3f5f4;font-family:Georgia,"Times New Roman",serif;color:#14201b}.c{max-width:760px;margin:24px auto;background:#fff;border:10px double #0A8F52;padding:40px 32px;text-align:center}
      h1{font-size:30px;margin:0 0 4px;color:#0B2545;letter-spacing:1px}h2{font-size:26px;margin:18px 0}p{font-size:17px;line-height:1.6;margin:8px 0}.m{color:#64706a;font-size:14px}
      button{font:16px sans-serif;padding:10px 16px;margin:12px;border-radius:8px;border:1px solid #0A8F52;background:#0A8F52;color:#fff}@media print{button{display:none}body{background:#fff}.c{margin:0}}</style></head>
      <body><div style="text-align:center"><button onclick="print()">Imprimir ou salvar em PDF</button></div><div class="c">
      <p class="m">CURSO EXCELÊNCIA NO ATENDIMENTO AO CLIENTE</p><h1>CERTIFICADO</h1><p>Certificamos que</p><h2>${esc(nome)}</h2>
      <p>${loja ? 'da loja <b>' + esc(loja) + '</b>, ' : ''}concluiu a trilha <b>${esc(T().nome)}</b>,<br>com carga horária de ${T().horas} horas, em ${esc(data)}.</p>
      <p class="m" style="margin-top:28px">Marcos Nascimento · Cliente Assistido<br>Quem é lembrado, vende mais.</p></div></body></html>`);
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
      : '<p class="mut small">Ninguém da equipe começou ainda. O curso fica no topo da aba Mais.</p>';
    // Dúvidas: o dono vê as da loja; o admin vê as de todas as lojas (base de necessidades da equipe).
    const adm = ACC().papel === 'admin';
    let q = sb.from('training_questions').select('user_email,user_name,licao,texto,created_at,resposta,stores(name)').eq('trilha', T().id).order('created_at', { ascending: false }).limit(50);
    if (!adm) q = q.eq('store_id', loja.id);
    const dq = await q;
    const duv = (dq.data || []);
    box.insertAdjacentHTML('beforeend', `<h4 style="margin:14px 0 4px">💬 Dúvidas ${adm ? 'de todas as lojas' : 'da equipe'} (${duv.length})</h4>
      <p class="small mut" style="margin:0 0 6px">O que a equipe perguntou durante o treino. Em breve a IA de suporte do CA vai responder estas dúvidas.</p>`
      + (duv.length ? duv.map(x => duvidaHTML(x, true)).join('') : '<p class="mut small">Nenhuma dúvida enviada ainda.</p>'));
  }

  document.addEventListener('toggle', e => { if (e.target && e.target.id === 'treinoEquipe' && e.target.open) renderEquipe(); }, true);
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-tr-abrir]');
    if (a) { pararVoz(); aberta = +a.dataset.trAbrir; renderLicao(aberta); irAoTopo(); return; }
    if (e.target.closest('[data-tr-voltar]')) { pararVoz(); ilusParar(); aberta = null; if (T().porque) pesqDaVez(true); render(); irAoTopo(); return; }
    if (e.target.closest('[data-tr-cert]')) { certificado(); return; }
    const c = e.target.closest('[data-tr-concluir]');
    if (c && !c.disabled) {
      const n = +c.dataset.trConcluir; concluir(n);
      c.disabled = true; c.textContent = '✓ Lição concluída';
      $('#trConclMsg').innerHTML = `<span class="rodOk">Lição ${n} concluída!</span> ` + proxBotao(); return;
    }
    const d = e.target.closest('[data-tr-duvida]');
    if (d) { enviarDuvida(+d.dataset.trDuvida); return; }
    const o = e.target.closest('[data-tr-ouvir]');
    if (o) { if (dialogando) { dica(o, '⏳ Aguarde o diálogo terminar (ou toque em ⏹ Parar diálogo) para ouvir a lição.'); return; } if (videoTocando) { dica(o, '⏳ Aguarde o vídeo terminar (ou pause o vídeo) para ouvir a lição.'); return; } falarLicao(+o.dataset.trOuvir); return; }
    if (e.target.closest('[data-tr-parar]')) { pararVoz(); return; }
    const r = e.target.closest('[data-tr-resp]');
    if (r) {
      const [n, i] = r.dataset.trResp.split(':').map(Number), l = T().licoes[n - 1];
      document.querySelectorAll('.trOpc button').forEach(b => b.classList.remove('certa', 'errada'));
      if (i === l.certa) {
        r.classList.add('certa');
        $('#trMsg').innerHTML = '<span class="rodOk">Isso mesmo! 👏</span>';
        const b = $('#trConcluir');
        if (b && !prog().feitas[n]) { b.disabled = false; $('#trConclMsg').textContent = 'Agora toque em Concluir lição.'; b.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      } else { r.classList.add('errada'); $('#trMsg').textContent = 'Quase! Releia os pontos acima e tente de novo.'; }
    }
  });

  // Voz do celular (quando a lição não tem áudio gravado): fala trecho por trecho, trocando cena e legenda junto.
  // 1.36.0: vídeo real e público (YouTube) dentro da lição, no ponto certo da fala. A voz para, o vídeo toca e,
  // quando ele termina (ou a pessoa toca em "Continuar a lição"), a voz segue do trecho seguinte.
  const VIDEOS = {
    1: { id: '51HQk0A-XYg', ini: 33, fim: 92, depois: 13,
      titulo: 'Quem atende precisa gostar de servir',
      quem: 'Claudia Moreira de Souza, coordenadora do Senac EAD',
      fonte: 'Senac São Paulo · Cortes do Senac para Empresas',
      intro: 'Agora, veja o que diz uma especialista do Senac São Paulo sobre o que faz um bom atendimento. Toque no vídeo para assistir. É rapidinho, cerca de um minuto.' },
    2: { id: 'arhMbVVjq30', ini: 5, fim: 60, depois: 8,
      titulo: 'A primeira impressão é a que fica',
      quem: 'Atendimento diferenciado',
      fonte: 'Michel Didier · M2 Brasil Comunicação',
      intro: 'Veja agora um vídeo curto sobre o que o cliente percebe quando entra numa loja pela primeira vez. Toque no vídeo para assistir.' },
    3: { id: '5pmSuI6ay-Y', ini: 4, fim: 58, depois: 4,
      titulo: 'Chamar pelo nome e conhecer o cliente',
      quem: 'Depoimento de um empresário atendido pelo Sebrae',
      fonte: 'Sebrae SP · Individualizando o atendimento ao cliente',
      intro: 'Agora, ouça o depoimento de um empresário que chama cada cliente pelo nome e conhece a história de cada um. Toque no vídeo para assistir.' },
    4: { id: '7Wtp2PIHBEk', ini: 30, fim: 83, depois: 5,
      titulo: 'A escuta ativa',
      quem: 'Olga Curado, especialista em comunicação',
      fonte: 'Canal Olga Curado · A escuta ativa',
      intro: 'Antes dos passos, veja em cerca de um minuto como a especialista em comunicação Olga Curado explica o que é escutar de verdade. Toque no vídeo para assistir.' },
    5: { id: 'XLGIko2g3cE', ini: 0, fim: 98, depois: 5,
      titulo: 'Um problema que virou encantamento',
      quem: 'Adriana Próspero, diretora de estratégia e negócios do Grupo iX',
      fonte: 'Senac São Paulo · Cortes do Senac para Empresas',
      intro: 'Agora, ouça um caso real, contado no podcast do Senac São Paulo, de uma loja que transformou um problema num cliente encantado. Toque no vídeo para assistir.' },
    6: { id: '2x6Y8BEa4gE', ini: 52, fim: 96, depois: 14,
      titulo: 'WhatsApp é conversa, não disparo',
      quem: 'Sebrae Orienta',
      fonte: 'Sebrae Mato Grosso do Sul · Como vender pelo WhatsApp',
      intro: 'Veja agora a orientação do Sebrae sobre como conversar com o cliente pelo WhatsApp: um a um, com interesse de verdade. Toque no vídeo para assistir.' },
    7: { id: 'sUdeWLTknTU', ini: 25, fim: 105, depois: 5,
      titulo: 'O pós-venda é onde começa a verdadeira venda',
      quem: 'Geraldo Rufino, empresário e palestrante',
      fonte: 'Canal Geraldo Rufino · Quanto o pós-venda é importante?',
      intro: 'Agora, ouça o empresário Geraldo Rufino falando sobre a importância do pós-venda. Toque no vídeo para assistir.' }
  };
  const duracaoVideo = v => { const s = v.fim - v.ini; return s < 50 ? 'menos de 1 minuto' : s <= 75 ? 'cerca de 1 minuto' : 'cerca de 1 minuto e meio'; };
  function videoHTML(n) {
    const v = VIDEOS[n]; if (!v) return '';
    return `<h4 class="trPasso">🎬 Assista</h4>
      <div class="trVideo" id="trVideo" data-n="${n}">
        <button class="trVidCapa" data-tr-video="${n}" aria-label="Assistir ao vídeo: ${esc(v.titulo)}"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy"><span class="trVidPlay">▶</span></button>
        <p class="small" style="margin:8px 0 2px"><b>${esc(v.titulo)}</b></p>
        <p class="small mut" style="margin:0">${esc(v.quem)} · ${esc(v.fonte)} · ${duracaoVideo(v)}</p>
        <button class="primary hide" id="trVidSeguir" data-tr-seguir="${n}" style="margin-top:8px">▶️ Continuar a lição</button>
      </div>`;
  }
  let videoN = 0, videoTocando = false, dialogando = false;
  // 1.36.1: a leitura da lição e o vídeo nunca tocam juntos. Com a voz lendo, o vídeo fica travado (e pausa, se já estava aberto);
  // com o vídeo tocando, o botão Ouvir a lição fica apagado. Tocar no que está travado mostra um aviso curto.
  function comandoVideo(func) { const f = $('#trVidFrame'); if (f) try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*'); } catch (e) {} }
  function travas() {
    const bloqOuvir = videoTocando || dialogando;
    const o = document.querySelector('[data-tr-ouvir]');
    if (o) { o.classList.toggle('trBloq', bloqOuvir); o.setAttribute('aria-disabled', bloqOuvir ? 'true' : 'false'); }
    const d = document.querySelector('[data-tr-dlg]');
    if (d) { const bq = falando || videoTocando; d.classList.toggle('trBloq', bq); d.setAttribute('aria-disabled', bq ? 'true' : 'false'); }
    const box = $('#trVideo'); if (!box) return;
    const bloqVideo = falando || dialogando;
    box.classList.toggle('trVidBloq', bloqVideo);
    let t = box.querySelector('.trVidTrava');
    if (bloqVideo && !t) { const alvo = box.querySelector('.trVidQuadro, .trVidCapa'); if (alvo) { t = document.createElement('div'); t.className = 'trVidTrava'; alvo.style.position = 'relative'; alvo.appendChild(t); } }
    if (t) t.innerHTML = dialogando ? '<span>🔒 O vídeo libera quando o diálogo terminar</span>' : '<span>🔒 O vídeo libera quando a leitura da lição parar</span>';
    if (!bloqVideo && t) t.remove();
    if (bloqVideo && videoTocando) comandoVideo('pauseVideo');
  }
  function dica(perto, texto) {
    if (!perto) return;
    let d = document.getElementById('trDica'); if (d) d.remove();
    d = document.createElement('p'); d.id = 'trDica'; d.className = 'trDica'; d.setAttribute('role', 'status'); d.textContent = texto;
    (perto.closest('.row') || perto).insertAdjacentElement('afterend', d);
    clearTimeout(dica.t); dica.t = setTimeout(() => { const x = document.getElementById('trDica'); if (x) x.remove(); }, 4500);
  }
  function abrirVideo(n, auto) {
    const v = VIDEOS[n], box = $('#trVideo'); if (!v || !box) return;
    const capa = box.querySelector('.trVidCapa');
    if (capa) capa.outerHTML = `<div class="trVidQuadro"><iframe id="trVidFrame" src="https://www.youtube-nocookie.com/embed/${v.id}?start=${v.ini}&end=${v.fim}&rel=0&playsinline=1&enablejsapi=1${auto ? '&autoplay=1' : ''}&origin=${encodeURIComponent(location.origin)}" title="${esc(v.titulo)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
    const f = $('#trVidFrame');
    if (f) f.addEventListener('load', () => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'trVid' }), '*'); } catch (e) {} });
  }
  // O player do YouTube avisa por mensagem quando o vídeo termina (estado 0).
  window.addEventListener('message', e => {
    if (!/youtube(-nocookie)?\.com$/.test((e.origin || '').replace(/^https?:\/\//, ''))) return;
    let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (x) { return; }
    const st = d && (d.event === 'onStateChange' ? d.info : d.event === 'infoDelivery' && d.info ? d.info.playerState : undefined);
    if (st !== undefined) { videoTocando = st === 1 || st === 3; travas(); }
    if (st === 0 && videoN) seguirDepoisVideo();
  });
  function fimFala() {
    falando = false; travas(); legenda('');
    const el = $('#trLeg'); if (el) el.innerHTML = '<span class="mut">Fim do áudio ✓ Agora leia os pontos abaixo.</span>';
    const bt = document.querySelector('[data-tr-parar]'); if (bt) bt.classList.add('hide');
  }
  function falarTrechos(n, lista, de, ate, depois) {
    const v = speechSynthesis.getVoices().find(x => /pt[-_]BR/i.test(x.lang));
    for (let i = de; i <= ate && i < lista.length; i++) {
      const x = lista[i];
      const u = new SpeechSynthesisUtterance(x.t); u.lang = 'pt-BR'; u.rate = 1.08; if (v) u.voice = v; // 1.26.3: um pouco mais rápida (era 0,95)
      u.onstart = () => { if (falando && falaN === n) (x.solta ? legenda(x.t) : trecho(i)); };
      if (i === Math.min(ate, lista.length - 1)) u.onend = () => { if (falando && falaN === n) depois(); };
      speechSynthesis.speak(u);
    }
  }
  function seguirDepoisVideo() {
    const n = videoN; videoN = 0; if (!n || aberta !== n) return;
    const sb = $('#trVidSeguir'); if (sb) sb.classList.add('hide');
    const v = VIDEOS[n], lista = falasDe(n);
    if (!lista.length || v.depois + 1 >= lista.length) { fimFala(); return; }
    falando = true; falaN = n; travas();
    const b = document.querySelector('[data-tr-parar]'); if (b) b.classList.remove('hide');
    const pn = document.querySelector('.trIlus'); if (pn) pn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    falarTrechos(n, lista, v.depois + 1, lista.length - 1, fimFala);
  }
  // Voz do celular (quando a lição não tem áudio gravado): fala trecho por trecho, trocando cena e legenda junto.
  function falarLicao(n) {
    if (!('speechSynthesis' in window)) return;
    pararVoz(); falaN = n; falando = true; videoN = 0; travas();
    const f = falasDe(n);
    const b = document.querySelector('[data-tr-parar]'); if (b) b.classList.remove('hide');
    const pn = document.querySelector('.trIlus'); if (pn) pn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const lista = f.length ? f : [{ t: roteiroDe(T().licoes[n - 1]) }];
    const vid = f.length ? VIDEOS[n] : null;
    if (!vid) { falarTrechos(n, lista, 0, lista.length - 1, fimFala); return; }
    falarTrechos(n, lista, 0, vid.depois, () => {
      // pausa a voz no ponto do vídeo: fala a chamada, mostra o vídeo e espera ele terminar
      falarTrechos(n, [{ t: vid.intro, solta: true }], 0, 0, () => {
        falando = false; videoN = n; travas();
        const bt = document.querySelector('[data-tr-parar]'); if (bt) bt.classList.add('hide');
        const box = $('#trVideo'); if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        abrirVideo(n, true);
        const sb = $('#trVidSeguir'); if (sb) sb.classList.remove('hide');
        const el = $('#trLeg'); if (el) el.innerHTML = '<span class="mut">🎬 Assista ao vídeo abaixo. Quando ele terminar, a lição continua.</span>';
      });
    });
  }
  function pararVoz() {
    falando = false; videoN = 0; if (dialogando) pararDialogo(); travas();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const b = document.querySelector('[data-tr-parar]'); if (b) b.classList.add('hide');
    const el = $('#trLeg'); if (el && el.textContent && !el.querySelector('.mut')) el.innerHTML = '<span class="mut">Áudio parado. Toque em ▶️ Ouvir a lição para recomeçar.</span>';
  }
  // Áudio gravado (licao.audio): a legenda segue o tempo do áudio, dividido pelo tamanho de cada trecho.
  document.addEventListener('timeupdate', e => {
    if (!e.target || e.target.id !== 'trAudio' || !aberta) return;
    const a = e.target, f = falasDe(aberta); if (!f.length || !a.duration) return;
    falaN = aberta; falando = !a.paused;
    const tot = f.reduce((s, x) => s + x.t.length, 0); let acum = 0, i = 0;
    for (; i < f.length; i++) { acum += f[i].t.length; if (a.currentTime / a.duration <= acum / tot) break; }
    if (i !== ilusI || !$('#trLeg').textContent) trecho(Math.min(i, f.length - 1));
  }, true);
  document.addEventListener('pause', e => { if (e.target && e.target.id === 'trAudio') falando = false; }, true);

  document.addEventListener('click', e => {
    const tv = e.target.closest('.trVidTrava'); if (tv) { dica(tv.closest('.trVideo'), dialogando ? '⏳ Aguarde o diálogo terminar, ou toque em ⏹ Parar diálogo, para assistir ao vídeo.' : '⏳ Aguarde a leitura da lição terminar, ou toque em ⏹ Parar, para assistir ao vídeo.'); return; }
    const c = e.target.closest('[data-tr-video]'); if (c) { if (dialogando) { dica(c.closest('.trVideo'), '⏳ Aguarde o diálogo terminar, ou toque em ⏹ Parar diálogo, para assistir ao vídeo.'); return; } if (falando) { dica(c.closest('.trVideo'), '⏳ Aguarde a leitura da lição terminar, ou toque em ⏹ Parar, para assistir ao vídeo.'); return; } abrirVideo(+c.dataset.trVideo, true); return; }
    const g = e.target.closest('[data-tr-seguir]'); if (g) { seguirDepoisVideo(); }
    const dl = e.target.closest('[data-tr-dlg]');
    if (dl) {
      if (falando) { dica(dl, '⏳ Aguarde a leitura da lição terminar, ou toque em ⏹ Parar, para ouvir o diálogo.'); return; }
      if (videoTocando) { dica(dl, '⏳ Aguarde o vídeo terminar (ou pause o vídeo) para ouvir o diálogo.'); return; }
      tocarDialogo(+dl.dataset.trDlg); return;
    }
    if (e.target.closest('[data-tr-dlg-parar]')) { pararDialogo(); return; }
    const dli = e.target.closest('[data-tr-dlg-i]'); if (dli && !dialogando) { const d = DLG(+($('#trDlg') || {dataset: {}}).dataset.n), f = d && variante(d).falas[+dli.dataset.trDlgI]; if (f) mostrarFalaDlg(f, d.pessoas); }
  });
  /* ---------- 1.38.0: Na prática — diálogo demonstrativo com duas vozes ---------- */
  const DLG = n => (window.CA_DIALOGOS || {})[n];
  const ramoDlg = () => { let r = ((ACC().loja || {}).ramo) || ''; if (r === 'salao' || r === 'clinica') r = 'beleza'; return r; }; // 1.46.5: ramos antigos salão/clínica usam a variante beleza
  const variante = d => d.variantes[ramoDlg()] || d.variantes.geral;
  const varRuim = d => d.ruim ? (d.ruim.variantes[ramoDlg()] || (variante(d) === d.variantes.geral ? d.ruim.variantes.geral : null) || null) : null; // 1.47.0: exemplo negativo (como não fazer); só usa o geral quando o positivo também é o geral, para não misturar ramos
  function personagemSVG(lado) { // desenho simples e próprio: Ana (atendente) à esquerda, Seu José (cliente) à direita
    if (lado === 'b') return `<g class="dlgP dlgB hide" data-p="b" transform="translate(70 34)">
      <ellipse cx="0" cy="118" rx="44" ry="40" fill="#7d838a"/><rect x="-10" y="92" width="20" height="10" rx="3" fill="#e0b48e"/>
      <rect x="-36" y="104" width="22" height="10" rx="2" fill="#fff"/><text x="-25" y="112" font-size="7" text-anchor="middle" fill="#555" font-weight="700">BETO</text>
      <circle cx="0" cy="52" r="30" fill="#e0b48e"/><path d="M-30 46 q2-28 30-28 q28 0 30 28 q-6-14-30-14 q-24 0-30 14z" fill="#222"/>
      <path d="M-16 50 h10 M6 50 h10" stroke="#2b1a10" stroke-width="3" stroke-linecap="round"/>
      <path class="boca" d="M-8 70 h16" stroke="#6b2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse class="bocaA" cx="0" cy="70" rx="6" ry="4" fill="#6b2a2a"/>
      <rect x="18" y="58" width="16" height="26" rx="3" fill="#1d1d1f"/><rect x="20" y="61" width="12" height="18" rx="1" fill="#6fb6ff"/></g>`;
    if (lado === 'a') return `<g class="dlgP" data-p="a" transform="translate(70 34)">
      <ellipse cx="0" cy="118" rx="44" ry="40" fill="#0A8F52"/><rect x="-10" y="92" width="20" height="10" rx="3" fill="#f2c9a5"/>
      <rect x="14" y="104" width="22" height="10" rx="2" fill="#fff"/><text x="25" y="112" font-size="7" text-anchor="middle" fill="#0A8F52" font-weight="700">ANA</text>
      <path d="M-34 40 q0-40 34-40 q34 0 34 40 v26 q-6 10-12 0 v-22 h-44 v22 q-6 10-12 0z" fill="#4a2c1d"/>
      <circle cx="0" cy="52" r="30" fill="#f2c9a5"/><path d="M-30 46 q6-30 30-30 q24 0 30 30 q-14-14-30-14 q-16 0-30 14z" fill="#4a2c1d"/>
      <circle cx="-11" cy="52" r="3.2" fill="#2b1a10"/><circle cx="11" cy="52" r="3.2" fill="#2b1a10"/>
      <circle cx="-19" cy="62" r="4" fill="#f5a3a3" opacity=".5"/><circle cx="19" cy="62" r="4" fill="#f5a3a3" opacity=".5"/>
      <path class="boca" d="M-9 66 q9 9 18 0" stroke="#7a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse class="bocaA" cx="0" cy="68" rx="7" ry="5" fill="#7a2e2e"/></g>`;
    return `<g class="dlgP" data-p="c" transform="translate(250 34)">
      <ellipse cx="0" cy="118" rx="46" ry="40" fill="#2f6fb3"/><rect x="-10" y="92" width="20" height="10" rx="3" fill="#d9a77f"/>
      <circle cx="0" cy="52" r="30" fill="#d9a77f"/><path d="M-30 44 q2-26 30-26 q28 0 30 26 q-8-10-14-10 h-32 q-6 0-14 10z" fill="#9aa0a6"/>
      <circle cx="-11" cy="52" r="7.5" fill="none" stroke="#333" stroke-width="2"/><circle cx="11" cy="52" r="7.5" fill="none" stroke="#333" stroke-width="2"/><path d="M-3.5 52 h7" stroke="#333" stroke-width="2"/>
      <circle cx="-11" cy="52" r="2.6" fill="#2b1a10"/><circle cx="11" cy="52" r="2.6" fill="#2b1a10"/>
      <path d="M-12 64 q12 4 24 0" stroke="#6b6f74" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path class="boca" d="M-8 70 q8 7 16 0" stroke="#6b2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse class="bocaA" cx="0" cy="71" rx="6.5" ry="4.5" fill="#6b2a2a"/></g>`;
  }
  function dialogoHTML(n) {
    const d = DLG(n); if (!d) return '';
    const v = variante(d), P = d.pessoas, vr = varRuim(d);
    return `<h4 class="trPasso">🗣️ Na prática: ${vr ? 'veja a diferença' : 'veja como fazer'}</h4>
      <div class="trDlg" id="trDlg" data-n="${n}">
        <p class="small mut" style="margin:0 0 8px">${esc(d.titulo)} · ${esc(v.rotulo)}. ${vr ? `Primeiro, veja como <b>não</b> fazer, com ${esc(d.ruim.pessoa.nome)}. Depois, o mesmo momento do jeito certo, com ${esc(P.a.nome)}. O cliente é o mesmo: ${esc(P.c.nome)}.` : `Ouça a conversa entre ${esc(P.a.nome)}, a ${esc(P.a.papel)}, e ${esc(P.c.nome)}, o ${esc(P.c.papel)}.`}</p>
        <div class="dlgBalao" id="dlgBalao"><span class="mut">Toque em ▶️ Ouvir o diálogo.</span></div>
        <div class="dlgPalco"><svg viewBox="0 0 320 190" role="img" aria-label="${esc(P.a.nome)} atrás do balcão conversando com ${esc(P.c.nome)}">
          <rect width="320" height="190" fill="#eaf6ef"/><rect y="150" width="320" height="40" fill="#d7ecdf"/>
          <rect x="24" y="16" width="70" height="40" rx="6" fill="#fff" opacity=".7"/><rect x="226" y="16" width="70" height="40" rx="6" fill="#fff" opacity=".7"/>
          ${personagemSVG('a')}${vr ? personagemSVG('b') : ''}${personagemSVG('c')}
          <rect x="20" y="138" width="190" height="52" rx="6" fill="#8a5a3b"/><rect x="20" y="134" width="190" height="10" rx="4" fill="#a8734f"/>
          <text id="dlgCena" x="160" y="128" font-size="34" text-anchor="middle">🏪</text>
        </svg></div>
        <div class="row wrap" style="margin-top:8px"><button class="primary" data-tr-dlg="${n}">▶️ Ouvir o diálogo</button><button class="hide" data-tr-dlg-parar="1">⏹ Parar diálogo</button></div>
        ${vr ? `<div class="dlgRepare dlgErros"><b>❌ O que deu errado com ${esc(d.ruim.pessoa.nome)}:</b><ul>${d.ruim.erros.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
        <div class="dlgRepare dlgCertos"><b>${vr ? '✅' : '🔎'} Repare no que a ${esc(P.a.nome)} fez:</b><ul>${d.repare.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
      </div>`;
  }
  // Narrador: texto no balão laranja; com lista (sel) e item k, destaca o item na lista correspondente.
  function mostrarNarrador(texto, sel, k, ic) {
    const b = $('#dlgBalao');
    document.querySelectorAll('#trDlg .dlgP').forEach(g => g.classList.remove('falando'));
    document.querySelectorAll('#trDlg .dlgRepare').forEach(x => { x.classList.remove('lendo'); x.querySelectorAll('li').forEach(li => li.classList.remove('on')); });
    const box = sel ? document.querySelector('#trDlg ' + sel) : null;
    if (box) { box.classList.add('lendo'); box.querySelectorAll('li').forEach((li, j) => li.classList.toggle('on', j === k)); if (k <= 0) box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (b) { b.className = 'dlgBalao falan'; b.innerHTML = `${ic || '🔎'} <b>Narrador:</b> ${esc(texto)}`; }
    const c = document.getElementById('dlgCena'); if (c) c.textContent = ic || '🔎';
  }
  // Quem fica atrás do balcão: Beto no exemplo negativo, Ana no positivo.
  function atendente(q) { const a = document.querySelector('#trDlg .dlgP[data-p="a"]'), bt = document.querySelector('#trDlg .dlgP[data-p="b"]'); if (!bt || !q) return; bt.classList.toggle('hide', q !== 'b'); if (a) a.classList.toggle('hide', q === 'b'); }
  function mostrarFalaDlg(f, P) {
    const b = $('#dlgBalao');
    if (b) { b.className = 'dlgBalao fala' + (f.q === 'b' ? 'a falab' : f.q); b.innerHTML = `<b>${esc(P[f.q].nome)}:</b> ${esc(f.t)}`; }
    const c = document.getElementById('dlgCena'); if (c) c.textContent = f.cena || '🏪';
    document.querySelectorAll('#trDlg .dlgP').forEach(g => g.classList.toggle('falando', dialogando && g.dataset.p === f.q));
  }
  // Duas vozes: se o celular tiver uma voz feminina e uma masculina em português, usa cada uma; senão, muda o tom (pitch).
  function vozesDlg() {
    const vs = ('speechSynthesis' in window ? speechSynthesis.getVoices() : []).filter(x => /pt[-_]BR/i.test(x.lang));
    const fem = vs.find(x => /female|mulher|luciana|francisca|maria|vit[oó]ria|camila|thalita|fernanda/i.test(x.name));
    const mas = vs.find(x => (/\bmale\b|masculin|homem|felipe|ant[oô]nio|ricardo|f[aá]bio|donato|humberto|julio|j[uú]lio|valerio|nicolau|ptd/i.test(x.name + ' ' + (x.voiceURI || ''))) && !/female|feminin/i.test(x.name) && x !== fem); // 1.38.3: mais nomes de vozes masculinas
    const nar = vs.find(x => x !== fem && x !== mas) || null; // 3ª voz para o narrador; se não houver, o tom neutro diferencia
    return { a: { voz: fem || vs[0] || null, pitch: fem && mas ? 1.05 : 1.3, rate: 1.08}, c: { voz: mas || vs[0] || null, pitch: mas ? 0.8 : 0.45, rate: 1.08}, // 1.38.3: José o mais grave possível
      n: { voz: nar || vs[0] || null, pitch: 1.0, rate: 1.08},
      b: { voz: mas || vs[0] || null, pitch: mas ? 1.15 : 0.75, rate: 1.12 } }; // 1.47.0: Beto, o atendente do exemplo negativo (outro tom, um pouco apressado)
  }
  let dlgTimer = null;
  function tocarDialogo(n) {
    const d = DLG(n); if (!d) return;
    const falas = variante(d).falas, vr = varRuim(d), P = Object.assign({}, d.pessoas, vr ? { b: d.ruim.pessoa } : {});
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    dialogando = true; travas();
    const pb = document.querySelector('[data-tr-dlg-parar]'); if (pb) pb.classList.remove('hide');
    const box = $('#trDlg'); if (box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const fim = () => { if (!dialogando) return; dialogando = false; atendente('a'); travas(); const p = document.querySelector('[data-tr-dlg-parar]'); if (p) p.classList.add('hide'); document.querySelectorAll('#trDlg .dlgP').forEach(g => g.classList.remove('falando')); const b = $('#dlgBalao'); if (b) { b.className = 'dlgBalao'; b.innerHTML = '<span class="mut">Fim do diálogo ✓</span>'; } limparRepare(); };
    // Roteiro: [como não fazer → o que deu errado → ponte] → do jeito certo → repare no que a Ana fez.
    const narra = (t, sel, k, ic) => ({ q: 'n', t, mostra: () => mostrarNarrador(t, sel, k, ic) });
    const fala = f => ({ q: f.q, t: f.t, mostra: () => { atendente(f.q === 'b' ? 'b' : f.q === 'a' ? 'a' : null); mostrarFalaDlg(f, P); } });
    let itens = [];
    if (vr) {
      itens.push(narra(`Primeiro, veja como não fazer. O ${P.c.nome} é atendido pelo ${P.b.nome}.`, null, -1, '❌'));
      itens = itens.concat(vr.falas.map(fala));
      itens.push(narra(`Percebeu como o ${P.c.nome} saiu? Repare no que deu errado.`, '.dlgErros', -1, '❌'));
      itens = itens.concat(d.ruim.erros.map((r, k) => narra(r, '.dlgErros', k, '❌')));
      itens.push(Object.assign(narra(`Agora, veja o mesmo momento, do jeito certo, com a ${P.a.nome}.`, null, -1, '✅'), { troca: 'a' }));
    }
    itens = itens.concat(falas.map(fala));
    itens.push(narra(`Agora, repare no que a ${P.a.nome} fez.`, '.dlgCertos', -1, vr ? '✅' : '🔎'));
    itens = itens.concat(d.repare.map((r, k) => narra(r, '.dlgCertos', k, vr ? '✅' : '🔎')));
    itens.forEach(x => { if (x.troca) { const m = x.mostra; x.mostra = () => { atendente(x.troca); m(); }; } });
    if (vr) atendente('b');
    if (!('speechSynthesis' in window)) { // sem voz: cada passo aparece sozinho, um a cada 4 s
      let i = 0; itens[0].mostra(); clearInterval(dlgTimer);
      dlgTimer = setInterval(() => { if (!dialogando) return clearInterval(dlgTimer); i++; if (i >= itens.length) { clearInterval(dlgTimer); fim(); } else itens[i].mostra(); }, 4000);
      return;
    }
    const V = vozesDlg();
    itens.forEach((x, i) => {
      const u = new SpeechSynthesisUtterance(x.t), cfg = V[x.q];
      u.lang = 'pt-BR'; if (cfg.voz) u.voice = cfg.voz; u.pitch = cfg.pitch; u.rate = cfg.rate;
      u.onstart = () => { if (dialogando) x.mostra(); };
      if (i === itens.length - 1) u.onend = fim;
      speechSynthesis.speak(u);
    });
  }
  function limparRepare() { document.querySelectorAll('#trDlg .dlgRepare').forEach(box => { box.classList.remove('lendo'); box.querySelectorAll('li').forEach(li => li.classList.remove('on')); }); }
  function pararDialogo() {
    if (!dialogando) return; limparRepare(); atendente('a');
    dialogando = false; clearInterval(dlgTimer);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const p = document.querySelector('[data-tr-dlg-parar]'); if (p) p.classList.add('hide');
    document.querySelectorAll('#trDlg .dlgP').forEach(g => g.classList.remove('falando'));
    const b = $('#dlgBalao'); if (b) { b.className = 'dlgBalao'; b.innerHTML = '<span class="mut">Diálogo parado. Toque em ▶️ Ouvir o diálogo para recomeçar.</span>'; }
    travas();
  }
  window.CA_renderTreino = function () { try { render(); } catch (e) { /* o treino nunca pode travar o app */ } };
  function irAoTopo() { const c = $('#treinoCard'); if (c) c.scrollIntoView({ block: 'start' }); }
  // Abrir o bloco do Treino sincroniza o progresso; fechar o bloco ou trocar de aba para a voz e as imagens.
  document.addEventListener('toggle', e => {
    if (!e.target || e.target.id !== 'treinoCard') return;
    if (e.target.open) { render(); sincronizar(); ilusIniciar(); } else { pararVoz(); ilusParar(); }
  }, true);
  document.addEventListener('click', e => { const t = e.target.closest('.tabs button'); if (t && t.dataset.tab !== 'mais') { pararVoz(); ilusParar(); } });
  window.CA_renderTreino();
})();
