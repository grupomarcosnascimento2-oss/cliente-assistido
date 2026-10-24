/* Cliente Assistido – Treino, Trilha 1 "Atendimento que fideliza" (conteúdo, versão 1.26.0).
   Fonte: documento "Treinador digital de atendimento – estrutura do curso", aba "Conteúdo – Trilha 1".
   audio: caminho de um arquivo gravado (ex.: '/audio/t1-l1.mp3'); vazio = o app lê o roteiro com a voz do celular. */
'use strict';
window.CA_TRILHA1 = {
  id: 't1', nome: 'Atendimento que fideliza', horas: 2,
  licoes: [
    { n: 1, t: 'Por que o cliente volta (ou não)', audio: '',
      roteiro: 'Oi, tudo bem? Aqui é o Marcos, do Cliente Assistido. Vamos começar com uma pergunta simples: por que um cliente volta a uma loja? Muita gente acha que é o preço. O preço conta, claro. Mas pense em você mesmo. Qual é a loja, a oficina ou o salão que você sempre volta? Na maioria das vezes, é aquele lugar onde você é bem recebido, onde alguém lembra de você e onde você sente que pode confiar. O cliente que não volta quase nunca reclama. Ele simplesmente some. Muitas vezes porque foi atendido com pressa, porque ninguém olhou para ele, ou porque saiu sem ter certeza de que o problema foi resolvido. E o pior: ele conta essa experiência para os amigos. Já o cliente que sai satisfeito volta, compra de novo e indica a loja. Por isso, conquistar um cliente novo dá muito mais trabalho do que manter quem já conhece a loja. E aqui está a parte boa: o atendimento depende de você. Não é preciso desconto nem promoção. É preciso atenção, educação e cuidado com cada pessoa que entra pela porta ou chama no WhatsApp. Nas próximas lições, a gente vai ver como fazer isso no dia a dia. Por hoje, guarde esta frase: cliente bem atendido volta. Cliente lembrado volta mais.',
      cartao: 'Cliente bem atendido volta. Cliente lembrado volta mais.',
      ler: ['O cliente que não volta raramente reclama: ele some e conta para os outros.', 'Atendimento pesa tanto quanto o preço na decisão de voltar.', 'Manter um cliente custa menos do que conquistar um novo.', 'Bom atendimento não depende de desconto: depende de atenção e cuidado.'],
      desafio: 'Observe um atendimento (seu ou de um colega) e anote uma coisa que deixou o cliente satisfeito.',
      pergunta: 'Um cliente foi atendido com pressa e saiu sem reclamar. O que é mais provável que aconteça?',
      opcoes: ['Ele volta normalmente, já que não reclamou.', 'Ele pode não voltar e ainda comentar com outras pessoas.', 'Ele vai ligar para fazer uma reclamação formal.'], certa: 1 },
    { n: 2, t: 'O primeiro minuto', audio: '',
      roteiro: 'Oi! Hoje a gente vai falar do momento mais importante do atendimento: o primeiro minuto. Quando um cliente chega, ele decide muito rápido se está num lugar bom. Antes de saber o preço, antes de ver o serviço, ele já percebeu se foi notado ou ignorado. Imagine a cena: o cliente entra, fica parado no balcão, e ninguém olha para ele. Todo mundo está ocupado. Dois minutos parecem dez. Mesmo que depois ele seja muito bem atendido, aquele começo já deixou uma marca. Agora imagine o contrário: ele entra e alguém levanta o olhar, sorri e diz: bom dia, já vou te atender. Pronto. Mesmo que precise esperar um pouco, ele se sente respeitado. O primeiro minuto tem três partes simples. Primeiro, perceba o cliente logo que ele chegar, mesmo que esteja ocupado: um olhar e um já te atendo já resolvem. Segundo, cumprimente com educação: bom dia, boa tarde, seja bem-vindo. Terceiro, dê atenção de verdade: largue o celular, olhe para a pessoa e escute. Não é preciso texto decorado. É preciso atenção. Guarde esta frase: os primeiros sessenta segundos decidem a visita.',
      cartao: 'Os primeiros 60 segundos decidem a visita.',
      ler: ['Perceba o cliente assim que ele chegar, mesmo ocupado: "já te atendo".', 'Cumprimente sempre: bom dia, boa tarde, seja bem-vindo.', 'Celular de lado e olhar na pessoa enquanto ela fala.', 'Esperar com atenção é diferente de esperar ignorado.'],
      desafio: 'Cumprimente todo cliente em até 10 segundos depois que ele chegar, mesmo que não possa atender na hora.',
      pergunta: 'Você está atendendo um cliente e outro chega ao balcão. O que fazer?',
      opcoes: ['Continuar o atendimento e só falar com o novo cliente quando terminar.', 'Olhar para o novo cliente, cumprimentar e avisar que já vai atendê-lo.', 'Interromper o atendimento atual para atender quem chegou.'], certa: 1 },
    { n: 3, t: 'Chamar pelo nome', audio: '',
      roteiro: 'Oi! Hoje vamos falar de uma coisa pequena que faz uma diferença enorme: o nome do cliente. Pense em quando alguém lembrou o seu nome num lugar onde você não esperava. Você se sentiu importante, não foi? É isso que o cliente sente quando é chamado pelo nome. Chamar pelo nome mostra que ele não é só mais um. Mostra que a loja conhece e lembra dele. E cliente que se sente conhecido confia mais e volta mais. Como fazer isso no dia a dia? Primeiro, pergunte o nome logo no começo, com naturalidade: qual é o seu nome? Segundo, use o nome durante a conversa, sem exagero: duas ou três vezes já é suficiente. Terceiro, na próxima visita, tente lembrar: o nome, o carro, o último serviço, alguma coisa que ele contou. E se esquecer? Tudo bem. É melhor perguntar de novo com um sorriso, me lembra o seu nome?, do que chamar de amigo ou chefe o tempo todo. O Cliente Assistido ajuda nisso: as mensagens já vão com o nome de cada cliente. Mas no balcão, quem lembra é você. Guarde esta frase: o nome do cliente é a palavra mais bonita do atendimento.',
      cartao: 'O nome do cliente é a palavra mais bonita do atendimento.',
      ler: ['Pergunte o nome no começo do atendimento.', 'Use o nome duas ou três vezes na conversa, sem exagero.', 'Na volta do cliente, lembre algo dele: o carro, o serviço, uma conversa.', 'Esqueceu? Pergunte de novo com gentileza. Evite "amigo" e "chefe".'],
      desafio: 'Pergunte e use o nome de pelo menos 3 clientes hoje.',
      pergunta: 'Um cliente que já veio antes volta à loja e você não lembra o nome dele. O que fazer?',
      opcoes: ['Chamá-lo de "amigo" para disfarçar.', 'Perguntar com gentileza: "Me lembra o seu nome?"', 'Evitar falar o nome durante todo o atendimento.'], certa: 1 },
    { n: 4, t: 'Ouvir antes de oferecer', audio: '',
      roteiro: 'Oi! Hoje o assunto é ouvir. Parece simples, mas é onde muita venda se perde. Sabe quando o cliente começa a falar e a gente já sabe o que vai oferecer? Às vezes acerta. Mas muitas vezes o cliente queria outra coisa, e sai achando que ninguém prestou atenção nele. Quem ouve bem vende melhor, porque entende o que o cliente realmente precisa. E o cliente sente que foi tratado como pessoa, não como mais uma venda. Como ouvir de verdade? Primeiro, deixe o cliente terminar de falar, sem interromper. Segundo, faça perguntas: desde quando isso acontece? Você usa o carro mais na cidade ou na estrada? O que é mais importante pra você? Terceiro, repita com suas palavras o que entendeu: então o barulho aparece quando freia, certo? Só depois disso, ofereça a solução. E ofereça o que faz sentido para ele. Quando o cliente percebe que você indicou o que ele precisa, e não o mais caro, ele confia. E cliente que confia volta. Guarde esta frase: quem pergunta bem, vende melhor.',
      cartao: 'Quem pergunta bem, vende melhor.',
      ler: ['Deixe o cliente terminar de falar.', 'Faça pelo menos duas perguntas antes de oferecer algo.', 'Repita o que entendeu para confirmar.', 'Ofereça o que resolve o problema dele, não o mais caro.'],
      desafio: 'Antes de oferecer qualquer produto ou serviço, faça duas perguntas ao cliente.',
      pergunta: 'O cliente diz: "Meu carro está fazendo um barulho estranho". Qual é o melhor primeiro passo?',
      opcoes: ['Oferecer logo a revisão completa.', 'Perguntar quando o barulho aparece e desde quando acontece.', 'Dizer que deve ser normal e que não precisa se preocupar.'], certa: 1 },
    { n: 5, t: 'Quando algo dá errado', audio: '',
      roteiro: 'Oi! Hoje vamos falar de uma situação que todo mundo enfrenta: quando algo dá errado. Um serviço atrasa. Uma peça não chega. O cliente não gosta do resultado. Acontece em toda loja. O que separa uma loja boa de uma ruim não é nunca errar: é como ela resolve quando erra. Um fato curioso: o cliente que tem um problema bem resolvido costuma ficar ainda mais fiel do que aquele que nunca teve problema nenhum. Porque ele viu, na prática, que pode confiar em você. Quando o cliente chegar chateado, siga quatro passos. Primeiro, ouça até o fim, sem interromper e sem se defender. Ele precisa desabafar. Segundo, peça desculpas pelo transtorno: sinto muito por isso, entendo a sua chateação. Pedir desculpas não é assumir culpa de tudo, é mostrar respeito. Terceiro, diga o que vai fazer e quando: vou ver com o mecânico agora e te dou um retorno até as quatro horas. Quarto, cumpra. E, se puder, dê o retorno antes do prometido. E o que não fazer? Não discutir, não culpar o colega, o fornecedor ou o próprio cliente. E nunca deixar o cliente sem resposta. Guarde esta frase: reclamação bem resolvida vira fidelidade.',
      cartao: 'Reclamação bem resolvida vira fidelidade.',
      ler: ['Ouça até o fim, sem se defender.', 'Peça desculpas pelo transtorno.', 'Diga o que vai fazer e até quando, e cumpra.', 'Não discuta e não culpe ninguém na frente do cliente.'],
      desafio: 'Na próxima reclamação, siga os quatro passos: ouvir, pedir desculpas, dizer o que vai fazer e cumprir.',
      pergunta: 'O cliente chega irritado porque o carro não ficou pronto no horário combinado. O que fazer primeiro?',
      opcoes: ['Explicar que a culpa foi do fornecedor da peça.', 'Ouvir até o fim e pedir desculpas pelo transtorno.', 'Oferecer um desconto na hora para encerrar o assunto.'], certa: 1 },
    { n: 6, t: 'Atendimento pelo WhatsApp', audio: '',
      roteiro: 'Oi! Hoje a gente vai falar do balcão que fica no bolso de todo cliente: o WhatsApp. Hoje, muito cliente chega primeiro pelo WhatsApp. Ele pergunta preço, horário, se tem vaga. E a forma como você responde é a primeira impressão da loja, igualzinho ao primeiro minuto no balcão. Três coisas fazem toda a diferença. A primeira é rapidez. Cliente que espera horas por uma resposta procura outra loja. Se não dá para resolver na hora, responda pelo menos: oi, João! Já vou verificar e te retorno em instantes. A segunda é gentileza por escrito. Cumprimente, use o nome, agradeça. Evite gíria, palavrão e mensagem atravessada. No texto, o tom de voz não aparece, então seja ainda mais educado do que seria pessoalmente. A terceira é clareza. Mensagens curtas e diretas. Prefira texto a áudio longo: muita gente não pode ouvir áudio na hora. E sempre termine dizendo o próximo passo: posso agendar para amanhã às nove? E um cuidado importante: se o cliente pedir para não receber mensagens, respeite. Relacionamento é confiança, não insistência. Guarde esta frase: resposta rápida mostra que você se importa.',
      cartao: 'Resposta rápida mostra que você se importa.',
      ler: ['Responda rápido; se não souber na hora, avise que já retorna.', 'Cumprimente, use o nome e agradeça.', 'Mensagens curtas; evite áudio longo e gíria.', 'Termine sempre com o próximo passo.', 'Quem pediu para não receber mensagens não recebe.'],
      desafio: 'Responda toda mensagem de cliente em até 15 minutos durante o horário de trabalho.',
      pergunta: 'Um cliente pergunta o preço de um serviço pelo WhatsApp e você precisa confirmar com o responsável. O que fazer?',
      opcoes: ['Esperar ter o preço certo para só então responder.', 'Responder logo que vai verificar e retornar em instantes, e depois retornar.', 'Mandar um áudio longo explicando todos os serviços da loja.'], certa: 1 },
    { n: 7, t: 'Depois da compra', audio: '',
      roteiro: 'Oi! Chegamos à última lição da trilha. E ela fala do momento que quase todo mundo esquece: depois que o cliente vai embora. A maioria das lojas atende bem, recebe o pagamento e pronto. Só volta a falar com o cliente quando ele aparece de novo, se aparecer. Só que, nesse meio-tempo, outras lojas estão lembrando dele. O relacionamento continua depois da venda. Um como ficou? uma semana depois do serviço mostra que você se importa com o resultado, não só com a venda. Um parabéns no dia do aniversário é lembrado por muito tempo. E um aviso na hora certa, como a troca de óleo do seu carro está chegando, faz o cliente voltar sem precisar de promoção. É exatamente para isso que a loja usa o Cliente Assistido: para ninguém ficar esquecido. O app mostra todo dia para quem mandar mensagem, já com o texto pronto e o nome do cliente. Você só confere e envia, sempre com uma pessoa por trás, nunca um robô. E quando o cliente responder, responda rápido e com carinho, como vimos na lição anterior. Se ele mostrar interesse em comprar, avise o responsável na hora. Você chegou ao fim da trilha. Agora junte tudo: receba bem, chame pelo nome, ouça, resolva os problemas com cuidado, responda rápido e lembre o cliente depois. Porque quem é lembrado, vende mais.',
      cartao: 'Quem é lembrado, vende mais.',
      ler: ['O relacionamento continua depois da venda.', 'Um "como ficou?" uma semana depois mostra cuidado com o resultado.', 'Parabéns no aniversário e avisos na hora certa trazem o cliente de volta.', 'O Cliente Assistido mostra para quem mandar mensagem todo dia; o envio é sempre feito por uma pessoa.', 'Cliente respondeu com interesse? Avise o responsável na hora.'],
      desafio: 'Mande um "como ficou?" para um cliente atendido nesta semana.',
      pergunta: 'Um cliente fez a troca de óleo há uma semana. Qual é a melhor atitude da loja?',
      opcoes: ['Esperar ele voltar na próxima troca.', 'Mandar uma mensagem perguntando como ficou o carro.', 'Mandar uma promoção de outros serviços todos os dias.'], certa: 1 }
  ]
};

/* 1.28.0: números de pesquisas (com fonte) — quadro "O que dizem as pesquisas" em cada lição e "Por que este treinamento
   importa" na tela inicial do Treino. Os principais também entram na fala (treino-ilus.js). */
(function () {
  const U = {
    hibou25: 'https://canaltech.com.br/mercado/atendimento-pesa-mais-que-preco-na-hora-da-compra-em-2025-aponta-pesquisa/',
    hibou23: 'https://diariodocomercio.com.br/?p=357091',
    neogrid: 'https://timesbrasil.com.br/empresas-e-negocios/servicos-e-varejo/atendimento-ruim-faz-80-dos-consumidores-desistirem-da-compra-mostra-pesquisa/',
    linkedin: 'https://www.cnbc.com/2019/02/27/94percent-of-employees-would-stay-at-a-company-for-this-one-reason.html',
    bain: 'https://www.forrester.com/blogs/profiting-from-post-sale-marketing',
    pwc: 'https://www.pwc.com/cb/en/services/consulting/pdf/customer-experience-placemat.pdf',
    epsilon: 'https://epsilon.com/us/about-us/pressroom/new-epsilon-research-indicates-80-of-consumers-are-more-likely-to-make-a-purchase-when-brands-offer-personalized-experiences',
    qualtrics: 'https://www.qualtrics.com/news/feelings-are-number-one-driver-of-consumer-loyalty-qualtrics-research-finds/',
    rage: 'https://blog.hubspot.com/service/national-customer-rage-survey',
    zendesk: 'https://www.zendesk.com/blog/customer-service-statistics/',
    octadesk: 'https://mundodomarketing.com.br/whatsapp-e-o-canal-mais-usado-pelos-brasileiros-em-contatos-pos-compra',
    experian: 'https://www.litmus.com/blog/happy-birthday-now-buy-yourself-a-present-the-potential-of-birthday-emails'
  };
  const T = window.CA_TRILHA1; if (!T) return;
  T.porque = [
    { n: '97%', t: 'dos consumidores brasileiros consideram o atendimento um fator decisivo. Pela primeira vez, o atendimento pesou mais que o preço na escolha.', f: 'Hibou, Atendimento ao Cliente 2025 · 1.926 consumidores', u: U.hibou25 },
    { n: '80%', t: 'dos brasileiros já desistiram de uma compra por problema no atendimento.', f: 'Neogrid e Opinion Box, Consumo e Fidelização no Brasil · 2025', u: U.neogrid },
    { n: '58%', t: 'dos consumidores acham que as empresas não estão preparadas para atender bem. Quem treina a equipe sai na frente.', f: 'Hibou · out/2023 · mais de 2 mil brasileiros', u: U.hibou23 },
    { n: '94%', t: 'dos profissionais ficariam mais tempo numa empresa que investe no aprendizado deles.', f: 'LinkedIn, Workplace Learning Report 2019', u: U.linkedin }
  ];
  const P = {
    1: [
      { n: '54%', t: 'trocam de marca quando o atendimento não agrada, e 46% contam a experiência ruim para amigos e colegas.', f: 'Hibou · out/2023 · mais de 2 mil brasileiros', u: U.hibou23 },
      { n: '37%', t: 'dizem que nunca mais voltam a uma marca depois de uma experiência ruim.', f: 'Hibou, Atendimento ao Cliente 2025', u: U.hibou25 }
    ],
    2: [
      { n: '49%', t: 'dos consumidores da América Latina deixam uma marca de que gostam depois de uma única experiência ruim (32% no mundo).', f: 'PwC, Experience is everything', u: U.pwc },
      { n: '3,6 de 5', t: 'é a nota média que os brasileiros dão ao atendimento que recebem. Há muito espaço para quem faz bem feito.', f: 'Hibou, Atendimento ao Cliente 2025', u: U.hibou25 }
    ],
    3: [
      { n: '80%', t: 'têm mais chance de comprar de quem oferece um atendimento personalizado; 90% acham a personalização atraente.', f: 'Epsilon · 2018 · 1.000 consumidores', u: U.epsilon },
      { n: '86%', t: 'no setor automotivo preferem fazer negócio com quem personaliza o atendimento, mas só 55% acham que as empresas fazem isso bem.', f: 'Epsilon · 2018', u: U.epsilon }
    ],
    4: [
      { n: '61%', t: 'pagariam mais por um atendimento que conhece bem o produto; 54%, por eficiência e contato humano.', f: 'Hibou, Atendimento ao Cliente 2025', u: U.hibou25 },
      { n: '10,3x', t: 'é quanto mais um cliente encantado recomenda a loja, comparado a um cliente chateado. O sentimento pesa mais que tudo na fidelidade.', f: 'Qualtrics XM Institute · 2022 · 9.055 consumidores', u: U.qualtrics }
    ],
    5: [
      { n: '74%', t: 'dos consumidores tiveram algum problema com produto ou serviço no último ano, mas só 39% ficaram satisfeitos com a solução.', f: 'National Customer Rage Survey · 2023 (EUA)', u: U.rage },
      { n: '73%', t: 'trocam de empresa depois de mais de uma experiência ruim; mais da metade troca já na primeira.', f: 'Zendesk, dados de benchmark', u: U.zendesk }
    ],
    6: [
      { n: '54%', t: 'dos brasileiros usam o WhatsApp para falar com a empresa depois da compra: é o canal mais usado.', f: 'Octadesk e Opinion Box, CX Trends 2024', u: U.octadesk },
      { n: '~5 min', t: 'é o tempo de resposta que o consumidor espera no WhatsApp. Só 21% aceitam esperar até 10 minutos.', f: 'Octadesk e Opinion Box, CX Trends 2024', u: U.octadesk }
    ],
    7: [
      { n: '+481%', t: 'mais compras com mensagens de aniversário do que com uma promoção comum.', f: 'Experian, estudo sobre mensagens de aniversário', u: U.experian },
      { n: '84%', t: 'veem como vantagem receber ofertas com base no que já compraram.', f: 'Neogrid e Opinion Box · 2025', u: U.neogrid },
      { n: '75%', t: 'gastam mais com empresas que oferecem uma boa experiência.', f: 'Zendesk, dados de benchmark', u: U.zendesk }
    ]
  };
  // 1.28.3: uma pesquisa por lição (a primeira de cada lista, a mesma citada na fala); as outras ficam guardadas aqui como reserva.
  T.licoes.forEach(l => { l.pesquisas = (P[l.n] || []).slice(0, 1); });
})();
