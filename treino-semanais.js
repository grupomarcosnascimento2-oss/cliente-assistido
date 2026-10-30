/* Cliente Assistido – Lições da semana (1.50.0, ideia do Marcos, 30/10/2026). AINDA NÃO LIBERADO: só o admin vê, para revisar.
   Depois do curso básico (Trilha 1, até 30 dias), quem concluiu passa a receber uma lição curta (~6 min) toda segunda-feira às 9h,
   com um tema que complementa o básico, enquanto durar o contrato da loja. As lições não vencem: a de uma semana perdida
   continua disponível. Cada lição: ouvir (voz do celular, 1,08x) · na prática (em vez de / diga) · leia · faça esta semana ·
   pergunta (a certa libera Concluir). Progresso em p.sem (ca_treino:<email>) e em training_progress com trilha 'sem'.
   Regra de liberação: base = o mais tarde entre (1º dia do curso + 30 dias) e o dia em que concluiu o básico;
   a lição 1 sai na 1ª segunda-feira às 9h a partir da base, e cada lição seguinte, 7 dias depois.
   PARA LIBERAR (quando o Marcos autorizar): LIBERADO = true; pôr 'licoes_semanais' em CA_RECURSOS_GERAIS e
   CA_RECURSOS_OPT_IN (ramos.js) para começar desligado e o admin ligar loja por loja; criar o aviso de segunda às 9h
   no celular (pg_cron + daily-reminder, só para quem tem lição nova liberada). */
'use strict';
(function () {
  const LIBERADO = false; // false = só o admin vê (prévia). Não ligar sem autorização do Marcos.
  const TRILHA = 'sem';

  const L = [
    { n: 1, t: 'O cliente com pressa', tema: 'Agilidade sem perder a gentileza',
      roteiro: 'Oi! Que bom te ver de novo. Esta é a sua lição da semana, e o tema é um cliente que todo mundo conhece: o cliente com pressa. Ele chega olhando o relógio, fala rápido e às vezes parece até mal-educado. Mas quase sempre não é nada contra você. Ele só está com o tempo apertado. E aqui vai um segredo: o cliente com pressa não quer ser atendido de qualquer jeito. Ele quer ser atendido rápido e bem. Então, o primeiro passo é mostrar que você entendeu. Diga: entendi, você está com pressa, vou ser rápido. Só essa frase já baixa a tensão. O segundo passo é ir direto ao ponto. Faça só as perguntas que importam e deixe a conversa longa para outro dia. O terceiro passo é dar previsão: em cinco minutos fica pronto, ou: hoje não consigo, mas amanhã às dez já está separado. Cliente com pressa odeia ficar sem saber quanto tempo vai esperar. E o que não fazer? Não demonstre irritação, não corra a ponto de errar e não deixe de cumprimentar. Pressa não é desculpa para o atendimento ficar frio. Se ele precisar ir embora antes de terminar, peça o WhatsApp e diga: eu te mando aqui e você resolve quando puder. Pronto, você salvou a venda e mostrou cuidado. Guarde esta frase: com o cliente apressado, seja rápido no serviço e calmo no jeito.',
      pratica: [['“Calma, já vou ver isso aí.”', '“Entendi que você está com pressa. Vou ser rápido.”'], ['“Não sei quanto tempo vai demorar.”', '“Em cerca de 10 minutos fica pronto. Pode ser?”'], ['“Então volta outro dia.”', '“Posso te mandar pelo WhatsApp e você resolve quando puder?”']],
      ler: ['Mostre que entendeu a pressa: isso já acalma.', 'Vá direto ao ponto, só com as perguntas que importam.', 'Sempre dê previsão de tempo.', 'Rápido no serviço, calmo no jeito: sem irritação e sem pular o cumprimento.'],
      desafio: 'Nesta semana, quando atender alguém com pressa, use a frase “vou ser rápido” e diga quanto tempo vai levar. Repare na reação do cliente.',
      pergunta: 'O que o cliente com pressa mais quer?', opcoes: ['Ser atendido rápido e bem, sabendo quanto vai esperar', 'Que o atendente pule o cumprimento para ganhar tempo', 'Um desconto para compensar a pressa'], certa: 0,
      frase: 'Com o cliente apressado, seja rápido no serviço e calmo no jeito.' },
    { n: 2, t: 'Dizer “não” sem perder o cliente', tema: 'Quando a resposta é não',
      roteiro: 'Oi! Lição da semana no ar. Hoje vamos falar de uma situação difícil: quando você precisa dizer não. Não tem o produto. Não dá para fazer naquele prazo. Não é possível dar aquele desconto. Todo atendente passa por isso. O problema não é o não. O problema é o não seco, que fecha a porta. Compare: não tem. E agora: esse modelo acabou, mas chega na quinta-feira; posso separar um para você? As duas frases dizem a mesma coisa, mas a segunda mantém o cliente com você. A regra é simples: todo não vem acompanhado de uma alternativa. Pode ser outra data, outro produto parecido, um aviso quando chegar ou a indicação de quem pode ajudar. E quando não existe nenhuma alternativa? Aí seja sincero e gentil: infelizmente esse serviço a gente não faz, mas eu sei quem faz e posso te passar o contato. O cliente vai lembrar que você ajudou, mesmo sem vender. Mais dois cuidados. Explique o motivo em poucas palavras, sem culpar ninguém: não diga o fornecedor sempre atrasa ou o meu chefe não deixa. E nunca prometa o que não pode cumprir só para evitar o não agora. A promessa quebrada custa muito mais caro depois. Guarde esta frase: um não com alternativa vale mais do que um sim que não se cumpre.',
      pratica: [['“Não tem.”', '“Esse acabou, mas chega quinta. Quer que eu separe um para você?”'], ['“Meu chefe não deixa dar desconto.”', '“Nesse produto não consigo baixar o preço, mas posso parcelar sem juros.”'], ['“Isso a gente não faz.”', '“Esse serviço a gente não faz, mas posso te indicar quem faz.”']],
      ler: ['Todo “não” vem com uma alternativa.', 'Explique o motivo em poucas palavras, sem culpar ninguém.', 'Sem alternativa? Indique quem pode ajudar.', 'Nunca prometa o que não pode cumprir só para evitar o “não”.'],
      desafio: 'Nesta semana, toda vez que precisar dizer “não”, complete a frase com uma alternativa. Conte quantas vezes conseguiu.',
      pergunta: 'Qual é o jeito certo de dizer que um produto acabou?', opcoes: ['“Não tem, acabou.”', '“Acabou, mas chega quinta. Quer que eu separe um para você?”', '“Deve chegar amanhã” (mesmo sem ter certeza)'], certa: 1,
      frase: 'Um não com alternativa vale mais do que um sim que não se cumpre.' },
    { n: 3, t: 'Oferecer mais sem empurrar', tema: 'Venda complementar com cuidado',
      roteiro: 'Oi! Chegou a sua lição da semana. O tema de hoje é oferecer algo a mais para o cliente sem parecer que você está empurrando. Muita gente tem vergonha de oferecer, com medo de parecer chato. E muita gente oferece demais, e aí parece mesmo. O caminho certo fica no meio, e tem uma regra de ouro: só ofereça o que ajuda o cliente de verdade. Pense assim: quem troca o óleo pode precisar do filtro. Quem compra óculos pode precisar de uma capinha ou de um líquido de limpeza. Quem leva o cachorro para o banho pode gostar de um laço ou de um petisco. Isso não é empurrar. Isso é cuidar para o cliente não precisar voltar depois. Como fazer? Primeiro, ofereça uma coisa só, a mais útil, e não uma lista. Segundo, explique o porquê em uma frase: aproveitando que o carro está aqui, vale trocar o filtro também, porque ele está no prazo. Terceiro, aceite o não com tranquilidade: sem problema, fica para a próxima. Se o cliente disse não, não insista. Insistir transforma uma boa ideia em pressão. E um detalhe importante: o momento certo é depois que a necessidade principal foi resolvida. Primeiro você resolve o que ele veio buscar. Depois, com a confiança já criada, você sugere. Guarde esta frase: oferecer é cuidar, insistir é empurrar.',
      pratica: [['“Vai querer mais alguma coisa?”', '“Aproveitando, vale trocar o filtro também, que está no prazo.”'], ['“Leva esse, leva aquele, leva mais esse…”', 'Ofereça uma coisa só, a mais útil para ele.'], ['“Tem certeza? Vai ficar mais caro depois.”', '“Sem problema, fica para a próxima.”']],
      ler: ['Só ofereça o que ajuda o cliente de verdade.', 'Uma sugestão só, com o porquê em uma frase.', 'Primeiro resolva o que ele veio buscar; depois sugira.', 'Ouviu um “não”? Aceite com tranquilidade e não insista.'],
      desafio: 'Nesta semana, em cada atendimento, pense: “o que mais ajudaria este cliente?”. Ofereça uma única sugestão, com o motivo, e aceite a resposta.',
      pergunta: 'Qual atitude transforma uma boa sugestão em pressão?', opcoes: ['Explicar o motivo em uma frase', 'Esperar resolver o pedido principal antes de sugerir', 'Insistir depois que o cliente disse não'], certa: 2,
      frase: 'Oferecer é cuidar. Insistir é empurrar.' },
    { n: 4, t: 'Tom de voz e postura', tema: 'O que você diz sem falar',
      roteiro: 'Oi! Mais uma lição da semana. Hoje vamos falar do que você diz sem usar palavras. Você já reparou que dá para dizer bom dia de um jeito que acolhe e de um jeito que afasta? As palavras são as mesmas. O que muda é o tom de voz, o rosto e o corpo. E o cliente percebe tudo isso antes mesmo de ouvir o que você disse. Vamos começar pela postura. Braços cruzados, corpo virado para o outro lado e olhar no celular dizem: não estou disponível. Já o corpo virado para o cliente, as mãos à vista e um olhar atento dizem: estou aqui para você. Agora o rosto. Um sorriso sincero no começo do atendimento muda o clima da conversa. Não precisa ser sorriso de propaganda, basta um rosto tranquilo e simpático. E o tom de voz? Fale num volume que o cliente ouça bem, sem gritar e sem murmurar, e numa velocidade calma. Quando o cliente está nervoso, abaixe um pouco o tom e fale mais devagar. Isso ajuda a acalmar a conversa. No telefone e no áudio do WhatsApp, o sorriso também aparece: quem fala sorrindo soa mais simpático, mesmo sem ser visto. Faça um teste hoje: grave um áudio sorrindo e outro sério, e escute os dois. Guarde esta frase: o cliente ouve o seu jeito antes de ouvir as suas palavras.',
      pratica: [['Braços cruzados e olhar no celular', 'Corpo virado para o cliente e olhar atento'], ['Falar alto e rápido com o cliente nervoso', 'Abaixar um pouco o tom e falar mais devagar'], ['Áudio de WhatsApp com voz cansada', 'Gravar o áudio sorrindo: a simpatia aparece na voz']],
      ler: ['Postura aberta: corpo virado para o cliente, mãos à vista.', 'Rosto tranquilo e um sorriso sincero no começo.', 'Volume que o cliente ouça bem, sem gritar, numa velocidade calma.', 'Cliente nervoso: tom mais baixo e fala mais devagar.'],
      desafio: 'Nesta semana, grave dois áudios de teste no seu celular, um sorrindo e outro sério, e escute. Depois, atenda pelo menos um cliente pensando na sua postura do começo ao fim.',
      pergunta: 'Com um cliente nervoso, o que ajuda a acalmar a conversa?', opcoes: ['Falar mais alto para ele prestar atenção', 'Abaixar um pouco o tom e falar mais devagar', 'Cruzar os braços e esperar ele terminar'], certa: 1,
      frase: 'O cliente ouve o seu jeito antes de ouvir as suas palavras.' }
  ];
  window.CA_SEMANAIS = L;

  const A = () => window.CA_treinoAPI;
  const esc = t => A().esc(t);
  const admin = () => A().ACC().papel === 'admin';
  const visivel = () => { if (!A() || !A().pode()) return false; if (admin()) return true; return LIBERADO && typeof ligado === 'function' && ligado('licoes_semanais'); };
  const dLocal = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const fmt = d => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  const totBasico = () => (window.CA_TRILHA1 || { licoes: [] }).licoes.length;

  // Primeira segunda-feira às 9h (horário do aparelho) a partir do dia "base" (AAAA-MM-DD).
  function primeiraSegunda(base) {
    const d = new Date(base + 'T09:00:00');
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    return d;
  }
  // Datas de liberação de cada lição para esta pessoa (null = ainda não concluiu o básico).
  function agenda() {
    const p = A().prog(), datas = Object.values(p.feitas || {}).sort();
    if (!p.concluiu || datas.length < totBasico()) return null;
    const ini = new Date(datas[0] + 'T00:00:00'); ini.setDate(ini.getDate() + 30);
    const base = [dLocal(ini), p.concluiu].sort()[1];
    const s1 = primeiraSegunda(base);
    return L.map((l, i) => { const d = new Date(s1); d.setDate(d.getDate() + 7 * i); return d; });
  }
  const semFeitas = () => A().prog().sem || {};
  const liberadaN = (n, ag) => admin() || (ag && ag[n - 1] && Date.now() >= ag[n - 1].getTime());

  // Bloco na tela inicial do curso
  window.CA_semBloco = function () {
    if (!visivel()) return '';
    const ag = agenda(), f = semFeitas(), prev = admin() && !LIBERADO;
    let topo;
    if (admin()) topo = '<p class="small mut" style="margin:0 0 8px">Toda segunda-feira às 9h, uma lição nova de cerca de 6 minutos para quem concluiu o curso. Como admin, você vê todas para revisar.</p>';
    else if (!ag) topo = '<p class="small mut" style="margin:0 0 8px">Depois que você concluir o curso, chega uma lição nova de cerca de 6 minutos toda segunda-feira às 9h, com um tema novo para continuar evoluindo.</p>';
    else { const prox = ag.find(d => d.getTime() > Date.now()); topo = `<p class="small mut" style="margin:0 0 8px">Uma lição nova de cerca de 6 minutos toda segunda-feira às 9h.${prox ? ' Próxima: <b>' + esc(fmt(prox)) + '</b>.' : ''}</p>`; }
    const itens = L.map(l => {
      const ok = liberadaN(l.n, ag), feita = f[l.n];
      const quando = ag && ag[l.n - 1] ? ag[l.n - 1] : null;
      const sub = feita ? '✓ concluída' : ok ? `⏱ 6 min · ${esc(l.tema)}` : quando ? `🔒 libera ${esc(fmt(quando))}, às 9h` : '🔒 depois do curso';
      return `<div class="it trIt${feita ? ' feita' : ''}"><div class="t"><b>${l.n}. ${esc(l.t)}</b><small>${sub}</small></div>${ok ? `<button data-sem-abrir="${l.n}">${feita ? 'Rever' : 'Abrir'}</button>` : ''}</div>`;
    }).join('');
    return `<div class="card semCard"><h3>⚡ Lições da semana${prev ? ' <span class="tag semPrev">prévia: só o admin vê</span>' : ''}</h3>${topo}${itens}</div>`;
  };

  // Voz do celular (mesma velocidade do curso), frase a frase para não cortar em celulares que param falas longas.
  let falando = false;
  function vozPt() { const v = speechSynthesis.getVoices(); return v.find(x => /pt[-_]BR/i.test(x.lang)) || v.find(x => /^pt/i.test(x.lang)) || null; }
  function ouvir(n) {
    const l = L.find(x => x.n === n); if (!l || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel(); falando = true; botoes();
    const frases = l.roteiro.split(/(?<=[.!?])\s+/).filter(Boolean);
    const v = vozPt(); let i = 0;
    const prox = () => {
      if (!falando || i >= frases.length) { falando = false; botoes(); return; }
      const u = new SpeechSynthesisUtterance(frases[i++]); u.lang = 'pt-BR'; u.rate = 1.08; if (v) u.voice = v;
      u.onend = prox; u.onerror = () => { falando = false; botoes(); };
      speechSynthesis.speak(u);
    };
    prox();
  }
  function parar() { falando = false; if ('speechSynthesis' in window) speechSynthesis.cancel(); botoes(); }
  function botoes() { const o = $('[data-sem-ouvir]'), p = $('[data-sem-parar]'); if (o) o.classList.toggle('hide', falando); if (p) p.classList.toggle('hide', !falando); }

  function abrir(n) {
    const l = L.find(x => x.n === n), box = $('#treinoBox'); if (!l || !box) return;
    const feita = semFeitas()[n];
    const ord = l.opcoes.map((t, i) => ({ t, i })).sort(() => Math.random() - .5);
    box.innerHTML = `
      <div class="card trLicao semLicao">
        <button class="linkbtn" data-sem-voltar="1">← Voltar ao curso</button>
        <p class="mut small" style="margin:6px 0 0">⚡ Lição da semana ${n} · ⏱ cerca de 6 minutos</p>
        <h3 style="margin:4px 0 2px">${esc(l.t)}</h3><p class="small mut" style="margin:0 0 6px">${esc(l.tema)}</p>
        <h4 class="trPasso">🎧 Ouça</h4>
        ${'speechSynthesis' in window ? '<div class="row wrap"><button class="primary" data-sem-ouvir="' + n + '">▶️ Ouvir a lição</button><button class="hide" data-sem-parar="1">⏹ Parar</button></div>' : '<p class="mut small">Este celular não lê em voz alta. Leia o texto abaixo.</p>'}
        <details class="trRot"><summary>Ver o texto do áudio</summary><p class="small">${esc(l.roteiro)}</p></details>
        <div class="trCartao"><span>“${esc(l.frase)}”</span><small>Lição da semana · Curso Excelência no Atendimento ao Cliente</small></div>
        <h4 class="trPasso">🔁 Na prática</h4>
        <div class="semPrat">${l.pratica.map(([a, b]) => `<div class="semPar"><div class="semNao"><small>❌ Em vez de</small>${esc(a)}</div><div class="semSim"><small>✅ Faça assim</small>${esc(b)}</div></div>`).join('')}</div>
        <h4 class="trPasso">📖 Leia</h4><ul class="trLer">${l.ler.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h4 class="trPasso">✅ Faça esta semana</h4><p class="trDesafio">${esc(l.desafio)}</p>
        <h4 class="trPasso">❓ Responda</h4><p><b>${esc(l.pergunta)}</b></p>
        <div class="trOpc">${ord.map(o => `<button data-sem-resp="${n}:${o.i}">${esc(o.t)}</button>`).join('')}</div>
        <p class="small" id="semMsg"></p>
        <div class="trFim">
          <button class="primary big" id="semConcluir" data-sem-concluir="${n}" disabled>${feita ? '✓ Lição concluída' : '✔ Concluir lição'}</button>
          <p class="small mut" id="semConclMsg">${feita ? 'Você já concluiu esta lição.' : 'Acerte a pergunta acima para liberar o botão.'}</p>
        </div>
      </div>`;
    A().irAoTopo();
  }

  async function concluir(n) {
    const p = A().prog(); p.sem = p.sem || {};
    if (!p.sem[n]) { p.sem[n] = dLocal(new Date()); A().gravarP(p); }
    const sb = A().SB(), loja = A().LOJA(), acc = A().ACC();
    if (window.CA_log) window.CA_log('treino_semana', { licao: n, titulo: (L.find(x => x.n === n) || {}).t });
    if (sb && loja.id && acc.email) {
      try { await sb.from('training_progress').upsert({ store_id: loja.id, user_email: acc.email, user_name: acc.nome || null, trilha: TRILHA, licao: n }, { onConflict: 'store_id,user_email,trilha,licao', ignoreDuplicates: true }); } catch (e) { /* fica no aparelho */ }
    }
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-sem-abrir]');
    if (a) { parar(); abrir(+a.dataset.semAbrir); return; }
    if (e.target.closest('[data-sem-voltar]')) { parar(); A().render(); A().irAoTopo(); return; }
    const o = e.target.closest('[data-sem-ouvir]'); if (o) { ouvir(+o.dataset.semOuvir); return; }
    if (e.target.closest('[data-sem-parar]')) { parar(); return; }
    const r = e.target.closest('[data-sem-resp]');
    if (r) {
      const [n, i] = r.dataset.semResp.split(':').map(Number), l = L.find(x => x.n === n);
      document.querySelectorAll('[data-sem-resp]').forEach(b => b.classList.remove('certa', 'errada'));
      const ok = i === l.certa; r.classList.add(ok ? 'certa' : 'errada');
      $('#semMsg').innerHTML = ok ? '<span class="rodOk">Isso mesmo! 👏</span>' : 'Quase! Releia o “Na prática” e tente de novo.';
      const c = $('#semConcluir'); if (c && ok && !semFeitas()[n]) c.disabled = false;
      return;
    }
    const c = e.target.closest('[data-sem-concluir]');
    if (c && !c.disabled) {
      const n = +c.dataset.semConcluir; concluir(n);
      c.disabled = true; c.textContent = '✓ Lição concluída';
      $('#semConclMsg').innerHTML = '<span class="rodOk">Lição da semana concluída! Até segunda que vem. 👋</span> <button data-sem-voltar="1">Voltar ao curso</button>';
    }
  });
  // Sair da aba ou fechar o bloco do curso para a voz
  document.addEventListener('visibilitychange', () => { if (document.hidden) parar(); });
})();
