/* Cliente Assistido – Pacotes por ramo.
   O núcleo do app é igual para todos. O ramo da loja (Mais → Minha loja) liga um pacote com:
   - item: dados extras do cliente (ex.: veículo);
   - venc: tipos de vencimento com prazo padrão e antecedência do aviso na tela Hoje;
   - modelos: campanhas prontas do ramo (5 mensagens cada).
   Placeholders aceitos nas mensagens: {nome}, {veiculo}, {loja} e, nos vencimentos, {vence} (ex.: "vence em 5 dias (20/11)"). */
'use strict';
(function () {
  const AUD = (o) => Object.assign({ groups: ['todos'], status: 'todos', compraDias: 0, semContatoDias: 0, niverMes: false }, o || {});

  window.CA_RAMOS = {
    auto_center: {
      nome: 'Auto center / oficina',
      item: {
        rotulo: 'Veículo', icone: '🚗', padrao: 'seu carro',
        campos: [
          { k: 'modelo', r: 'Modelo', ph: 'Ex.: Onix 1.0 2020' },
          { k: 'placa', r: 'Placa', ph: 'Ex.: ABC1D23' },
          { k: 'km', r: 'Km atual', ph: 'Ex.: 45000', num: true }
        ]
      },
      venc: [
        { k: 'oleo', r: 'Troca de óleo', ic: '🛢️', meses: 6, aviso: 10, km: 10000,
          msg: 'Oi, {nome}! Tudo bem? Aqui é da {loja}. 🚗\n\nPelo nosso controle, a troca de óleo do {veiculo} {vence}.\n\nQuer que eu reserve um horário para você? É rapidinho!' },
        { k: 'revisao', r: 'Revisão', ic: '🔧', meses: 12, aviso: 15, km: 10000,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nA revisão do {veiculo} {vence}. Revisão em dia evita surpresa na estrada e mantém o carro valorizado.\n\nPosso agendar para você?' },
        { k: 'alinhamento', r: 'Alinhamento e balanceamento', ic: '🛞', meses: 6, aviso: 10, km: 10000,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nJá está na hora do alinhamento e balanceamento do {veiculo} ({vence}). Isso poupa os pneus e deixa a direção mais firme.\n\nQuer agendar?' },
        { k: 'filtros', r: 'Filtros (ar e cabine)', ic: '🌬️', meses: 12, aviso: 10, km: 15000,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nA troca dos filtros de ar e de cabine do {veiculo} {vence}. Filtro limpo é motor respirando melhor e ar mais saudável dentro do carro.\n\nPosso separar para você?' },
        { k: 'freios', r: 'Freios', ic: '🛑', meses: 12, aviso: 15, km: 30000,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nA revisão dos freios do {veiculo} {vence}. Segurança em primeiro lugar!\n\nQuer marcar uma avaliação sem compromisso?' },
        { k: 'arcond', r: 'Higienização do ar-condicionado', ic: '❄️', meses: 12, aviso: 10,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nA higienização do ar-condicionado do {veiculo} {vence}. Ar limpo e sem cheiro ruim faz toda a diferença.\n\nQuer agendar?' },
        { k: 'bateria', r: 'Bateria', ic: '🔋', meses: 24, aviso: 20,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nA bateria do {veiculo} já está perto do fim da vida útil (prazo de troca: {vence}). Para não ficar na mão, vale fazer um teste gratuito.\n\nPassa aqui?' },
        { k: 'pneus', r: 'Pneus', ic: '⚫', meses: 24, aviso: 20, km: 40000,
          msg: 'Oi, {nome}! Aqui é da {loja}.\n\nOs pneus do {veiculo} estão chegando ao prazo de troca, que {vence}. Que tal uma avaliação gratuita do desgaste?' }
      ],
      modelos: [
        { key: 'auto-oleo', tipo: 'ramo', nome: 'Troca de óleo (vencendo ou vencida)', desc: 'Clientes com a troca de óleo vencendo em até 30 dias ou já vencida', aud: AUD({ venc: 'oleo' }), msgs: [
          'Oi, {nome}! Aqui é da {loja}. A troca de óleo do {veiculo} está chegando. Quer que eu reserve um horário?',
          'Olá, {nome}! Pelo nosso controle, está na hora da troca de óleo do {veiculo}. Posso agendar para você? 🛢️',
          'Oi, {nome}! Óleo em dia é motor protegido. A troca do {veiculo} está próxima: qual o melhor dia para você?',
          '{nome}, tudo bem? Passando para lembrar da troca de óleo do {veiculo}. É rapidinho e evita dor de cabeça!',
          'Oi, {nome}! Aqui é da {loja}. Vamos deixar o {veiculo} em dia? A troca de óleo já pode ser feita. Me chama aqui!'
        ] },
        { key: 'auto-viagem', tipo: 'ramo', nome: 'Revisão antes de viajar', desc: 'Para feriados e férias: check-up antes da estrada', aud: AUD(), msgs: [
          'Oi, {nome}! Vai pegar a estrada nos próximos dias? Faça um check-up do {veiculo} antes de viajar. Posso agendar?',
          'Olá, {nome}! Viagem tranquila começa na oficina: óleo, freios, pneus e luzes conferidos. Quer marcar um horário?',
          'Oi, {nome}! Antes das férias, que tal uma revisão rápida no {veiculo}? Segurança para você e sua família 🚗',
          '{nome}, aqui é da {loja}. Estamos com horários para check-up de viagem. Quer garantir o seu?',
          'Oi, {nome}! Pneu calibrado, freio revisado e óleo em dia: deixa a gente cuidar do {veiculo} antes da sua viagem.'
        ] },
        { key: 'auto-chuva', tipo: 'ramo', nome: 'Check-up de chuva', desc: 'Início do período de chuvas: palhetas, pneus e freios', aud: AUD(), msgs: [
          'Oi, {nome}! A chuva está chegando. Como estão as palhetas, os pneus e os freios do {veiculo}? Fazemos uma avaliação rápida!',
          'Olá, {nome}! Período de chuva pede atenção: pneu careca e palheta gasta são perigosos. Quer passar aqui para conferir?',
          'Oi, {nome}! Aqui é da {loja}. Check-up de chuva no {veiculo}: palhetas, pneus, freios e luzes. Posso agendar?',
          '{nome}, dirigir na chuva com o carro revisado é outra coisa. Quer marcar um horário?',
          'Oi, {nome}! Antes das chuvas, deixe o {veiculo} pronto. Avaliação rápida e sem compromisso!'
        ] },
        { key: 'auto-sumidos', tipo: 'ramo', nome: 'Clientes sumidos da oficina', desc: 'Sem contato há 6 meses ou mais', aud: AUD({ groups: ['sumidos', 'outros', 'novos'], semContatoDias: 180 }), msgs: [
          'Oi, {nome}! Faz tempo que o {veiculo} não passa por aqui. Está tudo certo com ele? Se precisar, conte com a gente!',
          'Olá, {nome}! Sentimos sua falta na {loja}. Quer fazer uma avaliação gratuita do {veiculo}?',
          'Oi, {nome}! Já faz um tempinho da última visita. Que tal conferir óleo, freios e pneus do {veiculo}?',
          '{nome}, aqui é da {loja}. Estamos com horários livres nesta semana. Quer aproveitar para cuidar do {veiculo}?',
          'Oi, {nome}! Passando para saber como está o {veiculo}. Se precisar de qualquer serviço, é só chamar aqui.'
        ] },
        { key: 'auto-posservico', tipo: 'ramo', nome: 'Pós-serviço: como ficou o carro?', desc: 'Quem fez serviço nos últimos 30 dias', aud: AUD({ compraDias: 30 }), msgs: [
          'Oi, {nome}! Como está o {veiculo} depois do serviço? Qualquer coisa, é só chamar aqui.',
          'Olá, {nome}! Passando para saber se ficou tudo certo com o {veiculo}. Sua opinião é muito importante pra gente!',
          'Oi, {nome}! Obrigado pela confiança na {loja}. O {veiculo} está rodando bem?',
          '{nome}, tudo certo com o carro? Se notar qualquer coisa diferente, fala com a gente que resolvemos.',
          'Oi, {nome}! Ficou satisfeito com o serviço no {veiculo}? Se puder, conta pra gente como foi 😊'
        ] }
      ]
    }
  };
  // Funcionalidades que o administrador pode ligar ou desligar por loja (Admin → Lojas → Editar).
  // Tudo vem ligado; a loja guarda só o que foi desligado (stores.recursos.off).
  window.CA_RECURSOS_GERAIS = [
    { k: 'niver', r: 'Aniversariantes (lista do dia e parabéns)' },
    { k: 'posvenda', r: 'Pós-venda (agradecimento e "como ficou?")' },
    { k: 'datas', r: 'Aviso de datas comerciais na tela Hoje' },
    { k: 'resposta', r: 'Painel "Alguém respondeu?"' },
    { k: 'google', r: 'Importar do Google Contatos' },
    { k: 'contrato_digital', r: 'Contrato digital: o dono aceita o contrato de licença no app (começa desligado)' },
    { k: 'treino', r: 'Treino de atendimento para a equipe (aba Treino; começa desligado)' }
  ];
  // Recursos do pacote de um ramo: ficha, modelos e cada tipo de vencimento
  // Funcionalidades que começam DESLIGADAS: a loja guarda o que o administrador ligou (stores.recursos.on).
  window.CA_RECURSOS_OPT_IN = ['venc_km', 'contrato_digital', 'treino'];
  window.CA_RECURSOS_RAMO = function (ramo) {
    const p = window.CA_RAMOS[ramo]; if (!p) return [];
    return [{ k: 'veiculo', r: `Ficha do ${p.item.rotulo.toLowerCase()} (${p.item.icone})` }, { k: 'modelos_ramo', r: 'Modelos de campanha do ramo' }]
      .concat((p.venc || []).map(t => ({ k: 'venc:' + t.k, r: `Vencimento: ${t.r}` })))
      .concat((p.venc || []).some(t => t.km) ? [{ k: 'venc_km', r: 'Vencimento por km estimado (começa desligado)' }] : []);
  };
  // Modelos do ramo entram na mesma lista dos modelos gerais, marcados com o ramo.
  if (window.CA_MODELOS) Object.entries(window.CA_RAMOS).forEach(([k, p]) => (p.modelos || []).forEach(m => window.CA_MODELOS.push(Object.assign({ ramo: k }, m))));
})();
