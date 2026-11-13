/* Cliente Assistido – Curso FRATERNIDADE VIVA · vencer a fofoca e crescer juntos no amor (1.76.0).
   Segmento católico (paróquias, pastorais, ministérios, movimentos). Pedido do Marcos em 13/11/2026.
   Usa o mesmo motor do Cliente Encantado (treino.js): boas-vindas em stories, trilha, lição com ouvir/ver/na prática/leia/
   faça hoje/pergunta, dúvidas com a IA, certificado e o painel do Coordenador (dono que só acompanha o curso).
   A loja (comunidade) escolhe o curso em stores.recursos.curso = 'fraternidade' (Admin → Lojas → Editar → Curso).
   Progresso na trilha 'fv1' (training_progress), separado do Cliente Encantado ('t1').
   CONTEÚDO EM REVISÃO pelo assessor de formação indicado pelo Marcos. Lição 1 completa; 2 a 6 com breve: true
   (aparecem na trilha com "em breve" e não abrem até o conteúdo ser aprovado). */
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

  // ---------- Lição 1: trechos da fala, cada um com a sua cena ----------
  const L1 = [
    ['Oi! Aqui é a Mariana, da Fraternidade Viva. Que alegria ter você aqui! Esta é a primeira lição da nossa formação. Vamos começar com uma pergunta: o que faz uma comunidade crescer?',
      cena(K.ce, igreja(160, 92, .9) + roda(160, 118, 5, 120, C3) + emo(160, 36, '❓', 26))],
    ['Não são só as festas, os eventos ou o número de pessoas. Uma comunidade cresce quando as pessoas confiam umas nas outras, se ajudam e se sentem em casa.',
      cena(K.cr, pes(100, 86, { c: K.ve }) + pes(160, 82, { c: K.az, p: K.pe[2] }) + pes(220, 86, { c: K.vi, p: K.pe[1] }) + emo(160, 40, '🏠', 30) + emo(128, 52, '💛', 18) + emo(194, 52, '💛', 18))],
    ['E existe uma coisa pequena, quase invisível, que destrói essa confiança devagar: a fofoca.',
      cena('#F4EEF7', pes(120, 86, { c: K.vi }) + pes(170, 86, { c: K.ro, p: K.pe[1] }) + emo(146, 46, '🤫', 26) + pes(262, 92, { c: '#9AA6A0', t: true, e: .85 }) + emo(262, 46, '💔', 22))],
    ['Fofoca é falar de alguém que não está presente, contando defeitos, erros ou suposições, sem que isso ajude a pessoa ou resolva alguma coisa.',
      cena(K.cr, pes(90, 86, { c: K.az }) + pes(150, 86, { c: K.ou, p: K.pe[2] }) + bal(40, 18, 150, 'Você ficou sabendo?') + `<rect x="222" y="40" width="70" height="96" rx="10" fill="#fff" stroke="#D5DDE3" stroke-width="2" stroke-dasharray="6 5"/>` + emo(257, 100, '👤', 34) + `<text x="257" y="130" text-anchor="middle" font-size="10" fill="#64706a" ${F}>quem não está</text>`)],
    ['Muitas vezes ela começa sem maldade: um comentário no corredor, um áudio no grupo de WhatsApp, um "você ficou sabendo?".',
      cena(K.ce, `<rect x="120" y="22" width="80" height="140" rx="14" fill="${K.n}"/><rect x="127" y="34" width="66" height="112" rx="6" fill="#fff"/>` + bal(132, 44, 56, '🎙️ 0:42', K.ve) + bal(132, 86, 56, '😮 Sério?', '#9AA6A0') + emo(66, 96, '💬', 34) + emo(256, 96, '🔁', 30))],
    ['Mas a palavra corre mais rápido que a verdade. Quando chega aos ouvidos da pessoa, ela se sente ferida, se afasta da pastoral e, às vezes, até da Igreja.',
      cena('#F2F2F2', igreja(80, 92, .8) + `<path d="M140 130 h80" stroke="#9AA6A0" stroke-width="3" stroke-dasharray="6 6"/>` + pes(250, 88, { c: '#9AA6A0', t: true }) + emo(250, 38, '😢', 24) + emo(300, 120, '🚪', 26))],
    ['São Tiago já alertava: a língua é um membro pequeno, mas veja como uma pequena chama pode incendiar uma grande floresta.',
      cena('#FFF3E6', emo(80, 120, '🌲', 46) + emo(130, 112, '🌲', 54) + emo(185, 120, '🌲', 46) + emo(240, 112, '🌲', 54) + emo(115, 150, '🔥', 30) + `<text x="160" y="34" text-anchor="middle" font-size="13" font-weight="800" fill="${K.n}" ${F}>Tiago 3,5</text>`)],
    ['O Papa Francisco foi muito direto: comparou a fofoca ao terrorismo, porque quem fofoca joga a bomba e vai embora, e quem fica é a comunidade ferida.',
      cena('#F4F1EA', pes(110, 86, { c: '#fff', p: K.pe[0], h: '#e8e8e8' }) + `<rect x="98" y="104" width="24" height="6" fill="${K.ou}"/>` + bal(140, 30, 150, '“A fofoca destrói”') + emo(240, 120, '💣', 34))],
    ['A boa notícia é que o contrário também é verdade: uma palavra boa também se espalha. E o caminho para vencer a fofoca não é o silêncio frio. É o amor.',
      cena('#EAF6EF', emo(90, 110, '🌱', 40) + emo(160, 100, '🌿', 48) + emo(230, 110, '🌻', 44) + emo(125, 52, '💚', 22) + emo(198, 46, '💚', 26))],
    ['Amor que se preocupa com a pessoa, que não passa adiante o que fere, e que tem coragem de conversar com quem errou, com carinho.',
      cena(K.cr, pes(120, 86, { c: K.ve }) + pes(196, 86, { c: K.az, p: K.pe[2] }) + `<path d="M140 118 q18 -14 36 0" stroke="${K.ou}" stroke-width="6" fill="none" stroke-linecap="round"/>` + emo(158, 44, '🤝', 30))],
    ['Nesta formação, você vai aprender a reconhecer a fofoca, a não passá-la adiante e a transformar cada conversa em algo que edifica. Vamos crescer juntos?',
      cena(K.ce, igreja(160, 92, .9) + roda(160, 118, 5, 120, C3) + emo(70, 40, '🕊️', 26) + emo(250, 40, '✨', 24))]
  ];

  const LICOES = [
    { n: 1, t: 'A fofoca e a comunidade', audio: '',
      cartao: 'A fofoca divide. O amor edifica a comunidade.',
      ler: ['Fofoca é falar de quem não está presente, sem que isso ajude a pessoa ou resolva alguma coisa.',
        'Ela costuma começar sem maldade: um comentário, um áudio no grupo, um "você ficou sabendo?".',
        'Quem é alvo de fofoca se fere e se afasta: da pastoral, do grupo e, às vezes, da Igreja.',
        'A comunidade cresce na confiança, e a fofoca destrói justamente a confiança.',
        'O caminho não é o silêncio frio, é o amor: cuidar da pessoa e falar com ela, e não sobre ela.'],
      desafio: 'Hoje, antes de falar de alguém que não está presente, pergunte a si mesmo: "Isto que vou dizer ajuda essa pessoa ou a nossa comunidade?". Se não ajuda, não diga.',
      pergunta: 'No grupo de WhatsApp da pastoral, alguém escreve: "Vocês ficaram sabendo do que aconteceu com a Maria?". O que mais ajuda a comunidade?',
      opcoes: ['Perguntar o que aconteceu, para ficar por dentro.', 'Não alimentar o assunto e, se for o caso, procurar a Maria com carinho para saber se ela precisa de ajuda.', 'Encaminhar a mensagem para quem não está no grupo, para avisar.'], certa: 1 },
    { n: 2, t: 'De onde nasce a fofoca', breve: true },
    { n: 3, t: 'Quando a fofoca chega até mim', breve: true },
    { n: 4, t: 'Falar com a pessoa, não sobre ela', breve: true },
    { n: 5, t: 'Reparar e reconstruir a confiança', breve: true },
    { n: 6, t: 'Uma comunidade que se edifica', breve: true }
  ];
  LICOES[0].roteiro = L1.map(x => x[0]).join(' ');

  // 1.77.0: citações do Catecismo da Igreja Católica por lição (pedido do Marcos: dar embasamento institucional à formação).
  // Texto LITERAL da tradução oficial em português publicada pela Santa Sé (vatican.va), conferido em 13/11/2026;
  // "(…)" marca trechos omitidos. 'e' = "em outras palavras", explicação simples para o membro.
  const CIC_U = 'https://www.vatican.va/archive/cathechism_po/index_new/';
  const CIC = {
    1: [{ n: '§ 2477', t: 'Torna-se culpado (…) de maledicência, aquele que, sem motivo objectivamente válido, revela os defeitos e as faltas de outrem a pessoas que os ignoram.', e: 'Contar o defeito de alguém para quem não sabia, sem necessidade, já fere o irmão.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' },
      { n: '§ 2479', t: 'A maledicência e a calúnia destroem a reputação e a honra do próximo. (…) Por isso, a maledicência e a calúnia lesam as virtudes da justiça e da caridade.', e: 'A fofoca não é só falta de educação: ela fere a justiça e a caridade dentro da comunidade.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    2: [{ n: '§ 2477', t: 'Torna-se culpado: – de juízo temerário, aquele que, mesmo tacitamente, admite como verdadeiro, sem prova suficiente, um defeito moral do próximo.', e: 'Muitas fofocas nascem aqui: acreditar, sem prova, no pior sobre alguém.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    3: [{ n: '§ 2478', t: 'Para evitar o juízo temerário, cada um procurará interpretar em sentido favorável, tanto quanto possível, os pensamentos, as palavras e os actos do seu próximo.', e: 'Quando a fofoca chega até você, comece pela leitura mais generosa possível do outro.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    4: [{ n: '§ 1829', t: 'Os frutos da caridade são: a alegria, a paz e a misericórdia; exige a prática do bem e a correcção fraterna; é benevolente.', e: 'Falar com o irmão que errou, com carinho, é fruto do amor, e não falta de amor.', u: CIC_U + 'p3s1cap1_1699-1876_po.html' },
      { n: '§ 2478', t: '«Se ele pensa ou compreende menos rectamente, corrija-o com benevolência» (Santo Inácio de Loyola, citado pelo Catecismo).', e: 'A correção é feita com a pessoa, com bondade, e não sobre ela.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    5: [{ n: '§ 2487', t: 'Qualquer falta cometida contra a justiça e contra a verdade implica o dever da reparação, mesmo que o seu autor tenha sido perdoado. (…) Este dever de reparação diz respeito também às faltas cometidas contra a reputação alheia.', e: 'Quem passou uma fofoca adiante é chamado a reparar: corrigir a história, pedir perdão e falar bem da pessoa.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    6: [{ n: '§ 953', t: 'A comunhão da caridade: na sanctorum communio, «nenhum de nós vive para si mesmo, e nenhum de nós morre para si mesmo» (Rm 14, 7). (…) O mais insignificante dos nossos actos, realizado na caridade, reverte em proveito de todos.', e: 'Cada palavra boa que você diz edifica a comunidade inteira.', u: CIC_U + 'p1s2cap3_683-1065_po.html' }]
  };
  LICOES.forEach(l => { if (CIC[l.n]) l.catecismo = CIC[l.n]; });

  // ---------- Na prática (lição 1): primeiro o jeito errado (Beto), depois o certo (Ana) ----------
  const DIALOGOS = {
    1: {
      titulo: 'A notícia sobre a Maria do coral', cena0: '⛪', mesmoTx: 'Quem traz a notícia é o mesmo',
      pessoas: { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da pastoral' } },
      narr: { ini: 'Primeiro, veja como não fazer. Depois da missa, o Seu José conta uma novidade para o Beto.', saiu: 'Percebeu como a história cresceu, sem ninguém saber se era verdade? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na saída da missa', falas: [
        { q: 'c', t: 'Ana, você ficou sabendo da Maria do coral?', cena: '🤫' },
        { q: 'a', t: 'Oi, Seu José! Que bom te ver. A Maria está bem? Aconteceu alguma coisa com ela?', cena: '😊' },
        { q: 'c', t: 'Dizem que ela saiu do coral porque brigou com o padre. O pessoal está comentando.', cena: '💬' },
        { q: 'a', t: 'Eu não sei se foi isso. E, se foi, quem pode contar é ela.', cena: '🤔' },
        { q: 'c', t: 'É, mas todo mundo está falando…', cena: '😕' },
        { q: 'a', t: 'Por isso mesmo. Se a gente também falar, a história só cresce. Que tal a gente ligar para ela? Ela pode estar precisando de um amigo.', cena: '📞' },
        { q: 'c', t: 'Verdade… Eu nem tinha pensado nisso. Faz tempo que não converso com ela.', cena: '🙂' },
        { q: 'a', t: 'Então vamos fazer assim: eu ligo hoje, e no domingo a gente espera a Maria na porta da igreja com um abraço.', cena: '⛪' },
        { q: 'c', t: 'Combinado. E eu vou parar de repassar essa conversa.', cena: '🤝' },
        { q: 'a', t: 'Obrigada, Seu José. É assim que a nossa comunidade cresce.', cena: '💚' }
      ] } },
      ruim: {
        pessoa: { nome: 'Beto', papel: 'membro da pastoral' },
        variantes: { geral: { rotulo: 'Na saída da missa', falas: [
          { q: 'c', t: 'Beto, você ficou sabendo da Maria do coral?', cena: '🤫' },
          { q: 'b', t: 'Fiquei! Dizem que ela brigou feio com o padre. Eu sempre achei ela meio difícil.', cena: '😏' },
          { q: 'c', t: 'Sério? Eu só ouvi um pedaço…', cena: '😮' },
          { q: 'b', t: 'Pois é. E tem mais: dizem que ela nem queria mais vir. Já mandei no grupo para o pessoal ficar sabendo.', cena: '📱' },
          { q: 'c', t: 'Nossa… então é verdade mesmo.', cena: '😟' },
          { q: 'b', t: 'Claro! Onde tem fumaça, tem fogo.', cena: '🔥' }
        ] } },
        erros: ['Deu opinião sobre a Maria, que nem estava ali para se explicar.', 'Espalhou no grupo uma coisa que ninguém sabia se era verdade.', 'Ninguém pensou em procurar a Maria para saber se ela precisava de ajuda.']
      },
      repare: ['Mostrou cuidado com a Maria, e não curiosidade sobre o que aconteceu.', 'Não alimentou a história nem passou adiante.', 'Trocou o comentário por uma atitude de amor: ligar e acolher a Maria.']
    }
  };

  // ---------- Boas-vindas (stories): desenhos próprios no lugar das fotos ----------
  const BV_SVG = [
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="fvC1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDE7B8"/><stop offset="1" stop-color="#F7C97A"/></linearGradient></defs><rect width="400" height="300" fill="url(#fvC1)"/><circle cx="320" cy="70" r="40" fill="#FFF4D6"/>${igreja(200, 170, 1.25)}<rect y="240" width="400" height="60" fill="#E9B866"/>${[60, 120, 280, 340].map((x, i) => pes(x, 214, { c: C3[i], p: K.pe[i], e: 1 })).join('')}<path d="M80 240 q40 -18 80 0 M240 240 q40 -18 80 0" stroke="${K.ou}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#DCEBF6"/>${emo(200, 120, '🕊️', 90)}${emo(90, 220, '💬', 44)}${emo(310, 220, '💚', 44)}${emo(200, 260, '🤝', 40)}</svg>`,
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#E5F3EA"/>${roda(200, 220, 6, 170, C3)}${emo(200, 110, '🏅', 70)}${emo(100, 70, '✨', 30)}${emo(300, 70, '✨', 30)}</svg>`
  ];

  window.CA_CURSOS = window.CA_CURSOS || {};
  window.CA_CURSOS.fraternidade = {
    id: 'fraternidade', nome: 'Fraternidade Viva', sub: 'vencer a fofoca e crescer juntos no amor', ico: '🕊️',
    selo: ['FRATERNIDADE', 'VIVA'], lema: 'Fraternidade Viva · crescer juntos no amor.',
    deQuem: 'da comunidade', publico: 'comunidade', equipe: 'membros', equipeSing: 'membro', papelDono: 'Coordenador',
    icones: { 1: '🕊️', 2: '🌱', 3: '👂', 4: '🤝', 5: '🩹', 6: '⛪' },
    trilha: { id: 'fv1', nome: 'Vencer a fofoca e crescer juntos', horas: 2, licoes: LICOES,
      porque: [
        { n: '“Bomba”', t: 'Para o Papa Francisco, quem fofoca é como quem joga uma bomba e vai embora: a destruição fica na comunidade.', f: 'IHU Unisinos, 12/11/2014', u: 'https://ihu.unisinos.br/537312-papa-pede-que-religiosos-declarem-guerra-contra-o-terrorismo-das-fofocas' },
        { n: 'Tg 3,5', t: 'A língua é um membro pequeno, mas uma pequena chama pode incendiar uma grande floresta.', f: 'Carta de São Tiago' },
        { n: 'Ef 4,29', t: 'Nenhuma palavra má saia da vossa boca, mas só a que for boa para edificar.', f: 'Carta aos Efésios' },
        { n: 'CIC 2479', t: 'A maledicência e a calúnia destroem a reputação e a honra do próximo.', f: 'Catecismo da Igreja Católica, § 2479', u: 'https://www.vatican.va/archive/cathechism_po/index_new/p3s2cap2_2196-2557_po.html' }
      ] },
    ilus: { falas: n => (n === 1 ? L1 : []).map(([t, svg]) => ({ t, svg })), roteiro: n => n === 1 ? L1.map(x => x[0]).join(' ') : '' },
    dialogos: DIALOGOS,
    // 1.76.5: trechos de vídeos públicos do YouTube (pedido do Marcos: leves, gentis, sem tom agressivo nem condenatório),
    // um por lição, como no Cliente Encantado. Escolhidos pela transcrição (e, no do Papa, pela legenda em português do próprio vídeo).
    // Lições 2 a 6 ainda não têm a fala escrita: o 'depois' (trecho da fala depois do qual o vídeo entra) é provisório e
    // deve ser acertado quando a lição for escrita e aprovada pelo assessor.
    videos: {
      1: { id: 'F_R6R5GxxuE', ini: 18, fim: 82, depois: 7, // 1.76.6: narrado em português (o do Angelus era em italiano com legenda pequena)
        titulo: 'Os apóstolos não falavam pelas costas',
        quem: 'Papa Francisco, em visita a uma paróquia de Roma (narração em português)',
        fonte: 'Rede Século 21 · Vaticano News, 16/01/2017',
        intro: 'Agora, veja o próprio Papa Francisco falando sobre o que acontece quando, em vez de ajudar o irmão que errou, a gente sai contando o erro dele. Toque no vídeo para assistir. É rapidinho, menos de um minuto.' },
      2: { id: 'lETSGEl21ms', ini: 105, fim: 175, depois: 3,
        titulo: 'O que é, de fato, a fofoca',
        quem: 'Jonathan, da Canção Nova',
        fonte: 'Canção Nova Oficial · RVJ #16 – Fofoca',
        intro: 'Veja agora, num vídeo curto da Canção Nova, uma explicação simples do que é a fofoca: pegar algo que pertence à vida de outra pessoa e passar adiante. Toque no vídeo para assistir.' },
      3: { id: 'QtEvyskjZVg', ini: 153, fim: 228, depois: 3,
        titulo: 'A fofoca para no ouvido inteligente',
        quem: 'Luzia Santiago, cofundadora da Comunidade Canção Nova',
        fonte: 'Canção Nova Oficial · Não dê ouvidos à fofoca!',
        intro: 'Agora, ouça a Luzia Santiago, da Canção Nova, contando o que ela faz quando uma fofoca chega até ela: mudar de assunto ou falar o bem daquela pessoa. Toque no vídeo para assistir.' },
      4: { id: '9GrgTimVEjg', ini: 122, fim: 223, depois: 3,
        titulo: 'Aproximar-se para conversar, com delicadeza',
        quem: 'Frei Gilson, meditando Mateus 18,15-20',
        fonte: 'Frei Gilson / Som do Monte · Meditação da Palavra',
        intro: 'Veja agora o Frei Gilson meditando o Evangelho da correção fraterna: em vez de se afastar e falar pelas costas, se aproximar e conversar a sós, com delicadeza. Toque no vídeo para assistir.' },
      5: { id: 'DVHWUUI7ENQ', ini: 604, fim: 652, depois: 3,
        titulo: 'Perdão é decisão',
        quem: 'Padre Bruno, na Canção Nova',
        fonte: 'Canção Nova Play · Pedir perdão e perdoar de coração',
        intro: 'Agora, ouça o Padre Bruno, da Canção Nova, lembrando que o perdão não é só um sentimento: é uma decisão de ir atrás de quem precisamos pedir perdão. Toque no vídeo para assistir.' },
      6: { id: 'LI78PGQtp3w', ini: 160, fim: 193, depois: 3,
        titulo: 'Amor fraterno, com terna afeição',
        quem: 'Frei Gilson, meditando Romanos 12',
        fonte: 'Frei Gilson / Som do Monte · Amor fraterno',
        intro: 'Para fechar, veja o Frei Gilson falando do amor fraterno do dia a dia: uma palavra de carinho, um posso te ajudar, uma atenção com o irmão. Toque no vídeo para assistir.' }
    },
    // 1.76.1: narração gravada com a mesma voz do Cliente Encantado (voz Coral da OpenAI gpt-4o-mini-tts), pedido do Marcos.
    // 1.76.2: a narradora da Fraternidade Viva se chama MARIANA (pedido do Marcos); arquivos em fv/mariana/ (voz coral) e, desde a 1.76.4, fv/sage/ (voz Sage, mais fina, escolhida pelo Marcos).
    // Cada trecho tem o hash do texto: se o texto mudar, aquele trecho volta para a voz do celular até gerar o áudio de novo.
    audio: { base: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/lic/', hash: s => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return x.toString(36); },
      lic: { 1: { t: ["1cue9pf", "1axkmhg", "gj30m5", "jmfvbm", "1upq7eg", "rv4fcy", "udn7ty", "x9cxne", "1ryif4o", "1j8boqn", "1tbexs1"], intro: "ht4ms7" } } },
    bv: {
      audio: ['https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/bv1.mp3', 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/bv2.mp3', 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/bv3.mp3'],
      svg: BV_SVG,
      sub1: 'Bem-vindo à <b>Fraternidade Viva</b>: a formação para vencer a fofoca e crescer juntos no amor.',
      falas: [
        'Olá! Que alegria ter você aqui. Eu sou a Mariana, e vou acompanhar você na Fraternidade Viva, a formação para vencer a fofoca e crescer juntos no amor. Uma comunidade cresce quando as pessoas confiam umas nas outras. E essa confiança começa nas nossas palavras.',
        'São seis lições curtas, para fazer no celular, no seu tempo. Você vai aprender: a fofoca e a comunidade. De onde nasce a fofoca. O que fazer quando ela chega até você. Falar com a pessoa, e não sobre ela. Reparar e reconstruir a confiança. E como ser uma comunidade que se edifica.',
        'No final, você recebe o seu certificado. Mas o maior presente vai ser uma comunidade mais unida. Vamos começar?'
      ],
      marcas: ['a fofoca e a comunidade', 'De onde nasce', 'O que fazer quando', 'Falar com a pessoa', 'Reparar e', 'E como ser']
    },
    avisos: ['🕊️ Uma palavra boa também se espalha.', '⏱️ Cada lição leva de 5 a 7 minutos: dá para fazer depois da missa.',
      '🤝 Fale com a pessoa, e não sobre ela.', '⛪ Uma comunidade cresce na confiança.', '💚 Cada lição é um passo para uma pastoral mais unida.'],
    sugAluno: ['Onde eu parei na formação?', 'Como ganho o certificado?', 'O que fazer quando alguém me conta uma fofoca?', 'Como falar com alguém que errou sem ferir?', 'A voz da lição não toca'],
    sugDono: ['Como adiciono um membro?', 'Como incentivo quem parou no meio?', 'Onde vejo as dúvidas dos membros?', 'Como os membros recebem o certificado?', 'Como conversar sobre fofoca na reunião da pastoral?']
  };
})();
