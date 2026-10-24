/* Cliente Assistido – Ilustrações e falas do Treino (versão 1.26.2).
   Cada lição é dividida em trechos de fala (≈ 8 a 12 s). Cada trecho tem a sua ilustração, sem repetir, e o texto
   do trecho vira a legenda sincronizada com o áudio. Desenhos próprios em SVG (bonequinhos, objetos e alguns emojis),
   sem imagem externa. window.CA_ILUS.falas(n) → [{ t: texto do trecho, svg }]. */
'use strict';
(function () {
  const C = { g: '#12B76A', g2: '#0A8F52', n: '#0B2545', o: '#FF8A00', bg: '#F3F8F5', l: '#DDE7E2', w: '#fff', y: '#FFC93C', r: '#E5484D', p1: '#F2C9A0', p2: '#C98E5F', p3: '#8D5A3B', b: '#4C7DD8', v: '#8B5CF6', cz: '#9AA6A0' };
  const F = 'font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"';
  const EMO = 'font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif"';
  // ---------- peças ----------
  function P(x, o) { // bonequinho em pé; o: c roupa, s pele, a acena, t triste, b bravo, e escala, h cabelo, y base, tag crachá, p pensa
    o = o || {}; const y = o.y || 78, s = o.e || 1, pele = o.s || C.p1, roupa = o.c || C.g;
    const boca = o.t ? '<path d="M-7 10 q7 -6 14 0" stroke="#0B2545" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
      : o.b ? '<path d="M-7 9 h14" stroke="#0B2545" stroke-width="2.4" stroke-linecap="round"/>'
      : '<path d="M-7 6 q7 7 14 0" stroke="#0B2545" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    const sob = o.b ? '<path d="M-11 -9 l7 3 M11 -9 l-7 3" stroke="#0B2545" stroke-width="2.2" stroke-linecap="round"/>' : '';
    const braco = o.a ? `<path d="M14 30 q16 -10 18 -30" stroke="${roupa}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="32" cy="-2" r="6" fill="${pele}"/>` : '';
    const tag = o.tag ? `<rect x="-16" y="32" width="32" height="16" rx="3" fill="#fff" stroke="#0B2545" stroke-width="1.5"/><text x="0" y="44" text-anchor="middle" font-size="8" font-weight="800" fill="#0B2545" ${F}>${o.tag}</text>` : '';
    const pensa = o.p ? `<circle cx="20" cy="-26" r="3" fill="#fff" stroke="${C.l}"/><circle cx="28" cy="-36" r="5" fill="#fff" stroke="${C.l}"/>` : '';
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="22" width="44" height="52" rx="18" fill="${roupa}"/>${braco}<circle r="20" fill="${pele}"/><path d="M-19 -6 q2 -20 19 -21 q17 1 19 21 q-8 -10 -19 -10 q-11 0 -19 10z" fill="${o.h || C.n}"/><circle cx="-7" cy="-2" r="2.4" fill="#0B2545"/><circle cx="7" cy="-2" r="2.4" fill="#0B2545"/>${sob}${boca}${tag}${pensa}</g>`;
  }
  function B(x, y, w, t, cor, d) { // balão de fala
    const h = 30, cheio = cor && cor !== C.w, ponta = d ? `M${x + w - 18} ${y + h} l8 10 l2 -10z` : `M${x + 14} ${y + h} l-6 10 l12 -10z`;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="15" fill="${cor || C.w}" stroke="${cheio ? cor : C.l}" stroke-width="1.5"/><path d="${ponta}" fill="${cor || C.w}"/><text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" font-size="13" font-weight="700" fill="${cheio ? '#fff' : C.n}" ${F}>${t}</text>`;
  }
  const T = (x, y, t, s, cor, a) => `<text x="${x}" y="${y}" text-anchor="${a || 'middle'}" font-size="${s || 14}" font-weight="800" fill="${cor || C.n}" ${F}>${t}</text>`;
  const E = (x, y, e, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${s || 40}" ${EMO}>${e}</text>`;
  const cor = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C-12 -4 -10 -14 -3 -14 C0 -14 0 -11 0 -10 C0 -11 0 -14 3 -14 C10 -14 12 -4 0 6Z" fill="${c || C.r}"/>`;
  const est = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.3 1.2 L6.4 8.1 L0 4 L-6.4 8.1 L-4.3 1.2 L-10 -3.1 L-2.9 -3.1Z" fill="${c || C.y}"/>`;
  const seta = (x1, y1, x2, y2, c, tr) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 10; return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${c || C.o}" stroke-width="4" stroke-linecap="round"${tr ? ' stroke-dasharray="6 6"' : ''}/><path d="M${x2} ${y2} l${-h * Math.cos(a - .5)} ${-h * Math.sin(a - .5)} M${x2} ${y2} l${-h * Math.cos(a + .5)} ${-h * Math.sin(a + .5)}" stroke="${c || C.o}" stroke-width="4" stroke-linecap="round"/>`; };
  const ok = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.g}"/><path d="M${x - r * .45} ${y} l${r * .3} ${r * .3} l${r * .55} ${-r * .6}" stroke="#fff" stroke-width="${r * .2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const nao = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.r}"/><path d="M${x - r * .4} ${y - r * .4} l${r * .8} ${r * .8} M${x + r * .4} ${y - r * .4} l${-r * .8} ${r * .8}" stroke="#fff" stroke-width="${r * .2}" stroke-linecap="round"/>`;
  const risca = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.r}" stroke-width="5" stroke-linecap="round"/>`;
  const rel = (x, y, r, t) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${C.n}" stroke-width="4"/><path d="M${x} ${y} L${x} ${y - r + 9} M${x} ${y} L${x + r - 12} ${y + 4}" stroke="${C.o}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3.5" fill="${C.n}"/>${t ? T(x, y + r + 18, t, 13) : ''}`;
  const cel = (x, y, ms) => `<g transform="translate(${x} ${y})"><rect width="96" height="150" rx="14" fill="${C.n}"/><rect x="6" y="14" width="84" height="122" rx="6" fill="#fff"/><rect x="6" y="14" width="84" height="18" rx="6" fill="${C.g2}"/>${(ms || []).map((m, i) => `<rect x="${m[1] ? 14 : 10}" y="${40 + i * 26}" width="72" height="20" rx="8" fill="${m[1] ? '#D7F5E3' : '#EEF1F0'}"/><text x="${m[1] ? 19 : 15}" y="${54 + i * 26}" font-size="9" fill="${C.n}" ${F}>${m[0]}</text>`).join('')}</g>`;
  const carro = (x, y, c) => `<g transform="translate(${x} ${y})"><path d="M0 30 q4 -18 22 -20 l14 -12 h40 l16 12 q18 2 20 20 v10 h-112z" fill="${c || C.b}"/><rect x="40" y="4" width="18" height="14" rx="3" fill="#CFE3FF"/><rect x="62" y="4" width="20" height="14" rx="3" fill="#CFE3FF"/><circle cx="26" cy="42" r="10" fill="${C.n}"/><circle cx="26" cy="42" r="4" fill="${C.l}"/><circle cx="90" cy="42" r="10" fill="${C.n}"/><circle cx="90" cy="42" r="4" fill="${C.l}"/></g>`;
  const loja = (x, y, s, toldo) => `<g transform="translate(${x} ${y}) scale(${s || 1})"><rect width="110" height="90" rx="6" fill="#fff" stroke="${C.n}" stroke-width="3"/><path d="M-6 0 h122 l-8 -22 h-106z" fill="${toldo || C.g}"/><path d="M8 -22 l-6 22 M30 -22 l-4 22 M52 -22 v22 M74 -22 l4 22 M96 -22 l6 22" stroke="#fff" stroke-width="3"/><rect x="38" y="40" width="34" height="50" rx="3" fill="${C.n}"/><circle cx="66" cy="66" r="2.5" fill="${C.y}"/><rect x="10" y="20" width="22" height="18" rx="3" fill="#CFE3FF"/><rect x="78" y="20" width="22" height="18" rx="3" fill="#CFE3FF"/></g>`;
  const balcao = (x, w) => `<rect x="${x}" y="112" width="${w || 150}" height="44" rx="6" fill="${C.n}"/><rect x="${x}" y="104" width="${w || 150}" height="12" rx="4" fill="${C.g2}"/>`;
  const placa = (x, y, w, t, c) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="8" fill="${c || C.n}"/>${T(x + w / 2, y + 23, t, 15, '#fff')}`;
  const lista = (x, y, itens, marcados) => `<g transform="translate(${x} ${y})"><rect width="140" height="${18 + itens.length * 22}" rx="10" fill="#fff" stroke="${C.l}" stroke-width="2"/>${itens.map((t, i) => `<g transform="translate(12 ${12 + i * 22})"><rect width="14" height="14" rx="3" fill="${i < (marcados == null ? 99 : marcados) ? C.g : C.l}"/>${i < (marcados == null ? 99 : marcados) ? '<path d="M3 7 l3 3 l5 -6" stroke="#fff" stroke-width="2.2" fill="none"/>' : ''}${T(22, 12, t, 12, C.n, 'start')}</g>`).join('')}</g>`;
  const cal = (x, y, mes, dia) => `<g transform="translate(${x} ${y})"><rect width="80" height="86" rx="10" fill="#fff" stroke="${C.l}" stroke-width="2"/><rect width="80" height="24" rx="10" fill="${C.r}"/>${T(40, 17, mes, 11, '#fff')}${T(40, 66, dia, 30)}</g>`;
  const chao = `<rect x="0" y="150" width="320" height="30" fill="${C.l}"/>`;
  const S = (...p) => `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="320" height="180" rx="16" fill="${C.bg}"/>${p.join('')}</svg>`;

  // 1.28.0: cena de pesquisa — rosca com o percentual (ou número grande com seta), frases curtas e a fonte embaixo.
  function pesq(o) {
    const r = 46, c = 2 * Math.PI * r, cx = 82, cy = 82;
    const graf = o.v != null && o.v <= 100
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="${C.l}" stroke-width="16"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${o.c || C.g}" stroke-width="16" stroke-dasharray="${(o.v / 100 * c).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="round"/>${T(cx, cy + 8, o.n, o.n.length > 4 ? 18 : 24)}`
      : `<rect x="14" y="34" width="132" height="96" rx="18" fill="${o.c || C.g}"/>${T(80, 96, o.n, o.n.length > 6 ? 20 : 30, '#fff')}<path d="M124 50 l8 -9 l8 9 M132 41 v18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const linhas = o.l.map((t, i) => T(156, 72 + i * 20, t, i ? 13 : 14, i ? '#3A4A44' : C.n, 'start')).join('');
    return S(graf, o.ic ? E(170, 46, o.ic, 24) : '', linhas,
      `<rect x="150" y="136" width="${Math.min(160, 30 + o.f.length * 6.2)}" height="24" rx="12" fill="${C.n}"/>`, T(162, 152, '📊 ' + o.f, 11, '#fff', 'start'));
  }

  // ---------- falas e cenas por lição (cada trecho tem a sua cena; nenhuma se repete) ----------
  const L = {};
  L[1] = [
    ['Oi, tudo bem? Aqui é o Marcos, do Cliente Assistido.', S(chao, P(110, { a: 1 }), B(150, 20, 110, 'Oi! 👋', C.g), `<rect x="220" y="70" width="64" height="64" rx="18" fill="${C.g}"/>`, T(252, 112, 'CA', 26, '#fff'))],
    ['Vamos começar com uma pergunta simples: por que um cliente volta a uma loja?', S(chao, loja(40, 52), P(230, { c: C.b, s: C.p2, p: 1 }), T(270, 40, '?', 46, C.o))],
    ['Muita gente acha que é o preço. O preço conta, claro.', S(chao, `<g transform="translate(60 40) rotate(-12)"><path d="M0 0 h90 l30 30 l-30 30 h-90z" fill="${C.y}"/><circle cx="96" cy="30" r="6" fill="#fff"/>${T(42, 38, 'R$', 26)}</g>`, P(240, { c: C.o }))],
    ['Mas pense em você mesmo. Qual é a loja, a oficina ou o salão que você sempre volta?', S(chao, loja(14, 70, .7, C.b), loja(118, 70, .7, C.o), loja(222, 70, .7, C.v), E(53, 50, '🔧', 26), E(157, 50, '🛍️', 26), E(261, 50, '✂️', 26))],
    ['Na maioria das vezes, é aquele lugar onde você é bem recebido, onde alguém lembra de você e onde você sente que pode confiar.', S(chao, P(110, { c: C.b, s: C.p2 }), P(210, { c: C.g }), E(160, 70, '🤝', 34), cor(160, 30, 1.8))],
    ['O cliente que não volta quase nunca reclama. Ele simplesmente some.', S(chao, loja(30, 52), `<g opacity=".35">${P(220, { c: C.b, s: C.p3, t: 1 })}</g>`, seta(250, 120, 300, 120, C.cz, 1), B(180, 16, 70, '…', C.w))],
    ['Muitas vezes porque foi atendido com pressa, porque ninguém olhou para ele, ou porque saiu sem ter certeza de que o problema foi resolvido.', S(chao, balcao(150), P(225, { c: C.g }), E(244, 70, '📱', 22), P(80, { c: C.b, s: C.p2, t: 1 }), rel(270, 34, 18))],
    ['E o pior: ele conta essa experiência para os amigos.', S(chao, P(70, { c: C.b, s: C.p3, b: 1 }), P(200, { c: C.o, e: .85, y: 86 }), P(270, { c: C.v, s: C.p2, e: .85, y: 86 }), B(100, 16, 120, 'Não vão lá! 😠', C.r))],
    ['Já o cliente que sai satisfeito volta, compra de novo e indica a loja.', S(chao, P(90, { c: C.o, a: 1 }), E(140, 136, '🛍️', 30), est(200, 50, 1.4), est(232, 50, 1.4), est(264, 50, 1.4), B(180, 80, 120, 'Voltarei! 😍', C.g))],
    ['Por isso, conquistar um cliente novo dá muito mais trabalho do que manter quem já conhece a loja.', S(chao, `<path d="M60 120 L260 90" stroke="${C.n}" stroke-width="8" stroke-linecap="round"/><path d="M160 105 l-14 45 h28z" fill="${C.n}"/>`, placa(30, 70, 90, 'Novo', C.o), placa(210, 40, 90, 'Fiel', C.g), E(75, 66, '🏋️', 26))],
    ['E aqui está a parte boa: o atendimento depende de você.', S(chao, `<circle cx="160" cy="96" r="70" fill="${C.y}" opacity=".35"/>`, P(160, { c: C.g, tag: 'VOCÊ' }), est(110, 40, 1.4), est(214, 40, 1.4))],
    ['Não é preciso desconto nem promoção.', S(chao, `<g transform="translate(70 50)"><path d="M0 0 h110 l30 30 l-30 30 h-110z" fill="${C.r}"/>${T(60, 40, '50% OFF', 22, '#fff')}</g>`, risca(60, 110, 230, 40))],
    ['É preciso atenção, educação e cuidado com cada pessoa que entra pela porta ou chama no WhatsApp.', S(chao, `<rect x="30" y="40" width="70" height="110" rx="6" fill="${C.n}"/><circle cx="88" cy="96" r="4" fill="${C.y}"/>`, cor(160, 90, 2.4), cel(206, 18, [['Oi! Tem vaga?', 0], ['Tem sim 😊', 1]]))],
    ['Nas próximas lições, a gente vai ver como fazer isso no dia a dia.', S(chao, ...[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${30 + i * 36}" y="${136 - i * 14}" width="36" height="${14 + i * 14}" fill="${i % 2 ? C.g : C.g2}"/>${T(48 + i * 36, 150 - i * 14 + 0, i + 1, 11, '#fff')}`), E(286, 40, '🏁', 34))],
    ['Por hoje, guarde esta frase: cliente bem atendido volta. Cliente lembrado volta mais.', S(chao, E(90, 120, '🏆', 70), B(150, 30, 150, 'Lembrado volta!', C.g), cor(225, 110, 2))]
  ];
  L[2] = [
    ['Oi! Hoje a gente vai falar do momento mais importante do atendimento: o primeiro minuto.', S(chao, rel(90, 80, 48, ''), T(90, 86, '1:00', 18, C.g2), P(230, { c: C.g, a: 1 }))],
    ['Quando um cliente chega, ele decide muito rápido se está num lugar bom.', S(chao, `<rect x="40" y="40" width="70" height="110" rx="6" fill="${C.n}"/>`, P(170, { c: C.b, s: C.p2, p: 1 }), E(250, 60, '⚡', 40))],
    ['Antes de saber o preço, antes de ver o serviço, ele já percebeu se foi notado ou ignorado.', S(chao, P(90, { c: C.o }), `<g transform="translate(160 40)"><circle cx="0" cy="40" r="30" fill="#fff" stroke="${C.n}" stroke-width="4"/><circle cx="0" cy="40" r="12" fill="${C.n}"/><circle cx="4" cy="36" r="4" fill="#fff"/></g>`, T(250, 70, 'notado?', 16, C.g2), T(250, 100, 'ignorado?', 16, C.r))],
    ['Imagine a cena: o cliente entra, fica parado no balcão, e ninguém olha para ele. Todo mundo está ocupado.', S(chao, balcao(130, 180), P(190, { c: C.g, e: .9, y: 82 }), E(212, 76, '📱', 18), P(260, { c: C.v, s: C.p2, e: .9, y: 82 }), E(282, 76, '📞', 18), P(70, { c: C.b, s: C.p3, t: 1 }))],
    ['Dois minutos parecem dez.', S(chao, rel(110, 80, 46, ''), E(220, 110, '⏳', 70))],
    ['Mesmo que depois ele seja muito bem atendido, aquele começo já deixou uma marca.', S(chao, P(110, { c: C.b, s: C.p3, t: 1 }), `<path d="M200 40 q40 -10 60 20 q10 30 -30 50 q-40 10 -40 -30z" fill="${C.cz}" opacity=".6"/>`, T(232, 140, 'má impressão', 13, C.r))],
    ['Agora imagine o contrário: ele entra e alguém levanta o olhar, sorri e diz: bom dia, já vou te atender.', S(chao, balcao(150), P(225, { c: C.g, a: 1 }), P(80, { c: C.b, s: C.p3 }), B(150, 12, 150, 'Bom dia! Já vou', C.g, 1))],
    ['Pronto. Mesmo que precise esperar um pouco, ele se sente respeitado.', S(chao, `<rect x="40" y="110" width="80" height="12" rx="4" fill="${C.p3}"/><rect x="46" y="122" width="6" height="28" fill="${C.p3}"/><rect x="108" y="122" width="6" height="28" fill="${C.p3}"/>`, P(80, { c: C.o, y: 52 }), E(220, 110, '☕', 50), ok(270, 50, 20))],
    ['O primeiro minuto tem três partes simples.', S(chao, ...[0, 1, 2].map(i => `<circle cx="${70 + i * 90}" cy="90" r="34" fill="${[C.g, C.b, C.o][i]}"/>${T(70 + i * 90, 102, i + 1, 34, '#fff')}`))],
    ['Primeiro, perceba o cliente logo que ele chegar, mesmo que esteja ocupado: um olhar e um já te atendo já resolvem.', S(chao, `<circle cx="70" cy="90" r="22" fill="${C.g}"/>`, T(70, 98, '1', 22, '#fff'), P(170, { c: C.g }), E(170, 40, '👀', 30), P(260, { c: C.b, s: C.p2, e: .9, y: 82 }))],
    ['Segundo, cumprimente com educação: bom dia, boa tarde, seja bem-vindo.', S(chao, `<circle cx="50" cy="90" r="22" fill="${C.b}"/>`, T(50, 98, '2', 22, '#fff'), B(100, 14, 110, 'Bom dia!', C.w), B(110, 52, 120, 'Seja bem-vindo!', C.g), P(270, { c: C.o, a: 1 }))],
    ['Terceiro, dê atenção de verdade: largue o celular, olhe para a pessoa e escute.', S(chao, `<circle cx="50" cy="90" r="22" fill="${C.o}"/>`, T(50, 98, '3', 22, '#fff'), E(130, 110, '📵', 50), P(240, { c: C.g }), E(268, 46, '👂', 24))],
    ['Não é preciso texto decorado. É preciso atenção.', S(chao, `<rect x="40" y="40" width="100" height="110" rx="6" fill="#fff" stroke="${C.l}" stroke-width="2"/>`, ...[0, 1, 2, 3].map(i => `<rect x="54" y="${58 + i * 20}" width="72" height="6" rx="3" fill="${C.l}"/>`), risca(36, 150, 144, 40), cor(240, 90, 3))],
    ['Guarde esta frase: os primeiros sessenta segundos decidem a visita.', S(chao, T(110, 110, '60s', 60, C.g2), ok(250, 80, 34))]
  ];
  L[3] = [
    ['Oi! Hoje vamos falar de uma coisa pequena que faz uma diferença enorme: o nome do cliente.', S(chao, P(90, { c: C.b, s: C.p2, tag: 'ANA' }), B(140, 40, 150, 'O seu nome!', C.g), E(230, 130, '✨', 34))],
    ['Pense em quando alguém lembrou o seu nome num lugar onde você não esperava. Você se sentiu importante, não foi?', S(chao, P(110, { c: C.o, a: 1 }), E(230, 110, '😊', 60), est(200, 40, 1.2), est(260, 40, 1.2))],
    ['É isso que o cliente sente quando é chamado pelo nome. Chamar pelo nome mostra que ele não é só mais um.', S(chao, ...[0, 1, 2, 3].map(i => `<g opacity=".35">${P(40 + i * 40, { c: C.cz, e: .7, y: 92 })}</g>`), P(250, { c: C.g, tag: 'PEDRO' }), cor(250, 26, 1.4))],
    ['Mostra que a loja conhece e lembra dele. E cliente que se sente conhecido confia mais e volta mais.', S(chao, loja(30, 52), `<path d="M150 70 q30 -40 60 0" stroke="${C.g}" stroke-width="4" fill="none"/>`, P(250, { c: C.v, s: C.p3 }), cor(180, 40, 1.4))],
    ['Como fazer isso no dia a dia?', S(chao, cal(60, 40, 'SEMPRE', 'dia'), T(220, 110, '?', 70, C.o))],
    ['Primeiro, pergunte o nome logo no começo, com naturalidade: qual é o seu nome?', S(chao, P(80, { c: C.g }), B(110, 20, 140, 'Qual é o seu nome?', C.g), P(250, { c: C.b, s: C.p1 }))],
    ['Segundo, use o nome durante a conversa, sem exagero: duas ou três vezes já é suficiente.', S(chao, P(70, { c: C.g }), B(110, 14, 120, 'Certo, Carla!', C.w), B(130, 56, 130, 'Obrigado, Carla!', C.w), P(270, { c: C.v, s: C.p2 }), T(270, 30, '2x', 18, C.g2))],
    ['Terceiro, na próxima visita, tente lembrar: o nome, o carro, o último serviço, alguma coisa que ele contou.', S(chao, carro(20, 94, C.o), lista(170, 30, ['Rafael', 'Gol prata', 'Freios em maio', 'Vai viajar'], null))],
    ['E se esquecer? Tudo bem.', S(chao, P(110, { c: C.o, p: 1 }), T(150, 50, '?', 30, C.cz), ok(240, 90, 30))],
    ['É melhor perguntar de novo com um sorriso: me lembra o seu nome?', S(chao, P(80, { c: C.g }), B(110, 24, 160, 'Me lembra seu nome?', C.g), P(260, { c: C.b, s: C.p3 }), E(160, 120, '😊', 30))],
    ['Do que chamar de amigo ou chefe o tempo todo.', S(chao, B(40, 30, 100, '"Amigo"', C.w), B(180, 30, 100, '"Chefe"', C.w), risca(40, 40, 140, 60), risca(180, 40, 280, 60), P(160, { c: C.cz, t: 1 }))],
    ['O Cliente Assistido ajuda nisso: as mensagens já vão com o nome de cada cliente.', S(chao, cel(40, 14, [['Oi, Joana! 😊', 1], ['Oi, Paulo! 😊', 1], ['Oi, Lia! 😊', 1]]), `<rect x="200" y="60" width="70" height="70" rx="20" fill="${C.g}"/>`, T(235, 106, 'CA', 28, '#fff'))],
    ['Mas no balcão, quem lembra é você.', S(chao, balcao(100, 200), P(200, { c: C.g, tag: 'VOCÊ' }), E(240, 40, '💡', 34))],
    ['Guarde esta frase: o nome do cliente é a palavra mais bonita do atendimento.', S(chao, `<rect x="60" y="50" width="200" height="70" rx="14" fill="#fff" stroke="${C.g}" stroke-width="4"/>`, T(160, 96, 'NOME', 34, C.g2), est(60, 50, 1.6), est(260, 120, 1.6))]
  ];
  L[4] = [
    ['Oi! Hoje o assunto é ouvir. Parece simples, mas é onde muita venda se perde.', S(chao, E(90, 120, '👂', 70), E(220, 120, '🛒', 50), T(220, 50, '?', 30, C.r))],
    ['Sabe quando o cliente começa a falar e a gente já sabe o que vai oferecer? Às vezes acerta.', S(chao, P(80, { c: C.b, s: C.p2 }), B(96, 16, 76, 'Eu qu…', C.w), P(240, { c: C.g }), B(186, 16, 116, 'Já sei! Pneu!', C.o, 1))],
    ['Mas muitas vezes o cliente queria outra coisa, e sai achando que ninguém prestou atenção nele.', S(chao, P(240, { c: C.b, s: C.p2, t: 1 }), seta(270, 120, 310, 120, C.cz), E(90, 110, '🙉', 60))],
    ['Quem ouve bem vende melhor, porque entende o que o cliente realmente precisa.', S(chao, P(90, { c: C.g }), E(118, 72, '👂', 24), `<path d="M140 80 q14 10 0 20 M152 72 q22 18 0 36" stroke="${C.g}" stroke-width="4" fill="none" stroke-linecap="round"/>`, P(240, { c: C.o, s: C.p3 }), B(190, 16, 110, 'Preciso de…', C.w, 1))],
    ['E o cliente sente que foi tratado como pessoa, não como mais uma venda.', S(chao, P(110, { c: C.v, s: C.p1 }), cor(110, 26, 1.6), `<rect x="200" y="70" width="80" height="50" rx="6" fill="#fff" stroke="${C.l}" stroke-width="2"/>`, T(240, 102, 'R$', 18, C.cz), risca(196, 124, 284, 66))],
    ['Como ouvir de verdade?', S(chao, E(110, 120, '👂', 70), T(220, 110, '?', 70, C.o))],
    ['Primeiro, deixe o cliente terminar de falar, sem interromper.', S(chao, P(80, { c: C.b, s: C.p3 }), B(110, 16, 180, 'e aí o barulho começou…', C.w), P(260, { c: C.g }), E(262, 64, '🤐', 20))],
    ['Segundo, faça perguntas: desde quando isso acontece? Você usa o carro mais na cidade ou na estrada?', S(chao, P(60, { c: C.g }), B(92, 14, 130, 'Desde quando?', C.g), B(92, 54, 150, 'Cidade ou estrada?', C.g), P(272, { c: C.b, s: C.p3 }))],
    ['O que é mais importante pra você?', S(chao, P(90, { c: C.g }), E(180, 70, '💰', 34), E(230, 70, '⏱️', 34), E(280, 70, '🛡️', 34), T(230, 130, 'o que pesa mais?', 13))],
    ['Terceiro, repita com suas palavras o que entendeu: então o barulho aparece quando freia, certo?', S(chao, carro(30, 94, C.b), E(150, 60, '🔊', 30), B(170, 30, 140, 'Quando freia, certo?', C.g, 1))],
    ['Só depois disso, ofereça a solução. E ofereça o que faz sentido para ele.', S(chao, E(90, 120, '🔧', 60), ok(200, 80, 30), T(260, 90, 'solução', 14, C.g2))],
    ['Quando o cliente percebe que você indicou o que ele precisa, e não o mais caro, ele confia.', S(chao, placa(30, 50, 110, 'R$ 900', C.cz), risca(30, 90, 140, 46), placa(180, 90, 110, 'R$ 180 ✓', C.g))],
    ['E cliente que confia volta.', S(chao, E(100, 116, '🤝', 64), seta(170, 100, 260, 100, C.g), loja(250, 70, .55))],
    ['Guarde esta frase: quem pergunta bem, vende melhor.', S(chao, T(90, 110, '?', 90, C.o), seta(150, 96, 200, 96, C.n), E(250, 120, '📈', 60))]
  ];
  L[5] = [
    ['Oi! Hoje vamos falar de uma situação que todo mundo enfrenta: quando algo dá errado.', S(chao, E(110, 110, '⛈️', 70), P(240, { c: C.o, t: 1 }))],
    ['Um serviço atrasa. Uma peça não chega.', S(chao, rel(80, 76, 40, 'atrasou'), `<rect x="180" y="60" width="90" height="70" rx="6" fill="${C.y}" stroke="${C.p3}" stroke-width="3"/><path d="M180 80 h90" stroke="${C.p3}" stroke-width="3"/>`, T(225, 112, 'peça?', 14))],
    ['O cliente não gosta do resultado. Acontece em toda loja.', S(chao, P(100, { c: C.b, s: C.p3, b: 1 }), E(200, 80, '👎', 50), loja(230, 90, .5))],
    ['O que separa uma loja boa de uma ruim não é nunca errar: é como ela resolve quando erra.', S(chao, loja(30, 60, .8, C.cz), loja(200, 60, .8, C.g), T(75, 40, 'ignora', 13, C.r), T(245, 40, 'resolve', 13, C.g2), ok(290, 130, 16))],
    ['Um fato curioso: o cliente que tem um problema bem resolvido costuma ficar ainda mais fiel do que aquele que nunca teve problema nenhum.', S(chao, E(80, 110, '🔧', 50), seta(120, 96, 170, 96, C.n), cor(230, 100, 3.2))],
    ['Porque ele viu, na prática, que pode confiar em você.', S(chao, P(110, { c: C.b, s: C.p2 }), P(210, { c: C.g }), `<rect x="140" y="30" width="40" height="40" rx="10" fill="${C.y}"/>`, E(160, 62, '🔒', 26))],
    ['Quando o cliente chegar chateado, siga quatro passos.', S(chao, P(70, { c: C.b, s: C.p3, b: 1 }), lista(150, 36, ['Ouvir', 'Desculpar', 'Prometer', 'Cumprir'], 0))],
    ['Primeiro, ouça até o fim, sem interromper e sem se defender. Ele precisa desabafar.', S(chao, P(80, { c: C.b, s: C.p3, b: 1 }), B(110, 16, 160, '…e ninguém avisou!', C.w), P(260, { c: C.g }), E(290, 60, '👂', 22))],
    ['Segundo, peça desculpas pelo transtorno: sinto muito por isso, entendo a sua chateação.', S(chao, P(80, { c: C.b, s: C.p3, t: 1 }), P(240, { c: C.g }), B(150, 16, 150, 'Sinto muito!', C.g, 1), E(160, 130, '🙏', 30))],
    ['Pedir desculpas não é assumir culpa de tudo, é mostrar respeito.', S(chao, E(100, 120, '🙏', 60), T(220, 90, 'respeito', 24, C.g2), cor(220, 130, 1.6))],
    ['Terceiro, diga o que vai fazer e quando: vou ver com o mecânico agora e te dou um retorno até as quatro horas.', S(chao, rel(80, 76, 40, 'até 16h'), P(230, { c: C.g }), E(262, 120, '🔧', 26), B(150, 14, 150, 'Te retorno às 16h', C.g, 1))],
    ['Quarto, cumpra. E, se puder, dê o retorno antes do prometido.', S(chao, rel(80, 76, 40, '15h30'), ok(200, 80, 34), T(270, 90, 'antes!', 16, C.g2))],
    ['E o que não fazer? Não discutir, não culpar o colega, o fornecedor ou o próprio cliente.', S(chao, P(70, { c: C.g, b: 1 }), B(100, 20, 140, 'A culpa é dele!', C.r), nao(260, 80, 30))],
    ['E nunca deixar o cliente sem resposta.', S(chao, cel(40, 14, [['Alguma notícia?', 0], ['???', 0]]), E(220, 100, '🦗', 50), nao(280, 40, 16))],
    ['Guarde esta frase: reclamação bem resolvida vira fidelidade.', S(chao, E(70, 110, '⛈️', 50), seta(120, 96, 170, 96, C.n), E(220, 110, '☀️', 50), cor(280, 100, 1.8))]
  ];
  L[6] = [
    ['Oi! Hoje a gente vai falar do balcão que fica no bolso de todo cliente: o WhatsApp.', S(chao, P(90, { c: C.o }), cel(170, 14, [['Oi! 👋', 0], ['Olá! Em que', 1], ['posso ajudar?', 1]]))],
    ['Hoje, muito cliente chega primeiro pelo WhatsApp. Ele pergunta preço, horário, se tem vaga.', S(chao, cel(30, 14, [['Quanto custa?', 0], ['Que horas abre?', 0], ['Tem vaga hoje?', 0]]), E(220, 110, '💬', 60))],
    ['E a forma como você responde é a primeira impressão da loja, igualzinho ao primeiro minuto no balcão.', S(chao, cel(20, 14, [['Bom dia! 😊', 1]]), T(160, 100, '=', 40), balcao(190, 110), P(245, { c: C.g, a: 1 }))],
    ['Três coisas fazem toda a diferença.', S(chao, ...[['⚡', C.o], ['💚', C.g], ['🎯', C.b]].map((e, i) => `<circle cx="${70 + i * 90}" cy="90" r="36" fill="${e[1]}" opacity=".2"/>${E(70 + i * 90, 106, e[0], 40)}`))],
    ['A primeira é rapidez. Cliente que espera horas por uma resposta procura outra loja.', S(chao, rel(70, 76, 38, '3 horas'), P(180, { c: C.b, s: C.p2, b: 1 }), seta(210, 110, 250, 110, C.cz), loja(250, 90, .5, C.v))],
    ['Se não dá para resolver na hora, responda pelo menos: oi, João! Já vou verificar e te retorno em instantes.', S(chao, cel(30, 14, [['Tem a peça?', 0], ['Oi, João! Já', 1], ['verifico! 😊', 1]]), rel(240, 76, 34, '1 min'))],
    ['A segunda é gentileza por escrito. Cumprimente, use o nome, agradeça.', S(chao, cel(110, 14, [['Bom dia, Ana!', 1], ['Obrigado! 💚', 1], ['Volte sempre!', 1]]), cor(60, 80, 2), est(270, 80, 2))],
    ['Evite gíria, palavrão e mensagem atravessada.', S(chao, B(30, 30, 110, 'blz, vlw', C.w), B(30, 80, 110, '#@$%!', C.w), risca(30, 40, 140, 110), B(180, 54, 120, 'Combinado!', C.g))],
    ['No texto, o tom de voz não aparece, então seja ainda mais educado do que seria pessoalmente.', S(chao, E(90, 120, '🔇', 56), seta(140, 96, 190, 96, C.n), E(250, 120, '😊', 56))],
    ['A terceira é clareza. Mensagens curtas e diretas.', S(chao, `<rect x="30" y="30" width="120" height="110" rx="8" fill="#EEF1F0"/>`, ...[0, 1, 2, 3, 4, 5].map(i => `<rect x="40" y="${42 + i * 16}" width="100" height="6" rx="3" fill="${C.cz}"/>`), risca(26, 140, 154, 30), B(180, 70, 120, 'Amanhã às 9h?', C.g))],
    ['Prefira texto a áudio longo: muita gente não pode ouvir áudio na hora.', S(chao, cel(30, 14, [['▶ ━━━━ 4:35', 0]]), risca(30, 30, 126, 160), cel(190, 14, [['Fica pronto 10h', 1]]))],
    ['E sempre termine dizendo o próximo passo: posso agendar para amanhã às nove?', S(chao, cel(30, 14, [['Posso agendar', 1], ['amanhã às 9h?', 1], ['Pode! 👍', 0]]), cal(200, 40, 'AMANHÃ', '9h'))],
    ['E um cuidado importante: se o cliente pedir para não receber mensagens, respeite.', S(chao, cel(30, 14, [['Prefiro não', 0], ['receber, ok?', 0], ['Claro! 😊', 1]]), E(230, 110, '🤚', 56))],
    ['Relacionamento é confiança, não insistência.', S(chao, E(90, 116, '🤝', 64), placa(170, 60, 130, 'confiança', C.g), placa(170, 104, 130, 'insistência', C.cz), risca(170, 122, 300, 116))],
    ['Guarde esta frase: resposta rápida mostra que você se importa.', S(chao, E(90, 116, '⚡', 64), seta(140, 96, 190, 96, C.n), cor(240, 100, 3))]
  ];
  L[7] = [
    ['Oi! Chegamos à última lição da trilha.', S(chao, ...[0, 1, 2, 3, 4, 5].map(i => ok(40 + i * 40, 100, 14)), `<circle cx="280" cy="100" r="18" fill="${C.o}"/>`, T(280, 106, '7', 16, '#fff'))],
    ['E ela fala do momento que quase todo mundo esquece: depois que o cliente vai embora.', S(chao, loja(20, 52), P(200, { c: C.b, s: C.p2 }), seta(230, 120, 300, 120, C.cz, 1))],
    ['A maioria das lojas atende bem, recebe o pagamento e pronto.', S(chao, E(90, 110, '💳', 56), ok(170, 90, 22), T(250, 100, 'e pronto?', 16, C.cz))],
    ['Só volta a falar com o cliente quando ele aparece de novo, se aparecer.', S(chao, cal(40, 44, 'MESES', '?'), T(200, 70, '…', 40, C.cz), `<g opacity=".35">${P(260, { c: C.cz })}</g>`)],
    ['Só que, nesse meio-tempo, outras lojas estão lembrando dele.', S(chao, loja(20, 70, .65, C.o), loja(110, 70, .65, C.v), P(260, { c: C.b, s: C.p2 }), B(150, 14, 140, 'Promoção! 📣', C.o, 1))],
    ['O relacionamento continua depois da venda.', S(chao, E(70, 116, '🛍️', 50), `<path d="M110 100 q60 -60 120 0 q-60 60 -120 0" stroke="${C.g}" stroke-width="4" fill="none" stroke-dasharray="8 6"/>`, cor(270, 100, 2))],
    ['Um "como ficou?" uma semana depois do serviço mostra que você se importa com o resultado, não só com a venda.', S(chao, carro(20, 94, C.g), cel(190, 14, [['Como ficou?', 1], ['Ficou ótimo! ⭐', 0]]))],
    ['Um parabéns no dia do aniversário é lembrado por muito tempo.', S(chao, E(90, 120, '🎂', 70), `<g transform="translate(190 30)"><rect width="90" height="96" rx="10" fill="#fff" stroke="${C.l}" stroke-width="2"/><rect width="90" height="26" rx="10" fill="${C.r}"/>${T(45, 18, 'MARÇO', 12, '#fff')}${T(45, 72, '15', 34)}</g>`)],
    ['E um aviso na hora certa, como: a troca de óleo do seu carro está chegando, faz o cliente voltar sem precisar de promoção.', S(chao, E(70, 116, '🛢️', 50), cel(120, 14, [['Sua troca de', 1], ['óleo está', 1], ['chegando! 🚗', 1]]), ok(270, 80, 22))],
    ['É exatamente para isso que a loja usa o Cliente Assistido: para ninguém ficar esquecido.', S(chao, `<rect x="40" y="40" width="90" height="90" rx="24" fill="${C.g}"/>`, T(85, 98, 'CA', 34, '#fff'), ...[0, 1, 2].map(i => P(180 + i * 50, { c: [C.b, C.o, C.v][i], s: [C.p1, C.p2, C.p3][i], e: .75, y: 92 })))],
    ['O app mostra todo dia para quem mandar mensagem, já com o texto pronto e o nome do cliente.', S(chao, cel(30, 14, [['Hoje: 5 clientes', 1], ['Oi, Bia! 😊', 1], ['Oi, Caio! 😊', 1]]), E(230, 110, '📋', 56))],
    ['Você só confere e envia, sempre com uma pessoa por trás, nunca um robô.', S(chao, P(80, { c: C.g, a: 1 }), ok(80, 30, 14), E(230, 110, '🤖', 56), nao(270, 50, 16))],
    ['E quando o cliente responder, responda rápido e com carinho, como vimos na lição anterior.', S(chao, cel(30, 14, [['Obrigada! 😍', 0], ['Nós que', 1], ['agradecemos 💚', 1]]), E(230, 110, '⚡', 50))],
    ['Se ele mostrar interesse em comprar, avise o responsável na hora.', S(chao, cel(20, 14, [['Quero agendar', 0], ['a revisão!', 0]]), seta(130, 90, 180, 90, C.o), P(240, { c: C.n, s: C.p2, tag: 'DONO' }), E(282, 44, '🔔', 24))],
    ['Você chegou ao fim da trilha.', S(chao, E(160, 120, '🎓', 80), est(70, 50, 1.6), est(250, 50, 1.6))],
    ['Agora junte tudo: receba bem, chame pelo nome, ouça, resolva os problemas com cuidado, responda rápido e lembre o cliente depois.', S(chao, ...['👋', '🏷️', '👂', '🛠️', '⚡', '💚'].map((e, i) => `<circle cx="${40 + i * 48}" cy="90" r="22" fill="#fff" stroke="${C.l}" stroke-width="2"/>${E(40 + i * 48, 100, e, 24)}`))],
    ['Porque quem é lembrado, vende mais.', S(chao, `<rect x="30" y="40" width="260" height="90" rx="16" fill="${C.g}"/>`, T(160, 80, 'Quem é lembrado,', 20, '#fff'), T(160, 108, 'vende mais! 💚', 20, '#fff'))]
  ];
  // ---------- 1.28.0: números de pesquisas na fala (fontes no quadro "O que dizem as pesquisas" de cada lição) ----------
  const ins = (n, depois, itens) => L[n].splice(depois + 1, 0, ...itens);
  ins(1, 7, [['Isso não é impressão. Uma pesquisa da Hibou, com mais de 2 mil brasileiros, mostrou que 54% trocam de marca quando o atendimento não agrada. E 46% contam a experiência ruim para amigos e colegas.',
    pesq({ v: 54, n: '54%', l: ['trocam de marca', 'quando o atendimento', 'não agrada'], f: 'Hibou · 2023', ic: '🔄', c: C.r })]]);
  ins(2, 5, [['E basta uma vez. Uma pesquisa da PwC mostrou que, na América Latina, 49% dos consumidores deixam de comprar de uma marca de que gostam depois de uma única experiência ruim.',
    pesq({ v: 49, n: '49%', l: ['largam a marca', 'depois de UMA', 'experiência ruim'], f: 'PwC · América Latina', ic: '🚪', c: C.o })]]);
  ins(3, 3, [['Os números confirmam. Numa pesquisa da Epsilon com mil consumidores, 80% disseram que têm mais chance de comprar de quem oferece um atendimento personalizado. E chamar pelo nome é o primeiro passo disso.',
    pesq({ v: 80, n: '80%', l: ['compram mais', 'de quem personaliza', 'o atendimento'], f: 'Epsilon · 2018', ic: '🏷️', c: C.b })]]);
  ins(4, 4, [['E o cliente valoriza isso. Na pesquisa Atendimento ao Cliente 2025, da Hibou, com quase 2 mil brasileiros, 61% disseram que pagariam mais por um atendimento que conhece bem o produto.',
    pesq({ v: 61, n: '61%', l: ['pagariam mais', 'por quem conhece', 'bem o produto'], f: 'Hibou · 2025', ic: '👂', c: C.v })]]);
  ins(5, 5, [['E isso faz diferença, porque problema acontece muito. Uma pesquisa americana de 2023 mostrou que 74% dos consumidores tiveram algum problema com produto ou serviço no último ano. Mas só 39% ficaram satisfeitos com a solução. Quem resolve bem, se destaca.',
    pesq({ v: 39, n: '39%', l: ['só estes saíram', 'satisfeitos com', 'a solução'], f: 'Customer Rage · 2023', ic: '🛠️', c: C.o })]]);
  ins(6, 1, [['Na pesquisa CX Trends 2024, da Octadesk com a Opinion Box, o WhatsApp foi o canal mais usado pelos brasileiros para falar com a empresa depois da compra: 54% dos consumidores.',
    pesq({ v: 54, n: '54%', l: ['usam o WhatsApp', 'para falar com a loja', 'depois da compra'], f: 'Octadesk · 2024', ic: '💬', c: C.g })]]);
  ins(7, 7, [['E isso funciona. Um estudo da Experian mostrou que as mensagens de aniversário geram 481% mais compras do que uma promoção comum.',
    pesq({ n: '+481%', l: ['mais compras', 'com a mensagem', 'de aniversário'], f: 'Experian', ic: '🎂', c: C.o })]]);

  window.CA_ILUS = {
    falas: n => (L[n] || []).map(([t, svg]) => ({ t, svg })),
    roteiro: n => (L[n] || []).map(x => x[0]).join(' ')
  };
})();
