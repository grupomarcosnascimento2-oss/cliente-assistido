/* Cliente Assistido – MÓDULO AVANÇADO do Cliente Encantado (1.74.0, aprovado pelo Marcos em 11/11/2026; nasceu como
   "Lições da semana" na 1.50.0). Depois do básico (Trilha 1), o aluno CONTINUA com o básico e ganha o menu "Avançado"
   (data-curso="avancado" no #tabsCurso), um módulo à parte. Regra do Marcos: uma lição nova A CADA 15 DIAS, nunca todas
   de uma vez (muito conteúdo de uma vez dá sensação de esforço e tempo demais). A lição N libera em
   (dia em que concluiu o básico + 15 × N dias), às 9h do aparelho; a tela mostra só as lições já liberadas e a data da
   próxima (sem o título). As lições não vencem. Cada lição (~6 min): ouvir (voz do celular, 1,08x) · na prática
   (em vez de / faça assim) · leia · pratique nos próximos dias · pergunta (a certa libera Concluir).
   Aviso de lição nova: fonte da Central de alertas (CA_alertasFonte, ícone 🚀). Progresso em p.sem (ca_treino:<email>)
   e em training_progress com trilha 'sem'; o dono vê no Painel da equipe quem iniciou o avançado e quantas lições fez.
   Conteúdo: 8 lições (4 meses). Ao acrescentar, continuar a numeração em L (o calendário segue sozinho).
   Admin vê todas, para revisar. Falta (depois): aviso no celular (Web Push) no dia em que a lição libera. */
'use strict';
(function () {
  const TRILHA = 'sem';

  const L = [
    { n: 1, t: 'O cliente com pressa', tema: 'Agilidade sem perder a gentileza',
      roteiro: 'Oi! Que bom te ver de novo. Esta é a sua lição do módulo avançado, e o tema é um cliente que todo mundo conhece: o cliente com pressa. Ele chega olhando o relógio, fala rápido e às vezes parece até mal-educado. Mas quase sempre não é nada contra você. Ele só está com o tempo apertado. E aqui vai um segredo: o cliente com pressa não quer ser atendido de qualquer jeito. Ele quer ser atendido rápido e bem. Então, o primeiro passo é mostrar que você entendeu. Diga: entendi, você está com pressa, vou ser rápido. Só essa frase já baixa a tensão. O segundo passo é ir direto ao ponto. Faça só as perguntas que importam e deixe a conversa longa para outro dia. O terceiro passo é dar previsão: em cinco minutos fica pronto, ou: hoje não consigo, mas amanhã às dez já está separado. Cliente com pressa odeia ficar sem saber quanto tempo vai esperar. E o que não fazer? Não demonstre irritação, não corra a ponto de errar e não deixe de cumprimentar. Pressa não é desculpa para o atendimento ficar frio. Se ele precisar ir embora antes de terminar, peça o WhatsApp e diga: eu te mando aqui e você resolve quando puder. Pronto, você salvou a venda e mostrou cuidado. Guarde esta frase: com o cliente apressado, seja rápido no serviço e calmo no jeito.',
      pratica: [['“Calma, já vou ver isso aí.”', '“Entendi que você está com pressa. Vou ser rápido.”'], ['“Não sei quanto tempo vai demorar.”', '“Em cerca de 10 minutos fica pronto. Pode ser?”'], ['“Então volta outro dia.”', '“Posso te mandar pelo WhatsApp e você resolve quando puder?”']],
      ler: ['Mostre que entendeu a pressa: isso já acalma.', 'Vá direto ao ponto, só com as perguntas que importam.', 'Sempre dê previsão de tempo.', 'Rápido no serviço, calmo no jeito: sem irritação e sem pular o cumprimento.'],
      desafio: 'Nos próximos dias, quando atender alguém com pressa, use a frase “vou ser rápido” e diga quanto tempo vai levar. Repare na reação do cliente.',
      pergunta: 'O que o cliente com pressa mais quer?', opcoes: ['Ser atendido rápido e bem, sabendo quanto vai esperar', 'Que o atendente pule o cumprimento para ganhar tempo', 'Um desconto para compensar a pressa'], certa: 0,
      frase: 'Com o cliente apressado, seja rápido no serviço e calmo no jeito.' },
    { n: 2, t: 'Dizer “não” sem perder o cliente', tema: 'Quando a resposta é não',
      roteiro: 'Oi! Lição nova no módulo avançado. Hoje vamos falar de uma situação difícil: quando você precisa dizer não. Não tem o produto. Não dá para fazer naquele prazo. Não é possível dar aquele desconto. Todo atendente passa por isso. O problema não é o não. O problema é o não seco, que fecha a porta. Compare: não tem. E agora: esse modelo acabou, mas chega na quinta-feira; posso separar um para você? As duas frases dizem a mesma coisa, mas a segunda mantém o cliente com você. A regra é simples: todo não vem acompanhado de uma alternativa. Pode ser outra data, outro produto parecido, um aviso quando chegar ou a indicação de quem pode ajudar. E quando não existe nenhuma alternativa? Aí seja sincero e gentil: infelizmente esse serviço a gente não faz, mas eu sei quem faz e posso te passar o contato. O cliente vai lembrar que você ajudou, mesmo sem vender. Mais dois cuidados. Explique o motivo em poucas palavras, sem culpar ninguém: não diga o fornecedor sempre atrasa ou o meu chefe não deixa. E nunca prometa o que não pode cumprir só para evitar o não agora. A promessa quebrada custa muito mais caro depois. Guarde esta frase: um não com alternativa vale mais do que um sim que não se cumpre.',
      pratica: [['“Não tem.”', '“Esse acabou, mas chega quinta. Quer que eu separe um para você?”'], ['“Meu chefe não deixa dar desconto.”', '“Nesse produto não consigo baixar o preço, mas posso parcelar sem juros.”'], ['“Isso a gente não faz.”', '“Esse serviço a gente não faz, mas posso te indicar quem faz.”']],
      ler: ['Todo “não” vem com uma alternativa.', 'Explique o motivo em poucas palavras, sem culpar ninguém.', 'Sem alternativa? Indique quem pode ajudar.', 'Nunca prometa o que não pode cumprir só para evitar o “não”.'],
      desafio: 'Nos próximos dias, toda vez que precisar dizer “não”, complete a frase com uma alternativa. Conte quantas vezes conseguiu.',
      pergunta: 'Qual é o jeito certo de dizer que um produto acabou?', opcoes: ['“Não tem, acabou.”', '“Acabou, mas chega quinta. Quer que eu separe um para você?”', '“Deve chegar amanhã” (mesmo sem ter certeza)'], certa: 1,
      frase: 'Um não com alternativa vale mais do que um sim que não se cumpre.' },
    { n: 3, t: 'Oferecer mais sem empurrar', tema: 'Venda complementar com cuidado',
      roteiro: 'Oi! Chegou a sua lição do módulo avançado. O tema de hoje é oferecer algo a mais para o cliente sem parecer que você está empurrando. Muita gente tem vergonha de oferecer, com medo de parecer chato. E muita gente oferece demais, e aí parece mesmo. O caminho certo fica no meio, e tem uma regra de ouro: só ofereça o que ajuda o cliente de verdade. Pense assim: quem troca o óleo pode precisar do filtro. Quem compra óculos pode precisar de uma capinha ou de um líquido de limpeza. Quem leva o cachorro para o banho pode gostar de um laço ou de um petisco. Isso não é empurrar. Isso é cuidar para o cliente não precisar voltar depois. Como fazer? Primeiro, ofereça uma coisa só, a mais útil, e não uma lista. Segundo, explique o porquê em uma frase: aproveitando que o carro está aqui, vale trocar o filtro também, porque ele está no prazo. Terceiro, aceite o não com tranquilidade: sem problema, fica para a próxima. Se o cliente disse não, não insista. Insistir transforma uma boa ideia em pressão. E um detalhe importante: o momento certo é depois que a necessidade principal foi resolvida. Primeiro você resolve o que ele veio buscar. Depois, com a confiança já criada, você sugere. Guarde esta frase: oferecer é cuidar, insistir é empurrar.',
      pratica: [['“Vai querer mais alguma coisa?”', '“Aproveitando, vale trocar o filtro também, que está no prazo.”'], ['“Leva esse, leva aquele, leva mais esse…”', 'Ofereça uma coisa só, a mais útil para ele.'], ['“Tem certeza? Vai ficar mais caro depois.”', '“Sem problema, fica para a próxima.”']],
      ler: ['Só ofereça o que ajuda o cliente de verdade.', 'Uma sugestão só, com o porquê em uma frase.', 'Primeiro resolva o que ele veio buscar; depois sugira.', 'Ouviu um “não”? Aceite com tranquilidade e não insista.'],
      desafio: 'Nos próximos dias, em cada atendimento, pense: “o que mais ajudaria este cliente?”. Ofereça uma única sugestão, com o motivo, e aceite a resposta.',
      pergunta: 'Qual atitude transforma uma boa sugestão em pressão?', opcoes: ['Explicar o motivo em uma frase', 'Esperar resolver o pedido principal antes de sugerir', 'Insistir depois que o cliente disse não'], certa: 2,
      frase: 'Oferecer é cuidar. Insistir é empurrar.' },
    { n: 4, t: 'Tom de voz e postura', tema: 'O que você diz sem falar',
      roteiro: 'Oi! Mais uma lição do módulo avançado. Hoje vamos falar do que você diz sem usar palavras. Você já reparou que dá para dizer bom dia de um jeito que acolhe e de um jeito que afasta? As palavras são as mesmas. O que muda é o tom de voz, o rosto e o corpo. E o cliente percebe tudo isso antes mesmo de ouvir o que você disse. Vamos começar pela postura. Braços cruzados, corpo virado para o outro lado e olhar no celular dizem: não estou disponível. Já o corpo virado para o cliente, as mãos à vista e um olhar atento dizem: estou aqui para você. Agora o rosto. Um sorriso sincero no começo do atendimento muda o clima da conversa. Não precisa ser sorriso de propaganda, basta um rosto tranquilo e simpático. E o tom de voz? Fale num volume que o cliente ouça bem, sem gritar e sem murmurar, e numa velocidade calma. Quando o cliente está nervoso, abaixe um pouco o tom e fale mais devagar. Isso ajuda a acalmar a conversa. No telefone e no áudio do WhatsApp, o sorriso também aparece: quem fala sorrindo soa mais simpático, mesmo sem ser visto. Faça um teste hoje: grave um áudio sorrindo e outro sério, e escute os dois. Guarde esta frase: o cliente ouve o seu jeito antes de ouvir as suas palavras.',
      pratica: [['Braços cruzados e olhar no celular', 'Corpo virado para o cliente e olhar atento'], ['Falar alto e rápido com o cliente nervoso', 'Abaixar um pouco o tom e falar mais devagar'], ['Áudio de WhatsApp com voz cansada', 'Gravar o áudio sorrindo: a simpatia aparece na voz']],
      ler: ['Postura aberta: corpo virado para o cliente, mãos à vista.', 'Rosto tranquilo e um sorriso sincero no começo.', 'Volume que o cliente ouça bem, sem gritar, numa velocidade calma.', 'Cliente nervoso: tom mais baixo e fala mais devagar.'],
      desafio: 'Nos próximos dias, grave dois áudios de teste no seu celular, um sorrindo e outro sério, e escute. Depois, atenda pelo menos um cliente pensando na sua postura do começo ao fim.',
      pergunta: 'Com um cliente nervoso, o que ajuda a acalmar a conversa?', opcoes: ['Falar mais alto para ele prestar atenção', 'Abaixar um pouco o tom e falar mais devagar', 'Cruzar os braços e esperar ele terminar'], certa: 1,
      frase: 'O cliente ouve o seu jeito antes de ouvir as suas palavras.' },
    { n: 5, t: 'O cliente indeciso', tema: 'Ajudar a escolher sem pressionar',
      roteiro: 'Oi! Chegou mais uma lição do módulo avançado. Hoje o tema é o cliente indeciso. Ele olha, pergunta, compara, pede para ver de novo e no fim diz: vou pensar. Muita gente fica impaciente ou começa a empurrar a opção mais cara. As duas coisas afastam o cliente. A indecisão quase sempre tem um motivo: medo de errar, opções demais ou falta de uma informação importante. O seu papel é tirar esse peso das costas dele. Comece perguntando para que ele vai usar. Por exemplo: é para o dia a dia ou para uma ocasião especial? Com a resposta, diminua as opções. Em vez de mostrar dez, mostre duas, e diga em uma frase a diferença entre elas. Depois, dê a sua opinião sincera: para o que você me contou, eu iria nesta, por causa disso. O cliente indeciso gosta de ouvir uma recomendação honesta. E se mesmo assim ele quiser pensar, tudo bem. Diga que ele pode voltar quando quiser e ofereça mandar as informações pelo WhatsApp. Quem sai sem pressão volta com confiança. Guarde esta frase: menos opções e uma recomendação sincera ajudam o cliente a decidir.',
      pratica: [['Mostrar todas as opções da loja', 'Mostrar duas opções e explicar a diferença em uma frase'], ['“Leva logo, essa é a melhor.”', '“Para o que você me contou, eu iria nesta, por causa disso.”'], ['“Mas vai pensar no quê?”', '“Fique à vontade. Quer que eu mande as opções pelo WhatsApp?”']],
      ler: ['Pergunte para que o cliente vai usar antes de mostrar opções.', 'Mostre no máximo duas ou três opções.', 'Dê uma recomendação sincera, com o motivo.', 'Se ele quiser pensar, respeite e ofereça mandar as informações.'],
      desafio: 'Nos próximos dias, quando um cliente ficar em dúvida, pergunte para que ele vai usar e mostre só duas opções. Repare se a decisão fica mais fácil.',
      pergunta: 'O que mais ajuda um cliente indeciso a escolher?', opcoes: ['Mostrar o máximo de opções possível', 'Diminuir as opções e dar uma recomendação sincera', 'Dizer que a promoção acaba hoje para ele decidir logo'], certa: 1,
      frase: 'Menos opções e uma recomendação sincera ajudam o cliente a decidir.' },
    { n: 6, t: 'Atender bem o cliente idoso', tema: 'Paciência, clareza e respeito',
      roteiro: 'Oi! Que bom te ver no módulo avançado. Hoje vamos falar do atendimento ao cliente idoso. Ele costuma ser fiel, indica a loja para a família e valoriza muito quem o trata com respeito. Mas basta um atendimento apressado para ele não voltar mais. O primeiro cuidado é o tempo. Não apresse. Deixe ele terminar de falar e responda com calma. O segundo é a clareza. Fale de frente, olhando para ele, num volume bom e sem gírias ou palavras técnicas. Em vez de dizer o sistema já gerou, diga: pronto, está anotado aqui. O terceiro é o respeito. Chame pelo nome, com senhor ou senhora se for o jeito da sua região, e nunca fale com ele como se fosse criança. Se ele estiver acompanhado, continue falando com ele, e não só com o acompanhante. E pense no conforto: ofereça uma cadeira, ajude com a sacola, confira se ele entendeu o valor e a forma de pagamento. Pequenos gestos fazem o cliente idoso se sentir em casa. Guarde esta frase: com o cliente idoso, a pressa é sua inimiga e a paciência é sua aliada.',
      pratica: [['Falar rápido e cheio de termos técnicos', 'Falar com calma, de frente, com palavras simples'], ['Falar só com o filho que acompanha', 'Continuar olhando e falando com o próprio cliente'], ['“Já expliquei isso, senhor.”', '“Vou explicar de outro jeito, sem problema.”']],
      ler: ['Dê tempo: deixe o cliente terminar de falar.', 'Fale de frente, num volume bom e com palavras simples.', 'Trate com respeito, nunca como criança.', 'Ofereça conforto: cadeira, ajuda com a sacola, conferir se entendeu.'],
      desafio: 'Nos próximos dias, ao atender um cliente idoso, faça um gesto de cuidado a mais: oferecer uma cadeira, ajudar com a sacola ou repetir o valor com calma.',
      pergunta: 'O cliente idoso chegou acompanhado do filho. Com quem você deve falar?', opcoes: ['Só com o filho, que entende mais rápido', 'Com o próprio cliente, incluindo o acompanhante na conversa', 'Com quem estiver com o cartão na mão'], certa: 1,
      frase: 'Com o cliente idoso, a pressa é sua inimiga e a paciência é sua aliada.' },
    { n: 7, t: 'O cliente grosseiro', tema: 'Manter a calma e o limite',
      roteiro: 'Oi! Chegou a lição do módulo avançado. Hoje o tema é difícil: o cliente grosseiro. Ele fala alto, reclama de tudo e às vezes é mal-educado com você. A primeira coisa a lembrar é que quase nunca é pessoal. Ele pode estar com um problema, com pressa ou já chegou irritado de outro lugar. Isso não justifica a grosseria, mas ajuda você a não entrar na briga. Respire e mantenha o tom calmo. Quando você não sobe o tom, a conversa tende a descer. Mostre que está ouvindo: entendo que isso te deixou chateado. Depois, vá para a solução: vamos ver o que eu consigo fazer agora. Evite discutir quem tem razão. O objetivo é resolver, não ganhar a discussão. Mas atenção: ser gentil não é aceitar tudo. Se o cliente passar do limite, com ofensa ou ameaça, diga com firmeza e calma: eu quero te ajudar, mas preciso que a gente converse com respeito. E se não melhorar, chame o responsável pela loja. Você não precisa resolver isso sozinho. Guarde esta frase: calma no tom, firmeza no limite, foco na solução.',
      pratica: [['Responder no mesmo tom de voz', 'Respirar e falar mais baixo e devagar'], ['“O senhor está errado.”', '“Entendo que isso te chateou. Vamos ver o que dá para fazer.”'], ['Aguentar ofensas calado', '“Quero te ajudar, mas preciso que a gente converse com respeito.”']],
      ler: ['Quase nunca é pessoal: não entre na briga.', 'Tom calmo e baixo ajuda a conversa a esfriar.', 'Mostre que ouviu e vá para a solução.', 'Passou do limite? Fale com firmeza e chame o responsável.'],
      desafio: 'Nos próximos dias, quando alguém chegar irritado, use a frase “entendo que isso te chateou, vamos ver o que dá para fazer” e repare na mudança do tom da conversa.',
      pergunta: 'O cliente começou a te ofender. O que fazer?', opcoes: ['Responder à altura para ele aprender', 'Pedir respeito com calma e, se não melhorar, chamar o responsável', 'Ficar calado e aguentar até ele ir embora'], certa: 1,
      frase: 'Calma no tom, firmeza no limite, foco na solução.' },
    { n: 8, t: 'Lembrar das preferências do cliente', tema: 'O detalhe que fideliza',
      roteiro: 'Oi! Mais uma lição do módulo avançado. Hoje o tema é um dos segredos dos clientes fiéis: lembrar das preferências. Pense numa loja onde você chega e alguém diz: oi, tudo bem? Vai ser aquele de sempre? Dá vontade de voltar, não dá? O cliente se sente conhecido, e não só mais um. Você não precisa ter memória de elefante. Precisa prestar atenção e anotar. Repare no que o cliente sempre pede, no tamanho, na marca, no horário que ele prefere, no nome do filho ou do cachorro que ele comentou. Anote no cadastro dele, no sistema da loja ou no Cliente Assistido. Na próxima visita, use essa informação com naturalidade: da última vez você levou o modelo azul, chegou um novo nessa cor. Ou no WhatsApp: oi, Dona Maria, chegou aquele café que a senhora gosta. Só tome um cuidado: use o que o cliente contou de forma leve e respeitosa. Nada de assuntos íntimos, e nada que pareça que você está vigiando. Guarde esta frase: o cliente volta onde é lembrado.',
      pratica: [['“Qual é o seu nome mesmo?”', '“Oi, Seu José! Vai ser aquele de sempre?”'], ['Confiar só na memória', 'Anotar a preferência no cadastro do cliente'], ['Comentar um assunto íntimo que ele contou', 'Usar só o que ajuda no atendimento, com leveza']],
      ler: ['Preste atenção no que o cliente sempre pede.', 'Anote as preferências no cadastro dele.', 'Use a informação com naturalidade na próxima visita ou mensagem.', 'Respeite a privacidade: nada de assuntos íntimos.'],
      desafio: 'Nos próximos dias, anote uma preferência de pelo menos três clientes e use uma delas no próximo atendimento ou mensagem.',
      pergunta: 'Qual é o melhor jeito de lembrar das preferências dos clientes?', opcoes: ['Confiar na memória', 'Anotar no cadastro e usar com naturalidade', 'Perguntar tudo de novo a cada visita'], certa: 1,
      frase: 'O cliente volta onde é lembrado.' }
  ];
  window.CA_SEMANAIS = L;

  const A = () => window.CA_treinoAPI;
  const esc = t => A().esc(t);
  // 1.74.1: VER_TUDO = exceção por e-mail para ver todas as lições (visão geral), como o admin, mesmo com outro papel. Pedido do Marcos em 11/11/2026.
  const VER_TUDO = ['grupomarcosnascimento@gmail.com'];
  // 1.74.6: LIGADO = false desliga o módulo avançado para lojas e alunos (pedido do Marcos em 11/11/2026: vai ser
  // renegociado). Tudo continua funcionando; o admin e os e-mails de VER_TUDO seguem vendo para testar. Para religar: true
  // (e reativar o pg_cron 'avancado-aviso').
  const LIGADO = false;
  const admin = () => A().ACC().papel === 'admin' || VER_TUDO.includes(String(A().ACC().email || '').toLowerCase());
  const ligado = () => LIGADO || !!(A() && admin());
  window.CA_semLigado = () => ligado();
  const visivel = () => !!(A() && A().pode());
  const dono = () => !!(A() && A().dono && A().dono()); // 1.74.3: dono da loja vê o conteúdo e acompanha a equipe
  const INTERVALO = 15; // dias entre uma lição e a próxima (decisão do Marcos, 11/11/2026)
  const dLocal = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const fmt = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const totBasico = () => (window.CA_TRILHA1 || { licoes: [] }).licoes.length;
  const MOD = 'Módulo avançado';

  // Datas de liberação de cada lição para esta pessoa (null = ainda não concluiu o básico).
  // Lição N = dia em que concluiu o básico + 15 × N dias, às 9h.
  function agenda() {
    const p = A().prog();
    if (!p.concluiu || Object.keys(p.feitas || {}).length < totBasico()) return null;
    const base = new Date(String(p.concluiu).slice(0, 10) + 'T09:00:00');
    return L.map((l, i) => { const d = new Date(base); d.setDate(d.getDate() + INTERVALO * (i + 1)); return d; });
  }
  const semFeitas = () => A().prog().sem || {};
  const liberadaN = (n, ag) => admin() || dono() || !!(ag && ag[n - 1] && Date.now() >= ag[n - 1].getTime());
  const liberadas = ag => L.filter(l => liberadaN(l.n, ag));

  // Chamada na tela inicial do curso (Hoje): só um atalho para o menu Avançado.
  // 1.74.2: o módulo avançado só aparece depois de concluir o básico (regra do Marcos); admin e VER_TUDO sempre.
  window.CA_semAberto = () => !!(A() && ligado() && visivel() && (admin() || agenda()));

  window.CA_semBloco = function () {
    if (!window.CA_semAberto()) return '';
    const ag = agenda(), f = semFeitas(), lib = liberadas(ag), nova = lib.find(l => !f[l.n]);
    let tx;
    if (admin()) tx = `Como admin, você vê as ${L.length} lições para revisar.`;
    else if (!ag) tx = 'Quando você concluir este curso, abre o módulo avançado: uma lição nova a cada 15 dias.';
    else if (nova) tx = `Lição nova disponível: <b>${esc(nova.t)}</b>.`;
    else { const prox = ag.find(d => d.getTime() > Date.now()); tx = prox ? `Próxima lição em <b>${esc(fmt(prox))}</b>.` : 'Você está em dia com o módulo avançado.'; }
    return `<div class="card semCard semChamada"><h3>🚀 ${MOD}</h3><p class="small" style="margin:0 0 8px">${tx}</p>${ag || admin() ? '<button class="primary" data-curso="avancado">Abrir o módulo avançado</button>' : ''}</div>`;
  };

  // Página do menu Avançado (#tabsCurso → data-curso="avancado")
  window.CA_semModulo = function () {
    if (dono() && !admin()) return donoHTML();
    if (!visivel()) return '<div class="card"><p class="mut">O módulo avançado ainda não está liberado para você.</p></div>';
    const ag = agenda(), f = semFeitas(), lib = liberadas(ag);
    const feitas = lib.filter(l => f[l.n]).length;
    if (!ag && !admin()) { // 1.74.3: aba visível, mas bloqueada até concluir o básico (pedido do Marcos)
      const tot = totBasico(), fb = Math.min(tot, Object.keys(A().prog().feitas || {}).length), pc = tot ? Math.round(fb * 100 / tot) : 0;
      return `<div class="card semCard semTrava"><h3>🚀 ${MOD}</h3>
      <div class="semCadeado">🔒</div>
      <p class="semTravaTit"><b>Será liberado após a conclusão do módulo básico.</b></p>
      <p class="small">Você já fez <b>${fb} de ${tot}</b> lições do curso <b>${esc((window.CA_CURSO || {}).nome || 'Cliente Encantado')}</b>.</p>
      <div class="rodBar"><i style="width:${pc}%"></i></div>
      <p class="mut small">Depois do básico, chega uma lição nova a cada 15 dias, de cerca de 6 minutos, com temas como o cliente com pressa, o cliente indeciso e o cliente grosseiro. Você recebe um aviso em Alertas.</p>
      <button class="primary" data-curso="hoje">Continuar o módulo básico</button>${pushBloco()}</div>`;
    }
    const prox = ag ? ag.find(d => d.getTime() > Date.now()) : null;
    const itens = lib.map(l => {
      const feita = f[l.n];
      return `<div class="it trIt${feita ? ' feita' : ''}"><div class="t"><b>Lição ${l.n}. ${esc(l.t)}</b><small>${feita ? '✓ concluída' : '🆕 nova · cerca de 6 min · ' + esc(l.tema)}</small></div><button data-sem-abrir="${l.n}">${feita ? 'Rever' : 'Abrir'}</button></div>`;
    }).join('');
    const proxTx = admin() ? `<p class="small mut">Como admin, você vê todas as ${L.length} lições. O aluno vê uma nova a cada 15 dias depois de concluir o básico.</p>`
      : prox ? `<div class="semProx">🔒 Próxima lição chega em <b>${esc(fmt(prox))}</b>. Você recebe um aviso em Alertas.</div>`
      : '<div class="semProx">Você fez todas as lições lançadas até agora. As próximas chegam em breve.</div>';
    return `<div class="card semCard"><h3>🚀 ${MOD}</h3>
      <p class="small mut" style="margin:0 0 8px">Uma lição nova a cada 15 dias para continuar evoluindo no atendimento. O curso básico continua disponível no menu Hoje.</p>
      ${lib.length ? `<p class="small" style="margin:0 0 6px"><b>${feitas} de ${lib.length}</b> ${lib.length === 1 ? 'lição liberada feita' : 'lições liberadas feitas'}</p>` : ''}
      ${itens || '<p class="mut small">A primeira lição ainda não chegou.</p>'}
      ${proxTx}${admin() ? '' : pushBloco()}</div>`;
  };

  // 1.74.4: AVISO NO CELULAR (Web Push) quando a lição nova libera. O servidor (pg_cron 'avancado-aviso', 9h05 de Brasília,
  // daily-reminder mode 'avancado' + rpc avancado_liberadas_hoje) manda para todos os aparelhos da pessoa em push_subscriptions.
  // Aqui o aluno liga o aviso: assina o push e grava a linha com active=false (não liga o lembrete diário de campanhas);
  // se o aparelho já tem linha (lembrete diário ligado), não mexe nela.
  const VAPID = 'BIxs_Wu4qFAnzVYa7WH__ycMCkYfRxnYnut2DdtuWy0hQCKRU9BbEwjveg_MUOUo4u3bGZMootzNWuuAgg83wcI';
  const pushOK = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const b64 = s => { const p = '='.repeat((4 - s.length % 4) % 4); const r = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(r, c => c.charCodeAt(0)); };
  const swPronto = () => Promise.race([navigator.serviceWorker.ready, new Promise((_, rej) => setTimeout(() => rej(new Error('sw')), 6000))]);
  function pushBloco() { if (!pushOK()) return ''; setTimeout(pushEstado, 0); return '<div id="semPush" class="semPush"></div>'; }
  async function pushEstado(msg) {
    try {
      const reg = await swPronto(), sub = await reg.pushManager.getSubscription();
      let tem = false;
      if (sub && Notification.permission === 'granted') { const { data } = await A().SB().from('push_subscriptions').select('id').eq('endpoint', sub.endpoint).maybeSingle(); tem = !!data; }
      const el = document.getElementById('semPush'); if (!el) return;
      el.innerHTML = (msg ? `<p class="small">${msg}</p>` : '') + (tem ? '<p class="small semPushOk">🔔 Aviso no celular ligado: você fica sabendo quando chegar lição nova.</p>'
        : Notification.permission === 'denied' ? '<p class="small mut">As notificações estão bloqueadas neste celular. Para receber o aviso de lição nova, libere as notificações do site nas configurações do navegador.</p>'
        : '<button class="semPushBtn" data-sem-push="1">🔔 Avisar no meu celular quando chegar lição nova</button>');
    } catch (e) { const el = document.getElementById('semPush'); if (el) el.innerHTML = ''; }
  }
  async function ligarPush(btn) {
    btn.disabled = true; btn.textContent = 'Ligando…';
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return pushEstado('Sem permissão para avisos. Toque em "Permitir" quando o celular perguntar.');
      const reg = await swPronto();
      let sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(VAPID) });
      const j = sub.toJSON(), sb = A().SB();
      const { data: ja } = await sb.from('push_subscriptions').select('id').eq('endpoint', j.endpoint).maybeSingle();
      if (!ja) {
        const { error } = await sb.from('push_subscriptions').insert({ user_email: String(A().ACC().email || '').toLowerCase(), endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, hour: 9, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo', active: false });
        if (error) throw error;
      }
      sb.functions.invoke('daily-reminder', { body: { mode: 'test_avancado' } }).catch(() => {});
      pushEstado('Pronto! Mandamos um aviso de teste para este celular.');
    } catch (e) { pushEstado('Não foi possível ligar o aviso agora. Tente de novo em instantes.'); }
  }
  // Link do aviso (/?ver=avancado): abre o módulo do curso no menu Avançado.
  if (new URLSearchParams(location.search).get('ver') === 'avancado') {
    let tent = 0;
    const ir = () => {
      if (++tent > 30) return;
      const t = document.querySelector('#tabsCurso [data-curso="avancado"]');
      if (!document.body.classList.contains('modoTreino') && window.CA_abrirModuloTreino && window.CA_ACCESS) window.CA_abrirModuloTreino();
      if (t && !t.classList.contains('hide') && document.body.classList.contains('modoTreino')) { t.click(); return; }
      setTimeout(ir, 500);
    };
    setTimeout(ir, 1200);
  }

  // 1.74.3: VISÃO DO DONO (pedido do Marcos): conteúdo do módulo (pode abrir todas para conhecer) + acompanhamento da equipe
  // no básico e no avançado (quem concluiu o básico, lições liberadas, feitas, pendentes e a próxima data de cada pessoa).
  function donoHTML() {
    const itens = L.map(l => `<div class="it trIt"><div class="t"><b>Lição ${l.n}. ${esc(l.t)}</b><small>${esc(l.tema)} · libera ${l.n * INTERVALO} dias depois do básico</small></div><button data-sem-abrir="${l.n}">Ver</button></div>`).join('');
    setTimeout(carregarEquipe, 0);
    return `<div class="card semCard"><h3>🚀 ${MOD} · visão do dono</h3>
      <p class="small mut" style="margin:0 0 8px">Depois que a pessoa conclui o curso básico, recebe uma lição nova a cada ${INTERVALO} dias, com aviso em Alertas. Ela nunca vê todas de uma vez; você vê todas aqui.</p>
      <h4 class="semSub">Acompanhamento da equipe</h4><div id="semEq"><p class="mut small">Carregando a equipe…</p></div></div>
      <details class="card semCard semConteudo"><summary><b>📚 Conteúdo do módulo (${L.length} lições)</b></summary>${itens}</details>`;
  }
  const libDesde = iso => { const b = new Date(String(iso).slice(0, 10) + 'T09:00:00'); return L.map((l, i) => { const d = new Date(b); d.setDate(d.getDate() + INTERVALO * (i + 1)); return d; }); };
  const dia = iso => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('pt-BR'); };
  async function carregarEquipe() {
    const el = document.getElementById('semEq'); if (!el) return;
    const sb = A().SB(), loja = A().LOJA(), T = A().trilha && A().trilha();
    if (!sb || !loja || !loja.id || !T) { el.innerHTML = '<p class="mut small">Sem conexão agora. Tente de novo em instantes.</p>'; return; }
    const [ru, rp] = await Promise.all([
      sb.from('app_users').select('email,name,active').eq('store_id', loja.id),
      sb.from('training_progress').select('user_email,licao,done_at,trilha').eq('store_id', loja.id).in('trilha', [T.id, TRILHA])
    ]);
    const box = document.getElementById('semEq'); if (!box) return;
    if (ru.error || rp.error) { box.innerHTML = '<p class="mut small">Não foi possível carregar a equipe agora.</p>'; return; }
    const tot = T.licoes.length, eu = String(A().ACC().email || '').toLowerCase(), bas = {}, av = {};
    (rp.data || []).forEach(r => { const k = String(r.user_email || '').toLowerCase();
      if (r.trilha === TRILHA) { (av[k] = av[k] || {})[r.licao] = r.done_at; return; }
      const b = bas[k] = bas[k] || { n: 0, ult: '' }; b.n++; if (r.done_at > b.ult) b.ult = r.done_at; });
    const pessoas = (ru.data || []).filter(u => u.active && (String(u.email).toLowerCase() !== eu || bas[eu]));
    if (!pessoas.length) { box.innerHTML = '<p class="mut small">Ninguém da equipe com o curso ainda.</p>'; return; }
    let concl = 0, emDia = 0, pend = 0;
    const linhas = pessoas.map(u => {
      const k = String(u.email).toLowerCase(), b = bas[k] || { n: 0 }, nome = esc(u.name || u.email);
      if (b.n < tot) return { o: 2, h: `<div class="it semEqIt"><div class="t"><b>${nome}</b><small>Básico: ${b.n} de ${tot} lições · 🔒 avançado abre quando concluir</small></div><span class="tag">básico</span></div>` };
      concl++;
      const ag = libDesde(b.ult), lib = ag.filter(d => Date.now() >= d.getTime()).length, f = Object.keys(av[k] || {}).filter(n => +n <= lib).length;
      const falta = lib - f, prox = ag.find(d => d.getTime() > Date.now());
      if (falta) pend++; else emDia++;
      const tag = !lib ? '<span class="tag">aguardando a 1ª</span>' : falta ? `<span class="tag semPend">${falta} pendente${falta > 1 ? 's' : ''}</span>` : '<span class="tag semOk">em dia</span>';
      return { o: falta ? 0 : 1, h: `<div class="it semEqIt"><div class="t"><b>${nome}</b><small>🎓 Básico concluído em ${dia(b.ult)}<br>🚀 Avançado: ${lib ? `<strong>${f} de ${lib}</strong> ${lib === 1 ? 'lição liberada feita' : 'lições liberadas feitas'}${prox ? ` · próxima em ${fmt(prox)}` : ' · todas liberadas'}` : `1ª lição chega em ${fmt(prox)}`}</small></div>${tag}</div>` };
    }).sort((a, b) => a.o - b.o).map(x => x.h).join('');
    box.innerHTML = `<p class="small" style="margin:0 0 8px"><b>${concl} de ${pessoas.length}</b> concluíram o básico · <b>${emDia}</b> em dia no avançado${pend ? ` · <b>${pend}</b> com lição pendente` : ''}</p>${linhas}`;
  }

  // Central de alertas: uma lição nova liberada vira alerta (pendente até concluir).
  if (window.CA_alertasFonte) window.CA_alertasFonte(() => {
    if (!A() || !ligado() || !visivel() || admin() || dono()) return [];
    const ag = agenda(); if (!ag) return [];
    const f = semFeitas();
    return liberadas(ag).map(l => ({
      id: 'avancado-' + l.n, ico: '🚀', nivel: 'info', em: ag[l.n - 1].toISOString(), pendente: !f[l.n],
      titulo: `Nova lição no módulo avançado: ${l.t}`,
      texto: f[l.n] ? 'Você já concluiu esta lição.' : `${l.tema}. Leva cerca de 6 minutos.`,
      acao: f[l.n] ? null : { rotulo: 'Abrir agora', fn: () => { const t = document.querySelector('#tabsCurso [data-curso="avancado"]'); if (t) t.click(); setTimeout(() => abrir(l.n), 50); } }
    }));
  });

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
        <button class="linkbtn" data-sem-voltar="1">← Voltar ao módulo avançado</button>
        <p class="mut small" style="margin:6px 0 0">🚀 Módulo avançado · Lição ${n} · ⏱ cerca de 6 minutos</p>
        <h3 style="margin:4px 0 2px">${esc(l.t)}</h3><p class="small mut" style="margin:0 0 6px">${esc(l.tema)}</p>
        <h4 class="trPasso">🎧 Ouça</h4>
        ${'speechSynthesis' in window ? '<div class="row wrap"><button class="primary" data-sem-ouvir="' + n + '">▶️ Ouvir a lição</button><button class="hide" data-sem-parar="1">⏹ Parar</button></div>' : '<p class="mut small">Este celular não lê em voz alta. Leia o texto abaixo.</p>'}
        <details class="trRot"><summary>Ver o texto do áudio</summary><p class="small">${esc(l.roteiro)}</p></details>
        <div class="trCartao"><span>“${esc(l.frase)}”</span><small>Módulo avançado · ${(window.CA_CURSO || {}).nome || 'Cliente Encantado'}</small></div>
        <h4 class="trPasso">🔁 Na prática</h4>
        <div class="semPrat">${l.pratica.map(([a, b]) => `<div class="semPar"><div class="semNao"><small>❌ Em vez de</small>${esc(a)}</div><div class="semSim"><small>✅ Faça assim</small>${esc(b)}</div></div>`).join('')}</div>
        <h4 class="trPasso">📖 Leia</h4><ul class="trLer">${l.ler.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h4 class="trPasso">✅ Pratique nos próximos dias</h4><p class="trDesafio">${esc(l.desafio)}</p>
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
    const pb = e.target.closest('[data-sem-push]'); if (pb && !pb.disabled) { ligarPush(pb); return; }
    const a = e.target.closest('[data-sem-abrir]');
    if (a) { parar(); abrir(+a.dataset.semAbrir); return; }
    if (e.target.closest('[data-sem-voltar]')) { parar(); const t = document.querySelector('#tabsCurso [data-curso="avancado"]'); if (t && !t.classList.contains('hide')) t.click(); else { A().render(); A().irAoTopo(); } return; }
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
      $('#semConclMsg').innerHTML = '<span class="rodOk">Lição concluída! A próxima chega em 15 dias, com aviso em Alertas. 👋</span> <button data-sem-voltar="1">Voltar ao módulo avançado</button>';
    }
  });
  // Sair da aba ou fechar o bloco do curso para a voz
  document.addEventListener('visibilitychange', () => { if (document.hidden) parar(); });
})();
