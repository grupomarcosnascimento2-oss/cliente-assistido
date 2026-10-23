/* Cliente Assistido – Modelos prontos de campanha (5 versões de mensagem cada).
   Datas comerciais calculadas para o ano corrente (ou o próximo, se a data já passou). */
'use strict';
(function () {
  const d = (y, m, dia) => new Date(y, m - 1, dia);
  // n-ésimo dia da semana do mês (dow: 0=domingo)
  const nthDow = (y, m, dow, n) => { const x = d(y, m, 1); x.setDate(1 + ((7 + dow - x.getDay()) % 7) + 7 * (n - 1)); return x; };
  const pascoa = y => { // algoritmo de Meeus/Jones/Butcher
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - dd - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return d(y, mes, dia);
  };
  const blackFriday = y => { const t = nthDow(y, 11, 4, 4); t.setDate(t.getDate() + 1); return t; };

  const AUD = (o) => Object.assign({ groups: ['todos'], status: 'todos', compraDias: 0, semContatoDias: 0, niverMes: false, semNiver: false }, o || {});

  window.CA_MODELOS = [
    /* ---------- Relacionamento (ano todo) ---------- */
    { key: 'boas-vindas', tipo: 'rel', nome: 'Boas-vindas', desc: 'Para clientes novos na lista', aud: AUD({ groups: ['novos'], status: 'nunca' }), msgs: [
      'Oi, {nome}! Que bom ter você com a gente 😊 Salva nosso número para receber novidades e condições especiais.',
      'Olá, {nome}! Seja muito bem-vindo(a). Sempre que precisar, é só chamar aqui que a gente te atende com carinho.',
      'Oi, {nome}, tudo bem? Passando para agradecer a confiança. Salva este contato que de vez em quando mandamos novidades!',
      'Olá, {nome}! Obrigado por escolher a gente. Qualquer dúvida sobre produtos, horários ou entregas, é só mandar mensagem aqui.',
      'Oi, {nome}! Agora você faz parte dos nossos clientes especiais 💚 Fica de olho que sempre tem novidade por aqui.'
    ] },
    { key: 'reconquista', tipo: 'rel', nome: 'Reconquista', desc: 'Clientes sumidos, sem contato há 60 dias', aud: AUD({ groups: ['sumidos', 'outros', 'novos'], semContatoDias: 60 }), msgs: [
      'Oi, {nome}! Faz um tempinho que não te vemos por aqui e sentimos sua falta. Passa para conhecer as novidades?',
      'Olá, {nome}, tudo bem com você? Lembramos de você hoje e queríamos saber como está 😊',
      'Oi, {nome}! Chegou muita coisa nova desde a sua última visita. Quer que eu te mande algumas fotos?',
      'Olá, {nome}! Saudade de você por aqui. Separamos uma condição especial para quem a gente não vê há um tempo. Quer saber?',
      'Oi, {nome}! Só passando para dizer que as portas estão sempre abertas para você. Quando quiser, estamos aqui 💚'
    ] },
    { key: 'vip', tipo: 'rel', nome: 'Clientes especiais (VIP)', desc: 'Frequentes que já responderam', aud: AUD({ groups: ['frequentes'], status: 'respondeu' }), msgs: [
      '{nome}, você é um dos nossos clientes mais especiais. Separamos uma condição só para você esta semana 💚',
      'Oi, {nome}! Clientes como você fazem a nossa história. Antes de todo mundo, queria te mostrar as novidades. Posso mandar?',
      'Olá, {nome}! Como agradecimento pela sua fidelidade, preparamos algo exclusivo para você. Quer saber o que é?',
      'Oi, {nome}! Você sempre está com a gente, e isso merece um carinho especial. Passa aqui esta semana que tem surpresa 🎁',
      '{nome}, obrigado por confiar na gente sempre! Reservamos novidades para os clientes VIP antes de divulgar. Te mostro?'
    ] },
    { key: 'novidades', tipo: 'rel', nome: 'Novidades e lançamentos', desc: 'Para avisar sobre produtos novos', aud: AUD(), msgs: [
      'Oi, {nome}! Chegaram novidades que têm a sua cara. Quer que eu te mande fotos?',
      'Olá, {nome}! Acabou de chegar coleção nova aqui na loja. Vem conferir antes que acabe!',
      'Oi, {nome}, tudo bem? Separei algumas novidades que lembrei de você. Posso te mostrar?',
      'Olá, {nome}! Temos lançamentos fresquinhos esta semana ✨ Quer receber as fotos por aqui?',
      'Oi, {nome}! Novidade boa chegando: produtos novos e alguns que você já pediu voltaram. Quer saber mais?'
    ] },
    { key: 'instagram', tipo: 'rel', nome: 'Siga a gente no Instagram', desc: 'Convida os clientes a seguir o Instagram da loja', aud: AUD(), msgs: [
      'Oi, {nome}! Aqui é da {loja}. Agora a gente também está no Instagram, com novidades, dicas e promoções em primeira mão. Segue a gente: {instagram} 📲',
      'Olá, {nome}! Quer ver as novidades antes de todo mundo? Siga a {loja} no Instagram: {instagram} 😊',
      'Oi, {nome}, tudo bem? Postamos dicas, bastidores e ofertas no nosso Instagram. Vem acompanhar: {instagram}',
      '{nome}, sabia que a {loja} tem Instagram? É lá que a gente avisa primeiro das promoções. É só seguir: {instagram} 💚',
      'Oi, {nome}! Seu apoio faz diferença pra gente: segue a {loja} no Instagram e fica por dentro de tudo. {instagram}'
    ] },
    { key: 'pesquisa', tipo: 'rel', nome: 'Pesquisa de satisfação', desc: 'Quem comprou nos últimos 90 dias', aud: AUD({ compraDias: 90 }), msgs: [
      'Oi, {nome}! Como foi sua última experiência com a gente? Sua opinião ajuda muito 🙏',
      'Olá, {nome}! Queremos melhorar sempre. De 0 a 10, quanto você indicaria nossa loja para um amigo?',
      'Oi, {nome}, tudo bem? Gostou da sua última compra? Se tiver alguma sugestão, adoraríamos ouvir.',
      'Olá, {nome}! Ficou satisfeito(a) com o atendimento e o produto? Pode responder por aqui mesmo, com sinceridade 😊',
      'Oi, {nome}! Sua opinião é muito importante para nós. Tem algo que podemos fazer melhor da próxima vez?'
    ] },
    { key: 'niver-mes', tipo: 'rel', nome: 'Aniversariantes do mês', desc: 'Só quem faz aniversário este mês', aud: AUD({ niverMes: true }), msgs: [
      'Oi, {nome}! Aqui é da {loja}. Este mês é seu, e a gente separou um mimo de aniversário para você. Passa aqui para buscar! 🎁',
      '{nome}, mês de aniversário merece comemoração! 🎉 A equipe da {loja} preparou uma condição especial para você. Vem aproveitar!',
      'Olá, {nome}! A {loja} sabe que este mês é especial para você. Seu presente de aniversário está te esperando aqui. 🎂',
      'Oi, {nome}! Feliz mês do seu aniversário! 🥳 Durante todo este mês, você tem um desconto especial na {loja}.',
      '{nome}, aniversariante do mês tem vantagem na {loja}! Quer saber qual é o seu presente? É só responder esta mensagem. 😊'
    ] },
    { key: 'captar-niver', tipo: 'rel', nome: 'Qual é o seu aniversário?', desc: 'Pede o dia e o mês a quem ainda não tem aniversário cadastrado', aud: AUD({ semNiver: true }), msgs: [
      'Oi, {nome}! Aqui é da {loja}. Queremos lembrar do seu aniversário com um carinho especial 🎂 Qual é o dia e o mês do seu aniversário? Só se quiser contar!',
      'Olá, {nome}, tudo bem? A {loja} está preparando mimos para os aniversariantes 🎁 Me conta: quando é o seu aniversário? Só o dia e o mês já bastam.',
      '{nome}, aqui é da {loja}! Aniversariante tem condição especial no mês do aniversário. Para não deixar passar, qual é a data do seu? (dia/mês) 🎉',
      'Oi, {nome}! Estamos atualizando o cadastro dos clientes da {loja}. Pode me dizer o dia e o mês do seu aniversário? É só para te dar os parabéns 😊',
      'Olá, {nome}! A equipe da {loja} adora comemorar com os clientes 🥳 Qual é o dia do seu aniversário? Responde aqui com dia e mês, se quiser.'
    ] },

    /* ---------- Datas comerciais ---------- */
    { key: 'volta-aulas', tipo: 'data', nome: 'Volta às aulas', alvo: y => d(y, 2, 1), antes: 25, depois: 10, aud: AUD(), msgs: [
      'Oi, {nome}! A volta às aulas está chegando. Vem garantir tudo com calma antes da correria 📚',
      'Olá, {nome}! Material, mochila, uniforme… já começou a preparar a volta às aulas? A gente te ajuda!',
      'Oi, {nome}! Preparamos condições especiais para a volta às aulas. Quer saber mais?',
      'Olá, {nome}! Evite filas: separe agora o que precisa para a volta às aulas. Posso te mandar as opções?',
      'Oi, {nome}! Volta às aulas sem estresse: chegou tudo o que você precisa por aqui. Vem conferir!'
    ] },
    { key: 'consumidor', tipo: 'data', nome: 'Dia do Consumidor', alvo: y => d(y, 3, 15), antes: 7, depois: 0, aud: AUD(), msgs: [
      '{nome}, no Dia do Consumidor quem ganha presente é você! Condição especial até o dia 15.',
      'Oi, {nome}! Dia do Consumidor chegando e preparamos ofertas para agradecer quem compra com a gente 💚',
      'Olá, {nome}! Semana do Consumidor aqui na loja: condições especiais para você. Quer saber quais?',
      'Oi, {nome}! Para comemorar o Dia do Consumidor, separamos descontos para os nossos clientes. Passa aqui!',
      '{nome}, você merece! No Dia do Consumidor tem vantagem especial para quem já é cliente.'
    ] },
    { key: 'pascoa', tipo: 'data', nome: 'Páscoa', alvo: pascoa, antes: 14, depois: 0, aud: AUD(), msgs: [
      'Oi, {nome}! A Páscoa está chegando. Que tal presentear quem você ama? 🐰',
      'Olá, {nome}! Já escolheu o presente de Páscoa? Temos opções lindas para todos os gostos.',
      'Oi, {nome}! Páscoa é tempo de renovar e celebrar. Vem ver o que preparamos para esta data!',
      'Olá, {nome}! Garanta seus presentes de Páscoa com antecedência e sem correria. Posso te mostrar as opções?',
      'Oi, {nome}! Desejamos uma Páscoa abençoada para você e sua família. Se precisar de um presente, conte com a gente 💚'
    ] },
    { key: 'maes', tipo: 'data', nome: 'Dia das Mães', alvo: y => nthDow(y, 5, 0, 2), antes: 18, depois: 0, aud: AUD(), msgs: [
      '{nome}, o Dia das Mães está chegando! Separamos sugestões de presente para todos os bolsos 💐',
      'Oi, {nome}! Já pensou no presente da sua mãe? A gente te ajuda a escolher algo especial.',
      'Olá, {nome}! Dia das Mães é no domingo que vem. Garanta o presente com calma e embrulho caprichado 🎁',
      'Oi, {nome}! Para a mulher mais importante da sua vida, um presente à altura. Quer ver as opções?',
      '{nome}, homenageie quem sempre cuidou de você. Temos presentes lindos para o Dia das Mães 💐'
    ] },
    { key: 'namorados', tipo: 'data', nome: 'Dia dos Namorados', alvo: y => d(y, 6, 12), antes: 14, depois: 0, aud: AUD(), msgs: [
      'Oi, {nome}! Já pensou no presente do Dia dos Namorados? Te ajudo a escolher ❤️',
      'Olá, {nome}! O Dia dos Namorados está chegando. Temos presentes que vão surpreender.',
      'Oi, {nome}! Quer acertar no presente do dia 12? Me conta o estilo da pessoa que eu te dou sugestões 😉',
      'Olá, {nome}! Amor se demonstra nos detalhes. Vem conferir as opções para o Dia dos Namorados!',
      'Oi, {nome}! Não deixe para a última hora: os presentes do Dia dos Namorados já estão aqui ❤️'
    ] },
    { key: 'pais', tipo: 'data', nome: 'Dia dos Pais', alvo: y => nthDow(y, 8, 0, 2), antes: 14, depois: 0, aud: AUD(), msgs: [
      '{nome}, o Dia dos Pais está chegando! Vem ver as opções que separamos 👔',
      'Oi, {nome}! Já escolheu o presente do seu pai? Temos ideias para todos os estilos.',
      'Olá, {nome}! Dia dos Pais é no domingo que vem. Garanta o presente com tranquilidade.',
      'Oi, {nome}! Para o herói da sua vida, um presente especial. Quer que eu te mostre as opções?',
      '{nome}, homenageie seu pai com algo que ele vai usar e lembrar. Passa aqui que a gente te ajuda!'
    ] },
    { key: 'dia-cliente', tipo: 'data', nome: 'Dia do Cliente', alvo: y => d(y, 9, 15), antes: 7, depois: 0, aud: AUD(), msgs: [
      '{nome}, hoje o dia é seu! Obrigado por fazer parte da nossa história 💚',
      'Oi, {nome}! No Dia do Cliente queremos agradecer a sua confiança com uma condição especial. Quer saber?',
      'Olá, {nome}! Sem você a gente não existiria. Feliz Dia do Cliente! Preparamos um mimo para você 🎁',
      'Oi, {nome}! Semana do Cliente aqui na loja: vantagens especiais para quem é de casa. Passa aqui!',
      '{nome}, obrigado por escolher a gente! Para comemorar o Dia do Cliente, tem surpresa esperando por você.'
    ] },
    { key: 'criancas', tipo: 'data', nome: 'Dia das Crianças', alvo: y => d(y, 10, 12), antes: 14, depois: 0, aud: AUD(), msgs: [
      'Oi, {nome}! O Dia das Crianças está chegando. Temos ideias de presente para todas as idades 🎈',
      'Olá, {nome}! Já pensou no presente da criançada? Vem conferir as novidades!',
      'Oi, {nome}! Dia 12 é dia de alegria. Garanta o presente das crianças com antecedência.',
      'Olá, {nome}! Quer ajuda para escolher o presente do Dia das Crianças? Me fala a idade que eu te dou sugestões 😊',
      'Oi, {nome}! Presentes que fazem a criançada sorrir já estão aqui. Quer ver as opções?'
    ] },
    { key: 'black-friday', tipo: 'data', nome: 'Black Friday', alvo: blackFriday, antes: 7, depois: 3, aud: AUD(), msgs: [
      '{nome}, a Black Friday chegou mais cedo para você! Ofertas exclusivas para clientes antes de abrir ao público.',
      'Oi, {nome}! Black Friday de verdade aqui na loja: descontos reais para quem já é cliente. Quer receber a lista?',
      'Olá, {nome}! Separamos as melhores ofertas da Black Friday para os nossos clientes. Posso te mostrar?',
      'Oi, {nome}! Prepare a lista de desejos: a Black Friday começa nesta semana e você tem acesso antecipado 🖤',
      '{nome}, aproveite a Black Friday com quem você já conhece e confia. Ofertas especiais até domingo!'
    ] },
    { key: 'natal', tipo: 'data', nome: 'Natal', alvo: y => d(y, 12, 24), antes: 23, depois: 0, aud: AUD(), msgs: [
      'Oi, {nome}! O Natal está chegando. Vem garantir os presentes com calma e atenção especial 🎄',
      'Olá, {nome}! Já começou a lista de presentes de Natal? A gente te ajuda a escolher.',
      'Oi, {nome}! Presentes de Natal com embrulho caprichado e preço justo estão te esperando aqui 🎁',
      'Olá, {nome}! Evite a correria de última hora: separe agora os presentes de Natal. Quer ver as opções?',
      'Oi, {nome}! Que este Natal seja cheio de paz e alegria para você e sua família. Se precisar de presentes, conte com a gente 🎄'
    ] },
    { key: 'ano-novo', tipo: 'data', nome: 'Ano Novo', alvo: y => d(y, 12, 31), antes: 5, depois: 1, aud: AUD(), msgs: [
      '{nome}, obrigado por estar com a gente este ano! Desejamos um ano novo cheio de conquistas ✨',
      'Oi, {nome}! Que o próximo ano traga muita saúde, paz e realizações para você e sua família.',
      'Olá, {nome}! Foi uma alegria atender você este ano. Feliz Ano Novo! 🥂',
      'Oi, {nome}! Encerramos o ano agradecendo a sua confiança. Que venha um ano novo incrível!',
      '{nome}, muito obrigado por fazer parte da nossa história este ano. Boas festas e feliz Ano Novo! ✨'
    ] }
  ];

  const iso = x => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  const soData = x => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  // Período da próxima ocorrência de uma data comercial: { inicio, fim, alvo } em AAAA-MM-DD
  window.CA_periodoModelo = function (m, ref) {
    const hoje = soData(ref || new Date());
    for (let y = hoje.getFullYear(); y <= hoje.getFullYear() + 1; y++) {
      const alvo = soData(m.alvo(y));
      const fim = new Date(alvo); fim.setDate(fim.getDate() + (m.depois || 0));
      if (fim >= hoje) { const ini = new Date(alvo); ini.setDate(ini.getDate() - (m.antes || 0)); return { inicio: iso(ini < hoje ? hoje : ini), inicioIdeal: iso(ini), fim: iso(fim), alvo: iso(alvo), ano: y }; }
    }
    return null;
  };
})();
