/* Cliente Assistido – Treinamento para donos de loja (/treinamento-loja/dono-da-loja), versão 1.40.0 (1.40.1: sem a seção Faça a sua conta).
   Página pública, sem login: um resumo de poucos minutos para convencer o dono da loja de que treinar a equipe
   sai mais barato do que perder clientes e vendas. Blocos: Ouça (ilustrações + voz + legenda), números com fonte,
   vídeo do YouTube (trecho), diálogo de sucesso em duas vozes, Leia (texto persuasivo; a conta do cliente perdido saiu na 1.40.1)
   e botões de contato pelo WhatsApp. Voz, vídeo e diálogo nunca tocam juntos (travas()).
   Quando o Marcos gravar o áudio, coloque o arquivo em D.audio (ex.: '/treinamento-loja/dono-da-loja/audio.mp3'):
   a legenda e as ilustrações seguem o tempo do áudio. */
'use strict';
(function () {
  const D = {
    audio: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/dono/echo/pagina-v3.mp3', // 1.89.10: voz masculina echo, narração neutra (OpenAI gpt-4o-mini-tts), escolhida pelo Marcos; texto mudou = gerar de novo (pagina-v2)
    contato: { whatsapp: '5561999999340', nome: 'Marcos Nascimento' },
    video: { id: 'yxNY2apEiQo', ini: 562, fim: 621, titulo: 'Treinar a sua equipe não custa caro', quem: 'Cláudio Schneider', fonte: 'canal Cláudio Schneider, Liderança e Comunicação, no YouTube',
      resumo: 'Equipe treinada trabalha melhor, o cliente sai satisfeito, compra mais e as vendas sobem: um ciclo virtuoso. Trecho de 1 minuto.' },
    // Narração: cada trecho troca a ilustração (cena) e a legenda.
    falas: [
      { c: 0, t: 'Olá, seja bem-vindo ao treinamento Cliente Encantado.' }, // 1.89.10: narração neutra, sem nome, pedido do Marcos
      { c: 0, t: 'Você, dono de loja, trabalha duro para fazer o cliente entrar pela porta: vitrine, anúncio, preço, indicação. Cada cliente que entra custou dinheiro e esforço.' },
      { c: 1, t: 'Agora imagine esse cliente sendo recebido por um funcionário que não tira os olhos do celular, não sabe explicar o produto e nem pergunta o nome dele.' },
      { c: 2, t: 'Ele não reclama. Ele simplesmente vai embora, e não volta. Oito em cada dez brasileiros já desistiram de uma compra por causa de um atendimento ruim.' },
      { c: 3, t: 'E ele não leva só uma venda. Leva todas as próximas. Um cliente que gasta 150 reais por mês vale 1.800 reais por ano para a sua loja. Perder dez clientes assim é deixar de faturar 18 mil reais por ano.' },
      { c: 4, t: 'E tem mais: quase metade das pessoas conta a experiência ruim para amigos e colegas. Um atendimento mal feito afasta quem ainda nem entrou na sua loja.' },
      { c: 5, t: 'Conquistar um cliente novo custa de cinco a vinte e cinco vezes mais do que manter quem já compra com você. Por isso, o atendimento ruim é a despesa mais cara da loja, e ela nunca aparece no caixa.' },
      { c: 6, t: 'Agora veja a outra cena. Um funcionário treinado recebe na hora, chama pelo nome, ouve antes de oferecer, resolve quando algo dá errado e lembra do cliente depois da compra.' },
      { c: 7, t: 'Esse cliente volta, compra de novo e indica. Noventa e sete por cento dos brasileiros dizem que o atendimento é decisivo, e pela primeira vez ele pesou mais do que o preço.' },
      { c: 8, t: 'É isso que o curso Cliente Encantado ensina: atendimento que faz o cliente voltar. São sete lições curtas no celular, com áudio, vídeo, exemplos do seu ramo e certificado. O funcionário aprende no intervalo, sem parar a loja, e tem um tutor com inteligência artificial que tira as dúvidas dele na hora. E você acompanha o progresso de cada um.' },
      { c: 10, t: 'E se o funcionário ficar com dúvida, ele não precisa esperar ninguém. No fim de cada lição, ele escreve a pergunta e o tutor com inteligência artificial responde na hora, com um exemplo do seu ramo. A equipe do Cliente Assistido confere as respostas, e você vê tudo o que a sua equipe perguntou.' },
      { c: 9, t: 'A conta é simples: treinar a equipe custa menos do que perder clientes e vendas. Fale com a gente e libere o treinamento para a sua equipe.' }
    ],
    numeros: [
      { n: '80%', t: 'dos brasileiros já desistiram de uma compra por causa do atendimento', f: 'Neogrid e Opinion Box, 2025', u: 'https://timesbrasil.com.br/empresas-e-negocios/servicos-e-varejo/atendimento-ruim-faz-80-dos-consumidores-desistirem-da-compra-mostra-pesquisa/' },
      { n: '5 a 25x', t: 'mais caro conquistar um cliente novo do que manter quem já compra', f: 'Harvard Business Review, 2014', u: 'https://hbr.org/2014/10/the-value-of-keeping-the-right-customers' },
      { n: '97%', t: 'dizem que o atendimento é decisivo; em 2025 pesou mais que o preço', f: 'Hibou, Atendimento ao Cliente 2025', u: 'https://canaltech.com.br/mercado/atendimento-pesa-mais-que-preco-na-hora-da-compra-em-2025-aponta-pesquisa/' }
    ],
    dialogo: { // 1.90.0: dois vendedores lembrando de um cliente que se perdeu, pedido do Marcos (gatilhos: dor, objeções, reciprocidade; sem culpa)
      titulo: 'Uma conversa que acontece em muitas lojas',
      sub: 'Ouça a Ana e o Beto, dois vendedores, no fim do expediente. Depois, um recado para você, dono.',
      pessoas: { a: { nome: 'Ana', papel: 'vendedora' }, c: { nome: 'Beto', papel: 'vendedor' } },
      falas: [
        ['a', 'Beto, lembra do Seu José? Aquele senhor que vinha todo mês comprar tênis para caminhar?', '👴'],
        ['c', 'Lembro sim. Faz tempo que ele não aparece, né?', '🤔'],
        ['a', 'Três meses. Hoje eu vi ele passando aqui na frente, com uma sacola da loja da esquina.', '🛍️'],
        ['c', 'Sério? Ele era dos mais fiéis. O que será que aconteceu?', '😮'],
        ['a', 'Acho que eu sei. Da última vez, ele ficou quase dez minutos esperando no balcão. A gente estava arrumando o estoque e ninguém foi atender.', '⏳'],
        ['c', 'É verdade. E quando eu fui, estava no celular. Só perguntei: o que o senhor quer?', '📱'],
        ['a', 'E o tênis que ele pediu tinha acabado. A gente disse que não tinha e pronto. Ninguém mostrou outro, ninguém anotou o telefone para avisar quando chegasse.', '🚫'],
        ['c', 'Ele saiu quieto. Nem reclamou.', '🚪'],
        ['a', 'Pois é, Beto. Cliente não reclama. Ele só não volta. E a esposa dele, que também comprava aqui, sumiu junto.', '💔'],
        ['a', 'Eu queria aprender a fazer diferente. Ninguém aqui quer perder cliente.', '🌱']
      ],
      chamada: 'Agora, um recado para você, dono da loja.',
      rotulo: '💭 Para você, dono, pensar:',
      rende: [
        'Ninguém nessa conversa agiu por mal. A Ana e o Beto gostam da loja. Só nunca aprenderam o que fazer nesses momentos.',
        'O Seu José não reclamou, não deu nota e não avisou. Foi comprar no vizinho e levou a esposa junto. E você nem ficou sabendo.',
        'Quantos clientes como ele passaram pela sua loja este mês e não voltaram?',
        'A sua equipe quer acertar. Quando você investe nela, ela devolve em cuidado com cada cliente que entra.',
        'E não precisa parar a loja: são lições curtas no celular, que o funcionário faz no intervalo.'
      ],
      // 1.90.2: vozes gravadas (OpenAI gpt-4o-mini-tts): Ana = marin, Beto = cedar, narrador = echo (a mesma da página).
      // Arquivo = <base><q>-<hash do texto>.mp3; texto mudou = arquivo não existe = o diálogo volta para as vozes do celular.
      audio: { base: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/dono/dlg/' },
      fecho: 'Isso não precisa continuar acontecendo. Investir no treinamento da sua equipe custa muito menos do que perder o próximo Seu José.'
    },
    licoesIco: ['🔁', '👋', '🏷️', '👂', '🛠️', '💬', '🤝'],
    licoes: ['Por que o cliente volta (ou não)', 'O primeiro minuto', 'Chamar pelo nome', 'Ouvir antes de oferecer', 'Quando algo dá errado', 'Atendimento pelo WhatsApp', 'Depois da compra'],
    fontes: [
      ['Neogrid e Opinion Box, Consumo e Fidelização no Brasil, 2025', 'https://timesbrasil.com.br/empresas-e-negocios/servicos-e-varejo/atendimento-ruim-faz-80-dos-consumidores-desistirem-da-compra-mostra-pesquisa/'],
      ['Hibou, pesquisa de atendimento, out/2023 (46% contam a experiência ruim)', 'https://diariodocomercio.com.br/?p=357091'],
      ['Amy Gallo, “The Value of Keeping the Right Customers”, Harvard Business Review, 2014', 'https://hbr.org/2014/10/the-value-of-keeping-the-right-customers'],
      ['Hibou, Atendimento ao Cliente 2025', 'https://canaltech.com.br/mercado/atendimento-pesa-mais-que-preco-na-hora-da-compra-em-2025-aponta-pesquisa/']
    ]
  };

  // 1.91.0: versão com FOTOS de pessoas (fotos.html põe window.CA_DONO_FOTOS = true), pedido do Marcos para comparar com a ilustrada.
  // Fotos livres do Pexels copiadas para o Storage (curso-audio/fotos/dono/). Cenas sem foto continuam com o desenho.
  const FT = window.CA_DONO_FOTOS ? { base: 'https://kxwwbqjleskxzfbmybvb.supabase.co/storage/v1/object/public/curso-audio/fotos/dono/',
    cena: { 0: 'dono', 2: 'embora', 6: 'atende', 7: 'volta', 8: 'curso' } } : null;
  const foto = (n, cls) => FT ? `<img class="${cls}" src="${FT.base}${n}.webp" alt="" loading="lazy" decoding="async">` : '';
  const $ = s => document.querySelector(s), app = document.getElementById('app');
  const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const temVoz = 'speechSynthesis' in window;
  const brl = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  const zap = msg => `https://wa.me/${D.contato.whatsapp}?text=${encodeURIComponent(msg)}`;

  /* ---------- Ilustrações (desenhos próprios em SVG) ---------- */
  const C = { g: '#12B76A', g2: '#0A8F52', n: '#0B2545', o: '#FF8A00', r: '#E5484D', b: '#2f6fb3', bg: '#F3F8F5', l: '#DDE7E2', p1: '#f2c9a5', p2: '#d9a77f', p3: '#a8734f', y: '#FFC93C' };
  const F = 'font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif"';
  const EMO = 'font-family="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif"';
  const T = (x, y, s, o) => { o = o || {}; return `<text x="${x}" y="${y}" ${F} font-size="${o.s || 12}" font-weight="${o.w || 700}" fill="${o.c || C.n}" text-anchor="${o.a || 'middle'}">${esc(s)}</text>`; };
  const E = (x, y, e, s) => `<text x="${x}" y="${y}" ${EMO} font-size="${s || 22}" text-anchor="middle">${e}</text>`;
  function pes(x, y, o) { // bonequinho: o.roupa, o.pele, o.cab, o.h humor ('f' feliz, 't' triste, 's' sério), o.cel celular, o.cracha, o.acena, o.e escala
    o = o || {}; const e = o.e || 1, pele = o.pele || C.p1, roupa = o.roupa || C.b, cab = o.cab || '#4a2c1d';
    const olhoY = o.cel ? 19 : 16;
    const boca = o.h === 't' ? '<path d="M-6 29 q6 -5 12 0" stroke="#5a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
      : o.h === 's' ? '<path d="M-5 27 h10" stroke="#5a2a2a" stroke-width="2.2" stroke-linecap="round"/>'
      : '<path d="M-7 25 q7 7 14 0" stroke="#5a2a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    return `<g transform="translate(${x} ${y}) scale(${e})">
      <ellipse cx="0" cy="66" rx="25" ry="30" fill="${roupa}"/>
      ${o.acena ? `<path d="M20 52 q14 -10 16 -30" stroke="${roupa}" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="36" cy="20" r="6" fill="${pele}"/>` : ''}
      ${o.cracha ? '<rect x="6" y="54" width="14" height="8" rx="2" fill="#fff"/>' : ''}
      <circle cx="0" cy="18" r="17" fill="${pele}"/>
      <path d="M-17 15 q2 -18 17 -18 q15 0 17 18 q-8 -9 -17 -9 q-9 0 -17 9z" fill="${cab}"/>
      <circle cx="-6" cy="${olhoY}" r="2.2" fill="#2b1a10"/><circle cx="6" cy="${olhoY}" r="2.2" fill="#2b1a10"/>
      ${o.cel ? '' : boca}
      ${o.cel ? `<rect x="-9" y="34" width="18" height="26" rx="3" fill="#1d2a3a"/><rect x="-7" y="37" width="14" height="19" rx="1.5" fill="#6fb6ff"/><circle cx="-10" cy="44" r="5" fill="${pele}"/><circle cx="10" cy="44" r="5" fill="${pele}"/>` : ''}
    </g>`;
  }
  const fundo = (cor) => `<rect width="320" height="200" fill="${cor || C.bg}"/><rect y="168" width="320" height="32" fill="#dcebe2"/>`;
  const balcao = (x, w) => `<rect x="${x}" y="128" width="${w}" height="44" rx="5" fill="#8a5a3b"/><rect x="${x}" y="124" width="${w}" height="9" rx="4" fill="#a8734f"/>`;
  const loja = (x) => `<g transform="translate(${x} 0)"><rect x="0" y="44" width="130" height="126" fill="#fff" stroke="${C.l}" stroke-width="2"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M${i * 26} 44 h26 l-4 18 h-18z" fill="${i % 2 ? '#fff' : C.g2}"/>`).join('')}
      <rect x="10" y="26" width="110" height="18" rx="4" fill="${C.n}"/>${T(65, 39, 'SUA LOJA', { s: 11, c: '#fff' })}
      <rect x="44" y="92" width="42" height="76" rx="3" fill="#cfe7da" stroke="${C.g2}" stroke-width="2"/><circle cx="78" cy="132" r="2.5" fill="${C.g2}"/>
      <rect x="8" y="80" width="28" height="34" rx="3" fill="#e9f4ff"/><rect x="94" y="80" width="28" height="34" rx="3" fill="#e9f4ff"/></g>`;
  const CENAS = [
    () => fundo() + loja(170) + pes(146, 82, { roupa: C.b, pele: C.p2, cab: '#9aa0a6', h: 'f' }) +
      E(40, 48, '📣') + E(76, 34, '🏷️') + E(40, 92, '💰') + `<path d="M58 60 q20 10 34 22" stroke="${C.o}" stroke-width="2" stroke-dasharray="4 4" fill="none"/>` +
      T(8, 138, 'Cada cliente que entra', { s: 11, c: C.n, a: 'start' }) + T(8, 153, 'custou caro para chegar', { s: 11, c: C.o, a: 'start' }),
    () => fundo('#f4f1ec') + pes(96, 52, { roupa: C.g2, cel: true, cracha: true }) + balcao(40, 130) +
      pes(238, 72, { roupa: C.b, pele: C.p2, cab: '#9aa0a6', h: 's' }) +
      `<rect x="196" y="24" width="64" height="30" rx="14" fill="#fff" stroke="${C.l}" stroke-width="2"/>` + T(228, 45, '...', { s: 20, c: C.n }) + E(286, 40, '⏱️', 22),
    () => fundo('#fbefef') + `<rect x="236" y="56" width="62" height="112" rx="3" fill="#cfe7da" stroke="${C.g2}" stroke-width="2"/>` +
      pes(198, 74, { roupa: C.b, pele: C.p2, cab: '#9aa0a6', h: 't' }) + `<path d="M224 118 h30 m-8 -7 l8 7 -8 7" stroke="${C.r}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      T(84, 82, '80%', { s: 46, c: C.r, w: 800 }) + T(84, 106, 'já desistiram de uma', { s: 12 }) + T(84, 122, 'compra por causa', { s: 12 }) + T(84, 138, 'do atendimento', { s: 12 }),
    () => fundo('#fff8ef') + `<rect x="24" y="26" width="272" height="60" rx="12" fill="#fff" stroke="${C.l}" stroke-width="2"/>` +
      E(52, 66, '🙂', 26) + T(150, 52, '1 cliente: R$ 150 por mês', { s: 13 }) + T(150, 72, '= R$ 1.800 por ano', { s: 15, c: C.g2, w: 800 }) +
      `<rect x="24" y="100" width="272" height="64" rx="12" fill="#fdecec" stroke="#f3b3b3" stroke-width="2"/>` +
      E(52, 142, '🚪', 26) + T(156, 126, '10 clientes que não voltam', { s: 13 }) + T(156, 150, '= R$ 18.000 por ano', { s: 18, c: C.r, w: 800 }),
    () => fundo('#f3f0fb') + pes(160, 70, { roupa: C.b, pele: C.p2, cab: '#9aa0a6', h: 't' }) +
      pes(52, 96, { roupa: '#8B5CF6', h: 's', e: .7, cab: '#2b1a10' }) + pes(268, 96, { roupa: C.o, h: 's', e: .7, pele: C.p3, cab: '#2b1a10' }) + pes(100, 118, { roupa: C.g2, h: 's', e: .55, cab: '#c27a3a' }) +
      E(100, 66, '💬', 24) + E(124, 52, '👎', 16) + E(220, 66, '💬', 24) + E(196, 52, '👎', 16) +
      E(160, 30, '😠', 22) + T(268, 182, '46% contam', { s: 12, c: C.r }),
    () => fundo('#eef4fb') + `<path d="M160 40 v110" stroke="${C.n}" stroke-width="5"/><path d="M130 160 h60" stroke="${C.n}" stroke-width="7" stroke-linecap="round"/>` +
      `<g transform="rotate(-14 160 52)"><path d="M60 52 h200" stroke="${C.n}" stroke-width="4"/>` +
      `<path d="M74 52 l-20 44 h52z" fill="none" stroke="${C.n}" stroke-width="2"/><path d="M246 52 l-20 44 h52z" fill="none" stroke="${C.n}" stroke-width="2"/></g>` +
      `<rect x="14" y="104" width="128" height="52" rx="8" fill="#fdecec" stroke="${C.r}" stroke-width="2"/>` + T(78, 124, 'Cliente novo', { s: 12 }) + T(78, 144, '5 a 25x mais caro', { s: 12, c: C.r, w: 800 }) +
      `<rect x="196" y="56" width="104" height="52" rx="8" fill="#e3f5ea" stroke="${C.g2}" stroke-width="2"/>` + T(248, 76, 'Manter quem', { s: 12 }) + T(248, 94, 'já compra', { s: 12, c: C.g2, w: 800 }),
    () => fundo() + pes(92, 52, { roupa: C.g2, cracha: true, acena: true, h: 'f' }) + balcao(36, 124) + pes(236, 72, { roupa: C.b, pele: C.p2, cab: '#9aa0a6', h: 'f' }) +
      [['✓ Nome', 170, 26], ['✓ Ouvir', 252, 26], ['✓ Resolver', 170, 52], ['✓ Lembrar', 252, 52]].map(([s, x, y]) => `<rect x="${x - 36}" y="${y - 14}" width="72" height="20" rx="10" fill="#e3f5ea" stroke="${C.g2}"/>` + T(x, y + 1, s, { s: 11, c: C.g2 })).join(''),
    () => fundo('#eef8f2') + loja(186) + pes(150, 80, { roupa: C.b, pele: C.p2, cab: '#9aa0a6', h: 'f' }) + pes(112, 90, { roupa: '#d94f8a', h: 'f', e: .9, cab: '#c9c9c9' }) + E(132, 40, '❤️', 22) +
      `<g transform="translate(16 92)"><rect x="0" y="40" width="12" height="24" fill="${C.g}"/><rect x="18" y="28" width="12" height="36" fill="${C.g}"/><rect x="36" y="12" width="12" height="52" fill="${C.g2}"/><path d="M2 30 l20 -12 l16 6 l20 -20" stroke="${C.o}" stroke-width="3" fill="none"/></g>` +
      T(42, 182, '97% decidem', { s: 11, c: C.g2 }) + T(42, 194, 'pelo atendimento', { s: 9, c: C.n, w: 600 }),
    () => fundo('#fff8ef') + `<rect x="110" y="12" width="104" height="176" rx="16" fill="${C.n}"/><rect x="117" y="24" width="90" height="152" rx="8" fill="#fff"/>` +
      `<rect x="117" y="24" width="90" height="26" rx="8" fill="${C.o}"/>` + T(162, 41, '🎓 Curso', { s: 11, c: '#1b1206' }) +
      [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="129" cy="${62 + i * 16}" r="5" fill="${i < 4 ? C.g2 : C.l}"/><rect x="138" y="${59 + i * 16}" width="${56 - (i % 3) * 8}" height="6" rx="3" fill="#cfd8d4"/>`).join('') +
      pes(58, 74, { roupa: C.g2, cracha: true, h: 'f' }) + E(266, 66, '📜', 34) + T(266, 96, 'Certificado', { s: 11 }) + E(266, 140, '📊', 28) + T(266, 166, 'Você acompanha', { s: 10 }),
    () => fundo('#eef8f2') + `<rect x="20" y="30" width="126" height="132" rx="14" fill="#e3f5ea" stroke="${C.g2}" stroke-width="2"/>` +
      `<g>${[0, 1].map(i => `<ellipse cx="83" cy="${126 - i * 9}" rx="22" ry="6" fill="${C.y}" stroke="#c99a1c"/>`).join('')}</g>` + T(83, 60, 'Treinar', { s: 15, c: C.g2, w: 800 }) + T(83, 78, 'a equipe', { s: 12 }) +
      T(160, 108, '<', { s: 40, c: C.n, w: 800 }) +
      `<rect x="174" y="30" width="126" height="132" rx="14" fill="#fdecec" stroke="${C.r}" stroke-width="2"/>` +
      `<g>${[0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="237" cy="${150 - i * 9}" rx="22" ry="6" fill="${C.y}" stroke="#c99a1c"/>`).join('')}</g>` + T(237, 52, 'Perder', { s: 15, c: C.r, w: 800 }) + T(237, 68, 'clientes', { s: 12 }) +
      T(160, 188, 'Treinar custa menos do que perder', { s: 12, c: C.n }),
    // 10 (1.50.0): tutor com IA no curso — o funcionário pergunta e recebe a resposta na hora
    () => fundo('#f5f0ff') + `<rect x="150" y="10" width="112" height="180" rx="16" fill="${C.n}"/><rect x="157" y="22" width="98" height="156" rx="8" fill="#fff"/>` +
      `<rect x="157" y="22" width="98" height="22" rx="8" fill="#8B5CF6"/>` + T(206, 37, '💬 Dúvidas', { s: 10, c: '#fff' }) +
      `<rect x="186" y="52" width="64" height="34" rx="9" fill="#e3f5ea"/>` + T(218, 66, 'E se o cliente', { s: 7.5, w: 600 }) + T(218, 78, 'chegar bravo?', { s: 7.5, w: 600 }) +
      `<rect x="162" y="94" width="86" height="58" rx="9" fill="#efe9ff" stroke="#8B5CF6" stroke-width="1.5"/>` + E(174, 112, '🤖', 13) +
      T(212, 110, 'Ouça até o fim,', { s: 7.5, w: 600, c: '#5b21b6' }) + T(205, 124, 'peça desculpas e', { s: 7.5, w: 600, c: '#5b21b6' }) + T(205, 138, 'diga o que vai fazer.', { s: 7.5, w: 600, c: '#5b21b6' }) +
      T(206, 168, '⚡ resposta na hora', { s: 8.5, c: C.g2 }) +
      pes(80, 74, { roupa: C.g2, cracha: true, h: 'f' }) + E(122, 60, '💡', 26) +
      T(80, 190, 'Tutor com IA', { s: 13, c: '#6D28D9', w: 800 })
  ];

  /* ---------- Página ---------- */
  function personagemSVG(lado) { // Ana à esquerda, Beto à direita (1.90.0: dois vendedores)
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
      <ellipse cx="0" cy="118" rx="46" ry="40" fill="#5b6b7a"/><rect x="-10" y="92" width="20" height="10" rx="3" fill="#d9a77f"/>
      <rect x="-36" y="104" width="24" height="10" rx="2" fill="#fff"/><text x="-24" y="112" font-size="7" text-anchor="middle" fill="#5b6b7a" font-weight="700">BETO</text>
      <circle cx="0" cy="52" r="30" fill="#d9a77f"/><path d="M-30 46 q0-30 30-30 q30 0 30 30 q-6-14-14-16 q-16 6-32 2 q-10 2-14 14z" fill="#2b1a10"/>
      <circle cx="-11" cy="52" r="3.2" fill="#2b1a10"/><circle cx="11" cy="52" r="3.2" fill="#2b1a10"/>
      <path d="M-17 43 h11 M6 43 h11" stroke="#2b1a10" stroke-width="2.4" stroke-linecap="round"/>
      <path class="boca" d="M-8 68 q8 5 16 0" stroke="#6b2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse class="bocaA" cx="0" cy="69" rx="6.5" ry="4.5" fill="#6b2a2a"/></g>`;
  }
  function render() {
    const V = D.video, P = D.dialogo.pessoas;
    app.innerHTML = `
    <section class="hero">${foto('hero', 'fotoTopo')}
      <span class="selo">🎧 Treinamento gratuito · 4 minutos</span>
      <h1>Quanto custa um cliente <em>que não volta?</em></h1>
      <p>Um resumo rápido para o dono da loja: por que treinar a sua equipe sai muito mais barato do que perder clientes e vendas.</p>
      <a class="btn lar" href="#ouca" data-ouvir-hero="1">▶ Ouça o treinamento</a>
      <p class="quem">Olá, seja bem-vindo ao treinamento Cliente Encantado.</p>
    </section>

    <section class="card" id="ouca">
      <h2>🎧 Ouça o treinamento</h2>
      <p class="sub">Aperte o play e acompanhe: as imagens e a legenda mudam junto com a voz.</p>
      <div class="palco" id="palco">${CENAS.map((f, i) => FT && FT.cena[i] ? `<img src="${FT.base}${FT.cena[i]}.webp" alt="" class="${i ? '' : 'on'}" data-i="${i}" decoding="async">` : `<svg viewBox="0 0 320 200" role="img" aria-label="Ilustração ${i + 1}" class="${i ? '' : 'on'}" data-i="${i}">${f()}</svg>`).join('')}</div>
      <div class="navT"><button data-c="-1" aria-label="Imagem anterior">‹</button><span class="dots">${CENAS.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</span><button data-c="1" aria-label="Próxima imagem">›</button></div>
      <div class="leg" id="leg">${D.audio || temVoz ? 'Toque em “Ouvir o treinamento” para começar.' : esc(D.falas[0].t)}</div>
      ${D.audio || temVoz ? '<div class="acoes"><button class="pri" id="ouvir">▶ Ouvir o treinamento</button><button class="hide" id="parar">⏹ Parar</button></div>' : ''}
      <p class="dica" id="dicaOuvir"></p>
    </section>

    <div class="nums">${D.numeros.map(x => `<div class="num"><b>${esc(x.n)}</b><span>${esc(x.t)}</span><small>Fonte: <a href="${x.u}" target="_blank" rel="noopener">${esc(x.f)}</a></small></div>`).join('')}</div>

    <section class="card">
      <h2>🎬 Assista: treinar não custa caro</h2>
      <p class="sub">${esc(V.resumo)}</p>
      <div class="video" id="video"><img src="https://i.ytimg.com/vi/${V.id}/hqdefault.jpg" alt="" loading="lazy"><button class="play" id="vidPlay" aria-label="Assistir ao vídeo"><span>▶</span></button><div class="trava" id="vidTrava">⏸ Pause o áudio para assistir ao vídeo</div></div>
      <p class="vidInfo">${esc(V.quem)} · ${esc(V.fonte)} · <a href="https://www.youtube.com/watch?v=${V.id}&t=${V.ini}s" target="_blank" rel="noopener">abrir no YouTube</a></p>
      <p class="dica" id="dicaVideo"></p>
    </section>

    <section class="card">
      <h2>🗣️ ${esc(D.dialogo.titulo)}</h2>
      <p class="sub">${esc(D.dialogo.sub)}</p>
      <div class="dlgBalao" id="dlgBalao"><span style="opacity:.7">Toque em ▶ Ouvir o diálogo.</span></div>
      <div class="dlgPalco"><svg viewBox="0 0 320 190" role="img" aria-label="Ana e Beto, vendedores, conversando atrás do balcão">
        <rect width="320" height="190" fill="#eaf6ef"/><rect y="150" width="320" height="40" fill="#d7ecdf"/>
        <rect x="24" y="16" width="70" height="40" rx="6" fill="#fff" opacity=".7"/><rect x="226" y="16" width="70" height="40" rx="6" fill="#fff" opacity=".7"/>
        ${personagemSVG('a')}${personagemSVG('c')}
        <rect x="20" y="138" width="280" height="52" rx="6" fill="#8a5a3b"/><rect x="20" y="134" width="280" height="10" rx="4" fill="#a8734f"/>
        <text id="dlgCena" x="160" y="128" font-size="34" text-anchor="middle" ${EMO}>🏪</text></svg></div>
      <div class="acoes"><button class="pri" id="dlgOuvir">▶ Ouvir o diálogo</button><button class="hide" id="dlgParar">⏹ Parar diálogo</button></div>
      <p class="dica" id="dicaDlg"></p>
      <div class="rende" id="rende"><b>${esc(D.dialogo.rotulo)}</b><ul>${D.dialogo.rende.map(r => `<li>${esc(r)}</li>`).join('')}</ul><p class="fecho" id="fecho">${esc(D.dialogo.fecho)}</p><a class="btn" href="#fale">💬 Quero treinar a minha equipe</a></div>
    </section>

    <section class="card curso" id="curso">${foto('caixa', 'fotoFaixa')}
      <div class="cursoTopo"><span class="cursoSelo">🎓 O curso da sua equipe</span>
        <h2>Cliente Encantado</h2><p>atendimento que faz o cliente voltar</p>
        <div class="cursoNums"><span><b>7</b> lições curtas</span><span><b>5 a 7</b> min cada</span><span><b>📱</b> no celular</span></div></div>
      <h3>O que a sua equipe aprende</h3>
      <ol class="licoes">${D.licoes.map((l, i) => `<li><span class="lIco">${D.licoesIco[i] || '⭐'}</span><span class="lTx"><small>Lição ${i + 1}</small>${esc(l)}</span></li>`).join('')}</ol>
      <h3>Como funciona</h3>
      <div class="vantagens">
        <div><b>⏱️ Sem parar a loja</b><span>O funcionário faz no celular, no intervalo.</span></div>
        <div><b>🎧 Áudio, vídeo e diálogos</b><span>Com exemplos do seu ramo, o jeito certo e o jeito errado de atender.</span></div>
        <div><b>🤖 Tutor com IA</b><span>Tira as dúvidas na hora; a equipe do Cliente Assistido confere as respostas.</span></div>
        <div><b>🏅 Certificado</b><span>Pergunta no fim de cada lição e certificado de conclusão.</span></div>
        <div><b>📊 Você acompanha</b><span>Vê quem já fez cada lição e as dúvidas da equipe.</span></div>
      </div>
      <a class="btn cursoBtn" href="#fale">💬 Quero esse curso para a minha equipe</a>
    </section>

    <section class="card ler">${foto('leia', 'fotoFaixa')}
      <h2>📖 Leia</h2>
      <h3>O cliente que vai embora não reclama. Ele só não volta.</h3>
      <p>Você não vê o cliente que saiu sem comprar. Ele não aparece no caixa, não entra no relatório e não deixa recado. Mas ele existia, custou caro para chegar até a sua loja e agora está comprando no concorrente.</p>
      <p>Na maioria das vezes, o motivo não é preço nem produto. É um “oi” que não veio, uma pergunta que ninguém fez, um problema que ninguém resolveu, um “volte sempre” que não teve continuação.</p>
      <div class="destaque">Treinar a equipe não é gasto. É a forma mais barata de parar de perder venda.</div>
      <h3>Sem treino ou com treino: o mesmo cliente, dois finais</h3>
      <div class="vs">
        <div class="sem"><h4>❌ Sem treinamento</h4><ul><li>Atende olhando o celular</li><li>Empurra o que tem, não o que o cliente precisa</li><li>Esquece o cliente depois da venda</li><li>Cliente não volta e fala mal</li></ul></div>
        <div class="com"><h4>✅ Com o curso</h4><ul><li>Recebe no primeiro minuto</li><li>Chama pelo nome e ouve antes de oferecer</li><li>Resolve quando algo dá errado</li><li>Cliente volta, compra de novo e indica</li></ul></div>
      </div>
      <h3>🤖 Inteligência artificial a favor da sua equipe</h3>
      <p>O curso tem um <b>tutor com inteligência artificial</b>. Quando o funcionário fica com dúvida, ele escreve no fim da lição e recebe a resposta em segundos, como se tivesse um instrutor ao lado:</p>
      <ul class="check">
        <li>Resposta na hora, a qualquer momento do dia, sem parar a loja</li>
        <li>Com exemplo do seu ramo e, quando ajuda, a frase pronta para dizer ao cliente</li>
        <li>Só fala de atendimento, sem inventar números e sem conselhos jurídicos ou médicos</li>
        <li>A equipe do Cliente Assistido confere as respostas, e você vê as dúvidas da sua equipe: elas mostram onde cada um precisa de mais apoio</li>
      </ul>
      <div class="destaque">A inteligência artificial não substitui o atendimento humano. Ela ajuda a sua equipe a atender melhor as pessoas.</div>
    </section>

    <section class="cta" id="fale">${foto('cta', 'fotoFaixa')}
      <h2>Comece a parar de perder clientes</h2>
      <p>Fale com a nossa equipe pelo WhatsApp. Liberamos o treinamento para a sua equipe, tiramos suas dúvidas ou passamos na sua loja para uma conversa.</p>
      <div class="bts">
        <a class="btn" href="${zap('Olá! Vi o treinamento para donos de loja e quero liberar o curso Cliente Encantado para a minha equipe.')}" target="_blank" rel="noopener">💬 Quero liberar o treinamento</a>
        <a class="btn sec" href="${zap('Olá! Vi o treinamento para donos de loja e quero agendar uma visita ou uma apresentação.')}" target="_blank" rel="noopener">📅 Agendar uma visita</a>
        <a class="btn sec" href="${zap('Olá! Vi o treinamento para donos de loja e tenho uma dúvida.')}" target="_blank" rel="noopener">❓ Tirar uma dúvida</a>
      </div>
      <p class="zap">Fale conosco · <span>WhatsApp (61) 99999-9340</span></p>
    </section>

    <div class="fontes"><b>Fontes dos números</b><ol>${D.fontes.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join('')}</ol>
      O exemplo de R$ 150 por mês é ilustrativo. Vídeo: ${esc(V.quem)}, ${esc(V.fonte)}.</div>
    <p class="rod">Cliente Assistido · <a href="https://cliente-assistido.vercel.app">cliente-assistido.vercel.app</a></p>`;
  }

  /* ---------- Narração: voz + ilustração + legenda ---------- */
  let cena = 0, falando = false, dialogando = false, videoTocando = false, audio = null, timerDlg = null;
  function irCena(i) {
    const n = CENAS.length; cena = (i + n) % n;
    document.querySelectorAll('#palco [data-i]').forEach(s => s.classList.toggle('on', +s.dataset.i === cena));
    document.querySelectorAll('.dots i').forEach((d, k) => d.classList.toggle('on', k === cena));
  }
  const legenda = t => { const el = $('#leg'); if (el) el.textContent = t; };
  function botoesOuvir(on) {
    falando = on;
    const o = $('#ouvir'), p = $('#parar');
    if (o) { o.classList.toggle('hide', on); if (!on) o.textContent = '▶ Ouvir de novo'; } if (p) p.classList.toggle('hide', !on);
    travas();
  }
  function vozPt() { return (temVoz ? speechSynthesis.getVoices() : []).find(x => /pt[-_]BR/i.test(x.lang)) || null; }
  function ouvir() {
    if (videoTocando || dialogando) return dica('dicaOuvir', videoTocando ? '⏸ Pause o vídeo para ouvir o treinamento.' : '⏹ Pare o diálogo para ouvir o treinamento.');
    pararTudo(); botoesOuvir(true);
    const F = D.falas;
    if (D.audio) {
      audio = new Audio(D.audio);
      const tam = F.map(f => f.t.length), tot = tam.reduce((a, b) => a + b, 0); let k = -1;
      audio.addEventListener('timeupdate', () => {
        if (!audio || !audio.duration) return; const alvo = audio.currentTime / audio.duration * tot; let s = 0, i = 0;
        while (i < tam.length - 1 && s + tam[i] < alvo) { s += tam[i]; i++; }
        if (i !== k) { k = i; legenda(F[i].t); irCena(F[i].c); }
      });
      audio.addEventListener('ended', () => { audio = null; botoesOuvir(false); });
      audio.play().catch(() => botoesOuvir(false));
      return;
    }
    const voz = vozPt();
    F.forEach((f, i) => {
      const u = new SpeechSynthesisUtterance(f.t); u.lang = 'pt-BR'; u.rate = 1.08; if (voz) u.voice = voz;
      u.onstart = () => { if (falando) { legenda(f.t); irCena(f.c); } };
      if (i === F.length - 1) u.onend = () => { if (falando) { botoesOuvir(false); legenda('Fim ✓ Agora assista ao vídeo e ouça o diálogo logo abaixo.'); } };
      speechSynthesis.speak(u);
    });
  }
  function pararOuvir() { if (!falando) return; if (audio) { audio.pause(); audio = null; } if (temVoz) speechSynthesis.cancel(); botoesOuvir(false); }

  /* ---------- Vídeo (trecho do YouTube) ---------- */
  function comandoVideo(func) { const f = $('#vidFrame'); if (f) try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*'); } catch (e) {} }
  function abrirVideo() {
    if (falando || dialogando) return dica('dicaVideo', falando ? '⏸ Pare o áudio do treinamento para assistir ao vídeo.' : '⏹ Pare o diálogo para assistir ao vídeo.');
    const V = D.video, box = $('#video'); if (!box || $('#vidFrame')) return;
    box.querySelector('img').remove(); $('#vidPlay').remove();
    box.insertAdjacentHTML('afterbegin', `<iframe id="vidFrame" src="https://www.youtube-nocookie.com/embed/${V.id}?start=${V.ini}&end=${V.fim}&rel=0&playsinline=1&enablejsapi=1&autoplay=1&origin=${encodeURIComponent(location.origin)}" title="${esc(V.titulo)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`);
    const f = $('#vidFrame');
    f.addEventListener('load', () => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: 'vidDono' }), '*'); } catch (e) {} });
  }
  window.addEventListener('message', e => {
    if (!/youtube/.test(e.origin || '')) return;
    let d = e.data; try { if (typeof d === 'string') d = JSON.parse(d); } catch (x) { return; }
    const st = d && (d.event === 'onStateChange' ? d.info : d.event === 'infoDelivery' && d.info ? d.info.playerState : undefined);
    if (typeof st !== 'number') return;
    const ant = videoTocando; videoTocando = st === 1 || st === 3; if (ant !== videoTocando) travas();
  });

  /* ---------- Diálogo em duas vozes + narrador ---------- */
  function vozesDlg() {
    const vs = (temVoz ? speechSynthesis.getVoices() : []).filter(x => /pt[-_]BR/i.test(x.lang));
    const fem = vs.find(x => /female|mulher|luciana|francisca|maria|vit[oó]ria|camila|thalita|fernanda/i.test(x.name));
    const mas = vs.find(x => (/\bmale\b|masculin|homem|felipe|ant[oô]nio|ricardo|f[aá]bio|donato|humberto|julio|j[uú]lio|valerio|nicolau|ptd/i.test(x.name + ' ' + (x.voiceURI || ''))) && !/female|feminin/i.test(x.name) && x !== fem);
    const nar = vs.find(x => x !== fem && x !== mas) || null;
    return { a: { voz: fem || vs[0] || null, pitch: fem && mas ? 1.05 : 1.3 }, c: { voz: mas || vs[0] || null, pitch: mas ? 0.95 : 0.6 }, n: { voz: nar || vs[0] || null, pitch: 1.0 } };
  }
  function falaDlg(i) {
    const f = D.dialogo.falas[i], P = D.dialogo.pessoas, b = $('#dlgBalao'); if (!f || !b) return;
    b.className = 'dlgBalao fala' + f[0]; b.innerHTML = `<b>${esc(P[f[0]].nome)}:</b> ${esc(f[1])}`;
    const c = $('#dlgCena'); if (c) c.textContent = f[2] || '🏪';
    document.querySelectorAll('.dlgP').forEach(g => g.classList.toggle('falando', dialogando && g.dataset.p === f[0]));
  }
  function rendeDlg(k) { // k = -1: chamada do narrador; 0..n: item
    const b = $('#dlgBalao'), box = $('#rende');
    document.querySelectorAll('.dlgP').forEach(g => g.classList.remove('falando'));
    const DL = D.dialogo, ehFecho = k >= DL.rende.length;
    if (box) { box.classList.add('lendo'); box.querySelectorAll('li').forEach((li, j) => li.classList.toggle('on', j === k)); const fe = $('#fecho'); if (fe) fe.classList.toggle('on', ehFecho); if (k <= 0) box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    if (b) { b.className = 'dlgBalao falan'; b.innerHTML = `💭 <b>Narrador:</b> ${esc(k < 0 ? DL.chamada : ehFecho ? DL.fecho : DL.rende[k])}`; }
    const c = $('#dlgCena'); if (c) c.textContent = '💭';
  }
  function limparRende() { const box = $('#rende'); if (box) { box.classList.remove('lendo'); box.querySelectorAll('li').forEach(li => li.classList.remove('on')); const fe = $('#fecho'); if (fe) fe.classList.remove('on'); } }
  function fimDlg(msg) {
    dialogando = false; clearInterval(timerDlg); limparRende();
    document.querySelectorAll('.dlgP').forEach(g => g.classList.remove('falando'));
    const b = $('#dlgBalao'); if (b) { b.className = 'dlgBalao'; b.innerHTML = `<span style="opacity:.75">${msg}</span>`; }
    const o = $('#dlgOuvir'), p = $('#dlgParar'); if (o) o.classList.remove('hide'); if (p) p.classList.add('hide');
    travas();
  }
  function ouvirDlg() {
    if (videoTocando || falando) return dica('dicaDlg', videoTocando ? '⏸ Pause o vídeo para ouvir o diálogo.' : '⏹ Pare o áudio do treinamento para ouvir o diálogo.');
    pararTudo(); dialogando = true; travas();
    const o = $('#dlgOuvir'), p = $('#dlgParar'); if (o) o.classList.add('hide'); if (p) p.classList.remove('hide');
    const DL = D.dialogo, fim = () => { if (dialogando) fimDlg('Fim do diálogo ✓'); };
    if (!temVoz && !DL.audio) { // sem voz: as falas passam sozinhas, uma a cada 4 s
      const tot = DL.falas.length + 2 + DL.rende.length; let i = 0; falaDlg(0);
      timerDlg = setInterval(() => { if (!dialogando) return clearInterval(timerDlg); i++; if (i >= tot) fim(); else if (i < DL.falas.length) falaDlg(i); else rendeDlg(i - DL.falas.length - 1); }, 4000);
      return;
    }
    const lista = itensDlg();
    if (DL.audio) return tocarGravadoDlg(lista, fim);
    falarCelDlg(lista, fim);
  }
  const hashTx = t => { let x = 5381; for (let i = 0; i < t.length; i++) x = ((x << 5) + x + t.charCodeAt(i)) >>> 0; return x.toString(36); };
  function itensDlg() {
    const DL = D.dialogo;
    return DL.falas.map((f, i) => ({ q: f[0], t: f[1], mostra: () => falaDlg(i) }))
      .concat([{ q: 'n', t: DL.chamada, mostra: () => rendeDlg(-1) }])
      .concat(DL.rende.map((r, k) => ({ q: 'n', t: r.replace(/[“”]/g, ''), mostra: () => rendeDlg(k) })))
      .concat([{ q: 'n', t: DL.fecho, mostra: () => rendeDlg(DL.rende.length) }]);
  }
  let audDlg = null;
  function tocarGravadoDlg(lista, fim) { // um único Audio tocando fala a fala (liberado no toque, funciona no iPhone)
    audDlg = audDlg || new Audio(); let i = 0;
    const prox = () => {
      if (!dialogando) return;
      if (i >= lista.length) return fim();
      const x = lista[i++]; x.mostra();
      audDlg.onended = prox;
      audDlg.onerror = () => { if (!dialogando) return; i--; falarCelDlg(lista.slice(i), fim); }; // arquivo faltando: segue na voz do celular
      audDlg.src = D.dialogo.audio.base + x.q + '-' + hashTx(x.t) + '.mp3';
      const pr = audDlg.play(); if (pr && pr.catch) pr.catch(() => audDlg.onerror());
    };
    prox();
  }
  function falarCelDlg(lista, fim) {
    if (!temVoz) return fim();
    const V = vozesDlg();
    const itens = lista;
    itens.forEach((x, i) => {
      const u = new SpeechSynthesisUtterance(x.t), cfg = V[x.q];
      u.lang = 'pt-BR'; if (cfg.voz) u.voice = cfg.voz; u.pitch = cfg.pitch; u.rate = 1.08;
      u.onstart = () => { if (dialogando) x.mostra(); };
      if (i === itens.length - 1) u.onend = fim;
      speechSynthesis.speak(u);
    });
  }
  function pararDlg() { if (!dialogando) return; if (temVoz) speechSynthesis.cancel(); if (audDlg) { audDlg.onended = audDlg.onerror = null; audDlg.pause(); } fimDlg('Diálogo parado. Toque em ▶ Ouvir o diálogo para recomeçar.'); }

  /* ---------- Travas: voz, vídeo e diálogo nunca juntos ---------- */
  function travas() {
    const v = $('#video'); if (v) v.classList.toggle('travado', falando || dialogando);
    if ((falando || dialogando) && videoTocando) comandoVideo('pauseVideo');
    const tv = $('#vidTrava'); if (tv) tv.textContent = dialogando ? '⏹ Pare o diálogo para assistir ao vídeo' : '⏸ Pare o áudio do treinamento para assistir ao vídeo';
    const o = $('#ouvir'); if (o) { const b = videoTocando || dialogando; o.classList.toggle('bloq', b); o.setAttribute('aria-disabled', b ? 'true' : 'false'); }
    const d = $('#dlgOuvir'); if (d) { const b = videoTocando || falando; d.classList.toggle('bloq', b); d.setAttribute('aria-disabled', b ? 'true' : 'false'); }
  }
  const dicaT = {};
  function dica(id, t) { const el = document.getElementById(id); if (!el) return; el.textContent = t; el.classList.add('on'); clearTimeout(dicaT[id]); dicaT[id] = setTimeout(() => el.classList.remove('on'), 4500); }
  function pararTudo() { pararOuvir(); pararDlg(); }

  document.addEventListener('click', e => {
    const c = e.target.closest('[data-c]'); if (c) { if (!falando) irCena(cena + +c.dataset.c); return; }
    if (e.target.closest('#ouvir')) { ouvir(); return; }
    if (e.target.closest('#parar')) { pararOuvir(); return; }
    if (e.target.closest('[data-ouvir-hero]')) { e.preventDefault(); $('#ouca').scrollIntoView({ behavior: 'smooth', block: 'start' }); if (!falando) ouvir(); return; }
    if (e.target.closest('#vidPlay')) { abrirVideo(); return; }
    if (e.target.closest('#vidTrava')) { dica('dicaVideo', falando ? '⏸ Pare o áudio do treinamento para assistir ao vídeo.' : '⏹ Pare o diálogo para assistir ao vídeo.'); return; }
    if (e.target.closest('#dlgOuvir')) { ouvirDlg(); return; }
    if (e.target.closest('#dlgParar')) { pararDlg(); return; }
  });
  window.addEventListener('pagehide', pararTudo);
  if (temVoz) { speechSynthesis.cancel(); speechSynthesis.getVoices(); } // carrega a lista de vozes cedo (Android)
  render();
})();
