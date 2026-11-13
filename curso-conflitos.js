/* Cliente Assistido – Curso RESOLUÇÃO DE CONFLITOS · uma atitude fraterna que pacifica os corações (1.80.0).
   Segmento católico, focado em LIDERANÇA (coordenadores de pastoral, de movimento e de equipe). Pedido do Marcos em 13/11/2026:
   "é um gesto simples, mas de grande efeito"; título e subtítulo escolhidos por ele.
   Mesmo molde da Fraternidade Viva e do Acolhimento (mesmo motor, treino.js). Narradora: Mariana (voz Sage).
   A comunidade escolhe o curso em stores.recursos.curso = 'conflitos' (Admin → Lojas → Editar → Curso).
   Progresso na trilha 'rc1' (training_progress). */
'use strict';
(function () {
  const F = 'font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"';
  const EMO = 'font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif"';
  const K = { az: '#2F5D8C', az2: '#1E3F63', ou: '#E2A93B', ve: '#0A8F52', vi: '#7A4FB5', ro: '#D96A7A', cr: '#FBF7F1', ce: '#EAF2F8', te: '#E9DFD1', n: '#0B2545', ve2: '#C0392B', pe: ['#F2C9A0', '#D9A77F', '#B9825A', '#8D5A3B'] };
  // ---------- peças do desenho ----------
  function pes(x, y, o) { // pessoa simples: o.c roupa, o.p pele, o.h cabelo, o.e escala, o.t triste, o.b brava
    o = o || {}; const s = o.e || 1, p = o.p || K.pe[0], c = o.c || K.az;
    const boca = o.t ? '<path d="M-6 9 q6 -5 12 0" stroke="#0B2545" stroke-width="2" fill="none" stroke-linecap="round"/>' : o.b ? '<path d="M-6 8 h12" stroke="#0B2545" stroke-width="2.4" stroke-linecap="round"/>' : '<path d="M-6 6 q6 6 12 0" stroke="#0B2545" stroke-width="2" fill="none" stroke-linecap="round"/>';
    const sob = o.b ? '<path d="M-10 -8 l7 3 M10 -8 l-7 3" stroke="#0B2545" stroke-width="2" stroke-linecap="round"/>' : '';
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-20" y="20" width="40" height="46" rx="16" fill="${c}"/><circle r="18" fill="${p}"/><path d="M-17 -5 q2 -18 17 -19 q15 1 17 19 q-7 -9 -17 -9 q-10 0 -17 9z" fill="${o.h || '#3b2616'}"/><circle cx="-6" cy="-1" r="2.2" fill="#0B2545"/><circle cx="6" cy="-1" r="2.2" fill="#0B2545"/>${sob}${boca}</g>`;
  }
  function igreja(x, y, s) {
    s = s || 1;
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-10" width="68" height="56" fill="#fff" stroke="${K.az2}" stroke-width="2"/><path d="M-40 -8 L0 -40 L40 -8z" fill="${K.ou}" stroke="${K.az2}" stroke-width="2"/><rect x="-8" y="-70" width="16" height="34" fill="#fff" stroke="${K.az2}" stroke-width="2"/><path d="M0 -92 v18 M-7 -85 h14" stroke="${K.az2}" stroke-width="3" stroke-linecap="round"/><path d="M-10 46 v-22 a10 10 0 0 1 20 0 v22z" fill="${K.az}"/><circle cx="0" cy="8" r="7" fill="${K.ce}" stroke="${K.az2}" stroke-width="1.5"/></g>`;
  }
  const emo = (x, y, e, t) => `<text x="${x}" y="${y}" font-size="${t || 30}" text-anchor="middle" ${EMO}>${e}</text>`;
  const bal = (x, y, w, t, cor) => { w = Math.max(w, t.length * 6.6 + 22); x = Math.min(Math.max(x, 4), 316 - w); return `<rect x="${x}" y="${y}" width="${w}" height="28" rx="14" fill="${cor || '#fff'}" stroke="${cor ? cor : '#D5DDE3'}" stroke-width="1.5"/><path d="M${x + 16} ${y + 28} l-6 9 l13 -9z" fill="${cor || '#fff'}"/><text x="${x + w / 2}" y="${y + 19}" text-anchor="middle" font-size="12" font-weight="700" fill="${cor ? '#fff' : K.n}" ${F}>${t}</text>`; };
  const cena = (fundo, miolo) => `<svg viewBox="0 0 320 180" role="img" aria-hidden="true"><rect width="320" height="180" fill="${fundo}"/><rect y="150" width="320" height="30" fill="#00000010"/>${miolo}</svg>`;
  const roda = (cx, cy, n, r, cores) => Array.from({ length: n }, (_, i) => { const a = Math.PI * (0.15 + 0.7 * i / (n - 1)); return pes(cx - Math.cos(a) * r, cy - Math.sin(a) * r * 0.25, { c: cores[i % cores.length], p: K.pe[i % 4], e: 0.8 }); }).join('');
  const C3 = [K.az, K.ve, K.vi, K.ro, K.ou];
  const livro = (fundo, cor, esq, dir1, dir2, topo) => cena(fundo, `<path d="M160 52 q-46 -14 -92 0 v92 q46 -14 92 0z" fill="#fff" stroke="${cor}" stroke-width="3"/><path d="M160 52 q46 -14 92 0 v92 q-46 -14 -92 0z" fill="#fff" stroke="${cor}" stroke-width="3"/><path d="M160 52 v92" stroke="${cor}" stroke-width="2"/>` + `<path d="M114 66 v34 M102 78 h24" stroke="${K.az2}" stroke-width="4" stroke-linecap="round"/>` + `<text x="114" y="122" text-anchor="middle" font-size="11" font-weight="800" fill="${K.n}" ${F}>${esq}</text>` + `<text x="206" y="${dir2 ? 88 : 102}" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>${dir1}</text>` + (dir2 ? `<text x="206" y="112" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>${dir2}</text>` : '') + emo(160, 34, topo || '🕊️', 24));
  const biblia = (r, topo) => livro('#FBF4E4', K.ou, 'Bíblia', r, '', topo);
  const cic = (par, topo) => livro('#FBF4E4', K.ou, 'Catecismo', par, '', topo || '✝️');
  const ref = (txt, x, y) => `<rect x="${x - 44}" y="${y - 16}" width="88" height="24" rx="12" fill="${K.az2}"/><text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" ${F}>${txt}</text>`;
  const raio = (x, y) => `<path d="M${x - 6} ${y - 18} l10 0 l-6 12 l9 0 l-16 24 l4 -16 l-9 0z" fill="${K.ou}" stroke="${K.ve2}" stroke-width="1.5"/>`;
  const briga = (fundo, extra) => cena(fundo || '#F6EEEE', pes(100, 84, { c: K.az, b: true }) + pes(220, 84, { c: K.ro, p: K.pe[2], b: true }) + raio(160, 82) + (extra || ''));
  const paz = (fundo, extra) => cena(fundo || '#EAF6EF', pes(120, 84, { c: K.az }) + pes(200, 84, { c: K.ro, p: K.pe[2] }) + `<path d="M138 128 q22 -14 44 0" stroke="${K.ou}" stroke-width="7" fill="none" stroke-linecap="round"/>` + (extra || emo(160, 36, '🕊️', 26)));
  const mesa = (x, y) => `<rect x="${x - 50}" y="${y}" width="100" height="10" rx="4" fill="#B98A5E"/><rect x="${x - 44}" y="${y + 10}" width="6" height="26" fill="#8D6E52"/><rect x="${x + 38}" y="${y + 10}" width="6" height="26" fill="#8D6E52"/>`;
  const passos = (lista, cor) => cena(K.cr, lista.map(([e, t], i, a) => { const w = 300 / a.length, x = 10 + w * i + w / 2; return `<rect x="${x - w / 2 + 4}" y="44" width="${w - 8}" height="84" rx="12" fill="#fff" stroke="${cor || K.ve}" stroke-width="2"/>` + emo(x, 90, e, 28) + `<text x="${x}" y="118" text-anchor="middle" font-size="${a.length > 3 ? 8.5 : 10}" font-weight="800" fill="${K.n}" ${F}>${t}</text>`; }).join(''));

  // ---------- Lição 1: O conflito não é o inimigo ----------
  const L1 = [
    ['Oi! Aqui é a Mariana. Que alegria ter você nesta formação: Resolução de Conflitos, uma atitude fraterna que pacifica os corações. Esta é a primeira lição. Vamos começar olhando o conflito de um jeito novo.',
      cena(K.ce, igreja(160, 92, .9) + roda(160, 118, 5, 120, C3) + emo(160, 36, '🕊️', 26))],
    ['Onde há pessoas, há diferenças: de ideias, de jeito, de horário, de gosto. Em toda pastoral e em todo movimento, cedo ou tarde aparece um desentendimento.',
      cena(K.cr, roda(160, 118, 5, 120, C3) + bal(40, 30, 70, 'assim!') + bal(210, 30, 70, 'não, assim!', K.ro))],
    ['Isso não quer dizer que a comunidade falhou. Até os apóstolos discutiam: no caminho, eles discutiram sobre quem era o maior entre eles.',
      cena('#F3EEE6', pes(110, 86, { c: K.ou, b: true }) + pes(210, 86, { c: K.vi, p: K.pe[1], b: true }) + emo(160, 70, '👑', 26) + ref('Mc 9,34', 160, 34))],
    ['Nos Atos dos Apóstolos, surgiu uma discussão séria na Igreja nascente. Os apóstolos se reuniram, ouviram uns aos outros, e a decisão terminou em alegria e comunhão.',
      cena(K.ce, mesa(160, 120) + roda(160, 112, 5, 110, C3) + emo(160, 40, '📜', 26) + ref('At 15', 268, 34))],
    ['O problema não é o conflito. O problema é o que a gente faz com ele. Fingir que não existe deixa a ferida crescer. E brigar em público divide a comunidade.',
      cena('#F6EEEE', emo(100, 104, '🙈', 50) + emo(220, 104, '📢', 46) + `<text x="160" y="40" text-anchor="middle" font-size="14" font-weight="800" fill="${K.n}" ${F}>os dois caminhos que ferem</text>`)],
    ['Conflito mal cuidado vira fofoca, vira lado contra lado. E, muitas vezes, alguém vai embora calado e não volta mais.',
      cena('#EEF1F4', pes(40, 90, { c: K.az, e: .7, b: true }) + pes(84, 90, { c: K.az, e: .7 }) + pes(128, 90, { c: K.az, e: .7 }) + raio(160, 84) + pes(192, 90, { c: K.ro, e: .7 }) + pes(236, 90, { c: K.ro, e: .7, b: true }) + pes(292, 70, { c: '#9AA6A0', t: true, e: .55 }) + emo(292, 30, '🚪', 20))],
    ['Conflito bem cuidado faz o contrário: a gente se conhece melhor, corrige o que não funcionava e sai mais unido do que antes.',
      paz(null, emo(160, 36, '🤝', 28))],
    ['Jesus disse no Sermão da Montanha: bem-aventurados os que promovem a paz, porque serão chamados filhos de Deus. Promover: a paz não cai pronta do céu. Ela é construída.',
      biblia('Mt 5,9', '🕊️')],
    ['O Catecismo da Igreja Católica ensina, no parágrafo 2304, que a paz não é só a ausência de briga. A paz é a tranquilidade da ordem: é obra da justiça e fruto da caridade.',
      cic('§ 2304', '🕊️')],
    ['Por isso, quem lidera tem um papel especial. O coordenador não é o juiz que dá a sentença, nem quem foge do problema. É quem ajuda os irmãos a se reencontrarem.',
      cena(K.cr, pes(90, 90, { c: K.az, e: .85 }) + pes(160, 80, { c: K.ve }) + pes(230, 90, { c: K.ro, p: K.pe[2], e: .85 }) + emo(160, 30, '🧭', 24))],
    ['E, muitas vezes, basta um gesto simples: chamar para conversar, ouvir com calma, ser o primeiro a pedir perdão. Um gesto pequeno, de grande efeito.',
      cena('#EAF6EF', mesa(160, 118) + pes(120, 84, { c: K.az, e: .9 }) + pes(200, 84, { c: K.ro, p: K.pe[2], e: .9 }) + emo(160, 112, '☕', 20) + emo(160, 36, '💚', 24))],
    ['Nesta formação, você vai aprender a ouvir, a separar a pessoa do problema, a ter a conversa difícil, a perdoar e a liderar em paz. Ao concluir esta lição, a próxima já fica liberada. Vamos juntos?',
      passos([['👂', 'ouvir'], ['🧩', 'separar'], ['💬', 'conversar'], ['🤍', 'perdoar'], ['🕊️', 'pacificar']])]
  ];

  // ---------- Lição 2: Ouvir antes de responder ----------
  const L2 = [
    ['Que bom ter você de volta! Nesta segunda lição, vamos aprender o primeiro passo para resolver qualquer conflito: ouvir.',
      cena(K.ce, emo(160, 104, '👂', 64) + emo(96, 64, '✨', 20) + emo(224, 64, '✨', 20))],
    ['Quando alguém chega irritado, a vontade é responder logo, se defender, explicar. Mas quem responde antes de ouvir quase sempre piora a situação.',
      cena('#F6EEEE', pes(110, 86, { c: K.ro, p: K.pe[2], b: true }) + pes(210, 86, { c: K.az, b: true }) + bal(36, 26, 80, 'você nunca…', K.ro) + bal(196, 26, 86, 'mas eu…', K.az))],
    ['São Tiago ensina: cada um seja pronto para ouvir, lento para falar e lento para se irar.',
      biblia('Tg 1,19', '👂')],
    ['Ouvir de verdade é parar o que está fazendo, olhar nos olhos e deixar a pessoa terminar. Sem interromper e sem ficar preparando a resposta enquanto ela fala.',
      cena(K.cr, pes(110, 86, { c: K.ro, p: K.pe[2] }) + pes(210, 86, { c: K.ve }) + bal(36, 26, 92, 'e aí aconteceu…') + emo(250, 40, '👀', 22) + emo(286, 70, '📵', 20))],
    ['Às vezes, o que a pessoa mais precisa é sentir que foi ouvida. Uma frase como: entendo que você ficou chateado, já baixa a temperatura da conversa.',
      cena('#EAF6EF', pes(110, 86, { c: K.ro, p: K.pe[2] }) + pes(210, 86, { c: K.ve }) + bal(150, 26, 140, 'entendo você', K.ve) + emo(70, 40, '🌡️', 24))],
    ['E o líder ouve os dois lados. O livro dos Provérbios diz que o primeiro a falar parece ter razão, até que vem o outro e mostra a outra parte. Quem ouve um lado só e já toma partido não pacifica: aumenta a divisão.',
      cena(K.cr, pes(70, 90, { c: K.az, e: .85 }) + pes(160, 80, { c: K.ve }) + pes(250, 90, { c: K.ro, p: K.pe[2], e: .85 }) + emo(160, 30, '⚖️', 26) + ref('Pr 18,17', 160, 166))],
    ['Jesus ensina um caminho muito concreto: se o teu irmão pecar contra ti, vai e corrige-o a sós. A sós: não na frente do grupo, nem no grupo de WhatsApp.',
      biblia('Mt 18,15', '🤝')],
    ['Esse é o gesto simples desta formação: chamar para conversar, olho no olho. Muitos conflitos que pareciam enormes se resolvem num café a dois.',
      cena('#EAF6EF', mesa(160, 118) + pes(120, 84, { c: K.ve, e: .9 }) + pes(200, 84, { c: K.ro, p: K.pe[2], e: .9 }) + emo(140, 112, '☕', 18) + emo(180, 112, '☕', 18) + emo(160, 36, '💬', 24))],
    ['O Catecismo, no parágrafo 1829, ensina que a caridade tem como frutos a alegria, a paz e a misericórdia, e que ela pede a correção fraterna. Corrigir com amor é um jeito de amar.',
      cic('§ 1829', '💛')],
    ['Cuidado com a mensagem escrita: sem tom de voz e sem rosto, uma frase simples pode parecer um ataque. Assunto delicado se trata pessoalmente, ou pelo menos por telefone. Nunca no grupo.',
      cena('#F6EEEE', emo(110, 104, '📱', 54) + emo(150, 64, '⚠️', 24) + emo(230, 104, '🗣️', 50) + `<text x="160" y="164" text-anchor="middle" font-size="12" font-weight="800" fill="${K.n}" ${F}>pessoalmente é melhor</text>`)],
    ['E, antes de conversar, reze. Peça ao Espírito Santo calma e um coração que escuta. Quem reza antes fala diferente.',
      cena(K.ce, pes(160, 86, { c: K.vi, p: K.pe[1] }) + emo(160, 30, '🙏', 26) + emo(230, 50, '🕊️', 22))],
    ['Para guardar: ouvir antes de responder, ouvir os dois lados e conversar a sós. Na próxima lição, você vai aprender a separar a pessoa do problema.',
      passos([['👂', 'ouvir primeiro'], ['⚖️', 'os dois lados'], ['🤝', 'a sós']])]
  ];

  // ---------- Lição 3: Separar a pessoa do problema ----------
  const L3 = [
    ['Olá! Nesta terceira lição, vamos aprender um segredo de quem lidera bem: separar a pessoa do problema.',
      cena(K.ce, emo(120, 104, '🧑', 56) + emo(160, 104, '➕', 24) + emo(204, 104, '🧩', 52))],
    ['Num conflito, é muito fácil passar do fato para o rótulo: ela é desorganizada, ele é orgulhoso. O rótulo machuca e fecha a conversa.',
      cena('#F6EEEE', pes(160, 86, { c: K.ro, p: K.pe[2], t: true }) + `<rect x="196" y="38" width="96" height="28" rx="6" fill="#fff" stroke="${K.ve2}" stroke-width="2"/><text x="244" y="57" text-anchor="middle" font-size="12" font-weight="800" fill="${K.ve2}" ${F}>desorganizada</text>`)],
    ['Compare. Uma frase é: você nunca ajuda. A outra é: na última festa, a barraca ficou sem ninguém às oito horas. A primeira acusa. A segunda descreve o fato e permite resolver.',
      cena(K.cr, `<rect x="20" y="40" width="132" height="80" rx="12" fill="#fff" stroke="${K.ve2}" stroke-width="2"/>` + emo(86, 76, '❌', 22) + `<text x="86" y="104" text-anchor="middle" font-size="11" font-weight="800" fill="${K.n}" ${F}>você nunca ajuda</text>` + `<rect x="168" y="40" width="132" height="80" rx="12" fill="#fff" stroke="${K.ve}" stroke-width="2"/>` + emo(234, 76, '✅', 22) + `<text x="234" y="100" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>a barraca ficou</text><text x="234" y="113" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>sem ninguém às 8h</text>`)],
    ['O problema é a barraca vazia, a chave que não foi devolvida, a reunião que atrasou. A pessoa é um irmão, amado por Deus, e muito maior do que o erro que cometeu.',
      cena(K.cr, emo(80, 100, '🔑', 40) + emo(160, 100, '⏰', 40) + pes(250, 86, { c: K.ve }) + emo(250, 30, '💛', 22))],
    ['Jesus fez assim com Pedro. Depois das três negações, Ele não jogou o erro na cara do apóstolo. Perguntou três vezes: tu me amas? E confiou a Pedro, de novo, o cuidado do rebanho.',
      cena('#EAF6EF', pes(120, 86, { c: '#fff', p: K.pe[1] }) + pes(210, 86, { c: K.ou, p: K.pe[0] }) + emo(270, 120, '🐑', 30) + emo(160, 140, '🔥', 20) + ref('Jo 21,15-17', 160, 34))],
    ['O Catecismo, no parágrafo 2478, lembra um conselho de Santo Inácio de Loyola: todo bom cristão deve estar mais pronto a salvar a afirmação do outro do que a condená-la.',
      cic('§ 2478', '🤍')],
    ['Ou seja: diante de uma atitude que incomodou, procure primeiro a intenção boa. Talvez a pessoa estivesse cansada, com um problema em casa, ou simplesmente não soubesse.',
      cena(K.ce, pes(160, 86, { c: K.ro, p: K.pe[2], t: true }) + emo(84, 56, '😴', 24) + emo(84, 106, '🏠', 24) + emo(236, 56, '❔', 24) + emo(236, 106, '💭', 24))],
    ['E cuidado com a fofoca: o desentendimento entre duas pessoas não pode virar assunto do grupo. Quando cada um conta a sua versão para os outros, nascem os lados.',
      cena('#EEF1F4', pes(70, 90, { c: K.az, e: .75 }) + pes(120, 90, { c: K.vi, e: .75 }) + emo(96, 40, '🤫', 22) + pes(200, 90, { c: K.ro, e: .75 }) + pes(250, 90, { c: K.ou, e: .75 }) + emo(226, 40, '🤫', 22) + raio(160, 80))],
    ['O líder não forma torcida. Quando alguém diz: você viu o que ela fez?, ele responde: vamos conversar com ela? Os Provérbios ensinam: sem lenha, o fogo se apaga; sem quem leve e traga, a briga acaba.',
      cena(K.cr, emo(110, 104, '🔥', 48) + emo(160, 104, '➡️', 24) + emo(210, 104, '💨', 44) + ref('Pr 26,20', 160, 34))],
    ['E, no parágrafo 2477, o Catecismo ensina que o respeito pela boa fama das pessoas proíbe toda palavra ou atitude que possa causar a elas um dano injusto.',
      cic('§ 2477', '🛡️')],
    ['Separar a pessoa do problema não é fingir que nada aconteceu. É ser firme com o problema e delicado com a pessoa.',
      cena('#EAF6EF', emo(88, 100, '🧱', 44) + `<text x="88" y="140" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>firme com o problema</text>` + emo(232, 100, '🤲', 44) + `<text x="232" y="140" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>delicado com a pessoa</text>`)],
    ['Para guardar: falar do fato, não do rótulo; procurar a intenção boa; e não deixar o conflito virar fofoca. Na próxima lição, vamos encarar juntos a conversa difícil.',
      passos([['📌', 'o fato'], ['🤍', 'a intenção boa'], ['🤫', 'sem fofoca']])]
  ];

  // ---------- Lição 4: A conversa difícil ----------
  const L4 = [
    ['Que bom que você chegou até aqui! Nesta quarta lição, vamos falar da conversa que quase todo mundo prefere adiar: a conversa difícil.',
      cena(K.ce, emo(160, 104, '💬', 60) + emo(96, 64, '😬', 22) + emo(224, 64, '🙂', 22))],
    ['Tem conversa que a gente vai empurrando: chamar a atenção de quem errou, dizer não, falar de algo que magoou. Adiar parece mais fácil, mas o problema cresce em silêncio.',
      cena('#EEF1F4', emo(100, 100, '📅', 44) + emo(160, 100, '➡️', 22) + emo(220, 100, '🎈', 60))],
    ['São Paulo ensina: seguindo a verdade com caridade. Verdade sem caridade fere. Caridade sem verdade não resolve. As duas juntas curam.',
      biblia('Ef 4,15', '❤️')],
    ['Primeiro passo: escolher a hora e o lugar. A sós, com calma, sem pressa. E nunca no meio da raiva.',
      cena(K.cr, emo(90, 100, '🕰️', 44) + emo(160, 100, '🪑', 44) + emo(230, 100, '🧘', 44))],
    ['Segundo passo: começar pelo que une. Por exemplo: você é muito importante para esta pastoral, e eu quero conversar porque me importo com você.',
      cena('#EAF6EF', pes(110, 86, { c: K.ve }) + pes(210, 86, { c: K.az }) + bal(30, 26, 150, 'você é importante aqui', K.ve) + emo(260, 40, '💚', 22))],
    ['Terceiro passo: dizer o fato e o que ele causou, sem acusar. No ensaio de sábado, você falou alto com a Júlia na frente de todos, e ela ficou muito constrangida.',
      cena(K.cr, pes(110, 86, { c: K.ve }) + pes(210, 86, { c: K.az }) + bal(24, 26, 150, 'no sábado, foi assim…') + emo(260, 40, '📌', 22))],
    ['Quarto passo: ouvir o outro lado. Pergunte: como foi para você? Muitas vezes existe uma história que você não conhecia.',
      cena(K.ce, pes(110, 86, { c: K.ve }) + pes(210, 86, { c: K.az, t: true }) + bal(170, 26, 120, 'eu estava…', K.az) + emo(70, 40, '👂', 24))],
    ['Quinto passo: propor um caminho juntos. Como a gente pode fazer da próxima vez? Combinem algo simples e concreto.',
      paz('#EAF6EF', emo(160, 36, '🤝', 26) + bal(200, 18, 110, 'da próxima vez…', K.ve))],
    ['O Catecismo, no parágrafo 2469, ensina que as pessoas não poderiam viver juntas se não tivessem confiança umas nas outras, isto é, se não dissessem a verdade umas às outras.',
      cic('§ 2469', '🤝')],
    ['A Bíblia conta que Paulo e Barnabé discutiram tão forte por causa de Marcos que se separaram. Mas, anos depois, Paulo pede que lhe tragam Marcos, porque ele lhe era muito útil no ministério. A conversa difícil pode terminar em reconciliação.',
      cena(K.cr, pes(100, 86, { c: K.ou }) + pes(220, 86, { c: K.vi, p: K.pe[1] }) + emo(160, 90, '💔', 24) + emo(160, 136, '➡️', 18) + ref('At 15,39', 100, 34) + ref('2Tm 4,11', 220, 34))],
    ['E se a conversa esquentar? Pare. Diga: vamos retomar amanhã, com calma. Não há derrota em fazer uma pausa. A derrota é ferir o irmão.',
      cena('#F6EEEE', emo(110, 104, '✋', 50) + emo(210, 104, '🌙', 44) + `<text x="160" y="40" text-anchor="middle" font-size="14" font-weight="800" fill="${K.n}" ${F}>retomar com calma</text>`)],
    ['Para guardar os cinco passos: hora e lugar certos, começar pelo que une, dizer o fato sem acusar, ouvir o outro lado e combinar um caminho juntos. Na próxima lição: perdão e reconciliação.',
      passos([['🕰️', 'hora certa'], ['💚', 'o que une'], ['📌', 'o fato'], ['👂', 'ouvir'], ['🤝', 'combinar']])]
  ];

  // ---------- Lição 5: Perdão e reconciliação ----------
  const L5 = [
    ['Olá! Nesta quinta lição, vamos ao coração da resolução de conflitos: o perdão e a reconciliação.',
      cena(K.ce, emo(160, 104, '🤍', 60) + emo(96, 64, '✨', 20) + emo(224, 64, '✨', 20))],
    ['Pedro perguntou a Jesus: quantas vezes devo perdoar o meu irmão? Até sete vezes? E Jesus respondeu: não sete, mas setenta vezes sete. Ou seja: sempre.',
      cena(K.cr, pes(110, 86, { c: K.ou }) + pes(210, 86, { c: '#fff', p: K.pe[1] }) + `<text x="160" y="44" text-anchor="middle" font-size="20" font-weight="800" fill="${K.az2}" ${F}>70 × 7</text>` + ref('Mt 18,21-22', 160, 166))],
    ['Perdoar não é esquecer de uma vez, nem dizer que o que aconteceu estava certo. Perdoar é decidir não guardar rancor e não devolver o mal.',
      cena('#EAF6EF', emo(110, 104, '🎒', 46) + emo(160, 104, '➡️', 22) + emo(214, 104, '🕊️', 46))],
    ['E o perdão não depende de sentir vontade. Muitas vezes começa com uma decisão e uma oração. O sentimento vem depois, aos poucos.',
      cena(K.ce, pes(160, 86, { c: K.vi, p: K.pe[1] }) + emo(160, 30, '🙏', 26) + emo(240, 70, '🌱', 26))],
    ['Jesus diz que a reconciliação vem até antes da oferta: se, ao levar a tua oferta ao altar, lembrares que o teu irmão tem algo contra ti, deixa ali a tua oferta e vai primeiro reconciliar-te com ele.',
      biblia('Mt 5,23-24', '⛪')],
    ['Às vezes, o gesto mais forte é ser o primeiro a pedir perdão, mesmo achando que a culpa não foi só sua. Me perdoa pelo jeito que eu falei. Isso desarma o coração do outro.',
      cena('#EAF6EF', pes(110, 86, { c: K.az }) + pes(210, 86, { c: K.ro, p: K.pe[2] }) + bal(24, 26, 150, 'me perdoa pelo jeito…', K.az) + emo(250, 40, '🥲', 22))],
    ['Pedir perdão de verdade tem três partes: reconhecer o que fez, sem desculpas; dizer que sente muito; e perguntar como pode reparar.',
      passos([['🙋', 'reconhecer'], ['😔', 'sentir muito'], ['🛠️', 'reparar']])],
    ['No Pai-Nosso, rezamos todos os dias: perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido.',
      cena(K.ce, roda(160, 118, 5, 120, C3) + emo(160, 44, '🙏', 28) + `<text x="160" y="164" text-anchor="middle" font-size="11" font-weight="800" fill="${K.n}" ${F}>assim como nós perdoamos</text>`)],
    ['O Catecismo, no parágrafo 2843, reconhece que não está em nosso poder deixar de sentir a ofensa e esquecê-la. Mas o coração que se entrega ao Espírito Santo transforma a ferida em compaixão.',
      cic('§ 2843', '🕊️')],
    ['São Francisco de Assis rezava: onde houver ódio, que eu leve o amor. Onde houver ofensa, que eu leve o perdão. Onde houver discórdia, que eu leve a união.',
      cena('#F3EEE6', pes(160, 86, { c: '#8B6B4A', p: K.pe[1], h: '#6b4a2b' }) + emo(96, 60, '🐦', 22) + emo(232, 60, '🌿', 22) + emo(160, 30, '🕊️', 22))],
    ['E o líder ajuda a reconciliação: aproxima as duas pessoas, sem forçar e sem expor. Cria um momento simples, um café ou uma oração juntos.',
      cena('#EAF6EF', mesa(160, 118) + pes(100, 84, { c: K.az, e: .85 }) + pes(160, 74, { c: K.ve, e: .85 }) + pes(220, 84, { c: K.ro, p: K.pe[2], e: .85 }) + emo(160, 112, '☕', 18) + emo(160, 24, '🕊️', 20))],
    ['Para guardar: perdoar sempre, ser o primeiro a pedir perdão e ajudar os irmãos a se reconciliarem. Na próxima e última lição: o líder que pacifica.',
      passos([['♾️', 'perdoar sempre'], ['🙋', 'o primeiro'], ['🤝', 'reconciliar']])]
  ];

  // ---------- Lição 6: O líder que pacifica ----------
  const L6 = [
    ['Chegamos à sexta e última lição. Que alegria! Hoje vamos falar do líder que pacifica: aquele que não só apaga incêndios, mas evita que eles comecem.',
      cena(K.ce, pes(160, 86, { c: K.ve }) + emo(160, 30, '🕊️', 26) + emo(90, 110, '🧯', 30) + emo(232, 110, '🌳', 34))],
    ['Muitos conflitos nascem de coisas simples: a tarefa que ninguém sabia que era sua, o combinado que não ficou claro, a informação que chegou para uns e não para outros.',
      cena('#EEF1F4', emo(90, 100, '❓', 40) + emo(160, 100, '📋', 40) + emo(230, 100, '📨', 40))],
    ['Por isso, combinados claros: quem faz o quê, até quando, e como avisar se não puder. De preferência por escrito, e repetidos no fim da reunião.',
      cena(K.cr, `<rect x="90" y="30" width="140" height="116" rx="10" fill="#fff" stroke="${K.az2}" stroke-width="2"/>` + ['quem faz o quê', 'até quando', 'como avisar'].map((t, i) => emo(110, 66 + i * 30, '✅', 16) + `<text x="124" y="${62 + i * 30}" font-size="11" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join(''))],
    ['Divisão justa: Moisés estava sobrecarregado, atendendo o povo do amanhecer ao anoitecer. O sogro, Jetro, aconselhou: você vai se esgotar; divida o trabalho. Quando sempre os mesmos fazem tudo, nascem o cansaço e a mágoa.',
      cena('#F3EEE6', pes(110, 86, { c: K.ou, p: K.pe[1] }) + emo(110, 30, '😓', 22) + pes(210, 86, { c: K.vi, p: K.pe[2], h: '#ddd' }) + ref('Ex 18,17-18', 160, 166))],
    ['Reconhecimento: agradecer em público e corrigir em particular. Uma palavra de gratidão evita muita reclamação.',
      cena('#EAF6EF', roda(160, 118, 5, 120, C3) + emo(160, 44, '👏', 28) + bal(190, 18, 100, 'obrigada!', K.ve))],
    ['Jesus lavou os pés dos discípulos e disse: dei-vos o exemplo, para que façais assim como eu fiz. Na Igreja, liderar é servir. E o líder que serve não briga por poder.',
      cena(K.ce, pes(120, 96, { c: '#fff', p: K.pe[1], e: .9 }) + pes(210, 82, { c: K.ou }) + emo(150, 140, '🫗', 24) + ref('Jo 13,14-15', 160, 30))],
    ['E o líder dá o exemplo: reconhece os próprios erros, pede perdão e não fala mal de ninguém pelas costas. A equipe aprende pelo que vê.',
      cena(K.cr, pes(160, 80, { c: K.ve }) + roda(160, 130, 4, 110, C3) + emo(230, 36, '👀', 22))],
    ['O Catecismo, no parágrafo 2305, ensina que a paz na terra é imagem e fruto da paz de Cristo, que pela cruz reconciliou os homens com Deus. E repete: bem-aventurados os que promovem a paz.',
      cic('§ 2305', '✝️')],
    ['São Paulo pedia: se for possível, quanto depender de vós, vivei em paz com todos. Quanto depender de você: nem tudo depende, mas a sua parte você pode fazer.',
      biblia('Rm 12,18', '🕊️')],
    ['E lembre: a paz começa dentro. Quem cultiva a oração, o descanso e a humildade leva calma para a reunião. Um coração em paz pacifica os outros corações.',
      cena(K.ce, pes(160, 86, { c: K.vi, p: K.pe[1] }) + emo(160, 30, '🙏', 24) + emo(96, 70, '💓', 22) + emo(224, 70, '🌿', 22))],
    ['Para viver esta formação, escolha três compromissos: ouvir antes de responder; conversar a sós, olho no olho, com verdade e caridade; e ser o primeiro a buscar a paz.',
      passos([['👂', 'ouvir antes'], ['🤝', 'com caridade'], ['🕊️', 'buscar a paz']])],
    ['Parabéns! Você concluiu a formação Resolução de Conflitos. Agora o seu certificado está liberado. Que você seja, na sua comunidade, sinal da paz de Cristo. Bem-aventurados os que promovem a paz!',
      cena('#E5F3EA', roda(160, 130, 5, 130, C3) + emo(160, 60, '🏅', 46) + emo(90, 40, '✨', 20) + emo(230, 40, '🕊️', 22))]
  ];

  const LICOES = [
    { n: 1, t: 'O conflito não é o inimigo', audio: '',
      cartao: 'O problema não é o conflito: é o que fazemos com ele.',
      ler: ['Onde há pessoas, há diferenças: até os apóstolos discutiam (Mc 9,34).',
        'Na Igreja nascente, uma discussão séria terminou em comunhão porque os apóstolos se reuniram e se ouviram (At 15).',
        'Fingir que não existe deixa a ferida crescer; brigar em público divide. Conflito bem cuidado une mais.',
        'Bem-aventurados os que promovem a paz (Mt 5,9). A paz é obra da justiça e fruto da caridade (CIC § 2304).',
        'O líder não é juiz nem foge: ajuda os irmãos a se reencontrarem, muitas vezes com um gesto simples.'],
      desafio: 'Hoje, pense num desentendimento que está parado na sua pastoral ou equipe. Não precisa resolver agora: só reze pelas pessoas envolvidas e escolha um gesto simples que você pode fazer nesta semana.',
      pergunta: 'Segundo esta lição, qual é o papel de quem lidera num conflito?',
      opcoes: ['Dar a sentença e dizer quem está certo.', 'Fingir que não viu, para não se envolver.', 'Ajudar os irmãos a se reencontrarem, com gestos simples como chamar para conversar.'], certa: 2 },
    { n: 2, t: 'Ouvir antes de responder', audio: '',
      cartao: 'Pronto para ouvir, lento para falar.',
      ler: ['Cada um seja pronto para ouvir, lento para falar e lento para se irar (Tg 1,19).',
        'Ouvir é parar, olhar nos olhos e deixar a pessoa terminar, sem preparar a resposta.',
        'O líder ouve os dois lados antes de qualquer conclusão (Pr 18,17).',
        'Se o teu irmão pecar contra ti, vai e corrige-o a sós (Mt 18,15). A caridade pede a correção fraterna (CIC § 1829).',
        'Assunto delicado se trata pessoalmente, nunca no grupo de WhatsApp. E antes de conversar, reze.'],
      desafio: 'Na próxima vez que alguém vier reclamar com você, faça o teste: deixe a pessoa terminar sem interromper e, antes de responder, diga: "Entendo que você ficou chateado. Me conta mais."',
      pergunta: 'Dois membros da pastoral discutiram no grupo de WhatsApp. O que mais ajuda, segundo Mt 18,15?',
      opcoes: ['Responder no grupo dizendo quem tem razão.', 'Conversar com cada um a sós, ouvindo com calma, e depois ajudar os dois a se entenderem.', 'Remover os dois do grupo.'], certa: 1 },
    { n: 3, t: 'Separar a pessoa do problema', audio: '',
      cartao: 'Firme com o problema, delicado com a pessoa.',
      ler: ['Fale do fato, não do rótulo: "a barraca ficou sem ninguém às 8h", e não "você nunca ajuda".',
        'A pessoa é um irmão amado por Deus, maior do que o erro. Jesus confiou de novo o rebanho a Pedro (Jo 21,15-17).',
        'Salvar a afirmação do outro antes de condená-la (Santo Inácio, CIC § 2478): procure primeiro a intenção boa.',
        'Sem lenha, o fogo se apaga (Pr 26,20): o conflito entre duas pessoas não vira assunto do grupo.',
        'O respeito pela boa fama das pessoas proíbe palavras que lhes causem dano injusto (CIC § 2477).'],
      desafio: 'Nesta semana, quando alguém falar mal de outra pessoa da comunidade para você, responda com carinho: "Vamos conversar com ela?". E não repasse a história adiante.',
      pergunta: 'Qual destas frases separa a pessoa do problema?',
      opcoes: ['"Você é muito desorganizado."', '"Na reunião de ontem, as chaves do salão não foram devolvidas. Como podemos resolver?"', '"Todo mundo já sabe como você é."'], certa: 1 },
    { n: 4, t: 'A conversa difícil', audio: '',
      cartao: 'A verdade com caridade cura.',
      ler: ['Seguindo a verdade com caridade (Ef 4,15): verdade sem caridade fere, caridade sem verdade não resolve.',
        'Cinco passos: hora e lugar certos; começar pelo que une; dizer o fato sem acusar; ouvir o outro lado; combinar um caminho.',
        'As pessoas não poderiam viver juntas sem confiança, isto é, sem dizer a verdade umas às outras (CIC § 2469).',
        'Paulo e Barnabé se separaram por causa de Marcos (At 15,39), mas depois Paulo pediu Marcos de volta (2Tm 4,11).',
        'Se esquentar, pare e retome com calma. A derrota não é a pausa: é ferir o irmão.'],
      desafio: 'Escolha uma conversa que você vem adiando. Prepare, por escrito, a frase do "que nos une" e a frase do fato, sem acusação. Reze e marque um dia para conversar a sós.',
      pergunta: 'Qual é a melhor forma de começar uma conversa difícil?',
      opcoes: ['Pelo que une: dizer que a pessoa é importante e que você quer conversar porque se importa com ela.', 'Pela lista de todos os erros que a pessoa já cometeu.', 'Na frente do grupo, para todos verem que o problema foi tratado.'], certa: 0 },
    { n: 5, t: 'Perdão e reconciliação', audio: '',
      cartao: 'Onde houver ofensa, que eu leve o perdão.',
      ler: ['Não sete, mas setenta vezes sete (Mt 18,22): perdoar sempre.',
        'Perdoar não é aprovar o erro nem esquecer de uma vez: é decidir não guardar rancor e não devolver o mal.',
        'Vai primeiro reconciliar-te com o teu irmão (Mt 5,23-24). Pedir perdão: reconhecer, sentir muito e reparar.',
        'Não está em nosso poder deixar de sentir a ofensa, mas o coração entregue ao Espírito Santo a transforma em compaixão (CIC § 2843).',
        'O líder aproxima as pessoas sem forçar e sem expor: um café, uma oração juntos.'],
      desafio: 'Pense em alguém com quem você está estremecido. Reze por essa pessoa pelo nome e, se for possível, dê o primeiro passo: uma mensagem, uma ligação ou um "me perdoa pelo jeito que eu falei".',
      pergunta: 'Segundo esta lição, perdoar é…',
      opcoes: ['Dizer que o que aconteceu estava certo.', 'Esperar sentir vontade para, então, perdoar.', 'Decidir não guardar rancor e não devolver o mal, mesmo que o sentimento venha aos poucos.'], certa: 2 },
    { n: 6, t: 'O líder que pacifica', audio: '',
      cartao: 'Bem-aventurados os que promovem a paz.',
      ler: ['Previna: combinados claros (quem faz o quê, até quando, como avisar), de preferência por escrito.',
        'Divida o trabalho com justiça, como Jetro aconselhou Moisés (Ex 18,17-18).',
        'Agradeça em público e corrija em particular. Liderar é servir (Jo 13,14-15).',
        'A paz na terra é imagem e fruto da paz de Cristo (CIC § 2305). Quanto depender de vós, vivei em paz com todos (Rm 12,18).',
        'Três compromissos: ouvir antes de responder; conversar a sós, com verdade e caridade; ser o primeiro a buscar a paz.'],
      desafio: 'Na próxima reunião, termine repetindo os combinados (quem faz o quê e até quando) e agradeça, pelo nome, a alguém que serviu bem. E escolha os seus três compromissos de paz.',
      pergunta: 'Qual atitude mais ajuda a PREVENIR conflitos numa equipe?',
      opcoes: ['Deixar que cada um descubra sozinho o que precisa fazer.', 'Combinados claros, divisão justa das tarefas e reconhecimento de quem serve.', 'Concentrar todas as tarefas nas mesmas pessoas, que já sabem fazer.'], certa: 1 }
  ];
  const LS = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5, 6: L6 };
  LICOES.forEach(l => { if (LS[l.n]) l.roteiro = LS[l.n].map(x => x[0]).join(' '); });

  // Catecismo: texto LITERAL da tradução oficial em português da Santa Sé (vatican.va), conferido em 13/11/2026 pelo Chrome; "(…)" marca trechos omitidos;
  // os números das notas de rodapé foram tirados. 'e' = "em outras palavras".
  const CIC_U = 'https://www.vatican.va/archive/cathechism_po/index_new/';
  const CIC = {
    1: [{ n: '§ 2304', t: 'O respeito e o crescimento da vida humana exigem a paz. A paz não é só ausência da guerra, nem se limita a assegurar o equilíbrio das forças adversas. A paz não é possível na terra sem a salvaguarda dos bens das pessoas, a livre comunicação entre os seres humanos, o respeito pela dignidade das pessoas e dos povos e a prática assídua da fraternidade. Ela é «tranquilidade da ordem»; é «obra da justiça» (Is 32, 17) e efeito da caridade.', e: 'Paz não é só ninguém brigar: é cada um ser respeitado e a fraternidade ser vivida de verdade.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    2: [{ n: '§ 1829', t: 'Os frutos da caridade são: a alegria, a paz e a misericórdia; exige a prática do bem e a correcção fraterna; é benevolente; suscita a reciprocidade, é desinteressada e liberal: é amizade e comunhão.', e: 'Quem ama de verdade não fica calado diante do erro: corrige, mas com bondade, para gerar paz.', u: CIC_U + 'p3s1cap1_1699-1876_po.html' }],
    3: [{ n: '§ 2478', t: 'Para evitar o juízo temerário, cada um procurará interpretar em sentido favorável, tanto quanto possível, os pensamentos, as palavras e os actos do seu próximo: «Todo o bom cristão deve estar mais pronto a interpretar favoravelmente a opinião ou afirmação obscura do próximo do que a condená-la. Se de modo nenhum a pode aprovar, interrogue-se sobre como é que ele a compreende: se ele pensa ou compreende menos rectamente, corrija-o com benevolência; e se isso não basta, tentem-se todos os meios oportunos para que, compreendendo-a bem, ele regresse do erro são e salvo».', e: 'Antes de condenar, procure a intenção boa; se não entender, pergunte; se for preciso corrigir, corrija com bondade.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' },
      { n: '§ 2477', t: 'O respeito pela reputação das pessoas proíbe toda e qualquer atitude ou palavra susceptíveis de lhes causar um dano injusto.', e: 'Não falamos do irmão de um jeito que manche o nome dele.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    4: [{ n: '§ 2469', t: '«Os homens não seriam capazes de viver juntos, se não tivessem confiança uns nos outros, isto é, se não se dissessem a verdade». A virtude da veracidade dá justamente a outrem o que lhe é devido. A veracidade observa um justo meio-termo entre o que deve ser dito e o segredo que deve ser guardado: implica honestidade e discrição.', e: 'A verdade dita com cuidado constrói confiança; sem ela, ninguém consegue servir junto.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }],
    5: [{ n: '§ 2843', t: '(…) É aí, de facto, «no fundo do coração», que tudo se ata e desata. Não está no nosso poder deixar de sentir e esquecer a ofensa; mas o coração que se entrega ao Espírito Santo muda a ferida em compaixão e purifica a memória, transformando a ofensa em intercessão.', e: 'Mesmo que a dor ainda exista, entregue a Deus: Ele transforma a mágoa em oração por quem nos feriu.', u: CIC_U + 'p4s2_2759-2865_po.html' }],
    6: [{ n: '§ 2305', t: 'A paz terrena é imagem e fruto da paz de Cristo, o «Príncipe da Paz» messiânico (Is 9, 5). Pelo sangue da sua cruz, Ele, levando em Si próprio a morte à inimizade, reconciliou com Deus os homens e fez da sua Igreja o sacramento da unidade do género humano e da sua união com Deus. «Ele é a nossa paz» (Ef 2, 14) e declara «bem-aventurados os obreiros da paz» (Mt 5, 9).', e: 'A paz que construímos na comunidade nasce da paz que Cristo nos deu na cruz.', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }]
  };
  LICOES.forEach(l => { if (CIC[l.n]) l.catecismo = CIC[l.n]; });

  // ---------- Na prática: primeiro o jeito errado (Beto), depois o certo (Ana) ----------
  const P0 = { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da pastoral' } };
  const BETO = { nome: 'Beto', papel: 'coordenador de outra equipe' };
  const DIALOGOS = {
    1: {
      titulo: 'A briga por causa da quermesse', cena0: '🎪', mesmoTx: 'Quem desabafa é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José está chateado com a Dona Cida por causa da organização da quermesse e desabafa com o Beto.', saiu: 'Percebeu como o conflito ficou maior depois da conversa? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Depois da reunião da quermesse', falas: [
        { q: 'c', t: 'Ana, não dá mais. A Dona Cida mudou tudo da barraca de pastel sem falar comigo.', cena: '😤' },
        { q: 'a', t: 'Seu José, estou vendo que o senhor ficou chateado mesmo. Me conta o que aconteceu.', cena: '👂' },
        { q: 'c', t: 'Eu cuido dessa barraca há dez anos! E ela chega e decide tudo sozinha.', cena: '😠' },
        { q: 'a', t: 'Dez anos é muita dedicação. Faz sentido o senhor querer ser ouvido.', cena: '💛' },
        { q: 'c', t: 'Pois é. Se continuar assim, eu saio da equipe.', cena: '😞' },
        { q: 'a', t: 'Eu não quero perder o senhor. Que tal a gente sentar, o senhor, a Dona Cida e eu, amanhã depois da missa, e organizar a barraca juntos?', cena: '☕' },
        { q: 'c', t: 'Será que ela topa?', cena: '🤔' },
        { q: 'a', t: 'Eu converso com ela antes. Desentendimento a gente resolve conversando. Os dois são importantes para a quermesse.', cena: '🤝' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Depois da reunião da quermesse', falas: [
          { q: 'c', t: 'Beto, não dá mais. A Dona Cida mudou tudo da barraca de pastel sem falar comigo.', cena: '😤' },
          { q: 'b', t: 'De novo ela? Essa mulher quer mandar em tudo.', cena: '🙄' },
          { q: 'c', t: 'Eu cuido dessa barraca há dez anos!', cena: '😠' },
          { q: 'b', t: 'Pois manda no grupo que ou ela sai ou você sai. Aí todo mundo fica sabendo.', cena: '📱' },
          { q: 'c', t: 'Será que é o melhor?', cena: '😟' },
          { q: 'b', t: 'Eu não quero me envolver. Mas eu estou do seu lado.', cena: '🤷' }
        ] } },
        erros: ['Tomou partido sem ouvir a Dona Cida.', 'Mandou levar o conflito para o grupo, na frente de todos.', 'Fugiu da responsabilidade: "não quero me envolver".'] },
      repare: ['Deixou o Seu José desabafar e reconheceu a dedicação dele.', 'Não tomou partido e não falou mal da Dona Cida.', 'Propôs um gesto simples: sentar os três para conversar.']
    },
    2: {
      titulo: 'A mensagem atravessada no grupo', cena0: '📱', mesmoTx: 'Quem chega magoado é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José chega magoado com uma mensagem que a Júlia mandou no grupo da pastoral e procura o Beto.', saiu: 'Percebeu como ninguém foi ouvido de verdade? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Antes do ensaio', falas: [
        { q: 'c', t: 'Ana, você viu o que a Júlia escreveu no grupo? Que "tem gente que só atrapalha". É comigo!', cena: '📱' },
        { q: 'a', t: 'Vi, Seu José. Antes de qualquer coisa, me conta: como o senhor se sentiu?', cena: '👂' },
        { q: 'c', t: 'Humilhado. Na frente de todo mundo.', cena: '😔' },
        { q: 'a', t: 'Entendo. Ninguém gosta de se sentir exposto assim. O senhor já conversou com ela?', cena: '💛' },
        { q: 'c', t: 'Não. Eu ia responder no grupo mesmo.', cena: '😤' },
        { q: 'a', t: 'Posso fazer uma sugestão? Mensagem escrita engana muito. Vamos falar com ela pessoalmente, a sós? Pode ser que ela nem estivesse falando do senhor.', cena: '🤝' },
        { q: 'c', t: 'É… pode ser. Você vai junto?', cena: '🤔' },
        { q: 'a', t: 'Vou, sim. E vou ouvir a Júlia também. Antes, vamos rezar uma Ave-Maria juntos?', cena: '🙏' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Antes do ensaio', falas: [
          { q: 'c', t: 'Beto, você viu o que a Júlia escreveu no grupo? Que "tem gente que só atrapalha".', cena: '📱' },
          { q: 'b', t: 'Vi. Mas o senhor também, hein, vive chegando atrasado.', cena: '👉' },
          { q: 'c', t: 'Eu me senti humilhado na frente de todo mundo…', cena: '😔' },
          { q: 'b', t: 'Responde lá então. Fala tudo o que você pensa dela.', cena: '⌨️' },
          { q: 'c', t: 'Mas e se ela não estava falando de mim?', cena: '🤔' },
          { q: 'b', t: 'Claro que estava. Todo mundo entendeu.', cena: '😒' }
        ] } },
        erros: ['Respondeu com acusação antes de ouvir.', 'Incentivou a resposta no grupo, que espalha o conflito.', 'Tirou conclusões sem ouvir a Júlia.'] },
      repare: ['Perguntou como o Seu José se sentiu e escutou.', 'Lembrou que mensagem escrita engana e propôs conversar a sós.', 'Decidiu ouvir os dois lados e começou rezando.']
    },
    3: {
      titulo: 'As chaves do salão', cena0: '🔑', mesmoTx: 'Quem reclama é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. As chaves do salão sumiram de novo, e o Seu José reclama do Lucas com o Beto.', saiu: 'Percebeu como o Lucas virou o problema, e as chaves continuaram sumindo? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na porta do salão', falas: [
        { q: 'c', t: 'Ana, de novo as chaves do salão não foram devolvidas. Esse Lucas é um irresponsável!', cena: '🔑' },
        { q: 'a', t: 'Que chato, Seu José, o senhor ficou esperando aqui fora. Foi a terceira vez, né?', cena: '😕' },
        { q: 'c', t: 'Terceira! Ele não liga para nada.', cena: '😠' },
        { q: 'a', t: 'Vamos olhar o problema: as chaves não voltam. O Lucas é um bom rapaz, ajuda em tudo. Pode ser que ninguém tenha combinado com ele onde deixar.', cena: '🧩' },
        { q: 'c', t: 'É… ninguém nunca falou mesmo.', cena: '🤔' },
        { q: 'a', t: 'Então eu converso com ele, a sós, sem bronca. E a gente combina um lugar fixo para as chaves, na secretaria.', cena: '📌' },
        { q: 'c', t: 'Assim fica mais fácil para todo mundo.', cena: '🙂' },
        { q: 'a', t: 'E, por favor, vamos deixar isso entre nós. Não precisa virar assunto da equipe.', cena: '🤫' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Na porta do salão', falas: [
          { q: 'c', t: 'Beto, de novo as chaves do salão não foram devolvidas. Esse Lucas…', cena: '🔑' },
          { q: 'b', t: 'Esse menino é um irresponsável. Sempre foi.', cena: '🙄' },
          { q: 'c', t: 'Terceira vez que acontece.', cena: '😠' },
          { q: 'b', t: 'Vou contar para o pessoal da equipe, para ninguém mais dar a chave para ele.', cena: '📢' },
          { q: 'c', t: 'Mas alguém já explicou para ele onde deixar?', cena: '🤔' },
          { q: 'b', t: 'Não precisa explicar. Quem é responsável sabe.', cena: '😒' }
        ] } },
        erros: ['Colou um rótulo no Lucas: "irresponsável".', 'Espalhou o caso para a equipe, em vez de conversar com ele.', 'Não olhou o problema real: faltava um combinado.'] },
      repare: ['Separou o problema (as chaves) da pessoa (o Lucas).', 'Procurou a intenção boa: talvez ninguém tivesse combinado.', 'Decidiu conversar a sós e pediu que o caso não virasse fofoca.']
    },
    4: {
      titulo: 'O ensaio de sábado', cena0: '🎶', mesmoTx: 'Quem precisa ouvir é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. No ensaio de sábado, o Seu José falou alto com a Júlia na frente de todos. O Beto resolve falar com ele.', saiu: 'Percebeu como o Seu José se fechou e nada mudou? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Uma conversa a sós', falas: [
        { q: 'a', t: 'Seu José, obrigada por ficar um pouquinho. O senhor é muito importante para o nosso coral, e eu quero conversar porque me importo com o senhor.', cena: '💚' },
        { q: 'c', t: 'Pode falar, Ana.', cena: '🙂' },
        { q: 'a', t: 'No ensaio de sábado, o senhor falou alto com a Júlia na frente de todos. Ela ficou muito constrangida e chorou depois.', cena: '📌' },
        { q: 'c', t: 'Nossa… eu não percebi que tinha sido tão forte. É que ela errou a entrada três vezes.', cena: '😟' },
        { q: 'a', t: 'Entendo. E como foi para o senhor aquele dia?', cena: '👂' },
        { q: 'c', t: 'Eu estava nervoso. Meu neto estava internado. Acabei descontando nela.', cena: '😔' },
        { q: 'a', t: 'Que bom que o senhor me contou. Vou rezar pelo seu neto. Como a gente pode fazer da próxima vez que alguém errar no ensaio?', cena: '🙏' },
        { q: 'c', t: 'Eu falo com ela depois, com calma. E vou pedir desculpas para a Júlia ainda hoje.', cena: '🤝' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Uma conversa no meio do ensaio', falas: [
          { q: 'b', t: 'Seu José, todo mundo está comentando. O senhor sempre foi grosso com os jovens.', cena: '👉' },
          { q: 'c', t: 'Como assim, sempre? Eu?', cena: '😳' },
          { q: 'b', t: 'Sim. No sábado, gritou com a Júlia. E no mês passado, com o Lucas.', cena: '📋' },
          { q: 'c', t: 'Você nem quer saber o que aconteceu comigo…', cena: '😠' },
          { q: 'b', t: 'Não interessa. Ou muda, ou sai do coral.', cena: '🚪' },
          { q: 'c', t: 'Então eu saio.', cena: '😞' }
        ] } },
        erros: ['Falou na frente dos outros, e "todo mundo está comentando".', 'Acusou com rótulo e lista de erros ("sempre foi grosso").', 'Não ouviu a história do Seu José nem propôs um caminho.'] },
      repare: ['Conversou a sós e começou pelo que une.', 'Disse o fato e o que ele causou, sem rótulo.', 'Ouviu o outro lado e combinou um caminho juntos.']
    },
    5: {
      titulo: 'A mágoa que não passa', cena0: '💔', mesmoTx: 'Quem está magoado é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José está magoado com a Dona Cida há meses e conta para o Beto.', saiu: 'Percebeu como a mágoa ficou ainda maior? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Depois da missa', falas: [
        { q: 'c', t: 'Ana, desde a briga da quermesse eu e a Dona Cida não nos falamos. Eu não consigo perdoar.', cena: '💔' },
        { q: 'a', t: 'Faz meses, né, Seu José? Deve estar pesado carregar isso.', cena: '🎒' },
        { q: 'c', t: 'Está. Eu até evito a missa das dez para não encontrar com ela.', cena: '😔' },
        { q: 'a', t: 'Perdoar não é dizer que ela estava certa. É decidir não carregar mais esse peso. E o sentimento vem aos poucos, com a oração.', cena: '🙏' },
        { q: 'c', t: 'Mas quem errou foi ela. Ela é que tinha que pedir desculpas.', cena: '😤' },
        { q: 'a', t: 'Pode ser. Mas e se o senhor desse o primeiro passo? Às vezes, um "me perdoa pelo jeito que eu falei" desarma tudo.', cena: '🤍' },
        { q: 'c', t: 'Eu falei umas coisas duras mesmo…', cena: '🤔' },
        { q: 'a', t: 'Que tal um café na quinta, os três? Eu fico junto, só para ajudar. Jesus pede: vai primeiro reconciliar-te com o teu irmão.', cena: '☕' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Depois da missa', falas: [
          { q: 'c', t: 'Beto, desde a briga da quermesse eu e a Dona Cida não nos falamos.', cena: '💔' },
          { q: 'b', t: 'E nem precisa falar. Tem gente que não merece perdão.', cena: '🙅' },
          { q: 'c', t: 'Mas está pesado. Eu até evito a missa das dez.', cena: '😔' },
          { q: 'b', t: 'Faz bem. Ela que peça desculpas primeiro.', cena: '😒' },
          { q: 'c', t: 'E se ela nunca pedir?', cena: '🤔' },
          { q: 'b', t: 'Aí azar o dela. Cada um no seu canto.', cena: '🚫' }
        ] } },
        erros: ['Alimentou a mágoa: "tem gente que não merece perdão".', 'Incentivou o Seu José a evitar a comunidade.', 'Fechou o caminho da reconciliação.'] },
      repare: ['Acolheu o peso que o Seu José carregava.', 'Explicou o que é e o que não é perdoar.', 'Incentivou o primeiro passo e ofereceu ajuda para a reconciliação.']
    },
    6: {
      titulo: 'Sempre os mesmos fazem tudo', cena0: '📋', mesmoTx: 'Quem está cansado é o mesmo', pessoas: P0,
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José está cansado de fazer sempre as mesmas tarefas e reclama com o Beto, que coordena outra equipe.', saiu: 'Percebeu como o cansaço virou mágoa e ninguém resolveu nada? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na reunião de planejamento', falas: [
        { q: 'c', t: 'Ana, vou ser sincero: estou cansado. Sempre sou eu que monto e desmonto o salão.', cena: '😓' },
        { q: 'a', t: 'Obrigada por falar, Seu José. E me perdoa: eu devia ter percebido antes.', cena: '🤍' },
        { q: 'c', t: 'É que parece que ninguém vê.', cena: '😔' },
        { q: 'a', t: 'Eu vejo, e quero agradecer na frente de todos hoje. O senhor tem segurado essa tarefa há muito tempo.', cena: '👏' },
        { q: 'c', t: 'Obrigado, Ana. Isso já ajuda.', cena: '🥲' },
        { q: 'a', t: 'E vamos fazer uma escala: cada mês, uma dupla monta o salão. Eu escrevo no quadro, e no fim da reunião repito para todos.', cena: '📋' },
        { q: 'c', t: 'Assim eu continuo ajudando, mas sem carregar tudo sozinho.', cena: '🙂' },
        { q: 'a', t: 'Isso. Como Jetro disse a Moisés: trabalho dividido não esgota ninguém.', cena: '🤝' }
      ] } },
      ruim: { pessoa: BETO,
        variantes: { geral: { rotulo: 'Na reunião de planejamento', falas: [
          { q: 'c', t: 'Beto, estou cansado. Sempre sou eu que monto e desmonto o salão.', cena: '😓' },
          { q: 'b', t: 'É porque o senhor faz bem feito. Os outros fazem tudo errado.', cena: '🤷' },
          { q: 'c', t: 'Mas parece que ninguém vê o que eu faço.', cena: '😔' },
          { q: 'b', t: 'Serviço na igreja é assim, não é para ter reconhecimento.', cena: '😐' },
          { q: 'c', t: 'E não dá para dividir com mais gente?', cena: '🤔' },
          { q: 'b', t: 'Ah, dá muito trabalho organizar. Aguenta mais um pouco.', cena: '⌚' }
        ] } },
        erros: ['Não reconheceu o esforço do Seu José.', 'Manteve a tarefa concentrada numa pessoa só.', 'Deixou o cansaço virar mágoa, sem combinado nenhum.'] },
      repare: ['Pediu perdão primeiro e agradeceu em público.', 'Dividiu o trabalho com justiça, numa escala.', 'Deixou o combinado claro, por escrito e repetido para todos.']
    }
  };

  // ---------- Boas-vindas (stories) ----------
  const BV_SVG = [
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#DCEBF6"/><circle cx="320" cy="70" r="40" fill="#FFF4D6"/>${igreja(110, 170, 1.15)}<rect y="240" width="400" height="60" fill="#A9C7DE"/>${pes(240, 214, { c: K.az })}${pes(320, 214, { c: K.ro, p: K.pe[2] })}<path d="M252 236 q28 -16 56 0" stroke="${K.ou}" stroke-width="7" fill="none" stroke-linecap="round"/>${emo(280, 150, '🕊️', 40)}</svg>`,
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#FDE7B8"/>${emo(200, 130, '🤝', 96)}${emo(90, 230, '👂', 44)}${emo(310, 230, '🤍', 44)}${emo(200, 270, '☕', 36)}</svg>`,
    `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="400" height="300" fill="#E5F3EA"/>${roda(200, 220, 6, 170, C3)}${emo(200, 110, '🏅', 70)}${emo(100, 70, '🕊️', 30)}${emo(300, 70, '✨', 30)}</svg>`
  ];

  const AU = 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/rc/sage/';
  window.CA_CURSOS = window.CA_CURSOS || {};
  window.CA_CURSOS.conflitos = {
    id: 'conflitos', nome: 'Resolução de Conflitos', sub: 'uma atitude fraterna que pacifica os corações', ico: '🕊️',
    selo: ['RESOLUÇÃO', 'DE CONFLITOS'], lema: 'Bem-aventurados os que promovem a paz, porque serão chamados filhos de Deus (Mt 5,9).',
    deQuem: 'da comunidade', publico: 'comunidade', equipe: 'membros', equipeSing: 'membro', papelDono: 'Coordenador',
    icones: { 1: '⚡', 2: '👂', 3: '🧩', 4: '💬', 5: '🤍', 6: '🕊️' },
    trilha: { id: 'rc1', nome: 'Liderar com paz', horas: 2, licoes: LICOES,
      porque: [
        { n: 'Mt 5,9', t: 'Bem-aventurados os que promovem a paz, porque serão chamados filhos de Deus.', f: 'Evangelho de Mateus' },
        { n: 'Tg 1,19', t: 'Cada um seja pronto para ouvir, lento para falar e lento para se irar.', f: 'Carta de São Tiago' },
        { n: 'Mt 18,22', t: 'Não te digo até sete vezes, mas até setenta vezes sete.', f: 'Evangelho de Mateus' },
        { n: 'CIC 2304', t: 'A paz é obra da justiça e efeito da caridade.', f: 'Catecismo da Igreja Católica, § 2304', u: CIC_U + 'p3s2cap2_2196-2557_po.html' }
      ] },
    ilus: { falas: n => (LS[n] || []).map(([t, svg]) => ({ t, svg })), roteiro: n => (LS[n] || []).map(x => x[0]).join(' ') },
    dialogos: DIALOGOS,
    // 1.80.1: um trecho de vídeo católico em português por lição, escolhido pela transcrição e aprovado pelo Marcos em 13/11/2026.
    // 'depois' = trecho da fala depois do qual o vídeo entra.
    videos: {
      1: { id: 'VVQeOHDHIDE', ini: 239, fim: 351, depois: 4,
        titulo: 'Não entregue o botão da sua paz',
        quem: 'Padre Adriano Zandoná, no programa Pra ser Feliz',
        fonte: 'Canção Nova Play · Pra ser Feliz: Como lidar com uma pessoa difícil sem perder a paz (11/08/2026)',
        intro: 'Veja agora um trecho do padre Adriano Zandoná, no programa Pra ser Feliz, da Canção Nova: a gente não controla a reação do outro, mas pode cuidar do próprio coração. Toque no vídeo para assistir.' },
      2: { id: 'SfMVcUmV3QI', ini: 114, fim: 263, depois: 2,
        titulo: 'Pronto para ouvir, moroso para falar',
        quem: 'Frei Gilson, meditando Tiago 1',
        fonte: 'Frei Gilson / Som do Monte · Pronto para ouvir e moroso para falar (Tg 1,19-27)',
        intro: 'Agora, ouça o Frei Gilson meditando a carta de São Tiago: prontos para ouvir, lentos para falar. Toque no vídeo para assistir.' },
      3: { id: 'ckwid8mr30Y', ini: 60, fim: 128, depois: 6,
        titulo: 'Antes de julgar, converse',
        quem: 'Frei Gilson, meditando Mateus 7',
        fonte: 'Frei Gilson / Som do Monte · Cuidado em julgar o próximo (Mt 7,1-5)',
        intro: 'Veja agora o Frei Gilson falando do cuidado com o julgamento apressado: a gente não conhece a situação por inteiro. Toque no vídeo para assistir. É rapidinho.' },
      4: { id: '6aExcN0INKQ', ini: 293, fim: 393, depois: 7,
        titulo: 'Primeiro, a sós',
        quem: 'Frei Gilson, meditando Mateus 18',
        fonte: 'Frei Gilson / Som do Monte · Como corrigir quem peca contra você (Mt 18,15-20)',
        intro: 'Agora, ouça o Frei Gilson explicando o conselho de Jesus para corrigir o irmão: primeiro a sós, cara a cara, com coragem e com amor. Toque no vídeo para assistir.' },
      5: { id: 'Q4WnFfOV3mM', ini: 263, fim: 418, depois: 8,
        titulo: 'A ferida que vira compaixão',
        quem: 'Frei Gilson, meditando Mateus 18',
        fonte: 'Frei Gilson / Som do Monte · O que é perdão e como perdoar (Mt 18,21-35)',
        intro: 'Veja agora o Frei Gilson explicando, com o Catecismo, o que é perdoar: um coração que se entrega ao Espírito Santo. Toque no vídeo para assistir.' },
      6: { id: '92UhzHJUcLg', ini: 85, fim: 220, depois: 5,
        titulo: 'O exemplo do lava-pés',
        quem: 'Frei Gilson, meditando João 13',
        fonte: 'Frei Gilson / Som do Monte · A felicidade está em servir (Jo 13,16-20)',
        intro: 'Agora, ouça o Frei Gilson meditando o lava-pés: Jesus ensinou primeiro com o exemplo, servindo a todos com humildade. Toque no vídeo para assistir.' }
    },
    // Narração da Mariana (voz Sage); trecho com texto mudado volta para a voz do celular.
    audio: { base: AU + 'lic/', hash: s => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return x.toString(36); },
      lic: {"1":{"t":["k5c88q","11ya3eu","17owpia","p5gu1q","10u1yq4","1k0o9qa","1hv4p7k","18s704a","5pyfh4","t80srj","1fal25i","1f79m0y"],"intro":"1k1u4pc"},"2":{"t":["r7r9qj","6ce8g5","arqthy","toly5k","1jj29x1","1w88rw5","xuof59","e5bh9d","1aah7zs","1qymhn0","1onx69s","1taa7r"],"intro":"1qkktqu"},"3":{"t":["uzpt6d","1vd21a2","15t4y7n","11kiedw","1fynr7g","1l9zk9y","1s7l0o","1mw8lnw","p2b2mn","ntbnt7","lv9w89","1quf223"],"intro":"1ev4r94"},"4":{"t":["qh2juh","1wo32f3","m0b8mj","s4n2qo","w9n5gy","b4c8jl","k79d0y","163c3te","1nwnzub","1jpenm8","jmg8oo","1e4upza"],"intro":"1azo7dw"},"5":{"t":["ul9y2j","zywc37","1jru3mu","18s86uw","1pknv8k","1xu20ss","170drko","1qwbfvn","gto7dz","1w9xc49","1ezae94","1lawlfw"],"intro":"1qq26ni"},"6":{"t":["jvbddo","1lwrlxc","1tdkyjz","vbbp2f","1opji5j","1ivj5um","pn2kto","f55gdn","1bxac6i","5xop2f","1kd5chl","100bx6z"],"intro":"1l5ckap"}} },
    bv: {
      audio: [AU + 'bv1.mp3', AU + 'bv2.mp3', AU + 'bv3.mp3'],
      svg: BV_SVG,
      sub1: 'Bem-vindo à formação <b>Resolução de Conflitos</b>: uma atitude fraterna que pacifica os corações.',
      falas: [
        'Olá! Que alegria ter você aqui. Eu sou a Mariana, e vou acompanhar você na formação Resolução de Conflitos. Toda comunidade tem desentendimentos. E um gesto simples, cheio de fraternidade, pode pacificar os corações.',
        'São seis lições curtas, para fazer no celular, no seu tempo. Você vai aprender: o conflito não é o inimigo. Ouvir antes de responder. Separar a pessoa do problema. A conversa difícil. Perdão e reconciliação. E como ser um líder que pacifica.',
        'No final, você recebe o seu certificado. Mas o maior presente vai ser uma comunidade mais unida, onde as diferenças viram encontro. Vamos começar?'
      ],
      marcas: ['o conflito não é o inimigo', 'Ouvir antes', 'Separar a pessoa', 'A conversa difícil', 'Perdão e reconciliação', 'E como ser']
    },
    avisos: ['🕊️ Bem-aventurados os que promovem a paz.', '⏱️ Cada lição leva de 5 a 7 minutos: dá para fazer depois da missa.',
      '👂 Pronto para ouvir, lento para falar.', '🤝 Conversa difícil se faz a sós, olho no olho.', '🤍 Onde houver ofensa, que eu leve o perdão.'],
    sugAluno: ['Onde eu parei na formação?', 'Como ganho o certificado?', 'Como conversar com alguém que me magoou?', 'Duas pessoas da pastoral brigaram. O que eu faço?', 'A voz da lição não toca'],
    sugDono: ['Como adiciono um membro?', 'Como incentivo quem parou no meio?', 'Onde vejo as dúvidas dos membros?', 'Como os membros recebem o certificado?', 'Como prevenir conflitos na minha equipe?']
  };
})();
