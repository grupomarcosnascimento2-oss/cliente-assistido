/* Cliente Assistido – Curso ACOLHIMENTO QUE FAZ A DIFERENÇA · ninguém fica sozinho na nossa comunidade (1.79.0).
   Segmento católico (paróquias, pastorais, ministérios, movimentos). Pedido do Marcos em 13/11/2026: o acolhimento
   precisa ser incondicional, porque Cristo acolheu a todos e os primeiros cristãos viviam unidos.
   Mesmo molde da Fraternidade Viva (curso-fraternidade.js) e mesmo motor (treino.js). Narradora: Mariana (voz Sage).
   A loja (comunidade) escolhe o curso em stores.recursos.curso = 'acolhimento' (Admin → Lojas → Editar → Curso).
   Progresso na trilha 'ac1' (training_progress). */
'use strict';
(function () {
  const F = 'font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"';
  const EMO = 'font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif"';
  const K = { az: '#2F5D8C', az2: '#1E3F63', ou: '#E2A93B', ve: '#0A8F52', vi: '#7A4FB5', ro: '#D96A7A', cr: '#FBF7F1', ce: '#EAF2F8', te: '#E9DFD1', n: '#0B2545', pe: ['#F2C9A0', '#D9A77F', '#B9825A', '#8D5A3B'] };
  // ---------- peças do desenho ----------
  function pes(x, y, o) { // pessoa simples: o.c roupa, o.p pele, o.h cabelo, o.e escala, o.t triste, o.f fala
    o = o || {}; const s = o.e || 1, p = o.p || K.pe[0], c = o.c || K.az;
    const boca = o.t ? '<path d="M-6 9 q6 -5 12 0" stroke="#0B2545" stroke-width="2" fill="none" stroke-linecap="round"/>' : '<path d="M-6 6 q6 6 12 0" stroke="#0B2545" stroke-width="2" fill="none" stroke-linecap="round"/>';
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-20" y="20" width="40" height="46" rx="16" fill="${c}"/><circle r="18" fill="${p}"/><path d="M-17 -5 q2 -18 17 -19 q15 1 17 19 q-7 -9 -17 -9 q-10 0 -17 9z" fill="${o.h || '#3b2616'}"/><circle cx="-6" cy="-1" r="2.2" fill="#0B2545"/><circle cx="6" cy="-1" r="2.2" fill="#0B2545"/>${boca}</g>`;
  }
  function igreja(x, y, s) {
    s = s || 1;
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-10" width="68" height="56" fill="#fff" stroke="${K.az2}" stroke-width="2"/><path d="M-40 -8 L0 -40 L40 -8z" fill="${K.ou}" stroke="${K.az2}" stroke-width="2"/><rect x="-8" y="-70" width="16" height="34" fill="#fff" stroke="${K.az2}" stroke-width="2"/><path d="M0 -92 v18 M-7 -85 h14" stroke="${K.az2}" stroke-width="3" stroke-linecap="round"/><path d="M-10 46 v-22 a10 10 0 0 1 20 0 v22z" fill="${K.az}"/><circle cx="0" cy="8" r="7" fill="${K.ce}" stroke="${K.az2}" stroke-width="1.5"/></g>`;
  }
  const emo = (x, y, e, t) => `<text x="${x}" y="${y}" font-size="${t || 30}" text-anchor="middle" ${EMO}>${e}</text>`;
  const bal = (x, y, w, t, cor) => `<rect x="${x}" y="${y}" width="${w}" height="28" rx="14" fill="${cor || '#fff'}" stroke="${cor ? cor : '#D5DDE3'}" stroke-width="1.5"/><path d="M${x + 16} ${y + 28} l-6 9 l13 -9z" fill="${cor || '#fff'}"/><text x="${x + w / 2}" y="${y + 19}" text-anchor="middle" font-size="12" font-weight="700" fill="${cor ? '#fff' : K.n}" ${F}>${t}</text>`;
  const cena = (fundo, miolo) => `<svg viewBox="0 0 320 180" role="img" aria-hidden="true"><rect width="320" height="180" fill="${fundo}"/><rect y="150" width="320" height="30" fill="#00000010"/>${miolo}</svg>`;
  const roda = (cx, cy, n, r, cores) => Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.15 + 0.7 * i / (n - 1)); return pes(cx - Math.cos(a) * r, cy - Math.sin(a) * r * 0.25, { c: cores[i % cores.length], p: K.pe[i % 4], e: 0.8 }); }).join('');
  const C3 = [K.az, K.ve, K.vi, K.ro, K.ou];

  const livro = (fundo, cor, esq, dir1, dir2, topo) => cena(fundo, `<path d="M160 52 q-46 -14 -92 0 v92 q46 -14 92 0z" fill="#fff" stroke="${cor}" stroke-width="3"/><path d="M160 52 q46 -14 92 0 v92 q-46 -14 -92 0z" fill="#fff" stroke="${cor}" stroke-width="3"/><path d="M160 52 v92" stroke="${cor}" stroke-width="2"/>` + `<path d="M114 66 v34 M102 78 h24" stroke="${K.az2}" stroke-width="4" stroke-linecap="round"/>` + `<text x="114" y="122" text-anchor="middle" font-size="11" font-weight="800" fill="${K.n}" ${F}>${esq}</text>` + `<text x="206" y="${dir2 ? 88 : 102}" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>${dir1}</text>` + (dir2 ? `<text x="206" y="112" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>${dir2}</text>` : '') + emo(160, 34, topo || '🕊️', 24));
  const cic = (par, topo) => livro('#FBF4E4', K.ou, 'Catecismo', par, '', topo || '✝️');
  const ref = (fundo, txt, x, y) => `<rect x="${x - 40}" y="${y - 16}" width="80" height="24" rx="12" fill="${K.az2}"/><text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" ${F}>${txt}</text>`;
  const cad = (x, y, cor) => `<g transform="translate(${x} ${y})"><rect x="-16" y="0" width="32" height="8" rx="3" fill="${cor || K.te}"/><rect x="-16" y="-26" width="6" height="26" fill="${cor || K.te}"/><rect x="-14" y="8" width="4" height="18" fill="#8D6E52"/><rect x="10" y="8" width="4" height="18" fill="#8D6E52"/></g>`;
  const porta = (x, y, aberta) => `<g transform="translate(${x} ${y})"><rect x="-26" y="-60" width="52" height="96" rx="4" fill="#fff" stroke="${K.az2}" stroke-width="2"/>${aberta ? `<path d="M-24 -58 L6 -50 L6 30 L-24 34z" fill="${K.ou}"/>` : `<rect x="-22" y="-56" width="44" height="88" fill="${K.az}"/><circle cx="14" cy="-10" r="3" fill="#fff"/>`}</g>`;

  // ---------- Lição 1: A solidão ao nosso redor ----------
  const L1 = [
    ['Oi! Aqui é a Mariana. Que alegria ter você nesta formação: Acolhimento que faz a diferença. Esta é a primeira lição. Vamos começar olhando ao nosso redor, com calma e com o coração aberto.',
      cena(K.ce, igreja(160, 92, .9) + roda(160, 118, 5, 120, C3) + emo(160, 36, '🤗', 26))],
    ['Talvez você conheça alguém assim: a família mora longe, os amigos foram se afastando, e os dias passam sem que ninguém pergunte: como você está?',
      cena('#EEF1F4', pes(160, 86, { c: '#9AA6A0', t: true }) + emo(76, 60, '🏠', 26) + `<path d="M96 70 h40" stroke="#9AA6A0" stroke-width="3" stroke-dasharray="5 5"/>` + emo(250, 56, '📱', 26) + emo(250, 96, '…', 22))],
    ['A Organização Mundial da Saúde publicou, em junho de 2025, um dado que assusta: uma em cada seis pessoas no mundo se sente sozinha.',
      cena(K.cr, Array.from({ length: 6 }, (_, i) => pes(40 + i * 48, 92, { c: i === 3 ? '#9AA6A0' : C3[i % 5], p: K.pe[i % 4], t: i === 3, e: .75 })).join('') + `<text x="160" y="32" text-anchor="middle" font-size="16" font-weight="800" fill="${K.n}" ${F}>1 em cada 6</text>`)],
    ['E a solidão não machuca só o coração. Segundo a mesma Organização, ela está ligada a mais de oitocentas e setenta mil mortes por ano. A solidão adoece.',
      cena('#F6EEEE', emo(110, 104, '💔', 52) + emo(210, 104, '🩺', 46) + `<text x="160" y="40" text-anchor="middle" font-size="14" font-weight="800" fill="${K.n}" ${F}>a solidão adoece</text>`)],
    ['E, olha que surpresa: muita gente se sente sozinha até dentro da igreja. Vem à missa todo domingo, senta no mesmo banco, e vai embora sem que ninguém saiba o seu nome.',
      cena(K.ce, igreja(70, 96, .7) + cad(160, 110) + pes(160, 80, { c: '#9AA6A0', t: true, e: .8 }) + cad(220, 110) + cad(270, 110) + emo(160, 36, '❔', 22))],
    ['Às vezes acontece até dentro das pastorais. A pessoa serve há anos, mas ninguém a convida para um café, ninguém percebe quando ela falta, ninguém pergunta da família dela.',
      cena(K.cr, roda(130, 118, 4, 80, C3) + pes(272, 92, { c: '#9AA6A0', t: true, e: .8 }) + `<path d="M226 120 h20" stroke="#9AA6A0" stroke-width="3" stroke-dasharray="4 4"/>`)],
    ['Logo no começo da Bíblia, no livro do Gênesis, Deus diz: não é bom que o homem esteja só. Nós fomos criados para viver em comunhão.',
      livro('#FBF4E4', K.ou, 'Bíblia', 'Gn 2,18', '', '🌳')],
    ['O Catecismo da Igreja Católica ensina, no parágrafo 1879, que a pessoa humana tem necessidade da vida social. Isso não é um enfeite: faz parte da nossa natureza. É no contato com os outros, no serviço e no diálogo, que a gente responde à própria vocação.',
      cic('§ 1879')],
    ['E, no parágrafo 1878, o Catecismo lembra que o amor ao próximo é inseparável do amor a Deus. Quem ama a Deus não consegue ficar indiferente ao irmão que está sozinho.',
      cic('§ 1878', '💛')],
    ['Por isso o acolhimento não é só simpatia nem gentileza de recepção. Acolher é viver o Evangelho: é fazer o outro sentir que tem lugar, que é esperado e que faz falta.',
      cena('#EAF6EF', porta(110, 110, true) + pes(200, 86, { c: K.ve }) + emo(200, 36, '🤗', 26) + emo(250, 60, '💚', 20))],
    ['E esse acolhimento precisa ser para todos: para quem chega pela primeira vez, para quem volta depois de muito tempo, para quem pensa diferente e para quem está sofrendo. Ninguém fica de fora.',
      cena(K.cr, roda(160, 118, 6, 140, C3) + emo(160, 44, '🤝', 30))],
    ['Nesta formação, você vai aprender a perceber quem está sozinho, a acolher quem chega e a fazer da sua comunidade uma casa. Ao concluir esta lição, a próxima já fica liberada. Vamos juntos?',
      cena(K.cr, [['👀', 'perceber', 70], ['🤗', 'acolher', 160], ['🏠', 'ser casa', 250]].map(([e, t, x]) => `<rect x="${x - 40}" y="44" width="80" height="84" rx="12" fill="#fff" stroke="${K.ve}" stroke-width="2"/>` + emo(x, 92, e, 30) + `<text x="${x}" y="118" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join(''))]
  ];

  // ---------- Lição 2: Jesus acolhia a todos ----------
  const L2 = [
    ['Que bom ter você de volta! Nesta segunda lição, vamos olhar para o maior exemplo de acolhimento que existe: o próprio Jesus.',
      cena(K.ce, emo(160, 100, '✝️', 60) + emo(90, 60, '✨', 20) + emo(230, 60, '✨', 20))],
    ['Jesus nunca escolheu quem merecia a sua atenção. Ele parava para os doentes, para os pobres, para os estrangeiros e para os pecadores. Ninguém era invisível para Ele.',
      cena(K.cr, roda(160, 118, 5, 120, ['#9AA6A0', K.az, K.ro, K.vi, K.ou]) + emo(160, 44, '👀', 26))],
    ['Lembra de Zaqueu? Era um cobrador de impostos, desprezado por todos. Subiu numa árvore só para ver Jesus passar. E Jesus parou, olhou para cima, chamou Zaqueu pelo nome e foi almoçar na casa dele.',
      cena('#EAF6EF', emo(220, 80, '🌳', 90) + pes(226, 58, { c: K.ou, e: .55 }) + pes(110, 92, { c: '#fff', p: K.pe[1] }) + ref('', 'Lc 19,5', 110, 34))],
    ['Ninguém mudou de vida porque foi criticado. Zaqueu mudou porque foi acolhido. O olhar de Jesus veio antes da conversão.',
      cena(K.cr, pes(130, 86, { c: '#fff', p: K.pe[1] }) + pes(200, 86, { c: K.ou }) + emo(165, 40, '💛', 28))],
    ['Com a samaritana, no poço de Jacó, Jesus quebrou várias barreiras de uma vez: conversou com uma mulher, estrangeira, que todos evitavam. Pediu água e ofereceu a ela uma água viva.',
      cena(K.ce, `<ellipse cx="160" cy="132" rx="44" ry="14" fill="#B9825A"/><rect x="116" y="108" width="88" height="24" fill="#D9A77F"/>` + pes(96, 86, { c: '#fff', p: K.pe[1] }) + pes(228, 86, { c: K.vi, p: K.pe[2] }) + ref('', 'Jo 4', 160, 34))],
    ['Quando as mães trouxeram as crianças, e os discípulos quiseram afastá-las, Jesus se aborreceu e disse: deixai vir a mim as criancinhas.',
      cena('#FFF6E5', pes(160, 80, { c: '#fff', p: K.pe[1] }) + pes(100, 110, { c: K.ve, e: .55 }) + pes(220, 110, { c: K.ro, e: .55 }) + pes(130, 118, { c: K.az, e: .5 }) + ref('', 'Mc 10,14', 160, 30))],
    ['Os fariseus reclamavam: esse homem acolhe os pecadores e come com eles. O que para eles era um escândalo, para Jesus era o jeito de Deus amar.',
      cena(K.cr, `<rect x="70" y="104" width="180" height="12" rx="4" fill="#8D6E52"/>` + roda(160, 112, 5, 90, C3) + ref('', 'Lc 15,2', 160, 32))],
    ['O Catecismo, no parágrafo 589, diz que Jesus escandalizou, sobretudo, porque identificou a sua conduta misericordiosa com os pecadores com a atitude do próprio Deus. Sentando-se à mesa com eles, mostrava que também eles tinham lugar no banquete.',
      cic('§ 589')],
    ['Acolher não é aprovar tudo. Com a mulher que todos queriam apedrejar, Jesus disse: eu também não te condeno; vai, e de agora em diante não peques mais. Primeiro veio o acolhimento; depois, o convite à vida nova.',
      cena('#F4F1EA', pes(120, 86, { c: '#fff', p: K.pe[1] }) + pes(200, 92, { c: K.ro, p: K.pe[2], e: .9 }) + emo(270, 130, '🪨', 22) + emo(40, 130, '🪨', 22) + ref('', 'Jo 8,11', 160, 30))],
    ['Isso vale para nós: a gente acolhe a pessoa sempre, por inteiro, mesmo sem concordar com tudo o que ela faz. O acolhimento abre a porta; o amor faz o resto.',
      cena('#EAF6EF', porta(100, 110, true) + emo(190, 96, '💚', 46) + emo(250, 70, '🚪', 26))],
    ['Pense agora: quem é o Zaqueu da sua comunidade? Aquela pessoa que fica de longe, que ninguém chama pelo nome, ou que os outros evitam?',
      cena(K.ce, roda(120, 118, 4, 70, C3) + pes(262, 96, { c: '#9AA6A0', e: .8 }) + emo(262, 46, '❓', 24))],
    ['Na próxima lição, vamos ver como os primeiros cristãos viveram esse acolhimento no dia a dia. Até lá, peça a Jesus um olhar como o dele: que veja cada pessoa e não deixe ninguém de fora.',
      cena('#E5F3EA', emo(120, 100, '🙏', 50) + emo(210, 96, '👁️', 40) + emo(260, 56, '✨', 20))]
  ];

  // ---------- Lição 3: Os primeiros cristãos, um só coração ----------
  const L3 = [
    ['Seja bem-vindo à terceira lição! Hoje vamos voltar no tempo, até as primeiras comunidades cristãs, para aprender com elas como se vive o acolhimento.',
      cena('#F4F1EA', emo(160, 100, '📜', 60) + emo(90, 60, '🕯️', 26) + emo(230, 60, '🕯️', 26))],
    ['O livro dos Atos dos Apóstolos conta que os primeiros cristãos eram assíduos ao ensinamento dos apóstolos, à comunhão fraterna, à fração do pão e às orações.',
      livro('#FBF4E4', K.ou, 'Bíblia', 'At 2,42', '', '🍞')],
    ['Eles partiam o pão nas casas, tomavam as refeições com alegria e simplicidade de coração. E todos os dias o Senhor acrescentava novas pessoas à comunidade.',
      cena(K.cr, `<rect x="70" y="104" width="180" height="12" rx="4" fill="#8D6E52"/>` + roda(160, 112, 5, 90, C3) + emo(160, 40, '🍞', 28))],
    ['E a Bíblia diz algo lindo: a multidão dos que tinham abraçado a fé tinha um só coração e uma só alma. Ninguém passava necessidade, porque um cuidava do outro.',
      cena('#EAF6EF', roda(160, 118, 6, 140, C3) + emo(160, 44, '❤️', 32) + ref('', 'At 4,32', 160, 150))],
    ['O Catecismo retoma isso no parágrafo 2624: na primeira comunidade de Jerusalém, os crentes eram assíduos à comunhão fraterna. Uma oração fundada na fé, confirmada pela caridade e alimentada na Eucaristia.',
      cic('§ 2624')],
    ['Gente atraía gente. As pessoas não vinham só pelas palavras: vinham porque viam como aqueles cristãos se amavam e se acolhiam.',
      cena(K.cr, roda(120, 118, 4, 70, C3) + pes(250, 92, { c: K.vi, e: .8 }) + `<path d="M226 96 l-20 6" stroke="${K.ve}" stroke-width="3" stroke-linecap="round"/>` + emo(250, 46, '😊', 22))],
    ['Esse jeito de acolher já vinha de longe. Abraão, debaixo do carvalho de Mambré, correu ao encontro de três desconhecidos, lavou os pés deles e preparou uma refeição. Sem saber, recebeu o próprio Senhor.',
      cena('#FFF3E6', emo(240, 90, '🌳', 80) + pes(110, 86, { c: K.ou, p: K.pe[2] }) + pes(190, 98, { c: '#fff', e: .7 }) + ref('', 'Gn 18', 110, 32))],
    ['Por isso a carta aos Hebreus aconselha: não vos esqueçais da hospitalidade, pois, graças a ela, alguns, sem saber, acolheram anjos.',
      cena(K.ce, porta(110, 110, true) + emo(210, 90, '👼', 46) + ref('', 'Hb 13,2', 210, 34))],
    ['São Bento, na regra que escreveu para os monges, pede que todos os hóspedes que chegam sejam recebidos como o próprio Cristo, com toda a humildade e cuidado.',
      cena('#F4F1EA', pes(120, 86, { c: '#3b2616', p: K.pe[0], h: '#3b2616' }) + pes(210, 90, { c: K.az, e: .9 }) + emo(165, 44, '🙇', 26))],
    ['E a Igreja chama isso de obras de misericórdia. O Catecismo, no parágrafo 2447, diz que elas são as ações de caridade com que socorremos o próximo, no corpo e na alma: consolar, aconselhar, suportar com paciência, visitar os doentes, acolher quem não tem casa.',
      cic('§ 2447', '🤲')],
    ['Repare: nada disso exige dinheiro ou um cargo na paróquia. Exige tempo, atenção e um coração disponível. Um café, uma visita, uma ligação.',
      cena(K.cr, [['☕', 'um café', 70], ['🚪', 'uma visita', 160], ['📞', 'uma ligação', 250]].map(([e, t, x]) => `<rect x="${x - 40}" y="44" width="80" height="84" rx="12" fill="#fff" stroke="${K.ve}" stroke-width="2"/>` + emo(x, 92, e, 30) + `<text x="${x}" y="118" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join(''))],
    ['Os primeiros cristãos não eram perfeitos, mas tinham um só coração. Que a nossa comunidade também seja reconhecida assim. Na próxima lição: o primeiro minuto de quem chega.',
      cena('#E5F3EA', igreja(110, 96, .75) + emo(220, 96, '❤️', 44) + emo(270, 52, '✨', 20))]
  ];

  // ---------- Lição 4: O primeiro minuto ----------
  const L4 = [
    ['Que alegria ter você na quarta lição! Hoje vamos falar de um momento pequeno, mas decisivo: o primeiro minuto de quem chega à nossa comunidade.',
      cena(K.ce, porta(160, 110, true) + emo(160, 34, '⏱️', 26))],
    ['Pense em alguém que entra na igreja pela primeira vez, ou que volta depois de muitos anos. Ela não conhece ninguém, não sabe onde sentar, e fica com o coração apertado.',
      cena(K.cr, igreja(80, 96, .7) + pes(200, 90, { c: K.vi, t: true, e: .85 }) + emo(200, 40, '😟', 22))],
    ['Nesse primeiro minuto, ela decide, muitas vezes sem perceber, se vai voltar ou não. Um sorriso pode ser o começo de uma vida nova na fé. Uma cara fechada pode ser a última visita.',
      cena('#F4F1EA', emo(110, 100, '🙂', 50) + emo(210, 100, '😐', 50) + `<text x="110" y="150" text-anchor="middle" font-size="11" font-weight="800" fill="${K.ve}" ${F}>volta</text><text x="210" y="150" text-anchor="middle" font-size="11" font-weight="800" fill="#9AA6A0" ${F}>some</text>`)],
    ['O Papa Francisco escreveu, na exortação A Alegria do Evangelho, que a Igreja é chamada a ser sempre a casa aberta do Pai. Uma casa onde todos podem entrar.',
      cena('#FFF3E6', igreja(160, 100, 1) + emo(250, 60, '🗝️', 26) + ref('', 'EG 47', 70, 40))],
    ['E não é preciso fazer nada difícil. Primeiro passo: perceber quem chegou. Um rosto novo, alguém sozinho no banco, alguém que parece perdido.',
      cena(K.cr, cad(100, 110) + cad(160, 110) + cad(220, 110) + pes(220, 80, { c: K.vi, e: .8 }) + emo(120, 50, '👀', 26))],
    ['Segundo passo: chegar perto, sorrir e se apresentar. E perguntar o nome da pessoa. E, mais importante, guardar esse nome.',
      cena(K.cr, pes(120, 86, { c: K.ve }) + pes(200, 86, { c: K.vi, p: K.pe[2] }) + bal(80, 20, 160, 'Oi! Eu sou a Ana. E você?'))],
    ['Terceiro passo: apresentar a pessoa a mais alguém. Sentar junto, explicar como é a missa ou a reunião, e mostrar onde fica cada coisa.',
      cena(K.cr, pes(90, 86, { c: K.ve }) + pes(160, 86, { c: K.vi, p: K.pe[2] }) + pes(230, 86, { c: K.az, p: K.pe[1] }) + emo(160, 36, '🤝', 26))],
    ['E o quarto passo: convidar para voltar. Diga que foi bom conhecê-la e que, no próximo domingo, você vai estar esperando.',
      cena('#EAF6EF', porta(90, 110, true) + pes(190, 86, { c: K.ve }) + bal(150, 18, 140, 'Até domingo!', K.ve) + emo(260, 100, '📅', 30))],
    ['O Catecismo, no parágrafo 1931, diz que cada um deve considerar o seu próximo, sem qualquer exceção, como outro ele mesmo. Sem exceção: nem pela roupa, nem pelo jeito, nem pela história de vida.',
      cic('§ 1931', '🤝')],
    ['No caminho de Emaús, Jesus se aproximou de dois discípulos tristes, caminhou com eles e escutou antes de falar. Quando partiu o pão, os olhos deles se abriram. Acolher é caminhar junto.',
      cena('#FFF6E5', `<path d="M20 150 q140 -40 280 0" stroke="#D9A77F" stroke-width="18" fill="none"/>` + pes(110, 92, { c: K.az, e: .85 }) + pes(160, 88, { c: '#fff', p: K.pe[1], e: .85 }) + pes(210, 92, { c: K.vi, e: .85 }) + ref('', 'Lc 24', 160, 30))],
    ['Tome cuidado com uma coisa: muitas vezes a gente fica só com o grupinho de sempre e nem percebe quem está do lado de fora. Acolher é sair do nosso círculo.',
      cena(K.cr, roda(120, 118, 4, 60, C3) + `<circle cx="120" cy="100" r="64" fill="none" stroke="#9AA6A0" stroke-width="2" stroke-dasharray="6 6"/>` + pes(262, 96, { c: '#9AA6A0', e: .8 }))],
    ['Neste domingo, faça a experiência: procure uma pessoa nova, ou que esteja sozinha, e viva com ela esse primeiro minuto. Na próxima lição, vamos olhar para quem já está do nosso lado, mas se sente só.',
      cena('#E5F3EA', igreja(100, 96, .7) + pes(200, 92, { c: K.ve, e: .8 }) + pes(250, 92, { c: K.vi, e: .8 }) + emo(225, 44, '😊', 24))]
  ];

  // ---------- Lição 5: Quem está sozinho do nosso lado ----------
  const L5 = [
    ['Seja bem-vindo à quinta lição! Hoje o nosso olhar vai para dentro: para quem já faz parte da comunidade, mas está se sentindo sozinho.',
      cena(K.ce, roda(160, 118, 5, 120, C3) + emo(160, 40, '🔍', 26))],
    ['Às vezes é aquele veterano que serve há trinta anos e ninguém mais escuta. A pessoa que sempre estava presente e, de repente, sumiu. Quem perdeu alguém querido. Ou o voluntário que está cansado e não tem coragem de dizer.',
      cena(K.cr, pes(60, 92, { c: '#9AA6A0', h: '#e8e8e8', e: .8 }) + `<rect x="100" y="70" width="44" height="60" rx="8" fill="#fff" stroke="#9AA6A0" stroke-dasharray="5 4" stroke-width="2"/>` + emo(122, 106, '👤', 26) + pes(190, 92, { c: K.n, t: true, e: .8 }) + emo(190, 46, '🕊️', 18) + pes(262, 92, { c: K.ou, t: true, e: .8 }) + emo(262, 46, '😓', 20))],
    ['Jesus contou a parábola do pastor que tinha cem ovelhas, perdeu uma, e deixou as noventa e nove para ir atrás dela até encontrá-la. Para Ele, cada pessoa conta.',
      cena('#EAF6EF', Array.from({ length: 8 }, (_, i) => emo(40 + (i % 4) * 34, 100 + Math.floor(i / 4) * 30, '🐑', 22)).join('') + pes(230, 86, { c: K.az }) + emo(280, 120, '🐑', 26) + ref('', 'Lc 15,4', 230, 30))],
    ['Uma pergunta para hoje: quem faltou nas últimas semanas e ninguém percebeu? Na nossa comunidade, a ausência de alguém deveria fazer falta.',
      cena(K.cr, cad(80, 110) + cad(130, 110) + cad(180, 110) + cad(230, 110) + pes(80, 80, { c: K.az, e: .8 }) + pes(130, 80, { c: K.ve, e: .8 }) + pes(230, 80, { c: K.vi, e: .8 }) + emo(180, 70, '❓', 28))],
    ['O bom samaritano não perguntou quem era o homem caído na estrada, nem se ele merecia ajuda. Ele viu, teve compaixão, chegou perto e cuidou.',
      cena('#FFF6E5', `<path d="M20 150 h280" stroke="#D9A77F" stroke-width="14"/>` + pes(120, 116, { c: '#9AA6A0', t: true, e: .8 }) + pes(196, 92, { c: K.ve }) + emo(150, 64, '🤲', 26) + ref('', 'Lc 10', 260, 34))],
    ['O Catecismo, no parágrafo 1932, ensina que o dever de nos fazermos próximos do outro, e de servi-lo ativamente, é ainda mais urgente quando esse outro está mais desprotegido. E lembra as palavras de Jesus: o que fizestes a um destes pequeninos, foi a mim que o fizestes.',
      cic('§ 1932')],
    ['Acolher quem está sozinho do nosso lado pede gestos simples: uma ligação para quem sumiu, uma visita a quem está doente, uma mensagem no aniversário, sentar ao lado de quem ficou viúvo.',
      cena(K.cr, [['📞', 'ligar', 70], ['🏡', 'visitar', 160], ['🎂', 'lembrar', 250]].map(([e, t, x]) => `<rect x="${x - 40}" y="44" width="80" height="84" rx="12" fill="#fff" stroke="${K.ve}" stroke-width="2"/>` + emo(x, 92, e, 30) + `<text x="${x}" y="118" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join(''))],
    ['E muitas vezes o maior presente é a escuta. Ouvir sem pressa, sem dar conselho logo de cara, sem olhar o celular. Só estar presente.',
      cena(K.ce, pes(120, 86, { c: K.ve }) + pes(200, 86, { c: '#9AA6A0', h: '#e8e8e8' }) + emo(150, 44, '👂', 26) + emo(240, 130, '📵', 22))],
    ['A brasileira Santa Dulce dos Pobres, o Anjo Bom da Bahia, acolhia doentes que ninguém queria. Quando não havia mais lugar, ela improvisou um abrigo no galinheiro ao lado do convento, só para não deixar ninguém na rua.',
      cena('#F4F1EA', pes(130, 86, { c: K.az2, p: K.pe[0], h: '#fff' }) + pes(210, 110, { c: '#9AA6A0', t: true, e: .7 }) + emo(170, 40, '😇', 26) + emo(268, 120, '🐔', 22))],
    ['Cuidado também com quem cuida. Coordenadores, catequistas e ministros também ficam cansados e sozinhos. Pergunte a eles: e você, como está?',
      cena(K.cr, pes(130, 86, { c: K.ou, t: true }) + pes(210, 86, { c: K.ve }) + bal(150, 20, 140, 'E você, como está?'))],
    ['Ninguém consegue acolher todo mundo sozinho. Mas, se cada pessoa da comunidade cuidar de uma ou duas, ninguém fica esquecido.',
      cena('#EAF6EF', roda(160, 118, 6, 140, C3) + `<path d="M60 124 q100 40 200 0" stroke="${K.ve}" stroke-width="4" fill="none"/>` + emo(160, 44, '🤝', 30))],
    ['Ainda hoje, escolha uma pessoa da sua comunidade que você não vê há algum tempo, ou que está passando por um momento difícil, e entre em contato. Na última lição, vamos ver como fazer da comunidade uma casa.',
      cena('#E5F3EA', emo(120, 100, '📱', 50) + emo(210, 100, '💚', 46) + emo(260, 56, '✨', 20))]
  ];

  // ---------- Lição 6: Uma comunidade que é casa ----------
  const L6 = [
    ['Chegamos à sexta e última lição! Hoje vamos juntar tudo o que aprendemos e sonhar com uma comunidade que seja, de verdade, uma casa para todos.',
      cena(K.ce, igreja(160, 96, 1) + emo(250, 56, '🏠', 28) + emo(70, 56, '✨', 20))],
    ['O Catecismo, no parágrafo 2179, diz que a paróquia é o lugar onde todos os fiéis podem se reunir na celebração do domingo. E que ela vive a caridade do Senhor em obras boas e fraternas.',
      cic('§ 2179', '⛪')],
    ['A Conferência dos Bispos do Brasil, no Documento 100, chama a paróquia de comunidade de comunidades. Muitos grupos pequenos, onde cada pessoa é conhecida pelo nome, unidos numa só família.',
      cena(K.cr, [70, 160, 250].map((x, i) => roda(x, 118, 3, 34, [C3[i], C3[i + 1], C3[i + 2]]) + `<circle cx="${x}" cy="104" r="40" fill="none" stroke="${K.ve}" stroke-width="2"/>`).join('') + ref('', 'CNBB Doc. 100', 160, 30))],
    ['Mas um perigo ronda toda comunidade: as panelinhas. Grupos fechados, onde quem chega se sente de fora, e onde sempre são os mesmos que decidem e participam.',
      cena('#F6EEEE', roda(120, 118, 4, 60, C3) + `<circle cx="120" cy="100" r="64" fill="none" stroke="${K.ro}" stroke-width="3"/>` + pes(262, 96, { c: '#9AA6A0', t: true, e: .8 }) + emo(262, 46, '🚫', 20))],
    ['Uma comunidade que é casa tem a porta aberta: pergunta o nome, faz espaço na roda, divide as tarefas e se alegra com quem chega, até quando ele traz ideias novas.',
      cena('#EAF6EF', porta(90, 110, true) + roda(200, 118, 4, 70, C3) + emo(200, 44, '😊', 24))],
    ['Jesus disse: eu era estrangeiro, e me acolhestes. Cada vez que acolhemos alguém, é o próprio Cristo que estamos recebendo.',
      livro('#FBF4E4', K.ou, 'Bíblia', 'Mt 25,35', '', '✝️')],
    ['Santa Teresa de Calcutá dizia que a pior pobreza é a solidão e o sentimento de não ser amado. E ela começava o acolhimento pelo mais simples: um sorriso.',
      cena('#F4F1EA', pes(140, 86, { c: '#fff', p: K.pe[1], h: '#fff' }) + `<path d="M122 66 h36" stroke="${K.az}" stroke-width="4"/>` + emo(220, 90, '😊', 44))],
    ['O acolhimento também aparece nos pequenos detalhes: uma placa de boas-vindas, alguém na porta para receber, um café depois da missa, a lembrança do aniversário dos membros.',
      cena(K.cr, `<rect x="40" y="40" width="110" height="40" rx="8" fill="${K.ve}"/><text x="95" y="66" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" ${F}>Bem-vindo!</text>` + emo(200, 100, '☕', 36) + emo(260, 100, '🎂', 36))],
    ['E, acima de tudo, o acolhimento precisa ser incondicional. Não acolhemos só quem pensa como nós, só quem é simpático ou só quem pode ajudar. Acolhemos porque Cristo nos acolheu primeiro.',
      cena('#EAF6EF', roda(160, 118, 6, 140, ['#9AA6A0', K.az, K.ro, K.vi, K.ou, K.ve]) + emo(160, 44, '💛', 30))],
    ['São Paulo resume tudo na carta aos Romanos: acolhei-vos uns aos outros, como Cristo vos acolheu, para a glória de Deus.',
      livro('#FBF4E4', K.ou, 'Bíblia', 'Rm 15,7', '', '🕊️')],
    ['Agora, três compromissos para levar daqui. Primeiro: perceber quem está sozinho. Segundo: acolher quem chega, chamando pelo nome. Terceiro: cuidar de uma pessoa da comunidade de perto, todas as semanas.',
      cena(K.cr, [['👀', 'perceber', 70], ['🤗', 'acolher', 160], ['💚', 'cuidar', 250]].map(([e, t, x]) => `<rect x="${x - 40}" y="44" width="80" height="84" rx="12" fill="#fff" stroke="${K.ve}" stroke-width="2"/>` + emo(x, 92, e, 30) + `<text x="${x}" y="118" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join(''))],
    ['Obrigada por fazer esta formação comigo! Ao concluir esta lição, o seu certificado fica pronto. Mas o maior fruto vai ser ver, na sua comunidade, que ninguém mais fica sozinho. Que Nossa Senhora, que acolheu Jesus primeiro, te acompanhe!',
      cena('#E5F3EA', igreja(90, 96, .7) + emo(200, 100, '🏅', 56) + emo(270, 50, '🕊️', 26) + emo(150, 40, '✨', 20))]
  ];

  const LICOES = [
    { n: 1, t: 'A solidão ao nosso redor', audio: '',
      cartao: 'Ninguém foi feito para ficar sozinho.',
      ler: ['Uma em cada seis pessoas no mundo se sente sozinha (OMS, 2025), e a solidão adoece.',
        'Muita gente se sente sozinha até na igreja e dentro das pastorais.',
        'Não é bom que o homem esteja só (Gn 2,18): fomos criados para a comunhão.',
        'A vida social é uma exigência da nossa natureza (CIC § 1879), e o amor ao próximo é inseparável do amor a Deus (CIC § 1878).',
        'Acolher é fazer o outro sentir que tem lugar, que é esperado e que faz falta. Para todos, sem exceção.'],
      desafio: 'Hoje, observe a sua comunidade ou a sua pastoral e pergunte a si mesmo: "Quem aqui pode estar se sentindo sozinho?". Escreva o nome de uma pessoa e reze por ela.',
      pergunta: 'Segundo o Catecismo (§ 1879), por que a vida em comunidade é importante para a pessoa?',
      opcoes: ['Porque ajuda a organizar melhor as atividades da paróquia.', 'Porque é uma exigência da nossa natureza: é com os outros que a pessoa responde à sua vocação.', 'Porque é uma tradição antiga, mas opcional.'], certa: 1 },
    { n: 2, t: 'Jesus acolhia a todos', audio: '',
      cartao: 'Primeiro o acolhimento. Depois, a vida nova.',
      ler: ['Jesus parava para todos: doentes, pobres, estrangeiros e pecadores.',
        'Chamou Zaqueu pelo nome e foi à casa dele: o acolhimento veio antes da conversão (Lc 19).',
        'Conversou com a samaritana (Jo 4) e disse: deixai vir a mim as criancinhas (Mc 10,14).',
        'Ele acolhia os pecadores e comia com eles (Lc 15,2), mostrando a atitude do próprio Deus (CIC § 589).',
        'Acolher não é aprovar tudo: "Eu também não te condeno; vai, e não peques mais" (Jo 8,11).'],
      desafio: 'Hoje, procure alguém que costuma ficar de longe na sua comunidade e chame essa pessoa pelo nome, com um sorriso. Se ainda não souber o nome, pergunte.',
      pergunta: 'Na história de Zaqueu, o que veio primeiro?',
      opcoes: ['A mudança de vida de Zaqueu, e só depois Jesus o aceitou.', 'O olhar e o acolhimento de Jesus, que abriram caminho para a conversão.', 'A crítica dos fariseus, que fez Zaqueu mudar.'], certa: 1 },
    { n: 3, t: 'Os primeiros cristãos: um só coração', audio: '',
      cartao: 'Um só coração e uma só alma.',
      ler: ['Eram assíduos ao ensino dos apóstolos, à comunhão fraterna, à fração do pão e às orações (At 2,42; CIC § 2624).',
        'Tinham um só coração e uma só alma, e ninguém passava necessidade (At 4,32).',
        'Abraão acolheu três desconhecidos e recebeu o Senhor (Gn 18); "alguns, sem saber, acolheram anjos" (Hb 13,2).',
        'São Bento: todo hóspede seja recebido como o próprio Cristo.',
        'As obras de misericórdia socorrem o próximo no corpo e na alma (CIC § 2447): consolar, visitar, acolher.'],
      desafio: 'Nesta semana, faça uma obra de misericórdia simples: um café, uma visita ou uma ligação para alguém da comunidade que você conhece pouco.',
      pergunta: 'O que mais atraía novas pessoas para as primeiras comunidades cristãs?',
      opcoes: ['A beleza das construções.', 'O jeito como os cristãos se amavam e cuidavam uns dos outros.', 'A quantidade de eventos que organizavam.'], certa: 1 },
    { n: 4, t: 'O primeiro minuto: acolher quem chega', audio: '',
      cartao: 'Um sorriso no primeiro minuto pode mudar uma vida.',
      ler: ['No primeiro minuto, quem chega decide, muitas vezes sem perceber, se vai voltar.',
        'A Igreja é chamada a ser sempre a casa aberta do Pai (Papa Francisco, Evangelii Gaudium 47).',
        'Quatro passos: perceber quem chegou, sorrir e perguntar o nome, apresentar e sentar junto, convidar a voltar.',
        'Considerar o próximo, sem qualquer exceção, como outro ele mesmo (CIC § 1931).',
        'Como Jesus em Emaús (Lc 24): aproximar-se, caminhar junto e escutar antes de falar.'],
      desafio: 'No próximo encontro ou missa, procure uma pessoa nova ou sozinha e viva com ela os quatro passos: perceber, sorrir e perguntar o nome, apresentar a alguém e convidar para voltar.',
      pergunta: 'Uma senhora entra pela primeira vez na reunião da pastoral e fica sozinha no fundo da sala. O que mais ajuda?',
      opcoes: ['Esperar que ela tome a iniciativa de se apresentar.', 'Ir até ela, sorrir, perguntar o nome, apresentá-la ao grupo e convidá-la a voltar.', 'Comentar com os outros que tem alguém novo no fundo.'], certa: 1 },
    { n: 5, t: 'Quem está sozinho do nosso lado', audio: '',
      cartao: 'Na nossa comunidade, quem falta faz falta.',
      ler: ['Atenção ao veterano esquecido, a quem sumiu, a quem está de luto e ao voluntário cansado.',
        'O pastor deixa as noventa e nove para buscar a ovelha perdida (Lc 15,4).',
        'O bom samaritano viu, teve compaixão, chegou perto e cuidou (Lc 10).',
        'O dever de nos fazermos próximos é mais urgente com quem está mais desprotegido (CIC § 1932).',
        'Escutar sem pressa, ligar, visitar, lembrar o aniversário. Santa Dulce dos Pobres não deixava ninguém sem acolhida.'],
      desafio: 'Ainda hoje, entre em contato com uma pessoa da comunidade que você não vê há algum tempo ou que está passando por um momento difícil. Só para dizer: "Lembrei de você. Como você está?".',
      pergunta: 'A Dona Cida, que nunca faltava à novena, não aparece há um mês. O que mais se parece com o que Jesus ensina?',
      opcoes: ['Esperar que ela volte quando quiser.', 'Comentar no grupo que ela deve ter desistido.', 'Ligar ou visitar a Dona Cida para saber como ela está e dizer que ela faz falta.'], certa: 2 },
    { n: 6, t: 'Uma comunidade que é casa', audio: '',
      cartao: 'Acolhei-vos uns aos outros, como Cristo vos acolheu.',
      ler: ['A paróquia é o lugar onde todos podem se reunir e onde se vive a caridade em obras fraternas (CIC § 2179).',
        'Comunidade de comunidades (CNBB, Doc. 100): grupos pequenos onde cada um é conhecido pelo nome.',
        'Cuidado com as panelinhas: porta aberta, espaço na roda e tarefas divididas.',
        '"Eu era estrangeiro, e me acolhestes" (Mt 25,35). Santa Teresa de Calcutá: a pior pobreza é não ser amado.',
        'Acolhimento incondicional: acolhemos porque Cristo nos acolheu primeiro (Rm 15,7).'],
      desafio: 'Escolha os seus três compromissos e comece nesta semana: perceber quem está sozinho, acolher quem chega chamando pelo nome e cuidar de perto de uma pessoa da comunidade.',
      pergunta: 'Segundo São Paulo, na carta aos Romanos (15,7), qual é a medida do nosso acolhimento?',
      opcoes: ['Acolher quem pensa como nós.', 'Acolher como Cristo nos acolheu: a todos.', 'Acolher só quem já participa da comunidade.'], certa: 1 }
  ];
  const LS = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5, 6: L6 };
  LICOES.forEach(l => { if (LS[l.n]) l.roteiro = LS[l.n].map(x => x[0]).join(' '); });

  // Catecismo: texto LITERAL da tradução oficial em português da Santa Sé (vatican.va), conferido em 13/11/2026 pelo Chrome;
  // "(…)" marca trechos omitidos; os números das notas de rodapé foram tirados. 'e' = "em outras palavras".
  const CIC_U = 'https://www.vatican.va/archive/cathechism_po/index_new/';
  const CIC = {
    1: [{ n: '§ 1879', t: 'A pessoa humana tem necessidade da vida social. Esta não constitui para ela algo de acessório, mas uma exigência da sua natureza. Graças ao contacto com os demais, ao serviço mútuo e ao diálogo com os seus irmãos, o homem desenvolve as suas capacidades, e assim responde à sua vocação.', e: 'Ninguém foi feito para viver sozinho: é na comunidade que a pessoa cresce e vive a vocação que Deus lhe deu.', u: CIC_U + 'p3s1cap2_1877-1948_po.html' },
      { n: '§ 1878', t: 'O amor ao próximo é inseparável do amor a Deus.', e: 'Quem ama a Deus não fica indiferente ao irmão que está sozinho.', u: CIC_U + 'p3s1cap2_1877-1948_po.html' }],
    2: [{ n: '§ 589', t: 'Jesus escandalizou, sobretudo, por ter identificado a sua conduta misericordiosa para com os pecadores com a atitude do próprio Deus a respeito dos mesmos. Chegou, até, a dar a entender que, sentando-Se à mesa dos pecadores, os admitia no banquete messiânico.', e: 'O jeito de Jesus acolher os pecadores é o jeito de Deus: ninguém fica fora da mesa.', u: CIC_U + 'p1s2cap2_422-682_po.html' }],
    3: [{ n: '§ 2624', t: 'Na primeira comunidade de Jerusalém, os crentes «eram assíduos ao ensino dos Apóstolos, à comunhão fraterna, à fracção do pão e às orações» (Act 2, 42).', e: 'A comunhão fraterna faz parte do coração da vida cristã, junto com a Palavra, a Eucaristia e a oração.', u: CIC_U + 'p4s1cap1_2566-2649_po.html' },
      { n: '§ 2447', t: 'As obras de misericórdia são as acções caridosas pelas quais vamos em ajuda do nosso próximo, nas suas necessidades corporais e espirituais. Instruir, aconselhar, consolar, confortar, são obras de misericórdia espirituais, como perdoar e suportar com paciência. As obras de misericórdia corporais consistem nomeadamente em dar de comer a quem tem fome, albergar quem não tem tecto, vestir os nus, visitar os doentes e os presos, sepultar os mortos.', e: 'Acolher é obra de misericórdia: consolar, visitar e dar lugar a quem precisa.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    4: [{ n: '§ 1931', t: 'O respeito pela pessoa humana passa pelo respeito pelo princípio: «Que cada um considere o seu próximo, sem qualquer excepção, como "outro ele mesmo"». (…) Tais atitudes só desaparecem com a caridade, que vê em cada homem um «próximo», um irmão.', e: 'Acolher sem exceção: cada pessoa que chega é um irmão, não importa a roupa, o jeito ou a história.', u: CIC_U + 'p3s1cap2_1877-1948_po.html' },
      { n: '§ 1825', t: 'O Senhor pede-nos que, como Ele, amemos até os nossos inimigos, que nos façamos o próximo do mais afastado.', e: 'Acolher é chegar perto de quem está mais longe.', u: CIC_U + 'p3s1cap1_1699-1876_po.html' }],
    5: [{ n: '§ 1932', t: 'O dever de nos fazermos o «próximo» do outro, e de o servirmos activamente, é tanto mais premente quanto esse outro for mais indefeso, seja em que domínio for. «Quantas vezes o fizestes a um dos meus irmãos mais pequeninos, a Mim o fizestes» (Mt 25, 40).', e: 'Quem está mais sozinho e frágil é quem mais precisa que a gente chegue perto.', u: CIC_U + 'p3s1cap2_1877-1948_po.html' }],
    6: [{ n: '§ 2179', t: '«A paróquia é uma certa comunidade de fiéis, constituída estavelmente na Igreja particular (…)». É o lugar onde todos os fiéis podem reunir-se para a celebração dominical da Eucaristia. A paróquia inicia o povo cristão na expressão ordinária da vida litúrgica e reúne-o nesta celebração; ensina a doutrina salvífica de Cristo; e pratica a caridade do Senhor em obras boas e fraternas.', e: 'A paróquia é casa de todos: lugar de se reunir, aprender e viver a caridade uns com os outros.', u: CIC_U + 'p3s2cap1_2083-2195_po.html' }]
  };
  LICOES.forEach(l => { if (CIC[l.n]) l.catecismo = CIC[l.n]; });

  // ---------- Na prática: primeiro o jeito errado (Beto), depois o certo (Ana) ----------
  const P0 = { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da comunidade' } };
  const BETO = { nome: 'Beto', papel: 'membro da pastoral' };
  const DIALOGOS = {
    1: {
      titulo: 'O Seu José depois da missa', cena0: '⛪', mesmoTx: 'Quem está sozinho é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. Depois da missa, o Seu José, que mora sozinho, puxa conversa com o Beto.', saiu: 'Percebeu como o Seu José voltou para casa ainda mais sozinho? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na saída da missa', falas: [
        { q: 'c', t: 'Bom dia, Ana. Bonita a missa hoje, né?', cena: '⛪' },
        { q: 'a', t: 'Bom dia, Seu José! Muito bonita. E o senhor, como está?', cena: '😊' },
        { q: 'c', t: 'Ah, vou levando. Desde que a minha esposa faleceu, a casa ficou grande demais.', cena: '😔' },
        { q: 'a', t: 'Imagino a falta que ela faz. O senhor quer tomar um café com a gente aqui no salão? Tem bolo hoje.', cena: '☕' },
        { q: 'c', t: 'Não quero atrapalhar…', cena: '🙂' },
        { q: 'a', t: 'Atrapalhar nada! A gente gosta muito da sua companhia. E, se o senhor quiser, eu passo na sua casa na quinta para rezar o terço junto.', cena: '📿' },
        { q: 'c', t: 'Nossa, Ana… Faz tempo que ninguém me chama para nada. Eu aceito, sim.', cena: '🥲' },
        { q: 'a', t: 'Então está combinado. O senhor faz parte da nossa família.', cena: '💚' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Na saída da missa', falas: [
          { q: 'c', t: 'Bom dia, Beto. Bonita a missa hoje, né?', cena: '⛪' },
          { q: 'b', t: 'Bom dia. Foi sim. Seu José, licença, que estou com pressa.', cena: '⌚' },
          { q: 'c', t: 'É que desde que a minha esposa faleceu, a casa ficou grande demais…', cena: '😔' },
          { q: 'b', t: 'É, a vida é assim mesmo. Tem que se acostumar.', cena: '🤷' },
          { q: 'c', t: 'Pois é…', cena: '😞' },
          { q: 'b', t: 'Bom, até domingo que vem!', cena: '👋' }
        ] } },
        erros: ['Teve pressa justamente com quem precisava ser ouvido.', 'Respondeu à dor do Seu José com uma frase pronta.', 'Não fez nenhum convite: o Seu José voltou para casa sozinho.'] },
      repare: ['Perguntou de verdade como o Seu José estava, e escutou.', 'Fez um convite concreto: o café e o terço na quinta.', 'Fez o Seu José sentir que faz parte da família da comunidade.']
    },
    2: {
      titulo: 'O rapaz que voltou para a igreja', cena0: '⛪', mesmoTx: 'Quem conta a novidade é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José comenta com o Beto sobre um rapaz que voltou a frequentar a igreja.', saiu: 'Percebeu como o julgamento fechou a porta antes de o rapaz entrar? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Antes da reunião', falas: [
        { q: 'c', t: 'Ana, você viu o Lucas na missa? Aquele que vivia na rua da praça e se envolveu com coisa errada.', cena: '😮' },
        { q: 'a', t: 'Vi, sim! Fiquei tão feliz. Faz anos que ele não vinha.', cena: '😊' },
        { q: 'c', t: 'Mas o pessoal está desconfiado. Dizem que ele não mudou nada.', cena: '💬' },
        { q: 'a', t: 'Seu José, Jesus foi almoçar na casa de Zaqueu antes de ele mudar. Quem sabe o Lucas só está precisando de alguém que acredite nele.', cena: '🌳' },
        { q: 'c', t: 'É… visto por esse lado…', cena: '🤔' },
        { q: 'a', t: 'Vou convidar o Lucas para ajudar a montar o café do domingo. E o senhor podia sentar perto dele na missa.', cena: '☕' },
        { q: 'c', t: 'Posso, sim. Ele era um menino tão bom quando pequeno.', cena: '🙂' },
        { q: 'a', t: 'E pode ser de novo. A gente acolhe a pessoa; a graça de Deus faz o resto.', cena: '💚' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Antes da reunião', falas: [
          { q: 'c', t: 'Beto, você viu o Lucas na missa? Aquele que se envolveu com coisa errada.', cena: '😮' },
          { q: 'b', t: 'Vi. E fiquei de olho na minha bolsa, viu?', cena: '😒' },
          { q: 'c', t: 'Será que ele não está querendo mudar?', cena: '🤔' },
          { q: 'b', t: 'Gente assim não muda. Daqui a pouco some de novo.', cena: '🙄' },
          { q: 'c', t: 'Então é melhor ninguém chegar perto?', cena: '😟' },
          { q: 'b', t: 'Melhor. Cada um no seu canto.', cena: '🚫' }
        ] } },
        erros: ['Julgou o Lucas pelo passado, sem dar uma chance.', 'Tratou como ameaça quem estava voltando para Deus.', 'Fechou a porta que Jesus deixaria aberta.'] },
      repare: ['Alegrou-se com a volta do Lucas.', 'Lembrou que, para Jesus, o acolhimento vem antes da conversão.', 'Deu ao Lucas um lugar e uma tarefa na comunidade.']
    },
    3: {
      titulo: 'A família que se mudou para o bairro', cena0: '🏡', mesmoTx: 'Quem traz a notícia é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José conta ao Beto que uma família nova chegou ao bairro.', saiu: 'Percebeu como ninguém se mexeu para acolher a família? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'No salão paroquial', falas: [
        { q: 'c', t: 'Ana, chegou uma família nova na minha rua. Vieram do Nordeste, com três crianças.', cena: '🏡' },
        { q: 'a', t: 'Que bênção! Eles já conhecem alguém por aqui?', cena: '😊' },
        { q: 'c', t: 'Acho que ninguém. Vi a mãe sozinha no mercado, meio perdida.', cena: '🛒' },
        { q: 'a', t: 'Então vamos fazer como os primeiros cristãos. Que tal a gente levar um bolo e convidar para a missa das crianças?', cena: '🍰' },
        { q: 'c', t: 'Boa ideia. Minha esposa faz um bolo de fubá que é uma beleza.', cena: '🙂' },
        { q: 'a', t: 'Perfeito! E eu aviso a catequese, para as crianças já terem amiguinhos.', cena: '👧' },
        { q: 'c', t: 'Eles vão se sentir em casa.', cena: '🏠' },
        { q: 'a', t: 'É isso. Ninguém pode chegar e ficar sozinho.', cena: '💚' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'No salão paroquial', falas: [
          { q: 'c', t: 'Beto, chegou uma família nova na minha rua, com três crianças.', cena: '🏡' },
          { q: 'b', t: 'Ah, é? Se eles quiserem, eles vêm.', cena: '🤷' },
          { q: 'c', t: 'Vi a mãe sozinha no mercado, meio perdida.', cena: '🛒' },
          { q: 'b', t: 'Todo mundo é assim no começo. Depois acostuma.', cena: '😐' },
          { q: 'c', t: 'Será que a gente não devia fazer alguma coisa?', cena: '🤔' },
          { q: 'b', t: 'A secretaria tem os horários das missas. Está tudo lá.', cena: '📋' }
        ] } },
        erros: ['Esperou que a família viesse sozinha, sem ir ao encontro.', 'Tratou a solidão da mãe como algo normal.', 'Trocou o acolhimento por um aviso na secretaria.'] },
      repare: ['Foi ao encontro da família, como faziam os primeiros cristãos.', 'Propôs um gesto simples e concreto: o bolo e o convite.', 'Envolveu mais gente da comunidade, como a catequese.']
    },
    4: {
      titulo: 'A senhora que entrou pela primeira vez', cena0: '⛪', mesmoTx: 'Quem chega é a mesma', pessoas: { a: P0.a, c: { nome: 'Dona Rosa', papel: 'visitante' } },
      narr: { ini: 'Primeiro, veja como não fazer. A Dona Rosa entra pela primeira vez na reunião da pastoral e encontra o Beto na porta.', saiu: 'Percebeu como a Dona Rosa se sentiu de fora em menos de um minuto? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na porta da reunião', falas: [
        { q: 'c', t: 'Com licença… é aqui a reunião da pastoral?', cena: '🚪' },
        { q: 'a', t: 'É sim! Seja muito bem-vinda. Eu sou a Ana. E a senhora, como se chama?', cena: '😊' },
        { q: 'c', t: 'Rosa. É a primeira vez que eu venho. Não conheço ninguém.', cena: '😟' },
        { q: 'a', t: 'Que alegria, Dona Rosa! Vem, senta aqui do meu lado. Esta é a Cida, ela também chegou faz pouco tempo.', cena: '🪑' },
        { q: 'c', t: 'Prazer, Cida. Eu não sei bem como funciona…', cena: '🙂' },
        { q: 'a', t: 'Fica tranquila: a gente reza, lê o Evangelho e conversa. Qualquer dúvida, é só me perguntar.', cena: '📖' },
        { q: 'c', t: 'Obrigada, Ana. Eu estava com receio de vir.', cena: '🥲' },
        { q: 'a', t: 'Que bom que a senhora veio. Na próxima terça, vou guardar este lugar para a senhora!', cena: '💚' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Na porta da reunião', falas: [
          { q: 'c', t: 'Com licença… é aqui a reunião da pastoral?', cena: '🚪' },
          { q: 'b', t: 'É. Mas já começou.', cena: '⌚' },
          { q: 'c', t: 'Desculpa… é a primeira vez que eu venho.', cena: '😟' },
          { q: 'b', t: 'Senta ali no fundo, que as cadeiras da frente são do pessoal de sempre.', cena: '🪑' },
          { q: 'c', t: 'Tudo bem…', cena: '😞' },
          { q: 'b', t: 'E o celular no silencioso, tá?', cena: '📵' }
        ] } },
        erros: ['Não perguntou o nome nem deu boas-vindas.', 'Mandou a visitante para o fundo, longe de todos.', 'Mostrou que ali existe "o pessoal de sempre", e ela não faz parte.'] },
      repare: ['Sorriu, se apresentou e perguntou o nome.', 'Sentou junto e apresentou a Dona Rosa a outra pessoa.', 'Explicou como funciona e convidou para voltar.']
    },
    5: {
      titulo: 'A Dona Cida sumiu da novena', cena0: '🕯️', mesmoTx: 'Quem percebe a ausência é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José percebe que a Dona Cida não aparece há semanas e comenta com o Beto.', saiu: 'Percebeu como a ausência da Dona Cida virou só um comentário? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Depois da novena', falas: [
        { q: 'c', t: 'Ana, faz um mês que a Dona Cida não vem à novena. Ela nunca faltava.', cena: '🕯️' },
        { q: 'a', t: 'É verdade, Seu José. Que bom que o senhor percebeu. Será que ela está bem?', cena: '🤔' },
        { q: 'c', t: 'Ouvi dizer que o marido dela está doente.', cena: '😟' },
        { q: 'a', t: 'Então ela deve estar precisando da gente. Vamos ligar para ela agora?', cena: '📞' },
        { q: 'c', t: 'Vamos. Eu tenho o número dela aqui.', cena: '📱' },
        { q: 'a', t: 'E, se ela quiser, a gente leva a novena até a casa dela na sexta. Assim ela não fica longe da comunidade.', cena: '🏡' },
        { q: 'c', t: 'Que ideia boa. Ela vai ficar muito feliz.', cena: '🙂' },
        { q: 'a', t: 'Na nossa comunidade, quem falta faz falta.', cena: '💚' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Depois da novena', falas: [
          { q: 'c', t: 'Beto, faz um mês que a Dona Cida não vem à novena.', cena: '🕯️' },
          { q: 'b', t: 'Deve ter cansado. Tem gente que é assim, começa animada e larga.', cena: '🤷' },
          { q: 'c', t: 'Ouvi dizer que o marido dela está doente.', cena: '😟' },
          { q: 'b', t: 'Pode ser. Quando melhorar, ela volta.', cena: '😐' },
          { q: 'c', t: 'Será que a gente não liga para ela?', cena: '📞' },
          { q: 'b', t: 'Ah, não quero incomodar. Ela sabe onde fica a igreja.', cena: '🚪' }
        ] } },
        erros: ['Supôs, sem saber, que a Dona Cida tinha desistido.', 'Soube de um sofrimento e não fez nada.', 'Deixou para a pessoa sozinha a tarefa de voltar.'] },
      repare: ['Valorizou quem percebeu a ausência.', 'Foi atrás da Dona Cida, como o pastor atrás da ovelha.', 'Levou a comunidade até quem não podia vir.']
    },
    6: {
      titulo: 'A ideia nova no grupo de sempre', cena0: '⛪', mesmoTx: 'Quem traz a ideia é o mesmo', pessoas: { a: P0.a, c: { nome: 'Júlia', papel: 'jovem recém-chegada' } },
      narr: { ini: 'Primeiro, veja como não fazer. A Júlia, que chegou há pouco, dá uma ideia no grupo, e o Beto responde.', saiu: 'Percebeu como a panelinha fez a Júlia se sentir de fora? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na reunião da pastoral', falas: [
        { q: 'c', t: 'Ana, posso dar uma ideia? E se a gente fizesse um café de boas-vindas depois da missa das dez?', cena: '☕' },
        { q: 'a', t: 'Claro, Júlia! Que bom ouvir alguém que chegou há pouco. Você sentiu falta disso?', cena: '😊' },
        { q: 'c', t: 'Senti. No primeiro mês, eu vinha e ia embora sem falar com ninguém.', cena: '😔' },
        { q: 'a', t: 'Obrigada por contar. Às vezes a gente fica no grupinho de sempre e nem percebe.', cena: '🤔' },
        { q: 'c', t: 'Eu posso ajudar a organizar, se vocês quiserem.', cena: '🙋' },
        { q: 'a', t: 'Queremos, sim! Você coordena o café junto comigo. E cada um aqui traz um amigo que está afastado.', cena: '🤝' },
        { q: 'c', t: 'Que bom! Agora eu me sinto parte daqui.', cena: '🥲' },
        { q: 'a', t: 'E é. Uma comunidade que é casa tem lugar para todos.', cena: '🏠' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Na reunião da pastoral', falas: [
          { q: 'c', t: 'Beto, posso dar uma ideia? E se a gente fizesse um café de boas-vindas depois da missa?', cena: '☕' },
          { q: 'b', t: 'Isso a gente já tentou há uns anos e não deu certo.', cena: '🙄' },
          { q: 'c', t: 'É que, no primeiro mês, eu vinha e ia embora sem falar com ninguém…', cena: '😔' },
          { q: 'b', t: 'Aqui sempre foi assim, e sempre funcionou.', cena: '😐' },
          { q: 'c', t: 'Eu poderia ajudar a organizar…', cena: '🙋' },
          { q: 'b', t: 'Deixa isso com o pessoal mais antigo. Você ainda está chegando.', cena: '🚫' }
        ] } },
        erros: ['Descartou a ideia sem ouvir.', 'Não deu importância ao que a Júlia sentiu quando chegou.', 'Fechou o grupo: só "o pessoal mais antigo" decide.'] },
      repare: ['Escutou a ideia e o que a Júlia sentiu.', 'Reconheceu que o grupo pode estar fechado.', 'Deu à Júlia lugar e responsabilidade, e abriu o grupo a mais pessoas.']
    }
  };

  // ---------- Boas-vindas (stories) ----------
  const BV_SVG = [
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#FDE7B8"/><circle cx="320" cy="70" r="40" fill="#FFF4D6"/>${igreja(130, 170, 1.15)}<rect y="240" width="400" height="60" fill="#E9B866"/>${pes(250, 214, { c: K.ve })}${pes(320, 214, { c: K.vi, p: K.pe[2] })}<path d="M262 236 q28 -16 46 0" stroke="${K.ou}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#DCEBF6"/>${emo(200, 130, '🤗', 96)}${emo(90, 230, '🚪', 44)}${emo(310, 230, '💚', 44)}${emo(200, 270, '☕', 36)}</svg>`,
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#E5F3EA"/>${roda(200, 220, 6, 170, C3)}${emo(200, 110, '🏅', 70)}${emo(100, 70, '✨', 30)}${emo(300, 70, '✨', 30)}</svg>`
  ];

  const AU = 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/ac/sage/';
  window.CA_CURSOS = window.CA_CURSOS || {};
  window.CA_CURSOS.acolhimento = {
    id: 'acolhimento', nome: 'Acolhimento que faz a diferença', sub: 'ninguém fica sozinho na nossa comunidade', ico: '🤗',
    selo: ['ACOLHIMENTO', 'QUE TRANSFORMA'], lema: 'Acolhei-vos uns aos outros, como Cristo vos acolheu (Rm 15,7).',
    deQuem: 'da comunidade', publico: 'comunidade', equipe: 'membros', equipeSing: 'membro', papelDono: 'Coordenador',
    icones: { 1: '🫂', 2: '✝️', 3: '🍞', 4: '🚪', 5: '🐑', 6: '🏠' },
    trilha: { id: 'ac1', nome: 'Acolher para que ninguém fique sozinho', horas: 2, licoes: LICOES,
      porque: [
        { n: '1 em 6', t: 'Uma em cada seis pessoas no mundo se sente sozinha, e a solidão está ligada a mais de 870 mil mortes por ano.', f: 'Organização Mundial da Saúde, relatório de 30/06/2025' },
        { n: 'Gn 2,18', t: 'Não é bom que o homem esteja só.', f: 'Livro do Gênesis' },
        { n: 'Rm 15,7', t: 'Acolhei-vos uns aos outros, como Cristo vos acolheu.', f: 'Carta aos Romanos' },
        { n: 'CIC 1879', t: 'A pessoa humana tem necessidade da vida social: é uma exigência da sua natureza.', f: 'Catecismo da Igreja Católica, § 1879', u: CIC_U + 'p3s1cap2_1877-1948_po.html' }
      ] },
    ilus: { falas: n => (LS[n] || []).map(([t, svg]) => ({ t, svg })), roteiro: n => (LS[n] || []).map(x => x[0]).join(' ') },
    dialogos: DIALOGOS,
    // 1.79.1: um trecho de vídeo católico em português por lição, escolhido pela transcrição e aprovado pelo Marcos em 13/11/2026.
    // 'depois' = trecho da fala depois do qual o vídeo entra.
    videos: {
      1: { id: 'rlSrU3DRSTM', ini: 342, fim: 447, depois: 5,
        titulo: 'Não de um remédio, mas de presença',
        quem: 'Programa Mais Saúde, da Canção Nova',
        fonte: 'Canção Nova Play · Mais Saúde: Solidão (10/08/2026)',
        intro: 'Veja agora um trecho do programa Mais Saúde, da Canção Nova, sobre o que a solidão faz com as pessoas e o que um simples gesto de acolhimento pode fazer por elas. Toque no vídeo para assistir.' },
      2: { id: 'aeAmnJm0W5Y', ini: 279, fim: 366, depois: 2,
        titulo: 'Hoje eu devo ficar na tua casa',
        quem: 'Frei Gilson, meditando Lucas 19',
        fonte: 'Frei Gilson / Som do Monte · Conversão de Zaqueu',
        intro: 'Agora, ouça o Frei Gilson meditando o encontro de Jesus com Zaqueu: o Senhor que entra na casa de quem todos desprezavam. Toque no vídeo para assistir.' },
      3: { id: '2b20-tg78Io', ini: 207, fim: 251, depois: 3,
        titulo: 'Busque a unidade na sua igreja',
        quem: 'Frei Gilson, meditando Atos 4',
        fonte: 'Frei Gilson / Som do Monte · Um só coração e uma só alma',
        intro: 'Veja agora o Frei Gilson falando da unidade dos primeiros cristãos, que tinham um só coração e uma só alma. Toque no vídeo para assistir. É rapidinho.' },
      4: { id: 'A73eZ92cIB0', ini: 486, fim: 570, depois: 3,
        titulo: 'Sempre com um sorriso',
        quem: 'Papa Francisco, Audiência Geral (dublada em português)',
        fonte: 'WEB TV Lapa · Audiência Geral de 18/11/2015',
        intro: 'Agora, ouça o próprio Papa Francisco agradecendo a quem cuida das portas das nossas igrejas e pedindo que todos sejam recebidos com um sorriso. Toque no vídeo para assistir.' },
      5: { id: 'Ed-znvfPHCc', ini: 313, fim: 402, depois: 4,
        titulo: 'Ver e se compadecer',
        quem: 'Frei Gilson, meditando Lucas 10',
        fonte: 'Frei Gilson / Som do Monte · São Francisco e o próximo',
        intro: 'Veja agora o Frei Gilson meditando a parábola do bom samaritano: quantas pessoas passam por nós precisando de um gesto, e a gente diz que isso não é com a gente. Toque no vídeo para assistir.' },
      6: { id: 'SdTGtwcnr6s', ini: 63, fim: 130, depois: 2,
        titulo: 'Hospitalidade, acolhimento e partilha',
        quem: 'TV Pai Eterno, sobre o Documento 100 da CNBB',
        fonte: 'TV Pai Eterno · Igreja.Doc, Documento 100 da CNBB, episódio 2',
        intro: 'Agora, veja um trecho da TV Pai Eterno sobre o Documento 100 da CNBB e o valor da hospitalidade, do acolhimento e da partilha nas nossas comunidades. Toque no vídeo para assistir.' }
    },
    // Narração da Mariana (voz Sage), como na Fraternidade Viva; trecho com texto mudado volta para a voz do celular.
    audio: { base: AU + 'lic/', hash: s => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return x.toString(36); },
      lic: {"1":{"t":["lz7096","jj4j5c","zc3d93","j5bugh","922ke8","pdx8fy","jynds2","1fo0xrs","8n41si","kuojg8","1wzv3kh","1mi2y01"],"intro":"rdw9no"},"2":{"t":["14klew1","v2ynec","yq49t9","1f1mu94","1k5b9r6","1mvmoc1","v9xknq","qpso5","5fbeqc","wnjh92","8fsqiy","1khduj9"],"intro":"vdlvu1"},"3":{"t":["5n6jhv","m29vqm","1pcaff3","162lrbl","3dharx","1dt6rbv","x581ml","k4vaug","1jupadi","1ukp87w","1etqycs","16mvtst"],"intro":"1j9euqw"},"4":{"t":["1wyfnui","1bx3wor","tgn90f","10luzem","1r89vh1","1sppchd","960a2r","aaw0rt","2f27fj","102ehbg","fcktca","167kda9"],"intro":"bod08m"},"5":{"t":["ktvdgh","dh4j43","gd6mo8","1dgvvae","4weann","1wdii0v","vjuwfp","4b7jth","qk1bby","1j6dlsc","1dc7x7a","18g03cl"],"intro":"k7luqz"},"6":{"t":["nhnidh","1rv7jgx","dbj1dr","1lf3km2","hlk99k","6f45yw","grw236","txh6cy","9gax0r","92bfwv","116cr9n","1ho3zzw"],"intro":"eazk7b"}} },
    bv: {
      audio: [AU + 'bv1.mp3', AU + 'bv2.mp3', AU + 'bv3.mp3'],
      svg: BV_SVG,
      sub1: 'Bem-vindo à formação <b>Acolhimento que faz a diferença</b>: para que ninguém fique sozinho na nossa comunidade.',
      falas: [
        'Olá! Que alegria ter você aqui. Eu sou a Mariana, e vou acompanhar você na formação Acolhimento que faz a diferença. Muita gente se sente sozinha, até dentro da igreja. E um gesto de acolhida pode mudar uma vida.',
        'São seis lições curtas, para fazer no celular, no seu tempo. Você vai aprender: a solidão ao nosso redor. Jesus acolhia a todos. Os primeiros cristãos, um só coração. O primeiro minuto de quem chega. Quem está sozinho do nosso lado. E como ser uma comunidade que é casa.',
        'No final, você recebe o seu certificado. Mas o maior presente vai ser uma comunidade onde ninguém fica sozinho. Vamos começar?'
      ],
      marcas: ['a solidão ao nosso redor', 'Jesus acolhia', 'Os primeiros cristãos', 'O primeiro minuto', 'Quem está sozinho', 'E como ser']
    },
    avisos: ['🤗 Um sorriso no primeiro minuto pode mudar uma vida.', '⏱️ Cada lição leva de 5 a 7 minutos: dá para fazer depois da missa.',
      '🐑 Na nossa comunidade, quem falta faz falta.', '🚪 Porta aberta, ninguém de fora.', '💚 Acolhei-vos uns aos outros, como Cristo vos acolheu.'],
    sugAluno: ['Onde eu parei na formação?', 'Como ganho o certificado?', 'Como acolher alguém que chega pela primeira vez?', 'O que fazer quando alguém some da comunidade?', 'A voz da lição não toca'],
    sugDono: ['Como adiciono um membro?', 'Como incentivo quem parou no meio?', 'Onde vejo as dúvidas dos membros?', 'Como os membros recebem o certificado?', 'Como organizar uma equipe de acolhida na paróquia?']
  };
})();
