/* Cliente Assistido – Curso FRATERNIDADE VIVA · vencer a fofoca e crescer juntos no amor (1.76.0).
   Segmento católico (paróquias, pastorais, ministérios, movimentos). Pedido do Marcos em 13/11/2026.
   Usa o mesmo motor do Cliente Encantado (treino.js): boas-vindas em stories, trilha, lição com ouvir/ver/na prática/leia/
   faça hoje/pergunta, dúvidas com a IA, certificado e o painel do Coordenador (dono que só acompanha o curso).
   A loja (comunidade) escolhe o curso em stores.recursos.curso = 'fraternidade' (Admin → Lojas → Editar → Curso).
   Progresso na trilha 'fv1' (training_progress), separado do Cliente Encantado ('t1').
   1.78.0: as 6 lições completas (pedido do Marcos em 13/11/2026: implementar todas, sem revisão agora). Uma lição com
   breve: true aparece na trilha como "em breve" e não abre. */
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
    // 1.77.1: o Catecismo também na narração (pedido do Marcos); texto em português do Brasil, a citação literal fica no bloco escrito.
    ['E o Catecismo da Igreja Católica também é claro. No parágrafo 2477, ensina que comete maledicência quem, sem um motivo justo, revela os defeitos e as faltas de alguém a pessoas que não os conheciam. E, no parágrafo 2479, lembra que a maledicência e a calúnia destroem a reputação e a honra do próximo.',
      cena('#FBF4E4', `<path d="M160 52 q-46 -14 -92 0 v92 q46 -14 92 0z" fill="#fff" stroke="${K.ou}" stroke-width="3"/><path d="M160 52 q46 -14 92 0 v92 q-46 -14 -92 0z" fill="#fff" stroke="${K.ou}" stroke-width="3"/><path d="M160 52 v92" stroke="${K.ou}" stroke-width="2"/>` + `<path d="M114 66 v34 M102 78 h24" stroke="${K.az2}" stroke-width="4" stroke-linecap="round"/>` + `<text x="114" y="122" text-anchor="middle" font-size="11" font-weight="800" fill="${K.n}" ${F}>Catecismo</text>` + `<text x="206" y="88" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>§ 2477</text><text x="206" y="112" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>§ 2479</text>` + emo(160, 34, '🕊️', 24))],
    ['A boa notícia é que o contrário também é verdade: uma palavra boa também se espalha. E o caminho para vencer a fofoca não é o silêncio frio. É o amor.',
      cena('#EAF6EF', emo(90, 110, '🌱', 40) + emo(160, 100, '🌿', 48) + emo(230, 110, '🌻', 44) + emo(125, 52, '💚', 22) + emo(198, 46, '💚', 26))],
    ['Amor que se preocupa com a pessoa, que não passa adiante o que fere, e que tem coragem de conversar com quem errou, com carinho.',
      cena(K.cr, pes(120, 86, { c: K.ve }) + pes(196, 86, { c: K.az, p: K.pe[2] }) + `<path d="M140 118 q18 -14 36 0" stroke="${K.ou}" stroke-width="6" fill="none" stroke-linecap="round"/>` + emo(158, 44, '🤝', 30))],
    ['Nesta formação, você vai aprender a reconhecer a fofoca, a não passá-la adiante e a transformar cada conversa em algo que edifica. Vamos crescer juntos?',
      cena(K.ce, igreja(160, 92, .9) + roda(160, 118, 5, 120, C3) + emo(70, 40, '🕊️', 26) + emo(250, 40, '✨', 24))]
  ];

  // ---------- 1.78.0: lições 2 a 6 (pedido do Marcos em 13/11/2026: implementar todas, sem revisão agora,
  // com bastante Bíblia, Catecismo e personagens da Igreja). Mesmo padrão da lição 1: [fala, cena]. ----------
  const livro = (fundo, cor, esq, dir1, dir2, topo) => cena(fundo, `<path d="M160 52 q-46 -14 -92 0 v92 q46 -14 92 0z" fill="#fff" stroke="${cor}" stroke-width="3"/><path d="M160 52 q46 -14 92 0 v92 q-46 -14 -92 0z" fill="#fff" stroke="${cor}" stroke-width="3"/><path d="M160 52 v92" stroke="${cor}" stroke-width="2"/>` + `<path d="M114 66 v34 M102 78 h24" stroke="${K.az2}" stroke-width="4" stroke-linecap="round"/>` + `<text x="114" y="122" text-anchor="middle" font-size="11" font-weight="800" fill="${K.n}" ${F}>${esq}</text>` + `<text x="206" y="${dir2 ? 88 : 102}" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>${dir1}</text>` + (dir2 ? `<text x="206" y="112" text-anchor="middle" font-size="15" font-weight="800" fill="${K.az2}" ${F}>${dir2}</text>` : '') + emo(160, 34, topo || '🕊️', 24));
  const cic = (par, topo) => livro('#FBF4E4', K.ou, 'Catecismo', par, '', topo || '✝️');
  const ref = (fundo, txt, x, y) => `<rect x="${x - 40}" y="${y - 16}" width="80" height="24" rx="12" fill="${K.az2}"/><text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" ${F}>${txt}</text>`;
  const L2 = [
    ['Olá, que bom ter você de volta! Na lição passada, vimos como a fofoca fere a comunidade. Hoje vamos olhar para dentro de nós: de onde nasce a fofoca?',
      cena(K.ce, pes(120, 86, { c: K.ve }) + emo(200, 92, '🌱', 46) + emo(200, 40, '❓', 26) + emo(250, 120, '🌱', 26))],
    ['Jesus foi claro: a boca fala daquilo de que o coração está cheio. É o que lemos no Evangelho de São Lucas, capítulo seis. A fofoca não começa na língua. Começa no coração.',
      cena('#FDEDEF', emo(110, 104, '❤️', 60) + emo(190, 100, '👄', 40) + `<path d="M140 96 h26" stroke="${K.ro}" stroke-width="4" stroke-dasharray="5 5"/>` + ref('', 'Lc 6,45', 250, 52))],
    ['Por isso, antes de perguntar o que eu falo, vale perguntar: o que está acontecendo dentro de mim quando sinto vontade de falar de alguém?',
      cena(K.cr, pes(110, 86, { c: K.vi, p: K.pe[1] }) + emo(110, 34, '🤔', 26) + `<rect x="190" y="40" width="70" height="96" rx="35" fill="#E8F1F8" stroke="${K.az2}" stroke-width="3"/>` + pes(225, 82, { c: K.vi, p: K.pe[1], e: .7 }))],
    ['A primeira raiz é a curiosidade: querer saber da vida dos outros e logo contar, como quem traz uma novidade. São Paulo já advertia, na primeira carta a Timóteo, contra quem anda de casa em casa, falando o que não convém.',
      cena('#F1F6EC', emo(60, 120, '🏠', 40) + emo(130, 112, '🏠', 46) + emo(200, 120, '🏠', 40) + emo(270, 112, '🏠', 46) + emo(160, 52, '👀', 34) + ref('', '1Tm 5,13', 160, 166))],
    ['A segunda raiz é a vontade de pertencer. Quando conto um segredo, me sinto importante, parte do grupo. Mas a amizade construída falando dos ausentes é frágil: amanhã, o ausente posso ser eu.',
      cena(K.ce, roda(140, 118, 4, 90, C3) + pes(272, 92, { c: '#9AA6A0', t: true, e: .8 }) + emo(140, 40, '🤫', 26) + emo(272, 44, '😔', 22))],
    ['A terceira raiz é a inveja. Foi a inveja que fez o rei Saul perseguir Davi, quando ouviu o povo cantar os feitos do jovem pastor. Está no primeiro livro de Samuel. Quem inveja, procura diminuir o outro com palavras.',
      cena('#FFF4E0', pes(100, 88, { c: K.vi, p: K.pe[2] }) + emo(100, 34, '👑', 28) + pes(230, 92, { c: K.ve, e: .85 }) + emo(230, 44, '🎶', 24) + emo(160, 70, '😠', 24) + ref('', '1Sm 18', 160, 166))],
    ['A quarta raiz é a mágoa guardada. Quando alguém me feriu e eu não conversei com ele, a dor vira comentário. Falo dele para os outros, mas nunca com ele.',
      cena('#F2F2F2', pes(100, 88, { c: K.az, t: true }) + emo(100, 40, '🩹', 24) + bal(140, 30, 120, 'Sabe o que ele fez?') + pes(250, 92, { c: K.ou, p: K.pe[2], e: .85 }))],
    ['E existe uma raiz muito comum: julgar sem saber. Ver alguém faltar à missa e já concluir o pior. Jesus pergunta, no Evangelho de São Mateus, capítulo sete: por que você olha o cisco no olho do seu irmão e não vê a trave que está no seu?',
      cena(K.cr, pes(100, 88, { c: K.ro, p: K.pe[1] }) + emo(140, 70, '🔍', 30) + pes(240, 88, { c: K.az, p: K.pe[3] }) + emo(100, 34, '🪵', 26) + ref('', 'Mt 7,3', 240, 36))],
    ['O Catecismo da Igreja Católica chama isso de juízo temerário. No parágrafo 2477, ensina que comete juízo temerário quem admite como verdadeiro, sem prova suficiente, um defeito moral do próximo.',
      cic('§ 2477', '⚖️')],
    ['São Francisco de Sales, doutor da Igreja, lembrava que quem fala mal do próximo comete três mortes com uma só palavra: fere a própria alma, a alma de quem escuta e a boa fama de quem é falado.',
      cena('#F4EEF7', pes(80, 88, { c: K.n, p: K.pe[0], h: '#e8e8e8' }) + `<rect x="68" y="104" width="24" height="5" fill="#fff"/>` + emo(170, 96, '💔', 30) + emo(220, 96, '💔', 30) + emo(270, 96, '💔', 30) + `<text x="220" y="140" text-anchor="middle" font-size="11" font-weight="700" fill="${K.n}" ${F}>uma palavra, três feridas</text>`)],
    ['O remédio começa na oração. Como o salmista, podemos pedir: Senhor, põe uma guarda em minha boca, vigia a porta dos meus lábios. É o Salmo cento e quarenta e um.',
      cena('#EAF6EF', pes(120, 88, { c: K.ve, p: K.pe[2] }) + emo(120, 36, '🙏', 26) + emo(220, 92, '🔐', 44) + ref('', 'Sl 141,3', 220, 150))],
    ['Nesta semana, toda vez que sentir vontade de comentar a vida de alguém, pare um instante e pergunte: qual dessas raízes está falando em mim agora? Reconhecer já é o primeiro passo para mudar.',
      cena(K.ce, igreja(160, 92, .8) + roda(160, 118, 5, 120, C3) + emo(70, 44, '🌱', 26) + emo(250, 44, '💚', 24))]
  ];
  const L3 = [
    ['Olá! Hoje vamos falar de uma situação que acontece com todo mundo: quando a fofoca chega até nós. Alguém começa: você ficou sabendo? E agora, o que fazer?',
      cena('#F4EEF7', pes(110, 86, { c: K.ro, p: K.pe[1] }) + bal(120, 26, 140, 'Você ficou sabendo?') + pes(240, 88, { c: K.az }) + emo(290, 70, '👂', 24))],
    ['O livro dos Provérbios tem uma imagem simples: sem lenha, o fogo se apaga; e, sem quem leve e traga conversa, a briga acaba. É o capítulo vinte e seis, versículo vinte.',
      cena('#FFF3E6', emo(110, 120, '🔥', 50) + emo(80, 150, '🪵', 26) + emo(140, 150, '🪵', 26) + `<path d="M190 96 h40" stroke="${K.n}" stroke-width="3" marker-end=""/>` + emo(260, 120, '💨', 40) + ref('', 'Pr 26,20', 190, 40))],
    ['Quem escuta a fofoca e não passa adiante é como quem tira a lenha da fogueira. Você pode ser o ponto final da história.',
      cena(K.ce, pes(130, 88, { c: K.ve }) + bal(160, 30, 110, 'Aqui ela para.', K.ve) + emo(240, 112, '🛑', 40))],
    ['Ajuda fazer três perguntas, inspiradas em São Paulo, que pede, na carta aos Filipenses, que pensemos em tudo o que é verdadeiro, justo e amável. Primeira: isso é verdade? Segunda: isso é bom? Terceira: isso ajuda alguém?',
      cena(K.cr, [['É verdade?', 70], ['É bom?', 160], ['Ajuda?', 250]].map(([t, x]) => `<rect x="${x - 40}" y="56" width="80" height="60" rx="12" fill="#fff" stroke="${K.az}" stroke-width="2"/><text x="${x}" y="92" text-anchor="middle" font-size="12" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join('') + ref('', 'Fl 4,8', 160, 146))],
    ['Se a resposta for não, você tem caminhos simples: mudar de assunto com delicadeza, dizer que prefere não falar de quem não está presente, ou lembrar algo bom daquela pessoa.',
      cena('#EAF6EF', pes(110, 88, { c: K.az, p: K.pe[2] }) + bal(124, 24, 176, 'Sabe o que eu admiro nela?', K.ve) + emo(250, 116, '🔄', 32))],
    ['E se for verdade? Mesmo assim, contar o defeito do irmão para quem não sabia, sem necessidade, fere a caridade. A pergunta não é só se é verdade, mas se é caridade.',
      cena('#F2F2F2', emo(160, 100, '⚖️', 60) + emo(90, 80, '✔️', 24) + emo(230, 80, '💚', 26) + `<text x="160" y="150" text-anchor="middle" font-size="12" font-weight="700" fill="${K.n}" ${F}>verdade com caridade</text>`)],
    ['O Catecismo da Igreja Católica nos dá uma chave, no parágrafo 2478: cada um procure interpretar, tanto quanto possível, no melhor sentido, os pensamentos, as palavras e as ações do próximo.',
      cic('§ 2478', '🔑')],
    ['Santa Teresinha do Menino Jesus vivia isso. No convento, havia uma irmã de quem ela naturalmente não gostava. Teresinha decidiu tratá-la como a pessoa que mais amava, e sorria para ela sempre. Um dia, a irmã perguntou o que ela via de tão especial nela.',
      cena('#FDEDEF', pes(110, 88, { c: '#5b3b26', p: K.pe[0], h: '#2b2b2b' }) + pes(220, 88, { c: '#5b3b26', p: K.pe[1], h: '#2b2b2b' }) + emo(110, 36, '🌹', 24) + emo(165, 60, '😊', 22))],
    ['Interpretar no melhor sentido não é ser ingênuo. É dar ao outro a mesma chance que eu gostaria de receber. Se fosse comigo, eu gostaria que pensassem o pior?',
      cena(K.ce, pes(110, 88, { c: K.ve }) + pes(210, 88, { c: K.ve }) + `<path d="M160 40 v110" stroke="${K.az2}" stroke-width="2" stroke-dasharray="4 4"/>` + emo(160, 30, '🪞', 22))],
    ['Às vezes, a fofoca chega como pedido de oração: reze pela fulana, ela está com problema no casamento. Nesses casos, reze de verdade e guarde o assunto. A oração não precisa de detalhes.',
      cena('#F1F0F9', pes(120, 88, { c: K.vi }) + emo(120, 36, '🙏', 26) + emo(230, 96, '🤐', 44))],
    ['E no grupo de WhatsApp? A regra é a mesma: não encaminhar, não comentar e, se for o caso, chamar a pessoa no privado para uma palavra de cuidado.',
      cena(K.ce, `<rect x="120" y="22" width="80" height="140" rx="14" fill="${K.n}"/><rect x="127" y="34" width="66" height="112" rx="6" fill="#fff"/>` + emo(160, 80, '🔁', 30) + `<path d="M140 64 l40 32 M180 64 l-40 32" stroke="${K.ro}" stroke-width="5" stroke-linecap="round"/>` + emo(160, 128, '💬', 22) + emo(260, 96, '💚', 30))],
    ['Lembre-se: o fogo só se espalha se alguém continuar soprando. Hoje, seja você a pessoa em quem a fofoca para.',
      cena('#EAF6EF', emo(160, 100, '🕊️', 56) + emo(80, 130, '💨', 28) + emo(240, 130, '🌿', 30))]
  ];
  const L4 = [
    ['Olá! Até aqui, aprendemos a reconhecer a fofoca e a não passá-la adiante. Mas e quando alguém realmente errou? Calar e guardar mágoa também não é o caminho. Hoje vamos aprender a falar com a pessoa, e não sobre ela.',
      cena(K.cr, pes(110, 86, { c: K.ve }) + pes(210, 86, { c: K.az, p: K.pe[2] }) + emo(160, 40, '🤝', 30))],
    ['O próprio Jesus ensinou o caminho, no Evangelho de São Mateus, capítulo dezoito: se teu irmão pecar contra ti, vai e corrige-o a sós. Se ele te ouvir, terás ganho o teu irmão.',
      cena('#F4F1EA', pes(110, 88, { c: '#fff', p: K.pe[1], h: '#4a2f1a' }) + `<rect x="94" y="104" width="32" height="6" fill="${K.ro}"/>` + bal(140, 30, 130, 'Vai e fala a sós.') + ref('', 'Mt 18,15', 230, 130))],
    ['Repare na ordem: primeiro, a sós. Não é contar para o grupo, nem desabafar com a amiga, nem mandar indireta. É ir até a pessoa, com respeito, longe dos olhos dos outros.',
      cena('#EAF6EF', `<rect x="70" y="118" width="120" height="10" rx="4" fill="#B9825A"/>` + pes(105, 88, { c: K.ve }) + pes(155, 88, { c: K.az, p: K.pe[2] }) + roda(270, 120, 3, 40, ['#c9c9c9']) + emo(130, 36, '🌳', 30))],
    ['E repare no objetivo: ganhar o irmão. Não é vencer a discussão nem provar que eu estou certo. É recuperar a amizade.',
      cena(K.ce, emo(90, 100, '🏆', 40) + `<path d="M66 76 l48 48 M114 76 l-48 48" stroke="${K.ro}" stroke-width="5" stroke-linecap="round"/>` + emo(220, 100, '🤝', 50) + emo(220, 44, '💚', 24))],
    ['O Catecismo da Igreja Católica ensina, no parágrafo 1829, que a caridade exige a prática do bem e a correção fraterna. Corrigir com amor não é falta de caridade. É um fruto dela.',
      cic('§ 1829', '🍇')],
    ['A Bíblia nos dá um exemplo bonito: o profeta Natã. Quando o rei Davi errou gravemente, Natã não espalhou a notícia pelo reino. Foi até o rei, contou uma história com sabedoria, e Davi reconheceu o seu pecado. Está no segundo livro de Samuel, capítulo doze.',
      cena('#FFF4E0', pes(110, 88, { c: K.vi, p: K.pe[2] }) + emo(110, 34, '👑', 26) + pes(220, 88, { c: '#8D6E4A', p: K.pe[3], h: '#ddd' }) + emo(220, 36, '📜', 24) + ref('', '2Sm 12', 165, 166))],
    ['São Paulo também pede, na carta aos Gálatas, capítulo seis: se alguém cair em alguma falta, vós, que sois espirituais, corrigi-o com espírito de mansidão, e cuida de ti mesmo, para que também não sejas tentado.',
      cena('#F1F0F9', pes(110, 88, { c: K.az2, p: K.pe[1], h: '#555' }) + emo(110, 36, '✉️', 24) + emo(230, 92, '🕊️', 46) + ref('', 'Gl 6,1', 230, 150))],
    ['Na prática, alguns passos ajudam. Primeiro, reze antes e acalme o coração. Segundo, escolha um momento tranquilo, a sós. Terceiro, fale do fato, e não da pessoa: em vez de você é irresponsável, diga: fiquei chateado quando aquilo aconteceu.',
      cena(K.cr, [['1', '🙏', 70], ['2', '🌳', 160], ['3', '💬', 250]].map(([n, e, x]) => `<circle cx="${x}" cy="90" r="34" fill="#fff" stroke="${K.ou}" stroke-width="3"/>` + emo(x, 102, e, 30) + `<circle cx="${x - 26}" cy="62" r="11" fill="${K.ou}"/><text x="${x - 26}" y="66" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" ${F}>${n}</text>`).join(''))],
    ['Quarto, escute de verdade: muitas vezes existe um lado da história que a gente não conhecia. E quinto, proponha um caminho juntos: como podemos fazer diferente da próxima vez?',
      cena('#EAF6EF', [['4', '👂', 105], ['5', '🛤️', 215]].map(([n, e, x]) => `<circle cx="${x}" cy="90" r="36" fill="#fff" stroke="${K.ve}" stroke-width="3"/>` + emo(x, 102, e, 32) + `<circle cx="${x - 28}" cy="60" r="11" fill="${K.ve}"/><text x="${x - 28}" y="64" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" ${F}>${n}</text>`).join(''))],
    ['Santo Inácio de Loyola, lembrado pelo Catecismo no parágrafo 2478, ensinava: se o outro compreende menos retamente, corrija-o com benevolência. Benevolência é querer o bem do outro, mesmo quando ele erra.',
      livro('#F4EEF7', K.vi, 'Catecismo', '§ 2478', 'Sto. Inácio', '🙌')],
    ['E se não resolver? Jesus também prevê isso: leve mais uma ou duas pessoas, e depois a comunidade. Na paróquia, isso pode ser procurar a coordenação ou o padre, sempre com o mesmo espírito: ajudar, e não expor.',
      cena(K.ce, igreja(250, 96, .75) + pes(80, 90, { c: K.ve, e: .85 }) + pes(130, 90, { c: K.az, p: K.pe[2], e: .85 }) + pes(180, 90, { c: K.ou, p: K.pe[1], e: .85 }) + ref('', 'Mt 18,16', 130, 36))],
    ['Falar com a pessoa exige coragem. Mas é assim que Jesus nos trata: Ele não fala de nós pelas costas. Ele vem até nós, nos olha com amor e nos chama a recomeçar.',
      cena('#FFF8E8', `<circle cx="160" cy="80" r="56" fill="#FFE9A8"/>` + `<path d="M160 44 v74 M134 70 h52" stroke="${K.ou}" stroke-width="8" stroke-linecap="round"/>` + emo(80, 140, '💛', 24) + emo(240, 140, '💛', 24))]
  ];
  const L5 = [
    ['Olá! Todos nós, alguma vez, já passamos uma fofoca adiante. Hoje não é para carregar culpa, mas para aprender a reparar. Na comunidade cristã, sempre existe caminho de volta.',
      cena(K.cr, pes(110, 88, { c: K.az, t: true }) + `<path d="M150 110 q40 -50 90 -10" stroke="${K.ve}" stroke-width="4" fill="none" stroke-dasharray="6 6"/>` + emo(250, 104, '🏠', 40) + emo(110, 36, '🩹', 24))],
    ['O Catecismo da Igreja Católica ensina, no parágrafo 2487, que toda falta contra a verdade e contra a boa fama do outro pede reparação, mesmo quando o autor já foi perdoado. Ou seja: pedir desculpas é importante, e consertar o estrago também.',
      cic('§ 2487', '🩹')],
    ['O Evangelho nos dá um retrato lindo disso: Zaqueu. Quando Jesus entrou na casa dele, Zaqueu se levantou e disse: se prejudiquei alguém, vou devolver quatro vezes mais. Está no Evangelho de São Lucas, capítulo dezenove.',
      cena('#EAF6EF', emo(90, 110, '🌳', 80) + pes(90, 60, { c: K.ou, p: K.pe[2], e: .55 }) + pes(220, 88, { c: '#fff', p: K.pe[1], h: '#4a2f1a' }) + `<rect x="204" y="104" width="32" height="6" fill="${K.ro}"/>` + ref('', 'Lc 19,8', 220, 36))],
    ['Reparar começa por reconhecer, sem desculpas e sem diminuir: eu falei o que não devia. Esse reconhecimento pode e deve ser levado também ao sacramento da Reconciliação, a confissão.',
      cena('#F1F0F9', `<rect x="170" y="36" width="100" height="116" rx="10" fill="#8D5A3B"/><rect x="186" y="52" width="68" height="70" rx="6" fill="#C9A27A"/><path d="M220 60 v40 M206 74 h28" stroke="#fff" stroke-width="4"/>` + pes(110, 90, { c: K.vi, p: K.pe[1] }) + emo(110, 38, '🙏', 24))],
    ['Depois, vem pedir perdão à pessoa ferida, com simplicidade. Jesus diz, no Evangelho de São Mateus, capítulo cinco: se, ao levar a tua oferta ao altar, te lembrares de que teu irmão tem algo contra ti, vai primeiro reconciliar-te com ele.',
      cena('#FFF4E0', `<rect x="40" y="96" width="80" height="54" fill="#fff" stroke="${K.ou}" stroke-width="3"/><path d="M80 66 v24 M70 76 h20" stroke="${K.ou}" stroke-width="4"/>` + `<path d="M130 120 h40" stroke="${K.n}" stroke-width="3" stroke-dasharray="5 5"/>` + pes(200, 88, { c: K.az }) + pes(260, 88, { c: K.ro, p: K.pe[2] }) + ref('', 'Mt 5,24', 230, 36))],
    ['O terceiro passo é desfazer o estrago: voltar a quem ouviu a fofoca e dizer, com humildade: aquilo que eu falei não estava certo. Assim a história para de correr.',
      cena(K.ce, pes(110, 88, { c: K.ve }) + bal(130, 26, 150, 'Aquilo não era verdade.', K.ve) + pes(250, 92, { c: K.ou, p: K.pe[1], e: .85 }) + emo(290, 140, '🔙', 20))],
    ['E o quarto passo é semear o bem: falar das qualidades da pessoa, com sinceridade, onde antes se falou mal. A boa palavra também se espalha.',
      cena('#EAF6EF', emo(70, 120, '🌱', 30) + emo(130, 112, '🌿', 38) + emo(190, 116, '🌻', 40) + emo(250, 112, '🌼', 38) + emo(160, 46, '💬', 28))],
    ['Pense em São Pedro. Ele negou Jesus três vezes. Depois da ressurreição, à beira do mar, Jesus perguntou a ele, também três vezes: tu me amas? E confiou a ele o cuidado do seu rebanho. Está no Evangelho de São João, capítulo vinte e um. Confiança quebrada pode ser reconstruída.',
      cena('#E6F0F7', `<rect y="120" width="320" height="30" fill="#9DC3E0"/>` + pes(110, 86, { c: K.az2, p: K.pe[2], h: '#777' }) + pes(200, 86, { c: '#fff', p: K.pe[1], h: '#4a2f1a' }) + emo(155, 140, '🔥', 22) + emo(270, 110, '🐑', 30) + `<text x="155" y="40" text-anchor="middle" font-size="18" ${EMO}>❤️❤️❤️</text>`)],
    ['E quando fui eu a pessoa ferida? Então o caminho é perdoar. Pedro perguntou a Jesus se devia perdoar até sete vezes, e Jesus respondeu: até setenta vezes sete. Perdoar não é esquecer à força. É decidir não devolver o mal.',
      cena('#FDEDEF', `<text x="160" y="108" text-anchor="middle" font-size="46" font-weight="800" fill="${K.ro}" ${F}>70 × 7</text>` + ref('', 'Mt 18,22', 160, 146) + emo(160, 40, '🕊️', 26))],
    ['São Paulo resume, na carta aos Efésios, capítulo quatro: sede bondosos e compassivos uns para com os outros, perdoando-vos mutuamente, como Deus vos perdoou em Cristo.',
      cena(K.cr, pes(120, 88, { c: K.ve }) + pes(200, 88, { c: K.ro, p: K.pe[2] }) + `<path d="M140 118 q20 -14 40 0" stroke="${K.ou}" stroke-width="6" fill="none" stroke-linecap="round"/>` + ref('', 'Ef 4,32', 160, 36))],
    ['A confiança volta aos poucos, como uma planta que cresce. Seja paciente com o outro e com você. A constância nas pequenas atitudes é o que reconstrói.',
      cena('#EAF6EF', emo(80, 130, '🌱', 26) + emo(160, 124, '🌿', 40) + emo(245, 118, '🌳', 60) + `<path d="M100 150 h120" stroke="${K.ve}" stroke-width="3" stroke-dasharray="4 6"/>`)],
    ['Hoje, pense: existe alguém a quem eu devo uma palavra de reparação? Que o Espírito Santo te dê coragem e humildade para dar esse passo.',
      cena('#FFF8E8', emo(160, 70, '🕊️', 50) + emo(120, 130, '🔥', 22) + emo(160, 136, '🔥', 22) + emo(200, 130, '🔥', 22))]
  ];
  const L6 = [
    ['Olá! Chegamos à última lição da nossa formação. Que alegria caminhar com você até aqui! Hoje vamos olhar para frente: como construir uma comunidade em que as palavras edificam.',
      cena(K.ce, igreja(160, 92, .9) + roda(160, 118, 5, 120, C3) + emo(70, 40, '✨', 22) + emo(250, 40, '🎉', 22))],
    ['Os Atos dos Apóstolos mostram como viviam os primeiros cristãos: a multidão dos que acreditavam tinha um só coração e uma só alma. Está no capítulo quatro. Esse é o sonho de Deus para a nossa comunidade.',
      cena('#FDEDEF', roda(160, 120, 6, 130, C3) + emo(160, 52, '❤️', 40) + ref('', 'At 4,32', 160, 166))],
    ['São Paulo usa a imagem do corpo, na primeira carta aos Coríntios, capítulo doze: somos muitos membros, mas um só corpo. Se um membro sofre, todos sofrem com ele; se um é honrado, todos se alegram.',
      cena('#F1F6EC', emo(100, 90, '🧩', 40) + emo(150, 90, '🧩', 40) + emo(200, 90, '🧩', 40) + emo(250, 90, '🧩', 40) + ref('', '1Cor 12', 175, 146) + emo(175, 36, '🙌', 24))],
    ['Por isso, quando falo mal de um irmão, firo o corpo inteiro. E, quando falo bem, todo o corpo se fortalece. O Catecismo, no parágrafo 953, lembra que o menor dos nossos atos, feito na caridade, reverte em proveito de todos.',
      cic('§ 953', '🧩')],
    ['São Paulo também pede, na carta aos Romanos, capítulo doze: amai-vos uns aos outros com amor fraterno, com terna afeição, e adiantai-vos em honrar uns aos outros.',
      cena('#EAF6EF', pes(110, 88, { c: K.ve }) + pes(210, 88, { c: K.vi, p: K.pe[2] }) + emo(160, 70, '💚', 30) + ref('', 'Rm 12,10', 160, 36))],
    ['Na carta aos Efésios, capítulo quatro, ele dá a regra de ouro das palavras: nenhuma palavra má saia da vossa boca, mas só a que for boa para edificar e fazer bem a quem ouve.',
      cena(K.cr, pes(100, 88, { c: K.az }) + bal(120, 26, 120, 'Obrigado por tudo!', K.ve) + emo(260, 96, '🧱', 34) + ref('', 'Ef 4,29', 260, 146))],
    ['Edificar é construir, tijolo por tijolo. Cada elogio sincero, cada agradecimento, cada pergunta: como você está?, é um tijolo na casa da comunidade.',
      cena('#FFF4E0', [0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<rect x="${92 + c * 34 + (r % 2) * 17}" y="${118 - r * 20}" width="32" height="18" rx="3" fill="#D9825A"/>`).join('')).join('') + `<path d="M86 60 L170 24 L254 60z" fill="${K.ou}"/>` + emo(60, 140, '💬', 24))],
    ['Olhe para Maria. Quando soube que Isabel esperava um filho, ela foi às pressas visitá-la e servi-la. Maria não levou notícias da vida alheia. Levou Jesus e alegria. Está no Evangelho de São Lucas, capítulo um.',
      cena('#E8F1F8', pes(120, 88, { c: '#5B8DC9', p: K.pe[0], h: '#3b2616' }) + `<path d="M98 72 q22 -30 44 0" stroke="#fff" stroke-width="6" fill="none"/>` + pes(210, 88, { c: K.ro, p: K.pe[1], h: '#ddd' }) + emo(165, 40, '🌟', 26) + ref('', 'Lc 1,39', 165, 166))],
    ['Santa Teresa de Calcutá deixou uma frase que ficou conhecida: as palavras gentis podem ser curtas e fáceis de dizer, mas o seu eco é verdadeiramente infinito.',
      cena('#F2F2F2', pes(100, 88, { c: '#fff', p: K.pe[2], h: '#fff' }) + `<path d="M80 74 q20 -26 40 0" stroke="#3E6FB0" stroke-width="5" fill="none"/>` + [0, 1, 2].map(i => `<path d="M${150 + i * 28} ${70 - i * 10} q${20 + i * 8} 30 0 ${60 + i * 20}" stroke="${K.ve}" stroke-width="3" fill="none" opacity="${1 - i * .25}"/>`).join('') + emo(260, 100, '💬', 24))],
    ['E Jesus deixou o sinal pelo qual seremos reconhecidos: nisto todos conhecerão que sois meus discípulos, se vos amardes uns aos outros. Está no Evangelho de São João, capítulo treze.',
      cena('#FFF8E8', `<path d="M160 30 v70 M134 52 h52" stroke="${K.ou}" stroke-width="8" stroke-linecap="round"/>` + roda(160, 130, 5, 120, C3) + ref('', 'Jo 13,35', 270, 40))],
    ['Leve para a sua pastoral três compromissos: não alimentar a fofoca, falar com a pessoa e não sobre ela, e dizer, toda semana, uma palavra boa a alguém da comunidade.',
      cena(K.cr, [['🛑', 'não alimentar', 70], ['🤝', 'falar com', 160], ['💬', 'palavra boa', 250]].map(([e, t, x]) => `<rect x="${x - 40}" y="44" width="80" height="84" rx="12" fill="#fff" stroke="${K.ve}" stroke-width="2"/>` + emo(x, 92, e, 30) + `<text x="${x}" y="118" text-anchor="middle" font-size="10" font-weight="800" fill="${K.n}" ${F}>${t}</text>`).join(''))],
    ['Obrigada por fazer esta formação comigo! Ao concluir esta lição, o seu certificado fica pronto. Mas o maior fruto vai aparecer na sua comunidade, em cada conversa que você transformar. Que Nossa Senhora te acompanhe. Vamos crescer juntos no amor!',
      cena('#E5F3EA', igreja(90, 96, .7) + emo(200, 100, '🏅', 56) + emo(270, 50, '🕊️', 26) + emo(150, 40, '✨', 20))]
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
    { n: 2, t: 'De onde nasce a fofoca', audio: '',
      cartao: 'A boca fala do que o coração está cheio. Cuide do coração.',
      ler: ['A fofoca nasce no coração antes de chegar à boca (Lc 6,45).',
        'Raízes comuns: curiosidade, vontade de pertencer, inveja, mágoa guardada e julgar sem saber.',
        'Juízo temerário é acreditar, sem prova, no pior sobre alguém (CIC § 2477).',
        'Antes de olhar o cisco no olho do irmão, olhe a trave no próprio olho (Mt 7,3).',
        'O remédio começa na oração: "Senhor, põe uma guarda em minha boca" (Sl 141,3).'],
      desafio: 'Hoje, reze pela manhã: "Senhor, põe uma guarda em minha boca" (Sl 141,3). E, sempre que sentir vontade de comentar a vida de alguém, pergunte: "Que raiz está falando em mim agora: curiosidade, inveja, mágoa ou julgamento?".',
      pergunta: 'A Cláudia faltou aos últimos três encontros do grupo de oração, e alguém comenta: "Deve estar brigada com alguém". O que é juízo temerário nessa situação?',
      opcoes: ['Perguntar à Cláudia, com carinho, se está tudo bem.', 'Acreditar, sem prova, que ela está brigada e repassar essa ideia.', 'Rezar pela Cláudia e pelo grupo.'], certa: 1 },
    { n: 3, t: 'Quando a fofoca chega até mim', audio: '',
      cartao: 'A fofoca para em mim.',
      ler: ['Sem lenha, o fogo se apaga; sem quem leve conversa, a briga acaba (Pr 26,20).',
        'Antes de passar adiante, pergunte: é verdade? É bom? Ajuda alguém? (Fl 4,8)',
        'Mesmo sendo verdade, contar o defeito do irmão sem necessidade fere a caridade.',
        'Interprete no melhor sentido o que o outro diz e faz (CIC § 2478), como fazia Santa Teresinha.',
        'Pedido de oração não precisa de detalhes; no grupo de WhatsApp, não encaminhe nem comente.'],
      desafio: 'Hoje, se alguém começar a falar de uma pessoa ausente, experimente uma destas frases: "Prefiro não falar dela sem ela aqui" ou "Sabe o que eu admiro nela?". E reze um Pai-Nosso por essa pessoa.',
      pergunta: 'Uma amiga da pastoral diz: "Vou te contar uma coisa da Rita, mas é só para você rezar por ela". O que mais ajuda?',
      opcoes: ['Ouvir tudo e contar para mais duas pessoas rezarem também.', 'Dizer com carinho que pode rezar pela Rita sem saber os detalhes, e rezar de verdade.', 'Pedir mais detalhes para rezar melhor.'], certa: 1 },
    { n: 4, t: 'Falar com a pessoa, não sobre ela', audio: '',
      cartao: 'Falo com você, e não sobre você.',
      ler: ['Se teu irmão errar, vai e corrige-o a sós (Mt 18,15).',
        'O objetivo é ganhar o irmão, e não vencer a discussão.',
        'A caridade exige a correção fraterna (CIC § 1829), feita com mansidão (Gl 6,1), como fez o profeta Natã com Davi.',
        'Fale do fato, não da pessoa: "fiquei chateado quando…", e escute o outro lado.',
        'Se não resolver, procure a coordenação ou o padre, para ajudar e não para expor (Mt 18,16).'],
      desafio: 'Pense em alguém da comunidade com quem você está chateado e de quem já falou com outras pessoas. Reze por ele hoje e marque uma conversa a sós, com calma, para os próximos dias.',
      pergunta: 'O Júlio, do ministério de música, chegou atrasado em três missas seguidas, e você ficou incomodado. Qual é o caminho que Jesus ensina?',
      opcoes: ['Comentar com os outros músicos para ver se eles também perceberam.', 'Contar logo ao padre para ele resolver.', 'Conversar a sós com o Júlio, com calma, ouvir o lado dele e combinar juntos um caminho.'], certa: 2 },
    { n: 5, t: 'Reparar e reconstruir a confiança', audio: '',
      cartao: 'Quem feriu com palavras, cura com palavras e atitudes.',
      ler: ['A falta contra a boa fama do outro pede reparação (CIC § 2487).',
        'Como Zaqueu (Lc 19,8), reconheça e conserte o que você estragou.',
        'Peça perdão à pessoa (Mt 5,24) e leve isso também ao sacramento da Reconciliação.',
        'Volte a quem ouviu a fofoca para desfazer a história; depois, fale bem da pessoa.',
        'Se você foi ferido, perdoe: até setenta vezes sete (Mt 18,22). Confiança se reconstrói, como Jesus fez com Pedro (Jo 21).'],
      desafio: 'Hoje, escolha um passo de reparação: pedir perdão a alguém, desfazer uma história com quem ouviu ou dizer uma qualidade de quem você criticou. Se puder, procure também o sacramento da Reconciliação nesta semana.',
      pergunta: 'Você contou a duas pessoas uma história sobre o Tiago que, depois, descobriu não ser verdade. Qual é a melhor forma de reparar?',
      opcoes: ['Esperar que o assunto seja esquecido.', 'Pedir perdão ao Tiago e voltar às duas pessoas para dizer que a história não era verdade.', 'Contar para muito mais gente que você errou, para todo mundo saber.'], certa: 1 },
    { n: 6, t: 'Uma comunidade que se edifica', audio: '',
      cartao: 'Palavras que edificam, comunidade que floresce.',
      ler: ['Os primeiros cristãos tinham um só coração e uma só alma (At 4,32).',
        'Somos um só corpo: se um membro sofre, todos sofrem com ele (1Cor 12,26).',
        'O menor ato feito na caridade beneficia a todos (CIC § 953).',
        'Só a palavra que edifica e faz bem a quem ouve (Ef 4,29), como Maria na visita a Isabel (Lc 1,39).',
        'O sinal do cristão é o amor de uns pelos outros (Jo 13,35).'],
      desafio: 'Nesta semana, diga a três pessoas da sua comunidade uma palavra sincera de gratidão ou de reconhecimento: pessoalmente, por mensagem ou num bilhete. E reze por cada uma delas.',
      pergunta: 'Segundo São Paulo, na carta aos Efésios, como devem ser as palavras de um cristão na comunidade?',
      opcoes: ['Sinceras a qualquer custo, mesmo que machuquem.', 'Boas para edificar e fazer bem a quem ouve.', 'Poucas, para evitar qualquer problema.'], certa: 1 }
  ];
  const LS = { 1: L1, 2: L2, 3: L3, 4: L4, 5: L5, 6: L6 };
  LICOES.forEach(l => { if (LS[l.n]) l.roteiro = LS[l.n].map(x => x[0]).join(' '); });

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
    },
    2: {
      titulo: 'O novo coordenador do grupo de jovens', cena0: '⛪',
      pessoas: { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da pastoral' } },
      narr: { ini: 'Primeiro, veja como não fazer. Na saída da reunião, o Seu José comenta uma novidade com o Beto.', saiu: 'Percebeu como a inveja virou desconfiança e quase foi parar no grupo? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Na saída da reunião', falas: [
        { q: 'c', t: 'Ana, você viu que o Paulo foi escolhido para coordenar o grupo de jovens?', cena: '🙂' },
        { q: 'a', t: 'Vi sim! Que bom. Confesso que, no começo, senti uma pontinha de ciúme, porque eu também queria ajudar mais.', cena: '😊' },
        { q: 'c', t: 'E dizem por aí que ele só foi escolhido porque é amigo do padre.', cena: '💬' },
        { q: 'a', t: 'Eu não sei disso, Seu José. E não quero julgar o coração dele sem saber. O que eu vejo é que ele chega cedo e ajuda em tudo.', cena: '🤔' },
        { q: 'c', t: 'É verdade, ele ajudou muito na quermesse.', cena: '🎪' },
        { q: 'a', t: 'Então vamos rezar por ele e oferecer ajuda. Se a gente se unir, o grupo de jovens só ganha.', cena: '🙏' },
        { q: 'c', t: 'Tem razão. Vou mandar uma mensagem para dar os parabéns a ele.', cena: '📱' },
        { q: 'a', t: 'Que bonito! Alegrar-se com o bem do outro é o melhor remédio contra a inveja.', cena: '💚' }
      ] } },
      ruim: {
        pessoa: { nome: 'Beto', papel: 'membro da pastoral' },
        variantes: { geral: { rotulo: 'Na saída da reunião', falas: [
          { q: 'c', t: 'Beto, você viu que o Paulo foi escolhido para coordenar o grupo de jovens?', cena: '🙂' },
          { q: 'b', t: 'Vi. Também, ele é amigo do padre. Assim é fácil.', cena: '😒' },
          { q: 'c', t: 'Será? Eu achei que ele se dedica bastante.', cena: '🤔' },
          { q: 'b', t: 'Dedica nada. Ele só aparece quando tem foto. Pode reparar.', cena: '📸' },
          { q: 'c', t: 'Nossa, eu nunca tinha pensado nisso…', cena: '😟' },
          { q: 'b', t: 'Pois é. Vou falar com o pessoal do grupo para ficarem de olho nele.', cena: '📱' }
        ] } },
        erros: ['Por inveja, diminuiu o Paulo em vez de se alegrar com ele.', 'Julgou as intenções do Paulo sem nenhuma prova.', 'Plantou desconfiança no Seu José e quis espalhar para o grupo.']
      },
      repare: ['Reconheceu com sinceridade o próprio sentimento, sem esconder.', 'Recusou julgar as intenções do Paulo sem prova.', 'Transformou o comentário em oração e em ajuda concreta.']
    },
    3: {
      titulo: 'O áudio sobre a Dona Célia', cena0: '📱',
      pessoas: { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da pastoral' } },
      narr: { ini: 'Primeiro, veja como não fazer. Antes do encontro da liturgia, o Seu José mostra um áudio para o Beto.', saiu: 'Percebeu como um áudio sem confirmação virou notícia em outro grupo? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Antes do encontro da liturgia', falas: [
        { q: 'c', t: 'Ana, recebi um áudio no grupo dizendo que o padre tirou a Dona Célia dos ministros.', cena: '📱' },
        { q: 'a', t: 'Não precisa me mandar, Seu José. Prefiro não ouvir áudio sobre quem não está aqui.', cena: '✋' },
        { q: 'c', t: 'Mas é que todo mundo está comentando…', cena: '💬' },
        { q: 'a', t: 'Pode haver muitos motivos, e talvez nem seja verdade. Quem sabe ela só pediu um tempo para cuidar da família.', cena: '🤔' },
        { q: 'c', t: 'É mesmo, a mãe dela está doente…', cena: '😟' },
        { q: 'a', t: 'Então, em vez de comentar, que tal a gente rezar por ela e perguntar se precisa de ajuda?', cena: '🙏' },
        { q: 'c', t: 'Boa ideia. E vou pedir no grupo para não repassarem esse áudio.', cena: '🚫' },
        { q: 'a', t: 'Obrigada! Sabe o que eu admiro na Dona Célia? O carinho com que ela leva a comunhão aos doentes.', cena: '💚' }
      ] } },
      ruim: {
        pessoa: { nome: 'Beto', papel: 'membro da pastoral' },
        variantes: { geral: { rotulo: 'Antes do encontro da liturgia', falas: [
          { q: 'c', t: 'Beto, recebi um áudio no grupo dizendo que o padre tirou a Dona Célia dos ministros.', cena: '📱' },
          { q: 'b', t: 'Manda para mim! Eu já desconfiava que ia acontecer alguma coisa.', cena: '😮' },
          { q: 'c', t: 'Mas eu não sei se é verdade…', cena: '🤔' },
          { q: 'b', t: 'Se está circulando, alguma coisa tem. Vou encaminhar para o grupo da liturgia.', cena: '🔁' },
          { q: 'c', t: 'Será que não é melhor esperar?', cena: '😕' },
          { q: 'b', t: 'Que nada. Todo mundo tem o direito de saber.', cena: '📢' }
        ] } },
        erros: ['Pediu para receber a fofoca em vez de parar o assunto.', 'Tratou o boato como verdade só porque estava circulando.', 'Encaminhou para outro grupo, aumentando a ferida.']
      },
      repare: ['Não aceitou receber a fofoca e disse isso com gentileza.', 'Interpretou a situação no melhor sentido possível.', 'Trocou o boato por oração, ajuda e uma palavra boa sobre a Dona Célia.']
    },
    4: {
      titulo: 'Os cantos da missa', cena0: '🎶',
      pessoas: { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro do coral' } },
      narr: { ini: 'Primeiro, veja como não fazer. Depois do ensaio, o Seu José desabafa com o Beto.', saiu: 'Percebeu como o problema ficou maior, e a Carla nem foi ouvida? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'Depois do ensaio do coral', falas: [
        { q: 'c', t: 'Ana, não aguento mais a Carla. Toda missa ela muda os cantos sem avisar ninguém.', cena: '😤' },
        { q: 'a', t: 'Entendo, Seu José. Isso atrapalha mesmo. Você já conversou com ela sobre isso?', cena: '🤔' },
        { q: 'c', t: 'Não. Fiquei com receio de brigar.', cena: '😕' },
        { q: 'a', t: 'Que tal falar só com ela, com calma? Em vez de dizer que ela faz tudo errado, conte como você se sente quando o canto muda de última hora.', cena: '🤝' },
        { q: 'c', t: 'Tipo assim: Carla, eu fico perdido quando o canto muda e eu não fui avisado?', cena: '💬' },
        { q: 'a', t: 'Isso! E depois escute. Pode ser que ela tenha um motivo que a gente nem imagina.', cena: '👂' },
        { q: 'c', t: 'Vou rezar antes e falar com ela depois do próximo ensaio.', cena: '🙏' },
        { q: 'a', t: 'Muito bom. E, se não der certo, a gente procura juntos a coordenação, para ajudar, e não para acusar.', cena: '💚' }
      ] } },
      ruim: {
        pessoa: { nome: 'Beto', papel: 'membro do coral' },
        variantes: { geral: { rotulo: 'Depois do ensaio do coral', falas: [
          { q: 'c', t: 'Beto, não aguento mais a Carla. Toda missa ela muda os cantos sem avisar ninguém.', cena: '😤' },
          { q: 'b', t: 'Também acho! Ela se acha a dona do coral.', cena: '😒' },
          { q: 'c', t: 'E o que eu faço?', cena: '🤔' },
          { q: 'b', t: 'Manda uma indireta no grupo. Ou conta para o padre, que ele dá um jeito nela.', cena: '📱' },
          { q: 'c', t: 'Mas eu nunca falei com ela sobre isso…', cena: '😕' },
          { q: 'b', t: 'Nem precisa. Todo mundo já reclama dela mesmo.', cena: '💬' }
        ] } },
        erros: ['Concordou com a crítica e ainda rotulou a Carla.', 'Sugeriu indireta no grupo e pular a conversa a sós.', 'Ninguém pensou em ouvir o lado da Carla.']
      },
      repare: ['Acolheu o incômodo do Seu José sem alimentar críticas à Carla.', 'Mostrou o caminho de Jesus: conversar a sós, com calma.', 'Ensinou a falar do fato e do sentimento, e a escutar o outro lado.']
    },
    5: {
      titulo: 'A história sobre a Dona Rosa', cena0: '🩹',
      pessoas: { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da pastoral' } },
      narr: { ini: 'Primeiro, veja como não fazer. O Seu José está arrependido de uma história que contou e procura o Beto.', saiu: 'Percebeu como a ferida ficou aberta, e a Dona Rosa continua sozinha? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'No salão paroquial', falas: [
        { q: 'c', t: 'Ana, lembra que eu contei que a Dona Rosa estava pegando dinheiro da festa? Descobri que não era verdade.', cena: '😟' },
        { q: 'a', t: 'Que bom que você percebeu, Seu José. Isso já é um primeiro passo.', cena: '🙂' },
        { q: 'c', t: 'Mas ela está triste, nem veio na missa domingo. Não sei o que fazer.', cena: '😢' },
        { q: 'a', t: 'Que tal ir até ela, com humildade, e pedir perdão? Não precisa de discurso. Basta ser sincero.', cena: '🤝' },
        { q: 'c', t: 'E as pessoas para quem eu contei?', cena: '💬' },
        { q: 'a', t: 'Volte a cada uma e diga que aquilo não era verdade. E, sempre que puder, fale do quanto a Dona Rosa ajuda na festa.', cena: '🌻' },
        { q: 'c', t: 'Vou fazer isso. E vou me confessar também.', cena: '🙏' },
        { q: 'a', t: 'Que bonito! Deus já está te ajudando a reconstruir. E eu vou junto, se você quiser.', cena: '💚' }
      ] } },
      ruim: {
        pessoa: { nome: 'Beto', papel: 'membro da pastoral' },
        variantes: { geral: { rotulo: 'No salão paroquial', falas: [
          { q: 'c', t: 'Beto, lembra que eu contei que a Dona Rosa estava pegando dinheiro da festa? Descobri que não era verdade.', cena: '😟' },
          { q: 'b', t: 'Ah, deixa para lá. Daqui a pouco todo mundo esquece.', cena: '🤷' },
          { q: 'c', t: 'Mas ela está triste, nem veio na missa domingo.', cena: '😢' },
          { q: 'b', t: 'Ela que é sensível demais. Você não disse nada de mais.', cena: '🙄' },
          { q: 'c', t: 'Será que eu não devia falar com ela?', cena: '🤔' },
          { q: 'b', t: 'Para quê? Só vai piorar. Finge que nada aconteceu.', cena: '🙈' }
        ] } },
        erros: ['Diminuiu o mal que a fofoca causou.', 'Culpou a Dona Rosa, que foi a pessoa ferida.', 'Desencorajou o pedido de perdão e a reparação.']
      },
      repare: ['Acolheu o Seu José sem julgar, valorizando o arrependimento.', 'Indicou os passos da reparação: pedir perdão e desfazer a história.', 'Lembrou de falar bem da Dona Rosa e se ofereceu para ir junto.']
    },
    6: {
      titulo: 'A chegada da Dona Inês', cena0: '☕',
      pessoas: { a: { nome: 'Ana', papel: 'coordenadora da pastoral' }, c: { nome: 'Seu José', papel: 'membro da pastoral' } },
      narr: { ini: 'Primeiro, veja como não fazer. No café depois da missa, o Seu José apresenta uma pessoa nova ao Beto.', saiu: 'Percebeu como a Dona Inês ficou com uma primeira impressão ruim da comunidade? Repare no que deu errado.', ponte: 'Agora, veja o mesmo momento, do jeito certo, com a Ana.' },
      variantes: { geral: { rotulo: 'No café depois da missa', falas: [
        { q: 'c', t: 'Ana, esta é a Dona Inês. Ela acabou de se mudar para o bairro e quer participar da pastoral.', cena: '🙂' },
        { q: 'a', t: 'Seja muito bem-vinda, Dona Inês! Que alegria ter a senhora com a gente.', cena: '🤗' },
        { q: 'c', t: 'Ela perguntou como é a nossa comunidade.', cena: '💬' },
        { q: 'a', t: 'É uma família! O coral canta lindamente, a liturgia cuida de cada detalhe e a pastoral da visitação leva carinho aos doentes.', cena: '⛪' },
        { q: 'c', t: 'E o café depois da missa é famoso!', cena: '☕' },
        { q: 'a', t: 'É verdade! Domingo a senhora vem tomar com a gente? Eu apresento todo mundo.', cena: '😊' },
        { q: 'c', t: 'E, se precisar de qualquer coisa, pode contar com a gente.', cena: '🤝' },
        { q: 'a', t: 'Isso mesmo. Aqui a gente cresce junto, no amor.', cena: '💚' }
      ] } },
      ruim: {
        pessoa: { nome: 'Beto', papel: 'membro da pastoral' },
        variantes: { geral: { rotulo: 'No café depois da missa', falas: [
          { q: 'c', t: 'Beto, esta é a Dona Inês. Ela acabou de se mudar para o bairro e quer participar da pastoral.', cena: '🙂' },
          { q: 'b', t: 'Seja bem-vinda! Mas já vou avisando: cuidado com a turma do coral, que é cheia de panelinha.', cena: '😏' },
          { q: 'c', t: 'Ô, Beto…', cena: '😬' },
          { q: 'b', t: 'E o pessoal da liturgia só sabe reclamar. Aqui é assim mesmo.', cena: '🙄' },
          { q: 'c', t: 'A senhora vai ver que não é bem assim, Dona Inês.', cena: '😕' },
          { q: 'b', t: 'Vai por mim. Daqui a um mês a senhora entende.', cena: '🤷' }
        ] } },
        erros: ['Apresentou a comunidade pelos defeitos, e não pelas qualidades.', 'Rotulou grupos inteiros diante de quem estava chegando.', 'Plantou desconfiança onde devia haver acolhida.']
      },
      repare: ['Acolheu a Dona Inês com alegria.', 'Apresentou a comunidade pelas qualidades de cada grupo.', 'Convidou e se ofereceu para aproximar a Dona Inês das pessoas.']
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
    ilus: { falas: n => (LS[n] || []).map(([t, svg]) => ({ t, svg })), roteiro: n => (LS[n] || []).map(x => x[0]).join(' ') },
    dialogos: DIALOGOS,
    // 1.76.5: trechos de vídeos públicos do YouTube (pedido do Marcos: leves, gentis, sem tom agressivo nem condenatório),
    // um por lição, como no Cliente Encantado. Escolhidos pela transcrição (e, no do Papa, pela legenda em português do próprio vídeo).
    // 1.78.0: 'depois' = trecho da fala depois do qual o vídeo entra, acertado ao escrever as lições 2 a 6.
    videos: {
      1: { id: 'F_R6R5GxxuE', ini: 18, fim: 82, depois: 7, // 1.76.6: narrado em português (o do Angelus era em italiano com legenda pequena)
        titulo: 'Os apóstolos não falavam pelas costas',
        quem: 'Papa Francisco, em visita a uma paróquia de Roma (narração em português)',
        fonte: 'Rede Século 21 · Vaticano News, 16/01/2017',
        intro: 'Agora, veja o próprio Papa Francisco falando sobre o que acontece quando, em vez de ajudar o irmão que errou, a gente sai contando o erro dele. Toque no vídeo para assistir. É rapidinho, menos de um minuto.' },
      2: { id: 'lETSGEl21ms', ini: 105, fim: 175, depois: 2,
        titulo: 'O que é, de fato, a fofoca',
        quem: 'Jonathan, da Canção Nova',
        fonte: 'Canção Nova Oficial · RVJ #16 – Fofoca',
        intro: 'Veja agora, num vídeo curto da Canção Nova, uma explicação simples do que é a fofoca: pegar algo que pertence à vida de outra pessoa e passar adiante. Toque no vídeo para assistir.' },
      3: { id: 'QtEvyskjZVg', ini: 153, fim: 228, depois: 4,
        titulo: 'A fofoca para no ouvido inteligente',
        quem: 'Luzia Santiago, cofundadora da Comunidade Canção Nova',
        fonte: 'Canção Nova Oficial · Não dê ouvidos à fofoca!',
        intro: 'Agora, ouça a Luzia Santiago, da Canção Nova, contando o que ela faz quando uma fofoca chega até ela: mudar de assunto ou falar o bem daquela pessoa. Toque no vídeo para assistir.' },
      4: { id: '9GrgTimVEjg', ini: 122, fim: 223, depois: 3,
        titulo: 'Aproximar-se para conversar, com delicadeza',
        quem: 'Frei Gilson, meditando Mateus 18,15-20',
        fonte: 'Frei Gilson / Som do Monte · Meditação da Palavra',
        intro: 'Veja agora o Frei Gilson meditando o Evangelho da correção fraterna: em vez de se afastar e falar pelas costas, se aproximar e conversar a sós, com delicadeza. Toque no vídeo para assistir.' },
      5: { id: 'DVHWUUI7ENQ', ini: 604, fim: 652, depois: 4,
        titulo: 'Perdão é decisão',
        quem: 'Padre Bruno, na Canção Nova',
        fonte: 'Canção Nova Play · Pedir perdão e perdoar de coração',
        intro: 'Agora, ouça o Padre Bruno, da Canção Nova, lembrando que o perdão não é só um sentimento: é uma decisão de ir atrás de quem precisamos pedir perdão. Toque no vídeo para assistir.' },
      6: { id: 'LI78PGQtp3w', ini: 160, fim: 193, depois: 4,
        titulo: 'Amor fraterno, com terna afeição',
        quem: 'Frei Gilson, meditando Romanos 12',
        fonte: 'Frei Gilson / Som do Monte · Amor fraterno',
        intro: 'Para fechar, veja o Frei Gilson falando do amor fraterno do dia a dia: uma palavra de carinho, um posso te ajudar, uma atenção com o irmão. Toque no vídeo para assistir.' }
    },
    // 1.76.1: narração gravada com a mesma voz do Cliente Encantado (voz Coral da OpenAI gpt-4o-mini-tts), pedido do Marcos.
    // 1.76.2: a narradora da Fraternidade Viva se chama MARIANA (pedido do Marcos); arquivos em fv/mariana/ (voz coral) e, desde a 1.76.4, fv/sage/ (voz Sage, mais fina, escolhida pelo Marcos).
    // Cada trecho tem o hash do texto: se o texto mudar, aquele trecho volta para a voz do celular até gerar o áudio de novo.
    audio: { base: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/lic/', hash: s => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return x.toString(36); },
      lic: { 1: { t: ["1cue9pf", "1axkmhg", "gj30m5", "jmfvbm", "1upq7eg", "rv4fcy", "udn7ty", "x9cxne", "hqflww", "1ryif4o", "1j8boqn", "1tbexs1"], intro: "ht4ms7" }, 2: { t: ["zmgzla",  "1u9gkyg",  "9la2qe",  "160q1qp",  "133512l",  "mt5xrl",  "fsxnak",  "uzobh7",  "1u8n8jt",  "1msw2ln",  "u3uk28",  "62bvgk"], intro: "123a5t7" }, 3: { t: ["1nugxnl",  "bywqzc",  "1g4w1ug",  "1y7axw",  "1qutwkb",  "1v89ooq",  "a7isp7",  "zn7fth",  "ppwg4v",  "1hl0of9",  "1uixs5d",  "qk6fal"], intro: "11ktpfd" }, 4: { t: ["iqtayf",  "1dlsbrg",  "95qr40",  "1dq4d7h",  "8h8pme",  "wv5gtd",  "kcbuhw",  "1vwhwsi",  "17vcich",  "tzls07",  "1mufmwm",  "yd0tj2"], intro: "1y3xw5e" }, 5: { t: ["1uyby99",  "ai1ph5",  "1bmhep4",  "18wm7vg",  "mcompo",  "18hiczw",  "1ommebv",  "ehvob7",  "pn881o",  "ptffio",  "pnt789",  "1lrdtl8"], intro: "7a1611" }, 6: { t: ["1v5uhma",  "z19ccg",  "lqkfdf",  "h2uylr",  "1ugcamk",  "1a0e8z",  "13cvw4a",  "6frbve",  "wo647c",  "1seqwf3",  "1czq1jr",  "zsmawg"], intro: "whoz0g" } } },
    bv: {
      audio: ['https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/bv1.mp3', 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/bv2.mp3', 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fv/sage/bv3.mp3'],
      // 1.80.2: fotos reais de pessoas (pedido do Marcos, para humanizar), licença livre do Pexels (uso gratuito, sem atribuição obrigatória):
      // 1 (desde a 1.80.6, pedido do Marcos) Papa Leão XIV no papamóvel saudando os fiéis na missa de início do pontificado, 18/05/2025, foto do
      //   Departamento de Estado dos EUA, DOMÍNIO PÚBLICO (Wikimedia Commons 'Pope Leo XIV in the popemobile at his inauguration.jpg'); antes: Darina Belonogova (pexels 9167331, abraço), 2 Rodrigo Silva (pexels 34707579, jovem rezando no Terço dos Homens), 3 Andrea Piacquadio (pexels 3865557, mãos unidas).
      fotos: [{ src: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fotos/fv/bv1-papa.jpg', pos: '30% 45%' }, { src: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fotos/fv/bv2.jpg', pos: 'center 20%' }, { src: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fotos/fv/bv3.jpg', pos: 'center 40%' }],
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
